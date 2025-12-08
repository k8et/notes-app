'use client';

import { NoteEditor } from '@/components/notes';
import { CustomGroup, CustomTitle, ThemeToggle, CustomPaper, CustomText } from '@/components/ui';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { getPublicNote } from '@/api/notes';
import { Skeleton } from '@mantine/core';

export default function PublicNotePage() {
    const params = useParams();
    const id = params.id as string;
    const [initialData, setInitialData] = useState<OutputData>({ blocks: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [note, setNote] = useState<any>(null);

    useEffect(() => {
        const loadNote = async () => {
            setIsLoading(true);
            const loadedNote = await getPublicNote(id);
            if (loadedNote) {
                setNote(loadedNote);
                setInitialData(loadedNote.content);
            }
            setIsLoading(false);
        };

        if (id) {
            loadNote();
        }
    }, [id]);

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

    if (!note) {
        return (
            <div className="min-h-screen p-4">
                <div className="max-w-4xl mx-auto">
                    <CustomGroup justify="space-between" mb="xl">
                        <CustomTitle order={1}>Notepad</CustomTitle>
                        <ThemeToggle />
                    </CustomGroup>
                    <CustomPaper p="md" shadow="sm" withBorder>
                        <CustomText>Note not found or is not public.</CustomText>
                    </CustomPaper>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <CustomGroup justify="space-between" mb="xl">
                    <CustomTitle order={1}>Notepad</CustomTitle>
                    <ThemeToggle />
                </CustomGroup>

                <CustomPaper p="sm" mb="md" withBorder>
                    <CustomText size="sm" c="dimmed">
                        This is a public note. You can view it but cannot edit it.
                    </CustomText>
                </CustomPaper>

                <NoteEditor
                    initialData={initialData}
                    readOnly={true}
                />
            </div>
        </div>
    );
}

