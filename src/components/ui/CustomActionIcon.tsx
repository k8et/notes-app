'use client';

import { ActionIcon, ActionIconProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomActionIconProps extends ActionIconProps {
    children: React.ReactNode;
}

export const CustomActionIcon = forwardRef<HTMLButtonElement, CustomActionIconProps>(
    ({ children, ...props }, ref) => {
        return (
            <ActionIcon ref={ref} {...props}>
                {children}
            </ActionIcon>
        );
    }
);

CustomActionIcon.displayName = 'CustomActionIcon';

