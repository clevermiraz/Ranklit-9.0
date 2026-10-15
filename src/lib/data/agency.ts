export type IconTone = "pink" | "amber" | "violet" | "lilac" | "green" | "mint" | "lavender" | "gold";
export type AgencyIcon = "trending" | "pin" | "shield" | "hand" | "bot";

export type IconCard = { icon: AgencyIcon; tone: IconTone; title: string; text: string };

export const agencyProblems: IconCard[] = [
  {
    icon: "trending",
    tone: "pink",
    title: "It eats your margin",
    text: "Specialists, listings, and rank reports for each client. It's slow, hands-on work.",
  },
  {
    icon: "pin",
    tone: "amber",
    title: "Results are hit or miss",
    text: "Bulk auto-listings don't move rank. DIY tools still leave the real work with you.",
  },
  {
    icon: "shield",
    tone: "violet",
    title: "Clients want proof",
    text: "They expect clear rank reports and a promise you can actually back up.",
  },
];

export const agencyFixes: IconCard[] = [
  {
    icon: "pin",
    tone: "lilac",
    title: "Every client in one dashboard",
    text: "Up to 99 client locations on one plan. Approve posts, push listings, and track rank for all of them.",
  },
  {
    icon: "hand",
    tone: "mint",
    title: "Listings placed by hand",
    text: "Our team adds top listings for each client, every month. No need to staff it yourself.",
  },
  {
    icon: "bot",
    tone: "lavender",
    title: "Your brand on everything",
    text: "Your logo, your colors, your domain, your emails. Clients never see us.",
  },
  {
    icon: "shield",
    tone: "gold",
    title: "A guarantee you can resell",
    text: "Every client is covered by our 30-day money-back ranking guarantee. Sell it with confidence.",
  },
];

export const agencyValueCards: IconCard[] = [
  {
    icon: "bot",
    tone: "violet",
    title: "Keep your margin",
    text: "Wholesale, per-plan pricing. You set your own price to clients and keep the difference. No new hires.",
  },
  {
    icon: "hand",
    tone: "green",
    title: "White-label delivery",
    text: "Your logo and name on the dashboard, a client login on your domain, and emails from your address.",
  },
  {
    icon: "pin",
    tone: "violet",
    title: "Every client, one dashboard",
    text: "Up to 99 client locations on one plan. Approve posts, push listings, and track rank for all of them.",
  },
];

export const agencyCompareRows = [
  { label: "Cost", us: "From $99 per location", them: "Salaries and tools" },
  { label: "Listings by hand", us: "Every month, done for you", them: "Your team's hours" },
  { label: "Your brand", us: "Logo, domain, and emails", them: "Build it yourself" },
  { label: "Client locations", us: "Up to 99 on one plan", them: "Limited by headcount" },
  { label: "Ranking guarantee", us: "30 days, per client", them: "Not usually" },
];

export const agencySteps = [
  { title: "Add your clients", text: "Connect each Google profile. It takes about 60 seconds apiece." },
  { title: "The agent gets to work", text: "Posts, review replies, and listings for every client." },
  { title: "Show the results", text: "Rank reports go out under your brand." },
  { title: "Keep the margin", text: "Set your own price. No new hires needed." },
];

export const whiteLabelRows = [
  {
    title: "Set up your brand in minutes",
    text: "Upload your logo, choose your colors, and rename the whole dashboard after your agency. From then on your clients log in to your product, and Ranklit vanishes completely.",
    points: ["Your app name replaces ours everywhere", "Logo and brand colors on every screen", "Live preview before you switch it on"],
  },
  {
    title: "A client login on your own domain",
    text: "Host the client login at app.youragency.com with one CNAME record, or grab a free instant address and go live in seconds. Either way, your clients never see ranklit.com.",
    points: ["Free instant subdomain, no DNS setup", "Or your own domain, verified automatically", "Branding turns on the moment it's live"],
  },
  {
    title: "Email updates from your address",
    text: "Weekly reports, rank updates, and alerts reach your clients from your name and your domain. When a client hits reply, it lands straight in your support inbox.",
    points: ["Your from-name and your sending domain", "Replies go to your support email", "Set the cadence per client, or pause them all"],
  },
  {
    title: "A branded dashboard for every client",
    text: "Each client gets a read-only login with their rankings, reviews, calls, and citations, all under your brand and your colors. You decide which sections each client can see.",
    points: ["Read-only, so you stay in control", "Per-client section visibility", "No third-party branding anywhere"],
  },
];

const faqLocations = {
  q: "How many client locations can I manage?",
  a: "Up to 99 on one plan. Each location gets its own listings, posts, review replies, and map rank tracking.",
};
const faqWhiteLabel = {
  q: "Is it really white-label?",
  a: "Yes. Name the dashboard after your agency, add your logo and colors, and use your own domain. Emails go out from your address. Every client gets a branded, read-only dashboard, so they see your agency and never us.",
};
const faqTeam = {
  q: "Do I need an SEO team?",
  a: "No. We're the engine behind your agency. You own the client relationship, and we do the local SEO work, including listings placed by hand.",
};
const faqGuarantee = {
  q: "What about the ranking guarantee?",
  a: "Every client is covered by our 30-day money-back ranking guarantee. If a client isn't climbing within 30 days, that's on us, so you can sell without the risk.",
};

export const agencyFaqs = [
  faqLocations,
  faqWhiteLabel,
  faqTeam,
  faqGuarantee,
  {
    q: "How does pricing work for agencies?",
    a: "Simple per-plan pricing that scales with locations, from $99 a month, up to 99 locations. You set your own price to clients and keep the difference.",
  },
];

export const agencyPricingFaqs = [
  {
    q: faqLocations.q,
    a: "Up to 99 on one plan. Each location gets its own hand-placed listings, posts, review replies, and map rank tracking.",
  },
  {
    q: "How does pricing work for agencies?",
    a: "Simple per-plan pricing that scales with locations, from $99 a month. You set your own price to clients and keep the difference. Paying yearly saves up to 21%.",
  },
  {
    q: faqWhiteLabel.q,
    a: "Yes. Name the dashboard after your agency, add your logo and colors, and use your own domain. Emails go out from your address. Every client gets a branded, read-only dashboard, so they see your agency, not a third-party tool.",
  },
  faqTeam,
  faqGuarantee,
  {
    q: "Can I change a client's plan later?",
    a: "Yes. Move any client up or down whenever you like. Upgrades take effect right away; downgrades start on the next bill.",
  },
];
