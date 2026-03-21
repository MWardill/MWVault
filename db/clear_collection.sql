-- ============================================================
-- MW Vault: Clear Collection & Wishlist Records
-- ============================================================
-- PURPOSE: Reset games_collection so a fresh CSV import starts
--          from a clean state.
--
-- IMPORTANT: Run this MANUALLY in your DB console (Neon/Vercel Postgres).
--            This will DELETE all owned + wishlist records for the default
--            user. It does NOT delete the games master data or consoles.
--
-- Run ONCE before re-importing from your spreadsheet.
-- ============================================================

DELETE FROM games_collection
WHERE user_id = (SELECT id FROM users WHERE email = 'mat3740@gmail.com');
