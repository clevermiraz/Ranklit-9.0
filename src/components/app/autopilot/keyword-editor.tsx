"use client";

import { useState } from "react";
import clsx from "clsx";
import { AlertTriangle, Check, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { saveKeywordsAction } from "@/app/actions/autopilot";
import type { StrategyKeyword } from "@/lib/app/types";
import { Badge, btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";

const volumeText = (v: number | null) => (v === null || v === 0 ? "No searches" : `${v.toLocaleString()}/mo`);

export function KeywordEditor({
  keywords: initial,
  max,
  planName,
  neverScanned,
}: {
  keywords: StrategyKeyword[];
  max: number;
  planName: string;
  neverScanned: boolean;
}) {
  const { run, pending, push } = useAction();
  const [list, setList] = useState(initial);
  const [draft, setDraft] = useState("");
  const used = list.filter((k) => k.checked).length;
  const main = list.find((k) => k.role === "main");
  const dirty = JSON.stringify(list) !== JSON.stringify(initial);

  const update = (id: string, patch: Partial<StrategyKeyword>) => setList((l) => l.map((k) => (k.id === id ? { ...k, ...patch } : k)));

  const toggle = (k: StrategyKeyword) => {
    if (!k.checked && used >= max) {
      push({ kind: "error", text: `Your plan tracks up to ${max} keywords. Untick one first.` });
      return;
    }
    update(k.id, { checked: !k.checked });
  };

  const makeMain = (id: string) => setList((l) => l.map((k) => ({ ...k, role: k.id === id ? "main" : "secondary", checked: k.id === id ? true : k.checked })));

  const addOwn = () => {
    const term = draft.replace(/\s+/g, " ").trim().toLowerCase().slice(0, 80);
    if (!term) return;
    if (list.some((k) => k.term === term)) {
      push({ kind: "error", text: "That keyword is already in your list." });
      return;
    }
    const checked = used < max;
    setList((l) => [
      ...l,
      { id: `new-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, term, role: l.some((k) => k.role === "main") ? "secondary" : "main", volume: null, source: "Added by you", checked },
    ]);
    if (!checked) push({ kind: "info", text: `Added, but not tracked — you're at your ${max}-keyword limit.` });
    setDraft("");
  };

  return (
    <div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f8f6fb] px-3 py-2 text-sm">
        <span className="text-ink/65">
          Your <strong className="text-ink">{planName}</strong> plan tracks up to {max} keywords. Every checked keyword is scanned.
        </span>
        <Badge tone={used >= max ? "amber" : "purple"}>
          {used} of {max} used
        </Badge>
      </div>

      {list.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-[#d9cfe6] px-4 py-6 text-center text-sm text-ink/55">
          No keywords yet. Click <strong>Let Ranklit set it</strong> above, or add your own below.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {list.map((k) => (
            <li
              key={k.id}
              className={clsx(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                k.checked ? "border-brand-300 bg-[#f8f0fd]" : "border-[#ece6f4] bg-white",
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={k.checked}
                aria-label={`Track ${k.term}`}
                onClick={() => toggle(k)}
                className={clsx("grid size-5 shrink-0 place-items-center rounded-md border", k.checked ? "border-brand-700 bg-brand-700 text-white" : "border-[#cfc3de] bg-white")}
              >
                {k.checked && <Check className="size-3.5" strokeWidth={3} />}
              </button>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {k.term}
                  {k.role === "main" ? (
                    <Badge tone="purple" variant="solid" icon={Star}>
                      Main
                    </Badge>
                  ) : (
                    <Badge tone="gray">Secondary</Badge>
                  )}
                </span>
                <span className="block text-xs text-ink/55">
                  {volumeText(k.volume)} · {k.source}
                </span>
              </span>
              <button type="button" onClick={() => (k.role === "main" ? update(k.id, { role: "secondary" }) : makeMain(k.id))} className={clsx(btn.outline, btn.sm)}>
                {k.role === "main" ? "Make secondary" : "Make main"}
              </button>
              <button type="button" onClick={() => setList((l) => l.filter((x) => x.id !== k.id))} className="rounded-lg p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${k.term}`}>
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addOwn();
        }}
      >
        <div className="relative flex-1">
          <Plus className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add your own keyword…" className={clsx(input, "pl-9")} aria-label="Add your own keyword" />
        </div>
        <button type="submit" disabled={!draft.trim()} className={btn.outline}>
          Add
        </button>
      </form>

      {list.length > 0 && !main && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-sm text-orange-800">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Pick a main keyword.</strong> It&apos;s the search you most want to win — your bot leads with it in posts, replies and scans.
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#f0ebf6] pt-4">
        <button type="button" disabled={!dirty || pending} onClick={() => run(() => saveKeywordsAction(list))} className={btn.primary}>
          {pending && <Loader2 className="size-4 animate-spin" />} Save keywords
        </button>
        <span className="text-xs text-ink/55">
          {used} of {max} used
        </span>
        {dirty && (
          <button type="button" className={clsx(btn.ghost, "ml-auto")} onClick={() => setList(initial)}>
            Discard changes
          </button>
        )}
      </div>
      {neverScanned && used > 0 && <p className="mt-2 text-xs text-brand-700">Saving starts your free first map scan for this location.</p>}
    </div>
  );
}
