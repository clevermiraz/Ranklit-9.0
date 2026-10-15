"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Check, ChevronDown, Lock, ShieldCheck, Sparkles, Star } from "lucide-react";
import {
  AGENCY_MAX_SAVINGS_PCT,
  AGENCY_SLIDER_MAX,
  agencyCheckoutHref,
  agencyPlans,
  agencyQuote,
  fmtUsd,
  type AgencyInterval,
  type AgencyPlan,
} from "@/lib/agency-pricing";
import { compareRows } from "@/lib/data/compare";

const ticks = [1, 5, 15, AGENCY_SLIDER_MAX];

/** Billing toggle, location slider, Foundation/Growth cards and the compare table. */
export function AgencyPricing({ footer }: { footer?: "more" | "standard" }) {
  const [interval, setBilling] = useState<AgencyInterval>("monthly");
  const [locations, setLocations] = useState(1);
  const annual = interval === "annual";

  return (
    <div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex rounded-full border border-black/10 bg-white p-1" role="group" aria-label="Billing period">
          {(["monthly", "annual"] as const).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setBilling(i)}
              aria-pressed={interval === i}
              className={clsx(
                "cursor-pointer rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition-colors",
                interval === i ? "bg-brand-700 text-white" : "text-ink/60 hover:text-ink",
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <span
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            annual ? "bg-green-100 text-green-700" : "bg-[#fcdffe] text-brand-700",
          )}
        >
          Save up to {AGENCY_MAX_SAVINGS_PCT}%
        </span>
      </div>

      <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="agency-locations" className="text-sm font-semibold">
            How many locations do you manage?
          </label>
          <span className="shrink-0 text-sm font-bold text-brand-700 tabular-nums" aria-live="polite">
            {locations === AGENCY_SLIDER_MAX ? `${AGENCY_SLIDER_MAX}+` : locations} location{locations === 1 ? "" : "s"}
          </span>
        </div>
        <input
          id="agency-locations"
          type="range"
          min={1}
          max={AGENCY_SLIDER_MAX}
          value={locations}
          onChange={(e) => setLocations(Number(e.target.value))}
          className="mt-3 w-full cursor-pointer accent-brand-700"
        />
        <div className="mt-1 flex justify-between text-[10px] font-medium text-ink/40">
          {ticks.map((t) => (
            <button key={t} type="button" onClick={() => setLocations(t)} className="cursor-pointer hover:text-ink">
              {t === AGENCY_SLIDER_MAX ? `${t}+` : t}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink/55">
          Per-location pricing: the rate drops automatically at 5 and 15 locations on Growth. Set your count at checkout.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
        {agencyPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} interval={interval} locations={locations} />
        ))}
      </div>

      <p className="mt-5 text-center text-sm text-ink/55">
        {annual ? (
          "Billed yearly · cancel anytime · 30-day money-back guarantee"
        ) : (
          <>
            Start your <span className="font-semibold text-brand-700">3-day free trial</span> · cancel anytime · 30-day
            money-back guarantee
          </>
        )}
      </p>

      <details className="group mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-black/10 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          Compare all features
          <ChevronDown className="size-[18px] text-brand-700 transition-transform duration-200 group-open:rotate-180" aria-hidden />
        </summary>
        <CompareTable />
      </details>

      {footer === "more" && (
        <p className="mt-8 text-center">
          <Link href="/agencies/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            More on agency pricing <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </p>
      )}
      {footer === "standard" && (
        <p className="mt-6 text-center text-xs text-ink/50">
          Just one business of your own?{" "}
          <Link href="/pricing" className="font-semibold text-brand-700 hover:underline">
            See standard pricing →
          </Link>
        </p>
      )}
    </div>
  );
}

