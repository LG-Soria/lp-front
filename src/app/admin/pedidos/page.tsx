'use client';

import React, { useEffect, useState } from 'react';
import { apiService } from '@/services/apiService';
import { AdminHeader } from '@/components/AdminHeader';
import { OrderStatus } from '@/types';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAdminOrders();
            setOrders(response.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.DELIVERED: return 'bg-green-100 text-green-700';
            case OrderStatus.PAID: return 'bg-blue-100 text-blue-700';
            case OrderStatus.PENDING_PAYMENT: return 'bg-yellow-100 text-yellow-700';
            case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
            case OrderStatus.SHIPPED: return 'bg-purple-100 text-purple-700';
            case OrderStatus.IN_PREPARATION: return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gray-800">Pedidos (Stock)</h1>
                    <button
                        onClick={fetchOrders}
                        className="p-2 text-gray-500 hover:text-coral transition-colors"
                        title="Actualizar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                        Error: {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No se encontraron pedidos todavía.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">ID</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-800">{order.customerName}</div>
                                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            ${(order.totalCents / 100).toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-coral hover:underline text-sm font-bold">Ver detalle</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
