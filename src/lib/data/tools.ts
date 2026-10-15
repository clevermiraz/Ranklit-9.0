import { trialHref } from "@/lib/site";

/**
 * Registry for the Free Tools section (/tools and /tools/[slug]).
 * Plain data only (no React), so it can be imported by pages, client components and the API route.
 */

export type ToolCategoryId = "keywords" | "rankings" | "citations" | "reviews" | "audit" | "content";
export type ToolIcon = "search" | "trending-up" | "link" | "star" | "shield-check" | "sparkles";

export type ToolCategory = { id: ToolCategoryId; label: string; subtitle: string; icon: ToolIcon };

export type ToolField = {
  /** JSON key sent to the API. */
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  maxLength: number;
};

export type CalculatorId =
  | "visibility-score"
  | "visibility-estimator"
  | "ranking"
  | "search-volume"
  | "distance"
  | "review-score"
  | "keyword-density"
  | "seo-checklist";

export type ToolCtaKey = "trial" | "diy" | "estimate" | "citations" | "competitors" | "reviews";

export type ToolFaq = { q: string; a: string };
export type ToolArticleSection = { heading: string; body: string };

type ToolBase = {
  slug: string;
  /** Card title and page H1. */
  name: string;
  /** document.title */
  title: string;
  /** Meta description, page intro and index card description. */
  description: string;
  category: ToolCategoryId;
  icon: ToolIcon;
  article: ToolArticleSection[];
  faqs: ToolFaq[];
  cta: ToolCtaKey;
};

/** Response shape of POST /api/tools/<slug>: `{ data: ToolResult }` or `{ error: string }`. */
export type ToolResultItem = { text: string; note?: string };
export type ToolResultGroup = { title: string; items: ToolResultItem[] };
export type ToolResult = { groups: ToolResultGroup[] };

export type AiTool = ToolBase & { type: "ai"; fields: ToolField[]; button: string };
export type CalculatorTool = ToolBase & { type: "calculator"; calculator: CalculatorId };
export type Tool = AiTool | CalculatorTool;

export const toolCategories: ToolCategory[] = [
  { id: "keywords", label: "Keyword research", subtitle: "Find and plan the local keywords your customers really type.", icon: "search" },
  { id: "rankings", label: "Rankings & visibility", subtitle: "Estimate and make sense of your Google Maps visibility.", icon: "trending-up" },
  { id: "citations", label: "Citations & listings", subtitle: "Get listed on the right directories with matching details.", icon: "link" },
  { id: "reviews", label: "Reviews & reputation", subtitle: "Understand where your reviews stand and how to improve them.", icon: "star" },
  { id: "audit", label: "Audits & optimization", subtitle: "Find what to fix and how to move up the map pack.", icon: "shield-check" },
  { id: "content", label: "Content & branding", subtitle: "Generate names, descriptions and local content ideas.", icon: "sparkles" },
];

export type ToolCta = { eyebrow: string; title: string; body: string; button: string; href: string };

export const toolCtas: Record<ToolCtaKey, ToolCta> = {
  trial: {
    eyebrow: "Free tool. No signup required.",
    title: "Climb Google Maps on autopilot",
    body: "Ranklit runs your local SEO for you: Google Business Profile optimization, 500+ citations and weekly rank tracking. Plans start at $99/mo and come with a 30-day money-back ranking guarantee.",
    button: "Start your 3-day free trial",
    href: "/pricing",
  },
  diy: {
    eyebrow: "This is DIY guidance.",
    title: "Want this done for you?",
    body: "Ranklit audits your Google Business Profile and fixes what it finds, with a monthly check-up and automatic fixes. No agency needed.",
    button: "Get it done for you",
    href: trialHref(),
  },
  estimate: {
    eyebrow: "This is a one-time, rough estimate.",
    title: "See your real rankings, tracked weekly",
    body: "Ranklit maps your actual Google Maps rankings on a geo-grid heatmap every week, so you watch real movement instead of a guess.",
    button: "Track my real rankings",
    href: trialHref(),
  },
  citations: {
    eyebrow: "This tool only points you in the right direction.",
    title: "We'll build your citations for you",
    body: "Ranklit places 500+ quality citations by hand, gets them indexed by Google and keeps your name, address and phone identical everywhere, automatically.",
    button: "Build my citations",
    href: trialHref(),
  },
  competitors: {
    eyebrow: "This is a manual starting point.",
    title: "Outrank your local competitors",
    body: "Ranklit optimizes your profile, builds citations and tracks your map rankings every week, so you move past nearby rivals and stay ahead.",
    button: "Start outranking them",
    href: trialHref(),
  },
  reviews: {
    eyebrow: "This is just a snapshot.",
    title: "Put your reviews on autopilot",
    body: "Ranklit answers your Google reviews with AI and shows off your best ones on your website with a review widget.",
    button: "Automate my reviews",
    href: trialHref(),
  },
};

const BUSINESS: ToolField = {
  name: "business",
  label: "Business type or main service",
  placeholder: "e.g. emergency plumber, dog grooming, dental clinic",
  required: true,
  maxLength: 120,
};
const LOCATION: ToolField = { name: "location", label: "Location", placeholder: "e.g. Austin, TX", required: true, maxLength: 120 };
const LOCATION_OPTIONAL: ToolField = { ...LOCATION, required: false };

const categoryIcon = (id: ToolCategoryId) => toolCategories.find((c) => c.id === id)!.icon;

function ai(t: Omit<AiTool, "type" | "icon">): AiTool {
  return { ...t, type: "ai", icon: categoryIcon(t.category) };
}
function calc(t: Omit<CalculatorTool, "type" | "icon">): CalculatorTool {
  return { ...t, type: "calculator", icon: categoryIcon(t.category) };
}

