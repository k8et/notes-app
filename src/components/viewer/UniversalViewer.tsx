'use client';

import ReactMarkdown from 'react-markdown';
import { CustomPaper, CustomText } from '@/components/ui';

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|svg|ico)$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov|avi|mkv)$/i;
const AUDIO_EXT = /\.(mp3|wav|ogg|flac|m4a|aac)$/i;
const PDF_EXT = /\.pdf$/i;
const MD_EXT = /\.(md|markdown)$/i;

function getViewType(name: string, mimeType: string | null): 'image' | 'video' | 'audio' | 'pdf' | 'markdown' | 'text' | 'download' {
    const lower = name.toLowerCase();
    if (IMAGE_EXT.test(lower) || mimeType?.startsWith('image/')) return 'image';
    if (VIDEO_EXT.test(lower) || mimeType?.startsWith('video/')) return 'video';
    if (AUDIO_EXT.test(lower) || mimeType?.startsWith('audio/')) return 'audio';
    if (PDF_EXT.test(lower) || mimeType === 'application/pdf') return 'pdf';
    if (MD_EXT.test(lower)) return 'markdown';
    if (mimeType?.startsWith('text/') || /\.(txt|json|xml|html|htm|csv|yml|yaml)$/i.test(lower)) return 'text';
    return 'download';
}

interface UniversalViewerProps {
    name: string;
    content: string | null;
    url: string | null;
    mimeType: string | null;
    onDownload?: () => void;
}

export function UniversalViewer({ name, content, url, mimeType, onDownload }: UniversalViewerProps) {
    const viewType = getViewType(name, mimeType);

    if (viewType === 'image' && url) {
        return (
            <CustomPaper p="md" withBorder>
                <div className="flex justify-center">
                    <img src={url} alt={name} className="max-w-full max-h-[80vh] object-contain" />
                </div>
            </CustomPaper>
        );
    }

    if (viewType === 'video' && url) {
        return (
            <CustomPaper p="md" withBorder>
                <div className="flex justify-center">
                    <video controls className="max-w-full max-h-[80vh]" src={url}>
                        <source src={url} type={mimeType || undefined} />
                    </video>
                </div>
            </CustomPaper>
        );
    }

    if (viewType === 'audio' && url) {
        return (
            <CustomPaper p="md" withBorder>
                <div className="flex justify-center py-8">
                    <audio controls className="w-full max-w-md" src={url}>
                        <source src={url} type={mimeType || undefined} />
                    </audio>
                </div>
            </CustomPaper>
        );
    }

    if (viewType === 'pdf' && url) {
        return (
            <CustomPaper p="md" withBorder>
                <object
                    data={`${url}#toolbar=1`}
                    type="application/pdf"
                    className="w-full border-0 rounded"
                    style={{ minHeight: '80vh' }}
                    aria-label={name}
                >
                    <p className="p-4 text-center">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--mantine-color-blue-6)] underline">
                            Открыть PDF в новой вкладке
                        </a>
                    </p>
                </object>
            </CustomPaper>
        );
    }

    const textContent = content ?? '';

    if (viewType === 'markdown') {
        if (!textContent && url) {
            return (
                <CustomPaper p="md" withBorder>
                    <div className="text-center py-12">
                        <CustomText c="dimmed" mb="md">
                            Файл Markdown загружен с диска. Используйте скачивание для просмотра.
                        </CustomText>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded bg-[var(--mantine-color-blue-6)] text-white hover:opacity-90 no-underline"
                            download={name}
                        >
                            Скачать {name}
                        </a>
                    </div>
                </CustomPaper>
            );
        }
        return (
            <CustomPaper p="md" withBorder>
                <article
                    className="[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:bg-[var(--mantine-color-default)] [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_code]:bg-[var(--mantine-color-default)] [&_code]:px-1 [&_code]:rounded [&_a]:text-[var(--mantine-color-blue-6)] [&_a]:underline [&_img]:max-w-full [&_img]:h-auto [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--mantine-color-gray-4)] [&_blockquote]:pl-4 [&_blockquote]:italic"
                >
                    <ReactMarkdown>{textContent}</ReactMarkdown>
                </article>
            </CustomPaper>
        );
    }

    if (viewType === 'text') {
        return (
            <CustomPaper p="md" withBorder>
                <pre
                    className="whitespace-pre-wrap font-mono text-sm overflow-x-auto p-4 rounded bg-[var(--mantine-color-default)]"
                    style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
                >
                    {textContent}
                </pre>
            </CustomPaper>
        );
    }

    return (
        <CustomPaper p="md" withBorder>
            <div className="text-center py-12">
                <CustomText c="dimmed" mb="md">
                    Предпросмотр недоступен для этого типа файла
                </CustomText>
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded bg-[var(--mantine-color-blue-6)] text-white hover:opacity-90 no-underline"
                        download={name}
                    >
                        Скачать {name}
                    </a>
                )}
            </div>
        </CustomPaper>
    );
}
