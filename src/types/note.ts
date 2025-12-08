import { OutputData } from '@editorjs/editorjs';

export interface Note {
    id: string;
    title: string;
    content: OutputData;
    createdAt: Date;
    updatedAt: Date;
}

export type NoteFormData = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

