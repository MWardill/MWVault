"use client";

import { Link } from "next-view-transitions";
import { useGameGrid } from "./context";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
    queryParam?: string; // e.g. 'q' if user is using server search
}

export function GameGridPagination({ currentPage, totalPages, basePath, queryParam = "q" }: PaginationProps) {
    const { searchQuery } = useGameGrid();
    const { focusedElementId } = useSpatialNavigation();

    const activeQuery = searchQuery || '';
    const queryStr = activeQuery ? `&${queryParam}=${encodeURIComponent(activeQuery)}` : '';

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages || totalPages === 0;

    const isFocusedPrev = focusedElementId === "pagination-prev";
    const isFocusedNext = focusedElementId === "pagination-next";

    return (
        <div className="flex justify-center items-center gap-4 px-4 py-3 border-t-2 border-slate-100/10 bg-black/20 shrink-0">
            <Link
                id="pagination-prev"
                href={`${basePath}?page=${Math.max(1, currentPage - 1)}${queryStr}`}
                data-disabled={isPrevDisabled ? "true" : undefined}
                className={`jrpg-selectable px-3 py-1.5 border-2 font-pixel text-xs uppercase tracking-wider transition-colors
                    ${isPrevDisabled
                        ? 'border-slate-600 text-slate-500 pointer-events-none'
                        : isFocusedPrev
                            ? 'border-sky-400 text-sky-400 bg-sky-400/20 shadow-[0_0_16px_rgba(125,211,252,0.5)]'
                            : 'border-sky-400 text-sky-400 hover:bg-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    }`}
            >
                Prev
            </Link>
            <span className="font-pixel text-white text-xs tracking-widest shrink-0">
                Pg {currentPage} of {Math.max(1, totalPages)}
            </span>
            <Link
                id="pagination-next"
                href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}${queryStr}`}
                data-disabled={isNextDisabled ? "true" : undefined}
                className={`jrpg-selectable px-3 py-1.5 border-2 font-pixel text-xs uppercase tracking-wider transition-colors
                    ${isNextDisabled
                        ? 'border-slate-600 text-slate-500 pointer-events-none'
                        : isFocusedNext
                            ? 'border-sky-400 text-sky-400 bg-sky-400/20 shadow-[0_0_16px_rgba(125,211,252,0.5)]'
                            : 'border-sky-400 text-sky-400 hover:bg-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    }`}
            >
                Next
            </Link>
        </div>
    );
}
