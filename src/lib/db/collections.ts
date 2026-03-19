import { db } from "@/lib/db";
import { games, gamesCollection, consoles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// Shared select shape for both collection and wishlist
const gameSelectShape = {
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
    currentPrice: games.currentPrice,
};

// ─── Collection (owned games only) ───────────────────────────────────────────

export async function getCollectionByConsoleIdFromDb(consoleId: number) {
    const collection = await db
        .select(gameSelectShape)
        .from(gamesCollection)
        .innerJoin(games, eq(gamesCollection.gameId, games.id))
        .where(eq(games.consoleId, consoleId))
        .orderBy(games.title);

    // Filter to owned-only: isWishlist is false (or null/not set)
    return collection.filter(g => !g.isWishlist);
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export async function getWishlistByConsoleIdFromDb(consoleId: number) {
    const wishlist = await db
        .select(gameSelectShape)
        .from(gamesCollection)
        .innerJoin(games, eq(gamesCollection.gameId, games.id))
        .where(eq(games.consoleId, consoleId))
        .orderBy(games.currentPrice ? desc(games.currentPrice) : games.title);

    return wishlist.filter(g => g.isWishlist === true);
}

export type WishlistGame = Awaited<ReturnType<typeof getWishlistByConsoleIdFromDb>>[number];

export async function getWishlistAllFromDb() {
    const wishlist = await db
        .select({
            ...gameSelectShape,
            consoleName: consoles.name,
            consoleShortCode: consoles.shortCode,
        })
        .from(gamesCollection)
        .innerJoin(games, eq(gamesCollection.gameId, games.id))
        .innerJoin(consoles, eq(games.consoleId, consoles.id))
        .orderBy(games.title);

    return wishlist.filter(g => g.isWishlist === true);
}

export type WishlistGameWithConsole = Awaited<ReturnType<typeof getWishlistAllFromDb>>[number];

// ─── Insert / upsert ─────────────────────────────────────────────────────────

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
