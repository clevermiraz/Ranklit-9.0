import {
  Bell,
  Bot,
  Briefcase,
  Building2,
  ClipboardCheck,
  Code2,
  CreditCard,
  FileText,
  Gift,
  Globe,
  House,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  Plug,
  QrCode,
  Radar,
  Rocket,
  Settings,
  SlidersHorizontal,
  Store,
  Target,
  TrendingUp,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type SubTab = { label: string; href: string; icon: LucideIcon };
export type Section = { key: string; label: string; href: string; icon: LucideIcon; tabs: SubTab[]; group: 1 | 2 };

export const sections: Section[] = [
  { key: "home", label: "Home", href: "/dashboard", icon: House, group: 1, tabs: [] },
  {
    key: "agency",
    label: "Agency",
    href: "/dashboard/agency",
    icon: Briefcase,
    group: 1,
    tabs: [
      { label: "Clients", href: "/dashboard/agency", icon: Building2 },
      { label: "Client emails", href: "/dashboard/agency/emails", icon: Mail },
      { label: "Branding & domain", href: "/dashboard/agency/branding", icon: Globe },
      { label: "Reports", href: "/dashboard/reports", icon: FileText },
    ],
  },
  {
    key: "rankings",
    label: "Rankings",
    href: "/dashboard/rankings",
    icon: MapPin,
    group: 1,
    tabs: [
      { label: "Rankings", href: "/dashboard/rankings", icon: MapPin },
      { label: "Map Scans", href: "/dashboard/scans", icon: Radar },
      { label: "AI Visibility", href: "/dashboard/ai-visibility", icon: Bot },
    ],
  },
  {
    key: "reviews",
    label: "Reviews",
    href: "/dashboard/reviews",
    icon: MessageSquare,
    group: 1,
    tabs: [
      { label: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
      { label: "Get Reviews", href: "/dashboard/get-reviews", icon: QrCode },
      { label: "Review Widget", href: "/dashboard/review-widget", icon: Code2 },
    ],
  },
  {
    key: "gbp",
    label: "Google Profile",
    href: "/dashboard/gbp",
    icon: Store,
    group: 1,
    tabs: [
      { label: "Profile", href: "/dashboard/gbp", icon: Store },
      { label: "Posts", href: "/dashboard/gbp/posts", icon: FileText },
      { label: "Performance", href: "/dashboard/gbp-insights", icon: TrendingUp },
      { label: "Audit", href: "/dashboard/gbp-audit", icon: ClipboardCheck },
    ],
  },
  {
    key: "listings",
    label: "Listings",
    href: "/dashboard/citations",
    icon: Link2,
    group: 1,
    tabs: [
      { label: "Citations", href: "/dashboard/citations", icon: Link2 },
      { label: "Directory Listings", href: "/dashboard/listings", icon: Globe },
    ],
  },
  {
    key: "website",
    label: "Website",
    href: "/dashboard/website",
    icon: Globe,
    group: 1,
    tabs: [
      { label: "Fixes", href: "/dashboard/website", icon: Globe },
      { label: "Organic SEO", href: "/dashboard/organic-seo", icon: TrendingUp },
      { label: "Tools", href: "/dashboard/tools", icon: Code2 },
    ],
  },
  {
    key: "autopilot",
    label: "Autopilot",
    href: "/dashboard/autopilot",
    icon: Rocket,
    group: 2,
    tabs: [
      { label: "Status", href: "/dashboard/autopilot", icon: Rocket },
      { label: "Automations", href: "/settings/automations", icon: SlidersHorizontal },
      { label: "Strategy", href: "/dashboard/strategy", icon: Target },
    ],
  },
  { key: "addons", label: "Add-ons", href: "/dashboard/upgrades", icon: Gift, group: 2, tabs: [] },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
    group: 2,
    tabs: [
      { label: "Account", href: "/settings", icon: UserRound },
      { label: "Businesses", href: "/dashboard/businesses", icon: Building2 },
      { label: "Plans & Credits", href: "/settings/plans", icon: CreditCard },
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
      { label: "AI & API", href: "/settings/api", icon: Plug },
    ],
  },
];

/** Finds the section (and active sub-tab) for a pathname. Longest matching tab wins. */
export function sectionFor(pathname: string) {
  let best: { section: Section; tab?: SubTab; len: number } | null = null;
  for (const section of sections) {
    const candidates = section.tabs.length ? section.tabs : [{ label: section.label, href: section.href, icon: section.icon }];
    for (const tab of candidates) {
      const match = tab.href === "/dashboard" ? pathname === "/dashboard" : pathname === tab.href || pathname.startsWith(tab.href + "/");
      if (match && (!best || tab.href.length > best.len)) best = { section, tab: section.tabs.length ? tab : undefined, len: tab.href.length };
    }
  }
  return best ?? { section: sections[0], tab: undefined, len: 0 };
}
