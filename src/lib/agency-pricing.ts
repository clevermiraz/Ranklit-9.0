import { plans as standardPlans, type Plan } from "@/lib/pricing";

export type AgencyPlanId = "agency-foundation" | "agency-growth";
export type AgencyInterval = "monthly" | "annual";

/**
 * A volume tier. `upTo` is inclusive; `null` means "and above".
 * Tiers are whole-volume: the rate for the tier you land in applies to every location.
 * Prices are whole dollars per location: `monthly` per month, `annual` per year.
 */
type Tier = { upTo: number | null; monthly: number; annual: number };

export type AgencyPlan = {
  id: AgencyPlanId;
  /** The matching standard plan (name, blurb and features are shared). */
  base: Plan;
  tiers: Tier[];
};

/** The slider goes from 1 to 49; 49 is shown as "49+". */
export const AGENCY_SLIDER_MAX = 49;
/** Hard limit on locations per agency account. */
export const AGENCY_MAX_LOCATIONS = 99;
/** Best annual saving (Growth at 15+: $1,499/yr vs 12 × $159). */
export const AGENCY_MAX_SAVINGS_PCT = 21;

const base = (id: Plan["id"]) => standardPlans.find((p) => p.id === id)!;

export const agencyPlans: AgencyPlan[] = [
  {
    id: "agency-foundation",
    base: base("foundation"),
    tiers: [{ upTo: null, monthly: 99, annual: 950 }],
  },
  {
    id: "agency-growth",
    base: base("growth"),
    tiers: [
      { upTo: 4, monthly: 199, annual: 1899 },
      { upTo: 14, monthly: 179, annual: 1699 },
      { upTo: null, monthly: 159, annual: 1499 },
    ],
  },
];

export function getAgencyPlan(id: string | null | undefined) {
  return agencyPlans.find((p) => p.id === id);
}

/** Price per location for one billing period (a month, or a year when annual). */
export function agencyUnitPrice(plan: AgencyPlan, interval: AgencyInterval, locations: number) {
  const tier = plan.tiers.find((t) => t.upTo === null || locations <= t.upTo) ?? plan.tiers[plan.tiers.length - 1];
  return interval === "annual" ? tier.annual : tier.monthly;
}

const perMonth = (unit: number, interval: AgencyInterval) => (interval === "annual" ? Math.floor(unit / 12) : unit);

export function agencyQuote(plan: AgencyPlan, interval: AgencyInterval, locations: number) {
  const unit = agencyUnitPrice(plan, interval, locations);
  const firstTierUnit = agencyUnitPrice(plan, interval, 1);
  const perMo = perMonth(unit, interval);
  return {
    /** Per location, per billing period (month or year). */
    unit,
    /** Big number on the card: per location, per month. */
    perMo,
    /** Per-location monthly saving vs the 1-location rate (Growth at 5+). */
    savings: perMonth(firstTierUnit, interval) - perMo,
    /** Monthly total for all locations. */
    total: perMo * locations,
    /** Shown when there is no volume saving. */
    yearlyIfMonthly: agencyUnitPrice(plan, "monthly", locations) * 12,
  };
}

export const agencyCheckoutHref = (id: AgencyPlanId, interval: AgencyInterval, locations: number) =>
  `/checkout?plan=${id}&interval=${interval}&locations=${locations}`;

export const fmtUsd = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
