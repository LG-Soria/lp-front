'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { StarDoodle, SmileyFlowerDoodle } from '@/components/doodles';

export default function AdminDashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Background Doodles */}
            <div className="absolute top-20 -right-10 opacity-20 rotate-12">
                <StarDoodle className="w-40 h-40 text-coral" />
            </div>
            <div className="absolute bottom-20 -left-10 opacity-20 -rotate-12">
                <SmileyFlowerDoodle className="w-48 h-48 text-coral" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="mb-16">
                    <h1 className="text-4xl font-heading font-bold text-gray-900">Panel de <span className="text-coral">Administración</span></h1>
                    <p className="text-gray-500 font-medium text-lg mt-2">¡Hola! ¿Qué vamos a crear hoy?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Link href="/admin/productos" className="group">
                        <div className="h-full bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-coral/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-coral/10 rounded-2xl flex items-center justify-center text-coral mb-8">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Productos</h2>
                                <p className="text-gray-500 font-medium leading-relaxed">Gestioná el catálogo, precios, descripciones y las fotos de tus creaciones.</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/categorias" className="group">
                        <div className="h-full bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-coral/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-coral/10 rounded-2xl flex items-center justify-center text-coral mb-8">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Categorías</h2>
                                <p className="text-gray-500 font-medium leading-relaxed">Organizá tus productos para que tus clientes encuentren todo más fácil.</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/pedidos" className="group">
                        <div className="h-full bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-coral/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-coral/10 rounded-2xl flex items-center justify-center text-coral mb-8">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9" /><polyline points="16 16 22 10 16 4" /><line x1="22" y1="10" x2="8" y2="10" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Pedidos</h2>
                                <p className="text-gray-500 font-medium leading-relaxed">Gestioná las compras de productos en stock, seguimientos y estados de pago.</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/consultas" className="group">
                        <div className="h-full bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-coral/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-coral/10 rounded-2xl flex items-center justify-center text-coral mb-8">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Consultas</h2>
                                <p className="text-gray-500 font-medium leading-relaxed">Atendé los pedidos personalizados y consultas de tus clientes.</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
