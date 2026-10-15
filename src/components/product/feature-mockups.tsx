"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { CheckCircle2, ClipboardCheck, Sparkles } from "lucide-react";
import { checkupItems, featureScanTones, listingChips, type FeatureViz } from "@/lib/data/features";
import { useInView } from "./use-in-view";

/*
 * Small "app UI" illustrations used on /features (and reusable elsewhere).
 * Every mockup takes `shown`: false = pre-reveal state, true = animated in.
 */

type MockProps = { shown?: boolean; className?: string };

const miniCard = "rounded-[18px] bg-white shadow-[0_16px_34px_-18px_rgba(35,25,56,.35)]";
const enter = (shown: boolean, i: number, hidden = "translate-y-3 opacity-0"): { className: string; style: CSSProperties } => ({
  className: clsx("transition-all duration-500 ease-out motion-reduce:transition-none", shown ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hidden),
  style: { transitionDelay: `${i * 110}ms` },
});

export function SkeletonBar({ width, light, className }: { width: string; light?: boolean; className?: string }) {
  return <span className={clsx("block h-2 rounded-full", light ? "bg-white/45" : "bg-ink/[0.08]", className)} style={{ width }} />;
}

export function GreenCheck({ className = "size-5" }: { className?: string }) {
  return <CheckCircle2 className={clsx("shrink-0 fill-rank-good text-white", className)} aria-hidden />;
}

/* 1. Google posts --------------------------------------------------------- */
const postThumbs = [
  ["Mon", "from-[#e9d5ff] to-[#c8a8f5]"],
  ["Wed", "from-[#bbf7d0] to-[#86efac]"],
  ["Fri", "from-[#fde68a] to-[#fbbf24]"],
] as const;

