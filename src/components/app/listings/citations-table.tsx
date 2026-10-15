"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { ArrowUpRight, CheckCircle2, Clock, Search } from "lucide-react";
import type { Citation } from "@/lib/app/types";
import { Badge, input } from "@/components/app/ui";
import { ChipGroup, Segmented } from "@/components/app/controls";

/** Directories we submit to as part of the paid "premium citations" package. */
export const PREMIUM_DIRECTORIES = ["Apple Maps", "Bing Places", "BBB", "Data Axle", "Neustar Localeze"];

type Tier = "free" | "premium";
type StatusFilter = "all" | "built" | "pending";

export function CitationsTable({ citations }: { citations: Citation[] }) {
  const [tier, setTier] = useState<Tier>("free");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");

  const byTier = useMemo(() => {
    const premium = citations.filter((c) => PREMIUM_DIRECTORIES.includes(c.directory));
    const free = citations.filter((c) => !PREMIUM_DIRECTORIES.includes(c.directory));
    return { free, premium };
  }, [citations]);

  const rows = byTier[tier]
    .filter((c) => status === "all" || c.status === status)
    .filter((c) => c.directory.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Citation type"
          value={tier}
          onChange={(v) => setTier(v)}
          options={[
            { value: "free", label: `Free Citations (${byTier.free.length})` },
            { value: "premium", label: `Premium Citations (${byTier.premium.length})` },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <ChipGroup<StatusFilter>
            label="Filter by status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All" },
              { value: "built", label: "Built" },
              { value: "pending", label: "Pending" },
            ]}
          />
          <label className="relative block w-56">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search directories" aria-label="Search directories" className={clsx(input, "!h-9 pl-9")} />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[#ece6f4] text-left">
              <th className="px-2 py-2.5 font-semibold">Directory</th>
              <th className="px-2 py-2.5 font-semibold">Status</th>
              <th className="px-2 py-2.5 font-semibold">Listing</th>
              <th className="px-2 py-2.5 text-right font-semibold">Date added</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-[#f1ecf7] last:border-0">
                <td className="px-2 py-2.5 font-medium">{c.directory}</td>
                <td className="px-2 py-2.5">
                  {c.status === "built" ? (
                    <Badge tone="teal" variant="solid" icon={CheckCircle2}>built</Badge>
                  ) : (
                    <Badge tone="gray" icon={Clock}>pending</Badge>
                  )}
                </td>
                <td className="px-2 py-2.5">
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-teal-700 hover:underline">
                      View listing <ArrowUpRight className="size-3.5" />
                    </a>
                  ) : (
                    <span className="text-ink/45">Being submitted</span>
                  )}
                </td>
                <td suppressHydrationWarning className="px-2 py-2.5 text-right text-ink/55">{new Date(c.addedAt).toLocaleDateString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-10 text-center text-sm text-ink/55">
            {byTier[tier].length === 0
              ? tier === "premium"
                ? "No premium citations yet. They're included with the Growth plan and the Local Ranking Accelerator."
                : "No free citations yet."
              : "No directories match your filters."}
          </p>
        )}
      </div>
    </div>
  );
}
