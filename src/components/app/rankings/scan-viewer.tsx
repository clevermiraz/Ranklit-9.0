import Link from "next/link";
import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, Loader2, Minus, X } from "lucide-react";
import { scanStats, type Scan } from "@/lib/app/types";
import { Badge, Card, Caps } from "@/components/app/ui";
import { MapBackdrop, RankGrid } from "@/components/rank-grid";
import { ScanKeywordButton } from "./scan-controls";
import { ScrollHere } from "./auto-refresh";
import { spacingLabel, toRows } from "./shared";

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Large map grid for one scan + its stats. */
export function ScanViewer({ scan, previous, explicit }: { scan: Scan; previous: Scan | null; explicit: boolean }) {
  const st = scanStats(scan.points);
  const prev = previous ? scanStats(previous.points) : null;
  const delta = st.avg !== null && prev?.avg != null ? Math.round((prev.avg - st.avg) * 10) / 10 : null; // + = improved

  return (
    <Card id="scan-result" className="scroll-mt-24">
      <ScrollHere key={scan.id} enabled={explicit} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Caps>Scan result</Caps>
          <h2 className="mt-1 flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight">
            {scan.keyword}
            <Badge tone={scan.kind === "autopilot" ? "purple" : "gray"}>{scan.kind === "autopilot" ? "Autopilot" : "One-time"}</Badge>
          </h2>
          <p className="mt-0.5 text-sm text-ink/55">
            {when(scan.createdAt)} · {scan.area.grid}×{scan.area.grid} grid · {spacingLabel(scan.area.spacing)} apart
          </p>
        </div>
        <div className="flex items-center gap-2">
          {scan.status === "completed" && <ScanKeywordButton keyword={scan.keyword} label="Rescan" />}
          <Link href="/dashboard/scans" scroll={false} className="grid size-8 place-items-center rounded-lg border border-[#ece6f4] text-ink/55 hover:text-ink" aria-label="Close scan result">
            <X className="size-4" />
          </Link>
        </div>
      </div>

      {scan.status === "running" ? (
        <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <MapBackdrop />
            <div className="relative grid size-full place-items-center p-[4%]" style={{ gridTemplateColumns: `repeat(${scan.area.grid}, minmax(0, 1fr))` }}>
              {Array.from({ length: scan.area.grid ** 2 }, (_, i) => (
                <span key={i} className="aspect-square w-[60%] animate-pulse rounded-full bg-brand-300/70 ring-2 ring-white" style={{ animationDelay: `${(i % 7) * 120}ms` }} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#f6f0fb] p-6 text-center">
            <Loader2 className="size-7 animate-spin text-brand-700" />
            <p className="mt-3 font-bold">Scanning {scan.area.grid ** 2} spots…</p>
            <p className="mt-1 text-sm text-ink/60">We&apos;re checking Google Maps from every point around your business. This page updates on its own.</p>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <RankGrid grid={toRows(scan.points, scan.area.grid)} size={scan.area.grid >= 7 ? "sm" : "lg"} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Average rank" value={st.avg === null ? "—" : `#${st.avg}`} sub={st.avg === null ? "Not found in the top 20" : "where you show up"}>
                {delta !== null && (
                  <span className={clsx("mt-1 inline-flex items-center gap-0.5 text-xs font-semibold", delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-500" : "text-ink/50")}>
                    {delta > 0 ? <ArrowUpRight className="size-3.5" /> : delta < 0 ? <ArrowDownRight className="size-3.5" /> : <Minus className="size-3.5" />}
                    {delta === 0 ? "Same as last scan" : `${Math.abs(delta)} ${delta > 0 ? "better" : "worse"} than last scan`}
                  </span>
                )}
              </Stat>
              <Stat label="Top 3 spots" value={`${st.top3}`} sub={`of ${st.total} spots`} />
              <Stat label="Found" value={`${st.found}`} sub={`of ${st.total} spots in the top 20`} />
              <Stat label="Share of Local Voice" value={`${st.solv}%`} sub="of spots where you're in the map pack" />
            </div>
            <div className="rounded-xl border border-[#ece6f4] p-4">
              <Caps>Legend</Caps>
              <ul className="mt-2 space-y-1.5 text-sm">
                <LegendRow className="bg-rank-good" label="Top 3 — this is where the calls go" count={st.top3} />
                <LegendRow className="bg-rank-mid" label="4 to 10" count={st.mid} />
                <LegendRow className="bg-rank-bad" label="11 or lower, or not found (20+)" count={st.total - st.top3 - st.mid} />
              </ul>
              <p className="mt-3 text-xs text-ink/50">Each pin is one spot on the map, numbered with where you ranked from there. The ringed pin in the middle is the scan center.</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value, sub, children }: { label: string; value: string; sub: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-3">
      <p className="text-xs text-ink/55">{label}</p>
      <p className="mt-0.5 text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="text-[11px] text-ink/50">{sub}</p>
      {children}
    </div>
  );
}

function LegendRow({ className, label, count }: { className: string; label: string; count: number }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className={clsx("size-3 shrink-0 rounded-full", className)} />
      <span className="flex-1">{label}</span>
      <span className="font-semibold text-ink/70">{count}</span>
    </li>
  );
}
