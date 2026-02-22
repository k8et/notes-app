import { supabase } from '@/lib/supabase';
import { NOTES_TABLE } from './constants';
import { Note, NoteListItem, CreateNoteData, UpdateNoteData } from './types';

export async function getNotesList(folderId?: string | null): Promise<NoteListItem[]> {
    try {
        let query = supabase
            .from(NOTES_TABLE)
            .select('id, title, updated_at, is_public, folder_id')
            .order('updated_at', { ascending: false });

        if (folderId === undefined) {
        } else if (folderId === null) {
            query = query.is('folder_id', null);
        } else {
            query = query.eq('folder_id', folderId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching notes list:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching notes list:', error);
        return [];
    }
}

export async function getNote(id: string): Promise<Note | null> {
    try {
        const { data, error } = await supabase
            .from(NOTES_TABLE)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching note:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching note:', error);
        return null;
    }
}

export async function getPublicNote(id: string): Promise<Note | null> {
    try {
        const { data, error } = await supabase
            .from(NOTES_TABLE)
            .select('*')
            .eq('id', id)
            .eq('is_public', true)
            .single();

        if (error) {
            console.error('Error fetching public note:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching public note:', error);
        return null;
    }
}

export async function createNote(noteData: CreateNoteData): Promise<Note | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('User not authenticated');
            return null;
        }

        const { data, error } = await supabase
            .from(NOTES_TABLE)
            .insert({
                title: noteData.title,
                content: noteData.content,
                user_id: user.id,
                ...(noteData.is_public !== undefined && { is_public: noteData.is_public }),
                ...(noteData.folder_id !== undefined && { folder_id: noteData.folder_id }),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating note:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error creating note:', error);
        return null;
    }
}

export async function updateNote(id: string, noteData: UpdateNoteData): Promise<Note | null> {
    try {
        const { data, error } = await supabase
            .from(NOTES_TABLE)
            .update({
                ...noteData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating note:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error updating note:', error);
        return null;
    }
}

export async function deleteNote(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from(NOTES_TABLE)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting note:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting note:', error);
        return false;
    }
}

