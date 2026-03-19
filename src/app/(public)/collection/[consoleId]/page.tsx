import { notFound } from "next/navigation";
import { getConsoleByShortCode, getCollectionByConsoleId } from "../actions";
import { GameGrid } from "@/components/collection/GameGrid";

export const dynamic = "force-dynamic";

export default async function ConsoleCollectionPage({
    params,
}: {
    params: Promise<{ consoleId: string }>;
}) {
    const { consoleId } = await params;

    // Fetch console metadata
    const consoleData = await getConsoleByShortCode(consoleId);

    if (!consoleData) {
        notFound();
    }

    // Fetch games for this console from the user's collection
    const collection = await getCollectionByConsoleId(consoleData.id);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            {collection.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6 border-t-2 border-slate-100/10">
                    <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center max-w-lg mb-8 uppercase tracking-wider">
                        No games found for this console.
                    </p>
                </div>
            ) : (
                <GameGrid games={collection} />
            )}
        </div>
    );
}
