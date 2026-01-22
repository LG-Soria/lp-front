'use client';

import React from 'react';
import Link from 'next/link';
import { Product, ProductType } from '@/types';
import { TapeDoodle, StarDoodle } from './doodles';
import { OptimizedImage } from './OptimizedImage';

interface ProductCardProps {
  product: Product;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({ product }) => {
  const isPedido = product.tipo === ProductType.PEDIDO;

  // Memoizar el color de la categoría para evitar recálculo
  const categoryColor = React.useMemo(() =>
    product.category?.color || '#9CA3AF',
    [product.category?.color]
  );

  // Memoizar el color de la cinta
  const tapeColor = React.useMemo(() => categoryColor, [categoryColor]);

  // Memoizar el color de fondo decorativo
  const offsetColor = React.useMemo(() => {
    switch (product.category?.nombre) {
      case 'Hogar': return 'bg-rosa-pastel';
      case 'Indumentaria': return 'bg-lila-suave';
      case 'Niños': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
  }, [product.category?.nombre]);

  return (
    <div className="relative group perspective-1000">
      {/* Capa de fondo decorativa (Paper offset) */}
      <div className={`absolute inset-0 ${offsetColor} rounded-[32px] transform translate-x-2 translate-y-2 -rotate-2 group-hover:rotate-1 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500 opacity-60`}></div>

      {/* Contenedor Principal de la Card */}
      <div className="relative flex flex-col h-full bg-white rounded-[32px] border border-gray-100 p-4 shadow-sm group-hover:shadow-xl group-hover:shadow-rose-100/30 transition-all duration-500 transform group-hover:-translate-y-2">

        {/* Imagen Estilo Foto con Cinta */}
        <div className="relative mb-6">
          {/* Cinta adhesiva que "pega" la foto */}
          <TapeDoodle
            color={tapeColor}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-16 h-5 -rotate-2 group-hover:rotate-1 transition-transform"
          />

          <Link
            href={`/producto/${product.id}`}
            className="relative block overflow-hidden rounded-2xl bg-gray-50 aspect-4/5 border-4 border-white shadow-inner transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"
          >
            <OptimizedImage
              src={product.imagenes[0]}
              alt={product.nombre}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />

            {/* Overlay de textura de papel sutil */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-10 pointer-events-none"></div>
          </Link>

          {/* Badge de Estado como Sticker */}
          <div className="absolute -bottom-3 -right-2 z-20">
            {product.tipo === ProductType.STOCK && (
              <span className="bg-green-500 text-white text-[9px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest shadow-lg -rotate-6 group-hover:rotate-0 transition-transform block">
                Stock
              </span>
            )}
            {isPedido && (
              <span className="bg-purple-500 text-white text-[9px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest shadow-lg rotate-6 group-hover:rotate-0 transition-transform block">
                A Pedido
              </span>
            )}
          </div>
        </div>

        {/* Contenido de Texto */}
        <div className="flex flex-col grow px-2">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category?.nombre}</p>
            <StarDoodle className="w-4 h-4 text-rosa-empolvado opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <h3 className="font-heading text-lg text-gray-800 mb-3 leading-tight min-h-12 line-clamp-2">
            <Link href={`/producto/${product.id}`} className="hover:text-coral transition-colors">
              {product.nombre}
            </Link>
          </h3>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Precio</span>
              <span className="text-xl font-bold text-gray-900">
                {product.precio ? `$${product.precio.toLocaleString('es-AR')}` : 'Consultar'}
              </span>
            </div>

            <Link
              href={`/producto/${product.id}`}
              className="bg-rosa-pastel text-coral p-3 rounded-2xl hover:bg-coral hover:text-white transition-all duration-300 transform group-hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export const ProductCard = React.memo(ProductCardComponent);
