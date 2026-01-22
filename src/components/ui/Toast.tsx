'use client';

import { useState, useEffect } from 'react';
import { SmileyFlowerDoodle } from '@/components/doodles';

interface ToastProps {
    message: string;
    type?: 'error' | 'success';
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = 'error', duration = 5000, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [copying, setCopying] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setCopying(true);
            setTimeout(() => setCopying(false), 2000);
        } catch (err) {
            console.error('Error copying text: ', err);
        }
    };

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-100 w-full max-w-md px-4 animate-in slide-in-from-bottom-5 duration-300 ${isExiting ? 'animate-out fade-out slide-out-to-bottom-5' : ''}`}>
            <div className={`bg-white rounded-[28px] shadow-2xl p-5 border-2 ${type === 'error' ? 'border-rose-100' : 'border-green-100'} flex items-center gap-4 relative overflow-hidden group`}>
                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'error' ? 'bg-rose-50 text-coral' : 'bg-green-50 text-green-600'}`}>
                    {type === 'error' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17L4 12" /></svg>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 line-clamp-2">
                        {message}
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleCopy}
                        title="Copiar error"
                        className={`p-2 rounded-xl transition-all ${copying ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-coral'}`}
                    >
                        {copying ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17L4 12" /></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                        )}
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 pointer-events-none">
                    <SmileyFlowerDoodle className="w-24 h-24" />
                </div>
            </div>
        </div>
    );
}
