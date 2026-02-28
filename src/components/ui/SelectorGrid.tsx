"use client";

import Sprite from "@/components/images/Sprite";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";
import { HandPointer } from "@/components/ui/HandPointer";

export interface SelectorItemType {
    id: string | number;
    name: string;
    value?: string | number;
    icon?: string;
}

interface SelectorGridProps {
    title: string;
    items: SelectorItemType[];
    onSelect?: (item: SelectorItemType) => void;
    selectedId?: string | number;
    className?: string;
}

export default function SelectorGrid({ title, items, onSelect, selectedId, className = "" }: SelectorGridProps) {
    const { focusedElementId } = useSpatialNavigation();

    return (
        <div className={`flex flex-col relative w-full ${className}`}>
            <div className="absolute left-3 z-20 px-1 font-pixel text-[10px] leading-none text-white jrpg-text-shadow tracking-widest uppercase">
                {title}
            </div>
            <div className="jrpg-panel pb-2 mt-2 relative ![box-shadow:inset_0_0_0_2px_#7fc0ff,_inset_0_0_18px_rgba(255,255,255,0.15),_0_2px_12px_rgba(0,0,0,1.3)]">
                <div className="overflow-y-auto h-[260px] p-4 relative z-20" style={{ pointerEvents: 'auto' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 relative">
                        {items.map((item) => {
                            // Only highlight when actively focused by keyboard/mouse (hover handles standard mouse interaction)
                            const isFocused = focusedElementId === `grid-${item.id}`;

                            return (
                                <div
                                    key={item.id}
                                    id={`grid-${item.id}`} // Hook uses this ID
                                    onClick={() => onSelect?.(item)}
                                    className="jrpg-selectable flex justify-between items-center group cursor-pointer px-2 py-1 hover:bg-white/5 rounded-sm transition-colors relative z-20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 flex items-center justify-center transition-opacity ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <HandPointer className="drop-shadow-md pb-1 pr-1" />
                                        </div>
                                        {item.icon && (
                                            <div className={`drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] flex-shrink-0 flex items-center justify-center w-[32px] h-[32px] ${isFocused ? 'animate-[scalePulse_1s_ease-in-out_infinite]' : 'group-hover:animate-[scalePulse_1s_ease-in-out_infinite]'}`}>
                                                <Sprite
                                                    src={item.icon}
                                                    alt={item.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-contain w-full h-full max-w-[32px] max-h-[32px]"
                                                />
                                            </div>
                                        )}
                                        <span className={`${isFocused ? "text-white" : "text-gray-300 group-hover:text-white"} drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] leading-none pt-1 text-sm md:text-base`}>
                                            {item.name}
                                        </span>
                                    </div>
                                    {item.value !== undefined && (
                                        <span className={`${isFocused ? "text-white" : "text-gray-300 group-hover:text-white"} drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] leading-none pt-1 text-sm md:text-base`}>
                                            {item.value}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
