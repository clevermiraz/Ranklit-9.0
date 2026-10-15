import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

/** Sample agency brand used across every mockup. */
const BRAND = { name: "Acme Local Pro", primary: "#1e40af", accent: "#059669" };

export function BrowserFrame({
  url,
  children,
  bodyClassName,
  bodyStyle,
}: {
  url: string;
  children: ReactNode;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5" aria-hidden>
      <div className="flex items-center gap-3 border-b border-black/5 bg-canvas px-4 py-3">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-ink/40">{url}</span>
      </div>
      <div className={clsx("space-y-3 bg-canvas p-4 sm:p-5", bodyClassName)} style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}

function SuccessBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-green-600/20 bg-green-50 px-3 py-2.5 text-[11px] leading-snug text-green-900">
      <span className="mt-px grid size-3.5 shrink-0 place-items-center rounded-full bg-green-600 text-white">
        <Check className="size-2.5" strokeWidth={3.5} />
      </span>
      <span>{children}</span>
    </div>
  );
}

function Panel({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-3.5 shadow-sm">
      <p className="text-xs font-bold">{title}</p>
      <p className="mt-0.5 text-[10px] leading-snug text-ink/55">{intro}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-ink/80">{label}</p>
      <p className="mt-1 truncate rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-[11px]">{value}</p>
    </div>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-ink/80">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-[10px] text-ink/60">
        <span className="size-5 rounded" style={{ background: color }} />
        {color}
      </p>
    </div>
  );
}

