import type { RankValue } from "@/components/rank-grid";

export const directories = [
  "Apple Maps",
  "Bing Places",
  "Yelp",
  "Better Business Bureau",
  "Foursquare",
  "Yellow Pages",
  "Manta",
  "Hotfrog",
  "Superpages",
  "Chamber of Commerce",
  "Angi",
  "Nextdoor",
  "MapQuest",
  "Cylex",
  "Brownbook",
];

export const homeStats = [
  { value: 81240, label: "Citations built for local businesses" },
  { value: 1412, label: "Google Maps ranking spots climbed" },
  { value: 560, label: "Local businesses growing with us" },
];

export type Scan = {
  id: string;
  label: string;
  keyword: string;
  business: string;
  before: { date: string; longDate: string; grid: RankValue[][] };
  after: { date: string; longDate: string; grid: RankValue[][] };
  days: number;
};

export const scans: Scan[] = [
  {
    id: "dealer",
    label: "Used car dealer",
    keyword: "used cars mason city ia",
    business: "Used car dealer · Mason City, IA",
    days: 35,
    before: {
      date: "Jul 10",
      longDate: "July 10, 2026",
      grid: [
        [14, 12, 5, 4, 3],
        [11, 6, 3, 2, 3],
        [7, 3, 1, 2, 4],
        [9, 4, 2, 3, 8],
        [16, 10, 6, 7, 12],
      ],
    },
    after: {
      date: "Aug 14",
      longDate: "August 14, 2026",
      grid: [
        [4, 3, 2, 2, 1],
        [3, 2, 1, 1, 2],
        [2, 1, 1, 1, 2],
        [3, 2, 1, 1, 3],
        [5, 3, 2, 3, 4],
      ],
    },
  },
  {
    id: "flooring",
    label: "Flooring contractor",
    keyword: "subfloor repair marietta ga",
    business: "Flooring contractor · Atlanta, GA",
    days: 33,
    before: {
      date: "Jul 15",
      longDate: "July 15, 2026",
      grid: [
        [5, 3, 3, 4, 6],
        [4, 2, 3, 5, 7],
        [6, 4, 2, 4, 8],
        [9, 7, 5, 6, 11],
        [13, 12, 9, 12, null],
      ],
    },
    after: {
      date: "Aug 17",
      longDate: "August 17, 2026",
      grid: [
        [2, 1, 1, 1, 1],
        [2, 1, 2, 2, 1],
        [3, 2, 1, 1, 1],
        [4, 2, 1, 1, 5],
        [6, 6, 7, 8, 8],
      ],
    },
  },
  {
    id: "inspector",
    label: "Home inspector",
    keyword: "home inspection lakeville mn",
    business: "Home inspector · Minneapolis, MN",
    days: 41,
    before: {
      date: "Jun 30",
      longDate: "June 30, 2026",
      grid: [
        [12, 11, 9, 13, null],
        [10, 7, 6, 9, 14],
        [8, 5, 3, 6, 12],
        [11, 8, 6, 9, 15],
        [null, 14, 12, 16, null],
      ],
    },
    after: {
      date: "Aug 10",
      longDate: "August 10, 2026",
      grid: [
        [4, 3, 2, 3, 6],
        [3, 2, 1, 2, 4],
        [2, 1, 1, 1, 3],
        [3, 2, 1, 2, 4],
        [6, 4, 3, 4, 7],
      ],
    },
  },
];

export const callResults = [
  { pct: 140, days: 30, before: 5, after: 12, who: "IT support company · Columbia, SC" },
  { pct: 48, days: 30, before: 25, after: 37, who: "Mortgage broker · Durham, NC" },
];

export const comparisonRows = [
  { label: "Monthly price", us: "From $99", them: "$1,500 to $3,000" },
  { label: "Contract", us: "None. Cancel anytime.", them: "Often required" },
  { label: "Google posts", us: "3× a week", them: "Varies" },
  { label: "Review replies", us: "Fast AI replies", them: "Varies" },
  { label: "Rank tracking", us: "Weekly map scans", them: "Often monthly" },
  { label: "Money-back guarantee", us: "30 days", them: "Not usually" },
];

export const homeFaqs = [
  {
    q: "What is Ranklit?",
    a: "Ranklit is an AI agent that works on your Google Business Profile every week. It publishes posts, replies to reviews, lists you on directories, audits your profile and tracks where you rank on Google Maps — the routine work that moves local rankings.",
  },
  {
    q: "How is it different from an agency?",
    a: "An agency bills you for people doing repetitive tasks, usually $1,500 to $3,000 a month with a contract. Ranklit automates that work so it happens every week, and a real SEO specialist oversees your account. You get agency-level output for a software price, with no contract.",
  },
  {
    q: "How does the 30-day guarantee work?",
    a: "If your average Google Maps rank hasn't improved after 30 days, email us and we'll refund your payment in full. We compare your first map scan with your scan on day 30.",
  },
  {
    q: "What access do you need?",
    a: "Manager access to your Google Business Profile. You approve one invite email from Google — it takes about a minute. We never ask for or see your Google password, and you can remove access any time.",
  },
  {
    q: "How soon will I see results?",
    a: "Posts, review replies and new listings start in your first week. Most businesses see movement on the map within two to six weeks, depending on competition and how complete the profile was to begin with.",
  },
  {
    q: "What happens to my listings if I cancel?",
    a: "They stay. Citations and directory listings we build belong to your business and remain live after you cancel. Your posts and review replies stay on Google too.",
  },
  {
    q: "Who looks after my account?",
    a: "Every account has a named account manager — an experienced local SEO specialist who reviews your agent's work, places premium citations by hand and is one email away.",
  },
  {
    q: "Do I have to book a call?",
    a: "No. Onboarding calls are optional. If you skip it, we set everything up for you and email you when your agent starts working.",
  },
];

export const agentTasks = [
  { title: "Replied to a new 5★ review", time: "Mon · 11:47 AM", icon: "star" },
  { title: "Added you to new listing sites", time: "Tue · 8:15 AM", icon: "link" },
  { title: "Scanned 49 spots on the map", time: "Wed · 7:00 AM", icon: "grid" },
  { title: "Wrote and posted a Google update", time: "Wed · 9:05 AM", icon: "spark" },
  { title: "Replied to a new 4★ review", time: "Thu · 2:31 PM", icon: "star" },
  { title: "Checked your profile for problems", time: "Thu · 4:10 PM", icon: "search" },
  { title: "Wrote and posted a Google update", time: "Fri · 9:01 AM", icon: "spark" },
] as const;

export type AgentTaskIcon = (typeof agentTasks)[number]["icon"];
