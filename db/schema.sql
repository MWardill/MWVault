-- Database Schema for MW Vault Video Game Collection
-- Target: PostgreSQL (Neon / Vercel Postgres)

-- 1. Users Table
-- A rudimentary users table to track users of the app.
-- Even though we are hard-coding allowed Google accounts in NextAuth, 
-- it's good practice to have a user record for foreign key relationships.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Games Collection Table
-- This table tracks the actual games owned by the user
CREATE TABLE IF NOT EXISTS games_collection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    console_id VARCHAR(50) NOT NULL, -- e.g., 'psone', 'supernintendo' (matches consolesData ID)
    title VARCHAR(255) NOT NULL,
    
    -- Phase 3 Metadata (Optional / Expandable later)
    -- Added now to avoid painful migrations later
    has_box BOOLEAN DEFAULT false,
    has_manual BOOLEAN DEFAULT false,
    is_sealed BOOLEAN DEFAULT false,
    condition_rating INTEGER CHECK (condition_rating >= 1 AND condition_rating <= 10), -- 1-10 scale
    purchase_price DECIMAL(10, 2),
    purchase_date DATE,
    notes TEXT,

    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal querying
-- We will frequently query by user_id and console_id
CREATE INDEX IF NOT EXISTS idx_games_collection_user_console 
ON games_collection(user_id, console_id);

-- Example Seed Data (Uncomment to use)
/*
INSERT INTO users (email, name) VALUES ('mat.wardill@gmail.com', 'Mat Wardill');

-- Assuming the user ID generated above is known, you would insert like this:
-- INSERT INTO games_collection (user_id, console_id, title, has_box, has_manual)
-- VALUES 
--  ('uuid-from-above', 'psone', 'Final Fantasy VII', true, true),
--  ('uuid-from-above', 'supernintendo', 'Chrono Trigger', false, false);
*/
