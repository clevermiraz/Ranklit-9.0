// Pure helpers for the Google Profile section (templated "AI" copy, policy checks, audit
// scoring, diffing, time formatting). No server or browser APIs: safe on both sides.

import type { AuditDimension, BusinessState, Post, ProfileAudit, Weekday } from "@/lib/app/types";

export type GbpPhoto = { id: string; name: string; src: string; addedAt: string; sample: boolean };

/** Everything the copy generators need to know about the business. */
export type AiContext = {
  name: string;
  city: string;
  category: string;
  services: string[];
  differentiators: string[];
  keywords: string[];
  customer: string;
};

export function aiContext(s: BusinessState): AiContext {
  return {
    name: s.profile.name,
    city: s.profile.city,
    category: s.profile.primaryCategory,
    services: uniq([...s.profile.services, ...s.strategy.services]),
    differentiators: s.strategy.differentiators,
    keywords: s.strategy.keywords.map((k) => k.term),
    customer: s.strategy.customer,
  };
}

const uniq = (xs: string[]) => [...new Map(xs.filter(Boolean).map((x) => [x.toLowerCase(), x])).values()];

export function listJoin(xs: string[]) {
  if (xs.length <= 1) return xs[0] ?? "";
  return `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const article = (s: string) => (/^[aeiou]/i.test(s) ? "an" : "a");

export function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
}

// ---- descriptions -------------------------------------------------------------------------

export const DESCRIPTION_MAX = 750;

/** A plain, keyword-aware business description. `variant` rotates the phrasing. */
export function generateDescription(ctx: AiContext, variant = 0) {
  const services = ctx.services.slice(0, 4).map(lower);
  const cat = lower(ctx.category || "local business");
  const diffs = ctx.differentiators.slice(0, 3).map(lower);
  const openers = [
    `${ctx.name} is ${article(cat)} ${cat} in ${ctx.city}, serving homes and businesses across the ${ctx.city} area.`,
    `${ctx.name} is a locally owned ${cat} serving ${ctx.city} and the surrounding neighbourhoods.`,
    `Looking for ${article(cat)} ${cat} in ${ctx.city}? ${ctx.name} has been helping local customers with the jobs that can't wait.`,
  ];
  const parts = [
    openers[variant % openers.length],
    services.length ? `We handle ${listJoin(services)}, from quick fixes to bigger projects.` : "",
    diffs.length ? `Customers choose us for ${listJoin(diffs)}.` : "",
    ctx.customer ? `We work mostly with ${lower(ctx.customer.replace(/\.$/, ""))}.` : "",
    "Every job is done by our own trained team, and we explain the work and the price before we start.",
    variant % 2 ? "Message us or request a quote online, and we'll get back to you the same day." : "Get in touch to book a visit — we reply to every message during business hours.",
  ];
  return clip(parts.filter(Boolean).join(" "), DESCRIPTION_MAX);
}

// ---- posts -------------------------------------------------------------------------------

export type PostType = Post["type"];
export type Tone = "friendly" | "professional" | "casual" | "urgent";
export const TONES: Tone[] = ["friendly", "professional", "casual", "urgent"];
export const CTAS = ["Book", "Order online", "Buy", "Learn more", "Sign up", "Call now"] as const;
export const HEADLINE_MAX = 58;
export const BODY_MAX = 1500;

const toneBits: Record<Tone, { open: string; close: string }> = {
  friendly: { open: "Good news for our neighbours in", close: "We'd love to help — reach out any time." },
  professional: { open: "We're pleased to share an update for customers in", close: "Contact our team to arrange a visit." },
  casual: { open: "Quick heads-up for folks around", close: "Give us a shout whenever you're ready." },
  urgent: { open: "Don't wait — this is for customers in", close: "Spots fill up fast, so book yours today." },
};

