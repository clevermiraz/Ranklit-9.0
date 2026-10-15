"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Building2,
  Check,
  ChevronRight,
  Copy,
  Loader2,
  Lock,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  X,
} from "lucide-react";
import { Card, PageHeader, StatCard, btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import { updateClientPortalAccessAction } from "@/app/actions/agency";
import type { AgencyBranding, ClientPortalAccess } from "@/lib/server/agency-store";

export type ClientRowData = {
  id: string;
  name: string;
  address: string;
  category: string;
  avgRank?: string;
  top3?: string;
  rating?: number;
  reviewsCount?: number;
  portal: ClientPortalAccess;
};

export function AgencyClientsView({
  branding,
  clients,
  domain,
}: {
  branding: AgencyBranding;
  clients: ClientRowData[];
  domain: string;
}) {
  const [query, setQuery] = useState("");
  const [activeModalBiz, setActiveModalBiz] = useState<ClientRowData | null>(null);
  const [copied, setCopied] = useState(false);

  // Setup Checklist Calculation
  const step1Done = branding.clientAppName !== "Your Agency" && !!branding.logoUrl;
  const step2Done = branding.domainStatus === "live";
  const step3Done = !!branding.fromName && !!branding.replyToEmail;
  const step4Done = clients.some((c) => c.portal.portalAccess);
  const stepsDoneCount = [step1Done, step2Done, step3Done, step4Done].filter(Boolean).length;

  const loginUrl = domain.startsWith("http") ? domain : `https://${domain}`;

  const copyLogin = () => {
    navigator.clipboard.writeText(loginUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.address.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()),
  );

  const activePortals = clients.filter((c) => c.portal.portalAccess).length;
  const signedInCount = clients.filter((c) => c.portal.portalStatus === "active").length;
  const inLocalPack = clients.filter((c) => c.avgRank && c.avgRank !== "No scan yet").length;
  const withReport = clients.filter((c) => !!c.portal.lastReportSentAt).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="How every client is doing, who can see their dashboard, and what they've been sent."
        actions={
          <Link href="/dashboard/businesses" className={btn.primary}>
            <Plus className="size-4" /> Add a client
          </Link>
        }
      />

      {/* Onboarding 4-Step Checklist */}
      <Card className="border-brand-200/80 bg-gradient-to-br from-white via-white to-[#fbf8fe]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ebf6] pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              <Sparkles className="size-4 text-brand-700" /> Set up your agency
            </h2>
            <p className="mt-0.5 text-xs text-ink/60">Four steps and your clients only ever see your brand.</p>
          </div>
          <span className="rounded-full bg-[#f3e8fb] px-3 py-1 text-xs font-semibold text-brand-700">
            {stepsDoneCount} of 4 done
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <Link
            href="/dashboard/agency/branding"
            className={clsx(
              "group rounded-xl border p-3.5 transition",
              step1Done ? "border-emerald-200 bg-emerald-50/40" : "border-[#ece6f4] bg-white hover:border-brand-300",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={clsx(
                  "grid size-5 place-items-center rounded-full text-[11px] font-bold",
                  step1Done ? "bg-emerald-600 text-white" : "bg-ink/10 text-ink/60",
                )}
              >
                {step1Done ? <Check className="size-3" strokeWidth={3} /> : "1"}
              </span>
              <ChevronRight className="size-4 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink/60" />
            </div>
            <p className="mt-2.5 text-xs font-bold text-ink">Name it and add your logo</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink/55">
              Clients see this name and logo on their dashboard and in every email.
            </p>
          </Link>

          {/* Step 2 */}
          <Link
            href="/dashboard/agency/branding"
            className={clsx(
              "group rounded-xl border p-3.5 transition",
              step2Done ? "border-emerald-200 bg-emerald-50/40" : "border-[#ece6f4] bg-white hover:border-brand-300",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={clsx(
                  "grid size-5 place-items-center rounded-full text-[11px] font-bold",
                  step2Done ? "bg-emerald-600 text-white" : "bg-ink/10 text-ink/60",
                )}
              >
                {step2Done ? <Check className="size-3" strokeWidth={3} /> : "2"}
              </span>
              <ChevronRight className="size-4 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink/60" />
            </div>
            <p className="mt-2.5 text-xs font-bold text-ink">Put it on your own web address</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink/55">
              A free address takes seconds. Your own domain takes one DNS record.
            </p>
          </Link>

          {/* Step 3 */}
          <Link
            href="/dashboard/agency/branding"
            className={clsx(
              "group rounded-xl border p-3.5 transition",
              step3Done ? "border-emerald-200 bg-emerald-50/40" : "border-[#ece6f4] bg-white hover:border-brand-300",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={clsx(
                  "grid size-5 place-items-center rounded-full text-[11px] font-bold",
                  step3Done ? "bg-emerald-600 text-white" : "bg-ink/10 text-ink/60",
                )}
              >
                {step3Done ? <Check className="size-3" strokeWidth={3} /> : "3"}
              </span>
              <ChevronRight className="size-4 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink/60" />
            </div>
            <p className="mt-2.5 text-xs font-bold text-ink">Send email as your agency</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink/55">
              The sender name clients see in their inbox, and where their replies go.
            </p>
          </Link>

          {/* Step 4 */}
          <button
            type="button"
            onClick={() => clients[0] && setActiveModalBiz(clients[0])}
            className={clsx(
              "group text-left rounded-xl border p-3.5 transition",
              step4Done ? "border-emerald-200 bg-emerald-50/40" : "border-[#ece6f4] bg-white hover:border-brand-300",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={clsx(
                  "grid size-5 place-items-center rounded-full text-[11px] font-bold",
                  step4Done ? "bg-emerald-600 text-white" : "bg-ink/10 text-ink/60",
                )}
              >
                {step4Done ? <Check className="size-3" strokeWidth={3} /> : "4"}
              </span>
              <ChevronRight className="size-4 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink/60" />
            </div>
            <p className="mt-2.5 text-xs font-bold text-ink">Invite your first client</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink/55">
              Give one client a read-only login to their own results.
            </p>
          </button>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Clients"
          value={clients.length}
          icon={Building2}
          tone="purple"
          sub={`${activePortals} with portal access`}
        />
        <StatCard
          label="Signed in"
          value={signedInCount}
          icon={UserCheck}
          tone="green"
          sub={signedInCount === 0 ? "No one invited yet" : `${signedInCount} active clients`}
        />
        <StatCard
          label="In the local pack"
          value={inLocalPack}
          icon={TrendingUp}
          tone="amber"
          sub={inLocalPack === 0 ? "No scans yet" : "Ranking in Google top 3"}
        />
        <StatCard
          label="With a report"
          value={withReport}
          icon={Mail}
          tone="blue"
          sub="Published & shared"
        />
      </div>

      {/* Main Client Table */}
      <Card>
        <div className="flex flex-col gap-4 border-b border-[#f0ebf6] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">All clients</h2>
            <p className="mt-0.5 text-xs text-ink/60">
              Open a client to manage their login, what they see, their emails and reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Shareable login URL */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[#ece6f4] bg-[#faf8fc] px-2.5 py-1 text-xs">
              <span className="text-ink/50">Client login page</span>
              <span className="font-mono font-medium text-ink/80">{domain}</span>
              <button
                type="button"
                onClick={copyLogin}
                className="ml-1 inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
                title="Copy client portal URL"
              >
                {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-ink/40" />
              <input
                type="text"
                placeholder="Search clients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-8 rounded-lg border border-[#ece6f4] bg-white pl-8 pr-3 text-xs text-ink placeholder:text-ink/40 focus:border-brand-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f0ebf6] text-[11px] font-semibold text-ink/50">
                <th className="py-3 pr-4">Client</th>
                <th className="py-3 px-3">Map rank</th>
                <th className="py-3 px-3">Reviews</th>
                <th className="py-3 px-3">Portal</th>
                <th className="py-3 px-3">Last email</th>
                <th className="py-3 px-3">Last report</th>
                <th className="py-3 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f4fb]">
              {filtered.map((c) => (
                <tr key={c.id} className="group transition hover:bg-[#faf8fd]">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f3e8fb] text-xs font-bold text-brand-700">
                        {c.name[0]}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-ink">{c.name}</p>
                        <p className="truncate text-[11px] text-ink/50">{c.category || c.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {c.avgRank ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-ink">
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          {c.avgRank}
                        </span>
                        {c.top3 && <span className="text-[10px] text-ink/50">{c.top3} top 3</span>}
                      </span>
                    ) : (
                      <span className="text-ink/40">No scan yet</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-ink">{c.rating ? `${c.rating.toFixed(1)} ★` : "5.0 ★"}</span>
                    <span className="ml-1 text-[11px] text-ink/45">
                      ({c.reviewsCount !== undefined ? c.reviewsCount : 3} reviews)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {c.portal.portalAccess ? (
                      <button
                        type="button"
                        onClick={() => setActiveModalBiz(c)}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        <ShieldCheck className="size-3" />
                        {c.portal.portalStatus === "active" ? "Active" : "Invited"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveModalBiz(c)}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-ink/20 px-2 py-0.5 text-[11px] font-medium text-ink/60 hover:border-brand-300 hover:text-brand-700"
                      >
                        <Lock className="size-2.5 text-ink/40" /> Give access
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-3 text-ink/55">
                    {c.portal.lastEmailSentAt ? new Date(c.portal.lastEmailSentAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 px-3 text-ink/55">
                    {c.portal.lastReportSentAt ? new Date(c.portal.lastReportSentAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveModalBiz(c)}
                      className="rounded-lg border border-[#ece6f4] bg-white px-2.5 py-1 text-xs font-semibold text-ink/70 hover:border-brand-200 hover:text-brand-700"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Client Portal Access Modal */}
      {activeModalBiz && (
        <ClientAccessModal
          biz={activeModalBiz}
          branding={branding}
          domain={domain}
          onClose={() => setActiveModalBiz(null)}
        />
      )}
    </div>
  );
}

function ClientAccessModal({
  biz,
  branding,
  domain,
  onClose,
}: {
  biz: ClientRowData;
  branding: AgencyBranding;
  domain: string;
  onClose: () => void;
}) {
  const { run, pending } = useAction();
  const [access, setAccess] = useState(biz.portal.portalAccess);
  const [email, setEmail] = useState(biz.portal.portalInviteEmail || "");
  const [sections, setSections] = useState(biz.portal.visibleSections);

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = () => {
    run(
      () =>
        updateClientPortalAccessAction({
          businessId: biz.id,
          portalAccess: access,
          portalInviteEmail: email,
          visibleSections: sections,
        }),
      (res) => {
        if (!res?.error) onClose();
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-[#ece6f4] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f0ebf6] pb-3">
          <div>
            <h3 className="text-base font-bold text-ink">Client Portal · {biz.name}</h3>
            <p className="text-xs text-ink/60">Configure read-only client dashboard access and permissions.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-ink/50 hover:bg-ink/5">
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Access Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-[#ece6f4] bg-[#faf8fc] p-3">
            <div>
              <p className="font-bold text-ink">Enable Read-Only Portal</p>
              <p className="text-[11px] text-ink/60">
                Client can sign in at <span className="font-mono font-medium">{domain}</span>
              </p>
            </div>
            <input
              type="checkbox"
              checked={access}
              onChange={(e) => setAccess(e.target.checked)}
              className="size-4 accent-brand-700"
            />
          </div>

          {/* Client Email */}
          <div>
            <label className="block text-[11px] font-semibold text-ink/80">Client invite email</label>
            <input
              type="email"
              value={email}
              placeholder="client@theirbusiness.com"
              onChange={(e) => setEmail(e.target.value)}
              className={clsx(input, "mt-1 text-xs")}
            />
            <p className="mt-1 text-[11px] text-ink/50">
              When saved, a magic link invite will be ready under your brand: <strong>{branding.clientAppName}</strong>.
            </p>
          </div>

          {/* Visible Sections */}
          <div>
            <p className="font-semibold text-ink/80">Sections visible to client</p>
            <p className="text-[11px] text-ink/50">Choose what data your client can see on their portal.</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { key: "rankings", label: "Rankings & Scans" },
                { key: "reviews", label: "Customer Reviews" },
                { key: "gbp", label: "Google Profile Posts" },
                { key: "citations", label: "Citations & Listings" },
                { key: "website", label: "Website Audit" },
              ].map((s) => (
                <label
                  key={s.key}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#ece6f4] p-2 hover:bg-[#faf8fc]"
                >
                  <input
                    type="checkbox"
                    checked={sections[s.key as keyof typeof sections]}
                    onChange={() => toggleSection(s.key as keyof typeof sections)}
                    className="size-3.5 accent-brand-700"
                  />
                  <span className="text-[11px] font-medium text-ink">{s.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-[#f0ebf6] pt-4">
          <button type="button" onClick={onClose} className={btn.outline}>
            Cancel
          </button>
          <button type="button" disabled={pending} onClick={save} className={btn.primary}>
            {pending && <Loader2 className="size-4 animate-spin" />} Save permissions
          </button>
        </div>
      </div>
    </div>
  );
}
