'use client';

import React from 'react';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    sortable?: boolean;
    sortKey?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    width?: string;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    meta?: PaginationMeta;
    isLoading?: boolean;
    onPageChange?: (page: number) => void;
    onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    currentSortBy?: string;
    currentSortOrder?: 'asc' | 'desc';
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

export default function DataTable<T extends { id: string | number }>({
    data,
    columns,
    meta,
    isLoading = false,
    onPageChange,
    onSortChange,
    currentSortBy,
    currentSortOrder,
    emptyMessage = 'No se encontraron resultados.',
    onRowClick,
}: DataTableProps<T>) {
    const handleSort = (column: Column<T>) => {
        if (!column.sortable || !onSortChange) return;

        const sortKey = column.sortKey || (typeof column.accessor === 'string' ? column.accessor as string : '');
        if (!sortKey) return;

        let newOrder: 'asc' | 'desc' = 'asc';
        if (currentSortBy === sortKey) {
            newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        }

        onSortChange(sortKey, newOrder);
    };

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {columns.map((column, idx) => (
                <td key={idx} className="px-8 py-3">
                    <div className={`h-4 bg-gray-100 rounded-full ${column.align === 'right' ? 'ml-auto w-16' : column.align === 'center' ? 'mx-auto w-20' : 'w-full'}`}></div>
                </td>
            ))}
        </tr>
    );

    return (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {columns.map((column, idx) => {
                                const sortKey = column.sortKey || (typeof column.accessor === 'string' ? column.accessor as string : '');
                                const isSorted = currentSortBy === sortKey;

                                return (
                                    <th
                                        key={idx}
                                        style={{ width: column.width }}
                                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest text-gray-400 ${column.sortable ? 'cursor-pointer hover:text-coral transition-colors' : ''} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'} ${column.className || ''}`}
                                        onClick={() => handleSort(column)}
                                    >
                                        <div className={`flex items-center gap-2 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                                            {column.header}
                                            {column.sortable && (
                                                <div className="flex flex-col">
                                                    <svg
                                                        className={`w-2 h-2 ${isSorted && currentSortOrder === 'asc' ? 'text-coral' : 'text-gray-300'}`}
                                                        fill="currentColor" viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                                                    </svg>
                                                    <svg
                                                        className={`w-2 h-2 ${isSorted && currentSortOrder === 'desc' ? 'text-coral' : 'text-gray-300'}`}
                                                        fill="currentColor" viewBox="0 0 24 24"
                                                    >
                                                        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            [...Array(meta?.limit || 5)].map((_, i) => (
                                <SkeletonRow key={i} />
                            ))
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-gray-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={() => onRowClick && onRowClick(item)}
                                >
                                    {columns.map((column, idx) => (
                                        <td
                                            key={idx}
                                            className={`px-8 py-3 truncate ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'} ${column.className || ''}`}
                                        >
                                            {typeof column.accessor === 'function'
                                                ? column.accessor(item)
                                                : (item[column.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-8 py-12 text-center text-gray-500 italic font-medium">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500 font-medium">
                        Mostrando <span className="text-gray-900 font-bold">{data.length}</span> de <span className="text-gray-900 font-bold">{meta.total}</span> resultados
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange && onPageChange(meta.page - 1)}
                            disabled={meta.page <= 1}
                            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-coral hover:text-coral transition-all lg:px-4 lg:py-2 lg:text-sm font-bold"
                        >
                            Anterior
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(meta.totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Basic pagination logic to show current, first, last and neighbors
                                if (
                                    pageNum === 1 ||
                                    pageNum === meta.totalPages ||
                                    (pageNum >= meta.page - 1 && pageNum <= meta.page + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => onPageChange && onPageChange(pageNum)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all ${meta.page === pageNum
                                                ? 'bg-coral text-white shadow-md shadow-rose-100'
                                                : 'bg-white border border-gray-200 text-gray-600 hover:border-coral hover:text-coral'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    (pageNum === 2 && meta.page > 3) ||
                                    (pageNum === meta.totalPages - 1 && meta.page < meta.totalPages - 2)
                                ) {
                                    return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                                }
                                return null;
                            })}
                        </div>
                        <button
                            onClick={() => onPageChange && onPageChange(meta.page + 1)}
                            disabled={meta.page >= meta.totalPages}
                            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-coral hover:text-coral transition-all lg:px-4 lg:py-2 lg:text-sm font-bold"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
