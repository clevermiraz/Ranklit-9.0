"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Loader2, RefreshCw, ScanSearch, Undo2 } from "lucide-react";
import type { WebsiteFix } from "@/lib/app/types";
import { useAction } from "@/components/app/toast";
import { Badge, Card, ProgressBar, btn } from "@/components/app/ui";
import { checkWebsiteAction, recheckWebsiteAction, toggleWebsiteFixAction } from "@/app/actions/website";

export function CheckWebsiteButton({ domain }: { domain: string }) {
  const { run, pending } = useAction();
  return (
    <button type="button" disabled={pending} onClick={() => run(() => checkWebsiteAction())} className={btn.primary}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <ScanSearch className="size-4" />}
      {pending ? `Checking ${domain}…` : "Check my website"}
    </button>
  );
}

const groups: { impact: WebsiteFix["impact"]; label: string; text: string; tone: "red" | "amber" | "gray" }[] = [
  { impact: "high", label: "High impact", text: "Do these first — they change how Google reads your site.", tone: "red" },
  { impact: "medium", label: "Medium impact", text: "Worth an afternoon once the big ones are done.", tone: "amber" },
  { impact: "low", label: "Quick wins", text: "Small touches that help customers and Google trust you.", tone: "gray" },
];

export function FixesList({ fixes }: { fixes: WebsiteFix[] }) {
  const { run, pending } = useAction();
  const [busy, setBusy] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(true);
  const done = fixes.filter((f) => f.done).length;
  const pct = fixes.length ? Math.round((done / fixes.length) * 100) : 0;

  const toggle = (id: string) => {
    setBusy(id);
    run(() => toggleWebsiteFixAction(id), () => setBusy(null));
  };
  const recheck = () => {
    setBusy("__recheck");
    run(() => recheckWebsiteAction(), () => setBusy(null));
  };

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center gap-5">
        <div className="min-w-[220px] flex-1">
          <p className="text-sm text-ink/60">Your progress</p>
          <p className="text-2xl font-extrabold tracking-tight">
            {done} of {fixes.length} done
          </p>
          <ProgressBar value={pct} className="mt-2" />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} className="size-4 accent-brand-700" />
          Show finished
        </label>
        <button type="button" disabled={pending} onClick={recheck} className={btn.outline}>
          {busy === "__recheck" ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Re-check
        </button>
      </Card>

      {groups.map((g) => {
        const items = fixes.filter((f) => f.impact === g.impact && (showDone || !f.done));
        if (!items.length) return null;
        return (
          <Card key={g.impact} className="!p-0">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#ece6f4] px-5 py-3">
              <Badge tone={g.tone} variant={g.impact === "high" ? "solid" : "soft"}>
                {g.label}
              </Badge>
              <span className="text-sm text-ink/55">{g.text}</span>
            </div>
            <ul className="divide-y divide-[#f1ecf7]">
              {items.map((f) => (
                <li key={f.id} className="flex flex-wrap items-start gap-3 px-5 py-4">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => toggle(f.id)}
                    aria-label={f.done ? `Undo ${f.title}` : `Mark ${f.title} done`}
                    className={clsx("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border transition", f.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#d9cfe6] hover:border-brand-400")}
                  >
                    {f.done && <Check className="size-3.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={clsx("text-sm font-semibold", f.done && "text-ink/45 line-through")}>{f.title}</p>
                    <p className={clsx("mt-0.5 max-w-2xl text-sm leading-relaxed", f.done ? "text-ink/40" : "text-ink/65")}>{f.detail}</p>
                  </div>
                  <button type="button" disabled={pending} onClick={() => toggle(f.id)} className={clsx(f.done ? btn.outline : btn.primary, btn.sm)}>
                    {busy === f.id ? <Loader2 className="size-3.5 animate-spin" /> : f.done ? <Undo2 className="size-3.5" /> : <Check className="size-3.5" />}
                    {f.done ? "Undo" : "Mark done"}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
      {!showDone && done === fixes.length && <p className="py-6 text-center text-sm text-ink/55">Everything&apos;s done. Re-check after you change your site.</p>}
    </div>
  );
}
