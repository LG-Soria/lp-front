'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Product } from '@/types';

interface SearchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
    const [isRendered, setIsRendered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            // Small delay to trigger transition after mounting
            const timer = setTimeout(() => setIsVisible(true), 10);
            document.body.style.overflow = 'hidden';
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setIsRendered(false);
                // Reset search state when closing
                setSearchQuery('');
                setSearchResults([]);
            }, 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Debounce search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const debounceTimer = setTimeout(async () => {
            try {
                const results = await apiService.searchProducts(searchQuery);
                setSearchResults(results);
            } catch (error) {
                console.error('Error searching products:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleProductClick = (productId: string) => {
        router.push(`/producto/${productId}`);
        onClose();
    };

    if (!isRendered) return null;

    return (
        <div className={`fixed inset-0 z-100 transition-visibility ${isVisible ? 'visible' : 'invisible delay-300'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full bg-white">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <img
                                src="/logo.png"
                                alt="Locas Puntadas"
                                className="h-16 w-auto object-contain mb-3"
                            />
                            <h2 className="text-2xl font-serif italic text-gray-800 mb-6">Búsqueda</h2>

                            <div className="w-full relative">
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-12 px-6 rounded-full border-2 border-gray-100 focus:border-coral focus:outline-none transition-colors pr-12 text-gray-700 bg-white"
                                    autoFocus={isOpen}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {isSearching ? (
                                        <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {!searchQuery.trim() ? (
                            <div className="text-center text-gray-400 mt-12">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-sm">Escribe para buscar productos</p>
                            </div>
                        ) : searchResults.length === 0 && !isSearching ? (
                            <div className="text-center text-gray-400 mt-12">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-medium mb-1">No se encontraron resultados</p>
                                <p className="text-xs">Intenta con otro término de búsqueda</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {searchResults.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-rosa-pastel/30 transition-colors text-left group cursor-pointer"
                                    >
                                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                            {product.imagenes && product.imagenes.length > 0 ? (
                                                <img
                                                    src={product.imagenes[0]}
                                                    alt={product.nombre}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate group-hover:text-coral transition-colors">
                                                {product.nombre}
                                            </h3>
                                            {product.descripcion && (
                                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                                    {product.descripcion}
                                                </p>
                                            )}
                                            {product.precio && (
                                                <p className="text-sm font-semibold text-coral mt-2">
                                                    ${product.precio.toLocaleString('es-AR')}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchDrawer;
