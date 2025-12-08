'use client';

import { ThemeToggle } from '@/components/ui';
import { AuthenticationForm } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md">
                <AuthenticationForm initialType="login" />
            </div>
        </div>
    );
}

