'use client';

import React from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const PublicContent = ({ children }: { children: React.ReactNode }) => {
    const { cartCount } = useCart();

    return (
        <div className="min-h-screen flex flex-col">
            <Header cartCount={cartCount} />
            <main className="grow pt-20">{children}</main>
            <Footer />
        </div>
    );
};

export const PublicShell = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <CartProvider>
                <PublicContent>{children}</PublicContent>
            </CartProvider>
        </AuthProvider>
    );
};
