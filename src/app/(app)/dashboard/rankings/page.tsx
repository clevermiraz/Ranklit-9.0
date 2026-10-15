import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, ExternalLink, Loader2, MapPin, Minus, Sparkles, Star, Target, TrendingUp } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { scanStats, type BusinessState, type Scan } from "@/lib/app/types";
import { Badge, Card, CardHeader, EmptyState, IconTile, ProgressBar, PageHeader, btn, timeAgo } from "@/components/app/ui";
import { LineChart, Sparkline } from "@/components/app/charts";
import { AutoRefresh } from "@/components/app/rankings/auto-refresh";
import { ScanKeywordButton } from "@/components/app/rankings/scan-controls";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Rankings" };

type KeywordRow = {
  keyword: string;
  role: "main" | "secondary" | null;
  volume: number | null;
  latest: Scan | null;
  avg: number | null;
  top3Pct: number | null;
  delta: number | null; // + = improved (moved up)
  history: number[]; // average position per scan, oldest first (21 = not found)
  scans: number;
  running: boolean;
};

function buildRows(s: BusinessState): KeywordRow[] {
  const norm = (k: string) => k.trim().toLowerCase();
  const tracked = s.strategy.keywords.filter((k) => k.checked).sort((a, b) => (a.role === b.role ? 0 : a.role === "main" ? -1 : 1));
  const names = [...new Set([...tracked.map((k) => norm(k.term)), ...s.scans.map((x) => norm(x.keyword))])];
  return names.map((name) => {
    const meta = tracked.find((k) => norm(k.term) === name) ?? s.strategy.keywords.find((k) => norm(k.term) === name);
    const done = s.scans.filter((x) => norm(x.keyword) === name && x.status === "completed").sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const latest = done.at(-1) ?? null;
    const prev = done.at(-2) ?? null;
    const st = latest ? scanStats(latest.points) : null;
    const pst = prev ? scanStats(prev.points) : null;
    return {
      keyword: name,
      role: meta?.role ?? null,
      volume: meta?.volume ?? null,
      latest,
      avg: st?.avg ?? null,
      top3Pct: st ? Math.round((st.top3 / st.total) * 100) : null,
      delta: st?.avg != null && pst?.avg != null ? Math.round((pst.avg - st.avg) * 10) / 10 : null,
      history: done.map((x) => scanStats(x.points).avg ?? 21),
      scans: done.length,
      running: s.scans.some((x) => norm(x.keyword) === name && x.status === "running"),
    };
  });
}

