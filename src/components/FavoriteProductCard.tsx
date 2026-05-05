import Link from 'next/link';
import { Product, ProductType } from '@/types';
import { OptimizedImage } from './OptimizedImage';
import { HeartDoodle, StarDoodle, TapeDoodle, SmileyFlowerDoodle, GlassesDoodle } from './doodles';

interface FavoriteProductCardProps {
  product: Product;
  index: number;
}

const imageFrames = [
  {
    radius: '60% 40% 40% 60% / 55% 50% 50% 45%', // Wide organic oval / deformed capsule
    rotate: 'rotate-2',
    accent: 'bg-rosa-pastel',
  },
  {
    radius: '35% 65% 55% 45% / 60% 40% 60% 40%', // Irregular squircle
    rotate: '-rotate-2',
    accent: 'bg-lila-suave',
  },
  {
    radius: '45% 55% 35% 65% / 50% 60% 40% 50%', // Soft asymmetrical blob
    rotate: 'rotate-1',
    accent: 'bg-rose-50',
  },
  {
    radius: '75% 25% 75% 25% / 45% 55% 45% 55%', // Tilted oval / horizontal organic
    rotate: '-rotate-1',
    accent: 'bg-rosa-pastel',
  },
  {
    radius: '50% 50% 25% 75% / 25% 75% 25% 75%', // Very rounded but distinct silhouette
    rotate: 'rotate-3',
    accent: 'bg-lila-suave/40',
  },
];

const getStatusText = (product: Product) => {
  if (product.tipo === ProductType.STOCK) return 'Listo para enviar';
  if (product.tipo === ProductType.PEDIDO) return product.tiempoProduccion ? `A pedido - ${product.tiempoProduccion}` : 'Hecho para vos';
  return product.personalizable ? 'Personalizable' : 'Artesanal';
};

export function FavoriteProductCard({ product, index }: FavoriteProductCardProps) {
  const frame = imageFrames[index % imageFrames.length];
  const detailHref = `/producto/${product.id}`;
  const whatsappPhone = process.env.NEXT_PUBLIC_WA_PHONE || '5491112345678';
  const whatsappHref = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hola! Queria consultar por ${product.nombre}.`)}`;
  const categoryColor = product.category?.color || '#dc1537';
  
  const label = product.label || '';
  
  // Mapeo visual basado en etiqueta comercial
  let tapeColor = '#dc1537';
  let renderDecorativeDoodle = () => <StarDoodle className="absolute -right-3 bottom-3 z-20 h-10 w-10 text-rosa-empolvado opacity-80 transition-transform duration-500 group-hover:rotate-12" />;

  if (label === 'Locamente Favoritos') {
    tapeColor = '#dc1537'; // coral/rojo
    renderDecorativeDoodle = () => <HeartDoodle className="absolute -right-3 bottom-3 z-20 h-10 w-10 text-coral/40 opacity-80 transition-transform duration-500 group-hover:-rotate-12" />;
  } else if (label === 'Best Seller') {
    tapeColor = '#f4a261'; // naranja cálido
    renderDecorativeDoodle = () => <StarDoodle className="absolute -right-3 bottom-3 z-20 h-10 w-10 text-amber-300 opacity-80 transition-transform duration-500 group-hover:rotate-12" />;
  } else if (label === 'Novedades') {
    tapeColor = '#60a5fa'; // celeste fresco
    renderDecorativeDoodle = () => <SmileyFlowerDoodle className="absolute -right-5 bottom-0 z-20 h-14 w-14 text-blue-200 opacity-80 transition-transform duration-500 group-hover:rotate-45" />;
  } else {
    // Fallback para otras etiquetas
    const hash = label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const tapeColors = ['#e9bbff', '#fca5a5', '#4ade80'];
    tapeColor = product.category?.color || tapeColors[hash % tapeColors.length];
    renderDecorativeDoodle = () => <GlassesDoodle className="absolute -right-2 bottom-4 z-20 h-8 w-16 text-gray-200 opacity-80 transition-transform duration-500 group-hover:-rotate-6" />;
  }

  const description = product.descripcion?.trim() || 'Una pieza única hecha a mano con mucho amor y dedicación. Ideal para darle un toque especial a tu día.';

  return (
    <article className="group relative flex h-full flex-col lg:flex-row lg:items-center rounded-[40px] border border-white/80 bg-white/95 p-5 shadow-[0_24px_70px_-32px_rgba(220,21,55,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_32px_90px_-36px_rgba(220,21,55,0.55)] sm:p-8 lg:p-10 lg:gap-12">
      <div className={`absolute -inset-2 -z-10 ${frame.accent} rounded-[44px] opacity-60 blur-sm transition-transform duration-500 group-hover:rotate-1`} />

      <div className="relative mb-7 lg:mb-0 lg:w-2/5 shrink-0">
        <div
          className={`relative z-10 aspect-4/3 overflow-hidden border-10 border-white bg-gray-50 shadow-[0_22px_45px_-24px_rgba(17,24,39,0.55)] transition-transform duration-700 group-hover:rotate-0 ${frame.rotate}`}
          style={{ borderRadius: frame.radius }}
        >
          <Link href={detailHref} aria-label={`Ver detalles de ${product.nombre}`}>
            <OptimizedImage
              src={product.imagenes[0]}
              alt={product.nombre}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              variant="featured"
            />
          </Link>
          <div className="pointer-events-none absolute inset-0 bg-coral/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <TapeDoodle
          color={tapeColor}
          className="absolute -top-3 left-7 z-20 w-16 -rotate-6 opacity-80 transition-transform duration-500 group-hover:-rotate-2"
        />
        {renderDecorativeDoodle()}
      </div>

      <div className="flex grow flex-col justify-center">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {product.category?.nombre && (
            <span
              className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
              style={{
                borderColor: `${categoryColor}33`,
                color: categoryColor,
                backgroundColor: `${categoryColor}12`,
              }}
            >
              {product.category.nombre}
            </span>
          )}
          {product.label && (
            <span className="rounded-full bg-rosa-pastel px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-coral">
              {product.label}
            </span>
          )}
        </div>

        <h3 className="mb-3 font-heading text-2xl font-bold leading-tight text-gray-900">
          <Link href={detailHref} className="transition-colors hover:text-coral">
            {product.nombre}
          </Link>
        </h3>

        <p className="mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-base font-medium leading-relaxed text-gray-600">
          {description}
        </p>

        <div className="mt-auto space-y-5">
          <div className="flex items-end justify-between gap-4 border-t border-rose-50 pt-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                {getStatusText(product)}
              </p>
              <p className="mt-1 text-2xl font-black text-gray-900">
                {product.precio ? `$${product.precio.toLocaleString('es-AR')}` : 'Consultar'}
              </p>
            </div>
            {product.personalizable && (
              <HeartDoodle className="h-8 w-8 shrink-0 text-coral/30" />
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-4">
            <Link
              href={detailHref}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-coral px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-rose-200/60 transition-all hover:bg-coral-dark hover:-translate-y-0.5"
            >
              Ver detalles
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 border-coral bg-white px-6 py-3 text-center text-sm font-bold text-coral transition-all hover:bg-rosa-pastel hover:-translate-y-0.5"
            >
              Consultar
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
