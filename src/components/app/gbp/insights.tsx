"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, Download, Minus, RefreshCw } from "lucide-react";
import type { InsightDay } from "@/lib/app/types";
import { useToast } from "@/components/app/toast";
import { HBarChart, LineChart } from "@/components/app/charts";
import { btn, Card, Caps } from "@/components/app/ui";

type Key = keyof Omit<InsightDay, "date">;

const ACTIONS: { key: Key; label: string; color: string }[] = [
  { key: "websiteClicks", label: "Website clicks", color: "#3b82f6" },
  { key: "calls", label: "Calls", color: "#10b981" },
  { key: "directions", label: "Directions", color: "#f59e0b" },
  { key: "messages", label: "Messages", color: "#ef4444" },
  { key: "bookings", label: "Bookings", color: "#f97316" },
];
const VIEWS: { key: Key; label: string; color: string }[] = [
  { key: "desktopMaps", label: "Desktop Maps", color: "#8d3ebb" },
  { key: "desktopSearch", label: "Desktop Search", color: "#3b82f6" },
  { key: "mobileMaps", label: "Mobile Maps", color: "#c4a5e8" },
  { key: "mobileSearch", label: "Mobile Search", color: "#10b981" },
];
const PERIODS = [7, 14, 28, 42] as const;

const short = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const sum = (days: InsightDay[], keys: Key[]) => days.reduce((a, d) => a + keys.reduce((b, k) => b + d[k], 0), 0);
const span = (n: number) => (n % 7 === 0 ? `${n / 7 === 1 ? "week" : `${n / 7} weeks`}` : `${n} days`);

/** % change on per-day averages, so a shorter comparison window is still fair. */
function change(now: number, nowDays: number, before: number, beforeDays: number) {
  if (!beforeDays) return null;
  const a = now / nowDays;
  const b = before / beforeDays;
  if (b === 0) return a === 0 ? 0 : 100;
  return ((a - b) / b) * 100;
}

function Chip({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="rounded-full bg-ink/[0.05] px-2 py-0.5 text-[11px] font-semibold text-ink/50">no comparison</span>;
  const r = Math.round(pct * 10) / 10;
  const Icon = r > 0 ? ArrowUpRight : r < 0 ? ArrowDownRight : Minus;
  return (
    <span className={clsx("inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold", r > 0 ? "bg-emerald-50 text-emerald-700" : r < 0 ? "bg-red-50 text-red-700" : "bg-ink/[0.05] text-ink/55")}>
      <Icon className="size-3" />
      {r > 0 ? "+" : ""}
      {r.toFixed(1)}%
    </span>
  );
}

function Legend({ items, hidden, onToggle }: { items: { key: string; label: string; color: string }[]; hidden?: Set<string>; onToggle?: (k: string) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((s) => {
        const off = hidden?.has(s.key);
        const inner = (
          <>
            <span className="size-2.5 rounded-full" style={{ background: off ? "#d6cfe0" : s.color }} />
            <span className={clsx(off && "text-ink/35 line-through")}>{s.label}</span>
          </>
        );
        return onToggle ? (
          <button key={s.key} type="button" onClick={() => onToggle(s.key)} aria-pressed={!off} className="flex items-center gap-1.5 rounded-md px-1 text-xs font-medium hover:bg-[#f8f6fb]">
            {inner}
          </button>
        ) : (
          <span key={s.key} className="flex items-center gap-1.5 text-xs font-medium">
            {inner}
          </span>
        );
      })}
    </div>
  );
}

