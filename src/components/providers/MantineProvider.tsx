'use client';

import { MantineProvider as MantineProviderBase, createTheme } from '@mantine/core';
import { ReactNode } from 'react';

const theme = createTheme({
    primaryColor: 'blue',
    defaultRadius: 'md',
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    headings: {
        fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    },
});

interface MantineProviderProps {
    children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
    return (
        <MantineProviderBase theme={theme} defaultColorScheme="auto">
            {children}
        </MantineProviderBase>
    );
}

