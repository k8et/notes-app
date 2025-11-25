'use client';

import { CustomButton, CustomPasswordInput, CustomStack, CustomTextInput } from '@/components/ui';
import { useState } from 'react';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CustomStack gap="md">
                <CustomTextInput
                    label="Email"
                    placeholder="your@email.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <CustomPasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <CustomButton type="submit" fullWidth loading={loading}>
                    Sign in
                </CustomButton>
            </CustomStack>
        </form>
    );
}

