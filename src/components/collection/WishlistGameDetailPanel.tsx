"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback, useState } from "react";
import { useSpatialNavigation, setFocusedElementId } from "@/hooks/useSpatialNavigation";
import type { WishlistGame } from "./WishlistGrid";
import { addGameToCollectionFromWishlist, removeGameFromWishlist } from "@/app/(public)/wishlist/mutations";
import { useRouter } from "next/navigation";

interface WishlistGameDetailPanelProps {
    game: WishlistGame | null;
    onClose: () => void;
}

const CLOSE_BTN_ID = "wishlist-detail-close-btn";
const ADD_COLLECTION_BTN_ID = "wishlist-detail-add-collection-btn";
const REMOVE_WISHLIST_BTN_ID = "wishlist-detail-remove-wishlist-btn";

export function WishlistGameDetailPanel({ game, onClose }: WishlistGameDetailPanelProps) {
    const { focusedElementId } = useSpatialNavigation();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeIsFocused = focusedElementId === CLOSE_BTN_ID;
    const collectionBtnIsFocused = focusedElementId === ADD_COLLECTION_BTN_ID;
    const removeBtnIsFocused = focusedElementId === REMOVE_WISHLIST_BTN_ID;

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
            await addGameToCollectionFromWishlist(game.id, game.consoleShortCode);
            router.refresh();
            onClose();
        } catch (e) {
            console.error("Failed to add to collection", e);
            setIsSubmitting(false);
        }
    };

    const handleRemoveFromWishlist = async () => {
        if (!game || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await removeGameFromWishlist(game.id, game.consoleShortCode);
            router.refresh();
            onClose();
        } catch (e) {
            console.error("Failed to remove from wishlist", e);
            setIsSubmitting(false);
        }
    };

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
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-white/15 pt-4 flex gap-4">
                                    <button
                                        id={ADD_COLLECTION_BTN_ID}
                                        onClick={handleAddToCollection}
                                        disabled={isSubmitting}
                                        className={`jrpg-selectable flex-1 py-3 px-4 rounded border-2 font-pixel text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                                            collectionBtnIsFocused ? "bg-emerald-600 border-white text-white shadow-[0_0_12px_rgba(52,211,153,0.8)]" :
                                            "bg-emerald-800/80 border-emerald-500 text-emerald-100 hover:bg-emerald-700 hover:border-emerald-400 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                                        }`}
                                    >
                                        {collectionBtnIsFocused ? "▶ " : ""}Add to Collection
                                    </button>
                                    
                                    <button
                                        id={REMOVE_WISHLIST_BTN_ID}
                                        onClick={handleRemoveFromWishlist}
                                        disabled={isSubmitting}
                                        className={`jrpg-selectable flex-1 py-3 px-4 rounded border-2 font-pixel text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                                            removeBtnIsFocused ? "bg-red-600 border-white text-white shadow-[0_0_12px_rgba(239,68,68,0.8)]" :
                                            "bg-red-900/80 border-red-500 text-red-100 hover:bg-red-800 hover:border-red-400 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                                        }`}
                                    >
                                        {removeBtnIsFocused ? "▶ " : ""}Remove
                                    </button>
                                </div>

                                {/* Description */}
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
