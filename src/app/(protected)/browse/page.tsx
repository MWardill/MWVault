"use client";

export default function Browse() {
    return (
        <div className="flex-1 flex items-center justify-center p-6 mt-10">
            <div className="bg-[#1A1C29]/80 border-2 border-white/20 p-8 rounded shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <p className="text-gray-300 font-pixel text-sm md:text-base leading-relaxed text-center uppercase tracking-wider animate-pulse">
                    Please select a console from the menu above
                </p>
                <p className="text-sky-400 mt-4 font-pixel text-xs leading-relaxed text-center uppercase tracking-wider decoration-1 underline underline-offset-4 decoration-sky-400/50">
                    To start browsing
                </p>
            </div>
        </div>
    );
}
