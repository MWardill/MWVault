"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FloatingPanel } from "./FloatingPanel";
import { JrpgMenuList } from "@/components/JrpgMenuList";

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

    const coreItems = items.filter(item => item.isMobileCore);
    const dropdownItems = items.filter(item => !item.isMobileCore);

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
                                className={`flex-1 text-center py-2 transition-colors relative flex justify-center hover:text-white ${currentRouteId === item.id ? 'text-white' : 'text-gray-400'} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {currentRouteId === item.id && <span className="jrpg-hand-cursor translate-y-[-2px] absolute left-2 sm:left-6">👉🏻</span>}
                                {item.label}
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
                            selectedIndex={-1}
                            onHover={() => { }}
                        />
                    </FloatingPanel>
                )}
            </AnimatePresence>
        </>
    );
}
