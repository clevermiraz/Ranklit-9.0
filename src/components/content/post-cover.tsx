import { MapPin } from "lucide-react";
import { MapBackdrop, RankGrid, type RankValue } from "@/components/rank-grid";
import { site } from "@/lib/site";

/** Deterministic 5x5 rank grid derived from the slug, so each post gets its own cover. */
function gridFor(slug: string): RankValue[][] {
  let h = 7;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => {
      h = (h * 1103515245 + 12345) >>> 0;
      const dist = Math.abs(r - 2) + Math.abs(c - 2);
      const rank = 1 + dist * 3 + (h % 5);
      return rank > 20 ? null : rank;
    }),
  );
}

const coverLabel = (tag: string) => (tag.charAt(0).toUpperCase() + tag.slice(1)).replace(/\bseo\b/gi, "SEO").replace(/\bgbp\b/gi, "GBP");

/** Illustrated hero for an article (we have no stock photos): a map with a rank grid. */
export function PostCover({ slug, label }: { slug: string; label: string }) {
  return (
    <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-xl" aria-hidden>
      <MapBackdrop />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex w-1/2 flex-col justify-end gap-2 p-5 sm:p-8">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold tracking-[0.1em] text-brand-800 uppercase">
          <MapPin className="size-3" strokeWidth={2.5} /> {site.name}
        </span>
        <span className="text-sm font-semibold text-white/90 sm:text-lg">{coverLabel(label)}</span>
      </div>
      <div className="absolute top-1/2 right-[6%] w-[40%] -translate-y-1/2 rounded-2xl bg-white p-1.5 shadow-lift">
        <RankGrid grid={gridFor(slug)} size="sm" />
      </div>
    </div>
  );
}
