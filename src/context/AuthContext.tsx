'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface StoredAuthState {
    user: User | null;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredAuthState = (): StoredAuthState => {
    if (typeof window === 'undefined') {
        return { user: null, token: null };
    }

    const savedToken = localStorage.getItem('lp_admin_token');
    const savedUser = localStorage.getItem('lp_admin_user');

    if (!savedToken || !savedUser) {
        return { user: null, token: null };
    }

    try {
        return {
            token: savedToken,
            user: JSON.parse(savedUser) as User,
        };
    } catch {
        localStorage.removeItem('lp_admin_token');
        localStorage.removeItem('lp_admin_user');
        return { user: null, token: null };
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [initialAuth] = useState<StoredAuthState>(() => readStoredAuthState());
    const [user, setUser] = useState<User | null>(initialAuth.user);
    const [token, setToken] = useState<string | null>(initialAuth.token);
    const router = useRouter();

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('lp_admin_token', newToken);
        localStorage.setItem('lp_admin_user', JSON.stringify(newUser));
        document.cookie = `lp_admin_token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        router.push('/admin');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('lp_admin_token');
        localStorage.removeItem('lp_admin_user');
        document.cookie = 'lp_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isLoading: false }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
