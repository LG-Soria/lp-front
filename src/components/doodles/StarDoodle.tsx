import React from 'react';

/**
 * Estrella de 4 puntas (Destello)
 * Representa un brillo artesanal, estilo retro/groovy.
 */
export const StarDoodle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} floating-doodle`} fill="currentColor">
    <path d="M50 0 C53 35 65 47 100 50 C65 53 53 65 50 100 C47 65 35 53 0 50 C35 47 47 35 50 0 Z" />
  </svg>
);
