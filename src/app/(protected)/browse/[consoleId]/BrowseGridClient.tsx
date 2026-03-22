"use client";

import { GameGrid } from "@/components/shared/GameGrid";
import { BrowseSearchForm } from "@/components/browse/BrowseSearchForm";
import { addGameToCollection, addGameToWishlist } from "../actions";
import type { BrowseGame } from "@/lib/db/browse";

interface BrowseGridClientProps {
    games: BrowseGame[];
    consoleId: string;
    q?: string;
    page: number;
    totalPages: number;
}

export function BrowseGridClient({ games, consoleId, q, page, totalPages }: BrowseGridClientProps) {
    return (
        <GameGrid games={games}>
            {/* Server-side Search Form instead of GameGrid.Search to preserve DB wildcarding */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-b-2 border-slate-100/10 bg-[#1A1C29] shrink-0">
                <BrowseSearchForm consoleId={consoleId} initialQuery={q} />
            </div>

            {games.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6 bg-black/50">
                    <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center max-w-lg mb-8 uppercase tracking-wider">
                        {q ? `No games found matching "${q}" for this console.` : "No games found in the global database for this console."}
                    </p>
                </div>
            ) : (
                <>
                    <GameGrid.List<BrowseGame>
                        showBadges={true}
                        renderActions={(game, closeGame) => [
                            {
                                id: "btn-add-collection",
                                label: game.isOwned ? "In Collection" : "Add to Collection",
                                variant: game.isOwned ? "secondary" : "success",
                                disabled: game.isOwned,
                                onClick: async () => {
                                    await addGameToCollection(game.id, consoleId);
                                    closeGame();
                                }
                            },
                            {
                                id: "btn-add-wishlist",
                                label: game.isWishlist ? "Wishlisted" : "Add to Wishlist",
                                variant: game.isWishlist ? "secondary" : "warning",
                                disabled: game.isOwned || game.isWishlist,
                                onClick: async () => {
                                    await addGameToWishlist(game.id, consoleId);
                                    closeGame();
                                }
                            }
                        ]}
                    />
                    <GameGrid.Pagination 
                        currentPage={page} 
                        totalPages={totalPages} 
                        basePath={`/browse/${consoleId}`} 
                        queryParam="q" 
                    />
                </>
            )}
        </GameGrid>
    );
}
