-- Add is_public column to notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create index on is_public for faster queries
CREATE INDEX IF NOT EXISTS notes_is_public_idx ON notes(is_public) WHERE is_public = true;

-- Update RLS policies to allow public notes to be viewed by anyone
-- Drop existing select policy
DROP POLICY IF EXISTS "Users can read their own notes" ON notes;

-- Create new policy that allows users to read their own notes OR public notes
CREATE POLICY "Users can read their own notes or public notes"
    ON notes FOR SELECT
    USING (
        auth.uid() = user_id OR is_public = true
    );

-- Policy for anonymous users to read public notes
CREATE POLICY "Anyone can read public notes"
    ON notes FOR SELECT
    USING (is_public = true);

