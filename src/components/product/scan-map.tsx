import clsx from "clsx";
import { MapBackdrop, rankTone, type RankValue } from "@/components/rank-grid";

const toneClass = {
  good: "bg-rank-good text-white",
  mid: "bg-rank-mid text-ink",
  bad: "bg-rank-bad text-white",
};

/**
 * Geo-grid heat map on a street-map backdrop, like RankGrid but with
 * center-out staggered recolouring and green "pulse" halos on top-3 spots.
 * Works for any square grid (3×3 … 15×15).
 */
export function ScanMap({
  grid,
  halos = false,
  className,
}: {
  grid: RankValue[][];
  /** Show translucent green halos behind top-3 spots. */
  halos?: boolean;
  className?: string;
}) {
  const n = grid.length;
  const mid = (n - 1) / 2;
  // dots are a fixed share of the map so 5×5 and 7×7 grids use the same dot size
  const dot = n <= 5 ? "w-[55%]" : n <= 7 ? "w-[78%]" : "w-[82%]";
  const text = n <= 7 ? "text-[12px] sm:text-[15px]" : "text-[9px] sm:text-[11px]";

  const cells = grid.flatMap((row, y) =>
    row.map((rank, x) => ({ rank, x, y, delay: Math.round(Math.hypot(x - mid, y - mid) * (n <= 5 ? 150 : 100)) })),
  );

  return (
    <div className={clsx("relative aspect-square overflow-hidden rounded-[18px] bg-[#f3f0f7]", className)}>
      <MapBackdrop />
      <div className="absolute inset-[5%] grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` }} aria-hidden>
        {cells.map(({ rank, delay }, i) => {
          const tone = rankTone(rank);
          return (
            <span key={i} className="relative grid place-items-center">
              <span
                className={clsx(
                  "absolute aspect-square w-[170%] rounded-full bg-rank-good/[0.1] transition-all duration-700",
                  halos && tone === "good" ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
                style={{ transitionDelay: `${delay + 150}ms` }}
              />
              <span
                className={clsx(
                  "relative grid aspect-square place-items-center rounded-full font-extrabold shadow-[0_3px_8px_rgba(35,25,56,.18)] ring-2 ring-white transition-colors duration-500 motion-reduce:transition-none",
                  dot,
                  text,
                  toneClass[tone],
                )}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {rank === null ? "20+" : rank}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
