'use client';

import { CustomButton, CustomText, CustomStack, CustomActionIcon } from '@/components/ui';
import { IconFolder, IconFolderPlus, IconDots, IconPencil, IconTrash } from '@tabler/icons-react';
import { Menu } from '@mantine/core';
import type { Folder } from '@/api/folders';

interface FoldersSidebarProps {
  folders: Folder[];
  foldersLoading: boolean;
  selectedFolderId: string;
  allFolderId: string;
  onSelectFolder: (id: string) => void;
  onCreateFolder: () => void;
  onRename: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  onCloseDrawer?: () => void;
}

export function FoldersSidebar({
  folders,
  foldersLoading,
  selectedFolderId,
  allFolderId,
  onSelectFolder,
  onCreateFolder,
  onRename,
  onDelete,
}: FoldersSidebarProps) {
  return (
    <CustomStack gap="xs" mb="xl">
      <CustomText size="sm" fw={600} c="dimmed">Folders</CustomText>
      <CustomButton variant="subtle" size="xs" fullWidth justify="flex-start" leftSection={<IconFolderPlus size={14} />} onClick={onCreateFolder}>
        New folder
      </CustomButton>
      {!foldersLoading && (
        <>
          <CustomButton
            variant={selectedFolderId === allFolderId ? 'light' : 'subtle'}
            size="xs"
            fullWidth
            justify="flex-start"
            leftSection={<IconFolder size={14} />}
            onClick={() => onSelectFolder(allFolderId)}
          >
            All
          </CustomButton>
          {folders.map((folder) => (
            <CustomButton
              key={folder.id}
              variant={selectedFolderId === folder.id ? 'light' : 'subtle'}
              size="xs"
              fullWidth
              justify="space-between"
              styles={{ label: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' } }}
              leftSection={<IconFolder size={14} />}
              rightSection={
                <Menu shadow="md" width={120}>
                  <Menu.Target>
                    <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      <CustomActionIcon variant="subtle" size="xs" aria-label="Folder actions">
                        <IconDots size={14} />
                      </CustomActionIcon>
                    </div>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconPencil size={14} />} onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRename(folder); }}>
                      Rename
                    </Menu.Item>
                    <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete(folder); }}>
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              }
              onClick={() => onSelectFolder(folder.id)}
            >
              {folder.name}
            </CustomButton>
          ))}
        </>
      )}
    </CustomStack>
  );
}
