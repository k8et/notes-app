'use client';

import { useRouter } from 'next/navigation';
import { CustomButton } from './CustomButton';
import { IconArrowLeft } from '@tabler/icons-react';

export function BackButton() {
    const router = useRouter();
    return (
        <CustomButton
            variant="subtle"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => router.push('/')}
        >
            Back
        </CustomButton>
    );
}
