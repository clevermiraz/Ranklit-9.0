"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, FileText, Pencil, Tag, Wrench, X } from "lucide-react";
import type { ProfileSuggestion } from "@/lib/app/types";
import { approveSuggestionAction, rejectSuggestionAction } from "@/app/actions/gbp";
import { useAction } from "@/components/app/toast";
import { Badge, Card, textarea } from "@/components/app/ui";
import { DESCRIPTION_MAX, wordDiff } from "./logic";

const fieldMeta = {
  description: { label: "Description", icon: FileText },
  categories: { label: "Categories", icon: Tag },
  services: { label: "Services", icon: Wrench },
} as const;

export function SuggestionsCard({ suggestions }: { suggestions: ProfileSuggestion[] }) {
  if (!suggestions.length) return null;
  return (
    <Card>
      <h2 className="flex flex-wrap items-center gap-2 text-[17px] font-bold tracking-tight">
        Changes awaiting your approval <Badge tone="amber">{suggestions.length} to review</Badge>
      </h2>
      <p className="mt-0.5 text-sm text-ink/60">Your agent proposed these updates to your Google Business Profile. Approve, tweak, or dismiss each one before it goes live.</p>
      <div className="mt-4 space-y-3">
        {suggestions.map((s) => (
          <SuggestionRow key={s.id} s={s} />
        ))}
      </div>
    </Card>
  );
}

function SuggestionRow({ s }: { s: ProfileSuggestion }) {
  const [showDiff, setShowDiff] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(s.after);
  const { run, pending } = useAction();
  const meta = fieldMeta[s.field];
  const over = s.field === "description" && draft.length > DESCRIPTION_MAX;

  return (
    <div className="rounded-xl border border-[#ece6f4] bg-[#f8f4fc]">
      <div className="flex gap-3 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-brand-700 shadow-sm">
          <meta.icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
            {meta.label} <span className="text-[10px] font-bold tracking-[0.12em] text-ink/45 uppercase">{s.source}</span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">{s.explanation}</p>

          {showDiff && !editing && (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <DiffBox title="Before" text={s.before} after={s.after} side="before" />
              <DiffBox title="After" text={s.after} after={s.after} before={s.before} side="after" />
            </div>
          )}

          {editing && (
            <div className="mt-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={s.field === "description" ? 6 : 3}
                className={clsx(textarea, "bg-white leading-relaxed", over && "!border-red-400")}
                aria-label={`Edit suggested ${meta.label.toLowerCase()}`}
              />
              <p className={clsx("mt-1 text-right text-xs", over ? "font-semibold text-red-600" : "text-ink/45")}>
                {s.field === "description" ? `${draft.length} / ${DESCRIPTION_MAX}` : "Separate items with commas"}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ece6f4] px-4 py-2.5">
        {editing ? (
          <button type="button" onClick={() => {
              setEditing(false);
              setDraft(s.after);
            }} className="text-sm font-semibold text-ink/55 hover:text-ink">
            Cancel edit
          </button>
        ) : (
          <button type="button" onClick={() => setShowDiff((v) => !v)} className="text-sm font-semibold text-brand-700 hover:underline" aria-expanded={showDiff}>
            {showDiff ? "Hide before / after" : "Show before / after"}
          </button>
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pending || over || !draft.trim()}
            onClick={() => run(() => approveSuggestionAction(s.id, editing ? draft : undefined))}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check className="size-4" /> {editing ? "Approve edit" : "Approve"}
          </button>
          {!editing && (
            <button type="button" disabled={pending} onClick={() => {
                setEditing(true);
                setShowDiff(false);
              }} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink/65 hover:bg-white hover:text-ink">
              <Pencil className="size-3.5" /> Edit
            </button>
          )}
          <button type="button" disabled={pending} onClick={() => run(() => rejectSuggestionAction(s.id))} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink/65 hover:bg-white hover:text-red-600">
            <X className="size-4" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function DiffBox({ title, text, before, after, side }: { title: string; text: string; before?: string; after: string; side: "before" | "after" }) {
  const parts = side === "before" ? wordDiff(text, after) : wordDiff(before ?? "", text);
  return (
    <div className="rounded-lg border border-[#ece6f4] bg-white p-3">
      <p className="text-[10px] font-bold tracking-[0.12em] text-ink/45 uppercase">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed">
        {text
          ? parts.map((p, i) =>
              p.kind === "same" ? (
                <span key={i}>{p.text}</span>
              ) : p.kind === "del" && side === "before" ? (
                <del key={i} className="rounded bg-red-50 text-red-700 decoration-red-400">
                  {p.text}
                </del>
              ) : p.kind === "add" && side === "after" ? (
                <ins key={i} className="rounded bg-emerald-50 text-emerald-800 no-underline">
                  {p.text}
                </ins>
              ) : null,
            )
          : <span className="text-ink/40 italic">Empty</span>}
      </p>
    </div>
  );
}
