// @ts-nocheck
'use client';
// @ts-ignore
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import AttachesTool from '@editorjs/attaches';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Checklist from '@editorjs/checklist';
// @ts-ignore
import Embed from '@editorjs/embed';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';
// @ts-ignore
import CoolDelimiter from '@coolbytes/editorjs-delimiter';
// @ts-ignore
import Alert from 'editorjs-alert';
// @ts-ignore
import ToggleBlock from 'editorjs-toggle-block';
// @ts-ignore
import TitleEditor from 'title-editorjs';
// @ts-ignore
import ColorPicker from 'editorjs-color-picker';
// @ts-ignore
import ImprovedQuote from '@cychann/editorjs-quote';
import { useEffect, useRef, useState } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { fileToBase64 } from '@/lib/fileUpload';

interface EditorProps {
    data?: OutputData;
    onChange?: (data: OutputData) => void;
    placeholder?: string;
    readOnly?: boolean;
}

export function Editor({ data, onChange, placeholder = 'Start writing...', readOnly = false }: EditorProps) {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const initialDataRef = useRef<OutputData | undefined>(data);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (!holderRef.current) return;
        if (isInitializedRef.current) return;

        if (data && data.blocks && data.blocks.length > 0) {
            initialDataRef.current = data;
        }

        isInitializedRef.current = true;

        const editor = new EditorJS({
            holder: holderRef.current,
            placeholder,
            readOnly,
            autofocus: !readOnly,
            data: initialDataRef.current || {
                blocks: [],
            },
            minHeight: readOnly ? 100 : 300,
            tools: {
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
                header: {
                    class: Header,
                    config: {
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2,
                    },
                    inlineToolbar: true,
                },
                list: {
                    class: NestedList,
                    inlineToolbar: true,
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                quote: {
                    class: ImprovedQuote || Quote,
                    inlineToolbar: true,
                },
                code: Code,
                delimiter: CoolDelimiter,
                alert: Alert,
                toggle: ToggleBlock,
                title: TitleEditor,
                colorPicker: ColorPicker,
                table: {
                    class: Table,
                    inlineToolbar: true,
                },
                warning: Warning,
                image: {
                    class: Image,
                    config: {
                        uploader: {
                            async uploadByFile(file: File) {
                                const base64 = await fileToBase64(file);
                                return {
                                    success: 1,
                                    file: {
                                        url: base64,
                                    },
                                };
                            },
                            async uploadByUrl(url: string) {
                                return {
                                    success: 1,
                                    file: {
                                        url: url,
                                    },
                                };
                            },
                        },
                    },
                },
                attaches: {
                    class: AttachesTool,
                    config: {
                        uploader: {
                            async uploadByFile(file: File) {
                                const base64 = await fileToBase64(file);
                                return {
                                    success: 1,
                                    file: {
                                        url: base64,
                                        name: file.name,
                                        size: file.size,
                                    },
                                };
                            },
                        },
                    },
                },
                embed: {
                    class: Embed,
                    config: {
                        services: {
                            youtube: true,
                            coub: true,
                            codepen: true,
                            imgur: true,
                            vimeo: true,
                            gfycat: true,
                            instagram: true,
                            twitter: true,
                            facebook: true,
                        },
                    },
                },
                underline: Underline,
            } as any,
            onChange: async () => {
                if (editor && onChange) {
                    try {
                        const outputData = await editor.save();
                        onChange(outputData);
                    } catch (error) {
                        console.error('Error saving editor data:', error);
                    }
                }
            },
        });

        editor.isReady
            .then(() => {
                editorRef.current = editor;
                setIsReady(true);
            })
            .catch((error) => {
                console.error('Editor initialization error:', error);
            });

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
                setIsReady(false);
                isInitializedRef.current = false;
            }
        };
    }, []);

    useEffect(() => {
        if (editorRef.current && isReady && data && data.blocks && data.blocks.length > 0 && initialDataRef.current !== data) {
            const currentData = JSON.stringify(initialDataRef.current);
            const newData = JSON.stringify(data);
            if (currentData !== newData) {
                initialDataRef.current = data;
                editorRef.current.render(data).catch(() => { });
            }
        }
    }, [data, isReady]);

    return <div ref={holderRef} style={{ minHeight: readOnly ? '100px' : '300px' }} />;
}

