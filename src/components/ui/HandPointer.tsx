"use client";

import { clsx } from "clsx";

interface HandPointerProps {
    className?: string;
}

export function HandPointer({ className }: HandPointerProps) {
    return (
        <span
            className={clsx(
                "inline-block text-[1.2rem] brightness-150 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] animate-[float-horizontal_1s_ease-in-out_infinite_alternate]",
                className
            )}
        >
            👉🏻
        </span>
    );
}
