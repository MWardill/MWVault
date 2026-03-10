import { db } from "@/lib/db";
import { games, gamesCollection } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getCollectionByConsoleIdFromDb(consoleId: number) {
    const collection = await db
        .select({
            id: gamesCollection.id,
            title: games.title,
            hasBox: gamesCollection.hasBox,
            hasManual: gamesCollection.hasManual,
            conditionRating: gamesCollection.conditionRating,
            imageUrl: games.imageUrl,
        })
        .from(gamesCollection)
        .innerJoin(games, eq(gamesCollection.gameId, games.id))
        .where(eq(games.consoleId, consoleId))
        .orderBy(games.title);

    return collection;
}
