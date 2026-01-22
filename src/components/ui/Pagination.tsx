'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StarDoodle } from '../doodles';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const onPageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`/categorias?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPageNumber = (page: number) => {
        const isActive = currentPage === page;

        return (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                    relative w-12 h-12 flex items-center justify-center font-heading font-bold text-lg 
                    transition-all duration-300 rounded-2xl
                    ${isActive
                        ? 'bg-coral text-white shadow-lg shadow-rose-200 -translate-y-1'
                        : 'bg-white text-gray-400 hover:bg-rosa-pastel hover:text-coral border border-gray-100'}
                `}
            >
                {page}
                {isActive && (
                    <StarDoodle className="absolute -top-2 -right-2 w-4 h-4 text-rosa-empolvado animate-pulse" />
                )}
            </button>
        );
    };

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(renderPageNumber(i));
        } else if (
            i === currentPage - 2 ||
            i === currentPage + 2
        ) {
            pages.push(
                <span key={`ellipsis-${i}`} className="text-gray-300 px-1 font-bold">...</span>
            );
        }
    }

    return (
        <div className="flex flex-col items-center gap-6 mt-16">
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`
                        w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 bg-white
                        transition-all duration-300
                        ${currentPage === 1
                            ? 'opacity-30 cursor-not-allowed'
                            : 'text-coral hover:bg-rosa-pastel hover:-translate-x-1'}
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-2">
                    {pages}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`
                        w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 bg-white
                        transition-all duration-300
                        ${currentPage === totalPages
                            ? 'opacity-30 cursor-not-allowed'
                            : 'text-coral hover:bg-rosa-pastel hover:translate-x-1'}
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <p className="text-gray-400 text-sm font-medium">
                Página <span className="text-coral font-bold">{currentPage}</span> de <span className="text-gray-600 font-bold">{totalPages}</span>
            </p>
        </div>
    );
};
