import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, Bot, Check, MessageSquareQuote, Minus, Sparkles, X } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { AI_ENGINES, type AiCheck } from "@/lib/app/types";
import { Badge, Card, CardHeader, IconTile, timeAgo } from "@/components/app/ui";
import { LineChart } from "@/components/app/charts";
import { HowWeMeasure, RunAiCheckButton } from "@/components/app/rankings/ai-controls";
import { ENGINE_STYLE } from "@/components/app/rankings/shared";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "AI Visibility" };

const pct = (c: AiCheck) => Math.round((c.results.filter((r) => r.named).length / Math.max(1, c.results.length)) * 100);
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default async function AiVisibilityPage() {
  const { business: s } = await getApp();
  const name = s.profile.name;
  const checks = [...s.aiChecks].sort((a, b) => a.runAt.localeCompare(b.runAt));
  const latest = checks.at(-1) ?? null;
  const previous = checks.at(-2) ?? null;
  const question = latest?.question ?? `Who is the best ${s.profile.primaryCategory.toLowerCase()} near ${s.profile.city}?`;

  return (
    <div className="mx-auto max-w-[710px] space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] leading-tight font-extrabold tracking-tight">AI Visibility</h1>
          <p className="mt-1 text-[15px] leading-relaxed text-ink/60">
            How often AI tools like ChatGPT and Google name <strong className="text-ink">{name}</strong> when people nearby ask for a business like yours.{" "}
            <HowWeMeasure question={question} business={name} />
          </p>
        </div>
        <div className="shrink-0 pt-1">
          <RunAiCheckButton />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/dashboard/upgrades" className="flex flex-col justify-between gap-3 rounded-2xl bg-gradient-to-br from-brand-700 to-[#5b1673] p-4 text-white hover:brightness-105">
          <span>
            <span className="flex items-center gap-1.5 text-sm font-bold">
              <Sparkles className="size-4" /> Get a free AI strategy assessment
            </span>
            <span className="mt-1 block text-xs text-white/80">See where AI tools miss your business, and how to fix it.</span>
          </span>
          <span className="self-start rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Learn more →</span>
        </Link>
        <Link href="/dashboard/upgrades" className="flex flex-col justify-between gap-3 rounded-2xl bg-[#2b3fd4] p-4 text-white hover:bg-[#2537c0]">
          <span>
            <span className="flex items-center gap-1.5 text-sm font-bold">
              <Bot className="size-4" /> Does AI name your business?
            </span>
            <span className="mt-1 block text-xs text-white/80">Founding deal: $49 a month for life instead of $99.</span>
          </span>
          <span className="self-start rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Try Recommended →</span>
        </Link>
      </div>

      {!latest ? (
        <Card className="!p-8 text-center">
          <IconTile icon={Bot} size="lg" className="mx-auto rounded-2xl" />
          <p className="mt-4 text-[17px] font-bold">No AI Visibility data yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-ink/60">
            Turn on autopilot to track how often AI search engines recommend your business for local queries. Or click Run Now to fire a one-off check.
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {AI_ENGINES.map((e) => (
              <li key={e} className="inline-flex items-center gap-1.5 rounded-full border border-[#ece6f4] bg-white py-1 pr-3 pl-1 text-xs font-semibold text-ink/75">
                <EngineMark engine={e} /> {e}
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <>
          <Card>
            <div className="flex flex-wrap items-center gap-5">
              <Ring value={pct(latest)} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-[0.12em] text-ink/45 uppercase">Overall visibility</p>
                <p className="mt-1 text-xl font-extrabold tracking-tight">
                  Named by {latest.results.filter((r) => r.named).length} of {latest.results.length} AI tools
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-sm text-ink/60">
                  {previous && <Delta value={pct(latest) - pct(previous)} />}
                  <span>Last checked {timeAgo(latest.runAt)} · {checks.length} check{checks.length === 1 ? "" : "s"} so far</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="!p-0">
            <div className="px-5 pt-5 pb-3">
              <CardHeader icon={Bot} title="By AI tool" description="Whether each tool named you in its latest answer, and where you appeared in its list." />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-[#ece6f4] text-left text-[11px] font-bold tracking-wider text-ink/45 uppercase">
                  <th className="px-5 py-2.5">AI tool</th>
                  <th className="px-3 py-2.5">Named you?</th>
                  <th className="px-3 py-2.5">Position</th>
                  <th className="hidden px-5 py-2.5 sm:table-cell">Recent checks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1ecf7]">
                {latest.results.map((r) => (
                  <tr key={r.engine}>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2 font-semibold">
                        <EngineMark engine={r.engine} /> {r.engine}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {r.named ? (
                        <Badge tone="green" icon={Check}>
                          Yes
                        </Badge>
                      ) : (
                        <Badge tone="gray" icon={X}>
                          No
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-3 font-bold">{r.position ? `#${r.position}` : <span className="font-normal text-ink/40">—</span>}</td>
                    <td className="hidden px-5 py-3 sm:table-cell">
                      <span className="flex items-center gap-1">
                        {checks.slice(-8).map((c) => {
                          const hit = c.results.find((x) => x.engine === r.engine)?.named;
                          return (
                            <span
                              key={c.id}
                              title={`${shortDate(c.runAt)}: ${hit ? "named" : "not named"}`}
                              className={clsx("size-2.5 rounded-full", hit ? "bg-brand-700" : "border border-ink/20 bg-white")}
                            />
                          );
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-5 py-3 text-xs text-ink/45">Filled dot = named you on that check, oldest to newest.</p>
          </Card>

          {checks.length > 1 && (
            <Card>
              <CardHeader icon={Sparkles} title="Visibility over time" description="Share of AI tools that named you, by check." />
              <LineChart labels={checks.map((c) => shortDate(c.runAt))} series={[{ name: "Visibility (%)", color: "#8d3ebb", values: checks.map(pct) }]} height={200} className="mt-4" />
            </Card>
          )}

          <Card>
            <CardHeader icon={MessageSquareQuote} title="Question asked" description={`Asked ${shortDate(latest.runAt)} · the same question goes to every AI tool.`} />
            <blockquote className="mt-4 rounded-xl border-l-4 border-brand-700 bg-[#f6f0fb] px-4 py-3 text-[15px] font-semibold text-ink">&ldquo;{latest.question}&rdquo;</blockquote>
          </Card>
        </>
      )}
    </div>
  );
}

function EngineMark({ engine }: { engine: string }) {
  const st = ENGINE_STYLE[engine] ?? { mark: engine.charAt(0), bg: "#8d3ebb" };
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: st.bg }} aria-hidden>
      {st.mark}
    </span>
  );
}

function Ring({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-[84px] shrink-0" aria-label={`${value}% visibility`}>
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#ece6f4" strokeWidth="7" />
        <circle cx="36" cy="36" r={r} fill="none" stroke="#8d3ebb" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-lg font-extrabold">{value}%</span>
    </div>
  );
}

function Delta({ value }: { value: number }) {
  if (value === 0)
    return (
      <span className="inline-flex items-center gap-0.5 font-semibold text-ink/50">
        <Minus className="size-3.5" /> Same as last check ·
      </span>
    );
  return (
    <span className={clsx("inline-flex items-center gap-0.5 font-semibold", value > 0 ? "text-emerald-600" : "text-red-500")}>
      {value > 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {value > 0 ? "+" : ""}
      {value} pts vs last check ·
    </span>
  );
}
