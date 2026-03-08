"use client";

import { HandPointer } from "@/components/ui/HandPointer";
import { useMobileMenu } from "./context";

export function CoreItem({ label, isActive, disabled, onClick }: { label: string, isActive?: boolean, disabled?: boolean, onClick?: () => void }) {
    const { setIsOpen } = useMobileMenu();
    return (
        <button
            type="button"
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
                onClick?.();
                setIsOpen(false);
            }}
            disabled={disabled}
            className={`flex-1 text-center py-2 transition-colors relative flex items-center justify-center hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${isActive ? 'text-white' : 'text-gray-400'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span className="relative inline-block">
                {isActive && (
                    <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 sm:mr-3 flex items-center pointer-events-none">
                        <HandPointer className="text-sm sm:text-base leading-none" />
                    </span>
                )}
                <span className="relative z-10">{label}</span>
            </span>
        </button>
    );
}
