import { Bot, Globe, Megaphone, MessageSquareReply, Sparkles, TrendingUp } from "lucide-react";
import { Logo } from "@/components/logo";
import { RankGrid, type RankValue } from "@/components/rank-grid";

const previewGrid: RankValue[][] = [
  [6, 4, 3, 4, 7],
  [4, 2, 1, 2, 4],
  [3, 1, 1, 1, 3],
  [4, 2, 1, 2, 5],
  [7, 4, 3, 4, 12],
];

/** Split-screen layout for login / password pages: form on the left, product preview on the right. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-6 py-8 sm:px-14">
        <Logo />
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">{children}</div>
      </div>
      <aside className="relative hidden overflow-hidden bg-gradient-to-b from-brand-700 via-[#5f0f6e] to-night lg:flex lg:items-center lg:justify-center">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgb(255 255 255 / 0.12) 0 1px, transparent 1px 56px), linear-gradient(to right, rgb(255 255 255 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.08) 1px, transparent 1px)",
            backgroundSize: "auto, 56px 56px, 56px 56px",
          }}
          aria-hidden
        />
        <div className="relative w-full max-w-[500px] px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            <Sparkles className="size-3.5" /> AI agent for local SEO
          </span>
          <h2 className="tracking-display mt-4 text-[44px] leading-tight text-white">Your AI agent is on the job</h2>
          <p className="mt-3 text-lg leading-relaxed text-white/75">
            It posts updates, answers reviews, and tracks your rank on Google Maps. Log in to see what it did.
          </p>
          <div className="mt-10 rounded-2xl bg-white p-5 shadow-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-100 text-brand-700">
                  <Bot className="size-5" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold">Your AI agent</p>
                  <p className="text-xs text-ink/55">Avery Plumbing · Denver</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Working
              </span>
            </div>
            <div className="mt-5 flex items-center gap-6 rounded-xl border border-ink/[0.06] bg-canvas p-4">
              <div className="w-40 shrink-0">
                <RankGrid grid={previewGrid} size="sm" className="!rounded-none [&>svg]:hidden" />
              </div>
              <div>
                <p className="text-xs text-ink/55">Average rank on Google Maps</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight">3.6</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <TrendingUp className="size-3.5" /> Was 7.8 last month
                </p>
                <p className="mt-3 text-xs text-ink/55">Top 3 in 13 of 25 spots</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1">
              {[
                { icon: MessageSquareReply, text: "Replied to a new 5-star review", time: "2 min ago" },
                { icon: Megaphone, text: "Posted an update to your Google profile", time: "1 hr ago" },
                { icon: Globe, text: "Listed your business on 3 more sites", time: "Today" },
              ].map((a) => (
                <li key={a.text} className="flex items-center gap-3 py-2 text-sm">
                  <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
                    <a.icon className="size-4" />
                  </span>
                  <span className="flex-1">{a.text}</span>
                  <span className="text-xs text-ink/45">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-center text-xs text-white/50">Example of what your agent does</p>
        </div>
      </aside>
    </div>
  );
}

export const inputClass =
  "block h-11 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-[15px] text-ink placeholder:text-ink/40 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-100";

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.8l4-3z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}
