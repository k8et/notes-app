import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
    getAllFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    type Folder,
} from '@/api/folders';
import {
    getFiles,
    createTextFile,
    updateFile,
    uploadFile,
    deleteFile,
    getFile,
    getFileContentAsText,
    getSignedDownloadUrl,
    type FileItem,
} from '@/api/files';
import { notifications } from '@mantine/notifications';
import type { ContextMenuTarget } from '@/components/explorer/ContextMenu';

const ROOT = '__root__';

export function useExplorerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signOut } = useAuth();
    const currentFolderId = searchParams.get('folder') || ROOT;
    const resolvedFolderId = currentFolderId === ROOT ? null : currentFolderId;

    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [renameFolderOpen, setRenameFolderOpen] = useState(false);
    const [folderToRename, setFolderToRename] = useState<Folder | null>(null);
    const [renameFolderName, setRenameFolderName] = useState('');
    const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
    const [renameFileOpen, setRenameFileOpen] = useState(false);
    const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
    const [renameFileName, setRenameFileName] = useState('');
    const [deleteFileOpen, setDeleteFileOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
    const [createDocOpen, setCreateDocOpen] = useState(false);
    const [newDocName, setNewDocName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [createFolderParentId, setCreateFolderParentId] = useState<string | null | undefined>(undefined);
    const [foldersDrawerOpen, setFoldersDrawerOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: ContextMenuTarget } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        const [allFolders, filesList] = await Promise.all([
            getAllFolders(),
            getFiles(resolvedFolderId),
        ]);
        setFolders(allFolders);
        setFiles(filesList);
        setLoading(false);
    }, [resolvedFolderId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const navigateToFolder = useCallback(
        (folderId: string | null) => {
            if (folderId === null || folderId === ROOT) {
                router.replace('/', { scroll: false });
            } else {
                router.replace(`/?folder=${folderId}`, { scroll: false });
            }
        },
        [router]
    );

    const notify = (title: string, message: string, color: 'green' | 'red') =>
        notifications.show({ title, message, color });

    const handleCreateFolder = useCallback(async () => {
        const name = newFolderName.trim();
        if (!name) return;
        const parentId = createFolderParentId !== undefined ? createFolderParentId : resolvedFolderId;
        const folder = await createFolder(name, parentId ?? null);
        folder
            ? (setFolders((f) => [...f, folder]),
                setNewFolderName(''),
                setCreateFolderOpen(false),
                setCreateFolderParentId(undefined),
                notify('Папка создана', `Папка "${name}" создана.`, 'green'))
            : notify('Ошибка', 'Не удалось создать папку.', 'red');
    }, [newFolderName, resolvedFolderId, createFolderParentId]);

    const handleRenameFolder = useCallback(async () => {
        if (!folderToRename) return;
        const name = renameFolderName.trim();
        if (!name) return;
        const updated = await updateFolder(folderToRename.id, { name });
        updated
            ? (setFolders((f) => f.map((x) => (x.id === folderToRename.id ? updated : x))),
                setRenameFolderOpen(false),
                setFolderToRename(null),
                setRenameFolderName(''),
                notify('Папка переименована', `Переименовано в "${name}".`, 'green'))
            : notify('Ошибка', 'Не удалось переименовать.', 'red');
    }, [folderToRename, renameFolderName]);

    const handleDeleteFolder = useCallback(async () => {
        if (!folderToDelete) return;
        const success = await deleteFolder(folderToDelete.id);
        if (success) {
            setFolders((f) => f.filter((x) => x.id !== folderToDelete.id));
            setFiles((f) => f.filter((x) => x.folder_id !== folderToDelete.id));
            if (currentFolderId === folderToDelete.id) {
                navigateToFolder(null);
            }
            setDeleteFolderOpen(false);
            setFolderToDelete(null);
            notify('Папка удалена', 'Папка успешно удалена.', 'green');
        } else {
            notify('Ошибка', 'Не удалось удалить папку.', 'red');
        }
    }, [folderToDelete, currentFolderId, navigateToFolder]);

    const handleNewDoc = useCallback(async () => {
        const name = newDocName.trim() || 'Новый документ.txt';
        const doc = await createTextFile(name.endsWith('.txt') ? name : `${name}.txt`, '', resolvedFolderId);
        doc
            ? (setFiles((f) => [...f, doc]),
                setNewDocName(''),
                setCreateDocOpen(false),
                notify('Документ создан', 'Текстовый документ создан.', 'green'),
                router.push(`/files/${doc.id}`))
            : notify('Ошибка', 'Не удалось создать документ.', 'red');
    }, [newDocName, resolvedFolderId, router]);

    const uploadFiles = useCallback(
        async (fileList: FileList | File[]) => {
            const files = Array.from(fileList);
            if (!files.length) return;
            setUploading(true);
            let ok = 0;
            for (let i = 0; i < files.length; i++) {
                const f = await uploadFile(files[i], resolvedFolderId);
                if (f) {
                    setFiles((prev) => [...prev, f]);
                    ok++;
                }
            }
            setUploading(false);
            notify(ok ? 'Файлы загружены' : 'Ошибка', ok ? `Загружено файлов: ${ok}` : 'Не удалось загрузить файлы.', ok ? 'green' : 'red');
        },
        [resolvedFolderId]
    );

    const handleUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selected = e.target.files;
            if (!selected?.length) return;
            uploadFiles(selected);
            e.target.value = '';
        },
        [uploadFiles]
    );

    const handleDropFiles = useCallback(
        (files: File[]) => {
            uploadFiles(files);
        },
        [uploadFiles]
    );

    const handleRenameFile = useCallback(async () => {
        if (!fileToRename) return;
        const name = renameFileName.trim();
        if (!name) return;
        const updated = await updateFile(fileToRename.id, { name });
        updated
            ? (setFiles((f) => f.map((x) => (x.id === fileToRename.id ? updated : x))),
                setRenameFileOpen(false),
                setFileToRename(null),
                setRenameFileName(''),
                notify('Файл переименован', `Переименовано в "${name}".`, 'green'))
            : notify('Ошибка', 'Не удалось переименовать.', 'red');
    }, [fileToRename, renameFileName]);

    const handleDeleteFile = useCallback(async () => {
        if (!fileToDelete) return;
        const success = await deleteFile(fileToDelete.id);
        success
            ? (setFiles((f) => f.filter((x) => x.id !== fileToDelete.id)),
                setDeleteFileOpen(false),
                setFileToDelete(null),
                notify('Файл удалён', 'Файл успешно удалён.', 'green'))
            : notify('Ошибка', 'Не удалось удалить файл.', 'red');
    }, [fileToDelete]);

    const handleFileClick = useCallback(
        (item: FileItem) => {
            if (item.type === 'text' || /\.(txt|md|markdown)$/i.test(item.name)) {
                router.push(`/files/${item.id}`);
            } else {
                router.push(`/view/${item.id}`);
            }
        },
        [router]
    );

    const handleDownloadFile = useCallback(
        async (item: FileItem) => {
            if (item.type === 'upload' && item.storage_path) {
                const signedUrl = await getSignedDownloadUrl(item.storage_path);
                if (signedUrl) {
                    try {
                        const res = await fetch(signedUrl);
                        if (!res.ok) throw new Error('Fetch failed');
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = item.name;
                        a.click();
                        URL.revokeObjectURL(url);
                        notify('Скачивание', 'Файл скачивается.', 'green');
                    } catch {
                        notify('Ошибка', 'Не удалось скачать.', 'red');
                    }
                } else {
                    notify('Ошибка', 'Не удалось получить ссылку.', 'red');
                }
                return;
            }
            if (item.type === 'text') {
                const f = await getFile(item.id);
                if (f?.content != null) {
                    const blob = new Blob([f.content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = item.name;
                    a.click();
                    URL.revokeObjectURL(url);
                    notify('Скачивание', 'Файл скачивается.', 'green');
                } else {
                    notify('Ошибка', 'Не удалось загрузить файл.', 'red');
                }
                return;
            }
            if (/\.(txt|md|markdown)$/i.test(item.name)) {
                const f = await getFile(item.id);
                if (f?.type === 'upload' && f.storage_path) {
                    const text = await getFileContentAsText(f.storage_path);
                    if (text != null) {
                        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = item.name;
                        a.click();
                        URL.revokeObjectURL(url);
                        notify('Скачивание', 'Файл скачивается.', 'green');
                    } else {
                        const signedUrl = await getSignedDownloadUrl(f.storage_path);
                        if (signedUrl) {
                            try {
                                const res = await fetch(signedUrl);
                                if (!res.ok) throw new Error('Fetch failed');
                                const blob = await res.blob();
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = item.name;
                                a.click();
                                URL.revokeObjectURL(url);
                                notify('Скачивание', 'Файл скачивается.', 'green');
                            } catch {
                                notify('Ошибка', 'Не удалось скачать.', 'red');
                            }
                        } else {
                            notify('Ошибка', 'Не удалось скачать.', 'red');
                        }
                    }
                } else {
                    notify('Ошибка', 'Не удалось скачать.', 'red');
                }
                return;
            }
            notify('Ошибка', 'Скачивание недоступно для этого файла.', 'red');
        },
        []
    );

    const handleFolderClick = useCallback(
        (folder: Folder) => {
            navigateToFolder(folder.id);
        },
        [navigateToFolder]
    );

    const openRenameFolder = (folder: Folder) => {
        setFolderToRename(folder);
        setRenameFolderName(folder.name);
        setRenameFolderOpen(true);
    };

    const openDeleteFolder = (folder: Folder) => {
        setFolderToDelete(folder);
        setDeleteFolderOpen(true);
    };

    const openRenameFile = (file: FileItem) => {
        setFileToRename(file);
        setRenameFileName(file.name);
        setRenameFileOpen(true);
    };

    const openDeleteFile = (file: FileItem) => {
        setFileToDelete(file);
        setDeleteFileOpen(true);
    };

    const triggerUpload = () => fileInputRef.current?.click();

    const openCreateFolder = (parentId?: string | null) => {
        setCreateFolderParentId(parentId);
        setNewFolderName('');
        setCreateFolderOpen(true);
    };

    const openCreateSubfolder = (parentId: string) => {
        openCreateFolder(parentId);
    };

    const pathFolders = useMemo(() => {
        if (!resolvedFolderId) return [];
        const path: Folder[] = [];
        let fid: string | null = resolvedFolderId;
        while (fid) {
            const f = folders.find((x) => x.id === fid);
            if (!f) break;
            path.unshift(f);
            fid = f.parent_id;
        }
        return path;
    }, [folders, resolvedFolderId]);

    return {
        folders,
        files,
        loading,
        currentFolderId: resolvedFolderId,
        ROOT,
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
        triggerUpload,
        openCreateSubfolder,
        closeCreateFolder: () => {
            setCreateFolderOpen(false);
            setNewFolderName('');
            setCreateFolderParentId(undefined);
        },
        closeRenameFolder: () => {
            setRenameFolderOpen(false);
            setFolderToRename(null);
            setRenameFolderName('');
        },
        closeDeleteFolder: () => {
            setDeleteFolderOpen(false);
            setFolderToDelete(null);
        },
        closeRenameFile: () => {
            setRenameFileOpen(false);
            setFileToRename(null);
            setRenameFileName('');
        },
        closeDeleteFile: () => {
            setDeleteFileOpen(false);
            setFileToDelete(null);
        },
        closeCreateDoc: () => {
            setCreateDocOpen(false);
            setNewDocName('');
        },
        signOut,
        loadData,
        pathFolders,
        foldersDrawerOpen,
        setFoldersDrawerOpen,
        contextMenu,
        setContextMenu,
    };
}
