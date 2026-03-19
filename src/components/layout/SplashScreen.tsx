"use client";

import { useSplash } from "@/contexts/SplashContext";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
    const { showSplash, isComplete } = useSplash();

    return (
        <AnimatePresence>
            {showSplash && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 pointer-events-none"
                    key="splash-screen"
                >
                    <div className="stippled jrpg-panel flex flex-col items-center justify-center p-6 gap-4 min-w-[200px] border-2 border-slate-100/30">
                        <div className="w-full h-2 bg-gray-800 rounded-sm relative overflow-hidden">
                            {/* Loading Bar */}
                            <motion.div
                                className={`h-full ${isComplete ? "bg-pink-500" : "bg-cyan-400"}`}
                                initial={{ width: "0%" }}
                                animate={{ width: isComplete ? "100%" : "90%" }}
                                transition={{
                                    duration: isComplete ? 0.1 : 1,
                                    ease: isComplete ? "easeOut" : "linear"
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
