"use client";

import { useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { Check, Copy } from "lucide-react";
import { Badge, Card, CardHeader, btn, input } from "@/components/app/ui";
import { ChipGroup, Switch } from "@/components/app/controls";
import { renderWidget, widgetPageSize, type WidgetData, type WidgetOptions } from "./widget-render";
import { HEX_RE } from "./shared";

const PRESETS = [
  { name: "Blue", hex: "#1a73e8" },
  { name: "Purple", hex: "#8d3ebb" },
  { name: "Green", hex: "#188038" },
  { name: "Orange", hex: "#e8710a" },
  { name: "Red", hex: "#d93025" },
  { name: "Navy", hex: "#1e3a5f" },
];

const DEFAULTS: Omit<WidgetOptions, "branding"> = {
  limit: 12,
  minRating: 4,
  layout: "grid",
  columns: 3,
  theme: "light",
  accent: "#1a73e8",
  corners: "rounded",
  cardStyle: "shadow",
  showPhotos: true,
  showVerified: true,
  showGoogleBadge: true,
  showDate: true,
  showHeader: true,
  showName: true,
  showCount: true,
  showButton: true,
  loadMore: true,
};

const kebab = (k: string) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function embedCode(origin: string, businessId: string, o: WidgetOptions) {
  const attrs: [string, string | number | boolean][] = [
    ["location", businessId],
    ["target", "#ranklit-reviews"],
    ["limit", o.limit],
    ["minRating", o.minRating],
    ["layout", o.layout],
    ["columns", o.columns],
    ["theme", o.theme],
    ["accent", o.accent],
    ["corners", o.corners],
    ["cardStyle", o.cardStyle],
    ["showPhotos", o.showPhotos],
    ["showVerified", o.showVerified],
    ["showGoogleBadge", o.showGoogleBadge],
    ["showDate", o.showDate],
    ["showHeader", o.showHeader],
    ["showName", o.showName],
    ["showCount", o.showCount],
    ["showButton", o.showButton],
    ["loadMore", o.loadMore],
  ];
  if (!o.branding) attrs.push(["branding", false]);
  return [
    "<!-- Ranklit review widget -->",
    '<div id="ranklit-reviews"></div>',
    "<script",
    `  src="${origin}/api/embed/widget.js"`,
    ...attrs.map(([k, v]) => `  data-${kebab(k)}="${v}"`),
    "  async></script>",
  ].join("\n");
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold tracking-[0.12em] text-ink/45 uppercase">{label}</p>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange, disabled, indent }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; indent?: boolean }) {
  return (
    <label className={clsx("flex items-center justify-between gap-3 py-1.5 text-sm", indent && "border-l-2 border-[#ece6f4] pl-3", disabled && "opacity-50")}>
      <span>{label}</span>
      <Switch checked={checked} onChange={onChange} disabled={disabled} label={label} />
    </label>
  );
}

export function WidgetBuilder({ data, now, origin, businessId, branding }: { data: WidgetData; now: number; origin: string; businessId: string; branding: boolean }) {
  const [o, setO] = useState<WidgetOptions>({ ...DEFAULTS, branding });
  const [hexText, setHexText] = useState(DEFAULTS.accent);
  const [more, setMore] = useState({ key: "", pages: 0 });
  const [copied, setCopied] = useState(false);
  const set = <K extends keyof WidgetOptions>(k: K, v: WidgetOptions[K]) => setO((x) => ({ ...x, [k]: v }));

  const optsKey = JSON.stringify(o);
  const pages = more.key === optsKey ? more.pages : 0;
  const step = widgetPageSize(o);
  const shown = o.loadMore ? step * (pages + 1) : o.limit;
  const html = useMemo(() => renderWidget(data, o, shown, now), [data, o, shown, now]);
  const code = embedCode(origin, businessId, o);
  const matching = data.reviews.filter((r) => r.rating >= o.minRating).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <div className="grid items-start gap-5 lg:grid-cols-[360px_1fr]">
        <Card className="space-y-5">
          <CardHeader title="Customize" description="Changes preview live on the right." />

          <Group label="Reviews to show">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={50}
                value={o.limit}
                onChange={(e) => set("limit", Number(e.target.value))}
                className="flex-1 accent-brand-700"
                aria-label="Reviews to show"
              />
              <span className="w-8 text-right text-sm font-bold tabular-nums">{o.limit}</span>
            </div>
            <p className="mt-1 text-xs text-ink/45">
              {matching} of your reviews match the minimum rating{matching < o.limit ? " — all of them will show" : ""}.
            </p>
          </Group>

          <Group label="Minimum rating">
            <ChipGroup
              label="Minimum rating"
              value={o.minRating}
              onChange={(v) => set("minRating", v)}
              options={[
                { value: 5, label: "5★ only" },
                { value: 4, label: "4★ & up" },
                { value: 3, label: "3★ & up" },
              ]}
            />
          </Group>

          <div className="grid grid-cols-2 gap-4">
            <Group label="Layout">
              <ChipGroup label="Layout" value={o.layout} onChange={(v) => set("layout", v)} options={[{ value: "grid", label: "Grid" }, { value: "list", label: "List" }]} />
            </Group>
            <Group label="Theme">
              <ChipGroup label="Theme" value={o.theme} onChange={(v) => set("theme", v)} options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
            </Group>
          </div>

          <Group label="Columns">
            <div className={clsx("flex gap-1.5", o.layout === "list" && "pointer-events-none opacity-40")} role="group" aria-label="Columns">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={o.columns === n}
                  disabled={o.layout === "list"}
                  onClick={() => set("columns", n)}
                  className={clsx("grid size-8 place-items-center rounded-full text-xs font-semibold", o.columns === n ? "bg-brand-700 text-white" : "bg-[#efeaf5] text-ink/65 hover:text-ink")}
                >
                  {n}
                </button>
              ))}
            </div>
            {o.layout === "list" && <p className="mt-1 text-xs text-ink/45">List layout uses one column.</p>}
          </Group>

          <Group label="Accent color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={o.accent}
                onChange={(e) => {
                  set("accent", e.target.value);
                  setHexText(e.target.value);
                }}
                className="size-9 shrink-0 cursor-pointer rounded-lg border border-[#e4dcef] bg-white p-1"
                aria-label="Pick accent colour"
              />
              <input
                className={clsx(input, "!h-9 w-28 font-mono uppercase", !HEX_RE.test(hexText) && "!border-red-400")}
                value={hexText}
                maxLength={7}
                aria-label="Accent hex"
                onChange={(e) => {
                  const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
                  setHexText(v);
                  if (HEX_RE.test(v)) set("accent", v.toLowerCase());
                }}
              />
              <div className="flex gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    title={p.name}
                    aria-label={`${p.name} accent`}
                    onClick={() => {
                      set("accent", p.hex);
                      setHexText(p.hex);
                    }}
                    className={clsx("size-5 rounded-full ring-offset-2 transition", o.accent === p.hex ? "ring-2 ring-ink/40" : "hover:scale-110")}
                    style={{ background: p.hex }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-1 text-xs text-ink/45">Used for the button, initials avatars, and links.</p>
          </Group>

          <div className="grid grid-cols-2 gap-4">
            <Group label="Corners">
              <ChipGroup
                label="Corners"
                value={o.corners}
                onChange={(v) => set("corners", v)}
                options={[
                  { value: "sharp", label: "Sharp" },
                  { value: "rounded", label: "Rounded" },
                  { value: "extra", label: "Extra" },
                ]}
              />
            </Group>
            <Group label="Card style">
              <ChipGroup
                label="Card style"
                value={o.cardStyle}
                onChange={(v) => set("cardStyle", v)}
                options={[
                  { value: "shadow", label: "Shadow" },
                  { value: "outline", label: "Outline" },
                  { value: "flat", label: "Flat" },
                ]}
              />
            </Group>
          </div>

          <Group label="Review cards">
            <ToggleRow label="Show reviewer photos" checked={o.showPhotos} onChange={(v) => set("showPhotos", v)} />
            <ToggleRow label="Show verified badge" checked={o.showVerified} onChange={(v) => set("showVerified", v)} />
            <ToggleRow label="Show Google badge" checked={o.showGoogleBadge} onChange={(v) => set("showGoogleBadge", v)} />
            <ToggleRow label="Show review date" checked={o.showDate} onChange={(v) => set("showDate", v)} />
          </Group>

          <Group label="Header">
            <ToggleRow label="Show heading & rating" checked={o.showHeader} onChange={(v) => set("showHeader", v)} />
            <div className="ml-1 space-y-0.5">
              <ToggleRow indent label="Show business name" checked={o.showName} disabled={!o.showHeader} onChange={(v) => set("showName", v)} />
              <ToggleRow indent label="Show total review count" checked={o.showCount} disabled={!o.showHeader} onChange={(v) => set("showCount", v)} />
              <ToggleRow indent label={'"Review us on Google" button'} checked={o.showButton} disabled={!o.showHeader} onChange={(v) => set("showButton", v)} />
            </div>
          </Group>

          <Group label="Behavior">
            <ToggleRow label={'"Load more" button'} checked={o.loadMore} onChange={(v) => set("loadMore", v)} />
          </Group>

          <button
            type="button"
            className={clsx(btn.ghost, "!text-xs")}
            onClick={() => {
              setO({ ...DEFAULTS, branding });
              setHexText(DEFAULTS.accent);
            }}
          >
            Reset to defaults
          </button>
        </Card>

        <Card className="lg:sticky lg:top-4">
          <CardHeader title="Live preview" description="Exactly what your visitors will see." actions={<Badge tone="gray">{o.theme === "dark" ? "Dark" : "Light"}</Badge>} />
          <div className="mt-4 rounded-xl border border-[#ece6f4] bg-[repeating-linear-gradient(45deg,#faf8fc,#faf8fc_10px,#f5f2f9_10px,#f5f2f9_20px)] p-4">
            <div
              className="[&_.rlw]:shadow-sm"
              // Rendered by the same function the embed script uses.
              dangerouslySetInnerHTML={{ __html: html }}
              onClick={(e) => {
                const t = e.target as HTMLElement;
                if (t.closest("[data-rlw-more]")) setMore({ key: optsKey, pages: pages + 1 });
                if (t.closest("a")) e.preventDefault();
              }}
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Embed code"
          description="Paste this into your site's HTML where Ranklit reviews should appear."
          actions={
            <button type="button" className={clsx(btn.primary, btn.sm)} onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copied" : "Copy"}
            </button>
          }
        />
        <pre className="mt-4 overflow-x-auto rounded-xl bg-[#231938] p-4 font-mono text-[12.5px] leading-relaxed text-[#e9defa]">
          <code>{code}</code>
        </pre>
        <p className="mt-3 text-sm text-ink/55">
          The widget loads your latest Google reviews every time the page opens, so new reviews appear on your site automatically — you never need to update this
          code. Change a setting above and copy again if you want a different look.
        </p>
      </Card>
    </>
  );
}
