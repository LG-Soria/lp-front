'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type ImageVariant =
    | 'thumbnail'
    | 'adminThumb'
    | 'cart'
    | 'card'
    | 'featured'
    | 'detail'
    | 'hero'
    | 'logo'
    | 'preview';

const IMAGE_VARIANTS: Record<ImageVariant, { width: number; height: number; sizes: string }> = {
    thumbnail: { width: 80, height: 80, sizes: '80px' },
    adminThumb: { width: 96, height: 96, sizes: '96px' },
    cart: { width: 128, height: 128, sizes: '128px' },
    card: { width: 400, height: 500, sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw' },
    featured: { width: 600, height: 750, sizes: '(max-width: 1024px) 90vw, 40vw' },
    detail: { width: 1200, height: 1500, sizes: '(max-width: 1024px) 100vw, 50vw' },
    hero: { width: 1400, height: 900, sizes: '(max-width: 1024px) 100vw, 50vw' },
    logo: { width: 200, height: 64, sizes: '200px' },
    preview: { width: 400, height: 400, sizes: '(max-width: 768px) 50vw, 400px' },
};

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    variant?: ImageVariant;
    sizes?: string;
    width?: number;
    height?: number;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Componente de imagen optimizada.
 * Usa `next/image` para locales y externas configuradas en `next.config.ts`.
 */
const OptimizedImageComponent: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    priority = false,
    fill = false,
    variant,
    sizes,
    width,
    height,
    objectFit = 'cover',
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const isRawImageSource = src.startsWith('data:') || src.startsWith('blob:');
    const variantConfig = variant ? IMAGE_VARIANTS[variant] : undefined;
    const resolvedWidth = width ?? variantConfig?.width ?? 800;
    const resolvedHeight = height ?? variantConfig?.height ?? 800;
    const resolvedSizes = sizes || variantConfig?.sizes || (fill ? '100vw' : undefined);

    if (isRawImageSource) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt}
                className={className}
                width={!fill ? resolvedWidth : undefined}
                height={!fill ? resolvedHeight : undefined}
                loading={priority ? 'eager' : 'lazy'}
                style={{ objectFit }}
            />
        );
    }

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
                width={!fill ? resolvedWidth : undefined}
                height={!fill ? resolvedHeight : undefined}
                sizes={resolvedSizes}
                onLoad={() => setIsLoading(false)}
                style={{ objectFit }}
            />
        </div>
    );
};

export const OptimizedImage = React.memo(OptimizedImageComponent);
