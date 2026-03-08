import { db } from "@/lib/db";
import { consoles, games, gamesCollection } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getConsoleByShortCode(shortCode: string) {
    const [consoleData] = await db
        .select()
        .from(consoles)
        .where(eq(consoles.shortCode, shortCode))
        .limit(1);

    return consoleData;
}

export async function getAllConsoles() {
    return await db
        .select()
        .from(consoles)
        .orderBy(consoles.name);
}

export async function getCollectionByConsoleId(consoleId: number) {
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
