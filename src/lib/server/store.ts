import "server-only";
import { randomUUID } from "node:crypto";
import type {
  ApiKey,
  BusinessProfile,
  BusinessState,
  GridSize,
  InsightDay,
  Rank,
  Review,
  ScanArea,
  Weekday,
} from "@/lib/app/types";

/**
 * In-memory dashboard store (mock persistence), keyed by user and business.
 * Every dashboard read/write goes through this module, so it can be replaced with a
 * database + Google Business Profile / rank-scan / LLM integrations without touching the UI.
 */

type AccountExtras = {
  credits: number;
  apiKeys: ApiKey[];
  businessIds: string[];
  currentBusinessId: string;
  lastName: string;
};

const g = globalThis as unknown as {
  __rlAccounts?: Map<string, AccountExtras>;
  __rlBusinesses?: Map<string, BusinessState>;
};
const accounts = (g.__rlAccounts ??= new Map<string, AccountExtras>());
const businesses = (g.__rlBusinesses ??= new Map<string, BusinessState>());

// ---- deterministic helpers ---------------------------------------------------------------

export function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const daysAgo = (d: number, hour = 10) => {
  const date = new Date(Date.now() - d * 864e5);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const id = () => randomUUID();

/** Rank grid: ranks worsen with distance from the centre; `strength` 0..1 flattens the curve. */
export function generateGrid(seed: string, grid: GridSize, strength: number): Rank[] {
  const rand = seeded(seed);
  const c = (grid - 1) / 2;
  const out: Rank[] = [];
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const d = Math.hypot(x - c, y - c) / Math.max(1, c); // 0..~1.4
      const mean = 1 + d * d * 9 * (1.3 - strength);
      const r = Math.max(1, Math.round(mean + (rand() - 0.35) * d * 6 * (1.1 - strength)));
      out.push(r > 20 || (d > 1.1 && rand() < 0.15 * (1 - strength)) ? null : r);
    }
  }
  return out;
}

function generateInsights(seed: string, days = 42): InsightDay[] {
  const rand = seeded(seed);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i + 8) * 864e5); // Google reports ~8 days behind
    const pulse = () => (rand() < 0.35 ? Math.round(rand() * 4) : 0);
    return {
      date: date.toISOString().slice(0, 10),
      websiteClicks: rand() < 0.2 ? 1 : 0,
      calls: rand() < 0.15 ? 1 : 0,
      directions: pulse(),
      messages: 0,
      bookings: 0,
      desktopMaps: Math.round(rand() * 2),
      desktopSearch: Math.round(rand() * 2),
      mobileMaps: Math.round(rand() * 3),
      mobileSearch: Math.round(rand() * 3),
    };
  });
}

const DEFAULT_HOURS: BusinessProfile["hours"] = (["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as Weekday[]).map((day) => ({
  day,
  open: day === "Sat" || day === "Sun" ? null : "9:00 AM",
  close: day === "Sat" || day === "Sun" ? null : "5:00 PM",
}));

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ---- seeding -------------------------------------------------------------------------------

function seedConnectedData(state: BusinessState, seed: string) {
  const p = state.profile;
  state.reviews = [
    { id: id(), author: "Sarah Mitchell", rating: 5, text: "Best service in town — quick, friendly and honest.", date: daysAgo(36), status: "unreplied", reply: null },
    { id: id(), author: "David Chen", rating: 5, text: "Very good service. Highly recommended.", date: daysAgo(55), status: "replied", reply: "Thanks so much, David!" },
    { id: id(), author: "Priya Shah", rating: 5, text: "", date: daysAgo(56), status: "replied", reply: "Thank you, Priya!" },
  ];
  state.insights = generateInsights(seed);
  state.suggestions = [
    {
      id: id(),
      field: "description",
      source: "FROM CONNECT",
      explanation:
        "Suggested when you connected your Google Business Profile — a description written for local search. Removed promotional filler words that read as unnatural, and replaced a salesy list of outcomes with a plain statement of who you serve.",
      before: p.description,
      after: `${p.name} is a ${p.primaryCategory.toLowerCase()} serving ${p.city} and nearby areas. We help local customers with ${p.services.slice(0, 3).join(", ").toLowerCase() || "everyday jobs"}, and we answer every call ourselves. Open weekdays from 9 to 5.`,
    },
  ];
  state.activity.unshift({ id: id(), emoji: "👀", text: "Your bot found a way to make your description stronger.", at: new Date().toISOString() });
}

