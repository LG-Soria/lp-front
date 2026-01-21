'use client';

import React, { useState, useEffect } from 'react';
import { ProductType } from '@/types';
import { useCart } from '@/context/CartContext';
import { apiService } from '@/services/apiService';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart: items, clearCart } = useCart();
    const [step, setStep] = useState(1); // 1: Datos, 2: Envío
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bypassShipping, setBypassShipping] = useState(false);

    const subtotal = items.reduce((acc, item) => acc + (item.precio || 0) * item.quantity, 0);
    const hasPedido = items.some(item => item.tipo === ProductType.PEDIDO);

    // Form states
    const [customer, setCustomer] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
    });

    const [address, setAddress] = useState({
        line1: '',
        city: '',
        province: '',
        postalCode: '',
    });

    const [quotes, setQuotes] = useState<any[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<any>(null);
    const [loadingQuotes, setLoadingQuotes] = useState(false);

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (hasPedido) {
            // Si tiene productos por pedido, vamos directo a finalizar (WhatsApp)
            handleFinalizeRequest();
            return;
        }

        if (bypassShipping) {
            const bypassQuote = {
                mode: 'PICKUP',
                provider: 'internal',
                costCents: 0,
                description: 'Retiro en punto de venta (Bypass)'
            };
            setQuotes([bypassQuote]);
            setSelectedQuote(bypassQuote);
            setStep(2);
            return;
        }

        // Si es solo stock, vamos a la etapa de envío
        setStep(2);
        fetchQuotes();
    };

    const fetchQuotes = async () => {
        if (!address.postalCode) return;
        setLoadingQuotes(true);
        try {
            const quoteItems = items.map(item => ({ productId: item.id, quantity: item.quantity }));
            const response = await apiService.getShippingQuotes(address.postalCode, quoteItems);
            setQuotes(response.quotes);
            // Seleccionar el primero por defecto
            if (response.quotes.length > 0) {
                setSelectedQuote(response.quotes[0]);
            }
        } catch (err: any) {
            setError("No pudimos calcular el envío. Por favor revisá el código postal.");
        } finally {
            setLoadingQuotes(false);
        }
    };

    const handleFinalizeRequest = async () => {
        setSubmitting(true);
        try {
            // Caso para productos por pedido: creamos un request por cada item (según backend actual)
            // O podríamos esperar a que el backend acepte múltiples, pero por ahora seguimos la lógica de "contactar"
            for (const item of items) {
                if (item.tipo === ProductType.PEDIDO) {
                    await apiService.createRequest({
                        productId: item.id,
                        customerName: `${customer.name} ${customer.lastname}`,
                        email: customer.email,
                        phone: customer.phone,
                        postalCode: address.postalCode,
                        description: `Pedido desde checkout. Dirección: ${address.line1}, ${address.city}`
                    });
                }
            }
            setSubmitted(true);
            clearCart();
        } catch (err: any) {
            setError("Ocurrió un error al procesar tu solicitud. Por favor contactanos por WhatsApp.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmPurchase = async () => {
        if (!selectedQuote && !hasPedido) {
            setError("Por favor seleccioná un método de envío.");
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            // 1. Crear Orden
            const checkoutData = {
                items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
                customer: {
                    email: customer.email,
                    name: `${customer.name} ${customer.lastname}`,
                    phone: customer.phone
                },
                delivery: {
                    mode: selectedQuote.mode,
                    postalCode: address.postalCode,
                    address: selectedQuote.mode === 'HOME' ? {
                        line1: address.line1,
                        city: address.city,
                        province: address.province,
                        postalCode: address.postalCode
                    } : undefined
                }
            };

            const order = await apiService.createCheckout(checkoutData);

            // 2. Crear Preferencia de Mercado Pago
            const { initPointUrl } = await apiService.createMPPreference(order.orderId);

            // 3. Redirigir a Mercado Pago
            window.location.href = initPointUrl;

            // Nota: El carrito se limpia después de que el webhook confirme el pago, 
            // aunque aquí el usuario deja la página. 
            // En un flujo ideal, limpiaríamos si el pago es exitoso.
        } catch (err: any) {
            setError(err.message || "Error al procesar el pago. Intentá nuevamente.");
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-32 text-center max-w-xl animate-fade-in">
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
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="mb-12 flex items-center justify-center gap-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-coral' : 'text-gray-300'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-coral bg-coral text-white' : 'border-gray-200'}`}>1</span>
                    <span className="text-sm font-bold uppercase tracking-wider">Tus Datos</span>
                </div>
                <div className={`w-12 h-px ${step >= 2 ? 'bg-coral' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-coral' : 'text-gray-300'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-coral bg-coral text-white' : 'border-gray-200'}`}>2</span>
                    <span className="text-sm font-bold uppercase tracking-wider">Envío</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    {step === 1 ? (
                        <div className="animate-slide-up">
                            <h1 className="text-4xl font-heading font-bold mb-4">Finalizar compra</h1>
                            <p className="text-gray-600 mb-8">Completá tus datos para coordinar {hasPedido ? 'tu pedido' : 'tu compra'}.</p>

                            <form onSubmit={handleInfoSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Nombre</label>
                                        <input required type="text" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Apellido</label>
                                        <input required type="text" value={customer.lastname} onChange={e => setCustomer({ ...customer, lastname: e.target.value })} className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</label>
                                    <input required type="email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">WhatsApp de contacto</label>
                                    <input required type="tel" placeholder="Ej: 11 1234 5678" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 flex flex-col">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">CP</label>
                                        <input required type="text" value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                                    </div>
                                    <div className="col-span-2 flex flex-col">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Dirección (Calle y Altura)</label>
                                        <input required type="text" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-rosa-empolvado" />
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">🧪</div>
                                        <div>
                                            <p className="text-sm font-bold text-blue-800">Modo de Pruebas (Bypass Envío)</p>
                                            <p className="text-[11px] text-blue-600 font-medium">Saltear cálculo de Envíopack e ir directo al pago.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={bypassShipping} onChange={() => setBypassShipping(!bypassShipping)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-coral text-white py-4 rounded-lg font-bold text-lg shadow-lg shadow-red-100 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? 'Cargando...' : hasPedido ? 'Confirmar pedido por WhatsApp' : bypassShipping ? 'Continuar directo al pago' : 'Ver opciones de envío'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="animate-slide-up">
                            <button onClick={() => setStep(1)} className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-coral mb-4 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                                Volver a mis datos
                            </button>
                            <h2 className="text-3xl font-heading font-bold mb-4">Elegí tu envío</h2>
                            <p className="text-gray-600 mb-8">Todos nuestros envíos se realizan cuidadosamente.</p>

                            {bypassShipping && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 animate-pulse">
                                    <div className="text-blue-500 text-lg">🧪</div>
                                    <p className="text-sm text-blue-800 font-medium">
                                        <strong>Bypass activo:</strong> Se está utilizando un método de retiro ficticio para saltar la integración de Envíopack.
                                    </p>
                                </div>
                            )}

                            {loadingQuotes ? (
                                <div className="flex flex-col items-center py-12 text-gray-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral mb-4"></div>
                                    <p className="text-sm font-bold">Calculando costos...</p>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100 flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            ) : (
                                <div className="space-y-4 mb-8">
                                    {quotes.map((quote, idx) => (
                                        <label
                                            key={idx}
                                            className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedQuote === quote ? 'border-coral bg-rosa-pastel/10' : 'border-gray-100 hover:border-rosa-empolvado'}`}
                                            onClick={() => setSelectedQuote(quote)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedQuote === quote ? 'border-coral' : 'border-gray-300'}`}>
                                                        {selectedQuote === quote && <div className="w-2.5 h-2.5 rounded-full bg-coral"></div>}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800">{quote.description || (quote.mode === 'HOME' ? 'Envío a domicilio' : quote.mode === 'BRANCH' ? 'Retiro en sucursal' : 'Retiro en punto de venta')}</div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-widest">{quote.provider === 'internal' ? 'Locas Puntadas' : 'Envíopack'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold text-coral">
                                                    {quote.costCents === 0 ? '¡GRATIS!' : `$${(quote.costCents / 100).toLocaleString('es-AR')}`}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleConfirmPurchase}
                                disabled={submitting || loadingQuotes || !selectedQuote}
                                className="w-full bg-coral text-white py-4 rounded-lg font-bold text-lg shadow-lg shadow-red-100 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                            >
                                {submitting ? 'Procesando...' : 'Ir a pagar con Mercado Pago'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:sticky lg:top-24 h-fit">
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xl shadow-lila-suave/50 transition-all hover:shadow-2xl">
                        <h2 className="font-heading text-2xl font-bold mb-6">Resumen del pedido</h2>
                        <div className="space-y-4 mb-8">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm items-center">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-10 h-10 bg-gray-50 rounded overflow-hidden">
                                            {item.imagenes?.[0] && <img src={item.imagenes[0]} alt={item.nombre} className="w-full h-full object-cover" />}
                                        </div>
                                        <span className="text-gray-600 font-medium">{item.quantity}x {item.nombre}</span>
                                    </div>
                                    <span className="font-bold text-gray-800">${((item.precio || 0) * item.quantity).toLocaleString('es-AR')}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-6 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="font-bold text-gray-800">${subtotal.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Envío</span>
                                <span className={`font-bold ${selectedQuote ? 'text-coral' : 'text-gray-400 italic'}`}>
                                    {selectedQuote ? (selectedQuote.costCents === 0 ? 'Gratis' : `$${(selectedQuote.costCents / 100).toLocaleString('es-AR')}`) : 'Calculando...'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-100">
                                <span className="text-xl font-heading font-bold text-gray-800">Total</span>
                                <span className="text-3xl font-bold text-coral">${(subtotal + (selectedQuote ? selectedQuote.costCents / 100 : 0)).toLocaleString('es-AR')}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-lila-suave/30 border border-lila-suave rounded-xl">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-purple-800 uppercase tracking-tighter">Pago Seguro</p>
                                    <p className="text-[10px] text-purple-600">Integrado con Mercado Pago</p>
                                </div>
                            </div>
                            {hasPedido && (
                                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <p className="text-[11px] text-yellow-800 leading-tight">
                                        <strong>Nota:</strong> Tu carrito incluye productos por pedido. El costo final y los tiempos de entrega se coordinarán por WhatsApp.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
