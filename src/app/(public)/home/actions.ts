"use cache";

import { cacheTag } from "next/cache";
import { getConsolesWithGameCountsFromDb } from "@/lib/db/consoles";

export async function getConsolesWithGameCounts() {
    cacheTag("home-consoles");
    return await getConsolesWithGameCountsFromDb();
}
