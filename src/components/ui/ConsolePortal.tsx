"use client";

import { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

export function ConsolePortal({ children }: { children: ReactNode }) {
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Use queueMicrotask so the setState call happens in a callback rather
        // than synchronously inside the effect body — satisfying the react-hooks/refs rule.
        const id = requestAnimationFrame(() => {
            setPortalTarget(document.getElementById("console-selector-portal"));
        });
        return () => cancelAnimationFrame(id);
    }, []);

    if (!portalTarget) return null;

    return createPortal(children, portalTarget);
}
