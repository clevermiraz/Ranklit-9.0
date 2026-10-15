// Shared Rankings constants + pure helpers (safe for server and client).
import type { GridSize, Rank } from "@/lib/app/types";

export const GRID_OPTIONS: { value: GridSize; label: string }[] = [
  { value: 3, label: "Quick" },
  { value: 5, label: "Standard" },
  { value: 7, label: "Detailed" },
  { value: 9, label: "Wide" },
];

export const SPACING_OPTIONS: { value: number; label: string }[] = [
  { value: 0.5, label: "½ mile" },
  { value: 1, label: "1 mile" },
  { value: 2, label: "2 miles" },
  { value: 3, label: "3 miles" },
  { value: 3.5, label: "3.5 miles" },
  { value: 4, label: "4 miles" },
];

export const spacingLabel = (mi: number) => SPACING_OPTIONS.find((o) => o.value === mi)?.label ?? `${mi} miles`;

export type ScanCenter = { east: number; north: number };

/** "Centered on your business" or e.g. "0.4 mi north-east of your business". */
export function describeCenter(c: ScanCenter) {
  const dist = Math.hypot(c.east, c.north);
  if (dist < 0.05) return "Centered on your business";
  const ns = Math.abs(c.north) >= 0.05 ? (c.north > 0 ? "north" : "south") : "";
  const ew = Math.abs(c.east) >= 0.05 ? (c.east > 0 ? "east" : "west") : "";
  return `${dist.toFixed(1)} mi ${[ns, ew].filter(Boolean).join("-")} of your business`;
}

/** Flat row-major points → rows. */
export function toRows(points: Rank[], grid: number): Rank[][] {
  return Array.from({ length: grid }, (_, y) => points.slice(y * grid, y * grid + grid));
}

export const ENGINE_STYLE: Record<string, { mark: string; bg: string }> = {
  Perplexity: { mark: "P", bg: "#1f6f78" },
  ChatGPT: { mark: "G", bg: "#10a37f" },
  Gemini: { mark: "✦", bg: "#4f6bed" },
  Claude: { mark: "C", bg: "#d97757" },
  "Google AI Overviews": { mark: "O", bg: "#4285f4" },
  "Google AI Mode": { mark: "M", bg: "#34a853" },
};
