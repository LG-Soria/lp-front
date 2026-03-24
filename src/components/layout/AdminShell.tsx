'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { AdminHeader } from '@/components/AdminHeader';

const AdminContent = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isAdminLogin = pathname === '/admin/login';

    if (isAdminLogin) {
        return <main className="min-h-screen">{children}</main>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <AdminHeader />
            <main className="grow pt-16">{children}</main>
        </div>
    );
};

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <AdminContent>{children}</AdminContent>
        </AuthProvider>
    );
};
