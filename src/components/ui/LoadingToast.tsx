"use client";

import { useNavigation } from "@/contexts/NavigationContext";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingToast() {
    const { isNavigating } = useNavigation();

    return (
        <AnimatePresence>
            {isNavigating && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-4 right-4 z-[100] pointer-events-none"
                    key="loading-toast"
                >
                    <div className="stippled jrpg-panel flex items-center justify-center py-2 px-4 border-2 border-slate-100/30">
                        <div className="font-pixel text-[10px] text-gray-100 jrpg-text-shadow tracking-widest uppercase flex gap-2">
                            <span>LOADING</span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            >
                                ...
                            </motion.span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
