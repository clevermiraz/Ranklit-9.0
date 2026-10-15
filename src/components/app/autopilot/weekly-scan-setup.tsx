"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { CalendarClock, Loader2 } from "lucide-react";
import { saveWeeklyScanAction } from "@/app/actions/autopilot";
import { WEEKDAYS, type GridSize, type Weekday } from "@/lib/app/types";
import { ChipGroup } from "@/components/app/controls";
import { Caps, btn } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";

const AREAS: { value: GridSize; label: string }[] = [
  { value: 5, label: "5×5 Standard" },
  { value: 7, label: "7×7 Detailed" },
  { value: 9, label: "9×9 Wide" },
];

/** Projected monthly credits: keywords × grid² × ~4.3 weeks. */
export const monthlyScanCredits = (keywords: number, grid: number) => Math.round(keywords * grid * grid * 4.3);

export function WeeklyScanSetup({
  weekly,
  keywords,
  monthlyCredits,
  credits,
}: {
  weekly: { enabled: boolean; day: Weekday; grid: GridSize };
  keywords: number;
  monthlyCredits: number;
  credits: number;
}) {
  const { run, pending } = useAction();
  const [grid, setGrid] = useState<GridSize>(weekly.grid);
  const [day, setDay] = useState<Weekday>(weekly.day);
  const [prev, setPrev] = useState(weekly);
  if (prev !== weekly) {
    setPrev(weekly);
    setGrid(weekly.grid);
    setDay(weekly.day);
  }

  const save = (next: { grid: GridSize; day: Weekday; enabled: boolean }) => run(() => saveWeeklyScanAction(next));
  const pick = (patch: Partial<{ grid: GridSize; day: Weekday }>) => {
    const next = { grid, day, ...patch };
    if (patch.grid) setGrid(patch.grid);
    if (patch.day) setDay(patch.day);
    if (weekly.enabled) save({ ...next, enabled: true }); // live schedule: save straight away
  };

  const perScan = keywords * grid * grid;
  const perMonth = monthlyScanCredits(keywords, grid);
  const share = monthlyCredits ? Math.round((perMonth / monthlyCredits) * 100) : 0;

  return (
    <div className="rounded-2xl border border-[#e6d6f3] bg-[#f8f1fc] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 font-bold">
            <CalendarClock className="size-4 text-brand-700" /> Weekly auto-scan setup
          </h3>
          <p className="mt-0.5 max-w-2xl text-sm text-ink/60">
            Once a week, on your chosen day, the bot scans all of your keywords across your area and saves the results to Map Scans, so you can see how your rankings move over time.
          </p>
        </div>
        {weekly.enabled && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">On · every {weekly.day}</span>}
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <Caps className="mb-2">Scan area</Caps>
          <ChipGroup label="Weekly scan area" value={grid} onChange={(g) => pick({ grid: g })} options={AREAS} />
          <p className="mt-1.5 text-xs text-ink/55">A bigger scan area covers more nearby points — and uses more credits.</p>
        </div>
        <div>
          <Caps className="mb-2">Day of week</Caps>
          <ChipGroup label="Day of week" value={day} onChange={(d) => pick({ day: d })} options={WEEKDAYS.map((d) => ({ value: d, label: d }))} />
        </div>
        <div>
          <Caps className="mb-1">Keywords</Caps>
          <p className="text-sm text-ink/70">
            Your weekly scan uses the <strong>{keywords}</strong> keyword{keywords === 1 ? "" : "s"} from your Ranking Strategy —{" "}
            <Link href="/dashboard/strategy" className="font-semibold text-brand-700 hover:underline">
              manage them there →
            </Link>
          </p>
        </div>

        <div className="rounded-xl border border-[#ece6f4] bg-white p-4">
          {keywords === 0 ? (
            <>
              <p className="text-sm font-semibold">Add a keyword to see your weekly scan cost.</p>
              <p className="mt-0.5 text-xs text-ink/55">
                Each keyword costs {grid * grid} credits per scan at {grid}×{grid}. Your plan includes {monthlyCredits.toLocaleString()} credits/month.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">
                <strong>{perScan.toLocaleString()} credits</strong> per weekly scan ({keywords} × {grid * grid} points) ·{" "}
                <strong>~{perMonth.toLocaleString()} credits/month</strong>
              </p>
              <p className={clsx("mt-0.5 text-xs", perMonth > monthlyCredits ? "font-semibold text-red-600" : "text-ink/55")}>
                {perMonth > monthlyCredits
                  ? `That's more than the ${monthlyCredits.toLocaleString()} credits/month in your plan — pick a smaller area or top up credits.`
                  : `About ${share}% of the ${monthlyCredits.toLocaleString()} credits/month in your plan. You have ${credits.toLocaleString()} available now.`}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {weekly.enabled ? (
            <button type="button" disabled={pending} onClick={() => save({ grid, day, enabled: false })} className={btn.outline}>
              {pending && <Loader2 className="size-4 animate-spin" />} Disable weekly auto-scans
            </button>
          ) : (
            <button type="button" disabled={pending || keywords === 0} onClick={() => save({ grid, day, enabled: true })} className={btn.primary}>
              {pending && <Loader2 className="size-4 animate-spin" />} Enable weekly auto-scans
            </button>
          )}
          {keywords === 0 && !weekly.enabled && <span className="text-xs text-ink/55">Add a keyword first to enable weekly scans.</span>}
          {weekly.enabled && <span className="text-xs text-ink/55">Changes above save automatically.</span>}
        </div>
      </div>
    </div>
  );
}
