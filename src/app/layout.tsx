import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
