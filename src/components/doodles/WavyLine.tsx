import React from 'react';

/**
 * Lケnea ondulada decorativa
 */
export const WavyLine = ({ className = "", color = "currentColor" }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 200 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);
