import { supabase } from '@/lib/supabase';
import { FOLDERS_TABLE } from './constants';
import { Folder } from './types';

export async function getFolders(parentId?: string | null): Promise<Folder[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        let query = supabase
            .from(FOLDERS_TABLE)
            .select('*')
            .eq('user_id', user.id)
            .order('name', { ascending: true });

        if (parentId === undefined) {
        } else if (parentId === null) {
            query = query.is('parent_id', null);
        } else {
            query = query.eq('parent_id', parentId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching folders:', error);
            return [];
        }
        return data || [];
    } catch (error) {
        console.error('Error fetching folders:', error);
        return [];
    }
}

export async function getAllFolders(): Promise<Folder[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from(FOLDERS_TABLE)
            .select('*')
            .eq('user_id', user.id)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching folders:', error);
            return [];
        }
        return data || [];
    } catch (error) {
        console.error('Error fetching folders:', error);
        return [];
    }
}

export async function createFolder(name: string, parentId?: string | null): Promise<Folder | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from(FOLDERS_TABLE)
            .insert({
                name: name.trim(),
                user_id: user.id,
                parent_id: parentId ?? null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating folder:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error creating folder:', error);
        return null;
    }
}

export async function updateFolder(id: string, updates: { name?: string; parent_id?: string | null }): Promise<Folder | null> {
    try {
        const payload: Record<string, unknown> = {};
        if (updates.name !== undefined) payload.name = updates.name.trim();
        if (updates.parent_id !== undefined) payload.parent_id = updates.parent_id;

        const { data, error } = await supabase
            .from(FOLDERS_TABLE)
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating folder:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error updating folder:', error);
        return null;
    }
}

export async function deleteFolder(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from(FOLDERS_TABLE)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting folder:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error deleting folder:', error);
        return false;
    }
}