/** Top-3 coverage (% of all checked spots in the map pack), per scan day. */
function coverageTrend(s: BusinessState) {
  const byDay = new Map<string, { top3: number; total: number }>();
  for (const x of [...s.scans].filter((x) => x.status === "completed").sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    const day = x.createdAt.slice(0, 10);
    const st = scanStats(x.points);
    const cur = byDay.get(day) ?? { top3: 0, total: 0 };
    byDay.set(day, { top3: cur.top3 + st.top3, total: cur.total + st.total });
  }
  const days = [...byDay.entries()];
  return {
    labels: days.map(([d]) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    values: days.map(([, v]) => Math.round((v.top3 / Math.max(1, v.total)) * 100)),
  };
}

const rankColor = (avg: number | null) => (avg === null ? "text-ink/40" : avg <= 3 ? "text-emerald-600" : avg <= 10 ? "text-amber-600" : "text-red-500");

export default async function RankingsPage() {
  const { business: s } = await getApp();
  const rows = buildRows(s);
  const scanned = rows.filter((r) => r.latest);
  const running = s.scans.some((x) => x.status === "running");
  const lastScan = scanned.map((r) => r.latest!.createdAt).sort().at(-1) ?? null;
  const avgPos = scanned.filter((r) => r.avg !== null).length
    ? Math.round((scanned.filter((r) => r.avg !== null).reduce((a, r) => a + r.avg!, 0) / scanned.filter((r) => r.avg !== null).length) * 10) / 10
    : null;
  const coverage = scanned.length ? Math.round(scanned.reduce((a, r) => a + (r.top3Pct ?? 0), 0) / scanned.length) : null;
  const improved = scanned.filter((r) => (r.delta ?? 0) > 0).length;
  const trend = coverageTrend(s);

  return (
    <div className="mx-auto max-w-[1000px] space-y-5">
      <AutoRefresh active={running} />
      <PageHeader
        title="Rankings"
        subtitle="Where you stand on Google Maps for every keyword you track."
        actions={
          <Link href="/dashboard/scans" className={btn.outline}>
            <Sparkles className="size-4 text-brand-700" /> Run a fresh scan <ExternalLink className="size-3.5 text-ink/45" />
          </Link>
        }
      />

      <Card className="flex flex-wrap items-center gap-4">
        <IconTile icon={TrendingUp} size="lg" />
        {scanned.length ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-[20px] font-bold tracking-tight">
                Average position <span className={rankColor(avgPos)}>{avgPos === null ? "—" : `#${avgPos}`}</span> across {scanned.length} keyword{scanned.length === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-ink/60">
                {improved ? `${improved} keyword${improved === 1 ? "" : "s"} moved up since the previous scan. ` : ""}
                Last scanned {lastScan ? timeAgo(lastScan) : "—"}.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Mini label="Keywords" value={`${rows.length}`} />
              <Mini label="Top-3 coverage" value={coverage === null ? "—" : `${coverage}%`} />
              <Mini label="Scans run" value={`${s.scans.filter((x) => x.status === "completed").length}`} />
            </div>
          </>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-bold tracking-tight">No rankings tracked yet</p>
            <p className="text-sm text-ink/60">{running ? "Your first scan is running — results land here in a few seconds." : "Run your first scan to see where you rank."}</p>
          </div>
        )}
      </Card>

      {!rows.length ? (
        <Card>
          <EmptyState icon={Target} title="No keywords tracked yet" text="Add keywords on your strategy page, then run a scan to see where you rank.">
            <Link href="/dashboard/scans" className={btn.primary}>
              Run a scan
            </Link>
          </EmptyState>
        </Card>
      ) : (
        <Card className="!p-0">
          <div className="px-5 pt-5 pb-3">
            <CardHeader
              icon={MapPin}
              title="Keyword rankings"
              description="Average map position from your latest scan of each keyword, and how it moved since the scan before."
              actions={
                <Link href="/dashboard/strategy" className="text-sm font-semibold text-brand-700 hover:underline">
                  Manage keywords →
                </Link>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-y border-[#ece6f4] text-left text-[11px] font-bold tracking-wider text-ink/45 uppercase">
                  <th className="px-5 py-2.5">Keyword</th>
                  <th className="px-3 py-2.5 text-right">Position</th>
                  <th className="px-3 py-2.5">Change</th>
                  <th className="px-3 py-2.5">Top-3 coverage</th>
                  <th className="px-3 py-2.5">Trend</th>
                  <th className="px-3 py-2.5">Last scanned</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1ecf7]">
                {rows.map((r) => (
                  <tr key={r.keyword} className="hover:bg-[#faf8fc]">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2 font-semibold">
                        {r.keyword}
                        {r.role === "main" && (
                          <Badge icon={Star} tone="purple">
                            Main
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-ink/45">{r.volume ? `${r.volume.toLocaleString()} searches/mo` : r.role ? "No search data" : "One-off scan"}</span>
                    </td>
                    <td className={clsx("px-3 py-3 text-right text-lg font-extrabold", rankColor(r.avg))}>{r.latest ? (r.avg === null ? "20+" : `#${r.avg}`) : "—"}</td>
                    <td className="px-3 py-3">
                      <Change delta={r.delta} scanned={!!r.latest} />
                    </td>
                    <td className="px-3 py-3">
                      {r.top3Pct === null ? (
                        <span className="text-xs text-ink/40">—</span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ProgressBar value={r.top3Pct} tone="green" className="w-20" />
                          <span className="text-xs font-semibold">{r.top3Pct}%</span>
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {r.history.length > 1 ? (
                        <span className="flex items-center gap-2" title={`Average position by scan: ${r.history.map((h) => (h === 21 ? "20+" : `#${h}`)).join(" → ")}`}>
                          <Sparkline values={r.history.map((h) => 21 - h)} className="h-8 w-24" color="#8d3ebb" />
                          <span className="text-xs text-ink/45">{r.scans} scans</span>
                        </span>
                      ) : (
                        <span className="text-xs text-ink/40">{r.scans === 1 ? "1 scan" : "—"}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-ink/60">
                      {r.running ? (
                        <span className="flex items-center gap-1 font-semibold text-brand-700">
                          <Loader2 className="size-3.5 animate-spin" /> Scanning…
                        </span>
                      ) : r.latest ? (
                        timeAgo(r.latest.createdAt)
                      ) : (
                        "Not scanned yet"
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {r.latest ? (
                        <Link href={`/dashboard/scans?scan=${r.latest.id}`} className={clsx(btn.outline, btn.sm)}>
                          View map
                        </Link>
                      ) : (
                        !r.running && <ScanKeywordButton keyword={r.keyword} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {trend.values.length > 1 && (
        <Card>
          <CardHeader icon={TrendingUp} title="Top-3 coverage over time" description="Share of all scanned spots where you showed up in the map pack (positions 1–3), by scan day." />
          <LineChart labels={trend.labels} series={[{ name: "Top-3 coverage (%)", color: "#8d3ebb", values: trend.values }]} height={200} className="mt-4" />
        </Card>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#ece6f4] bg-[#f8f6fb] px-3 py-2">
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-[11px] text-ink/50">{label}</p>
    </div>
  );
}

function Change({ delta, scanned }: { delta: number | null; scanned: boolean }) {
  if (!scanned) return <span className="text-xs text-ink/40">—</span>;
  if (delta === null) return <Badge tone="gray">New</Badge>;
  if (delta === 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-ink/50">
        <Minus className="size-3.5" /> Same
      </span>
    );
  return (
    <span className={clsx("inline-flex items-center gap-0.5 text-xs font-semibold", delta > 0 ? "text-emerald-600" : "text-red-500")}>
      {delta > 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {Math.abs(delta)} {delta > 0 ? "up" : "down"}
    </span>
  );
}
