"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";
import { HandPointer } from "@/components/ui/HandPointer";

interface MenuListProps {
    items: {
        id: string;
        label: string;
        disabled?: boolean;
        onClick?: () => void;
    }[];
    selectedIndex: number;
    onHover: (index: number) => void;
}

export function JrpgMenuList({ items, selectedIndex, onHover }: MenuListProps) {
    const { focusedElementId } = useSpatialNavigation();

    return (
        <ul className="flex flex-col w-full text-sm md:text-base leading-relaxed tracking-wider">
            {items.map((item, i) => {
                // Determine if this is active via traditional means OR via the new spatial navigation
                const isFocused = focusedElementId === `menu-${item.id}`;
                const isSelected = isFocused || (i === selectedIndex && !focusedElementId);

                return (
                    <li
                        key={item.id}
                        id={`menu-${item.id}`} // Assign an ID so the hook can find it
                        data-disabled={item.disabled} // Expose disabled state to the DOM hook
                        className={clsx(
                            "relative group flex items-center cursor-pointer transition-colors jrpg-selectable",
                            item.disabled ? "opacity-50" : "hover:text-[#ffffff]",
                            isFocused && "text-white"
                        )}
                        onMouseEnter={() => !item.disabled && onHover(i)}
                        onClick={() => !item.disabled && item.onClick?.()}
                    >
                        {/* The Floating Hand Cursor */}
                        <div className={clsx(
                            "w-10 flex-shrink-0 flex justify-center translate-y-[-2px] transition-opacity",
                            (isSelected && !item.disabled) ? "opacity-100" : "opacity-0"
                        )}>
                            <HandPointer />
                        </div>

                        <span className="jrpg-text-shadow uppercase">
                            {item.label}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}
