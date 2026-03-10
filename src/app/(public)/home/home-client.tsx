"use client";

import { useState, useEffect } from "react";
import SelectorGrid from "@/components/ui/SelectorGrid";
import { useSplash } from "@/contexts/SplashContext";
import { useNavigation } from "@/contexts/NavigationContext";


type ConsoleItem = {
    id: string;
    name: string;
    value: number;
    icon: string;
};

export default function HomeClient({ initialItems }: { initialItems: ConsoleItem[] }) {
    const [, setSelectedId] = useState<string | number | undefined>(initialItems[0]?.id);
    const { navigate } = useNavigation();
    const [isSyncing, setIsSyncing] = useState(false);
    const { setDbLoaded } = useSplash();

    useEffect(() => {
        setDbLoaded(true);
    }, [setDbLoaded]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const { syncIgdbGames } = await import("@/lib/external-api/igdb");
            const result = await syncIgdbGames();
            if (result.success) {
                alert(`Successfully synced ${result.count} games from IGDB!`);
                // Note: since router isn't available, we bypass manual refresh or keep standard location reload
                window.location.reload();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to sync IGDB games.");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col w-full relative">
            <div className="p-4 flex justify-end">
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 transition-colors"
                >
                    {isSyncing ? "Syncing..." : "Sync IGDB Dreamcast Games"}
                </button>
            </div>
            <SelectorGrid
                title="Consoles"
                items={initialItems}
                onSelect={(item) => {
                    setSelectedId(item.id);
                    navigate(`/collection/${item.id}`);
                }}
            />
        </div>
    );
}
