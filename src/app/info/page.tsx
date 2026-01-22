'use client';

import React from 'react';
import { SpeechBubble, StarDoodle, WavyLine, TapeDoodle, HeartDoodle } from '@/components/doodles';

/** 
 * RICKY_URL: Imagen del personaje Ricky (Ovillo con zapatillas)
 * Proporcionada por el usuario como PNG transparente.
 */
const RICKY_URL = "https://i.ibb.co/HTyR7k5Z/Chat-GPT-Image-27-dic-2025-11-15-30-p-m-removebg-preview.png";

export default function InfoPage() {
    return (
        <div className="bg-wavy-grid min-h-screen py-24 px-4 overflow-hidden">
            <div className="container mx-auto max-w-5xl relative">

                {/* Header con Ricky saludando */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
                    <div className="w-72 h-72 lg:w-80 lg:h-80 shrink-0 relative group">
                        {/* Brillo de fondo para resaltar al personaje */}
                        <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl -z-10 group-hover:scale-125 transition-transform duration-700"></div>

                        {/* Imagen de Ricky */}
                        <img
                            src={RICKY_URL}
                            alt="Ricky el ovillo con zapatillas"
                            className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] floating-doodle"
                        />
                        <StarDoodle className="absolute top-0 right-0 w-16 h-16 text-yellow-500 z-10" />
                    </div>

                    <div className="grow">
                        <SpeechBubble position="responsive" className="animate-bounce-slow max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-script text-coral mb-4">¡Hola! Soy Ricky</h1>
                            <p className="text-xl text-gray-800 font-bold leading-tight">
                                Soy el ovillo con más onda de Locas Puntadas. Estoy acá para contarte todo lo que necesitás saber sobre nuestros productos y cómo cuidarlos para que te duren mil temporadas.
                            </p>
                        </SpeechBubble>
                    </div>
                </div>

                {/* Gran Cartel de Información */}
                <div className="relative mt-20">
                    {/* Elementos decorativos tipo Scrapbook */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 transform -rotate-2">
                        <TapeDoodle className="w-48 h-12 text-yellow-400 opacity-90" />
                    </div>

                    <div className="absolute -right-8 -top-8 w-24 h-24 text-coral animate-spin-slow z-30">
                        <StarDoodle />
                    </div>

                    <div className="absolute -left-12 bottom-1/4 w-32 h-32 text-blue-400/20 -rotate-12 pointer-events-none">
                        <HeartDoodle />
                    </div>

                    <div className="bg-white rounded-[40px] md:rounded-[60px] p-8 md:p-16 border-8 border-gray-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative z-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

                            {/* Envíos */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-heading font-black uppercase text-coral">Envíos Rápidos</h2>
                                </div>
                                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                                    ¡Llegamos a toda Argentina! Usamos Correo Argentino para que tus pedidos lleguen seguros. Una vez que confirmás, te escribo por WhatsApp y coordinamos todo. ¡Con estas zapas corro un montón para que lo tengas pronto!
                                </p>
                                <WavyLine className="w-24 text-yellow-400 opacity-50" />
                            </div>

                            {/* Cuidado */}
                            <div className="space-y-4">
                                <h2 className="text-3xl font-heading font-black uppercase text-lila">Cuidado de Cristal</h2>
                                <div className="bg-orange-50 p-6 rounded-3xl border-4 border-dashed border-orange-200">
                                    <p className="text-lg text-gray-700 font-medium leading-relaxed italic">
                                        "Lavar a mano, agua fría, jabón neutro. Nada de secarropas, ¡por favor! Dejame secar estirado a la sombra como si estuviera tomando una siesta."
                                    </p>
                                </div>
                            </div>

                            {/* Piezas Únicas */}
                            <div className="md:col-span-2 space-y-4 pt-8 border-t-4 border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="shrink-0">
                                        <h2 className="text-3xl font-heading font-black uppercase text-green-500">Piezas Únicas</h2>
                                    </div>
                                    <p className="text-lg text-gray-700 font-medium leading-relaxed">
                                        Acá no hay máquinas aburridas. Hay manos, tiempo y mucho mate. Cada punto está hecho con amor, por eso si ves un nudito o una pequeña variación, es el ADN de lo artesanal y lo que hace a tu pieza irrepetible.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decoración final dentro del cartel */}
                        <div className="absolute bottom-6 right-8">
                            <StarDoodle className="w-12 h-12 text-yellow-400 opacity-30" />
                        </div>
                    </div>
                </div>

                <div className="mt-24 flex justify-center gap-8">
                    <StarDoodle className="w-16 h-16 text-coral opacity-20" />
                    <WavyLine className="w-32 text-gray-200" />
                    <StarDoodle className="w-16 h-16 text-yellow-400 opacity-20" />
                </div>
            </div>
        </div>
    );
}
