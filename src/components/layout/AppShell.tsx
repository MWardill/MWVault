"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JrpgMenuList } from "@/components/JrpgMenuList";
import { useTransitionRouter } from "next-view-transitions";

const MENU_ITEMS = [
    { id: "item", label: "Item", description: "Use or sort acquired items." },
    { id: "magic", label: "Magic", description: "Cast recovery magic or view spell lists.", disabled: true },
    { id: "equip", label: "Equip", description: "Change character weapons and armor.", disabled: true },
    { id: "status", label: "Status", description: "Check character parameters.", disabled: true },
    { id: "order", label: "Order", description: "Change the party formation.", disabled: true },
    { id: "vault", label: "Vault", description: "Access your complete video game collection." },
    { id: "config", label: "Config", description: "Change window color and game settings.", disabled: true },
];

export default function AppShell({ children }: { children: ReactNode }) {
    const router = useTransitionRouter();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeCard, setActiveCard] = useState<string | null>(null);

    // Handle main menu selection
    const handleMenuClick = (id: string) => {
        router.push(`/${id}`);
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center ">
            <main className="w-full max-w-6xl mx-auto h-[85vh] min-h-[600px] relative">

                {/* Left Pane: Main Content */}
                <motion.div
                    initial={{ opacity: 0, x: -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col gap-4 w-full h-full pr-2 custom-scrollbar z-0"
                >
                    <div style={{ viewTransitionName: 'main-panel' }} className="flex flex-col gap-4 w-full h-full">
                        {children}
                    </div>
                </motion.div>

                {/* Right Pane: Navigation & Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute top-0 lg:-top-6 right-0 lg:-right-12 w-48 flex flex-col gap-4 shrink-0 z-10"
                    style={{ viewTransitionName: 'menu-panel' }}
                >
                    {/* Main Menu Box */}
                    <div className="jrpg-panel">
                        <JrpgMenuList
                            items={MENU_ITEMS.map((item, i) => ({
                                ...item,
                                onClick: () => handleMenuClick(item.id)
                            }))}
                            selectedIndex={selectedIndex}
                            onHover={setSelectedIndex}
                        />
                    </div>

                </motion.div>
            </main>
        </div >
    );
}