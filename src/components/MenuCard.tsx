"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { useState } from "react";

type MenuCardColor = "green" | "cyan" | "amber";

interface MenuCardProps {
    title: string;
    description: string;
    label?: string;
    color?: MenuCardColor;
    disabled?: boolean;
    onClick?: () => void;
}

const colorMap: Record<MenuCardColor, { border: string; label: string; glow: string }> = {
    green: {
        border: "border-[#00ff41] hover:shadow-[0_0_8px_#00ff41,0_0_20px_rgba(0,255,65,0.4)]",
        label: "bg-[#00ff41] text-[#07080f]",
        glow: "text-[#00ff41]",
    },
    cyan: {
        border: "border-[#00d4ff] hover:shadow-[0_0_8px_#00d4ff,0_0_20px_rgba(0,212,255,0.4)]",
        label: "bg-[#00d4ff] text-[#07080f]",
        glow: "text-[#00d4ff]",
    },
    amber: {
        border: "border-[#ffb000] hover:shadow-[0_0_8px_#ffb000,0_0_20px_rgba(255,176,0,0.4)]",
        label: "bg-[#ffb000] text-[#07080f]",
        glow: "text-[#ffb000]",
    },
};

export function MenuCard({
    title,
    description,
    label,
    color = "green",
    disabled = false,
    onClick,
}: MenuCardProps) {
    const [isPressed, setIsPressed] = useState(false);
    const colors = colorMap[color];

    return (
        <motion.button
            onClick={disabled ? undefined : onClick}
            onMouseDown={() => !disabled && setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            animate={isPressed ? { y: 1 } : { y: 0 }}
            className={clsx(
                "relative group w-full text-left p-5 rounded-none",
                "bg-[#0d1117] border transition-all duration-200 cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff41]",
                colors.border,
                disabled && "opacity-40 cursor-not-allowed"
            )}
            disabled={disabled}
        >
            {/* Pixel corner accents */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-inherit opacity-60" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-inherit opacity-60" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-inherit opacity-60" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-inherit opacity-60" />

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Arrow indicator */}
                    <div className="flex items-center gap-3 mb-2">
                        <motion.span
                            className={clsx("font-pixel text-xs", colors.glow)}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
                        >
                            ▶
                        </motion.span>
                        <h3 className={clsx("font-pixel text-xs leading-relaxed uppercase tracking-wider", colors.glow)}>
                            {title}
                        </h3>
                    </div>

                    <p className="font-mono-retro text-sm text-[#4a5568] group-hover:text-[#6b7280] transition-colors pl-6">
                        {description}
                    </p>
                </div>

                {label && (
                    <span
                        className={clsx(
                            "font-pixel text-[8px] px-2 py-1 flex-shrink-0 mt-1 uppercase",
                            colors.label
                        )}
                    >
                        {label}
                    </span>
                )}
            </div>
        </motion.button>
    );
}
