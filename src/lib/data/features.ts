import type { RankValue } from "@/components/rank-grid";

/* ------------------------------------------------------------------ */
/* /features                                                           */
/* ------------------------------------------------------------------ */

export type FeatureViz = "posts" | "reviews" | "listings" | "scan" | "ai" | "checkup" | "brand";

export type FeatureRow = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  check: string;
  note?: string;
  link: { label: string; href: string };
  viz: FeatureViz;
};

export const featureRows: FeatureRow[] = [
  {
    id: "posts",
    eyebrow: "Google Business Profile",
    title: "Google posts, 3× a week",
    text: "Your agent writes updates about your deals, news, and recent photos, then publishes them for you. Google sees a business that is open and busy.",
    check: "Your profile stays fresh, and you never lift a finger.",
    link: { label: "See plans", href: "/pricing" },
    viz: "posts",
  },
  {
    id: "reviews",
    eyebrow: "Reviews",
    title: "More reviews, faster replies",
    text: "Ask for reviews with a short link or a QR code. Happy customers land on Google. Unhappy ones reach you first. Your agent drafts every reply with AI.",
    check: "More 5-star reviews, the strongest trust signal on the map.",
    note: "Email review campaigns are part of the Growth plan.",
    link: { label: "See plans", href: "/pricing" },
    viz: "reviews",
  },
  {
    id: "listings",
    eyebrow: "Listings",
    title: "500+ listings, top ones by hand",
    text: "Your agent gets you on 500+ sites in your first month. Our team places the most important ones by hand every month. You get the login for each.",
    check: "The same name, address, and phone everywhere Google checks.",
    link: { label: "How it works", href: "/local-business" },
    viz: "listings",
  },
  {
    id: "rank-tracking",
    eyebrow: "Rank tracking",
    title: "See where you rank on the map",
    text: "Each week, your agent checks your rank from 49 spots around your business. You see the result as a color map. Green means top 3.",
    check: "Proof that you are climbing, one spot at a time.",
    link: { label: "See the rank tracker", href: "/rank-tracker" },
    viz: "scan",
  },
  {
    id: "ai-search",
    eyebrow: "AI search",
    title: "Show up in AI answers",
    text: "More people now ask ChatGPT and Google AI to recommend a local business. We check what they say about you and help you get mentioned more.",
    check: "Get found where search is heading next.",
    note: "AI visibility tracking is part of the Growth plan.",
    link: { label: "See plans", href: "/pricing" },
    viz: "ai",
  },
  {
    id: "checkup",
    eyebrow: "Profile checkup",
    title: "A profile checkup every month",
    text: "Your agent looks over your Google profile for problems, like missing hours or weak categories. Then it fixes everything it can.",
    check: "Nothing on your profile holds you back.",
    link: { label: "See plans", href: "/pricing" },
    viz: "checkup",
  },
  {
    id: "agencies",
    eyebrow: "For agencies",
    title: "White-label for agencies",
    text: "Run everything under your own brand: your logo, your colors, and your domain. Emails come from your address. Clients see you, not us.",
    check: "Sell local SEO at your own price and keep the margin.",
    link: { label: "See agency features", href: "/agencies" },
    viz: "brand",
  },
];

export const listingChips = ["Apple Maps", "Bing", "Yelp", "BBB", "Foursquare", "Yellow Pages"];

export const checkupItems = ["Hours", "Photos", "Services", "Categories"];

/** 5×5 tones for the small heat-map tile on /features (rows top → bottom). */
export const featureScanTones = [
  ["mid", "mid", "good", "mid", "bad"],
  ["mid", "good", "good", "good", "mid"],
  ["good", "good", "good", "good", "good"],
  ["mid", "good", "good", "good", "mid"],
  ["bad", "mid", "good", "mid", "mid"],
] as const;

/* ------------------------------------------------------------------ */
/* /rank-tracker                                                       */
/* ------------------------------------------------------------------ */

/** Where every "try the rank tracker" button points. */
export const rankTrackerSignupHref = "/pricing";

export type ScanSnapshot = { date: string; longDate: string; grid: RankValue[][] };

