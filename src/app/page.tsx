'use client';

import React from 'react';
import Link from 'next/link';
import { apiService } from '@/services/apiService';
import { Product, ProductType, Category } from '@/types';
import { StarDoodle, TapeDoodle, StickerDoodle, WavyLine, GlassesDoodle, SmileyFlowerDoodle, HeartDoodle, ShoppingBagDoodle } from '@/components/doodles';
import { WavyCheckerboardBackground } from '@/components/background/WavyCheckerboardBg';

export default function HomePage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      apiService.getProducts(),
      apiService.getCategories()
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  const featured = products.slice(0, 3);

  // Colores por defecto para categorías que no tengan uno asignado
  const defaultColors = ['#FB7185', '#7C3AED', '#F472B6', '#10B981', '#3B82F6'];
  const defaultBgs = ['bg-rosa-pastel', 'bg-lila-suave', 'bg-rosa-empolvado', 'bg-green-100', 'bg-blue-100'];

  return (
    <div className="space-y-32 pb-24 ">
      <WavyCheckerboardBackground />
      {/* Hero Section: Presentación de la marca */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Misceláneas de fondo para el look artesanal */}
        <StarDoodle className="absolute top-20 left-10 w-16 h-16 text-coral opacity-20 hidden lg:block" />
        <SmileyFlowerDoodle className="absolute bottom-20 right-10 w-48 h-48 opacity-20 hidden lg:block" />

        {/* CORAZÓN EN EL HERO */}
        <HeartDoodle className="absolute bottom-40 left-[25%] w-48 h-48 opacity-20 hidden lg:block" />

        <div className="absolute top-40 right-1/4 w-8 h-8 rounded-full border-2 border-dashed border-coral/30 floating-doodle"></div>

        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-block px-4 py-1.5 bg-rosa-pastel text-coral rounded-full text-sm font-bold tracking-widest uppercase">
              Hecho a mano con amor
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 leading-[1.1]">
              Piezas <span className="font-script text-coral">artesanales</span> con carácter propio
            </h1>
            <p className="text-xl text-gray-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Cada pieza de LocasPuntadas está hecha a mano, una por una. Productos únicos, llenos de personalidad y alejados de lo genérico.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <Link
                href="/categorias"
                className="bg-coral text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-coral-dark transition-all shadow-xl shadow-rose-200/50 transform hover:-translate-y-1"
              >
                Ver productos
              </Link>
              <Link
                href="/info"
                className="bg-white text-gray-700 border border-gray-100 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-50 transition-all"
              >
                Nuestra historia
              </Link>
            </div>
          </div>

          {/* Imagen del Hero con rotación orgánica */}
          <div className="relative mx-auto lg:ml-auto max-w-md lg:max-w-none">
            <div className="relative z-10 rounded-[40px] overflow-hidden border-8 border-white shadow-2xl rotate-2">
              <img
                src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1000&auto=format&fit=crop"
                className="w-full h-[600px] object-cover"
                alt="Tejido artesanal"
              />
            </div>
            <SmileyFlowerDoodle className="absolute -top-12 -right-12 w-64 h-64 -z-10 rotate-12" />
            <div className="absolute -top-6 -left-6 w-full h-full bg-rosa-pastel rounded-[40px] -rotate-3 -z-10"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-lila-suave rounded-full -z-10 opacity-60"></div>
          </div>
        </div>
      </section>

      {/* Favoritos - Diseño alternado */}
      <section className="container mx-auto px-4 relative">
        <div className="text-center mb-32 relative">
          <WavyLine className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 text-coral opacity-30" />
          <h2 className="text-5xl md:text-6xl font-heading font-bold relative inline-block text-gray-900">
            Favoritos de la <span className="font-script text-coral">casa</span>
            <StarDoodle className="absolute -top-6 -right-12 w-10 h-10 text-rosa-empolvado opacity-80 rotate-12" />
          </h2>
          <p className="text-gray-500 font-medium mt-4">Nuestras joyitas tejidas, elegidas por ustedes.</p>
        </div>

        <div className="space-y-48">
          {featured.map((product, index) => {
            const isEven = index % 2 === 0;
            const stickerTexts = ['Best seller', 'Hecho hoy', 'Favorito'];
            const stickerColors = ['#FB7185', '#7C3AED', '#F472B6'];

            const stickerText = product.label || stickerTexts[index % stickerTexts.length];
            const stickerColor = product.category?.color || stickerColors[index % stickerColors.length];

            const shadowClasses = [
              'group-hover:shadow-[0_40px_80px_-15px_rgba(251,113,133,0.4)]',
              'group-hover:shadow-[0_40px_80px_-15px_rgba(124,58,237,0.3)]',
              'group-hover:shadow-[0_40px_80px_-15px_rgba(244,114,182,0.4)]'
            ];

            return (
              <div
                key={product.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 relative group`}
              >
                <div className={`relative w-full max-w-[400px] shrink-0`}>
                  <div className={`relative z-10 aspect-3/4 overflow-hidden rounded-full border-12 border-white shadow-2xl transform ${isEven ? 'rotate-2' : '-rotate-2'} group-hover:rotate-0 ${shadowClasses[index % 3]} transition-all duration-700`}>
                    <img
                      src={product.imagenes[0]}
                      alt={product.nombre}
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-coral/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <div className={`absolute -inset-4 bg-rosa-pastel rounded-full -z-10 ${isEven ? '-rotate-3' : 'rotate-3'} opacity-50 blur-sm`}></div>

                  <StickerDoodle
                    text={stickerText}
                    color={stickerColor}
                    className={`absolute ${isEven ? '-top-10 -right-6' : '-top-10 -left-6'} z-20 scale-110 shadow-xl rotate-12 transition-all duration-500 group-hover:rotate-[-4deg] group-hover:-translate-y-6 group-hover:scale-125`}
                  />
                  <StarDoodle className={`absolute ${isEven ? '-bottom-10 -left-10' : '-bottom-10 -right-10'} w-16 h-16 text-lila-suave opacity-40`} />
                  <TapeDoodle color={stickerColor} className={`absolute ${isEven ? 'bottom-20 -right-8' : 'bottom-20 -left-8'} rotate-90 opacity-40`} />
                </div>

                <div className={`grow text-center lg:text-left space-y-6 max-w-xl`}>
                  <div className="flex flex-col gap-1">
                    <span className="text-coral font-bold uppercase tracking-[0.2em] text-xs">{product.category?.nombre}</span>
                    <h3 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">
                      <Link href={`/producto/${product.id}`} className="hover:text-coral transition-colors duration-300">
                        {product.nombre}
                      </Link>
                    </h3>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed italic">
                    "{product.descripcion}"
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${product.tipo === ProductType.STOCK ? 'bg-green-50 text-green-600 border-green-100' :
                      product.tipo === ProductType.PEDIDO ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        'bg-rose-50 text-coral border-rose-100'
                      }`}>
                      {product.tipo === ProductType.STOCK ? 'Listo para enviar' : product.tipo === ProductType.PEDIDO ? 'Hecho para vos' : 'Personalizable'}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {product.precio ? `$${product.precio.toLocaleString('es-AR')}` : 'Consultar'}
                    </span>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={`/producto/${product.id}`}
                      className="inline-flex items-center gap-4 bg-coral text-white px-10 py-4 rounded-full font-bold hover:bg-coral-dark transition-all shadow-xl shadow-rose-200 transform hover:-translate-y-1"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>

                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-5xl -z-20 ${isEven ? 'bg-lila-suave/20' : 'bg-rosa-pastel/20'} rounded-[200px] blur-3xl ${isEven ? 'rotate-12' : '-rotate-12'}`}></div>
              </div>
            );
          })}
        </div>

        <div className="mt-48 text-center">
          <Link
            href="/categorias"
            className="group inline-flex items-center gap-4 bg-white border-2 border-coral/20 px-12 py-4 rounded-full text-coral font-bold hover:bg-coral hover:text-white hover:border-coral transition-all duration-300 shadow-lg shadow-coral/5"
          >
            Explorar catálogo completo
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Filosofía Artesanal */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-rosa-pastel/50 skew-y-3 -z-10"></div>
        <div className="container mx-auto px-4 max-w-4xl relative text-center">
          <GlassesDoodle className="absolute -top-10 -right-10 w-48 h-48 opacity-10" />
          <StarDoodle className="absolute -bottom-10 -left-10 w-24 h-24 text-lila-suave" />

          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-10 leading-tight">
            El valor de lo <br /><span className="font-script text-coral text-6xl">hecho a mano</span>
          </h2>
          <div className="space-y-8">
            <p className="text-2xl text-gray-700 font-medium leading-relaxed italic">
              "No buscamos la perfección de las máquinas, sino la calidez de las manos. Cada punto cuenta una historia y cada nudo es un compromiso con la paciencia."
            </p>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              En LocasPuntadas, no solo vendemos tejidos; compartimos un proceso artesanal honesto. Creemos en la sostenibilidad del tiempo y el respeto por el material.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {categories.slice(0, 3).map((cat, i) => {
            const catColor = cat.color || defaultColors[i % defaultColors.length];
            const rotate = i % 2 === 0 ? 'rotate-2' : '-rotate-1';
            const img = cat.imageUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800&auto=format&fit=crop'

            return (
              <div key={cat.id} className="relative group">
                <div
                  className={`absolute inset-0 opacity-20 rounded-3xl -rotate-3 group-hover:-rotate-6 transition-all duration-500 shadow-sm border border-gray-100/50`}
                  style={{ backgroundColor: catColor }}
                ></div>

                <Link
                  href="/categorias"
                  className={`relative block p-4 bg-white shadow-xl rounded-sm ${rotate} group-hover:rotate-0 transition-all duration-500`}
                >
                  <TapeDoodle color={catColor} className="absolute -top-3 left-1/2 -translate-x-1/2 z-30" />

                  <div className="relative overflow-hidden rounded-sm aspect-4/5">
                    <img
                      src={img}
                      className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      alt={cat.nombre}
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-30 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                      <h3 className="text-white text-3xl lg:text-4xl font-script font-bold drop-shadow-lg group-hover:scale-110 transition-transform">
                        {cat.nombre}
                      </h3>
                      <span className="text-white/80 text-[10px] uppercase tracking-[0.2em] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        Explorar colección
                      </span>
                    </div>
                  </div>
                </Link>

                {i === 0 && <ShoppingBagDoodle className="absolute -bottom-8 -right-4 w-24 h-24 opacity-30 group-hover:animate-bounce-slow" />}
                {i === 1 && <StarDoodle className="absolute -top-10 -right-8 w-12 h-12 text-rosa-empolvado opacity-60 group-hover:animate-spin-slow" />}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
