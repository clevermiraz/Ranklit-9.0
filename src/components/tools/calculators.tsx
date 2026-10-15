"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { CalculatorId } from "@/lib/data/tools";
import { inputClass, labelClass, labelTextClass, resultPanelClass } from "./form-styles";

/* ───────────── helpers ───────────── */

const num = (v: string, fallback = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};
const clamp = (x: number) => Math.min(100, Math.max(0, x));
const filled = (v: string) => v.trim() !== "";

function band(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs work";
  return "Weak";
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>{label}</span>
      {children}
    </label>
  );
}

type NumberInputProps = { value: string; onChange: (v: string) => void; placeholder?: string; min?: number; max?: number; step?: number };

function NumberInput({ value, onChange, ...rest }: NumberInputProps) {
  return <input type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} {...rest} />;
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [value: string, label: string][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}

function ScoreCard({ score, label, detail }: { score: number; label: string; detail: string }) {
  return (
    <div className={resultPanelClass} aria-live="polite">
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-ink">{score}</span>
        <span className="text-ink/60">/ 100 — {band(score)}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-ink">{label}</p>
      <p className="mt-2 text-sm text-ink/60">{detail}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full bg-brand-700" style={{ width: `${clamp(score)}%` }} />
      </div>
    </div>
  );
}

function BigResult({ value, unit, children }: { value: string; unit: string; children: ReactNode }) {
  return (
    <div className={resultPanelClass} aria-live="polite">
      <p className="text-3xl font-bold text-ink">
        {value}
        <span className="ml-2 text-lg font-medium text-ink/60">{unit}</span>
      </p>
      {children}
    </div>
  );
}

/* ───────────── calculators ───────────── */

function VisibilityScoreCalculator() {
  const [nap, setNap] = useState("yes");
  const [reviews, setReviews] = useState("");
  const [photos, setPhotos] = useState("");
  const [posts, setPosts] = useState("monthly");
  const score = useMemo(() => {
    if (!filled(reviews) && !filled(photos)) return null;
    const napScore = { yes: 100, partial: 50, no: 0 }[nap] ?? 0;
    const postScore = { weekly: 100, monthly: 60, rarely: 20 }[posts] ?? 0;
    return Math.round(0.3 * napScore + 0.3 * clamp((num(reviews) / 50) * 100) + 0.2 * clamp((num(photos) / 20) * 100) + 0.2 * postScore);
  }, [nap, reviews, photos, posts]);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="NAP consistent across the web?">
          <Select value={nap} onChange={setNap} options={[["yes", "Yes, consistent"], ["partial", "Mostly / unsure"], ["no", "No / inconsistent"]]} />
        </Field>
        <Field label="Number of reviews">
          <NumberInput value={reviews} onChange={setReviews} min={0} placeholder="e.g. 30" />
        </Field>
        <Field label="Photos on profile">
          <NumberInput value={photos} onChange={setPhotos} min={0} placeholder="e.g. 15" />
        </Field>
        <Field label="Google Posts frequency">
          <Select value={posts} onChange={setPosts} options={[["weekly", "Weekly"], ["monthly", "Monthly"], ["rarely", "Rarely / never"]]} />
        </Field>
      </div>
      {score !== null && <ScoreCard score={score} label="Local visibility score" detail="Based on NAP consistency, reviews, photos and how often you post." />}
    </>
  );
}

function VisibilityEstimator() {
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState("");
  const [complete, setComplete] = useState("");
  const [proximity, setProximity] = useState("medium");
  const score = useMemo(() => {
    if (!filled(reviews) && !filled(rating) && !filled(complete)) return null;
    const prox = { close: 100, medium: 60, far: 25 }[proximity] ?? 0;
    return Math.round(0.3 * clamp(num(reviews)) + 0.25 * clamp((num(rating) / 5) * 100) + 0.25 * clamp(num(complete)) + 0.2 * prox);
  }, [reviews, rating, complete, proximity]);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Number of reviews">
          <NumberInput value={reviews} onChange={setReviews} min={0} placeholder="e.g. 42" />
        </Field>
        <Field label="Average rating (1–5)">
          <NumberInput value={rating} onChange={setRating} min={0} max={5} step={0.1} placeholder="e.g. 4.6" />
        </Field>
        <Field label="Profile completeness (%)">
          <NumberInput value={complete} onChange={setComplete} min={0} max={100} placeholder="e.g. 80" />
        </Field>
        <Field label="Proximity to searchers">
          <Select
            value={proximity}
            onChange={setProximity}
            options={[["close", "In/near the city center"], ["medium", "Suburb / nearby"], ["far", "Outskirts / far"]]}
          />
        </Field>
      </div>
      {score !== null && (
        <ScoreCard
          score={score}
          label="Estimated Google Maps visibility"
          detail="Weighted from reviews, rating, profile completeness and proximity. A directional estimate, not a live ranking."
        />
      )}
    </>
  );
}

