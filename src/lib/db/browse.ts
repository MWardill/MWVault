import { db } from "@/lib/db";
import { games, gamesCollection } from "@/lib/db/schema";
import { eq, and, asc, count } from "drizzle-orm";

export async function getBrowseGamesByConsoleIdFromDb(consoleId: number, userId: number, page: number = 1, pageSize: number = 48) {
    const offset = (page - 1) * pageSize;

    const [totalCountResult] = await db
        .select({ value: count() })
        .from(games)
        .where(eq(games.consoleId, consoleId));
        
    const totalPages = Math.ceil(totalCountResult.value / pageSize);

    const browseGames = await db
        .select({
            id: games.id,
            title: games.title,
            imageUrl: games.imageUrl,
            summary: games.summary,
            developer: games.developer,
            releaseDate: games.releaseDate,
            currentPrice: games.currentPrice,
            isWishlist: gamesCollection.isWishlist,
            isInCollection: gamesCollection.id
        })
        .from(games)
        .leftJoin(
            gamesCollection,
            and(
                eq(games.id, gamesCollection.gameId),
                eq(gamesCollection.userId, userId)
            )
        )
        .where(eq(games.consoleId, consoleId))
        .orderBy(asc(games.title))
        .limit(pageSize)
        .offset(offset);

    return {
        games: browseGames.map((game) => ({
            ...game,
            isOwned: game.isInCollection !== null && !game.isWishlist,
            isWishlist: game.isInCollection !== null && !!game.isWishlist,
        })),
        totalPages
    };
}

export type BrowseGame = Awaited<ReturnType<typeof getBrowseGamesByConsoleIdFromDb>>["games"][number];

export async function addGameToCollectionDb(gameId: number, userId: number) {
    await db.insert(gamesCollection).values({
        userId,
        gameId,
        isWishlist: false,
        addedAt: new Date(),
        updatedAt: new Date(),
    }).onConflictDoUpdate({
        target: [gamesCollection.userId, gamesCollection.gameId],
        set: { isWishlist: false, updatedAt: new Date() }
    });
}

export async function addGameToWishlistDb(gameId: number, userId: number) {
    await db.insert(gamesCollection).values({
        userId,
        gameId,
        isWishlist: true,
        addedAt: new Date(),
        updatedAt: new Date(),
    }).onConflictDoUpdate({
        target: [gamesCollection.userId, gamesCollection.gameId],
        set: { isWishlist: true, updatedAt: new Date() }
    });
}
