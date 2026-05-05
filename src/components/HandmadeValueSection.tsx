import React from 'react';
import Image from 'next/image';

export const HandmadeValueSection = () => {
  const handmadeAssets = {
    canasto: "/images/Elementos/E_1.png",
    tejidoRosa: "/images/Elementos/E_2.png",
    granny: "/images/Elementos/E_3.png",
    ramita: "/images/Elementos/E_4.png",
    corazon: "/images/Elementos/E_5.png",
    hilo: "/images/Elementos/E_6.png",
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FEF4F4] py-16 lg:py-0 lg:h-[780px] flex items-center justify-center my-16">
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base lila pastel suave */}
          <rect width="1440" height="800" fill="#f8effa" opacity="0.5"/>
          {/* Formas curvas rosas para simular checker ondulado */}
          <path d="M0 0H720C720 150 480 300 0 300V0Z" fill="#ffd1dc" opacity="0.4"/>
          <path d="M1440 0H720C720 150 960 300 1440 300V0Z" fill="#fff" opacity="0.4"/>
          <path d="M0 800H720C720 650 480 500 0 500V800Z" fill="#fff" opacity="0.4"/>
          <path d="M1440 800H720C720 650 960 500 1440 500V800Z" fill="#ffd1dc" opacity="0.4"/>
          <path d="M720 300C960 300 1200 400 1440 500C1200 600 960 650 720 650C480 650 240 600 0 500C240 400 480 300 720 300Z" fill="#ffebf0" opacity="0.6"/>
          
          {/* Costuras sutiles de fondo */}
          <path d="M-100 200C200 300 500 100 800 250C1100 400 1400 200 1600 300" stroke="#f4b8c3" strokeWidth="2" strokeDasharray="8 12" fill="none" opacity="0.5"/>
          <path d="M-100 600C200 700 500 500 800 650C1100 800 1400 600 1600 700" stroke="#f4b8c3" strokeWidth="2" strokeDasharray="8 12" fill="none" opacity="0.5"/>
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-[1300px] h-full flex flex-col lg:flex-row items-center">
        
        {/* Left Side: Card */}
        <div className="relative w-full lg:w-[62%] shrink-0 z-20 order-2 lg:order-1 mt-[260px] sm:mt-[320px] lg:mt-0">
          
          {/* Item 5: Corazón tejido colgante */}
          <div className="absolute -top-12 left-4 md:left-8 lg:-top-16 lg:left-8 z-30 w-28 h-28 lg:w-36 lg:h-36 drop-shadow-md">
            <Image 
              src={handmadeAssets.corazon}
              alt="Corazón tejido" 
              fill
              className="object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.1)]"
              sizes="(max-width: 1024px) 112px, 144px"
            />
          </div>

          <div className="bg-[#FFFDFB]/95 backdrop-blur-sm rounded-[44px] lg:rounded-[56px] border-[3px] border-dashed border-[#F2A9B5] p-8 md:p-12 lg:p-[72px] shadow-[0_20px_60px_-15px_rgba(235,168,175,0.4)] relative">
            
            {/* Destellos decorativos */}
            <div className="absolute top-12 right-12 w-6 h-6 text-[#D7B4E5] opacity-60">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
            </div>
            <div className="absolute bottom-24 left-10 w-4 h-4 text-[#F2A9B5] opacity-60">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
            </div>

            <h2 className="text-[2.5rem] md:text-5xl lg:text-[4rem] font-heading font-bold leading-[1.1] mb-6">
              <span className="block text-[#1C2331] mb-2 tracking-tight">El valor de lo</span>
              <span className="block font-script text-[#F05A7E] relative inline-block">
                hecho a mano 
                <span className="inline-block text-[2rem] lg:text-[2.5rem] ml-3 text-[#F05A7E]/80 align-middle">♡</span>
                {/* Subrayado sutil */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#F05A7E]/30" preserveAspectRatio="none" viewBox="0 0 100 10" fill="none">
                  <path d="M0,5 Q50,10 100,2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>

            <p className="text-2xl text-gray-700 font-medium leading-relaxed italic">
            &quot;No buscamos la perfección de las máquinas, sino la calidez de las manos. Cada punto cuenta una historia y cada nudo es un compromiso con la paciencia.&quot;
          </p>

            {/* Divisor con corazón */}
            <div className="flex items-center justify-center gap-4 mb-8 max-w-[70%] mx-auto lg:mx-0">
              <div className="h-px flex-1 border-t-2 border-dashed border-[#F2A9B5]/60"></div>
              <span className="text-[#F2A9B5] text-lg">♥</span>
              <div className="h-px flex-1 border-t-2 border-dashed border-[#F2A9B5]/60"></div>
            </div>

            <p className="text-base md:text-lg text-[#64748B] leading-relaxed max-w-[90%] font-medium">
              En LocasPuntadas, no solo vendemos tejidos; compartimos un proceso artesanal honesto. Creemos en la sostenibilidad del tiempo y el respeto por el material.
            </p>
          </div>
        </div>

        {/* Right Side: Image Composition */}
        <div className="absolute top-8 right-0 left-0 lg:static w-full lg:w-[38%] h-[280px] sm:h-[340px] lg:h-full order-1 lg:order-2 pointer-events-none">
          
          {/* Contenedor relativo para posicionamiento */}
          <div className="relative w-full h-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto">
            
            {/* Item 4: Ramita floral (Atrás) */}
            <div className="absolute right-[18%] bottom-[32%] lg:bottom-[36%] z-0 w-32 h-48 lg:w-[180px] lg:h-[260px] opacity-85">
              <Image src={handmadeAssets.ramita} alt="Decoración floral" fill className="object-contain" sizes="(max-width: 1024px) 128px, 180px" loading="lazy" />
            </div>

            {/* Item 1: Canasto con ovillos (Principal) */}
            <div className="absolute right-[6%] bottom-[16%] lg:bottom-[22%] z-10 w-64 h-56 lg:w-[420px] lg:h-[360px]">
              <Image src={handmadeAssets.canasto} alt="Canasto con ovillos" fill className="object-contain drop-shadow-2xl" sizes="(max-width: 1024px) 256px, 420px" priority />
            </div>

            {/* Item 3: Granny square floral */}
            <div className="absolute right-[24%] bottom-[10%] lg:bottom-[14%] z-20 w-32 h-32 lg:w-48 lg:h-48 rotate-[-5deg]">
              <Image src={handmadeAssets.granny} alt="Granny square" fill className="object-contain drop-shadow-xl" sizes="(max-width: 1024px) 128px, 192px" loading="lazy" />
            </div>

            {/* Item 2: Tejido rosa con etiqueta (Frente) */}
            <div className="absolute right-[2%] bottom-[6%] lg:bottom-[10%] z-30 w-36 h-28 lg:w-[240px] lg:h-[180px] rotate-[4deg]">
              <Image src={handmadeAssets.tejidoRosa} alt="Tejido rosa con etiqueta" fill className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" sizes="(max-width: 1024px) 144px, 240px" />
            </div>
          </div>
        </div>

      </div>

      {/* Item 6: Hilo ondulado con corazón (Abajo) */}
      <div className="absolute -bottom-2 lg:bottom-[5%] left-0 z-40 w-full sm:w-[80%] lg:w-[55%] h-24 lg:h-32 pointer-events-none">
        <Image src={handmadeAssets.hilo} alt="Hilo decorativo" fill className="object-contain object-left-bottom opacity-90" sizes="50vw" aria-hidden="true" />
      </div>

    </section>
  );
};
