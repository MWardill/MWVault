import { db } from "@/lib/db";
import { consoles, games } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export type IgdbGameUpsertInput = {
    title: string;
    igdbId: number;
    summary?: string | null;
    developer?: string | null;
    releaseDate?: string | null;
    imageUrl?: string | null;
};

export async function upsertGamesFromIgdb(gamesToInsert: IgdbGameUpsertInput[], consoleShortCode: string) {
    // 1. Find the console ID in our DB
    const consoleRecord = await db
        .select()
        .from(consoles)
        .where(eq(consoles.shortCode, consoleShortCode))
        .limit(1);

    if (consoleRecord.length === 0) {
        throw new Error(`Console '${consoleShortCode}' not found in database.`);
    }
    const consoleId = consoleRecord[0].id;

    if (gamesToInsert.length === 0) return 0;

    // 2. Single bulk upsert — one round-trip regardless of list size
    await db.insert(games).values(
        gamesToInsert.map(item => ({
            consoleId,
            title: item.title,
            igdbId: item.igdbId,
            summary: item.summary,
            developer: item.developer,
            releaseDate: item.releaseDate,
            imageUrl: item.imageUrl,
        }))
    ).onConflictDoUpdate({
        target: games.igdbId,
        set: {
            title: sql`excluded.title`,
            summary: sql`excluded.summary`,
            developer: sql`excluded.developer`,
            releaseDate: sql`excluded.release_date`,
            imageUrl: sql`excluded.image_url`,
            updatedAt: new Date(),
        },
    });

    return gamesToInsert.length;
}

