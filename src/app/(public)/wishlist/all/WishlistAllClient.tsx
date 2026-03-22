"use client";

import { GameGrid } from "@/components/shared/GameGrid";
import { addGameToCollectionFromWishlist, removeGameFromWishlist } from "../actions";
import type { WishlistGameWithConsole } from "@/lib/db/collections";

export function WishlistAllClient({ wishlist }: { wishlist: WishlistGameWithConsole[] }) {
    return (
        <GameGrid games={wishlist}>
            <GameGrid.Search />
            <GameGrid.List<WishlistGameWithConsole> 
                renderActions={(game, closeGame) => [
                    {
                        id: "btn-add-collection",
                        label: "Add to Collection",
                        variant: "success",
                        onClick: async () => {
                            await addGameToCollectionFromWishlist(game.id);
                            closeGame();
                        }
                    },
                    {
                        id: "btn-remove",
                        label: "Remove from Wishlist",
                        variant: "danger",
                        onClick: async () => {
                            await removeGameFromWishlist(game.id);
                            closeGame();
                        }
                    }
                ]}
            />
        </GameGrid>
    );
}
