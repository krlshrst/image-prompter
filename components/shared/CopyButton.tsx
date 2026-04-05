"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "Kopieren", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
        copied
          ? "bg-emerald-500 text-white"
          : "bg-bg-elevated text-text-secondary hover:text-text-primary"
      } ${className}`}
    >
      {copied ? "Kopiert!" : label}
    </button>
  );
}
