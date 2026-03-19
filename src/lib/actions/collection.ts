"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { games, users, consoles } from "@/lib/db/schema";
import { insertCollectionRecords } from "@/lib/db/collections";
import { eq, ilike, and } from "drizzle-orm";
import Papa from "papaparse";

/**
 * Maps CSV "Platform" column values → DB short_code values.
 * Platforms not listed here will be skipped (logged as unmatched).
 */
const PLATFORM_MAP: Record<string, string> = {
    "Sega Dreamcast":            "dreamcast",
    "Sega Saturn":               "segasaturn",
    "Sega Genesis/Mega Drive":   "megadrive",
    "Sega Master System":        "mastersystem",
    "Sega Game Gear":            "gamegear",
    "Sega CD":                   "segacd",
    "Sony PlayStation":          "psone",
    "Sony PlayStation 2":        "ps2",
    "Sony PlayStation 3":        "ps3",
    "Sony PlayStation 4":        "ps4",
    "Sony PlayStation 5":        "ps5",
    "SNES/Super Famicom":        "supernintendo",
    "Nintendo 64":               "n64",
    "Nintendo Game Boy":         "gameboy",
    "Nintendo Game Boy Color":   "gameboycolor",
    "Nintendo Game Boy Advance": "gameboyadvance",
    "Nintendo DS":               "nintendods",
    "Nintendo 3DS":              "nintendo3ds",
    "Nintendo GameCube":         "gamecube",
    "Nintendo Wii":              "wii",
    "Nintendo Wii U":            "wiiu",
    "Nintendo Switch":           "switch",
    "Microsoft Xbox":            "xbox",
    "Microsoft Xbox 360":        "xbox360",
    "PC":                        "pc",
};

function parsePrice(raw: string | undefined): string | null {
    if (!raw || raw === "?" || raw === "-1.0" || raw === "-1") return null;
    const n = parseFloat(raw);
    return isNaN(n) || n < 0 ? null : n.toFixed(2);
}

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

        // 4. Pre-fetch all known consoles to build a shortCode → id map
        const allConsoles = await db.select({ id: consoles.id, shortCode: consoles.shortCode }).from(consoles);
        const consoleIdMap: Record<string, number> = {};
        for (const c of allConsoles) {
            consoleIdMap[c.shortCode] = c.id;
        }

        let importedCount = 0;
        let notFoundCount = 0;
        const skippedPlatforms = new Set<string>();
        const recordsToInsert = [];

        for (const row of rows) {
            const platform = row["Platform"];
            const shortCode = PLATFORM_MAP[platform];

            if (!shortCode) {
                skippedPlatforms.add(platform || "(empty)");
                continue;
            }

            const consoleId = consoleIdMap[shortCode];
            if (!consoleId) {
                skippedPlatforms.add(platform);
                continue;
            }

            const title = row["Title"];
            if (!title) continue;

            const recordType = row["UserRecordType"];
            const ownership = row["Ownership"];
            const isWishlist = recordType === "Wishlist";

            let hasBox = false;
            let hasManual = false;
            if (ownership === "CIB" || ownership === "CIB+" || ownership === "Boxed") hasBox = true;
            if (ownership === "CIB" || ownership === "CIB+") hasManual = true;

            // Price: use PriceCIB as the market reference price
            const priceCib = parsePrice(row["PriceCIB"]);

            // Find game in DB by title + console (case-insensitive)
            const matchingGames = await db
                .select()
                .from(games)
                .where(and(ilike(games.title, title), eq(games.consoleId, consoleId)))
                .limit(1);

            if (matchingGames.length > 0) {
                const game = matchingGames[0];

                // Update current_price on the games row if we have price data
                if (priceCib && priceCib !== game.currentPrice) {
                    await db
                        .update(games)
                        .set({ currentPrice: priceCib })
                        .where(eq(games.id, game.id));
                }

                recordsToInsert.push({
                    userId,
                    gameId: game.id,
                    hasBox,
                    hasManual,
                    isWishlist,
                });
            } else {
                notFoundCount++;
            }
        }

        if (recordsToInsert.length > 0) {
            importedCount = await insertCollectionRecords(recordsToInsert);
        }

        const skippedMsg = skippedPlatforms.size > 0
            ? ` Skipped platforms (not in DB): ${[...skippedPlatforms].join(", ")}.`
            : "";

        return {
            success: true,
            count: importedCount,
            message: `Imported ${importedCount} records (${notFoundCount} unmatched titles).${skippedMsg}`,
        };

    } catch (e: unknown) {
        console.error("CSV Import Error:", e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during import.";
        return { success: false, error: errorMessage };
    }
}
