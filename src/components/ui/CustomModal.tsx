'use client';

import { Modal, ModalProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomModalProps extends ModalProps {
    children: React.ReactNode;
}

export const CustomModal = forwardRef<HTMLDivElement, CustomModalProps>(
    ({ children, ...props }, ref) => {
        return (
            <Modal {...props}>
                {children}
            </Modal>
        );
    }
);

CustomModal.displayName = 'CustomModal';

