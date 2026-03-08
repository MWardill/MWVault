"use client";

import { useState, ReactNode } from "react";
import { MobileMenuContext } from "./context";

export function Root({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </MobileMenuContext.Provider>
    );
}
