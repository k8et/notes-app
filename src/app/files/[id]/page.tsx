'use client';

import { CustomGroup, CustomTitle, ThemeToggle, CustomButton, CustomTextarea, BackButton } from '@/components/ui';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getFile, updateFile, getFileContentAsText, updateUploadedFileContent } from '@/api/files';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const TXT_EXT = /\.(txt|md|markdown)$/i;

export default function FileEditorPage() {
    const params = useParams();
    const router = useRouter();
    const { signOut } = useAuth();
    const id = params.id as string;
    const [file, setFile] = useState<Awaited<ReturnType<typeof getFile>>>(null);
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const contentRef = useRef('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const f = await getFile(id);
            if (!f) {
                router.push('/');
                setLoading(false);
                return;
            }
            setFile(f);
            setName(f.name);
            if (f.type === 'text') {
                setContent(f.content || '');
                contentRef.current = f.content || '';
            } else if (f.type === 'upload' && f.storage_path && TXT_EXT.test(f.name)) {
                const text = await getFileContentAsText(f.storage_path);
                const val = text || '';
                setContent(val);
                contentRef.current = val;
            } else {
                setLoading(false);
                router.push('/');
                return;
            }
            setLoading(false);
        };
        load();
    }, [id, router]);

    const handleSave = useCallback(async () => {
        if (!file) return;
        setSaving(true);
        const newName = name.trim() || 'Без имени.txt';
        if (file.type === 'text') {
            const updated = await updateFile(id, { content: contentRef.current, name: newName });
            if (updated) {
                setName(updated.name);
                notifications.show({ title: 'Сохранено', message: 'Документ сохранён.', color: 'green' });
            } else {
                notifications.show({ title: 'Ошибка', message: 'Не удалось сохранить.', color: 'red' });
            }
        } else if (file.type === 'upload' && file.storage_path) {
            const ok = await updateUploadedFileContent(file.storage_path, contentRef.current);
            if (ok) {
                await updateFile(id, { name: newName });
                setName(newName);
                notifications.show({ title: 'Сохранено', message: 'Документ сохранён.', color: 'green' });
            } else {
                notifications.show({ title: 'Ошибка', message: 'Не удалось сохранить.', color: 'red' });
            }
        }
        setSaving(false);
    }, [id, file]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const v = e.target.value;
        setContent(v);
        contentRef.current = v;
    };

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

    return (
        <div className="min-h-screen p-3 sm:p-4">
            <div className="max-w-4xl mx-auto">
                <CustomGroup justify="space-between" gap="sm" wrap="wrap" mb="md">
                    <CustomGroup gap="sm" align="center" wrap="wrap">
                        <BackButton />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-transparent border-none text-xl font-semibold focus:outline-none focus:ring-0 w-full min-w-[120px] max-w-[300px]"
                            style={{ font: 'inherit' }}
                        />
                    </CustomGroup>
                    <CustomGroup gap="sm" wrap="wrap">
                        <CustomButton
                            size="sm"
                            leftSection={<IconDeviceFloppy size={18} />}
                            onClick={handleSave}
                            loading={saving}
                        >
                            Сохранить
                        </CustomButton>
                        <CustomButton variant="subtle" onClick={signOut} size="sm">
                            Выйти
                        </CustomButton>
                        <ThemeToggle />
                    </CustomGroup>
                </CustomGroup>

                <CustomTextarea
                    value={content}
                    onChange={handleContentChange}
                    minRows={20}
                    autosize
                    placeholder="Введите текст..."
                    styles={{ input: { fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px' } }}
                />
            </div>
        </div>
    );
}
