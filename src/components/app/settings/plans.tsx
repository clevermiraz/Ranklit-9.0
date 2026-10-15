"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, Clock, Crown, CreditCard, Loader2, Lock, MapPin, Minus, Plus, Sparkles, Zap } from "lucide-react";
import { startPlanNowAction } from "@/app/actions/app";
import {
  buyCreditsAction,
  cancelSubscriptionAction,
  cancelTrialAction,
  scheduleLocationCancelAction,
  switchPlanAction,
  undoLocationCancelAction,
} from "@/app/actions/settings";
import { MAX_LOCATIONS, getPlan, maxAnnualSavingsPct, quote, usd, type Interval } from "@/lib/pricing";
import { ACCOUNT_MANAGER_EMAIL } from "@/lib/app/types";
import { Badge, CardHeader, btn } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import { Modal } from "./modal";

const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// ---- trial -----------------------------------------------------------------------------------

export function TrialCard({ daysLeft, endsAt, planName, charge }: { daysLeft: number; endsAt: string; planName: string; charge: string }) {
  const { run, pending } = useAction();
  const [confirm, setConfirm] = useState<"start" | "cancel" | null>(null);
  return (
    <section className="rounded-2xl border border-brand-300/70 bg-gradient-to-br from-[#f9e9fb] to-white p-5">
      <div className="flex flex-wrap items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-brand-700 shadow-sm">
          <Clock className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold tracking-tight">
            {daysLeft} day{daysLeft === 1 ? "" : "s"} left in your free trial
          </p>
          <p className="mt-0.5 text-sm text-ink/65">
            You&apos;re trying <strong>{planName}</strong>. We&apos;ll charge <strong>{charge}</strong> on <strong>{longDate(endsAt)}</strong> unless you cancel before then.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setConfirm("start")} className={btn.primary}>
            Start plan now
          </button>
          <button type="button" onClick={() => setConfirm("cancel")} className={btn.outline}>
            Cancel trial
          </button>
        </div>
      </div>
      <Modal
        open={confirm === "start"}
        onClose={() => setConfirm(null)}
        size="sm"
        title="Start your plan now?"
        description={`Your trial ends today and we charge ${charge} to your card on file. Your credits and settings stay exactly as they are.`}
        footer={
          <>
            <button type="button" className={btn.outline} onClick={() => setConfirm(null)}>
              Not yet
            </button>
            <button type="button" className={btn.primary} disabled={pending} onClick={() => run(() => startPlanNowAction(), () => setConfirm(null))}>
              {pending && <Loader2 className="size-4 animate-spin" />} Start plan — {charge}
            </button>
          </>
        }
      />
      <Modal
        open={confirm === "cancel"}
        onClose={() => setConfirm(null)}
        size="sm"
        title="Cancel your free trial?"
        description="You won't be charged. Your bot stops working right away, and scheduled posts, replies and scans are cancelled."
        footer={
          <>
            <button type="button" className={btn.outline} onClick={() => setConfirm(null)}>
              Keep my trial
            </button>
            <button type="button" disabled={pending} onClick={() => run(() => cancelTrialAction(), () => setConfirm(null))} className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
              {pending && <Loader2 className="size-4 animate-spin" />} Cancel trial
            </button>
          </>
        }
      />
    </section>
  );
}

// ---- renewals / cancel selected ---------------------------------------------------------------

type RenewRow = { id: string; name: string; main: boolean; renewsAt: string; cancelAt: string | null };

