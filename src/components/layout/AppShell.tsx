"use client";

import { ReactNode, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JrpgMenuList } from "@/components/ui/JrpgMenuList";
import { useTransitionRouter } from "next-view-transitions";
import { FloatingPanel } from "./FloatingPanel";
import { GameClock } from "@/components/ui/GameClock";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import { useSession } from "next-auth/react";

const MENU_ITEMS = [
    { id: "home", label: "Home", description: "Use or sort acquired items.", isMobileCore: true },
    { id: "magic", label: "Magic", description: "Cast recovery magic or view spell lists.", disabled: true },
    { id: "equip", label: "Equip", description: "Change character weapons and armor.", disabled: true },
    { id: "status", label: "Status", description: "Check character parameters.", disabled: true },
    { id: "order", label: "Order", description: "Change the party formation.", disabled: true },
    { id: "collection", label: "Collection", description: "Access your complete video game collection.", isMobileCore: true },
    { id: "config", label: "Config", description: "Change window color and game settings." },
];

export default function AppShell({ children }: { children: ReactNode }) {
    const router = useTransitionRouter();
    const pathname = usePathname();
    const currentRouteId = pathname?.split("/")[1] || "home";
    const { data: session } = useSession();

    // Handle main menu selection
    const handleMenuClick = useCallback((id: string) => {
        router.push(`/${id}`);
    }, [router]);

    // Memoize the mapped items array to prevent unneeded re-renders on layout state change
    const menuItems = useMemo(() => MENU_ITEMS.map((item) => ({
        ...item,
        onClick: () => handleMenuClick(item.id)
    })), [handleMenuClick]);

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center lg:pt-0">
            <main className="w-full max-w-6xl mx-auto h-[85vh] min-h-[600px] relative">


                {/* Left Pane: Main Content */}
                <motion.div
                    initial={{ opacity: 0, x: -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col gap-4 w-full h-full pr-2 custom-scrollbar z-0"
                >


                    <div style={{ viewTransitionName: 'main-panel' }} className="flex flex-col gap-4 w-full h-full">
                        {/* Header Row */}
                        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-x-12 border-b-2 border-slate-100/30">
                            Mat Wardill Collection v1.0
                        </div>

                        <div className="stippled jrpg-panel flex-1 flex flex-col pt-3 pb-6 px-4 md:pr-46 lg:pr-58 relative">
                            {children}
                        </div>
                    </div>
                </motion.div>

                {/* Mobile Navigation Component */}
                <MobileMenu items={menuItems} currentRouteId={currentRouteId} />

                {/* Right Pane: Navigation & Info (Desktop) */}
                <div className="hidden lg:flex flex-col absolute -right-12 z-20">
                    <FloatingPanel viewTransitionName="menu-panel">
                        <JrpgMenuList items={menuItems} />
                    </FloatingPanel>
                </div>

                <div className="hidden lg:flex absolute bottom-4 -right-12 flex-col gap-6 w-[280px] z-10">
                    <FloatingPanel
                        className="w-full relative"
                        viewTransitionName="time-panel"
                        title="Time & Games"
                    >
                        <div className="flex flex-col gap-3 font-pixel text-right w-full">
                            <GameClock />
                            <div className="flex items-center justify-between">
                                <div className="w-5 h-5 rounded-full bg-gray-400 bg-opacity-30 border-2 border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-200 drop-shadow-md">
                                    G
                                </div>
                                <span className="text-xl tracking-widest text-gray-100 jrpg-text-shadow leading-none">257G</span>
                            </div>
                        </div>
                    </FloatingPanel>

                    <FloatingPanel
                        className="w-full relative"
                        viewTransitionName="location-panel"
                        title={session?.user ? "User" : "Location"}
                    >
                        <div className="font-pixel text-base text-gray-100 jrpg-text-shadow w-full text-center truncate px-2">
                            {session?.user?.name || session?.user?.email?.split('@')[0] || "Guest"}
                        </div>
                    </FloatingPanel>
                </div>
            </main>
        </div>
    );
}