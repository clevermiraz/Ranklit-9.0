import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  Eye,
  Gift,
  LayoutGrid,
  Link2,
  Mail,
  MapPin,
  MousePointerClick,
  Navigation,
  Phone,
  Rocket,
  Sparkles,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";
import { getApp } from "@/lib/server/app";
import { latestScans } from "@/lib/server/store";
import { ACCOUNT_MANAGER_EMAIL, onboardingSteps, scanStats, type InsightDay } from "@/lib/app/types";
import { Badge, Card, IconTile, btn } from "@/components/app/ui";
import { CopyButton } from "@/components/app/copy-button";
import { Sparkline } from "@/components/app/charts";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Home" };

const stepIcons = { strategy: Sparkles, automations: Bot, website: MapPin, connect: Store } as const;

function withinDays(iso: string, days: number) {
  return Date.now() - new Date(iso).getTime() < days * 864e5;
}

function sumRange(days: InsightDay[], from: number, to: number, key: keyof Omit<InsightDay, "date">) {
  return days.slice(from, to).reduce((a, d) => a + d[key], 0);
}

export default async function HomePage() {
  const { account, business: s } = await getApp();
  const steps = onboardingSteps(s);
  const done = steps.filter((x) => x.done).length;
  const pct = Math.round((done / steps.length) * 100);
  const byConnectFirst = (a: { key: string }, b: { key: string }) => Number(b.key === "connect") - Number(a.key === "connect");
  const ordered = [...steps.filter((x) => !x.done).sort(byConnectFirst), ...steps.filter((x) => x.done)];

  const published30 = s.posts.filter((p) => p.status === "published" && withinDays(p.date, 30)).length;
  const publishedAll = s.posts.filter((p) => p.status === "published").length;
  const queued = s.posts.filter((p) => p.status === "scheduled").length;
  const built = s.citations.filter((c) => c.status === "built").length;
  const avgRating = s.reviews.length ? s.reviews.reduce((a, r) => a + r.rating, 0) / s.reviews.length : 0;

  const n = s.insights.length;
  const metric = (key: keyof Omit<InsightDay, "date">) => ({ now: sumRange(s.insights, n - 21, n, key), before: sumRange(s.insights, n - 42, n - 21, key) });
  const views = ["desktopMaps", "desktopSearch", "mobileMaps", "mobileSearch"] as const;
  const viewsNow = views.reduce((a, k) => a + metric(k).now, 0);
  const viewsBefore = views.reduce((a, k) => a + metric(k).before, 0);
  const lastDate = s.insights.at(-1)?.date;

  const scans = latestScans(s);
  const inPack = scans.length ? Math.round(scans.reduce((a, sc) => a + scanStats(sc.points).top3 / sc.points.length, 0) / scans.length * 100) : null;
  const reviewTrend = s.reviews
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((_, i) => i + 1);

  const today = s.activity.filter((a) => new Date(a.at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="mx-auto max-w-[944px] space-y-5">
      {!s.profile.connected && <ConnectGoogleBanner />}

      <Card className="flex flex-wrap items-center justify-between gap-3 !py-3">
        <p className="text-sm">
          Your account manager: <strong>{account.accountManager}</strong>
        </p>
        <a href={`mailto:${ACCOUNT_MANAGER_EMAIL}`} className={clsx(btn.primary, "!rounded-lg !px-3 !py-1.5 !text-xs")}>
          <Mail className="size-3.5" /> Email {account.accountManager}
        </a>
      </Card>

      {s.suggestions.length > 0 && (
        <Card className="!p-0">
          <div className="flex items-center justify-between border-b border-[#ece6f4] px-5 py-3">
            <h2 className="flex items-center gap-2 text-[17px] font-bold">
              Needs you <span className="grid size-5 place-items-center rounded-full bg-amber-500 text-[11px] text-night">{s.suggestions.length}</span>
            </h2>
            <p className="text-xs text-ink/55">Everything waiting on you, in one place</p>
          </div>
          {s.suggestions.map((sg) => (
            <div key={sg.id} className="flex items-center gap-3 px-5 py-3">
              <IconTile icon={Store} tone="amber" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Your bot suggested a change to your Google profile</span>
                <span className="block text-xs text-ink/55">Google Profile · Nothing changes on Google until you approve it</span>
              </span>
              <Link href="/dashboard/gbp" className={clsx(btn.primary, "!rounded-lg !px-3 !py-1.5 !text-xs")}>
                Review
              </Link>
            </div>
          ))}
        </Card>
      )}

      {pct < 100 && (
        <Card className="!p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-3xl leading-tight font-extrabold tracking-tight">Hi {account.firstName},</p>
              <p className="text-gradient text-3xl leading-tight font-extrabold tracking-tight">finish setting up</p>
              <p className="mt-1 text-sm text-ink/60">Your bot will get to work the moment this is done.</p>
            </div>
            <Gauge pct={pct} />
          </div>
          <ul className="mt-5 space-y-2.5">
            {ordered.map((step) => {
              const Icon = step.key === "connect" ? Store : stepIcons[step.key as keyof typeof stepIcons];
              return (
                <li key={step.key}>
                  <Link
                    href={step.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                      step.done ? "border-transparent opacity-60" : "border-[#ece6f4] bg-[#f6f2fa] hover:border-brand-200",
                    )}
                  >
                    {step.key === "connect" ? <GoogleG /> : <IconTile icon={Icon} tone="purple" size="sm" />}
                    <span className="min-w-0 flex-1">
                      <span className={clsx("block text-sm font-semibold", step.done && "line-through")}>{step.title}</span>
                      <span className={clsx("block text-xs text-ink/60", step.done && "line-through")}>{step.text}</span>
                    </span>
                    {step.done ? <Check className="size-5 rounded-full border border-brand-300 p-0.5 text-brand-700" /> : <ChevronRight className="size-4 text-ink/40" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {s.profile.connected && (
        <Card className="flex items-center gap-3 border-brand-200 !py-4">
          <IconTile icon={Check} tone="purple" size="sm" />
          <span className="flex-1">
            <span className="block text-sm font-semibold">Google Business Profile connected</span>
            <span className="block text-xs text-ink/55">Linked to {s.profile.name}.</span>
          </span>
          <Link href="/dashboard/gbp" className={clsx(btn.outline, btn.sm, "!rounded-lg")}>
            Manage
          </Link>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <SectionTitle icon={LayoutGrid} title="Google Posts" href="/dashboard/gbp/posts" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Tile>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white">{published30}</span>
                <span>
                  <span className="block text-sm font-semibold">Past 30 days</span>
                  <span className="block text-xs text-ink/55">{publishedAll} published all-time</span>
                </span>
              </div>
              <p className="mt-3 text-xs text-ink/55">{publishedAll ? "Your bot keeps your profile active." : "Your first post will show up here once it publishes."}</p>
            </Tile>
            <Tile>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full border border-[#ece6f4] bg-white text-sm font-bold">{queued}</span>
                <span>
                  <span className="block text-sm font-semibold">Queued</span>
                  <span className="block text-xs text-ink/55">{queued ? `${queued} scheduled` : "Nothing queued right now"}</span>
                </span>
              </div>
              <p className="mt-3 text-xs text-ink/55">Your bot drafts and schedules posts automatically.</p>
            </Tile>
          </div>
        </Card>
        <Card>
          <SectionTitle icon={Link2} title="Citations & Reviews" href="/dashboard/citations" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Tile>
              <p className="text-xs text-ink/55">Citations</p>
              {built ? (
                <>
                  <p className="mt-1 text-2xl font-extrabold">{built}</p>
                  <p className="text-xs text-ink/55">listings live</p>
                </>
              ) : (
                <>
                  <p className="mt-1 flex gap-1.5 text-sm font-semibold">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-700" /> Ranklit is building your citations
                  </p>
                  <span className="mt-2 block h-1 rounded bg-[#ece6f4]" />
                  <ul className="mt-2 space-y-1 text-xs">
                    <li className="flex items-center gap-1.5"><Check className="size-3.5 rounded-full bg-brand-700 p-0.5 text-white" /> Details checked</li>
                    <li className="flex items-center gap-1.5"><span className="size-3.5 rounded-full border-4 border-brand-200 bg-brand-700" /> Submitting to directories</li>
                    <li className="flex items-center gap-1.5 text-ink/45"><span className="size-3.5 rounded-full border border-ink/20" /> Listings go live</li>
                  </ul>
                </>
              )}
            </Tile>
            <Link href="/dashboard/reviews" className="block rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-3 hover:border-brand-200">
              <p className="text-xs text-ink/55">Google reviews</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold">{s.reviews.length}</span>
                {s.reviews.length > 0 && (
                  <span className="flex items-center gap-0.5 text-sm font-semibold">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" /> {avgRating.toFixed(1)}
                  </span>
                )}
              </p>
              <p className="text-xs text-ink/55">{s.profile.connected ? "Tracking new reviews weekly" : "Connect Google to track reviews"}</p>
              {reviewTrend.length > 1 && <Sparkline values={reviewTrend} className="mt-2 h-12 w-full" />}
            </Link>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle icon={Sparkles} title="Google and AI analytics" href="/dashboard/gbp-insights" />
        <p className="mt-1 text-xs text-ink/55">
          {lastDate ? `Google numbers through ${new Date(lastDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}. Google reports a few days behind.` : "Connect your Google profile to see calls, clicks and views."}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr]">
          <Link href="/dashboard/ai-visibility" className="rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-4 hover:border-brand-200">
            <p className="text-[11px] font-bold tracking-wider text-ink/50 uppercase">AI visibility</p>
            {s.aiChecks.length ? (
              <AiSummary named={s.aiChecks.at(-1)!.results.filter((r) => r.named).length} total={s.aiChecks.at(-1)!.results.length} />
            ) : (
              <>
                <p className="mt-2 text-sm font-semibold">First AI check coming up</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/55">Your bot will ask ChatGPT, Perplexity and Google AI whether they recommend your business — results land here.</p>
              </>
            )}
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <MetricTile icon={Phone} label="Calls from your profile" locked={!s.profile.connected} {...metric("calls")} />
            <MetricTile icon={Eye} label="Views on Search & Maps" locked={!s.profile.connected} now={viewsNow} before={viewsBefore} />
            <MetricTile icon={MousePointerClick} label="Website clicks" locked={!s.profile.connected} {...metric("websiteClicks")} />
            <MetricTile icon={Navigation} label="Direction requests" locked={!s.profile.connected} {...metric("directions")} />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={MapPin} title="Map Rankings" href="/dashboard/rankings" />
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.4fr]">
          <Tile>
            <p className="text-xs text-ink/55">In the map pack</p>
            <p className="mt-1 text-2xl font-extrabold">{inPack === null ? "—" : `${inPack}%`}</p>
            <p className="text-xs text-ink/55">{inPack === null ? "No scans yet" : "of spots in the top 3, latest scans"}</p>
          </Tile>
          <Tile>
            <p className="text-xs text-ink/55">Recent scans · average position</p>
            {scans.length ? (
              <ul className="mt-2 space-y-1.5">
                {scans.slice(0, 4).map((sc) => (
                  <li key={sc.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{sc.keyword}</span>
                    <Badge tone={(scanStats(sc.points).avg ?? 99) <= 3 ? "green" : "amber"}>#{scanStats(sc.points).avg ?? "—"}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 rounded-lg border border-dashed border-[#d9cfe6] px-4 py-5 text-center">
                <p className="text-sm text-ink/60">No scans yet. Kick one off to see where you stand.</p>
                <Link href="/dashboard/scans" className={clsx(btn.outline, btn.sm, "mt-2")}>
                  Go to Map Scans
                </Link>
              </div>
            )}
          </Tile>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 text-[17px] font-bold">
            <IconTile icon={Bot} size="sm" /> Bot Activity
          </h2>
          <Badge>{today} ACTIONS TODAY</Badge>
        </div>
        <ul className="mt-4">
          {s.activity.slice(0, 8).map((a, i) => (
            <li key={a.id} className="relative flex items-center gap-3 py-2">
              {i < Math.min(7, s.activity.length - 1) && <span className="absolute top-9 left-[15px] h-4 w-px bg-[#e4dcef]" />}
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f3e8fb] text-sm">{a.emoji}</span>
              <span className="flex-1 text-sm">{a.text}</span>
              <span suppressHydrationWarning className="text-xs text-ink/45">
                {new Date(a.at).toLocaleString("en-US", new Date(a.at).toDateString() === new Date().toDateString() ? { hour: "numeric", minute: "2-digit" } : { month: "short", day: "numeric" })}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex flex-wrap items-center gap-4">
        <IconTile icon={Rocket} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="font-bold">Rank even faster with the Accelerator</p>
          <p className="text-sm text-ink/60">We&apos;ll build high-authority backlinks to your citations to strengthen your Google Maps ranking signals — a one-time $150 boost.</p>
        </div>
        <Link href="/dashboard/upgrades" className={btn.primary}>
          Get the Accelerator — $150 <ArrowRight className="size-4" />
        </Link>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-br from-brand-700 to-[#5b1673] p-5 text-white">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 font-bold"><Gift className="size-4" /> Refer a friend, get $50</p>
            <p className="mt-1 text-xs text-white/80">They get $50 off their first month. You get a $50 credit toward your next bill when they subscribe.</p>
          </div>
          <CopyButton value={`https://ranklit.com/invite/${account.userId.slice(0, 8).toUpperCase()}`} label="Copy link" mono />
        </div>
        <Link href="/dashboard/ai-visibility" className="flex items-center gap-3 rounded-2xl bg-[#2b3fd4] p-5 text-white hover:bg-[#2537c0]">
          <Sparkles className="size-5 shrink-0" />
          <span className="flex-1">
            <span className="block font-bold">Does AI name your business?</span>
            <span className="block text-xs text-white/80">Founding deal: $49 a month for life instead of $99.</span>
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">Try Recommended →</span>
        </Link>
      </div>
    </div>
  );
}

function Gauge({ pct }: { pct: number }) {
  const r = 34;
  const len = Math.PI * r;
  return (
    <div className="relative w-[92px] shrink-0 text-center" aria-label={`${pct}% complete`}>
      <svg viewBox="0 0 80 46" className="w-full">
        <path d={`M6 40 A${r} ${r} 0 0 1 74 40`} fill="none" stroke="#ece6f4" strokeWidth="6" strokeLinecap="round" />
        <path d={`M6 40 A${r} ${r} 0 0 1 74 40`} fill="none" stroke="#8d3ebb" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(len * pct) / 100} ${len}`} />
      </svg>
      <p className="-mt-6 text-xl font-extrabold">{pct}%</p>
      <p className="text-[10px] font-bold tracking-wider text-ink/50">COMPLETE</p>
    </div>
  );
}

function GoogleG() {
  return (
    <span className="grid size-8 place-items-center rounded-lg bg-white shadow-sm">
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9h-4v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.8l4-3z" />
        <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
      </svg>
    </span>
  );
}

function SectionTitle({ icon, title, href }: { icon: typeof Star; title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2.5 text-[17px] font-bold">
        <IconTile icon={icon} size="sm" /> {title}
      </h2>
      <Link href={href} className="grid size-8 place-items-center rounded-lg border border-[#ece6f4] text-ink/60 hover:text-ink" aria-label={`Open ${title}`}>
        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}

function Tile({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-3">{children}</div>;
}

function MetricTile({ icon: Icon, label, now, before, locked }: { icon: typeof Star; label: string; now: number; before: number; locked?: boolean }) {
  const diff = now - before;
  if (locked) {
    return (
      <div className="rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-3">
        <p className="flex items-center gap-1.5 text-xs text-ink/60"><Icon className="size-3.5" /> {label}</p>
        <p className="mt-1 text-2xl font-extrabold text-ink/30">—</p>
        <Link href="/dashboard/gbp" className="text-xs text-brand-700 hover:underline">
          Connect Google to see this
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs text-ink/60"><Icon className="size-3.5" /> {label}</p>
        <span className="rounded-md border border-[#ece6f4] bg-white px-1.5 py-0.5 text-[10px] font-bold text-ink/60">3 WEEKS</span>
      </div>
      <p className="mt-1 text-2xl font-extrabold">{now}</p>
      <p className="text-xs text-ink/55">
        {diff > 0 ? (
          <span className="font-semibold text-emerald-600"><TrendingUp className="mr-0.5 inline size-3" />+{diff}</span>
        ) : diff < 0 ? (
          <span className="font-semibold text-red-500">{diff}</span>
        ) : null}{" "}
        {diff === 0 ? "about the same as the 3 weeks before" : "vs the 3 weeks before"}
      </p>
    </div>
  );
}

function AiSummary({ named, total }: { named: number; total: number }) {
  return (
    <>
      <p className="mt-2 text-3xl font-extrabold">{Math.round((named / total) * 100)}%</p>
      <p className="text-xs text-ink/55">
        Named by {named} of {total} AI assistants in the latest check
      </p>
    </>
  );
}

function ConnectGoogleBanner() {
  const perks = ["Automatic profile posts", "AI review replies", "Photo publishing", "Calls, views + search data"];
  return (
    <section className="rounded-2xl border border-brand-300/70 bg-gradient-to-br from-[#faf0fc] to-white p-5">
      <div className="flex flex-wrap items-start gap-4">
        <IconTile icon={Sparkles} />
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-bold">Connect Google to unlock all features</h2>
          <p className="mt-1 text-sm text-ink/65">
            Your rank tracking and citation build are already running. Linking your Google Business Profile switches on everything that posts to it.
            Takes about 30 seconds.
          </p>
          <ul className="mt-3 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-brand-600" /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink/55">
            We only read and post what you approve.{" "}
            <Link href="/dashboard/gbp" className="underline underline-offset-2 hover:text-ink">
              See what changes
            </Link>
          </p>
        </div>
        <Link href="/dashboard/gbp" className={btn.primary}>
          Connect Google
        </Link>
      </div>
    </section>
  );
}