export type DemoScan = {
  id: string;
  label: string;
  keyword: string;
  business: string;
  days: number;
  before: ScanSnapshot;
  after: ScanSnapshot;
};

const N = null; // not in the top 20 ("20+")
const rows = (s: string): RankValue[][] => s.split("/").map((r) => r.trim().split(/\s+/).map((v) => (v === "N" ? N : Number(v))));
const repeat = (row: string, times: number) => Array.from({ length: times }, () => row).join(" / ");

export const demoScans: DemoScan[] = [
  {
    id: "dealer",
    label: "Used car dealer",
    keyword: "used cars osage ia",
    business: "Used car dealer · Le Roy, MN",
    days: 35,
    before: {
      date: "Jul 10",
      longDate: "July 10, 2026",
      grid: rows(
        `${repeat("N N N N N N N", 3)} / ${repeat("3 3 2 2 2 2 2", 3)} / 3 3 3 2 2 2 2`,
      ),
    },
    after: {
      date: "Aug 14",
      longDate: "August 14, 2026",
      grid: rows(`N N 3 3 3 3 3 / N 3 3 3 3 3 3 / 3 3 3 3 3 3 3 / ${repeat("2 2 2 2 2 2 2", 4)}`),
    },
  },
  {
    id: "flooring",
    label: "Flooring contractor",
    keyword: "subfloor repair roswell ga",
    business: "Flooring contractor · Atlanta, GA",
    days: 33,
    before: {
      date: "Jul 15",
      longDate: "July 15, 2026",
      grid: rows("6 4 3 4 5 / 5 2 2 2 4 / 5 3 2 3 5 / 6 5 2 3 8 / 7 8 7 9 7"),
    },
    after: {
      date: "Aug 17",
      longDate: "August 17, 2026",
      grid: rows("2 1 1 1 1 / 2 1 2 2 1 / 3 2 1 1 1 / 4 2 1 1 5 / 6 6 7 8 8"),
    },
  },
  {
    id: "inspector",
    label: "Home inspector",
    keyword: "home inspection new orleans",
    business: "Home inspector · Marrero, LA",
    days: 59,
    before: {
      date: "Jun 19",
      longDate: "June 19, 2026",
      grid: rows(
        "6 4 4 4 4 4 4 / 5 4 3 2 2 3 4 / 6 3 2 2 1 2 3 / 5 4 2 3 1 2 4 / 5 5 3 2 2 3 3 / 6 5 5 7 4 5 5 / 7 6 5 5 5 5 6",
      ),
    },
    after: {
      date: "Aug 17",
      longDate: "August 17, 2026",
      grid: rows(
        "4 3 2 2 2 2 3 / 4 2 2 2 2 2 3 / 4 2 2 1 2 2 3 / 4 2 2 2 1 2 2 / 4 3 2 1 2 2 3 / 4 4 3 3 3 3 3 / 5 4 4 4 4 4 4",
      ),
    },
  },
];

export const rankSteps = [
  { title: "Pick a search and an area", text: "Enter the search you want to track and drop a pin. Choose any grid from 3×3 up to 15×15." },
  { title: "Run a scan", text: "Ranklit Grid checks your rank from every spot on the grid." },
  { title: "Track it over time", text: "Scan every week. Put any two scans side by side." },
];

export type RankFeatureIcon = "grid" | "repeat" | "chart" | "shield" | "pin";

export const rankFeatures: { icon: RankFeatureIcon; title: string; text: string }[] = [
  {
    icon: "grid",
    title: "Grid rank scans",
    text: "See your rank from every spot in your area. Each dot shows where you appear when someone searches from that point.",
  },
  { icon: "repeat", title: "Scans on autopilot", text: "Schedule weekly scans and watch your rank move over time. Nothing to do on your end." },
  { icon: "chart", title: "Trends over time", text: "Put two scans side by side. See where you climbed and where to focus next." },
  { icon: "shield", title: "White-label reports", text: "Create PDF reports with your own logo and colors. Ideal for agencies." },
  { icon: "pin", title: "Many locations", text: "Track every location from a single dashboard. Agencies can manage many clients in one account." },
];

