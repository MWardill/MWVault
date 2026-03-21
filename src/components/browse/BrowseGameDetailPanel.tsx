"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback, useState } from "react";
import { useSpatialNavigation, setFocusedElementId } from "@/hooks/useSpatialNavigation";
import type { BrowseGame } from "@/lib/db/browse";
import { addGameToCollection, addGameToWishlist } from "@/app/(protected)/browse/actions";
import { useRouter } from "next/navigation";

interface BrowseGameDetailPanelProps {
    game: BrowseGame | null;
    consoleShortCode: string;
    onClose: () => void;
}

const CLOSE_BTN_ID = "browse-detail-close-btn";
const ADD_COLLECTION_BTN_ID = "browse-detail-add-collection-btn";
const ADD_WISHLIST_BTN_ID = "browse-detail-add-wishlist-btn";

export function BrowseGameDetailPanel({ game, consoleShortCode, onClose }: BrowseGameDetailPanelProps) {
    const { focusedElementId } = useSpatialNavigation();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeIsFocused = focusedElementId === CLOSE_BTN_ID;
    const collectionBtnIsFocused = focusedElementId === ADD_COLLECTION_BTN_ID;
    const wishlistBtnIsFocused = focusedElementId === ADD_WISHLIST_BTN_ID;

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

    useEffect(() => {
        if (game) {
            setFocusedElementId(CLOSE_BTN_ID);
            queueMicrotask(() => setIsSubmitting(false));
        }
    }, [game]);

    const handleAddToCollection = async () => {
        if (!game || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await addGameToCollection(game.id, consoleShortCode);
            router.refresh(); // Refresh the page to get updated game states
            onClose();
        } catch (e) {
            console.error("Failed to add to collection", e);
            setIsSubmitting(false);
        }
    };

    const handleAddToWishlist = async () => {
        if (!game || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await addGameToWishlist(game.id, consoleShortCode);
            router.refresh();
            onClose();
        } catch (e) {
            console.error("Failed to add to wishlist", e);
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {game && (
                <>
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
                                <div className="flex gap-5 items-start">
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
                                            {game.currentPrice && (
                                                <p className="font-pixel text-[9px] text-amber-300 tracking-wider uppercase leading-none">
                                                    <span className="text-slate-400">CIB ~:</span>{" "}
                                                    £{game.currentPrice}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-2 flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-pixel text-[9px] text-slate-400 tracking-widest uppercase">Status:</span>
                                                {game.isOwned ? (
                                                    <span className="font-pixel text-[9px] text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/50 uppercase">Owned</span>
                                                ) : game.isWishlist ? (
                                                    <span className="font-pixel text-[9px] text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/50 uppercase">Wishlist</span>
                                                ) : (
                                                    <span className="font-pixel text-[9px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-600/50 uppercase">None</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-white/15 pt-4 flex gap-4">
                                    <button
                                        id={ADD_COLLECTION_BTN_ID}
                                        onClick={handleAddToCollection}
                                        disabled={isSubmitting || game.isOwned}
                                        className={`jrpg-selectable flex-1 py-3 px-4 rounded border-2 font-pixel text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                                            game.isOwned ? "bg-emerald-900/30 border-emerald-500/30 text-emerald-500/50 cursor-not-allowed opacity-60" :
                                            collectionBtnIsFocused ? "bg-emerald-600 border-white text-white shadow-[0_0_12px_rgba(52,211,153,0.8)]" :
                                            "bg-emerald-800/80 border-emerald-500 text-emerald-100 hover:bg-emerald-700 hover:border-emerald-400 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                                        }`}
                                    >
                                        {collectionBtnIsFocused && !game.isOwned ? "▶ " : ""}
                                        {game.isOwned ? "✓ In Collection" : "Add to Collection"}
                                    </button>
                                    
                                    <button
                                        id={ADD_WISHLIST_BTN_ID}
                                        onClick={handleAddToWishlist}
                                        disabled={isSubmitting || game.isWishlist}
                                        className={`jrpg-selectable flex-1 py-3 px-4 rounded border-2 font-pixel text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                                            game.isWishlist ? "bg-amber-900/30 border-amber-500/30 text-amber-500/50 cursor-not-allowed opacity-60" :
                                            wishlistBtnIsFocused ? "bg-amber-600 border-white text-white shadow-[0_0_12px_rgba(251,191,36,0.8)]" :
                                            "bg-amber-800/80 border-amber-500 text-amber-100 hover:bg-amber-700 hover:border-amber-400 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                                        }`}
                                    >
                                        {wishlistBtnIsFocused && !game.isWishlist ? "▶ " : ""}
                                        {game.isWishlist ? "★ On Wishlist" : "Add to Wishlist"}
                                    </button>
                                </div>

                                {game.summary && (
                                    <div className="border-t border-white/15 pt-4">
                                        <p className="font-pixel text-[8px] text-slate-400 tracking-widest uppercase mb-3">
                                            About
                                        </p>
                                        <p className="font-mono-retro text-sm text-slate-300 leading-relaxed max-w-full">
                                            {game.summary}
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
