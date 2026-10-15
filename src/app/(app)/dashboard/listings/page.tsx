import type { Metadata } from "next";
import { AlertTriangle, Clock, Copy, Globe, ShieldCheck } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { syncedListings } from "@/lib/server/orders-store";
import { Card, CardHeader, EmptyState, PageHeader, ProgressBar, StatCard } from "@/components/app/ui";
import { consistencyScore, directoryCoverage } from "@/components/app/listings/directories";
import { CoverageList } from "@/components/app/listings/coverage-list";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Directory Listings" };

export default async function ListingsPage() {
  const { account, business } = await getApp();
  const header = (
    <PageHeader
      title="Listings"
      icon={Globe}
      iconClass="text-teal-600"
      subtitle="Get your business listed and consistent everywhere customers look — Google, Apple, Yelp, Bing and hundreds more."
    />
  );

  if (account.trialEndsAt) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-5">
        {header}
        <Card>
          <EmptyState
            icon={Clock}
            tone="teal"
            title="Your listings start when your trial converts"
            text="Listings management goes live on your first billing date — nothing is being published yet. Everything else on your plan is running now, and you'll see your directory coverage appear here automatically."
          />
        </Card>
      </div>
    );
  }

  const p = business.profile;
  const rows = directoryCoverage(p.id, p.connected, syncedListings(p.id));
  const score = consistencyScore(rows);
  const needs = rows.filter((r) => r.status === "needs-update").length;
  const dupes = rows.filter((r) => r.status === "duplicate").length;

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      {header}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Consistency score" value={`${score}%`} icon={ShieldCheck} tone="teal">
          <ProgressBar value={score} tone="green" className="mt-2" />
        </StatCard>
        <StatCard label="Needs update" value={needs} icon={AlertTriangle} tone="amber" sub="Details don't match your Google profile" />
        <StatCard label="Duplicates" value={dupes} icon={Copy} tone="red" sub="Extra listings splitting your reviews" />
      </div>

      <Card>
        <CardHeader
          icon={Globe}
          tone="teal"
          title="Directory coverage"
          description={`${rows.length - needs - dupes} of ${rows.length} directories match your Google profile. Fixing one pushes your current details and merges duplicates.`}
        />
        <div className="mt-4 rounded-xl bg-teal-50/60 px-4 py-3 text-sm">
          <p className="text-[11px] font-bold tracking-[0.12em] text-teal-800/70 uppercase">Details we publish</p>
          <p className="mt-1 font-semibold">{p.name}</p>
          <p className="text-ink/65">
            {p.address} · {p.phone} · {p.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </p>
        </div>
        <div className="mt-4">
          <CoverageList rows={rows} />
        </div>
      </Card>
    </div>
  );
}
