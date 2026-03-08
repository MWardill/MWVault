"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import { ConsoleDropdownContext } from "./context";

export function Root({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentConsoleId = typeof params?.consoleId === 'string' ? params.consoleId : null;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedItemRef = useCallback((node: HTMLButtonElement | null) => {
        if (isOpen && node) {
            requestAnimationFrame(() => {
                node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            });
        }
    }, [isOpen]);

    const selectConsole = (shortCode: string) => {
        setIsOpen(false);
        router.push(`/collection/${shortCode}`);
    };

    return (
        <ConsoleDropdownContext.Provider value={{ isOpen, setIsOpen, currentConsoleId, selectConsole, selectedItemRef }}>
            <div className="relative w-full z-30 mb-4" ref={dropdownRef}>
                {children}
            </div>
        </ConsoleDropdownContext.Provider>
    );
}
