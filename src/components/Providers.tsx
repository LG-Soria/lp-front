'use client';

import React from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { AdminHeader } from '@/components/AdminHeader';
import { Footer } from '@/components/Footer';
import { usePathname } from 'next/navigation';

const AppContent = ({ children }: { children: React.ReactNode }) => {
    const { cartCount } = useCart();
    const pathname = usePathname();
    const isAdminLogin = pathname === '/admin/login';
    const isAdminArea = pathname.startsWith('/admin') && !isAdminLogin;

    if (isAdminLogin) {
        return <main className="min-h-screen">{children}</main>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {isAdminArea ? <AdminHeader /> : <Header cartCount={cartCount} />}
            <main className={`grow ${isAdminArea ? 'pt-16' : 'pt-20'}`}>
                {children}
            </main>
            {!isAdminArea && <Footer />}
        </div>
    );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <CartProvider>
                <AppContent>
                    {children}
                </AppContent>
            </CartProvider>
        </AuthProvider>
    );
};
