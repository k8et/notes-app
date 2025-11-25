'use client';

import {
    CustomAnchor,
    CustomButton,
    CustomCheckbox,
    CustomDivider,
    CustomGroup,
    CustomPaper,
    CustomPasswordInput,
    CustomStack,
    CustomText,
    CustomTextInput,
    GoogleButton,
    TwitterButton,
} from '@/components/ui';
import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';
import { PaperProps } from '@mantine/core';
import { useState } from 'react';

interface AuthenticationFormProps extends PaperProps {
    initialType?: 'login' | 'register';
}

export function AuthenticationForm({ initialType = 'login', ...props }: AuthenticationFormProps) {
    const [type, setType] = useState<'login' | 'register'>(initialType);

    const toggle = () => {
        setType((current) => (current === 'login' ? 'register' : 'login'));
    };

    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    return (
        <CustomPaper radius="md" p="lg" withBorder {...props}>
            <CustomText size="lg" fw={500}>
                Welcome to Notes, {type} with
            </CustomText>

            <CustomGroup grow mb="md" mt="md">
                <GoogleButton radius="xl">Google</GoogleButton>
                <TwitterButton radius="xl">Twitter</TwitterButton>
            </CustomGroup>

            <CustomDivider label="Or continue with email" labelPosition="center" my="lg" />

            <form onSubmit={form.onSubmit(() => { })}>
                <CustomStack>
                    {type === 'register' && (
                        <CustomTextInput
                            label="Name"
                            placeholder="Your name"
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                            radius="md"
                        />
                    )}

                    <CustomTextInput
                        required
                        label="Email"
                        placeholder="hello@mantine.dev"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        radius="md"
                    />

                    <CustomPasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && 'Password should include at least 6 characters'}
                        radius="md"
                    />

                    {type === 'register' && (
                        <CustomCheckbox
                            label="I accept terms and conditions"
                            checked={form.values.terms}
                            onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                        />
                    )}
                </CustomStack>

                <CustomGroup justify="space-between" mt="xl">
                    <CustomAnchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                        {type === 'register'
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </CustomAnchor>

                    <CustomButton type="submit" radius="xl">
                        {upperFirst(type)}
                    </CustomButton>
                </CustomGroup>
            </form>
        </CustomPaper>
    );
}

