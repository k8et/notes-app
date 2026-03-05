'use client';

import { CustomGroup, CustomTitle, ThemeToggle, CustomButton, BackButton } from '@/components/ui';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { getFile, getSignedDownloadUrl, getFileContentAsText } from '@/api/files';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@mantine/core';
import { IconPencil, IconDownload } from '@tabler/icons-react';
import { UniversalViewer } from '@/components/viewer';
import { notifications } from '@mantine/notifications';

export default function ViewPage() {
    const params = useParams();
    const router = useRouter();
    const { signOut } = useAuth();
    const id = params.id as string;
    const [file, setFile] = useState<Awaited<ReturnType<typeof getFile>>>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [fetchedContent, setFetchedContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isTextViewable = (name: string, mime: string | null) =>
        /\.(txt|json|xml|html|htm|csv|yml|yaml|md|markdown)$/i.test(name.toLowerCase()) ||
        mime?.startsWith('text/');

    useEffect(() => {
        const load = async () => {
            setError(null);
            setFetchedContent(null);
            try {
                const f = await getFile(id);
                if (!f) {
                    setError('Файл не найден');
                    setLoading(false);
                    return;
                }
                setFile(f);
                if (f.type === 'upload' && f.storage_path) {
                    const signedUrl = await getSignedDownloadUrl(f.storage_path);
                    setUrl(signedUrl);
                    if (isTextViewable(f.name, f.mime_type)) {
                        const text = await getFileContentAsText(f.storage_path);
                        setFetchedContent(text ?? null);
                    }
                }
            } catch (e) {
                setError('Не удалось загрузить файл');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleDownload = useCallback(async () => {
        if (!file) return;
        if (file.type === 'text') {
            const blob = new Blob([file.content ?? ''], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
            notifications.show({ title: 'Скачивание', message: 'Файл скачивается.', color: 'green' });
            return;
        }
        if (!file.storage_path) return;
        const signedUrl = await getSignedDownloadUrl(file.storage_path);
        if (signedUrl) {
            try {
                const res = await fetch(signedUrl);
                if (!res.ok) throw new Error('Fetch failed');
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                a.click();
                URL.revokeObjectURL(url);
                notifications.show({ title: 'Скачивание', message: 'Файл скачивается.', color: 'green' });
            } catch {
                notifications.show({ title: 'Ошибка', message: 'Не удалось скачать.', color: 'red' });
            }
        } else {
            notifications.show({ title: 'Ошибка', message: 'Не удалось получить ссылку', color: 'red' });
        }
    }, [file]);

    if (loading) {
        return (
            <div className="min-h-screen p-3 sm:p-4">
                <div className="max-w-4xl mx-auto">
                    <CustomGroup gap="md" mb="xl">
                        <BackButton />
                        <Skeleton height={36} width={120} radius="sm" />
                    </CustomGroup>
                    <Skeleton height={400} radius="sm" />
                </div>
            </div>
        );
    }

    if (error || !file) {
        return (
            <div className="min-h-screen p-3 sm:p-4">
                <div className="max-w-4xl mx-auto">
                    <CustomGroup gap="md" mb="xl">
                        <BackButton />
                    </CustomGroup>
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">{error || 'Файл не найден'}</p>
                        <CustomButton variant="light" onClick={() => router.push('/')}>
                            На главную
                        </CustomButton>
                    </div>
                </div>
            </div>
        );
    }

    const isTextFile = file.type === 'text';
    const viewUrl = isTextFile ? null : url;
    const viewContent = file.content ?? fetchedContent;

    return (
        <div className="min-h-screen p-3 sm:p-4">
            <div className="max-w-4xl mx-auto">
                <CustomGroup justify="space-between" gap="sm" wrap="wrap" mb="md">
                    <CustomGroup gap="sm" align="center" wrap="wrap">
                        <BackButton />
                        <CustomTitle order={4} style={{ fontWeight: 600 }}>
                            {file.name}
                        </CustomTitle>
                        {isTextFile && (
                            <CustomButton
                                variant="subtle"
                                size="xs"
                                leftSection={<IconPencil size={14} />}
                                onClick={() => router.push(`/files/${id}`)}
                            >
                                Редактировать
                            </CustomButton>
                        )}
                        {(file.type === 'text' || file.storage_path) && (
                            <CustomButton
                                variant="subtle"
                                size="xs"
                                leftSection={<IconDownload size={14} />}
                                onClick={handleDownload}
                            >
                                Скачать
                            </CustomButton>
                        )}
                    </CustomGroup>
                    <CustomGroup gap="sm" wrap="wrap">
                        <CustomButton variant="subtle" onClick={signOut} size="sm">
                            Выйти
                        </CustomButton>
                        <ThemeToggle />
                    </CustomGroup>
                </CustomGroup>

                <UniversalViewer
                    name={file.name}
                    content={viewContent}
                    url={viewUrl}
                    mimeType={file.mime_type}
                />
            </div>
        </div>
    );
}