export function seedBusiness(seed: string, opts: { name: string; city?: string; populated: boolean; connected: boolean }): BusinessState {
  const city = opts.city ?? "Denver";
  const profile: BusinessProfile = {
    id: id(),
    name: opts.name,
    kind: "Storefront",
    address: `1200 Market St, ${city}, CO 80202`,
    city,
    phone: "(303) 555-0142",
    website: `https://${slug(opts.name).replace(/-/g, "")}.com/`,
    gbpUrl: "",
    primaryCategory: "Plumber",
    categories: ["Plumber", "Water heater installation service"],
    description: `${opts.name} is an innovative team that effortlessly handles all your plumbing needs. We increase comfort, drive peace of mind and grow your home's value.`,
    services: ["Drain cleaning", "Water heater repair", "Leak detection", "Emergency plumbing"],
    hours: DEFAULT_HOURS,
    connected: opts.connected,
  };

  const state: BusinessState = {
    profile,
    strategy: { keywords: [], targetKeywords: [], customer: "", services: [], differentiators: [], competitors: [], websiteLearned: null },
    automations: { autoReply: false, autoPost: false, autoCitations: true, autoScan: true, refreshDescription: false, reviewed: false },
    autopilot: false,
    weeklyScan: { enabled: false, day: "Fri", grid: 5 },
    scanArea: { grid: 5, spacing: 1 },
    scans: [],
    aiChecks: [],
    reviews: [],
    feedback: [],
    reviewLink: {
      slug: `${slug(opts.name)}-${seed.slice(0, 6).toLowerCase()}`,
      // Google prohibits "review gating" (only steering happy customers to Google), so everyone sees the Google option by default.
      sendAllToGoogle: true,
      accent: "#8d3ebb",
      font: "System default",
      headline: `How was your experience with ${opts.name}?`,
      subtext: "Tap a star to let us know.",
      prompt: "Tell us what went wrong so we can make it right.",
      website: "",
    },
    posts: [],
    suggestions: [],
    insights: [],
    audit: null,
    citations: [],
    websiteChecked: false,
    websiteFixes: [],
    activity: [
      { id: id(), emoji: "•", text: "Pre-charge reminder sent — trial ends soon.", at: new Date(Date.now() - 3 * 6e4).toISOString() },
      { id: id(), emoji: "🎉", text: "Welcome aboard — your plan is active.", at: new Date(Date.now() - 4 * 6e4).toISOString() },
    ],
    alerts: [],
  };

  if (opts.connected) seedConnectedData(state, seed);
  if (opts.populated) seedPopulated(state, seed, city);
  return state;
}

