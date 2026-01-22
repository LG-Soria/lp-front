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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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

            if (config) {
                setConfig({ ...config, heroImageUrl: publicUrl });
            }
        } catch (err) {
            setError('Error al subir la imagen del hero');
        } finally {
            setIsSaving(false);
            e.target.value = '';
        }
    };

    const toggleFeaturedProduct = (productId: string) => {
        if (!config) return;

        const currentIds = [...config.featuredProductIds];
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

        setConfig({ ...config, featuredProductIds: currentIds });
    };

    const handleSave = async () => {
        if (!config) return;
        setIsSaving(true);
        setError(null);
        try {
            await apiService.updateHomeConfig({
                heroImageUrl: config.heroImageUrl,
                featuredProductIds: config.featuredProductIds
            });
            setSuccess('Configuración guardada correctamente');
        } catch (err) {
            setError('Error al guardar la configuración');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-medium">Cargando configuración...</div>;
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
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-gray-900">
                            Diseño de la <span className="text-coral">Home</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-lg mt-2">Personalizá cómo se ve tu tienda al entrar.</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Hero Section Config */}
                    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-coral rounded-full"></span>
                            Imagen Principal (Hero)
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="relative aspect-video rounded-[32px] overflow-hidden border-8 border-white shadow-xl bg-gray-100">
                                {config?.heroImageUrl ? (
                                    <img
                                        src={config.heroImageUrl}
                                        alt="Hero Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                                        Sin imagen seleccionada
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    Esta es la imagen que aparece al principio de todo. Elegí una que represente bien tu marca y tenga buena calidad.
                                </p>
                                <label className="inline-flex items-center gap-4 bg-coral text-white px-8 py-4 rounded-full font-bold cursor-pointer hover:scale-105 transition-all shadow-lg shadow-rose-200">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    Cambiar Imagen
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleHeroImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Featured Products Config */}
                    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-coral rounded-full"></span>
                            Productos Destacados
                        </h2>

                        <p className="text-gray-600 mb-8 font-medium">
                            Seleccioná hasta 3 productos para mostrar en la sección "Favoritos" de la home.
                            <span className="text-coral"> Solo aparecen los que tienen etiquetas destacadas.</span>
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {eligibleProducts.map(product => {
                                const isSelected = config?.featuredProductIds.includes(product.id);
                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => toggleFeaturedProduct(product.id)}
                                        className={`relative aspect-square rounded-[32px] overflow-hidden border-4 transition-all group ${isSelected ? 'border-coral shadow-lg scale-105' : 'border-white hover:border-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={product.imagenes[0]}
                                            alt={product.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`absolute inset-0 bg-coral/20 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                                            }`}>
                                            <div className="bg-white rounded-full p-2 shadow-lg">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-coral">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-3 text-white">
                                            <p className="text-[10px] font-bold uppercase truncate">{product.nombre}</p>
                                            <p className="text-[8px] font-medium opacity-80">{product.label}</p>
                                        </div>
                                    </button>
                                );
                            })}

                            {eligibleProducts.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-[32px]">
                                    No hay productos con etiquetas destacadas todavía.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-6 pt-8">
                        <button
                            onClick={() => router.push('/admin')}
                            className="px-10 py-5 rounded-full font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Volver al Panel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-coral text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl shadow-rose-200 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>

            {error && <Toast message={error} onClose={() => setError(null)} />}
            {success && <Toast message={success} type="success" onClose={() => setSuccess(null)} />}
        </div>
    );
}
