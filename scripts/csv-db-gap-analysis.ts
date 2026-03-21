/**
 * CSV vs DB Gap Analysis - uses @neondatabase/serverless (available in project)
 * Run: npx tsx scripts/csv-db-gap-analysis.ts
 */

import { readFileSync } from 'fs';
import { neon } from '@neondatabase/serverless';
import { resolve } from 'path';

const DATABASE_URL = "postgresql://neondb_owner:npg_N1yjquwzg0Dx@ep-crimson-shape-ab9j06r3-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require";

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

/** Simple CSV parser handling quoted fields */
function parseCsv(content: string): Record<string, string>[] {
    const lines = content.split(/\r?\n/).filter(l => l.trim());
    const headers = parseCsvLine(lines[0]);
    const result: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        if (values.length === 0) continue;
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] ?? ''; });
        result.push(row);
    }
    return result;
}

function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
            else { inQuotes = !inQuotes; }
        } else if (ch === ',' && !inQuotes) {
            result.push(current.trim()); current = '';
        } else {
            current += ch;
        }
    }
    result.push(current.trim());
    return result;
}

async function main() {
    const sql = neon(DATABASE_URL);

    const csvPath = resolve(process.cwd(), 'data/3_10_2026_ge_collection.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const rows = parseCsv(csvContent);

    // Fetch all games from DB
    const dbGames = await sql`
        SELECT g.id, g.title, c.short_code
        FROM games g
        JOIN consoles c ON g.console_id = c.id
    ` as { id: number; title: string; short_code: string }[];

    const dbGameMap = new Map<string, { id: number; title: string }>();
    for (const g of dbGames) {
        dbGameMap.set(`${g.title.toLowerCase()}|${g.short_code}`, g);
    }

    // Fetch all game IDs in any user's collection
    const collectionGames = await sql`
        SELECT DISTINCT game_id as id FROM games_collection
    ` as { id: number }[];
    const collectionSet = new Set<number>(collectionGames.map(g => g.id));

    console.log(`\nDB total games:          ${dbGames.length}`);
    console.log(`DB collection entries:   ${collectionSet.size}`);
    console.log(`CSV game rows:           ${rows.filter(r => r['Category'] === 'Games').length}`);

    const unmatchedInDb: { title: string; platform: string; recordType: string }[] = [];
    const matchedButNotInCollection: { title: string; platform: string; recordType: string; gameId: number }[] = [];
    const skippedPlatforms = new Set<string>();
    const seen = new Set<string>();

    for (const row of rows) {
        const platform = row['Platform'];
        const title = row['Title'];
        const recordType = row['UserRecordType'];
        if (row['Category'] !== 'Games' || !title) continue;

        const shortCode = PLATFORM_MAP[platform];
        if (!shortCode) { skippedPlatforms.add(platform || '(empty)'); continue; }

        const dedupKey = `${title.toLowerCase()}|${shortCode}|${recordType}`;
        if (seen.has(dedupKey)) continue;
        seen.add(dedupKey);

        const dbGame = dbGameMap.get(`${title.toLowerCase()}|${shortCode}`);
        if (!dbGame) {
            unmatchedInDb.push({ title, platform, recordType });
        } else if (!collectionSet.has(dbGame.id)) {
            matchedButNotInCollection.push({ title, platform, recordType, gameId: dbGame.id });
        }
    }

    const sep = '='.repeat(80);

    console.log('\n' + sep);
    console.log('GAMES IN CSV WITH NO MATCHING TITLE IN DB (name mismatch)');
    console.log(sep);

    const ownedUnmatched = unmatchedInDb.filter(g => g.recordType === 'Owned');
    const wishlistUnmatched = unmatchedInDb.filter(g => g.recordType === 'Wishlist');

    if (ownedUnmatched.length) {
        console.log(`\n--- OWNED (${ownedUnmatched.length}) ---`);
        ownedUnmatched.forEach(g => console.log(`  [${g.platform}] "${g.title}"`));
    }
    if (wishlistUnmatched.length) {
        console.log(`\n--- WISHLIST (${wishlistUnmatched.length}) ---`);
        wishlistUnmatched.forEach(g => console.log(`  [${g.platform}] "${g.title}"`));
    }

    console.log('\n' + sep);
    console.log('GAMES IN CSV FOUND IN DB BUT NOT IN YOUR COLLECTION TABLE');
    console.log(sep);

    const ownedMissing = matchedButNotInCollection.filter(g => g.recordType === 'Owned');
    const wishlistMissing = matchedButNotInCollection.filter(g => g.recordType === 'Wishlist');

    if (ownedMissing.length) {
        console.log(`\n--- OWNED (${ownedMissing.length}) ---`);
        ownedMissing.forEach(g => console.log(`  [${g.platform}] "${g.title}" (game_id: ${g.gameId})`));
    }
    if (wishlistMissing.length) {
        console.log(`\n--- WISHLIST (${wishlistMissing.length}) ---`);
        wishlistMissing.forEach(g => console.log(`  [${g.platform}] "${g.title}" (game_id: ${g.gameId})`));
    }

    console.log('\n' + sep);
    console.log('SUMMARY');
    console.log(sep);
    console.log(`No DB match (name mismatch):              ${unmatchedInDb.length} (owned: ${ownedUnmatched.length}, wishlist: ${wishlistUnmatched.length})`);
    console.log(`In DB but not in collection:              ${matchedButNotInCollection.length} (owned: ${ownedMissing.length}, wishlist: ${wishlistMissing.length})`);
    if (skippedPlatforms.size > 0) {
        console.log(`\nSkipped platforms (not in map): ${[...skippedPlatforms].sort().join(', ')}`);
    }
}

main().catch(console.error);
