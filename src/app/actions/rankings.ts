"use server";

import { mutate } from "@/lib/server/app";
import { getAccountExtras, seeded, startScan } from "@/lib/server/store";
import { setScanCenter } from "@/lib/server/rankings-store";
import { AI_ENGINES, type AiCheck, type BusinessState, type GridSize } from "@/lib/app/types";
import { GRID_OPTIONS, SPACING_OPTIONS, type ScanCenter } from "@/components/app/rankings/shared";

const MAX_KEYWORD = 80;

function cleanKeyword(raw: string) {
  return String(raw ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** First map scan for a location is free; later ones cost grid×grid credits per keyword. */
function scanCost(business: BusinessState, keywords: number) {
  const perKeyword = business.scanArea.grid * business.scanArea.grid;
  const free = business.scans.length === 0 ? Math.min(1, keywords) : 0;
  return { perKeyword, total: perKeyword * (keywords - free), free: free > 0 };
}

function runScans(business: BusinessState, userId: string, keywords: string[]) {
  const extras = getAccountExtras(userId);
  if (!extras) return { error: "Account not found." };
  const { total, free } = scanCost(business, keywords.length);
  if (extras.credits < total) {
    return { error: `Not enough credits — this needs ${total.toLocaleString()} credits and you have ${extras.credits.toLocaleString()}.` };
  }
  extras.credits -= total;
  for (const k of keywords) startScan(business, k, business.scanArea, "one-time");
  business.activity.unshift({
    id: crypto.randomUUID(),
    emoji: "📡",
    text: keywords.length === 1 ? `Map scan started for “${keywords[0]}”.` : `Map scans started for ${keywords.length} keywords.`,
    at: new Date().toISOString(),
  });
  const costText = free && total === 0 ? "Your first scan is free." : `${total.toLocaleString()} credits used${free ? " (first scan free)" : ""}.`;
  return { ok: `Scanning ${keywords.length === 1 ? `“${keywords[0]}”` : `${keywords.length} keywords`} — results in a few seconds. ${costText}` };
}

/** One-time scan for a single keyword (typed or picked from the saved chips). */
export async function runScanAction(keyword: string) {
  return mutate(({ user, business }) => {
    const k = cleanKeyword(keyword);
    if (!k) return { error: "Type a keyword to scan." };
    if (k.length > MAX_KEYWORD) return { error: `Keep keywords under ${MAX_KEYWORD} characters.` };
    if (business.scans.some((s) => s.status === "running" && s.keyword === k)) return { error: `“${k}” is already being scanned.` };
    return runScans(business, user.id, [k]);
  });
}

/** "Run scan": scans every checked keyword from the Ranking Strategy. */
export async function runAllScansAction() {
  return mutate(({ user, business }) => {
    const kws = [...new Set(business.strategy.keywords.filter((k) => k.checked).map((k) => cleanKeyword(k.term)))];
    if (!kws.length) return { error: "Add keywords on your strategy page first." };
    const running = new Set(business.scans.filter((s) => s.status === "running").map((s) => s.keyword));
    const todo = kws.filter((k) => !running.has(k));
    if (!todo.length) return { error: "Those keywords are already being scanned." };
    return runScans(business, user.id, todo);
  });
}

export async function saveScanAreaAction(input: { grid: number; spacing: number; center?: ScanCenter }) {
  return mutate(({ account, business }) => {
    const grid = Number(input.grid);
    const spacing = Number(input.spacing);
    if (!GRID_OPTIONS.some((o) => o.value === grid)) return { error: "Pick a scan size." };
    if (grid > account.maxGrid) return { error: `Your plan covers scan areas up to ${account.maxGrid}×${account.maxGrid}.` };
    if (!SPACING_OPTIONS.some((o) => o.value === spacing)) return { error: "Pick a distance between spots." };
    business.scanArea = { grid: grid as GridSize, spacing };
    if (input.center) {
      const clamp = (v: number) => Math.max(-5, Math.min(5, Math.round(Number(v) * 100) / 100 || 0));
      setScanCenter(business.profile.id, { east: clamp(input.center.east), north: clamp(input.center.north) });
    }
    return { ok: `Scan area saved — ${grid}×${grid}, ${spacing} mi apart.` };
  });
}

/**
 * One-off AI Visibility check. Results are deterministic for a business + hour (mock of asking each
 * engine the local-intent question); stronger profiles get named more often. Costs no credits.
 */
export async function runAiCheckAction() {
  return mutate(({ business }) => {
    const last = business.aiChecks.at(-1);
    const now = new Date();
    if (last && now.getTime() - new Date(last.runAt).getTime() < 30_000) return { error: "A check just ran — give it a moment before running another." };

    const p = business.profile;
    const rand = seeded(`${p.id}-${now.toISOString().slice(0, 13)}-${business.aiChecks.length}`);
    const strength = Math.min(
      0.85,
      0.25 + (p.connected ? 0.15 : 0) + Math.min(0.2, business.reviews.length * 0.03) + Math.min(0.15, business.citations.length * 0.01) + business.aiChecks.length * 0.03,
    );
    const check: AiCheck = {
      id: crypto.randomUUID(),
      runAt: now.toISOString(),
      question: `Who is the best ${p.primaryCategory.toLowerCase()} near ${p.city}?`,
      results: AI_ENGINES.map((engine) => {
        const named = rand() < strength;
        return { engine, named, position: named ? 1 + Math.floor(rand() * 5) : null };
      }),
    };
    business.aiChecks.push(check);
    const n = check.results.filter((r) => r.named).length;
    business.activity.unshift({ id: crypto.randomUUID(), emoji: "🤖", text: `AI visibility check: named by ${n} of ${check.results.length} AI tools.`, at: check.runAt });
    return { ok: `Check complete — ${n} of ${check.results.length} AI tools named ${p.name}.` };
  });
}
