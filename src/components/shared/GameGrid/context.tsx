"use client";

import { createContext, useContext } from "react";
import type { Game } from "@/types/game";

export interface GameGridContextType<T extends Game> {
    games: T[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredGames: T[];
}

export const GameGridContext = createContext<GameGridContextType<Game> | null>(null);

export function useGameGrid<T extends Game>() {
    const context = useContext(GameGridContext);
    if (!context) {
        throw new Error("GameGrid compound components must be used within <GameGrid>");
    }
    return context as GameGridContextType<T>;
}
