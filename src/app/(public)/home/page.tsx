"use client";

import { useState } from "react";
import SelectorGrid from "@/components/ui/SelectorGrid";
import { consolesData } from "@/data/consoles";
import { useTransitionRouter } from "next-view-transitions";

export default function Home() {
    const [selectedId, setSelectedId] = useState<string | number | undefined>(consolesData[0]?.id);
    const router = useTransitionRouter();

    return (
        <div className="flex-1 flex flex-col w-full relative">
            <SelectorGrid
                title="Consoles"
                items={consolesData}
                selectedId={selectedId}
                onSelect={(item) => {
                    setSelectedId(item.id);
                    router.push(`/collection/${item.id}`);
                }}
            />

            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                {/* <Sprite
                    src="/sprites/mogWalkFront.gif"
                    alt="Mog Walking"
                    width={64}
                    height={64}
                /> */}
            </div>
        </div>
    );
}
