'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Product, Category, ProductType } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-600">Gestiona el catálogo de productos de tu tienda.</p>
                </div>
                <Link
                    href="/admin/productos/nuevo"
                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 font-medium transition-colors"
                >
                    + Nuevo Producto
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="Todas">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando productos...</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 font-semibold text-sm uppercase">
                                <th className="px-6 py-4">Imagen</th>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Etiqueta</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(product => {
                                const isEditing = editingProductId === product.id;
                                return (
                                    <tr key={product.id} className={`${isEditing ? 'bg-pink-50/50' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className="relative group w-12 h-12 rounded-lg bg-gray-100 overflow-hidden cursor-pointer" onClick={() => document.getElementById(`file-input-${product.id}`)?.click()}>
                                                {isEditing && editFormData.imagenes?.[0] ? (
                                                    <img src={editFormData.imagenes[0]} alt="Preview" className="w-full h-full object-cover" />
                                                ) : product.imagenes[0] ? (
                                                    <img src={product.imagenes[0]} alt={product.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                                )}
                                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
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
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-1.5 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm shadow-inner"
                                                    value={editFormData.nombre}
                                                    onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                                                />
                                            ) : (
                                                <span className="font-medium text-gray-900">{product.nombre}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <select
                                                    className="w-full px-3 py-1.5 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm shadow-inner bg-white"
                                                    value={editFormData.categoryId}
                                                    onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                                                >
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-gray-600">{product.category?.nombre || 'Sin categoría'}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                                    <input
                                                        type="number"
                                                        className="w-28 pl-6 pr-2 py-1.5 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm shadow-inner"
                                                        value={editFormData.precio || ''}
                                                        onChange={(e) => setEditFormData({ ...editFormData, precio: parseFloat(e.target.value) || null })}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-900">
                                                    {product.precio ? `$${product.precio.toLocaleString()}` : 'Consultar'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <select
                                                    className={`w-full px-3 py-1.5 rounded-full text-xs font-bold border-none cursor-pointer transition-colors shadow-sm outline-none ${editFormData.tipo === ProductType.STOCK ? 'bg-green-100 text-green-700' :
                                                        editFormData.tipo === ProductType.PEDIDO ? 'bg-purple-100 text-purple-700' :
                                                            'bg-rose-100 text-pink-700'
                                                        }`}
                                                    value={editFormData.tipo}
                                                    onChange={(e) => setEditFormData({ ...editFormData, tipo: e.target.value as ProductType })}
                                                >
                                                    <option value={ProductType.STOCK} className="bg-white text-gray-900">LISTO (STOCK)</option>
                                                    <option value={ProductType.PEDIDO} className="bg-white text-gray-900">A PEDIDO</option>
                                                    <option value={ProductType.PERSONALIZADO} className="bg-white text-gray-900">PERSONALIZADO</option>
                                                </select>
                                            ) : (
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${product.tipo === ProductType.STOCK ? 'bg-green-100 text-green-700' :
                                                    product.tipo === ProductType.PEDIDO ? 'bg-purple-100 text-purple-700' :
                                                        'bg-rose-100 text-pink-700'
                                                    }`}>
                                                    {product.tipo === ProductType.STOCK ? 'Stock' : product.tipo === ProductType.PEDIDO ? 'A Pedido' : 'Personalizado'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <select
                                                    className={`w-full px-3 py-1.5 rounded-full text-xs font-bold border-none cursor-pointer transition-colors shadow-sm outline-none ${editFormData.label ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'
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
                                                    <span className="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest bg-pink-500 text-white shadow-sm">
                                                        {product.label}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Sin etiqueta</span>
                                                )
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            disabled={isSaving}
                                                            className="text-green-600 hover:text-green-800 font-medium text-sm"
                                                        >
                                                            {isSaving ? '...' : 'Guardar'}
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="text-gray-500 hover:text-gray-700 font-medium text-sm"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEdit(product)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                        >
                                                            Eliminar
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
        </div>
    );
}
