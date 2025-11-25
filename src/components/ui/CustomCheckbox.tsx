'use client';

import { Checkbox, CheckboxProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomCheckboxProps extends CheckboxProps {
    label: React.ReactNode;
}

export const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
    ({ label, ...props }, ref) => {
        return <Checkbox ref={ref} label={label} {...props} />;
    }
);

CustomCheckbox.displayName = 'CustomCheckbox';

