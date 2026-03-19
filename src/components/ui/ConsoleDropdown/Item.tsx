"use client";

import { clsx } from "clsx";
import Sprite from "@/components/images/Sprite";
import { HandPointer } from "@/components/ui/HandPointer";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";
import { useConsoleDropdown } from "./context";

export function Item({ id, shortCode, name, iconPath }: { id: number, shortCode: string, name: string, iconPath?: string | null }) {
    const { currentConsoleId, selectConsole, selectedItemRef } = useConsoleDropdown();
    const { focusedElementId } = useSpatialNavigation();

    const isFocused = focusedElementId === `dropdown-${id}`;
    const isSelected = shortCode === currentConsoleId;

    return (
        <button
            type="button"
            ref={isSelected ? selectedItemRef : null}
            id={`dropdown-${id}`}
            onClick={(e) => {
                e.stopPropagation();
                selectConsole(shortCode);
            }}
            className={clsx(
                "w-full text-left jrpg-selectable flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors relative group focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                isSelected ? "bg-white/10" : "hover:bg-white/5"
            )}
        >
            <div className={clsx(
                "w-6 h-6 flex items-center justify-center transition-opacity",
                isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                <HandPointer className="drop-shadow-md pb-1 pr-1" />
            </div>

            {iconPath && (
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <Sprite
                        src={iconPath}
                        alt={name}
                        width={32}
                        height={32}
                        className={clsx(
                            "object-contain w-full h-full",
                            isFocused || isSelected ? "animate-[scalePulse_1s_ease-in-out_infinite]" : "group-hover:animate-[scalePulse_1s_ease-in-out_infinite]"
                        )}
                    />
                </div>
            )}

            <span className={clsx(
                "font-pixel text-xs md:text-sm drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] truncate",
                isSelected ? "text-amber-300" : isFocused ? "text-white" : "text-gray-300 group-hover:text-white"
            )}>
                {name}
            </span>
        </button>
    );
}
