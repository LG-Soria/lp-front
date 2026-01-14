'use client';

import React, { useState } from 'react';
import { SpeechBubble, StarDoodle, WavyLine } from '@/components/doodles';

/** 
 * RICKY_URL: Imagen del personaje Ricky (Ovillo con zapatillas)
 * Proporcionada por el usuario como PNG transparente.
 */
const RICKY_URL = "https://i.ibb.co/HTyR7k5Z/Chat-GPT-Image-27-dic-2025-11-15-30-p-m-removebg-preview.png";

export default function InfoPage() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const askRicky = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setAnswer('');

        try {
            const res = await fetch('/api/ricky', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });
            const data = await res.json();
            setAnswer(data.answer || '¡Uy! Me hice un nudo. ¿Me preguntás de nuevo?');
        } catch (error) {
            console.error(error);
            setAnswer('¡Se me soltó un punto! Hay un problemita técnico, pero acá estoy para seguir tejiendo juntos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-wavy-grid min-h-screen py-24 px-4 overflow-hidden">
            <div className="container mx-auto max-w-5xl relative">

                {/* Header con Ricky saludando */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-32">
                    <div className="w-72 h-72 lg:w-96 lg:h-96 shrink-0 relative group">
                        {/* Brillo de fondo para resaltar al personaje */}
                        <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl -z-10 group-hover:scale-125 transition-transform duration-700"></div>

                        {/* Imagen de Ricky - Usando object-contain para ver brazos, piernas y zapatillas */}
                        <img
                            src={RICKY_URL}
                            alt="Ricky el ovillo con zapatillas"
                            className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] floating-doodle"
                        />
                        <StarDoodle className="absolute top-0 right-0 w-16 h-16 text-yellow-500 z-10" />
                    </div>

                    <div className="grow">
                        <SpeechBubble position="left" className="animate-bounce-slow">
                            <h1 className="text-4xl md:text-5xl font-script text-coral mb-4">¡Hola! Soy Ricky</h1>
                            <p className="text-xl text-gray-800 font-bold leading-tight">
                                ¡Mirá mis zapas, che! Soy el ovillo más loco de la ciudad y estoy acá para guiarte en este mundo de nudos y mucho amor.
                            </p>
                        </SpeechBubble>
                    </div>
                </div>

                {/* Sección de Info principal estilo Scrapbook */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start mb-40">

                    <div className="space-y-24">
                        <section className="relative">
                            <SpeechBubble className="bg-rosa-pastel">
                                <h2 className="text-2xl font-heading font-black mb-4 uppercase text-gray-900">Envíos Rápidos</h2>
                                <p className="text-gray-700 font-medium">
                                    Llegamos a toda Argentina. Una vez que confirmás, te escribo por WhatsApp y coordinamos. No te preocupes, ¡con estas zapas corro un montón!
                                </p>
                            </SpeechBubble>
                        </section>

                        <section className="relative pt-12">
                            {/* Mini Ricky decorativo */}
                            <div className="absolute -left-20 top-0 w-40 h-40 opacity-20 -rotate-12 hidden lg:block">
                                <img src={RICKY_URL} className="w-full h-full object-contain grayscale" />
                            </div>
                            <SpeechBubble className="bg-lila-suave" position="right">
                                <h2 className="text-2xl font-heading font-black mb-4 uppercase text-gray-900">Cambios con Alma</h2>
                                <p className="text-gray-700 font-medium">
                                    Si hay una falla, lo arreglamos al toque. Pero ojo: lo personalizado es único para vos, así que eso no tiene devolución. ¡Es una pieza eterna!
                                </p>
                            </SpeechBubble>
                        </section>
                    </div>

                    <div className="space-y-24 md:pt-16">
                        <section className="relative">
                            <SpeechBubble className="bg-orange-50">
                                <h2 className="text-2xl font-heading font-black mb-4 uppercase text-gray-900">Cuidado de Cristal</h2>
                                <p className="text-gray-700 font-medium leading-relaxed italic">
                                    "Lavar a mano, agua fría, jabón neutro. Nada de secarropas, ¡por favor! Dejame secar estirado a la sombra como si estuviera tomando una siesta."
                                </p>
                            </SpeechBubble>
                            <WavyLine className="absolute -bottom-8 right-0 w-32 text-orange-400/30" />
                        </section>

                        <section className="relative">
                            <div className="absolute -right-16 top-0 w-24 h-24 text-coral animate-spin-slow">
                                <StarDoodle />
                            </div>
                            <SpeechBubble className="bg-white">
                                <h2 className="text-2xl font-heading font-black mb-4 uppercase text-gray-900">Piezas Únicas</h2>
                                <p className="text-gray-700 font-medium">
                                    Acá no hay máquinas aburridas. Hay manos, tiempo y mucho mate. Por eso, si ves un nudito o una variación, es el ADN de lo artesanal.
                                </p>
                            </SpeechBubble>
                        </section>
                    </div>
                </div>

                {/* Consultorio de Ricky (IA Chat) */}
                <div className="bg-white rounded-[60px] p-8 md:p-16 border-8 border-gray-900 shadow-[20px_20px_0px_0px_rgba(220,21,55,0.2)] relative z-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="w-32 h-32 shrink-0">
                            <img src={RICKY_URL} className="w-full h-full object-contain drop-shadow-lg" alt="Ricky" />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-script text-coral">El Consultorio de Ricky</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Preguntame lo que quieras sobre tejidos, ¡sé de todo!</p>
                        </div>
                    </div>

                    <form onSubmit={askRicky} className="space-y-6 relative z-10">
                        <div className="relative">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Ej: ¿Cómo lavo mi manta? o ¿Qué es la lana merino?"
                                className="w-full bg-gray-50 border-4 border-gray-900 rounded-3xl p-6 text-xl font-medium focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder:text-gray-300 shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-coral text-white p-4 rounded-2xl hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </form>

                    {answer && (
                        <div className="mt-12 animate-in slide-in-from-bottom-4 duration-500">
                            <SpeechBubble position="right" className="bg-yellow-50 border-yellow-500 shadow-[10px_10px_0px_0px_rgba(234,179,8,0.2)]">
                                <p className="text-lg text-gray-800 font-medium italic">
                                    "{answer}"
                                </p>
                            </SpeechBubble>
                        </div>
                    )}
                </div>

                <div className="mt-24 flex justify-center">
                    <StarDoodle className="w-16 h-16 text-coral opacity-20" />
                </div>
            </div>
        </div>
    );
}
