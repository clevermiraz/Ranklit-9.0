"use client";

import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Check, Copy, Download, ExternalLink, Globe, ImagePlus, Loader2, Pencil, Printer, Star, X } from "lucide-react";
import type { ReviewLink } from "@/lib/app/types";
import { Card, CardHeader, Label, btn, input, textarea } from "@/components/app/ui";
import { Switch } from "@/components/app/controls";
import { useAction } from "@/components/app/toast";
import { matchBrandAction, saveBrandingAction, setSendAllToGoogleAction, updateSlugAction } from "@/app/actions/reviews";
import { encodeQr, qrPath, qrSvg } from "./qr";
import { HEX_RE, REVIEW_FONTS, fontStack, slugError, toSlug } from "./shared";
import { ReviewPageCard } from "./review-page-card";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = value;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

// ---- review link ---------------------------------------------------------------------------------

export function ReviewLinkCard({ origin, slug }: { origin: string; slug: string }) {
  const url = `${origin}/review/${slug}`;
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(slug);
  const { run, pending } = useAction();
  const err = draft === slug ? null : slugError(draft);

  return (
    <Card className="flex flex-col">
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <Star className="size-5 fill-amber-400 text-amber-400" /> Your review link
          </span>
        }
        description="Text it, email it, add it to receipts and signatures."
      />
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#e4dcef] bg-[#fbfaff] py-1 pr-1 pl-3">
        <input readOnly value={url} aria-label="Your review link" className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ink/80 outline-none" onFocus={(e) => e.currentTarget.select()} />
        <button
          type="button"
          onClick={async () => {
            await copyText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="grid size-8 shrink-0 place-items-center rounded-md text-ink/60 hover:bg-white hover:text-ink"
          aria-label="Copy review link"
          title="Copy"
        >
          {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
        </button>
      </div>
      <a href={`/review/${slug}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
        Preview your review page <ExternalLink className="size-3.5" />
      </a>

      <div className="mt-auto pt-4">
        {editing ? (
          <form
            className="rounded-xl border border-[#ece6f4] bg-[#fbfaff] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (err) return;
              run(() => updateSlugAction(draft), (r) => !r.error && setEditing(false));
            }}
          >
            <label htmlFor="slug" className="text-xs font-semibold">
              Custom link
            </label>
            <div className="mt-1 flex items-center rounded-lg border border-[#e4dcef] bg-white focus-within:border-brand-600">
              <span className="truncate pl-3 font-mono text-xs text-ink/45">{origin.replace(/^https?:\/\//, "")}/review/</span>
              <input
                id="slug"
                autoFocus
                value={draft}
                maxLength={60}
                onChange={(e) => setDraft(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                className="h-9 min-w-0 flex-1 bg-transparent pr-3 font-mono text-xs outline-none"
                aria-invalid={!!err}
              />
            </div>
            <p className={clsx("mt-1 text-xs", err ? "text-red-600" : "text-ink/45")}>{err ?? "Changing it breaks the old link and any printed QR codes."}</p>
            <div className="mt-2 flex gap-2">
              <button type="submit" className={clsx(btn.primary, btn.sm)} disabled={pending || !!err || draft === slug}>
                {pending && <Loader2 className="size-3.5 animate-spin" />} Save link
              </button>
              <button
                type="button"
                className={clsx(btn.ghost, "!text-xs")}
                onClick={() => {
                  setDraft(slug);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
              <button type="button" className={clsx(btn.ghost, "ml-auto !text-xs")} onClick={() => setDraft(toSlug(draft))}>
                Tidy up
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ece6f4] pt-3">
            <code className="truncate font-mono text-xs text-ink/50">/review/{slug}</code>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink/60 hover:text-ink"
              onClick={() => {
                setDraft(slug);
                setEditing(true);
              }}
            >
              <Pencil className="size-3" /> Customize URL
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

// ---- QR code -------------------------------------------------------------------------------------

export function QrCard({ url, slug, name, accent }: { url: string; slug: string; name: string; accent: string }) {
  const qr = useMemo(() => encodeQr(url), [url]);
  const dim = qr.size + 8;
  const { push } = useAction();

  const downloadPng = () => {
    const scale = 16;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = dim * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    qr.modules.forEach((row, y) => row.forEach((dark, x) => dark && ctx.fillRect((x + 4) * scale, (y + 4) * scale, scale, scale)));
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `review-qr-${slug}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      push({ kind: "ok", text: "QR code downloaded." });
    }, "image/png");
  };

  const printCard = () => {
    const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Review card — ${esc(name)}</title>
<style>
@page{size:4in 6in;margin:0}
*{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#1f1a2b;display:grid;place-items:center;min-height:100vh;background:#fff}
.card{width:4in;height:6in;border:1px solid #e5e0ee;border-radius:18px;padding:.4in .35in;display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden;position:relative}
.bar{position:absolute;top:0;left:0;right:0;height:10px;background:${accent}}
h1{font-size:22px;margin:.15in 0 4px}p{margin:0;color:#5c5470;font-size:14px}
.stars{color:#f5b301;font-size:26px;letter-spacing:4px;margin:.12in 0}
.qr{width:2.4in;height:2.4in;margin:.1in 0}
.url{font-family:ui-monospace,monospace;font-size:10px;color:#6b6380;word-break:break-all;margin-top:auto}
.cta{font-weight:700;font-size:16px;color:#1f1a2b;margin-top:4px}
@media print{body{min-height:0}.card{border:none}}
</style></head><body><div class="card"><div class="bar"></div>
<h1>${esc(name)}</h1><p>Loved your visit? We'd be grateful for a review.</p>
<div class="stars">★★★★★</div>
<div class="qr">${qrSvg(url)}</div>
<p class="cta">Scan to leave us a review</p><p>Takes less than a minute.</p>
<div class="url">${esc(url)}</div></div>
<script>window.onload=function(){setTimeout(function(){window.print()},150)}</script></body></html>`;
    const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const w = window.open(blobUrl, "_blank");
    if (!w) push({ kind: "error", text: "Allow pop-ups to print your counter card." });
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader title="Your QR code" description="Scans straight to your review page." />
      <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
        <div className="rounded-xl border border-[#ece6f4] bg-white p-2">
          <svg viewBox={`0 0 ${dim} ${dim}`} className="size-40" shapeRendering="crispEdges" role="img" aria-label={`QR code for ${url}`}>
            <rect width={dim} height={dim} fill="#fff" />
            <path d={qrPath(qr)} fill="#231938" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" className={btn.outline} onClick={downloadPng}>
            <Download className="size-4" /> Download PNG
          </button>
          <button type="button" className={btn.outline} onClick={printCard}>
            <Printer className="size-4" /> Print counter card
          </button>
          <p className="max-w-[220px] text-xs text-ink/45">Put it by the register, on invoices, or on the back of business cards.</p>
        </div>
      </div>
    </Card>
  );
}

// ---- where ratings go ----------------------------------------------------------------------------

export function RatingsRoutingCard({ sendAll }: { sendAll: boolean }) {
  const [value, setValue] = useState(sendAll);
  const [base, setBase] = useState(sendAll);
  if (base !== sendAll) {
    setBase(sendAll);
    setValue(sendAll);
  }
  const { run, pending } = useAction();
  return (
    <Card>
      <CardHeader title="Where ratings go" description="Choose whether every customer gets your Google review page, or only higher ratings do." />
      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-[#ece6f4] bg-[#fbfaff] p-4">
        <Switch checked={value} onChange={setValue} label="Send all ratings to Google" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Send all ratings to Google</p>
          <p className="text-sm text-ink/55">
            {value ? "Every customer is offered your Google review page, whatever they rate." : "Ratings of 4 stars and above go to Google. Lower ratings go to private feedback."}
          </p>
        </div>
        <button type="button" className={btn.primary} disabled={pending || value === sendAll} onClick={() => run(() => setSendAllToGoogleAction(value))}>
          {pending && <Loader2 className="size-4 animate-spin" />} Save
        </button>
      </div>
    </Card>
  );
}

// ---- branding ---------------------------------------------------------------------------------------

type Branding = Pick<ReviewLink, "accent" | "font" | "headline" | "subtext" | "prompt" | "website"> & { logo: string | null };

function readLogo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp|gif|svg\+xml)$/.test(file.type)) return reject(new Error("Upload a PNG, JPG, WebP, GIF or SVG image."));
    if (file.size > 5 * 1024 * 1024) return reject(new Error("That image is over 5 MB — pick a smaller one."));
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      const max = 320;
      const ratio = Math.min(1, max / Math.max(img.naturalWidth || max, img.naturalHeight || max));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round((img.naturalWidth || max) * ratio));
      canvas.height = Math.max(1, Math.round((img.naturalHeight || max) * ratio));
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(src);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("We couldn't read that image."));
    };
    img.src = src;
  });
}

export function BrandingCard({ initial, name }: { initial: Branding; name: string }) {
  const [b, setB] = useState<Branding>(initial);
  const [saved, setSaved] = useState(initial);
  const [hexText, setHexText] = useState(initial.accent);
  const fileRef = useRef<HTMLInputElement>(null);
  const save = useAction();
  const match = useAction();
  const dirty = JSON.stringify(b) !== JSON.stringify(saved);
  const set = <K extends keyof Branding>(k: K, v: Branding[K]) => setB((x) => ({ ...x, [k]: v }));

  const promptHint = b.prompt.trim() || `Tell ${name} what went wrong. This goes privately to the owner.`;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">Customize your review page</h2>
          <p className="mt-0.5 text-sm text-ink/60">Match the page to your brand. Changes go live as soon as you save.</p>
        </div>
        <form
          className="flex w-full items-center gap-2 sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            match.run(
              () => matchBrandAction(b.website),
              (r) => {
                if ("accent" in r && r.accent) {
                  setB((x) => ({ ...x, accent: r.accent, font: r.font, website: r.website }));
                  setHexText(r.accent);
                }
              },
            );
          }}
        >
          <input className={clsx(input, "h-9 sm:w-56")} placeholder="https://yourbusiness.com" value={b.website} onChange={(e) => set("website", e.target.value)} aria-label="Your website" />
          <button type="submit" className={clsx(btn.outline, "!py-1.5")} disabled={match.pending || !b.website.trim()} title="Pull your brand colour and font from your website">
            {match.pending ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />} Match
          </button>
        </form>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.run(() => saveBrandingAction(b), (r) => !r.error && setSaved(b));
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="accent">Accent color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={b.accent}
                  onChange={(e) => {
                    set("accent", e.target.value);
                    setHexText(e.target.value);
                  }}
                  className="size-10 shrink-0 cursor-pointer rounded-lg border border-[#e4dcef] bg-white p-1"
                  aria-label="Pick accent colour"
                />
                <input
                  id="accent"
                  className={clsx(input, "font-mono uppercase", !HEX_RE.test(hexText) && "!border-red-400")}
                  value={hexText}
                  maxLength={7}
                  onChange={(e) => {
                    const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
                    setHexText(v);
                    if (HEX_RE.test(v)) set("accent", v.toLowerCase());
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="font">Font</Label>
              <select id="font" className={input} value={b.font} onChange={(e) => set("font", e.target.value)} style={{ fontFamily: fontStack(b.font) }}>
                {REVIEW_FONTS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: fontStack(f) }}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Logo</Label>
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-[#e4dcef] bg-[#fbfaff]">
                {b.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local data URL
                  <img src={b.logo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                ) : (
                  <ImagePlus className="size-5 text-ink/30" />
                )}
              </span>
              <button type="button" className={clsx(btn.outline, btn.sm)} onClick={() => fileRef.current?.click()}>
                {b.logo ? "Replace logo" : "Upload logo"}
              </button>
              {b.logo && (
                <button type="button" className={clsx(btn.danger, "!text-xs")} onClick={() => set("logo", null)}>
                  <X className="size-3.5" /> Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  try {
                    set("logo", await readLogo(f));
                  } catch (err) {
                    save.push({ kind: "error", text: (err as Error).message });
                  }
                }}
              />
            </div>
            <p className="mt-1 text-xs text-ink/45">Square or wide, PNG or SVG works best. We resize it for you.</p>
          </div>

          <div>
            <Label htmlFor="headline">Headline</Label>
            <input id="headline" className={input} maxLength={120} value={b.headline} onChange={(e) => set("headline", e.target.value)} placeholder={`How was your experience with ${name}?`} />
          </div>
          <div>
            <Label htmlFor="subtext">Subtext</Label>
            <input id="subtext" className={input} maxLength={200} value={b.subtext} onChange={(e) => set("subtext", e.target.value)} placeholder="Tap a star to let us know." />
          </div>
          <div>
            <Label htmlFor="prompt" hint="shown to customers who rate below 4★">
              Feedback prompt
            </Label>
            <textarea id="prompt" className={clsx(textarea, "min-h-20")} maxLength={400} value={b.prompt} onChange={(e) => set("prompt", e.target.value)} />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className={btn.primary} disabled={save.pending || !dirty || !HEX_RE.test(hexText)}>
              {save.pending && <Loader2 className="size-4 animate-spin" />} Save branding
            </button>
            {dirty && (
              <button
                type="button"
                className={clsx(btn.ghost, "!text-xs")}
                onClick={() => {
                  setB(saved);
                  setHexText(saved.accent);
                }}
              >
                Reset changes
              </button>
            )}
            {!dirty && <span className="text-xs text-ink/45">All changes saved</span>}
          </div>
        </form>

        <div>
          <p className="mb-2 text-sm font-semibold">Preview</p>
          <div className="grid place-items-center rounded-2xl bg-[#f3eefa] px-4 py-10">
            <ReviewPageCard look={{ name, logo: b.logo, accent: b.accent, font: b.font, headline: b.headline, subtext: b.subtext }} rating={0} compact>
              <p className="mt-5 rounded-xl border border-dashed border-black/10 px-3 py-2 text-xs text-black/50">{promptHint}</p>
            </ReviewPageCard>
          </div>
          <p className="mt-2 text-center text-xs text-ink/45">This is how your page looks to customers</p>
        </div>
      </div>
    </Card>
  );
}
