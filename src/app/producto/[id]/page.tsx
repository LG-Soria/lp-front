import React from 'react';
import Link from 'next/link';
import { apiService } from '@/services/apiService';
import { Product, ProductType } from '@/types';
import { SmileyFlowerDoodle, StarDoodle, WavyLine } from '@/components/doodles';
import dynamic from 'next/dynamic';
import { PersonalizableBanner } from '@/components/PersonalizableBanner';
import { ProductImageGallery } from '@/components/ProductDetail/ProductImageGallery';
import { ProductActions } from '@/components/ProductDetail/ProductActions';
import { ClientWavyBackground } from '@/components/background/ClientWavyBackground';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await apiService.getProductById(id);

    if (!product) {
        return (
            <div className="relative min-h-screen flex flex-col items-center justify-center">
                <ClientWavyBackground />
                <div className="bg-white p-12 rounded-[40px] shadow-2xl rotate-2 relative z-10">
                    <h2 className="text-3xl font-heading mb-6">Ups, el producto no está</h2>
                    <Link href="/categorias" className="text-coral font-bold underline text-xl">Volver al catálogo</Link>
                </div>
            </div>
        );
    }

    const getBadgeInfo = () => {
        // Priorizar etiqueta personalizada si existe
        if (product.label) {
            switch (product.label) {
                case 'Novedades': return { text: 'Novedades', color: '#FB7185' };
                case 'Best Seller': return { text: 'Best Seller', color: '#7C3AED' };
                case 'Locamente Favoritos': return { text: 'Favorito', color: '#F472B6' };
                default: return { text: product.label, color: '#dc1537' };
            }
        }

        switch (product.tipo) {
            case ProductType.STOCK: return { text: 'Stock', color: '#10B981' };
            case ProductType.PEDIDO: return { text: 'A pedido', color: '#8B5CF6' };
            default: return { text: 'Artesanal', color: '#dc1537' };
        }
    };

    const badge = getBadgeInfo();

    return (
        <div className="min-h-screen relative py-20 px-4 md:px-12 lg:px-24">
            <ClientWavyBackground />

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
                        <ProductImageGallery imagenes={product.imagenes} nombre={product.nombre} badge={badge} />

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
                                        productUrl=""
                                    />
                                )}

                                {/* Detalles de producción estilo "Frosted Glass" con blur */}
                                {product.tipo === ProductType.PEDIDO && product.tiempoProduccion && (
                                    <div className="mb-12">
                                        <div className="bg-lila-suave/40 backdrop-blur-md p-6 rounded-[30px] border-2 border-dashed border-purple-300 transform -rotate-1 shadow-sm">
                                            <h3 className="text-[11px] font-black text-purple-900 mb-3 uppercase tracking-widest flex items-center gap-2">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 2v20m10-10H2" /></svg>
                                                Tiempo estimado
                                            </h3>
                                            <p className="text-sm text-purple-800 font-extrabold">
                                                {product.tiempoProduccion}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Acciones Finales */}
                            <ProductActions product={product} />
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
