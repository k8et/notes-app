import { ThemeToggle } from '@/components/ui';
import { AuthenticationForm } from '@/components/auth';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center  p-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md">
                <AuthenticationForm initialType="login" />
            </div>
        </div>
    );
}

