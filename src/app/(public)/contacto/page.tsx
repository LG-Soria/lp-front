'use client';

import React from 'react';
import Image from 'next/image';

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen text-[#344054]">
            {/* HERO */}
            <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image src="/images/home-bg.png" alt="Fondo" fill className="object-cover object-center" priority />
                </div>

                {/* Sparkles */}
                <div className="absolute top-10 left-[10%] text-white opacity-80">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/></svg>
                </div>
                <div className="absolute top-20 right-[15%] text-white opacity-80">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/></svg>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* Left Column */}
                        <div className="md:w-1/2 max-w-xl">
                            <span className="inline-block bg-white text-[#E4072F] font-bold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-sm">
                                Hecho a mano con amor
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#12192C] leading-tight mb-6">
                                Hablemos de tu <br className="hidden md:block" />
                                <span className="text-[#E4072F]">próxima puntada</span>
                            </h1>
                            <p className="text-lg md:text-xl mb-8 font-medium">
                                ¿Tenés una consulta, querés hacer un pedido o necesitás más información?
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="https://wa.me/123456789" 
                                    className="inline-flex items-center justify-center gap-2 bg-[#E4072F] text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    Escribir por WhatsApp
                                </a>
                                <a 
                                    href="https://instagram.com/locaspuntadas" 
                                    className="inline-flex items-center justify-center gap-2 bg-white text-[#E4072F] border-2 border-[#E4072F] px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    Ver Instagram
                                </a>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">
                            <div className="relative flex flex-col items-center">
                                {/* Comic Balloon */}
                                <div className="relative md:absolute md:-top-4 md:-right-8 lg:-right-12 bg-white border-[4px] border-[#111111] rounded-[28px] p-5 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] w-[240px] md:w-[220px] lg:w-[260px] z-20 mb-6 md:mb-0">
                                    <p className="text-[#12192C] font-medium text-sm md:text-base leading-snug">
                                        <span className="text-[#E4072F] font-bold">¡Hola!</span> Estoy acá para ayudarte con pedidos, consultas y personalizados.
                                    </p>
                                    
                                    {/* Tail Mobile */}
                                    <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 md:hidden w-6 h-6 border-b-[4px] border-r-[4px] border-[#111111] transform rotate-45 z-[-1]"></div>
                                    <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 md:hidden w-6 h-6 bg-white transform rotate-45"></div>

                                    {/* Tail Desktop */}
                                    <div className="hidden md:block absolute -bottom-[12px] left-8 w-6 h-6 border-b-[4px] border-l-[4px] border-[#111111] transform -rotate-45 z-[-1]"></div>
                                    <div className="hidden md:block absolute -bottom-[4px] left-8 w-6 h-6 bg-white transform -rotate-45"></div>
                                </div>

                                {/* Ricky Image */}
                                <div className="relative z-10 w-48 sm:w-52 md:w-56 lg:w-64">
                                    <Image src="/images/Ricky_saluda.png" alt="Ricky saludando" width={400} height={400} className="w-full h-auto drop-shadow-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pattern Background for central sections */}
            <div 
                className="bg-[#FFF7FA]" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle, #F3D7E4 2px, transparent 2px)', 
                    backgroundSize: '32px 32px',
                    backgroundPosition: '0 0, 16px 16px' 
                }}
            >
                {/* CANALES DE CONTACTO */}
                <section className="py-20 container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#12192C] mb-4">Elegí el canal que prefieras</h2>
                        <div className="flex justify-center">
                            <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6C6 2 10 2 14 6C18 10 22 10 26 6C30 2 34 2 38 6C42 10 46 10 50 6C54 2 58 2 58 6" stroke="#E4072F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
                        {/* WhatsApp Card */}
                        <div className="bg-white border border-[#F3D7E4] rounded-[28px] p-8 md:p-10 shadow-sm flex flex-col items-center text-center flex-1 relative group mt-4 md:mt-0">
                            {/* Decorative Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#F58EAA] opacity-50 transform -rotate-2 z-10"></div>
                            
                            <div className="w-16 h-16 bg-[#E4072F] rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#12192C] mb-3">WhatsApp</h3>
                            <p className="text-[#7A7F8C] mb-8 leading-relaxed">
                                Para pedidos, consultas rápidas y personalizados.
                            </p>
                            <a href="https://wa.me/123456789" className="mt-auto bg-[#E4072F] text-white px-8 py-3 rounded-full font-bold w-full md:w-auto transition-transform hover:scale-105">
                                Chatear ahora
                            </a>
                        </div>

                        {/* Instagram Card */}
                        <div className="bg-white border border-[#F3D7E4] rounded-[28px] p-8 md:p-10 shadow-sm flex flex-col items-center text-center flex-1 relative group mt-4 md:mt-0">
                            {/* Decorative Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#E3B4FF] opacity-50 transform rotate-2 z-10"></div>
                            
                            <div className="w-16 h-16 bg-[#E4072F] rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#12192C] mb-3">Instagram</h3>
                            <p className="text-[#7A7F8C] mb-8 leading-relaxed">
                                Para ver novedades, trabajos recientes y procesos.
                            </p>
                            <a href="https://instagram.com/locaspuntadas" className="mt-auto bg-[#E4072F] text-white px-8 py-3 rounded-full font-bold w-full md:w-auto transition-transform hover:scale-105">
                                Ver perfil
                            </a>
                        </div>
                    </div>
                </section>

                {/* ANTES DE ESCRIBIRNOS */}
                <section className="py-20 container mx-auto px-4 pb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#12192C] mb-4">Antes de escribirnos</h2>
                        <div className="flex justify-center">
                            <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6C6 2 10 2 14 6C18 10 22 10 26 6C30 2 34 2 38 6C42 10 46 10 50 6C54 2 58 2 58 6" stroke="#E4072F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
                        {/* Checklist */}
                        <div className="bg-white border border-[#F3D7E4] rounded-[28px] p-8 md:p-10 shadow-sm flex-1 relative overflow-hidden flex flex-col justify-center">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <Image src="/images/fondo_card_contacto.png" alt="" fill className="object-cover object-bottom opacity-40" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-[#12192C] mb-6">Podés escribirnos para:</h3>
                                <ul className="space-y-4">
                                    {['Pedidos', 'Consultas', 'Disponibilidad', 'Personalizaciones', 'Coordinación de compra'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-[#E4072F] rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-[#344054] font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-white border border-[#F3D7E4] rounded-[28px] p-8 md:p-10 shadow-sm flex-1">
                            <h3 className="text-xl font-bold text-[#12192C] mb-6">Preguntas frecuentes</h3>
                            <div className="space-y-4">
                                {[
                                    { q: '¿Cuánto tardan en responder?', a: 'Generalmente respondemos dentro del día.' },
                                    { q: '¿Hacen pedidos personalizados?', a: 'Sí, podés escribirnos y contarnos tu idea.' },
                                    { q: '¿Dónde veo novedades?', a: 'En Instagram compartimos trabajos recientes y novedades.' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white border-2 border-[#111111] rounded-[16px] p-4 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] flex gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#12192C] mb-1">{item.q}</h4>
                                            <p className="text-sm text-[#7A7F8C] leading-snug">{item.a}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* CTA FINAL */}
            <section className="relative overflow-hidden bg-[#E3B4FF] py-10 md:py-12 flex items-center justify-center border-t border-[#F3D7E4]">
                {/* Diagonal blocks */}
                <div 
                    className="absolute inset-0 z-0" 
                    style={{ background: 'linear-gradient(165deg, #F58EAA 35%, #E3B4FF 35.1%)' }}
                ></div>

                {/* Sparkles */}
                <div className="absolute top-10 left-[20%] text-white opacity-80">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/></svg>
                </div>
                <div className="absolute bottom-10 right-[20%] text-white opacity-80">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/></svg>
                </div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                    <div className="w-32 md:w-40 lg:w-48 flex-shrink-0 relative">
                        <Image src="/images/Ricky_phone.png" alt="Ricky en el teléfono" width={200} height={200} className="w-full h-auto drop-shadow-lg" />
                    </div>
                    
                    <div className="bg-white border-[4px] border-[#111111] rounded-[24px] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] w-full max-w-2xl text-left relative flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Tail border */}
                        <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:-left-[12px] md:translate-x-0 w-6 h-6 border-t-[4px] border-l-[4px] border-[#111111] transform rotate-45 md:-rotate-45 z-[-1]"></div>
                        {/* Tail background */}
                        <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:-left-[4px] md:translate-x-0 w-6 h-6 bg-white transform rotate-45 md:-rotate-45"></div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-[#12192C] mb-1">¿Tenés una idea en mente?</h3>
                            <p className="text-[#344054] font-medium mb-0">Hablemos y creemos una pieza única para vos.</p>
                        </div>
                        
                        <a 
                            href="https://wa.me/123456789" 
                            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-md flex-shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            Hablemos por WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

