'use client';

import { CustomPaper, CustomStack } from '@/components/ui';
import { OutputData } from '@editorjs/editorjs';
import { Editor } from './Editor';

interface NoteEditorProps {
    initialData?: OutputData;
    onChange?: (data: OutputData) => void;
    readOnly?: boolean;
}

export function NoteEditor({ initialData, onChange, readOnly = false }: NoteEditorProps) {
    return (
        <CustomPaper p="md" shadow="sm" withBorder>
            <CustomStack gap="md">
                <div className="min-h-[300px] sm:min-h-[500px]">
                    <Editor
                        data={initialData}
                        onChange={onChange}
                        placeholder="Start writing..."
                        readOnly={readOnly}
                    />
                </div>
            </CustomStack>
        </CustomPaper>
    );
}

