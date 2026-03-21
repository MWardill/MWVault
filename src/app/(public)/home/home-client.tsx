"use client";

import { useEffect } from "react";
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
    const { navigate } = useNavigation();
    const { setDbLoaded } = useSplash();

    useEffect(() => {
        setDbLoaded(true);
    }, [setDbLoaded]);

    return (
        <div className="flex-1 flex flex-col w-full relative">
            <SelectorGrid
                title="Consoles"
                items={initialItems}
                onSelect={(item) => {
                    navigate(`/collection/${item.id}`);
                }}
            />
        </div>
    );
}