export function RenewalsCard({ rows }: { rows: RenewRow[] }) {
  const { run, pending } = useAction();
  const [picked, setPicked] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const pickedRows = rows.filter((r) => picked.includes(r.id));
  return (
    <div>
      <CardHeader
        title="Your locations"
        description="What you're paying for, and when each one renews. Tick any you want to cancel — they keep working until the date shown, and there is no refund."
      />
      <ul className="mt-4 space-y-2">
        {rows.map((r) => {
          const disabled = r.main || !!r.cancelAt;
          return (
            <li key={r.id} className={clsx("flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3", picked.includes(r.id) ? "border-red-200 bg-red-50/50" : "border-[#ece6f4]")}>
              <input
                type="checkbox"
                aria-label={`Cancel ${r.name}`}
                disabled={disabled}
                checked={picked.includes(r.id)}
                onChange={(e) => setPicked((p) => (e.target.checked ? [...p, r.id] : p.filter((x) => x !== r.id)))}
                className="size-4 accent-brand-700 disabled:opacity-40"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{r.name}</span>
                <span className="block text-xs text-ink/55">
                  {r.cancelAt ? (
                    <span className="font-semibold text-red-600">Stops on {longDate(r.cancelAt)} — no further charges</span>
                  ) : (
                    <>Billed on your main subscription · renews {longDate(r.renewsAt)}</>
                  )}
                </span>
              </span>
              {r.main && <Badge tone="purple">Main subscription</Badge>}
              {r.cancelAt && (
                <button type="button" disabled={pending} onClick={() => run(() => undoLocationCancelAction(r.id))} className={clsx(btn.outline, btn.sm)}>
                  Undo
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-ink/55">Your main subscription can&apos;t be ticked here — to stop everything, use Cancel subscription at the bottom of this page.</p>
      <button type="button" disabled={!picked.length} onClick={() => setConfirm(true)} className={clsx(btn.outline, "mt-3 !text-red-600")}>
        Cancel selected{picked.length ? ` (${picked.length})` : ""}
      </button>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        title={`Cancel ${pickedRows.length} location${pickedRows.length === 1 ? "" : "s"}?`}
        description="They keep working until the date shown, then stop. There is no refund for the current period."
        footer={
          <>
            <button type="button" className={btn.outline} onClick={() => setConfirm(false)}>
              Keep them
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(
                  () => scheduleLocationCancelAction(picked),
                  (r) => {
                    if (!r?.error) {
                      setPicked([]);
                      setConfirm(false);
                    }
                  },
                )
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {pending && <Loader2 className="size-4 animate-spin" />} Cancel at renewal
            </button>
          </>
        }
      >
        <ul className="space-y-1.5 text-sm">
          {pickedRows.map((r) => (
            <li key={r.id} className="flex items-center gap-2">
              <MapPin className="size-3.5 text-ink/45" /> {r.name} — stops {longDate(r.renewsAt)}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

// ---- switch plan -----------------------------------------------------------------------------

const PRO = {
  price: 399,
  features: ["30 pages a month of website content", "3–5 quality backlinks every month", "Full website audit + cleanup", "Google Search Console reporting"],
  note: "Why add Organic SEO: your map pin and your website rank together. Pro adds the content and links that move your website up in the regular results too.",
};

export function SwitchPlan({
  currentId,
  currentInterval,
  currentLocations,
  onTrial,
}: {
  currentId: string | null;
  currentInterval: Interval;
  currentLocations: number;
  onTrial: boolean;
}) {
  const { run, pending } = useAction();
  const base = currentId?.replace(/^agency-/, "") ?? null;
  const [interval, setCadence] = useState<Interval>(currentInterval);
  const [locations, setLocations] = useState(base === "growth" ? currentLocations : 1);
  const [confirm, setConfirm] = useState<"foundation" | "growth" | null>(null);

  const foundation = getPlan("foundation");
  const growth = getPlan("growth");
  const fq = quote(foundation, interval, 1);
  const gq = quote(growth, interval, locations);

  const isCurrent = (id: "foundation" | "growth") => base === id && currentInterval === interval && (id !== "growth" || currentLocations === locations);
  const label = (id: "foundation" | "growth") => {
    if (!base) return "Choose this plan";
    if (base === id) return currentInterval !== interval ? `Switch to ${interval} billing` : "Update locations";
    return "Switch to this plan";
  };

  const target = confirm === "growth" ? { plan: growth, q: gq, locs: locations } : { plan: foundation, q: fq, locs: 1 };

  return (
    <div id="switch-plan" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">Switch plan</h2>
          <p className="text-sm text-ink/60">Upgrade, downgrade, or change billing cadence.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-[#efeaf5] p-1" role="tablist" aria-label="Billing cadence">
            {(["monthly", "annual"] as const).map((i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={interval === i}
                onClick={() => setCadence(i)}
                className={clsx("rounded-full px-4 py-1 text-sm font-semibold capitalize", interval === i ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink")}
              >
                {i}
              </button>
            ))}
          </div>
          <Badge tone="green">Save ~{maxAnnualSavingsPct}%</Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {/* Foundation */}
        <PlanCard current={base === "foundation"}>
          <p className="text-lg font-extrabold">Foundation</p>
          <p className="text-sm text-ink/60">{foundation.blurb}</p>
          <Price value={fq.perLocation} suffix="/mo" sub={interval === "annual" ? `Billed ${usd(fq.yearlyTotal)}/yr · save ${usd(fq.savings)}` : `${usd(fq.yearlyIfMonthly)}/yr if paid monthly`} />
          <PlanButton current={isCurrent("foundation")} onClick={() => setConfirm("foundation")} tone="gray">
            {label("foundation")}
          </PlanButton>
          <Features items={foundation.features.map((f) => f.text)} />
        </PlanCard>

        {/* Growth */}
        <PlanCard current={base === "growth"} highlight badge="MOST POPULAR">
          <p className="flex items-center gap-1.5 text-lg font-extrabold">
            <Sparkles className="size-4 text-brand-700" /> Growth
          </p>
          <p className="text-sm text-ink/60">Best for getting more calls.</p>
          <Price value={gq.perLocation} suffix="/loc /mo" sub={interval === "annual" ? `Billed ${usd(gq.yearlyPerLocation)}/yr per location · save ${usd(gq.savings)}` : `${usd(gq.yearlyPerLocation)}/yr if paid monthly`} />
          <div className="mt-3">
            <p className="text-[11px] font-bold tracking-wider text-ink/50">LOCATIONS</p>
            <div className="mt-1 inline-flex items-center rounded-full border border-[#e4dcef] bg-white">
              <button type="button" aria-label="Fewer locations" disabled={locations <= 1} onClick={() => setLocations((l) => Math.max(1, l - 1))} className="grid size-8 place-items-center rounded-full text-ink/60 hover:text-ink disabled:opacity-30">
                <Minus className="size-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold" aria-live="polite">
                {locations}
              </span>
              <button type="button" aria-label="More locations" disabled={locations >= MAX_LOCATIONS || onTrial} onClick={() => setLocations((l) => Math.min(MAX_LOCATIONS, l + 1))} className="grid size-8 place-items-center rounded-full text-ink/60 hover:text-ink disabled:opacity-30">
                <Plus className="size-3.5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-ink/50">
              {onTrial ? "Trials start at 1 location. Add more after your trial." : locations > 1 ? `${usd(gq.monthlyTotal)}/mo for ${locations} locations${gq.volumeSaving ? ` · volume saving ${usd(gq.volumeSaving)}/loc` : ""}` : "Lower per-location price from 5 locations."}
            </p>
          </div>
          <PlanButton current={isCurrent("growth")} onClick={() => setConfirm("growth")} tone="purple">
            {label("growth")}
          </PlanButton>
          <p className="mt-4 text-sm font-bold">{growth.featuresIntro}</p>
          <Features bold items={["A dedicated account manager", ...growth.features.map((f) => f.text)]} />
          {growth.note && <p className="mt-4 rounded-xl bg-[#f8f1fc] p-3 text-xs leading-relaxed text-ink/70">{growth.note}</p>}
        </PlanCard>

        {/* Pro */}
        <PlanCard current={base === "pro"} badge="RECOMMENDED">
          <p className="flex items-center gap-1.5 text-lg font-extrabold">
            <Crown className="size-4 text-amber-500" /> Pro
          </p>
          <p className="text-sm text-ink/60">Maps and your website.</p>
          <Price value={PRO.price} suffix="/mo" sub="Billed monthly. Covers one business." />
          {base === "pro" ? (
            <PlanButton current onClick={() => {}} tone="purple">
              Current plan
            </PlanButton>
          ) : (
            <a href={`mailto:${ACCOUNT_MANAGER_EMAIL}?subject=Switching%20to%20Pro`} className={clsx(btn.outline, "mt-4 w-full !rounded-xl")}>
              Talk to us
            </a>
          )}
          <p className="mt-4 text-sm font-bold">Everything in Growth, plus:</p>
          <Features bold items={PRO.features} />
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-ink/70">{PRO.note}</p>
        </PlanCard>
      </div>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        size="sm"
        title={`Switch to ${target.plan.name}?`}
        description={onTrial ? "You stay on your free trial — the new price applies when it ends." : "The change applies now. We prorate the difference on your next invoice."}
        footer={
          <>
            <button type="button" className={btn.outline} onClick={() => setConfirm(null)}>
              Cancel
            </button>
            <button
              type="button"
              className={btn.primary}
              disabled={pending}
              onClick={() => confirm && run(() => switchPlanAction(confirm, interval, target.locs), (r) => !r?.error && setConfirm(null))}
            >
              {pending && <Loader2 className="size-4 animate-spin" />} Confirm switch
            </button>
          </>
        }
      >
        <div className="rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Plan</span>
            <strong>
              {target.plan.name} · {interval}
            </strong>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-ink/60">Locations</span>
            <strong>{target.locs}</strong>
          </div>
          <div className="mt-3 flex justify-between border-t border-[#ece6f4] pt-3">
            <span className="text-ink/60">New price</span>
            <strong className="text-base">
              {usd(target.q.dueEachPeriod)}/{interval === "annual" ? "yr" : "mo"}
            </strong>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PlanCard({ children, current, highlight, badge }: { children: React.ReactNode; current: boolean; highlight?: boolean; badge?: string }) {
  return (
    <div className={clsx("relative flex flex-col rounded-2xl border bg-white p-5", highlight ? "border-2 border-brand-600 shadow-[0_10px_30px_-15px_rgba(141,62,187,.5)]" : "border-[#ece6f4]")}>
      <div className="absolute -top-3 right-4 flex gap-1.5">
        {badge && <span className={clsx("rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider", highlight ? "bg-brand-700 text-white" : "bg-amber-400 text-night")}>{badge}</span>}
        {current && <span className="rounded-full bg-[#f3e8fb] px-2.5 py-1 text-[10px] font-bold tracking-wider text-brand-700 ring-1 ring-brand-300">CURRENT</span>}
      </div>
      {children}
    </div>
  );
}

function Price({ value, suffix, sub }: { value: number; suffix: string; sub: string }) {
  return (
    <div className="mt-4">
      <p className="flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight">{usd(value)}</span>
        <span className="text-sm text-ink/55">{suffix}</span>
      </p>
      <p className="text-xs text-ink/50">{sub}</p>
    </div>
  );
}

function PlanButton({ current, onClick, children, tone }: { current: boolean; onClick: () => void; children: React.ReactNode; tone: "gray" | "purple" }) {
  if (current)
    return (
      <button type="button" disabled className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#f3e8fb] px-4 py-2.5 text-sm font-semibold text-brand-700/70">
        <Lock className="size-3.5" /> Current plan
      </button>
    );
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "mt-4 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition",
        tone === "purple" ? "bg-brand-700 text-white hover:bg-[#7b2fa8]" : "bg-[#efeaf5] text-ink hover:bg-[#e6def0]",
      )}
    >
      {children}
    </button>
  );
}

function Features({ items, bold }: { items: string[]; bold?: boolean }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((t) => (
        <li key={t} className={clsx("flex gap-2 text-[13px] leading-snug", bold ? "font-semibold" : "text-ink/75")}>
          <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" strokeWidth={3} /> {t}
        </li>
      ))}
    </ul>
  );
}

// ---- credits ---------------------------------------------------------------------------------

const PACKS = [
  { credits: 250, list: 25, price: 20 },
  { credits: 500, list: 50, price: 40 },
  { credits: 1000, list: 100, price: 80 },
];

export function BuyCredits({ credits }: { credits: number }) {
  const { run, pending } = useAction();
  const [pick, setPick] = useState<(typeof PACKS)[number] | null>(null);
  return (
    <div id="credits" className="scroll-mt-24">
      <CardHeader
        icon={Zap}
        title="Buy extra credits"
        description={
          <>
            One-time top-ups never expire and stack on top of your monthly plan credits. You currently have <strong className="text-ink">{credits.toLocaleString()}</strong> credits available.
          </>
        }
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {PACKS.map((p) => (
          <div key={p.credits} className="rounded-2xl border border-[#e6d6f3] bg-[#f8f1fc] p-4 text-center">
            <p className="text-sm font-semibold text-ink/70">{p.credits.toLocaleString()} credits</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">{usd(p.list)}</p>
            <p className="text-xs text-ink/55">
              {p.credits.toLocaleString()} credits — <strong className="text-emerald-700">{usd(p.price)} on your plan</strong>
            </p>
            <button type="button" onClick={() => setPick(p)} className={clsx(btn.outline, "mt-3 w-full")}>
              <Plus className="size-4" /> Buy
            </button>
          </div>
        ))}
      </div>
      <Modal
        open={!!pick}
        onClose={() => setPick(null)}
        size="sm"
        title={pick ? `Buy ${pick.credits.toLocaleString()} credits?` : ""}
        description={pick ? `We'll charge ${usd(pick.price)} to your card on file. Credits are added straight away and never expire.` : ""}
        footer={
          <>
            <button type="button" className={btn.outline} onClick={() => setPick(null)}>
              Cancel
            </button>
            <button type="button" disabled={pending} className={btn.primary} onClick={() => pick && run(() => buyCreditsAction(pick.credits), (r) => !r?.error && setPick(null))}>
              {pending && <Loader2 className="size-4 animate-spin" />} Pay {pick ? usd(pick.price) : ""}
            </button>
          </>
        }
      >
        {pick && (
          <p className="rounded-xl bg-[#f8f6fb] p-3 text-sm">
            New balance: <strong>{(credits + pick.credits).toLocaleString()} credits</strong>
          </p>
        )}
      </Modal>
    </div>
  );
}

// ---- billing + cancel ------------------------------------------------------------------------

const REASONS = ["It's too expensive", "I'm not seeing results yet", "I don't use it enough", "I'm switching to another tool", "My business is closing or pausing", "Something else"];

export function ManageBilling({ hasPlan, onGrowth, interval, renewsAt }: { hasPlan: boolean; onGrowth: boolean; interval: Interval; renewsAt: string | null }) {
  const { run, pending, push } = useAction();
  const [step, setStep] = useState<0 | 1 | 2 | null>(null);
  const [reason, setReason] = useState("");
  const close = () => {
    setStep(null);
    setReason("");
  };

  const offer =
    reason === "It's too expensive" && onGrowth
      ? { title: "Keep the basics for less", text: "Switch to Foundation for $99/mo. Posts, review replies, scans and citations keep running.", cta: "Switch to Foundation" }
      : reason === "I'm not seeing results yet"
        ? { title: "Let Lukas take a look first", text: "Local rankings usually move in 60–90 days. Your account manager will review your setup and tell you exactly what's holding you back — free.", cta: "Email Lukas" }
        : { title: "Before you go", text: "Your account manager can pause your plan, tune your bot, or answer any question. Most problems take one email to fix.", cta: "Email Lukas" };

  return (
    <div id="billing" className="scroll-mt-24">
      <CardHeader
        icon={CreditCard}
        title="Manage billing & payment method"
        description="Update your card or view invoices on Stripe. To cancel, use the cancel button below — we'll walk through options first."
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => push({ kind: "info", text: "The Stripe billing portal isn't connected in this environment yet — your card and invoices will open there once it is." })} className={btn.primary}>
          Open billing portal
        </button>
        {hasPlan ? (
          <button type="button" onClick={() => setStep(0)} className="text-sm font-semibold text-ink/55 hover:text-red-600 hover:underline">
            Cancel subscription
          </button>
        ) : (
          <span className="text-sm text-ink/55">No active subscription. Choose a plan above to get your bot working again.</span>
        )}
      </div>

      <Modal
        open={step !== null}
        onClose={close}
        title={step === 0 ? "Why are you cancelling?" : step === 1 ? offer.title : "Cancel your subscription?"}
        description={step === 0 ? "One quick question so we can get better. Step 1 of 3." : step === 1 ? "Step 2 of 3." : "Step 3 of 3."}
        footer={
          step === 0 ? (
            <>
              <button type="button" className={btn.outline} onClick={close}>
                Never mind
              </button>
              <button type="button" className={btn.primary} disabled={!reason} onClick={() => setStep(1)}>
                Continue
              </button>
            </>
          ) : step === 1 ? (
            <>
              <button type="button" className={btn.ghost} onClick={() => setStep(2)}>
                No thanks, continue cancelling
              </button>
              {offer.cta === "Switch to Foundation" ? (
                <button type="button" disabled={pending} className={btn.primary} onClick={() => run(() => switchPlanAction("foundation", interval, 1), (r) => !r?.error && close())}>
                  {pending && <Loader2 className="size-4 animate-spin" />} {offer.cta}
                </button>
              ) : (
                <a href={`mailto:${ACCOUNT_MANAGER_EMAIL}?subject=Before%20I%20cancel`} className={btn.primary} onClick={close}>
                  {offer.cta}
                </a>
              )}
            </>
          ) : (
            <>
              <button type="button" className={btn.outline} onClick={close}>
                Keep my plan
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => cancelSubscriptionAction(reason), (r) => !r?.error && close())}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {pending && <Loader2 className="size-4 animate-spin" />} Cancel subscription
              </button>
            </>
          )
        }
      >
        {step === 0 && (
          <fieldset className="space-y-2">
            <legend className="sr-only">Reason</legend>
            {REASONS.map((r) => (
              <label key={r} className={clsx("flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm", reason === r ? "border-brand-400 bg-[#f8f1fc]" : "border-[#ece6f4] hover:border-brand-200")}>
                <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-brand-700" />
                {r}
              </label>
            ))}
          </fieldset>
        )}
        {step === 1 && <p className="rounded-xl bg-[#f8f1fc] p-4 text-sm leading-relaxed">{offer.text}</p>}
        {step === 2 && (
          <ul className="space-y-2 text-sm text-ink/75">
            <li>• Your bot stops posting, replying, scanning and building citations{renewsAt ? ` on ${longDate(renewsAt)}` : ""}.</li>
            <li>• Unused monthly credits are lost. Top-up credits stay on your account.</li>
            <li>• Citations already built stay live.</li>
            <li>• You can come back any time — your settings are kept for 90 days.</li>
          </ul>
        )}
      </Modal>
    </div>
  );
}

export function ChangePlanLink() {
  return (
    <Link href="#switch-plan" className={clsx(btn.outline, btn.sm)}>
      Change plan
    </Link>
  );
}
