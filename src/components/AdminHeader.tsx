'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export const AdminHeader: React.FC = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navLinks = [
        { name: 'Inicio', href: '/admin' },
        { name: 'Productos', href: '/admin/productos' },
        { name: 'Categorías', href: '/admin/categorias' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/admin" className="flex items-center gap-2 group">
                        <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-coral transition-colors">
                            LOCAS<span className="text-coral">.</span>
                        </span>
                        <span className="bg-coral/10 text-coral text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mt-1">Admin</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-coral hover:scale-105 ${isActive ? 'text-coral' : 'text-gray-400'}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-coral animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-500 truncate max-w-[150px]">{user?.email}</span>
                    </div>
                    <Link
                        href="/"
                        className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-coral transition-colors flex items-center gap-2"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="12" x2="21" y2="3" /></svg>
                        Shop
                    </Link>
                    <div className="h-6 w-px bg-gray-100"></div>
                    <button
                        onClick={logout}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Cerrar Sesión"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </button>
                </div>
            </div>
        </header>
    );
};