/** A fully set-up business (used for the demo account) so every screen has data to show. */
function seedPopulated(state: BusinessState, seed: string, city: string) {
  const c = city.toLowerCase();
  state.strategy = {
    keywords: [
      { id: id(), term: `plumber ${c}`, role: "main", volume: 2400, source: "Your Google category", checked: true },
      { id: id(), term: `emergency plumber ${c}`, role: "secondary", volume: 880, source: "Service you offer", checked: true },
      { id: id(), term: `water heater repair ${c}`, role: "secondary", volume: 590, source: "Service you offer", checked: true },
      { id: id(), term: `drain cleaning ${c}`, role: "secondary", volume: 480, source: "From your website", checked: true },
      { id: id(), term: `leak detection ${c}`, role: "secondary", volume: 170, source: "From your website", checked: false },
    ],
    targetKeywords: [`plumber ${c}`, `emergency plumber ${c}`, `water heater repair ${c}`, `drain cleaning ${c}`],
    customer: `Homeowners in ${city} who need a plumber they can trust, fast.`,
    services: ["Water heater installs", "Drain cleaning", "Repiping"],
    differentiators: ["Same-day service", "Upfront pricing", "Family owned since 2009"],
    competitors: ["Mile High Plumbing", "Front Range Rooter"],
    websiteLearned: ["Water heater repair", "Drain cleaning", "Leak detection", `${city} metro`, "Aurora", "Lakewood"],
  };
  state.automations = { autoReply: true, autoPost: true, autoCitations: true, autoScan: true, refreshDescription: true, reviewed: true };
  state.autopilot = true;
  state.weeklyScan = { enabled: true, day: "Fri", grid: 5 };
  state.websiteChecked = true;
  state.suggestions = state.suggestions.slice(0, 1);

  const kws = state.strategy.targetKeywords;
  state.scans = [28, 21, 14, 7, 0].flatMap((d, i) =>
    kws.slice(0, 3).map((k, j) => ({
      id: id(),
      keyword: k,
      area: { grid: 5 as GridSize, spacing: 1 },
      kind: (i === 0 ? "one-time" : "autopilot") as "one-time" | "autopilot",
      status: "completed" as const,
      createdAt: daysAgo(d, 7 + j),
      completesAt: daysAgo(d, 7 + j),
      points: generateGrid(`${seed}-${k}-${d}`, 5, 0.25 + i * 0.15 - j * 0.05),
    })),
  );

  state.aiChecks = [21, 14, 7, 0].map((d, i) => ({
    id: id(),
    runAt: daysAgo(d, 6),
    question: `Who is the best plumber near ${city}?`,
    results: (["Perplexity", "ChatGPT", "Gemini", "Claude", "Google AI Overviews", "Google AI Mode"] as const).map((engine, e) => ({
      engine,
      named: (e + i) % 3 !== 0,
      position: (e + i) % 3 !== 0 ? 1 + ((e + i) % 4) : null,
    })),
  }));

  const extra: Review[] = [
    { id: id(), author: "Marcus Lee", rating: 4, text: "Fixed our water heater same day. A bit pricey but worth it.", date: daysAgo(3), status: "draft", reply: "Thanks, Marcus — glad we got your hot water back the same day!" },
    { id: id(), author: "Jenna Alvarez", rating: 5, text: "Showed up on time and explained everything. Will call again.", date: daysAgo(9), status: "replied", reply: "Thank you, Jenna! We appreciate you." },
    { id: id(), author: "Tom Becker", rating: 2, text: "Had to reschedule twice before anyone came out.", date: daysAgo(15), status: "unreplied", reply: null },
  ];
  state.reviews = [...extra, ...state.reviews];
  state.feedback = [{ id: id(), name: "Anonymous", rating: 2, text: "The technician tracked mud through the hallway.", date: daysAgo(12) }];

  state.posts = [
    { id: id(), type: "Standard", headline: "Fall furnace tune-ups now booking", body: "Cooler nights are here. A quick check now saves a cold-night emergency call later.", cta: "Book", image: null, status: "published", date: daysAgo(2), byAgent: true },
    { id: id(), type: "Offer", headline: "$50 off drain cleaning", body: "Mention this post when you book any drain cleaning this month.", cta: "Call now", image: null, status: "published", date: daysAgo(6), byAgent: true },
    { id: id(), type: "Standard", headline: "Same-day water heater installs", body: "Tank or tankless, installed the same week across the metro.", cta: "Learn more", image: null, status: "scheduled", date: daysAgo(-2), byAgent: true },
    { id: id(), type: "Event", headline: "Free leak check Saturday", body: "Bring your questions to our open house this weekend.", cta: null, image: null, status: "draft", date: daysAgo(0), byAgent: false },
  ];

  state.audit = {
    runAt: daysAgo(5),
    score: 82,
    dimensions: [
      { name: "Business information", score: 100, status: "good", finding: "Name, address and phone match everywhere.", fix: "Nothing to do." },
      { name: "Categories", score: 75, status: "warn", finding: "Missing a secondary category customers search for.", fix: "Add “Drainage service”." },
      { name: "Description", score: 70, status: "warn", finding: "Description uses promotional filler.", fix: "Apply the suggested rewrite." },
      { name: "Photos", score: 60, status: "warn", finding: "Only 6 photos, none from the last 90 days.", fix: "Upload 5 recent job photos." },
      { name: "Reviews", score: 90, status: "good", finding: "Strong rating, steady review velocity.", fix: "Keep asking after each job." },
      { name: "Review replies", score: 85, status: "good", finding: "Most reviews have a reply.", fix: "Reply to the 2★ review." },
      { name: "Posts", score: 95, status: "good", finding: "Posting twice a week.", fix: "Nothing to do." },
      { name: "Services", score: 55, status: "bad", finding: "Services list is short.", fix: "Add 4 more services you offer." },
    ],
  };

  state.citations = ["Yelp", "Yellow Pages", "BBB", "Foursquare", "Hotfrog", "MapQuest", "Superpages", "Manta", "CitySquares", "Brownbook", "Apple Maps", "Bing Places"].map((d, i) => ({
    id: id(),
    directory: d,
    status: i === 6 || i === 7 ? "pending" : "built",
    url: i === 6 || i === 7 ? null : `https://www.${d.toLowerCase().replace(/\s+/g, "")}.com/biz/${seed.slice(0, 6)}`,
    addedAt: daysAgo(60 - i * 4),
  }));

  state.websiteFixes = [
    { id: id(), title: "Add your city to the homepage title", detail: `Your homepage title doesn't mention ${city}. Use “Plumber in ${city} | ${state.profile.name}”.`, impact: "high", done: false },
    { id: id(), title: "Create a page for water heater repair", detail: "You rank for it on Maps but have no page about it.", impact: "high", done: false },
    { id: id(), title: "Add LocalBusiness schema", detail: "Copy the code from Tools and paste it into your site's head.", impact: "medium", done: false },
    { id: id(), title: "Embed your Google map on the contact page", detail: "Ties your website to your map pin.", impact: "low", done: true },
  ];

  state.activity = [
    { id: id(), emoji: "📍", text: `Map scan completed — “plumber ${c}” now in the top 3 in 18 spots.`, at: daysAgo(0, 7) },
    { id: id(), emoji: "⭐", text: "Drafted a reply to Marcus Lee's 4★ review.", at: daysAgo(3, 14) },
    { id: id(), emoji: "📝", text: "Published a Google post: “Fall furnace tune-ups now booking”.", at: daysAgo(2, 9) },
    { id: id(), emoji: "🔗", text: "Citation built on Brownbook.", at: daysAgo(4, 11) },
    ...state.activity,
  ];
  state.alerts = [
    { id: id(), severity: "info", message: `“plumber ${c}” improved to an average position of 2.4`, createdAt: daysAgo(0, 7), resolvedAt: null },
    { id: id(), severity: "warning", message: "New 2★ review from Tom Becker needs a reply", createdAt: daysAgo(15, 16), resolvedAt: null },
    { id: id(), severity: "info", message: "Citation built successfully on Brownbook", createdAt: daysAgo(4, 11), resolvedAt: daysAgo(4, 13) },
  ];
}

