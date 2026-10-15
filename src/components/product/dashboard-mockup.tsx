import clsx from "clsx";
import { useId, type ReactNode } from "react";
import { dashboardGrid } from "@/lib/data/features";

/* Colours used by the map-pin heat map (match the app's Scans page). */
export const pinColor = (rank: number) => (rank <= 3 ? "#1db954" : rank <= 10 ? "#f59e0b" : "#ef4444");

const PIN_PATH = "M20 2C11.163 2 4 9.163 4 18C4 30.5 20 47 20 47C20 47 36 30.5 36 18C36 9.163 28.837 2 20 2Z";
const XS = [32, 88, 144, 200, 256, 312, 368];
const YS = [30, 70, 110, 150, 190, 230, 270];

/**
 * Illustrated street map with a 7×7 grid of numbered map pins.
 * `grid` uses 0 for the business itself (drawn as a purple star pin).
 */
export function PinHeatMap({ grid = dashboardGrid, legend = true, className }: { grid?: number[][]; legend?: boolean; className?: string }) {
  const haloId = `halo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <div className={clsx("relative overflow-hidden rounded-xl bg-[#faf0d8]", className)}>
      <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img" aria-label="Map of rankings around your business">
        <path d="M300 -10 C 340 40, 300 90, 360 130 C 410 170, 380 320, 300 320 L 420 320 L 420 -10 Z" fill="#a8c5e8" />
        <path d="M-10 250 C 60 240, 120 280, 200 270 L 200 320 L -10 320 Z" fill="#a8c5e8" />
        <ellipse cx="80" cy="80" rx="46" ry="34" fill="#a5c26b" opacity="0.5" />
        <ellipse cx="250" cy="210" rx="40" ry="30" fill="#9db874" opacity="0.5" />
        {["M-10 150 L 410 120", "M150 -10 L 180 320", "M-10 60 L 410 220"].map((d) => (
          <g key={d} fill="none" strokeLinecap="round">
            <path d={d} stroke="#a89580" strokeWidth="7" />
            <path d={d} stroke="#fff" strokeWidth="4.5" />
          </g>
        ))}
        <path d="M-10 210 C 120 200, 260 240, 410 210" fill="none" stroke="#8d3ebb" strokeWidth="6" />
        <path d="M-10 210 C 120 200, 260 240, 410 210" fill="none" stroke="#ffcb6a" strokeWidth="3.5" />

        {grid.flatMap((row, r) =>
          row.map((rank, c) => {
            if (rank === 0) return null;
            return (
              <g key={`${r}-${c}`} transform={`translate(${XS[c]} ${YS[r]})`}>
                <g transform="translate(-11 -28) scale(0.55)">
                  <path d={PIN_PATH} fill={pinColor(rank)} stroke="white" strokeWidth="2" />
                  <text x="20" y="24" textAnchor="middle" fontWeight="900" fontSize="16" fill="white">
                    {rank}
                  </text>
                </g>
              </g>
            );
          }),
        )}

        {grid.flatMap((row, r) =>
          row.map((rank, c) =>
            rank === 0 ? (
              <g key="you" transform={`translate(${XS[c]} ${YS[r]})`}>
                <defs>
                  <radialGradient id={haloId}>
                    <stop offset="0%" stopColor="#8d3ebb" stopOpacity="0.34" />
                    <stop offset="100%" stopColor="#8d3ebb" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle r="26.4" fill={`url(#${haloId})`} />
                <g transform="translate(-13.75 -33) scale(0.6875)">
                  <path d={PIN_PATH} fill="#8d3ebb" stroke="white" strokeWidth="2.5" />
                  <path d="M20 9.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="white" />
                </g>
                <g transform="translate(0 -44)">
                  <rect x="-42" y="-6.4" width="84" height="12.8" rx="6.4" fill="white" stroke="rgba(0,0,0,.1)" />
                  <path d="M-4 6 L0 10 L4 6 Z" fill="white" />
                  <text y="3.2" textAnchor="middle" fontSize="9.2" fontWeight="800" fill="#231938">
                    Your business
                  </text>
                </g>
              </g>
            ) : null,
          ),
        )}
      </svg>
      {legend && (
        <ul className="absolute bottom-2.5 left-2.5 space-y-0.5 rounded-lg bg-white/95 px-3 py-2 text-[9px] font-medium text-ink/70 shadow-md ring-1 ring-black/5">
          {[
            ["#8d3ebb", "Your business"],
            ["#1db954", "Rank 1–3"],
            ["#f59e0b", "Rank 4–10"],
            ["#ef4444", "Rank 11+"],
          ].map(([c, l]) => (
            <li key={l} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: c }} /> {l}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** macOS-style browser window frame. */
export function BrowserFrame({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={clsx("overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5", className)}>
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-canvas px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-ink/40">{url}</span>
      </div>
      {children}
    </div>
  );
}

const kpis = [
  { label: "Avg. rank", value: "#2 ▲" },
  { label: "Top-3 spots", value: "41 / 49" },
  { label: "Cadence", value: "Weekly" },
];

/** The app's "Scans" page in a browser window, with optional floating stat cards. */
export function ScansDashboardMockup({ overlays = true, className }: { overlays?: boolean; className?: string }) {
  return (
    <div className={clsx("relative", className)} role="group" aria-label="Ranklit dashboard: your Google Maps ranking">
      <BrowserFrame url="app.ranklit.com/scans">
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold">Your Google Map ranking</p>
              <p className="text-[11px] text-ink/50">We checked 49 spots around your business</p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-700 px-2.5 py-1 text-[10px] font-semibold text-white">Check again</span>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-lg border border-black/5 bg-white px-3 py-2">
                <dt className="text-[9px] font-medium tracking-wide text-ink/45 uppercase">{k.label}</dt>
                <dd className="mt-0.5 text-sm font-bold">{k.value}</dd>
              </div>
            ))}
          </dl>
          <PinHeatMap className="mt-3" />
        </div>
      </BrowserFrame>
      {overlays && (
        <>
          <div className="absolute -top-4 -left-4 hidden rounded-xl bg-white px-3 py-2 text-xs font-semibold shadow-xl ring-1 ring-black/5 sm:block">
            <span className="text-green-600">▲</span> Up 6 spots this month
          </div>
          <div className="absolute -right-5 -bottom-5 hidden rounded-xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 sm:block">
            <p className="text-[10px] font-medium tracking-wide text-ink/50 uppercase">Calls this month</p>
            <p className="mt-0.5 text-xl font-bold">
              128 <span className="text-xs font-semibold text-green-600">▲ 41%</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
