"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Play, Plus, Radar, Loader2 } from "lucide-react";
import { useAction } from "@/components/app/toast";
import { btn, input } from "@/components/app/ui";
import { runAllScansAction, runScanAction } from "@/app/actions/rankings";

/** Keyword input + Scan, with saved strategy keywords as one-click chips. */
export function ScanBox({ saved, perKeyword, credits, firstFree }: { saved: string[]; perKeyword: number; credits: number; firstFree: boolean }) {
  const [kw, setKw] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const { run, pending } = useAction();

  const scan = (k: string, clear: boolean) => {
    setBusy(k);
    run(
      () => runScanAction(k),
      (r) => {
        setBusy(null);
        if (clear && !r?.error) setKw("");
      },
    );
  };

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (kw.trim()) scan(kw, true);
        }}
      >
        <input
          className={clsx(input, "h-11 flex-1")}
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="Type a keyword to scan, e.g. plumber columbus"
          maxLength={80}
          aria-label="Keyword to scan"
        />
        <button type="submit" disabled={!kw.trim() || pending} className={clsx(btn.primary, "!rounded-lg")}>
          {pending && busy === kw ? <Loader2 className="size-4 animate-spin" /> : <Radar className="size-4" />} Scan
        </button>
      </form>
      <p className="mt-2 text-xs text-ink/50">
        {firstFree ? "Your first scan for this location is free. " : ""}
        Each keyword uses {perKeyword} credits · {credits.toLocaleString()} credits left
      </p>

      <div className="mt-3 rounded-xl bg-[#f6f0fb] px-4 py-3">
        {saved.length ? (
          <>
            <p className="text-xs font-semibold text-ink/55">Your saved keywords — click one to scan it now</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {saved.map((k) => (
                <button
                  key={k}
                  type="button"
                  disabled={pending}
                  onClick={() => scan(k, false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e4dcef] bg-white px-3 py-1 text-xs font-semibold text-ink/80 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-60"
                >
                  {pending && busy === k ? <Loader2 className="size-3 animate-spin" /> : <Radar className="size-3 text-brand-700" />}
                  {k}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-start gap-2 text-sm">
            <Plus className="mt-0.5 size-4 text-brand-700" />
            <div>
              <p className="font-semibold">No saved keywords yet</p>
              <p className="text-xs text-ink/60">
                Type one above to scan now, or{" "}
                <Link href="/dashboard/strategy" className="font-semibold text-brand-700 hover:underline">
                  generate a strategy
                </Link>{" "}
                to add a full set.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Header "Run scan": scans every checked strategy keyword. */
export function RunAllButton({ count, cost }: { count: number; cost: number }) {
  const { run, pending } = useAction();
  return (
    <button
      type="button"
      disabled={!count || pending}
      onClick={() => run(() => runAllScansAction())}
      className={btn.primary}
      title={count ? `Scans ${count} keyword${count === 1 ? "" : "s"} · up to ${cost.toLocaleString()} credits` : "Add keywords on your strategy page first"}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />} Run scan
    </button>
  );
}

/** Small inline "Scan now" for one keyword (Rankings table). */
export function ScanKeywordButton({ keyword, label = "Scan now" }: { keyword: string; label?: string }) {
  const { run, pending } = useAction();
  return (
    <button type="button" disabled={pending} onClick={() => run(() => runScanAction(keyword))} className={clsx(btn.soft, btn.sm)}>
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Radar className="size-3.5" />} {label}
    </button>
  );
}
