/**
 * Template engine for the AI tools. Builds realistic, input-specific results without an LLM by
 * combining the submitted fields with industry profiles (./profiles.ts). Deterministic: the same
 * input always gives the same output, different inputs give different output.
 */
import type { ToolResultGroup, ToolResultItem } from "@/lib/data/tools";
import { cityData, genericProfile, profiles, type Pair, type Profile } from "./profiles";

export type ToolInput = Record<string, string>;

/* ───────────── small text helpers ───────────── */

const UPPER: Record<string, string> = { ac: "AC", hvac: "HVAC", ev: "EV", diy: "DIY", nap: "NAP", bbb: "BBB", seo: "SEO", llc: "LLC", oem: "OEM" };
const SMALL = new Set(["a", "an", "and", "or", "for", "in", "of", "the", "to", "vs.", "with", "on", "at", "by"]);

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w, i) => {
      if (!w) return w;
      const lower = w.toLowerCase();
      if (UPPER[lower]) return UPPER[lower];
      if (w !== lower) return w; // keep user/brand casing
      if (i > 0 && SMALL.has(lower)) return lower;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

const article = (word: string) => (/^([aeiou]|hvac|hour)/i.test(word) ? "an" : "a");

/** Join keyword parts, skipping blanks. */
const kw = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

function list(items: string[], last = "and"): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${last} ${items[items.length - 1]}`;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const item = (text: string, note?: string): ToolResultItem => (note ? { text, note } : { text });

function group(title: string, items: (ToolResultItem | string)[]): ToolResultGroup {
  const seen = new Set<string>();
  const out: ToolResultItem[] = [];
  for (const it of items) {
    const value = typeof it === "string" ? item(it) : it;
    const key = value.text.toLowerCase();
    if (!value.text || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return { title, items: out };
}

/* ───────────── deterministic randomness ───────────── */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rngFrom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ───────────── input parsing ───────────── */

const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
  DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
  MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin",
  WY: "Wyoming", DC: "District of Columbia",
};

function parseLocation(raw = "") {
  const s = raw.trim().replace(/\s+/g, " ");
  if (!s) return { city: "", region: "" };
  const parts = s.split(",").map((p) => p.trim()).filter(Boolean);
  let city = parts[0] ?? "";
  let region = (parts[1] ?? "").replace(/\b\d{5}(-\d{4})?\b/, "").trim();
  if (parts.length === 1) {
    const m = city.match(/^(.+?)\s+([A-Za-z]{2})$/);
    if (m && US_STATES[m[2].toUpperCase()]) {
      city = m[1];
      region = m[2];
    }
  }
  if (/^[a-z]{2}$/i.test(region)) region = region.toUpperCase();
  if (city === city.toLowerCase()) city = titleCase(city);
  return { city, region };
}

function normalizeBusiness(raw = ""): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "")
    .replace(/^(an?|the)\s+/i, "")
    .toLowerCase();
}

const TAIL_WORDS = new Set(["shop", "store", "services", "service", "company", "business", "restaurant", "studio", "near", "me"]);
const STOP_WORDS = new Set(["and", "the", "for", "with", "of", "my", "our", "a", "an", "in", "near", "me", "local", "best", "emergency", "mobile"]);

/* ───────────── context ───────────── */

type Ctx = {
  b: string;
  p: Profile;
  matched: boolean;
  noun: string;
  trade: string;
  brand: string;
  category: string;
  venue: boolean;
  job: string;
  city: string;
  region: string;
  /** City, or a natural fallback ("your area"). */
  cityOr: string;
  areas: string[];
  flavor: string[];
  nick?: string;
  rng: () => number;
};

function fill(s: string, c: { b: string; city: string }): string {
  const B = titleCase(c.b);
  return s
    .replaceAll("{b}", c.b)
    .replaceAll("{B}", B)
    .replaceAll("{A}", titleCase(article(B)))
    .replaceAll("{city}", c.city);
}

function resolveProfile(b: string, city: string): { p: Profile; matched: boolean } {
  const found = profiles.find((p) => p.match.test(b));
  const base: Profile = found ?? { ...genericProfile, match: /$^/ };
  // Generic business typed as a provider ("accountant", "piano tuner") rather than a service ("piano tuning").
  if (!found && /(er|or|ist|ian|ant|ent|smith)$/.test(b)) {
    base.services = ["{b} services", "{b} consultation", "same-day {b} appointments", "{b} packages", "{b} quotes", "{b} for small businesses", "affordable {b}"];
  }
  const f = (s: string) => fill(s, { b, city });
  const pairs = (xs: Pair[]): Pair[] => xs.map(([t, n]) => [f(t), f(n)]);
  return {
    matched: Boolean(found),
    p: {
      ...base,
      secondary: pairs(base.secondary),
      services: base.services.map(f),
      problems: base.problems.map(f),
      questions: pairs(base.questions),
      seasonal: base.seasonal.map(([s, k, n]) => [s, f(k), f(n)]),
      howTo: pairs(base.howTo),
      comparisons: pairs(base.comparisons),
      directories: pairs(base.directories),
    },
  };
}

function brandFromBusiness(b: string): string {
  const words = b.split(" ").filter((w) => !STOP_WORDS.has(w));
  while (words.length > 1 && TAIL_WORDS.has(words[words.length - 1])) words.pop();
  return titleCase(words.slice(-2).join(" ") || b);
}

function buildCtx(slug: string, businessRaw: string, locationRaw: string, extraSeed = ""): Ctx {
  const b = normalizeBusiness(businessRaw) || "local business";
  const { city, region } = parseLocation(locationRaw);
  const cityOr = city || "your area";
  const { p, matched } = resolveProfile(b, cityOr);
  const rng = rngFrom(hash(`${slug}|${b}|${city}|${region}|${extraSeed}`));
  const known = cityData[city.toLowerCase()];
  const areas = known
    ? shuffle(known.areas, rng)
    : city
      ? shuffle([`Downtown ${city}`, `North ${city}`, `South ${city}`, `East ${city}`, `West ${city}`], rng)
      : ["your neighborhood", "nearby towns", "the surrounding suburbs", "the next town over", "the city center"];
  const noun = p.noun ?? b;
  const nounJob: Record<string, string> = { dentist: "visit", salon: "appointment", "dog groomer": "appointment", lawyer: "case" };
  const brand = p.brand ?? brandFromBusiness(b);
  const words = p.words.length ? p.words : ["True", "North", "Bright", "Oak", "Harbor", "Maple", "Copper", "Arrow"];
  return {
    b,
    p: { ...p, words },
    matched,
    noun,
    trade: p.trade ?? b,
    brand,
    category: p.category ?? titleCase(b),
    venue: Boolean(p.venue),
    job: p.venue ? "visit" : (nounJob[noun] ?? "job"),
    city,
    region,
    cityOr,
    areas,
    flavor: known?.flavor ?? (city ? [city, `${city} Area`, "Hometown"] : ["Hometown", "Main Street", "Neighborhood"]),
    nick: known?.nick,
    rng,
  };
}

/** "emergency plumber …" for trades, "italian restaurant open now …" for venues. */
const urgentKw = (c: Ctx, ...rest: string[]) => (c.venue ? kw(c.noun, c.p.urgent, ...rest) : kw(c.p.urgent, c.noun, ...rest));

const SEASONS = new Set(["Spring", "Summer", "Fall", "Winter"]);
const seasonWord = (s: string) => (SEASONS.has(s) ? s.toLowerCase() : s);

/* ───────────── tool templates ───────────── */

type Template = (input: ToolInput) => ToolResultGroup[];

const localKeywordGenerator: Template = (input) => {
  const c = buildCtx("kwgen", input.business, input.location);
  const { b, noun, trade, city: C, region: R, p } = c;
  const svc = p.services;
  const [q0, q1, q2, q3] = p.questions.map(([q]) => q);
  return [
    group("High-Intent Service Keywords", [kw(b, C), ...svc.slice(0, 6).map((s) => kw(s, C))]),
    group("Near Me & Map Pack", [
      kw(noun, "near me"),
      kw(noun, C, R),
      urgentKw(c, "near me"),
      kw(p.urgent2, noun, C),
      kw("local", noun, C),
      c.venue ? kw(b, "near me open now") : kw(trade, "services near me"),
    ]),
    group("Location + Service Combos", [...c.areas.slice(0, 5).map((a) => kw(noun, a)), kw(svc[0], c.areas[0]), kw(svc[1], c.areas[1])]),
    group("Questions & Long-Tail", [
      q0.includes(C) ? q0 : kw(q0, C),
      q1,
      q2,
      q3,
      kw("best", noun, "in", C),
      item(kw("affordable", noun, C), "Price-conscious buyers actively comparing options"),
      kw(p.trust, noun, "near me"),
    ]),
    group("Problem-Specific Intent", p.problems.map((x) => kw(x, C))),
    group("Comparison & Trust", [
      kw("best rated", noun, C),
      kw(noun, "reviews", C, R),
      item(kw(p.trust, noun, C), "Strong trust signal for first-time customers"),
      kw(p.urgent2, trade, C),
      kw("recommended", noun, C),
    ]),
  ];
};

const localKeywordResearch: Template = (input) => {
  const c = buildCtx("kwresearch", input.business, input.location);
  const { noun, trade, city: C, region: R, p } = c;
  const svc = p.services;
  return [
    group("Transactional (Ready-to-Buy)", [
      item(urgentKw(c, C, R), "High-intent searcher with an immediate need; ready to call and pay."),
      item(kw(p.urgent2, c.venue ? c.b : trade, C), "Strong buying signal: the searcher wants to act soon, not browse."),
      item(kw(noun, "near me", C), "Actively choosing a provider; comparing who's available right now."),
      item(kw("affordable", noun, C), "Price-sensitive buyer comparing options before booking."),
      item(kw(p.trust, noun, C, R), "Credibility-conscious searcher vetting options before committing."),
      item(kw(svc[0], C), "Specific service + location = ready to book that exact job."),
      item(kw(svc[1], C), "Named service search; send it straight to a dedicated page."),
    ]),
    group("Near Me", [
      item(kw(noun, "near me"), "Mobile-first, location-aware search; wants results within a short drive."),
      item(kw(c.venue ? c.b : `${trade} services`, "near", C, R), "Wider-radius search; willing to travel a little for quality."),
      item(kw("local", noun, C), "Explicitly wants a local business; supports map-pack visibility."),
      item(kw(noun, "in my area", C), "Convenience-driven; wants the closest available option."),
      item(kw("best", noun, "near me", C), "Pairs location with a quality signal; higher conversion potential."),
    ]),
    group("Informational (Research)", [
      ...p.questions.map(([q, n]) => item(q, n)),
      item(kw(svc[2], "cost", C), "Comparing prices for a specific job before reaching out."),
    ]),
    group("Seasonal/Trending", [
      ...p.seasonal.map(([s, k, n]) => item(kw(k, C), `${s}: ${n}`)),
      item(kw("book", noun, "online", C), "Rising expectation: more people want to book without calling."),
    ]),
  ];
};

const localKeywordPlanner: Template = (input) => {
  const c = buildCtx("kwplanner", input.business, input.location);
  const { noun, city: C, region: R, p, areas } = c;
  const svcNotes = shuffle(
    [
      "Give it its own page; use it in the H1 and page title.",
      "Lead with the problem it solves, then pricing and a service-area map.",
      "Put it in the title tag and the first 100 words of the page.",
      "Support it with before/after photos or testimonials.",
      "Add a short FAQ and a clear call-to-action under the main copy.",
      "Use it in the meta description so the result matches search intent.",
    ],
    c.rng,
  );
  return [
    group("Homepage", [
      item(kw(noun, C, R), "Primary keyword: use it in the H1, title tag and opening paragraph."),
      item(urgentKw(c, C), "Feature it near the top with a click-to-call phone number above the fold."),
      item(kw(noun, "near me"), `Add your address in the footer and a "Serving ${c.cityOr}" line to capture local intent.`),
      item(kw("best", noun, "in", C), "Back it up with reviews and testimonials on the homepage to earn the click."),
    ]),
    group("Service Pages", p.services.slice(0, 6).map((s, i) => item(kw(s, C), svcNotes[i]))),
    group("Location Pages", [
      item(kw(noun, areas[0]), "Create a page for this area with local landmarks, ZIP codes and typical response times."),
      item(kw(noun, areas[1]), "Mention the neighborhoods you serve there and the jobs you do most often."),
      item(urgentKw(c, areas[2]), "Target urgent searches in a busy area; stress how quickly you can get there."),
    ]),
    group("Blog/FAQ", [
      ...p.questions.map(([q], i) =>
        item(
          i === 0 && !q.includes(C) ? kw(q, C) : q,
          [
            "FAQ post with real price ranges; improves your chances of a featured snippet.",
            `Educational post; mention "${kw(noun, C)}" naturally once or twice.`,
            "Problem-focused post that builds authority with people still researching.",
            "Planning content that links internally to your main service pages.",
            "Decision-stage content; close with your booking options and availability.",
          ][i],
        ),
      ),
      item(`how to choose ${article(noun)} ${noun} in ${c.cityOr}`, "Comparison-stage readers; show credentials, reviews and guarantees."),
    ]),
  ];
};

const localSearchVisibility: Template = (input) => {
  const c = buildCtx("visibility", input.business, input.location);
  const { noun, city: C, p, areas } = c;
  const [d0, d1] = p.directories.map(([d]) => d);
  return [
    group("Map-pack ranking factors", [
      item("Google Business Profile completeness and accuracy", `Fill in every section (hours, services, photos, attributes) and use "${c.category}" as your primary category. Complete profiles get a clear boost.`),
      item("Consistent name, address and phone across directories", `Make your details identical on Yelp, ${d0}, ${d1} and other listings. Even small typos weaken trust.`),
      item("Review volume and recency on Google", "Aim for a few new reviews every month. Fresh reviews show you're active; reply to each one within 48 hours."),
      item("Distance from the searcher", `You can't move, but "${kw(noun, "near me")}" favors the closest options. Location pages and reviews help you compete in ${areas[0]} and ${areas[1]}.`),
      item("Clicks and engagement from map results", `Strong photos of ${p.photos}, a clear category and accurate hours earn more calls and direction requests.`),
      item("Website relevance to the search", `Use "${kw(noun, C)}" naturally on your homepage and service pages and add LocalBusiness schema. Once per page is plenty.`),
    ]),
    group("Visibility quick wins", [
      item("Finish and verify your Google Business Profile this week", `Add 20+ real photos of ${p.photos}. A complete, verified profile often improves map visibility within a few weeks.`),
      item(`Get 5–10 new reviews from recent ${p.customers} this month`, `Text or email a direct review link right after each ${c.job}. A steady pace matters more than one big burst.`),
      item(`Publish a dedicated page for "${kw(p.services[0], C)}"`, "Write 300+ genuinely useful words: what it costs, how it works and the areas you cover. Link it from your profile."),
      item(`Claim your listings on ${d0} and ${d1}`, `Use exactly the same details as on Google. Plenty of competitors in ${c.cityOr} leave these half-finished.`),
      item("Add LocalBusiness schema to your website", "Mark up your name, address, phone, hours and service area so Google reads your details reliably."),
    ]),
    group("What hurts visibility", [
      item("An incomplete or outdated Google Business Profile", "Missing hours, old photos or an empty services list push you down in map results."),
      item("Mismatched name, address or phone across the web", "If Google shows one phone number and Yelp another, or an old suite number lingers, trust drops. Fix every listing."),
      item("Ignoring reviews, especially negative ones", "Unanswered complaints put customers off and make the business look inactive."),
      item("Keyword stuffing your business name or website", `A name like "Best ${titleCase(noun)} ${c.cityOr} Cheap ${titleCase(noun)}" looks spammy and can get your profile suspended.`),
      item("Fake or incentivized reviews", "Google filters suspicious patterns and can suspend profiles. Only ask real customers."),
      item("A slow or mobile-unfriendly website", `Most "${kw(noun, "near me")}" searches happen on phones. Slow pages lose calls and weaken local relevance.`),
    ]),
    group("How to track progress", [
      item("Track 5–10 key searches every week", `Check terms like "${kw(noun, C)}", "${urgentKw(c, "near me")}" and "${kw(p.services[0], C)}" from different parts of ${c.cityOr}; a geo-grid shows the full picture.`),
      item("Log new reviews and your average rating monthly", "A simple spreadsheet works. Aim for a steady flow each month and keep your average above 4.5 stars."),
      item("Watch calls, direction requests and website clicks", "Your profile's performance report shows whether better visibility is turning into real customers."),
      item("Review local queries in Google Search Console", `Filter for queries containing "${c.cityOr}" or "near me" and compare clicks month over month.`),
      item("Audit your citations every quarter", `Search your business name with ${c.cityOr} on Google, Yelp and ${d0}. Screenshot mismatches and fix them.`),
      item("Check your profile on a phone every month", "Are photos current, does the call button work, are the hours right? The mobile view is what most customers see."),
    ]),
  ];
};

