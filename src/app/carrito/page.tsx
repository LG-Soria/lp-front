'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductType } from '@/types';
import { ShoppingBagDoodle } from '@/components/doodles';
import { useCart } from '@/context/CartContext';
import { OptimizedImage } from '@/components/OptimizedImage';

export default function CartPage() {
    const router = useRouter();
    const { cart: items, removeFromCart: removeItem, updateQuantity } = useCart();

    const subtotal = items.reduce((acc, item) => acc + (item.precio || 0) * item.quantity, 0);
    const hasPedido = items.some(item => item.tipo === ProductType.PEDIDO);

    /**
     * Estado de carrito vacío: mostramos un doodle simpático
     * para invitar al usuario a seguir explorando.
     */
    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center">
                <ShoppingBagDoodle className="w-48 h-48 opacity-40 mb-8" />
                <h1 className="text-4xl font-heading font-bold mb-4">Tu carrito está vacío</h1>
                <p className="text-gray-500 mb-8 max-w-sm">Todavía no agregaste ningún producto artesanal. ¡Nuestras piezas te están esperando!</p>
                <Link href="/categorias" className="bg-coral text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-rose-200 hover:bg-coral-dark transition-all">
                    Ver catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
            <h1 className="text-4xl font-heading font-bold mb-4">Tu carrito</h1>
            <p className="text-gray-600 mb-8 font-medium">Revisá los productos seleccionados antes de continuar con la compra.</p>

            <div className="space-y-6">
                {items.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                            <OptimizedImage src={item.imagenes[0]} alt={item.nombre} className="w-full h-full object-cover" />
                        </div>
                        <div className="grow flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800">{item.nombre}</h3>
                                    <p className="text-xs text-coral font-bold uppercase tracking-widest">{item.category?.nombre}</p>
                                    {item.tipo === ProductType.PEDIDO && (
                                        <span className="text-xs text-purple-600 font-bold block mt-1 uppercase tracking-tighter">Producción: {item.tiempoProduccion}</span>
                                    )}
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors text-lg font-bold cursor-pointer">-</button>
                                    <span className="px-4 text-sm font-bold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors text-lg font-bold cursor-pointer">+</button>
                                </div>
                                <span className="text-xl font-bold text-gray-900">${((item.precio || 0) * item.quantity).toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen y notas de compra artesanal */}
            <div className="mt-12 bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-pink-50/50">
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-50">
                    <span className="text-xl font-bold text-gray-500">Subtotal</span>
                    <span className="text-3xl font-bold text-gray-900">${subtotal.toLocaleString('es-AR')}</span>
                </div>

                {hasPedido && (
                    <div className="mb-8 p-6 bg-lila-suave rounded-3xl border border-purple-100">
                        <p className="text-sm text-purple-900 leading-relaxed font-medium">
                            <strong className="block mb-1">Nota importante:</strong> Tu carrito contiene productos por pedido. El pedido completo se enviará una vez finalizado el último producto en producción. Para envíos separados, se deben realizar compras por separado.
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full bg-coral text-white py-5 rounded-full font-bold text-xl shadow-xl shadow-rose-200 hover:scale-[1.01] transition-all cursor-pointer"
                    >
                        Continuar con la compra
                    </button>
                    <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest italic">
                        Cada pieza artesanal es única y lleva su tiempo.
                    </p>
                </div>
            </div>
        </div>
    );
}