function RankingCalculator() {
  const [gbp, setGbp] = useState("");
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState("");
  const [citations, setCitations] = useState("");
  const [mobile, setMobile] = useState("yes");
  const score = useMemo(() => {
    if (!filled(gbp) && !filled(reviews) && !filled(citations)) return null;
    return Math.round(
      0.25 * clamp(num(gbp)) +
        0.25 * clamp((num(reviews) / 75) * 100) +
        0.2 * clamp((num(rating) / 5) * 100) +
        0.2 * clamp((num(citations) / 50) * 100) +
        (mobile === "yes" ? 10 : 0),
    );
  }, [gbp, reviews, rating, citations, mobile]);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="GBP completeness (%)">
          <NumberInput value={gbp} onChange={setGbp} min={0} max={100} placeholder="e.g. 90" />
        </Field>
        <Field label="Number of reviews">
          <NumberInput value={reviews} onChange={setReviews} min={0} placeholder="e.g. 50" />
        </Field>
        <Field label="Average rating (1–5)">
          <NumberInput value={rating} onChange={setRating} min={0} max={5} step={0.1} placeholder="e.g. 4.7" />
        </Field>
        <Field label="Citations / listings">
          <NumberInput value={citations} onChange={setCitations} min={0} placeholder="e.g. 25" />
        </Field>
        <Field label="Mobile-friendly website?">
          <Select value={mobile} onChange={setMobile} options={[["yes", "Yes"], ["no", "No"]]} />
        </Field>
      </div>
      {score !== null && <ScoreCard score={score} label="Local ranking potential" detail="Weighted across the main local ranking factors. Improve your lowest inputs first." />}
    </>
  );
}

function SearchVolumeCalculator() {
  const [keyword, setKeyword] = useState("");
  const [market, setMarket] = useState("mid");
  const range = useMemo(() => {
    const k = keyword.trim();
    if (!k) return null;
    const words = k.split(/\s+/).length;
    const base = words <= 1 ? 1400 : words === 2 ? 600 : words === 3 ? 220 : 90;
    const mult = { small: 0.25, mid: 1, metro: 2.5 }[market] ?? 1;
    const mid = 10 * Math.round((base * mult) / 10);
    return { low: Math.round(0.6 * mid), high: Math.round(1.4 * mid) };
  }, [keyword, market]);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Keyword">
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. emergency plumber near me" className={inputClass} />
        </Field>
        <Field label="Market size">
          <Select value={market} onChange={setMarket} options={[["small", "Small town"], ["mid", "Mid-size city"], ["metro", "Major metro"]]} />
        </Field>
      </div>
      {range && (
        <BigResult value={`${range.low.toLocaleString()}–${range.high.toLocaleString()}`} unit="/ month">
          <p className="mt-2 text-sm text-ink/60">
            A rough estimate based on phrase length and market size, not live search data. Use it to compare keywords against each other rather than as an exact
            volume.
          </p>
        </BigResult>
      )}
    </>
  );
}

function DistanceCalculator() {
  const [latA, setLatA] = useState("");
  const [lngA, setLngA] = useState("");
  const [latB, setLatB] = useState("");
  const [lngB, setLngB] = useState("");
  const result = useMemo(() => {
    if (![latA, lngA, latB, lngB].every(filled)) return null;
    const rad = (d: number) => (d * Math.PI) / 180;
    const dLat = rad(num(latB) - num(latA));
    const dLng = rad(num(lngB) - num(lngA));
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(num(latA))) * Math.cos(rad(num(latB))) * Math.sin(dLng / 2) ** 2;
    const km = 12742 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return { km, mi: km * 0.621371 };
  }, [latA, lngA, latB, lngB]);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Point A latitude">
          <NumberInput value={latA} onChange={setLatA} placeholder="30.2672" />
        </Field>
        <Field label="Point A longitude">
          <NumberInput value={lngA} onChange={setLngA} placeholder="-97.7431" />
        </Field>
        <Field label="Point B latitude">
          <NumberInput value={latB} onChange={setLatB} placeholder="30.3079" />
        </Field>
        <Field label="Point B longitude">
          <NumberInput value={lngB} onChange={setLngB} placeholder="-97.8939" />
        </Field>
      </div>
      {result && (
        <BigResult value={`${result.km.toFixed(2)} km`} unit={`(${result.mi.toFixed(2)} mi)`}>
          <p className="mt-1 text-sm text-ink/60">Straight-line (as-the-crow-flies) distance between the two points.</p>
        </BigResult>
      )}
    </>
  );
}

