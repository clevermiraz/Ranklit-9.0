"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { Info, LoaderCircle, Plus, ShieldCheck, Sparkles, Star, X } from "lucide-react";
import type { BusinessProfile } from "@/lib/app/types";
import { saveCategoriesAction, saveDescriptionAction, saveHoursAction, saveServicesAction } from "@/app/actions/gbp";
import { useAction } from "@/components/app/toast";
import { Switch } from "@/components/app/controls";
import { btn, Caps, input, textarea } from "@/components/app/ui";
import { DAY_NAMES, DESCRIPTION_MAX, from24, generateDescription, to24, type AiContext } from "./logic";

export function Notice({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "purple" }) {
  return (
    <div className={clsx("flex gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-relaxed", tone === "green" ? "border-emerald-200 bg-emerald-50/70 text-emerald-900" : "border-brand-200 bg-[#f8f4fc] text-brand-900")}>
      {tone === "green" ? <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /> : <Info className="mt-0.5 size-4 shrink-0 text-brand-700" />}
      <p>{children}</p>
    </div>
  );
}

function SaveBar({ dirty, pending, onSave, onReset, extra, disabled }: { dirty: boolean; pending: boolean; onSave: () => void; onReset: () => void; extra?: ReactNode; disabled?: boolean }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#ece6f4] pt-4">
      <button type="button" onClick={onSave} disabled={!dirty || pending || disabled} className={btn.primary}>
        {pending && <LoaderCircle className="size-4 animate-spin" />} Save to Google
      </button>
      {dirty && (
        <button type="button" onClick={onReset} disabled={pending} className={btn.ghost}>
          Discard changes
        </button>
      )}
      {extra}
      {!dirty && <span className="ml-auto text-xs text-ink/45">No unsaved changes</span>}
    </div>
  );
}

// ---- hours ----------------------------------------------------------------------------------

type HourRow = { day: BusinessProfile["hours"][number]["day"]; open: string; close: string; closed: boolean };
const toRows = (hours: BusinessProfile["hours"]): HourRow[] =>
  hours.map((h) => ({ day: h.day, open: to24(h.open) || "09:00", close: to24(h.close) || "17:00", closed: !h.open }));

export function HoursEditor({ hours }: { hours: BusinessProfile["hours"] }) {
  const initial = toRows(hours);
  const [rows, setRows] = useState(initial);
  const { run, pending } = useAction();
  const dirty = JSON.stringify(rows) !== JSON.stringify(initial);
  const bad = rows.filter((r) => !r.closed && (!r.open || !r.close || r.close <= r.open)).map((r) => r.day);
  const set = (i: number, patch: Partial<HourRow>) => setRows((all) => all.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const copyMonday = () => setRows((all) => all.map((r, i) => (i > 0 && i < 5 ? { ...r, open: all[0].open, close: all[0].close, closed: all[0].closed } : r)));
  const save = () =>
    run(() => saveHoursAction(rows.map((r) => (r.closed ? { day: r.day, open: null, close: null } : { day: r.day, open: from24(r.open), close: from24(r.close) }))));

  return (
    <div>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={r.day} className={clsx("flex flex-wrap items-center gap-3 rounded-xl px-3.5 py-2.5", bad.includes(r.day) ? "bg-red-50" : "bg-[#f8f4fc]")}>
            <span className="w-24 text-sm font-semibold">{DAY_NAMES[r.day]}</span>
            <Switch checked={!r.closed} onChange={(v) => set(i, { closed: !v })} label={`Open on ${DAY_NAMES[r.day]}`} />
            <span className="w-14 text-xs text-ink/55">{r.closed ? "Closed" : "Open"}</span>
            {!r.closed && (
              <span className="ml-auto flex items-center gap-2 text-sm">
                <input type="time" value={r.open} onChange={(e) => set(i, { open: e.target.value })} className={clsx(input, "!h-9 w-[120px]")} aria-label={`${DAY_NAMES[r.day]} opening time`} />
                <span className="text-ink/40">–</span>
                <input type="time" value={r.close} onChange={(e) => set(i, { close: e.target.value })} className={clsx(input, "!h-9 w-[120px]")} aria-label={`${DAY_NAMES[r.day]} closing time`} />
              </span>
            )}
          </li>
        ))}
      </ul>
      {bad.length > 0 && <p className="mt-2 text-sm text-red-600">Closing time must be after opening time ({bad.join(", ")}).</p>}
      <SaveBar
        dirty={dirty}
        pending={pending}
        disabled={bad.length > 0}
        onSave={save}
        onReset={() => setRows(initial)}
        extra={
          <button type="button" onClick={copyMonday} className={btn.ghost}>
            Copy Monday to weekdays
          </button>
        }
      />
    </div>
  );
}

