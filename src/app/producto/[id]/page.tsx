'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiService } from '@/services/apiService';
import { Product, ProductType } from '@/types';
import { SmileyFlowerDoodle, StarDoodle, TapeDoodle, StickerDoodle, HeartDoodle, WavyLine } from '@/components/doodles';
import { WavyCheckerboardBackground } from '@/components/background/WavyCheckerboardBg';
import { useCart } from '@/context/CartContext';
import { PersonalizableBanner } from '@/components/PersonalizableBanner';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(0);

    useEffect(() => {
        apiService.getProductById(id).then(data => {
            setProduct(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <WavyCheckerboardBackground />
                <div className="w-16 h-16 border-4 border-coral border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="relative min-h-screen flex flex-col items-center justify-center">
                <WavyCheckerboardBackground />
                <div className="bg-white p-12 rounded-[40px] shadow-2xl rotate-2 relative z-10">
                    <h2 className="text-3xl font-heading mb-6">Ups, el producto no está</h2>
                    <Link href="/categorias" className="text-coral font-bold underline text-xl">Volver al catálogo</Link>
                </div>
            </div>
        );
    }

    const handleAction = () => {
        if (product.tipo === ProductType.PERSONALIZADO) {
            window.open('https://wa.me/123456789', '_blank');
        } else {
            addToCart(product);
            router.push('/carrito');
        }
    };

    const getBadgeInfo = () => {
        switch (product.tipo) {
            case ProductType.STOCK: return { text: 'Stock', color: '#10B981' };
            case ProductType.PEDIDO: return { text: 'Hecho hoy', color: '#8B5CF6' };
            case ProductType.PERSONALIZADO: return { text: 'Único', color: '#dc1537' };
            default: return { text: 'Artesanal', color: '#dc1537' };
        }
    };

    const badge = getBadgeInfo();

    return (
        <div className="min-h-screen relative py-20 px-4 md:px-12 lg:px-24">
            <WavyCheckerboardBackground />

            {/* Navegación sutil */}
            <div className="container mx-auto max-w-7xl mb-12 relative z-20">
                <Link
                    href="/categorias"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-gray-800 hover:bg-white transition-all shadow-lg shadow-pink-200/20"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Volver al catálogo
                </Link>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <StarDoodle className="absolute -top-12 -right-8 w-24 h-24 text-white opacity-80 z-20" />
                <SmileyFlowerDoodle className="absolute -bottom-20 -left-10 w-48 h-48 text-white opacity-30 z-20 animate-spin-slow" />

                {/* Contenedor principal: Color hueso/beige muy suave (#fcfaf2) con puntitos sutiles */}
                <div className="bg-[#fcfaf2] backdrop-blur-md bg-doodle-dots rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative border-8 border-white overflow-visible">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* Columna de Imagen - Estilo Foto Pegada */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center justify-start bg-rosa-pastel/5 border-r border-rosa-pastel/10 lg:rounded-l-[52px]">
                            <div className="relative w-full group">
                                <TapeDoodle color="#e9bbff" className="absolute -top-4 -left-6 z-30 -rotate-45 w-24" />
                                <TapeDoodle color="#f89eb6" className="absolute -bottom-4 -right-6 z-30 -rotate-45 w-24" />

                                <div className="relative aspect-4/5 rounded-[32px] overflow-hidden bg-white border-12 border-white shadow-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700">
                                    <img
                                        src={product.imagenes[selectedImg]}
                                        alt={product.nombre}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />

                                    <StickerDoodle
                                        text={badge.text}
                                        color={badge.color}
                                        className="absolute top-4 right-4 z-30 scale-125 rotate-12"
                                    />
                                </div>

                                <HeartDoodle className="absolute -bottom-10 -left-10 w-24 h-24 text-coral opacity-20 hidden md:block" />
                            </div>

                            {/* Selector de imágenes (Miniaturas) */}
                            {product.imagenes.length > 1 && (
                                <div className="mt-12 flex flex-wrap gap-4 w-full justify-center">
                                    {product.imagenes.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImg(idx)}
                                            className={`w-20 h-20 rounded-2xl border-4 shadow-md overflow-hidden shrink-0 rotate-2 hover:rotate-0 transition-all ${selectedImg === idx ? 'border-coral scale-110 rotate-0 z-10' : 'border-white opacity-70'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt={`Miniatura ${idx + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Columna de Contenido */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col">
                            <div className="grow">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-coral/10 px-4 py-2 rounded-full border border-coral/20 flex items-center gap-2 transform -rotate-1">
                                        <StarDoodle className="w-4 h-4 text-coral opacity-60" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-coral/80 flex items-center gap-2">
                                            Categoría — {product.category?.nombre}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-script text-gray-900 mb-8 leading-[1.1]">
                                    {product.nombre}
                                </h1>

                                <div className="flex items-center gap-4 mb-10">
                                    {/* Fondo del precio con estilo personalizado mantenido */}
                                    <div className="bg-coral/90 text-gray-900 px-8 py-4 rounded-3xl font-bold text-4xl shadow-[0_10px_20px_-5px_rgba(220,21,55,0.4)] border border-white/50 transform hover:scale-105 transition-transform">
                                        {product.precio ? `$${product.precio.toLocaleString('es-AR')}` : 'Consultar'}
                                    </div>
                                    {product.tipo === ProductType.STOCK && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-green-600 font-extrabold uppercase tracking-widest animate-pulse">¡Listo para enviar!</span>
                                            <span className="text-xs text-gray-400 font-medium italic">Pieza única</span>
                                        </div>
                                    )}
                                </div>

                                <div className="relative mb-12">
                                    <WavyLine className="w-32 text-coral opacity-100 mb-6" color="#dc1537" />
                                    <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                        {product.descripcion}
                                    </p>
                                </div>

                                {product.personalizable && (
                                    <PersonalizableBanner
                                        productName={product.nombre}
                                        productUrl={typeof window !== 'undefined' ? window.location.href : ''}
                                    />
                                )}

                                {/* Detalles de producción estilo "Frosted Glass" con blur */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                    <div className="bg-lila-suave/40 backdrop-blur-md p-6 rounded-[30px] border-2 border-dashed border-purple-300 transform -rotate-1 shadow-sm">
                                        <h3 className="text-[11px] font-black text-purple-900 mb-3 uppercase tracking-widest flex items-center gap-2">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 2v20m10-10H2" /></svg>
                                            Tiempo estimado
                                        </h3>
                                        <p className="text-sm text-purple-800 font-extrabold">
                                            {product.tiempoProduccion}
                                        </p>
                                    </div>
                                    <div className="bg-rose-50/40 backdrop-blur-md p-6 rounded-[30px] border-2 border-dashed border-rose-300 transform rotate-1 shadow-sm">
                                        <h3 className="text-[11px] font-black text-rose-900 mb-3 uppercase tracking-widest flex items-center gap-2">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                            Cuidado amoroso
                                        </h3>
                                        <p className="text-sm text-rose-800 font-bold italic">
                                            Lavar a mano, secar plano.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones Finales */}
                            <div className="space-y-6">
                                <button
                                    onClick={handleAction}
                                    className="w-full group relative overflow-hidden bg-coral text-white py-6 rounded-full font-bold text-2xl shadow-xl shadow-rose-200/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span className="relative z-10">
                                        {product.tipo === ProductType.PERSONALIZADO ? 'Consultar diseño' : 'Lo quiero para mí'}
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
                        </div>
                    </div>
                </div>

                {/* Decoración inferior */}
                <div className="mt-20 flex justify-center opacity-40">
                    <WavyLine className="w-64" color="white" />
                </div>
            </div>
        </div>
    );
}
