"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, ChevronDown, Lock, ShieldCheck, Sparkles, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { MAX_LOCATIONS, maxAnnualSavingsPct, plans, quote, usd, type Interval, type Plan } from "@/lib/pricing";
import { compareRows } from "@/lib/data/compare";

const ticks = [1, 5, 15, MAX_LOCATIONS];

export function PricingPlans({ showAgencyNote = true }: { showAgencyNote?: boolean }) {
  const [interval, setInterval] = useState<Interval>("monthly");
  const [locations, setLocations] = useState(1);
  const label = `${locations}${locations === MAX_LOCATIONS ? "+" : ""} location${locations === 1 ? "" : "s"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex rounded-full border border-ink/10 bg-white p-1 shadow-card" role="group" aria-label="Billing interval">
          {(["monthly", "annual"] as const).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInterval(i)}
              aria-pressed={interval === i}
              className={clsx(
                "rounded-full px-5 py-2 text-[15px] font-semibold capitalize transition-colors",
                interval === i ? "bg-brand-gradient text-white" : "text-ink/60 hover:text-ink",
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", interval === "annual" ? "bg-emerald-50 text-emerald-700" : "bg-[#fcdffe] text-brand-700")}>
          Save up to {maxAnnualSavingsPct}%
        </span>
      </div>

      <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-ink/[0.06] bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="locations" className="text-[15px] font-semibold">
            How many locations do you manage?
          </label>
          <span className="text-[15px] font-bold text-brand-700">{label}</span>
        </div>
        <input
          id="locations"
          type="range"
          min={1}
          max={MAX_LOCATIONS}
          value={locations}
          onChange={(e) => setLocations(Number(e.target.value))}
          className="mt-4 w-full accent-brand-700"
        />
        <div className="mt-1 flex justify-between text-[10px] font-medium text-ink/40">
          {ticks.map((t) => (
            <button key={t} type="button" onClick={() => setLocations(t)} className="hover:text-ink">
              {t}
              {t === MAX_LOCATIONS ? "+" : ""}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink/55">
          Per-location pricing — the rate drops automatically at 5 and 15 locations on Growth. Set your count at checkout.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-[900px] gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} interval={interval} locations={locations} />
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-ink/55">
        {interval === "annual" ? (
          "Billed yearly · cancel anytime · 30-day money-back guarantee"
        ) : (
          <>
            Start your <span className="font-semibold text-brand-700">3-day free trial</span> · cancel anytime · 30-day money-back guarantee
          </>
        )}
      </p>

      <details className="group mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-black/10 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          Compare all features
          <ChevronDown className="size-5 text-brand-700 transition-transform group-open:rotate-180" />
        </summary>
        <CompareTable />
      </details>

      {showAgencyNote && <p className="mt-8 text-center text-ink/60">
        Run an agency? White-label reporting is included.{" "}
        <Link href="/agencies/pricing" className="font-bold text-brand-700 hover:underline">
          See agency pricing →
        </Link>
      </p>}
    </div>
  );
}

function PlanCard({ plan, interval, locations }: { plan: Plan; interval: Interval; locations: number }) {
  const q = quote(plan, interval, locations);
  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-3xl bg-white p-7 shadow-card",
        plan.popular ? "border-2 border-brand-600/70" : "border border-ink/[0.08]",
      )}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-700 px-3 py-1 text-[11px] font-bold tracking-wider text-white">
          MOST POPULAR
        </span>
      )}
      <h3 className="flex items-center gap-1.5 text-xl font-bold">
        {plan.popular && <Sparkles className="size-4 text-brand-600" />}
        {plan.name}
      </h3>
      <p className="mt-1 text-[15px] text-ink/60">{plan.blurb}</p>

      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold tracking-tight">{usd(q.perLocation)}</span>
        <span className="text-[15px] text-ink/55">/mo per location</span>
      </p>
      {q.volumeSaving > 0 ? (
        <p className="mt-1.5 text-xs font-semibold text-emerald-600">
          Volume rate at {locations} locations · save {usd(q.volumeSaving)}/mo each
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-ink/45">
          {interval === "annual" ? `${usd(q.yearlyPerLocation)}/yr per location` : `${usd(q.yearlyPerLocation)}/yr if paid monthly`}
        </p>
      )}
      <p className="mt-2 text-sm text-ink/70">
        <strong className="text-ink">{usd(q.monthlyTotal)}/mo</strong> total for {locations} location{locations === 1 ? "" : "s"}
        {interval === "annual" && <span className="text-ink/45"> · billed yearly</span>}
      </p>

      <ButtonLink
        href={`/checkout?plan=${plan.id}&interval=${interval}&locations=${locations}`}
        variant={plan.popular ? "primary" : "dark"}
        className="mt-5 w-full"
      >
        {interval === "annual" ? "Subscribe" : "Start your 3-day free trial"}
      </ButtonLink>
      {interval === "monthly" && (
        <>
          <p className="mt-2 text-center text-xs text-ink/55">3-day free trial. No contracts.</p>
          <ul className="mt-5 space-y-1.5 border-t border-ink/[0.06] pt-4 text-xs text-ink/55">
            <li className="flex gap-2"><Lock className="size-3.5 shrink-0" /> Secure payment — card details go directly to Stripe</li>
            <li className="flex gap-2"><ShieldCheck className="size-3.5 shrink-0" /> 30-day rank-higher guarantee</li>
            <li className="flex gap-2"><Star className="size-3.5 shrink-0" /> 4.9 / 5 from 500+ local businesses · We never see your Google password</li>
          </ul>
        </>
      )}

      {plan.featuresIntro && <p className="mt-5 font-bold">{plan.featuresIntro}</p>}
      <ul className="mt-4 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f.text} className={clsx("flex gap-2.5 text-[15px]", plan.popular || f.strong ? "font-semibold" : "text-ink/75")}>
            <Check className={clsx("mt-0.5 size-4 shrink-0", plan.popular ? "text-brand-600" : "text-emerald-600")} />
            {f.text}
          </li>
        ))}
      </ul>
      {plan.note && <p className="mt-5 border-t border-ink/[0.06] pt-4 text-[13px] leading-relaxed text-ink/55">{plan.note}</p>}
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
              <CompareCell value={row.foundation} />
              <CompareCell value={row.growth} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompareCell({ value }: { value: string | boolean }) {
  return (
    <td className="px-4 py-2.5 text-center">
      {value === true ? (
        <Check className="mx-auto size-4 text-emerald-600" aria-label="Included" />
      ) : value === false ? (
        <span className="text-ink/25" aria-label="Not included">—</span>
      ) : (
        <span className="font-medium">{value}</span>
      )}
    </td>
  );
}
