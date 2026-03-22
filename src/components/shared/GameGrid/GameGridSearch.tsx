"use client";

import { useGameGrid } from "./context";

export function GameGridSearch({ placeholder = "Search games..." }: { placeholder?: string }) {
    const { searchQuery, setSearchQuery } = useGameGrid();

    return (
        <div className="px-4 py-3 border-b-2 border-slate-100/10 flex-none bg-black/20">
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full sm:w-64 bg-black/50 border border-slate-600 text-white font-pixel text-xs p-2 focus:outline-none focus:border-sky-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-all"
            />
        </div>
    );
}
