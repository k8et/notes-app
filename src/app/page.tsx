'use client';

import { CustomButton, CustomGroup, CustomTitle, ThemeToggle, CustomPaper, CustomText, CustomStack, CustomActionIcon } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getNotes, deleteNote, type Note } from '@/api/notes';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { formatDate } from '@/utils/date';
import { Skeleton, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export default function Home() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);



  const loadNotes = async () => {
    setNotesLoading(true);
    const notesList = await getNotes();
    setNotes(notesList);
    setNotesLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleNewNote = () => {
    router.push(`/notes/new`);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNoteClick = (id: string) => {
    router.push(`/notes/${id}`);
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNoteToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (noteToDelete) {
      const success = await deleteNote(noteToDelete);
      if (success) {
        setNotes(notes.filter(note => note.id !== noteToDelete));
        notifications.show({
          title: 'Note deleted',
          message: 'The note has been successfully deleted.',
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete the note.',
          color: 'red',
        });
      }
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <CustomGroup justify="space-between" mb="xl">
          <CustomTitle order={1}>Notepad</CustomTitle>
          <CustomGroup gap="md">
            <CustomButton leftSection={<IconPlus size={16} />} onClick={handleNewNote}>
              New Note
            </CustomButton>
            <CustomButton variant="subtle" onClick={handleSignOut}>
              Sign Out
            </CustomButton>
            <ThemeToggle />
          </CustomGroup>
        </CustomGroup>

        {notesLoading ? (
          <CustomStack gap="sm">
            {[1, 2, 3, 4, 5].map((i) => (
              <CustomPaper key={i} p="md" shadow="xs" withBorder>
                <CustomStack gap="xs">
                  <Skeleton height={20} width="60%" radius="sm" />
                  <Skeleton height={16} width="30%" radius="sm" />
                </CustomStack>
              </CustomPaper>
            ))}
          </CustomStack>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No notes yet. Create your first note!
            </p>
            <CustomButton onClick={handleNewNote}>
              New Note
            </CustomButton>
          </div>
        ) : (
          <CustomStack gap="sm">
            {notes.map((note) => (
              <CustomPaper
                key={note.id}
                p="md"
                shadow="xs"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => handleNoteClick(note.id)}
                className="hover:shadow-md transition-shadow"
              >
                <CustomGroup justify="space-between" align="flex-start">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <CustomText fw={500} size="md" lineClamp={1}>
                        {note.title || 'Untitled'}
                      </CustomText>
                      {note.is_public && (
                        <CustomText size="xs" c="blue" fw={500}>
                          Public
                        </CustomText>
                      )}
                    </div>
                    <CustomText size="sm" c="dimmed">
                      {formatDate(note.updated_at)}
                    </CustomText>
                  </div>
                  <div onClick={(e: React.MouseEvent) => handleDeleteNote(e, note.id)}>
                    <CustomActionIcon
                      variant="subtle"
                      color="red"
                      aria-label="Delete note"
                    >
                      <IconTrash size={16} />
                    </CustomActionIcon>
                  </div>
                </CustomGroup>
              </CustomPaper>
            ))}
          </CustomStack>
        )}
      </div>

      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
        title="Delete note"
        centered
      >
        <CustomText mb="md">
          Are you sure you want to delete this note? This action cannot be undone.
        </CustomText>
        <CustomGroup justify="flex-end">
          <CustomButton
            variant="subtle"
            onClick={() => {
              setDeleteModalOpen(false);
              setNoteToDelete(null);
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton color="red" onClick={confirmDelete}>
            Delete
          </CustomButton>
        </CustomGroup>
      </Modal>
    </div>
  );
}
