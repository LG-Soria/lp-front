'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Product } from '@/types';
import Link from 'next/link';
import { StarDoodle, SmileyFlowerDoodle } from '@/components/doodles';

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiService.getProducts().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 md:p-12 lg:p-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-gray-900">Dashboard de <span className="text-coral">Admin</span></h1>
                        <p className="text-gray-500 font-medium">Gestioná tus creaciones artesanales.</p>
                    </div>
                    <button className="bg-coral text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-rose-200 hover:scale-105 transition-all">
                        + Nuevo Producto
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-coral border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Producto</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Categoría</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Precio</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Tipo</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                                                    <img src={product.imagenes[0]} alt={product.nombre} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold text-gray-900">{product.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-gray-600">{product.category?.nombre || 'Sin categoría'}</td>
                                        <td className="px-8 py-6 text-sm font-bold text-gray-900">
                                            {product.precio ? `$${product.precio.toLocaleString('es-AR')}` : '-'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${product.tipo === 'STOCK' ? 'bg-green-100 text-green-700' :
                                                product.tipo === 'PEDIDO' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-rose-100 text-coral'
                                                }`}>
                                                {product.tipo}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-3">
                                                <button className="text-gray-400 hover:text-coral transition-colors">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-12 text-center text-gray-400 text-xs font-medium italic">
                    Hecho con amor por el Equipo de Locas Puntadas.
                </div>
            </div>
        </div>
    );
}
