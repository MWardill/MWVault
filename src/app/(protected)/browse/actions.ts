"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getBrowseGamesByConsoleIdFromDb, addGameToCollectionDb, addGameToWishlistDb } from "@/lib/db/browse";
import { getAllConsolesFromDb, getConsoleByShortCodeFromDb } from "@/lib/db/consoles";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function getUserId() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("User not authenticated");
    }
    const dbUsers = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (dbUsers.length === 0) {
        throw new Error("User not found in database");
    }
    return dbUsers[0].id;
}

export async function getAllConsoles() {
    return await getAllConsolesFromDb();
}

export async function getConsoleByShortCode(shortCode: string) {
    return await getConsoleByShortCodeFromDb(shortCode);
}

export async function getBrowseGamesByConsoleId(consoleId: number, page: number = 1) {
    const userId = await getUserId();
    return await getBrowseGamesByConsoleIdFromDb(consoleId, userId, page);
}

export async function addGameToCollection(gameId: number, consoleShortCode: string) {
    const userId = await getUserId();
    await addGameToCollectionDb(gameId, userId);
    revalidatePath(`/browse/${consoleShortCode}`);
    revalidatePath(`/collection/${consoleShortCode}`);
    return { success: true };
}

export async function addGameToWishlist(gameId: number, consoleShortCode: string) {
    const userId = await getUserId();
    await addGameToWishlistDb(gameId, userId);
    revalidatePath(`/browse/${consoleShortCode}`);
    revalidatePath(`/wishlist/${consoleShortCode}`);
    return { success: true };
}
