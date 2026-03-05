import { supabase } from '@/lib/supabase';
import { FILES_TABLE, STORAGE_BUCKET } from './constants';
import type { FileItem } from './types';

export async function getFiles(folderId?: string | null): Promise<FileItem[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        let query = supabase
            .from(FILES_TABLE)
            .select('*')
            .eq('user_id', user.id)
            .order('name', { ascending: true });

        if (folderId === undefined) {
        } else if (folderId === null) {
            query = query.is('folder_id', null);
        } else {
            query = query.eq('folder_id', folderId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching files:', error);
            return [];
        }
        return data || [];
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}

export async function getFile(id: string): Promise<FileItem | null> {
    try {
        const { data, error } = await supabase
            .from(FILES_TABLE)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching file:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error fetching file:', error);
        return null;
    }
}

export async function createTextFile(name: string, content: string, folderId?: string | null): Promise<FileItem | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from(FILES_TABLE)
            .insert({
                name: name.trim() || 'Untitled.txt',
                type: 'text',
                folder_id: folderId ?? null,
                user_id: user.id,
                content: content || '',
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating text file:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error creating text file:', error);
        return null;
    }
}

export async function updateFile(id: string, updates: { name?: string; content?: string; folder_id?: string | null }): Promise<FileItem | null> {
    try {
        const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) payload.name = updates.name.trim();
        if (updates.content !== undefined) payload.content = updates.content;
        if (updates.folder_id !== undefined) payload.folder_id = updates.folder_id;

        const { data, error } = await supabase
            .from(FILES_TABLE)
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating file:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error updating file:', error);
        return null;
    }
}

export async function uploadFile(file: File, folderId?: string | null): Promise<FileItem | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const fileExt = file.name.includes('.') ? file.name.split('.').pop()! : '';
        const safeName = `${crypto.randomUUID()}.${fileExt}`;
        const storagePath = `${user.id}/${safeName}`;

        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, file, { upsert: false });

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return null;
        }

        const { data, error } = await supabase
            .from(FILES_TABLE)
            .insert({
                name: file.name,
                type: 'upload',
                folder_id: folderId ?? null,
                user_id: user.id,
                storage_path: storagePath,
                mime_type: file.type || null,
                size: file.size,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating file record:', error);
            await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}

export async function updateUploadedFileContent(storagePath: string, content: string): Promise<boolean> {
    try {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, blob, { upsert: true });

        if (uploadError) {
            console.error('Error updating file content:', uploadError);
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export async function getFileContentAsText(storagePath: string): Promise<string | null> {
    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .download(storagePath);

        if (error || !data) return null;
        return await data.text();
    } catch {
        return null;
    }
}

export async function getSignedDownloadUrl(storagePath: string): Promise<string | null> {
    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(storagePath, 3600);

        if (error) {
            console.error('Error creating signed URL:', error);
            return null;
        }
        return data.signedUrl;
    } catch (error) {
        console.error('Error creating signed URL:', error);
        return null;
    }
}

export async function deleteFile(id: string): Promise<boolean> {
    try {
        const file = await getFile(id);
        if (!file) return false;

        if (file.type === 'upload' && file.storage_path) {
            await supabase.storage.from(STORAGE_BUCKET).remove([file.storage_path]);
        }

        const { error } = await supabase
            .from(FILES_TABLE)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting file:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
}
