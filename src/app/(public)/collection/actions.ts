import { getCollectionByConsoleIdFromDb } from "@/lib/db/collections";
import { getAllConsolesFromDb, getConsoleByShortCodeFromDb } from "@/lib/db/consoles";

export async function getConsoleByShortCode(shortCode: string) {
    return await getConsoleByShortCodeFromDb(shortCode);
}

export async function getAllConsoles() {
    return await getAllConsolesFromDb();
}

export async function getCollectionByConsoleId(consoleId: number) {
    return await getCollectionByConsoleIdFromDb(consoleId);
}
