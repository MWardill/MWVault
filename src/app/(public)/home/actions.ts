import { db } from "@/lib/db";
import { consoles, gamesCollection, games } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function getConsolesWithGameCounts() {
    const results = await db
        .select({
            id: consoles.shortCode,
            name: consoles.name,
            icon: consoles.iconPath,
            value: count(gamesCollection.id)
        })
        .from(consoles)
        .leftJoin(games, eq(consoles.id, games.consoleId))
        .leftJoin(gamesCollection, eq(games.id, gamesCollection.gameId))
        .groupBy(consoles.id, consoles.shortCode, consoles.name, consoles.iconPath);

    const formattedResults = results
        .map(r => ({
            id: r.id,
            name: r.name,
            icon: r.icon || "",
            value: r.value
        }))
        .sort((a, b) => b.value - a.value);

    return formattedResults;
}
