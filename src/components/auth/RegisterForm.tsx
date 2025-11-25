'use client';

import { CustomButton, CustomPasswordInput, CustomStack, CustomTextInput } from '@/components/ui';
import { useState } from 'react';

export function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
                    label="Name"
                    placeholder="Your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <CustomPasswordInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <CustomButton type="submit" fullWidth loading={loading}>
                    Sign up
                </CustomButton>
            </CustomStack>
        </form>
    );
}

