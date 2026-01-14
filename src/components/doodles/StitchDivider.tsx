import React from 'react';

/**
 * Divisor con puntadas
 */
export const StitchDivider = () => (
  <div className="flex justify-center items-center py-8 gap-2">
    <div className="h-0.5 w-16 bg-coral opacity-20"></div>
    <div className="text-coral opacity-40">
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path d="M2 10 L18 10 M10 2 L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    <div className="h-0.5 w-16 bg-coral opacity-20"></div>
  </div>
);
