declare module '@editorjs/attaches' {
    import { BlockTool } from '@editorjs/editorjs';

    export interface AttachesToolData {
        file: {
            url: string;
            name: string;
            size: number;
        };
        title?: string;
    }

    export default class AttachesTool implements BlockTool {
        static get toolbox(): {
            title: string;
            icon: string;
        };
        render(): HTMLElement;
        save(blockContent: HTMLElement): AttachesToolData;
    }
}

