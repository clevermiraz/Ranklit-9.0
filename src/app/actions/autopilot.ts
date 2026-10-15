"use server";

import { mutate } from "@/lib/server/app";
import { seeded, startScan } from "@/lib/server/store";
import type { BusinessState, GridSize, StrategyKeyword, Weekday } from "@/lib/app/types";
import { WEEKDAYS } from "@/lib/app/types";

const WEEKLY_GRIDS: GridSize[] = [5, 7, 9];

const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const cleanList = (list: string[], max = 20, len = 80) => {
  const out: string[] = [];
  for (const raw of list) {
    const v = clean(String(raw)).slice(0, len);
    if (v && !out.some((o) => o.toLowerCase() === v.toLowerCase())) out.push(v);
  }
  return out.slice(0, max);
};

// ---- weekly auto-scan ------------------------------------------------------------

export async function saveWeeklyScanAction(input: { grid: GridSize; day: Weekday; enabled: boolean }) {
  return mutate(({ business }) => {
    if (!WEEKLY_GRIDS.includes(input.grid)) return { error: "Pick a scan area." };
    if (!WEEKDAYS.includes(input.day)) return { error: "Pick a day of the week." };
    const keywords = business.strategy.keywords.filter((k) => k.checked).length;
    if (input.enabled && keywords === 0) return { error: "Add a keyword to your Ranking Strategy first." };
    const was = business.weeklyScan.enabled;
    business.weeklyScan = { enabled: input.enabled, day: input.day, grid: input.grid };
    if (input.enabled) {
      business.automations.autoScan = true;
      business.automations.reviewed = true;
    }
    if (input.enabled && !was) return { ok: `Weekly auto-scans are on. Next scan runs on ${input.day}.` };
    if (!input.enabled && was) return { ok: "Weekly auto-scans are off." };
    return { ok: "Weekly scan settings saved." };
  });
}

// ---- strategy generation ---------------------------------------------------------------------

const VOLUMES = [10, 20, 30, 40, 50, 70, 90, 110, 140, 170, 210, 260, 320, 390, 480, 590, 720, 880, 1000, 1300, 1600, 1900, 2400];

/** Deterministic "monthly searches" estimate for a keyword. Higher `weight` = broader term. */
function volumeFor(term: string, weight: number) {
  const r = seeded(term.toLowerCase())();
  const base = Math.round(weight * (VOLUMES.length - 6));
  const idx = Math.min(VOLUMES.length - 1, Math.max(0, base + Math.floor(r * 6)));
  return VOLUMES[idx];
}

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

type Interview = { services?: string; customer?: string; area?: string };

function buildStrategy(b: BusinessState, answers: Interview = {}) {
  const p = b.profile;
  const area = clean(answers.area ?? "") || p.city || "your area";
  const place = area.toLowerCase();
  const category = (p.primaryCategory || p.categories[0] || "local business").toLowerCase();
  const services = answers.services
    ? cleanList(answers.services.split(/[,\n]/), 8, 60)
    : cleanList(p.services.length ? p.services : b.strategy.services, 8, 60);

  const keywords: StrategyKeyword[] = [];
  const add = (term: string, role: "main" | "secondary", source: string, weight: number) => {
    const t = clean(term.toLowerCase());
    if (!t || keywords.some((k) => k.term === t)) return;
    keywords.push({ id: crypto.randomUUID(), term: t, role, volume: volumeFor(t, weight), source, checked: true });
  };

  add(`${category} ${place}`, "main", "Your Google category", 0.95);
  for (const c of p.categories.slice(1)) add(`${c} ${place}`, "secondary", "Your other Google category", 0.55);
  for (const s of services) add(`${s} ${place}`, "secondary", "Service you offer", 0.5);
  add(`${category} near me`, "secondary", "Common search near you", 0.8);
  add(`best ${category} ${place}`, "secondary", "Common search near you", 0.45);
  add(`emergency ${category} ${place}`, "secondary", "Common search near you", 0.4);

  const main = keywords[0];
  const secondary = keywords.slice(1, 7); // 4–6 secondary
  const picked = [main, ...secondary];

  const rand = seeded(`${p.id}-${place}`);
  const cityWord = titleCase(area.split(",")[0]);
  const catWord = titleCase(category);
  const competitorPool = [
    `${cityWord} ${catWord} Pros`,
    `Top Notch ${catWord}`,
    `${cityWord} Family ${catWord}`,
    `Reliable ${catWord} Co.`,
    `${catWord} Express ${cityWord}`,
    `Summit ${catWord} Services`,
  ];
  const competitors = competitorPool.sort(() => rand() - 0.5).slice(0, 3);

  const rating = b.reviews.length ? b.reviews.reduce((a, r) => a + r.rating, 0) / b.reviews.length : 0;
  const differentiators = cleanList([
    "Fast response, same-day when we can",
    "Upfront, honest pricing",
    `Locally owned and serving ${cityWord}`,
    ...(rating >= 4.5 ? [`Rated ${rating.toFixed(1)}★ on Google`] : []),
  ]);

  return {
    keywords: picked,
    targetKeywords: picked.map((k) => k.term),
    customer: clean(answers.customer ?? "") || `People in ${cityWord} and nearby who need a ${category} they can trust, without the runaround.`,
    services: services.slice(0, 5),
    differentiators,
    competitors,
  };
}