export function generatePost(ctx: AiContext, type: PostType, topic: string, tone: Tone, variant = 0) {
  const service = ctx.services[variant % Math.max(1, ctx.services.length)] ?? ctx.category;
  const subject = topic.trim() || service;
  const t = toneBits[tone];
  const diff = ctx.differentiators[variant % Math.max(1, ctx.differentiators.length)];
  let headline: string;
  let body: string;
  let cta: string;
  switch (type) {
    case "Event":
      headline = `Join us: ${cap(subject)}`;
      body = `${t.open} ${ctx.city}: ${ctx.name} is hosting ${lower(subject)}. Stop by to meet the team, ask questions about ${lower(service)} and get practical advice for your home. ${diff ? `As always, you can count on ${lower(diff)}.` : ""} ${t.close}`;
      cta = "Sign up";
      break;
    case "Offer":
      headline = `${cap(subject)} — limited-time offer`;
      body = `${t.open} ${ctx.city}: for a limited time, ${ctx.name} is offering ${lower(subject)}. It's a great moment to get ${lower(service)} sorted before small problems turn into big ones. Mention this post when you book. ${t.close}`;
      cta = "Book";
      break;
    case "Alert":
      headline = `Update: ${cap(subject)}`;
      body = `An update for customers in ${ctx.city}: ${lower(subject)}. ${ctx.name} is still here for ${lower(service)} and every other job on your list, and we'll keep you posted here if anything changes. ${t.close}`;
      cta = "Learn more";
      break;
    default:
      headline = topic.trim() ? cap(subject) : `${cap(service)} in ${ctx.city}`;
      body = `${t.open} ${ctx.city}: ${ctx.name} ${topic.trim() ? `has news — ${lower(subject)}.` : `is booking ${lower(service)} this week.`} Our team handles ${listJoin(ctx.services.slice(0, 3).map(lower)) || lower(ctx.category)}, with clear pricing before any work starts. ${diff ? `${cap(diff)} is part of every job.` : ""} ${t.close}`;
      cta = "Learn more";
  }
  return { headline: clip(headline, HEADLINE_MAX), body: body.replace(/\s+/g, " ").trim(), cta };
}

const BUZZ: [RegExp, string][] = [
  [/\binnovative\b/gi, "experienced"],
  [/\beffortlessly\b/gi, "carefully"],
  [/\bseamless(ly)?\b/gi, "smooth$1"],
  [/\bleverag(e|ing)\b/gi, "us$1"],
  [/\bcutting[- ]edge\b/gi, "modern"],
  [/\bunparalleled\b/gi, "reliable"],
  [/\btop[- ]notch\b/gi, "good"],
  [/\bworld[- ]class\b/gi, "skilled"],
  [/\bstate[- ]of[- ]the[- ]art\b/gi, "up-to-date"],
  [/\bbest[- ]in[- ]class\b/gi, "dependable"],
  [/\bsynerg\w*\b/gi, "teamwork"],
  [/\bvery\s+/gi, ""],
  [/\bin order to\b/gi, "to"],
  [/\bwe are\b/g, "we're"],
  [/\bWe are\b/g, "We're"],
  [/\bdo not\b/g, "don't"],
  [/\bit is\b/g, "it's"],
  [/\byou are\b/g, "you're"],
  [/!{2,}/g, "!"],
];

/** Rewrites stiff, salesy wording into plainer language. */
export function humanize(text: string) {
  let out = text;
  for (const [re, rep] of BUZZ) out = out.replace(re, rep);
  return out.replace(/\s{2,}/g, " ").replace(/\s+([.,!?])/g, "$1").trim();
}

export type PolicyResult = { label: string; ok: boolean; detail: string };

