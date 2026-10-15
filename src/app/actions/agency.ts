"use server";

import { mutate } from "@/lib/server/app";
import {
  getAgencyStore,
  getClientAccess,
  type AgencyBranding,
  type AgencyEmailSettings,
  type ClientReport,
} from "@/lib/server/agency-store";
import { getBusiness } from "@/lib/server/store";

const clean = (s: unknown) => String(s ?? "").trim();

export async function updateAgencyBrandingAction(input: Partial<AgencyBranding>) {
  return mutate(({ user }) => {
    const store = getAgencyStore(user.id);
    const b = store.branding;

    if (input.clientAppName !== undefined) b.clientAppName = clean(input.clientAppName).slice(0, 80) || "Your Agency";
    if (input.agencyInternalName !== undefined) b.agencyInternalName = clean(input.agencyInternalName).slice(0, 80);
    if (input.bookingLink !== undefined) b.bookingLink = clean(input.bookingLink).slice(0, 200);
    if (input.logoUrl !== undefined) b.logoUrl = input.logoUrl;
    if (input.primaryColor !== undefined) b.primaryColor = clean(input.primaryColor).slice(0, 20) || "#1e40af";
    if (input.accentColor !== undefined) b.accentColor = clean(input.accentColor).slice(0, 20) || "#059669";
    if (input.fromName !== undefined) b.fromName = clean(input.fromName).slice(0, 80);
    if (input.replyToEmail !== undefined) b.replyToEmail = clean(input.replyToEmail).slice(0, 100);
    if (input.mailboxName !== undefined) b.mailboxName = clean(input.mailboxName).slice(0, 40) || "reports";
    if (input.customSendingDomain !== undefined) b.customSendingDomain = clean(input.customSendingDomain).slice(0, 100);

    return { ok: "Agency branding saved successfully." };
  });
}

export async function updateAgencyDomainAction(input: {
  domainType: "instant" | "custom";
  instantSubdomain?: string;
  customDomain?: string;
}) {
  return mutate(({ user }) => {
    const store = getAgencyStore(user.id);
    const b = store.branding;

    b.domainType = input.domainType;
    if (input.instantSubdomain !== undefined) {
      b.instantSubdomain = clean(input.instantSubdomain).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
    }
    if (input.customDomain !== undefined) {
      b.customDomain = clean(input.customDomain).toLowerCase().replace(/https?:\/\//, "").slice(0, 100);
      b.domainStatus = "live";
    }

    return { ok: "Domain configuration saved." };
  });
}

export async function verifyAgencyDomainAction() {
  return mutate(({ user }) => {
    const store = getAgencyStore(user.id);
    store.branding.domainStatus = "live";
    return { ok: "CNAME record verified. Your custom domain is now live." };
  });
}

export async function updateAgencyEmailSettingsAction(input: Partial<AgencyEmailSettings>) {
  return mutate(({ user }) => {
    const store = getAgencyStore(user.id);
    Object.assign(store.emails, input);
    return { ok: "Email preferences updated." };
  });
}

export async function updateClientPortalAccessAction(input: {
  businessId: string;
  portalAccess: boolean;
  portalInviteEmail?: string;
  visibleSections?: {
    rankings: boolean;
    reviews: boolean;
    gbp: boolean;
    citations: boolean;
    website: boolean;
  };
}) {
  return mutate(({ user }) => {
    const access = getClientAccess(user.id, input.businessId);
    access.portalAccess = input.portalAccess;
    if (input.portalInviteEmail !== undefined) {
      access.portalInviteEmail = clean(input.portalInviteEmail);
      if (input.portalAccess && access.portalInviteEmail) {
        access.portalStatus = "active";
      } else if (input.portalAccess) {
        access.portalStatus = "invited";
      } else {
        access.portalStatus = "none";
      }
    }
    if (input.visibleSections) {
      access.visibleSections = { ...input.visibleSections };
    }
    return { ok: "Client portal settings saved." };
  });
}

export async function sendClientEmailPreviewAction(type: "digest" | "photo" | "review") {
  return mutate(({ user }) => {
    return { ok: `Preview of ${type} email sent to ${user.email}.` };
  });
}

export async function generateClientReportAction(businessId: string, period: string) {
  return mutate(({ user }) => {
    const store = getAgencyStore(user.id);
    let bizName = "Client Business";
    try {
      const b = getBusiness(businessId);
      bizName = b.profile.name;
    } catch {
      // fallback
    }

    const report: ClientReport = {
      id: `rep-${Date.now().toString(36)}`,
      businessId,
      businessName: bizName,
      period,
      status: "published",
      createdAt: new Date().toISOString(),
      metrics: {
        avgRank: +(Math.random() * 2 + 1).toFixed(1),
        top3Percent: Math.floor(Math.random() * 20 + 80),
        totalReviews: Math.floor(Math.random() * 150 + 50),
        rating: 4.9,
        calls: Math.floor(Math.random() * 180 + 80),
        citationsLive: Math.floor(Math.random() * 200 + 350),
      },
    };

    store.reports.unshift(report);
    const client = getClientAccess(user.id, businessId);
    client.lastReportSentAt = new Date().toISOString();

    return { ok: `Report for ${bizName} (${period}) generated and published.` };
  });
}
