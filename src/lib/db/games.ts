import { db } from "@/lib/db";
import { consoles, games } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

    // 2. Upsert games into DB
    let upsertCount = 0;
    for (const item of gamesToInsert) {
        await db.insert(games).values({
            consoleId: consoleId,
            title: item.title,
            igdbId: item.igdbId,
            summary: item.summary,
            developer: item.developer,
            releaseDate: item.releaseDate,
            imageUrl: item.imageUrl,
        }).onConflictDoUpdate({
            target: games.igdbId,
            set: {
                title: item.title,
                summary: item.summary,
                developer: item.developer,
                releaseDate: item.releaseDate,
                imageUrl: item.imageUrl,
                updatedAt: new Date(),
            }
        });

        upsertCount++;
    }

    return upsertCount;
}