export function checkPolicy(headline: string, body: string): PolicyResult[] {
  const all = `${headline}\n${body}`;
  const phone = /(\+?\d[\d\s().-]{7,}\d)/.test(body);
  const url = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|co|us|ca|biz|info)\b)/i.test(body);
  const caps = all.match(/\b[A-Z]{4,}\b/g)?.filter((w) => !["HVAC", "ASAP", "FAQS"].includes(w)) ?? [];
  const bangs = (all.match(/!/g) ?? []).length;
  return [
    { label: "Length", ok: body.trim().length >= 80 && body.length <= BODY_MAX && headline.length <= HEADLINE_MAX, detail: body.trim().length < 80 ? `Content is short (${body.trim().length} chars). Aim for at least 80 characters.` : body.length > BODY_MAX ? `Content is over ${BODY_MAX} characters.` : headline.length > HEADLINE_MAX ? `Headline is over ${HEADLINE_MAX} characters.` : "Headline and content are within Google's limits." },
    { label: "No phone numbers", ok: !phone, detail: phone ? "Google rejects posts with phone numbers in the text. Use the Call now button instead." : "No phone numbers in the post text." },
    { label: "No links", ok: !url, detail: url ? "Remove URLs from the text. Add a call-to-action button instead." : "No links in the post text." },
    { label: "No ALL CAPS", ok: caps.length === 0, detail: caps.length ? `Avoid shouting: ${caps.slice(0, 3).join(", ")}.` : "No all-caps words." },
    { label: "Tone", ok: bangs <= 2, detail: bangs > 2 ? `Too many exclamation marks (${bangs}). Keep it calm and factual.` : "Reads calmly and factually." },
  ];
}

// ---- images -------------------------------------------------------------------------------

const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const esc = (s: string) => s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

