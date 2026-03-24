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
    sizes,
    width,
    height,
    objectFit = 'cover',
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const isRawImageSource = src.startsWith('data:') || src.startsWith('blob:');
    const resolvedSizes = sizes || (fill ? '100vw' : undefined);

    if (isRawImageSource) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt}
                className={className}
                width={width}
                height={height}
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
                width={!fill ? (width ?? 1200) : undefined}
                height={!fill ? (height ?? 1200) : undefined}
                sizes={resolvedSizes}
                onLoad={() => setIsLoading(false)}
                style={{ objectFit }}
            />
        </div>
    );
};

export const OptimizedImage = React.memo(OptimizedImageComponent);
