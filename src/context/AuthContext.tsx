'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('lp_admin_token');
        const savedUser = localStorage.getItem('lp_admin_user');

        console.log('[AuthContext] Initializing...', { hasToken: !!savedToken });

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('lp_admin_token', newToken);
        localStorage.setItem('lp_admin_user', JSON.stringify(newUser));
        // Establecer cookie para el middleware (7 días)
        document.cookie = `lp_admin_token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        router.push('/admin');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('lp_admin_token');
        localStorage.removeItem('lp_admin_user');
        // Eliminar cookie
        document.cookie = 'lp_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isLoading }}>
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
