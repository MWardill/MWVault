-- ⚠️  DANGER: Clears all data from every table. Schema (structure) is preserved.
-- Run this in the Neon SQL Editor or via psql.

TRUNCATE TABLE
    games_collection,
    games,
    consoles,
    users
RESTART IDENTITY CASCADE;
