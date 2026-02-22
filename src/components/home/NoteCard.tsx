'use client';

import { CustomPaper, CustomText, CustomStack, CustomGroup, CustomActionIcon } from '@/components/ui';
import { IconTrash, IconFolder } from '@tabler/icons-react';
import { Menu } from '@mantine/core';
import { formatDate } from '@/utils/date';
import type { NoteListItem } from '@/api/notes';
import type { Folder } from '@/api/folders';

interface NoteCardProps {
  note: NoteListItem;
  folders: Folder[];
  onSelect: (id: string) => void;
  onMoveToFolder: (noteId: string, folderId: string | null) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export function NoteCard({ note, folders, onSelect, onMoveToFolder, onDelete }: NoteCardProps) {
  const folderName = note.folder_id ? folders.find((f) => f.id === note.folder_id)?.name : null;

  return (
    <CustomPaper p="md" shadow="xs" withBorder className="hover:shadow-md transition-shadow">
      <CustomGroup justify="space-between" align="flex-start">
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => onSelect(note.id)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <CustomText fw={500} size="md" lineClamp={1}>{note.title || 'Untitled'}</CustomText>
            {folderName && <CustomText size="xs" c="dimmed" fw={500}>{folderName}</CustomText>}
            {note.is_public && <CustomText size="xs" c="blue" fw={500}>Public</CustomText>}
          </div>
          <CustomText size="sm" c="dimmed">{formatDate(note.updated_at)}</CustomText>
        </div>
        <CustomGroup gap="xs">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <CustomActionIcon variant="subtle" aria-label="Move to folder">
                  <IconFolder size={16} />
                </CustomActionIcon>
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              {folders.map((folder) => (
                <Menu.Item key={folder.id} onClick={() => onMoveToFolder(note.id, folder.id)}>
                  {folder.name}
                </Menu.Item>
              ))}
              {folders.length === 0 && <Menu.Label>No folders</Menu.Label>}
            </Menu.Dropdown>
          </Menu>
          <div onClick={(e: React.MouseEvent) => onDelete(e, note.id)}>
            <CustomActionIcon variant="subtle" color="red" aria-label="Delete note">
              <IconTrash size={16} />
            </CustomActionIcon>
          </div>
        </CustomGroup>
      </CustomGroup>
    </CustomPaper>
  );
}
