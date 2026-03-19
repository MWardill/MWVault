-- Migration: Add new consoles to the DB
-- Run this ONCE in your Neon console if you haven't re-run schema.sql from scratch.

INSERT INTO consoles (short_code, name, icon_path) VALUES
('ps2',          'PlayStation 2',  '/sprites/psone.png'),
('gameboycolor', 'Game Boy Color', '/sprites/gameboy.png'),
('wiiu',         'Nintendo Wii U', '/sprites/psone.png'),
('pc',           'PC',             '/sprites/psone.png'),
('segacd',       'Sega CD',        '/sprites/megadrive.png')
ON CONFLICT (short_code) DO NOTHING;
