"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
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

export function SplashProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === "/home" || pathname === "/";

    // Ref to track if it's the very first page load
    const isInitialLoad = useRef(true);

    // Only show splash if it's the initial load AND we landed on home.
    const [showSplash, setShowSplash] = useState(() => isHome && isInitialLoad.current);
    const [timerDone, setTimerDone] = useState(false);
    const [dbLoaded, setDbLoadedState] = useState(false);

    const isComplete = timerDone && dbLoaded;

    useEffect(() => {
        isInitialLoad.current = false;
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
