'use client';

import {
    CustomAnchor,
    CustomButton,
    CustomCheckbox,
    // CustomDivider,
    CustomGroup,
    CustomModal,
    CustomPaper,
    CustomPasswordInput,
    CustomStack,
    CustomText,
    CustomTextInput,
    // GoogleButton,
    // TwitterButton,
} from '@/components/ui';
import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';
import { PaperProps } from '@mantine/core';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthenticationFormProps extends PaperProps {
    initialType?: 'login' | 'register';
}

export function AuthenticationForm({ initialType = 'login', ...props }: AuthenticationFormProps) {
    const [type, setType] = useState<'login' | 'register'>(initialType);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState<string>('');
    const router = useRouter();

    const toggle = () => {
        setType((current) => (current === 'login' ? 'register' : 'login'));
        setError(null);
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

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);

        try {
            if (type === 'register') {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: values.email,
                    password: values.password,
                    options: {
                        data: {
                            name: values.name,
                        },
                    },
                });

                if (signUpError) throw signUpError;

                if (data.user) {
                    setRegisteredEmail(values.email);
                    setShowEmailModal(true);
                    form.reset();
                }
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: values.email,
                    password: values.password,
                });

                if (signInError) throw signInError;

                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // const handleGoogleSignIn = async () => {
    //     setLoading(true);
    //     setError(null);

    //     try {
    //         const { error: signInError } = await supabase.auth.signInWithOAuth({
    //             provider: 'google',
    //             options: {
    //                 redirectTo: `${window.location.origin}/auth/callback`,
    //             },
    //         });

    //         if (signInError) throw signInError;
    //     } catch (err: any) {
    //         setError(err.message || 'An error occurred');
    //         setLoading(false);
    //     }
    // };

    return (
        <>
            <CustomModal
                opened={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                title="Check your email"
                centered
            >
                <CustomStack gap="md">
                    <CustomText>
                        We've sent a confirmation email to <strong>{registeredEmail}</strong>
                    </CustomText>
                    <CustomText size="sm" c="dimmed">
                        Please check your email and click the link to confirm your registration.
                    </CustomText>
                    <CustomButton onClick={() => setShowEmailModal(false)} fullWidth>
                        Got it
                    </CustomButton>
                </CustomStack>
            </CustomModal>

            <CustomPaper radius="md" p="lg" withBorder {...props}>
                <CustomText size="lg" mb="md" fw={500}>
                    Welcome to Notes, {type}
                </CustomText>

                {/* <CustomGroup grow mb="md" mt="md">
                    <div onClick={handleGoogleSignIn}>
                        <GoogleButton radius="xl" disabled={loading}>
                            Google
                        </GoogleButton>
                    </div>
                    <TwitterButton radius="xl" disabled>
                        Twitter
                    </TwitterButton>
                </CustomGroup>

                <CustomDivider label="Or continue with email" labelPosition="center" my="lg" /> */}

                {error && (
                    <CustomText c="red" size="sm" mb="md">
                        {error}
                    </CustomText>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
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

                        <CustomButton type="submit" radius="xl" loading={loading}>
                            {upperFirst(type)}
                        </CustomButton>
                    </CustomGroup>
                </form>
            </CustomPaper>
        </>
    );
}

