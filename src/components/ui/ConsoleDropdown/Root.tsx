"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { useParams } from "next/navigation";
import { useNavigation } from "@/contexts/NavigationContext";
import { setFocusedElementId } from "@/hooks/useSpatialNavigation";
import { ConsoleDropdownContext } from "./context";

interface RootProps {
    children: ReactNode;
    onSelect?: (shortCode: string) => void;
    /** Base path used for navigation. Defaults to "/collection". */
    basePath?: string;
}

export function Root({ children, onSelect, basePath = "/collection" }: RootProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { navigate } = useNavigation();
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

    // When dropdown opens, move spatial focus to first item
    useEffect(() => {
        if (!isOpen) return;
        requestAnimationFrame(() => {
            const first = dropdownRef.current?.querySelector<HTMLElement>('[id^="dropdown-"]');
            if (first) {
                setFocusedElementId(first.id);
                first.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }, [isOpen]);

    // Escape closes dropdown and returns focus to trigger
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
                setFocusedElementId('console-dropdown-toggle');
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const selectConsole = (shortCode: string) => {
        setIsOpen(false);
        setFocusedElementId('console-dropdown-toggle');
        if (onSelect) {
            onSelect(shortCode);
        }
        // Wait for the Framer Motion AnimatePresence exit animation (0.2s) in Content.tsx to finish
        // before executing the route transition, so it doesn't clip visually.
        setTimeout(() => {
            navigate(`${basePath}/${shortCode}`);
        }, 200);
    };

    return (
        <ConsoleDropdownContext.Provider value={{ isOpen, setIsOpen, currentConsoleId, basePath, selectConsole, selectedItemRef }}>
            <div className="relative w-full z-30 mb-4" ref={dropdownRef} data-nav-root={isOpen ? "console-dropdown" : undefined}>
                {children}
            </div>
        </ConsoleDropdownContext.Provider>
    );
}
