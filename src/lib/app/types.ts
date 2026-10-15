// Dashboard domain types. Safe to import from client components.

export type Rank = number | null; // null = not found in the top 20

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export const WEEKDAYS: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type GridSize = 3 | 5 | 7 | 9;
export type ScanArea = { grid: GridSize; spacing: number }; // spacing in miles

export type BusinessProfile = {
  id: string;
  name: string;
  kind: "Storefront" | "Service area";
  address: string;
  city: string;
  phone: string;
  website: string;
  gbpUrl: string;
  primaryCategory: string;
  categories: string[];
  description: string;
  services: string[];
  hours: { day: Weekday; open: string | null; close: string | null }[]; // null = closed
  connected: boolean; // Google Business Profile linked
};

export type StrategyKeyword = {
  id: string;
  term: string;
  role: "main" | "secondary";
  volume: number | null; // monthly searches
  source: string; // e.g. "Your Google category"
  checked: boolean; // tracked + scanned
};

export type Strategy = {
  keywords: StrategyKeyword[];
  targetKeywords: string[];
  customer: string;
  services: string[];
  differentiators: string[];
  competitors: string[];
  websiteLearned: string[] | null; // services/areas read from the website
};

export type Automations = {
  autoReply: boolean;
  autoPost: boolean;
  autoCitations: boolean;
  autoScan: boolean;
  refreshDescription: boolean;
  reviewed: boolean; // onboarding step "Choose your bot's automations"
};

export type Scan = {
  id: string;
  keyword: string;
  area: ScanArea;
  kind: "one-time" | "autopilot";
  status: "running" | "completed";
  createdAt: string;
  completesAt: string;
  points: Rank[]; // grid*grid, row-major, centre = business
};

export type AiEngine = "Perplexity" | "ChatGPT" | "Gemini" | "Claude" | "Google AI Overviews" | "Google AI Mode";
export const AI_ENGINES: AiEngine[] = ["Perplexity", "ChatGPT", "Gemini", "Claude", "Google AI Overviews", "Google AI Mode"];

export type AiCheck = {
  id: string;
  runAt: string;
  question: string;
  results: { engine: AiEngine; named: boolean; position: number | null }[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  status: "unreplied" | "draft" | "replied";
  reply: string | null;
};

export type Feedback = { id: string; name: string; rating: number; text: string; date: string };

export type ReviewLink = {
  slug: string;
  sendAllToGoogle: boolean;
  accent: string;
  font: string;
  headline: string;
  subtext: string;
  prompt: string;
  website: string;
};

export type Post = {
  id: string;
  type: "Standard" | "Event" | "Offer" | "Alert";
  headline: string;
  body: string;
  cta: string | null;
  image: string | null;
  status: "draft" | "scheduled" | "published" | "failed";
  date: string; // published / scheduled date
  byAgent: boolean;
};

export type ProfileSuggestion = {
  id: string;
  field: "description" | "categories" | "services";
  source: string; // e.g. "FROM CONNECT"
  explanation: string;
  before: string;
  after: string;
};

export type InsightDay = {
  date: string; // YYYY-MM-DD
  websiteClicks: number;
  calls: number;
  directions: number;
  messages: number;
  bookings: number;
  desktopMaps: number;
  desktopSearch: number;
  mobileMaps: number;
  mobileSearch: number;
};

export type AuditDimension = { name: string; score: number; status: "good" | "warn" | "bad"; finding: string; fix: string };
export type ProfileAudit = { runAt: string; score: number; dimensions: AuditDimension[] };

export type Citation = { id: string; directory: string; status: "built" | "pending"; url: string | null; addedAt: string };

export type WebsiteFix = { id: string; title: string; detail: string; impact: "high" | "medium" | "low"; done: boolean };

export type Activity = { id: string; emoji: string; text: string; at: string };

export type Alert = { id: string; severity: "info" | "warning"; message: string; createdAt: string; resolvedAt: string | null };

export type ApiKey = { id: string; name: string; prefix: string; scopes: ("post" | "reply" | "scan")[]; createdAt: string };

/** Everything the dashboard knows about one business (location). */
export type BusinessState = {
  profile: BusinessProfile;
  strategy: Strategy;
  automations: Automations;
  autopilot: boolean;
  weeklyScan: { enabled: boolean; day: Weekday; grid: GridSize };
  scanArea: ScanArea;
  scans: Scan[];
  aiChecks: AiCheck[];
  reviews: Review[];
  feedback: Feedback[];
  reviewLink: ReviewLink;
  posts: Post[];
  suggestions: ProfileSuggestion[];
  insights: InsightDay[];
  audit: ProfileAudit | null;
  citations: Citation[];
  websiteChecked: boolean;
  websiteFixes: WebsiteFix[];
  activity: Activity[];
  alerts: Alert[];
};

export type Account = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  planId: string | null;
  planName: string;
  interval: "monthly" | "annual";
  trialEndsAt: string | null;
  trialDaysLeft: number;
  credits: number;
  monthlyCredits: number;
  maxKeywords: number;
  maxGrid: GridSize;
  accountManager: string;
  apiKeys: ApiKey[];
  businesses: { id: string; name: string; address: string; category: string; kind: string }[];
  currentBusinessId: string;
};

export const ACCOUNT_MANAGER_EMAIL = "lukas@ranklit.com";

// ---- small derived helpers (pure) ------------------------------------------------------

export function scanStats(points: Rank[]) {
  const found = points.filter((p): p is number => p !== null);
  const top3 = found.filter((p) => p <= 3).length;
  const avg = found.length ? Math.round((found.reduce((a, b) => a + b, 0) / found.length) * 10) / 10 : null;
  return {
    total: points.length,
    found: found.length,
    top3,
    mid: found.filter((p) => p > 3 && p <= 10).length,
    notFound: points.length - found.length,
    avg,
    solv: points.length ? Math.round((top3 / points.length) * 1000) / 10 : 0,
  };
}

export function scanAreaInfo(area: ScanArea) {
  const span = (area.grid - 1) * area.spacing;
  const labels: Record<GridSize, [string, string]> = {
    3: ["Quick", "A fast check of your immediate block."],
    5: ["Standard", "The usual choice — covers your neighbourhood."],
    7: ["Detailed", "A closer look across a wider part of town."],
    9: ["Wide", "Your whole service area, in detail."],
  };
  return {
    spots: area.grid * area.grid,
    label: labels[area.grid][0],
    blurb: labels[area.grid][1],
    areaCovered: `${span.toFixed(1)} × ${span.toFixed(1)} mi`,
    reach: `${(span / 2).toFixed(1)} mi`,
    creditsPerKeyword: area.grid * area.grid,
  };
}

export function onboardingSteps(s: BusinessState) {
  return [
    { key: "strategy", done: s.strategy.keywords.length > 0, title: "Create your strategy", text: "Tell us the keywords + services you want to rank for.", href: "/dashboard/strategy" },
    { key: "automations", done: s.automations.reviewed, title: "Choose your bot's automations", text: "Posts and review replies go out automatically. You can turn either off.", href: "/settings/automations" },
    { key: "website", done: s.websiteChecked, title: "Optimize your website", text: "We'll check it as soon as your strategy is set, so the suggestions use your own services.", href: "/dashboard/website" },
    { key: "connect", done: s.profile.connected, title: "Connect your business", text: "Link your Google profile so we can read reviews, post, and track rank.", href: "/dashboard/gbp" },
  ];
}

export function needsYouCount(s: BusinessState) {
  return s.suggestions.length;
}
