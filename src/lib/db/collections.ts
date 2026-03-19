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
            isSealed: gamesCollection.isSealed,
            isWishlist: gamesCollection.isWishlist,
            conditionRating: gamesCollection.conditionRating,
            purchasePrice: gamesCollection.purchasePrice,
            notes: gamesCollection.notes,
            imageUrl: games.imageUrl,
            summary: games.summary,
            developer: games.developer,
            releaseDate: games.releaseDate,
        })
        .from(gamesCollection)
        .innerJoin(games, eq(gamesCollection.gameId, games.id))
        .where(eq(games.consoleId, consoleId))
        .orderBy(games.title);

    return collection;
}

export type CollectionInsertInput = {
    userId: number;
    gameId: number;
    hasBox?: boolean;
    hasManual?: boolean;
    isSealed?: boolean;
    isWishlist?: boolean;
    conditionRating?: number;
    purchasePrice?: string | null;
    purchaseDate?: string | null;
    notes?: string | null;
};

export async function insertCollectionRecords(records: CollectionInsertInput[]) {
    let insertedCount = 0;
    for (const record of records) {
        await db.insert(gamesCollection).values(record).onConflictDoUpdate({
            target: [gamesCollection.userId, gamesCollection.gameId],
            set: {
                hasBox: record.hasBox,
                hasManual: record.hasManual,
                isSealed: record.isSealed,
                isWishlist: record.isWishlist,
                conditionRating: record.conditionRating,
                purchasePrice: record.purchasePrice,
                purchaseDate: record.purchaseDate,
                notes: record.notes,
                updatedAt: new Date(),
            }
        });
        insertedCount++;
    }
    return insertedCount;
}
