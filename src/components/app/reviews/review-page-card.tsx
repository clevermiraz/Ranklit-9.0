"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { Star } from "lucide-react";
import { fontStack, initial } from "./shared";

export type ReviewPageLook = {
  name: string;
  logo: string | null;
  accent: string;
  font: string;
  headline: string;
  subtext: string;
};

/** The branded card customers see on /review/[slug]. Used live there and as the dashboard preview. */
export function ReviewPageCard({
  look,
  rating,
  onRate,
  children,
  compact,
}: {
  look: ReviewPageLook;
  rating: number;
  onRate?: (n: number) => void;
  children?: ReactNode;
  compact?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const lit = hover || rating;
  return (
    <div
      className={clsx("w-full overflow-hidden rounded-2xl border border-black/5 bg-white text-center text-[#1f1a2b] shadow-[0_12px_40px_-12px_rgba(35,25,56,.25)]", compact ? "max-w-sm" : "max-w-md")}
      style={{ fontFamily: fontStack(look.font) }}
    >
      <div className="h-1.5" style={{ background: look.accent }} />
      <div className={compact ? "p-6" : "p-8"}>
        {look.logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL
          <img src={look.logo} alt={`${look.name} logo`} className="mx-auto max-h-14 max-w-[160px] object-contain" />
        ) : (
          <span className="mx-auto grid size-14 place-items-center rounded-2xl text-xl font-bold text-white" style={{ background: look.accent }}>
            {initial(look.name)}
          </span>
        )}
        <h1 className={clsx("mt-4 leading-snug font-bold", compact ? "text-lg" : "text-2xl")}>{look.headline || `How was your experience with ${look.name}?`}</h1>
        {look.subtext && <p className="mt-1.5 text-sm text-black/55">{look.subtext}</p>}
        <div className="mt-5 flex justify-center gap-1.5" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              disabled={!onRate}
              onMouseEnter={() => onRate && setHover(n)}
              onClick={() => onRate?.(n)}
              className={clsx("rounded-lg p-0.5 transition-transform disabled:cursor-default", onRate && "hover:scale-110 active:scale-95")}
            >
              <Star className={clsx(compact ? "size-8" : "size-10", n <= lit ? "fill-amber-400 text-amber-400" : "fill-transparent text-black/20")} strokeWidth={1.5} />
            </button>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
