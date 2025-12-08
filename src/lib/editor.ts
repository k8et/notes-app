import { OutputData } from '@editorjs/editorjs';

export function getPlainTextFromEditor(data: OutputData): string {
    if (!data.blocks || data.blocks.length === 0) {
        return '';
    }

    return data.blocks
        .map((block) => {
            if (block.type === 'paragraph') {
                return (block.data as { text: string }).text || '';
            }
            if (block.type === 'header') {
                return (block.data as { text: string }).text || '';
            }
            if (block.type === 'list') {
                const items = (block.data as { items: string[] }).items || [];
                return items.join('\n');
            }
            return '';
        })
        .filter((text) => text.trim().length > 0)
        .join('\n\n');
}

export function getTitleFromEditor(data: OutputData): string {
    if (!data.blocks || data.blocks.length === 0) {
        return '';
    }

    const firstBlock = data.blocks[0];
    if (firstBlock.type === 'header') {
        return (firstBlock.data as { text: string }).text || '';
    }
    if (firstBlock.type === 'paragraph') {
        const text = (firstBlock.data as { text: string }).text || '';
        return text.split('\n')[0].substring(0, 100);
    }
    return '';
}

