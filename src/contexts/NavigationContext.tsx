"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";

export type TransitionType = "slide" | "fade";

interface NavigationContextType {
    isNavigating: boolean;
    transitionType: TransitionType;
    navigate: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
    isNavigating: false,
    transitionType: "slide",
    navigate: () => { },
});

export function NavigationProvider({ children }: { children: ReactNode }) {
    const router = useTransitionRouter();
    const pathname = usePathname();
    const [isNavigating, setIsNavigating] = useState(false);
    const [transitionType, setTransitionType] = useState<TransitionType>("slide");

    useEffect(() => {
        // Reset navigation state when pathname finishes changing
        setIsNavigating(false);
    }, [pathname]);

    const navigate = (path: string) => {
        if (path === pathname) return;

        // If navigating between collection pages, use a simple fade instead of a full layout slide
        const isCollectionToCollection = pathname.startsWith('/collection') && path.startsWith('/collection');
        setTransitionType(isCollectionToCollection ? 'fade' : 'slide');

        setIsNavigating(true);

        // Allow React to flush the Toast to the DOM before Next-View-Transitions takes its snapshot
        setTimeout(() => {
            router.push(path);
        }, 50);
    };

    return (
        <NavigationContext.Provider value={{ isNavigating, transitionType, navigate }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    return useContext(NavigationContext);
}
