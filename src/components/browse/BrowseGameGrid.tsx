"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BrowseGameDetailPanel } from "./BrowseGameDetailPanel";
import { useSpatialNavigation, setFocusedElementId } from "@/hooks/useSpatialNavigation";
import type { BrowseGame } from "@/lib/db/browse";

interface BrowseGameGridProps {
    games: BrowseGame[];
    consoleShortCode: string;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.03,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

function StatusBadge({ isOwned, isWishlist }: { isOwned: boolean; isWishlist: boolean }) {
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

export function BrowseGameGrid({ games, consoleShortCode }: BrowseGameGridProps) {
    const [selectedGame, setSelectedGame] = useState<BrowseGame | null>(null);
    const { focusedElementId } = useSpatialNavigation();

    const openGame = useCallback((game: BrowseGame) => {
        setFocusedElementId(null);
        setSelectedGame(game);
    }, []);

    const closeGame = useCallback(() => {
        setSelectedGame((prev) => {
            if (prev) {
                setFocusedElementId(`browse-game-${prev.id}`);
            }
            return null;
        });
    }, []);

    return (
        <>
            <motion.div
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 p-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {games.map((game) => {
                    const itemId = `browse-game-${game.id}`;
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
                                className={`relative w-full aspect-square bg-black/50 rounded-sm overflow-visible shadow-md transition-[border-color,box-shadow] ${
                                    isFocused
                                        ? "border-2 border-sky-400 shadow-[0_0_16px_rgba(125,211,252,0.5)]"
                                        : "border border-white/15 group-hover:border-sky-400/60 group-hover:shadow-[0_0_12px_rgba(125,211,252,0.25)]"
                                }`}
                            >
                                <StatusBadge isOwned={game.isOwned} isWishlist={game.isWishlist} />
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

            <BrowseGameDetailPanel
                game={selectedGame}
                consoleShortCode={consoleShortCode}
                onClose={closeGame}
            />
        </>
    );
}
