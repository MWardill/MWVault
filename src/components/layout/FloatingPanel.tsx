"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { useSplash } from "@/contexts/SplashContext";

interface FloatingPanelProps {
    children: ReactNode;
    viewTransitionName?: string;
    className?: string;
    contentClassName?: string;
    title?: string;
}

/**
 * A reusable floating JRPG panel wrapper that accepts standard tailwind layout/position classes.
 * It animates in from the right by default and handles its own internal layout padding.
 */
export function FloatingPanel({ children, viewTransitionName, className, contentClassName, title }: FloatingPanelProps) {
    const { showSplash } = useSplash();

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: showSplash ? 0 : 1, x: showSplash ? 100 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={clsx(
                "flex flex-col shrink-0 z-10",
                className
            )}
            style={viewTransitionName ? { viewTransitionName } : undefined}
        >
            {title && (
                <div className="absolute -top-[10px] left-3 z-20 px-1 font-pixel text-[10px] leading-none text-white jrpg-text-shadow tracking-widest uppercase">
                    {title}
                </div>
            )}
            <div className={clsx("jrpg-panel h-full w-full", contentClassName || "p-5 pr-7")}>
                {children}
            </div>
        </motion.div>
    );
}
