import clsx from "clsx";
import { TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardHeader } from "@/components/app/ui";

/** "Reviews per week" card: 12 purple bars with a y axis, a 4-week trend and a summary footer. */
export function ReviewsPerWeek({
  labels,
  counts,
  delta,
  last4,
  total,
  avg,
}: {
  labels: string[];
  counts: number[];
  delta: number;
  last4: number;
  total: number;
  avg: number;
}) {
  const max = Math.max(4, Math.ceil(Math.max(...counts) / 4) * 4);
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const W = 520;
  const H = 180;
  const padL = 26;
  const padB = 22;
  const plotW = W - padL - 4;
  const plotH = H - padB - 8;
  const slot = plotW / counts.length;
  const barW = Math.min(26, slot * 0.62);
  const y = (v: number) => 8 + plotH - (v / max) * plotH;

  const Trend = delta < 0 ? TrendingDown : delta > 0 ? TrendingUp : ArrowRight;
  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Reviews per week"
        description="Last 12 weeks · new reviews landing on your Google profile."
        actions={
          <span className={clsx("inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap", delta < 0 ? "text-red-500" : delta > 0 ? "text-emerald-600" : "text-ink/45")}>
            <Trend className="size-3.5" />
            {delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${delta}`} vs prior 4 weeks
          </span>
        }
      />
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label={`Reviews per week: ${counts.join(", ")}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - 4} y1={y(t)} y2={y(t)} stroke="#ece6f4" strokeDasharray={t === 0 ? undefined : "3 4"} />
            <text x={padL - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#9b8fb0">
              {Number.isInteger(t) ? t : t.toFixed(1)}
            </text>
          </g>
        ))}
        {counts.map((c, i) => {
          const cx = padL + slot * i + slot / 2;
          const h = (c / max) * plotH;
          return (
            <g key={i}>
              <title>{`Week of ${labels[i]}: ${c} review${c === 1 ? "" : "s"}`}</title>
              <rect x={cx - slot / 2} y={8} width={slot} height={plotH} fill="transparent" />
              {c > 0 && <rect x={cx - barW / 2} y={y(c)} width={barW} height={h} rx={4} fill="#8d3ebb" />}
              <text x={cx} y={H - 6} textAnchor="middle" fontSize="9.5" fill="#9b8fb0">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex items-center justify-between border-t border-[#ece6f4] pt-3 text-xs text-ink/55">
        <span>
          <strong className="text-ink">{total}</strong> total review{total === 1 ? "" : "s"} · <strong className="text-ink">{total ? avg.toFixed(1) : "—"}</strong> avg
        </span>
        <span>
          <strong className="text-ink">{last4}</strong> in the last 4 weeks
        </span>
      </div>
    </Card>
  );
}
