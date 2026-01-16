'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Product, Category, ProductType } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StarDoodle, SmileyFlowerDoodle } from '@/components/doodles';

const PRODUCT_LABELS = [
    { value: '', label: 'Sin etiqueta' },
    { value: 'Best Seller', label: 'Best Seller' },
    { value: 'Hecho Hoy', label: 'Hecho Hoy' },
    { value: 'Favorito de la Casa', label: 'Favorito de la Casa' },
];

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const { token } = useAuth();

    // In-place editing state
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Product>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                apiService.getProducts(),
                apiService.getCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

        try {
            await apiService.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert('Error al eliminar el producto');
        }
    };

    const startEdit = (product: Product) => {
        setEditingProductId(product.id);
        setEditFormData({ ...product });
    };

    const cancelEdit = () => {
        setEditingProductId(null);
        setEditFormData({});
    };

    const handleSaveEdit = async () => {
        if (!editingProductId) return;
        setIsSaving(true);
        try {
            const updated = await apiService.updateProduct(editingProductId, editFormData);
            setProducts(products.map(p => p.id === editingProductId ? updated : p));
            setEditingProductId(null);
            setEditFormData({});
        } catch (error) {
            alert('Error al actualizar el producto');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpdate = async (productId: string, file: File) => {
        try {
            const { uploadUrl, publicUrl } = await apiService.getPresignedUrl(file.name, file.type);
            await apiService.uploadFileToR2(uploadUrl, file);

            if (editingProductId === productId) {
                setEditFormData(prev => ({ ...prev, imagenes: [publicUrl, ...(prev.imagenes?.slice(1) || [])] }));
            } else {
                const product = products.find(p => p.id === productId);
                if (product) {
                    const updated = await apiService.updateProduct(productId, {
                        imagenes: [publicUrl, ...product.imagenes.slice(1)]
                    });
                    setProducts(products.map(p => p.id === productId ? updated : p));
                }
            }
        } catch (error) {
            alert('Error al subir la imagen');
            console.error(error);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || product.category?.nombre === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Background Doodles */}
            <div className="absolute top-20 -left-10 opacity-20 rotate-12">
                <StarDoodle className="w-40 h-40 text-coral" />
            </div>
            <div className="absolute bottom-20 -right-10 opacity-20 -rotate-12">
                <SmileyFlowerDoodle className="w-48 h-48 text-coral" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-gray-900">Gestión de <span className="text-coral">Productos</span></h1>
                        <p className="text-gray-500 font-medium">Administrá tu catálogo con estilo artesanal.</p>
                    </div>
                    <Link
                        href="/admin/productos/nuevo"
                        className="bg-coral text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-rose-200 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <span>+ Nuevo Producto</span>
                    </Link>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[32px] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-coral transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <div className="w-full md:w-64 relative">
                        <select
                            className="w-full pl-6 pr-10 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium appearance-none transition-all cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="Todas">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                            ))}
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando productos...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Imagen</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Nombre</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Categoría</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Precio</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Tipo</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Etiqueta</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map(product => {
                                    const isEditing = editingProductId === product.id;
                                    return (
                                        <tr key={product.id} className={`${isEditing ? 'bg-pink-50/50' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className="px-8 py-6">
                                                <div className="relative group w-12 h-12 rounded-xl bg-gray-100 overflow-hidden cursor-pointer shadow-inner" onClick={() => document.getElementById(`file-input-${product.id}`)?.click()}>
                                                    {isEditing && editFormData.imagenes?.[0] ? (
                                                        <img src={editFormData.imagenes[0]} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : product.imagenes[0] ? (
                                                        <img src={product.imagenes[0]} alt={product.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id={`file-input-${product.id}`}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpdate(product.id, file);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-coral/20 outline-none text-sm font-bold shadow-inner"
                                                        value={editFormData.nombre}
                                                        onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                                                    />
                                                ) : (
                                                    <span className="font-bold text-gray-900 uppercase tracking-tight">{product.nombre}</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                {isEditing ? (
                                                    <select
                                                        className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-coral/20 outline-none text-sm font-medium shadow-inner cursor-pointer"
                                                        value={editFormData.categoryId}
                                                        onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="text-sm font-medium text-gray-600">{product.category?.nombre || 'Sin categoría'}</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-gray-900">
                                                {isEditing ? (
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                        <input
                                                            type="number"
                                                            className="w-28 pl-7 pr-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-coral/20 outline-none text-sm font-bold shadow-inner"
                                                            value={editFormData.precio || ''}
                                                            onChange={(e) => setEditFormData({ ...editFormData, precio: parseFloat(e.target.value) || null })}
                                                        />
                                                    </div>
                                                ) : (
                                                    product.precio ? `$${product.precio.toLocaleString('es-AR')}` : '-'
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium text-gray-600">
                                                {isEditing ? (
                                                    <select
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border-none cursor-pointer transition-colors shadow-sm outline-none ${editFormData.tipo === ProductType.STOCK ? 'bg-green-100 text-green-700' :
                                                            editFormData.tipo === ProductType.PEDIDO ? 'bg-purple-100 text-purple-700' :
                                                                'bg-rose-100 text-coral'
                                                            }`}
                                                        value={editFormData.tipo}
                                                        onChange={(e) => setEditFormData({ ...editFormData, tipo: e.target.value as ProductType })}
                                                    >
                                                        <option value={ProductType.STOCK} className="bg-white text-gray-900">STOCK</option>
                                                        <option value={ProductType.PEDIDO} className="bg-white text-gray-900">PEDIDO</option>
                                                        <option value={ProductType.PERSONALIZADO} className="bg-white text-gray-900">PERSONALIZADO</option>
                                                    </select>
                                                ) : (
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${product.tipo === ProductType.STOCK ? 'bg-green-100 text-green-700' :
                                                        product.tipo === ProductType.PEDIDO ? 'bg-purple-100 text-purple-700' :
                                                            'bg-rose-100 text-coral'
                                                        }`}>
                                                        {product.tipo === ProductType.STOCK ? 'Stock' : product.tipo === ProductType.PEDIDO ? 'Pedido' : 'Personalizado'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                {isEditing ? (
                                                    <select
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border-none cursor-pointer transition-colors shadow-sm outline-none ${editFormData.label ? 'bg-rose-100 text-coral' : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                        value={editFormData.label || ''}
                                                        onChange={(e) => setEditFormData({ ...editFormData, label: e.target.value })}
                                                    >
                                                        {PRODUCT_LABELS.map(l => (
                                                            <option key={l.value} value={l.value} className="bg-white text-gray-900">{l.label}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    product.label ? (
                                                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full bg-rose-100 text-coral shadow-sm">
                                                            {product.label}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-[10px] font-black uppercase italic">Sin etiqueta</span>
                                                    )
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                disabled={isSaving}
                                                                className="text-green-500 hover:scale-110 transition-transform disabled:opacity-50"
                                                                title="Guardar"
                                                            >
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="text-gray-400 hover:text-coral hover:scale-110 transition-all"
                                                                title="Cancelar"
                                                            >
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => startEdit(product)}
                                                                className="text-gray-400 hover:text-coral hover:scale-110 transition-all"
                                                                title="Editar"
                                                            >
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No se encontraron productos con esos filtros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-16 text-center text-gray-400 text-xs font-medium italic">
                    Hecho con amor por el Equipo de Locas Puntadas.
                </div>
            </div>
        </div>
    );
}
