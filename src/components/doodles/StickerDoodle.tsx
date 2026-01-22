import React from 'react';

/**
 * Sticker circular con texto
 */
const StickerDoodleComponent = ({ className = "", text = "れnico", color = "#FB7185" }: { className?: string, text?: string, color?: string }) => (
  <div className={`${className} flex items-center justify-center p-4 rounded-full aspect-square text-white font-script text-center leading-tight shadow-lg transform hover:scale-110 transition-transform cursor-default`} style={{ backgroundColor: color, width: '80px' }}>
    <span className="text-xs rotate-12">{text}</span>
  </div>
);

export const StickerDoodle = React.memo(StickerDoodleComponent);
