'use client';

import { NoteEditor } from '@/components/notes';
import { CustomGroup, CustomTitle, ThemeToggle, CustomCheckbox, CustomText } from '@/components/ui';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { getNote, createNote, updateNote, type Note } from '@/api/notes';
import { getTitleFromEditor } from '@/lib/editor';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton, CustomPaper } from '@/components/ui';
import { Skeleton } from '@mantine/core';
import { IconLink, IconLoader2 } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function NotePage() {
    const params = useParams();
    const router = useRouter();
    const { signOut, user } = useAuth();
    const id = params.id as string;
    const [initialData, setInitialData] = useState<OutputData>({ blocks: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [note, setNote] = useState<Note | null>(null);
    const [isPublic, setIsPublic] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const isNewNoteRef = useRef(id === 'new');
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedDataRef = useRef<string>('');

    useEffect(() => {
        const loadNote = async () => {
            if (id === 'new') {
                setInitialData({ blocks: [] });
                isNewNoteRef.current = true;
                setIsLoading(false);
            } else {
                setIsLoading(true);
                const loadedNote = await getNote(id);
                if (loadedNote) {
                    setNote(loadedNote);
                    setInitialData(loadedNote.content);
                    setIsPublic(loadedNote.is_public || false);
                    lastSavedDataRef.current = JSON.stringify(loadedNote.content);
                    isNewNoteRef.current = false;
                }
                setIsLoading(false);
            }
        };

        loadNote();
    }, [id]);

    const handleChange = useCallback((data: OutputData) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        const dataString = JSON.stringify(data);

        // Skip save if data hasn't changed
        if (dataString === lastSavedDataRef.current && !isNewNoteRef.current) {
            return;
        }

        saveTimeoutRef.current = setTimeout(async () => {
            // Double-check data hasn't changed during timeout
            const currentDataString = JSON.stringify(data);
            if (currentDataString === lastSavedDataRef.current && !isNewNoteRef.current) {
                return;
            }

            setIsSaving(true);
            const title = getTitleFromEditor(data) || 'Untitled';

            try {
                if (isNewNoteRef.current) {
                    const newNote = await createNote({
                        title,
                        content: data,
                        is_public: false,
                    });
                    if (newNote) {
                        setNote(newNote);
                        setIsPublic(newNote.is_public || false);
                        lastSavedDataRef.current = JSON.stringify(newNote.content);
                        isNewNoteRef.current = false;
                        router.replace(`/notes/${newNote.id}`);
                    }
                } else {
                    const updatedNote = await updateNote(id, {
                        title,
                        content: data,
                    });
                    if (updatedNote) {
                        setNote(updatedNote);
                        lastSavedDataRef.current = JSON.stringify(updatedNote.content);
                    }
                }
            } finally {
                setIsSaving(false);
            }
        }, 5000); // Reduced from 5000ms to 2000ms
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen p-4">
                <div className="max-w-4xl mx-auto">
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
        <div className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <CustomGroup justify="space-between" mb="xl">
                    <CustomGroup gap="md" align="center">
                        <CustomTitle order={1}>Notepad</CustomTitle>
                        {isSaving && (
                            <div className="fixed bottom-5 right-5 animate-spin">
                                <IconLoader2 size={20} />
                            </div>

                        )}
                    </CustomGroup>
                    <CustomGroup gap="md">
                        {user && note && (
                            <>
                                <CustomCheckbox
                                    label="Public"
                                    checked={isPublic}
                                    onChange={async (e) => {
                                        const newIsPublic = e.currentTarget.checked;
                                        setIsPublic(newIsPublic);
                                        const updatedNote = await updateNote(id, {
                                            is_public: newIsPublic,
                                        });
                                        if (updatedNote) {
                                            setNote(updatedNote);
                                        }
                                    }}
                                />
                                {isPublic && (
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
                        {user && (
                            <CustomButton variant="subtle" onClick={signOut}>
                                Sign Out
                            </CustomButton>
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

                <NoteEditor
                    key={id}
                    initialData={initialData}
                    onChange={handleChange}
                    readOnly={note?.is_public && !user}
                />
            </div>
        </div>
    );
}
