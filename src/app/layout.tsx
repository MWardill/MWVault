import type { Metadata } from "next";
import { Press_Start_2P, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import { AppShell } from "@/components/layout";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MWVault — Game Collection",
  description: "A retro-styled vault for tracking and exploring your video game collection.",
  keywords: ["video games", "game collection", "retro gaming", "MWVault"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={`${pressStart2P.variable} ${shareTechMono.variable} antialiased`}>
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </ViewTransitions>
  );
}
