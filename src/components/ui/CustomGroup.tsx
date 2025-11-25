'use client';

import { Group, GroupProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomGroupProps extends GroupProps {
    children: React.ReactNode;
}

export const CustomGroup = forwardRef<HTMLDivElement, CustomGroupProps>(
    ({ children, ...props }, ref) => {
        return (
            <Group ref={ref} {...props}>
                {children}
            </Group>
        );
    }
);

CustomGroup.displayName = 'CustomGroup';

