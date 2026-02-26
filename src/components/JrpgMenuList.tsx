"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

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
    return (
        <ul className="flex flex-col w-full text-sm md:text-base leading-relaxed tracking-wider">
            {items.map((item, i) => {
                const isSelected = i === selectedIndex;

                return (
                    <li
                        key={item.id}
                        className={clsx(
                            "relative group flex items-center py-3 px-2 cursor-pointer transition-colors",
                            item.disabled ? "opacity-50" : "hover:text-[#ffffff]"
                        )}
                        onMouseEnter={() => !item.disabled && onHover(i)}
                        onClick={() => !item.disabled && item.onClick?.()}
                    >
                        {/* The Floating Hand Cursor */}
                        <div className="w-10 flex-shrink-0 flex justify-center translate-y-[-2px]">
                            {isSelected && (
                                <span className="jrpg-hand-cursor">👉🏻</span>
                            )}
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
