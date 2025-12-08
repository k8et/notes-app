declare module '@editorjs/checklist' {
    import { BlockTool } from '@editorjs/editorjs';

    export default class Checklist implements BlockTool {
        static get toolbox(): {
            title: string;
            icon: string;
        };
        render(): HTMLElement;
        save(blockContent: HTMLElement): any;
    }
}