// ---- account + business access ---------------------------------------------------------------

export function ensureAccount(userId: string, opts: { businessName: string; populated: boolean }) {
  let acc = accounts.get(userId);
  if (!acc) {
    const state = seedBusiness(userId, { name: opts.businessName, populated: opts.populated, connected: opts.populated });
    businesses.set(state.profile.id, state);
    acc = { credits: 4000, apiKeys: [], businessIds: [state.profile.id], currentBusinessId: state.profile.id, lastName: "" };
    accounts.set(userId, acc);
  }
  return acc;
}

export function getAccountExtras(userId: string) {
  return accounts.get(userId);
}

export function getBusiness(businessId: string) {
  const s = businesses.get(businessId);
  if (!s) throw new Error("Business not found");
  settleScans(s);
  return s;
}

export function addBusiness(userId: string, name: string, address: string) {
  const acc = accounts.get(userId)!;
  const state = seedBusiness(`${userId}-${acc.businessIds.length}`, { name, populated: false, connected: false });
  state.profile.address = address;
  businesses.set(state.profile.id, state);
  acc.businessIds.push(state.profile.id);
  acc.currentBusinessId = state.profile.id;
  return state;
}

export function removeBusiness(userId: string, businessId: string) {
  const acc = accounts.get(userId)!;
  if (acc.businessIds.length <= 1) return false;
  acc.businessIds = acc.businessIds.filter((b) => b !== businessId);
  businesses.delete(businessId);
  if (acc.currentBusinessId === businessId) acc.currentBusinessId = acc.businessIds[0];
  return true;
}

export function listBusinesses(userId: string) {
  const acc = accounts.get(userId)!;
  return acc.businessIds.map((b) => businesses.get(b)!).filter(Boolean);
}

/** Mock Google connect: links the profile and pulls in reviews, insights and a first suggestion. */
export function connectGoogle(state: BusinessState, seed: string) {
  if (state.profile.connected) return;
  state.profile.connected = true;
  seedConnectedData(state, seed);
}

// ---- scans ------------------------------------------------------------------------------------

export const SCAN_MS = 6000;

function settleScans(s: BusinessState) {
  const now = Date.now();
  for (const scan of s.scans) {
    if (scan.status === "running" && new Date(scan.completesAt).getTime() <= now) {
      scan.status = "completed";
      const prior = s.scans.filter((x) => x.keyword === scan.keyword && x.status === "completed" && x.id !== scan.id).length;
      scan.points = generateGrid(`${scan.id}`, scan.area.grid, Math.min(0.9, 0.35 + prior * 0.12));
      s.activity.unshift({ id: id(), emoji: "📍", text: `Map scan completed for “${scan.keyword}”.`, at: new Date().toISOString() });
    }
  }
}

export function startScan(s: BusinessState, keyword: string, area: ScanArea, kind: "one-time" | "autopilot" = "one-time") {
  const now = Date.now();
  const scan = {
    id: id(),
    keyword,
    area: { ...area },
    kind,
    status: "running" as const,
    createdAt: new Date(now).toISOString(),
    completesAt: new Date(now + SCAN_MS).toISOString(),
    points: [] as Rank[],
  };
  s.scans.push(scan);
  return scan;
}

/** Latest completed scan per keyword, newest first. */
export function latestScans(s: BusinessState) {
  const map = new Map<string, BusinessState["scans"][number]>();
  for (const scan of [...s.scans].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    if (scan.status === "completed") map.set(scan.keyword, scan);
  }
  return [...map.values()];
}

// ---- public lookups (review page / embeds) ---------------------------------------------------

/** Read-only lookup of a business by its public review-link slug (no auth). */
export function findBusinessBySlug(reviewSlug: string): BusinessState | undefined {
  for (const b of businesses.values()) if (b.reviewLink.slug === reviewSlug) return b;
  return undefined;
}
