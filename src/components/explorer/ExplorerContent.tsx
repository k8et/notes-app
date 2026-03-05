'use client';

import { useState } from 'react';
import { CustomButton, CustomGroup, CustomText, CustomPaper } from '@/components/ui';
import {
    IconFolder,
    IconFileText,
    IconUpload,
    IconFile,
    IconArrowLeft,
} from '@tabler/icons-react';
import { Skeleton } from '@mantine/core';
import type { Folder } from '@/api/folders';
import type { FileItem } from '@/api/files';
import { ContextMenu, type ContextMenuTarget } from './ContextMenu';

interface ExplorerContentProps {
    folders: Folder[];
    files: FileItem[];
    contextMenu: { x: number; y: number; target: ContextMenuTarget } | null;
    setContextMenu: (menu: { x: number; y: number; target: ContextMenuTarget } | null) => void;
    currentFolderId: string | null;
    pathFolders: Folder[];
    canNavigateUp: boolean;
    loading: boolean;
    uploading: boolean;
    onFolderClick: (folder: Folder) => void;
    onFileClick: (file: FileItem) => void;
    onNavigateToFolder: (folder: Folder) => void;
    onNavigateUp: () => void;
    onNavigateRoot: () => void;
    onRenameFolder: (folder: Folder) => void;
    onDeleteFolder: (folder: Folder) => void;
    onRenameFile: (file: FileItem) => void;
    onDeleteFile: (file: FileItem) => void;
    onDownloadFile: (file: FileItem) => void;
    onNewFolder: () => void;
    onNewDoc: () => void;
    onUpload: () => void;
    onDropFiles: (files: File[]) => void;
    onCreateSubfolder: (folder: Folder) => void;
}

function handleContextMenu(
    e: React.MouseEvent,
    target: ContextMenuTarget,
    setContextMenu: (menu: { x: number; y: number; target: ContextMenuTarget } | null) => void
) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, target });
}

function getFileIcon(file: { type: string; name: string }) {
    if (file.type === 'text' || /\.(txt|md|markdown)$/i.test(file.name)) {
        return <IconFileText size={40} className="text-[var(--mantine-color-blue-6)]" />;
    }
    return <IconFile size={40} className="text-[var(--mantine-color-gray-6)]" />;
}

