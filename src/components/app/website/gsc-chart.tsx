/**
 * Illustrative "Search Console style" performance chart drawn in SVG: two metric tiles on top
 * (clicks / impressions) and both lines on independent scales. Data is generated from a curve,
 * not real client data.
 */

type Shape = "steady" | "compound" | "new";

function series(shape: Shape, n: number, phase: number) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const base = shape === "steady" ? 0.25 + 0.75 * t : shape === "compound" ? 0.08 + 0.92 * t ** 2.2 : t < 0.35 ? 0.03 + 0.04 * t : 0.05 + 0.95 * ((t - 0.35) / 0.65) ** 1.6;
    const wobble = 0.08 * Math.sin(i * 1.7 + phase) + 0.05 * Math.sin(i * 0.53 + phase * 2) + (i % 7 === 5 || i % 7 === 6 ? -0.06 : 0);
    return Math.max(0.01, base * (1 + wobble));
  });
}

function path(values: number[], w: number, h: number, top = 0.92) {
  const max = Math.max(...values);
  return values.map((v, i) => `${i ? "L" : "M"}${((i / (values.length - 1)) * w).toFixed(1)} ${(h - (v / max) * h * top).toFixed(1)}`).join(" ");
}

export function GscChart({ clicks, impressions, shape, months }: { clicks: string; impressions: string; shape: Shape; months: string[] }) {
  const n = 64;
  const w = 300;
  const h = 110;
  const c = series(shape, n, 0.4);
  const imp = series(shape, n, 2.1).map((v, i) => v * (1 + 0.12 * Math.sin(i * 0.9)));
  return (
    <div className="overflow-hidden rounded-xl border border-[#e8e2f0] bg-white" role="img" aria-label={`Illustrative Search Console chart: ${clicks} clicks, ${impressions} impressions`}>
      <div className="grid grid-cols-2 gap-px bg-[#e8e2f0] text-white">
        <div className="bg-[#4285f4] px-3 py-2">
          <p className="text-[10px] font-medium opacity-90">Total clicks</p>
          <p className="text-lg leading-tight font-bold">{clicks}</p>
        </div>
        <div className="bg-[#5e35b1] px-3 py-2">
          <p className="text-[10px] font-medium opacity-90">Total impressions</p>
          <p className="text-lg leading-tight font-bold">{impressions}</p>
        </div>
      </div>
      <svg viewBox={`-4 -4 ${w + 8} ${h + 22}`} className="block w-full" aria-hidden>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={w} y1={h - f * h * 0.92} y2={h - f * h * 0.92} stroke="#eef0f3" strokeWidth="1" />
        ))}
        <line x1="0" x2={w} y1={h} y2={h} stroke="#dadce0" strokeWidth="1" />
        <path d={path(imp, w, h)} fill="none" stroke="#5e35b1" strokeWidth="1.6" strokeLinejoin="round" />
        <path d={path(c, w, h, 0.6)} fill="none" stroke="#4285f4" strokeWidth="1.6" strokeLinejoin="round" />
        {months.map((m, i) => (
          <text key={m + i} x={(i / Math.max(1, months.length - 1)) * w} y={h + 14} fontSize="9" fill="#80868b" textAnchor={i === 0 ? "start" : i === months.length - 1 ? "end" : "middle"}>
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}
