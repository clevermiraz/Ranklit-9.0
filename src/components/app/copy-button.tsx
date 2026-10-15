"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label = "Copy", mono, className }: { value: string; label?: string; mono?: boolean; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard can be blocked (insecure context); fall back to a temporary textarea.
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <span className={clsx("inline-flex max-w-full items-center gap-2", className)}>
      {mono && <code className="truncate rounded-md bg-black/20 px-2 py-1 font-mono text-xs">{value.replace(/^https?:\/\//, "")}</code>}
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#e4dcef] bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand-300"
      >
        {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : label}
      </button>
    </span>
  );
}
