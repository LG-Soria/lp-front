'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Componente optimizado para imágenes con lazy loading
 * Usa Next.js Image cuando es posible, o img nativo con loading="lazy"
 */
const OptimizedImageComponent: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    priority = false,
    fill = false,
    sizes,
    objectFit = 'cover',
}) => {
    const [isLoading, setIsLoading] = useState(true);

    // Si la imagen es externa o no está optimizada por Cloudflare/CDN, usar img nativo
    const isExternalImage = src.startsWith('http://') || src.startsWith('https://');

    if (isExternalImage) {
        return (
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
                )}
                <img
                    src={src}
                    alt={alt}
                    className={className}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={() => setIsLoading(false)}
                    style={{ objectFit }}
                />
            </div>
        );
    }

    // Para imágenes locales, usar Next.js Image para optimización automática
    return (
        <div className="relative">
            {isLoading && !priority && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
            )}
            <Image
                src={src}
                alt={alt}
                className={className}
                priority={priority}
                fill={fill}
                sizes={sizes}
                onLoad={() => setIsLoading(false)}
                style={{ objectFit }}
            />
        </div>
    );
};

export const OptimizedImage = React.memo(OptimizedImageComponent);
