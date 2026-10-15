import clsx from "clsx";

export type RankValue = number | null; // null = not found in top 20

export function rankTone(rank: RankValue) {
  if (rank === null || rank > 10) return "bad" as const;
  if (rank > 3) return "mid" as const;
  return "good" as const;
}

const toneClass = {
  good: "bg-rank-good text-white",
  mid: "bg-rank-mid text-ink",
  bad: "bg-rank-bad text-white",
};

export function gridStats(grid: RankValue[][]) {
  const cells = grid.flat();
  const top3 = cells.filter((r) => r !== null && r <= 3).length;
  const ranked = cells.map((r) => (r === null ? 21 : r));
  const avg = ranked.reduce((a, b) => a + b, 0) / ranked.length;
  return { total: cells.length, top3, avg: Math.round(avg * 10) / 10 };
}

/** A stylised street map behind the rank dots. Purely decorative. */
export function MapBackdrop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className={clsx("absolute inset-0 size-full", className)} aria-hidden>
      <rect width="400" height="400" fill="#f1eff4" />
      <path d="M-20 300 C 80 260, 120 380, 230 330 S 380 260, 430 300 L430 430 L-20 430Z" fill="#dcefd9" opacity="0.8" />
      <circle cx="330" cy="70" r="55" fill="#dcefd9" opacity="0.8" />
      <path d="M-10 150 C 60 170, 90 230, 150 260 S 230 330, 300 400" stroke="#bfdcf2" strokeWidth="18" fill="none" />
      {[40, 100, 160, 220, 280, 340].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" stroke="#fff" strokeWidth="6" />
      ))}
      {[50, 110, 170, 230, 290, 350].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#fff" strokeWidth="6" />
      ))}
      <path d="M0 400 L 400 60" stroke="#fbe3a6" strokeWidth="9" fill="none" />
      <path d="M150 0 C 160 120, 140 250, 190 400" stroke="#fbe3a6" strokeWidth="7" fill="none" />
    </svg>
  );
}

export function RankGrid({
  grid,
  size = "md",
  className,
  showNumbers = true,
}: {
  grid: RankValue[][];
  size?: "sm" | "md" | "lg";
  className?: string;
  showNumbers?: boolean;
}) {
  const n = grid.length;
  const dot = { sm: "text-[10px]", md: "text-sm sm:text-base", lg: "text-base sm:text-lg" }[size];
  return (
    <div className={clsx("relative aspect-square overflow-hidden rounded-2xl", className)}>
      <MapBackdrop />
      <div
        className="relative grid size-full place-items-center p-[4%]"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {grid.flat().map((rank, i) => {
          const center = i === Math.floor((n * n) / 2);
          return (
            <span
              key={i}
              className={clsx(
                "grid aspect-square w-[78%] place-items-center rounded-full font-bold shadow-[0_2px_6px_rgb(0_0_0/0.18)] ring-2 ring-white/80 transition-colors duration-500",
                toneClass[rankTone(rank)],
                center && "ring-ink/80",
                dot,
              )}
              title={rank === null ? "Not in top 20" : `Rank #${rank}`}
            >
              {showNumbers ? (rank === null ? "20+" : rank) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function RankLegend({ className }: { className?: string }) {
  return (
    <ul className={clsx("space-y-2 text-[15px] font-medium", className)}>
      <li className="flex items-center gap-2.5">
        <span className="size-3 rounded-full bg-rank-good" /> Top 3. This is where the calls go.
      </li>
      <li className="flex items-center gap-2.5">
        <span className="size-3 rounded-full bg-rank-mid" /> 4 to 10
      </li>
      <li className="flex items-center gap-2.5">
        <span className="size-3 rounded-full bg-rank-bad" /> 11 or lower
      </li>
    </ul>
  );
}
