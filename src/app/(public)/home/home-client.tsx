"use client";

import { useState } from "react";
import SelectorGrid from "@/components/ui/SelectorGrid";
import { useTransitionRouter } from "next-view-transitions";

type ConsoleItem = {
    id: string;
    name: string;
    value: number;
    icon: string;
};

export default function HomeClient({ initialItems }: { initialItems: ConsoleItem[] }) {
    const [_, setSelectedId] = useState<string | number | undefined>(initialItems[0]?.id);
    const router = useTransitionRouter();

    return (
        <div className="flex-1 flex flex-col w-full relative">
            <SelectorGrid
                title="Consoles"
                items={initialItems}
                onSelect={(item) => {
                    setSelectedId(item.id);
                    router.push(`/collection/${item.id}`);
                }}
            />
        </div>
    );
}