const localCitationFinder: Template = (input) => {
  const c = buildCtx("citations", input.business, input.location);
  const { noun, city: C, p } = c;
  const industry = p.directories;
  const industryNames = industry.map(([d]) => d.toLowerCase()).join(" ");
  const localCandidates: Pair[] = [
    [`${c.cityOr} Chamber of Commerce`, "Member listings add local trust signals and lead to referrals from other businesses."],
    ["Nextdoor Business", `Neighbors in ${c.cityOr} ask each other for ${noun} recommendations all the time. Free to claim.`],
    [`${c.cityOr} local news business directory`, "Local media directories carry regional authority and reach residents directly."],
    [`${c.region ? `${US_STATES[c.region] ?? c.region} small business` : "Regional business"} association`, "Community and state-level listings show you're rooted in the area."],
    ["Yellow Pages (YP.com) and Superpages", "Older, but still crawled. Quick to add and they reinforce your NAP."],
    ["Foursquare", "Supplies location data to many apps and maps; worth claiming once."],
    ["Hotfrog, Manta and Local.com", "Secondary citation sites. Lower priority, but each takes only a few minutes."],
  ];
  const local = localCandidates.filter(([d]) => !industryNames.includes(d.split(" ")[0].toLowerCase())).slice(0, 6);
  return [
    group("Essential General Directories", [
      item("Google Business Profile", `Non-negotiable. It powers the map pack when people search "${kw(noun, C)}".`),
      item("Yelp", `High traffic for local searches; reviews here shape which business ${p.customers} pick.`),
      item("Apple Business Connect", "Feeds Apple Maps and Siri on every iPhone, using data separate from Google."),
      item("Bing Places for Business", "Powers Bing, Copilot and many in-car and voice searches. You can import your Google profile in minutes."),
      item("Facebook Business Page", `Locals check Facebook for hours, photos and recommendations. Add your ${c.cityOr} address and service area.`),
      item("Better Business Bureau (BBB)", `Trusted by ${p.customers} checking out a business before they get in touch.`),
    ]),
    group("Industry-Specific Directories", industry.map(([d, n]) => item(d, n))),
    group("Local/Regional Directories", local.map(([d, n]) => item(d, n))),
  ];
};

