import React from 'react';
import Link from 'next/link';
import { SmileyFlowerDoodle, StarDoodle } from './doodles';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-rosa-pastel pt-20 pb-12 relative overflow-hidden">
      {/* Miceláneas decorativas de fondo: usando las nuevas versiones groovy */}
      <SmileyFlowerDoodle className="absolute top-0 right-0 w-80 h-80 text-white opacity-20 transform translate-x-1/3 -translate-y-1/3" />
      <StarDoodle className="absolute bottom-10 left-0 w-32 h-32 text-white opacity-40 transform -translate-x-1/2" />

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left relative z-10">
        <div className="space-y-6">
          <h3 className="font-script text-4xl text-coral">LocasPuntadas</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
            Piezas artesanales tejidas a mano. Productos únicos hechos con tiempo, dedicación y mucha alma.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            {/* Redes sociales */}
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-coral hover:bg-coral hover:text-white transition-all shadow-sm">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-bold text-gray-800 uppercase tracking-widest text-sm">Explorar</h4>
          <ul className="space-y-3 text-sm font-semibold text-gray-500">
            <li><Link href="/categorias" className="hover:text-coral transition-all">Catálogo</Link></li>
            <li><Link href="/info" className="hover:text-coral transition-all">Info importante</Link></li>
            <li><Link href="/contacto" className="hover:text-coral transition-all">Contacto</Link></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="font-bold text-gray-800 uppercase tracking-widest text-sm">Contacto</h4>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">Buenos Aires, Argentina</p>
            <p className="text-sm text-gray-800 font-bold">hola@locaspuntadas.com.ar</p>
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me/123456789"
              className="inline-flex items-center gap-2 bg-coral text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-coral-dark transition-all shadow-lg shadow-rose-200"
            >
              WhatsApp
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-20 pt-8 border-t border-rose-100 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-coral/40">
          &copy; {new Date().getFullYear()} LocasPuntadas • Tejido a mano • Conexión humana
        </p>
      </div>
    </footer>
  );
};
