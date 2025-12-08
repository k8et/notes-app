'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Handle redirects based on auth state
    useEffect(() => {
        if (loading) return;

        const isAuthPage = pathname === '/auth';
        const isPublicRoute = pathname.startsWith('/public');
        const isProtectedRoute = (pathname.startsWith('/notes') || pathname === '/') && !isPublicRoute;

        // If user is authenticated and on auth page, redirect to home
        if (user && isAuthPage) {
            router.push('/');
            return;
        }

        // If user is not authenticated and on protected route, redirect to auth
        // But allow public routes
        if (!user && isProtectedRoute && !isAuthPage && !isPublicRoute) {
            router.push('/auth');
            return;
        }
    }, [user, loading, pathname, router]);

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

