'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Category, ProductType } from '@/types';

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEditing = !!params.id;

    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        tipo: ProductType.STOCK,
        categoryId: '',
        tiempoProduccion: '',
        personalizable: false,
        imagenes: ['']
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);

    useEffect(() => {
        loadCategories();
        if (isEditing) {
            loadProduct();
        }
    }, []);

    const loadCategories = async () => {
        const data = await apiService.getCategories();
        setCategories(data);
        if (data.length > 0 && !formData.categoryId) {
            setFormData(prev => ({ ...prev, categoryId: data[0].id }));
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
                    tipo: product.tipo,
                    categoryId: product.categoryId,
                    tiempoProduccion: product.tiempoProduccion || '',
                    personalizable: product.personalizable,
                    imagenes: product.imagenes.length > 0 ? product.imagenes : ['']
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

        const payload = {
            ...formData,
            precio: formData.precio ? parseFloat(formData.precio) : null,
            imagenes: formData.imagenes.filter(img => img.trim() !== '')
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
            alert('Error al guardar el producto: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.imagenes];
        newImages[index] = value;
        setFormData({ ...formData, imagenes: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, imagenes: [...formData.imagenes, ''] });
    };

    if (isFetching) {
        return <div className="p-8 text-center">Cargando producto...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h1>
                <p className="text-gray-600">Completa la información del producto.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Nombre del Producto *</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Categoría *</label>
                        <select
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Precio (Opcional)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                            value={formData.precio}
                            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                            placeholder="Ej: 15000"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Tipo de Producto</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as ProductType })}
                        >
                            <option value={ProductType.STOCK}>En Stock</option>
                            <option value={ProductType.PEDIDO}>A Pedido</option>
                            <option value={ProductType.PERSONALIZADO}>Personalizado</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Descripción</label>
                    <textarea
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Tiempo de Producción</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                            value={formData.tiempoProduccion}
                            onChange={(e) => setFormData({ ...formData, tiempoProduccion: e.target.value })}
                            placeholder="Ej: 5 días hábiles"
                        />
                    </div>

                    <div className="flex items-center space-x-3 pt-8">
                        <input
                            type="checkbox"
                            id="personalizable"
                            className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            checked={formData.personalizable}
                            onChange={(e) => setFormData({ ...formData, personalizable: e.target.checked })}
                        />
                        <label htmlFor="personalizable" className="text-sm font-medium text-gray-700">¿Es personalizable?</label>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700">Imágenes del Producto</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.imagenes.map((img, index) => (
                            img && (
                                <div key={index} className="relative aspect-square border-2 border-dashed border-gray-200 rounded-lg overflow-hidden group">
                                    <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = formData.imagenes.filter((_, i) => i !== index);
                                            setFormData({ ...formData, imagenes: newImages.length > 0 ? newImages : [''] });
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )
                        ))}
                        <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs text-gray-500 mt-2">Subir Imagen</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (files.length === 0) return;

                                    console.log(`Iniciando subida de ${files.length} archivos...`);
                                    try {
                                        setIsLoading(true);
                                        const newPublicUrls: string[] = [];

                                        for (const file of files) {
                                            try {
                                                console.log(`1. Obteniendo pre-signed URL para: ${file.name}`);
                                                // 1. Obtener URL firmada
                                                const { uploadUrl, publicUrl } = await apiService.getPresignedUrl(file.name, file.type);
                                                console.log(`   URL obtenida. Subiendo a R2...`);

                                                // 2. Subir a R2
                                                await apiService.uploadFileToR2(uploadUrl, file);
                                                console.log(`   Subida exitosa: ${publicUrl}`);
                                                newPublicUrls.push(publicUrl);
                                            } catch (fileErr) {
                                                console.error(`Error subiendo ${file.name}:`, fileErr);
                                                alert(`Error al subir ${file.name}`);
                                            }
                                        }

                                        // 3. Añadir a la lista
                                        if (newPublicUrls.length > 0) {
                                            const currentImages = formData.imagenes.filter(img => img.trim() !== '');
                                            setFormData(prev => ({
                                                ...prev,
                                                imagenes: [...currentImages, ...newPublicUrls]
                                            }));
                                            console.log('Estado de imágenes actualizado:', [...currentImages, ...newPublicUrls]);
                                        }
                                    } catch (err) {
                                        alert('Error crítico durante la subida');
                                        console.error(err);
                                    } finally {
                                        setIsLoading(false);
                                        // Limpiar el input para permitir subir el mismo archivo otra vez si falla
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <div className="space-y-2 pt-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase">O agregar URL manualmente</label>
                        {formData.imagenes.map((img, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                        >
                            + Agregar otro campo de URL
                        </button>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/productos')}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 font-medium transition-colors ${isLoading ? 'opacity-50' : ''}`}
                    >
                        {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                    </button>
                </div>
            </form>
        </div>
    );
}
