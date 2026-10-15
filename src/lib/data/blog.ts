/**
 * Blog posts as typed data. Inline text supports two tiny markups:
 * `**bold**` and `[label](href)` (internal hrefs start with "/").
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "callout"; label?: string; text: string }
  | { type: "quote"; text: string; cite?: string };

export type Post = {
  slug: string;
  title: string;
  /** ~150-180 chars, used on cards and as meta description */
  excerpt: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  tags: string[];
  /** opening paragraphs before the TL;DR */
  intro: string[];
  tldr: string[];
  /** inline split CTA shown after the TL;DR */
  cta: { title: string; text: string };
  body: Block[];
  faqs: { q: string; a: string }[];
  recommended: { label: string; href: string }[];
};

const posts: Post[] = [
{
    slug: "local-seo-audit-checklist",
    title: "Local SEO Audit Checklist: Find the Gaps That Cost You Calls",
    excerpt:
      "A step-by-step local SEO audit for small businesses: check your Google Business Profile, reviews, citations, site and rankings, then fix what matters most first.",
    date: "2026-10-13",
    tags: ["local seo audit", "local seo", "google business profile", "citations", "reviews", "rank tracking", "local seo checklist", "google maps ranking"],
    intro: [
      "Most local businesses don't lose map rankings because of one big mistake. They lose them to a pile of small ones: a duplicate listing nobody remembers creating, an old phone number on a directory, a location page that Google can't crawl, a review left unanswered for three months. Each gap is minor on its own. Together they quietly hand calls to the shop down the road.",
      "A proper audit finds those gaps in one sitting and ranks them by how much they hurt. This checklist walks through the seven areas we check for every new Ranklit customer, in the order we check them, with a simple way to decide what to fix first.",
    ],
    tldr: [
      "Start with your Google Business Profile, because it is the single biggest lever for map pack visibility.",
      "Check review volume, recency and reply speed, not just your star rating.",
      "Make your business name, address and phone number identical everywhere, and remove duplicate listings before anything else.",
      "Give every location or service area a real, crawlable page with matching contact details and LocalBusiness schema.",
      "Measure rankings across a grid of points in your service area, because a single search from your office tells you almost nothing.",
    ],
    cta: {
      title: "Turn Your Audit Into Finished Work",
      text: "Ranklit audits your Google Business Profile, fixes listings, replies to reviews and tracks your map rank every week, so findings don't sit in a spreadsheet.",
    },
    body: [
      { type: "h2", text: "1. Google Business Profile: verify, complete and clean up" },
      {
        type: "p",
        text: "Your [Google Business Profile](https://support.google.com/business/answer/3038177) is the first thing Google looks at when deciding who shows up in the map pack, so it is the first thing you audit. Before you touch categories or photos, confirm two things: the profile is verified, and it is the only profile for that location. Duplicates split your reviews and signals, and they are the most common reason verification gets stuck.",
      },
      { type: "p", text: "Then work through the fields in this order:" },
      {
        type: "ul",
        items: [
          "**Business name** matches your signage and legal name, with no extra keywords or city names added.",
          "**Primary category** describes your core service. Check which category the top three competitors use.",
          "**Secondary categories** cover the other services you genuinely offer, and nothing you don't.",
          "**Address or service area** is accurate, and the service area reflects where you actually send staff.",
          "**Hours** are correct, including holiday hours for the next few months.",
          "**Services, products, attributes and photos** are filled in, with fresh photos added at least monthly.",
        ],
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "If verification shows as pending for more than a week, search Google Maps for your phone number. A forgotten duplicate listing is usually the culprit.",
      },
      {
        type: "p",
        text: "Our free [Google Business Profile Optimizer](/tools/google-business-profile-optimizer) flags missing fields and weak categories in about a minute, which is a handy baseline before you start editing.",
      },
      { type: "h2", text: "2. Reviews and reputation: volume, recency and replies" },
      {
        type: "p",
        text: "Reviews do double duty. They feed Google's sense of how prominent you are, and they are what customers read before deciding to call. A 4.8 average means little if the newest review is from last year, so look at the full picture.",
      },
      {
        type: "ol",
        items: [
          "Count total reviews and compare against the top three businesses ranking for your main keyword.",
          "Check recency: how many reviews arrived in the last 30 and 90 days?",
          "Measure reply rate and speed. Aim to reply to every review within two business days.",
          "Read your replies. Generic \"thanks for your feedback\" responses on every review look automated and earn no trust.",
          "Look for suspicious patterns, such as bursts of five-star reviews from empty accounts, and report them rather than arguing in public.",
        ],
      },
      {
        type: "p",
        text: "If review volume is the gap, the fix is a steady request routine, not a one-off campaign. Our guide to [review request emails](/blog/review-request-email) has templates and timing that stay inside Google's rules.",
      },
      { type: "h2", text: "3. Citations: make your NAP identical everywhere" },
      {
        type: "p",
        text: "Your name, address and phone number (NAP) appear on dozens of directories, maps apps and data aggregators. When they disagree, search engines are less sure which details are right, and customers sometimes call a number that no longer works.",
      },
      {
        type: "ol",
        items: [
          "Search for your business name, old addresses and old phone numbers to build a list of existing listings.",
          "Use your verified Google Business Profile as the source of truth for every field.",
          "Remove or merge duplicates and listings for closed or moved locations first.",
          "Fix mismatches on the biggest directories, then work down to niche and local sites.",
          "Confirm your website footer, contact page and schema use exactly the same details.",
        ],
      },
      {
        type: "p",
        text: "The [Citation Consistency Analyzer](/tools/citation-consistency-analyzer) speeds this up by showing mismatches side by side. For the full cleanup process, see [NAP citation cleanup](/blog/nap-citation-cleanup).",
      },
      { type: "h2", text: "4. Website and location pages: give Google something to trust" },
      {
        type: "p",
        text: "Your profile links to your website, and Google uses that site to confirm what you do and where. Thin or missing location pages are one of the most common gaps we see, especially for multi-location and service area businesses.",
      },
      { type: "h3", text: "On-page checks" },
      {
        type: "ul",
        items: [
          "Each location or core service area has its own page with unique, useful content, not a copy with the city name swapped.",
          "Title tags and H1s mention the service and the city naturally.",
          "Name, address, phone number and a map or directions sit visibly on the page.",
          "Internal links connect service pages to the relevant location pages.",
        ],
      },
      { type: "h3", text: "Technical checks" },
      {
        type: "ul",
        items: [
          "Pages load quickly on a phone and have a tap-to-call button above the fold.",
          "Location pages are indexable, in the sitemap, and their canonical tags point to themselves.",
          "LocalBusiness structured data validates in Google's [Rich Results Test](https://search.google.com/test/rich-results) and matches your profile.",
        ],
      },
      {
        type: "p",
        text: "If you serve customers at their address, read our guide to [service area pages](/blog/service-area-pages) before creating dozens of near-identical city pages.",
      },
      { type: "h2", text: "5. Rankings: measure across your whole service area" },
      {
        type: "p",
        text: "Local results change street by street. A search from your desk will almost always show you near the top, because you are standing next to your own pin. Customers three miles away may not see you at all.",
      },
      {
        type: "p",
        text: "Pick 10 to 20 keywords customers actually use, then check them across a grid of points that covers your service area. The pattern matters more than any single number: strong in the middle and weak at the edges is a proximity problem, while weak everywhere usually points to relevance or profile issues. Our explainer on [geo-grids](/blog/what-is-geo-grid) covers how to set the grid up.",
      },
      { type: "h2", text: "6. Prioritize: impact versus effort" },
      {
        type: "p",
        text: "An audit usually turns up 20 or more issues. Trying to fix them all at once is how audits end up abandoned. Sort them into quick wins, medium projects and long-term work, and start at the top.",
      },
      {
        type: "table",
        head: ["Priority", "Example fixes", "Effort", "Timeline"],
        rows: [
          ["Quick win", "Fill missing profile fields, correct hours, upload new photos", "Low", "1-3 days"],
          ["Quick win", "Rewrite title tags and meta descriptions on location pages", "Low", "1 week"],
          ["Medium project", "Clean up duplicate and mismatched citations, set up a review reply routine", "Medium", "2-4 weeks"],
          ["Medium project", "Add LocalBusiness schema and fix crawl or indexing errors", "Medium", "2-4 weeks"],
          ["Long-term", "Earn local links, build out location and service pages", "High", "2-3 months"],
        ],
        caption: "A simple way to order audit findings so the highest-impact work ships first.",
      },
      {
        type: "p",
        text: "Re-run the audit every quarter. Profiles get edited by users, directories pull in old data and competitors change their categories, so a clean audit today drifts within months. The [Local SEO Checklist Tool](/tools/local-seo-checklist-tool) is a quick way to track progress between full audits.",
      },
      { type: "h2", text: "7. Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit runs most of this checklist for you on a schedule. It audits your Google Business Profile, keeps listings consistent, drafts specific replies to new reviews and scans your rankings across a grid every week, so you see which neighborhoods are improving and which need work.",
      },
      {
        type: "p",
        text: "If you'd rather do the audit yourself, start with the free [Local SEO Audit Tool](/tools/local-seo-audit-tool). If you'd rather have it done and kept done, [see our plans](/pricing).",
      },
    ],
    faqs: [
      {
        q: "What should a local SEO audit include?",
        a: "At minimum: your Google Business Profile, reviews, citations, website and location pages, technical health and rankings measured across your service area. Finish by sorting findings into an impact-versus-effort plan so the important fixes actually happen.",
      },
      {
        q: "How often should I audit my local SEO?",
        a: "Run a full audit once a quarter and a quick profile and review check every month. Profiles can be edited by the public and directories refresh their data, so problems creep back even after a clean audit.",
      },
      {
        q: "Can I do a local SEO audit myself?",
        a: "Yes. Everything in this checklist can be done by hand with free tools, it just takes a few hours. Software like Ranklit mainly saves time on citation checks and grid-based rank tracking, which are slow to do manually.",
      },
    ],
    recommended: [
      { label: "Local SEO Audit Tool", href: "/tools/local-seo-audit-tool" },
      { label: "Local SEO Checklist Tool", href: "/tools/local-seo-checklist-tool" },
      { label: "NAP Citation Cleanup Guide", href: "/blog/nap-citation-cleanup" },
      { label: "What Is a Geo-Grid?", href: "/blog/what-is-geo-grid" },
    ],
  },
  {
    slug: "review-schema-guide",
    title: "Review Schema for Local Businesses: What Google Will and Won't Show",
    excerpt:
      "Review schema can be perfectly valid and still never earn stars in search. Learn Google's eligibility rules, the markup that works, and the mistakes to avoid.",
    date: "2026-10-12",
    tags: ["schema markup", "reviews", "local seo", "structured data", "review stars", "technical seo"],
    intro: [
      "Gold stars next to a search result are hard to miss, so it's no surprise that review schema is one of the most requested website tweaks we hear about. The catch is that adding the markup and getting the stars are two different things. Your code can pass every validator and Google can still choose not to show it.",
      "This guide explains what review schema is, when Google is willing to display it for a local business, what to mark up instead when it isn't, and the errors that get markup ignored or flagged.",
    ],
    tldr: [
      "Review schema describes reviews and ratings in a format search engines can read, using Review and AggregateRating types from schema.org.",
      "Google does not show review stars for a business reviewing itself on its own site, which rules out most LocalBusiness pages.",
      "Stars are still possible for eligible types such as products, recipes, courses or software, when reviews are genuine and visible on the page.",
      "Never mark up reviews that aren't shown on the page, and never copy in your Google reviews as if they were your own.",
      "For local rankings, your Google Business Profile reviews matter far more than on-site review markup.",
    ],
    cta: {
      title: "Let Your Real Reviews Do the Work",
      text: "Ranklit drafts thoughtful replies to new Google reviews and helps you request more, so the reviews that actually move map rankings keep coming.",
    },
    body: [
      { type: "h2", text: "What review schema actually is" },
      {
        type: "p",
        text: "Schema markup is a block of structured data, usually JSON-LD, that labels the content on a page so machines can understand it. For reviews, two types do most of the work: **Review**, which describes a single review with an author and rating, and **AggregateRating**, which summarizes many reviews into an average score and a count. Both are defined on [schema.org](https://schema.org/AggregateRating).",
      },
      {
        type: "p",
        text: "Schema.org defines what is valid. Google then decides, separately, which valid markup is eligible for rich results like stars. That gap between \"valid\" and \"eligible\" is where most confusion comes from.",
      },
      { type: "h2", text: "The self-serving review rule" },
      {
        type: "p",
        text: "Google's [review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) say it won't show stars for reviews that a business collects and publishes about itself, when those reviews are marked up on a LocalBusiness or Organization. In plain terms: a plumber's homepage with an AggregateRating of their own services will not get stars, no matter how clean the code is.",
      },
      {
        type: "p",
        text: "The reasoning is trust. A business choosing which of its own reviews to display and summarize is not an independent signal. Third-party review sites can show ratings because they are reviewing someone else.",
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "If an agency or plugin promises review stars for your local business homepage, ask which item type they are marking up. If the answer is LocalBusiness, the stars will not appear.",
      },
      { type: "h2", text: "When stars are still possible" },
      {
        type: "p",
        text: "Local businesses aren't locked out entirely. If you sell products, run courses or publish software on your site, those item types can still earn review snippets when the reviews are real and shown on the same page.",
      },
      {
        type: "table",
        head: ["Item type", "Eligible for stars?", "Typical local example"],
        rows: [
          ["LocalBusiness (self-reviewed)", "No", "Dental practice homepage showing its own ratings"],
          ["Organization (self-reviewed)", "No", "Roofing company about page"],
          ["Product", "Yes, with genuine on-page reviews", "Garden center selling plants online"],
          ["Course", "Yes", "Driving school selling a defensive driving course"],
          ["Recipe", "Yes", "Bakery publishing recipes on its blog"],
          ["SoftwareApplication", "Yes", "Booking app built by a salon chain"],
        ],
        caption: "Eligibility summary based on Google's published review snippet guidelines.",
      },
      { type: "h2", text: "What to mark up on a local business site instead" },
      {
        type: "p",
        text: "Even without stars, structured data is worth having. It helps search engines connect your website to your business entity and confirms details that should match your profile.",
      },
      {
        type: "ul",
        items: [
          "**LocalBusiness** (or a more specific subtype like Dentist or Plumber) with name, address, phone, hours, geo coordinates and URL.",
          "**areaServed** for service area businesses, listing the cities or regions you cover.",
          "**sameAs** links to your Google Business Profile, Facebook page and major directory listings.",
          "**Service** or **OfferCatalog** entries for your main services.",
          "**FAQPage** markup only where the FAQ is genuinely visible on the page.",
        ],
      },
      {
        type: "p",
        text: "Keep the name, address and phone in your schema identical to your profile and citations. Our [Citation Consistency Analyzer](/tools/citation-consistency-analyzer) is a quick way to spot mismatches.",
      },
      { type: "h2", text: "Common review schema mistakes" },
      {
        type: "ol",
        items: [
          "**Marking up reviews that aren't on the page.** Every rating in your markup must be visible to visitors.",
          "**Copying Google reviews into your schema.** Those reviews belong to Google's platform, not your site, and republishing them as your own markup breaks the guidelines.",
          "**Hard-coding an aggregate rating.** A rating that never changes while new reviews arrive is a red flag.",
          "**Wrong item reviewed.** The itemReviewed must be the specific product or course, not the whole company.",
          "**Leaving stale plugin markup.** Old theme or plugin code often adds a second, conflicting LocalBusiness block.",
        ],
      },
      {
        type: "p",
        text: "Markup that misleads users can trigger a manual action in Search Console, which removes rich results across the site. Fixing it is easy; noticing it is the hard part, so check the Enhancements reports monthly.",
      },
      { type: "h2", text: "How to test and monitor your markup" },
      {
        type: "p",
        text: "Treat structured data like any other part of your site: test it when it changes and check on it regularly. A theme update, a new plugin or a redesign can quietly remove or duplicate markup, and you won't notice until the rich results are already gone.",
      },
      {
        type: "ol",
        items: [
          "Paste the page URL into Google's [Rich Results Test](https://search.google.com/test/rich-results) and confirm which items Google detects and whether they are eligible.",
          "Run the same URL through the Schema Markup Validator to catch errors in types Google doesn't show as rich results.",
          "View the page source and search for \"application/ld+json\" to make sure there is only one LocalBusiness block.",
          "In Search Console, open the Enhancements section and note any new warnings after site changes.",
          "Compare the name, address, phone and hours in your markup against your Google Business Profile every quarter.",
        ],
      },
      {
        type: "p",
        text: "Valid but ineligible markup isn't harmful. If a validator shows your LocalBusiness AggregateRating as valid but Google never shows stars, the code is fine; it simply isn't a type Google displays. The real risk is misleading markup, such as ratings that don't appear on the page or reviews you didn't collect.",
      },
      {
        type: "quote",
        text: "The goal of structured data is to describe what's already on the page, honestly. If the markup claims something a visitor can't see, it's a liability, not an asset.",
      },
      {
        type: "p",
        text: "If you're cleaning up a site with years of plugins layered on top of each other, it often helps to strip all review markup first, then add back only what's eligible and accurate. Our [Local SEO Audit Tool](/tools/local-seo-audit-tool) checks for common structured data issues as part of a wider site review.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "For local rankings, the reviews that count are the ones on your Google Business Profile. Ranklit helps you earn more of them and replies to each one with a specific, human-sounding response, while weekly [rank tracking](/rank-tracker) shows whether that work is lifting you in the map pack.",
      },
      {
        type: "p",
        text: "Want a quick read on your review position against competitors? Try the [Review Score Estimator](/tools/local-business-review-score-estimator), or [see our plans](/pricing) to hand the whole thing off.",
      },
    ],
    faqs: [
      {
        q: "Will review schema help my business rank higher in Google Maps?",
        a: "Not directly. Map pack rankings lean on your Google Business Profile, reviews on that profile, proximity and relevance. Review markup on your website mostly affects how regular search results look, and only for eligible item types.",
      },
      {
        q: "Can I show my Google reviews on my website?",
        a: "You can embed or link to them using Google's own widgets or a properly licensed tool. What you shouldn't do is paste them into your own review schema as if they were collected on your site.",
      },
      {
        q: "Why did my review stars disappear from search results?",
        a: "Usually because the markup describes self-serving reviews on a LocalBusiness or Organization, or because Google changed which types it shows. Check Search Console's enhancement reports for warnings or a manual action.",
      },
    ],
    recommended: [
      { label: "Review Request Emails That Stay Within the Rules", href: "/blog/review-request-email" },
      { label: "Local Business Review Score Estimator", href: "/tools/local-business-review-score-estimator" },
      { label: "Local SEO Audit Checklist", href: "/blog/local-seo-audit-checklist" },
      { label: "Citation Consistency Analyzer", href: "/tools/citation-consistency-analyzer" },
    ],
  },
  {
    slug: "proximity-in-local-seo",
    title: "Proximity in Local SEO: How Distance Shapes Your Map Rankings",
    excerpt:
      "Distance from the searcher is the one ranking factor you can't edit. Here's how proximity works, how far your reach really extends, and how to rank beyond your block.",
    date: "2026-10-10",
    tags: ["google maps ranking", "local seo", "proximity", "rank tracking", "geo-grid", "service area"],
    intro: [
      "Ask any business owner why a competitor outranks them on Google Maps and you'll hear plenty of theories. Often the real answer is simpler: the competitor is closer to the person searching. Proximity is one of the three pillars Google names for local results, alongside relevance and prominence, and it is the only one you can't change by editing your profile.",
      "You can, however, understand it, measure it and stop it from capping your growth. This guide explains how distance affects rankings, why the effect varies by industry, and what actually stretches your reach.",
    ],
    tldr: [
      "Google ranks local results on relevance, distance and prominence, and distance is measured from the searcher, not from the city center.",
      "How far your visibility stretches depends heavily on your category and how many competitors sit nearby.",
      "Checking rankings from one spot hides proximity effects, so measure across a grid of points.",
      "You can't move your pin, but stronger relevance and prominence push your visible radius outward.",
      "Fake addresses and virtual offices to gain proximity break Google's guidelines and often lead to suspension.",
    ],
    cta: {
      title: "See Exactly How Far Your Reach Goes",
      text: "Ranklit scans your rankings across a grid of your service area every week, so you can see where distance holds you back and where you're winning.",
    },
    body: [
      { type: "h2", text: "What proximity means to Google" },
      {
        type: "p",
        text: "Google's own explanation of [how local results are ranked](https://support.google.com/business/answer/7091) lists three factors: relevance, distance and prominence. Distance is how far each business is from the location of the search. If someone types a city name, Google uses that; otherwise it uses whatever it knows about where the searcher is standing.",
      },
      {
        type: "p",
        text: "That means there is no single ranking for \"plumber near me\". There are thousands of them, one for every spot in town. A business can be first at the corner of its own street and invisible two miles away.",
      },
      { type: "h2", text: "Why the radius changes by industry" },
      {
        type: "p",
        text: "How quickly rankings fade with distance depends on how people search and how crowded the category is. Dense categories like restaurants or dentists in a city center fade fast, because there is always another option close by. Sparse categories like specialty contractors can rank across a whole metro area.",
      },
      {
        type: "table",
        head: ["Category", "Competitor density", "Typical visible radius", "What that means"],
        rows: [
          ["Coffee shop (downtown)", "Very high", "Under 1 mile", "Win the blocks around you"],
          ["Dentist (suburb)", "High", "1-3 miles", "Strong profile needed to reach neighboring suburbs"],
          ["Plumber", "Medium", "3-8 miles", "Relevance and reviews extend reach noticeably"],
          ["Roofer", "Medium-low", "5-15 miles", "Good profiles can cover much of a metro"],
          ["Specialty contractor", "Low", "10+ miles", "Few competitors, so distance matters less"],
        ],
        caption: "Illustrative ranges only. Your real radius depends on your market, so measure it.",
      },
      {
        type: "p",
        text: "Our [Google Maps Distance Calculator](/tools/google-maps-distance-calculator) helps you sanity-check how far your key neighborhoods sit from your pin before you set goals.",
      },
      { type: "h2", text: "How to measure proximity effects" },
      {
        type: "p",
        text: "You can't see proximity by searching from your own phone, because you are usually standing at the business. Instead, check rankings from a grid of points laid over your service area. The result is a heatmap that shows exactly where you rank well and where you drop off.",
      },
      {
        type: "ol",
        items: [
          "Pick three to five core keywords customers actually use.",
          "Lay a grid over your service area, for example 7 x 7 points spaced half a mile to a mile apart.",
          "Record your rank at every point for each keyword.",
          "Look for the \"cliff\": the distance where you fall from the top three to outside the top ten.",
          "Repeat monthly so you can see whether that cliff moves outward.",
        ],
      },
      {
        type: "p",
        text: "For a deeper walkthrough, read [What Is a Geo-Grid?](/blog/what-is-geo-grid) and [heatmap rank tracking](/blog/heatmap-rank-tracking).",
      },
      { type: "h2", text: "What actually extends your reach" },
      {
        type: "p",
        text: "Distance is fixed, but it is weighed against everything else. The stronger your relevance and prominence, the further away you can still beat closer competitors.",
      },
      { type: "h3", text: "Relevance levers" },
      {
        type: "ul",
        items: [
          "A precise primary category and accurate secondary categories.",
          "Services listed in your profile with clear, plain descriptions.",
          "Location and service pages on your website that mention the areas you serve.",
        ],
      },
      { type: "h3", text: "Prominence levers" },
      {
        type: "ul",
        items: [
          "A steady flow of fresh reviews with specific replies.",
          "Consistent citations on directories that matter for your industry.",
          "Local links from chambers, sponsorships, suppliers and community sites. See [local link building](/blog/local-link-building).",
        ],
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Focus on the ring just beyond your cliff. Moving from position 8 to position 3 in nearby neighborhoods adds far more calls than chasing a top spot 20 miles away.",
      },
      { type: "h2", text: "Proximity shortcuts to avoid" },
      {
        type: "p",
        text: "Because distance matters so much, some businesses try to fake it. Virtual offices, mailbox addresses and listings at a relative's house are all against Google's guidelines for representing your business. They often work briefly and then end in a suspension that wipes out every review and ranking the profile had earned.",
      },
      {
        type: "p",
        text: "If you genuinely serve customers across a wide area without a storefront in each town, set yourself up as a service area business and build strong [service area pages](/blog/service-area-pages) instead.",
      },
      { type: "h2", text: "Proximity for service area and multi-location businesses" },
      {
        type: "p",
        text: "Service area businesses hide their address, but Google still knows where the business is based and uses that point for distance. Listing 20 towns in your service area tells customers where you work; it doesn't make Google treat you as if you were located in each of them.",
      },
      {
        type: "p",
        text: "That's why a plumber based on the north side of a city often ranks well up north and struggles in the south, even with the whole city listed as a service area. The fix is the same as for any business: strengthen relevance and prominence, then support distant areas with useful pages on your website, where organic results can reach further than the map pack.",
      },
      { type: "h3", text: "When a second location makes sense" },
      {
        type: "p",
        text: "If you have real staff and a real office in another part of town, a second verified profile is legitimate and can transform rankings there. It needs its own address, its own phone number where possible, and staff present during stated hours. It should never be a mailbox or a desk you visit once a month.",
      },
      {
        type: "ul",
        items: [
          "Give each location its own page on your website, linked from its profile.",
          "Collect reviews for each location separately rather than pointing everyone to the main branch.",
          "Track each location on its own grid so you can see where their footprints overlap.",
        ],
      },
      {
        type: "p",
        text: "For multi-location brands, overlapping footprints are worth watching. Two of your own locations competing for the same neighborhood is wasted effort; it's usually better to sharpen each one's focus on its own surrounding area.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit's [rank tracker](/rank-tracker) scans a grid across your service area every week and shows the result as a heatmap, so you can watch your visible radius grow. In the background, it works on the levers that push that radius outward: profile relevance, review replies and consistent citations.",
      },
      {
        type: "p",
        text: "Curious where you stand today? Run a free [Google Maps Visibility Score](/tools/google-maps-visibility-score-calculator) check, or [see plans](/pricing) to start weekly scans.",
      },
    ],
    faqs: [
      {
        q: "Can I rank in a city where I don't have an address?",
        a: "Yes, but usually not at the top of the map pack in the middle of that city if competitors are based there. Strong relevance and prominence can get you visible in nearby areas, and organic location pages can rank where the map pack is out of reach.",
      },
      {
        q: "Does moving my pin or changing my address improve rankings?",
        a: "Only if you genuinely move. Editing your address to a spot you don't operate from breaks Google's guidelines and risks suspension, which costs far more than it gains.",
      },
      {
        q: "How far apart should grid points be when measuring proximity?",
        a: "For dense urban categories, a quarter to half a mile works well. For trades covering a metro area, one to two miles is usually enough to see the pattern.",
      },
    ],
    recommended: [
      { label: "Google Maps Distance Calculator", href: "/tools/google-maps-distance-calculator" },
      { label: "What Is a Geo-Grid?", href: "/blog/what-is-geo-grid" },
      { label: "Heatmap Rank Tracking", href: "/blog/heatmap-rank-tracking" },
      { label: "Google Maps Visibility Score Calculator", href: "/tools/google-maps-visibility-score-calculator" },
    ],
  },
  {
    slug: "heatmap-rank-tracking",
    title: "Heatmap Rank Tracking: Find Weak Zones Before Competitors Do",
    excerpt:
      "Heatmap rank tracking shows where you rank across your whole service area, not just at your front door. Learn how to set it up, read it and act on weak zones.",
    date: "2026-10-08",
    tags: ["rank tracking", "google maps ranking", "agencies", "geo-grid", "local seo", "heatmap"],
    intro: [
      "Traditional rank tracking gives you one number per keyword. For local search, that number is close to meaningless, because map rankings change every few blocks. A business can sit at position one near its office and position fifteen across town, and a single-point tracker will only ever report the good news.",
      "Heatmap rank tracking fixes that by checking rankings from many points across your service area and coloring each one by position. This guide covers how to set up a useful heatmap, how often to scan, how to read the patterns, and how to turn weak zones into a plan.",
    ],
    tldr: [
      "A rank heatmap checks one keyword from a grid of locations and colors each point by your position.",
      "Grid size and spacing should match how far customers actually travel to you or you travel to them.",
      "Monthly or weekly scans are enough for most businesses; daily scans mostly add noise.",
      "Read the pattern, not single dots: edge fade points to proximity, scattered gaps point to relevance or profile issues.",
      "Pair heatmaps with Google Business Profile calls and direction requests to see whether ranking gains are earning business.",
    ],
    cta: {
      title: "Get a Weekly Heatmap Without the Setup",
      text: "Ranklit scans your keywords across a grid of your service area every week and turns weak zones into a clear, prioritized task list.",
    },
    body: [
      { type: "h2", text: "What a rank heatmap shows" },
      {
        type: "p",
        text: "A heatmap starts with a grid laid over a map, say 7 x 7 or 9 x 9 points. At each point, a search is run as if the customer were standing there, and your position is recorded. Green dots mean you're in the top three, amber means you're on the first page but lower, and red means you're buried or missing.",
      },
      {
        type: "p",
        text: "Seen together, those dots show your real footprint. You stop asking \"what's my rank?\" and start asking \"where am I losing customers?\", which is a much more useful question. If grids are new to you, start with [What Is a Geo-Grid?](/blog/what-is-geo-grid).",
      },
      { type: "h2", text: "Setting up a useful grid" },
      {
        type: "p",
        text: "The two decisions that matter are size and spacing. Too tight and you only measure your own street. Too wide and most of the grid is somewhere you'd never get a customer from.",
      },
      {
        type: "table",
        head: ["Business type", "Suggested grid", "Point spacing", "Covers roughly"],
        rows: [
          ["Storefront in a dense city", "7 x 7", "0.25-0.5 mi", "1.5-3 mi across"],
          ["Suburban practice or clinic", "7 x 7", "0.5-1 mi", "3-6 mi across"],
          ["Home service trade", "9 x 9", "1-1.5 mi", "8-12 mi across"],
          ["Metro-wide contractor", "9 x 9 or 13 x 13", "1.5-2.5 mi", "12-30 mi across"],
        ],
        caption: "Starting points. Adjust so the grid matches the area your customers actually come from.",
      },
      {
        type: "ul",
        items: [
          "Center the grid on your service area, not automatically on your office.",
          "Track three to five money keywords first, such as \"emergency plumber\" or \"dentist near me\".",
          "Keep grid size and spacing the same between scans so results are comparable.",
        ],
      },
      { type: "h2", text: "How often to scan" },
      {
        type: "p",
        text: "Map rankings wobble day to day. Scanning daily mostly captures noise and makes small fluctuations look like trends. For most local businesses, a weekly or monthly scan on a fixed day is enough to see real movement and judge whether changes are working.",
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Scan on the same weekday and at roughly the same time each cycle. It removes one more source of variation when you compare heatmaps side by side.",
      },
      { type: "h2", text: "Reading the patterns" },
      { type: "p", text: "Most heatmaps fall into a handful of shapes, and each one points to a different fix." },
      {
        type: "ol",
        items: [
          "**Green center, red edges:** classic proximity fade. Work on prominence (reviews, links, citations) to push the edge outward. See [proximity in local SEO](/blog/proximity-in-local-seo).",
          "**Red almost everywhere, even near you:** a relevance or profile problem. Check your primary category, business name and whether a duplicate listing is splitting signals.",
          "**Green on one side, red on the other:** a strong competitor sits on the red side. Study their categories, reviews and pages with the [Local Competitor Analysis Tool](/tools/local-competitor-analysis-tool).",
          "**Scattered red dots in a green area:** often noise or a pocket where Google merges you with a neighboring business. Watch it for another scan before acting.",
        ],
      },
      { type: "h2", text: "Turning weak zones into a plan" },
      {
        type: "p",
        text: "Once you know where you're weak, pick one zone at a time. For a neighborhood just outside your green area, the playbook is usually the same:",
      },
      {
        type: "ul",
        items: [
          "Make sure the area is listed in your service areas and mentioned on a relevant page of your website.",
          "Ask customers from that area for reviews, and mention the area naturally in your replies.",
          "Publish a photo or post about a job completed there.",
          "Look for a local link: a neighborhood association, school sponsorship or nearby supplier.",
        ],
      },
      {
        type: "p",
        text: "Then compare the next heatmap against the last one. Rankings are only half the story, so check your Google Business Profile calls and direction requests over the same period to confirm the gains are turning into customers.",
      },
      { type: "h2", text: "Metrics worth tracking alongside the map" },
      {
        type: "p",
        text: "A heatmap is a picture, and pictures are hard to compare over twelve months. Pull a few summary numbers from each scan so you can chart progress and spot trends at a glance.",
      },
      {
        type: "ul",
        items: [
          "**Top-3 share:** the percentage of grid points where you appear in the top three. This is the number that correlates most with calls.",
          "**Average rank:** your mean position across all points, counting \"not found\" as 21 or similar.",
          "**Found share:** the percentage of points where you appear at all in the top 20.",
          "**Edge distance:** how far from your pin you hold a top-three spot in each direction.",
        ],
      },
      {
        type: "p",
        text: "Track these per keyword. It's common to see one keyword improve while another slips, which usually means a competitor has strengthened their profile for that specific service. The [Local Ranking Calculator](/tools/local-ranking-calculator) is useful for quick what-if checks between scans.",
      },
      { type: "h3", text: "A note for agencies" },
      {
        type: "p",
        text: "Heatmaps are also the easiest way to show a client progress. A before-and-after grid makes a month of citation and review work visible in a way that a list of keyword positions never does.",
      },
      {
        type: "p",
        text: "Keep the reporting simple. One heatmap per core keyword, the top-3 share compared with last month, and two or three sentences on what you worked on and what you'll target next. Clients rarely read long reports, but they always look at the map.",
      },
      {
        type: "p",
        text: "It also helps to set expectations early. Grids rarely turn green everywhere, especially in crowded categories. A realistic goal is pushing the top-three area outward by a ring or two each quarter, and showing that the new green zones are producing calls.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit's [rank tracker](/rank-tracker) runs grid scans across your service area on a schedule and keeps every heatmap so you can compare any two dates. Weak zones feed straight into the agent's to-do list, so profile updates, review replies and citations target the places you're losing.",
      },
      {
        type: "p",
        text: "Want a free snapshot first? Try the [Local Search Visibility Analyzer](/tools/local-search-visibility-analyzer). Ready for weekly heatmaps? [See plans](/pricing).",
      },
    ],
    faqs: [
      {
        q: "What's the difference between heatmap and regular rank tracking?",
        a: "Regular tracking reports one position per keyword, usually from a single location. Heatmap tracking checks the same keyword from many points across your area, so you can see where you rank well and where you don't.",
      },
      {
        q: "How many keywords should I track on a heatmap?",
        a: "Start with three to five keywords that bring in paying customers. You can add more later, but a small set keeps scans affordable and the results easy to act on.",
      },
      {
        q: "Why do my heatmap results change from week to week?",
        a: "Local results shift as Google tests rankings, competitors update profiles and new reviews arrive. Look for trends across several scans rather than reacting to a single dot changing color.",
      },
    ],
    recommended: [
      { label: "Local Search Visibility Analyzer", href: "/tools/local-search-visibility-analyzer" },
      { label: "Proximity in Local SEO", href: "/blog/proximity-in-local-seo" },
      { label: "Which Local Keywords to Track", href: "/blog/track-local-keywords" },
      { label: "Local Competitor Analysis Tool", href: "/tools/local-competitor-analysis-tool" },
    ],
  },
{
    slug: "apple-maps-seo",
    title: "Apple Maps for Local Businesses: Claim, Verify and Rank in 60 Days",
    excerpt:
      "A step-by-step plan to claim your Apple Maps listing, get it verified, fill every field that matters, and start showing up for iPhone users searching nearby.",
    date: "2026-10-06",
    tags: ["local seo", "apple maps", "apple business connect", "google maps ranking", "citations", "reviews", "local seo audit"],
    intro: [
      "Most local businesses pour all of their effort into Google and forget that every iPhone ships with Apple Maps as the default navigation app. When someone asks Siri for a nearby locksmith or taps a pin in Apple Maps, your listing either shows up with the right hours and phone number, or it doesn't. Many owners have never even looked at theirs.",
      "The good news is that Apple Maps is far less crowded than Google. A clean, claimed listing with accurate details and a few good photos is often enough to beat competitors who never bothered. This guide walks through a realistic 60-day plan to get there.",
    ],
    tldr: [
      "Claim your listing for free in Apple Business Connect and verify ownership before editing anything else.",
      "Match your name, address, phone and hours exactly to your Google Business Profile so both platforms tell the same story.",
      "Pick the most specific category available and fill in photos, a logo and action links like booking or ordering.",
      "Apple pulls ratings from third-party review partners, so your Yelp and similar profiles matter more than you think.",
      "Re-check the listing every month, because data from outside sources can quietly overwrite your edits.",
    ],
    cta: {
      title: "Keep Every Map Listing in Sync",
      text: "Ranklit keeps your business details consistent across Google, Apple and the major directories, then tracks how your map visibility changes every week.",
    },
    body: [
      { type: "h2", text: "Why Apple Maps deserves an hour of your time" },
      {
        type: "p",
        text: "Apple Maps powers more than the Maps app. It feeds results to Siri, Spotlight search, CarPlay and the Wallet app, which means a single listing can appear in several places on an iPhone at once. For businesses that rely on drive-by or urgent searches, like towing, plumbing or late-night food, that reach adds up quickly.",
      },
      {
        type: "p",
        text: "Competition is also lighter. Plenty of local businesses still have an unclaimed Apple listing built from old directory data, often with outdated hours or a disconnected phone number. Fixing yours is a quick way to stand out without spending anything.",
      },
      {
        type: "table",
        head: ["", "Google Business Profile", "Apple Business Connect"],
        rows: [
          ["Cost", "Free", "Free"],
          ["Main surfaces", "Google Search, Google Maps", "Apple Maps, Siri, Spotlight, CarPlay"],
          ["Reviews", "Native Google reviews", "Ratings from partners plus Apple's own ratings"],
          ["Posts and updates", "Posts, offers, events", "Showcases for promotions"],
          ["Typical competition", "High", "Moderate to low"],
        ],
        caption: "How the two platforms compare for a typical local business.",
      },
      { type: "h2", text: "Week 1: claim and verify your listing" },
      {
        type: "p",
        text: "Head to [Apple Business Connect](https://businessconnect.apple.com) and sign in with an Apple Account that belongs to the business, not a personal one an employee might take with them. Search for your business by name and address. If a listing already exists, claim it. If not, create a new place card.",
      },
      {
        type: "ol",
        items: [
          "Create or sign in with a business-owned Apple Account.",
          "Search for your location and claim the existing listing, or add a new one.",
          "Choose a verification method: a phone call to the listed number or uploaded business documents.",
          "Wait for confirmation, which can take anywhere from a few minutes to several days.",
          "Add teammates or your agency as users so access never depends on one person.",
        ],
      },
      {
        type: "p",
        text: "If verification by phone fails, it usually means the number on the old listing is wrong. Switch to document verification and upload something that shows the business name and address together, such as a utility bill or business license.",
      },
      { type: "h2", text: "Weeks 2 to 3: complete every field that matters" },
      {
        type: "p",
        text: "Once you are verified, treat the listing the way you would treat your Google profile. Apple's ranking is driven by relevance, distance and how trustworthy your information looks, so empty fields work against you.",
      },
      { type: "h3", text: "The essentials" },
      {
        type: "ul",
        items: [
          "**Name:** your real-world business name, exactly as it appears on your sign, with no added keywords.",
          "**Category:** the most specific option that fits your main service, plus a few secondary ones.",
          "**Address and pin:** drag the map pin to your actual entrance so navigation ends at the right door.",
          "**Hours:** regular hours plus special hours for holidays and seasonal changes.",
          "**Phone and website:** the same number and URL you use on Google and your citations.",
        ],
      },
      { type: "h3", text: "The extras that win clicks" },
      {
        type: "p",
        text: "Upload a logo, a cover photo and several real photos of your storefront, team and work. Add action links for booking, ordering or getting a quote if your scheduling tool supports them. These small touches make your place card look active and cared for compared to a bare listing next to it.",
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Before you edit Apple, run your details through our [Citation Consistency Analyzer](/tools/citation-consistency-analyzer). Fixing mismatches everywhere at once stops old directory data from creeping back into your Apple listing later.",
      },
      { type: "h2", text: "Weeks 4 to 6: build trust signals" },
      {
        type: "p",
        text: "Apple Maps does not run its own written review system the way Google does. Instead, it shows ratings collected directly from Apple users after a visit and pulls review content from partner platforms such as Yelp and a handful of industry sites. That means a neglected Yelp profile can drag down how you look on an iPhone.",
      },
      {
        type: "ul",
        items: [
          "Claim and tidy your Yelp profile so its details match Apple and Google.",
          "Keep asking happy customers for reviews on the platforms you already use; a [simple, compliant review request email](/blog/review-request-email) does most of the work.",
          "Reply to reviews on partner sites, since those replies can be seen by people who tap through.",
          "Use Showcases to highlight a seasonal offer or new service for a few weeks at a time.",
        ],
      },
      {
        type: "p",
        text: "Consistent business details across the wider web also matter here. Apple cross-checks information from many data providers, and a clean citation profile gives it fewer reasons to doubt yours. Our guide to [cleaning up NAP citations](/blog/nap-citation-cleanup) covers the process in an afternoon.",
      },
      { type: "h2", text: "Weeks 7 to 8: check results and keep it fresh" },
      {
        type: "p",
        text: "Apple Business Connect includes basic insights showing how many people found your place card, tapped to call, asked for directions or visited your website. Compare the numbers from your first full month with the second. You are looking for steady growth in direction requests and calls, not a dramatic spike.",
      },
      {
        type: "p",
        text: "Search for your main services on an iPhone from a few different spots around your service area, too. Apple, like Google, weighs distance heavily, so you may rank well near your shop and disappear a few miles out. If that pattern looks familiar, read our explainer on [proximity in local SEO](/blog/proximity-in-local-seo).",
      },
      {
        type: "quote",
        text: "Set a recurring reminder to open your Apple listing once a month. It takes five minutes and catches the silent edits that cost you calls.",
      },
      { type: "h2", text: "Common mistakes that hold Apple listings back" },
      {
        type: "ul",
        items: [
          "Leaving a duplicate listing from an old address live, which splits ratings and confuses navigation.",
          "Using a call-tracking number on Apple but a different main number everywhere else.",
          "Forgetting holiday hours, which leads to frustrated customers and poor ratings.",
          "Claiming the listing with a personal Apple Account that leaves when an employee does.",
          "Treating Apple as set-and-forget while data partners keep pushing changes in the background.",
        ],
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit focuses on the work that moves both platforms at once: consistent citations across the directories Apple and Google both read, a fully optimized Google Business Profile, and steady review growth. Our [weekly rank tracker](/rank-tracker) shows where you appear on the map across your whole service area, so you can see whether the cleanup is paying off.",
      },
      {
        type: "p",
        text: "If you would rather hand off the ongoing upkeep, [see our plans](/pricing) and let the agent keep your listings accurate while you run the business.",
      },
    ],
    faqs: [
      {
        q: "Is Apple Business Connect free?",
        a: "Yes. Claiming, verifying and editing your Apple Maps listing through Apple Business Connect costs nothing. You only need an Apple Account and a way to prove you own or manage the business.",
      },
      {
        q: "How long does Apple Maps verification take?",
        a: "Phone verification can finish in minutes, while document checks may take a few business days. If it stalls, confirm the phone number on the listing is correct or switch to document verification.",
      },
      {
        q: "Do Google reviews show up on Apple Maps?",
        a: "No. Apple shows its own user ratings and pulls review content from partner sites such as Yelp. That is why keeping those partner profiles accurate and active helps your Apple listing.",
      },
    ],
    recommended: [
      { label: "Citation Consistency Analyzer", href: "/tools/citation-consistency-analyzer" },
      { label: "Local Citation Finder", href: "/tools/local-citation-finder" },
      { label: "NAP Consistency: Clean Up Your Citations", href: "/blog/nap-citation-cleanup" },
      { label: "Proximity in Local SEO", href: "/blog/proximity-in-local-seo" },
    ],
  },
  {
    slug: "local-link-building",
    title: "Local Link Building: 5 Steps That Actually Move Map Rankings",
    excerpt:
      "Skip the spammy link packages. Five practical steps to earn local links from chambers, suppliers, sponsors and press that strengthen your Google Maps rankings.",
    date: "2026-10-03",
    tags: ["local seo", "local link building", "google maps ranking", "citations", "backlinks", "agencies", "local seo audit"],
    intro: [
      "Links still matter for local rankings, but not in the way most link sellers pitch them. A thousand links from random blogs in other countries will not convince Google that you are the best roofer in your town. A dozen links from your chamber of commerce, local news site, suppliers and community groups often will.",
      "This guide breaks local link building into five steps you can actually finish, even if you only have a couple of hours a month. Each step builds on the last, and none of them require buying anything shady.",
    ],
    tldr: [
      "Local relevance beats raw authority: a link from a nearby organization usually helps more than a generic national directory.",
      "Start with a quick audit of the links you already have and the ones your top map competitors have.",
      "Lock in easy wins first: chambers, trade associations, suppliers and local directories.",
      "Earn the harder links with sponsorships, community involvement and genuinely useful local content.",
      "Track map rankings across your service area so you can tell which links actually moved the needle.",
    ],
    cta: {
      title: "Build Local Authority Without the Busywork",
      text: "Ranklit places citations on trusted platforms, optimizes your Google Business Profile and tracks map rankings weekly, so every link you earn gets measured.",
    },
    body: [
      { type: "h2", text: "Why local links work differently" },
      {
        type: "p",
        text: "Google describes local ranking as a mix of relevance, distance and prominence. Links feed into prominence, but for a local business the question Google is really asking is whether the local community vouches for you. Links from organizations in your area, or in your industry, answer that question directly.",
      },
      {
        type: "p",
        text: "That is why a link from a neighborhood association page that lists you as a member can outperform a link from a high-traffic site with no connection to your town or trade. Think of each link as a local reference, not a vote count.",
      },
      {
        type: "table",
        head: ["Link source", "Local relevance", "Effort", "Typical value"],
        rows: [
          ["Chamber of commerce or business association", "High", "Low", "Strong"],
          ["Supplier or manufacturer dealer pages", "Medium", "Low", "Strong"],
          ["Local news or community blogs", "High", "Medium", "Very strong"],
          ["Sponsorships (teams, events, charities)", "High", "Medium", "Strong"],
          ["Paid link packages from unknown sites", "None", "Low", "Risky"],
        ],
        caption: "Where local links usually come from, ranked by how much they tend to help.",
      },
      { type: "h2", text: "Step 1: audit what you have and what competitors have" },
      {
        type: "p",
        text: "Before chasing anything new, list the sites that already link to you. Free tools in Google Search Console show a sample under the Links report. Note which ones are local, which are industry-related and which look spammy or broken.",
      },
      {
        type: "p",
        text: "Then look at the businesses that beat you in the map pack. Our [Local Competitor Analysis Tool](/tools/local-competitor-analysis-tool) shows who is winning your keywords, and a quick look at their websites often reveals their associations, sponsors and supplier listings. If three competitors are all members of the same trade group and you are not, that is your first target.",
      },
      { type: "h2", text: "Step 2: lock in the easy, low-effort wins" },
      {
        type: "p",
        text: "Some links only need a form, a phone call or a membership fee you might already be paying. Work through these in a single afternoon:",
      },
      {
        type: "ol",
        items: [
          "Join or update your listing with the local chamber of commerce.",
          "Ask suppliers and manufacturers whether they list certified installers or dealers, and request a spot.",
          "Check trade associations and licensing bodies for member directories.",
          "Claim listings on the major citation sites using our [Local Citation Finder](/tools/local-citation-finder).",
          "Ask partners you refer work to, such as an electrician who works with your HVAC crew, for a reciprocal mention on a trusted partners page.",
        ],
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Use the exact business name, address and phone number from your Google Business Profile on every one of these pages. A link with mismatched details is still a link, but a matching one also counts as a clean citation.",
      },
      { type: "h2", text: "Step 3: earn links through the community" },
      {
        type: "p",
        text: "The most valuable local links usually come from being visibly involved in your area. Youth sports sponsorships, charity events, school fundraisers and neighborhood cleanups almost always come with a thank-you page or a sponsor list. Choose causes you actually care about and the links follow naturally.",
      },
      {
        type: "ul",
        items: [
          "Sponsor a local team or event and ask that the sponsor page link to your website.",
          "Offer a discount to members of a local nonprofit and ask them to mention it on their site.",
          "Host a free workshop, such as a homeowner maintenance class, and list it on community event calendars.",
          "Volunteer as a speaker for a local business group or trade school.",
        ],
      },
      { type: "h2", text: "Step 4: create something local sites want to reference" },
      {
        type: "p",
        text: "Local journalists and bloggers link to useful information. A short, data-backed piece, like the most common plumbing emergencies in your city by season or a cost guide for roof repairs in your county, gives them a reason to cite you. Keep it practical, add your own photos and offer quotes from your team.",
      },
      {
        type: "p",
        text: "Pitch it with a short, friendly email to the reporter who covers home, business or community news. Explain the local angle in one sentence and offer to answer questions. One placement in a local paper can do more than months of directory submissions.",
      },
      {
        type: "quote",
        text: "A good local link is one you would be happy for a customer to click. If you would be embarrassed by where it sits, it is not worth having.",
      },
      { type: "h2", text: "Step 5: measure the impact on map rankings" },
      {
        type: "p",
        text: "Links take weeks to be discovered and counted, so judge results on a monthly rhythm rather than daily. The clearest signal is how much of your service area shows you in the top three map results. A single pin check from your office will hide changes at the edges of your territory, which is where new authority often shows up first.",
      },
      {
        type: "p",
        text: "Run a grid scan before you start and again every few weeks. If you are new to the idea, our guide on [what a geo-grid is](/blog/what-is-geo-grid) explains how to read one. Keep a simple log of each link and the date it went live so you can line up wins with ranking changes.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit handles the foundation that makes local links pay off: hand-placed citations, a fully optimized Google Business Profile and consistent business details everywhere. Our [Google Maps rank tracker](/rank-tracker) scans your service area every week so you can see which efforts moved you up and where you still have gaps.",
      },
      {
        type: "p",
        text: "Agencies use the same setup to report link-building progress to clients in a format they understand. [Compare plans](/pricing) to see which one fits your locations.",
      },
    ],
    faqs: [
      {
        q: "How many local links do I need to rank on Google Maps?",
        a: "There is no fixed number. In many towns, a handful of relevant local links plus a strong Google Business Profile is enough to move up, while busy metro markets need more sustained effort.",
      },
      {
        q: "Are citations the same as backlinks?",
        a: "Not exactly. A citation is any mention of your name, address and phone number, linked or not, while a backlink is a clickable link to your site. Many directory listings count as both.",
      },
      {
        q: "Should I buy link packages for local SEO?",
        a: "No. Bulk link packages usually come from unrelated or low-quality sites that add little value and can put your site at risk. Spend the same budget on sponsorships or memberships that bring real local links.",
      },
    ],
    recommended: [
      { label: "Local Citation Finder", href: "/tools/local-citation-finder" },
      { label: "Local Competitor Analysis Tool", href: "/tools/local-competitor-analysis-tool" },
      { label: "What Is a Geo-Grid?", href: "/blog/what-is-geo-grid" },
      { label: "Local SEO Audit Checklist", href: "/blog/local-seo-audit-checklist" },
    ],
  },
  {
    slug: "track-local-keywords",
    title: "Which Local Keywords to Track (and How Many You Really Need)",
    excerpt:
      "Tracking 200 keywords hides what matters. Here is how to pick 15 to 25 local keywords, set a clean baseline, and read your rankings by location instead of guessing.",
    date: "2026-09-30",
    tags: ["local seo", "rank tracking", "local keywords", "google maps ranking", "keyword research", "agencies"],
    intro: [
      "When local businesses start tracking rankings, they often go one of two ways. Either they check a single keyword from their office and call it done, or they load hundreds of phrases into a tool and drown in numbers. Neither tells you whether more customers can actually find you.",
      "A short, well-chosen keyword list tracked from the right locations gives you a clear picture in minutes a week. This guide shows how to choose those keywords, how many to start with and how to set up tracking you can trust.",
    ],
    tldr: [
      "Start with 15 to 25 keywords that map directly to the services that bring in revenue.",
      "Mix core service terms, near me variations, city modifiers and a few urgent or high-value phrases.",
      "Map rankings change block by block, so track each keyword across a grid of points, not from one address.",
      "Record a baseline on the same weekday and time, then compare like for like every week.",
      "Prune keywords that never bring calls and add new ones only when you launch a service or area.",
    ],
    cta: {
      title: "Track the Keywords That Bring Calls",
      text: "Ranklit scans your chosen keywords across a map grid of your service area every week, so you see exactly where customers can and cannot find you.",
    },
    body: [
      { type: "h2", text: "Why a smaller keyword list works better" },
      {
        type: "p",
        text: "Local search is concentrated. For most service businesses, a small group of phrases drives most of the calls from Google Maps. Tracking dozens of near-duplicates, like five slightly different ways to say drain cleaning, adds noise without adding insight.",
      },
      {
        type: "p",
        text: "A focused list also makes weekly reviews realistic. If you can scan your results in five minutes, you will actually do it. If it takes an hour, you will stop looking within a month.",
      },
      { type: "h2", text: "The four keyword groups every local list needs" },
      {
        type: "p",
        text: "Build your list from four buckets. Aim for a few keywords in each so you see the full picture rather than only your best or worst terms.",
      },
      {
        type: "table",
        head: ["Group", "Example (plumber)", "Why track it", "How many"],
        rows: [
          ["Core service", "plumber, drain cleaning", "Shows baseline map pack visibility", "4 to 6"],
          ["Near me", "plumber near me, emergency plumber near me", "Mirrors how mobile users search", "3 to 5"],
          ["City or neighborhood", "plumber in Dallas, water heater repair Oak Cliff", "Tests relevance for specific areas", "4 to 8"],
          ["High value or urgent", "burst pipe repair, sewer line replacement", "Protects your most profitable jobs", "3 to 6"],
        ],
        caption: "A balanced starter list lands between 15 and 25 keywords.",
      },
      {
        type: "p",
        text: "If you are not sure which phrases people use, our [Local Keyword Research Tool](/tools/local-keyword-research-tool) and [Local Keyword Generator](/tools/local-keyword-generator) suggest variations based on your service and city.",
      },
      { type: "h2", text: "How to pick the right 15 to 25" },
      {
        type: "ol",
        items: [
          "List the services that make up most of your revenue, plus any you want to grow.",
          "Write the plainest way a customer would search for each one.",
          "Add a near me version for the top three services.",
          "Add city or neighborhood versions for the areas you most want to win.",
          "Remove anything that would bring the wrong customer, such as DIY or job-seeker searches.",
        ],
      },
      {
        type: "p",
        text: "Check that each keyword matches your primary or secondary Google Business Profile categories. If you track water softener installation but your profile never mentions it, you are measuring a gap you have not tried to close yet. The [Google Business Profile Optimizer](/tools/google-business-profile-optimizer) can flag those mismatches.",
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Ask your front desk or dispatcher what customers say when they call. The words people use on the phone are usually the words they typed into Google a minute earlier.",
      },
      { type: "h2", text: "Track by location, not just by keyword" },
      {
        type: "p",
        text: "Google Maps results depend heavily on where the searcher is standing. You might be number one for plumber near me at your shop and missing from the top 20 three miles away. A single rank number hides that completely.",
      },
      {
        type: "p",
        text: "Grid-based tracking solves this by checking each keyword from many points across your service area and showing the results as a heatmap. It turns ranking into a coverage question: what share of your territory sees you in the top three? Our explainer on [heatmap rank tracking](/blog/heatmap-rank-tracking) goes deeper on reading those maps.",
      },
      { type: "h3", text: "What to record each time" },
      {
        type: "ul",
        items: [
          "Keyword and the date and time of the scan",
          "Grid size and spacing, kept the same every week",
          "Average rank and share of points in the top three",
          "Device type, since mobile and desktop can differ",
          "Any changes you made that week, like new photos or citations",
        ],
      },
      { type: "h2", text: "Set a baseline you can trust" },
      {
        type: "p",
        text: "Rankings shift slightly from hour to hour, so consistency matters more than precision. Pick a weekday and time, such as Monday morning, and scan at that same moment every week. Compare each week to the last and to your starting baseline, not to a one-off check a friend did from their phone.",
      },
      {
        type: "p",
        text: "Give changes time to land. Profile edits can show up within days, while citations and links often take several weeks. Judge trends over a month instead of reacting to a single bad scan.",
      },
      { type: "h2", text: "Keep the list healthy over time" },
      {
        type: "p",
        text: "Review the list every quarter. Drop keywords that never bring calls or that you consistently own already, and replace them with services or neighborhoods you are trying to grow. Keep the total roughly the same so your weekly review stays quick.",
      },
      {
        type: "p",
        text: "Agencies managing several clients should use the same structure for each one. A shared template makes reports faster to build and easier for clients to understand.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit's [Google Maps rank tracker](/rank-tracker) runs weekly grid scans for your chosen keywords and shows top-three coverage and average position for each one, so you get a trustworthy baseline without manual checks. Pair it with the agent's profile optimization and citation work, and you can see which actions moved which keywords. [See plans and pricing](/pricing) to get started.",
      },
    ],
    faqs: [
      {
        q: "How many keywords should a local business track?",
        a: "Most single-location businesses do well with 15 to 25 keywords. That is enough to cover core services, near me searches, key areas and high-value jobs without creating noise.",
      },
      {
        q: "Why do my rankings look different on my phone?",
        a: "Google personalizes local results based on your exact location and search history. That is why grid tracking from fixed points gives a more reliable picture than checking manually.",
      },
      {
        q: "How often should I check local rankings?",
        a: "Weekly is the sweet spot for most businesses. Daily checks show normal fluctuation that can be misleading, while monthly checks make it hard to connect changes to specific actions.",
      },
    ],
    recommended: [
      { label: "Local Keyword Research Tool", href: "/tools/local-keyword-research-tool" },
      { label: "Local Ranking Calculator", href: "/tools/local-ranking-calculator" },
      { label: "Heatmap Rank Tracking Explained", href: "/blog/heatmap-rank-tracking" },
      { label: "What Is a Geo-Grid?", href: "/blog/what-is-geo-grid" },
    ],
  },
  {
    slug: "service-area-pages",
    title: "Service Area Pages That Rank Without Looking Like Doorway Pages",
    excerpt:
      "How to build service area pages that genuinely help customers in each town, stay inside Google's spam rules, and support your map rankings across your territory.",
    date: "2026-09-27",
    tags: ["local seo", "service area pages", "google business profile", "schema markup", "google maps ranking", "local seo audit", "citations"],
    intro: [
      "If you serve customers in a dozen towns, it makes sense to have a page for each one. The trouble starts when those pages are the same text with the city name swapped. Google calls that pattern doorway pages, and it can drag down your whole site rather than just the weak pages.",
      "Done right, service area pages are some of the most useful pages a home service business can publish. They answer location-specific questions, prove you actually work there and give Google a clear reason to show you to people nearby. Here is how to build them properly.",
    ],
    tldr: [
      "Only create a page for an area you genuinely serve and can show real work in.",
      "Every page needs unique, useful content: local projects, photos, pricing notes, timings and reviews.",
      "Set your Google Business Profile service areas to match, and keep your address hidden if you do not serve customers on site.",
      "Add LocalBusiness or Service schema and link each area page from a clear service area hub.",
      "Track map visibility in each town separately so you know which pages are pulling their weight.",
    ],
    cta: {
      title: "Win Every Town You Serve",
      text: "Ranklit tracks your Google Maps rankings across your entire service area and keeps your profile and citations aligned with the towns you cover.",
    },
    body: [
      { type: "h2", text: "What makes a page a doorway page" },
      {
        type: "p",
        text: "Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) describe doorway pages as pages created mainly to rank for specific searches and then funnel visitors elsewhere, often with little unique value. For local businesses, the classic example is 50 near-identical city pages generated from one template.",
      },
      {
        type: "p",
        text: "The test is simple: if you removed the city name, could a reader tell which town the page is about? If not, the page is probably too thin. Useful area pages read as if someone who works there wrote them.",
      },
      {
        type: "table",
        head: ["Signal", "Doorway page", "Helpful service area page"],
        rows: [
          ["Content", "Same text with city swapped", "Unique local details and projects"],
          ["Photos", "Stock images or none", "Real jobs completed in that area"],
          ["Proof", "None", "Local reviews and testimonials"],
          ["Practical info", "Generic", "Response times, permits, typical costs"],
          ["Navigation", "Hidden or orphaned", "Linked from a service area hub"],
        ],
        caption: "Quick comparison to check your existing pages against.",
      },
      { type: "h2", text: "Decide which areas deserve a page" },
      {
        type: "p",
        text: "Start with the towns where you already do real work, not the ones you wish you served. A page for a city you rarely visit will be thin by default because you have nothing true to say about it.",
      },
      {
        type: "ol",
        items: [
          "Pull a list of jobs from the past year and group them by town or neighborhood.",
          "Rank areas by revenue and by how many jobs you completed there.",
          "Pick the top five to ten areas for your first round of pages.",
          "Use our [Google Maps Distance Calculator](/tools/google-maps-distance-calculator) to confirm realistic travel times from your base.",
          "Leave smaller towns to a single service area overview page instead of individual pages.",
        ],
      },
      { type: "h2", text: "What to put on each page" },
      {
        type: "p",
        text: "Each page should help someone in that town decide to hire you. That means local, specific and practical content, not a keyword list.",
      },
      {
        type: "ul",
        items: [
          "A short intro written for that town, mentioning neighborhoods and housing types you commonly work on.",
          "Two or three recent projects with photos, the problem, what you did and the result.",
          "Reviews from customers in that area, with their permission.",
          "Local details that genuinely matter: permit requirements, typical response time, seasonal issues.",
          "A clear call to action with your phone number and booking link.",
        ],
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Ask your technicians to snap two photos on every job and tag the town. After a few months you will have enough real material to make every area page unique without writing from scratch.",
      },
      { type: "h2", text: "Align your Google Business Profile" },
      {
        type: "p",
        text: "If you visit customers rather than having them come to you, set yourself up as a service-area business in Google Business Profile, hide your street address if customers do not visit it, and list the towns you serve. Google's [guidelines](https://support.google.com/business/answer/3038177) allow up to 20 service areas, and they should be reasonably close to your base.",
      },
      {
        type: "p",
        text: "Keep your website service area pages and your profile service areas in agreement. When both point to the same towns, Google gets a consistent picture of where you work. Our [Google Business Profile Optimizer](/tools/google-business-profile-optimizer) checks your settings for common gaps.",
      },
      { type: "h2", text: "Structure, schema and internal links" },
      {
        type: "p",
        text: "Create a single service area hub page that lists every town you cover and links to the individual pages. Link back to the hub from each area page and from your main navigation or footer. This keeps the pages discoverable and shows they are part of a deliberate structure rather than orphaned landing pages.",
      },
      {
        type: "ul",
        items: [
          "Use a clear URL pattern such as /service-areas/town-name.",
          "Add [LocalBusiness schema](https://schema.org/LocalBusiness) on your main location page with areaServed listing your towns.",
          "Write a unique title tag and meta description for each area page.",
          "Link from relevant blog posts and project case studies to the matching area page.",
        ],
      },
      {
        type: "p",
        text: "For a closer look at markup, read our guide to [review schema](/blog/review-schema-guide), which covers what Google will and will not display.",
      },
      { type: "h2", text: "Measure each area on its own" },
      {
        type: "p",
        text: "A service area page succeeds when you show up for searches made inside that town. Checking rankings from your office tells you nothing about a town 15 miles away. Run grid scans centered on each target area and watch how top-three coverage changes after you publish or improve the page.",
      },
      {
        type: "p",
        text: "If a page is not moving after a couple of months, add more local proof: new projects, photos and reviews from that area. If it is still flat, the area may simply be too far from your base to compete, which is useful to know before spending more on it. Our explainer on [proximity in local SEO](/blog/proximity-in-local-seo) covers why.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit's [rank tracker](/rank-tracker) scans your keywords across the towns you serve every week, so you can see which area pages are lifting map visibility and which need more local proof. The agent also keeps your Google Business Profile service areas, posts and citations consistent with the territory you cover. [See plans](/pricing) to cover every town you serve.",
      },
    ],
    faqs: [
      {
        q: "How many service area pages should I create?",
        a: "Create pages only for areas where you do regular work and can add real local content, usually five to ten to start. Smaller or occasional towns can be listed on a single service area overview page.",
      },
      {
        q: "Can service area pages get my site penalized?",
        a: "Thin, near-duplicate pages created only to rank can be treated as doorway pages under Google's spam policies. Pages with unique local projects, photos, reviews and practical information are fine.",
      },
      {
        q: "Do service area pages help Google Maps rankings?",
        a: "Indirectly, yes. They strengthen relevance for searches in those towns and support your Google Business Profile, though distance from your base still limits how far your map rankings can reach.",
      },
    ],
    recommended: [
      { label: "Google Maps Distance Calculator", href: "/tools/google-maps-distance-calculator" },
      { label: "Google Business Profile Optimizer", href: "/tools/google-business-profile-optimizer" },
      { label: "Proximity in Local SEO", href: "/blog/proximity-in-local-seo" },
      { label: "Review Schema for Local Businesses", href: "/blog/review-schema-guide" },
    ],
  },
{
    slug: "google-business-profile-services",
    title: "Add Services to Your Google Business Profile Without Breaking the Rules",
    excerpt:
      "A step-by-step guide to listing services on your Google Business Profile: what to add, how to word it, what Google rejects, and how services help you show up for more searches.",
    date: "2026-09-24",
    tags: ["google business profile", "local seo", "google maps ranking", "gbp services", "service businesses", "profile optimization"],
    intro: [
      "Most business owners fill in their name, hours and phone number, then never touch the Services section of their Google Business Profile again. That is a missed opportunity. Services tell Google, in plain words, what jobs you actually do, and they give searchers a quick menu to scan before they call.",
      "Adding services is free and takes less than an hour. The catch is that Google has rules about what counts as a service and how you describe it. This guide walks through the setup, the wording, and the mistakes that get edits rejected or profiles flagged.",
    ],
    tldr: [
      "Services are free to add and help Google match your profile to more specific searches.",
      "Start with the predefined services Google suggests for your category, then add custom ones for jobs it misses.",
      "Write plain, descriptive service names; keyword stuffing, prices you cannot honor and promo copy can get edits rejected.",
      "Keep services consistent with your website pages and your primary category.",
      "Review the list every quarter and remove anything you no longer offer.",
    ],
    cta: {
      title: "Keep Your Profile Complete Automatically",
      text: "Ranklit audits your Google Business Profile every week, flags missing services and categories, and keeps your listing aligned with what customers search for.",
    },
    body: [
      { type: "h2", text: "Why the Services section matters" },
      {
        type: "p",
        text: "Google ranks local results on relevance, distance and prominence. You cannot change where you are, and prominence takes months to build, but relevance is something you control today. Every service you list is another clear signal about the work you do, which helps Google connect your profile to searches like \"water heater replacement\" rather than only \"plumber\".",
      },
      {
        type: "p",
        text: "Services also show up directly on your profile for many categories. A homeowner comparing three businesses will often pick the one whose listing spells out the exact job they need. A complete list quietly answers the question \"do they do this?\" before the customer has to ask.",
      },
      { type: "h2", text: "How to add services step by step" },
      {
        type: "ol",
        items: [
          "Sign in to the Google account that manages your profile and search for your business name, or open Google Maps and select your listing.",
          "Choose **Edit profile**, then open the **Services** tab (on some categories it appears as **Products and services**).",
          "Tick the predefined services Google suggests for your category. These are matched to common searches, so start here.",
          "Select **Add custom service** for anything missing, type a clear name, and add a short description of up to a few sentences.",
          "Add an optional price only if it is accurate and you will honor it.",
          "Save, then check back in a day or two. Edits can take time to appear and some go through review.",
        ],
      },
      {
        type: "p",
        text: "If the Services option does not appear at all, your primary category may not support it. Check that category first; a closer match often unlocks the section. Google's own [help article on editing your profile](https://support.google.com/business/answer/3039617) lists which fields each category can use.",
      },
      { type: "h2", text: "Predefined vs. custom services" },
      {
        type: "p",
        text: "Predefined services come from Google's own list for each category. They are short, standardized and already mapped to search behavior. Custom services let you fill gaps, but they need more care because a person or an automated check may review them.",
      },
      {
        type: "table",
        head: ["Type", "Where it comes from", "Best for", "Watch out for"],
        rows: [
          ["Predefined", "Google's list for your category", "Core jobs every competitor offers", "Missing niche work you specialize in"],
          ["Custom", "Written by you", "Specialties, brands you service, add-on jobs", "Stuffing city names or slogans into the name"],
          ["Priced", "Either type, with a price added", "Fixed-fee jobs like inspections", "Outdated prices that annoy customers"],
        ],
        caption: "Use predefined services first, then custom ones for real gaps.",
      },
      {
        type: "p",
        text: "A sensible order is to tick every predefined service that genuinely applies, save, and wait a day before adding custom ones. That way you can see which jobs Google already covers and avoid creating near-duplicates such as \"AC repair\" and \"Air conditioning repair\" side by side. Duplicates do not help relevance and make the list harder for customers to scan.",
      },
      { type: "h2", text: "Writing service names and descriptions" },
      {
        type: "p",
        text: "Treat the service name like a label on a shelf. It should say what the job is in the words a customer would use, and nothing more. The description is where you can add a little context, such as what is included or which situations it covers.",
      },
      { type: "h3", text: "Good examples" },
      {
        type: "ul",
        items: [
          "**Drain cleaning:** Clearing blocked kitchen, bathroom and main sewer lines with cameras and hydro jetting.",
          "**Emergency AC repair:** Same-day diagnosis and repair for central air systems that stop cooling.",
          "**Teeth whitening:** In-office whitening in one visit, with take-home trays available.",
        ],
      },
      { type: "h3", text: "Examples that cause trouble" },
      {
        type: "ul",
        items: [
          "\"Best cheap plumber Dallas Fort Worth Arlington 24/7\" (location stuffing and superlatives in the name).",
          "\"Call now for 50% off!\" (promotional copy belongs in a post or offer, not a service).",
          "Services you subcontract out or no longer provide.",
        ],
      },
      {
        type: "p",
        text: "Descriptions deserve the same restraint. One to three sentences is plenty: what the job involves, who it is for, and anything that sets your version apart, such as same-day availability or a warranty. Mentioning the areas you serve once in a natural sentence is fine; repeating a list of towns in every description is not.",
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Match each important service to a page on your website with the same name. When your profile, your site and your citations all describe the job the same way, Google has an easier time trusting the signal.",
      },
      { type: "h2", text: "Common reasons edits get rejected" },
      {
        type: "p",
        text: "Google does not always explain why a change did not stick, but the usual causes are predictable. Most come down to content that reads like advertising rather than a description of real work.",
      },
      {
        type: "ul",
        items: [
          "Keywords, city names or phone numbers inserted into service names.",
          "Services that do not fit the business category, such as a dentist listing \"web design\".",
          "Links, emoji strings or all-caps text in descriptions.",
          "Lots of edits pushed in a short window, which can trigger an extra review.",
          "Prices that contradict what your website shows.",
        ],
      },
      {
        type: "p",
        text: "When an edit is rejected, fix the obvious issue and resubmit once rather than trying several versions in a row. Repeated rapid edits are one of the patterns that can send a profile into a longer manual review, which delays every other change you want to make.",
      },
      {
        type: "p",
        text: "If you suspect your profile has deeper problems, run it through our free [Google Business Profile Optimizer](/tools/google-business-profile-optimizer) to check categories, descriptions and missing fields in one pass.",
      },
      { type: "h2", text: "Keeping services current" },
      {
        type: "p",
        text: "A services list is not a one-time job. Businesses add new offerings, drop seasonal ones, and change prices. Set a quarterly reminder to compare the list against what your team actually sells. Remove anything you stopped doing, because a customer who calls for a discontinued service is a wasted lead and often a bad review.",
      },
      {
        type: "p",
        text: "This is also a good moment to look at what competitors list. If the three businesses ranking above you in the map pack all show a service you offer but did not list, add it. Our [local competitor analysis tool](/tools/local-competitor-analysis-tool) makes that comparison quick.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit reviews your Google Business Profile every week and flags gaps like missing services, weak descriptions or a category that limits what you can show. It also tracks how your map rankings move after changes, so you can see whether adding a service actually improved visibility across your area. See the [plans and pricing](/pricing) or learn how the [rank tracker](/rank-tracker) measures results.",
      },
    ],
    faqs: [
      {
        q: "Does adding services to my Google Business Profile improve rankings?",
        a: "Services strengthen relevance, which is one of the main local ranking factors. They will not override distance or a weak review profile, but they help Google match you to more specific searches.",
      },
      {
        q: "How many services should I list?",
        a: "List every real service a customer might search for, which for most businesses is somewhere between 8 and 30. Quality matters more than count, so skip filler and duplicates.",
      },
      {
        q: "Why can't I see the Services option on my profile?",
        a: "Some categories do not support services, or show them as products instead. Try a primary category that more closely matches your main line of work, then check again.",
      },
    ],
    recommended: [
      { label: "Google Business Profile Optimizer", href: "/tools/google-business-profile-optimizer" },
      { label: "Local SEO Checklist Tool", href: "/tools/local-seo-checklist-tool" },
      { label: "Local SEO Audit Checklist: Find and Fix the Gaps", href: "/blog/local-seo-audit-checklist" },
      { label: "Service Area Pages That Rank Without Looking Like Doorway Pages", href: "/blog/service-area-pages" },
    ],
  },
  {
    slug: "what-is-geo-grid",
    title: "What Is a Geo-Grid? A Plain-English Guide to Map Rank Scans",
    excerpt:
      "A geo-grid checks your Google Maps rank from many points across your service area at once. Learn how it works, how to read one, and how to choose grid size and spacing.",
    date: "2026-09-21",
    tags: ["rank tracking", "google maps ranking", "geo-grid", "local seo", "agencies", "heatmap"],
    intro: [
      "Search \"electrician near me\" from your shop and you might see yourself at the top. Drive three miles across town and search again, and you could be nowhere. Google Maps results shift with the searcher's location, so a single rank check tells you very little.",
      "A geo-grid solves that by checking your position from dozens of points at once and laying the results out on a map. This guide explains what a geo-grid is, how to read one, and how to set it up so the data actually helps you decide what to fix.",
    ],
    tldr: [
      "A geo-grid checks one keyword from many map points and shows your rank at each point as a colored dot.",
      "It reveals where you rank well, where you fade out, and where competitors take over.",
      "Grid size and spacing should match how far your customers actually travel or how far you drive to them.",
      "Track the same grid on a steady schedule so changes reflect your work, not a different setup.",
      "Use the weak zones to choose fixes: content, citations, reviews or a service area adjustment.",
    ],
    cta: {
      title: "See Your Rank Across Every Neighborhood",
      text: "Ranklit runs weekly geo-grid scans across your service area and shows exactly where you win, where you slip, and which competitors outrank you.",
    },
    body: [
      { type: "h2", text: "What a geo-grid actually is" },
      {
        type: "p",
        text: "A geo-grid is a set of evenly spaced points placed over a map, usually centered on your business. For each point, a tool runs the same Google Maps search as if a customer were standing there, then records where your business appears in the results. The output is a map covered in dots, each showing your rank from that spot.",
      },
      {
        type: "p",
        text: "Most tools color the dots so you can read them at a glance: green for top three, amber for positions four to ten, and red for anything lower or not found. The pattern matters more than any single dot. A tight green cluster around your address with red at the edges tells a very different story than green scattered unevenly across the map.",
      },
      { type: "h2", text: "Why a single rank check is misleading" },
      {
        type: "p",
        text: "Traditional rank trackers report one number per keyword. For organic web results that is usually fine. For map results it hides most of the picture, because Google weighs the distance between the searcher and each business heavily. You can be first for customers on your block and invisible to the neighborhoods that bring in the best jobs.",
      },
      {
        type: "p",
        text: "We cover the distance factor in depth in our guide to [proximity in local SEO](/blog/proximity-in-local-seo). The short version: if you only check rankings from your own office, you will almost always overestimate your visibility.",
      },
      { type: "h2", text: "How to read a geo-grid" },
      {
        type: "p",
        text: "Start with three numbers most tools report alongside the map, then look at the shape of the dots.",
      },
      {
        type: "table",
        head: ["Metric", "What it tells you", "What good looks like"],
        rows: [
          ["Average rank", "Your mean position across all points", "Under 5 for core keywords"],
          ["Top-3 share", "Percentage of points where you appear in the map pack", "Above 50% near your location"],
          ["Found rate", "Percentage of points where you appear at all", "Close to 100% inside your service area"],
          ["Edge drop-off", "How quickly ranks fall toward the grid edges", "Gradual, not a sudden cliff"],
        ],
        caption: "Compare these numbers scan to scan, not against other industries.",
      },
      {
        type: "p",
        text: "Next, look for direction. If you rank well to the north but poorly to the south, ask what is different down there. Often a competitor sits in that area, or your website and citations never mention those neighborhoods.",
      },
      {
        type: "p",
        text: "Finally, click into the weakest points. Most tools show which businesses ranked above you at each dot. If the same two competitors keep appearing in your red zones, study their profiles: their categories, review counts, photos and the neighborhoods their websites mention. That comparison usually tells you more than the rank number itself.",
      },
      { type: "h2", text: "Choosing grid size and spacing" },
      {
        type: "p",
        text: "The right grid depends on how your customers find you. A coffee shop and a roofing company should not use the same setup.",
      },
      {
        type: "ul",
        items: [
          "**Walk-in businesses** (cafes, salons, clinics): small grids with tight spacing, such as a 5x5 grid at a quarter to half a mile.",
          "**Service-area businesses** (plumbers, HVAC, cleaners): wider grids, such as 7x7 or 9x9 at one to two miles, covering where your trucks actually go.",
          "**Multi-location brands:** one grid per location, sized to that location's realistic catchment.",
        ],
      },
      {
        type: "p",
        text: "If you are unsure how far your service area really stretches, our [Google Maps distance calculator](/tools/google-maps-distance-calculator) helps you measure drive distances from your base.",
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Pick a grid and keep it. Changing the size, spacing or center between scans makes your results impossible to compare, and you will end up chasing noise instead of real movement.",
      },
      { type: "h2", text: "How often to run scans" },
      {
        type: "p",
        text: "Map rankings move, but not hour to hour for most businesses. Weekly scans are enough to spot trends and connect changes to the work you did. Monthly scans suit stable businesses or broad agency reporting. Daily scans rarely add insight and can make normal fluctuation look like a crisis.",
      },
      {
        type: "p",
        text: "Track a focused list of keywords rather than everything. Our guide on [which local keywords to track](/blog/track-local-keywords) explains how to pick a list that reflects real revenue.",
      },
      {
        type: "p",
        text: "Expect some week-to-week wobble even when nothing changed. Google tests results constantly, and a dot that flips from position three to five and back again is normal. Look for patterns that hold across two or three scans before you react. A whole edge of the grid turning red, or your top-3 share sliding several weeks in a row, is a real signal worth investigating.",
      },
      { type: "h2", text: "Turning weak zones into a fix list" },
      {
        type: "p",
        text: "A geo-grid is only useful if it changes what you do next. When you spot a weak area, work through the likely causes in order of effort.",
      },
      {
        type: "ol",
        items: [
          "Confirm your Google Business Profile service area includes that zone.",
          "Check whether your site has a page or content that mentions the neighborhoods there.",
          "Look for local citations and links tied to that part of town.",
          "Ask customers in that area for reviews that mention the job and location naturally.",
          "Rescan after four to six weeks and compare the same grid.",
        ],
      },
      {
        type: "p",
        text: "Keep a short log of what you changed and when. When the next scan shows improvement in one area but not another, the log lets you connect the result to the work. Agencies in particular find this useful for client reports, because it turns a colorful map into a clear story of cause and effect.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit runs geo-grid scans for your keywords every week, keeps the grid consistent, and highlights the zones where you lost or gained ground. The agent then works on the profile, citation and review tasks most likely to lift those weak areas. Explore the [rank tracker](/rank-tracker) or compare [plans and pricing](/pricing).",
      },
    ],
    faqs: [
      {
        q: "Is a geo-grid the same as a heatmap?",
        a: "Mostly, yes. A heatmap is the visual output of a geo-grid scan, with colors showing your rank at each point. People use the two terms interchangeably.",
      },
      {
        q: "How many grid points do I need?",
        a: "For most local businesses, 25 to 81 points (a 5x5 to 9x9 grid) is plenty. More points cost more to run and rarely change the decisions you make.",
      },
      {
        q: "Why do my geo-grid results differ from what I see on my phone?",
        a: "Your phone results are personalized and tied to your exact location and search history. A geo-grid uses neutral searches from fixed points, which gives a more consistent view of what typical customers see.",
      },
    ],
    recommended: [
      { label: "Google Maps Visibility Score Calculator", href: "/tools/google-maps-visibility-score-calculator" },
      { label: "Heatmap Rank Tracking: Spot Weak Zones Before Competitors Do", href: "/blog/heatmap-rank-tracking" },
      { label: "Proximity in Local SEO: How Distance Shapes Your Map Rankings", href: "/blog/proximity-in-local-seo" },
      { label: "Local Ranking Calculator", href: "/tools/local-ranking-calculator" },
    ],
  },
  {
    slug: "review-request-email",
    title: "Review Request Emails: Templates, Timing and the Rules to Follow",
    excerpt:
      "Ready-to-use review request email templates for local businesses, plus when to send them, how many follow-ups are fair, and the rules that keep your reviews safe.",
    date: "2026-09-18",
    tags: ["reviews", "google business profile", "local seo", "review request email", "email templates", "reputation management"],
    intro: [
      "Happy customers rarely leave reviews on their own. They mean to, then life gets in the way. A short, well-timed email is often the difference between a profile with a handful of reviews and one that steadily collects fresh feedback every month.",
      "This guide gives you three templates you can adapt today, a simple sending schedule, and the rules you need to respect so your reviews stay on your profile and your business stays out of trouble.",
    ],
    tldr: [
      "Send the first request within 24 hours of finishing the job, while the experience is still fresh.",
      "Keep the email short, personal and focused on one action: a direct link to your review form.",
      "One polite follow-up after a few days is fine; more than two messages starts to feel like pressure.",
      "Ask every customer the same way; do not filter for happy ones or offer rewards for reviews.",
      "Reply to every review you receive, positive or negative, within a couple of days.",
    ],
    cta: {
      title: "Turn Finished Jobs Into Fresh Reviews",
      text: "Ranklit helps you collect reviews consistently and drafts personal replies for every new review, so your profile stays active without extra admin work.",
    },
    body: [
      { type: "h2", text: "Why email still works for reviews" },
      {
        type: "p",
        text: "Text messages get faster responses, but email has advantages for many businesses. It is easy to automate from booking or invoicing software, it gives you room for a personal note, and customers can come back to it when they have a spare minute. For service businesses with longer jobs or higher prices, a thoughtful email often feels more appropriate than a text.",
      },
      {
        type: "p",
        text: "Reviews matter because they feed both rankings and trust. Recent, detailed reviews help Google see an active business, and they help shoppers choose you over the listing next door. Check where you stand today with our [review score estimator](/tools/local-business-review-score-estimator).",
      },
      { type: "h2", text: "Timing: when to send and when to follow up" },
      {
        type: "table",
        head: ["Message", "When to send", "Goal"],
        rows: [
          ["First request", "Same day or within 24 hours of the job", "Catch the customer while the experience is fresh"],
          ["Gentle reminder", "3 to 5 days later, only if no review", "A friendly nudge, not pressure"],
          ["Final note (optional)", "10 to 14 days later", "Last chance; then stop"],
        ],
        caption: "Stop all reminders as soon as the customer leaves a review.",
      },
      {
        type: "p",
        text: "Send during reasonable hours in the customer's time zone. Mid-morning and early evening tend to work well for household customers, while business clients usually respond better during working hours.",
      },
      {
        type: "p",
        text: "Automate the schedule if you can. Most booking, invoicing and CRM tools can trigger an email when a job is marked complete. Automation removes the biggest reason review programs fail: someone on the team forgetting to send requests during a busy week. Just make sure the trigger fires after the work is truly finished, not when the appointment is booked.",
      },
      { type: "h2", text: "Three templates you can adapt" },
      {
        type: "p",
        text: "Keep the subject line short and human. Use the customer's name and mention the specific job. Always link straight to your Google review form so the customer does not have to search for you.",
      },
      { type: "h3", text: "1. The same-day thank-you" },
      {
        type: "quote",
        text: "Subject: Thanks for having us today, Maria. Hi Maria, thanks for trusting us with your water heater replacement this morning. If you have a minute, a quick Google review would really help other homeowners in Riverside find us: [review link]. Thanks again, Dan at Brightline Plumbing.",
      },
      { type: "h3", text: "2. The gentle reminder" },
      {
        type: "quote",
        text: "Subject: Quick favor? Hi Maria, just checking that everything is running smoothly with the new water heater. If you have not had a chance yet, we would be grateful for a short review: [review link]. And if anything is not right, reply here and we will sort it out.",
      },
      { type: "h3", text: "3. The appointment-based business" },
      {
        type: "quote",
        text: "Subject: How was your visit, James? Hi James, thanks for coming in for your cleaning today. We read every review and use them to improve. Would you share a sentence or two about your visit? [review link]. See you at your next appointment, the team at Oakwood Dental.",
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "Ask a question that invites detail, such as what problem you solved or how the visit felt. Specific reviews that mention the service and neighborhood are more useful to shoppers than a one-word \"great\".",
      },
      { type: "h2", text: "The rules you need to follow" },
      {
        type: "p",
        text: "Review rules come from two places: Google's own content policies and consumer protection law. The details vary by country, so treat this as general guidance rather than legal advice.",
      },
      {
        type: "ul",
        items: [
          "**No incentives.** Do not offer discounts, gifts or entries into a draw in exchange for reviews. Google's policies prohibit it, and regulators like the [FTC](https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews) have taken a firm line on incentivized and fake reviews.",
          "**No review gating.** Do not screen customers first and only send happy ones to Google. Ask everyone the same way.",
          "**No fake or staff reviews.** Employees, family members and paid reviewers should not review your business.",
          "**No pressure.** Do not ask customers to write reviews on the spot on your device, and keep follow-ups limited.",
          "**Respect opt-outs.** Include a way to stop emails and honor it, in line with email marketing rules.",
        ],
      },
      {
        type: "p",
        text: "Breaking these rules can lead to reviews being removed, warnings on your profile, or worse. Slow, honest growth is far safer than a sudden spike that looks manufactured.",
      },
      {
        type: "p",
        text: "A steady pace also looks better to customers. A profile that gains a few reviews every week reads as an active, trusted business. A profile that jumps from 12 reviews to 80 in a fortnight and then goes quiet invites suspicion from shoppers and from Google's spam filters alike.",
      },
      { type: "h2", text: "Replying to the reviews you get" },
      {
        type: "p",
        text: "Asking for reviews is half the job. Replying shows future customers that a real person is paying attention. Thank positive reviewers by name and mention the job. For negative reviews, stay calm, acknowledge the problem, and offer to continue the conversation offline. If a review looks fake or breaks Google's policies, report it through your profile rather than arguing in public. And if you also show testimonials on your website, our article on [review schema](/blog/review-schema-guide) explains how those are treated differently from Google reviews.",
      },
      {
        type: "p",
        text: "Track a few simple numbers each month: requests sent, reviews received, and your average rating. A response rate below one in ten usually means the email is too long, sent too late, or the link is buried. Test one change at a time, such as a shorter subject line, and compare the next month's results.",
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit keeps your review program running without spreadsheets. It helps you send requests at the right moment, drafts personal replies to every new review, and tracks how review growth lines up with your map rankings. See what is included on the [pricing page](/pricing) or browse the full [feature list](/features).",
      },
    ],
    faqs: [
      {
        q: "How soon after a job should I send a review request?",
        a: "Within 24 hours is ideal. The experience is fresh, the customer remembers details, and they are more likely to follow through.",
      },
      {
        q: "Can I offer a discount for leaving a review?",
        a: "No. Offering rewards in exchange for reviews breaks Google's policies and can run afoul of consumer protection rules. Ask every customer the same way and let them decide.",
      },
      {
        q: "Should I send review requests by email or text?",
        a: "Both work. Text tends to get quicker responses, while email suits higher-value jobs and business customers. Many businesses send a text first and follow up by email.",
      },
    ],
    recommended: [
      { label: "Local Business Review Score Estimator", href: "/tools/local-business-review-score-estimator" },
      { label: "Review Schema for Local Businesses", href: "/blog/review-schema-guide" },
      { label: "Google Business Profile Optimizer", href: "/tools/google-business-profile-optimizer" },
      { label: "Local SEO Audit Checklist: Find and Fix the Gaps", href: "/blog/local-seo-audit-checklist" },
    ],
  },
  {
    slug: "nap-citation-cleanup",
    title: "NAP Consistency: Clean Up Your Citations in One Afternoon",
    excerpt:
      "Mismatched names, addresses and phone numbers confuse Google and customers. Here is a practical afternoon plan to find, fix and prevent citation inconsistencies.",
    date: "2026-09-15",
    tags: ["citations", "nap consistency", "local seo", "local seo audit", "google maps ranking", "business listings"],
    intro: [
      "Your business name, address and phone number, usually shortened to NAP, appear on dozens of sites you may have forgotten about: directories, review sites, maps apps, industry listings and old social profiles. When those details disagree, Google has a harder time trusting which version is correct, and customers sometimes call a number that no longer works.",
      "The good news is that most cleanups follow the same pattern. With a list, a few hours and some patience, you can fix the listings that matter most and set up a simple habit to keep them clean.",
    ],
    tldr: [
      "Pick one exact version of your name, address and phone number and treat it as the master record.",
      "Find your existing listings by searching your business name, old addresses and old phone numbers.",
      "Fix duplicates and closed listings first, then high-authority directories, then smaller sites.",
      "Match your website footer, contact page and schema markup to the master record.",
      "Re-check citations every six months and after any move, rebrand or phone change.",
    ],
    cta: {
      title: "Find Every Citation Mismatch Fast",
      text: "Ranklit scans the directories that matter, flags inconsistent business details, and builds new citations by hand on the platforms that help local rankings.",
    },
    body: [
      { type: "h2", text: "What NAP consistency means and why it matters" },
      {
        type: "p",
        text: "A citation is any online mention of your business details. NAP consistency simply means those mentions match. Google cross-checks this information to confirm that your business is real, where it is, and how to reach it. Consistent details reinforce your Google Business Profile; conflicting ones add doubt.",
      },
      {
        type: "p",
        text: "Citations are rarely the single factor that pushes a business into the map pack, but messy ones can hold an otherwise strong profile back. They also cost you directly: a customer who finds an old number on a directory will usually call the next business instead of searching again.",
      },
      { type: "h2", text: "Step 1: Create your master record" },
      {
        type: "p",
        text: "Before touching any listing, write down the exact format you will use everywhere. Base it on your Google Business Profile and your legal or signage name.",
      },
      {
        type: "table",
        head: ["Field", "Example master format", "Common variations to avoid"],
        rows: [
          ["Name", "Brightline Plumbing", "Brightline Plumbing LLC, Bright Line Plumbing & Drains"],
          ["Address", "1420 Elm St, Suite 210, Dallas, TX 75201", "1420 Elm Street #210, Ste. 210, missing suite"],
          ["Phone", "(214) 555-0182", "Tracking numbers, old landlines, personal mobiles"],
          ["Website", "https://brightlineplumbing.com", "http:// version, www mismatch, old domain"],
        ],
        caption: "Small formatting differences matter less than wrong data, but consistency removes doubt.",
      },
      {
        type: "p",
        text: "Share the master record with anyone who might create or edit a listing: your office manager, your web designer, and any marketing contractors. Most citation messes start when two well-meaning people set up listings in slightly different ways. A single shared document prevents that from happening again.",
      },
      { type: "h2", text: "Step 2: Find your existing listings" },
      {
        type: "p",
        text: "Set aside an hour and search for every version of your business you can think of. Keep a simple spreadsheet with columns for the site, the URL, what it currently shows, and what needs to change.",
      },
      {
        type: "ul",
        items: [
          "Search your business name plus your city, and note every directory that appears on the first few pages.",
          "Search your old addresses and old phone numbers on their own; outdated listings often surface this way.",
          "Check the major data sources and maps apps, including Apple Maps, Bing Places and Yelp.",
          "Check industry directories for your trade, such as home service marketplaces or healthcare directories.",
          "Run our free [local citation finder](/tools/local-citation-finder) to spot listings you missed.",
        ],
      },
      {
        type: "p",
        text: "Expect to find more than you thought. A business that has been around for five or more years commonly has dozens of listings, including some created automatically by directories that scraped public data. Do not be alarmed; you only need to record them for now. The fixing comes next.",
      },
      { type: "h2", text: "Step 3: Fix listings in priority order" },
      {
        type: "p",
        text: "You will not fix everything in one sitting, so work from highest impact to lowest. This order gets the biggest wins done first.",
      },
      {
        type: "ol",
        items: [
          "**Duplicates and closed listings.** Merge or remove duplicate profiles and mark old locations as closed or moved. Duplicates compete with your main listing.",
          "**Your own properties.** Update your website footer, contact page and any [LocalBusiness schema](https://schema.org/LocalBusiness) so they match the master record exactly.",
          "**Major platforms.** Apple Maps, Bing Places, Yelp, Facebook and the Better Business Bureau carry more weight and more traffic.",
          "**Industry and local directories.** Trade associations, chamber of commerce listings and city directories.",
          "**Everything else.** Smaller general directories, which you can batch over a few weeks.",
        ],
      },
      {
        type: "callout",
        label: "Pro tip",
        text: "If you use call tracking numbers, put the tracking number in a secondary field where possible and keep your main published number consistent. Different numbers on every directory is one of the most common NAP problems we see.",
      },
      { type: "h2", text: "Step 4: Handle the stubborn listings" },
      {
        type: "p",
        text: "Some sites make editing difficult. You may need to claim the listing first, verify by phone or postcard, or contact support. Note the request date in your spreadsheet and move on rather than waiting. If a directory pulls data from a larger aggregator, fixing the source often corrects several listings at once over the following weeks.",
      },
      {
        type: "p",
        text: "If a site simply will not update and the listing is low value, it is fine to leave it. Focus your time on listings that customers actually see and that rank for your business name.",
      },
      {
        type: "p",
        text: "Moved recently? Treat your old address with extra care. Mark the old location as moved rather than deleting it where the platform allows, so reviews and history carry over. Then search the old street address a month later to catch any directory that re-imported the outdated details.",
      },
      { type: "h2", text: "Step 5: Keep it clean" },
      {
        type: "p",
        text: "Citation drift happens slowly. Directories scrape old data, staff create new accounts, and a move or phone change sends everything out of sync again. A light routine prevents another big cleanup later.",
      },
      {
        type: "ul",
        items: [
          "Re-check your top 20 listings every six months with our [citation consistency analyzer](/tools/citation-consistency-analyzer).",
          "Update all major listings within a week of any move, rebrand or phone change.",
          "Keep logins for each directory in a shared password manager so updates are quick.",
          "Add NAP checks to your regular [local SEO audit](/blog/local-seo-audit-checklist).",
        ],
      },
      { type: "h2", text: "Where Ranklit fits" },
      {
        type: "p",
        text: "Ranklit checks your listings for mismatched details, flags duplicates, and builds new citations by hand on the platforms that matter for your category. It then tracks how your map rankings respond, so you can see the effect of a cleaner footprint. Compare [plans and pricing](/pricing) to get started.",
      },
    ],
    faqs: [
      {
        q: "Does NAP formatting need to match character for character?",
        a: "Google is good at recognizing that \"Street\" and \"St\" mean the same thing, so tiny formatting differences are low risk. Wrong or outdated information is the real problem, but a single consistent format removes any doubt.",
      },
      {
        q: "How many citations does a local business need?",
        a: "There is no magic number. Accurate listings on the major platforms and the key directories for your industry and city matter far more than hundreds of low-quality listings.",
      },
      {
        q: "How long does it take for citation fixes to affect rankings?",
        a: "Updates can take a few weeks to be picked up, and aggregator changes may take longer to spread. Most businesses see the effect over one to three months, alongside their other local SEO work.",
      },
    ],
    recommended: [
      { label: "Citation Consistency Analyzer", href: "/tools/citation-consistency-analyzer" },
      { label: "Local Citation Finder", href: "/tools/local-citation-finder" },
      { label: "Local Link Building: 5 Steps That Move Map Rankings", href: "/blog/local-link-building" },
      { label: "Apple Maps for Local Businesses", href: "/blog/apple-maps-seo" },
    ],
  },
];

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Deterministic date formatting (no Date object, safe for prerendering). */
export function formatDate(iso: string, style: "short" | "long" = "short") {
  const [y, m, d] = iso.split("-").map(Number);
  const month = months[m - 1];
  return `${style === "short" ? month.slice(0, 3) : month} ${d}, ${y}`;
}

/** All posts, newest first. */
export function getAllPosts() {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function tagSlug(tag: string) {
  return slugify(tag);
}

/** Every tag across posts, keyed by slug, with its display label. */
export function getAllTags() {
  const map = new Map<string, string>();
  for (const post of posts) for (const tag of post.tags) if (!map.has(tagSlug(tag))) map.set(tagSlug(tag), tag);
  return [...map.entries()].map(([slug, label]) => ({ slug, label }));
}

export function getTag(slug: string) {
  return getAllTags().find((t) => t.slug === slug);
}

export function getPostsByTag(slug: string) {
  return getAllPosts().filter((p) => p.tags.some((t) => tagSlug(t) === slug));
}

/** h2 headings of a post body, with anchor ids, for the table of contents. */
export function getToc(post: Post) {
  return post.body.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2").map((b) => ({ id: slugify(b.text), text: b.text }));
}
