"use server";

import { upsertGamesFromIgdb, IgdbGameUpsertInput } from "@/lib/db/games";
import { CONSOLE_IGDB_MAP, SyncResult } from "./igdb-platforms";



interface IGDBResponseItem {
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
    platforms?: {
        id: number;
        name?: string;
    }[];
    release_dates?: {
        id: number;
        date?: number; // Unix timestamp
        human?: string; // e.g., "Q3 1992" or "1993-05-14"
    }[];
}

interface TwitchAuthResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getTwitchToken(clientId: string, clientSecret: string): Promise<string> {
    const authUrl = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
    const res = await fetch(authUrl, { method: "POST", cache: "no-store" });
    if (!res.ok) throw new Error(`Twitch auth failed: ${res.statusText}`);
    const data: TwitchAuthResponse = await res.json();
    return data.access_token;
}

// ─── Per-platform fetch with pagination ──────────────────────────────────────

const PAGE_SIZE = 500;

async function fetchAllReleaseDatesForPlatform(
    clientId: string,
    token: string,
    igdbPlatformId: number
): Promise<IGDBResponseItem[]> {
    const igdbUrl = "https://api.igdb.com/v4/games";
    const allItems: IGDBResponseItem[] = [];
    let offset = 0;


    while (true) {
        const query = `
            fields
                name,
                summary,
                cover.image_id,
                involved_companies.company.name,
                involved_companies.developer,
                platforms.name,
                release_dates.date,
                release_dates.human;
            where platforms = (${igdbPlatformId});
            sort first_release_date asc;
            limit ${PAGE_SIZE};
            offset ${offset};
        `;
        const res = await fetch(igdbUrl, {
            method: "POST",
            headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "text/plain",
            },
            body: query,
            cache: "no-store",
        });

        if (!res.ok) throw new Error(`IGDB fetch failed: ${res.statusText}`);

        const page: IGDBResponseItem[] = await res.json();
        allItems.push(...page);

        // If we got fewer results than the page size, we've reached the end
        if (page.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
    }

    return allItems;
}

// ─── Format IGDB response → DB input ─────────────────────────────────────────

function formatGames(data: IGDBResponseItem[]): IgdbGameUpsertInput[] {
    const result: IgdbGameUpsertInput[] = [];

    for (const item of data) {
        // 1. Everything is top-level now, so no more 'item.game.'
        if (!item.name) continue;

        let developerName: string | null = null;
        if (item.involved_companies) {
            const devs = item.involved_companies.filter(c => c.developer && c.company?.name);
            if (devs.length > 0) developerName = devs[0].company?.name ?? null;
        }

        let imageUrl: string | null = null;
        if (item.cover?.image_id) {
            imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${item.cover.image_id}.jpg`;
        }

        let releaseDateStr: string | null = null;
        // 2. release_dates is now an array. We'll grab the first valid unix timestamp.
        // (If you specifically want the European date, we can filter for it here)
        const firstValidDate = item.release_dates?.find((rd: any) => rd.date)?.date;

        if (firstValidDate) {
            releaseDateStr = new Date(firstValidDate * 1000).toISOString().split("T")[0];
        }

        result.push({
            title: item.name,
            igdbId: item.id, // 3. The ID is directly on the item
            summary: item.summary,
            developer: developerName,
            releaseDate: releaseDateStr,
            imageUrl,
        });
    }

    return result;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Sync a single platform from IGDB.
 * Pass shortCode = one of the keys in CONSOLE_IGDB_MAP.
 */
export async function syncIgdbGamesForPlatform(shortCode: string): Promise<SyncResult> {
    const platform = CONSOLE_IGDB_MAP[shortCode];
    if (!platform) {
        return { shortCode, name: shortCode, count: 0, error: `No IGDB mapping for '${shortCode}'` };
    }

    const clientId = process.env.TWITCH_ID;
    const clientSecret = process.env.TWITCH_SECRET;
    if (!clientId || !clientSecret) {
        return { shortCode, name: platform.name, count: 0, error: "Missing Twitch API credentials" };
    }

    try {
        const token = await getTwitchToken(clientId, clientSecret);
        const raw = await fetchAllReleaseDatesForPlatform(clientId, token, platform.igdbId);
        const formatted = formatGames(raw);
        const count = await upsertGamesFromIgdb(formatted, shortCode);
        return { shortCode, name: platform.name, count };
    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : "Unknown error";
        console.error(`IGDB sync error [${shortCode}]:`, error);
        return { shortCode, name: platform.name, count: 0, error };
    }
}

/**
 * Sync ALL platforms in CONSOLE_IGDB_MAP one by one.
 * Returns a result array with counts/errors per platform.
 */
export async function syncAllIgdbPlatforms(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    for (const shortCode of Object.keys(CONSOLE_IGDB_MAP)) {
        const result = await syncIgdbGamesForPlatform(shortCode);
        results.push(result);
    }
    return results;
}

// Back-compat: old single call kept as a thin wrapper around Dreamcast
export async function syncIgdbGames() {
    const result = await syncIgdbGamesForPlatform("dreamcast");
    if (!result.error) {
        return { success: true, count: result.count };
    }
    return { success: false, error: result.error };
}
