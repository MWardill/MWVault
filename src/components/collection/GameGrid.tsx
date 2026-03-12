"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GameDetailPanel, type CollectionGame } from "./GameDetailPanel";
import { useSpatialNavigation, setFocusedElementId } from "@/hooks/useSpatialNavigation";

interface GameGridProps {
    games: CollectionGame[];
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

export function GameGrid({ games }: GameGridProps) {
    const [selectedGame, setSelectedGame] = useState<CollectionGame | null>(null);
    const { focusedElementId } = useSpatialNavigation();

    const openGame = useCallback((game: CollectionGame) => {
        // Clear grid focus while the panel is open so arrow keys don't bleed through
        setFocusedElementId(null);
        setSelectedGame(game);
    }, []);

    const closeGame = useCallback(() => {
        setSelectedGame((prev) => {
            // Restore spatial focus to the card that was just open
            if (prev) {
                setFocusedElementId(`grid-game-${prev.id}`);
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
                            {/* Box art wrapper */}
                            <div
                                className={`relative w-full aspect-square bg-black/50 rounded-sm overflow-hidden shadow-md transition-[border-color,box-shadow] ${
                                    isFocused
                                        ? "border-2 border-sky-400 shadow-[0_0_16px_rgba(125,211,252,0.5)]"
                                        : "border border-white/15 group-hover:border-sky-400/60 group-hover:shadow-[0_0_12px_rgba(125,211,252,0.25)]"
                                }`}
                            >
                                {game.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={game.imageUrl}
                                        alt={game.title}
                                        className={`w-full h-full object-cover transition-opacity duration-200 ${
                                            isFocused ? "opacity-100" : "opacity-85 group-hover:opacity-100"
                                        }`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-1">
                                        <span className="font-pixel text-[6px] text-slate-400 text-center leading-relaxed tracking-wider uppercase">
                                            {game.title.slice(0, 12)}
                                        </span>
                                    </div>
                                )}

                                {/* Hover / focus highlight overlay */}
                                <div
                                    className={`absolute inset-0 transition-colors duration-200 pointer-events-none ${
                                        isFocused
                                            ? "bg-sky-400/15"
                                            : "bg-sky-400/0 group-hover:bg-sky-400/10"
                                    }`}
                                />

                                {/* Spatial focus indicator — JRPG-style pulsing corner pip */}
                                {isFocused && (
                                    <motion.span
                                        className="absolute top-1 left-1 font-pixel text-sky-300 text-[8px] leading-none"
                                        animate={{ opacity: [1, 0.2, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    >
                                        ▶
                                    </motion.span>
                                )}

                                {/* Ownership indicators — small corner dots */}
                                <div className="absolute bottom-1 right-1 flex gap-1">
                                    {game.hasBox && (
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.9)]" title="Has box" />
                                    )}
                                    {game.hasManual && (
                                        <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_5px_rgba(125,211,252,0.9)]" title="Has manual" />
                                    )}
                                </div>
                            </div>

                            {/* Title */}
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

            <GameDetailPanel
                game={selectedGame}
                onClose={closeGame}
            />
        </>
    );
}
