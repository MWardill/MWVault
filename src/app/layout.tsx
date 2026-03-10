import type { Metadata } from "next";
import { Press_Start_2P, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/AuthProvider";
import { SplashProvider } from "@/contexts/SplashContext";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
});


// const pressStart2P = VT323({
//   weight: "400",
//   subsets: ["latin"],
//   variable: "--font-press-start-2p",
//   display: "swap",
// });

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
      <html lang="en" className={`${pressStart2P.variable} ${shareTechMono.variable}`}>
        <body className="antialiased">
          <AuthProvider>
            <SplashProvider>
              <AppShell>{children}</AppShell>
            </SplashProvider>
          </AuthProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
