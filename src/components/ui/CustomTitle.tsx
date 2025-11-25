'use client';

import { Title, TitleProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomTitleProps extends TitleProps {
    children: React.ReactNode;
}

export const CustomTitle = forwardRef<HTMLHeadingElement, CustomTitleProps>(
    ({ children, ...props }, ref) => {
        return (
            <Title ref={ref} {...props}>
                {children}
            </Title>
        );
    }
);

CustomTitle.displayName = 'CustomTitle';

