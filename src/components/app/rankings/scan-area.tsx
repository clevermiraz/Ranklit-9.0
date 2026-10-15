"use client";

import { useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Grid3x3, Lock, MapPin, RotateCcw, Sparkles } from "lucide-react";
import { scanAreaInfo, type GridSize, type ScanArea } from "@/lib/app/types";
import { useAction } from "@/components/app/toast";
import { btn } from "@/components/app/ui";
import { MapBackdrop } from "@/components/rank-grid";
import { saveScanAreaAction } from "@/app/actions/rankings";
import { Modal } from "./modal";
import { GRID_OPTIONS, SPACING_OPTIONS, describeCenter, spacingLabel, type ScanCenter } from "./shared";

type EditorProps = { area: ScanArea; center: ScanCenter; maxGrid: GridSize; onSaved?: () => void };

/** The scan-area picker (used in the Map Scans modal; can also be rendered inline). */
export function ScanAreaEditor({ area, center: initialCenter, maxGrid, onSaved }: EditorProps) {
  const [grid, setGrid] = useState<GridSize>(area.grid);
  const [spacing, setSpacing] = useState(area.spacing);
  const [center, setCenter] = useState<ScanCenter>(initialCenter);
  const [mapOpen, setMapOpen] = useState(false);
  const { run, pending } = useAction();
  const info = scanAreaInfo({ grid, spacing });
  const changed = grid !== area.grid || spacing !== area.spacing || center.east !== initialCenter.east || center.north !== initialCenter.north;

  const save = () =>
    run(
      () => saveScanAreaAction({ grid, spacing, center }),
      (r) => {
        if (!r?.error) onSaved?.();
      },
    );

  return (
    <div>
      <div className="flex items-center gap-4 rounded-xl border border-[#ece6f4] bg-[#f6f0fb] p-4">
        <DotPreview grid={grid} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">
            {info.spots} spots checked · {spacingLabel(spacing)} apart
          </p>
          <p className="text-xs text-ink/60">{info.blurb}</p>
          <dl className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-ink/55">
            <div>
              <dt>Area covered</dt>
              <dd className="text-[13px] font-bold text-ink">{info.areaCovered}</dd>
            </div>
            <div>
              <dt>Reaches out to</dt>
              <dd className="text-[13px] font-bold text-ink">{info.reach}</dd>
            </div>
            <div>
              <dt>Credits per scan</dt>
              <dd className="text-[13px] font-bold text-ink">
                {info.creditsPerKeyword} <span className="font-normal text-ink/55">per keyword</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="mt-5 text-sm font-bold">Number of spots</p>
      <div className="mt-2 grid grid-cols-4 gap-2" role="group" aria-label="Number of spots">
        {GRID_OPTIONS.map((o) => {
          const locked = o.value > maxGrid;
          const sel = o.value === grid;
          return (
            <button
              key={o.value}
              type="button"
              disabled={locked}
              aria-pressed={sel}
              onClick={() => setGrid(o.value)}
              className={clsx(
                "rounded-lg border px-2 py-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                sel ? "border-brand-600 bg-[#f6ecfc] text-brand-700" : "border-[#e4dcef] bg-white text-ink hover:border-brand-300",
              )}
            >
              <span className="flex items-center justify-center gap-1 text-sm font-bold">
                {locked && <Lock className="size-3" />}
                {o.value}×{o.value}
              </span>
              <span className={clsx("block text-[11px]", sel ? "text-brand-700/80" : "text-ink/50")}>{o.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink/55">
        Your plan covers scan areas up to {maxGrid}×{maxGrid}.{" "}
        <Link href="/settings/plans" className="font-semibold text-brand-700 hover:underline">
          Upgrade
        </Link>{" "}
        to scan a wider area.
      </p>

      <p className="mt-5 text-sm font-bold">Distance between spots</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Distance between spots">
        {SPACING_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={o.value === spacing}
            onClick={() => setSpacing(o.value)}
            className={clsx(
              "rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors",
              o.value === spacing ? "border-brand-600 bg-[#f6ecfc] text-brand-700" : "border-[#e4dcef] bg-white text-ink/75 hover:border-brand-300",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-ink/55">Closer together gives a sharper picture of your immediate area. Further apart covers more ground for the same number of credits.</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm font-bold">Scan center</p>
        <button type="button" onClick={() => setMapOpen((v) => !v)} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline" aria-expanded={mapOpen}>
          <MapPin className="size-3.5" /> {mapOpen ? "Hide map" : "Adjust on map"}
        </button>
      </div>
      <p className="mt-1 text-xs text-ink/55">
        {center.east === 0 && center.north === 0 ? (
          <>Scans are centered on your business location. Click &ldquo;Adjust on map&rdquo; to drag the center point.</>
        ) : (
          <>
            Scans are centered <strong className="text-ink">{describeCenter(center)}</strong>.
          </>
        )}
      </p>
      {mapOpen && <CenterMap grid={grid} spacing={spacing} center={center} onChange={setCenter} />}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#ece6f4] pt-4">
        <button type="button" className={btn.primary} disabled={!changed || pending} onClick={save}>
          {pending ? "Saving…" : "Save scan area"}
        </button>
        <span className="flex items-center gap-1 text-xs text-ink/55">
          <Sparkles className="size-3.5 text-brand-700" /> Used by every scan for this business.
        </span>
      </div>
    </div>
  );
}

function DotPreview({ grid }: { grid: number }) {
  const c = Math.floor((grid * grid) / 2);
  return (
    <div className="grid size-[72px] shrink-0 place-items-center rounded-lg bg-white p-2" style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }} aria-hidden>
      {Array.from({ length: grid * grid }, (_, i) => (
        <span key={i} className={clsx("rounded-full", i === c ? "bg-brand-800" : "bg-brand-200")} style={{ width: `${Math.max(3, 26 / grid)}px`, height: `${Math.max(3, 26 / grid)}px` }} />
      ))}
    </div>
  );
}

/** Draggable scan centre over a stylised map. Business pin stays put; the grid moves. */
function CenterMap({ grid, spacing, center, onChange }: { grid: number; spacing: number; center: ScanCenter; onChange: (c: ScanCenter) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const reach = ((grid - 1) / 2) * spacing;
  const half = Math.max(3, reach + 2); // miles from map centre to edge
  const halfX = half * (4 / 3); // map is 4:3, keep miles square on screen
  const pctX = (mi: number) => 50 + (mi / halfX) * 50;
  const pctY = (mi: number) => 50 + (mi / half) * 50;

  const moveTo = (e: PointerEvent<HTMLDivElement>) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const snap = (v: number) => Math.max(-5, Math.min(5, Math.round(v * 10) / 10));
    const east = snap((((e.clientX - box.left) / box.width) * 2 - 1) * halfX);
    const north = snap(-(((e.clientY - box.top) / box.height) * 2 - 1) * half);
    onChange({ east, north });
  };

  const c = (grid - 1) / 2;
  return (
    <div className="mt-3">
      <div
        ref={ref}
        className="relative aspect-[4/3] cursor-crosshair touch-none overflow-hidden rounded-xl border border-[#ece6f4] select-none"
        onPointerDown={(e) => {
          dragging.current = true;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Synthetic/stale pointers can't be captured; dragging still works inside the map.
          }
          moveTo(e);
        }}
        onPointerMove={(e) => dragging.current && moveTo(e)}
        onPointerUp={() => (dragging.current = false)}
        role="application"
        aria-label="Drag to move the scan center"
      >
        <MapBackdrop />
        {Array.from({ length: grid * grid }, (_, i) => {
          const x = (i % grid) - c;
          const y = Math.floor(i / grid) - c;
          const mid = x === 0 && y === 0;
          return (
            <span
              key={i}
              className={clsx("absolute -translate-1/2 rounded-full", mid ? "size-3.5 bg-brand-700 ring-2 ring-white" : "size-2 bg-brand-500/80")}
              style={{ left: `${pctX(center.east + x * spacing)}%`, top: `${100 - pctY(center.north - y * spacing)}%` }}
            />
          );
        })}
        <MapPin className="absolute size-6 -translate-x-1/2 -translate-y-full fill-red-500 text-white drop-shadow" style={{ left: "50%", top: "50%" }} aria-label="Your business" />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-ink/55">
        <span className="flex items-center gap-1">
          <Grid3x3 className="size-3.5" /> {describeCenter(center)}
        </span>
        <button type="button" onClick={() => onChange({ east: 0, north: 0 })} className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
          <RotateCcw className="size-3" /> Reset to business
        </button>
      </div>
    </div>
  );
}

/** Header text button that opens the Scan area modal. */
export function ScanAreaButton(props: Omit<EditorProps, "onSaved">) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btn.ghost}>
        <Grid3x3 className="size-4" /> Scan area
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Scan area">
        <h2 className="pr-8 text-lg font-bold">Scan area</h2>
        <p className="mt-1 mb-4 text-sm text-ink/60">Choose how many spots we check around your business and how far apart they are. Applies to every scan for this business.</p>
        <ScanAreaEditor key={`${props.area.grid}-${props.area.spacing}-${props.center.east}-${props.center.north}`} {...props} onSaved={() => setOpen(false)} />
      </Modal>
    </>
  );
}
