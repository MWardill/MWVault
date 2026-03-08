"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import Sprite from "@/components/images/Sprite";
import { HandPointer } from "@/components/ui/HandPointer";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

interface ConsoleDataType {
    id: number;
    shortCode: string;
    name: string;
    iconPath: string | null;
}

interface ConsoleDropdownProps {
    consoles: ConsoleDataType[];
}

export default function ConsoleDropdown({ consoles }: ConsoleDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { focusedElementId } = useSpatialNavigation();

    // Determine currently selected console safely handling async params if needed, 
    // though useParams is typically synchronous in client components for the current route
    const currentConsoleId = typeof params?.consoleId === 'string' ? params.consoleId : null;
    const selectedConsole = consoles.find(c => c.shortCode === currentConsoleId);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll to selected item when opened
    useEffect(() => {
        if (isOpen && selectedConsole) {
            setTimeout(() => {
                const element = document.getElementById(`dropdown-${selectedConsole.id}`);
                if (element) {
                    element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }, 50); // slight delay to allow mounting/animation
        }
    }, [isOpen, selectedConsole]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const selectConsole = (shortCode: string) => {
        setIsOpen(false);
        router.push(`/collection/${shortCode}`);
    };

    return (
        <div className="relative w-full z-30 mb-4" ref={dropdownRef}>
            {/* The main panel acting as the toggle button */}
            <div
                id="console-dropdown-toggle"
                className={clsx(
                    "jrpg-panel jrpg-selectable relative cursor-pointer group transition-all duration-200",
                    isOpen ? "rounded-b-none border-b-0 pb-1" : "pb-1"
                )}
                onClick={toggleDropdown}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDropdown();
                    }
                }}
            >
                <div className="px-3 py-2 md:px-4 md:py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className={clsx(
                            "w-5 h-5 md:w-6 md:h-6 flex-shrink-0 flex items-center justify-center transition-opacity",
                            focusedElementId === "console-dropdown-toggle" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                            <HandPointer className="drop-shadow-md pb-1 pr-1" />
                        </div>
                        {selectedConsole?.iconPath ? (
                            <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center">
                                <Sprite
                                    src={selectedConsole.iconPath}
                                    alt={selectedConsole.name}
                                    width={40}
                                    height={40}
                                    className="object-contain w-full h-full scale-125"
                                />
                            </div>
                        ) : (
                            <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"></div>
                        )}
                        <h2 className="text-sm md:text-lg font-pixel text-white jrpg-text-shadow drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] truncate">
                            {selectedConsole ? selectedConsole.name : "Choose a console..."}
                        </h2>
                    </div>

                    {/* Down Chevron */}
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
            </div>

            {/* Expandable Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute top-full left-0 w-full overflow-hidden jrpg-panel rounded-t-none border-t-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                    >
                        <div className="max-h-[300px] overflow-y-auto p-2 md:p-4 styled-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {consoles.map((c) => {
                                    const isFocused = focusedElementId === `dropdown-${c.id}`;
                                    const isSelected = c.shortCode === currentConsoleId;

                                    return (
                                        <div
                                            key={c.id}
                                            id={`dropdown-${c.id}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                selectConsole(c.shortCode);
                                            }}
                                            className={clsx(
                                                "jrpg-selectable flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors relative group",
                                                isSelected ? "bg-white/10" : "hover:bg-white/5"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-6 h-6 flex items-center justify-center transition-opacity",
                                                isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                            )}>
                                                <HandPointer className="drop-shadow-md pb-1 pr-1" />
                                            </div>

                                            {c.iconPath && (
                                                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                                                    <Sprite
                                                        src={c.iconPath}
                                                        alt={c.name}
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
                                                {c.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
