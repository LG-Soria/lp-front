'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { CATEGORIES } from '@/constants';
import { StarDoodle, StitchDivider, TapeDoodle, WavyLine } from '@/components/doodles';
import { Product, ProductType, Category } from '@/types';
import { ProductCard } from '@/components/ProductCard';

export default function CategoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('Todas');
    const [activeType, setActiveType] = useState<ProductType | null>(ProductType.STOCK);

    useEffect(() => {
        Promise.all([
            apiService.getProducts(),
            apiService.getCategories()
        ]).then(([productsData, categoriesData]) => {
            setProducts(productsData);
            setCategories(categoriesData);
            setLoading(false);
        });
    }, []);

    // Filtrado combinado: Categoría + Tipo de disponibilidad
    const filteredProducts = products.filter((product: Product) => {
        const matchesCategory = activeCategory === 'Todas' || product.category?.nombre === activeCategory;
        const matchesType = !activeType || product.tipo === activeType;
        return matchesCategory && matchesType;
    });

    const allCategoryNames = ['Todas', ...categories.map(c => c.nombre)];

    const handleTypeToggle = (type: ProductType) => {
        setActiveType((prev: ProductType | null) => prev === type ? null : type);
    };

    const catStyles: Record<string, { bg: string, color: string, rotate: string }> = {
        'Todas': { bg: 'bg-white', color: '#374151', rotate: '-rotate-2' },
        'Hogar': { bg: 'bg-rosa-pastel', color: '#dc1537', rotate: 'rotate-1' },
        'Indumentaria': { bg: 'bg-lila-suave', color: '#7C3AED', rotate: '-rotate-1' },
        'Niños': { bg: 'bg-orange-50', color: '#F59E0B', rotate: 'rotate-2' },
    };

    return (
        // Se aumentó el padding horizontal (px-8 md:px-16 lg:px-24) para dar más aire a los costados
        <div className="container mx-auto px-8 md:px-16 lg:px-24 py-20 min-h-screen bg-doodle-dots relative">
            {/* Estrellas decorativas de fondo */}
            <StarDoodle className="absolute top-40 right-10 w-24 h-24 text-[#f89eb6] opacity-80 rotate-12" />
            <StarDoodle className="absolute bottom-20 left-10 w-20 h-20 text-[#f89eb6] opacity-60 -rotate-12" />
            <StarDoodle className="absolute top-1/2 left-1/4 w-12 h-12 text-[#f89eb6] opacity-40 rotate-45" />

            <div className="max-w-4xl mb-24 relative z-10">
                <StarDoodle className="absolute -top-14 -left-12 w-24 h-24 text-[#d97891] opacity-100 z-30 drop-shadow-sm" />

                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-gray-900 relative">
                    Explorá el <span className="font-script text-coral">catálogo</span>
                </h1>
                <p className="text-xl text-gray-800/70 font-medium leading-relaxed max-w-2xl">
                    Piezas únicas que no salen de un molde, sino de un proceso lento y dedicado.
                    Buscá la que resuene con vos.
                </p>
                <WavyLine className="w-32 text-coral/30 mt-6" />
            </div>

            {/* Categorías estilo Scrapbook Tags */}
            <div className="flex flex-wrap items-center gap-8 mb-12 relative z-10">
                {allCategoryNames.map((cat) => {
                    const isActive = activeCategory === cat;
                    const style = catStyles[cat] || catStyles['Todas'];

                    return (
                        <div key={cat} className="relative group">
                            {isActive && (
                                <TapeDoodle
                                    color={style.color}
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 scale-110"
                                />
                            )}

                            <button
                                onClick={() => setActiveCategory(cat)}
                                className={`
                  relative px-10 py-4 font-heading font-extrabold text-lg transition-all duration-300
                  ${style.bg} ${isActive ? 'shadow-xl shadow-gray-200/50 -translate-y-1' : 'shadow-sm border border-gray-100 hover:rotate-0'}
                  ${style.rotate} rounded-sm
                `}
                                style={{ color: isActive ? style.color : '#9CA3AF' }}
                            >
                                {cat}
                                <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 opacity-0 group-hover:opacity-20 transition-opacity`} style={{ backgroundColor: style.color }}></div>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Filtros de Tipo de Producto (Antes informativos, ahora interactivos) */}
            <div className="bg-white/90 backdrop-blur-sm p-4 md:p-8 rounded-[40px] border border-white/20 shadow-sm mb-20 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden z-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rosa-pastel/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                {/* Filtro: En Stock */}
                <button
                    onClick={() => handleTypeToggle(ProductType.STOCK)}
                    className={`flex items-center space-x-5 p-4 rounded-3xl transition-all duration-300 text-left group relative z-10
            ${activeType === ProductType.STOCK
                            ? 'bg-green-50/80 ring-2 ring-green-500 shadow-md translate-y-[-2px]'
                            : 'hover:bg-gray-50 opacity-70 hover:opacity-100'}`}
                >
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-green-500 group-hover:rotate-12 transition-transform shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-800 flex items-center gap-2">
                            En stock
                            {activeType === ProductType.STOCK && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">Listos para que los abraces.</p>
                    </div>
                </button>

                {/* Filtro: Por Pedido */}
                <button
                    onClick={() => handleTypeToggle(ProductType.PEDIDO)}
                    className={`flex items-center space-x-5 p-4 rounded-3xl transition-all duration-300 text-left group relative z-10
            ${activeType === ProductType.PEDIDO
                            ? 'bg-purple-50/80 ring-2 ring-purple-500 shadow-md translate-y-[-2px]'
                            : 'hover:bg-gray-50 opacity-70 hover:opacity-100'}`}
                >
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-purple-500 group-hover:rotate-12 transition-transform shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-800 flex items-center gap-2">
                            Por pedido
                            {activeType === ProductType.PEDIDO && <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">Tejemos mientras esperás.</p>
                    </div>
                </button>

                {/* Filtro: Personalizado */}
                <button
                    onClick={() => handleTypeToggle(ProductType.PERSONALIZADO)}
                    className={`flex items-center space-x-5 p-4 rounded-3xl transition-all duration-300 text-left group relative z-10
            ${activeType === ProductType.PERSONALIZADO
                            ? 'bg-rose-50/80 ring-2 ring-coral shadow-md translate-y-[-2px]'
                            : 'hover:bg-gray-50 opacity-70 hover:opacity-100'}`}
                >
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-coral group-hover:rotate-12 transition-transform shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-800 flex items-center gap-2">
                            Personalizado
                            {activeType === ProductType.PERSONALIZADO && <span className="w-2 h-2 bg-coral rounded-full animate-pulse"></span>}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">Diseños a tu medida.</p>
                    </div>
                </button>
            </div>

            {/* Grid de productos */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 bg-white/50 backdrop-blur-sm rounded-[60px] border-2 border-dashed border-white/30 z-10 relative">
                    <div className="mb-6 opacity-20 inline-block">
                        <StarDoodle className="w-20 h-20 text-[#f89eb6]" />
                    </div>
                    <p className="text-gray-600 text-xl font-medium italic">No encontramos tesoros con estos filtros...</p>
                    <button
                        onClick={() => {
                            setActiveCategory('Todas');
                            setActiveType(null);
                        }}
                        className="mt-6 text-coral font-bold text-lg underline hover:text-coral-dark transition-colors"
                    >
                        Limpiar filtros y ver todo
                    </button>
                </div>
            )}

            <div className="mt-40 relative z-10">
                <StitchDivider />
            </div>
        </div>
    );
}
