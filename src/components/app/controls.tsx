"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

export function Switch({
  checked,
  onChange,
  disabled,
  label,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "h-8 w-14" : "h-5 w-9";
  const knob = size === "lg" ? "size-7" : "size-4";
  const on = size === "lg" ? "left-[26px]" : "left-[18px]";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        dims,
        checked ? "bg-brand-700" : "bg-[#e2dbec]",
      )}
    >
      <span className={clsx("absolute top-0.5 rounded-full bg-white shadow transition-all", knob, checked ? on : "left-0.5")} />
    </button>
  );
}

/** Row of rounded chips where one is selected. `tone` sets the active colour. */
export function ChipGroup<T extends string | number>({
  options,
  value,
  onChange,
  tone = "purple",
  label,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  tone?: "purple" | "amber" | "fuchsia" | "outline";
  label: string;
}) {
  const active = {
    purple: "bg-brand-700 text-white",
    amber: "bg-amber-500 text-white",
    fuchsia: "bg-fuchsia-600 text-white",
    outline: "border-brand-600 bg-[#f6ecfc] text-brand-700",
  }[tone];
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
            o.value === value ? clsx(active, tone !== "outline" && "border-transparent") : "border-transparent bg-[#efeaf5] text-ink/65 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Segmented control (pill group in a light track). */
export function Segmented<T extends string>({ options, value, onChange, label }: { options: { value: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="inline-flex rounded-xl bg-[#efeaf5] p-1" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={clsx("rounded-lg px-3 py-1 text-sm font-medium", o.value === value ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
