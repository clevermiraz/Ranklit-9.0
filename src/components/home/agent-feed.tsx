"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Grid2x2, Link2, Search, Sparkles, Star, type LucideIcon } from "lucide-react";
import { agentTasks, type AgentTaskIcon } from "@/lib/data/marketing";

export const taskIcons: Record<AgentTaskIcon, { icon: LucideIcon; className: string }> = {
  star: { icon: Star, className: "bg-amber-400/15 text-amber-300" },
  link: { icon: Link2, className: "bg-emerald-400/15 text-emerald-300" },
  grid: { icon: Grid2x2, className: "bg-white/10 text-white/80" },
  spark: { icon: Sparkles, className: "bg-brand-400/20 text-brand-200" },
  search: { icon: Search, className: "bg-rose-400/15 text-rose-300" },
};

const VISIBLE = 5;

/** The dark "Your AI agent" window in the hero. New tasks slide in on a timer. */
export function AgentFeed() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, []);

  const items = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (tick + i) % agentTasks.length;
    return { ...agentTasks[idx], key: `${tick + i}` };
  }).reverse();
  const newest = items[0];
  const toast = taskIcons[newest.icon];

  return (
    <div className="relative" role="group" aria-label="Sample week of your AI agent's work">
      <div className="absolute -inset-10 rounded-full bg-brand-400/25 blur-3xl" aria-hidden />
      <div className="relative rounded-[28px] bg-gradient-to-b from-brand-300/70 to-brand-200/40 p-1.5 shadow-lift">
        <div className="overflow-hidden rounded-[24px] bg-gradient-to-b from-[#211533] to-night text-white">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/20" />
              </span>
              <span className="text-sm font-semibold">Your AI agent</span>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-bold text-emerald-300">
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" /> Running
            </span>
          </div>

          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <span className="size-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-800" aria-hidden />
              <div>
                <p className="text-[15px] font-bold">Your business</p>
                <p className="text-xs text-white/55">Google Business Profile</p>
              </div>
            </div>
            <span className="rounded-full border border-dashed border-white/25 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white/60">
              SAMPLE WEEK
            </span>
          </div>

          <ul className="px-2 pb-2">
            {items.map((item, i) => {
              const meta = taskIcons[item.icon];
              return (
                <li
                  key={item.key}
                  className={clsx(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors duration-500",
                    i === 0 && "animate-fade-up bg-white/[0.06]",
                  )}
                >
                  <span className={clsx("grid size-8 shrink-0 place-items-center rounded-xl", meta.className)}>
                    <meta.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.title}</span>
                    <span className="block text-xs text-white/45">{item.time}</span>
                  </span>
                  <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-bold text-emerald-300">Done</span>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-3 text-sm text-white/60">
            <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white/70" aria-hidden />
            Working on your next post…
          </div>
        </div>
      </div>

      <div
        key={newest.key}
        className="animate-fade-up absolute -left-6 bottom-16 hidden items-center gap-3 rounded-2xl bg-white px-3 py-2.5 shadow-lift sm:flex lg:-left-20"
        aria-hidden
      >
        <span className={clsx("grid size-8 place-items-center rounded-xl bg-brand-50 text-brand-600", toast.className.includes("amber") && "bg-amber-50 text-amber-500")}>
          <toast.icon className="size-4" />
        </span>
        <span>
          <span className="block text-sm font-bold text-ink">{newest.title.replace("new ", "")}</span>
          <span className="block text-xs text-ink/55">Your AI agent · just now</span>
        </span>
      </div>
    </div>
  );
}
