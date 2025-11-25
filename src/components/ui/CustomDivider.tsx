'use client';

import { Divider, DividerProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomDividerProps extends DividerProps {}

export const CustomDivider = forwardRef<HTMLDivElement, CustomDividerProps>(
    (props, ref) => {
        return <Divider ref={ref} {...props} />;
    }
);

CustomDivider.displayName = 'CustomDivider';

