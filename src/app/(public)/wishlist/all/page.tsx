import { getWishlistAll } from "../actions";
import { WishlistGrid } from "@/components/collection/WishlistGrid";

export const dynamic = "force-dynamic";

export default async function WishlistAllPage() {
    const wishlist = await getWishlistAll();

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-3 pb-2 border-b-2 border-slate-100/10 flex-none">
                <p className="font-pixel text-[9px] text-slate-400 tracking-widest uppercase">
                    All Consoles · {wishlist.length} items
                </p>
            </div>
            {wishlist.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                    <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center max-w-lg uppercase tracking-wider">
                        Your wishlist is empty.
                    </p>
                </div>
            ) : (
                <WishlistGrid games={wishlist} />
            )}
        </div>
    );
}