/** "Let Ranklit set it" and the re-run interview both land here. */
export async function generateStrategyAction(answers?: Interview) {
  return mutate(({ business, account }) => {
    const next = buildStrategy(business, answers);
    const max = account.maxKeywords;
    business.strategy = {
      ...business.strategy,
      ...next,
      keywords: next.keywords.map((k, i) => ({ ...k, checked: i < max })),
    };
    business.activity.unshift({
      id: crypto.randomUUID(),
      emoji: "🎯",
      text: `Ranking strategy set — main keyword “${next.keywords[0].term}”.`,
      at: new Date().toISOString(),
    });
    const scanNote = business.scans.length === 0 ? queueFreeScan(business) : "";
    return { ok: `${answers ? "Thanks! Your strategy was rebuilt from your answers." : "Done — Ranklit set your strategy."}${scanNote}` };
  });
}

/** The first map scan for a location is free: queue it for the main (or first checked) keyword. */
function queueFreeScan(business: BusinessState) {
  const checked = business.strategy.keywords.filter((k) => k.checked);
  if (!checked.length) return "";
  const first = checked.find((k) => k.role === "main") ?? checked[0];
  startScan(business, first.term, business.scanArea, "one-time");
  business.activity.unshift({ id: crypto.randomUUID(), emoji: "📍", text: `Free first map scan started for “${first.term}”.`, at: new Date().toISOString() });
  return ` Your free first map scan for “${first.term}” is running.`;
}

// ---- keywords --------------------------------------------------------------------------------

export async function saveKeywordsAction(list: StrategyKeyword[]) {
  return mutate(({ business, account }) => {
    if (!Array.isArray(list) || list.length > 60) return { error: "Too many keywords." };
    const seen = new Set<string>();
    const keywords: StrategyKeyword[] = [];
    for (const k of list) {
      const term = clean(String(k.term ?? "").toLowerCase()).slice(0, 80);
      if (!term || seen.has(term)) continue;
      seen.add(term);
      keywords.push({
        id: typeof k.id === "string" && k.id ? k.id : crypto.randomUUID(),
        term,
        role: k.role === "main" ? "main" : "secondary",
        volume: typeof k.volume === "number" ? k.volume : volumeFor(term, 0.35),
        source: clean(String(k.source ?? "")) || "Added by you",
        checked: !!k.checked,
      });
    }
    // Only one main keyword.
    let mainSeen = false;
    for (const k of keywords) {
      if (k.role === "main") {
        if (mainSeen) k.role = "secondary";
        mainSeen = true;
      }
    }
    const checked = keywords.filter((k) => k.checked);
    if (checked.length > account.maxKeywords) return { error: `Your plan tracks up to ${account.maxKeywords} keywords. Untick a few first.` };

    business.strategy.keywords = keywords;
    // Keep target keywords in step with what's tracked.
    for (const k of checked) if (!business.strategy.targetKeywords.includes(k.term)) business.strategy.targetKeywords.push(k.term);

    const scanNote = business.scans.length === 0 ? queueFreeScan(business) : "";
    return { ok: scanNote ? `Keywords saved.${scanNote}` : `Keywords saved — ${checked.length} tracked.` };
  });
}

export async function saveTargetKeywordsAction(list: string[]) {
  return mutate(({ business }) => {
    business.strategy.targetKeywords = cleanList(list.map((t) => t.toLowerCase()), 40);
    return { ok: "Target keywords saved." };
  });
}

// ---- website + strategy fields ---------------------------------------------------------------

export async function readWebsiteAction() {
  return mutate(({ business }) => {
    const p = business.profile;
    if (!p.website) return { error: "Add your website in Settings → Account first." };
    const city = p.city || "Your city";
    const areas = [city, `Downtown ${city}`, `${city} metro`];
    const services = p.services.length ? p.services : [p.primaryCategory];
    business.strategy.websiteLearned = cleanList([...services, ...areas], 16);
    business.activity.unshift({ id: crypto.randomUUID(), emoji: "🌐", text: `Read ${p.website.replace(/^https?:\/\//, "").replace(/\/$/, "")} for services and areas.`, at: new Date().toISOString() });
    return { ok: `Read your website — found ${services.length} services and ${areas.length} areas.` };
  });
}

/** Turns what we learned from the website into (unticked) secondary keywords. */
export async function addLearnedKeywordsAction() {
  return mutate(({ business }) => {
    const p = business.profile;
    const learned = business.strategy.websiteLearned ?? [];
    const services = learned.filter((l) => p.services.includes(l) || l === p.primaryCategory);
    const place = (p.city || "").toLowerCase();
    let added = 0;
    for (const s of services) {
      const term = clean(`${s} ${place}`.toLowerCase());
      if (business.strategy.keywords.some((k) => k.term === term)) continue;
      business.strategy.keywords.push({ id: crypto.randomUUID(), term, role: business.strategy.keywords.length ? "secondary" : "main", volume: volumeFor(term, 0.4), source: "From your website", checked: false });
      added++;
    }
    if (!added) return { ok: "Those keywords are already in your list." };
    return { ok: `Added ${added} keyword${added === 1 ? "" : "s"} from your website. Tick the ones to track and save.` };
  });
}

type Field = "customer" | "services" | "differentiators" | "competitors";
const fieldLabels: Record<Field, string> = {
  customer: "Target customer",
  services: "Services to grow",
  differentiators: "What makes you different",
  competitors: "Competitors",
};

export async function saveStrategyFieldAction(field: Field, value: string | string[]) {
  return mutate(({ business }) => {
    if (!(field in fieldLabels)) return { error: "Unknown field." };
    if (field === "customer") {
      const v = clean(String(value)).slice(0, 240);
      business.strategy.customer = v;
    } else {
      if (!Array.isArray(value)) return { error: "Invalid value." };
      business.strategy[field] = cleanList(value, 20, 80);
    }
    return { ok: `${fieldLabels[field]} saved.` };
  });
}
