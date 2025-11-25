'use client';

import { Paper, PaperProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomPaperProps extends PaperProps {
    children: React.ReactNode;
}

export const CustomPaper = forwardRef<HTMLDivElement, CustomPaperProps>(
    ({ children, ...props }, ref) => {
        return (
            <Paper ref={ref} {...props}>
                {children}
            </Paper>
        );
    }
);

CustomPaper.displayName = 'CustomPaper';

