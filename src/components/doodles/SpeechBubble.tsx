import React, { type ReactNode } from 'react';

/**
 * Bocadillo de texto estilo Cartoon
 */
export const SpeechBubble = (
  { children, className = "", position = "left" }: { children: ReactNode, className?: string, position?: "left" | "right" }
) => (
  <div className={`relative bg-white p-8 rounded-[40px] border-4 border-gray-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${className}`}>
    {children}
    {/* Triケngulo del bocadillo (Borde) */}
    <div 
      className={`absolute -bottom-6 ${position === 'left' ? 'left-12' : 'right-12'} w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-gray-900`}
    />
    {/* Triケngulo del bocadillo (Relleno) */}
    <div 
      className={`absolute -bottom-4 ${position === 'left' ? 'left-[50px]' : 'right-[50px]'} w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[25px] border-t-white`}
    />
  </div>
);
