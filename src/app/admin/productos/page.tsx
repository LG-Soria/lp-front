'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Product, Category, ProductType } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StarDoodle, SmileyFlowerDoodle } from '@/components/doodles';
import dynamic from 'next/dynamic';
import DataTable, { Column } from '@/components/admin/DataTable';

const ProductModal = dynamic(() => import('@/components/admin/ProductModal'), { ssr: false });
import { useDebounce } from '@/hooks/useDebounce';
import { OptimizedImage } from '@/components/OptimizedImage';

const PRODUCT_LABELS = [
    { value: '', label: 'Sin etiqueta' },
    { value: 'Novedades', label: 'Novedades' },
    { value: 'Best Seller', label: 'Best Seller' },
    { value: 'Locamente Favoritos', label: 'Locamente Favoritos' },
];

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedType, setSelectedType] = useState<string>('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('nombre');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const { token } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [debouncedSearch, selectedCategory, selectedType, page, sortBy, sortOrder]);

    const loadCategories = async () => {
        try {
            const categoriesData = await apiService.getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getProducts({
                page,
                limit: 20,
                search: debouncedSearch,
                categoryId: selectedCategory === 'Todas' ? undefined : categories.find(c => c.nombre === selectedCategory)?.id,
                tipo: selectedType || undefined,
                sortBy,
                sortOrder
            });
            setProducts(response.items);
            setMeta(response.meta);
        } catch (error) {
            console.error('Error loading products:', error);
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

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (updated: Product) => {
        setProducts(products.map(p => p.id === updated.id ? updated : p));
    };

    const handleSort = (key: string, order: 'asc' | 'desc') => {
        setSortBy(key);
        setSortOrder(order);
        setPage(1);
    };

    const columns: Column<Product>[] = [
        {
            header: 'Imagen',
            width: '100px',
            accessor: (product) => (
                <div className="relative group w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shadow-inner">
                    {product.imagenes[0] ? (
                        <OptimizedImage
                            src={product.imagenes[0]}
                            alt={product.nombre}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: 'Nombre',
            width: '30%',
            accessor: (product) => <span className="font-bold text-gray-900 uppercase tracking-tight">{product.nombre}</span>,
            sortable: true,
            sortKey: 'nombre',
        },
        {
            header: 'Categoría',
            width: '15%',
            accessor: (product) => <span className="text-sm font-medium text-gray-600">{product.category?.nombre || 'Sin categoría'}</span>,
        },
        {
            header: 'Precio',
            width: '12%',
            accessor: (product) => <span className="text-sm font-bold text-gray-900">{product.precio ? `$${product.precio.toLocaleString('es-AR')}` : '-'}</span>,
            sortable: true,
            sortKey: 'precio',
        },
        {
            header: 'Tipo',
            width: '15%',
            accessor: (product) => (
                <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${product.tipo === ProductType.STOCK ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                    }`}>
                    {product.tipo === ProductType.STOCK ? 'Stock' : 'Pedido'}
                </span>
            ),
        },
        {
            header: 'Etiqueta',
            width: '150px',
            accessor: (product) => product.label ? (
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full bg-rose-100 text-coral shadow-sm">
                    {product.label}
                </span>
            ) : (
                <span className="text-gray-400 text-[10px] font-black uppercase italic">Sin etiqueta</span>
            ),
        },
        {
            header: 'Acciones',
            width: '100px',
            align: 'right',
            accessor: (product) => (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); openModal(product); }}
                        className="text-gray-400 hover:text-coral hover:scale-110 transition-all"
                        title="Editar"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                        className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
                        title="Eliminar"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                    </button>
                </div>
            ),
        }
    ];

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
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-coral transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <div className="w-full md:w-64 relative">
                        <select
                            className="w-full pl-6 pr-10 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium appearance-none transition-all cursor-pointer text-gray-600"
                            value={selectedCategory}
                            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                        >
                            <option value="Todas">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                            ))}
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                    <div className="w-full md:w-64 relative">
                        <select
                            className="w-full pl-6 pr-10 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium appearance-none transition-all cursor-pointer text-gray-600"
                            value={selectedType}
                            onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                        >
                            <option value="">Todos los tipos</option>
                            <option value={ProductType.STOCK}>En Stock</option>
                            <option value={ProductType.PEDIDO}>Por Pedido</option>
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </div>

                <DataTable
                    data={products}
                    columns={columns}
                    meta={meta}
                    isLoading={isLoading}
                    onPageChange={setPage}
                    onSortChange={handleSort}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onRowClick={openModal}
                    emptyMessage="No se encontraron productos con esos filtros."
                />
                <div className="mt-16 text-center text-gray-400 text-xs font-medium italic">
                    Hecho con amor por el Equipo de Locas Puntadas.
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                categories={categories}
                onSave={handleSaveProduct}
            />
        </div>
    );
}
