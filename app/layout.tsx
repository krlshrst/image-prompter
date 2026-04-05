import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Prompt Generator",
  description: "Optimierte Prompts für Midjourney V7, Flux & Nano Banana Pro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-bg-base text-text-primary font-[system-ui,sans-serif] antialiased">
        {children}
      </body>
    </html>
  );
}
