"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { RankGrid, gridStats } from "@/components/rank-grid";
import { scans } from "@/lib/data/marketing";

/** Before/after Google Maps scans for sample customers. Rotates through businesses until the visitor interacts. */
export function ScanShowcase() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"before" | "after">("after");
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setPhase((p) => {
        if (p === "before") return "after";
        setActive((a) => (a + 1) % scans.length);
        return "before";
      });
    }, 2600);
    return () => clearInterval(id);
  }, [auto]);

  const scan = scans[active];
  const view = scan[phase];
  const stats = gridStats(view.grid);
  const gained = gridStats(scan.after.grid).top3 - gridStats(scan.before.grid).top3;

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Pick a business">
        {scans.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setAuto(false);
              setActive(i);
              setPhase("after");
            }}
            className={clsx(
              "rounded-full border px-4 py-2 text-[15px] font-semibold transition-colors",
              i === active ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/75 hover:border-ink/25",
            )}
            aria-pressed={i === active}
          >
            {s.label}
          </button>
        ))}
      </div>

      <figure className="rounded-[28px] border border-ink/[0.06] bg-white p-5 shadow-lift">
        <figcaption>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500" /> Real Google Maps scan
          </span>
          <p className="mt-3 text-lg font-extrabold">“{scan.keyword}”</p>
          <p className="text-[13px] text-ink/55">{scan.business}</p>
          <p className="sr-only">
            Before, on {scan.before.longDate}: in the top 3 in {gridStats(scan.before.grid).top3} of 25 spots. After, on{" "}
            {scan.after.longDate}: in the top 3 in {gridStats(scan.after.grid).top3} of 25 spots.
          </p>
        </figcaption>

        <RankGrid grid={view.grid} className="mt-4" />

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex rounded-full bg-ink/[0.05] p-1" role="group" aria-label="Scan date">
            {(["before", "after"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setAuto(false);
                  setPhase(p);
                }}
                className={clsx(
                  "rounded-full px-4 py-1.5 text-center leading-tight transition-all",
                  phase === p ? "bg-white shadow-card" : "text-ink/50",
                )}
                aria-pressed={phase === p}
              >
                <span className="block text-sm font-bold capitalize">{p}</span>
                <span className="block text-[11px]">{scan[p].date}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-5 text-right">
            <div>
              <p className="text-3xl font-extrabold tracking-tight">
                {stats.top3}
                <span className="text-base font-semibold text-ink/40">/{stats.total}</span>
              </p>
              <p className="text-xs text-ink/55">in the top 3</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight">#{stats.avg}</p>
              <p className="text-xs text-ink/55">avg. rank</p>
            </div>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-[15px] font-medium text-emerald-900">
          <span className="text-3xl font-extrabold text-emerald-600">+{gained}</span>
          <span>
            more spots in the top 3 <strong>in {scan.days} days</strong>
          </span>
        </p>
      </figure>
    </div>
  );
}
