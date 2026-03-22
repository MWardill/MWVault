"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback } from "react";
import { useSpatialNavigation, setFocusedElementId } from "@/hooks/useSpatialNavigation";
import type { Game } from "@/types/game";

export interface DetailAction {
    id: string;
    label: string | React.ReactNode;
    onClick: () => Promise<void> | void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger" | "success" | "warning";
}

interface GameDetailPanelProps<T extends Game> {
    game: T | null;
    onClose: () => void;
    actions?: DetailAction[];
    children?: React.ReactNode; 
}

function StatusDot({ active, label }: { active: boolean | null | undefined; label: string }) {
    if (active === undefined || active === null) return null;
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

export function GameDetailPanel<T extends Game>({ game, onClose, actions, children }: GameDetailPanelProps<T>) {
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

    useEffect(() => {
        if (game) {
            setFocusedElementId(CLOSE_BTN_ID);
        }
    }, [game]);

    const getVariantClasses = (variant: DetailAction["variant"], isFocused: boolean, disabled: boolean) => {
        if (disabled) {
            return "bg-slate-900/40 border-slate-700/50 text-slate-500/50 cursor-not-allowed opacity-60";
        }
        switch (variant) {
            case "success":
                return isFocused 
                    ? "bg-emerald-600 border-white text-white shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                    : "bg-emerald-800/80 border-emerald-500 text-emerald-100 hover:bg-emerald-700 hover:border-emerald-400 shadow-[0_4px_10px_rgba(0,0,0,0.5)]";
            case "danger":
                return isFocused 
                    ? "bg-red-600 border-white text-white shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                    : "bg-red-900/80 border-red-500 text-red-100 hover:bg-red-800 hover:border-red-400 shadow-[0_4px_10px_rgba(0,0,0,0.5)]";
            case "warning":
                return isFocused
                    ? "bg-amber-600 border-white text-white shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                    : "bg-amber-800/80 border-amber-500 text-amber-100 hover:bg-amber-700 hover:border-amber-400 shadow-[0_4px_10px_rgba(0,0,0,0.5)]";
            case "primary":
            default:
                return isFocused
                    ? "bg-sky-600 border-white text-white shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                    : "bg-sky-900/80 border-sky-500 text-sky-100 hover:bg-sky-800 hover:border-sky-400 shadow-[0_4px_10px_rgba(0,0,0,0.5)]";
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
                                            {/* Generic property mapping for additional fields */}
                                            {('conditionRating' in game) && (game as unknown as Record<string, string | number>).conditionRating && (
                                                <p className="font-pixel text-[9px] text-amber-300 tracking-wider uppercase leading-none">
                                                    <span className="text-slate-400">COND:</span>{" "}
                                                    {String((game as unknown as Record<string, string | number>).conditionRating)} / 10
                                                </p>
                                            )}
                                            {('purchasePrice' in game) && (game as unknown as Record<string, string | number>).purchasePrice && (
                                                <p className="font-pixel text-[9px] text-emerald-300 tracking-wider uppercase leading-none">
                                                    <span className="text-slate-400">PAID:</span>{" "}
                                                    £{String((game as unknown as Record<string, string | number>).purchasePrice)}
                                                </p>
                                            )}
                                            {game.currentPrice && !('purchasePrice' in game && game.purchasePrice) && (
                                                <p className="font-pixel text-[9px] text-amber-300 tracking-wider uppercase leading-none">
                                                    <span className="text-slate-400">CIB ~:</span>{" "}
                                                    £{game.currentPrice}
                                                </p>
                                            )}
                                        </div>

                                        {/* Status badges mapped strictly correctly if they exist on the GameType */}
                                        <div className="mt-2 flex flex-col gap-2">
                                            {('isOwned' in game || 'isWishlist' in game) && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-pixel text-[9px] text-slate-400 tracking-widest uppercase">Status:</span>
                                                    {('isOwned' in game && game.isOwned) ? (
                                                        <span className="font-pixel text-[9px] text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/50 uppercase">Owned</span>
                                                    ) : ('isWishlist' in game && game.isWishlist) ? (
                                                        <span className="font-pixel text-[9px] text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/50 uppercase">Wishlist</span>
                                                    ) : (
                                                        <span className="font-pixel text-[9px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-600/50 uppercase">None</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Custom specific meta elements like Sealed/Box/Manual depending on type */}
                                {('isSealed' in game || 'hasBox' in game || 'hasManual' in game) && (
                                    <div className="border-t border-white/15 pt-4">
                                        <p className="font-pixel text-[8px] text-slate-400 tracking-widest uppercase mb-3">
                                            Collection Status
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <StatusDot active={'isSealed' in game ? (game.isSealed as boolean) : null} label="Sealed" />
                                            <StatusDot active={'hasBox' in game ? (game.hasBox as boolean) : null} label="Box" />
                                            <StatusDot active={'hasManual' in game ? (game.hasManual as boolean) : null} label="Manual" />
                                        </div>
                                    </div>
                                )}

                                {/* Dynamic Action Buttons */}
                                {actions && actions.length > 0 && (
                                    <div className="border-t border-white/15 pt-4 flex gap-4">
                                        {actions.map((action) => {
                                            const actionIsFocused = focusedElementId === action.id;
                                            return (
                                                <button
                                                    key={action.id}
                                                    id={action.id}
                                                    onClick={() => {
                                                        if (!action.disabled) action.onClick();
                                                    }}
                                                    disabled={action.disabled}
                                                    className={`jrpg-selectable flex-1 py-3 px-4 rounded border-2 font-pixel text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${getVariantClasses(action.variant, actionIsFocused, !!action.disabled)}`}
                                                >
                                                    {actionIsFocused && !action.disabled ? "▶ " : ""}
                                                    {action.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

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

                                {('notes' in game) && (game as unknown as Record<string, string | number>).notes && (
                                    <div className="border-t border-white/15 pt-4">
                                        <p className="font-pixel text-[8px] text-slate-400 tracking-widest uppercase mb-3">
                                            Notes
                                        </p>
                                        <p className="font-mono-retro text-sm text-slate-300 leading-relaxed italic">
                                            {String((game as unknown as Record<string, string | number>).notes)}
                                        </p>
                                    </div>
                                )}
                                
                                {children}

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
