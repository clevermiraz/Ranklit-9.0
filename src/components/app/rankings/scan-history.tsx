"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronRight, Download, Loader2, Radar, Search } from "lucide-react";
import { Segmented } from "@/components/app/controls";
import { Badge, Card, EmptyState, btn, input } from "@/components/app/ui";

export type HistoryRow = {
  id: string;
  keyword: string;
  kind: "one-time" | "autopilot";
  status: "running" | "completed";
  date: string; // display label
  iso: string;
  grid: number;
  spacing: number;
  avg: number | null;
  top3: number;
  found: number;
  total: number;
  solv: number;
};

type Filter = "all" | "one-time" | "autopilot";
const PAGE = 10;

function csvCell(v: string | number | null) {
  const s = v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function ScanHistory({ rows, selectedId }: { rows: HistoryRow[]; selectedId: string | null }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [limit, setLimit] = useState(PAGE);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => (filter === "all" || r.kind === filter) && (!needle || r.keyword.includes(needle)));
  }, [rows, q, filter]);

  const download = () => {
    const header = ["Keyword", "Type", "Status", "Date", "Grid", "Spacing (mi)", "Average rank", "Top 3 spots", "Found spots", "Total spots", "Share of Local Voice (%)"];
    const lines = shown.map((r) =>
      [r.keyword, r.kind === "autopilot" ? "Autopilot" : "One-time", r.status, r.iso, `${r.grid}x${r.grid}`, r.spacing, r.avg, r.top3, r.found, r.total, r.solv].map(csvCell).join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `map-scans-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[17px] font-bold">Scan history</h2>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink/35" />
            <input
              className={clsx(input, "!h-9 w-44 pl-8")}
              placeholder="Search…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setLimit(PAGE);
              }}
              aria-label="Search scans"
            />
          </label>
          <Segmented
            label="Scan type"
            value={filter}
            onChange={(v) => {
              setFilter(v);
              setLimit(PAGE);
            }}
            options={[
              { value: "all", label: "All" },
              { value: "one-time", label: "One-time" },
              { value: "autopilot", label: "Autopilot" },
            ]}
          />
          <button type="button" onClick={download} disabled={!shown.length} className="grid size-9 place-items-center rounded-lg border border-[#e4dcef] bg-white text-ink/65 hover:text-ink disabled:opacity-40" aria-label="Download CSV" title="Download CSV">
            <Download className="size-4" />
          </button>
        </div>
      </div>

      <Card className="mt-3 !p-0">
        {!rows.length ? (
          <EmptyState icon={Radar} title="No scans yet" text="Pick a keyword above to run your first check." />
        ) : !shown.length ? (
          <EmptyState icon={Search} tone="gray" title="No scans match" text="Try a different keyword or filter." />
        ) : (
          <>
            <div className="hidden grid-cols-[1fr_110px_90px_80px_80px_24px] gap-3 border-b border-[#ece6f4] px-5 py-2.5 text-[11px] font-bold tracking-wider text-ink/45 uppercase md:grid">
              <span>Keyword</span>
              <span>Date</span>
              <span>Area</span>
              <span className="text-right">Avg rank</span>
              <span className="text-right">Top 3</span>
              <span />
            </div>
            <ul className="divide-y divide-[#f1ecf7]">
              {shown.slice(0, limit).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/dashboard/scans?scan=${r.id}`}
                    scroll={false}
                    className={clsx(
                      "grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-3 transition-colors md:grid-cols-[1fr_110px_90px_80px_80px_24px]",
                      r.id === selectedId ? "bg-[#f6f0fb]" : "hover:bg-[#faf8fc]",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{r.keyword}</span>
                        <Badge tone={r.kind === "autopilot" ? "purple" : "gray"}>{r.kind === "autopilot" ? "Autopilot" : "One-time"}</Badge>
                      </span>
                      <span className="mt-0.5 block text-xs text-ink/50 md:hidden">
                        {r.date} · {r.grid}×{r.grid}
                      </span>
                    </span>
                    <span className="hidden text-xs text-ink/60 md:block">{r.date}</span>
                    <span className="hidden text-xs text-ink/60 md:block">
                      {r.grid}×{r.grid} · {r.spacing} mi
                    </span>
                    {r.status === "running" ? (
                      <span className="flex items-center justify-end gap-1.5 text-xs font-semibold text-brand-700 md:col-span-2">
                        <Loader2 className="size-3.5 animate-spin" /> Scanning…
                      </span>
                    ) : (
                      <>
                        <span className="text-right text-sm font-bold">
                          <RankText avg={r.avg} />
                        </span>
                        <span className="hidden text-right text-xs text-ink/60 md:block">
                          {r.top3}/{r.total}
                        </span>
                      </>
                    )}
                    <ChevronRight className="hidden size-4 text-ink/30 md:block" />
                  </Link>
                </li>
              ))}
            </ul>
            {shown.length > limit && (
              <div className="border-t border-[#ece6f4] p-3 text-center">
                <button type="button" className={clsx(btn.ghost)} onClick={() => setLimit((l) => l + PAGE)}>
                  Show more ({shown.length - limit} more)
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

function RankText({ avg }: { avg: number | null }) {
  if (avg === null) return <span className="text-ink/40">Not found</span>;
  return <span className={avg <= 3 ? "text-emerald-600" : avg <= 10 ? "text-amber-600" : "text-red-500"}>#{avg}</span>;
}
