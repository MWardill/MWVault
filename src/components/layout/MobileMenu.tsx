"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FloatingPanel } from "./FloatingPanel";
import { JrpgMenuList } from "@/components/ui/JrpgMenuList";
import { HandPointer } from "@/components/ui/HandPointer";

export interface MenuItemType {
    id: string;
    label: string;
    disabled?: boolean;
    onClick?: () => void;
    isMobileCore?: boolean;
}

export interface MobileMenuProps {
    items: MenuItemType[];
    currentRouteId: string;
}

export function MobileMenu({ items, currentRouteId }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const coreItems = useMemo(() => items.filter((item: MenuItemType) => item.isMobileCore), [items]);
    const dropdownItems = useMemo(() => items.filter((item: MenuItemType) => !item.isMobileCore), [items]);

    return (
        <>
            {/* Mobile Top Navigation */}
            <div className="lg:hidden absolute -top-16 left-0 w-full flex gap-2 z-50">
                <FloatingPanel className="flex-1 w-full" contentClassName="px-4 py-3 border-2">
                    <div className="flex justify-between items-center w-full font-pixel text-sm uppercase">
                        {coreItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    item.onClick?.();
                                    setIsOpen(false);
                                }}
                                disabled={item.disabled}
                                className={`flex-1 text-center py-2 transition-colors relative flex items-center justify-center hover:text-white ${currentRouteId === item.id ? 'text-white' : 'text-gray-400'} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="relative inline-block">
                                    {currentRouteId === item.id && (
                                        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 sm:mr-3 flex items-center pointer-events-none">
                                            <HandPointer className="text-sm sm:text-base leading-none" />
                                        </span>
                                    )}
                                    <span className="relative z-10">{item.label}</span>
                                </span>
                            </button>
                        ))}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`px-4 py-2 transition-colors flex justify-center items-center hover:text-white ${isOpen ? 'text-white' : 'text-gray-400'}`}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </FloatingPanel>
            </div>

            {/* Mobile Expandable Menu */}
            <AnimatePresence>
                {isOpen && (
                    <FloatingPanel
                        className="lg:hidden absolute top-4 left-0 w-full z-40"
                        contentClassName="p-5"
                    >
                        <JrpgMenuList
                            items={dropdownItems.map(item => ({
                                ...item,
                                onClick: () => {
                                    item.onClick?.();
                                    setIsOpen(false);
                                }
                            }))}
                        />
                    </FloatingPanel>
                )}
            </AnimatePresence>
        </>
    );
}
