"use client";

import { GameGrid } from "@/components/shared/GameGrid";
import { addGameToCollectionFromWishlist, removeGameFromWishlist } from "../actions";
import type { WishlistGame } from "@/lib/db/collections";
import { useSession } from "next-auth/react";

interface WishlistConsoleClientProps {
    wishlist: WishlistGame[];
    consoleId: string;
}

export function WishlistConsoleClient({ wishlist, consoleId }: WishlistConsoleClientProps) {
    const { status } = useSession();

    return (
        <GameGrid games={wishlist}>
            <GameGrid.Search />
            <GameGrid.List<WishlistGame> 
                renderActions={status === "authenticated" ? (game, closeGame) => [
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
                ] : undefined}
            />
        </GameGrid>
    );
}
