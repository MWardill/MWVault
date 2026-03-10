"use client";

import React, { createContext, useContext, useTransition, ReactNode } from "react";
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
    const [isPending, startTransition] = useTransition();

    const navigate = (path: string) => {
        // startTransition pauses the rendering of the next layout until the Server Component DB fetch resolves
        startTransition(() => {
            router.push(path);
        });
    };

    return (
        <NavigationContext.Provider value={{ isNavigating: isPending, navigate }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    return useContext(NavigationContext);
}