/** Row A: agency branding settings with a live preview. */
export function BrandingMockup() {
  return (
    <BrowserFrame url="app.ranklit.com/dashboard/agency">
      <SuccessBanner>
        Your branding is <strong>live</strong>. Customers who visit your domain see your logo, colors, and name.
      </SuccessBanner>
      <Panel title="Agency" intro="Your customers will see this branding instead of Ranklit when they log in.">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-3">
            <Field label="App name (shown to your customers)" value={BRAND.name} />
            <div className="flex gap-4">
              <Swatch label="Primary color" color={BRAND.primary} />
              <Swatch label="Accent color" color={BRAND.accent} />
            </div>
          </div>
          <div>
            <div className="overflow-hidden rounded-lg border border-black/10">
              <div className="flex gap-1 border-b border-black/5 bg-canvas px-2 py-1">
                <span className="size-1.5 rounded-full bg-[#ff5f57]" />
                <span className="size-1.5 rounded-full bg-[#febc2e]" />
                <span className="size-1.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex h-[72px]">
                <div className="w-[38%] space-y-1.5 p-1.5" style={{ background: BRAND.primary }}>
                  <p className="flex items-center gap-1 text-[7px] font-semibold text-white">
                    <span className="grid size-2.5 place-items-center rounded-sm bg-white text-[6px] font-bold" style={{ color: BRAND.primary }}>
                      A
                    </span>
                    {BRAND.name}
                  </p>
                  {[80, 68, 56, 44].map((w) => (
                    <span key={w} className="block h-1 rounded bg-white/30" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="flex-1 space-y-1.5 p-2">
                  <span className="block h-1.5 w-3/4 rounded bg-ink/10" />
                  <span className="block h-1 w-full rounded bg-ink/[0.06]" />
                  <span className="block h-1 w-5/6 rounded bg-ink/[0.06]" />
                  <span className="mt-2 inline-block rounded px-1.5 py-0.5 text-[7px] font-semibold text-white" style={{ background: BRAND.accent }}>
                    Get started
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-1.5 text-[9px] text-ink/45">This is roughly what your customers see when they log in.</p>
          </div>
        </div>
      </Panel>
    </BrowserFrame>
  );
}

/** Row B: custom domain setup. */
export function DomainMockup() {
  return (
    <BrowserFrame url="app.ranklit.com/dashboard/agency">
      <Panel
        title="Custom domain"
        intro="Give your customers a login page at your own web address, so they never see ranklit.com."
      >
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          <span className="rounded-full border border-black/10 px-2.5 py-1 text-ink/55">Free instant address</span>
          <span className="rounded-full bg-brand-700 px-2.5 py-1 font-semibold text-white">Use my own domain</span>
        </div>
        <p className="mt-3 text-[10px] font-semibold text-ink/80">Step 1 — Choose your subdomain</p>
        <p className="mt-1 rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-[11px]">app.youragency.com</p>
        <p className="mt-1.5 text-[9px] text-ink/45">Add one CNAME record at your registrar. We check it automatically.</p>
        <p className="mt-2 flex items-center gap-2 overflow-hidden rounded-md bg-canvas px-2 py-1.5 font-mono text-[9px] text-ink/60">
          <span className="rounded bg-ink/10 px-1 py-0.5 font-bold text-ink/70">CNAME</span>
          <span>app</span>
          <span className="text-ink/35">→</span>
          <span className="truncate">clients.ranklit.com</span>
        </p>
      </Panel>
      <SuccessBanner>
        <strong>app.youragency.com</strong> is verified and live. Your client login page is ready to share.
      </SuccessBanner>
    </BrowserFrame>
  );
}

/** Row C: sending identity for client emails. */
export function EmailMockup() {
  return (
    <BrowserFrame url="app.ranklit.com/dashboard/agency">
      <Panel
        title="Email identity"
        intro="Choose how notification emails (weekly reports, rank updates, alerts) look to your customers."
      >
        <div className="rounded-lg bg-[#fcdffe]/40 p-2.5">
          <p className="text-[9px] font-semibold tracking-wide text-ink/55 uppercase">What your customers will see in their inbox</p>
          <div className="mt-2 space-y-1 rounded-md border border-black/5 bg-white p-2.5 text-[10px]">
            <p className="truncate">
              <span className="text-ink/45">From: </span>
              <strong>{BRAND.name}</strong> &lt;reports@youragency.com&gt;
            </p>
            <p className="truncate">
              <span className="text-ink/45">Reply-To: </span>support@youragency.com
            </p>
            <p className="truncate">
              <span className="text-ink/45">Subject: </span>Your weekly SEO results
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="From name" value={BRAND.name} />
          <Field label="Reply-to email" value="support@youragency.com" />
        </div>
      </Panel>
      <SuccessBanner>
        Verified. Emails send from <strong>reports@youragency.com</strong>, so your customers&apos; updates come from your
        domain.
      </SuccessBanner>
    </BrowserFrame>
  );
}

const kpis = [
  { label: "Google rating", value: "5.0", sub: "318 reviews" },
  { label: "Map ranking", value: "#1", sub: "92% in top 3" },
  { label: "Calls (30 days)", value: "213", sub: "56 direction requests" },
  { label: "Citations live", value: "518", sub: "Directory listings built" },
];

const activity = [
  { text: "Ranking scan completed", when: "Today" },
  { text: "Google post published", when: "Yesterday" },
  { text: "New citation published", when: "2 days ago" },
];

/** Row D: the read-only client dashboard, fully in the agency's brand. */
export function ClientDashboardMockup() {
  return (
    <BrowserFrame
      url="app.youragency.com"
      bodyClassName="!space-y-0 !p-0"
      bodyStyle={{ background: `linear-gradient(180deg, #ffffff 0%, ${BRAND.primary}0d 100%)` }}
    >
      <div className="flex items-center justify-between border-b border-black/5 bg-white/85 px-4 py-2.5">
        <p className="flex items-center gap-2 text-xs font-semibold" style={{ color: BRAND.primary }}>
          <span className="grid size-[18px] place-items-center rounded text-[10px] font-bold text-white" style={{ background: BRAND.primary }}>
            A
          </span>
          {BRAND.name}
        </p>
        <span className="text-[10px] text-ink/45">Sign out</span>
      </div>
      <div className="space-y-3 p-4 sm:p-5">
        <div>
          <p className="text-sm font-bold" style={{ color: BRAND.primary }}>
            Bright Home Cleaning
          </p>
          <p className="text-[10px] text-ink/55">Here&apos;s everything {BRAND.name} is doing to grow your local search presence.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-black/5 bg-white px-2.5 py-2 shadow-sm">
              <p className="text-[9px] font-medium text-ink/50">{k.label}</p>
              <p className="text-base font-bold tabular-nums">{k.value}</p>
              <p className="truncate text-[9px] text-ink/40">{k.sub}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-black/5 bg-white p-3 shadow-sm">
          <p className="text-[11px] font-semibold" style={{ color: BRAND.primary }}>
            Recent activity
          </p>
          <ul className="mt-2 space-y-1.5">
            {activity.map((a) => (
              <li key={a.text} className="flex items-center gap-2 text-[10px] text-ink/70">
                <span className="size-1.5 shrink-0 rounded-full" style={{ background: BRAND.accent }} />
                <span className="flex-1">{a.text}</span>
                <span className="text-[9px] text-ink/40">{a.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BrowserFrame>
  );
}

export const whiteLabelMockups = [BrandingMockup, DomainMockup, EmailMockup, ClientDashboardMockup];
