import type { Metadata } from "next";
import Link from "next/link";
import { Gift, MapPin } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { getSettings, nextRenewal } from "@/lib/server/settings-store";
import { getCheckoutPlan, periodPrice, usd } from "@/lib/pricing";
import { Badge, Card, CardHeader, PageHeader } from "@/components/app/ui";
import { CopyButton } from "@/components/app/copy-button";
import { BuyCredits, ChangePlanLink, ManageBilling, RenewalsCard, SwitchPlan, TrialCard } from "@/components/app/settings/plans";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Plans & Credits" };

function renewalDate(createdAt: string, interval: "monthly" | "annual", trialEndsAt: string | null) {
  return trialEndsAt ?? nextRenewal(createdAt, interval, Date.now());
}

export default async function PlansPage() {
  const { user, account } = await getApp();
  const settings = getSettings(user.id);
  const plan = getCheckoutPlan(user.plan);
  const isPro = user.plan === "pro";
  const planName = isPro ? "Pro" : plan?.name ?? "No plan";
  const shortName = planName.replace(/^Agency /, "");
  const renewsAt = user.plan ? renewalDate(user.createdAt, user.interval, account.trialEndsAt) : null;
  const charge = plan ? `${usd(periodPrice(plan, user.interval, Math.max(1, user.locations)))}/${user.interval === "annual" ? "yr" : "mo"}` : isPro ? "$399/mo" : "$0";
  const referral = `https://ranklit.com/invite/${account.userId.slice(0, 8).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-[1040px] space-y-5">
      <PageHeader title="Plans & Credits" subtitle="Compare plans, change your subscription, buy extra scan credits, and manage billing, all in one place." />

      {account.trialEndsAt && <TrialCard daysLeft={account.trialDaysLeft} endsAt={account.trialEndsAt} planName={planName} charge={charge} />}

      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-gradient-to-br from-brand-700 to-[#5b1673] p-5 text-white">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15">
          <Gift className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">Refer a friend, get $50</p>
          <p className="mt-0.5 text-sm text-white/80">They get $50 off their first month. You get a $50 credit toward your next bill when they subscribe.</p>
        </div>
        <CopyButton value={referral} label="Copy link" mono />
      </div>

      <Card>
        <CardHeader title="Your locations" description="Each location can be on its own plan. Change a single location's tier without affecting the others." />
        <ul className="mt-4 space-y-2">
          {account.businesses.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-[#ece6f4] px-4 py-3">
              <MapPin className="size-4 text-brand-700" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{b.name}</span>
                <span className="block text-xs text-ink/55">{user.plan ? `${account.monthlyCredits.toLocaleString()} credits/mo` : "Not on a plan"}</span>
              </span>
              <Badge tone={user.plan ? "purple" : "gray"}>{shortName}</Badge>
              {settings.locationCancellations[b.id] && <Badge tone="red">Stopping</Badge>}
              <ChangePlanLink />
            </li>
          ))}
        </ul>
      </Card>

      {user.plan && renewsAt && (
        <Card>
          <RenewalsCard
            rows={account.businesses.map((b, i) => ({
              id: b.id,
              name: b.name,
              main: i === 0,
              renewsAt,
              cancelAt: settings.locationCancellations[b.id] ?? null,
            }))}
          />
        </Card>
      )}

      <Card>
        <SwitchPlan currentId={user.plan} currentInterval={user.interval} currentLocations={Math.max(1, user.locations)} onTrial={!!account.trialEndsAt} />
      </Card>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#2b3fd4] p-5 text-white">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-lg font-extrabold text-[#2b3fd4]">R</span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">Recommended</p>
          <p className="mt-0.5 text-sm text-white/85">See whether AI assistants name your business when customers ask for a recommendation — and what to fix when they don&apos;t.</p>
          <p className="mt-1 text-sm font-bold">Founding deal: $49 a month for life instead of $99.</p>
        </div>
        <Link href="/dashboard/ai-visibility" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2b3fd4] hover:bg-white/90">
          View Recommended
        </Link>
      </div>

      <Card>
        <BuyCredits credits={account.credits} />
      </Card>

      <Card>
        <ManageBilling hasPlan={!!user.plan} onGrowth={!!user.plan && /growth/.test(user.plan)} interval={user.interval} renewsAt={renewsAt} />
      </Card>
    </div>
  );
}
