import type { ReactNode } from "react";
import clsx from "clsx";
import { Sparkles } from "lucide-react";

/** Light hero shell: faint grid plus purple/lavender glows. */
export function AgencyHeroShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={clsx("relative overflow-hidden", className)}>
      <div className="bg-grid absolute inset-0 [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_95%)]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[760px] w-[1200px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(closest-side at 30% 45%, rgba(141,62,187,.24), transparent), radial-gradient(closest-side at 72% 55%, rgba(252,223,254,.95), transparent)",
        }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </section>
  );
}

/** "AI AGENT | label" pill shown above hero headlines. */
export function AgentPill({ children }: { children: ReactNode }) {
  return (
    <span className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/80 py-1 pr-3.5 pl-1 text-[13px] font-semibold text-ink/75">
      <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-700 to-night px-2.5 py-1 text-[11px] font-extrabold tracking-[0.06em] text-white">
        <Sparkles className="size-3" aria-hidden /> AI AGENT
      </span>
      {children}
    </span>
  );
}