// ---- description -----------------------------------------------------------------------------

export function DescriptionEditor({ live, ctx }: { live: string; ctx: AiContext }) {
  const [text, setText] = useState(live);
  const [variant, setVariant] = useState(0);
  const [writing, setWriting] = useState(false);
  const { run, pending, push } = useAction();
  const over = text.length > DESCRIPTION_MAX;
  const dirty = text.trim() !== live.trim();

  const writeWithAi = () => {
    setWriting(true);
    setTimeout(() => {
      setText(generateDescription(ctx, variant));
      setVariant((v) => v + 1);
      setWriting(false);
      push({ kind: "info", text: "AI draft ready. Review and edit before saving." });
    }, 700);
  };

  return (
    <div className="space-y-4">
      <Notice>Saving updates your live Google Business Profile description in real time. AI suggestions populate the editor. Review and edit before saving.</Notice>
      <div>
        <Caps>Currently live on Google</Caps>
        <p className="mt-1.5 rounded-xl bg-[#f8f4fc] p-3.5 text-sm leading-relaxed whitespace-pre-line text-ink/80">{live || <span className="text-ink/40 italic">No description yet.</span>}</p>
      </div>
      <div>
        <div className="flex items-end justify-between">
          <Caps>Your description</Caps>
          <span className={clsx("text-xs", over ? "font-semibold text-red-600" : "text-ink/45")}>
            {text.length} / {DESCRIPTION_MAX}
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className={clsx(textarea, "mt-1.5 leading-relaxed", over && "!border-red-400")}
          placeholder="Describe what you do, who you serve and where — in plain language."
          aria-label="Your description"
        />
        {over && <p className="mt-1 text-sm text-red-600">Google cuts descriptions off at {DESCRIPTION_MAX} characters. Trim {text.length - DESCRIPTION_MAX} more.</p>}
      </div>
      <SaveBar
        dirty={dirty}
        pending={pending}
        disabled={over || text.trim().length < 50}
        onSave={() => run(() => saveDescriptionAction(text))}
        onReset={() => setText(live)}
        extra={
          <button type="button" onClick={writeWithAi} disabled={writing} className={btn.soft}>
            {writing ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />} {variant ? "Write another" : "Write with AI"}
          </button>
        }
      />
    </div>
  );
}

// ---- chips editor (categories + services) ------------------------------------------------------

