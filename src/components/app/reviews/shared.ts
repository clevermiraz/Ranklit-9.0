// Client-safe constants + helpers shared by the Reviews section, the public review page and the embeds.

export const REVIEW_FONTS = [
  "System default",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Nunito",
  "Raleway",
  "Playfair Display",
  "Merriweather",
] as const;

const SYSTEM = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

export function fontStack(font: string) {
  if (!font || font === "System default") return SYSTEM;
  const serif = font === "Playfair Display" || font === "Merriweather";
  return `"${font}", ${serif ? 'Georgia, "Times New Roman", serif' : SYSTEM}`;
}

export const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$/;

/** Returns an error message, or null when the slug is valid. */
export function slugError(slug: string) {
  if (slug.length < 3) return "Use at least 3 characters.";
  if (slug.length > 60) return "Keep it under 60 characters.";
  if (!SLUG_RE.test(slug)) return "Use lowercase letters, numbers and single hyphens (no hyphen at the start or end).";
  if (slug.includes("--")) return "Avoid double hyphens.";
  return null;
}

export const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** Where happy customers are sent: the linked Google profile, or a Google search for the business. */
export function googleReviewUrl(p: { gbpUrl: string; name: string; city: string }) {
  if (p.gbpUrl) return p.gbpUrl;
  return `https://www.google.com/search?q=${encodeURIComponent(`${p.name} ${p.city} reviews`)}`;
}

export function avgRating(reviews: { rating: number }[]) {
  return reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
}

export const initial = (name: string) => (name.trim()[0] ?? "?").toUpperCase();