export const tools: Tool[] = [
  /* ───────────── Keyword research ───────────── */
  ai({
    slug: "local-keyword-generator",
    name: "Local Keyword Generator",
    title: "Local Keyword Generator",
    description:
      "Grow your local SEO with our free Local Keyword Generator! Type a service and a location to get keyword ideas built for your small business.",
    category: "keywords",
    cta: "trial",
    button: "Generate keyword ideas",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Win Local Searches with the Right Keywords",
        body: "For a small business, showing up in search usually comes down to relevance. Whether you're a florist in Miami or a mechanic in Seattle, broad keywords won't do much for you. You need the phrases nearby customers actually type into Google. A generator for location-based search terms closes that gap and puts you in front of people in your area who are already looking for what you sell.",
      },
      {
        heading: "Why Local Intent Matters",
        body: "Think about a customer looking for a service you offer. They don't want any provider, they want one close by. Searches with local intent, like 'bakery near me', tend to turn into a purchase or visit quickly. When you focus on geographically relevant phrases, you appear in front of buyers who are ready to act, without fighting every other business on the internet for attention.",
      },
      {
        heading: "Start Optimizing Today",
        body: "Getting going is simple. A small change in the keywords you focus on can make a real difference. Shape your content around your community and watch more local traffic find its way to you.",
      },
    ],
    faqs: [
      {
        q: "Why do local keywords matter for my business?",
        a: "Local keywords put you in front of nearby people searching for what you do. Someone typing 'dentist in Chicago' is far more likely to book than someone typing just 'dentist'. Targeting location-specific phrases reaches people who are ready to act, which means more calls, visits and local orders. This tool makes those specific phrases easy to find.",
      },
      {
        q: "Can I use it for more than one location?",
        a: "Yes. Run the tool once for each area you want to target. If you cover several towns, like a contractor with a wide service area, enter each one separately to get a fresh list of ideas. It's a fast way to build keyword lists for every market you serve.",
      },
      {
        q: "Do I need SEO experience to use these keywords?",
        a: "No. Once you have your list, work the phrases naturally into your website pages, blog posts and Google Business Profile, for example in page titles and descriptions. Don't cram them in. If you're new to SEO, start with one or two keywords per page.",
      },
    ],
  }),
  ai({
    slug: "local-keyword-research-tool",
    name: "Local Keyword Research Tool",
    title: "Local Keyword Research Tool",
    description:
      "Grow your local SEO with our free keyword research tool! Find focused keywords for your city or niche and get ahead of competitors with ease.",
    category: "keywords",
    cta: "trial",
    button: "Research keywords",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Find the Searches That Bring in Local Customers",
        body: "When you run a small business, being found by people nearby is everything. A focused approach to local search helps you do exactly that. By targeting the search terms used in your area, you can stand out in a crowded market and reach people who are actively looking for what you offer.",
      },
      {
        heading: "Why Local Search Matters",
        body: "Picture a customer searching for your exact service, but your business never shows up because it isn't set up for their location. That's a lost sale. Targeting location-specific phrases makes sure your site appears when it counts. Whether you run a bakery in Boise or a contracting firm in Charlotte, matching your content to what locals type can change your results.",
      },
      {
        heading: "Start Small, Win Big",
        body: "You don't need a big budget to compete. Local keyword research helps you spot high-impact terms without the guesswork. Combine those insights with useful content and an easy-to-use website, and you'll build trust and visibility in your community. Your next customer may be one search away.",
      },
    ],
    faqs: [
      {
        q: "Why should I focus on local keywords?",
        a: "Local keywords connect you with people searching in your area. Someone typing 'coffee shop near me' or 'plumber in Seattle' is usually ready to buy or visit. Targeting these terms reaches people at the right moment, which brings more calls and visits than broad keywords that attract clicks from people you can't serve.",
      },
      {
        q: "How does the tool decide which keywords to suggest?",
        a: "It groups ideas by intent: ready-to-buy searches, 'near me' searches, research questions and seasonal terms, built around your service and city. It doesn't pull live search volumes, so treat the list as a starting point and check promising terms in Google autocomplete or a volume tool before you commit.",
      },
      {
        q: "Can I use it for several locations?",
        a: "Yes. Run it once per city or area you serve. Comparing the lists side by side is a quick way to see which terms are worth a dedicated page in each market.",
      },
    ],
  }),
  ai({
    slug: "local-business-keyword-planner",
    name: "Local Business Keyword Planner",
    title: "Local Business Keyword Planner",
    description:
      "Find the best local keywords for your business with our free planner! Enter your location and niche to get SEO ideas that bring in customers.",
    category: "keywords",
    cta: "trial",
    button: "Plan keywords",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Plan Your Local Keywords with Purpose",
        body: "For a small business, being found online by nearby customers can make or break growth. A deliberate approach to local search helps. When you focus on terms tied to your location, you connect with people who are actively looking for what you offer in their own area.",
      },
      {
        heading: "Why Local Search Matters",
        body: "Think of someone looking for a plumber or a cozy café in their town. They don't search with vague terms, they use phrases tied to their city or neighborhood. Shaping your content around those searches is essential, and a planner that maps keywords to pages saves you hours of guessing so you can get back to running your business.",
      },
      {
        heading: "Start Small, Win Big",
        body: "A big marketing budget isn't required. With the right plan, even a modest website can rank for niche, area-specific searches. Prioritize phrases that reflect what makes you different and where you work, and you'll build a steady flow of local visitors who turn into real customers.",
      },
    ],
    faqs: [
      {
        q: "Why are local keywords so important?",
        a: "They help you appear when nearby customers search for services like yours. Someone typing 'best pizza in Denver' is ready to buy. If your website or Google profile uses that phrase, you're more likely to show up. This planner surfaces those specific terms so you don't waste effort on broad keywords that rarely convert.",
      },
      {
        q: "How should I use the plan?",
        a: "Each keyword comes with a suggested home: your homepage, a service page, a location page or a blog/FAQ post. Work through it page by page, putting the main phrase in the title, heading and first paragraph. Treat it as a planning guide rather than live search data.",
      },
      {
        q: "Can I plan keywords for multiple locations?",
        a: "Yes. Run the planner once for each area you target. If you have several branches or serve different cities, a separate plan per market keeps every page relevant to its local audience.",
      },
    ],
  }),
  calc({
    slug: "local-keyword-density-checker",
    name: "Local Keyword Density Checker",
    title: "Local Keyword Density Checker",
    description:
      "Sharpen your SEO with our Local Keyword Density Checker! See how often your keyword appears in your content and avoid stuffing. Built for local businesses!",
    category: "keywords",
    cta: "trial",
    calculator: "keyword-density",
    article: [
      {
        heading: "Check Your Keyword Balance Before You Publish",
        body: "Whether you run a local business or handle SEO for clients, getting your copy right matters. One factor worth checking is how often your target phrase shows up. Use it too much and the text reads like keyword stuffing; use it too little and search engines may not connect the page with the search. A quick density check helps you find the middle ground.",
      },
      {
        heading: "Why Keyword Balance Matters",
        body: "Search engines reward content that reads naturally and helps the reader. For local businesses, that means working in location terms without forcing them. A keyword density checker shows the numbers at a glance (total words, keyword uses and percentage) and warns you when the copy might look over-optimized.",
      },
      {
        heading: "Built for Local Pages",
        body: "Whether you own a small shop or work in SEO full time, optimizing local pages shouldn't be guesswork. Paste your text, pick your phrase and adjust until it reads well and sits in a healthy range.",
      },
    ],
    faqs: [
      {
        q: "What is keyword density, and why does it matter for local SEO?",
        a: "Keyword density is how much of your text is made up of a keyword, as a percentage of the total word count. It helps search engines understand what a page is about, including location-specific searches. Too low and the page may not rank for the phrase; too high and it looks spammy. This checker flags anything outside a natural 0.5–3% range.",
      },
      {
        q: "How does the tool spot keyword stuffing?",
        a: "It counts whole-word, case-insensitive matches of your phrase and multiplies by the number of words in it. If that share goes over 3% of your total words, you'll see a warning so you can tone it down before publishing.",
      },
      {
        q: "Can I check several keywords at once?",
        a: "Not at the moment. The checker looks at one keyword or phrase at a time to keep the feedback clear. To check another, just swap the keyword field; the results update as you type.",
      },
    ],
  }),

  /* ───────────── Rankings & visibility ───────────── */
  calc({
    slug: "google-maps-visibility-score-calculator",
    name: "Google Maps Visibility Score Calculator",
    title: "Google Maps Visibility Score Calculator",
    description:
      "Grow your local presence! Work out your Google Maps visibility score and get clear pointers to improve your business ranking today.",
    category: "rankings",
    cta: "estimate",
    calculator: "visibility-score",
    article: [
      {
        heading: "See How Visible You Are on Google Maps",
        body: "For a local business, appearing prominently on Google Maps can change everything. Huge numbers of people search for nearby services every day, and being easy to find is often the difference between a new customer and a missed one. A visibility score shows you where you stand, because having a pin on the map isn't the same as standing out when it counts.",
      },
      {
        heading: "Why Visibility Drives Local Success",
        body: "Where you appear on the map isn't random. Consistent business details, customer reviews, a well-stocked photo gallery and regular activity all influence how often you show up in local searches. Businesses that keep these in good shape tend to get more clicks, calls and visits. Scoring yourself on each one shows you exactly what to work on next, whether that's collecting reviews or posting more often.",
      },
    ],
    faqs: [
      {
        q: "What goes into the visibility score?",
        a: "Four things: whether your name, address and phone are consistent across the web (30%), your number of reviews (30%, full marks at 50), photos on your profile (20%, full marks at 20) and how often you publish Google Posts (20%). Consistency and reviews carry the most weight because they shape both customer trust and how Google ranks you.",
      },
      {
        q: "How can I raise a low score?",
        a: "Start with the input that's furthest from full marks. Fix any mismatched listings, ask happy customers for reviews, add fresh photos and publish a Google Post every week. The score updates instantly, so you can see how much each change would move it.",
      },
      {
        q: "Is this tool free, and how accurate is it?",
        a: "It's completely free. The weights are based on widely accepted local ranking factors, not Google's actual algorithm, which isn't public. Treat it as a practical guide for prioritizing your work rather than an exact prediction.",
      },
    ],
  }),
  calc({
    slug: "google-maps-visibility-estimator",
    name: "Google Maps Visibility Estimator",
    title: "Google Maps Visibility Estimator for Local Businesses",
    description:
      "Grow your local presence with our Google Maps Visibility Estimator! Enter a few business details to get a score and see how to stand out on Google Maps.",
    category: "rankings",
    cta: "estimate",
    calculator: "visibility-estimator",
    article: [
      {
        heading: "Estimate Your Reach on Google Maps",
        body: "For small businesses, showing up on Google Maps can transform the week. Picture someone searching for a nearby coffee shop or plumber; being visible at that moment is often the difference between a sale and being skipped. An estimator gives you a feel for your local search potential. There's no secret code involved, just an understanding of the basics that help you appear for nearby searchers.",
      },
      {
        heading: "Why Local Visibility Matters",
        body: "When people search for services in their area, Google weighs things like customer feedback, profile completeness and how close you are to the searcher. A well-kept presence brings in visits and builds trust before a customer ever meets you. Estimating where you stand reveals quick wins, maybe a few more reviews or a fuller profile, and those small steps add up.",
      },
      {
        heading: "Take Charge of Your Local Reach",
        body: "Don't leave being found to chance. A quick estimate gives you clarity and direction so you can focus on what matters most. Start today, adjust a few things, and become the go-to name in your area.",
      },
    ],
    faqs: [
      {
        q: "How is the visibility estimate calculated?",
        a: "It blends four inputs: your review count (30%, full marks at 100 reviews), average rating (25%), profile completeness (25%) and how close you are to where people search (20%). Each is weighted to reflect its typical impact on map visibility. It isn't connected to live Google data.",
      },
      {
        q: "Can this tool guarantee a better Google Maps ranking?",
        a: "No. Google's ranking system is complex and changes often. What you get is a consistent benchmark and a clear view of which inputs are holding you back, like a low review count or an incomplete profile. Use it as a guide, keep improving and re-check over time.",
      },
      {
        q: "Why does proximity affect the estimate?",
        a: "Distance between the searcher and the business is one of Google's core local ranking signals. A business in the city center naturally appears for more nearby searches than one on the outskirts. You can't move your address, but you can compensate with stronger reviews and a complete profile.",
      },
    ],
  }),
  ai({
    slug: "local-search-visibility-analyzer",
    name: "Local Search Visibility Analyzer",
    title: "Local Search Visibility Analyzer",
    description:
      "Grow your local SEO! Use our free Local Search Visibility Analyzer to see how visible your business is in local results and how to improve.",
    category: "rankings",
    cta: "estimate",
    button: "Analyze visibility",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Understand How Visible You Are in Local Search",
        body: "If you run a small business, being noticed by nearby customers is everything. Many owners underestimate how much their online presence affects walk-ins and calls. Analyzing your visibility in location-based results reveals opportunities you might be missing, whether you run a coffee shop in Seattle or a plumbing company in Miami.",
      },
      {
        heading: "Why Local Visibility Matters",
        body: "When someone searches for a service 'near me', search engines favor businesses with strong local signals: a complete profile, consistent details across directories and positive reviews. If your footprint isn't in shape, you're likely losing customers who are ready to buy. A quick review of where you stand often turns up simple fixes, like mentioning your city on your website or claiming a listing.",
      },
      {
        heading: "Take Control of Your Online Presence",
        body: "Don't let competitors take your local customers. By looking at how discoverable your business is, you can take practical steps to improve. Run a free analysis today and see how small changes lead to real wins with the people right around the corner.",
      },
    ],
    faqs: [
      {
        q: "How accurate is the Local Search Visibility Analyzer?",
        a: "It doesn't pull live search results. Instead it applies well-known local SEO factors to your business type and location to show what drives visibility, what's likely holding you back and how to track progress. Treat it as a starting point; for the full picture, check your real rankings over time.",
      },
      {
        q: "What do I need to enter?",
        a: "Just your business type or main service and your location. The more specific you are (for example 'emergency plumber' rather than 'contractor'), the more relevant the advice will be.",
      },
      {
        q: "How can I improve my local search visibility?",
        a: "Start with the basics: claim and complete your Google Business Profile, make sure your website clearly states your location and services, and get listed on directories like Yelp with identical details. Keep your information consistent everywhere and ask happy customers for reviews; both make a real difference.",
      },
    ],
  }),
  calc({
    slug: "local-ranking-calculator",
    name: "Local Ranking Calculator",
    title: "Local Ranking Calculator",
    description:
      "Estimate how your business could rank locally with our free tool. See how reviews, listings and your profile affect your score, and what to improve!",
    category: "rankings",
    cta: "estimate",
    calculator: "ranking",
    article: [
      {
        heading: "Estimate Your Local Ranking Potential",
        body: "For a local business, appearing in search results can decide how busy you are. Customers search for nearby services on Google, and where you show up depends on a mix of factors, from your online presence to customer feedback. A ranking calculator gives you a clear view of what's working and what isn't.",
      },
      {
        heading: "Why Local Search Matters",
        body: "Local search isn't only about being found; it's about reaching people who are ready to buy. A strong Google Business Profile with accurate hours and details helps, and so does a steady flow of reviews. But how do you know if the pieces fit together? Calculating your ranking potential shows the gaps, maybe your site isn't mobile-friendly or you're missing citations around the web.",
      },
      {
        heading: "Take Control of Your Visibility",
        body: "Knowing your position lets you make smart changes. Whether it's polishing your profile or improving your website, small tweaks can bring big gains. Check your standing today and start climbing toward more customers in your area.",
      },
    ],
    faqs: [
      {
        q: "How accurate is this Local Ranking Calculator?",
        a: "No tool can predict exact Google rankings. This calculator weights the factors that matter most locally: profile completeness, review count, average rating, citations and a mobile-friendly website. It gives you a solid estimate of your potential. Use the score to guide your work and you'll usually see real improvements over time.",
      },
      {
        q: "Why do reviews and the Google Business Profile matter so much?",
        a: "Google favors businesses that look trustworthy and active. A complete profile with accurate information signals reliability, and plenty of good reviews builds credibility. That's why they carry the most weight here; they often decide whether you land in the top three map results or get pushed down the list.",
      },
      {
        q: "What should I do if my score is low?",
        a: "A low score just means there's room to grow. Improve the lowest inputs first: fill in missing profile details, ask happy customers for reviews and add your business to more directories. Small, steady actions can lift your score, and your visibility, within weeks.",
      },
    ],
  }),
  calc({
    slug: "local-search-volume-calculator",
    name: "Local Search Volume Calculator",
    title: "Local Search Volume Calculator",
    description:
      "Gauge local keyword demand with our free Local Search Volume Calculator. Enter a phrase and your market size to get a quick monthly search estimate!",
    category: "rankings",
    cta: "trial",
    calculator: "search-volume",
    article: [
      {
        heading: "Gauge Local Demand Before You Build a Page",
        body: "Whether you're a marketer or a small business owner, knowing roughly how often people search for a phrase in your area can shape your whole strategy. National trends only tell part of the story. Understanding demand in your own city helps you reach customers who are close by and ready to act.",
      },
      {
        heading: "Why Local Search Matters",
        body: "Local searches tend to carry strong intent. Someone typing 'coffee shop near me' or 'plumber in [city]' usually wants to act fast. A quick volume estimate helps you decide which phrases deserve a page or an ad, so you spend your time where it counts.",
      },
      {
        heading: "Beyond the Numbers",
        body: "No estimate is perfect without live data, but a simple calculator gives you a useful baseline for comparing phrases. Pair it with other local SEO work, like reviews and location-specific content, and you'll have a clear plan for standing out.",
      },
    ],
    faqs: [
      {
        q: "How accurate is this calculator?",
        a: "It's a rough, heuristic estimate rather than live search data. Shorter, broader phrases get a higher base volume, longer phrases a lower one, and the result is scaled by the size of your market. Use it to compare keywords against each other, not as an exact count.",
      },
      {
        q: "What affects the estimate?",
        a: "Two things: how many words are in the phrase (broad terms are searched far more than long, specific ones) and your market size, from a small town to a major metro. The range shown spans 40% below to 40% above the midpoint.",
      },
      {
        q: "Can I check several keywords at once?",
        a: "Not at the moment, but the result updates as you type, so you can try one phrase after another and compare them quickly.",
      },
    ],
  }),
  calc({
    slug: "google-maps-distance-calculator",
    name: "Google Maps Distance Calculator",
    title: "Google Maps Distance Calculator: Straight-Line Distance",
    description:
      "Work out the distance between two map points with our Google Maps Distance Calculator. Enter two sets of coordinates and get kilometers and miles instantly!",
    category: "rankings",
    cta: "trial",
    calculator: "distance",
    article: [
      {
        heading: "Measure the Distance Between Two Points",
        body: "Knowing how far apart two places are helps with everything from service-area planning to understanding why a competitor outranks you in a nearby suburb. Grab the coordinates from Google Maps, enter them here, and you'll get the straight-line distance in seconds.",
      },
      {
        heading: "Why Distance Matters for Local SEO",
        body: "Proximity is one of Google's core local ranking factors: the closer a business is to the searcher, the more likely it is to appear. Measuring the distance from your location to the neighborhoods you serve shows where you're naturally strong and where you'll need extra help from reviews, citations and location pages. It's also handy for setting a realistic service radius and planning trips between jobs.",
      },
    ],
    faqs: [
      {
        q: "How accurate is this distance calculator?",
        a: "It uses the haversine formula, which gives the great-circle ('as the crow flies') distance between two coordinates on the Earth's surface. That's very accurate for straight-line distance, but driving distance will be longer because roads aren't straight.",
      },
      {
        q: "Where do I find the coordinates?",
        a: "In Google Maps, right-click (or long-press on mobile) any spot on the map. The latitude and longitude appear at the top of the menu; click them to copy. Paste the first number into the latitude field and the second into longitude.",
      },
      {
        q: "Does it calculate driving time?",
        a: "No. It measures straight-line distance only. For turn-by-turn driving time, use the directions feature in Google Maps.",
      },
    ],
  }),

  /* ───────────── Citations & listings ───────────── */
  ai({
    slug: "local-citation-finder",
    name: "Local Citation Finder: Free Directory List for Your Business",
    title: "Local Citation Finder: Free Directory List for Your Business",
    description:
      "Enter your business type and city to get a free, prioritized list of directories and citation sites to get listed on: general, industry and local.",
    category: "citations",
    cta: "citations",
    button: "Find citation sites",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Get Listed Where Your Customers Look",
        body: "For a small business, being noticed online is half the battle. One of the smartest ways to boost visibility is to make sure your business details are accurate and present across online directories. It's not just about being found; it's about customers seeing the right details when they look you up.",
      },
      {
        heading: "Why Online Directories Matter",
        body: "Think about the last time you looked for a nearby restaurant or plumber. You probably used Yelp or an industry directory. These sites act as signposts that point customers to your door, but only if your information is there and correct. Missing or mismatched listings cost you customers, and a clear list of where to be listed helps you close those gaps.",
      },
      {
        heading: "Take Control of Your Local Presence",
        body: "Don't leave your online reputation to luck. Knowing which general, industry and local directories matter for your kind of business lets you claim the right listings first and build a stronger base for local SEO. It's a small step with a big payoff: more eyes on your business and more trust from search engines.",
      },
    ],
    faqs: [
      {
        q: "Why are local citations important?",
        a: "Citations, mentions of your business name, address and phone number on directories, are a key local SEO signal. They help Google confirm that your business is real and where it's located, which can lift your local rankings. Being listed in the right places also makes it easier for customers to find you, and consistency across listings builds trust with both people and search engines.",
      },
      {
        q: "What does NAP consistency mean?",
        a: "NAP stands for Name, Address and Phone number. Consistency means these details are written exactly the same everywhere you're listed. If your address appears one way on Yelp and another on Yellow Pages, or your phone number differs, it confuses search engines and customers and can hurt your rankings.",
      },
      {
        q: "How should I use the list?",
        a: "Work from the top. Claim or create your profile on each directory, using the exact same name, address and phone on every one. Many are free to join. Once the essentials are done, move on to the industry and local sites, and check back periodically to keep everything up to date.",
      },
    ],
  }),
  ai({
    slug: "citation-consistency-analyzer",
    name: "Citation Consistency Analyzer",
    title: "Citation Consistency Checker for Local SEO & NAP Accuracy",
    description:
      "Strengthen your local SEO with our Citation Consistency Analyzer! Check your business listings for mismatches and get a clear report to help your rankings.",
    category: "citations",
    cta: "citations",
    button: "Check NAP consistency",
    fields: [
      { name: "name", label: "Business name", placeholder: "e.g. Acme Plumbing", required: true, maxLength: 120 },
      { name: "address", label: "Address", placeholder: "e.g. 123 Main St, Austin, TX 78701", required: true, maxLength: 160 },
      { name: "phone", label: "Phone", placeholder: "e.g. (512) 555-0100", required: true, maxLength: 40 },
    ],
    article: [
      {
        heading: "Keep Your Business Details Consistent Everywhere",
        body: "For local businesses, appearing in search results can make or break the flow of customers. One factor that often gets overlooked is whether your business details match across directories. When your name, address or phone number varies from site to site, search engines struggle to trust your information, and that can push you down the local rankings.",
      },
      {
        heading: "Why Citation Accuracy Matters",
        body: "Think of each directory listing as a vote of confidence. If the votes don't agree, say one site lists '123 Main Street' and another '123 Main St.', Google may question your credibility. A consistency check points out the discrepancies that matter, saving you hours of manual comparison. Accurate details also mean customers get the right number and directions.",
      },
      {
        heading: "Take Control of Your Online Presence",
        body: "Don't let small errors cost you big opportunities. Auditing your listings regularly keeps your details aligned and builds trust with search engines and customers alike. A little effort here goes a long way toward getting noticed by people nearby.",
      },
    ],
    faqs: [
      {
        q: "Why do consistent citations matter for local SEO?",
        a: "Citations, your business name, address and phone number on directories, help search engines trust your information. When they don't match, like 'Street' versus 'St.', Google gets mixed signals and your local rankings can suffer. Keeping them uniform signals reliability and helps you appear in more local searches.",
      },
      {
        q: "What does the analyzer check?",
        a: "It takes the name, address and phone you enter, shows you one standard format to use everywhere, lists the common variations that cause mismatches, and tells you which directories to check and fix first.",
      },
      {
        q: "Can I check multiple business locations?",
        a: "The analyzer handles one location at a time. If you have several, run a separate check for each one so every location gets its own standard format.",
      },
    ],
  }),

  /* ───────────── Reviews & reputation ───────────── */
  calc({
    slug: "local-business-review-score-estimator",
    name: "Local Business Review Score Estimator",
    title: "Local Business Review Score Estimator",
    description:
      "Gauge your business's online reputation with our free tool! Enter your review count and rating to get a weighted score and see how you compare.",
    category: "reviews",
    cta: "reviews",
    calculator: "review-score",
    article: [
      {
        heading: "Understand Your Reputation with a Review Score Estimator",
        body: "Today, a lot of a business's success depends on what customers say about it online. Whether you run a small café or a busy retail shop, your ratings shape how new customers see you before they ever get in touch. A review score estimator gives you a quick, honest snapshot of where you stand.",
      },
      {
        heading: "Why Online Ratings Matter",
        body: "Think about the last time you chose a restaurant or service. You probably checked the reviews first; most people do. A high rating backed by plenty of reviews draws new customers in, while a thin or shaky record sends them elsewhere. Weighting your rating by how many reviews you have shows how convincing your reputation really looks.",
      },
      {
        heading: "Take Control of Your Story",
        body: "With a clear estimate in hand, you can celebrate what's working and tackle what isn't. Compare yourself with a competitor to see whether you're ahead or behind, then focus on earning more consistent, positive reviews.",
      },
    ],
    faqs: [
      {
        q: "How is the weighted score calculated?",
        a: "It uses a Bayesian average: your rating is blended with a neutral 4.0 as if you had 10 extra reviews at that level. With only a few reviews, your score is pulled toward 4.0; as your review count grows, it moves closer to your real average. It's a fairer picture of how trustworthy your rating looks.",
      },
      {
        q: "What if I enter a wrong number?",
        a: "Just edit the field; the result updates as you type. Ratings should be between 0 and 5 and review counts can't be negative.",
      },
      {
        q: "Why should I care about my review score?",
        a: "Your online reputation can make or break customer trust. A strong score tells people you're reliable, while a weaker one points to areas to work on. Checking it regularly helps you stay on top of how people see your business.",
      },
    ],
  }),

  /* ───────────── Audits & optimization ───────────── */
  ai({
    slug: "local-seo-audit-tool",
    name: "Local SEO Audit Tool",
    title: "Local SEO Audit Tool",
    description:
      "Lift your local search rankings with our free Local SEO Audit Tool! Get a detailed checklist of how your business is set up for local SEO in minutes.",
    category: "audit",
    cta: "diy",
    button: "Run audit",
    fields: [BUSINESS, LOCATION, { name: "website", label: "Website (optional)", placeholder: "e.g. example.com", maxLength: 120 }],
    article: [
      {
        heading: "Find Out What's Holding Your Local SEO Back",
        body: "For a local business, appearing in search results can make or break the month. Many owners don't realize how a few small changes to their online presence can bring in more nearby customers. A thorough audit of your local search setup works like a roadmap to getting noticed by the right people at the right time.",
      },
      {
        heading: "Why Local Search Matters",
        body: "When someone nearby searches for what you offer, you want to be the first name they see. A large share of local searches lead to a visit or purchase within a day. If your website isn't set up well or your business profile is missing key details, you're probably losing those customers. Auditing your local presence uncovers the gaps, from slow pages to incomplete listings, so you can fix them quickly.",
      },
      {
        heading: "Take the First Step",
        body: "Don't let competitors take the spotlight. Checking your local setup reveals opportunities to connect with your community. It's not just about rankings; it's about earning trust and bringing in real business.",
      },
    ],
    faqs: [
      {
        q: "What does this Local SEO Audit Tool check?",
        a: "It covers the areas that drive local rankings: your Google Business Profile, your website's on-page setup, your citations and NAP consistency, your reviews and how you compare with competitors. Each item comes with a short note on how to check or fix it, tailored to your business type and location.",
      },
      {
        q: "How should I use the results?",
        a: "Go through the list and tick off what you've already done. Anything you haven't done is a to-do. Start with your Google Business Profile and reviews, since they usually move rankings fastest, then work through the website and citation items.",
      },
      {
        q: "Do I need technical skills to use this tool?",
        a: "No. Enter a few basic details and you'll get a plain-English checklist with simple next steps. Nothing requires code, and most fixes take minutes.",
      },
    ],
  }),
  ai({
    slug: "local-seo-checker",
    name: "Local SEO Checker",
    title: "Local SEO Checker",
    description:
      "Check your local SEO with our free tool! See what affects how your business ranks in Google's local results and get tips to improve visibility.",
    category: "audit",
    cta: "diy",
    button: "Check my local SEO",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Get a Quick Health Check of Your Local SEO",
        body: "When you run a small business, being noticed by nearby customers is everything. Many owners don't realize how much their online presence affects walk-ins and calls. A local SEO check works like a digital consultant, showing you where you stand on Google and what to fix first.",
      },
      {
        heading: "Why Local Search Matters",
        body: "When someone nearby searches for what you sell, Google tends to favor businesses in their area. Appearing in those results, especially the map section, can make your day. A quick check reveals missed opportunities, from an unclaimed profile to a lack of reviews, and a few changes can be enough to climb the rankings.",
      },
      {
        heading: "Take Control of Your Visibility",
        body: "Don't leave your online presence to chance. Checking how you stand in local search lets you make targeted, sensible changes, whether that's updating your business details or asking happy clients for reviews. Knowing your starting point is the key to growing your reach close to home.",
      },
    ],
    faqs: [
      {
        q: "What does this Local SEO Checker look at?",
        a: "It focuses on the essentials that decide whether you appear in Google's local results and map pack: a claimed and complete Google Business Profile, consistent business details, reviews, citations and on-site signals. You'll get must-fix basics, ranking factors to verify and easy improvements for your business type and city.",
      },
      {
        q: "Do I need technical SEO skills?",
        a: "Not at all. It's built for business owners. Enter your service and location and you'll get a short, jargon-free list of actions you can take yourself.",
      },
      {
        q: "How accurate are the results?",
        a: "The checker doesn't run live Google searches, because results vary by searcher and change constantly. It applies proven local SEO factors to your business so you can prioritize improvements. To see your actual positions over time, track your rankings on a geo-grid.",
      },
    ],
  }),
  ai({
    slug: "google-business-profile-optimizer",
    name: "Google Business Profile Optimizer",
    title: "Free Google Business Profile Optimizer for Local SEO",
    description:
      "Improve your Google Business Profile with our free optimizer tool. Get practical, prioritized tips to boost your local search visibility!",
    category: "audit",
    cta: "diy",
    button: "Get optimization tips",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Get More from Your Google Business Profile",
        body: "For small business owners, standing out in local search can decide how many customers walk through the door. A strong presence starts with a polished Google Business Profile, the front door that nearby customers use to find you. But how do you know if your listing is pulling its weight? That's where a dedicated optimizer helps.",
      },
      {
        heading: "Why Local SEO Matters",
        body: "When someone searches 'near me', Google favors businesses with complete, up-to-date profiles. A detailed description, quality photos and regular updates tell the algorithm you're active and relevant. Yet many owners skip these details and miss out on calls and visits. An optimizer walks through each factor and tells you what to fix, from adding photos to choosing a better category.",
      },
      {
        heading: "Take Control of Your Visibility",
        body: "Don't leave your local ranking to chance. Using a tool built to improve your listing is a proactive step toward reaching your community, and a simple way to make sure your business shows well in every search.",
      },
    ],
    faqs: [
      {
        q: "Why should I optimize my Google Business Profile?",
        a: "Your profile is often the first thing potential customers see when they search for local services. A complete profile with detailed information, photos and recent posts significantly improves your chances of ranking higher in local results. Think of it as your digital storefront; if it looks incomplete or outdated, people move on to a competitor.",
      },
      {
        q: "What kind of tips will I get?",
        a: "Tips are grouped into quick wins you can do today, profile completeness, reviews and engagement, and ongoing monthly tasks. Each one includes a short note on why it matters, tailored to your business type and location.",
      },
      {
        q: "Can I use it for multiple locations?",
        a: "Yes. Run it once for each location you manage, entering that location's city or area. It's an easy way to keep every listing consistent while addressing what's specific to each one.",
      },
    ],
  }),
  ai({
    slug: "business-category-seo-analyzer",
    name: "Business Category SEO Analyzer",
    title: "Business Category SEO Analyzer for Local Growth",
    description:
      "Find SEO opportunities for your industry with our Business Category SEO Analyzer. Get tailored advice on categories, services and mistakes to avoid!",
    category: "audit",
    cta: "diy",
    button: "Analyze category",
    fields: [
      { name: "category", label: "Your Google Business Profile category", placeholder: "e.g. Plumber", required: true, maxLength: 120 },
      LOCATION_OPTIONAL,
    ],
    article: [
      {
        heading: "Make the Most of Your Business Category",
        body: "Standing out in your niche takes more than a website; it takes a deliberate approach to search. Whether you work in healthcare, retail or construction, understanding the specific challenges and openings in your field makes a real difference. A category analysis gives you clarity on how to win your audience's attention.",
      },
      {
        heading: "Why Industry-Specific SEO Matters",
        body: "Every business category has its own search patterns, from the words customers use to the services they look for. Your Google Business Profile category is one of the strongest local ranking signals, and the secondary categories and services you add decide which searches you can appear in. Getting them right, and avoiding common mistakes, can unlock visibility your competitors miss.",
      },
      {
        heading: "Take the First Step",
        body: "Growing online doesn't have to be guesswork. With insights specific to your niche, you'll know how to build a stronger presence. Start with your category today and watch your visibility grow.",
      },
    ],
    faqs: [
      {
        q: "How does the Business Category SEO Analyzer work?",
        a: "Enter your current Google Business Profile category and, optionally, your location. The analyzer suggests the best primary category, secondary categories worth adding, key services to list and the common category mistakes to avoid for your type of business.",
      },
      {
        q: "Is this tool suitable for small businesses?",
        a: "Absolutely. It breaks category strategy down into small, practical steps, so you can make changes in your profile in a few minutes, whether you run a bakery or a building firm.",
      },
      {
        q: "How often should I review my categories?",
        a: "Check them every few months and whenever you add or drop a service. Google also adds new categories over time, so a more specific one may become available for your business.",
      },
    ],
  }),
  ai({
    slug: "local-competitor-analysis-tool",
    name: "Local Competitor Analysis Tool",
    title: "Local Competitor Analysis Tool",
    description:
      "Find your edge in the local market with our free competitor analysis tool. Enter your business type and location to see how to beat nearby rivals!",
    category: "audit",
    cta: "competitors",
    button: "Analyze competitors",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Find Your Edge in the Local Market",
        body: "Running a small business is hard enough without competitors chasing the same customers. That's why understanding your local competition pays off. Taking a closer look at businesses in your niche nearby helps you spot ways to stand out and win more calls and visits. Start with the factors that usually tip the balance: reviews, profile quality and online visibility.",
      },
      {
        heading: "Why Local Insights Matter",
        body: "Whether you run a bakery in a small town or a gym in a big city, knowing what others nearby are doing can shape your next move. Maybe a rival has glowing reviews but a weak website, which is your chance to shine. A structured competitor checklist gives you a quick view of the local landscape without hours of research, so you can improve your offer, your customer experience and your share of the neighborhood market.",
      },
    ],
    faqs: [
      {
        q: "Does the tool pull real competitor data?",
        a: "No. It doesn't scrape live data. It gives you a structured plan for your business type and location: what to compare, where competitors usually win, gaps you can exploit and where to look. Pair it with a quick incognito search of the map pack to fill in the real names and numbers.",
      },
      {
        q: "Does it work for any business category or location?",
        a: "Yes. It works for a wide range of businesses, from restaurants to trades, in cities and smaller towns. The more specific your business type, the more relevant the advice.",
      },
      {
        q: "What should I compare first?",
        a: "Start with review count and rating, then Google Business Profile completeness. They're the easiest gaps to measure and often the fastest to close. After that, look at service pages and citations.",
      },
    ],
  }),
  calc({
    slug: "local-seo-checklist-tool",
    name: "Local SEO Checklist Tool",
    title: "Local SEO Checklist Tool",
    description:
      "Climb local search with our free Local SEO Checklist Tool! Tick off the essential tasks and watch your progress update instantly. Made for small businesses.",
    category: "audit",
    cta: "trial",
    calculator: "seo-checklist",
    article: [
      {
        heading: "Work Through Local SEO One Step at a Time",
        body: "For a small business, being found by local customers online is everything. Many owners overlook how much local search optimization can do, yet it's one of the most direct ways to reach nearby people who are ready to buy. A clear checklist makes it easier to stand out on Google Maps and in 'near me' searches.",
      },
      {
        heading: "Why Local Search Matters",
        body: "Imagine someone in your town searching for exactly what you offer, and your business doesn't appear because your presence isn't set up for local search. That's a lost customer. Focusing on the key tasks, like claiming your Google profile, adding location details to your site and getting listed in directories, helps you reach that audience. It isn't complicated; it's about ticking the right boxes.",
      },
      {
        heading: "Start Small, Win Big",
        body: "You don't need a big budget or a marketing team to improve your rankings. Steady work on the essentials can make your business the local go-to. Take it one step at a time, track what you've done and watch your reach grow.",
      },
    ],
    faqs: [
      {
        q: "Why does local SEO matter for a small business?",
        a: "Local SEO helps you appear when nearby customers search for what you sell. Most people looking for a local shop or service type something like 'coffee shop near me'. If you're not optimized for local search, those customers find someone else. This checklist walks you through the steps to be visible when it counts.",
      },
      {
        q: "Do I need technical skills to use the checklist?",
        a: "No. Each task is written in plain language and checking it off is a single click. No code or jargon required; just work through the list.",
      },
      {
        q: "How long until I see results?",
        a: "It depends on your starting point and how competitive your area is. Claiming and completing your Google profile can help within days or weeks. Building citations and reviews usually takes a month or two to show. Keep working through the list and the calls will follow.",
      },
    ],
  }),

  /* ───────────── Content & branding ───────────── */
  ai({
    slug: "local-business-name-generator",
    name: "Local Business Name Generator",
    title: "Local Business Name Generator",
    description:
      "Stuck naming your local business? Use our free generator to get original, catchy name ideas for your café, salon or shop in minutes!",
    category: "content",
    cta: "trial",
    button: "Generate name ideas",
    fields: [
      { name: "business", label: "What does your business do?", placeholder: "e.g. mobile car detailing", required: true, maxLength: 120 },
      LOCATION_OPTIONAL,
      { name: "vibe", label: "Style (optional)", placeholder: "e.g. modern, friendly, premium", maxLength: 60 },
    ],
    article: [
      {
        heading: "Finding the Right Name for Your Local Business",
        body: "Starting a business is exciting, but choosing a name can feel like a roadblock. A great name captures what you do, connects with your community and sticks in people's heads. A name generator takes the pressure off, giving you a list of suggestions shaped by your service, your style and where you're based.",
      },
      {
        heading: "Why a Good Name Matters",
        body: "Think of the local shops you remember best. Chances are their names paint a picture or spark curiosity. For neighborhood businesses, a name with a local touch builds instant familiarity, whether you're opening a barbershop in Brooklyn or a diner in Austin. Pair that with a style that fits, sleek and modern or warm and friendly, and you're onto something.",
      },
      {
        heading: "Tips for Choosing",
        body: "When you pick from the ideas, say them out loud. Do they roll off the tongue? Ask friends what they think, and always check the name isn't already taken. With a bit of creativity, naming your business can be the fun part.",
      },
    ],
    faqs: [
      {
        q: "How does the name generator work?",
        a: "Tell it what your business does, plus your location and preferred style if you like. It combines words related to your service, your area and your style into name ideas grouped as professional, catchy, location-based and premium, each with a short note on why it works.",
      },
      {
        q: "Are the names guaranteed to be available?",
        a: "No. We can't check whether a name is already in use or trademarked. Before you commit, search for the domain, check your local business registry and run a trademark search. It's a small step that saves headaches later.",
      },
      {
        q: "Does it work for any type of business?",
        a: "Yes. Whether you're opening a bakery, a plumbing company or a salon, the generator adapts to what you enter. For very niche businesses, the style field helps fine-tune the results.",
      },
    ],
  }),
  ai({
    slug: "local-business-description-generator",
    name: "Local Business Description Generator",
    title: "Local Business Description Generator",
    description:
      "Write persuasive, SEO-friendly descriptions for your local business with our free generator. Stand out online in just a few clicks!",
    category: "content",
    cta: "trial",
    button: "Generate descriptions",
    fields: [BUSINESS, LOCATION, { name: "highlights", label: "Key highlights (optional)", placeholder: "e.g. 24/7, family-owned, free quotes", maxLength: 160 }],
    article: [
      {
        heading: "Stand Out with a Strong Business Description",
        body: "For small business owners, standing out online can feel like an uphill climb. With so many competitors chasing attention, a well-written description makes a difference. It isn't only about telling people who you are; it's about making sure they find you when they search for services in your area.",
      },
      {
        heading: "Why Descriptions Matter for Small Businesses",
        body: "A strong description does more than list what you do. It's a first handshake with potential customers and it helps search engines link you to local searches. Whether you're a plumber in Peoria or a bakery in Boise, the right words attract the nearby people who need exactly what you offer.",
      },
      {
        heading: "Tell Your Story, Win Your Crowd",
        body: "Writing that perfect blurb doesn't have to be hard. A generator helps you highlight what makes you special, whether that's fast service or a hometown feel, so you can paste it into your profiles and watch your visibility grow.",
      },
    ],
    faqs: [
      {
        q: "How does this tool help with local SEO?",
        a: "The descriptions naturally mention your service and location, two things search engines look for when matching businesses to local searches. Using them in your Google Business Profile, website and directory listings helps you show up for nearby customers who are looking for what you offer.",
      },
      {
        q: "Can I get a different tone or style?",
        a: "Yes. You'll get three options with different angles (trust, value and community), so you can pick the one that sounds most like you. Change your highlights and generate again for more variations.",
      },
      {
        q: "Is it really free? Are there limits?",
        a: "It's completely free with no catch. Generate as many descriptions as you like and experiment with different inputs.",
      },
    ],
  }),
  ai({
    slug: "local-seo-content-idea-generator",
    name: "Local SEO Content Idea Generator",
    title: "Local SEO Content Idea Generator",
    description:
      "Running low on local content ideas? Use our free Local SEO Content Idea Generator to brainstorm fresh topics tailored to your business and area!",
    category: "content",
    cta: "trial",
    button: "Generate content ideas",
    fields: [BUSINESS, LOCATION],
    article: [
      {
        heading: "Fill Your Calendar with Local Content Ideas",
        body: "Every small business owner knows how hard it is to stand out in their community. Content that speaks directly to local people isn't a nice extra; it builds trust and brings in customers. A local content idea generator keeps the ideas flowing so you can connect with the people around you, from families looking for a nearby diner to professionals searching for a trusted service.",
      },
      {
        heading: "Why Local Content Matters",
        body: "When you mention your city, neighborhoods or local events, you're not just publishing, you're joining a conversation. A blog post about a local issue or a guide built around your area can do wonders for visibility. Generated ideas give you a mix of how-to guides, community pieces, comparisons and seasonal topics that your audience actually cares about. Create content that feels personal and rooted in your area, and your audience will notice.",
      },
    ],
    faqs: [
      {
        q: "How does this tool come up with ideas?",
        a: "It combines your business type and location with proven local content formats: how-to guides, local and community pieces, comparisons and buyer guides, and seasonal topics. Each idea comes with a short note on the angle and who it attracts.",
      },
      {
        q: "Does it work for any type of business?",
        a: "Yes. Whether you run a café, a law firm or a trade business, the ideas adapt to your service and pair it with a local angle so they feel relevant to your audience.",
      },
      {
        q: "Are the ideas ready to publish?",
        a: "They're starting points. Each one gives you a title and an angle, but you'll want to add your own expertise, examples and voice to make the piece genuinely useful and yours.",
      },
    ],
  }),
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsInCategory(id: ToolCategoryId): Tool[] {
  return tools.filter((t) => t.category === id);
}
