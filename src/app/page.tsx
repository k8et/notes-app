'use client';

import { Suspense } from 'react';
import { CustomButton, CustomGroup, CustomTitle, ThemeToggle, CustomPaper, CustomStack } from '@/components/ui';
import { useMediaQuery } from '@mantine/hooks';
import { Skeleton, Drawer } from '@mantine/core';
import { IconPlus, IconMenu2 } from '@tabler/icons-react';
import { FoldersSidebar, NoteCard, NotesPageModals } from '@/components/home';
import { useNotesPage } from '@/hooks/useNotesPage';

function HomeContent() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const { notes, folders, selectedFolderId, notesLoading, foldersLoading, foldersDrawerOpen,
    createFolderOpen, renameFolderOpen, deleteFolderOpen, deleteModalOpen,
    newFolderName, renameFolderName, folderToRename, folderToDelete,
    setSelectedFolder, setNewFolderName, setRenameFolderName, setFoldersDrawerOpen, setCreateFolderOpen,
    handleCreateFolder, handleRenameFolder, handleDeleteFolder, handleMoveToFolder,
    handleNewNote, handleNoteClick, handleDeleteNote, confirmDelete,
    openRename, openDeleteFolder, closeCreateFolder, closeRenameFolder, closeDeleteFolder, closeDeleteNote,
    signOut, ALL_FOLDER,
  } = useNotesPage();

  return (
    <div className="min-h-screen p-3 sm:p-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="hidden md:block w-52 flex-shrink-0">
          <FoldersSidebar
            folders={folders}
            foldersLoading={foldersLoading}
            selectedFolderId={selectedFolderId}
            allFolderId={ALL_FOLDER}
            onSelectFolder={setSelectedFolder}
            onCreateFolder={() => setCreateFolderOpen(true)}
            onRename={openRename}
            onDelete={openDeleteFolder}
          />
        </div>

        <div className="flex-1 min-w-0">
          <CustomGroup justify="space-between" gap="sm" wrap="wrap" mb="md">
            <CustomGroup gap="sm" align="center" wrap="wrap">
              <div className="md:hidden shrink-0">
                <CustomButton variant="subtle" size="sm" leftSection={<IconMenu2 size={18} />} onClick={() => setFoldersDrawerOpen(true)}>
                  Folders
                </CustomButton>
              </div>
              <CustomTitle order={1} style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>Notepad</CustomTitle>
            </CustomGroup>
            <CustomGroup gap="sm" wrap="wrap">
              <CustomButton leftSection={<IconPlus size={16} />} onClick={handleNewNote} size="sm">New Note</CustomButton>
              <CustomButton variant="subtle" onClick={signOut} size="sm">Sign Out</CustomButton>
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
              <p className="text-gray-500 dark:text-gray-400 mb-4">No notes yet. Create your first note!</p>
              <CustomButton onClick={handleNewNote}>New Note</CustomButton>
            </div>
          ) : (
            <CustomStack gap="sm">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  folders={folders}
                  onSelect={handleNoteClick}
                  onMoveToFolder={handleMoveToFolder}
                  onDelete={handleDeleteNote}
                />
              ))}
            </CustomStack>
          )}
        </div>
      </div>

      <Drawer opened={foldersDrawerOpen} onClose={() => setFoldersDrawerOpen(false)} title="Folders" position="left" size="xs">
        <FoldersSidebar
          folders={folders}
          foldersLoading={foldersLoading}
          selectedFolderId={selectedFolderId}
          allFolderId={ALL_FOLDER}
          onSelectFolder={setSelectedFolder}
          onCreateFolder={() => setCreateFolderOpen(true)}
          onRename={openRename}
          onDelete={openDeleteFolder}
        />
      </Drawer>

      <NotesPageModals
        createFolderOpen={createFolderOpen}
        renameFolderOpen={renameFolderOpen}
        deleteFolderOpen={deleteFolderOpen}
        deleteModalOpen={deleteModalOpen}
        newFolderName={newFolderName}
        renameFolderName={renameFolderName}
        folderToRename={folderToRename}
        folderToDelete={folderToDelete}
        isMobile={isMobile}
        onNewFolderNameChange={setNewFolderName}
        onRenameFolderNameChange={setRenameFolderName}
        onCreateFolder={handleCreateFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        onDeleteNote={confirmDelete}
        onCloseCreate={closeCreateFolder}
        onCloseRename={closeRenameFolder}
        onCloseDeleteFolder={closeDeleteFolder}
        onCloseDeleteNote={closeDeleteNote}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-3 sm:p-4">
        <div className="max-w-5xl mx-auto">
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
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
