'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    const [isRendered, setIsRendered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            document.body.style.overflow = 'hidden';
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    const links = [
        { name: 'Home', href: '/' },
        { name: 'Categorías', href: '/categorias' },
        { name: 'Info', href: '/info' },
        { name: 'Contacto', href: '/contacto' },
    ];

    return (
        <div className={`fixed inset-0 z-100 transition-visibility ${isVisible ? 'visible' : 'invisible delay-300'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full overflow-y-auto bg-white">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
                        <img
                            src="/logo.png"
                            alt="Locas Puntadas"
                            className="h-8 w-auto object-contain"
                        />
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex-1 px-6 py-8 flex flex-col gap-6 bg-white">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                className="text-2xl font-semibold text-gray-800 hover:text-coral transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-8 border-t border-gray-100 bg-gray-50 mt-auto">
                        <p className="text-sm text-gray-500 font-medium tracking-wide">© 2026 Locas Puntadas</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
