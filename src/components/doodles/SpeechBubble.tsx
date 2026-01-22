import React, { type ReactNode } from 'react';

/**
 * Bocadillo de texto estilo Cartoon
 */
export const SpeechBubble = (
  { children, className = "", position = "left" }: { children: ReactNode, className?: string, position?: "left" | "right" | "responsive" }
) => (
  <div className={`relative bg-white p-8 rounded-[40px] border-4 border-gray-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${className}`}>
    {children}

    {position === 'responsive' ? (
      <>
        {/* Mobile: Flecha arriba apuntando a Ricky */}
        <div className="lg:hidden">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-b-30 border-b-gray-900" />
          <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-16 border-l-transparent border-r-16 border-r-transparent border-b-25 border-b-white" />
        </div>

        {/* Desktop: Flecha a la izquierda apuntando a Ricky */}
        <div className="hidden lg:block">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-0 h-0 border-t-20 border-t-transparent border-b-20 border-b-transparent border-r-30 border-r-gray-900" />
          <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-16 border-t-transparent border-b-16 border-b-transparent border-r-25 border-r-white" />
        </div>
      </>
    ) : (
      <>
        {/* Triケngulo del bocadillo (Borde) */}
        <div
          className={`absolute -bottom-6 ${position === 'left' ? 'left-12' : 'right-12'} w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-t-30 border-t-gray-900`}
        />
        {/* Triケngulo del bocadillo (Relleno) */}
        <div
          className={`absolute -bottom-4 ${position === 'left' ? 'left-[50px]' : 'right-[50px]'} w-0 h-0 border-l-16 border-l-transparent border-r-16 border-r-transparent border-t-25 border-t-white`}
        />
      </>
    )}
  </div>
);
