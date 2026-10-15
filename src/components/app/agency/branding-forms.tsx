"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Globe,
  Loader2,
  Mail,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, PageHeader, btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import {
  updateAgencyBrandingAction,
  updateAgencyDomainAction,
  verifyAgencyDomainAction,
} from "@/app/actions/agency";
import type { AgencyBranding } from "@/lib/server/agency-store";

export function AgencyBrandingView({ branding }: { branding: AgencyBranding }) {
  const { run, pending } = useAction();

  // Branding fields
  const [appName, setAppName] = useState(branding.clientAppName);
  const [internalName, setInternalName] = useState(branding.agencyInternalName);
  const [bookingLink, setBookingLink] = useState(branding.bookingLink);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor || "#1e40af");
  const [accentColor, setAccentColor] = useState(branding.accentColor || "#059669");
  const [logoUrl, setLogoUrl] = useState<string | null>(branding.logoUrl);

  // Web address fields
  const [domainType, setDomainType] = useState<"instant" | "custom">(branding.domainType);
  const [instantSubdomain, setInstantSubdomain] = useState(branding.instantSubdomain || "acmelocal");
  const [customDomain, setCustomDomain] = useState(branding.customDomain || "app.youragency.com");
  const [domainStatus, setDomainStatus] = useState(branding.domainStatus);

  // Email sender fields
  const [fromName, setFromName] = useState(branding.fromName);
  const [replyToEmail, setReplyToEmail] = useState(branding.replyToEmail);
  const [mailboxName, setMailboxName] = useState(branding.mailboxName || "reports");
  const [sendingDomain, setSendingDomain] = useState(branding.customSendingDomain || "reports.youragency.com");

  const [previewEmailOpen, setPreviewEmailOpen] = useState(false);

  const saveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    run(() =>
      updateAgencyBrandingAction({
        clientAppName: appName,
        agencyInternalName: internalName,
        bookingLink,
        primaryColor,
        accentColor,
        logoUrl,
        fromName,
        replyToEmail,
        mailboxName,
        customSendingDomain: sendingDomain,
      }),
    );
  };

  const saveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    run(() =>
      updateAgencyDomainAction({
        domainType,
        instantSubdomain,
        customDomain,
      }),
    );
  };

  const verifyDomain = () => {
    run(
      () => verifyAgencyDomainAction(),
      (res) => {
        if (!res?.error) setDomainStatus("live");
      },
    );
  };

  const activeDomainString =
    domainType === "custom"
      ? customDomain
      : `${instantSubdomain || "agency"}.clients.ranklit.com`;

  return (
    <div className="mx-auto max-w-[940px] space-y-6">
      <PageHeader
        title="Branding & domain"
        subtitle="Your name, logo and colours, the web address your clients sign in at, and the sender they see on every email."
      />

      {/* Live Status Banner */}
      <div
        className={clsx(
          "flex items-start gap-3 rounded-2xl border p-4 text-xs leading-relaxed transition",
          domainStatus === "live"
            ? "border-emerald-300 bg-emerald-50 text-emerald-950"
            : "border-amber-300 bg-amber-50 text-amber-950",
        )}
      >
        <div
          className={clsx(
            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white",
            domainStatus === "live" ? "bg-emerald-600" : "bg-amber-500",
          )}
        >
          {domainStatus === "live" ? <Check className="size-3" strokeWidth={3} /> : "!"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[13px]">
            {domainStatus === "live"
              ? "Your branding is live"
              : "Your branding is saved but not live yet"}
          </p>
          <p className="mt-0.5 opacity-85">
            {domainStatus === "live"
              ? `Customers who visit ${activeDomainString} see your logo, colors, and name instead of Ranklit.`
              : "Finish verifying your web address below and your white-label branding turns on automatically."}
          </p>
        </div>
      </div>

      {/* Card 1: Your Brand */}
      <Card>
        <CardHeader
          title="Your brand"
          description="Clients see this name, logo and colours on their dashboard and in every email, instead of Ranklit."
          icon={Palette}
          tone="purple"
        />

        <form onSubmit={saveBranding} className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-ink/80">Name clients see</label>
              <input
                type="text"
                required
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. Acme Local Pro"
                className={clsx(input, "mt-1 text-xs")}
              />
              <p className="mt-1 text-[11px] text-ink/50">Replaces “Ranklit” everywhere clients look.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/80">Agency internal name</label>
              <input
                type="text"
                value={internalName}
                onChange={(e) => setInternalName(e.target.value)}
                placeholder="e.g. Acme Digital Agency Ltd"
                className={clsx(input, "mt-1 text-xs")}
              />
              <p className="mt-1 text-[11px] text-ink/50">Your own name for this account. Clients don&apos;t see it.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink/80">Booking link</label>
            <input
              type="url"
              value={bookingLink}
              onChange={(e) => setBookingLink(e.target.value)}
              placeholder="https://cal.com/youragency/audit"
              className={clsx(input, "mt-1 text-xs")}
            />
            <p className="mt-1 text-[11px] text-ink/50">Shown on prospect audit reports so prospects can book a call.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink/80">Logo URL or Brand Mark</label>
            <input
              type="text"
              value={logoUrl || ""}
              onChange={(e) => setLogoUrl(e.target.value || null)}
              placeholder="https://youragency.com/logo.png"
              className={clsx(input, "mt-1 text-xs")}
            />
            <p className="mt-1 text-[11px] text-ink/50">Shown in the sidebar, on the sign-in page and in emails.</p>
          </div>

          {/* Color pickers & Live Preview */}
          <div className="grid gap-6 rounded-2xl border border-[#ece6f4] bg-[#faf8fc] p-4 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-xs font-bold text-ink">Brand Colours</p>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-ink/75">
                  <span>Primary colour</span>
                  <span className="font-normal text-ink/50">Sidebar background</span>
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="size-8 cursor-pointer rounded-lg border border-black/10 bg-white p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className={clsx(input, "h-8 flex-1 font-mono text-xs uppercase")}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-ink/75">
                  <span>Accent colour</span>
                  <span className="font-normal text-ink/50">Buttons & links</span>
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="size-8 cursor-pointer rounded-lg border border-black/10 bg-white p-0.5"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className={clsx(input, "h-8 flex-1 font-mono text-xs uppercase")}
                  />
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div>
              <p className="text-xs font-bold text-ink">Live preview</p>
              <div className="mt-2 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="flex items-center gap-1 border-b border-black/5 bg-[#f6f2fa] px-2.5 py-1.5">
                  <span className="size-2 rounded-full bg-[#ff5f57]" />
                  <span className="size-2 rounded-full bg-[#febc2e]" />
                  <span className="size-2 rounded-full bg-[#28c840]" />
                  <span className="ml-2 truncate text-[10px] text-ink/40">{activeDomainString}</span>
                </div>
                <div className="flex h-32">
                  {/* Mock Sidebar */}
                  <div
                    className="w-[40%] space-y-2 p-2 text-white transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="grid size-4 place-items-center rounded bg-white text-[9px] font-black"
                        style={{ color: primaryColor }}
                      >
                        {appName[0] || "A"}
                      </span>
                      <span className="truncate text-[10px] font-bold">{appName || "Your Brand"}</span>
                    </div>
                    <div className="space-y-1 pt-1 opacity-75">
                      <div className="h-1 rounded bg-white/40" style={{ width: "80%" }} />
                      <div className="h-1 rounded bg-white/30" style={{ width: "65%" }} />
                      <div className="h-1 rounded bg-white/30" style={{ width: "50%" }} />
                    </div>
                  </div>
                  {/* Mock Main Area */}
                  <div className="flex-1 space-y-2 p-3">
                    <div className="h-2 w-3/4 rounded bg-ink/10" />
                    <div className="h-1.5 w-full rounded bg-ink/5" />
                    <div className="h-1.5 w-4/5 rounded bg-ink/5" />
                    <button
                      type="button"
                      className="mt-2 inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold text-white shadow-xs transition-colors"
                      style={{ backgroundColor: accentColor }}
                    >
                      Get started
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-1.5 text-[10px] text-ink/45">
                Roughly what a client sees when they sign in. The sidebar uses your primary colour; buttons use your accent.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={pending} className={btn.primary}>
              {pending && <Loader2 className="size-4 animate-spin" />} Save brand settings
            </button>
          </div>
        </form>
      </Card>

      {/* Card 2: Your Web Address */}
      <Card>
        <CardHeader
          title="Your web address"
          description="Where clients sign in. Pick a free address on ours, or use a subdomain of your own website. Either way they never see ranklit.com."
          icon={Globe}
          tone="blue"
        />

        <form onSubmit={saveDomain} className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDomainType("instant")}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                domainType === "instant"
                  ? "bg-brand-700 text-white"
                  : "border border-[#ece6f4] bg-white text-ink/70 hover:border-brand-200",
              )}
            >
              Free instant address
            </button>
            <button
              type="button"
              onClick={() => setDomainType("custom")}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                domainType === "custom"
                  ? "bg-brand-700 text-white"
                  : "border border-[#ece6f4] bg-white text-ink/70 hover:border-brand-200",
              )}
            >
              Use my own domain
            </button>
          </div>

          {domainType === "instant" ? (
            <div className="rounded-xl border border-[#ece6f4] bg-[#faf8fc] p-4 text-xs">
              <label className="block text-xs font-semibold text-ink/80">Instant subdomain</label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="text"
                  value={instantSubdomain}
                  onChange={(e) => setInstantSubdomain(e.target.value)}
                  className={clsx(input, "h-9 w-48 font-mono text-xs")}
                />
                <span className="font-mono text-xs text-ink/60">.clients.ranklit.com</span>
              </div>
              <p className="mt-2 text-[11px] text-ink/50">
                Goes live immediately. No DNS configuration or SSL certificates required.
              </p>
            </div>
          ) : (
            <div className="space-y-4 rounded-xl border border-[#ece6f4] bg-[#faf8fc] p-4 text-xs">
              <div>
                <p className="font-bold text-ink">Step 1 — Choose your subdomain</p>
                <p className="mt-0.5 text-[11px] text-ink/60">
                  We recommend <code className="font-mono font-bold">app.</code> in front of your agency website domain.
                </p>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="app.youragency.com"
                  className={clsx(input, "mt-1.5 max-w-sm text-xs font-mono")}
                />
              </div>

              <div>
                <p className="font-bold text-ink">Step 2 — Add DNS CNAME Record</p>
                <p className="mt-0.5 text-[11px] text-ink/60">
                  Add one CNAME record at your domain registrar (Cloudflare, GoDaddy, Namecheap):
                </p>
                <div className="mt-2 flex items-center gap-2 overflow-x-auto rounded-lg border border-[#e4dcef] bg-white p-2.5 font-mono text-[11px]">
                  <span className="rounded bg-brand-50 px-1.5 py-0.5 font-bold text-brand-800">CNAME</span>
                  <span className="font-semibold text-ink">app</span>
                  <span className="text-ink/30">→</span>
                  <span className="font-semibold text-brand-700">clients.ranklit.com</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-ink">Step 3 — Automatic SSL & Verification</p>
                <p className="mt-0.5 text-[11px] text-ink/60">
                  Once added, we automatically provision SSL and route your white-label portal.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={verifyDomain}
                    disabled={pending}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {pending ? <Loader2 className="size-3 animate-spin" /> : <ShieldCheck className="size-3" />}
                    Verify CNAME record
                  </button>
                  {domainStatus === "live" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="size-3.5" /> Verified and live
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={pending} className={btn.primary}>
              {pending && <Loader2 className="size-4 animate-spin" />} Save address
            </button>
          </div>
        </form>
      </Card>

      {/* Card 3: Email Sender Identity */}
      <Card>
        <div className="flex items-start justify-between">
          <CardHeader
            title="Email sender"
            description="How update emails, login links and nudges appear in a client's inbox, and where their replies go."
            icon={Mail}
            tone="teal"
          />
          <button
            type="button"
            onClick={() => setPreviewEmailOpen(true)}
            className="rounded-full border border-[#ece6f4] bg-white px-3 py-1.5 text-xs font-semibold text-ink/75 hover:border-brand-300 hover:text-brand-700"
          >
            Preview an email
          </button>
        </div>

        <form onSubmit={saveBranding} className="mt-5 space-y-4 text-xs">
          {/* Inbox Preview Snippet */}
          <div className="rounded-xl border border-[#ece6f4] bg-[#fbf9fe] p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
              What a client sees in their inbox
            </p>
            <div className="mt-2 space-y-1 rounded-lg border border-black/5 bg-white p-2.5 text-[11px]">
              <p>
                <span className="text-ink/40">From: </span>
                <strong className="text-ink">{fromName || appName}</strong> &lt;{mailboxName || "reports"}@
                {sendingDomain || "ranklit.com"}&gt;
              </p>
              <p>
                <span className="text-ink/40">Reply-To: </span>
                <span className="font-mono text-ink/80">{replyToEmail || "support@youragency.com"}</span>
              </p>
              <p>
                <span className="text-ink/40">Subject: </span>
                <span className="text-ink">Your latest Google Maps results from {appName}</span>
              </p>
            </div>
            <p className="mt-2 text-[10px] text-ink/45">
              Emails are delivered by us but carry your name. When a client replies, it goes to your reply-to address.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-ink/80">From name</label>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Acme Local Pro"
                className={clsx(input, "mt-1 text-xs")}
              />
              <p className="mt-1 text-[11px] text-ink/50">The sender name beside the address.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/80">Reply-to email</label>
              <input
                type="email"
                value={replyToEmail}
                onChange={(e) => setReplyToEmail(e.target.value)}
                placeholder="support@youragency.com"
                className={clsx(input, "mt-1 text-xs")}
              />
              <p className="mt-1 text-[11px] text-ink/50">Where client replies land.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-ink/80">Mailbox name</label>
              <input
                type="text"
                value={mailboxName}
                onChange={(e) => setMailboxName(e.target.value)}
                placeholder="reports"
                className={clsx(input, "mt-1 text-xs")}
              />
              <p className="mt-1 text-[11px] text-ink/50">The part before the @ (e.g. reports, hello).</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/80">Sending domain</label>
              <input
                type="text"
                value={sendingDomain}
                onChange={(e) => setSendingDomain(e.target.value)}
                placeholder="reports.youragency.com"
                className={clsx(input, "mt-1 text-xs")}
              />
              <p className="mt-1 text-[11px] text-ink/50">Optional custom subdomain for outgoing emails.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={pending} className={btn.primary}>
              {pending && <Loader2 className="size-4 animate-spin" />} Save email sender
            </button>
          </div>
        </form>
      </Card>

      {/* Card 4: Report Branding shortcut */}
      <Card className="flex items-center justify-between border-[#ece6f4] bg-gradient-to-r from-white to-[#faf8fd]">
        <div>
          <h3 className="text-sm font-bold text-ink">Client Reports</h3>
          <p className="text-xs text-ink/60">
            Generate and publish white-label monthly performance reports for each client.
          </p>
        </div>
        <Link href="/dashboard/reports" className={btn.outline}>
          View reports <ChevronRight className="size-4" />
        </Link>
      </Card>

      {/* Email Preview Modal */}
      {previewEmailOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#ece6f4] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0ebf6] pb-3">
              <h3 className="text-sm font-bold text-ink">Client Email Preview</h3>
              <button
                type="button"
                onClick={() => setPreviewEmailOpen(false)}
                className="rounded-lg p-1 text-ink/50 hover:bg-ink/5"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-black/5 bg-[#faf8fc] p-4 text-xs">
              <div className="border-b border-black/5 pb-2 text-[11px]">
                <p>
                  <span className="text-ink/40">From:</span> <strong>{fromName || appName}</strong> &lt;
                  {mailboxName || "reports"}@{sendingDomain}&gt;
                </p>
                <p>
                  <span className="text-ink/40">To:</span> client@business.com
                </p>
                <p>
                  <span className="text-ink/40">Subject:</span> Your weekly Google Maps ranking update
                </p>
              </div>

              <div className="mt-4 space-y-3 rounded-lg bg-white p-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="grid size-6 place-items-center rounded text-xs font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {appName[0]}
                  </span>
                  <span className="font-bold text-ink">{appName}</span>
                </div>
                <p className="font-semibold text-ink">Hi there,</p>
                <p className="text-ink/70">
                  Here is your weekly local SEO performance report. Your Google Business Profile has gained 4 new top-3
                  keyword positions this week!
                </p>
                <div className="rounded-lg border border-black/5 bg-[#faf8fc] p-3 text-center">
                  <p className="text-[11px] text-ink/50">Average Map Rank</p>
                  <p className="text-2xl font-black text-ink">#1.8</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">↑ 3 positions climbed</p>
                </div>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xs"
                    style={{ backgroundColor: accentColor }}
                  >
                    View Your Live Dashboard
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewEmailOpen(false)}
                className={btn.primary}
              >
                Close preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
