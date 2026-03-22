"use client";

import { useRef, useState } from "react";
import { useGameGrid } from "./context";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

interface GameGridSearchProps {
    placeholder?: string;
    // Server mode: provide both to bypass context and navigate server-side on Enter
    initialValue?: string;
    onSubmit?: (query: string) => void;
}

export function GameGridSearch({ placeholder = "Search games...", initialValue, onSubmit }: GameGridSearchProps) {
    const { searchQuery, setSearchQuery } = useGameGrid();
    const [localValue, setLocalValue] = useState(initialValue ?? '');
    const { focusedElementId } = useSpatialNavigation();
    const inputRef = useRef<HTMLInputElement>(null);

    const isServerMode = !!onSubmit;
    const isFocused = focusedElementId === "game-grid-search";
    const displayValue = isServerMode ? localValue : searchQuery;

    const handleChange = (value: string) => {
        if (isServerMode) {
            setLocalValue(value);
        } else {
            setSearchQuery(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isServerMode && e.key === 'Enter') {
            onSubmit(localValue.trim());
        }
    };

    return (
        <div
            id="game-grid-search"
            className={`jrpg-selectable px-4 py-3 border-b-2 flex-none bg-black/20 transition-[border-color,box-shadow] cursor-text ${
                isFocused
                    ? "border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                    : "border-slate-100/10"
            }`}
            onClick={() => inputRef.current?.focus()}
        >
            <input
                ref={inputRef}
                type="text"
                value={displayValue}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full sm:w-64 bg-black/50 border border-slate-600 text-white font-pixel text-xs p-2 focus:outline-none focus:border-sky-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-all"
            />
        </div>
    );
}
