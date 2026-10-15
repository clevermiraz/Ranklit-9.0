import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GreenCheck } from "./feature-mockups";

/** Grid paper + purple/pink glow used behind product page heroes. */
export function HeroBackdrop() {
  return (
    <>
      <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" aria-hidden />
      <div
        className="absolute top-[-120px] left-1/2 h-[760px] w-[1200px] -translate-x-1/2 bg-[radial-gradient(closest-side_at_30%_45%,rgba(141,62,187,.2),transparent),radial-gradient(closest-side_at_72%_55%,rgba(252,223,254,.9),transparent)]"
        aria-hidden
      />
    </>
  );
}

/** White pill with a dark gradient tag, e.g. [✦ AI AGENT] Features */
export function HeroPill({ icon: Icon, tag, children }: { icon: LucideIcon; tag: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/80 py-1 pr-3.5 pl-1 text-[13px] font-semibold text-ink/75 shadow-[0_1px_2px_rgba(35,25,56,.06)]">
      <span className="flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#8d3ebb,#231938)] px-2.5 py-1 text-[11px] font-extrabold tracking-[0.06em] text-white uppercase">
        <Icon className="size-3" aria-hidden /> {tag}
      </span>
      {children}
    </span>
  );
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={clsx("group inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline", className)}
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

export function CheckLine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={clsx("flex items-start gap-2.5 font-semibold", className)}>
      <GreenCheck className="mt-px size-5" />
      <span>{children}</span>
    </p>
  );
}
