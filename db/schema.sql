-- Database Schema for MW Vault Video Game Collection
-- Target: PostgreSQL (Neon / Vercel Postgres)

-- 1. Users Table
-- Using an auto-incrementing integer ID as the primary key.
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Consoles Table
-- Tracks supported consoles within the application
CREATE TABLE IF NOT EXISTS consoles (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'psone', 'supernintendo'
    name VARCHAR(255) NOT NULL,
    icon_path VARCHAR(255)
);

-- 3. Games Table
-- Tracks master game details regardless of ownership
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    console_id INTEGER NOT NULL REFERENCES consoles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    igdb_id INTEGER UNIQUE,
    summary TEXT,
    developer VARCHAR(255),
    release_date DATE,
    current_price DECIMAL(10, 2),
    image_url VARCHAR(512),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure new columns are added if the table already existed before they were introduced
ALTER TABLE games ADD COLUMN IF NOT EXISTS igdb_id INTEGER UNIQUE;
ALTER TABLE games ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS developer VARCHAR(255);
ALTER TABLE games ADD COLUMN IF NOT EXISTS release_date DATE;

-- 4. Games Collection Table
-- This table tracks the actual games owned by the user, linking users directly to games
CREATE TABLE IF NOT EXISTS games_collection (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    
    -- Ownership Metadata
    has_box BOOLEAN DEFAULT false,
    has_manual BOOLEAN DEFAULT false,
    is_sealed BOOLEAN DEFAULT false,
    is_wishlist BOOLEAN DEFAULT false,
    condition_rating INTEGER CHECK (condition_rating >= 1 AND condition_rating <= 10), -- 1-10 scale
    purchase_price DECIMAL(10, 2),
    purchase_date DATE,
    notes TEXT,

    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Unique per user per game (supports upsert logic)
    CONSTRAINT uq_user_game UNIQUE (user_id, game_id)
);

-- Indexes for optimal querying
CREATE INDEX IF NOT EXISTS idx_games_console ON games(console_id);
-- Note: The unique constraint on (user_id, game_id) already covers this index
-- CREATE INDEX IF NOT EXISTS idx_games_collection_user_game ON games_collection(user_id, game_id);
-- Run this migration if the table was already created without the unique constraint:
ALTER TABLE games_collection ADD CONSTRAINT IF NOT EXISTS uq_user_game UNIQUE (user_id, game_id);

-- SEED DATA

-- Insert Default User
INSERT INTO users (email, name) VALUES 
('mat3740@gmail.com', 'MWardill')
ON CONFLICT (email) DO NOTHING;

-- Insert Default Consoles
-- Note: 'id' is SERIAL so it will auto-increment. We track the 'short_code' for UI routing logic.
INSERT INTO consoles (short_code, name, icon_path) VALUES 
('supernintendo', 'Super Nintendo', '/sprites/supernintendo.png'),
('psone', 'PlayStation', '/sprites/psone.png'),
('megadrive', 'Sega Mega Drive', '/sprites/megadrive.png'),
('n64', 'Nintendo 64', '/sprites/n64.png'),
('gameboy', 'GameBoy', '/sprites/gameboy.png'),
('gameboyadvance', 'GameBoy Advance', '/sprites/gameboyadvance.png'),
('nintendods', 'Nintendo DS', '/sprites/nintendods.png'),
('nintendo3ds', 'Nintendo 3DS', '/sprites/nintendo3ds.png'),
('gamecube', 'Nintendo GameCube', '/sprites/gamecube.png'),
('wii', 'Nintendo Wii', '/sprites/wii.png'),
('switch', 'Nintendo Switch', '/sprites/switch.png'),
('mastersystem', 'Sega Master System', '/sprites/mastersystem.png'),
('gamegear', 'Sega Game Gear', '/sprites/gamegear.png'),
('segasaturn', 'Sega Saturn', '/sprites/segaSaturn.png'),
('dreamcast', 'Dreamcast', '/sprites/dreamcast.png'),
('ps3', 'PlayStation 3', '/sprites/ps3.png'),
('ps4', 'PlayStation 4', '/sprites/ps4.png'),
('ps5', 'PlayStation 5', '/sprites/ps5.png'),
('xbox', 'Xbox', '/sprites/xbox.png'),
('xbox360', 'Xbox 360', '/sprites/xbox360.png')
ON CONFLICT (short_code) DO NOTHING;

-- Insert Example Games
-- We use a subquery to look up the auto-generated console_id by its short_code
WITH inserted_games AS (
    INSERT INTO games (console_id, title, current_price, image_url) VALUES 
    ((SELECT id FROM consoles WHERE short_code = 'psone'), 'Final Fantasy VII', 45.00, 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg'),
    ((SELECT id FROM consoles WHERE short_code = 'psone'), 'Metal Gear Solid', 60.00, 'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png'),
    ((SELECT id FROM consoles WHERE short_code = 'supernintendo'), 'Chrono Trigger', 199.99, 'https://upload.wikimedia.org/wikipedia/en/a/a7/Chrono_Trigger.jpg'),
    ((SELECT id FROM consoles WHERE short_code = 'supernintendo'), 'Super Mario World', 25.00, 'https://upload.wikimedia.org/wikipedia/en/3/32/Super_Mario_World_Coverart.png'),
    ((SELECT id FROM consoles WHERE short_code = 'n64'), 'Super Mario 64', 35.00, 'https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg'),
    ((SELECT id FROM consoles WHERE short_code = 'megadrive'), 'Sonic the Hedgehog', 20.00, 'https://upload.wikimedia.org/wikipedia/en/b/ba/Sonic_the_Hedgehog_1_Genesis_box_art.jpg')
    RETURNING id, title
)
-- Seed the games_collection table for the default user
INSERT INTO games_collection (user_id, game_id, has_box, has_manual, condition_rating)
SELECT 
    (SELECT id FROM users WHERE email = 'mat3740@gmail.com'),
    ig.id,
    true, -- has_box
    true, -- has_manual
    8     -- condition_rating
FROM inserted_games ig;
