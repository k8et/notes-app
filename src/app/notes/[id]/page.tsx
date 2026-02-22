'use client';

import dynamic from 'next/dynamic';

const NoteEditor = dynamic(
    () => import('@/components/notes').then((mod) => mod.NoteEditor),
    { ssr: false }
);
import { CustomGroup, CustomTitle, ThemeToggle, CustomCheckbox, CustomText, CustomTextInput, CustomStack, BackButton } from '@/components/ui';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { getNote, createNote, updateNote, type Note } from '@/api/notes';
import { getFolders, type Folder } from '@/api/folders';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton, CustomPaper } from '@/components/ui';
import { Skeleton, Select } from '@mantine/core';
import { IconLink, IconDeviceFloppy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function NotePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signOut, user } = useAuth();
    const id = params.id as string;
    const [title, setTitle] = useState('');
    const [initialContent, setInitialContent] = useState<OutputData>({ blocks: [] });
    const contentRef = useRef<OutputData>({ blocks: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [note, setNote] = useState<Note | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [folderId, setFolderId] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const isNewNote = id === 'new';

    useEffect(() => {
        const loadFolders = async () => {
            const list = await getFolders();
            setFolders(list);
        };
        loadFolders();
    }, []);

    useEffect(() => {
        const loadNote = async () => {
            if (id === 'new') {
                setTitle('');
                const empty = { blocks: [] };
                setInitialContent(empty);
                contentRef.current = empty;
                const f = searchParams.get('folder');
                setFolderId(f || null);
                setIsLoading(false);
            } else {
                setIsLoading(true);
                const loadedNote = await getNote(id);
                if (loadedNote) {
                    setNote(loadedNote);
                    setTitle(loadedNote.title || '');
                    const loaded = loadedNote.content || { blocks: [] };
                    setInitialContent(loaded);
                    contentRef.current = loaded;
                    setIsPublic(loadedNote.is_public || false);
                    setFolderId(loadedNote.folder_id ?? null);
                }
                setIsLoading(false);
            }
        };

        loadNote();
    }, [id, searchParams]);

    const handleEditorChange = useCallback((data: OutputData) => {
        contentRef.current = data;
    }, []);

    const handleSave = async () => {
        const trimmedTitle = title.trim() || 'Untitled';
        const contentToSave = contentRef.current;
        setIsSaving(true);
        try {
            if (isNewNote) {
                const newNote = await createNote({
                    title: trimmedTitle,
                    content: contentToSave,
                    is_public: isPublic,
                    folder_id: folderId,
                });
                if (newNote) {
                    setNote(newNote);
                    setIsPublic(newNote.is_public || false);
                    router.replace(`/notes/${newNote.id}`);
                    notifications.show({
                        title: 'Note created',
                        message: 'Your note has been saved.',
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        title: 'Error',
                        message: 'Failed to save the note.',
                        color: 'red',
                    });
                }
            } else {
                const updatedNote = await updateNote(id, {
                    title: trimmedTitle,
                    content: contentToSave,
                    is_public: isPublic,
                    folder_id: folderId,
                });
                if (updatedNote) {
                    setNote(updatedNote);
                    setIsPublic(updatedNote.is_public || false);
                    notifications.show({
                        title: 'Saved',
                        message: 'Your note has been saved.',
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        title: 'Error',
                        message: 'Failed to save the note.',
                        color: 'red',
                    });
                }
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen p-3 sm:p-4">
                <div className="max-w-4xl mx-auto px-0 sm:px-2">
                    <CustomGroup gap="md" mb="xl">
                        <BackButton />
                        <Skeleton height={36} width={120} radius="sm" />
                    </CustomGroup>
                    <div className="mb-8">
                        <Skeleton height={40} width="40%" radius="sm" mb="md" />
                        <Skeleton height={32} width="20%" radius="sm" />
                    </div>
                    <CustomPaper p="md" shadow="sm" withBorder>
                        <Skeleton height={300} radius="sm" />
                    </CustomPaper>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-3 sm:p-4">
            <div className="max-w-4xl mx-auto px-0 sm:px-2">
                <CustomGroup justify="space-between" gap="sm" wrap="wrap" mb="md">
                    <CustomGroup gap="sm" align="center" wrap="wrap">
                        <BackButton />  
                        <CustomTitle order={1}>Notepad</CustomTitle>
                    </CustomGroup>
                    <CustomGroup gap="sm" wrap="wrap">
                        {user && (
                            <>
                                <CustomButton
                                    size="sm"
                                    leftSection={<IconDeviceFloppy size={18} />}
                                    onClick={handleSave}
                                    loading={isSaving}
                                >
                                    Save
                                </CustomButton>
                                {(note || isNewNote) && (
                                    <>
                                        <CustomCheckbox
                                            label="Public"
                                            checked={isPublic}
                                            onChange={(e) => setIsPublic(e.currentTarget.checked)}
                                        />
                                        {isPublic && note && (
                                            <CustomButton
                                                variant="subtle"
                                                size="xs"
                                                leftSection={<IconLink size={14} />}
                                                onClick={async () => {
                                                    const publicUrl = `${window.location.origin}/public/${id}`;
                                                    await navigator.clipboard.writeText(publicUrl);
                                                    notifications.show({
                                                        title: 'Link copied',
                                                        message: 'Public link has been copied to clipboard!',
                                                        color: 'green',
                                                    });
                                                }}
                                            >
                                                Copy Link
                                            </CustomButton>
                                        )}
                                    </>
                                )}
                                <CustomButton variant="subtle" onClick={signOut}>
                                    Sign Out
                                </CustomButton>
                            </>
                        )}
                        <ThemeToggle />
                    </CustomGroup>
                </CustomGroup>

                {note && note.is_public && !user && (
                    <CustomPaper p="sm" mb="md" withBorder>
                        <CustomText size="sm" c="dimmed">
                            This is a public note. You can view it but cannot edit it.
                        </CustomText>
                    </CustomPaper>
                )}

                {user && (
                    <CustomStack gap="md" mb="md">
                        <CustomTextInput
                            placeholder="Note title"
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                            size="md"
                        />
                        <Select
                            label="Folder"
                            placeholder="Select folder"
                            clearable
                            data={folders.map((f) => ({ value: f.id, label: f.name }))}
                            value={folderId}
                            onChange={(v) => setFolderId(v)}
                        />
                        <NoteEditor
                            key={id}
                            initialData={initialContent}
                            onChange={handleEditorChange}
                            readOnly={false}
                        />
                    </CustomStack>
                )}

                {!user && note && (
                    <CustomStack gap="md">
                        <CustomText size="xl" fw={600}>
                            {title || 'Untitled'}
                        </CustomText>
                        <NoteEditor
                            key={id}
                            initialData={initialContent}
                            onChange={() => { }}
                            readOnly={true}
                        />
                    </CustomStack>
                )}
            </div>
        </div>
    );
}
