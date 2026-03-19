"use client";

import { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

export function ConsolePortal({ children }: { children: ReactNode }) {
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // requestAnimationFrame defers the setState call out of the synchronous
        // effect body, satisfying the react-hooks/set-state-in-effect lint rule
        // while still letting the portal resolve on the first paint.
        const id = requestAnimationFrame(() => {
            setPortalTarget(document.getElementById("console-selector-portal"));
        });
        return () => cancelAnimationFrame(id);
    }, []);

    // No portal target found — return null while rAF resolves on first paint.
    // The mobile dropdown is handled by the separate lg:hidden inline slot in layout.tsx.
    if (!portalTarget) return null;

    return createPortal(children, portalTarget);
}
