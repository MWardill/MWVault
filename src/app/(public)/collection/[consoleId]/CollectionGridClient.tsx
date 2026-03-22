"use client";

import { GameGrid } from "@/components/shared/GameGrid";
import type { Game } from "@/types/game";

export function CollectionGridClient({ games }: { games: Game[] }) {
    return (
        <GameGrid games={games}>
            <GameGrid.List />
        </GameGrid>
    );
}
