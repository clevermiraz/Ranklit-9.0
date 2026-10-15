import "server-only";
import { randomUUID } from "node:crypto";
import { samplePhotos, type GbpPhoto } from "@/components/app/gbp/logic";

/**
 * Google Profile photo library (mock persistence), keyed by business id. Uploaded photos are
 * downscaled in the browser and stored here as data URLs; a few sample photos are seeded.
 */

const g = globalThis as unknown as { __rlGbpPhotos?: Map<string, GbpPhoto[]> };
const photos = (g.__rlGbpPhotos ??= new Map<string, GbpPhoto[]>());

export const MAX_PHOTOS = 60;

export function getPhotos(businessId: string, businessName: string): GbpPhoto[] {
  let list = photos.get(businessId);
  if (!list) {
    const base = Date.now() - 30 * 864e5;
    list = samplePhotos(businessName).map((p, i) => ({ ...p, id: randomUUID(), addedAt: new Date(base + i * 864e5).toISOString() }));
    photos.set(businessId, list);
  }
  return list;
}

export function addPhoto(businessId: string, businessName: string, name: string, src: string) {
  const list = getPhotos(businessId, businessName);
  const photo: GbpPhoto = { id: randomUUID(), name, src, addedAt: new Date().toISOString(), sample: false };
  list.unshift(photo);
  return photo;
}

export function removePhoto(businessId: string, businessName: string, photoId: string) {
  const list = getPhotos(businessId, businessName);
  const i = list.findIndex((p) => p.id === photoId);
  if (i < 0) return false;
  list.splice(i, 1);
  return true;
}