export const rankFaqs = [
  {
    q: "What is a grid rank scan?",
    a: "It checks your Google Maps rank from a grid of points spread across your area. Instead of one rank from one place, you see how you rank from every direction, shown as a color map.",
  },
  {
    q: "How is Ranklit Grid related to Ranklit?",
    a: "Ranklit Grid is the rank tracker built by the Ranklit team. Ranklit customers get rank tracking included. Anyone can also use Ranklit Grid on its own.",
  },
  {
    q: "How often does Ranklit Grid scan?",
    a: "Rank scans run every week. Paid plans add more scan points and white-label reports you can send to clients.",
  },
  {
    q: "Can I use Ranklit Grid for client reports?",
    a: "Yes. It creates white-label PDF reports with your own logo. Agencies send them to clients every month as proof of progress.",
  },
  {
    q: "How often can I run scans?",
    a: "You can schedule scans daily, weekly, or monthly. Most businesses scan weekly so they can follow progress without burning through credits.",
  },
];

/* ------------------------------------------------------------------ */
/* /local-business + shared dashboard mockup                           */
/* ------------------------------------------------------------------ */

/** 7×7 sample scan for the dashboard mockup. 0 marks "your business" (center). */
export const dashboardGrid: number[][] = [
  [12, 1, 1, 4, 1, 1, 6],
  [1, 1, 1, 2, 1, 1, 1],
  [1, 1, 1, 1, 1, 2, 1],
  [5, 1, 1, 0, 1, 1, 5],
  [1, 2, 1, 1, 1, 1, 1],
  [1, 1, 1, 2, 1, 1, 1],
  [1, 1, 1, 4, 1, 1, 15],
];

export type LbIcon = "phone" | "hand" | "bot" | "trend" | "zap" | "pin";

export const lbReasons: { icon: LbIcon; title: string; text: string }[] = [
  {
    icon: "phone",
    title: "More calls, less effort",
    text: "You focus on your business while we handle your local SEO. More of the people searching nearby end up calling you.",
  },
  {
    icon: "hand",
    title: "Citations placed by hand",
    text: "Every month we build premium, high-authority citations, the trusted listings Google really counts. Other tools skip this.",
  },
  {
    icon: "bot",
    title: "Done for you, every day",
    text: "Google posts, AI review replies, and a monthly profile check-up with automatic fixes, all taken care of for you.",
  },
  {
    icon: "trend",
    title: "See your rankings climb",
    text: "Weekly geo-grid scans run on their own and show your real Google Maps visibility going up, right in your dashboard.",
  },
];

export const lbSteps: { icon: LbIcon; title: string; text: string }[] = [
  { icon: "zap", title: "Connect in 60 seconds", text: "Give us access to your Google Business Profile. That's all we need to get going." },
  { icon: "bot", title: "We do the work daily", text: "Posts, review replies, monthly check-ups, and citations placed by hand every month." },
  { icon: "pin", title: "You climb the map", text: "Weekly scans follow your rankings across your entire service area." },
  { icon: "phone", title: "Your phone rings", text: "More visibility in the map pack brings more calls from customers nearby." },
];

export const lbFaqs = [
  {
    q: "I'm not technical. Is this hard to set up?",
    a: "Not at all. You connect your Google Business Profile in about 60 seconds (you just approve an email) and we take it from there. No dashboards to learn and no SEO knowledge required.",
  },
  {
    q: "How fast will I see results?",
    a: "Rank tracking runs every week. If you are not climbing within 30 days, you get every dollar back.",
  },
  {
    q: "What exactly do you do each month?",
    a: "We optimize your Google Business Profile, publish Google posts, reply to your reviews, run a monthly profile check-up with automatic fixes, place premium citations by hand, and track your map rankings every week.",
  },
  {
    q: "Do I need a website?",
    a: "No. Ranklit works directly on your Google Business Profile and your citations, which is what drives the Google Maps results most local businesses care about.",
  },
  {
    q: "Is there a contract?",
    a: "No contracts. Simple monthly pricing from $99/mo, cancel anytime, plus a 30-day money-back ranking guarantee.",
  },
];
