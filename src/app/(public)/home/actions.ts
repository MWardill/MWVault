import { getConsolesWithGameCountsFromDb } from "@/lib/db/consoles";

export async function getConsolesWithGameCounts() {
    return await getConsolesWithGameCountsFromDb();
}
