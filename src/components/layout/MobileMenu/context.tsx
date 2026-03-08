"use client";

import { createContext, useContext } from "react";

interface MobileMenuContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
}

export const MobileMenuContext = createContext<MobileMenuContextType | null>(null);

export function useMobileMenu() {
    const context = useContext(MobileMenuContext);
    if (!context) throw new Error("useMobileMenu must be within MobileMenu.Root");
    return context;
}
