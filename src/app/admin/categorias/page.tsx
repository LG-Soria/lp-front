'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editForm, setEditForm] = useState({
        nombre: '',
        imageUrl: '',
        color: '#FF69B4'
    });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsSubmitting(true);
        try {
            const created = await apiService.createCategory({ nombre: newCategoryName });
            setCategories([...categories, { ...created, _count: { products: 0 } }]);
            setNewCategoryName('');
        } catch (error) {
            alert('Error al crear la categoría. Probablemente ya existe.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setEditForm({
            nombre: category.nombre,
            imageUrl: category.imageUrl || '',
            color: category.color || '#FF69B4'
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        setIsSubmitting(true);
        try {
            const updated = await apiService.updateCategory(editingCategory.id, editForm);
            setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...updated } : c));
            setIsEditModalOpen(false);
        } catch (error) {
            alert('Error al actualizar la categoría');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const { uploadUrl, publicUrl } = await apiService.getPresignedUrl(file.name, file.type);
            await apiService.uploadFileToR2(uploadUrl, file);
            setEditForm({ ...editForm, imageUrl: publicUrl });
        } catch (error) {
            alert('Error al subir la imagen');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string, count: number) => {
        if (count > 0) {
            alert('No puedes eliminar una categoría que tiene productos asociados.');
            return;
        }

        if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;

        try {
            await apiService.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            alert('Error al eliminar la categoría');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                <p className="text-gray-600">Organiza tus productos en categorías para que los clientes los encuentren fácil.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4">Nueva Categoría</h2>
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Nombre de la categoría (ej: Decoración)"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newCategoryName.trim()}
                        className={`px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 font-medium transition-colors ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                        {isSubmitting ? 'Agregando...' : 'Agregar'}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-700 font-semibold text-sm uppercase">
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4 text-center">Productos</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    Cargando categorías...
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    Aún no has creado ninguna categoría.
                                </td>
                            </tr>
                        ) : (
                            categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{category.nombre}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-600">
                                            {category._count?.products || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id, category._count?.products || 0)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edición */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Editar Categoría</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={editForm.nombre}
                                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Color de Etiqueta</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        className="h-10 w-20 border rounded cursor-pointer"
                                        value={editForm.color}
                                        onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                                    />
                                    <span className="text-sm font-mono">{editForm.color}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Imagen de Portada</label>
                                <div className="space-y-2">
                                    {editForm.imageUrl && (
                                        <img src={editForm.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                                    )}
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">{isUploading ? 'Subiendo...' : 'Haz clic para subir'}</span></p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
                                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
