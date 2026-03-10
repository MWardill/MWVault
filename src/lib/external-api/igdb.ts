"use server";

import { upsertGamesFromIgdb, IgdbGameUpsertInput } from "@/lib/db/games";

interface TwitchAuthResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

interface IGDBResponseItem {
    id: number;
    date: number;
    game?: {
        id: number;
        name?: string;
        summary?: string;
        cover?: {
            id: number;
            image_id?: string;
        };
        involved_companies?: {
            id: number;
            developer?: boolean;
            company?: {
                id: number;
                name?: string;
            };
        }[];
    };
    human: string;
    platform: {
        id: number;
        name: string;
    };
}

export async function syncIgdbGames() {
    try {
        const clientId = process.env.TWITCH_ID;
        const clientSecret = process.env.TWITCH_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("Missing Twitch API credentials in environment variables");
        }

        // 1. Authenticate with Twitch to get OAuth token
        const authUrl = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
        const authRes = await fetch(authUrl, { method: "POST", cache: "no-store" });

        if (!authRes.ok) {
            throw new Error(`Failed to fetch Twitch token: ${authRes.statusText}`);
        }

        const authData: TwitchAuthResponse = await authRes.json();
        const accessToken = authData.access_token;

        // 2. Fetch Release Dates for Dreamcast (platform: 23) in EU (region: 1)
        const igdbUrl = "https://api.igdb.com/v4/release_dates";

        const query = `
            fields 
            game.name,
            game.summary,
            game.cover.image_id,
            game.involved_companies.company.name,
            game.involved_companies.developer,
            platform.name,
            date,
            human;
            where platform = 23 & release_region = 1;
            sort date asc;
            limit 490;
            offset 0;
        `;

        const igdbRes = await fetch(igdbUrl, {
            method: "POST",
            headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "text/plain",
            },
            body: query,
            cache: "no-store",
        });

        if (!igdbRes.ok) {
            throw new Error(`Failed to fetch IGDB data: ${igdbRes.statusText}`);
        }

        const data: IGDBResponseItem[] = await igdbRes.json();

        // 3. Format games array for DB layer
        const gamesToInsert: IgdbGameUpsertInput[] = [];
        for (const item of data) {
            if (!item.game || !item.game.name) continue;

            // Extract developer
            let developerName = null;
            if (item.game.involved_companies) {
                const devs = item.game.involved_companies.filter(c => c.developer && c.company?.name);
                if (devs.length > 0) {
                    developerName = devs[0].company?.name || null;
                }
            }

            // Extract image URL
            let imageUrl = null;
            if (item.game.cover && item.game.cover.image_id) {
                imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${item.game.cover.image_id}.jpg`;
            }

            // Format date
            let releaseDateStr = null;
            if (item.date) {
                const dateObj = new Date(item.date * 1000);
                releaseDateStr = dateObj.toISOString().split('T')[0];
            }

            gamesToInsert.push({
                title: item.game.name,
                igdbId: item.game.id,
                summary: item.game.summary,
                developer: developerName,
                releaseDate: releaseDateStr,
                imageUrl: imageUrl,
            });
        }

        // 4. Pass games to DB module for the specific console
        const upsertCount = await upsertGamesFromIgdb(gamesToInsert, 'dreamcast');

        return { success: true, count: upsertCount };

    } catch (error: unknown) {
        console.error("IGDB Sync error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, error: errorMessage };
    }
}
