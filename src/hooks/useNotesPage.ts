import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { getNotesList, deleteNote, updateNote, type NoteListItem } from '@/api/notes';
import { getFolders, createFolder, updateFolder, deleteFolder, type Folder } from '@/api/folders';
import { notifications } from '@mantine/notifications';

const ALL_FOLDER = '__all__';

export function useNotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut } = useAuth();
  const folderFromUrl = searchParams.get('folder');

  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>(() =>
    !folderFromUrl ? ALL_FOLDER : folderFromUrl
  );
  const [notesLoading, setNotesLoading] = useState(true);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [foldersDrawerOpen, setFoldersDrawerOpen] = useState(false);
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState<Folder | null>(null);
  const [renameFolderName, setRenameFolderName] = useState('');
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  const loadFolders = useCallback(async () => {
    setFoldersLoading(true);
    const list = await getFolders();
    setFolders(list);
    setFoldersLoading(false);
  }, []);

  const loadNotes = useCallback(async () => {
    setNotesLoading(true);
    const folderFilter = selectedFolderId === ALL_FOLDER ? undefined : selectedFolderId;
    const notesList = await getNotesList(folderFilter);
    setNotes(notesList);
    setNotesLoading(false);
  }, [selectedFolderId]);

  useEffect(() => { loadFolders(); }, [loadFolders]);
  useEffect(() => {
    const folder = searchParams.get('folder');
    setSelectedFolderId(!folder ? ALL_FOLDER : folder);
  }, [searchParams]);
  useEffect(() => { loadNotes(); }, [loadNotes]);

  const setSelectedFolder = useCallback((folderId: string) => {
    setSelectedFolderId(folderId);
    router.replace(folderId === ALL_FOLDER ? '/' : `/?folder=${folderId}`, { scroll: false });
    setFoldersDrawerOpen(false);
  }, [router]);

  const notify = (title: string, message: string, color: 'green' | 'red') =>
    notifications.show({ title, message, color });

  const handleCreateFolder = useCallback(async () => {
    const name = newFolderName.trim();
    if (!name) return;
    const folder = await createFolder(name);
    folder
      ? (setFolders((f) => [...f, folder]), setNewFolderName(''), setCreateFolderOpen(false), notify('Folder created', `Folder "${name}" has been created.`, 'green'))
      : notify('Error', 'Failed to create folder.', 'red');
  }, [newFolderName]);

  const handleRenameFolder = useCallback(async () => {
    if (!folderToRename) return;
    const name = renameFolderName.trim();
    if (!name) return;
    const updated = await updateFolder(folderToRename.id, name);
    updated
      ? (setFolders((f) => f.map((folder) => (folder.id === folderToRename.id ? updated : folder))),
        setRenameFolderOpen(false), setFolderToRename(null), setRenameFolderName(''),
        notify('Folder renamed', `Folder has been renamed to "${name}".`, 'green'))
      : notify('Error', 'Failed to rename folder.', 'red');
  }, [folderToRename, renameFolderName]);

  const handleDeleteFolder = useCallback(async () => {
    if (!folderToDelete) return;
    const success = await deleteFolder(folderToDelete.id);
    if (success) {
      setFolders((f) => f.filter((folder) => folder.id !== folderToDelete.id));
      if (selectedFolderId === folderToDelete.id) {
        setSelectedFolder(ALL_FOLDER);
        const list = await getNotesList(undefined);
        setNotes(list);
      }
      setDeleteFolderOpen(false);
      setFolderToDelete(null);
      notify('Folder deleted', 'Folder has been deleted.', 'green');
    } else {
      notify('Error', 'Failed to delete folder.', 'red');
    }
  }, [folderToDelete, selectedFolderId, setSelectedFolder]);

  const handleMoveToFolder = useCallback(async (noteId: string, folderId: string | null) => {
    const resolved = folderId === ALL_FOLDER ? null : folderId;
    const updated = await updateNote(noteId, { folder_id: resolved });
    if (updated) {
      setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, folder_id: resolved } : n)));
      notify('Moved', 'Note has been moved.', 'green');
    }
  }, []);

  const handleNewNote = () => router.push(`/notes/new${selectedFolderId !== ALL_FOLDER ? `?folder=${selectedFolderId}` : ''}`);
  const handleNoteClick = (id: string) => router.push(`/notes/${id}`);
  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNoteToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = useCallback(async () => {
    if (!noteToDelete) return;
    const success = await deleteNote(noteToDelete);
    success
      ? (setNotes((n) => n.filter((note) => note.id !== noteToDelete)), notify('Note deleted', 'The note has been successfully deleted.', 'green'))
      : notify('Error', 'Failed to delete the note.', 'red');
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  }, [noteToDelete]);

  const openRename = (folder: Folder) => {
    setFolderToRename(folder);
    setRenameFolderName(folder.name);
    setRenameFolderOpen(true);
    setFoldersDrawerOpen(false);
  };

  const openDeleteFolder = (folder: Folder) => {
    setFolderToDelete(folder);
    setDeleteFolderOpen(true);
    setFoldersDrawerOpen(false);
  };

  const closeCreateFolder = () => { setCreateFolderOpen(false); setNewFolderName(''); };
  const closeRenameFolder = () => { setRenameFolderOpen(false); setFolderToRename(null); setRenameFolderName(''); };
  const closeDeleteFolder = () => { setDeleteFolderOpen(false); setFolderToDelete(null); };
  const closeDeleteNote = () => { setDeleteModalOpen(false); setNoteToDelete(null); };

  return {
    notes, folders, selectedFolderId, notesLoading, foldersLoading,
    setSelectedFolder, setNewFolderName, setRenameFolderName,
    createFolderOpen, foldersDrawerOpen, setFoldersDrawerOpen,
    renameFolderOpen, deleteFolderOpen, folderToRename, folderToDelete,
    newFolderName, renameFolderName, noteToDelete, deleteModalOpen,
    handleCreateFolder, handleRenameFolder, handleDeleteFolder,
    handleMoveToFolder, handleNewNote, handleNoteClick, handleDeleteNote,
    confirmDelete, openRename, openDeleteFolder,
    closeCreateFolder, closeRenameFolder, closeDeleteFolder, closeDeleteNote,
    signOut, setCreateFolderOpen, loadNotes,
    ALL_FOLDER,
  };
}
