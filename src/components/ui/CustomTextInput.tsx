'use client';

import { TextInput, TextInputProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomTextInputProps extends TextInputProps {}

export const CustomTextInput = forwardRef<HTMLInputElement, CustomTextInputProps>(
    (props, ref) => {
        return <TextInput ref={ref} {...props} />;
    }
);

CustomTextInput.displayName = 'CustomTextInput';

