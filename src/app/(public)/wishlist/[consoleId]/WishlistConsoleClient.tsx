"use client";

import { GameGrid } from "@/components/shared/GameGrid";
import { addGameToCollectionFromWishlist, removeGameFromWishlist } from "../actions";
import type { WishlistGame } from "@/lib/db/collections";

interface WishlistConsoleClientProps {
    wishlist: WishlistGame[];
    consoleId: string;
}

export function WishlistConsoleClient({ wishlist, consoleId }: WishlistConsoleClientProps) {
    return (
        <GameGrid games={wishlist}>
            <GameGrid.Search />
            <GameGrid.List<WishlistGame> 
                renderActions={(game, closeGame) => [
                    {
                        id: "btn-add-collection",
                        label: "Add to Collection",
                        variant: "success",
                        onClick: async () => {
                            await addGameToCollectionFromWishlist(game.id, consoleId);
                            closeGame();
                        }
                    },
                    {
                        id: "btn-remove",
                        label: "Remove from Wishlist",
                        variant: "danger",
                        onClick: async () => {
                            await removeGameFromWishlist(game.id, consoleId);
                            closeGame();
                        }
                    }
                ]}
            />
        </GameGrid>
    );
}
