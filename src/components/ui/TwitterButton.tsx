'use client';

import { Button, ButtonProps } from '@mantine/core';
import { TwitterIcon } from '@mantinex/dev-icons';
import { forwardRef } from 'react';

export interface TwitterButtonProps extends ButtonProps { }

export const TwitterButton = forwardRef<HTMLButtonElement, TwitterButtonProps>(
    (props, ref) => {
        return (
            <Button
                ref={ref}
                leftSection={<TwitterIcon size={16} color="#00ACEE" />}
                variant="default"
                {...props}
            />
        );
    }
);

TwitterButton.displayName = 'TwitterButton';

