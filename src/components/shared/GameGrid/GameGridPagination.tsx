"use client";

import { Link } from "next-view-transitions";
import { useGameGrid } from "./context";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
    queryParam?: string; // e.g. 'q' if user is using server search
}

export function GameGridPagination({ currentPage, totalPages, basePath, queryParam = "q" }: PaginationProps) {
    const { searchQuery } = useGameGrid();
    
    // Use either the incoming explicit query param or context state (which acts as a local override)
    const activeQuery = searchQuery || '';
    const queryStr = activeQuery ? `&${queryParam}=${encodeURIComponent(activeQuery)}` : '';

    return (
        <div className="flex justify-center items-center gap-4 p-4 border-t-2 border-slate-100/10 bg-[#1A1C29] shrink-0">
            <Link 
                href={`${basePath}?page=${Math.max(1, currentPage - 1)}${queryStr}`}
                className={`px-3 py-1.5 border-2 font-pixel text-xs uppercase tracking-wider transition-colors 
                    ${currentPage <= 1 ? 'border-slate-600 text-slate-500 pointer-events-none' : 'border-sky-400 text-sky-400 hover:bg-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.3)]'}`}
            >
                Prev
            </Link>
            <span className="font-pixel text-white text-xs tracking-widest shrink-0">
                Pg {currentPage} of {Math.max(1, totalPages)}
            </span>
            <Link 
                href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}${queryStr}`}
                className={`px-3 py-1.5 border-2 font-pixel text-xs uppercase tracking-wider transition-colors 
                    ${currentPage >= totalPages || totalPages === 0 ? 'border-slate-600 text-slate-500 pointer-events-none' : 'border-sky-400 text-sky-400 hover:bg-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.3)]'}`}
            >
                Next
            </Link>
        </div>
    );
}
