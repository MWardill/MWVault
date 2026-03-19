"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { games, users } from "@/lib/db/schema";
import { insertCollectionRecords } from "@/lib/db/collections";
import { eq, ilike } from "drizzle-orm";
import Papa from "papaparse";

export async function importCollectionFromCsv(formData: FormData) {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return { success: false, error: "Unauthorized. Please log in first." };
    }

    const file = formData.get("csvFile") as File;
    if (!file) {
        return { success: false, error: "No file provided." };
    }

    try {
        // 2. Resolve User ID
        const dbUsers = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
        if (dbUsers.length === 0) {
            return { success: false, error: "User not found in database." };
        }
        const userId = dbUsers[0].id;

        // 3. Read and parse CSV
        const fileContent = await file.text();
        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
        });

        if (parseResult.errors.length > 0) {
            console.error(parseResult.errors);
            return { success: false, error: "Failed to parse CSV file." };
        }

        const rows = parseResult.data as Record<string, string>[];

        // 4. Process only "Sega Dreamcast" for now
        const dreamcastRows = rows.filter(r => r["Platform"] === "Sega Dreamcast");

        if (dreamcastRows.length === 0) {
            return { success: true, count: 0, message: "No Dreamcast games found in CSV." };
        }

        let importedCount = 0;
        let notFoundCount = 0;
        const recordsToInsert = [];

        for (const row of dreamcastRows) {
            const title = row["Title"];
            const recordType = row["UserRecordType"];
            const ownership = row["Ownership"];

            const isWishlist = recordType === "Wishlist";

            let hasBox = false;
            let hasManual = false;

            if (ownership === "CIB" || ownership === "CIB+" || ownership === "Boxed") {
                hasBox = true;
            }
            if (ownership === "CIB" || ownership === "CIB+") {
                hasManual = true;
            }

            // Find game in DB by title (ignoring case)
            // Note: Since Dreamcast games were imported from IGDB, we match titles.
            const matchingGames = await db.select().from(games).where(ilike(games.title, title)).limit(1);

            if (matchingGames.length > 0) {
                const gameId = matchingGames[0].id;
                recordsToInsert.push({
                    userId,
                    gameId,
                    hasBox,
                    hasManual,
                    isWishlist
                });
            } else {
                notFoundCount++;
            }
        }

        if (recordsToInsert.length > 0) {
            importedCount = await insertCollectionRecords(recordsToInsert);
        }

        return {
            success: true,
            count: importedCount,
            message: `Successfully imported ${importedCount} games. (${notFoundCount} unmatched items)`
        };

    } catch (e: unknown) {
        console.error("CSV Import Error:", e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during import.";
        return { success: false, error: errorMessage };
    }
}
