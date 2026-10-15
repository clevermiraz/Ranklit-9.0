import { publicBusinessById } from "@/lib/server/reviews-store";
import { googleReviewUrl } from "@/components/app/reviews/shared";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

/** Public JSON feed of a business's Google reviews for the website widget. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const location = url.searchParams.get("location") ?? "";
  const limit = Math.max(1, Math.min(50, Number.parseInt(url.searchParams.get("limit") ?? "12", 10) || 12));
  const minRating = Math.max(1, Math.min(5, Number.parseInt(url.searchParams.get("min-rating") ?? "1", 10) || 1));

  if (!location) return Response.json({ error: "Missing ?location=<business id>." }, { status: 400, headers: CORS });
  const b = publicBusinessById(location);
  if (!b) return Response.json({ error: "Unknown location." }, { status: 404, headers: CORS });

  const all = b.reviews;
  const rating = all.length ? Math.round((all.reduce((a, r) => a + r.rating, 0) / all.length) * 10) / 10 : 0;
  const reviews = all
    .filter((r) => r.rating >= minRating)
    .sort((a, z) => z.date.localeCompare(a.date))
    .slice(0, limit)
    .map((r) => ({ id: r.id, author: r.author, rating: r.rating, text: r.text, date: r.date }));

  return Response.json(
    {
      business: { name: b.profile.name, rating, total: all.length, reviewUrl: googleReviewUrl(b.profile) },
      reviews,
    },
    { headers: { ...CORS, "Cache-Control": "public, max-age=300" } },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
