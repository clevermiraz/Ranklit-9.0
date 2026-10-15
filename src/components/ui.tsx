import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("mx-auto w-full max-w-6xl px-5 sm:px-6", className)}>{children}</div>;
}

type ButtonVariant = "primary" | "secondary" | "dark" | "white" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 cursor-pointer";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand-gradient text-white shadow-brand hover:-translate-y-0.5 hover:brightness-110",
  secondary: "border border-ink/10 bg-white text-ink shadow-card hover:-translate-y-0.5 hover:border-ink/20",
  dark: "bg-ink text-white hover:bg-ink/90",
  white: "bg-white text-ink shadow-lift hover:-translate-y-0.5",
  ghost: "text-ink/70 hover:text-ink",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[15px]",
  md: "h-12 px-6 text-base",
  lg: "h-15 px-8 text-lg",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return clsx(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
};

export function ButtonLink({ variant, size, arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <ArrowRight className="size-[1.1em]" strokeWidth={2.25} aria-hidden />}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function Eyebrow({ children, dark, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]",
        dark ? "border-white/15 bg-white/5 text-white/90" : "border-brand-200 bg-brand-50 text-brand-700",
        className,
      )}
    >
      <span className={clsx("size-1.5 rounded-full", dark ? "bg-brand-300" : "bg-brand-600")} aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  intro,
  dark,
  align = "center",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  highlight?: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={clsx(align === "center" ? "mx-auto text-center" : "", "max-w-3xl", className)}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <Tag
        className={clsx(
          "tracking-display mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-[52px]",
          dark && "text-white",
        )}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className={dark ? "text-gradient-light" : "text-gradient"}>{highlight}</span>
          </>
        )}
      </Tag>
      {intro && (
        <p className={clsx("mt-5 text-lg leading-relaxed sm:text-xl", dark ? "text-white/65" : "text-ink/65")}>
          {intro}
        </p>
      )}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("rounded-3xl border border-ink/[0.06] bg-white shadow-card", className)}>{children}</div>;
}

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "green" | "amber" | "red" | "gray" | "blue";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 border-brand-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-ink/[0.04] text-ink/70 border-ink/10",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function Stars({ className = "size-4" }: { className?: string }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}
