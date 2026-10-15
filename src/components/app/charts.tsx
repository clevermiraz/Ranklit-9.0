import clsx from "clsx";

/*
 * Lightweight SVG charts for the dashboard (no chart library).
 * All charts scale to their container width via viewBox + preserveAspectRatio="none" on the plot.
 */

function smoothPath(points: [number, number][]) {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

export function Sparkline({ values, className, color = "#8d3ebb" }: { values: number[]; className?: string; color?: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const pts: [number, number][] = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * 100, 36 - ((v - min) / Math.max(1, max - min)) * 32]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={`${line} L100,40 L0,40 Z`} fill={color} opacity="0.12" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={pts.at(-1)?.[0]} cy={pts.at(-1)?.[1]} r="1.8" fill={color} />
    </svg>
  );
}

export type Series = { name: string; color: string; values: number[] };

/** Smooth line / stacked-area chart with y gridlines and sparse x labels. */
export function LineChart({
  labels,
  series,
  stacked,
  height = 220,
  className,
}: {
  labels: string[];
  series: Series[];
  stacked?: boolean;
  height?: number;
  className?: string;
}) {
  const W = 1000;
  const H = height;
  const padL = 30;
  const padB = 24;
  const padR = 24;
  const plotW = W - padL - padR;
  const plotH = H - padB - 8;
  const totals = labels.map((_, i) => (stacked ? series.reduce((a, s) => a + (s.values[i] ?? 0), 0) : Math.max(...series.map((s) => s.values[i] ?? 0))));
  const max = Math.max(4, ...totals);
  const niceMax = Math.ceil(max / 4) * 4;
  const x = (i: number) => padL + (i / Math.max(1, labels.length - 1)) * plotW;
  const y = (v: number) => 8 + plotH - (v / niceMax) * plotH;
  const step = Math.max(1, Math.ceil(labels.length / 10));

  const base = labels.map(() => 0);
  const layers = series.map((s) => {
    const lower = [...base];
    const upper = s.values.map((v, i) => (stacked ? base[i] + v : v));
    if (stacked) upper.forEach((v, i) => (base[i] = v));
    return { s, lower, upper };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={clsx("w-full", className)} role="img" aria-label={series.map((s) => s.name).join(", ")}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(niceMax * t)} y2={y(niceMax * t)} stroke="#ece6f4" strokeDasharray="4 4" />
          <text x={padL - 8} y={y(niceMax * t) + 4} textAnchor="end" fontSize="11" fill="#9b8fb0">
            {Math.round(niceMax * t)}
          </text>
        </g>
      ))}
      {[...layers].reverse().map(({ s, lower, upper }) => {
        const top = upper.map((v, i): [number, number] => [x(i), y(v)]);
        const bottom = lower.map((v, i): [number, number] => [x(i), y(v)]).reverse();
        const area = `${smoothPath(top)} L${bottom[0][0]},${bottom[0][1]} ${smoothPath(bottom).replace(/^M[^C]+/, "")} Z`;
        return (
          <g key={s.name}>
            <path d={area} fill={s.color} opacity={stacked ? 0.28 : 0.1} />
            <path d={smoothPath(top)} fill="none" stroke={s.color} strokeWidth="2.5" />
          </g>
        );
      })}
      {labels.map((l, i) =>
        i % step === 0 || i === labels.length - 1 ? (
          <text key={i} x={x(i)} y={H - 6} textAnchor={i === labels.length - 1 ? "end" : i === 0 ? "start" : "middle"} fontSize="11" fill="#9b8fb0">
            {l}
          </text>
        ) : null,
      )}
    </svg>
  );
}

/** Vertical bar chart with value labels above bars. */
export function BarChart({ labels, values, color = "#8d3ebb", height = 180, showValues }: { labels: string[]; values: number[]; color?: string; height?: number; showValues?: boolean }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {values.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          {showValues && <span className="text-[11px] font-semibold">{v}</span>}
          <span className="w-full max-w-10 rounded-t-md" style={{ height: `${(v / max) * 80}%`, minHeight: v ? 4 : 0, background: color }} />
          <span className="text-[10px] text-ink/45">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/** Horizontal bars (e.g. impressions by surface). */
export function HBarChart({ rows }: { rows: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-sm">
          <span className="text-right text-xs text-ink/60">{r.label}</span>
          <span className="h-7 rounded-md bg-[#f5f2f9]">
            <span className="block h-full rounded-md" style={{ width: `${(r.value / max) * 100}%`, background: r.color }} />
          </span>
          <span className="text-xs font-semibold">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
