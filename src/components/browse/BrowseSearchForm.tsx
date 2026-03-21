"use client";

import { useTransitionRouter } from "next-view-transitions";
import { useState } from "react";

interface BrowseSearchFormProps {
    consoleId: string;
    initialQuery?: string;
}

export function BrowseSearchForm({ consoleId, initialQuery = "" }: BrowseSearchFormProps) {
    const router = useTransitionRouter();
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) {
            params.set("q", query.trim());
        }
        router.push(`/browse/${consoleId}?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games..." 
                className="w-full sm:w-48 bg-black/50 border border-slate-600 text-white font-pixel text-xs p-2 focus:outline-none focus:border-sky-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-all"
            />
            <button 
                type="submit" 
                className="px-3 py-2 border border-slate-600 text-slate-300 font-pixel text-xs uppercase hover:bg-slate-800 hover:text-white transition-colors cursor-pointer shrink-0"
            >
                Search
            </button>
        </form>
    );
}
