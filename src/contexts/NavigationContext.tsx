"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";

interface NavigationContextType {
    isNavigating: boolean;
    navigate: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
    isNavigating: false,
    navigate: () => { },
});

export function NavigationProvider({ children }: { children: ReactNode }) {
    const router = useTransitionRouter();
    const pathname = usePathname();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        // Reset navigation state when pathname finishes changing
        setIsNavigating(false);
    }, [pathname]);

    const navigate = (path: string) => {
        if (path === pathname) return;

        setIsNavigating(true);

        // Allow React to flush the Toast to the DOM before Next-View-Transitions takes its snapshot
        setTimeout(() => {
            router.push(path);
        }, 50);
    };

    return (
        <NavigationContext.Provider value={{ isNavigating, navigate }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    return useContext(NavigationContext);
}
