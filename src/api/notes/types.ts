import { OutputData } from '@editorjs/editorjs';

export interface Note {
    id: string;
    title: string;
    content: OutputData;
    created_at: string;
    updated_at: string;
    user_id?: string;
    is_public?: boolean;
}

export interface CreateNoteData {
    title: string;
    content: OutputData;
    is_public?: boolean;
}

export interface UpdateNoteData {
    title?: string;
    content?: OutputData;
    is_public?: boolean;
}