function phoneFormats(raw: string): string[] {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) return [raw.trim()];
  const [a, b, x] = [d.slice(0, 3), d.slice(3, 6), d.slice(6)];
  return [`(${a}) ${b}-${x}`, `${a}-${b}-${x}`, `${a}.${b}.${x}`, `+1 ${a} ${b} ${x}`];
}

const ADDRESS_ABBR: [RegExp, string, string][] = [
  [/\bSt\.?(?=[\s,]|$)/, "St", "Street"],
  [/\bStreet\b/, "Street", "St"],
  [/\bAve\.?(?=[\s,]|$)/, "Ave", "Avenue"],
  [/\bAvenue\b/, "Avenue", "Ave"],
  [/\bRd\.?(?=[\s,]|$)/, "Rd", "Road"],
  [/\bRoad\b/, "Road", "Rd"],
  [/\bBlvd\.?(?=[\s,]|$)/, "Blvd", "Boulevard"],
  [/\bBoulevard\b/, "Boulevard", "Blvd"],
  [/\bDr\.?(?=[\s,]|$)/, "Dr", "Drive"],
  [/\bDrive\b/, "Drive", "Dr"],
  [/\bLn\.?(?=[\s,]|$)/, "Ln", "Lane"],
  [/\bPkwy\.?(?=[\s,]|$)/, "Pkwy", "Parkway"],
  [/\bHwy\.?(?=[\s,]|$)/, "Hwy", "Highway"],
];

