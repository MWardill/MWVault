"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback } from "react";
import { useSpatialNavigation, setFocusedElementId } from "@/hooks/useSpatialNavigation";

export type CollectionGame = {
    id: number;
    title: string;
    imageUrl: string | null;
    summary: string | null;
    developer: string | null;
    releaseDate: string | null;
    hasBox: boolean | null;
    hasManual: boolean | null;
    isSealed: boolean | null;
    isWishlist: boolean | null;
    conditionRating: number | null;
    purchasePrice: string | null;
    notes: string | null;
};

interface GameDetailPanelProps {
    game: CollectionGame | null;
    onClose: () => void;
}

function StatusDot({ active, label }: { active: boolean | null; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    active
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                        : "bg-rose-500/50"
                }`}
            />
            <span className="font-pixel text-[9px] text-slate-200 tracking-wider uppercase leading-none pt-[2px]">
                {label}
            </span>
        </div>
    );
}

const CLOSE_BTN_ID = "game-detail-close-btn";

export function GameDetailPanel({ game, onClose }: GameDetailPanelProps) {
    const { focusedElementId } = useSpatialNavigation();
    const closeIsFocused = focusedElementId === CLOSE_BTN_ID;

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [handleKey]);

    // When the panel opens, move the spatial cursor to the close button so the
    // user can immediately press Enter/Escape to dismiss without touching a mouse.
    useEffect(() => {
        if (game) {
            setFocusedElementId(CLOSE_BTN_ID);
        }
    }, [game]);

    return (
        <AnimatePresence>
            {game && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Panel */}
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, scale: 0.88, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 30 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        aria-modal="true"
                        role="dialog"
                        aria-label={game.title}
                    >
                        <div
                            className="jrpg-panel pointer-events-auto relative w-[92vw] max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button — jrpg-selectable so keyboard cursor lands here on open */}
                            <button
                                id={CLOSE_BTN_ID}
                                onClick={onClose}
                                className={`jrpg-selectable absolute top-3 right-3 z-20 font-pixel text-[9px] px-2 py-1 rounded transition-colors tracking-widest uppercase ${
                                    closeIsFocused
                                        ? "text-white bg-white/25 shadow-[0_0_8px_rgba(125,211,252,0.6)]"
                                        : "text-slate-300 hover:text-white bg-white/10 hover:bg-white/20"
                                }`}
                                aria-label="Close panel"
                            >
                                {closeIsFocused ? "▶ " : ""}✕ Close
                            </button>

                            <div className="p-6 pt-7 flex flex-col gap-6">
                                {/* Top section: Art + title/meta */}
                                <div className="flex gap-5 items-start">
                                    {/* Box art */}
                                    <div className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 bg-black/40 border-2 border-white/20 rounded-sm overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                        {game.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={game.imageUrl}
                                                alt={`${game.title} box art`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="font-pixel text-[8px] text-slate-400 text-center px-2 leading-relaxed tracking-wider uppercase">
                                                    No Art
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title and meta */}
                                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                                        <h2 className="font-pixel text-sm sm:text-base text-white leading-snug jrpg-text-shadow pr-10">
                                            {game.title}
                                        </h2>

                                        <div className="flex flex-col gap-1.5">
                                            {game.developer && (
                                                <p className="font-pixel text-[9px] text-sky-300 tracking-wider uppercase leading-none">
                                                    <span className="text-slate-400">DEV:</span>{" "}
                                                    {game.developer}
                                                </p>
                                            )}
                                            {game.releaseDate && (
                                                <p className="font-pixel text-[9px] text-slate-300 tracking-wider uppercase leading-none">
                                                    <span className="text-slate-400">YEAR:</span>{" "}
                                                    {game.releaseDate.slice(0, 4)}
                                                </p>
                                            )}
                                            {game.conditionRating && (
                                                <p className="font-pixel text-[9px] text-amber-300 tracking-wider uppercase leading-none">
                                                    <span className="text-slate-400">COND:</span>{" "}
                                                    {game.conditionRating} / 10
                                                </p>
                                            )}
                                            {game.purchasePrice && (
                                                <p className="font-pixel text-[9px] text-emerald-300 tracking-wider uppercase leading-none">
                                                    <span className="text-slate-400">PAID:</span>{" "}
                                                    £{game.purchasePrice}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Ownership status */}
                                <div className="border-t border-white/15 pt-4">
                                    <p className="font-pixel text-[8px] text-slate-400 tracking-widest uppercase mb-3">
                                        Collection Status
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <StatusDot active={game.hasBox} label="Box" />
                                        <StatusDot active={game.hasManual} label="Manual" />
                                        <StatusDot active={game.isSealed} label="Sealed" />
                                        <StatusDot active={game.isWishlist} label="Wishlist" />
                                    </div>
                                </div>

                                {/* Description */}
                                {game.summary && (
                                    <div className="border-t border-white/15 pt-4">
                                        <p className="font-pixel text-[8px] text-slate-400 tracking-widest uppercase mb-3">
                                            About
                                        </p>
                                        <p className="font-mono-retro text-sm text-slate-300 leading-relaxed">
                                            {game.summary}
                                        </p>
                                    </div>
                                )}

                                {/* Notes */}
                                {game.notes && (
                                    <div className="border-t border-white/15 pt-4">
                                        <p className="font-pixel text-[8px] text-slate-400 tracking-widest uppercase mb-3">
                                            Notes
                                        </p>
                                        <p className="font-mono-retro text-sm text-slate-300 leading-relaxed italic">
                                            {game.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
