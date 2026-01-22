'use client';

import React, { useState } from 'react';
import { OptimizedImage } from '../OptimizedImage';
import { TapeDoodle, StickerDoodle, HeartDoodle } from '../doodles';

interface ProductImageGalleryProps {
    imagenes: string[];
    nombre: string;
    badge: {
        text: string;
        color: string;
    };
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ imagenes, nombre, badge }) => {
    const [selectedImg, setSelectedImg] = useState(0);

    return (
        <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center justify-start bg-rosa-pastel/5 border-r border-rosa-pastel/10 lg:rounded-l-[52px]">
            <div className="relative w-full group">
                <TapeDoodle color="#e9bbff" className="absolute -top-4 -left-6 z-30 -rotate-45 w-24" />
                <TapeDoodle color="#f89eb6" className="absolute -bottom-4 -right-6 z-30 -rotate-45 w-24" />

                <div className="relative aspect-4/5 rounded-[32px] overflow-hidden bg-white border-12 border-white shadow-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700">
                    <OptimizedImage
                        src={imagenes[selectedImg]}
                        alt={nombre}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        priority={true}
                    />

                    <StickerDoodle
                        text={badge.text}
                        color={badge.color}
                        className="absolute top-4 right-4 z-30 scale-125 rotate-12"
                    />
                </div>

                <HeartDoodle className="absolute -bottom-10 -left-10 w-24 h-24 text-coral opacity-20 hidden md:block" />
            </div>

            {/* Selector de imágenes (Miniaturas) */}
            {imagenes.length > 1 && (
                <div className="mt-12 flex flex-wrap gap-4 w-full justify-center">
                    {imagenes.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImg(idx)}
                            className={`w-20 h-20 rounded-2xl border-4 shadow-md overflow-hidden shrink-0 rotate-2 hover:rotate-0 transition-all ${selectedImg === idx ? 'border-coral scale-110 rotate-0 z-10' : 'border-white opacity-70'}`}
                        >
                            <OptimizedImage src={img} className="w-full h-full object-cover" alt={`Miniatura ${idx + 1}`} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
