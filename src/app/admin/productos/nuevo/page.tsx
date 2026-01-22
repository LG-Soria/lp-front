'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Category, ProductType } from '@/types';
import { StarDoodle, SmileyFlowerDoodle, TapeDoodle } from '@/components/doodles';
import Toast from '@/components/ui/Toast';

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEditing = !!params.id;

    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        displayPrecio: '',
        tipo: ProductType.STOCK,
        label: '',
        categoryId: '',
        tiempoProduccion: '',
        personalizable: false,
        imagenes: [''],
        weightGrams: '',
        lengthCm: '',
        widthCm: '',
        heightCm: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
        if (isEditing) {
            loadProduct();
        }
    }, []);

    const loadCategories = async () => {
        try {
            const data = await apiService.getCategories();
            setCategories(data);
            if (data.length > 0 && !formData.categoryId) {
                setFormData(prev => ({ ...prev, categoryId: data[0].id }));
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadProduct = async () => {
        try {
            const product = await apiService.getProductById(params.id as string);
            if (product) {
                setFormData({
                    nombre: product.nombre,
                    descripcion: product.descripcion || '',
                    precio: product.precio?.toString() || '',
                    displayPrecio: product.precio ? product.precio.toLocaleString('es-AR') : '',
                    tipo: product.tipo,
                    label: product.label || '',
                    categoryId: product.categoryId,
                    tiempoProduccion: product.tiempoProduccion || '',
                    personalizable: product.personalizable,
                    imagenes: product.imagenes.length > 0 ? product.imagenes : [''],
                    weightGrams: product.weightGrams?.toString() || '',
                    lengthCm: product.lengthCm?.toString() || '',
                    widthCm: product.widthCm?.toString() || '',
                    heightCm: product.heightCm?.toString() || ''
                });
            }
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Clean payload: Remove read-only or extra fields
        const { displayPrecio, id, precioCents, currency, createdAt, updatedAt, category, ...cleanData } = formData as any;

        const payload = {
            ...cleanData,
            precio: formData.precio ? parseFloat(formData.precio) : null,
            imagenes: formData.imagenes.filter(img => img.trim() !== ''),
            weightGrams: formData.weightGrams ? parseInt(formData.weightGrams) : null,
            lengthCm: formData.lengthCm ? parseInt(formData.lengthCm) : null,
            widthCm: formData.widthCm ? parseInt(formData.widthCm) : null,
            heightCm: formData.heightCm ? parseInt(formData.heightCm) : null
        };

        console.log('Enviando payload al backend:', JSON.stringify(payload, null, 2));

        try {
            if (isEditing) {
                await apiService.updateProduct(params.id as string, payload as any);
            } else {
                await apiService.createProduct(payload as any);
            }
            router.push('/admin/productos');
        } catch (error: any) {
            setError(error.message || 'Error al guardar el producto');
        } finally {
            setIsLoading(false);
        }
    };


    if (isFetching) {
        return <div className="p-8 text-center">Cargando producto...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Background Doodles */}
            <div className="absolute top-20 -right-10 opacity-20 rotate-12">
                <StarDoodle className="w-40 h-40 text-coral" />
            </div>
            <div className="absolute bottom-20 -left-10 opacity-20 -rotate-12">
                <SmileyFlowerDoodle className="w-48 h-48 text-coral" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-heading font-bold text-gray-900">
                        {isEditing ? 'Editar' : 'Nuevo'} <span className="text-coral">Producto</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg mt-2">Dales vida a tus nuevas creaciones.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-coral rounded-full"></span>
                            Información Básica
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nombre del Producto *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ej: Manta Nórdica XXL"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Categoría *</label>
                                <select
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all appearance-none cursor-pointer"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Precio</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                        value={formData.displayPrecio}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                                            const numericValue = rawValue === '' ? '' : parseInt(rawValue, 10).toString();
                                            const formattedValue = rawValue === '' ? '' : parseInt(rawValue, 10).toLocaleString('es-AR');
                                            setFormData({ ...formData, precio: numericValue, displayPrecio: formattedValue });
                                        }}
                                        placeholder="Ej: 15.000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Tipo de Disponibilidad</label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all appearance-none cursor-pointer"
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as ProductType })}
                                >
                                    <option value={ProductType.STOCK}>En Stock (Envío inmediato)</option>
                                    <option value={ProductType.PEDIDO}>A Pedido (Tiempo de fabricación)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-coral rounded-full"></span>
                            Detalles y Extras
                        </h2>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Descripción Artesanal</label>
                                <textarea
                                    rows={4}
                                    placeholder="Contanos la historia de este producto..."
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all resize-none"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Etiqueta Destacada</label>
                                    <select
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all appearance-none cursor-pointer"
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    >
                                        <option value="">Ninguna</option>
                                        <option value="Novedades">Novedades</option>
                                        <option value="Best Seller">Best Seller</option>
                                        <option value="Locamente Favoritos">Locamente Favoritos</option>
                                    </select>
                                </div>

                                {formData.tipo === ProductType.PEDIDO && (
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Tiempo estimado</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: 5 días hábiles"
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                            value={formData.tiempoProduccion}
                                            onChange={(e) => setFormData({ ...formData, tiempoProduccion: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center gap-4 cursor-pointer group w-fit">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={formData.personalizable}
                                        onChange={(e) => setFormData({ ...formData, personalizable: e.target.checked })}
                                    />
                                    <div className={`w-14 h-8 rounded-full transition-colors duration-300 flex items-center px-1 ${formData.personalizable ? 'bg-coral' : 'bg-gray-200'}`}>
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${formData.personalizable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-600 group-hover:text-coral transition-colors">Permitir personalización</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-coral rounded-full"></span>
                            Logística y Envío
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Peso (gramos) *</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="Ej: 500"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                    value={formData.weightGrams}
                                    onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Largo (cm)</label>
                                <input
                                    type="number"
                                    placeholder="Ej: 30"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                    value={formData.lengthCm}
                                    onChange={(e) => setFormData({ ...formData, lengthCm: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Ancho (cm)</label>
                                <input
                                    type="number"
                                    placeholder="Ej: 20"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                    value={formData.widthCm}
                                    onChange={(e) => setFormData({ ...formData, widthCm: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Alto (cm)</label>
                                <input
                                    type="number"
                                    placeholder="Ej: 10"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                    value={formData.heightCm}
                                    onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-coral rounded-full"></span>
                            Galería de Fotos
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
                            {formData.imagenes.map((img, index) => (
                                img && (
                                    <div key={index} className="relative aspect-square rounded-[32px] overflow-hidden group shadow-md border-4 border-white">
                                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-coral/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = formData.imagenes.filter((_, i) => i !== index);
                                                setFormData({ ...formData, imagenes: newImages.length > 0 ? newImages : [''] });
                                            }}
                                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                )
                            ))}
                            <label className="aspect-square rounded-[32px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-coral/20 transition-all group relative">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-coral group-hover:scale-110 transition-all">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-4">Subir Foto</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={async (e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length === 0) return;
                                        try {
                                            setIsLoading(true);
                                            const newPublicUrls: string[] = [];
                                            for (const file of files) {
                                                const { uploadUrl, publicUrl } = await apiService.getPresignedUrl(file.name, file.type);
                                                await apiService.uploadFileToR2(uploadUrl, file);
                                                newPublicUrls.push(publicUrl);
                                            }
                                            if (newPublicUrls.length > 0) {
                                                const currentImages = formData.imagenes.filter(img => img.trim() !== '');
                                                setFormData(prev => ({
                                                    ...prev,
                                                    imagenes: [...currentImages, ...newPublicUrls]
                                                }));
                                            }
                                        } catch (err) {
                                            alert('Error al subir las imágenes');
                                        } finally {
                                            setIsLoading(false);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </label>
                        </div>

                    </div>

                    <div className="flex justify-end gap-6 pt-8">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/productos')}
                            className="px-10 py-5 rounded-full font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-coral text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl shadow-rose-200 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Producto')}
                        </button>
                    </div>
                </form>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
}
