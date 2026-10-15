"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, Loader2, Plus, RotateCw } from "lucide-react";
import { addLearnedKeywordsAction, readWebsiteAction, saveStrategyFieldAction, saveTargetKeywordsAction } from "@/app/actions/autopilot";
import { btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import { TagInput } from "@/components/app/settings/tag-input";

/** Target keywords: every add/remove saves straight away. */
export function TargetKeywordsInput({ value }: { value: string[] }) {
  const { run, pending } = useAction();
  const [list, setList] = useState(value);
  const [prev, setPrev] = useState(value);
  if (prev !== value) {
    setPrev(value);
    setList(value);
  }
  return (
    <div>
      <TagInput
        label="Target keywords"
        value={list}
        lowercase
        max={40}
        placeholder="e.g. dentist near me"
        onChange={(next) => {
          setList(next);
          run(() => saveTargetKeywordsAction(next));
        }}
      />
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/55">
        {pending && <Loader2 className="size-3 animate-spin" />}
        {list.length} target keyword{list.length === 1 ? "" : "s"} · Weekly auto-scans use the checked keywords above; set them up in{" "}
        <Link href="/settings/automations" className="font-semibold text-brand-700 hover:underline">
          Automations
        </Link>
        .
      </p>
    </div>
  );
}

export function WebsiteLearned({ learned, website, services }: { learned: string[] | null; website: string; services: string[] }) {
  const { run, pending } = useAction();
  const [adding, setAdding] = useState(false);
  const isService = (l: string) => services.includes(l);
  return (
    <div className="mt-4">
      {learned === null ? (
        <p className="rounded-xl border border-dashed border-[#d9cfe6] px-4 py-5 text-center text-sm text-ink/55">
          We haven&apos;t read your website yet. {website ? "Click below and we'll pull your services and service areas from it." : "Add your website in Settings → Account first."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Services we found", items: learned.filter(isService) },
            { title: "Areas you serve", items: learned.filter((l) => !isService(l)) },
          ].map((g) => (
            <div key={g.title} className="rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-3">
              <p className="text-xs font-semibold text-ink/55">{g.title}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {g.items.length ? (
                  g.items.map((i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium ring-1 ring-[#ece6f4]">
                      <Check className="size-3 text-emerald-600" /> {i}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-ink/45">Nothing found</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={pending || !website} onClick={() => run(() => readWebsiteAction())} className={btn.outline}>
          {pending && !adding ? <Loader2 className="size-4 animate-spin" /> : <RotateCw className="size-4" />} {learned === null ? "Read website now" : "Read again"}
        </button>
        {learned !== null && learned.some(isService) && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setAdding(true);
              run(() => addLearnedKeywordsAction(), () => setAdding(false));
            }}
            className={btn.soft}
          >
            {pending && adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Add as keywords
          </button>
        )}
      </div>
    </div>
  );
}

type Field = "customer" | "services" | "differentiators" | "competitors";

/** Editor for one strategy field: a one-line sentence or a tag list, with Save. */
export function StrategyFieldEditor({ field, value, placeholder }: { field: Field; value: string | string[]; placeholder: string }) {
  const { run, pending } = useAction();
  const [draft, setDraft] = useState(value);
  const [prev, setPrev] = useState(value);
  if (prev !== value) {
    setPrev(value);
    setDraft(value);
  }
  const dirty = JSON.stringify(draft) !== JSON.stringify(value);
  return (
    <div className="mt-3">
      {typeof draft === "string" ? (
        <input className={input} value={draft} maxLength={240} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)} aria-label={field} />
      ) : (
        <TagInput label={field} value={draft} onChange={setDraft} placeholder={placeholder} max={20} />
      )}
      <div className="mt-3 flex items-center gap-3">
        <button type="button" disabled={!dirty || pending} onClick={() => run(() => saveStrategyFieldAction(field, draft))} className={clsx(btn.primary, btn.sm)}>
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : !dirty && <Check className="size-3.5" />} {dirty ? "Save" : "Saved"}
        </button>
        {typeof draft !== "string" && <span className="text-xs text-ink/45">Press Enter to add each one.</span>}
      </div>
    </div>
  );
}
