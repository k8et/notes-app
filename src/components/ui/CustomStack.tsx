'use client';

import { Stack, StackProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomStackProps extends StackProps {
    children: React.ReactNode;
}

export const CustomStack = forwardRef<HTMLDivElement, CustomStackProps>(
    ({ children, ...props }, ref) => {
        return (
            <Stack ref={ref} {...props}>
                {children}
            </Stack>
        );
    }
);

CustomStack.displayName = 'CustomStack';

