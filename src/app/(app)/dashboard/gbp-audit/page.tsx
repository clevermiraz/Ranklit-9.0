import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { Camera, Clock, FileText, MessageSquare, Send, ShieldCheck, Star, Store, Tag, Wrench } from "lucide-react";
import { getApp } from "@/lib/server/app";
import type { AuditDimension } from "@/lib/app/types";
import { Badge, btn, Card, EmptyState, PageHeader, formatDate } from "@/components/app/ui";
import { FixButton, RunAuditButton } from "@/components/app/gbp/audit";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Profile Audit" };

const ICONS: Record<string, typeof Store> = {
  Description: FileText,
  Categories: Tag,
  Services: Wrench,
  Hours: Clock,
  Photos: Camera,
  Reviews: Star,
  "Review replies": MessageSquare,
  Posts: Send,
  "Business information": Store,
};

const STATUS = {
  good: { label: "Good", tone: "green", bar: "bg-emerald-500", border: "border-l-emerald-500", text: "text-emerald-600" },
  warn: { label: "Needs work", tone: "amber", bar: "bg-amber-500", border: "border-l-amber-500", text: "text-amber-600" },
  bad: { label: "Critical", tone: "red", bar: "bg-red-500", border: "border-l-red-500", text: "text-red-600" },
} as const;

/** Where a non-fixable dimension can be handled in the app. */
const LINKS: Record<string, { href: string; label: string }> = {
  Services: { href: "/dashboard/gbp?tab=services", label: "Edit services" },
  Hours: { href: "/dashboard/gbp?tab=hours", label: "Edit hours" },
  Photos: { href: "/dashboard/gbp/posts?tab=photos", label: "Upload photos" },
  Reviews: { href: "/dashboard/get-reviews", label: "Get reviews" },
  "Review replies": { href: "/dashboard/reviews", label: "Reply to reviews" },
  Posts: { href: "/dashboard/gbp/posts?compose=1", label: "Create a post" },
};

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const color = score >= 85 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative size-[132px] shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f3e8fb" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(c * score) / 100} ${c}`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-3xl font-extrabold">{score}</p>
          <p className="text-[10px] font-bold tracking-wider text-ink/45 uppercase">Health score</p>
        </div>
      </div>
    </div>
  );
}

export default async function GbpAuditPage() {
  const { business: s } = await getApp();
  const audit = s.audit;
  const connected = s.profile.connected;
  const hasDescSuggestion = s.suggestions.some((x) => x.field === "description");

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <PageHeader
        title="Profile Audit"
        subtitle="AI scan of your GBP across 8 dimensions, with one-click fixes for description + categories."
        actions={connected ? <RunAuditButton label={audit ? "Re-run audit" : "Run audit"} /> : undefined}
      />

      {!connected ? (
        <EmptyState dashed icon={ShieldCheck} tone="fuchsia" title="Connect Google to run an audit" text="The audit reads your live Google Business Profile, so link it first. It only takes a minute.">
          <Link href="/dashboard/gbp" className={btn.fuchsia}>
            Connect Google Business Profile
          </Link>
        </EmptyState>
      ) : !audit ? (
        <EmptyState
          dashed
          icon={ShieldCheck}
          tone="fuchsia"
          title="Run your first GBP Audit"
          text="Our AI will analyze your Google Business Profile across 8 key areas and provide a health score with actionable recommendations you can apply with one click."
        >
          <RunAuditButton label="Run GBP Audit" size="lg" />
        </EmptyState>
      ) : (
        <>
          <Card className="flex flex-wrap items-center gap-6 !p-6">
            <ScoreRing score={audit.score} />
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold tracking-tight">
                {audit.score >= 85 ? "Your profile is in great shape" : audit.score >= 60 ? "A few fixes will lift your profile" : "Your profile needs attention"}
              </p>
              <p className="mt-1 text-sm text-ink/60" suppressHydrationWarning>
                Last audited {formatDate(audit.runAt, "long")} · {s.profile.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["good", "warn", "bad"] as const).map((st) => {
                  const n = audit.dimensions.filter((d) => d.status === st).length;
                  return (
                    <Badge key={st} tone={STATUS[st].tone}>
                      {n} {STATUS[st].label.toLowerCase()}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {[...audit.dimensions]
              .sort((a, b) => a.score - b.score)
              .map((d) => (
                <DimensionCard key={d.name} d={d} hasDescSuggestion={hasDescSuggestion} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function DimensionCard({ d, hasDescSuggestion }: { d: AuditDimension; hasDescSuggestion: boolean }) {
  const st = STATUS[d.status];
  const Icon = ICONS[d.name] ?? Store;
  const fixable = d.status !== "good" && (d.name === "Description" || d.name === "Categories");
  const link = d.status !== "good" ? LINKS[d.name] : undefined;
  return (
    <Card className={clsx("border-l-4", st.border)}>
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-fuchsia-50 text-fuchsia-600">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold">{d.name}</p>
            <span className={clsx("text-sm font-extrabold", st.text)}>
              {d.score}
              <span className="text-xs font-semibold text-ink/40">/100</span>
            </span>
          </div>
          <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[#f3eef8]">
            <span className={clsx("block h-full rounded-full", st.bar)} style={{ width: `${d.score}%` }} />
          </span>
          <div className="mt-2.5">
            <Badge tone={st.tone}>{st.label}</Badge>
          </div>
          <p className="mt-2 text-sm text-ink/75">{d.finding}</p>
          <p className="mt-1 text-sm text-ink/55">
            <span className="font-semibold text-ink/70">Fix: </span>
            {d.fix}
          </p>
          {(fixable || link) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {fixable &&
                (d.name === "Description" && hasDescSuggestion ? (
                  <Link href="/dashboard/gbp" className={clsx(btn.outline, btn.sm)}>
                    Review suggested rewrite
                  </Link>
                ) : (
                  <FixButton kind={d.name === "Description" ? "description" : "categories"} />
                ))}
              {link && (
                <Link href={link.href} className={clsx(btn.outline, btn.sm)}>
                  {link.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