export function Insights({ days, fetchedAt, businessName }: { days: InsightDay[]; fetchedAt: string; businessName: string }) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(28);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [lastFetched, setLastFetched] = useState(fetchedAt);
  const [refreshing, setRefreshing] = useState(false);
  const { push } = useToast();
  const router = useRouter();

  const w = useMemo(() => {
    const n = days.length;
    const cur = days.slice(Math.max(0, n - period));
    const prev = days.slice(Math.max(0, n - 2 * period), Math.max(0, n - period));
    return { cur, prev };
  }, [days, period]);

  const { cur, prev } = w;
  const labels = cur.map((d) => short(d.date));
  const vs = prev.length ? `vs the ${span(prev.length)} before` : "no earlier data yet";
  const actionKeys = ACTIONS.map((a) => a.key);
  const viewKeys = VIEWS.map((v) => v.key);
  const interactions = sum(cur, actionKeys);
  const views = sum(cur, viewKeys);

  const refresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setRefreshing(false);
      setLastFetched(new Date().toISOString());
      push({ kind: "ok", text: "Performance refreshed. Google's latest numbers are loaded." });
    }, 900);
  };

  const exportCsv = () => {
    const header = ["Date", ...ACTIONS.map((a) => a.label), ...VIEWS.map((v) => v.label)];
    const rows = cur.map((d) => [d.date, ...actionKeys.map((k) => d[k]), ...viewKeys.map((k) => d[k])]);
    const totals = ["Total", ...actionKeys.map((k) => sum(cur, [k])), ...viewKeys.map((k) => sum(cur, [k]))];
    const csv = [header, ...rows, totals].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-performance-${cur[0]?.date}-to-${cur.at(-1)?.date}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    push({ kind: "ok", text: `Exported ${cur.length} days to CSV.` });
  };

  if (!cur.length) return null;
  const first = cur[0].date;
  const last = cur.at(-1)!.date;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] leading-tight font-extrabold tracking-tight">Performance</h1>
          <p className="mt-1 max-w-3xl text-[15px] leading-relaxed text-ink/60">
            Your Google numbers from {short(first)} to {short(last)}
            {prev.length ? `, compared with the ${span(prev.length)} before.` : ". There's no earlier data to compare with yet."}
          </p>
          <p className="text-sm text-ink/45">Google numbers through {short(last)}. Google reports a few days behind.</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block">
            <Caps className="mb-1">Reporting period</Caps>
            <select value={period} onChange={(e) => setPeriod(Number(e.target.value) as (typeof PERIODS)[number])} className="h-9 rounded-full border border-[#e4dcef] bg-white px-3 text-sm font-semibold outline-none focus:border-brand-600">
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p} days
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={refresh} disabled={refreshing} className={clsx(btn.outline, "!py-1.5")}>
            <RefreshCw className={clsx("size-4", refreshing && "animate-spin")} /> Refresh
          </button>
          <button type="button" onClick={exportCsv} className={clsx(btn.outline, "!py-1.5")}>
            <Download className="size-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ACTIONS.map((a) => {
          const now = sum(cur, [a.key]);
          return (
            <Card key={a.key} className="!p-4">
              <p className="flex items-center gap-1.5 text-sm text-ink/60">
                <span className="size-2 rounded-full" style={{ background: a.color }} /> {a.label}
              </p>
              <p className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-extrabold">{now}</span>
                <Chip pct={change(now, cur.length, sum(prev, [a.key]), prev.length)} />
              </p>
              <p className="mt-0.5 text-xs text-ink/45">{vs}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[17px] font-bold">Interactions</h2>
          <span className="text-[17px] font-extrabold">{interactions}</span>
          <Chip pct={change(interactions, cur.length, sum(prev, actionKeys), prev.length)} />
          <span className="text-xs text-ink/45">{vs}</span>
        </div>
        <p className="mt-0.5 text-sm text-ink/60">People who called, requested directions, clicked your website, messaged, or booked.</p>
        <LineChart className="mt-4" labels={labels} series={[{ name: "Interactions", color: "#8d3ebb", values: cur.map((d) => actionKeys.reduce((a, k) => a + d[k], 0)) }]} />
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[17px] font-bold">Searches &amp; views</h2>
          <span className="text-[17px] font-extrabold">{views}</span>
          <Chip pct={change(views, cur.length, sum(prev, viewKeys), prev.length)} />
          <span className="text-xs text-ink/45">{vs}</span>
        </div>
        <p className="mt-0.5 text-sm text-ink/60">Times your profile appeared in Google Search or Maps results, split by device and surface.</p>
        <LineChart className="mt-4" stacked labels={labels} series={VIEWS.map((v) => ({ name: v.label, color: v.color, values: cur.map((d) => d[v.key]) }))} />
        <Legend items={VIEWS} />
      </Card>

      <Card>
        <h2 className="text-[17px] font-bold">Customer actions</h2>
        <p className="mt-0.5 text-sm text-ink/60">What people did after finding your business. Click a legend item to toggle a series.</p>
        {ACTIONS.some((a) => !hidden.has(a.key)) ? (
          <LineChart className="mt-4" labels={labels} series={ACTIONS.filter((a) => !hidden.has(a.key)).map((a) => ({ name: a.label, color: a.color, values: cur.map((d) => d[a.key]) }))} />
        ) : (
          <p className="mt-4 grid h-[220px] place-items-center rounded-xl bg-[#f8f6fb] text-sm text-ink/50">All series hidden. Click a legend item to show it.</p>
        )}
        <Legend
          items={ACTIONS}
          hidden={hidden}
          onToggle={(k) =>
            setHidden((h) => {
              const next = new Set(h);
              if (next.has(k)) next.delete(k);
              else next.add(k);
              return next;
            })
          }
        />
      </Card>

      <Card>
        <h2 className="text-[17px] font-bold">Platforms and devices customers used to view your profile</h2>
        <p className="mt-0.5 text-sm text-ink/60">Total impressions in the selected range, broken down by device and Google surface.</p>
        <div className="mt-4">
          <HBarChart
            rows={[...VIEWS].reverse().map((v) => ({ label: v.label, value: sum(cur, [v.key]), color: v.color }))}
          />
        </div>
      </Card>

      <p className="text-xs text-ink/45" suppressHydrationWarning>
        Data source: cache · last fetched {new Date(lastFetched).toLocaleString("en-GB", { hour12: true })}
      </p>
    </div>
  );
}
