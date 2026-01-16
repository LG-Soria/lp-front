'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { StarDoodle, StitchDivider, TapeDoodle, WavyLine, SmileyFlowerDoodle } from '@/components/doodles';
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

    // Generate dynamic styles for categories
    const getCategoryStyle = (catName: string, index: number) => {
        const cat = categories.find(c => c.nombre === catName);
        const baseColor = cat?.color || '#FF69B4'; // Rosa por defecto

        // Rotación alternada
        const rotate = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
        const rotateReverse = index % 2 === 0 ? '-rotate-1' : 'rotate-1';

        return {
            color: baseColor,
            rotate,
            rotateReverse,
            // Usamos un fondo muy suave basado en el color si no es "Todas"
            bg: catName === 'Todas' ? 'bg-white' : 'bg-white',
            border: catName === 'Todas' ? 'border-gray-100' : `border-transparent`
        };
    };

    return (
        <div className="container mx-auto px-8 md:px-16 lg:px-24 py-20 min-h-screen bg-doodle-dots relative">
            {/* ... doodles ... */}
            <StarDoodle className="absolute top-10 right-10 w-32 h-32 text-coral opacity-5 animate-pulse" />
            <SmileyFlowerDoodle className="absolute bottom-10 left-10 w-40 h-40 text-lila-suave opacity-5" />

            <header className="mb-20 text-center lg:text-left">
                <h1 className="text-6xl md:text-7xl font-heading font-bold text-gray-900 mb-6">
                    Nuestras <br /> <span className="font-script text-coral text-7xl md:text-8xl">Colecciones</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl font-medium">
                    Explorá nuestras piezas artesanales organizadas por categoría. Cada una tejida con dedicación.
                </p>
            </header>

            {/* Category Navigation */}
            <div className="flex flex-wrap items-center gap-8 mb-16 relative z-10">
                {allCategoryNames.map((catName, i) => {
                    const isActive = activeCategory === catName;
                    const style = getCategoryStyle(catName, i);

                    return (
                        <div key={catName} className="relative group">
                            {isActive && (
                                <TapeDoodle
                                    color={style.color}
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 scale-110 transition-transform duration-500"
                                />
                            )}
                            <button
                                onClick={() => setActiveCategory(catName)}
                                className={`
                                    relative px-10 py-5 font-heading font-extrabold text-xl transition-all duration-300
                                    ${isActive ? 'shadow-xl shadow-gray-200/50 -translate-y-2' : 'shadow-sm border border-gray-100/50 hover:rotate-0'}
                                    ${style.rotate} rounded-sm bg-white
                                `}
                                style={{
                                    color: isActive ? style.color : '#9CA3AF',
                                    borderColor: isActive ? `${style.color}30` : undefined,
                                    boxShadow: isActive ? `0 20px 25px -5px ${style.color}15` : undefined
                                }}
                            >
                                {catName}
                                <div
                                    className={`absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                                    style={{ backgroundColor: style.color }}
                                ></div>

                                {isActive && (
                                    <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full animate-ping opacity-20" style={{ backgroundColor: style.color }}></div>
                                )}
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
