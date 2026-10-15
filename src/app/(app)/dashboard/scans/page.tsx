import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { getApp } from "@/lib/server/app";
import { getScanCenter } from "@/lib/server/rankings-store";
import { scanAreaInfo, scanStats, type BusinessState, type Scan } from "@/lib/app/types";
import { Card, PageHeader } from "@/components/app/ui";
import { AutoRefresh } from "@/components/app/rankings/auto-refresh";
import { ScanAreaButton } from "@/components/app/rankings/scan-area";
import { RunAllButton, ScanBox } from "@/components/app/rankings/scan-controls";
import { ScanHistory, type HistoryRow } from "@/components/app/rankings/scan-history";
import { ScanViewer } from "@/components/app/rankings/scan-viewer";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Map Scans" };

const dayNames = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" } as const;

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function autoScanStatus(s: BusinessState, keywords: number) {
  const { weeklyScan, autopilot, automations } = s;
  if (autopilot && automations.autoScan && weeklyScan.enabled) {
    return {
      on: true,
      text: `Auto-scans on · every ${dayNames[weeklyScan.day]} · ${weeklyScan.grid}×${weeklyScan.grid} grid · ${keywords} keyword${keywords === 1 ? "" : "s"}`,
    };
  }
  if (weeklyScan.enabled && automations.autoScan && !autopilot) return { on: false, text: "Auto-scans paused · turn on autopilot from the sidebar to scan on a schedule" };
  if (autopilot && (!weeklyScan.enabled || !automations.autoScan)) return { on: false, text: "Auto-scans off · set up weekly scans to track your rank on a schedule" };
  return { on: false, text: "Auto-scans off · turn on autopilot from the sidebar to scan on a schedule" };
}

export default async function MapScansPage(props: PageProps<"/dashboard/scans">) {
  const { account, business: s } = await getApp();
  const sp = await props.searchParams;
  const wanted = typeof sp.scan === "string" ? sp.scan : null;

  const info = scanAreaInfo(s.scanArea);
  const checked = s.strategy.keywords.filter((k) => k.checked);
  const saved = [...new Set([...s.strategy.keywords.map((k) => k.term), ...s.strategy.targetKeywords].map((k) => k.trim().toLowerCase()).filter(Boolean))];

  const sorted = [...s.scans].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const running = sorted.some((x) => x.status === "running");
  const explicit = wanted ? sorted.find((x) => x.id === wanted) ?? null : null;
  const selected = explicit ?? sorted[0] ?? null; // newest scan (shows live progress right after "Scan")
  const previous = selected ? sorted.find((x) => x.keyword === selected.keyword && x.status === "completed" && x.createdAt < selected.createdAt) ?? null : null;

  const rows: HistoryRow[] = sorted.map((x: Scan) => {
    const st = scanStats(x.points);
    return {
      id: x.id,
      keyword: x.keyword,
      kind: x.kind,
      status: x.status,
      date: shortDate(x.createdAt),
      iso: x.createdAt,
      grid: x.area.grid,
      spacing: x.area.spacing,
      avg: x.status === "completed" ? st.avg : null,
      top3: st.top3,
      found: st.found,
      total: x.area.grid * x.area.grid,
      solv: st.solv,
    };
  });

  const auto = autoScanStatus(s, checked.length);

  return (
    <div className="mx-auto max-w-[1000px] space-y-5">
      <AutoRefresh active={running} />
      <PageHeader
        title="Map Scans"
        subtitle="See where you rank on the map around your business."
        actions={
          <>
            <ScanAreaButton area={s.scanArea} center={getScanCenter(s.profile.id)} maxGrid={account.maxGrid} />
            <RunAllButton count={checked.length} cost={checked.length * info.creditsPerKeyword} />
          </>
        }
      />

      <Card>
        <ScanBox saved={saved} perKeyword={info.creditsPerKeyword} credits={account.credits} firstFree={s.scans.length === 0} />
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 !py-3">
        <p className="flex items-center gap-2 text-sm text-ink/70">
          <span className={clsx("size-2 shrink-0 rounded-full", auto.on ? "bg-emerald-500" : "bg-ink/25")} />
          {auto.text}
        </p>
        <Link href="/settings/automations" className="text-sm font-semibold text-brand-700 hover:underline">
          Manage schedule →
        </Link>
      </Card>

      {selected && <ScanViewer key={selected.id} scan={selected} previous={previous} explicit={!!explicit} />}

      <ScanHistory rows={rows} selectedId={selected?.id ?? null} />
    </div>
  );
}