export function ExplorerContent({
    folders,
    files,
    currentFolderId,
    pathFolders,
    canNavigateUp,
    loading,
    uploading,
    onFolderClick,
    onFileClick,
    onNavigateToFolder,
    onNavigateUp,
    onNavigateRoot,
    onRenameFolder,
    onDeleteFolder,
    onRenameFile,
    onDeleteFile,
    onDownloadFile,
    onNewFolder,
    onNewDoc,
    onUpload,
    onDropFiles,
    onCreateSubfolder,
    contextMenu,
    setContextMenu,
}: ExplorerContentProps) {
    const [isDragging, setIsDragging] = useState(false);
    const currentFolders = folders.filter((f) => f.parent_id === currentFolderId);
    const currentFiles = files;

    const handleContextMenuFn = (e: React.MouseEvent, target: ContextMenuTarget) => handleContextMenu(e, target, setContextMenu);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files || []).filter((f) => f.size > 0 || f.name);
        if (files.length) onDropFiles(files);
    };

    if (loading) {
        return (
            <CustomPaper p="lg" withBorder>
                <CustomGroup gap="md" mb="lg">
                    <Skeleton height={28} width={200} />
                    <Skeleton height={28} width={120} />
                </CustomGroup>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} height={80} radius="sm" />
                    ))}
                </div>
            </CustomPaper>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <CustomGroup gap="sm" wrap="wrap">
                <CustomButton variant="subtle" size="xs" leftSection={<IconArrowLeft size={14} />} onClick={onNavigateUp} disabled={!canNavigateUp}>
                    Вверх
                </CustomButton>
                <div className="flex items-center gap-1 flex-wrap">
                    <CustomButton variant="subtle" size="xs" onClick={onNavigateRoot}>
                        Этот компьютер
                    </CustomButton>
                    {pathFolders.map((f) => (
                        <span key={f.id} className="flex items-center gap-1">
                            <span className="text-gray-400">/</span>
                            <CustomButton variant="subtle" size="xs" onClick={() => onNavigateToFolder(f)}>
                                {f.name}
                            </CustomButton>
                        </span>
                    ))}
                </div>
            </CustomGroup>

            <CustomGroup gap="xs" mb="sm">
                <CustomButton size="xs" leftSection={<IconFolder size={14} />} onClick={onNewFolder}>
                    Новая папка
                </CustomButton>
                <CustomButton size="xs" leftSection={<IconFileText size={14} />} onClick={onNewDoc}>
                    Текстовый документ
                </CustomButton>
                <CustomButton
                    size="xs"
                    leftSection={<IconUpload size={14} />}
                    onClick={onUpload}
                    loading={uploading}
                >
                    Загрузить файл
                </CustomButton>
            </CustomGroup>

            <CustomPaper
                p="md"
                withBorder
                className={`relative transition-colors h-fit ${isDragging ? 'ring-2 ring-[var(--mantine-color-blue-6)] bg-[var(--mantine-color-blue-light)]' : ''}`}
            >
                {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none rounded">
                        <CustomText fw={500} size="lg" c="blue">Отпустите для загрузки</CustomText>
                    </div>
                )}
                <div
                    className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 h-fit min-h-[100px]"
                    onContextMenu={(e) => handleContextMenuFn(e, { type: 'empty' })}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {currentFolders.map((folder) => (
                        <div
                            key={folder.id}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-[var(--mantine-color-default-hover)] cursor-pointer group border border-transparent hover:border-[var(--mantine-color-default-border)]"
                            onClick={() => onFolderClick(folder)}
                            onContextMenu={(e) => handleContextMenuFn(e, { type: 'folder', folder })}
                        >
                            <div className="relative">
                                <IconFolder size={48} className="text-[var(--mantine-color-yellow-6)]" />
                            </div>
                            <CustomText size="xs" lineClamp={2} ta="center" className="w-full px-1">
                                {folder.name}
                            </CustomText>
                        </div>
                    ))}
                    {currentFiles.map((file) => (
                        <div
                            key={file.id}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-[var(--mantine-color-default-hover)] cursor-pointer group border border-transparent hover:border-[var(--mantine-color-default-border)]"
                            onClick={() => onFileClick(file)}
                            onContextMenu={(e) => handleContextMenuFn(e, { type: 'file', file })}
                        >
                            <div className="relative">
                                {getFileIcon(file)}
                            </div>
                            <CustomText size="xs" lineClamp={2} ta="center" className="w-full px-1">
                                {file.name}
                            </CustomText>
                        </div>
                    ))}
                    {!isDragging && currentFolders.length === 0 && currentFiles.length === 0 && (
                        <div
                            className="col-span-full py-12 text-center flex flex-col items-center justify-center gap-2"
                            onContextMenu={(e) => handleContextMenuFn(e, { type: 'empty' })}
                        >
                            <CustomText c="dimmed">Папка пуста. Создайте папку, документ или загрузите файл.</CustomText>
                            <CustomText size="xs" c="dimmed">Или перетащите файлы сюда</CustomText>
                        </div>
                    )}
                </div>
            </CustomPaper>

            <ContextMenu
                x={contextMenu?.x ?? 0}
                y={contextMenu?.y ?? 0}
                target={contextMenu?.target ?? null}
                onClose={() => setContextMenu(null)}
                onNewFolder={onNewFolder}
                onNewDoc={onNewDoc}
                onUpload={onUpload}
                onOpenFolder={onFolderClick}
                onOpenFile={onFileClick}
                onRenameFolder={onRenameFolder}
                onRenameFile={onRenameFile}
                onDeleteFolder={onDeleteFolder}
                onDeleteFile={onDeleteFile}
                onDownloadFile={onDownloadFile}
                onCreateSubfolder={onCreateSubfolder}
            />
        </div>
    );
}