function ChipInput({ items, onRemove, onAdd, placeholder, suggestions, max, primary }: { items: string[]; onRemove: (i: number) => void; onAdd: (v: string) => void; placeholder: string; suggestions: string[]; max?: number; primary?: string }) {
  const [value, setValue] = useState("");
  const full = max !== undefined && items.length >= max;
  const add = (v: string) => {
    const t = v.trim();
    if (!t || full) return;
    if (items.some((x) => x.toLowerCase() === t.toLowerCase()) || t.toLowerCase() === primary?.toLowerCase()) return setValue("");
    onAdd(t);
    setValue("");
  };
  const open = suggestions.filter((s) => !items.some((x) => x.toLowerCase() === s.toLowerCase()) && s.toLowerCase() !== primary?.toLowerCase());
  return (
    <div>
      <div className="flex min-h-12 flex-wrap gap-2 rounded-xl border border-[#e4dcef] p-2.5">
        {items.length === 0 && <span className="px-1 py-1 text-sm text-ink/40">Nothing added yet.</span>}
        {items.map((c, i) => (
          <span key={c} className="inline-flex items-center gap-1 rounded-full bg-[#f3e8fb] py-1 pr-1 pl-3 text-sm font-medium text-brand-800">
            {c}
            <button type="button" onClick={() => onRemove(i)} className="grid size-5 place-items-center rounded-full hover:bg-white" aria-label={`Remove ${c}`}>
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add(value);
        }}
      >
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={full ? "Limit reached" : placeholder} disabled={full} className={input} maxLength={120} aria-label={placeholder} />
        <button type="submit" disabled={!value.trim() || full} className={btn.outline}>
          <Plus className="size-4" /> Add
        </button>
      </form>
      {open.length > 0 && !full && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1 text-xs text-ink/50">
            <Sparkles className="size-3.5 text-brand-700" /> Suggested:
          </span>
          {open.slice(0, 6).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-dashed border-brand-300 px-2.5 py-0.5 text-xs font-medium text-brand-700 hover:bg-[#f8f4fc]">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoriesEditor({ primary, categories, suggestions }: { primary: string; categories: string[]; suggestions: string[] }) {
  const initialExtra = categories.filter((c) => c.toLowerCase() !== primary.toLowerCase());
  const [main, setMain] = useState(primary);
  const [extra, setExtra] = useState(initialExtra);
  const { run, pending } = useAction();
  const dirty = main !== primary || JSON.stringify(extra) !== JSON.stringify(initialExtra);
  const promote = (i: number) => {
    const next = extra[i];
    setExtra((all) => [main, ...all.filter((_, j) => j !== i)].filter(Boolean));
    setMain(next);
  };
  return (
    <div className="space-y-5">
      <Notice>Your primary category is the strongest signal Google uses to decide which searches you show up for. Add secondary categories for other things you do.</Notice>
      <div>
        <Caps>Primary category</Caps>
        <input value={main} onChange={(e) => setMain(e.target.value)} className={clsx(input, "mt-1.5")} aria-label="Primary category" maxLength={120} />
      </div>
      <div>
        <div className="flex items-end justify-between">
          <Caps>Additional categories</Caps>
          <span className="text-xs text-ink/45">{extra.length} / 9</span>
        </div>
        <div className="mt-1.5">
          <ChipInput items={extra} primary={main} onRemove={(i) => setExtra((all) => all.filter((_, j) => j !== i))} onAdd={(v) => setExtra((all) => [...all, v])} placeholder="Add a category, e.g. Drainage service" suggestions={suggestions} max={9} />
        </div>
        {extra.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-ink/50">
            <Star className="size-3.5" /> Make primary:
            {extra.map((c, i) => (
              <button key={c} type="button" onClick={() => promote(i)} className="rounded-full bg-[#efeaf5] px-2 py-0.5 font-medium text-ink/65 hover:text-ink">
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      <SaveBar dirty={dirty} pending={pending} disabled={!main.trim()} onSave={() => run(() => saveCategoriesAction(main, extra))} onReset={() => {
          setMain(primary);
          setExtra(initialExtra);
        }} />
    </div>
  );
}

export function ServicesEditor({ services, suggestions }: { services: string[]; suggestions: string[] }) {
  const [items, setItems] = useState(services);
  const { run, pending } = useAction();
  const dirty = JSON.stringify(items) !== JSON.stringify(services);
  return (
    <div className="space-y-5">
      <Notice>List every service customers can book. Google uses these to match you to specific searches, like “water heater repair”.</Notice>
      <div>
        <div className="flex items-end justify-between">
          <Caps>Services you offer</Caps>
          <span className="text-xs text-ink/45">{items.length} listed</span>
        </div>
        <div className="mt-1.5">
          <ChipInput items={items} onRemove={(i) => setItems((all) => all.filter((_, j) => j !== i))} onAdd={(v) => setItems((all) => [...all, v])} placeholder="Add a service, e.g. Leak detection" suggestions={suggestions} max={50} />
        </div>
      </div>
      <SaveBar dirty={dirty} pending={pending} onSave={() => run(() => saveServicesAction(items))} onReset={() => setItems(services)} />
    </div>
  );
}
