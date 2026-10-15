import "server-only";

/**
 * Extra Rankings state that isn't part of BusinessState: the scan-center offset a user can drag
 * on the "Adjust on map" panel. Offsets are in miles from the business pin (east / north positive).
 */

import type { ScanCenter } from "@/components/app/rankings/shared";
export type { ScanCenter };

const g = globalThis as unknown as { __rlScanCenters?: Map<string, ScanCenter> };
const centers = (g.__rlScanCenters ??= new Map<string, ScanCenter>());

export function getScanCenter(businessId: string): ScanCenter {
  return centers.get(businessId) ?? { east: 0, north: 0 };
}

export function setScanCenter(businessId: string, center: ScanCenter) {
  if (center.east === 0 && center.north === 0) centers.delete(businessId);
  else centers.set(businessId, center);
}
