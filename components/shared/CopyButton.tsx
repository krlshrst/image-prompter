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
      className={`btn-brutal px-3 py-1 text-xs ${
        copied ? "bg-nb-pastel" : "bg-card"
      } ${className}`}
    >
      {copied ? "Kopiert ✓" : label}
    </button>
  );
}
