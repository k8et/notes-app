import { OutputData } from '@editorjs/editorjs';

export interface NoteListItem {
    id: string;
    title: string;
    updated_at: string;
    is_public?: boolean;
    folder_id?: string | null;
}

export interface Note {
    id: string;
    title: string;
    content: OutputData;
    created_at: string;
    updated_at: string;
    user_id?: string;
    is_public?: boolean;
    folder_id?: string | null;
}

export interface CreateNoteData {
    title: string;
    content: OutputData;
    is_public?: boolean;
    folder_id?: string | null;
}

export interface UpdateNoteData {
    title?: string;
    content?: OutputData;
    is_public?: boolean;
    folder_id?: string | null;
}

