import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { getConsoleByShortCode, getBrowseGamesByConsoleId } from "../actions";
import { BrowseGameGrid } from "@/components/browse/BrowseGameGrid";
import { BrowseSearchForm } from "@/components/browse/BrowseSearchForm";

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
            {/* Pagination & Search Controls at top */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 mb-4 border-b-2 border-slate-100/10 bg-[#1A1C29] shrink-0">
                {/* Search Form */}
                <BrowseSearchForm consoleId={consoleId} initialQuery={q} />

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4">
                    <Link 
                        href={`/browse/${consoleId}?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                        className={`px-3 py-1.5 border-2 font-pixel text-xs uppercase tracking-wider transition-colors 
                            ${page <= 1 ? 'border-slate-600 text-slate-500 pointer-events-none' : 'border-sky-400 text-sky-400 hover:bg-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.3)]'}`}
                    >
                        Prev
                    </Link>
                    <span className="font-pixel text-white text-xs tracking-widest shrink-0">
                        Pg {page} of {Math.max(1, totalPages)}
                    </span>
                    <Link 
                        href={`/browse/${consoleId}?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                        className={`px-3 py-1.5 border-2 font-pixel text-xs uppercase tracking-wider transition-colors 
                            ${page >= totalPages || totalPages === 0 ? 'border-slate-600 text-slate-500 pointer-events-none' : 'border-sky-400 text-sky-400 hover:bg-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.3)]'}`}
                    >
                        Next
                    </Link>
                </div>
            </div>

            {games.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                    <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center max-w-lg mb-8 uppercase tracking-wider">
                        {q ? `No games found matching "${q}" for this console.` : "No games found in the global database for this console."}
                    </p>
                </div>
            ) : (
                <BrowseGameGrid games={games} consoleShortCode={consoleId} />
            )}
        </div>
    );
}
