"use server";

import { getCollectionByConsoleIdFromDb, removeGameFromCollectionDb } from "@/lib/db/collections";
import { getAllConsolesFromDb, getConsoleByShortCodeFromDb } from "@/lib/db/consoles";
import { getWishlistByConsoleIdFromDb, getWishlistAllFromDb } from "@/lib/db/collections";
import { getAuthenticatedUserId } from "@/lib/db/users";
import { revalidatePath, revalidateTag } from "next/cache";
export async function getConsoleByShortCode(shortCode: string) {
    return await getConsoleByShortCodeFromDb(shortCode);
}

export async function getAllConsoles() {
    return await getAllConsolesFromDb();
}

export async function getCollectionByConsoleId(consoleId: number) {
    return await getCollectionByConsoleIdFromDb(consoleId);
}

export async function getWishlistByConsoleId(consoleId: number) {
    return await getWishlistByConsoleIdFromDb(consoleId);
}

export async function getWishlistAll() {
    return await getWishlistAllFromDb();
}

export async function removeGameFromCollection(gameId: number, consoleShortCode: string) {
    const userId = await getAuthenticatedUserId();
    await removeGameFromCollectionDb(gameId, userId);
    
    revalidatePath(`/collection/${consoleShortCode}`);
    revalidateTag("home-consoles", "default");
    
    return { success: true };
}
