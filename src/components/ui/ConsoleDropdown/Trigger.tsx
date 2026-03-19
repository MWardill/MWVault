"use client";

import { clsx } from "clsx";
import Sprite from "@/components/images/Sprite";
import { HandPointer } from "@/components/ui/HandPointer";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";
import { useConsoleDropdown } from "./context";

export function Trigger({ selectedName, selectedIconPath }: { selectedName?: string, selectedIconPath?: string | null }) {
    const { isOpen, setIsOpen } = useConsoleDropdown();
    const { focusedElementId } = useSpatialNavigation();

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    return (
        <button
            type="button"
            id="console-dropdown-toggle"
            className={clsx(
                "w-full text-left jrpg-panel jrpg-selectable relative cursor-pointer group transition-[border-radius,border-width,padding] duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                isOpen ? "rounded-b-none border-b-0 pb-1" : "pb-1"
            )}
            onClick={toggleDropdown}
        >
            <div className="px-3 py-2 md:px-4 md:py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className={clsx(
                        "w-5 h-5 md:w-6 md:h-6 flex-shrink-0 flex items-center justify-center transition-opacity",
                        focusedElementId === "console-dropdown-toggle" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                        <HandPointer className="drop-shadow-md pb-1 pr-1" />
                    </div>
                    {selectedIconPath ? (
                        <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center">
                            <Sprite
                                src={selectedIconPath}
                                alt={selectedName || ""}
                                width={40}
                                height={40}
                                className="object-contain w-full h-full scale-125"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"></div>
                    )}
                    <h2 className="text-sm md:text-lg font-pixel text-white jrpg-text-shadow drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] truncate">
                        {selectedName || "Choose a console..."}
                    </h2>
                </div>

                <div className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center mr-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                        className={clsx(
                            "w-full h-full text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] transition-transform duration-300",
                            isOpen ? "rotate-180" : "rotate-0"
                        )}
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </div>
        </button>
    );
}
