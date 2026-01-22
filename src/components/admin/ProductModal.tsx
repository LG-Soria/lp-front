'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, Category, ProductType } from '@/types';
import { apiService } from '@/services/apiService';
import { StarDoodle, SmileyFlowerDoodle, TapeDoodle } from '@/components/doodles';
import Toast from '@/components/ui/Toast';

interface ProductModalProps {
    product: Product | null;
    categories: Category[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProduct: Product) => void;
}

const PRODUCT_LABELS = [
    { value: '', label: 'Sin etiqueta' },
    { value: 'Novedades', label: 'Novedades' },
    { value: 'Best Seller', label: 'Best Seller' },
    { value: 'Locamente Favoritos', label: 'Locamente Favoritos' },
];

export default function ProductModal({ product, categories, isOpen, onClose, onSave }: ProductModalProps) {
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [initialFormData, setInitialFormData] = useState<string>('');
    const [displayPrecio, setDisplayPrecio] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDiscardWarning, setShowDiscardWarning] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (product && isOpen) {
            const initial = {
                ...product,
                imagenes: product.imagenes.length > 0 ? product.imagenes : ['']
            };
            setFormData(initial);
            setInitialFormData(JSON.stringify(initial));
            setDisplayPrecio(product.precio ? product.precio.toLocaleString('es-AR') : '');
            setShowDiscardWarning(false);
        }
    }, [product, categories, isOpen]);

    const isDirty = JSON.stringify(formData) !== initialFormData;

    // Auto-hide warning if changes are manually reverted
    useEffect(() => {
        if (!isDirty && showDiscardWarning) {
            setShowDiscardWarning(false);
        }
    }, [isDirty, showDiscardWarning]);

    if (!isOpen) return null;

    const handleClose = () => {
        if (isDirty && !showDiscardWarning) {
            setShowDiscardWarning(true);
        } else {
            onClose();
            setShowDiscardWarning(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        // Only allow background click to close if warning is NOT visible
        if (showDiscardWarning) return;

        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            handleClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product?.id) return;

        setIsSaving(true);
        setError(null);
        try {
            // Clean payload: Remove read-only or extra fields that the backend DTO doesn't allow
            const { id, precioCents, currency, createdAt, updatedAt, category, ...cleanData } = formData as any;

            const payload = {
                ...cleanData,
                imagenes: formData.imagenes?.filter(img => img.trim() !== '') || []
            };

            const updated = await apiService.updateProduct(product.id, payload);
            onSave(updated);
            onClose();
        } catch (error: any) {
            setError(error.message || 'Ocurrió un error al guardar el producto');
        } finally {
            setIsSaving(false);
        }
    };


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        try {
            setIsLoadingImages(true);
            const newPublicUrls: string[] = [];
            for (const file of files) {
                const { uploadUrl, publicUrl } = await apiService.getPresignedUrl(file.name, file.type);
                await apiService.uploadFileToR2(uploadUrl, file);
                newPublicUrls.push(publicUrl);
            }
            if (newPublicUrls.length > 0) {
                const currentImages = (formData.imagenes || []).filter(img => img.trim() !== '');
                setFormData(prev => ({
                    ...prev,
                    imagenes: [...currentImages, ...newPublicUrls]
                }));
            }
        } catch (err) {
            alert('Error al subir las imágenes');
        } finally {
            setIsLoadingImages(false);
            e.target.value = '';
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white w-full max-w-4xl h-full max-h-[90vh] flex flex-col rounded-[40px] shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden"
            >
                {/* Fixed Header */}
                <div className="p-8 md:p-10 pb-4 relative shrink-0 border-b border-gray-100">
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 p-3 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-coral z-20"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>

                    <div className="text-center relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 opacity-10">
                            <StarDoodle className="w-20 h-20 text-coral" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-gray-900">
                            Editar <span className="text-coral">Producto</span>
                        </h2>
                        <p className="text-gray-500 font-medium">Refinando los detalles de tu pieza.</p>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-8 md:p-10 pt-6 custom-scrollbar">
                    <form id="product-modal-form" onSubmit={handleSubmit} className="space-y-10">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-coral rounded-full"></span>
                                Información Básica
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                        value={formData.nombre || ''}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all appearance-none cursor-pointer"
                                        value={formData.categoryId || ''}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Precio</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                        <input
                                            type="text"
                                            className="w-full pl-9 pr-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                            value={displayPrecio}
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                                                const numericValue = rawValue === '' ? null : parseInt(rawValue, 10);
                                                const formattedValue = rawValue === '' ? '' : parseInt(rawValue, 10).toLocaleString('es-AR');
                                                setFormData({ ...formData, precio: numericValue });
                                                setDisplayPrecio(formattedValue);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo de Disponibilidad</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all appearance-none cursor-pointer"
                                        value={formData.tipo || ProductType.STOCK}
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value as ProductType })}
                                    >
                                        <option value={ProductType.STOCK}>En Stock</option>
                                        <option value={ProductType.PEDIDO}>A Pedido</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description & Details */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-coral rounded-full"></span>
                                Detalles y Descripción
                            </h3>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-[24px] focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all resize-none"
                                    value={formData.descripcion || ''}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Etiqueta</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all appearance-none cursor-pointer"
                                        value={formData.label || ''}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    >
                                        {PRODUCT_LABELS.map(l => (
                                            <option key={l.value} value={l.value}>{l.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {formData.tipo === ProductType.PEDIDO && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tiempo de Producción</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: 7 días hábiles"
                                            className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                            value={formData.tiempoProduccion || ''}
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
                                        checked={formData.personalizable || false}
                                        onChange={(e) => setFormData({ ...formData, personalizable: e.target.checked })}
                                    />
                                    <div className={`w-12 h-7 rounded-full transition-colors duration-300 flex items-center px-1 ${formData.personalizable ? 'bg-coral' : 'bg-gray-200'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${formData.personalizable ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-600 group-hover:text-coral transition-colors">Personalizable</span>
                            </label>
                        </div>

                        {/* Logistics */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-coral rounded-full"></span>
                                Logística
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Peso (g)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                        value={formData.weightGrams || ''}
                                        onChange={(e) => setFormData({ ...formData, weightGrams: parseInt(e.target.value) || null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Largo (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                        value={formData.lengthCm || ''}
                                        onChange={(e) => setFormData({ ...formData, lengthCm: parseInt(e.target.value) || null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ancho (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                        value={formData.widthCm || ''}
                                        onChange={(e) => setFormData({ ...formData, widthCm: parseInt(e.target.value) || null })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alto (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                        value={formData.heightCm || ''}
                                        onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || null })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-coral rounded-full"></span>
                                Galería de Imágenes
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                                {formData.imagenes?.map((img, index) => (
                                    img && (
                                        <div key={index} className="relative aspect-square rounded-[24px] overflow-hidden group border-2 border-white shadow-sm hover:shadow-md transition-all">
                                            <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = (formData.imagenes || []).filter((_, i) => i !== index);
                                                    setFormData({ ...formData, imagenes: newImages.length > 0 ? newImages : [''] });
                                                }}
                                                className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm text-red-500 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    )
                                ))}
                                <label className="aspect-square rounded-[24px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-coral/20 transition-all group">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-coral transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 md:p-8 shrink-0 border-t border-gray-100 bg-white relative overflow-hidden">
                    {/* Subtle Warning Section (Stacks on top) */}
                    {showDiscardWarning && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-50/50 rounded-3xl mb-6 animate-in slide-in-from-bottom-4 duration-500 border border-rose-100/50">
                            <div className="flex items-center gap-3 text-coral">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                <span className="font-bold text-sm">Hay cambios sin guardar. ¿Qué querés hacer?</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onClose()}
                                    className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    Descartar cambios
                                </button>
                                <button
                                    onClick={() => setShowDiscardWarning(false)}
                                    className="px-6 py-2.5 bg-coral text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:scale-105 transition-all"
                                >
                                    Seguir editando
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2 opacity-30">
                            <SmileyFlowerDoodle className="w-8 h-8 text-coral" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Artesanía Digital</span>
                        </div>

                        <div className="flex justify-end gap-5 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`px-8 py-4 rounded-full font-bold transition-all ${showDiscardWarning ? 'text-gray-300 pointer-events-none' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="product-modal-form"
                                disabled={isSaving || isLoadingImages || showDiscardWarning}
                                className="bg-coral text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-rose-100 hover:scale-105 transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && <Toast message={error} onClose={() => setError(null)} />}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ffe4e6;
                }
            `}</style>
        </div>
    );
}
