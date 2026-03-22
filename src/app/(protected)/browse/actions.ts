"use server";

import { getBrowseGamesByConsoleIdFromDb, addGameToCollectionDb, addGameToWishlistDb } from "@/lib/db/browse";
import { getAllConsolesFromDb, getConsoleByShortCodeFromDb } from "@/lib/db/consoles";
import { getAuthenticatedUserId } from "@/lib/db/users";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getAllConsoles() {
    return await getAllConsolesFromDb();
}

export async function getConsoleByShortCode(shortCode: string) {
    return await getConsoleByShortCodeFromDb(shortCode);
}

export async function getBrowseGamesByConsoleId(consoleId: number, page: number = 1, searchQuery?: string) {
    const userId = await getAuthenticatedUserId();
    return await getBrowseGamesByConsoleIdFromDb(consoleId, userId, page, 48, searchQuery);
}

export async function addGameToCollection(gameId: number, consoleShortCode: string) {
    const userId = await getAuthenticatedUserId();
    await addGameToCollectionDb(gameId, userId);
    revalidatePath(`/browse/${consoleShortCode}`);
    revalidatePath(`/collection/${consoleShortCode}`);
    revalidateTag("home-consoles", "default");
    return { success: true };
}

export async function addGameToWishlist(gameId: number, consoleShortCode: string) {
    const userId = await getAuthenticatedUserId();
    await addGameToWishlistDb(gameId, userId);
    revalidatePath(`/browse/${consoleShortCode}`);
    revalidatePath(`/wishlist/${consoleShortCode}`);
    return { success: true };
}
