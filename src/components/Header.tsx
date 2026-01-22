import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import SearchDrawer from './SearchDrawer';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  const { token } = useAuth();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-700 hover:text-coral transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Locas Puntadas Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {token && !isAdmin && (
              <Link
                href="/admin"
                className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all"
              >
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                Admin Panel
              </Link>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-10 text-sm font-semibold tracking-wide text-gray-500">
            <Link href="/" className="hover:text-coral transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/categorias" className="hover:text-coral transition-colors relative group">
              Categorías
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/info" className="hover:text-coral transition-colors relative group">
              Info
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contacto" className="hover:text-coral transition-colors relative group">
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/carrito" className="relative p-2 md:p-3 bg-rosa-pastel rounded-full hover:bg-rosa-empolvado transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-gray-700 group-hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral text-white text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 md:p-3 text-gray-700 hover:text-coral transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Drawers outside header to avoid containing block issues */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

