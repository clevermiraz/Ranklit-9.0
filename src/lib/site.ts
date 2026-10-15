export const site = {
  name: "Ranklit",
  domain: "ranklit.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "support@ranklit.com",
  tagline: "The AI agent that ranks you on Google Maps.",
  description:
    "Ranklit is an AI agent for your Google Business Profile. It posts, replies to reviews, builds citations and tracks your map rank every week.",
  bookingUrl: "https://cal.com",
  social: {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    x: "https://x.com",
  },
};

export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "For agencies", href: "/agencies" },
  { label: "Rank tracker", href: "/rank-tracker" },
  { label: "Free tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Agency pricing", href: "/agencies/pricing" },
      { label: "For local businesses", href: "/local-business" },
      { label: "For agencies", href: "/agencies" },
      { label: "Rank tracker", href: "/rank-tracker" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Free tools", href: "/tools" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Local SEO",
    links: [
      { label: "All industries", href: "/local-seo" },
      { label: "Plumbers", href: "/local-seo/plumbers" },
      { label: "HVAC", href: "/local-seo/hvac" },
      { label: "Dentists", href: "/local-seo/dentists" },
      { label: "Roofers", href: "/local-seo/roofers" },
      { label: "Electricians", href: "/local-seo/electricians" },
      { label: "Landscapers", href: "/local-seo/landscapers" },
      { label: "Auto repair", href: "/local-seo/auto-repair" },
      { label: "Chiropractors", href: "/local-seo/chiropractors" },
    ],
  },
  {
    title: "Popular tools",
    links: [
      { label: "Keyword research", href: "/tools/local-keyword-research-tool" },
      { label: "Citation finder", href: "/tools/local-citation-finder" },
      { label: "Local SEO audit", href: "/tools/local-seo-audit-tool" },
      { label: "Visibility score", href: "/tools/google-maps-visibility-score-calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "support@ranklit.com", href: "mailto:support@ranklit.com" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export const trialHref = (plan: "foundation" | "growth" = "foundation", interval: "monthly" | "annual" = "monthly") =>
  `/checkout?plan=${plan}&interval=${interval}`;
