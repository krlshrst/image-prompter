import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt-Baukasten",
  description: "Optimierte Prompts für Midjourney V7, Flux & Nano Banana Pro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-paper text-ink font-body antialiased">
        {children}
      </body>
    </html>
  );
}
