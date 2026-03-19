"use client";

import { createContext, useContext } from "react";

export interface ConsoleDropdownContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
    currentConsoleId: string | null;
    selectConsole: (shortCode: string) => void;
    selectedItemRef: (node: HTMLButtonElement | null) => void;
}

export const ConsoleDropdownContext = createContext<ConsoleDropdownContextType | null>(null);

export function useConsoleDropdown() {
    const context = useContext(ConsoleDropdownContext);
    if (!context) {
        throw new Error("useConsoleDropdown must be used within a <ConsoleDropdown.Root>");
    }
    return context;
}
