import { consolesData } from "@/data/consoles";
import { notFound } from "next/navigation";
import Sprite from "@/components/images/Sprite";

export default async function ConsoleCollectionPage({
    params,
}: {
    params: Promise<{ consoleId: string }>;
}) {
    const { consoleId } = await params;
    const consoleData = consolesData.find((c) => c.id === consoleId);

    if (!consoleData) {
        notFound();
    }

    return (
        <div className="flex-1 flex flex-col w-full relative">
            <div className="flex items-center gap-4 mb-6">
                {consoleData.icon && (
                    <div className="w-12 h-12 flex items-center justify-center rounded-md p-2">
                        <Sprite
                            src={consoleData.icon}
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

            <div className="flex-1 flex flex-col p-6 items-center justify-center border-t-2 border-slate-100/10">
                <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center max-w-lg mb-8 uppercase tracking-wider">
                    Connecting to Database...
                </p>
                <div className="text-xs font-pixel text-gray-500 max-w-md text-center">
                    (Phase 2 feature: Games currently not hooked up to PostgreSQL Neon DB.)
                </div>
            </div>
        </div>
    );
}
