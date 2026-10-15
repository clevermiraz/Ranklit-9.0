import { renderWidget, widgetPageSize } from "@/components/app/reviews/widget-render";

/*
 * Embeddable review widget. Customers paste:
 *   <div id="ranklit-reviews"></div>
 *   <script src="https://app.ranklit.com/api/embed/widget.js" data-location="<business id>" data-target="#ranklit-reviews" … async></script>
 * The script fetches /api/embed/reviews and renders into a shadow root so site CSS can't leak in.
 */
const SOURCE = `/* Ranklit review widget */
(function () {
  "use strict";
  var render = ${renderWidget.toString()};
  var pageSize = ${widgetPageSize.toString()};

  function bool(v, d) { return v == null || v === "" ? d : v !== "false" && v !== "0"; }
  function num(v, d) { var n = parseInt(v, 10); return isNaN(n) ? d : n; }

  function init(s) {
    if (!s || s.__rlw) return;
    s.__rlw = true;
    var d = s.dataset || {};
    if (!d.location) { console.warn("[Ranklit] data-location is missing on the widget script."); return; }
    var base;
    try { base = new URL(s.src, location.href).origin; } catch (e) { base = ""; }
    var host = d.target ? document.querySelector(d.target) : null;
    if (!host) { host = document.createElement("div"); s.parentNode.insertBefore(host, s); }
    var root = host.attachShadow ? (host.shadowRoot || host.attachShadow({ mode: "open" })) : host;
    var o = {
      limit: Math.max(1, Math.min(50, num(d.limit, 12))),
      minRating: Math.max(1, Math.min(5, num(d.minRating, 4))),
      layout: d.layout === "list" ? "list" : "grid",
      columns: Math.max(1, Math.min(4, num(d.columns, 3))),
      theme: d.theme === "dark" ? "dark" : "light",
      accent: d.accent || "#1a73e8",
      corners: d.corners === "sharp" || d.corners === "extra" ? d.corners : "rounded",
      cardStyle: d.cardStyle === "outline" || d.cardStyle === "flat" ? d.cardStyle : "shadow",
      showPhotos: bool(d.showPhotos, true),
      showVerified: bool(d.showVerified, true),
      showGoogleBadge: bool(d.showGoogleBadge, true),
      showDate: bool(d.showDate, true),
      showHeader: bool(d.showHeader, true),
      showName: bool(d.showName, true),
      showCount: bool(d.showCount, true),
      showButton: bool(d.showButton, true),
      loadMore: bool(d.loadMore, true),
      branding: bool(d.branding, true)
    };
    root.innerHTML = '<div style="font:14px system-ui,sans-serif;color:#9ca3af;padding:16px">Loading reviews…</div>';
    var q = "?location=" + encodeURIComponent(d.location) + "&limit=" + o.limit + "&min-rating=" + o.minRating;
    fetch(base + "/api/embed/reviews" + q)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || data.error) { root.innerHTML = ""; console.warn("[Ranklit] " + ((data && data.error) || "Could not load reviews.")); return; }
        var step = pageSize(o);
        var shown = o.loadMore ? step : o.limit;
        function paint() {
          root.innerHTML = render(data, o, shown, Date.now());
          var more = root.querySelector("[data-rlw-more]");
          if (more) more.addEventListener("click", function () { shown += step; paint(); });
        }
        paint();
      })
      .catch(function () { root.innerHTML = ""; console.warn("[Ranklit] Could not load reviews."); });
  }

  if (document.currentScript) init(document.currentScript);
  var all = document.querySelectorAll('script[src*="/api/embed/widget.js"]');
  for (var i = 0; i < all.length; i++) init(all[i]);
})();
`;

export function GET() {
  return new Response(SOURCE, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
