import { db } from "@/lib/db";
import { consoles, gamesCollection, games } from "@/lib/db/schema";
import { count, eq, and, or, isNull } from "drizzle-orm";

export async function getConsolesWithGameCountsFromDb() {
    const results = await db
        .select({
            id: consoles.shortCode,
            name: consoles.name,
            icon: consoles.iconPath,
            value: count(gamesCollection.id)
        })
        .from(consoles)
        .leftJoin(games, eq(consoles.id, games.consoleId))
        .leftJoin(
            gamesCollection,
            and(
                eq(games.id, gamesCollection.gameId),
                // Only count owned games (not wishlist)
                or(eq(gamesCollection.isWishlist, false), isNull(gamesCollection.isWishlist))
            )
        )
        .groupBy(consoles.id, consoles.shortCode, consoles.name, consoles.iconPath);

    return results
        .map(r => ({
            id: r.id,
            name: r.name,
            icon: r.icon || "",
            value: r.value
        }))
        .sort((a, b) => b.value - a.value);
}


export async function getConsoleByShortCodeFromDb(shortCode: string) {
    const [consoleData] = await db
        .select()
        .from(consoles)
        .where(eq(consoles.shortCode, shortCode))
        .limit(1);

    return consoleData;
}

export async function getAllConsolesFromDb() {
    return await db
        .select()
        .from(consoles)
        .orderBy(consoles.name);
}
