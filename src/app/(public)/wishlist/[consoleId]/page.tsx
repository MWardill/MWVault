import { notFound } from "next/navigation";
import { getConsoleByShortCode, getWishlistByConsoleId } from "../actions";
import { WishlistGrid } from "@/components/collection/WishlistGrid";

export const dynamic = "force-dynamic";

export default async function ConsoleWishlistPage({
    params,
}: {
    params: Promise<{ consoleId: string }>;
}) {
    const { consoleId } = await params;

    const consoleData = await getConsoleByShortCode(consoleId);
    if (!consoleData) {
        notFound();
    }

    const wishlist = await getWishlistByConsoleId(consoleData.id);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            {wishlist.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6 border-t-2 border-slate-100/10">
                    <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center max-w-lg mb-8 uppercase tracking-wider">
                        No wishlist items for {consoleData.name}.
                    </p>
                </div>
            ) : (
                <WishlistGrid games={wishlist} />
            )}
        </div>
    );
}
