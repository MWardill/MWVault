"use server";

import { upsertGamesFromIgdb, IgdbGameUpsertInput } from "@/lib/db/games";
import { CONSOLE_IGDB_MAP, SyncResult } from "./igdb-platforms";



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
    const igdbUrl = "https://api.igdb.com/v4/release_dates";
    const allItems: IGDBResponseItem[] = [];
    let offset = 0;

    while (true) {
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
            where platform = ${igdbPlatformId} & release_region = 1;
            sort date asc;
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
    const seen = new Set<number>();
    const result: IgdbGameUpsertInput[] = [];

    for (const item of data) {
        if (!item.game?.name) continue;
        if (seen.has(item.game.id)) continue; // deduplicate by IGDB game ID
        seen.add(item.game.id);

        let developerName: string | null = null;
        if (item.game.involved_companies) {
            const devs = item.game.involved_companies.filter(c => c.developer && c.company?.name);
            if (devs.length > 0) developerName = devs[0].company?.name ?? null;
        }

        let imageUrl: string | null = null;
        if (item.game.cover?.image_id) {
            imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${item.game.cover.image_id}.jpg`;
        }

        let releaseDateStr: string | null = null;
        if (item.date) {
            releaseDateStr = new Date(item.date * 1000).toISOString().split("T")[0];
        }

        result.push({
            title: item.game.name,
            igdbId: item.game.id,
            summary: item.game.summary,
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
