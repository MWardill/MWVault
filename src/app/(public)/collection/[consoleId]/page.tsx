import { notFound } from "next/navigation";
import Sprite from "@/components/images/Sprite";
import { getConsoleByShortCode, getCollectionByConsoleId } from "../actions";

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
        <div className="flex-1 flex flex-col w-full relative h-[calc(100vh-140px)]">
            <div className="flex items-center gap-4 mb-4 flex-none">
                {consoleData.iconPath && (
                    <div className="w-12 h-12 flex items-center justify-center rounded-md p-2">
                        <Sprite
                            src={consoleData.iconPath}
                            alt={consoleData.name}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full pt-2 scale-150"
                        />
                    </div>
                )}
                <h1 className="text-xl md:text-2xl font-pixel text-white jrpg-text-shadow drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] tracking-wide pt-2">
                    {consoleData.name} Library
                </h1>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
                {collection.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-6 border-t-2 border-slate-100/10">
                        <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center max-w-lg mb-8 uppercase tracking-wider">
                            No games found for this console.
                        </p>
                    </div>
                ) : (
                    <div className="w-full">
                        <table className="w-full text-left font-pixel text-xs text-white">
                            <thead className="bg-[#2A2D3E] sticky top-0 z-10 border-b-2 border-white/20">
                                <tr>
                                    <th className="p-3 md:p-4 text-slate-300jrpg-text-shadow">Title</th>
                                    <th className="p-3 md:p-4 text-center text-slate-300 jrpg-text-shadow">Box</th>
                                    <th className="p-3 md:p-4 text-center text-slate-300 jrpg-text-shadow">Manual</th>
                                    <th className="p-3 md:p-4 text-center text-slate-300 jrpg-text-shadow hidden sm:table-cell">Cond.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collection.map((game) => (
                                    <tr key={game.id} className="border-b border-white/10 hover:bg-white/5 transition-colors group">
                                        <td className="p-3 md:p-4">
                                            <div className="flex items-center gap-4">
                                                {game.imageUrl && (
                                                    <div className="w-10 h-10 hidden sm:block flex-shrink-0 bg-[#1A1C29] p-1 border border-white/10 rounded">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover rounded-sm opacity-90 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                )}
                                                <span className="text-sm md:text-base text-slate-100 drop-shadow-md">{game.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 md:p-4 text-center">
                                            <span className={`inline-block w-3 h-3 rounded-full ${game.hasBox ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500/50'}`}></span>
                                        </td>
                                        <td className="p-3 md:p-4 text-center">
                                            <span className={`inline-block w-3 h-3 rounded-full ${game.hasManual ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500/50'}`}></span>
                                        </td>
                                        <td className="p-3 md:p-4 text-center hidden sm:table-cell text-amber-300/90 drop-shadow-sm font-bold">
                                            {game.conditionRating ? `${game.conditionRating}` : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
