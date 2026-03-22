"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { addGameToCollectionDb, removeGameFromWishlistDb } from "@/lib/db/browse";
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

export async function addGameToCollectionFromWishlist(gameId: number, consoleShortCode?: string) {
    const userId = await getUserId();
    await addGameToCollectionDb(gameId, userId);
    
    revalidatePath("/wishlist/all");
    if (consoleShortCode) {
        revalidatePath(`/wishlist/${consoleShortCode}`);
        revalidatePath(`/collection/${consoleShortCode}`);
    }
    return { success: true };
}

export async function removeGameFromWishlist(gameId: number, consoleShortCode?: string) {
    const userId = await getUserId();
    await removeGameFromWishlistDb(gameId, userId);
    
    revalidatePath("/wishlist/all");
    if (consoleShortCode) {
        revalidatePath(`/wishlist/${consoleShortCode}`);
    }
    return { success: true };
}
