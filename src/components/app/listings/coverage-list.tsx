"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, CheckCircle2, Copy, Loader2, RefreshCw, Wrench } from "lucide-react";
import { useAction } from "@/components/app/toast";
import { Badge, btn } from "@/components/app/ui";
import { ChipGroup } from "@/components/app/controls";
import { fixListingAction } from "@/app/actions/listings";
import type { DirectoryListing, ListingStatus } from "./directories";

const statusBadge: Record<ListingStatus, { label: string; tone: "teal" | "amber" | "red"; icon: typeof CheckCircle2 }> = {
  synced: { label: "Synced", tone: "teal", icon: CheckCircle2 },
  "needs-update": { label: "Needs update", tone: "amber", icon: AlertTriangle },
  duplicate: { label: "Duplicate", tone: "red", icon: Copy },
};

type Filter = "all" | ListingStatus;

export function CoverageList({ rows }: { rows: DirectoryListing[] }) {
  const { run, pending } = useAction();
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const open = rows.filter((r) => r.status !== "synced" && !(r.name === "Google" && r.issue?.includes("not connected"))).length;
  const shown = rows.filter((r) => filter === "all" || r.status === filter);
  const count = (s: ListingStatus) => rows.filter((r) => r.status === s).length;

  const fix = (name?: string) => {
    setBusy(name ?? "__all");
    run(() => fixListingAction(name), () => setBusy(null));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ChipGroup<Filter>
          label="Filter listings"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: `All (${rows.length})` },
            { value: "synced", label: `Synced (${count("synced")})` },
            { value: "needs-update", label: `Needs update (${count("needs-update")})` },
            { value: "duplicate", label: `Duplicates (${count("duplicate")})` },
          ]}
        />
        <button type="button" disabled={pending || open === 0} onClick={() => fix()} className={clsx(btn.primary, "!bg-teal-600 hover:!bg-teal-700")}>
          {busy === "__all" ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          {open ? `Fix all ${open}` : "All in sync"}
        </button>
      </div>

      <ul className="divide-y divide-[#f1ecf7] rounded-xl border border-[#ece6f4]">
        {shown.map((r) => {
          const b = statusBadge[r.status];
          const needsGoogle = r.name === "Google" && r.status !== "synced";
          return (
            <li key={r.name} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-sm font-bold text-teal-700">{r.name.slice(0, 1)}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {r.name} <span className="text-xs font-normal text-ink/45">{r.domain}</span>
                </span>
                <span className={clsx("block text-xs", r.issue ? "text-ink/60" : "text-ink/45")}>{r.issue ?? "Name, address, phone and hours match your Google profile."}</span>
              </span>
              <Badge tone="gray">{r.reach}</Badge>
              <Badge tone={b.tone} icon={b.icon}>
                {b.label}
              </Badge>
              <span className="w-[92px] text-right">
                {needsGoogle ? (
                  <Link href="/dashboard/gbp" className={clsx(btn.outline, btn.sm)}>
                    Connect
                  </Link>
                ) : r.status !== "synced" ? (
                  <button type="button" disabled={pending} onClick={() => fix(r.name)} className={clsx(btn.outline, btn.sm, "hover:!border-teal-400")}>
                    {busy === r.name ? <Loader2 className="size-3.5 animate-spin" /> : <Wrench className="size-3.5" />} Fix
                  </button>
                ) : (
                  <CheckCircle2 className="ml-auto size-5 text-teal-600" aria-label="In sync" />
                )}
              </span>
            </li>
          );
        })}
        {shown.length === 0 && <li className="px-4 py-8 text-center text-sm text-ink/55">Nothing here — every listing in this group is sorted.</li>}
      </ul>
    </div>
  );
}