export function PostsMockup({ shown = true, className }: MockProps) {
  return (
    <div className={clsx(miniCard, "w-full max-w-[330px] px-3.5 py-1.5", className)}>
      {postThumbs.map(([day, g], i) => {
        const a = enter(shown, i, "translate-x-6 opacity-0");
        return (
          <div key={day} style={a.style} className={clsx(a.className, "flex items-center gap-3 border-b border-ink/[0.06] py-3 last:border-0")}>
            <span className={clsx("size-10 shrink-0 rounded-[10px] bg-gradient-to-br", g)} />
            <span className="flex-1 space-y-1.5">
              <SkeletonBar width="85%" />
              <SkeletonBar width="55%" />
            </span>
            <span className="text-right">
              <span className="block text-[11px] font-semibold text-ink/40">{day}</span>
              <span className="mt-1.5 block rounded-full bg-[#ecfdf3] px-2 py-0.5 text-[11px] font-extrabold text-[#15803d]">Posted ✓</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* 2. Review + AI reply ---------------------------------------------------- */
export function ReviewReplyMockup({ shown = true, className, reply }: MockProps & { reply?: ReactNode }) {
  return (
    <div className={clsx("w-full max-w-[294px]", className)}>
      <div className="rounded-2xl bg-white p-3.5 shadow-[0_16px_34px_-18px_rgba(35,25,56,.35)]">
        <span className="flex gap-1 text-lg leading-none text-[#f59e0b]">
          {Array.from({ length: 5 }, (_, i) => {
            const a = enter(shown, i, "scale-0 opacity-0");
            return (
              <span key={i} style={a.style} className={clsx(a.className, "inline-block")}>
                ★
              </span>
            );
          })}
        </span>
        <SkeletonBar width="90%" className="mt-3" />
        <SkeletonBar width="60%" className="mt-2" />
      </div>
      <div
        className={clsx(
          "relative mt-3 ml-3.5 rounded-2xl bg-brand-700 p-3.5 text-white shadow-[0_18px_34px_-14px_rgba(141,62,187,.75)] transition-all delay-500 duration-500",
          shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <span className="flex items-center gap-1.5 text-xs font-bold">
          <Sparkles className="size-3" aria-hidden /> AI reply
        </span>
        {reply ?? (
          <>
            <span className={clsx("mt-3 block h-2 rounded-full bg-white/45 transition-[width] delay-700 duration-700", shown ? "w-[92%]" : "w-0")} />
            <span className={clsx("mt-2 block h-2 rounded-full bg-white/45 transition-[width] delay-1000 duration-700", shown ? "w-[64%]" : "w-0")} />
          </>
        )}
      </div>
    </div>
  );
}

/* 3. Listings -------------------------------------------------------------- */
export function ListingsMockup({ shown = true, className }: MockProps) {
  return (
    <div className={clsx("text-center", className)}>
      <p className="bg-gradient-to-br from-brand-700 to-ink bg-clip-text text-[54px] leading-none font-extrabold tracking-[-0.03em] text-transparent">500+</p>
      <div className="mx-auto mt-4 flex max-w-[270px] flex-wrap justify-center gap-2">
        {listingChips.map((d, i) => {
          const a = enter(shown, i, "scale-75 opacity-0");
          return (
            <span
              key={d}
              style={a.style}
              className={clsx(a.className, "flex items-center gap-1.5 rounded-full bg-white py-1.5 pr-[11px] pl-[7px] text-[13px] font-bold shadow-[0_6px_14px_-8px_rgba(35,25,56,.35)]")}
            >
              <GreenCheck className="size-4" /> {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* 4. Heat-map scan (no street map, grid paper) ------------------------------- */
const toneBg = { good: "bg-rank-good", mid: "bg-rank-mid", bad: "bg-rank-bad" } as const;
type Tone = keyof typeof toneBg;
/** Spots that "improve" during the animation: they start one tone worse. */
const worse: Record<Tone, Tone> = { good: "mid", mid: "bad", bad: "bad" };

export function HeatDotsMockup({ shown = true, className }: MockProps) {
  const [improved, setImproved] = useState(false);
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setImproved(true), 1100);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div className={clsx("relative grid place-items-center", className)}>
      {[0, 1].map((r) => (
        <span
          key={r}
          className="absolute size-[230px] animate-ping rounded-full border border-brand-700/15 [animation-duration:3.2s]"
          style={{ animationDelay: `${r * 1.6}s` }}
          aria-hidden
        />
      ))}
      <div className="relative grid grid-cols-5 gap-3">
        {featureScanTones.flatMap((row, y) =>
          row.map((tone, x) => {
            const dist = Math.hypot(x - 2, y - 2);
            const changes = (x + y) % 3 === 0 && dist > 1;
            const current: Tone = improved || !changes ? tone : worse[tone];
            return (
              <span
                key={`${x}-${y}`}
                className={clsx(
                  "size-[30px] rounded-full shadow-[0_3px_8px_rgba(35,25,56,.16)] ring-2 ring-white transition-all duration-500 motion-reduce:transition-none",
                  shown ? clsx("scale-100", toneBg[current]) : "scale-75 bg-ink/10",
                )}
                style={{ transitionDelay: improved ? `${dist * 90}ms` : `${dist * 100}ms` }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

/* 5. AI answer --------------------------------------------------------------- */
export function AiAnswerMockup({ shown = true, className, question = "Who is the best plumber near me?" }: MockProps & { question?: string }) {
  const q = enter(shown, 0);
  const a = enter(shown, 3);
  return (
    <div className={clsx("w-full max-w-[380px]", className)}>
      <p style={q.style} className={clsx(q.className, "ml-auto w-fit rounded-[16px_16px_4px_16px] bg-ink px-3.5 py-2.5 text-[13px] font-semibold text-white")}>
        {question}
      </p>
      <div style={a.style} className={clsx(a.className, "mt-3 w-[290px] max-w-full rounded-[16px_16px_16px_4px] bg-white p-3.5 shadow-[0_16px_34px_-18px_rgba(35,25,56,.35)]")}>
        <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700">
          <Sparkles className="size-3" aria-hidden /> AI answer
        </span>
        <SkeletonBar width="88%" className="mt-3" />
        <span className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-[#ecfdf3] py-1 pr-3 pl-1.5 text-[13px] font-extrabold text-[#15803d]">
          <span className="size-3 rounded-full bg-rank-good ring-2 ring-[#bbf7d0]" /> Your business
        </span>
        <SkeletonBar width="64%" className="mt-2.5" />
      </div>
    </div>
  );
}

/* 6. Profile checkup --------------------------------------------------------- */
export function CheckupMockup({ shown = true, className, items = checkupItems }: MockProps & { items?: string[] }) {
  return (
    <div className={clsx("w-full max-w-[260px] rounded-2xl bg-white p-3.5 shadow-[0_16px_34px_-18px_rgba(35,25,56,.35)]", className)}>
      <p className="flex items-center gap-1.5 text-[13px] font-bold">
        <ClipboardCheck className="size-4 text-brand-700" aria-hidden /> Profile checkup
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((x, i) => {
          const a = enter(shown, i + 1, "translate-x-3 opacity-0");
          return (
            <li key={x} style={a.style} className={clsx(a.className, "flex items-center justify-between rounded-lg bg-[#f6f4f9] px-2.5 py-2 text-[13px] font-semibold")}>
              {x}
              <GreenCheck className="size-[18px]" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* 7. White-label brand ----------------------------------------------------------- */
export function WhiteLabelMockup({
  shown = true,
  className,
  agency = "Your Agency",
  domain = "app.youragency.com",
}: MockProps & { agency?: string; domain?: string }) {
  const a = enter(shown, 0, "translate-y-3 scale-95 opacity-0");
  return (
    <div style={a.style} className={clsx(a.className, "w-full max-w-[280px] rounded-[18px] bg-white p-3.5 shadow-[0_16px_34px_-18px_rgba(35,25,56,.35)]", className)}>
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-[#1e40af] text-sm font-extrabold text-white">{agency[0]}</span>
        <span className="flex-1 text-sm font-bold text-[#1e40af]">{agency}</span>
        <span className="rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[10px] font-extrabold text-[#059669]">Client portal</span>
      </div>
      <SkeletonBar width="90%" className="mt-4" />
      <SkeletonBar width="70%" className="mt-2" />
      <div className="mt-4 flex gap-1.5">
        {["#1e40af", "#059669", "#e0e7ff"].map((c, i) => (
          <span
            key={c}
            className={clsx("size-[22px] rounded-md transition-transform duration-500", shown ? "scale-100" : "scale-0")}
            style={{ background: c, transitionDelay: `${300 + i * 120}ms` }}
          />
        ))}
      </div>
      <p className="mt-3 w-fit rounded-md bg-ink/[0.05] px-2.5 py-1.5 font-mono text-[11px] text-ink/70">{domain}</p>
    </div>
  );
}

/* Tile wrapper used on /features ---------------------------------------------------- */
const mockups: Record<FeatureViz, (p: MockProps) => ReactNode> = {
  posts: PostsMockup,
  reviews: ReviewReplyMockup,
  listings: ListingsMockup,
  scan: HeatDotsMockup,
  ai: AiAnswerMockup,
  checkup: CheckupMockup,
  brand: WhiteLabelMockup,
};

export function FeatureTile({ viz, className }: { viz: FeatureViz; className?: string }) {
  const [ref, shown] = useInView<HTMLDivElement>();
  const Mock = mockups[viz];
  return (
    <div
      ref={ref}
      aria-hidden
      className={clsx(
        "relative grid min-h-[226px] place-items-center overflow-hidden rounded-[28px] border border-ink/[0.07] px-6 py-6 sm:min-h-[285px]",
        viz === "scan"
          ? "bg-[#f4f0f9] bg-[linear-gradient(rgba(35,25,56,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(35,25,56,.05)_1px,transparent_1px)] bg-[size:24px_24px]"
          : "bg-[radial-gradient(110%_120%_at_0%_0%,rgba(252,223,254,.85),transparent_62%),linear-gradient(160deg,#f7f2fb,#f1edf7)]",
        className,
      )}
    >
      <Mock shown={shown} />
    </div>
  );
}
