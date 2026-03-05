DROP TABLE IF EXISTS notes CASCADE;

ALTER TABLE folders ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES folders(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS folders_parent_id_idx ON folders(parent_id);

CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text',
    folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    storage_path TEXT,
    mime_type TEXT,
    size BIGINT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT files_type_check CHECK (type IN ('text', 'upload'))
);

CREATE INDEX IF NOT EXISTS files_folder_id_idx ON files(folder_id);
CREATE INDEX IF NOT EXISTS files_user_id_idx ON files(user_id);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own files"
    ON files FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', false) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

CREATE POLICY "Users can upload their own files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read their own files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);
