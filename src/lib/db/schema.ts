import { pgTable, serial, varchar, timestamp, integer, decimal, boolean, date, text, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users Table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }),
    image: varchar('image', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    lastLogin: timestamp('last_login', { withTimezone: true, mode: 'date' }),
});

export const usersRelations = relations(users, ({ many }) => ({
    gamesCollection: many(gamesCollection),
}));

// 2. Consoles Table
export const consoles = pgTable('consoles', {
    id: serial('id').primaryKey(),
    shortCode: varchar('short_code', { length: 50 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    iconPath: varchar('icon_path', { length: 255 }),
});

export const consolesRelations = relations(consoles, ({ many }) => ({
    games: many(games),
}));

// 3. Games Table
export const games = pgTable('games', {
    id: serial('id').primaryKey(),
    consoleId: integer('console_id').notNull().references(() => consoles.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    currentPrice: decimal('current_price', { precision: 10, scale: 2 }),
    imageUrl: varchar('image_url', { length: 512 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
}, (table) => {
    return {
        consoleIdx: index('idx_games_console').on(table.consoleId),
    };
});

export const gamesRelations = relations(games, ({ one, many }) => ({
    console: one(consoles, {
        fields: [games.consoleId],
        references: [consoles.id],
    }),
    collections: many(gamesCollection),
}));

// 4. Games Collection Table
export const gamesCollection = pgTable('games_collection', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),

    hasBox: boolean('has_box').default(false),
    hasManual: boolean('has_manual').default(false),
    isSealed: boolean('is_sealed').default(false),
    conditionRating: integer('condition_rating'),
    purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }),
    purchaseDate: date('purchase_date', { mode: 'string' }),
    notes: text('notes'),

    addedAt: timestamp('added_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
}, (table) => {
    return {
        userGameIdx: index('idx_games_collection_user_game').on(table.userId, table.gameId),
    };
});

export const gamesCollectionRelations = relations(gamesCollection, ({ one }) => ({
    user: one(users, {
        fields: [gamesCollection.userId],
        references: [users.id],
    }),
    game: one(games, {
        fields: [gamesCollection.gameId],
        references: [games.id],
    }),
}));
