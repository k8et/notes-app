'use client';

import { PasswordInput, PasswordInputProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomPasswordInputProps extends PasswordInputProps {}

export const CustomPasswordInput = forwardRef<HTMLInputElement, CustomPasswordInputProps>(
    (props, ref) => {
        return <PasswordInput ref={ref} {...props} />;
    }
);

CustomPasswordInput.displayName = 'CustomPasswordInput';

