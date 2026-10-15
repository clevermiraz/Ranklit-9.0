import { Link, Search, ShieldCheck, Sparkles, Star, TrendingUp, type LucideIcon } from "lucide-react";
import type { ToolIcon as ToolIconName } from "@/lib/data/tools";

const icons: Record<ToolIconName, LucideIcon> = {
  search: Search,
  "trending-up": TrendingUp,
  link: Link,
  star: Star,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
};

export function ToolIcon({ name, className }: { name: ToolIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} strokeWidth={1.8} aria-hidden />;
}
