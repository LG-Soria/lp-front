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
    <section className="relative w-full overflow-hidden bg-[#FEF4F4] py-16 lg:py-0 lg:h-[760px] xl:h-[800px] flex items-center justify-center my-16">
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

      <div className="container relative z-10 mx-auto px-4 max-w-[1320px] h-full flex flex-col lg:block">
        
        {/* Left Side: Card */}
        <div className="relative w-full lg:w-[64%] xl:w-[66%] shrink-0 z-20 mt-[285px] sm:mt-[330px] lg:mt-0 lg:absolute lg:left-4 xl:left-0 lg:top-1/2 lg:-translate-y-1/2">
          
          {/* Item 5: Corazón tejido colgante */}
          <div className="absolute -top-14 left-5 md:left-10 lg:-top-20 lg:left-12 z-30 w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 -rotate-6 drop-shadow-md">
            <Image 
              src={handmadeAssets.corazon}
              alt="Corazón tejido" 
              fill
              className="object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.1)]"
              sizes="(max-width: 768px) 112px, (max-width: 1024px) 128px, 160px"
            />
          </div>

          <div className="bg-[#FFFDFB]/95 backdrop-blur-sm [border-radius:46px_54px_46px_22px] md:[border-radius:54px_68px_58px_26px] lg:[border-radius:62px_74px_68px_30px] border-[3px] border-dashed border-[#F2A9B5] px-7 py-10 md:p-12 lg:px-16 lg:py-14 xl:px-[72px] xl:py-16 shadow-[0_24px_70px_-18px_rgba(235,168,175,0.48)] relative">
            
            {/* Destellos decorativos */}
            <div className="absolute top-12 right-12 w-6 h-6 text-[#D7B4E5] opacity-60">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
            </div>
            <div className="absolute bottom-24 left-10 w-4 h-4 text-[#F2A9B5] opacity-60">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
            </div>

            <h2 className="text-[2.8rem] md:text-[3.75rem] lg:text-[4.45rem] xl:text-[4.9rem] font-heading font-bold leading-[1.02] mb-7 lg:mb-8">
              <span className="block text-[#1C2331] mb-1.5 tracking-tight">El valor de lo</span>
              <span className="block font-script text-[#F05A7E] relative inline-block text-[1.04em]">
                hecho a mano 
                <span className="inline-block text-[2rem] lg:text-[2.5rem] ml-3 text-[#F05A7E]/80 align-middle">♡</span>
                {/* Subrayado sutil */}
                <svg className="absolute -bottom-2.5 left-0 w-[92%] h-3.5 text-[#F05A7E]/30" preserveAspectRatio="none" viewBox="0 0 100 10" fill="none">
                  <path d="M0,5 Q50,10 100,2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>

            <p className="max-w-[700px] text-xl md:text-[1.55rem] lg:text-[1.62rem] text-gray-700 font-medium leading-[1.42] italic">
            &quot;No buscamos la perfección de las máquinas, sino la calidez de las manos. Cada punto cuenta una historia y cada nudo es un compromiso con la paciencia.&quot;
          </p>

            {/* Divisor con corazón */}
            <div className="flex items-center justify-center gap-4 my-8 lg:my-9 max-w-[300px] mx-auto lg:mx-0">
              <div className="h-px flex-1 border-t-2 border-dashed border-[#F2A9B5]/60"></div>
              <span className="text-[#F2A9B5] text-lg">♥</span>
              <div className="h-px flex-1 border-t-2 border-dashed border-[#F2A9B5]/60"></div>
            </div>

            <p className="max-w-[620px] text-base md:text-lg lg:text-[1.08rem] text-[#64748B] leading-[1.72] font-medium">
              En LocasPuntadas, no solo vendemos tejidos; compartimos un proceso artesanal honesto. Creemos en la sostenibilidad del tiempo y el respeto por el material.
            </p>
          </div>
        </div>

        {/* Right Side: Image Composition */}
        <div className="absolute top-8 right-0 left-0 lg:top-auto lg:left-auto lg:right-0 xl:-right-6 lg:bottom-4 w-full lg:w-[48%] xl:w-[47%] h-[300px] sm:h-[360px] lg:h-[680px] xl:h-[720px] pointer-events-none">
          
          {/* Contenedor relativo para posicionamiento */}
          <div className="relative w-full h-full max-w-[540px] sm:max-w-[620px] lg:max-w-none mx-auto lg:mx-0 lg:ml-auto">
            
            {/* Item 4: Ramita floral (Atrás) */}
            <div className="absolute right-[22%] bottom-[36%] sm:bottom-[34%] lg:right-[28%] lg:bottom-[36%] z-0 w-32 h-48 sm:w-40 sm:h-56 lg:w-[230px] lg:h-[330px] xl:w-[250px] xl:h-[360px] opacity-80 -rotate-3">
              <Image src={handmadeAssets.ramita} alt="Decoración floral" fill className="object-contain" sizes="(max-width: 1024px) 128px, 180px" loading="lazy" />
            </div>

            {/* Item 1: Canasto con ovillos (Principal) */}
            <div className="absolute right-[5%] bottom-[13%] sm:right-[8%] lg:right-[5%] lg:bottom-[15%] xl:bottom-[14%] z-10 w-72 h-72 sm:w-[340px] sm:h-[340px] lg:w-[500px] lg:h-[500px] xl:w-[540px] xl:h-[540px]">
              <Image src={handmadeAssets.canasto} alt="Canasto con ovillos" fill className="object-contain drop-shadow-2xl" sizes="(max-width: 1024px) 256px, 420px" priority />
            </div>

            {/* Item 3: Granny square floral */}
            <div className="absolute right-[34%] bottom-[5%] sm:right-[37%] lg:right-[35%] lg:bottom-[7%] z-20 w-[136px] h-[136px] sm:w-40 sm:h-40 lg:w-[205px] lg:h-[205px] xl:w-[220px] xl:h-[220px] rotate-[-8deg]">
              <Image src={handmadeAssets.granny} alt="Granny square" fill className="object-contain drop-shadow-xl" sizes="(max-width: 1024px) 128px, 192px" loading="lazy" />
            </div>

            {/* Item 2: Tejido rosa con etiqueta (Frente) */}
            <div className="absolute right-[1%] bottom-[1%] sm:right-[5%] lg:right-[0%] lg:bottom-[2%] z-30 w-40 h-40 sm:w-48 sm:h-48 lg:w-[270px] lg:h-[270px] xl:w-[300px] xl:h-[300px] rotate-[5deg]">
              <Image src={handmadeAssets.tejidoRosa} alt="Tejido rosa con etiqueta" fill className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" sizes="(max-width: 1024px) 144px, 240px" />
            </div>
          </div>
        </div>

      </div>

      {/* Item 6: Hilo ondulado con corazón (Abajo) */}
      <div className="absolute -bottom-1 lg:bottom-[3%] left-0 z-40 w-[118%] sm:w-[92%] lg:w-[76%] xl:w-[72%] h-24 sm:h-28 lg:h-36 pointer-events-none">
        <Image src={handmadeAssets.hilo} alt="Hilo decorativo" fill className="object-contain object-left-bottom opacity-95" sizes="(max-width: 1024px) 92vw, 76vw" aria-hidden="true" />
      </div>

    </section>
  );
};
