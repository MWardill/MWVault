import { notFound } from "next/navigation";
import Link from "next/link";
import { getConsoleByShortCode, getBrowseGamesByConsoleId } from "../actions";
import { BrowseGameGrid } from "@/components/browse/BrowseGameGrid";

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

    const consoleData = await getConsoleByShortCode(consoleId);

    if (!consoleData) {
        notFound();
    }

    const { games, totalPages } = await getBrowseGamesByConsoleId(consoleData.id, page);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <h1 className="text-xl md:text-2xl font-pixel text-white jrpg-text-shadow tracking-widest pl-2 pt-2 mb-6">
                Database Browse - {consoleData.name}
            </h1>
            
            {games.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6 border-t-2 border-slate-100/10">
                    <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center max-w-lg mb-8 uppercase tracking-wider">
                        No games found in the global database for this console.
                    </p>
                </div>
            ) : (
                <>
                    <BrowseGameGrid games={games} consoleShortCode={consoleId} />
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 py-8 mt-auto border-t-2 border-slate-100/10 bg-[#1A1C29]">
                            <Link 
                                href={`/browse/${consoleId}?page=${Math.max(1, page - 1)}`}
                                className={`px-4 py-2 border-2 font-pixel text-xs md:text-sm uppercase tracking-wider transition-colors 
                                    ${page <= 1 ? 'border-slate-600 text-slate-500 pointer-events-none' : 'border-sky-400 text-sky-400 hover:bg-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.3)]'}`}
                            >
                                Previous
                            </Link>
                            <span className="font-pixel text-white text-xs md:text-sm tracking-widest px-4">
                                Page {page} of {totalPages}
                            </span>
                            <Link 
                                href={`/browse/${consoleId}?page=${Math.min(totalPages, page + 1)}`}
                                className={`px-4 py-2 border-2 font-pixel text-xs md:text-sm uppercase tracking-wider transition-colors 
                                    ${page >= totalPages ? 'border-slate-600 text-slate-500 pointer-events-none' : 'border-sky-400 text-sky-400 hover:bg-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.3)]'}`}
                            >
                                Next
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
