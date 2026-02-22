'use client';

import { CustomButton, CustomGroup, CustomText, CustomStack, CustomTextInput } from '@/components/ui';
import { Modal } from '@mantine/core';
import type { Folder } from '@/api/folders';

interface NotesPageModalsProps {
  createFolderOpen: boolean;
  renameFolderOpen: boolean;
  deleteFolderOpen: boolean;
  deleteModalOpen: boolean;
  newFolderName: string;
  renameFolderName: string;
  folderToRename: Folder | null;
  folderToDelete: Folder | null;
  isMobile: boolean;
  onNewFolderNameChange: (v: string) => void;
  onRenameFolderNameChange: (v: string) => void;
  onCreateFolder: () => void;
  onRenameFolder: () => void;
  onDeleteFolder: () => void;
  onDeleteNote: () => void;
  onCloseCreate: () => void;
  onCloseRename: () => void;
  onCloseDeleteFolder: () => void;
  onCloseDeleteNote: () => void;
}

export function NotesPageModals({
  createFolderOpen,
  renameFolderOpen,
  deleteFolderOpen,
  deleteModalOpen,
  newFolderName,
  renameFolderName,
  folderToRename,
  folderToDelete,
  isMobile,
  onNewFolderNameChange,
  onRenameFolderNameChange,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onDeleteNote,
  onCloseCreate,
  onCloseRename,
  onCloseDeleteFolder,
  onCloseDeleteNote,
}: NotesPageModalsProps) {
  const modalProps = { centered: true, fullScreen: isMobile };

  return (
    <>
      <Modal opened={createFolderOpen} onClose={onCloseCreate} title="New folder" {...modalProps}>
        <CustomStack gap="md">
          <CustomTextInput placeholder="Folder name" value={newFolderName} onChange={(e) => onNewFolderNameChange(e.currentTarget.value)} onKeyDown={(e) => e.key === 'Enter' && onCreateFolder()} />
          <CustomGroup justify="flex-end">
            <CustomButton variant="subtle" onClick={onCloseCreate}>Cancel</CustomButton>
            <CustomButton onClick={onCreateFolder} disabled={!newFolderName.trim()}>Create</CustomButton>
          </CustomGroup>
        </CustomStack>
      </Modal>

      <Modal opened={renameFolderOpen} onClose={onCloseRename} title="Rename folder" {...modalProps}>
        <CustomStack gap="md">
          <CustomTextInput placeholder="Folder name" value={renameFolderName} onChange={(e) => onRenameFolderNameChange(e.currentTarget.value)} onKeyDown={(e) => e.key === 'Enter' && onRenameFolder()} />
          <CustomGroup justify="flex-end">
            <CustomButton variant="subtle" onClick={onCloseRename}>Cancel</CustomButton>
            <CustomButton onClick={onRenameFolder} disabled={!renameFolderName.trim()}>Save</CustomButton>
          </CustomGroup>
        </CustomStack>
      </Modal>

      <Modal opened={deleteFolderOpen} onClose={onCloseDeleteFolder} title="Delete folder" {...modalProps}>
        <CustomText mb="md">Delete folder &quot;{folderToDelete?.name}&quot;?</CustomText>
        <CustomGroup justify="flex-end">
          <CustomButton variant="subtle" onClick={onCloseDeleteFolder}>Cancel</CustomButton>
          <CustomButton color="red" onClick={onDeleteFolder}>Delete</CustomButton>
        </CustomGroup>
      </Modal>

      <Modal opened={deleteModalOpen} onClose={onCloseDeleteNote} title="Delete note" {...modalProps}>
        <CustomText mb="md">Are you sure you want to delete this note? This action cannot be undone.</CustomText>
        <CustomGroup justify="flex-end">
          <CustomButton variant="subtle" onClick={onCloseDeleteNote}>Cancel</CustomButton>
          <CustomButton color="red" onClick={onDeleteNote}>Delete</CustomButton>
        </CustomGroup>
      </Modal>
    </>
  );
}
