export type PlanId = "foundation" | "growth";
export type Interval = "monthly" | "annual";

export type Plan = {
  id: PlanId;
  name: string;
  blurb: string;
  popular?: boolean;
  /** Monthly-billed price per location, by volume tier. */
  monthly: { minLocations: number; price: number }[];
  /** Annual-billed price per location per YEAR, by volume tier. */
  annual: { minLocations: number; price: number }[];
  featuresIntro?: string;
  features: { text: string; strong?: boolean }[];
  note?: string;
};

export const plans: Plan[] = [
  {
    id: "foundation",
    name: "Foundation",
    blurb: "Everything automated. Get found and start climbing.",
    monthly: [{ minLocations: 1, price: 99 }],
    annual: [{ minLocations: 1, price: 950 }],
    features: [
      { text: "Automated Google Business Profile posts — 3× a week" },
      { text: "AI review replies — opt in to auto-answer your 4–5★ reviews" },
      { text: "Google Maps rank tracking with heat maps — on demand or weekly" },
      { text: "Automated profile audit & fixes — monthly" },
      { text: "500+ automated citations in your first month" },
      { text: "5 premium citations placed by hand every month", strong: true },
      { text: "Review request landing page + QR code" },
      { text: "Review widget for your website" },
      { text: "Review velocity tracking" },
      { text: "Monthly reporting" },
      { text: "Business Profile insights" },
      { text: "Local schema + Google Maps embed for your website" },
      { text: "Facebook & Instagram posting — coming soon" },
      { text: "30-day money-back guarantee" },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    blurb: "For businesses that want to grow faster — more signals to Google.",
    popular: true,
    monthly: [
      { minLocations: 1, price: 199 },
      { minLocations: 5, price: 179 },
      { minLocations: 15, price: 159 },
    ],
    annual: [
      { minLocations: 1, price: 1899 },
      { minLocations: 5, price: 1699 },
      { minLocations: 15, price: 1499 },
    ],
    featuresIntro: "Everything in Foundation, plus:",
    features: [
      { text: "10 premium citations placed by hand every month" },
      { text: "Double the map scan coverage — more keywords, wider area" },
      { text: "Review campaigns — 250 review request emails per month" },
      { text: "AI visibility tracking (ChatGPT & Google AI)" },
      { text: "Listings sync across Apple Maps, Bing, Waze & more, with duplicate cleanup" },
    ],
    note: "Why Growth: hand-placed premium citations and consistent listings are two of the strongest levers for local map rankings. Growth doubles your citation authority and keeps your details identical everywhere customers search.",
  },
];

export const MAX_LOCATIONS = 49;

export function getPlan(id: string | null | undefined) {
  return plans.find((p) => p.id === id) ?? plans[0];
}

function tierPrice(tiers: Plan["monthly"], locations: number) {
  return [...tiers].reverse().find((t) => locations >= t.minLocations)!.price;
}

/** Price per location per month (annual plans are shown as their monthly equivalent). */
export function pricePerLocation(plan: Plan, interval: Interval, locations: number) {
  return interval === "annual" ? Math.floor(tierPrice(plan.annual, locations) / 12) : tierPrice(plan.monthly, locations);
}

export function quote(plan: Plan, interval: Interval, locations: number) {
  const monthlyRate = tierPrice(plan.monthly, locations);
  const yearlyRate = tierPrice(plan.annual, locations);
  const yearlyIfMonthly = monthlyRate * 12 * locations;
  const yearlyTotal = interval === "annual" ? yearlyRate * locations : yearlyIfMonthly;
  return {
    perLocation: pricePerLocation(plan, interval, locations),
    monthlyTotal: pricePerLocation(plan, interval, locations) * locations,
    /** Per-location monthly saving from the volume tier, in displayed terms (0 at the base tier). */
    volumeSaving: pricePerLocation(plan, interval, 1) - pricePerLocation(plan, interval, locations),
    /** Yearly cost of one location at this tier and interval. */
    yearlyPerLocation: interval === "annual" ? yearlyRate : monthlyRate * 12,
    /** What is charged each billing period after the trial. */
    dueEachPeriod: interval === "annual" ? yearlyTotal : monthlyRate * locations,
    yearlyTotal,
    yearlyIfMonthly,
    savings: yearlyIfMonthly - yearlyTotal,
  };
}

export const maxAnnualSavingsPct = Math.round(
  Math.max(...plans.flatMap((p) => p.annual.map((t, i) => 1 - t.price / (p.monthly[i].price * 12)))) * 100,
);

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Location count accepted at checkout (the marketing slider tops out at 49+). */
export const MAX_CHECKOUT_LOCATIONS = 99;

export type CheckoutPlan = { id: string; name: string; monthly: Plan["monthly"]; annual: Plan["annual"] };

/** Every plan that can be bought through /checkout. */
export const checkoutPlans: CheckoutPlan[] = [
  ...plans,
  // Agency plans bill per client location at the same rates (see src/lib/agency-pricing.ts).
  ...plans.map((p) => ({ id: `agency-${p.id}`, name: `Agency ${p.name}`, monthly: p.monthly, annual: p.annual })),
];

export function getCheckoutPlan(id: string | null | undefined): CheckoutPlan | undefined {
  return checkoutPlans.find((p) => p.id === id);
}

/** Price charged per billing period (month or year) for a checkout plan. */
export function periodPrice(plan: CheckoutPlan, interval: Interval, locations: number) {
  return tierPrice(interval === "annual" ? plan.annual : plan.monthly, locations) * locations;
}
