/*
 * Review widget renderer. Shared by the dashboard live preview and the public embed script
 * (/api/embed/widget.js serialises this function with .toString()), so it MUST stay fully
 * self-contained: no imports, no references to anything outside its own body.
 */

export type WidgetOptions = {
  limit: number;
  minRating: number;
  layout: "grid" | "list";
  columns: number;
  theme: "light" | "dark";
  accent: string;
  corners: "sharp" | "rounded" | "extra";
  cardStyle: "shadow" | "outline" | "flat";
  showPhotos: boolean;
  showVerified: boolean;
  showGoogleBadge: boolean;
  showDate: boolean;
  showHeader: boolean;
  showName: boolean;
  showCount: boolean;
  showButton: boolean;
  loadMore: boolean;
  branding: boolean;
};

export type WidgetReview = { id: string; author: string; rating: number; text: string; date: string };
export type WidgetData = {
  business: { name: string; rating: number; total: number; reviewUrl: string };
  reviews: WidgetReview[];
};

export function renderWidget(data: WidgetData, o: WidgetOptions, shown: number, now: number): string {
  const esc = (s: string) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
  const accent = /^#[0-9a-fA-F]{6}$/.test(o.accent) ? o.accent : "#1a73e8";
  const dark = o.theme === "dark";
  const radius = o.corners === "sharp" ? 0 : o.corners === "extra" ? 20 : 12;
  const cols = Math.max(1, Math.min(4, Math.round(o.columns) || 3));
  const fg = dark ? "#f3f4f6" : "#1f2937";
  const muted = dark ? "#9ca3af" : "#6b7280";
  const bg = dark ? "#111827" : "#ffffff";
  const cardBg = o.cardStyle === "flat" ? (dark ? "#1f2937" : "#f5f5f7") : dark ? "#1a2232" : "#ffffff";
  const border = o.cardStyle === "outline" ? `1px solid ${dark ? "#374151" : "#e5e7eb"}` : "1px solid transparent";
  const shadow = o.cardStyle === "shadow" ? (dark ? "0 1px 3px rgba(0,0,0,.5),0 6px 16px -6px rgba(0,0,0,.5)" : "0 1px 3px rgba(16,24,40,.08),0 6px 16px -8px rgba(16,24,40,.16)") : "none";

  const G =
    '<svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
  const star = (on: boolean) =>
    `<svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true"><path fill="${on ? "#fbbc04" : dark ? "#374151" : "#e5e7eb"}" d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.8l-5.2 2.7 1-5.8L1.6 7.6l5.8-.8z"/></svg>`;
  const stars = (n: number) => [1, 2, 3, 4, 5].map((i) => star(i <= Math.round(n))).join("");
  const check = `<svg viewBox="0 0 20 20" width="14" height="14" aria-label="Verified"><circle cx="10" cy="10" r="9" fill="#1a73e8"/><path d="M6 10.2l2.6 2.5L14 7.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ago = (iso: string) => {
    const d = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 864e5));
    if (d < 1) return "today";
    if (d < 7) return d === 1 ? "1 day ago" : d + " days ago";
    if (d < 30) return Math.floor(d / 7) === 1 ? "1 week ago" : Math.floor(d / 7) + " weeks ago";
    if (d < 365) return Math.floor(d / 30) === 1 ? "1 month ago" : Math.floor(d / 30) + " months ago";
    return Math.floor(d / 365) === 1 ? "1 year ago" : Math.floor(d / 365) + " years ago";
  };

  const list = data.reviews.filter((r) => r.rating >= o.minRating).slice(0, Math.max(1, o.limit));
  const visible = list.slice(0, Math.max(1, shown));
  const b = data.business;

  const css = `
.rlw{container-type:inline-size;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:${fg};background:${bg};padding:20px;border-radius:${radius}px;line-height:1.45;box-sizing:border-box;text-align:left}
.rlw *{box-sizing:border-box}
.rlw-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
.rlw-biz{display:flex;align-items:center;gap:10px;min-width:0}
.rlw-g{width:28px;height:28px;flex:none}
.rlw-name{font-weight:700;font-size:16px;margin:0}
.rlw-sum{display:flex;align-items:center;gap:6px;font-size:13px;color:${muted};margin:2px 0 0}
.rlw-sum b{color:${fg};font-size:15px}
.rlw-stars{display:inline-flex;gap:1px;vertical-align:middle}
.rlw-btn{display:inline-flex;align-items:center;gap:6px;background:${accent};color:#fff;text-decoration:none;font-weight:600;font-size:13px;padding:9px 16px;border-radius:999px;border:0;cursor:pointer}
.rlw-btn:hover{filter:brightness(1.08)}
.rlw-grid{display:grid;gap:14px;grid-template-columns:repeat(${o.layout === "list" ? 1 : cols},minmax(0,1fr))}
@container (max-width:620px){.rlw-grid{grid-template-columns:repeat(${o.layout === "list" ? 1 : Math.min(cols, 2)},minmax(0,1fr))}}
@container (max-width:400px){.rlw-grid{grid-template-columns:minmax(0,1fr)}}
.rlw-card{position:relative;background:${cardBg};border:${border};box-shadow:${shadow};border-radius:${radius}px;padding:16px}
.rlw-top{display:flex;align-items:center;gap:10px;padding-right:22px}
.rlw-av{position:relative;width:38px;height:38px;flex:none;border-radius:999px;background:${accent};color:#fff;display:grid;place-items:center;font-weight:700;font-size:15px}
.rlw-av .rlw-badge{position:absolute;right:-3px;bottom:-3px;width:16px;height:16px;border-radius:999px;background:#fff;padding:2px;box-shadow:0 0 0 1px rgba(0,0,0,.06)}
.rlw-corner{position:absolute;top:14px;right:14px;width:18px;height:18px}
.rlw-who{min-width:0}
.rlw-author svg{flex:none}
.rlw-author{display:flex;align-items:center;gap:5px;font-weight:600;font-size:14px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rlw-date{font-size:12px;color:${muted};margin:0}
.rlw-rate{margin:10px 0 6px;display:flex}
.rlw-text{font-size:14px;margin:0;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}
.rlw-empty{font-size:14px;color:${muted};padding:20px;text-align:center}
.rlw-more{display:flex;justify-content:center;margin-top:16px}
.rlw-more button{background:transparent;color:${accent};border:1px solid ${accent};border-radius:999px;padding:8px 18px;font-weight:600;font-size:13px;cursor:pointer;font-family:inherit}
.rlw-foot{display:flex;justify-content:center;margin-top:16px;font-size:12px;color:${muted}}
.rlw-foot a{color:inherit;text-decoration:none;font-weight:600}
`;

  let head = "";
  if (o.showHeader) {
    head =
      '<div class="rlw-head"><div class="rlw-biz"><span class="rlw-g">' +
      G +
      "</span><div>" +
      (o.showName ? '<p class="rlw-name">' + esc(b.name) + "</p>" : "") +
      '<p class="rlw-sum"><b>' +
      (b.total ? b.rating.toFixed(1) : "—") +
      '</b><span class="rlw-stars">' +
      stars(b.rating) +
      "</span><span>" +
      (o.showCount ? "out of 5 based on " + b.total + (b.total === 1 ? " review" : " reviews") : "out of 5") +
      "</span></p></div></div>" +
      (o.showButton ? '<a class="rlw-btn" href="' + esc(b.reviewUrl) + '" target="_blank" rel="noopener">Review us on Google</a>' : "") +
      "</div>";
  }

  const cards = visible
    .map((r) => {
      const initial = esc((r.author.trim()[0] || "?").toUpperCase());
      const avatar = o.showPhotos ? '<span class="rlw-av">' + initial + (o.showGoogleBadge ? '<span class="rlw-badge">' + G + "</span>" : "") + "</span>" : "";
      const corner = !o.showPhotos && o.showGoogleBadge ? '<span class="rlw-corner">' + G + "</span>" : "";
      return (
        '<article class="rlw-card">' +
        corner +
        '<div class="rlw-top">' +
        avatar +
        '<div class="rlw-who"><p class="rlw-author">' +
        esc(r.author) +
        (o.showVerified ? check : "") +
        "</p>" +
        (o.showDate ? '<p class="rlw-date">' + ago(r.date) + "</p>" : "") +
        '</div></div><div class="rlw-rate">' +
        stars(r.rating) +
        "</div>" +
        (r.text ? '<p class="rlw-text">' + esc(r.text) + "</p>" : "") +
        "</article>"
      );
    })
    .join("");

  const more = o.loadMore && visible.length < list.length ? '<div class="rlw-more"><button type="button" data-rlw-more>Load more reviews</button></div>' : "";
  const foot = o.branding ? '<div class="rlw-foot"><a href="https://ranklit.com" target="_blank" rel="noopener">✨ Powered by Ranklit</a></div>' : "";

  return (
    "<style>" +
    css +
    '</style><div class="rlw">' +
    head +
    (visible.length ? '<div class="rlw-grid">' + cards + "</div>" : '<div class="rlw-empty">No reviews to show yet.</div>') +
    more +
    foot +
    "</div>"
  );
}

/** How many cards to show before "Load more" is pressed, and how many each press adds. */
export function widgetPageSize(o: Pick<WidgetOptions, "layout" | "columns">) {
  return o.layout === "list" ? 3 : Math.max(1, Math.min(4, o.columns)) * 2;
}
