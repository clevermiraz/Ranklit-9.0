import Link from "next/link";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

/*
 * Dashboard UI kit. Mirrors the product app's look: white rounded-2xl cards with a hairline
 * lavender border on a light lavender page, purple primary pills, lavender icon tiles.
 */

export type Tone = "purple" | "amber" | "green" | "red" | "blue" | "teal" | "fuchsia" | "gray";

export const toneTile: Record<Tone, string> = {
  purple: "bg-[#f3e8fb] text-brand-700",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500",
  blue: "bg-blue-50 text-blue-600",
  teal: "bg-teal-50 text-teal-600",
  fuchsia: "bg-fuchsia-50 text-fuchsia-600",
  gray: "bg-ink/[0.05] text-ink/60",
};

export function IconTile({ icon: Icon, tone = "purple", size = "md", className }: { icon: LucideIcon; tone?: Tone; size?: "sm" | "md" | "lg"; className?: string }) {
  const s = { sm: "size-8 [&>svg]:size-4", md: "size-10 [&>svg]:size-5", lg: "size-12 [&>svg]:size-6" }[size];
  return (
    <span className={clsx("grid shrink-0 place-items-center rounded-xl", toneTile[tone], s, className)}>
      <Icon />
    </span>
  );
}

/** Page title block: H1 + subtitle, optional right-side actions. */
export function PageHeader({
  title,
  subtitle,
  icon,
  iconClass,
  actions,
  back,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: LucideIcon;
  iconClass?: string;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  const Icon = icon;
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink">
            ← {back.label}
          </Link>
        )}
        <h1 className="flex items-center gap-2 text-[28px] leading-tight font-extrabold tracking-tight">
          {Icon && <Icon className={clsx("size-7", iconClass ?? "text-brand-700")} />}
          {title}
        </h1>
        {subtitle && <div className="mt-1 max-w-3xl text-[15px] leading-relaxed text-ink/60">{subtitle}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children, ...props }: ComponentProps<"section">) {
  return (
    <section className={clsx("rounded-2xl border border-[#ece6f4] bg-white p-5 shadow-[0_1px_2px_rgba(35,25,56,.04)]", className)} {...props}>
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  icon,
  tone,
  actions,
  badge,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {icon && <IconTile icon={icon} tone={tone} size="sm" />}
        <div className="min-w-0">
          <h2 className="flex flex-wrap items-center gap-2 text-[17px] font-bold tracking-tight">
            {title}
            {badge}
          </h2>
          {description && <p className="mt-0.5 text-sm text-ink/60">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon, tone = "purple", sub, children }: { label: string; value: ReactNode; icon?: LucideIcon; tone?: Tone; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#ece6f4] bg-white p-4 py-6 shadow-[0_1px_2px_rgba(35,25,56,.04)]">
      {icon && <IconTile icon={icon} tone={tone} />}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink/60">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight">{value}</p>
        {sub && <p className="text-xs text-ink/45">{sub}</p>}
        {children}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  tone = "purple",
  title,
  text,
  children,
  dashed,
}: {
  icon: LucideIcon;
  tone?: Tone;
  title: string;
  text?: ReactNode;
  children?: ReactNode;
  dashed?: boolean;
}) {
  return (
    <div className={clsx("flex flex-col items-center px-6 py-12 text-center", dashed && "rounded-2xl border-2 border-dashed border-[#e4dcef]")}>
      <IconTile icon={icon} tone={tone} size="lg" className="rounded-2xl" />
      <p className="mt-4 text-[17px] font-bold">{title}</p>
      {text && <p className="mt-1 max-w-md text-sm leading-relaxed text-ink/60">{text}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7b2fa8] disabled:cursor-not-allowed disabled:opacity-50",
  outline:
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-[#e4dcef] bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-300 disabled:cursor-not-allowed disabled:opacity-50",
  soft: "inline-flex items-center justify-center gap-1.5 rounded-full bg-[#f3e8fb] px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-[#ead6f8] disabled:opacity-50",
  amber:
    "inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50",
  fuchsia:
    "inline-flex items-center justify-center gap-1.5 rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-50",
  ghost: "inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink/70 hover:bg-ink/5 hover:text-ink disabled:opacity-50",
  danger: "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50",
  sm: "!px-3 !py-1.5 !text-xs",
};

export const input =
  "h-10 w-full rounded-lg border border-[#e4dcef] bg-white px-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-brand-600 focus:ring-4 focus:ring-brand-100 disabled:bg-[#f7f4fb] disabled:text-ink/50";

export const textarea =
  "w-full rounded-lg border border-[#e4dcef] bg-white p-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-brand-600 focus:ring-4 focus:ring-brand-100";

export function Label({ children, hint, htmlFor }: { children: ReactNode; hint?: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
      {children} {hint && <span className="font-normal text-ink/45">{hint}</span>}
    </label>
  );
}

export function Badge({ tone = "purple", variant = "soft", children, icon: Icon }: { tone?: Tone; variant?: "soft" | "solid" | "outline"; children: ReactNode; icon?: LucideIcon }) {
  const soft: Record<Tone, string> = {
    purple: "bg-[#f3e8fb] text-brand-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    teal: "bg-teal-50 text-teal-700",
    fuchsia: "bg-fuchsia-50 text-fuchsia-700",
    gray: "bg-ink/[0.05] text-ink/60",
  };
  const solid: Record<Tone, string> = {
    purple: "bg-brand-700 text-white",
    amber: "bg-amber-500 text-white",
    green: "bg-emerald-600 text-white",
    red: "bg-red-600 text-white",
    blue: "bg-blue-600 text-white",
    teal: "bg-teal-600 text-white",
    fuchsia: "bg-fuchsia-600 text-white",
    gray: "bg-ink/60 text-white",
  };
  const outline: Record<Tone, string> = {
    purple: "border border-brand-300 text-brand-700",
    amber: "border border-amber-300 text-amber-700",
    green: "border border-emerald-300 text-emerald-700",
    red: "border border-red-300 text-red-700",
    blue: "border border-blue-300 text-blue-700",
    teal: "border border-teal-300 text-teal-700",
    fuchsia: "border border-fuchsia-300 text-fuchsia-700",
    gray: "border border-ink/15 text-ink/60",
  };
  const cls = { soft, solid, outline }[variant][tone];
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap", cls)}>
      {Icon && <Icon className="size-3" />}
      {children}
    </span>
  );
}

/** Small "caps" label used for groups and metric names. */
export function Caps({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx("text-[11px] font-bold tracking-[0.12em] text-ink/45 uppercase", className)}>{children}</p>;
}

export function ProgressBar({ value, className, tone = "purple" }: { value: number; className?: string; tone?: "purple" | "green" | "amber" }) {
  const color = { purple: "bg-brand-700", green: "bg-emerald-500", amber: "bg-amber-500" }[tone];
  return (
    <span className={clsx("block h-1.5 overflow-hidden rounded-full bg-[#ece6f4]", className)}>
      <span className={clsx("block h-full rounded-full transition-all", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </span>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-label="Loading">
      <div className="h-8 w-56 rounded-lg bg-[#ece6f4]" />
      <div className="h-4 w-96 max-w-full rounded bg-[#ece6f4]" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-white" />
    </div>
  );
}

export function formatDate(iso: string, style: "short" | "long" | "numeric" = "short") {
  const d = new Date(iso);
  if (style === "numeric") return d.toLocaleDateString("en-GB");
  return d.toLocaleDateString("en-US", style === "long" ? { month: "long", day: "numeric", year: "numeric" } : { month: "short", day: "numeric" });
}

export function timeAgo(iso: string, now = Date.now()) {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  const d = Math.floor(s / 86400);
  if (d < 30) return d === 1 ? "1 day ago" : `${d} days ago`;
  const m = Math.floor(d / 30);
  return m === 1 ? "1 month ago" : `${m} months ago`;
}