function scene(label: string, from: string, to: string, shapes: string) {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/>${shapes}<rect x="0" y="520" width="800" height="80" fill="#000" opacity=".22"/><text x="32" y="572" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="700" fill="#fff">${esc(label)}</text></svg>`,
  );
}

/** Sample library photos (illustrations) seeded for every business. */
export function samplePhotos(name: string): Omit<GbpPhoto, "id" | "addedAt">[] {
  return [
    { name: "Storefront", sample: true, src: scene(name, "#8d3ebb", "#3b1a5a", `<rect x="180" y="190" width="440" height="300" rx="10" fill="#fff" opacity=".9"/><rect x="180" y="150" width="440" height="70" rx="10" fill="#f3e8fb"/><rect x="230" y="270" width="140" height="220" fill="#c9a6e4"/><rect x="420" y="270" width="150" height="110" fill="#c9a6e4"/>`) },
    { name: "Team on the job", sample: true, src: scene("Our team on the job", "#0e7490", "#164e63", `<circle cx="300" cy="230" r="70" fill="#fff" opacity=".85"/><rect x="220" y="310" width="160" height="200" rx="60" fill="#fff" opacity=".85"/><circle cx="500" cy="250" r="60" fill="#fff" opacity=".6"/><rect x="430" y="320" width="140" height="190" rx="55" fill="#fff" opacity=".6"/>`) },
    { name: "Before & after", sample: true, src: scene("Before & after", "#b45309", "#7c2d12", `<rect x="90" y="120" width="290" height="340" rx="14" fill="#fff" opacity=".35"/><rect x="420" y="120" width="290" height="340" rx="14" fill="#fff" opacity=".85"/><path d="M380 290h40" stroke="#fff" stroke-width="10"/>`) },
    { name: "Service van", sample: true, src: scene("Ready to roll", "#15803d", "#14532d", `<rect x="150" y="250" width="420" height="170" rx="24" fill="#fff" opacity=".9"/><path d="M570 290h70l50 60v70H570z" fill="#fff" opacity=".9"/><circle cx="260" cy="430" r="40" fill="#1f2937"/><circle cx="580" cy="430" r="40" fill="#1f2937"/>`) },
    { name: "Happy customer", sample: true, src: scene("Another happy customer", "#be185d", "#701a75", `<circle cx="400" cy="250" r="120" fill="#fff" opacity=".85"/><circle cx="360" cy="230" r="12" fill="#701a75"/><circle cx="440" cy="230" r="12" fill="#701a75"/><path d="M345 285q55 50 110 0" stroke="#701a75" stroke-width="10" fill="none" stroke-linecap="round"/>`) },
  ];
}

/** Placeholder "AI image": a gradient card titled with the topic. */
export function aiImage(topic: string, variant = 0) {
  const palettes = [
    ["#c026d3", "#6d28d9"],
    ["#0ea5e9", "#7c3aed"],
    ["#f59e0b", "#db2777"],
    ["#10b981", "#0e7490"],
  ];
  const [a, b] = palettes[variant % palettes.length];
  return scene(clip(topic || "Your post", 36), a, b, `<circle cx="640" cy="140" r="110" fill="#fff" opacity=".18"/><circle cx="160" cy="380" r="160" fill="#fff" opacity=".1"/>`);
}

// ---- profile helpers ---------------------------------------------------------------------

export const DAY_NAMES: Record<Weekday, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

/** "9:00 AM" → "09:00" */
export function to24(t: string | null) {
  if (!t) return "";
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return t;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

/** "17:30" → "5:30 PM" */
export function from24(t: string) {
  const [hs, ms] = t.split(":");
  const h = Number(hs);
  return `${h % 12 || 12}:${ms} ${h >= 12 ? "PM" : "AM"}`;
}

const RELATED: Record<string, string[]> = {
  plumber: ["Drainage service", "Water heater installation service", "Emergency plumber", "Bathroom remodeler", "Septic system service"],
  electrician: ["Electrical installation service", "Lighting contractor", "Emergency electrician", "Electrical repair shop"],
  "hvac contractor": ["Air conditioning repair service", "Furnace repair service", "Heating contractor", "Air duct cleaning service"],
  "internet marketing service": ["Marketing agency", "Website designer", "Search engine optimization agency", "Advertising agency"],
  roofer: ["Roofing contractor", "Gutter cleaning service", "Siding contractor"],
  dentist: ["Cosmetic dentist", "Dental clinic", "Emergency dental service", "Teeth whitening service"],
};

export function suggestedCategories(primary: string, existing: string[]) {
  const have = new Set(existing.map((c) => c.toLowerCase()));
  const list = RELATED[primary.toLowerCase()] ?? ["Contractor", "Home improvement store", "Repair service"];
  return list.filter((c) => !have.has(c.toLowerCase()));
}

export function profileScore(s: BusinessState) {
  const p = s.profile;
  const checks = [
    !!p.name,
    !!p.address,
    !!p.phone,
    !!p.website,
    p.hours.some((h) => h.open),
    p.description.length >= 250,
    p.categories.length >= 2,
    p.services.length >= 3,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ---- audit ---------------------------------------------------------------------------------

const FILLER = /\b(innovative|effortless(ly)?|seamless|cutting[- ]edge|world[- ]class|unparalleled|top[- ]notch|drive peace of mind)\b/i;

function dim(name: string, score: number, finding: string, fix: string): AuditDimension {
  return { name, score, status: score >= 85 ? "good" : score >= 60 ? "warn" : "bad", finding, fix };
}

/** Scores the profile across 8 dimensions from what the store knows. */
export function computeAudit(s: BusinessState, photoCount: number, nowMs: number): ProfileAudit {
  const p = s.profile;
  const len = p.description.length;
  const filler = FILLER.test(p.description);
  const descScore = Math.max(20, (len >= 600 ? 100 : len >= 400 ? 85 : len >= 250 ? 70 : len > 0 ? 45 : 0) - (filler ? 20 : 0));
  const cats = p.categories.length;
  const suggestion = suggestedCategories(p.primaryCategory, p.categories)[0];
  const services = p.services.length;
  const openDays = p.hours.filter((h) => h.open && h.close).length;
  const rated = s.reviews.length;
  const avg = rated ? s.reviews.reduce((a, r) => a + r.rating, 0) / rated : 0;
  const unreplied = s.reviews.filter((r) => r.status !== "replied").length;
  const day = 864e5;
  const recentPosts = s.posts.filter((x) => x.status === "published" && nowMs - new Date(x.date).getTime() < 14 * day).length;
  const monthPosts = s.posts.filter((x) => x.status === "published" && nowMs - new Date(x.date).getTime() < 30 * day).length;

  const dimensions: AuditDimension[] = [
    dim(
      "Description",
      descScore,
      len === 0 ? "Your profile has no description." : `${len} of 750 characters used${filler ? ", with promotional filler Google tends to ignore" : ""}.`,
      descScore >= 85 ? "Nothing to do." : "Apply an AI rewrite that names your services and city in plain language.",
    ),
    dim(
      "Categories",
      cats >= 3 ? 100 : cats === 2 ? 75 : 40,
      `${cats} categor${cats === 1 ? "y" : "ies"} set — ${cats >= 3 ? "good coverage of what you do" : "you're missing searches a secondary category would catch"}.`,
      cats >= 3 ? "Nothing to do." : suggestion ? `Add “${suggestion}”.` : "Add a secondary category.",
    ),
    dim("Services", services >= 6 ? 100 : services >= 3 ? 60 : services ? 40 : 15, `${services} service${services === 1 ? "" : "s"} listed.`, services >= 6 ? "Nothing to do." : `Add ${6 - services} more services you offer.`),
    dim("Hours", openDays >= 5 ? 100 : openDays ? 70 : 20, openDays ? `Open ${openDays} day${openDays === 1 ? "" : "s"} a week on your profile.` : "No opening hours set.", openDays >= 5 ? "Nothing to do." : "Add hours for every day you take calls."),
    dim("Photos", photoCount >= 10 ? 100 : photoCount >= 5 ? 65 : photoCount ? 40 : 10, `${photoCount} photo${photoCount === 1 ? "" : "s"} in your library.`, photoCount >= 10 ? "Keep adding a photo or two each month." : `Upload ${10 - photoCount} more recent job photos.`),
    dim(
      "Reviews",
      rated >= 20 && avg >= 4.5 ? 100 : rated >= 5 && avg >= 4 ? 75 : rated ? 50 : 15,
      rated ? `${rated} reviews averaging ${avg.toFixed(1)}★.` : "No Google reviews yet.",
      rated >= 20 && avg >= 4.5 ? "Keep asking after each job." : "Send your review link to recent customers.",
    ),
    dim(
      "Review replies",
      rated === 0 ? 50 : unreplied === 0 ? 100 : unreplied / rated <= 0.3 ? 70 : 40,
      rated === 0 ? "No reviews to reply to yet." : unreplied ? `${unreplied} review${unreplied === 1 ? "" : "s"} still need a reply.` : "Every review has a reply.",
      unreplied ? "Reply to the waiting reviews (or turn on auto-reply)." : "Nothing to do.",
    ),
    dim(
      "Posts",
      recentPosts >= 2 ? 100 : monthPosts >= 1 ? 65 : 20,
      recentPosts >= 2 ? `${recentPosts} posts in the last 2 weeks.` : monthPosts ? `${monthPosts} post${monthPosts === 1 ? "" : "s"} in the last 30 days.` : "No posts in the last 30 days.",
      recentPosts >= 2 ? "Nothing to do." : "Post at least twice a week (or let your agent do it).",
    ),
  ];
  const score = Math.round(dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length);
  return { runAt: new Date(nowMs).toISOString(), score, dimensions };
}

// ---- word diff -----------------------------------------------------------------------------

export type DiffPart = { kind: "same" | "add" | "del"; text: string };

/** Word-level LCS diff for the before/after view. */
export function wordDiff(a: string, b: string): DiffPart[] {
  const x = a.split(/(\s+)/).filter(Boolean);
  const y = b.split(/(\s+)/).filter(Boolean);
  const n = x.length;
  const m = y.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffPart[] = [];
  const push = (kind: DiffPart["kind"], text: string) => {
    const last = out.at(-1);
    if (last && last.kind === kind) last.text += text;
    else out.push({ kind, text });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) {
      push("same", x[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) push("del", x[i++]);
    else push("add", y[j++]);
  }
  while (i < n) push("del", x[i++]);
  while (j < m) push("add", y[j++]);
  return out;
}

/** Parses a comma/newline list (used by categories + services suggestions). */
export function parseList(s: string) {
  return uniq(s.split(/[,\n]/).map((x) => x.trim()));
}
