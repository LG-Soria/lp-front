'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Category } from '@/types';
import { StarDoodle, SmileyFlowerDoodle } from '@/components/doodles';

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
                    <h1 className="text-4xl font-heading font-bold text-gray-900">Categorías de <span className="text-coral">Admin</span></h1>
                    <p className="text-gray-500 font-medium text-lg">Organizá tus productos para una mejor experiencia de compra.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[32px] shadow-sm border border-gray-100 mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-coral rounded-full"></span>
                        Nueva Categoría
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                placeholder="Nombre (ej: Decoración, Accesorios...)"
                                className="w-full pl-6 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-medium transition-all"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !newCategoryName.trim()}
                            className="bg-coral text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-rose-200 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmitting ? 'Agregando...' : 'Agregar'}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Nombre</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-center">Productos</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
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
                                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color || '#FF69B4' }}></div>
                                                <span className="font-bold text-gray-900 uppercase tracking-tight">{category.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-gray-500">
                                                {category._count?.products || 0} ITEMS
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="text-gray-400 hover:text-coral hover:scale-110 transition-all"
                                                    title="Editar"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id, category._count?.products || 0)}
                                                    className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
                                                    title="Eliminar"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
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
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-100 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-10 relative overflow-hidden">
                            <StarDoodle className="absolute -top-10 -right-10 w-40 h-40 text-coral opacity-10 rotate-12" />

                            <div className="relative z-10">
                                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                                    Editar <span className="text-coral">Categoría</span>
                                </h2>
                                <p className="text-gray-500 font-medium mb-10">Ajustá la identidad visual de esta sección.</p>

                                <form onSubmit={handleUpdate} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nombre de Categoría</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-coral/20 outline-none font-bold transition-all"
                                                    value={editForm.nombre}
                                                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Color de Identidad</label>
                                                <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl">
                                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-sm border-2 border-white">
                                                        <input
                                                            type="color"
                                                            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                                            value={editForm.color}
                                                            onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black font-mono text-gray-700 uppercase">{editForm.color}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Color de doodles y etiquetas</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Imagen de Portada</label>
                                            <div className="relative group aspect-4/5 rounded-[32px] overflow-hidden bg-gray-50 border-4 border-white shadow-md">
                                                {editForm.imageUrl ? (
                                                    <>
                                                        <img src={editForm.imageUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-coral/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <label className="bg-white text-coral px-4 py-2 rounded-full text-xs font-bold cursor-pointer hover:scale-105 transition-transform shadow-lg">
                                                                Cambiar Imagen
                                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading || isSubmitting} />
                                                            </label>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-300 mb-3 shadow-sm">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{isUploading ? 'Subiendo...' : 'Subir Portada'}</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading || isSubmitting} />
                                                    </label>
                                                )}
                                                {isUploading && (
                                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                                        <div className="w-8 h-8 border-4 border-coral border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-6 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-8 py-4 rounded-full font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            Descartar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || isUploading}
                                            className="bg-coral text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-rose-200 hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Guardando...' : 'Aplicar Cambios'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
