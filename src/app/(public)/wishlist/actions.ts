import { getAllConsolesFromDb, getConsoleByShortCodeFromDb } from "@/lib/db/consoles";
import { getWishlistByConsoleIdFromDb, getWishlistAllFromDb } from "@/lib/db/collections";

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
