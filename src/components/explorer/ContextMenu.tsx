'use client';

import { Menu } from '@mantine/core';
import {
    IconFolder,
    IconFolderPlus,
    IconFileText,
    IconUpload,
    IconPencil,
    IconTrash,
    IconFile,
    IconDownload,
} from '@tabler/icons-react';
import type { Folder } from '@/api/folders';
import type { FileItem } from '@/api/files';

export type ContextMenuTarget = 
    | { type: 'empty' }
    | { type: 'folder'; folder: Folder }
    | { type: 'file'; file: FileItem };

interface ContextMenuProps {
    x: number;
    y: number;
    target: ContextMenuTarget | null;
    onClose: () => void;
    onNewFolder: () => void;
    onNewDoc: () => void;
    onUpload: () => void;
    onOpenFolder: (folder: Folder) => void;
    onOpenFile: (file: FileItem) => void;
    onRenameFolder: (folder: Folder) => void;
    onRenameFile: (file: FileItem) => void;
    onDeleteFolder: (folder: Folder) => void;
    onDeleteFile: (file: FileItem) => void;
    onDownloadFile: (file: FileItem) => void;
    onCreateSubfolder: (folder: Folder) => void;
}

export function ContextMenu({
    x,
    y,
    target,
    onClose,
    onNewFolder,
    onNewDoc,
    onUpload,
    onOpenFolder,
    onOpenFile,
    onRenameFolder,
    onRenameFile,
    onDeleteFolder,
    onDeleteFile,
    onDownloadFile,
    onCreateSubfolder,
}: ContextMenuProps) {
    if (!target) return null;

    const handleClose = () => {
        onClose();
    };

    return (
        <Menu
            opened={!!target}
            onClose={handleClose}
            position="bottom-start"
            shadow="md"
            width={220}
            withinPortal
            closeOnClickOutside
            closeOnEscape
        >
            <Menu.Target>
                <div
                    style={{
                        position: 'fixed',
                        left: x,
                        top: y,
                        width: 1,
                        height: 1,
                        zIndex: 9998,
                    }}
                />
            </Menu.Target>
            <Menu.Dropdown>
                {target.type === 'empty' && (
                    <>
                        <Menu.Item leftSection={<IconFolderPlus size={16} />} onClick={() => { onNewFolder(); handleClose(); }}>
                            Создать папку
                        </Menu.Item>
                        <Menu.Item leftSection={<IconFileText size={16} />} onClick={() => { onNewDoc(); handleClose(); }}>
                            Создать текстовый документ
                        </Menu.Item>
                        <Menu.Item leftSection={<IconUpload size={16} />} onClick={() => { onUpload(); handleClose(); }}>
                            Загрузить файлы
                        </Menu.Item>
                    </>
                )}
                {target.type === 'folder' && (
                    <>
                        <Menu.Item leftSection={<IconFolder size={16} />} onClick={() => { onOpenFolder(target.folder); handleClose(); }}>
                            Открыть
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<IconFolderPlus size={16} />} onClick={() => { onCreateSubfolder(target.folder); handleClose(); }}>
                            Новая папка
                        </Menu.Item>
                        <Menu.Item leftSection={<IconFileText size={16} />} onClick={() => { onNewDoc(); handleClose(); }}>
                            Создать текстовый документ
                        </Menu.Item>
                        <Menu.Item leftSection={<IconUpload size={16} />} onClick={() => { onUpload(); handleClose(); }}>
                            Загрузить файлы
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => { onRenameFolder(target.folder); handleClose(); }}>
                            Переименовать
                        </Menu.Item>
                        <Menu.Item leftSection={<IconTrash size={16} />} color="red" onClick={() => { onDeleteFolder(target.folder); handleClose(); }}>
                            Удалить
                        </Menu.Item>
                    </>
                )}
                {target.type === 'file' && (
                    <>
                        <Menu.Item leftSection={<IconFile size={16} />} onClick={() => { onOpenFile(target.file); handleClose(); }}>
                            Открыть
                        </Menu.Item>
                        <Menu.Item leftSection={<IconDownload size={16} />} onClick={() => { onDownloadFile(target.file); handleClose(); }}>
                            Скачать
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => { onRenameFile(target.file); handleClose(); }}>
                            Переименовать
                        </Menu.Item>
                        <Menu.Item leftSection={<IconTrash size={16} />} color="red" onClick={() => { onDeleteFile(target.file); handleClose(); }}>
                            Удалить
                        </Menu.Item>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
