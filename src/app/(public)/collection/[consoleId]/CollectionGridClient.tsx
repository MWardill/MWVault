"use client";

import { GameGrid } from "@/components/shared/GameGrid";
import type { Game } from "@/types/game";
import { removeGameFromCollection } from "../actions";
import { useSession } from "next-auth/react";

interface CollectionGridClientProps {
    games: Game[];
    consoleId: string;
}

export function CollectionGridClient({ games, consoleId }: CollectionGridClientProps) {
    const { status } = useSession();

    return (
        <GameGrid games={games}>
            <GameGrid.List<Game> 
                renderActions={status === "authenticated" ? (game, closeGame) => [
                    {
                        id: "btn-remove-collection",
                        label: "Remove from Collection",
                        variant: "danger",
                        onClick: async () => {
                            await removeGameFromCollection(game.id, consoleId);
                            closeGame();
                        }
                    }
                ] : undefined}
            />
        </GameGrid>
    );
}
