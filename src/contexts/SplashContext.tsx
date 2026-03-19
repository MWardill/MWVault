"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SplashContextType {
    showSplash: boolean;
    isComplete: boolean;
    setDbLoaded: (loaded: boolean) => void;
}

const SplashContext = createContext<SplashContextType>({
    showSplash: false,
    isComplete: false,
    setDbLoaded: () => { },
});

// Module-level flag — true only for the very first mount of the SplashProvider.
// Evaluated synchronously before any render, so it's safe to use in useState initialisers.
let isFirstAppLoad = true;

export function SplashProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === "/home" || pathname === "/";

    // Only show splash on the very first load when landing on home.
    const [showSplash, setShowSplash] = useState(() => isHome && isFirstAppLoad);
    const [timerDone, setTimerDone] = useState(false);
    const [dbLoaded, setDbLoadedState] = useState(false);

    const isComplete = timerDone && dbLoaded;

    // Mark subsequent mounts as non-initial immediately after the first render.
    useEffect(() => {
        isFirstAppLoad = false;
    }, []);

    useEffect(() => {
        if (showSplash) {
            const timer = setTimeout(() => {
                setTimerDone(true);
            }, 1000); // Wait at least 1 second
            return () => clearTimeout(timer);
        }
    }, [showSplash]);

    const setDbLoaded = (loaded: boolean) => {
        if (showSplash) {
            setDbLoadedState(loaded);
        }
    };

    useEffect(() => {
        if (showSplash && isComplete) {
            // Keep splash on screen for a split second to show the pink completion state
            const hideTimer = setTimeout(() => {
                setShowSplash(false);
            }, 300); // 300ms flash
            return () => clearTimeout(hideTimer);
        }
    }, [showSplash, isComplete]);

    return (
        <SplashContext.Provider value={{ showSplash, isComplete, setDbLoaded }}>
            {children}
        </SplashContext.Provider>
    );
}

export function useSplash() {
    return useContext(SplashContext);
}
