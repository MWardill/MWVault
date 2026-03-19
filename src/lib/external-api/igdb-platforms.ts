// Plain (non-server) module — safe to import in both server and client components.

export type SyncResult = {
    shortCode: string;
    name: string;
    count: number;
    error?: string;
};

/** Maps our DB short_code → IGDB platform ID + display name. */
export const CONSOLE_IGDB_MAP: Record<string, { igdbId: number; name: string }> = {
    dreamcast:     { igdbId: 23,  name: "Dreamcast" },
    segasaturn:    { igdbId: 32,  name: "Sega Saturn" },
    megadrive:     { igdbId: 29,  name: "Sega Mega Drive" },
    mastersystem:  { igdbId: 64,  name: "Sega Master System" },
    gamegear:      { igdbId: 35,  name: "Sega Game Gear" },
    segacd:        { igdbId: 78,  name: "Sega CD" },
    psone:         { igdbId: 7,   name: "PlayStation" },
    ps2:           { igdbId: 8,   name: "PlayStation 2" },
    ps3:           { igdbId: 9,   name: "PlayStation 3" },
    ps4:           { igdbId: 48,  name: "PlayStation 4" },
    ps5:           { igdbId: 167, name: "PlayStation 5" },
    supernintendo: { igdbId: 19,  name: "Super Nintendo" },
    n64:           { igdbId: 4,   name: "Nintendo 64" },
    gameboy:       { igdbId: 33,  name: "Game Boy" },
    gameboycolor:  { igdbId: 22,  name: "Game Boy Color" },
    gameboyadvance:{ igdbId: 24,  name: "Game Boy Advance" },
    nintendods:    { igdbId: 20,  name: "Nintendo DS" },
    nintendo3ds:   { igdbId: 37,  name: "Nintendo 3DS" },
    gamecube:      { igdbId: 21,  name: "Nintendo GameCube" },
    wii:           { igdbId: 5,   name: "Nintendo Wii" },
    wiiu:          { igdbId: 41,  name: "Nintendo Wii U" },
    switch:        { igdbId: 130, name: "Nintendo Switch" },
    xbox:          { igdbId: 11,  name: "Xbox" },
    xbox360:       { igdbId: 12,  name: "Xbox 360" },
};
