"use client";

import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { FloatingPanel } from "@/components/layout/FloatingPanel";
import { useMobileMenu } from "./context";

export function Expandable({ children }: { children: ReactNode }) {
    const { isOpen } = useMobileMenu();

    return (
        <AnimatePresence>
            {isOpen && (
                <FloatingPanel
                    className="lg:hidden absolute top-4 left-0 w-full z-40"
                    contentClassName="p-5"
                >
                    {children}
                </FloatingPanel>
            )}
        </AnimatePresence>
    );
}
