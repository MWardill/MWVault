"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

export function ConsolePortal({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const portalElement = document.getElementById("console-selector-portal");

    // Fallback if the portal target doesn't exist for some reason
    if (!portalElement) return <>{children}</>;

    return createPortal(children, portalElement);
}
