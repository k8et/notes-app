'use client';

import { CustomButton } from '@/components/ui';
import { IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';
import type { Folder } from '@/api/folders';

interface FolderTreeProps {
    folders: Folder[];
    currentFolderId: string | null;
    onSelectFolder: (folder: Folder) => void;
    onSelectRoot: () => void;
    onRename: (folder: Folder) => void;
    onDelete: (folder: Folder) => void;
    onCreateSubfolder: (parentId: string) => void;
    onContextMenu?: (folder: Folder, e: React.MouseEvent) => void;
}

function buildTree(folders: Folder[], parentId: string | null): Folder[] {
    return folders.filter((f) => f.parent_id === parentId);
}

function FolderTreeNode({
    folder,
    allFolders,
    currentFolderId,
    level,
    onSelect,
    onRename,
    onDelete,
    onCreateSubfolder,
    onContextMenu,
}: {
    folder: Folder;
    allFolders: Folder[];
    currentFolderId: string | null;
    level: number;
    onSelect: (folder: Folder) => void;
    onRename: (folder: Folder) => void;
    onDelete: (folder: Folder) => void;
    onCreateSubfolder: (parentId: string) => void;
    onContextMenu?: (folder: Folder, e: React.MouseEvent) => void;
}) {
    const [expanded, setExpanded] = useState(true);
    const children = buildTree(allFolders, folder.id);
    const hasChildren = children.length > 0;
    const isSelected = currentFolderId === folder.id;

    return (
        <div style={{ marginLeft: level * 12 }}>
            <div
                className="flex items-center gap-1 group cursor-pointer rounded px-1 py-0.5 hover:bg-[var(--mantine-color-default-hover)]"
                style={{ minHeight: 28 }}
                onContextMenu={onContextMenu ? (e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(folder, e); } : undefined}
            >
                <span
                    className="w-4 shrink-0 flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) setExpanded((x) => !x);
                    }}
                >
                    {hasChildren ? (
                        expanded ? (
                            <IconChevronDown size={14} />
                        ) : (
                            <IconChevronRight size={14} />
                        )
                    ) : (
                        <span style={{ width: 14 }} />
                    )}
                </span>
                <div
                    className="flex-1 flex items-center gap-1 min-w-0"
                    onClick={() => onSelect(folder)}
                >
                    {isSelected ? (
                        <IconFolderOpen size={18} className="shrink-0 text-[var(--mantine-color-blue-6)]" />
                    ) : (
                        <IconFolder size={18} className="shrink-0" />
                    )}
                    <span className="truncate text-sm">{folder.name}</span>
                </div>
            </div>
            {expanded &&
                hasChildren &&
                children.map((child) => (
                    <FolderTreeNode
                        key={child.id}
                        folder={child}
                        allFolders={allFolders}
                        currentFolderId={currentFolderId}
                        level={level + 1}
                        onSelect={onSelect}
                        onRename={onRename}
                        onDelete={onDelete}
                        onCreateSubfolder={onCreateSubfolder}
                        onContextMenu={onContextMenu}
                    />
                ))}
        </div>
    );
}

export function FolderTree({
    folders,
    currentFolderId,
    onSelectFolder,
    onSelectRoot,
    onRename,
    onDelete,
    onCreateSubfolder,
    onContextMenu,
}: FolderTreeProps) {
    const rootFolders = buildTree(folders, null);

    return (
        <div className="flex flex-col gap-0.5">
            <CustomButton
                variant={!currentFolderId ? 'light' : 'subtle'}
                size="xs"
                fullWidth
                justify="flex-start"
                leftSection={<IconFolder size={16} />}
                onClick={onSelectRoot}
            >
                Этот компьютер
            </CustomButton>
            {rootFolders.map((folder) => (
                <FolderTreeNode
                    key={folder.id}
                    folder={folder}
                    allFolders={folders}
                    currentFolderId={currentFolderId}
                    level={0}
                    onSelect={onSelectFolder}
                    onRename={onRename}
                    onDelete={onDelete}
                    onCreateSubfolder={onCreateSubfolder}
                    onContextMenu={onContextMenu}
                />
            ))}
        </div>
    );
}