const citationConsistency: Template = (input) => {
  const name = input.name.trim().replace(/\s+/g, " ");
  const address = input.address.trim().replace(/\s+/g, " ");
  const phones = phoneFormats(input.phone);
  const phone = phones[0];

  const nameVariants = new Set<string>();
  if (name.includes("'")) nameVariants.add(name.replace(/'/g, ""));
  if (name.includes("&")) nameVariants.add(name.replace(/\s*&\s*/g, " and "));
  else if (/\sand\s/i.test(name)) nameVariants.add(name.replace(/\s+and\s+/i, " & "));
  if (/(,?\s*(llc|inc\.?|co\.?))$/i.test(name)) nameVariants.add(name.replace(/,?\s*(llc|inc\.?|co\.?)$/i, ""));
  else nameVariants.add(`${name} LLC`);
  const parts = address.split(",").map((s) => s.trim());
  const addrCity = parts[1] ?? "";
  const stateZip = (parts[2] ?? "").split(" ");
  const state = (stateZip[0] ?? "").toUpperCase();
  if (addrCity) nameVariants.add(`${name} ${addrCity}`);
  const shownVariants = [...nameVariants].slice(0, 3).map((v) => `"${v}"`);

  const abbr = ADDRESS_ABBR.find(([re]) => re.test(address));
  const altAddress = abbr ? address.replace(abbr[0], abbr[2]) : "";
  const suite = address.match(/\b(Ste\.?|Suite|Unit|#)\s*[\w-]+/i)?.[0];

  const c = buildCtx("nap", name, addrCity ? `${addrCity}, ${state}` : "", phone);
  const dirs = c.matched ? c.p.directories.map(([d]) => d) : ["Thumbtack", "Nextdoor Business"];
  const tradeWord = c.matched ? c.trade : "industry";
  const stateFull = US_STATES[state];

  return [
    group("Standardize your NAP format", [
      item(
        `Use exactly one business name everywhere: "${name}"${shownVariants.length ? ` (not ${list(shownVariants, "or")})` : ""}`,
        "Copy and paste your official name into every profile to avoid typos; don't add keywords or your city to it.",
      ),
      item(
        `Format the address one way: "${address}"`,
        altAddress
          ? `Don't mix "${address}" with "${altAddress}". Decide on abbreviations once and reuse them everywhere.`
          : "Decide how you write street types, suite numbers and ZIP codes once, then reuse that exact string.",
      ),
      item(
        `Use one phone format: "${phone}"`,
        phones.length > 1
          ? `Don't switch to ${list(phones.slice(1, 3).map((f) => `"${f}"`), "or")}. Pick the format you use most and stick to it.`
          : "Use the same main number everywhere, written the same way; keep tracking numbers off your core listings.",
      ),
    ]),
    group("Where to check for inconsistencies", [
      item("Google Business Profile", "Update it first; Google gives it the most weight for local results. Every other listing should mirror it."),
      item("Apple Business Connect, Bing Places and Waze", "These pull from different data sources than Google. Confirm your details appear identical on each."),
      item("Yelp, Facebook and the Better Business Bureau", "Compare the exact name, address, phone and hours. Screenshot anything that doesn't match."),
      item(`Industry directories (${list(dirs.slice(0, 2))})`, `Check the ${tradeWord} directories your customers use most and fix mismatched versions.`),
      item("Your own website footer and contact page", `Your site should show exactly "${name}", "${address}" and "${phone}".`),
    ]),
    group("Common mistakes to fix", [
      suite
        ? item(`"${suite}" included on some listings and missing on others`, `Use "${suite}" on every listing, written the same way each time.`)
        : item("Old or partial addresses on older listings", "Older directories often keep a previous address or drop the ZIP code. Update them to the full current address."),
      item("Call-tracking or old phone numbers on some sites", `Tracking numbers and old lines split your signals. List ${phone} as the main number everywhere.`),
      stateFull && addrCity
        ? item(`"${addrCity}, ${state}" mixed with "${addrCity}, ${stateFull}"`, `Pick one. The two-letter abbreviation (${state}) is the more common choice.`)
        : item("Mixing abbreviations and full words in the city and state", "Pick one style and use it on every listing."),
      item("An old address still live on older citations", `Search "${name}${addrCity ? ` ${addrCity}` : ""}" with each directory name, then update or remove outdated listings, don't just add new ones.`),
      item("Duplicate listings for the same location", "Duplicates split your reviews and confuse Google. Merge them or request removal of the extras."),
    ]),
    group("Priority directories", [
      item("1. Google Business Profile (review it every 30 days)", "This is your source of truth; every other citation should mirror it."),
      item("2. Your website (footer + contact page)", "Keep the exact same NAP in the footer and on the contact page, and add LocalBusiness schema."),
      item("3. Apple Business Connect and Bing Places", "Two big map platforms that many businesses forget to claim."),
      item("4. Yelp and Facebook", "High-authority citations that customers actually read; a mismatch here costs you."),
      item(`5. ${list(dirs.slice(0, 2))}`, `Industry listings add relevance for ${tradeWord} searches; fix these next.`),
    ]),
  ];
};

const localSeoChecker: Template = (input) => {
  const c = buildCtx("checker", input.business, input.location);
  const { noun, city: C, p, areas } = c;
  const svc = p.services;
  const [d0, d1] = p.directories.map(([d]) => d);
  return [
    group("Must-fix basics", [
      item("Claim and verify your Google Business Profile", `Without it you won't appear in the map pack for "${kw(noun, C)}". This comes first.`),
      item("Make your name, address and phone match everywhere", "Mismatches weaken rankings. Check your website, Google, Yelp and every directory you're listed on."),
      c.venue
        ? item("Confirm your map pin and opening hours are exact", `People searching "${kw(c.b, "open now")}" need accurate hours, including holidays.`)
        : item("Set your service area correctly", `List the places you actually serve, like ${areas[0]} and ${areas[1]}, instead of a vague radius.`),
      item("Write a genuine business description (around 150–250 words)", `Say what you do and where. Mention "${kw(noun, C)}" once, naturally; no stuffing.`),
      item(`Add real photos: ${p.photos}`, "Profiles with real, recent photos get more clicks and look more trustworthy than ones with stock images."),
    ]),
    group("Ranking factors to verify", [
      item("Review count and recency", "Fresh reviews carry a lot of weight. Ten reviews in the last three months often beat fifty old ones."),
      item(`Citations on ${d0}, ${d1} and Yelp`, `These sites can rank for "${kw(noun, C)}" on their own, so wrong details there hurt you twice.`),
      item("LocalBusiness schema on your website", "Structured data with your address, phone and service area helps Google verify your details."),
      item("Reviews that mention specific services", `Reviews that mention "${svc[0]}" or "${svc[1]}" reinforce relevance for those searches. Ask customers to be specific.`),
    ]),
    group("Easy improvements", [
      item("Publish a Google Post every week", "Share an offer, a recent project or a tip. Posts show you're active and give searchers a reason to click."),
      item(`Add every service you offer (${list(svc.slice(0, 3))})`, "Each listed service helps match your profile to more specific searches."),
      item(`Ask for reviews by text right after each ${c.job}`, "Send a short direct link. A quick, friendly ask has a big effect on rankings and clicks."),
      item("Answer the Q&A section yourself", `Add common questions like "Do you offer ${svc[3]}?" so strangers or competitors don't answer for you.`),
      item("Put your city in your homepage title and meta description", `Something like "${titleCase(noun)} in ${c.cityOr} | ${titleCase(svc[0])} & More" gives searchers a clear reason to click.`),
    ]),
  ];
};

const localSeoAudit: Template = (input) => {
  const c = buildCtx("audit", input.business, input.location, input.website ?? "");
  const { noun, city: C, region: R, p, areas } = c;
  const svc = p.services;
  const site = (input.website ?? "").trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const dirs = p.directories.map(([d]) => d);
  return [
    group("Google Business Profile", [
      item(
        `Primary category is set to "${c.category}"`,
        c.matched
          ? `Edit profile > Business category; add relevant secondaries like ${p.secondary[0][0]} and ${p.secondary[1][0]}.`
          : "Edit profile > Business category; pick the most specific match and add secondaries only for services you really offer.",
      ),
      item("Business name matches your real-world signage exactly, with no added keywords", `Use your real name only. Tacking "${c.cityOr}" or "${noun}" onto it risks a suspension.`),
      c.venue
        ? item("Map pin sits exactly on your entrance", "Drag the pin if needed so directions bring customers straight to your door.")
        : item(`Service area lists the specific places you cover around ${c.cityOr}`, `Add areas such as ${list(areas.slice(0, 3))} instead of a vague radius; keep it under 20.`),
      item(
        `Phone number and hours are accurate${p.urgent === "emergency" ? ", including emergency availability" : ""}`,
        "Add special hours for holidays so you never show as closed when you're open.",
      ),
      item(`At least 10 recent photos of ${p.photos} are uploaded`, "Add new real photos every month; fresh photos earn more clicks and calls."),
      item("Services and description are filled out with what you actually do", `List specific services (${list(svc.slice(0, 3))}) with prices where possible.`),
    ]),
    group("On-page / website", [
      item(
        `Homepage title tag includes your service and city, e.g. "${titleCase(noun)} in ${kw(c.cityOr + (R ? "," : ""), R)} | Your Business Name"`,
        `${site ? `Check it on ${site}: e` : "E"}dit the page title in your site settings or CMS; keep it under ~60 characters and lead with the key term.`,
      ),
      item("Your full address and phone appear in the footer on every page", "Put your name, address and phone in the footer so they're crawlable and consistent sitewide."),
      item(`You have individual service pages (${list(svc.slice(0, 3))})`, "One page per core service lets each one rank for its own searches instead of cramming everything on the homepage."),
      item(`Location pages exist for key areas beyond central ${c.cityOr}`, `Build unique pages for places like ${areas[0]} and ${areas[1]} with genuinely different content, not copy-paste duplicates.`),
      item(`${site || "Your site"} loads fast and works well on mobile`, `Test ${site || "it"} at pagespeed.web.dev; compress images and remove heavy plugins. Most local searches happen on phones.`),
      item("LocalBusiness schema markup is present with your NAP and hours", "Add structured data via your SEO plugin or a developer so Google reads your details clearly."),
    ]),
    group("Citations & NAP", [
      item("Name, address and phone are identical across Google, Yelp, BBB and Facebook", 'Pick one exact format and fix any mismatches (e.g. "Ste" vs "Suite", old phone numbers) everywhere.'),
      item(`Listed on ${c.matched ? `${c.trade} ` : ""}directories like ${list(dirs.slice(0, 3))}`, "Claim and complete these profiles; they add relevance and send real leads."),
      item(`Listed in ${C ? `${C}-area` : "local"} directories (chamber of commerce, local business sites)`, "Look for city-specific listings; a few strong local citations beat dozens of generic ones."),
      item("No duplicate Google listings exist for your business", "Search your name and address on Google Maps and request removal of duplicates so reviews and signals aren't split."),
      item("Old addresses and disconnected numbers are cleaned up", "Search your old phone and address, then update or remove outdated listings that confuse Google."),
    ]),
    group("Reviews", [
      item("You have more Google reviews than your top 3 local competitors", `Check their counts, then ask every happy ${p.customers.replace(/s$/, "")} for a review by text right after the ${c.job}.`),
      item("Overall rating is 4.5 stars or higher", "Fix the service issues behind low ratings, then build a steady flow of new positive reviews to lift the average."),
      item("You reply to every review, positive and negative, within a few days", "Thank good reviews and calmly resolve complaints. Replies show you're active and build trust."),
      item(`A simple system asks for a review after every ${c.job}`, "Use the short review link from your profile and send it by text; make it one tap for the customer."),
      item(`Recent reviews mention specific services${C ? ` and "${C}"` : ""} naturally`, `Prompt detail by asking "What did we help you with?"; natural mentions of ${svc[0]} and your area help relevance.`),
    ]),
    group("Competitors", [
      item(`You know the top 3 businesses in the map pack for "${kw(noun, C)}"`, "Search in an incognito window; note who ranks and study their categories, reviews and services."),
      item("Your review count and rating are benchmarked against those competitors", "If you're behind, prioritize reviews; it's often the fastest way to close the gap in the map pack."),
      item("You've checked which services and pages competitors rank for that you don't", `Note the gaps (for example a "${kw(svc[4], C)}" page) and build better versions.`),
      item("You know which local sites link to competitors but not to you", "Look for sponsorships, directories and local news mentions they have, then go after similar links."),
      item("Your profile is at least as complete as theirs", "Compare photos, services, Q&A and posts; match or beat the most complete competitor."),
    ]),
  ];
};

const gbpOptimizer: Template = (input) => {
  const c = buildCtx("gbp", input.business, input.location);
  const { noun, p, areas } = c;
  const svc = p.services;
  const emergency = p.urgent === "emergency";
  const [season, seasonKw] = p.seasonal[0];
  return [
    group("Quick wins (today)", [
      item(`Choose the right primary category: "${c.category}" (not a broad catch-all)`, "Your primary category is one of the strongest ranking factors for local searches."),
      emergency
        ? item("Confirm your hours, including 24/7 emergency service if you offer it", `Captures late-night "${kw(p.urgent, noun)}" searches when competitors appear closed.`)
        : item("Confirm your regular and holiday hours", "Accurate hours stop you losing customers who think you're closed."),
      item(`Use a local ${c.city ? `${c.city}-area ` : ""}phone number that matches your website`, "Enables click-to-call and keeps your NAP consistent, which supports trust and rankings."),
      item(c.venue ? "Turn on reservations or ordering links" : "Turn on messaging and set up a quick auto-reply", `Fast responses win more ${c.venue ? "tables" : `${c.job}s`}; slow ones send people to the next result.`),
      item(
        c.venue ? 'Set attributes like "Outdoor seating" or "Wheelchair accessible"' : 'Set attributes like "Online estimates" or "Onsite services" if they apply',
        "Attributes appear as badges and help you match specific searches.",
      ),
    ]),
    group("Profile completeness", [
      c.matched
        ? item(`Add relevant secondary categories such as ${list(p.secondary.slice(0, 3).map(([s]) => `"${s}"`))}`, `Lets you appear for more searches than "${noun}" alone.`)
        : item("Add 2–4 secondary categories for other services you genuinely offer", `Lets you appear for more searches than "${noun}" alone.`),
      c.venue
        ? item("Add your menu, price range and popular items", "Detailed menus help you show up for dish-specific searches.")
        : item(`Define your service areas: ${list(areas.slice(0, 3))} and other places you cover`, "Helps you rank in the specific areas where you actually work."),
      c.venue
        ? item(`Add your ordering options (${list(svc.slice(0, 3).map((s) => s.replace(c.b, "").trim()))})`, "Lets people order or book straight from your profile.")
        : item(`List each service with a short description and starting price (${list(svc.slice(0, 4))})`, "Matches detailed searches and sets price expectations, which filters for better leads."),
      item(`Write a full description that mentions your main services and ${c.cityOr} naturally`, "Reinforces relevance without resorting to keyword stuffing."),
      item(`Upload 10+ real photos: ${p.photos}, plus your logo`, "Profiles with quality photos get more calls and direction requests."),
    ]),
    group("Reviews & engagement", [
      item(`Create a short review link and send it right after every ${c.job}`, "Review volume and recency drive both rankings and conversions."),
      item("Reply to every review within 48 hours, by name and with a detail from the visit", "Shows you're actively managing the profile and builds trust with future customers."),
      item("Respond calmly to negative reviews with a fix or an offer to make it right", "Prospects watch how you handle problems, and it often recovers the relationship."),
      item(`Ask happy ${p.customers} to mention the service and their neighborhood`, "Natural mentions of services and locations reinforce relevance."),
      item("Seed the Q&A section with common questions and answer them yourself", "Answers buyer concerns upfront and keeps misinformation off your profile."),
    ]),
    group("Ongoing/monthly", [
      item("Post weekly updates: a tip, an offer or a recent project photo", "Keeps the profile active and can surface in search and Maps."),
      item("Add 3–5 fresh photos each month with descriptive captions", "A steady flow of photos signals an active, legitimate business."),
      item("Check calls, direction requests and searches in your performance report", "Shows which services and searches drive leads so you can double down."),
      item("Audit your NAP on your website, Yelp and key directories", "Consistent listings prevent ranking dilution and customer confusion."),
      item(`Refresh seasonal services and hours (e.g. ${seasonKw} in ${seasonWord(season)})`, "Captures timely, high-intent searches throughout the year."),
    ]),
  ];
};

const categoryAnalyzer: Template = (input) => {
  const typed = input.category.trim().replace(/\s+/g, " ");
  const c = buildCtx("category", typed, input.location ?? "");
  const { p, city: C } = c;
  const recommended = c.category;
  const same = typed.toLowerCase() === recommended.toLowerCase();
  const primary = !c.matched
    ? item(titleCase(typed), `Keep "${titleCase(typed)}" as your primary if it's the closest match in Google's list. Type it into the category field and pick the most specific suggestion that appears.`)
    : same
      ? item(recommended, `This is the right choice. It's the most specific match for what you do${C ? ` and has solid demand in ${C}` : ""}. Google weights exact category matches heavily in local results.`)
      : item(recommended, `Switch from "${titleCase(typed)}" to "${recommended}" if it describes your main service. It's the most specific category for this kind of business, and specificity wins in local results.`);
  const svcNotes = [
    "Your core revenue driver; listing it explicitly helps Google match local searches.",
    `A specific service with its own search demand${C ? ` in ${C}` : ""}.`,
    "High-value work; people rarely shop around when they need it, so being visible matters.",
    "Sets you apart from generalists and signals real expertise.",
    "A natural add-on that reaches customers already ready to spend.",
  ];
  const T = titleCase(typed);
  const secondary = c.matched
    ? p.secondary.map(([s, n]) => item(s, n))
    : [
        item(`Related categories Google suggests for "${T}"`, "Start typing in the category field and add only the options that describe services you actually offer."),
        item("A category for your second-biggest service", "If a real share of your revenue comes from another service, give it its own category."),
        item("A category that reflects how customers buy", "Store, studio or mobile service, but only if it's accurate; it helps with 'near me' and 'open now' searches."),
        item(`The secondary categories top-ranking ${T} profiles use`, "Check the businesses ranking above you and add the ones that genuinely apply to you too."),
      ];
  const services = c.matched
    ? p.services.slice(0, 5).map((s) => titleCase(s))
    : [
        "Your core service, named the way customers search for it",
        "Your highest-value service or package",
        "Same-day, emergency or after-hours options (if you offer them)",
        "Consultations, quotes or estimates",
        "Memberships, plans or repeat-visit offers",
      ];
  return [
    group("Recommended Primary Category", [primary]),
    group("Secondary Categories to Add", secondary),
    group("Key Services to List", services.map((s, i) => item(s, svcNotes[i]))),
    group("Common Mistakes to Avoid", [
      item(`Choosing a broad category instead of "${recommended}"`, "Generic categories lower relevance. Pick the most specific option that describes your main service."),
      item("Listing 15+ vague services instead of 8–10 clear ones", "A focused list sends a clearer signal than a long, padded one."),
      item("Adding unrelated categories to show up in more searches", "Mismatched categories dilute relevance and can trigger a profile review."),
      c.matched
        ? item(`Forgetting "${p.secondary[0][0]}" as a secondary category`, "Plenty of competitors skip it, yet it covers searches your primary category misses.")
        : item("Leaving secondary categories empty", "Plenty of competitors skip them, yet they cover searches your primary category misses."),
      item("Not updating services when your offer changes", `Outdated services confuse Google and customers. Review them every quarter${C ? ` as the ${C} market shifts` : ""}.`),
    ]),
  ];
};

const competitorAnalysis: Template = (input) => {
  const c = buildCtx("competitors", input.business, input.location);
  const { noun, city: C, p, areas } = c;
  const svc = p.services;
  const customer = p.customers.replace(/s$/, "");
  return [
    group("What to compare", [
      item("Google Business Profile completeness", `Open the top 3 results for "${kw(noun, C)}" in Google Maps and list every section they've filled in (services, hours, photos, Q&A), then match or beat it.`),
      item("Review count and star rating", "Note each competitor's total reviews and average rating; set a 90-day goal to pass the closest one above you."),
      c.venue
        ? item("Menu, specials and opening hours", "Compare menus, offers and hours, then highlight what only you offer.")
        : item("Services listed and service area", `Write down which services (${list(svc.slice(0, 3))}) and areas each one targets.`),
      item("Website pages per service and area", "Count their dedicated service and location pages; a site with 15 focused pages usually outranks one with 3."),
      item("Pricing transparency and offers", "Note who shows prices, free estimates or coupons, then put a clear offer on your homepage and profile."),
      c.venue
        ? item("Reservation and ordering options", "Check who offers online reservations, pickup or delivery, and make yours just as easy.")
        : item("Response time and booking options", "Call two competitors and see how quickly they answer; add online booking or after-hours answering if they don't."),
    ]),
    group("Where competitors usually win", [
      item("Volume of recent reviews", `Text every recent ${customer} a direct Google review link this week to close the gap.`),
      item("Photos on their profile", `Upload 20+ real photos (${p.photos}); most local businesses neglect this.`),
      p.urgent === "emergency"
        ? item("Emergency / 24-7 positioning", "If they advertise 24/7 service, add an after-hours answering service and say so prominently.")
        : item(`"${titleCase(p.urgent)}" positioning`, `If competitors highlight ${p.urgent} options, offer your own version and promote it clearly.`),
      item("Years in business and trust signals", `Show your ${/licensed/.test(p.trust) ? "license number, insurance, " : ""}guarantees and "serving ${c.cityOr} since ___" on your homepage.`),
      item("Paid ads and Local Services Ads", "Check whether competitors run Local Services Ads or map ads; test a small budget on your best service."),
    ]),
    group("Gaps you can exploit", [
      item("Neglected neighborhoods", `Look for areas competitors ignore (e.g. ${list(areas.slice(0, 3))}) and build a page targeting each.`),
      item("Unanswered reviews", "If their negative reviews go unanswered, make a habit of replying to all of yours within 24 hours."),
      item("Thin or missing service pages", `Create detailed pages for work they skip (${list(svc.slice(4, 7))}).`),
      item("Weak or no FAQ content", `Add an FAQ answering "${p.questions[0][0]}" with ${c.cityOr} pricing to capture high-intent searches.`),
      item("Slow or non-mobile websites", "Test their sites on your phone; if they're slow, make yours load in under 3 seconds to win mobile searchers."),
      item("Few citations or inconsistent info", "Make sure your name, address and phone match everywhere; fix the inconsistencies competitors have ignored."),
    ]),
    group("Tools/where to look", [
      item("Google Maps in an incognito window", `Search "${kw(noun, C)}" logged out to see rankings without personalization.`),
      item("Competitors' Google Business Profiles", "Study their services, posts and photos for things you can do better."),
      item(p.directories[0][0], "See which competitors are listed there and how their reviews compare with yours."),
      item("Their websites + PageSpeed Insights", "Run competitor sites through PageSpeed Insights to spot speed weaknesses you can beat."),
      item("Yelp, BBB and Facebook", "Claim and complete your profiles everywhere competitors appear."),
      item("Google autocomplete", `Type "${kw(noun, C)}" into Google and note the suggestions to find terms competitors miss.`),
    ]),
  ];
};

const VIBES: { match: RegExp; adjectives: string[]; suffixes: string[]; label: string }[] = [
  { match: /modern|minimal|sleek|clean|tech/, adjectives: ["Nova", "Modern", "Studio", "Kinetic"], suffixes: ["Lab", "Studio", "Collective"], label: "modern" },
  { match: /friend|warm|fun|playful|casual|family/, adjectives: ["Happy", "Hello", "Neighborly", "Sunny"], suffixes: ["Buddies", "Crew", "Club"], label: "friendly" },
  { match: /premium|luxury|upscale|elegant|high/, adjectives: ["Signature", "Elite", "Gilded", "Velvet"], suffixes: ["Atelier", "House", "Reserve"], label: "premium" },
  { match: /classic|traditional|vintage|old|heritage/, adjectives: ["Heritage", "Classic", "Founders", "Old Town"], suffixes: ["& Sons", "Works", "Trading Co."], label: "classic" },
  { match: /bold|edgy|strong|rugged/, adjectives: ["Iron", "Bold", "Rogue", "Titan"], suffixes: ["Works", "Supply", "Union"], label: "bold" },
];

const nameGenerator: Template = (input) => {
  const vibeRaw = (input.vibe ?? "").trim().toLowerCase();
  const c = buildCtx("names", input.business, input.location ?? "", vibeRaw);
  const { brand, city: C, rng } = c;
  const W = shuffle(c.p.words, rng);
  const pro = shuffle(["Reliable", "Prime", "True", "Clear", "Precision", "Keystone", "Allied", "Summit", "Trusted", "Bright"], rng);
  const premium = shuffle(["Artisan", "Paramount", "Pinnacle", "Signature", "Estate", "Sterling", "Crown", "Heritage", "Meridian", "Regal"], rng);
  const vibe = VIBES.find((v) => v.match.test(vibeRaw));
  const fit = vibeRaw ? ` Fits the ${vibe?.label ?? vibeRaw} style you asked for.` : "";

  const catchy: ToolResultItem[] = [
    item(`The ${W[0]} Crew`, "Casual, team-oriented feel; stands out in ads and word-of-mouth."),
    item(`${W[1]} Theory`, "Modern and a little clever; appeals to customers who notice good naming."),
    item(`${W[2]} & Co.`, "Short, confident and easy to turn into a logo."),
    item(`Good ${W[3]} ${brand}`, "Upbeat and approachable; sets a positive tone before the first call."),
    item(`${W[4] ?? W[0]} Society`, "Feels like a community, not just a company; great for loyalty."),
    item(`${W[5] ?? W[1]}works`, "One-word brand that's easy to say, spell and remember."),
  ];
  if (vibeRaw && !vibe) catchy[0] = item(catchy[0].text, `${catchy[0].note}${fit}`);
  if (vibe) {
    catchy[0] = item(`${vibe.adjectives[0]} ${W[0]} ${brand}`, `Puts the ${vibe.label} tone right in the name.`);
    catchy[1] = item(`${W[1]} ${vibe.suffixes[0]}`, `A ${vibe.label} twist on a familiar word; memorable on a sign or a van.${fit}`);
  }

  const cityNames: ToolResultItem[] = C
    ? [
        item(`${C} ${W[0]} Works`, `Ties the brand to ${C} instantly; "works" suggests action and expertise.`),
        item(`${c.flavor[0]} ${brand}`, "Uses a well-known local identity; regional pride is a strong draw."),
        item(c.nick ? `${c.nick} ${brand} Co.` : `${C} ${brand} Co.`, c.nick ? "Uses the city's popular nickname; feels local and insider-approved." : "Simple, local and easy to find when people search your city."),
        item(`${c.areas[0]} ${brand}`, "Neighborhood-specific; signals you know the area and its customers."),
        item(`${c.flavor[1] ?? C} ${W[1]} Co.`, "Memorable local anchor that still leaves room to expand."),
        item(`Greater ${C} ${brand}`, "Signals coverage across the whole metro, not just one neighborhood."),
      ]
    : [
        item(`Hometown ${brand}`, "Warm and local; add your town name later for an even stronger link."),
        item(`Main Street ${W[0]} Co.`, "Evokes a trusted, independent local business."),
        item(`Neighborhood ${brand} Pros`, "Friendly and community-minded; works in any town."),
        item(`Corner ${W[1]} ${brand}`, "Feels like the go-to spot just down the road."),
        item(`Village ${brand} Co.`, "Small-town charm that suits a personal, local service."),
        item(`Local ${W[2]} Collective`, "Community feel; works well if you grow into a team."),
      ];

  return [
    group("Clean & Professional", [
      item(C ? `${C} ${brand} Pros` : `${pro[5]} ${brand} Pros`, "Direct and trustworthy; tells people exactly what you do."),
      item(`${pro[0]} ${W[0]} ${brand}`, "Leads with dependability, the first thing customers look for."),
      item(`${pro[1]} ${brand} Co.`, "Classic and professional; works on a van, a sign or a domain name."),
      item(`${W[1]} & ${W[2]} ${brand}`, "A memorable pairing that hints at what you do without being cheesy."),
      item(`${pro[2]} ${brand} Services`, "Straightforward and flexible as you add new services."),
      item(`${pro[3]} ${brand} Group`, "Sounds established without feeling stiff."),
    ]),
    group("Catchy & Memorable", catchy),
    group("Location-Based", cityNames),
    group("Premium/Upscale", [
      item(`${premium[0]} ${brand} Co.`, "Positions the work as craftsmanship; supports premium pricing naturally."),
      item(`${premium[1]} ${brand}${C ? ` ${C}` : ""}`, "Clear premium positioning that everyone understands."),
      item(`${premium[2]} ${W[3] ?? W[0]} ${brand}`, "Suggests precision and care; appeals to higher-end customers."),
      item(`${premium[3]} ${brand} Group`, "Conveys top-tier status without sounding pretentious."),
      item(`${premium[4]} ${brand} Collective`, "Feels bespoke and attentive, like a boutique service."),
      item(`${premium[5]} ${brand} House`, "Implies a high-touch experience; polished and memorable."),
    ]),
  ];
};

const HIGHLIGHT_PHRASES: [RegExp, string][] = [
  [/24-7|24 ?hours?|around the clock/, "24/7 availability"],
  [/family/, "a family-owned team"],
  [/veteran/, "a veteran-owned crew"],
  [/woman|women/, "a woman-owned business"],
  [/free (quote|estimate)s?/, "free quotes"],
  [/licen[sc]ed|insured|bonded/, "licensed, insured pros"],
  [/same[- ]day/, "same-day service"],
  [/warrant|guarantee/, "a satisfaction guarantee"],
  [/eco|green|organic|natural/, "eco-friendly products"],
  [/years?|since|decade/, "years of local experience"],
];

function highlightPhrases(raw = ""): string[] {
  return raw
    .split(/[,;/]|\band\b|\+/i)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => HIGHLIGHT_PHRASES.find(([re]) => re.test(s.toLowerCase()))?.[1] ?? s)
    .filter((s, i, arr) => arr.indexOf(s) === i)
    .slice(0, 4);
}

const descriptionGenerator: Template = (input) => {
  const raw = input.highlights ?? "";
  const c = buildCtx("descriptions", input.business, input.location, raw);
  const { noun, cityOr: C, p, areas } = c;
  const H = highlightPhrases(raw.replace(/24\s*\/\s*7/g, "24-7"));
  const svc = p.services.map((s) => s.replace(c.b, "").trim() || s);
  const isLicensed = /licensed/.test(p.trust);
  const trust = c.venue
    ? `${C}'s neighborhood ${noun}${H.length ? `, known for ${list(H)}` : ""}. We serve guests from ${areas[0]}, ${areas[1]} and across ${C}, with ${list(svc.slice(0, 3))} available most days. Everything is made with care by people who love what they do. Stop by, say hello and see why locals keep coming back.`
    : `${C}'s trusted ${noun}${H.length ? `, offering ${list(H)}` : ""}. We handle ${list(svc.slice(0, 3))} across ${C} and nearby areas like ${areas[0]} and ${areas[1]}. Every ${c.job} is done right the first time, with clear communication from start to finish. ${isLicensed ? "Licensed, insured and" : "Proudly local and"} ready to help when you need us.`;
  const value = c.venue
    ? `Looking for a great ${noun} in ${C}? ${H.length ? `Expect ${list(H)}, plus` : "Expect"} fair prices and generous portions every time. From ${svc[0]} to ${svc[3]}, we keep things simple, fresh and good value. Drop in today or order ahead.`
    : `Need ${article(noun)} ${noun} in ${C}? ${H.length ? `Expect ${list(H)}, plus` : "Expect"} upfront, honest pricing so you know the cost before any work begins. From ${svc[0]} to ${svc[3]}, we focus on quality at a fair price, with no surprises on the bill. Get in touch today for a fast, friendly answer.`;
  const community = `As a local ${C} business, we treat every ${p.customers.replace(/s$/, "")} like a neighbor${H.length ? ` and back it up with ${list(H)}` : ""}. ${
    c.venue
      ? "That means a warm welcome, consistent quality and fair prices on every visit."
      : "That means showing up on time, doing things properly and being honest about what you really need."
  } ${capitalize(list(svc.slice(0, 4)))}: we've got ${C} covered.`;
  return [
    group("Description options", [item(trust, "trust-focused"), item(value, "value-focused"), item(community, "community-focused")]),
  ];
};

const contentIdeas: Template = (input) => {
  const c = buildCtx("content", input.business, input.location);
  const { cityOr: C, p, areas } = c;
  const customersTitle = titleCase(p.customers);
  return [
    group("How-to/Educational", p.howTo.map(([t, n]) => item(t, n))),
    group("Local/Community", [
      c.venue
        ? item(`Our Favorite Things to Do Near Our ${C} Spot`, "Neighborhood guide that earns shares and local links.")
        : item(`What ${C} ${customersTitle} Should Know About ${titleCase(c.trade)}`, "Hyper-local primer that shows real knowledge of the area."),
      item(`Meet the Team: The Faces Behind Our ${C} Business`, "Trust-building story that puts faces to the name."),
      c.venue
        ? item(`Coming From ${areas[0]} or ${areas[1]}? Here's How to Find Us`, "Practical location content that supports map visibility.")
        : item(`Serving ${areas[0]} and ${areas[1]}: What We See Most in Each Area`, "Location-specific content that supports your area pages."),
      item(`How We Give Back to the ${C} Community`, "Sponsorships and events earn local links and goodwill."),
    ]),
    group("Comparison/Buyer Guide", p.comparisons.map(([t, n]) => item(t, n))),
    group(
      "Seasonal",
      c.matched
        ? p.seasonal.map(([s, k, n]) => item(`${titleCase(k)} in ${C}: Your ${s} Checklist`, n))
        : [
            item(`Spring Checklist: When to Book ${titleCase(c.b)} in ${C}`, "Fresh-start season; readers are planning ahead."),
            item(`Summer Scheduling Tips for ${titleCase(c.b)} Customers`, "Schedules shift in summer; helps people book before you fill up."),
            item(`Getting ${titleCase(c.b)} Done Before the Holidays`, "Year-end urgency drives bookings in the fall."),
            item(`Give the Gift of ${titleCase(c.b)}: A Holiday Gift Card Guide`, "Gift-giving season; easy extra revenue."),
          ],
    ),
  ];
};

export const templates: Record<string, Template> = {
  "local-keyword-generator": localKeywordGenerator,
  "local-keyword-research-tool": localKeywordResearch,
  "local-business-keyword-planner": localKeywordPlanner,
  "local-search-visibility-analyzer": localSearchVisibility,
  "local-citation-finder": localCitationFinder,
  "citation-consistency-analyzer": citationConsistency,
  "local-seo-checker": localSeoChecker,
  "local-seo-audit-tool": localSeoAudit,
  "google-business-profile-optimizer": gbpOptimizer,
  "business-category-seo-analyzer": categoryAnalyzer,
  "local-competitor-analysis-tool": competitorAnalysis,
  "local-business-name-generator": nameGenerator,
  "local-business-description-generator": descriptionGenerator,
  "local-seo-content-idea-generator": contentIdeas,
};

export function renderTemplate(slug: string, input: ToolInput): ToolResultGroup[] {
  const template = templates[slug];
  return template ? template(input).filter((g) => g.items.length > 0) : [];
}
