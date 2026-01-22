import React from 'react';
import Link from 'next/link';
import { apiService } from '@/services/apiService';
import { Product, ProductType, Category, HomeConfig } from '@/types';
import { StarDoodle, TapeDoodle, StickerDoodle, WavyLine, GlassesDoodle, SmileyFlowerDoodle, HeartDoodle, ShoppingBagDoodle, SpeechBubble } from '@/components/doodles';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ClientWavyBackground } from '@/components/background/ClientWavyBackground';

const RICKY_URL = "https://i.ibb.co/HTyR7k5Z/Chat-GPT-Image-27-dic-2025-11-15-30-p-m-removebg-preview.png";

export default async function HomePage() {
  const [productsData, categories, config] = await Promise.all([
    apiService.getProducts(),
    apiService.getCategories(),
    apiService.getHomeConfig()
  ]);

  const products = productsData.items;

  // Determinar los productos destacados
  const featured = !config || !config.featuredProductIds || config.featuredProductIds.length === 0
    ? products.slice(0, 3)
    : config.featuredProductIds
      .map((id: string) => products.find(p => p.id === id))
      .filter((p: Product | undefined): p is Product => !!p);


  return (
    <div className="space-y-32 pb-24 ">
      <ClientWavyBackground />
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
              <OptimizedImage
                src={config?.heroImageUrl || "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1000&auto=format&fit=crop"}
                className="w-full h-[600px] object-cover"
                alt="Tejido artesanal"
                priority={true}
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
            Locamente <span className="font-script text-coral">Favoritos</span>
            <StarDoodle className="absolute -top-6 -right-12 w-10 h-10 text-rosa-empolvado opacity-80 rotate-12" />
          </h2>
          <p className="text-gray-500 font-medium mt-4">Nuestras creaciones más mimadas</p>
        </div>

        <div className="space-y-48">
          {featured.map((product: Product, index: number) => {
            const isEven = index % 2 === 0;
            const stickerTexts = ['Novedades', 'Best Seller', 'Locamente Favoritos'];
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
                    <OptimizedImage
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

      {/* Sección de Ricky - Contacto Personalizado */}
      <section className="container mx-auto px-4 py-20 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Ricky Image */}
          <div className="w-64 h-64 lg:w-72 lg:h-72 shrink-0 relative group">
            <div className="absolute inset-0 bg-coral/10 rounded-full blur-3xl -z-10 group-hover:scale-125 transition-transform duration-700"></div>
            <OptimizedImage
              src={RICKY_URL}
              alt="Ricky el ovillo"
              className="w-full h-full object-contain drop-shadow-2xl floating-doodle"
            />
          </div>

          {/* Speech Bubble with Button */}
          <div className="grow w-full max-w-2xl">
            <SpeechBubble position="responsive" className="bg-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <p className="text-xl md:text-2xl text-gray-800 font-bold leading-tight text-center md:text-left">
                  Y si no encontrás acá lo que estás buscando y querés algo <span className="font-script text-coral text-3xl md:text-4xl">personalizado</span>, háblame por whatsapp tocando acá
                </p>
                <div className="shrink-0">
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_PHONE || '5491112345678'}?text=${encodeURIComponent("¡Hola! Quería consultarte por algo personalizado.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-[#20ba59] transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="transition-transform group-hover:rotate-12"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.438 5.662 1.439h.005c6.552 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </SpeechBubble>
          </div>
        </div>
      </section>
    </div>
  );
}
