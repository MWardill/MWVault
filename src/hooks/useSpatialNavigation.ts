"use client";

import { useEffect, useSyncExternalStore } from "react";

// The CSS class we attach to anything we want to be selectable
export const SELECTABLE_CLASS = "jrpg-selectable";

interface Coordinate {
    x: number;
    y: number;
    element: HTMLElement;
}

let globalFocusedId: string | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return globalFocusedId;
}

export function setFocusedElementId(id: string | null) {
    if (globalFocusedId !== id) {
        globalFocusedId = id;
        listeners.forEach(l => l());
    }
}

let isInitialized = false;

function initGlobalListeners() {
    if (typeof window === 'undefined' || isInitialized) return;
    isInitialized = true;

    const handleKeyDown = (e: KeyboardEvent) => {
        // Only react to arrow keys and Enter
        if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) return;

        // Respect native defaultPrevented 
        if (e.defaultPrevented) return;

        // Let standard input fields work normally
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        const selectables = Array.from(document.querySelectorAll(`.${SELECTABLE_CLASS}`)) as HTMLElement[];
        if (selectables.length === 0) return;

        let currentFocusedId = getSnapshot();
        const currentEl = currentFocusedId ? document.getElementById(currentFocusedId) : null;

        // If element vanished (e.g. route change or unmount), clear focus state
        if (currentFocusedId && !currentEl) {
            setFocusedElementId(null);
            currentFocusedId = null;
        }

        // If no element is spatially focused yet
        if (!currentFocusedId || !currentEl) {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
                e.preventDefault();
                setFocusedElementId(selectables[0].id);
                selectables[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                // Note: if it was Enter, we just focus on the first item visually but don't instantly click it. 
                // That prevents accidental clicks when first selecting the UI.
            }
            return;
        }

        // We have an active focused element, spatial navigation handles the keydown exclusively
        e.preventDefault();

        if (e.key === "Enter") {
            currentEl.click();
            return;
        }

        const currentRect = currentEl.getBoundingClientRect();
        const currentCenter: Coordinate = {
            x: currentRect.left + currentRect.width / 2,
            y: currentRect.top + currentRect.height / 2,
            element: currentEl
        };

        let bestMatch: HTMLElement | null = null;
        let shortestDistance = Infinity;

        selectables.forEach((el) => {
            if (el === currentEl) return;

            // Skip disabled elements
            if (el.dataset.disabled === "true") return;

            const rect = el.getBoundingClientRect();
            const center: Coordinate = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                element: el
            };

            const dx = center.x - currentCenter.x;
            const dy = center.y - currentCenter.y;

            let isConfiguredDirection = false;
            let distance = Infinity;

            // We heavily penalize movement on the non-intended axis to prevent jumping out of rows/columns
            // to nearby but misaligned elements (like wide header bars).
            const orthoPenalty = 10;

            if (e.key === "ArrowLeft") {
                if (dx < 0 && Math.abs(dy) <= Math.abs(dx)) {
                    isConfiguredDirection = true;
                    distance = Math.abs(dx) + Math.abs(dy) * orthoPenalty;
                }
            } else if (e.key === "ArrowRight") {
                if (dx > 0 && Math.abs(dy) <= Math.abs(dx)) {
                    isConfiguredDirection = true;
                    distance = Math.abs(dx) + Math.abs(dy) * orthoPenalty;
                }
            } else if (e.key === "ArrowUp") {
                if (dy < 0 && Math.abs(dx) <= Math.abs(dy)) {
                    isConfiguredDirection = true;
                    distance = Math.abs(dy) + Math.abs(dx) * orthoPenalty;
                }
            } else if (e.key === "ArrowDown") {
                if (dy > 0 && Math.abs(dx) <= Math.abs(dy)) {
                    isConfiguredDirection = true;
                    distance = Math.abs(dy) + Math.abs(dx) * orthoPenalty;
                }
            }

            if (isConfiguredDirection && distance < shortestDistance) {
                shortestDistance = distance;
                bestMatch = el;
            }
        });

        if (bestMatch) {
            setFocusedElementId((bestMatch as HTMLElement).id);
            (bestMatch as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    };

    const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const selectable = target.closest(`.${SELECTABLE_CLASS}`);
        if (selectable && selectable.id) {
            setFocusedElementId(selectable.id);
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
}

export function useSpatialNavigation() {
    useEffect(() => {
        initGlobalListeners();
    }, []);

    const focusedElementId = useSyncExternalStore(subscribe, getSnapshot, () => null);

    return { focusedElementId, setFocusedElementId };
}
