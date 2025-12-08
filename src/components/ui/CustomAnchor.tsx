'use client';

import { Anchor, AnchorProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomAnchorProps extends AnchorProps {
    children: React.ReactNode;
    component?: React.ElementType;
    onClick?: () => void;
}

export const CustomAnchor = forwardRef<HTMLAnchorElement, CustomAnchorProps>(
    ({ children, ...props }, ref) => {
        return (
            <Anchor ref={ref} {...(props as any)}>
                {children}
            </Anchor>
        );
    }
);

CustomAnchor.displayName = 'CustomAnchor';

