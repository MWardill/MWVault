"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSpatialNavigation, setFocusedElementId } from "@/hooks/useSpatialNavigation";
import type { Game } from "@/types/game";
import { GameDetailPanel, DetailAction } from "../GameDetailPanel";
import { useGameGrid } from "./context";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.03,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12, pointerEvents: "none" as const },
    visible: { opacity: 1, y: 0, pointerEvents: "auto" as const, transition: { duration: 0.2 } },
};

function StatusBadge({ isOwned, isWishlist }: { isOwned?: boolean | null; isWishlist?: boolean | null }) {
    if (isOwned) {
        return (
            <div className="absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full bg-emerald-500 border border-white shadow flex items-center justify-center pointer-events-none">
                <span className="text-[10px] text-white font-bold leading-none">✓</span>
            </div>
        );
    }
    if (isWishlist) {
        return (
            <div className="absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full bg-amber-500 border border-white shadow flex items-center justify-center pointer-events-none">
                <span className="text-[10px] text-white font-bold leading-none">★</span>
            </div>
        );
    }
    return null;
}

interface ListProps<T extends Game> {
    renderActions?: (game: T, closeGame: () => void) => DetailAction[];
    showBadges?: boolean;
    emptyMessage?: string;
}

export function GameGridList<T extends Game>({ renderActions, showBadges = false, emptyMessage }: ListProps<T>) {
    const { filteredGames, searchQuery } = useGameGrid<T>();
    const [selectedGame, setSelectedGame] = useState<T | null>(null);
    const { focusedElementId } = useSpatialNavigation();

    const openGame = useCallback((game: T) => {
        setFocusedElementId(null);
        setSelectedGame(game);
    }, []);

    const closeGame = useCallback(() => {
        setSelectedGame((prev) => {
            if (prev) {
                setFocusedElementId(`grid-game-${prev.id}`);
            }
            return null;
        });
    }, []);

    const defaultEmptyMessage = searchQuery.trim() 
        ? `No games found matching "${searchQuery}"`
        : "No games found.";

    return (
        <>
            <div className="flex-1 overflow-y-auto min-h-0 relative">
                {filteredGames.length === 0 ? (
                    <div className="flex items-center justify-center p-8 h-full">
                        <p className="text-gray-400 font-pixel text-xs leading-relaxed text-center uppercase tracking-wider">
                            {emptyMessage || defaultEmptyMessage}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        key={searchQuery}
                        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 p-3 pb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredGames.map((game) => {
                            const itemId = `grid-game-${game.id}`;
                            const isFocused = focusedElementId === itemId;

                            return (
                                <motion.button
                                    key={game.id}
                                    id={itemId}
                                    variants={itemVariants}
                                    onClick={() => openGame(game)}
                                    className="jrpg-selectable group relative flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0"
                                    aria-label={game.title}
                                >
                                    <div
                                        className={`relative w-full aspect-square bg-black/50 rounded-sm shadow-md transition-[border-color,box-shadow] ${
                                            showBadges ? 'overflow-visible' : 'overflow-hidden'
                                        } ${
                                            isFocused
                                                ? "border-2 border-sky-400 shadow-[0_0_16px_rgba(125,211,252,0.5)]"
                                                : "border border-white/15 group-hover:border-sky-400/60 group-hover:shadow-[0_0_12px_rgba(125,211,252,0.25)]"
                                        }`}
                                    >
                                        {showBadges && (
                                            <StatusBadge 
                                                isOwned={'isOwned' in game ? (game.isOwned as boolean) : null} 
                                                isWishlist={'isWishlist' in game ? (game.isWishlist as boolean) : null} 
                                            />
                                        )}
                                        
                                        {game.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={game.imageUrl}
                                                alt={game.title}
                                                className={`w-full h-full rounded-sm object-cover transition-opacity duration-200 ${
                                                    isFocused ? "opacity-100" : "opacity-85 group-hover:opacity-100"
                                                }`}
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-sm flex items-center justify-center p-1">
                                                <span className="font-pixel text-[6px] text-slate-400 text-center leading-relaxed tracking-wider uppercase">
                                                    {game.title.slice(0, 12)}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className={`absolute inset-0 rounded-sm transition-colors duration-200 pointer-events-none ${
                                                isFocused
                                                    ? "bg-sky-400/15"
                                                    : "bg-sky-400/0 group-hover:bg-sky-400/10"
                                            }`}
                                        />

                                        {isFocused && (
                                            <motion.span
                                                className="absolute top-1 left-1 font-pixel text-sky-300 text-[8px] leading-none pointer-events-none z-20"
                                                animate={{ opacity: [1, 0.2, 1] }}
                                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                            >
                                                ▶
                                            </motion.span>
                                        )}

                                        {('currentPrice' in game) && (game as unknown as Record<string, string | number>).currentPrice && (
                                            <span className="absolute bottom-1 left-1 font-pixel text-[6px] bg-black/70 text-amber-300 px-1 py-0.5 rounded-sm leading-none z-10">
                                                £{String((game as unknown as Record<string, string | number>).currentPrice)}
                                            </span>
                                        )}

                                        {('consoleName' in game) && (game as unknown as Record<string, string | number>).consoleName && (
                                            <span className="absolute bottom-1 right-1 font-pixel text-[5px] bg-black/70 text-slate-300 px-1 py-0.5 rounded-sm leading-none max-w-[60%] truncate z-10">
                                                {String((game as unknown as Record<string, string | number>).consoleName)}
                                            </span>
                                        )}
                                    </div>

                                    <p
                                        className={`font-pixel text-[7px] sm:text-[8px] leading-tight text-center px-0.5 line-clamp-2 w-full jrpg-text-shadow transition-colors ${
                                            isFocused ? "text-white" : "text-slate-300 group-hover:text-white"
                                        }`}
                                    >
                                        {game.title}
                                    </p>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </div>

            <GameDetailPanel
                game={selectedGame}
                onClose={closeGame}
                actions={selectedGame && renderActions ? renderActions(selectedGame, closeGame) : []}
            />
        </>
    );
}
