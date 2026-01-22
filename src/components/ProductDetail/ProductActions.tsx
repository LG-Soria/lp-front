'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface ProductActionsProps {
    product: Product;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
    const router = useRouter();
    const { addToCart } = useCart();

    const handleAction = () => {
        addToCart(product);
        router.push('/carrito');
    };

    return (
        <div className="space-y-6">
            <button
                onClick={handleAction}
                className="w-full group relative overflow-hidden bg-coral text-white py-6 rounded-full font-bold text-2xl shadow-xl shadow-rose-200/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                <span className="relative z-10">
                    Lo quiero para mí
                </span>
                <div className="absolute inset-0 bg-coral-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            <div className="flex items-center justify-center gap-6">
                <a
                    href="https://wa.me/123456789"
                    className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 transition-all flex items-center gap-2 hover:text-coral"
                >
                    ¿Tenés dudas? Escribinos
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
            </div>
        </div>
    );
};
