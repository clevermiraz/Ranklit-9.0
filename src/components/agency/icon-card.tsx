import clsx from "clsx";
import { Bot, Hand, MapPin, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { AgencyIcon, IconCard as IconCardData, IconTone } from "@/lib/data/agency";

const icons: Record<AgencyIcon, LucideIcon> = {
  trending: TrendingUp,
  pin: MapPin,
  shield: ShieldCheck,
  hand: Hand,
  bot: Bot,
};

const tones: Record<IconTone, string> = {
  pink: "bg-pink-500/[0.14] text-pink-600",
  amber: "bg-amber-500/15 text-amber-600",
  violet: "bg-brand-100 text-brand-700",
  green: "bg-green-500/15 text-green-600",
  mint: "bg-green-500/15 text-green-300",
  lilac: "bg-brand-700/30 text-[#d9b8ff]",
  lavender: "bg-[#c8a8f5]/20 text-[#e9d5ff]",
  gold: "bg-amber-500/15 text-amber-300",
};

export function IconTile({ icon, tone, className }: { icon: AgencyIcon; tone: IconTone; className?: string }) {
  const Icon = icons[icon];
  return (
    <span className={clsx("grid size-[42px] shrink-0 place-items-center rounded-[13px]", tones[tone], className)}>
      <Icon className="size-5" strokeWidth={1.8} aria-hidden />
    </span>
  );
}

/** Feature card with a tinted icon tile. `dark` is for night sections. */
export function IconCard({ card, dark }: { card: IconCardData; dark?: boolean }) {
  return (
    <div
      className={clsx(
        "h-full rounded-3xl border p-[26px]",
        dark
          ? "border-white/[0.09] bg-white/[0.04]"
          : "border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(35,25,56,.05),0_12px_32px_-12px_rgba(35,25,56,.16)]",
      )}
    >
      <IconTile icon={card.icon} tone={card.tone} />
      <h3 className={clsx("mt-5 text-xl tracking-[-0.01em]", dark && "text-white")}>{card.title}</h3>
      <p className={clsx("mt-2 leading-[1.55]", dark ? "text-white/65" : "text-ink/65")}>{card.text}</p>
    </div>
  );
}

export function IconCardGrid({ cards, dark, className }: { cards: IconCardData[]; dark?: boolean; className?: string }) {
  return (
    <div className={clsx("grid gap-5", className)}>
      {cards.map((card, i) => (
        <Reveal key={card.title} delay={i * 110}>
          <IconCard card={card} dark={dark} />
        </Reveal>
      ))}
    </div>
  );
}
