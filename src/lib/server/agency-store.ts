import "server-only";

export type AgencyBranding = {
  clientAppName: string;
  agencyInternalName: string;
  bookingLink: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  domainType: "instant" | "custom";
  instantSubdomain: string;
  customDomain: string;
  domainStatus: "live" | "pending" | "unverified";
  fromName: string;
  replyToEmail: string;
  mailboxName: string;
  customSendingDomain: string;
  sendingDomainStatus: "live" | "pending" | "unverified";
};

export type AgencyEmailSettings = {
  scheduledEmailsEnabled: boolean;
  digestFrequency: "weekly" | "biweekly" | "monthly";
  digestSubjectTemplate: string;
  digestCustomMessage: string;
  photoNudgesEnabled: boolean;
  photoNudgeMessage: string;
  reviewNudgesEnabled: boolean;
  reviewNudgeMessage: string;
};

export type ClientPortalAccess = {
  portalAccess: boolean;
  portalInviteEmail: string;
  portalStatus: "active" | "invited" | "none";
  lastEmailSentAt: string | null;
  lastReportSentAt: string | null;
  visibleSections: {
    rankings: boolean;
    reviews: boolean;
    gbp: boolean;
    citations: boolean;
    website: boolean;
  };
};

export type ClientReport = {
  id: string;
  businessId: string;
  businessName: string;
  period: string;
  status: "draft" | "published";
  createdAt: string;
  metrics: {
    avgRank: number;
    top3Percent: number;
    totalReviews: number;
    rating: number;
    calls: number;
    citationsLive: number;
  };
};

export type AgencyStoreData = {
  branding: AgencyBranding;
  emails: AgencyEmailSettings;
  clients: Record<string, ClientPortalAccess>;
  reports: ClientReport[];
};

const g = globalThis as unknown as { __rlAgency?: Map<string, AgencyStoreData> };
const agencyStores = (g.__rlAgency ??= new Map<string, AgencyStoreData>());

export const DEFAULT_BRANDING: AgencyBranding = {
  clientAppName: "Acme Local Pro",
  agencyInternalName: "Acme Digital Agency",
  bookingLink: "https://cal.com/acme/local-seo",
  logoUrl: null,
  primaryColor: "#1e40af",
  accentColor: "#059669",
  domainType: "custom",
  instantSubdomain: "acmelocal",
  customDomain: "app.youragency.com",
  domainStatus: "live",
  fromName: "Acme Local Pro",
  replyToEmail: "support@youragency.com",
  mailboxName: "reports",
  customSendingDomain: "reports.youragency.com",
  sendingDomainStatus: "live",
};

export const DEFAULT_EMAILS: AgencyEmailSettings = {
  scheduledEmailsEnabled: true,
  digestFrequency: "weekly",
  digestSubjectTemplate: "Your latest Google Maps results from {{agency_name}}",
  digestCustomMessage: "Here is your weekly summary of Google Business Profile updates, map rankings, and incoming customer reviews.",
  photoNudgesEnabled: true,
  photoNudgeMessage: "Your Google profile hasn't had new photos added recently. Sharing fresh behind-the-scenes or project photos helps maintain rank.",
  reviewNudgesEnabled: true,
  reviewNudgeMessage: "Review flow has slowed down slightly. Consider sharing your direct review invite link with recent happy customers.",
};

export function getAgencyStore(userId: string): AgencyStoreData {
  let s = agencyStores.get(userId);
  if (!s) {
    s = {
      branding: { ...DEFAULT_BRANDING },
      emails: { ...DEFAULT_EMAILS },
      clients: {},
      reports: [
        {
          id: "rep-sep-2026",
          businessId: "biz-default",
          businessName: "Bright Home Cleaning",
          period: "September 2026",
          status: "published",
          createdAt: "2026-10-01T09:00:00Z",
          metrics: {
            avgRank: 1.8,
            top3Percent: 92,
            totalReviews: 318,
            rating: 5.0,
            calls: 213,
            citationsLive: 518,
          },
        },
      ],
    };
    agencyStores.set(userId, s);
  }
  return s;
}

export function getClientAccess(userId: string, businessId: string): ClientPortalAccess {
  const store = getAgencyStore(userId);
  let c = store.clients[businessId];
  if (!c) {
    c = {
      portalAccess: false,
      portalInviteEmail: "",
      portalStatus: "none",
      lastEmailSentAt: null,
      lastReportSentAt: null,
      visibleSections: {
        rankings: true,
        reviews: true,
        gbp: true,
        citations: true,
        website: true,
      },
    };
    store.clients[businessId] = c;
  }
  return c;
}
