"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { MenuCard } from "@/components/MenuCard";

const MENU_ITEMS = [
  {
    id: "collection",
    title: "My Collection",
    description: "Browse and manage your video game library across all platforms.",
    label: "SOON",
    color: "green" as const,
    disabled: true,
  },
  {
    id: "add",
    title: "Add Game",
    description: "Log a new game to your vault with details, ratings and notes.",
    label: "SOON",
    color: "cyan" as const,
    disabled: true,
  },
  {
    id: "stats",
    title: "Stats & Charts",
    description: "Visualise your collection data — genres, platforms, completion rates.",
    label: "SOON",
    color: "amber" as const,
    disabled: true,
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure your vault preferences and account details.",
    label: "SOON",
    color: "green" as const,
    disabled: true,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.6 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Home() {
  const [bootDone, setBootDone] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  const bootLines = [
    "MWVAULT OS v1.0.0 — SYSTEM BOOT",
    "Initialising memory banks............. OK",
    "Loading game database................. OK",
    "Connecting to vault service........... OK",
    "Press START to continue.",
  ];

  useEffect(() => {
    if (currentLine < bootLines.length) {
      const timer = setTimeout(() => setCurrentLine((l) => l + 1), 280);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setBootDone(true), 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--green) 1px, transparent 1px), linear-gradient(90deg, var(--green) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <AnimatePresence mode="wait">
        {!bootDone ? (
          /* ── Boot Screen ─────────────────────────────────────── */
          <motion.div
            key="boot"
            className="w-full max-w-xl font-mono-retro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="retro-panel p-6 space-y-2">
              {bootLines.slice(0, currentLine).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={clsx(
                    "text-sm",
                    i === 0 ? "text-neon-green font-pixel text-xs mb-4" : "text-[#4a9960]",
                    i === bootLines.length - 1 && "text-neon-amber mt-4"
                  )}
                >
                  {line}
                  {i === currentLine - 1 && i < bootLines.length - 1 && (
                    <span className="cursor-blink" />
                  )}
                </motion.p>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ── Main Menu ───────────────────────────────────────── */
          <motion.div
            key="menu"
            className="w-full max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <motion.header
              className="mb-10 text-center"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="inline-block mb-4 px-3 py-1 border border-[rgba(0,255,65,0.3)] font-pixel text-[8px] text-[#00ff41] tracking-widest"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                INSERT COIN TO PLAY
              </motion.div>

              <h1 className="font-pixel text-2xl md:text-3xl neon-pulse flicker text-neon-green leading-tight">
                MW<span className="text-neon-cyan">VAULT</span>
              </h1>

              <p className="mt-4 font-mono-retro text-sm text-[#4a5568]">
                ©{new Date().getFullYear()} MWVAULT INTERACTIVE. ALL RIGHTS RESERVED.
              </p>

              <div className="mt-6 h-px bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-30" />
            </motion.header>

            {/* Menu Items */}
            <motion.nav
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              aria-label="Main navigation"
            >
              {MENU_ITEMS.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <MenuCard
                    title={item.title}
                    description={item.description}
                    label={item.label}
                    color={item.color}
                    disabled={item.disabled}
                  />
                </motion.div>
              ))}
            </motion.nav>

            {/* Footer status bar */}
            <motion.footer
              className="mt-10 retro-panel p-3 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <span className="font-mono-retro text-xs text-[#2d3748]">
                PLAYER 1 — READY
              </span>
              <motion.span
                className="font-pixel text-[8px] text-neon-green"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" as const }}
              >
                ● ONLINE
              </motion.span>
              <span className="font-mono-retro text-xs text-[#2d3748]">
                VER 0.1.0
              </span>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