function PlanCard({ plan, interval, locations }: { plan: AgencyPlan; interval: AgencyInterval; locations: number }) {
  const { base } = plan;
  const popular = !!base.popular;
  const annual = interval === "annual";
  const q = agencyQuote(plan, interval, locations);

  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-3xl border bg-white p-7",
        popular ? "border-brand-700 shadow-xl ring-1 ring-brand-700/15" : "border-black/10 shadow-sm",
      )}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-700 px-3 py-1 text-[11px] font-bold tracking-wider whitespace-nowrap text-white uppercase">
          Most popular
        </span>
      )}
      <h3 className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
        {popular && <Sparkles className="size-4 text-brand-700" aria-hidden />}
        {base.name}
      </h3>
      <p className="mt-1 text-sm text-ink/60">{base.blurb}</p>

      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight tabular-nums">{fmtUsd(q.perMo)}</span>
        <span className="text-sm text-ink/55">/mo per location</span>
      </p>
      <p className={clsx("mt-1 text-xs", q.savings > 0 ? "font-semibold text-green-600" : "text-ink/45")}>
        {q.savings > 0
          ? `Volume rate at ${locations} locations · save ${fmtUsd(q.savings)}/mo each`
          : annual
            ? `${fmtUsd(q.unit)}/yr per location`
            : `${fmtUsd(q.yearlyIfMonthly)}/yr if paid monthly`}
      </p>
      <p className="mt-2 text-sm text-ink/70">
        <strong className="font-bold text-ink">{fmtUsd(q.total)}/mo</strong> total for {locations} location
        {locations === 1 ? "" : "s"}
        {annual && <span className="text-ink/45"> · billed yearly</span>}
      </p>

      <Link
        href={agencyCheckoutHref(plan.id, interval, locations)}
        className={clsx(
          "mt-5 block rounded-full py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90",
          popular ? "bg-brand-700 shadow-sm" : "bg-ink",
        )}
      >
        {annual ? "Subscribe" : "Start your 3-day free trial"}
      </Link>

      {!annual && (
        <>
          <p className="mt-2 text-center text-xs text-ink/55">3-day free trial. No contracts.</p>
          <ul className="mt-4 space-y-1.5 border-t border-black/5 pt-4 text-xs text-ink/60">
            <li className="flex gap-2">
              <Lock className="mt-px size-3.5 shrink-0" aria-hidden /> Secure payment — card details go directly to Stripe
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="mt-px size-3.5 shrink-0" aria-hidden /> 30-day rank-higher guarantee
            </li>
            <li className="flex gap-2">
              <Star className="mt-px size-3.5 shrink-0" aria-hidden /> 4.9 / 5 from 500+ local businesses · We never see your
              Google password
            </li>
          </ul>
        </>
      )}

      {base.featuresIntro && <p className="mt-6 mb-3 font-bold">{base.featuresIntro}</p>}
      <ul className={clsx("space-y-2.5 text-sm", !base.featuresIntro && "mt-6")}>
        {base.features.map((f) => (
          <li key={f.text} className={clsx("flex gap-2.5", popular || f.strong ? "font-semibold text-ink" : "text-ink/80")}>
            <Check className={clsx("mt-0.5 size-4 shrink-0", popular ? "text-brand-700" : "text-green-600")} aria-hidden />
            {f.text}
          </li>
        ))}
      </ul>
      {base.note && <p className="mt-6 border-t border-black/5 pt-4 text-xs leading-[1.6] text-ink/55">{base.note}</p>}
    </div>
  );
}

function CompareTable() {
  return (
    <div className="overflow-x-auto border-t border-black/5">
      <table className="w-full min-w-[28rem] text-sm">
        <thead>
          <tr className="border-b border-black/5 text-left">
            <th className="px-4 py-3 font-medium text-ink/50">Feature</th>
            <th className="px-4 py-3 text-center font-bold">Foundation</th>
            <th className="px-4 py-3 text-center font-bold text-brand-700">Growth</th>
          </tr>
        </thead>
        <tbody>
          {compareRows.map((row) => (
            <tr key={row.label} className="border-b border-black/5 last:border-0">
              <td className="px-4 py-2.5 text-ink/75">{row.label}</td>
              <Cell value={row.foundation} />
              <Cell value={row.growth} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value }: { value: string | boolean }) {
  return (
    <td className="px-4 py-2.5 text-center">
      {value === true ? (
        <Check className="mx-auto size-4 text-green-600" aria-label="Included" />
      ) : value === false ? (
        <span className="text-ink/25" aria-label="Not included">
          —
        </span>
      ) : (
        <span className="font-medium">{value}</span>
      )}
    </td>
  );
}
