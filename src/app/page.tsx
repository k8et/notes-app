'use client';

import { Suspense } from 'react';
import { CustomButton, CustomGroup, CustomTitle, ThemeToggle } from '@/components/ui';
import { useMediaQuery } from '@mantine/hooks';
import { Drawer } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
import { FolderTree, ExplorerContent, ExplorerModals } from '@/components/explorer';
import { useExplorerPage } from '@/hooks/useExplorerPage';

function ExplorerContentInner() {
    const isMobile = useMediaQuery('(max-width: 639px)');
    const {
        folders,
        files,
        loading,
        currentFolderId,
        pathFolders,
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
        uploading,
        fileInputRef,
        setNewFolderName,
        setRenameFolderName,
        setRenameFileName,
        setNewDocName,
        setCreateFolderOpen,
        setCreateDocOpen,
        handleCreateFolder,
        handleRenameFolder,
        handleDeleteFolder,
        handleNewDoc,
        handleUpload,
        handleDropFiles,
        handleRenameFile,
        handleDeleteFile,
        handleFileClick,
        handleDownloadFile,
        handleFolderClick,
        navigateToFolder,
        openRenameFolder,
        openDeleteFolder,
        openRenameFile,
        openDeleteFile,
        openCreateSubfolder,
        triggerUpload,
        closeCreateFolder,
        closeRenameFolder,
        closeDeleteFolder,
        closeRenameFile,
        closeDeleteFile,
        closeCreateDoc,
        signOut,
        foldersDrawerOpen,
        setFoldersDrawerOpen,
        contextMenu,
        setContextMenu,
    } = useExplorerPage();

    const currentFolders = folders.filter((f) => f.parent_id === currentFolderId);
    const canNavigateUp = pathFolders.length > 0;

    const handleNavigateUp = () => {
        if (pathFolders.length >= 2) {
            navigateToFolder(pathFolders[pathFolders.length - 2].id);
        } else {
            navigateToFolder(null);
        }
    };

    return (
        <div className="min-h-screen p-3 sm:p-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="hidden md:block w-56 flex-shrink-0">
                    <div className="sticky top-4">
                        <FolderTree
                            folders={folders}
                            currentFolderId={currentFolderId}
                            onSelectFolder={handleFolderClick}
                            onSelectRoot={() => navigateToFolder(null)}
                            onRename={openRenameFolder}
                            onDelete={openDeleteFolder}
                            onCreateSubfolder={openCreateSubfolder}
                            onContextMenu={(folder, e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, target: { type: 'folder', folder } }); }}
                        />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <CustomGroup justify="space-between" gap="sm" wrap="wrap" mb="md">
                        <CustomGroup gap="sm" align="center" wrap="wrap">
                            <div className="md:hidden shrink-0">
                                <CustomButton
                                    variant="subtle"
                                    size="sm"
                                    leftSection={<IconMenu2 size={18} />}
                                    onClick={() => setFoldersDrawerOpen(true)}
                                >
                                    Папки
                                </CustomButton>
                            </div>
                            <CustomTitle order={1} style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
                                Проводник
                            </CustomTitle>
                        </CustomGroup>
                        <CustomGroup gap="sm" wrap="wrap">
                            <CustomButton variant="subtle" onClick={signOut} size="sm">
                                Выйти
                            </CustomButton>
                            <ThemeToggle />
                        </CustomGroup>
                    </CustomGroup>

                    <ExplorerContent
                        folders={folders}
                        files={files}
                        contextMenu={contextMenu}
                        setContextMenu={setContextMenu}
                        currentFolderId={currentFolderId}
                        pathFolders={pathFolders}
                        canNavigateUp={canNavigateUp}
                        loading={loading}
                        uploading={uploading}
                        onFolderClick={handleFolderClick}
                        onFileClick={handleFileClick}
                        onNavigateToFolder={(f) => navigateToFolder(f.id)}
                        onNavigateUp={handleNavigateUp}
                        onNavigateRoot={() => navigateToFolder(null)}
                        onRenameFolder={openRenameFolder}
                        onDeleteFolder={openDeleteFolder}
                        onRenameFile={openRenameFile}
                        onDeleteFile={openDeleteFile}
                        onDownloadFile={handleDownloadFile}
                        onNewFolder={() => {
                            setCreateFolderOpen(true);
                            setNewFolderName('');
                        }}
                        onNewDoc={() => {
                            setCreateDocOpen(true);
                            setNewDocName('');
                        }}
                        onUpload={triggerUpload}
                        onDropFiles={handleDropFiles}
                        onCreateSubfolder={(folder) => openCreateSubfolder(folder.id)}
                    />
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleUpload}
            />

            <Drawer
                opened={foldersDrawerOpen}
                onClose={() => setFoldersDrawerOpen(false)}
                title="Папки"
                position="left"
                size="xs"
            >
                <FolderTree
                    folders={folders}
                    currentFolderId={currentFolderId}
                    onSelectFolder={(f) => {
                        handleFolderClick(f);
                        setFoldersDrawerOpen(false);
                    }}
                    onSelectRoot={() => {
                        navigateToFolder(null);
                        setFoldersDrawerOpen(false);
                    }}
                    onRename={openRenameFolder}
                    onDelete={openDeleteFolder}
                    onCreateSubfolder={openCreateSubfolder}
                    onContextMenu={(folder, e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, target: { type: 'folder', folder } }); }}
                />
            </Drawer>

            <ExplorerModals
                createFolderOpen={createFolderOpen}
                renameFolderOpen={renameFolderOpen}
                deleteFolderOpen={deleteFolderOpen}
                renameFileOpen={renameFileOpen}
                deleteFileOpen={deleteFileOpen}
                createDocOpen={createDocOpen}
                newFolderName={newFolderName}
                renameFolderName={renameFolderName}
                renameFileName={renameFileName}
                newDocName={newDocName}
                folderToRename={folderToRename}
                folderToDelete={folderToDelete}
                fileToRename={fileToRename}
                fileToDelete={fileToDelete}
                isMobile={isMobile}
                onNewFolderNameChange={setNewFolderName}
                onRenameFolderNameChange={setRenameFolderName}
                onRenameFileNameChange={setRenameFileName}
                onNewDocNameChange={setNewDocName}
                onCreateFolder={handleCreateFolder}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
                onRenameFile={handleRenameFile}
                onDeleteFile={handleDeleteFile}
                onCreateDoc={handleNewDoc}
                onCloseCreateFolder={closeCreateFolder}
                onCloseRenameFolder={closeRenameFolder}
                onCloseDeleteFolder={closeDeleteFolder}
                onCloseRenameFile={closeRenameFile}
                onCloseDeleteFile={closeDeleteFile}
                onCloseCreateDoc={closeCreateDoc}
            />
        </div>
    );
}

export default function Home() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen p-3 sm:p-4 flex items-center justify-center">
                    <div className="animate-pulse">Загрузка...</div>
                </div>
            }
        >
            <ExplorerContentInner />
        </Suspense>
    );
}