function ReviewScoreEstimator() {
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState("");
  const [competitor, setCompetitor] = useState("");
  const result = useMemo(() => {
    if (!filled(reviews) || !filled(rating)) return null;
    const n = num(reviews);
    const r = num(rating);
    const adjusted = (r * n + 40) / (n + 10);
    const vsComp = filled(competitor) ? r - num(competitor) : null;
    return { adjusted, vsComp };
  }, [reviews, rating, competitor]);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Your reviews">
          <NumberInput value={reviews} onChange={setReviews} min={0} placeholder="e.g. 40" />
        </Field>
        <Field label="Your avg rating">
          <NumberInput value={rating} onChange={setRating} min={0} max={5} step={0.1} placeholder="e.g. 4.5" />
        </Field>
        <Field label="Competitor avg (optional)">
          <NumberInput value={competitor} onChange={setCompetitor} min={0} max={5} step={0.1} placeholder="e.g. 4.7" />
        </Field>
      </div>
      {result && (
        <BigResult value={result.adjusted.toFixed(2)} unit="weighted score">
          <p className="mt-2 text-sm text-ink/60">
            Adjusts your raw average for review count (a handful of reviews gets pulled toward the average). More consistent reviews raise it.
          </p>
          {result.vsComp !== null && (
            <p className="mt-2 text-sm font-medium text-ink">
              {result.vsComp >= 0
                ? `You're ${result.vsComp.toFixed(1)} stars ahead of the competitor.`
                : `You're ${Math.abs(result.vsComp).toFixed(1)} stars behind — focus on earning more positive reviews.`}
            </p>
          )}
        </BigResult>
      )}
    </>
  );
}

function KeywordDensityChecker() {
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const stats = useMemo(() => {
    const text = content.trim();
    const kw = keyword.trim().toLowerCase();
    if (!text || !kw) return null;
    const words = text.split(/\s+/).length;
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const count = (content.toLowerCase().match(new RegExp(`\\b${escaped}\\b`, "g")) ?? []).length;
    const density = (count * kw.split(/\s+/).length * 100) / words;
    return { words, count, density };
  }, [content, keyword]);
  return (
    <>
      <Field label="Your content">
        <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste your page or post content here…" className={inputClass} />
      </Field>
      <div className="mt-4">
        <Field label="Target keyword">
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. plumber austin" className={inputClass} />
        </Field>
      </div>
      {stats && (
        <div className="mt-6 grid grid-cols-3 gap-3 text-center" aria-live="polite">
          {[
            [stats.words.toLocaleString(), "Total words"],
            [stats.count.toLocaleString(), "Keyword uses"],
            [`${stats.density.toFixed(2)}%`, "Density"],
          ].map(([value, caption]) => (
            <div key={caption} className="rounded-xl bg-[#fcdffe]/40 p-4">
              <div className="text-2xl font-bold text-ink">{value}</div>
              <div className="mt-1 text-xs text-ink/60">{caption}</div>
            </div>
          ))}
          <p className="col-span-3 mt-2 text-sm text-ink/60">
            {stats.density > 3
              ? "⚠ Over 3% can read as keyword stuffing — ease off."
              : stats.density < 0.5
                ? "Below 0.5% — try working the keyword in a little more, naturally."
                : "✓ In the natural 0.5–3% range."}
          </p>
        </div>
      )}
    </>
  );
}

const CHECKLIST: { title: string; items: string[] }[] = [
  {
    title: "Google Business Profile",
    items: ["Claim and verify your profile", "Choose the most accurate primary category", "Complete every field (hours, services, attributes)", "Add 10+ high-quality photos"],
  },
  { title: "Reviews", items: ["Ask happy customers for reviews", "Reply to every review (good and bad)"] },
  {
    title: "Website & NAP",
    items: [
      "Keep name, address and phone consistent everywhere",
      "Create location and service pages",
      "Add LocalBusiness schema markup",
      "Make sure the site is fast and mobile-friendly",
    ],
  },
  { title: "Citations", items: ["List in major directories (Apple, Bing, Yelp)", "Add industry-specific directories"] },
];
const CHECKLIST_TOTAL = CHECKLIST.reduce((n, g) => n + g.items.length, 0);

function SeoChecklist() {
  const [checked, setChecked] = useState<Set<string>>(() => new Set());
  const pct = Math.round((checked.size / CHECKLIST_TOTAL) * 100);
  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  return (
    <>
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-ink">Your progress</span>
          <span className="text-sm text-ink/60" aria-live="polite">
            {checked.size}/{CHECKLIST_TOTAL} ({pct}%)
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#fcdffe]/50">
          <div className="h-full bg-brand-700 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="space-y-6">
        {CHECKLIST.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">{group.title}</h3>
            <ul className="mt-2 space-y-2">
              {group.items.map((label) => {
                const key = `${group.title}:${label}`;
                const on = checked.has(key);
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm text-ink">
                      <input type="checkbox" checked={on} onChange={() => toggle(key)} className="mt-0.5 h-4 w-4 shrink-0 accent-brand-700" />
                      <span className={on ? "text-ink/40 line-through" : undefined}>{label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export function Calculator({ id }: { id: CalculatorId }) {
  switch (id) {
    case "visibility-score":
      return <VisibilityScoreCalculator />;
    case "visibility-estimator":
      return <VisibilityEstimator />;
    case "ranking":
      return <RankingCalculator />;
    case "search-volume":
      return <SearchVolumeCalculator />;
    case "distance":
      return <DistanceCalculator />;
    case "review-score":
      return <ReviewScoreEstimator />;
    case "keyword-density":
      return <KeywordDensityChecker />;
    case "seo-checklist":
      return <SeoChecklist />;
  }
}
