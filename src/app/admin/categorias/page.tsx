'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                                        <button
                                            onClick={() => handleDelete(category.id, category._count?.products || 0)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
