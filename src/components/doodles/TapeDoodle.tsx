import React from 'react';

/**
 * Cinta adhesiva decorativa
 */
const TapeDoodleComponent = ({ className = "", color = "#FB7185" }: { className?: string; color?: string }) => (
  <div
    className={`${className} h-6 w-20 opacity-80 shadow-sm`}
    style={{
      backgroundColor: color,
      clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
      mixBlendMode: 'multiply'
    }}
  >
    <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #fff 5px, #fff 10px)' }}></div>
  </div>
);

export const TapeDoodle = React.memo(TapeDoodleComponent);
