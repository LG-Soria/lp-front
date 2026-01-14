'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.email}</span>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">Productos</h2>
                    <p className="text-gray-600 mb-4">Gestiona el catálogo de productos, precios y stock.</p>
                    <Link
                        href="/admin/productos"
                        className="inline-block px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm font-medium transition-colors"
                    >
                        Ver Productos
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">Categorías</h2>
                    <p className="text-gray-600 mb-4">Organiza tus productos en categorías personalizadas.</p>
                    <Link
                        href="/admin/categorias"
                        className="inline-block px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm font-medium transition-colors"
                    >
                        Ver Categorías
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow opacity-50 cursor-not-allowed">
                    <h2 className="text-xl font-semibold mb-2">Pedidos (Próximamente)</h2>
                    <p className="text-gray-600 mb-4">Gestiona las solicitudes de clientes y estados de entrega.</p>
                    <span className="inline-block px-4 py-2 bg-gray-300 text-white rounded-md text-sm font-medium">
                        Bloqueado
                    </span>
                </div>
            </div>
        </div>
    );
}
