"use server";

import { getAllConsolesFromDb, getConsoleByShortCodeFromDb } from "@/lib/db/consoles";
import { getWishlistByConsoleIdFromDb, getWishlistAllFromDb } from "@/lib/db/collections";
import { addGameToCollectionDb, removeGameFromWishlistDb } from "@/lib/db/browse";
import { getAuthenticatedUserId } from "@/lib/db/users";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getConsoleByShortCode(shortCode: string) {
    return await getConsoleByShortCodeFromDb(shortCode);
}

export async function getAllConsoles() {
    return await getAllConsolesFromDb();
}

export async function getWishlistByConsoleId(consoleId: number) {
    return await getWishlistByConsoleIdFromDb(consoleId);
}

export async function getWishlistAll() {
    return await getWishlistAllFromDb();
}

export async function addGameToCollectionFromWishlist(gameId: number, consoleShortCode?: string) {
    const userId = await getAuthenticatedUserId();
    await addGameToCollectionDb(gameId, userId);
    
    revalidatePath("/wishlist/all");
    if (consoleShortCode) {
        revalidatePath(`/wishlist/${consoleShortCode}`);
        revalidatePath(`/collection/${consoleShortCode}`);
    }
    revalidateTag("home-consoles", "default");
    return { success: true };
}

export async function removeGameFromWishlist(gameId: number, consoleShortCode?: string) {
    const userId = await getAuthenticatedUserId();
    await removeGameFromWishlistDb(gameId, userId);
    
    revalidatePath("/wishlist/all");
    if (consoleShortCode) {
        revalidatePath(`/wishlist/${consoleShortCode}`);
    }
    return { success: true };
}
