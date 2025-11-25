'use client';

import { Text, TextProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomTextProps extends TextProps {
    children: React.ReactNode;
}

export const CustomText = forwardRef<HTMLDivElement, CustomTextProps>(
    ({ children, ...props }, ref) => {
        return (
            <Text ref={ref} {...props}>
                {children}
            </Text>
        );
    }
);

CustomText.displayName = 'CustomText';

