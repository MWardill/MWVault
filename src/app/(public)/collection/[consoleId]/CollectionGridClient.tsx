"use client";

import { GameGrid } from "@/components/shared/GameGrid";
import type { Game } from "@/types/game";
import { removeGameFromCollection } from "../actions";

interface CollectionGridClientProps {
    games: Game[];
    consoleId: string;
}

export function CollectionGridClient({ games, consoleId }: CollectionGridClientProps) {
    return (
        <GameGrid games={games}>
            <GameGrid.List<Game> 
                renderActions={(game, closeGame) => [
                    {
                        id: "btn-remove-collection",
                        label: "Remove from Collection",
                        variant: "danger",
                        onClick: async () => {
                            await removeGameFromCollection(game.id, consoleId);
                            closeGame();
                        }
                    }
                ]}
            />
        </GameGrid>
    );
}
