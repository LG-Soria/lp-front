import React from 'react';
/**
 * Componente de Fondo Wavy Checkerboard basado en el SVG exacto proporcionado
 * Colores: st0 -> #e9bbff (Lila suave), st1 -> #f89eb6 (Rosa vibrante)
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
const WavyCheckerboardBackgroundComponent: React.FC = () => (
  <div className="fixed inset-0 min-w-screen min-h-screen z-[-1] overflow-hidden pointer-events-none">
    {/* Fondo base para evitar fogonazos blancos */}
    <div className="absolute inset-0 bg-[#e9bbff]" />

    {/* Imagen optimizada que reemplaza al SVG pesado de 200+ paths */}
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: 'url("/images/home-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Efecto sutil de grano o textura si se desea en el futuro
      }}
    />
  </div>
);

// Memoizar el componente para evitar re-renders innecesarios
export const WavyCheckerboardBackground = React.memo(WavyCheckerboardBackgroundComponent);
