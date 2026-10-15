import type { Metadata } from "next";
import { Bell, CheckCircle2, History } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { Card, CardHeader, EmptyState, PageHeader, formatDate, timeAgo } from "@/components/app/ui";
import { AlertRow, ResolveAllButton } from "@/components/app/settings/alerts";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Alerts" };

function when(iso: string, resolvedAt: string | null) {
  const now = Date.now();
  return resolvedAt ? `Raised ${formatDate(iso)} · resolved ${timeAgo(resolvedAt, now)}` : `${timeAgo(iso, now)} · ${formatDate(iso, "long")}`;
}

export default async function AlertsPage() {
  const { business } = await getApp();
  const byNewest = [...business.alerts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const active = byNewest.filter((a) => !a.resolvedAt);
  const resolved = byNewest.filter((a) => a.resolvedAt).sort((a, b) => b.resolvedAt!.localeCompare(a.resolvedAt!));

  return (
    <div className="mx-auto max-w-[944px] space-y-5">
      <PageHeader title="Alerts" subtitle="Important notifications about your SEO performance" />

      <Card>
        <CardHeader icon={Bell} title="Active Alerts" description="Issues that need your attention" badge={active.length > 0 ? <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white">{active.length}</span> : undefined} actions={active.length > 1 ? <ResolveAllButton /> : undefined} />
        {active.length === 0 ? (
          <EmptyState icon={CheckCircle2} tone="green" title="All clear!" text="No active alerts. Your bot is running smoothly." />
        ) : (
          <ul className="mt-4 space-y-2">
            {active.map((a) => (
              <AlertRow key={a.id} alert={a} when={when(a.createdAt, null)} />
            ))}
          </ul>
        )}
      </Card>

      {resolved.length > 0 && (
        <Card>
          <CardHeader icon={History} tone="gray" title="Resolved" description="Alerts you or your bot have already dealt with" />
          <ul className="mt-4 space-y-2">
            {resolved.map((a) => (
              <AlertRow key={a.id} alert={a} when={when(a.createdAt, a.resolvedAt)} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
