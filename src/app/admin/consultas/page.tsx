'use client';

import React, { useEffect, useState } from 'react';
import { apiService } from '@/services/apiService';
import { AdminHeader } from '@/components/AdminHeader';
import { RequestStatus } from '@/types';

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAdminRequests();
            setRequests(response.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (id: string) => {
        try {
            setDetailLoading(true);
            const request = await apiService.getAdminRequestById(id);
            setSelectedRequest(request);
        } catch (err: any) {
            alert("Error al cargar detalles: " + err.message);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus: RequestStatus) => {
        if (!selectedRequest) return;
        try {
            setUpdatingStatus(true);
            await apiService.updateAdminRequestStatus(selectedRequest.id, newStatus);
            // Actualizar localmente o recargar
            setSelectedRequest({ ...selectedRequest, status: newStatus });
            fetchRequests(); // Recargar lista
        } catch (err: any) {
            alert("Error al actualizar estado: " + err.message);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case RequestStatus.DELIVERED: return 'bg-green-100 text-green-700';
            case RequestStatus.IN_PRODUCTION: return 'bg-blue-100 text-blue-700';
            case RequestStatus.NEW: return 'bg-purple-100 text-purple-700';
            case RequestStatus.READY: return 'bg-orange-100 text-orange-700';
            case RequestStatus.REVIEWING: return 'bg-yellow-100 text-yellow-700';
            case RequestStatus.QUOTED: return 'bg-teal-100 text-teal-700';
            case RequestStatus.ACCEPTED: return 'bg-indigo-100 text-indigo-700';
            case RequestStatus.LOST: return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <AdminHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gray-800">Consultas (Por Pedido)</h1>
                    <button
                        onClick={fetchRequests}
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
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No se encontraron consultas todavía.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">ID</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Producto</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{request.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(request.createdAt).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-800">{request.customerName}</div>
                                            <div className="text-xs text-gray-500">{request.email || request.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {request.productName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetail(request.id)}
                                                className="text-coral hover:underline text-sm font-bold disabled:opacity-50"
                                                disabled={detailLoading}
                                            >
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* MODAL DETALLE */}
            {selectedRequest && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-slide-up">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Consulta de Producto</span>
                                    <h2 className="text-3xl font-heading font-bold text-gray-900 mt-1">#{selectedRequest.id.slice(0, 8)}</h2>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <section>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Información del Cliente</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Nombre</p>
                                            <p className="text-gray-800 font-bold">{selectedRequest.customerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Email</p>
                                            <p className="text-gray-800 font-bold">{selectedRequest.email || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">WhatsApp</p>
                                            <p className="text-gray-800 font-bold">{selectedRequest.phone || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Código Postal</p>
                                            <p className="text-gray-800 font-bold">{selectedRequest.postalCode || '-'}</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Producto Interesado</h3>
                                    <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                                            {selectedRequest.product?.imagenes[0] && (
                                                <img src={selectedRequest.product.imagenes[0]} alt={selectedRequest.product.nombre} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-tight">{selectedRequest.product?.nombre}</p>
                                            <p className="text-xs text-coral font-bold mt-1">${selectedRequest.product?.precio?.toLocaleString('es-AR') || 'A convenir'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight mb-2">Mensaje / Descripción</p>
                                        <div className="p-4 bg-lila-suave/30 rounded-xl text-sm italic text-gray-600 leading-relaxed min-h-[80px]">
                                            "{selectedRequest.description || 'Sin comentarios adicionales.'}"
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="border-t border-gray-100 pt-8 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado:</span>
                                    <select
                                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-none focus:ring-2 focus:ring-coral/20 cursor-pointer ${getStatusColor(selectedRequest.status)}`}
                                        value={selectedRequest.status}
                                        disabled={updatingStatus}
                                        onChange={(e) => handleUpdateStatus(e.target.value as RequestStatus)}
                                    >
                                        {Object.values(RequestStatus).map(s => (
                                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    {selectedRequest.phone && (
                                        <a
                                            href={`https://wa.me/${selectedRequest.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.438 5.662 1.439h.005c6.552 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                            Responder
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
