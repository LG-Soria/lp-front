'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Product, HomeConfig } from '@/types';
import { StarDoodle, SmileyFlowerDoodle } from '@/components/doodles';
import Toast from '@/components/ui/Toast';

export default function HomeConfigPage() {
    const router = useRouter();
    const [config, setConfig] = useState<HomeConfig | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingFeatured, setIsEditingFeatured] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // State for draft changes
    const [draftHeroImageUrl, setDraftHeroImageUrl] = useState<string | null>(null);
    const [draftFeaturedIds, setDraftFeaturedIds] = useState<string[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [configData, productsData] = await Promise.all([
                apiService.getHomeConfig(),
                apiService.getProducts()
            ]);
            setConfig(configData);
            setProducts(productsData);
            setDraftHeroImageUrl(configData.heroImageUrl);
            setDraftFeaturedIds(configData.featuredProductIds || []);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Error al cargar la configuración');
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrar productos que tengan las etiquetas destacadas
    const eligibleProducts = products.filter(p =>
        p.label === 'Novedades' ||
        p.label === 'Best Seller' ||
        p.label === 'Locamente Favoritos'
    );

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsSaving(true);
            const { uploadUrl, publicUrl } = await apiService.getPresignedUrl(file.name, file.type);
            await apiService.uploadFileToR2(uploadUrl, file);
            setDraftHeroImageUrl(publicUrl);
        } catch (err) {
            setError('Error al subir la imagen del hero');
        } finally {
            setIsSaving(false);
            e.target.value = '';
        }
    };

    const handleSaveHero = async () => {
        if (!draftHeroImageUrl) return;
        setIsSaving(true);
        try {
            await apiService.updateHomeConfig({ heroImageUrl: draftHeroImageUrl });
            setSuccess('Imagen del Hero actualizada');
            await loadData();
        } catch (err) {
            setError('Error al guardar la imagen');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscardHero = () => {
        setDraftHeroImageUrl(config?.heroImageUrl || null);
    };

    const toggleFeaturedProduct = (productId: string) => {
        const currentIds = [...draftFeaturedIds];
        const index = currentIds.indexOf(productId);

        if (index > -1) {
            currentIds.splice(index, 1);
        } else {
            if (currentIds.length >= 3) {
                setError('Solo podés seleccionar hasta 3 productos destacados');
                return;
            }
            currentIds.push(productId);
        }

        setDraftFeaturedIds(currentIds);
    };

    const handleSaveFeatured = async () => {
        setIsSaving(true);
        try {
            await apiService.updateHomeConfig({ featuredProductIds: draftFeaturedIds });
            setSuccess('Productos destacados actualizados');
            await loadData();
            setIsEditingFeatured(false);
        } catch (err) {
            setError('Error al guardar la selección');
        } finally {
            setIsSaving(false);
        }
    };

    const getFeaturedProducts = () => {
        const ids = isEditingFeatured ? draftFeaturedIds : (config?.featuredProductIds || []);
        return ids
            .map(id => products.find(p => p.id === id))
            .filter((p): p is Product => !!p);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-medium">Cargando configuración...</div>;
    }

    const currentFeatured = getFeaturedProducts();
    const heroHasChanges = draftHeroImageUrl !== config?.heroImageUrl;

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Background Doodles */}
            <div className="absolute top-20 -right-10 opacity-20 rotate-12">
                <StarDoodle className="w-40 h-40 text-coral" />
            </div>
            <div className="absolute bottom-20 -left-10 opacity-20 -rotate-12">
                <SmileyFlowerDoodle className="w-48 h-48 text-coral" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
                <div className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-gray-900">
                            Diseño de la <span className="text-coral">Home</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-lg mt-2">Personalizá cómo se ve tu tienda al entrar.</p>
                    </div>
                    <button
                        onClick={() => router.push('/admin')}
                        className="px-8 py-3 rounded-full font-bold text-gray-400 hover:text-gray-600 transition-colors border border-gray-100 hover:bg-white"
                    >
                        Volver al Panel
                    </button>
                </div>

                <div className="space-y-12">
                    {/* Hero Section Config */}
                    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-2 h-8 bg-coral rounded-full"></span>
                                Imagen Principal (Hero)
                            </h2>
                            <label className="bg-coral/10 text-coral px-6 py-2 rounded-full font-bold text-sm cursor-pointer hover:bg-coral hover:text-white transition-all">
                                Subir Nueva Imagen
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleHeroImageUpload}
                                />
                            </label>
                        </div>

                        <div className="relative aspect-video rounded-[32px] overflow-hidden border-8 border-white shadow-xl bg-gray-100 mx-auto max-w-3xl">
                            {draftHeroImageUrl ? (
                                <img
                                    src={draftHeroImageUrl}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                                    Sin imagen seleccionada
                                </div>
                            )}
                        </div>

                        {heroHasChanges && (
                            <div className="flex justify-center gap-4 mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                <button
                                    onClick={handleDiscardHero}
                                    className="px-8 py-3 rounded-full font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
                                >
                                    Descartar
                                </button>
                                <button
                                    onClick={handleSaveHero}
                                    disabled={isSaving}
                                    className="bg-coral text-white px-10 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar Imagen'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Featured Products Section */}
                    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-2 h-8 bg-coral rounded-full"></span>
                                Productos Destacados {isEditingFeatured && '(Editando)'}
                            </h2>
                            {!isEditingFeatured && (
                                <button
                                    onClick={() => {
                                        setDraftFeaturedIds(config?.featuredProductIds || []);
                                        setIsEditingFeatured(true);
                                    }}
                                    className="bg-coral/10 text-coral px-6 py-2 rounded-full font-bold text-sm hover:bg-coral hover:text-white transition-all"
                                >
                                    Modificar Selección
                                </button>
                            )}
                        </div>

                        {isEditingFeatured ? (
                            <div className="space-y-8">
                                <div className="text-gray-600 font-medium bg-coral/5 p-4 rounded-2xl border border-coral/10 text-center md:text-left">
                                    <p>Hacé clic en los productos para seleccionarlos en el orden que quieras (máximo 3).</p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {eligibleProducts.map(product => {
                                        const selectionIndex = draftFeaturedIds.indexOf(product.id);
                                        const isSelected = selectionIndex > -1;

                                        return (
                                            <button
                                                key={product.id}
                                                onClick={() => toggleFeaturedProduct(product.id)}
                                                className={`relative aspect-square rounded-[32px] overflow-hidden border-4 transition-all group ${isSelected ? 'border-coral shadow-lg scale-105' : 'border-white hover:border-gray-100 grayscale-[0.5] opacity-60'
                                                    }`}
                                            >
                                                <img
                                                    src={product.imagenes[0]}
                                                    alt={product.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-coral/20 flex items-center justify-center">
                                                        <div className="bg-coral text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black shadow-xl border-4 border-white animate-in zoom-in-50 duration-300">
                                                            {selectionIndex + 1}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-3 text-white">
                                                    <p className="text-[10px] font-bold uppercase truncate">{product.nombre}</p>
                                                    <p className="text-[8px] font-medium opacity-80">{product.label}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setDraftFeaturedIds(config?.featuredProductIds || []);
                                            setIsEditingFeatured(false);
                                        }}
                                        className="px-6 py-2 rounded-full font-bold text-gray-400 hover:text-gray-600"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveFeatured}
                                        disabled={isSaving}
                                        className="bg-coral text-white px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-all"
                                    >
                                        {isSaving ? 'Guardando...' : 'Guardar Selección'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {currentFeatured.map((product, idx) => (
                                    <div key={product.id} className="relative group mx-auto w-full max-w-[250px] md:max-w-none">
                                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-coral font-black z-20 border-2 border-coral/10">
                                            {idx + 1}
                                        </div>
                                        <div className="aspect-square rounded-[32px] overflow-hidden border-4 border-white shadow-md bg-white">
                                            <img src={product.imagenes[0]} alt={product.nombre} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-0 inset-x-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                                                <p className="text-white text-xs font-bold uppercase">{product.nombre}</p>
                                                <p className="text-coral-light text-[10px] font-bold">{product.label}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {currentFeatured.length === 0 && (
                                    <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-100 rounded-[40px] text-gray-400 font-medium">
                                        No hay productos seleccionados. <br /> Aparecerán los 3 más recientes por defecto.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && <Toast message={error} onClose={() => setError(null)} />}
            {success && <Toast message={success} type="success" onClose={() => setSuccess(null)} />}
        </div>
    );
}
