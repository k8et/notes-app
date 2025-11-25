'use client';

import { Button, ButtonProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomButtonProps extends ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ children, ...props }, ref) => {
        return (
            <Button ref={ref} {...props}>
                {children}
            </Button>
        );
    }
);

CustomButton.displayName = 'CustomButton';

