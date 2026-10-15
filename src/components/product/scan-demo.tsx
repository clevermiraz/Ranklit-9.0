"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { gridStats } from "@/components/rank-grid";
import { demoScans, type DemoScan } from "@/lib/data/features";
import { ScanMap } from "./scan-map";
import { useTween } from "./use-in-view";

type Phase = "before" | "after";

const STEP_MS = 3400;

/**
 * Interactive before/after geo-grid scan. Autoplays business → before → after
 * until the visitor clicks a business or a scan date.
 */
export function ScanDemo({ scans = demoScans }: { scans?: DemoScan[] }) {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("before");
  const [auto, setAuto] = useState(true);
  // after picking a business by hand we still play its own before → after once
  const [pendingFlip, setPendingFlip] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setPhase((p) => {
        if (p === "before") return "after";
        setActive((a) => (a + 1) % scans.length);
        return "before";
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [auto, scans.length]);

  useEffect(() => {
    if (!pendingFlip) return;
    const t = setTimeout(() => {
      setPhase("after");
      setPendingFlip(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [pendingFlip, active]);

  const scan = scans[active];
  const before = gridStats(scan.before.grid);
  const after = gridStats(scan.after.grid);
  const stats = phase === "before" ? before : after;
  const top3 = useTween(stats.top3);
  const avg = useTween(stats.avg, 700, 1);

  const pickBusiness = (i: number) => {
    setAuto(false);
    setActive(i);
    setPhase("before");
    setPendingFlip(true);
  };
  const pickPhase = (p: Phase) => {
    setAuto(false);
    setPendingFlip(false);
    setPhase(p);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-2 lg:justify-end" role="group" aria-label="Pick a business">
        {scans.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pickBusiness(i)}
            aria-pressed={i === active}
            className={clsx(
              "cursor-pointer rounded-full border px-3.5 py-2 text-sm font-bold transition-colors",
              i === active ? "border-ink bg-ink text-white" : "border-ink/12 bg-white text-ink/70 hover:border-ink/25 hover:text-ink",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <figure
        data-phase={phase}
        className="mt-4 rounded-[28px] border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(35,25,56,.05),0_30px_60px_-24px_rgba(35,25,56,.28)] sm:p-[18px]"
      >
        <figcaption>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-xs font-extrabold text-[#15803d]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rank-good/60" />
              <span className="relative size-2 rounded-full bg-rank-good" />
            </span>
            Real Google Maps scan
          </span>
          <p className="mt-3 text-lg font-extrabold">“{scan.keyword}”</p>
          <p className="mt-0.5 text-[13px] text-ink/55">{scan.business}</p>
          <p className="sr-only">
            Before, on {scan.before.longDate}: in the top 3 in {before.top3} of {before.total} spots. After, on {scan.after.longDate}: in the top
            3 in {after.top3} of {after.total} spots.
          </p>
        </figcaption>

        <ScanMap key={scan.id} grid={scan[phase].grid} halos={phase === "after"} className="mt-4" />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative grid w-fit grid-cols-2 rounded-full bg-[#f1edf6] p-1" role="group" aria-label="Scan date">
            <span
              className={clsx(
                "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_2px_6px_rgba(35,25,56,.14)] transition-transform duration-300 ease-out",
                phase === "after" && "translate-x-full",
              )}
              aria-hidden
            />
            {(["before", "after"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => pickPhase(p)}
                aria-pressed={phase === p}
                className={clsx(
                  "relative cursor-pointer rounded-full px-[18px] py-2 text-center leading-tight transition-colors",
                  phase === p ? "text-ink" : "text-ink/50 hover:text-ink/75",
                )}
              >
                <span className="block text-sm font-extrabold capitalize">{p}</span>
                <span className="block text-[11px] font-semibold">{scan[p].date}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-6" aria-live="polite">
            <div>
              <p className="text-[30px] leading-none font-extrabold tracking-tight">
                {top3}
                <span className="text-[15px] font-bold text-ink/40">/{stats.total}</span>
              </p>
              <p className="mt-1.5 text-xs font-semibold text-ink/55">in the top 3</p>
            </div>
            <div>
              <p className="text-[30px] leading-none font-extrabold tracking-tight">#{avg.toFixed(1)}</p>
              <p className="mt-1.5 text-xs font-semibold text-ink/55">avg. rank</p>
            </div>
          </div>
        </div>

        <p
          className={clsx(
            "mt-4 flex items-center gap-3 rounded-2xl bg-[#ecfdf3] px-3.5 py-3 text-[15px] font-semibold text-[#14532d] transition-all duration-500",
            phase === "after" ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
          aria-hidden={phase !== "after"}
        >
          <span className="text-[28px] leading-none font-extrabold text-rank-good">+{after.top3 - before.top3}</span>
          <span>
            more spots in the top 3 <strong className="font-extrabold">in {scan.days} days</strong>
          </span>
        </p>
      </figure>

      <p className="mx-auto mt-4 max-w-md text-center text-xs leading-relaxed text-ink/45">
        Real scans from Ranklit customers, first scan vs. latest scan. The street map is only an illustration. Your results will differ.
      </p>
    </div>
  );
}
