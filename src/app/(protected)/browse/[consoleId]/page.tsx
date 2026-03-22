import { notFound } from "next/navigation";
import { getConsoleByShortCode, getBrowseGamesByConsoleId } from "../actions";
import { BrowseGridClient } from "./BrowseGridClient";

export const dynamic = "force-dynamic";

export default async function BrowseConsolePage({
    params,
    searchParams,
}: {
    params: Promise<{ consoleId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { consoleId } = await params;
    const search = await searchParams;
    const page = typeof search.page === 'string' ? parseInt(search.page, 10) : 1;
    
    // Safely extract string value even if the array form ?q=1&q=2 is supplied
    const rawQ = search.q;
    const q = Array.isArray(rawQ) ? rawQ[0] : (typeof rawQ === 'string' ? rawQ : undefined);

    const consoleData = await getConsoleByShortCode(consoleId);

    if (!consoleData) {
        notFound();
    }

    const { games, totalPages } = await getBrowseGamesByConsoleId(consoleData.id, page, q);

    return (
        <div key={`browse-page-${page}-${q || ''}`} className="flex-1 flex flex-col overflow-y-auto">
            <BrowseGridClient 
                games={games} 
                consoleId={consoleId} 
                q={q} 
                page={page} 
                totalPages={totalPages} 
            />
        </div>
    );
}
