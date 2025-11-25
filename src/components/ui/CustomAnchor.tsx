'use client';

import { Anchor, AnchorProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomAnchorProps extends AnchorProps, React.ComponentPropsWithoutRef<'a'> {
    children: React.ReactNode;
    component?: React.ElementType;
}

export const CustomAnchor = forwardRef<HTMLAnchorElement, CustomAnchorProps>(
    ({ children, ...props }, ref) => {
        return (
            <Anchor ref={ref} {...props}>
                {children}
            </Anchor>
        );
    }
);

CustomAnchor.displayName = 'CustomAnchor';

