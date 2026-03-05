export type FileType = 'text' | 'upload';

export interface FileItem {
    id: string;
    name: string;
    type: FileType;
    folder_id: string | null;
    user_id: string;
    content: string | null;
    storage_path: string | null;
    mime_type: string | null;
    size: number | null;
    created_at: string;
    updated_at: string;
}
