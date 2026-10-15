"use client";

import { useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

/** Chips + text box. Enter (or comma) adds, × removes, Backspace on empty removes the last one. */
export function TagInput({
  value,
  onChange,
  placeholder,
  max = 30,
  label,
  disabled,
  lowercase,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
  label: string;
  disabled?: boolean;
  lowercase?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    let v = raw.replace(/\s+/g, " ").trim().slice(0, 80);
    if (lowercase) v = v.toLowerCase();
    if (!v || value.length >= max || value.some((x) => x.toLowerCase() === v.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, v]);
    setDraft("");
  };
  return (
    <div
      className={clsx(
        "flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-[#e4dcef] bg-white p-1.5 transition focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-100",
        disabled && "opacity-60",
      )}
    >
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#f3e8fb] py-1 pr-1 pl-2.5 text-xs font-semibold text-brand-800">
          {t}
          <button type="button" disabled={disabled} onClick={() => onChange(value.filter((x) => x !== t))} className="rounded-full p-0.5 hover:bg-brand-200" aria-label={`Remove ${t}`}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        aria-label={label}
        value={draft}
        disabled={disabled || value.length >= max}
        onChange={(e) => {
          const v = e.target.value;
          if (v.endsWith(",")) add(v.slice(0, -1));
          else setDraft(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft && add(draft)}
        placeholder={value.length >= max ? `Up to ${max}` : value.length ? "Add another…" : placeholder}
        className="h-8 min-w-[160px] flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-ink/35"
      />
    </div>
  );
}
