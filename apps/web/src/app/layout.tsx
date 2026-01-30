import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  title: "GitRats | The Gym for your Git",
  description: "Gamify your GitHub contributions. Track stats, earn XP, and compete with other developers.",
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(
        inter.variable,
        jetbrainsMono.variable,
        "bg-background text-foreground antialiased selection:bg-git-green selection:text-white"
      )}>
        {children}
      </body>
    </html>
  );
}
