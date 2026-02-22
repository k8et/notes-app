import { supabase } from '@/lib/supabase';
import { FOLDERS_TABLE } from './constants';
import { Folder } from './types';

export async function getFolders(): Promise<Folder[]> {
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

export async function createFolder(name: string): Promise<Folder | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from(FOLDERS_TABLE)
            .insert({ name: name.trim(), user_id: user.id })
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

export async function updateFolder(id: string, name: string): Promise<Folder | null> {
    try {
        const { data, error } = await supabase
            .from(FOLDERS_TABLE)
            .update({ name: name.trim() })
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
