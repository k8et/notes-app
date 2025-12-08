'use client';

import { Textarea, TextareaProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomTextareaProps extends TextareaProps { }

export const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
    (props, ref) => {
        return <Textarea ref={ref} {...props} />;
    }
);

CustomTextarea.displayName = 'CustomTextarea';

