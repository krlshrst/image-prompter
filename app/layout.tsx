import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt-Baukasten",
  description: "Optimierte Prompts für Midjourney V8.1, Flux 2 Pro, Nano Banana Pro & GPT Image 2",
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
