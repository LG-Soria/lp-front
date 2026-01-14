'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export const AdminHeader: React.FC = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navLinks = [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Productos', href: '/admin/productos' },
        { name: 'Categorías', href: '/admin/categorias' },
        { name: 'Ver Tienda', href: '/' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 shadow-lg">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-xl font-bold font-script text-pink-400">
                            LP Admin
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`transition-colors hover:text-pink-400 ${isActive ? 'text-pink-400' : 'text-gray-300'}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                        {user?.email}
                    </span>
                    <button
                        onClick={logout}
                        className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold rounded-md transition-colors text-pink-400 border border-pink-400/20"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </header>
    );
};
