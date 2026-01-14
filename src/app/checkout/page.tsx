'use client';

import React, { useState } from 'react';
import { ProductType } from '@/types';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart: items, clearCart } = useCart();
    const [submitted, setSubmitted] = useState(false);
    const subtotal = items.reduce((acc, item) => acc + (item.precio || 0) * item.quantity, 0);
    const hasPedido = items.some(item => item.tipo === ProductType.PEDIDO);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        clearCart();
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-32 text-center max-w-xl">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-heading font-bold mb-4">¡Muchas gracias!</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Tu pedido ha sido recibido. Te contactaremos por WhatsApp a la brevedad para coordinar los detalles finales y el envío.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-rosa-pastel text-coral px-8 py-3 rounded-md font-bold hover:bg-rosa-empolvado transition-colors"
                >
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <h1 className="text-4xl font-heading font-bold mb-4">Carrito vacío</h1>
                <Link href="/categorias" className="text-coral underline font-bold">Volver al catálogo</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <h1 className="text-4xl font-heading font-bold mb-4">Finalizar compra</h1>
                <p className="text-gray-600 mb-8">Completá tus datos para coordinar el envío de tu pedido.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Nombre</label>
                            <input required type="text" className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Apellido</label>
                            <input required type="text" className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</label>
                        <input required type="email" className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">WhatsApp de contacto</label>
                        <input required type="tel" placeholder="Ej: 11 1234 5678" className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Dirección de envío</label>
                        <input required type="text" className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                    </div>

                    <div className="bg-lila-suave p-6 rounded-xl border border-purple-100">
                        <h3 className="font-heading text-lg font-bold mb-4">Pago seguro</h3>
                        <p className="text-sm text-gray-600 mb-4">Pagá de forma simple y confiable a través de Mercado Pago.</p>
                        <p className="text-xs text-gray-400 italic">No guardamos datos de tu tarjeta.</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-coral text-white py-4 rounded-lg font-bold text-lg shadow-lg shadow-red-100 transition-all hover:scale-[1.01] cursor-pointer"
                    >
                        Confirmar compra
                    </button>
                </form>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                    <h2 className="font-heading text-2xl font-bold mb-6">Resumen del pedido</h2>
                    <div className="space-y-4 mb-8">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.quantity}x {item.nombre}</span>
                                <span className="font-bold">${((item.precio || 0) * item.quantity).toLocaleString('es-AR')}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-6 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Envío</span>
                            <span className="text-gray-500 italic text-sm">A coordinar por WhatsApp</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xl font-heading font-bold">Total</span>
                            <span className="text-2xl font-bold">${subtotal.toLocaleString('es-AR')}</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        {hasPedido && (
                            <div className="p-3 bg-lila-suave rounded-md border border-purple-100">
                                <p className="text-[11px] text-purple-800 leading-tight">
                                    <strong>Recordatorio:</strong> El envío se realizará una vez finalizados los productos por pedido.
                                </p>
                            </div>
                        )}
                        <p className="text-[11px] text-gray-400 text-center uppercase tracking-widest">
                            Sujeto a disponibilidad artesanal
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
