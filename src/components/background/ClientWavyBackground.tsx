'use client';

import dynamic from 'next/dynamic';

/**
 * Wrapper de cliente para el fondo pesado para evitar que el SVG
 * sea parte del SSR inicial y cause errores de dynamic en Server Components.
 */
export const ClientWavyBackground = dynamic(
    () => import('./WavyCheckerboardBg').then(m => m.WavyCheckerboardBackground),
    { ssr: false }
);
