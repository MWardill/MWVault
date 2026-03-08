"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConsoleDropdown } from "./context";

export function Content({ children }: { children: ReactNode }) {
    const { isOpen } = useConsoleDropdown();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute top-full left-0 w-full overflow-hidden jrpg-panel rounded-t-none border-t-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                >
                    <div className="max-h-[300px] overflow-y-auto p-2 md:p-4 styled-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {children}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
