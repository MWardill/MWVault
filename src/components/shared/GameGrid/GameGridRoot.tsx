"use client";

import { useState, useMemo, ReactNode } from "react";
import type { Game } from "@/types/game";
import { GameGridContext, GameGridContextType } from "./context";

export interface GameGridProps<T extends Game> {
    games: T[];
    children: ReactNode;
}

export function GameGridRoot<T extends Game>({ games, children }: GameGridProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGames = useMemo(() => {
        if (!searchQuery.trim()) return games;
        const query = searchQuery.toLowerCase();
        return games.filter(game => game.title.toLowerCase().includes(query));
    }, [games, searchQuery]);

    const contextValue: GameGridContextType<T> = {
        games,
        searchQuery,
        setSearchQuery,
        filteredGames,
    };

    return (
        <GameGridContext.Provider value={contextValue}>
            <div className="flex flex-col flex-1 min-h-0">
                {children}
            </div>
        </GameGridContext.Provider>
    );
}
