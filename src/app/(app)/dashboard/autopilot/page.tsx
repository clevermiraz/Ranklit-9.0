import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { Bot, Building2, ChevronRight, ClipboardCheck, Globe, Info, MessageSquare, Radar, Store, Target, type LucideIcon } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { onboardingSteps } from "@/lib/app/types";
import { Card, CardHeader, IconTile, PageHeader, btn } from "@/components/app/ui";
import { AutopilotHero } from "@/components/app/autopilot/autopilot-hero";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Autopilot" };

const todo: Record<string, { title: string; cta: string; icon: LucideIcon }> = {
  strategy: { title: "Add target keywords to your strategy", cta: "Add keywords", icon: Target },
  automations: { title: "Choose which automations your bot runs", cta: "Choose", icon: Bot },
  website: { title: "Let your bot check your website", cta: "Open", icon: Globe },
  connect: { title: "Connect your Google Business Profile", cta: "Connect", icon: Store },
};

export default async function AutopilotPage() {
  const { business: s } = await getApp();
  const pending = onboardingSteps(s).filter((step) => !step.done);
  const a = s.automations;

  const rows: { icon: LucideIcon; tone: "purple" | "amber" | "fuchsia" | "teal"; title: string; text: string; on: boolean; status: string; href: string }[] = [
    {
      icon: Store,
      tone: "fuchsia",
      title: "Posts to your Google Business Profile",
      text: "Drafts and publishes fresh posts about your services so your profile stays active.",
      on: a.autoPost,
      status: a.autoPost ? "About 3 times a week" : "Turned off in your automation settings",
      href: "/dashboard/gbp/posts",
    },
    {
      icon: MessageSquare,
      tone: "amber",
      title: "Replies to your Google reviews",
      text: "Writes a warm, on-brand reply to each new review and posts it for you.",
      on: a.autoReply,
      status: a.autoReply ? "Within a day of each new review" : "Off by default — you opt in, since replies post publicly",
      href: "/dashboard/reviews",
    },
    {
      icon: Radar,
      tone: "purple",
      title: "Map rank scans",
      text: "Scans your tracked keywords across your area and shows where you rank on the map.",
      on: a.autoScan,
      status: !a.autoScan ? "Turned off in your automation settings" : s.weeklyScan.enabled ? `Every ${s.weeklyScan.day}, ${s.weeklyScan.grid}×${s.weeklyScan.grid} grid` : "About once a week",
      href: "/dashboard/scans",
    },
    {
      icon: ClipboardCheck,
      tone: "teal",
      title: "Profile audit + description refresh",
      text: "Re-checks your Google profile and suggests a sharper description when it can do better.",
      on: a.refreshDescription,
      status: a.refreshDescription ? "About once a month" : "Turned off in your automation settings",
      href: "/dashboard/gbp-audit",
    },
  ];

  return (
    <div className="mx-auto max-w-[944px] space-y-5">
      <PageHeader title="Autopilot" subtitle="Your bot's work on Ranklit, in one place." />

      <AutopilotHero on={s.autopilot} />

      {pending.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div className="min-w-0 flex-1">
              <h2 className="font-bold">
                {pending.length} thing{pending.length === 1 ? "" : "s"} to finish first
              </h2>
              <p className="mt-0.5 text-sm text-ink/65">You can turn Autopilot on now — it starts working the moment {pending.length === 1 ? "this is" : "these are"} done.</p>
              <ul className="mt-4 space-y-2">
                {pending.map((step) => {
                  const t = todo[step.key] ?? { title: step.title, cta: "Open", icon: Building2 };
                  return (
                    <li key={step.key} className="flex items-center gap-3 rounded-xl border border-amber-200/70 bg-white px-4 py-3">
                      <t.icon className="size-4 shrink-0 text-amber-600" />
                      <span className="min-w-0 flex-1 text-sm font-semibold">{t.title}</span>
                      <Link href={step.href} className={clsx(btn.outline, btn.sm, "!rounded-lg")}>
                        {t.cta}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      <Card className="!p-0">
        <div className="px-5 pt-5 pb-3">
          <CardHeader title="What your bot does on Autopilot" description="Everything below runs on your plan's schedule. You stay in control of each one." />
        </div>
        <ul className="divide-y divide-[#f0ebf6]">
          {rows.map((r) => {
            const live = r.on && s.autopilot;
            return (
              <li key={r.title}>
                <Link href={r.href} className="group flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-[#faf7fd] sm:flex-nowrap">
                  <IconTile icon={r.icon} tone={r.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{r.title}</span>
                    <span className="block text-xs text-ink/55">{r.text}</span>
                  </span>
                  <span className={clsx("flex max-w-[260px] items-center gap-1.5 text-right text-xs font-medium", live ? "text-emerald-700" : r.on ? "text-ink/60" : "text-ink/45")}>
                    {r.on && <span className={clsx("size-1.5 shrink-0 rounded-full", live ? "bg-emerald-500" : "bg-ink/30")} />}
                    {r.status}
                    {r.on && !s.autopilot && " · paused"}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-ink/30 group-hover:text-ink/60" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>

      <p className="flex flex-wrap items-center justify-center gap-1 text-center text-sm text-ink/60">
        Want to pick and choose?{" "}
        <Link href="/settings/automations" className="font-semibold text-brand-700 hover:underline">
          Manage each automation
        </Link>{" "}
        — Autopilot is the master switch over all of them.
      </p>
    </div>
  );
}
