"use client";

import { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { FloatingPanel } from "@/components/layout/FloatingPanel";
import { useMobileMenu } from "./context";

export function TopNav({ children }: { children: ReactNode }) {
    const { isOpen, setIsOpen } = useMobileMenu();
    return (
        <div className="lg:hidden absolute -top-16 left-0 w-full flex gap-2 z-50">
            <FloatingPanel className="flex-1 w-full" contentClassName="px-4 py-3 border-2">
                <div className="flex justify-between items-center w-full font-pixel text-sm uppercase">
                    {children}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`px-4 py-2 transition-colors flex justify-center items-center hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${isOpen ? 'text-white' : 'text-gray-400'}`}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </FloatingPanel>
        </div>
    );
}
