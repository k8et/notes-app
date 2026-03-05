'use client';

import { CustomButton, CustomGroup, CustomText, CustomStack, CustomTextInput } from '@/components/ui';
import { Modal } from '@mantine/core';
import type { Folder } from '@/api/folders';

interface ExplorerModalsProps {
    createFolderOpen: boolean;
    renameFolderOpen: boolean;
    deleteFolderOpen: boolean;
    renameFileOpen: boolean;
    deleteFileOpen: boolean;
    createDocOpen: boolean;
    newFolderName: string;
    renameFolderName: string;
    renameFileName: string;
    newDocName: string;
    folderToRename: Folder | null;
    folderToDelete: Folder | null;
    fileToRename: { name: string } | null;
    fileToDelete: { name: string } | null;
    isMobile: boolean;
    onNewFolderNameChange: (v: string) => void;
    onRenameFolderNameChange: (v: string) => void;
    onRenameFileNameChange: (v: string) => void;
    onNewDocNameChange: (v: string) => void;
    onCreateFolder: () => void;
    onRenameFolder: () => void;
    onDeleteFolder: () => void;
    onRenameFile: () => void;
    onDeleteFile: () => void;
    onCreateDoc: () => void;
    onCloseCreateFolder: () => void;
    onCloseRenameFolder: () => void;
    onCloseDeleteFolder: () => void;
    onCloseRenameFile: () => void;
    onCloseDeleteFile: () => void;
    onCloseCreateDoc: () => void;
}

export function ExplorerModals({
    createFolderOpen,
    renameFolderOpen,
    deleteFolderOpen,
    renameFileOpen,
    deleteFileOpen,
    createDocOpen,
    newFolderName,
    renameFolderName,
    renameFileName,
    newDocName,
    folderToRename,
    folderToDelete,
    fileToRename,
    fileToDelete,
    isMobile,
    onNewFolderNameChange,
    onRenameFolderNameChange,
    onRenameFileNameChange,
    onNewDocNameChange,
    onCreateFolder,
    onRenameFolder,
    onDeleteFolder,
    onRenameFile,
    onDeleteFile,
    onCreateDoc,
    onCloseCreateFolder,
    onCloseRenameFolder,
    onCloseDeleteFolder,
    onCloseRenameFile,
    onCloseDeleteFile,
    onCloseCreateDoc,
}: ExplorerModalsProps) {
    const modalProps = { centered: true, fullScreen: isMobile };

    return (
        <>
            <Modal opened={createFolderOpen} onClose={onCloseCreateFolder} title="Новая папка" {...modalProps}>
                <CustomStack gap="md">
                    <CustomTextInput
                        placeholder="Имя папки"
                        value={newFolderName}
                        onChange={(e) => onNewFolderNameChange(e.currentTarget.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onCreateFolder()}
                    />
                    <CustomGroup justify="flex-end">
                        <CustomButton variant="subtle" onClick={onCloseCreateFolder}>Отмена</CustomButton>
                        <CustomButton onClick={onCreateFolder} disabled={!newFolderName.trim()}>Создать</CustomButton>
                    </CustomGroup>
                </CustomStack>
            </Modal>

            <Modal opened={renameFolderOpen} onClose={onCloseRenameFolder} title="Переименовать папку" {...modalProps}>
                <CustomStack gap="md">
                    <CustomTextInput
                        placeholder="Имя папки"
                        value={renameFolderName}
                        onChange={(e) => onRenameFolderNameChange(e.currentTarget.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onRenameFolder()}
                    />
                    <CustomGroup justify="flex-end">
                        <CustomButton variant="subtle" onClick={onCloseRenameFolder}>Отмена</CustomButton>
                        <CustomButton onClick={onRenameFolder} disabled={!renameFolderName.trim()}>Сохранить</CustomButton>
                    </CustomGroup>
                </CustomStack>
            </Modal>

            <Modal opened={deleteFolderOpen} onClose={onCloseDeleteFolder} title="Удалить папку" {...modalProps}>
                <CustomText mb="md">Удалить папку «{folderToDelete?.name}» и всё её содержимое?</CustomText>
                <CustomGroup justify="flex-end">
                    <CustomButton variant="subtle" onClick={onCloseDeleteFolder}>Отмена</CustomButton>
                    <CustomButton color="red" onClick={onDeleteFolder}>Удалить</CustomButton>
                </CustomGroup>
            </Modal>

            <Modal opened={renameFileOpen} onClose={onCloseRenameFile} title="Переименовать файл" {...modalProps}>
                <CustomStack gap="md">
                    <CustomTextInput
                        placeholder="Имя файла"
                        value={renameFileName}
                        onChange={(e) => onRenameFileNameChange(e.currentTarget.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onRenameFile()}
                    />
                    <CustomGroup justify="flex-end">
                        <CustomButton variant="subtle" onClick={onCloseRenameFile}>Отмена</CustomButton>
                        <CustomButton onClick={onRenameFile} disabled={!renameFileName.trim()}>Сохранить</CustomButton>
                    </CustomGroup>
                </CustomStack>
            </Modal>

            <Modal opened={deleteFileOpen} onClose={onCloseDeleteFile} title="Удалить файл" {...modalProps}>
                <CustomText mb="md">Удалить файл «{fileToDelete?.name}»?</CustomText>
                <CustomGroup justify="flex-end">
                    <CustomButton variant="subtle" onClick={onCloseDeleteFile}>Отмена</CustomButton>
                    <CustomButton color="red" onClick={onDeleteFile}>Удалить</CustomButton>
                </CustomGroup>
            </Modal>

            <Modal opened={createDocOpen} onClose={onCloseCreateDoc} title="Новый документ" {...modalProps}>
                <CustomStack gap="md">
                    <CustomTextInput
                        placeholder="Имя документа (например, Заметка.txt)"
                        value={newDocName}
                        onChange={(e) => onNewDocNameChange(e.currentTarget.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onCreateDoc()}
                    />
                    <CustomGroup justify="flex-end">
                        <CustomButton variant="subtle" onClick={onCloseCreateDoc}>Отмена</CustomButton>
                        <CustomButton onClick={onCreateDoc}>Создать</CustomButton>
                    </CustomGroup>
                </CustomStack>
            </Modal>
        </>
    );
}
