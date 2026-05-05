import React from 'react';
import Link from 'next/link';
import { apiService } from '@/services/apiService';
import { Product } from '@/types';
import { StarDoodle, WavyLine, GlassesDoodle, SmileyFlowerDoodle, HeartDoodle, SpeechBubble } from '@/components/doodles';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ClientWavyBackground } from '@/components/background/ClientWavyBackground';
import { FavoriteProductCard } from '@/components/FavoriteProductCard';
import { HandmadeValueSection } from '@/components/HandmadeValueSection';
const RICKY_URL = "https://i.ibb.co/HTyR7k5Z/Chat-GPT-Image-27-dic-2025-11-15-30-p-m-removebg-preview.png";


export default async function HomePage() {
  const config = await apiService.getHomeConfig();

  const featuredProductIds = config?.featuredProductIds?.slice(0, 3) ?? [];
  const configuredFeatured = featuredProductIds.length > 0
    ? await apiService.getEligibleFeaturedProducts({ limit: 3, ids: featuredProductIds, imageMode: 'cover' })
    : await apiService.getEligibleFeaturedProducts({ imageMode: 'cover' });

  // Lógica de selección de productos: priorizar variedad por etiquetas comerciales
  const TARGET_LABELS = [
    "Locamente Favoritos",
    "Best Seller",
    "Novedades"
  ];
  
  const candidates = featuredProductIds.length === 0
    ? configuredFeatured
    : featuredProductIds
      .map((id: string) => configuredFeatured.find(p => p.id === id))
      .filter((p: Product | undefined): p is Product => !!p);

  const selectedProducts: Product[] = [];
  const MAX_FEATURED = 3;

  // Primera pasada: intentar obtener uno de cada etiqueta comercial prioritaria
  for (const targetLabel of TARGET_LABELS) {
    const found = candidates.find(p => 
      p.label === targetLabel && !selectedProducts.some(s => s.id === p.id)
    );
    if (found) {
      selectedProducts.push(found);
    }
  }

  // Segunda pasada: rellenar con los que faltan respetando el orden original si no se cubrió el cupo
  if (selectedProducts.length < MAX_FEATURED) {
    for (const p of candidates) {
      if (selectedProducts.length >= MAX_FEATURED) break;
      if (!selectedProducts.some(s => s.id === p.id)) {
        selectedProducts.push(p);
      }
    }
  }

  const featured = selectedProducts;


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
                fetchPriority="high"
                variant="hero"
              />
            </div>
            <SmileyFlowerDoodle className="absolute -top-12 -right-12 w-64 h-64 -z-10 rotate-12" />
            <div className="absolute -top-6 -left-6 w-full h-full bg-rosa-pastel rounded-[40px] -rotate-3 -z-10"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-lila-suave rounded-full -z-10 opacity-60"></div>
          </div>
        </div>
      </section>

      {/* Favoritos */}
      <section className="container mx-auto px-4 relative">
        <div className="text-center mb-16 md:mb-20 relative">
          <WavyLine className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 text-coral opacity-30" />
          <h2 className="text-5xl md:text-6xl font-heading font-bold relative inline-block text-gray-900">
            Locamente <span className="font-script text-coral">Favoritos</span>
            <StarDoodle className="absolute -top-6 -right-12 w-10 h-10 text-rosa-empolvado opacity-80 rotate-12" />
          </h2>
          <p className="text-gray-500 font-medium mt-4">Nuestras creaciones más mimadas</p>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="absolute -left-10 top-16 h-48 w-48 rounded-full bg-rosa-pastel/70 blur-3xl" />
          <div className="absolute -right-8 bottom-10 h-56 w-56 rounded-full bg-lila-suave/80 blur-3xl" />

          <div className="relative flex flex-col gap-12 md:gap-16 max-w-5xl mx-auto">
            {featured.map((product: Product, index: number) => (
              <FavoriteProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-16 md:mt-20 text-center">
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

      {/* Filosofía Artesanal - Refactorizada */}
      <HandmadeValueSection />

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
              width={288}
              height={288}
              sizes="(max-width: 1024px) 256px, 288px"
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

