"use client";

/* eslint-disable @next/next/no-img-element -- previews of data URLs / pasted URLs */

import { useRef, useState } from "react";
import clsx from "clsx";
import { CalendarClock, CircleCheck, CircleX, ImagePlus, Images, LoaderCircle, ShieldCheck, Smile, Sparkles, Upload, WandSparkles, X } from "lucide-react";
import type { Post } from "@/lib/app/types";
import { savePostAction } from "@/app/actions/gbp";
import { useAction, useToast } from "@/components/app/toast";
import { Switch } from "@/components/app/controls";
import { btn, input, Label, textarea } from "@/components/app/ui";
import { Modal } from "./modal";
import { useUpload } from "./photos";
import { aiImage, BODY_MAX, checkPolicy, CTAS, generatePost, HEADLINE_MAX, humanize, TONES, type AiContext, type GbpPhoto, type PolicyResult, type PostType, type Tone } from "./logic";

const TYPES: PostType[] = ["Standard", "Event", "Offer", "Alert"];

/** yyyy-MM-ddTHH:mm in local time, for datetime-local inputs. */
function localInput(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function tomorrowAtNine() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return localInput(d);
}

export function PostComposer({
  open,
  onClose,
  post,
  initialImage,
  initialDate,
  photos,
  ctx,
  connected,
}: {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  initialImage?: string | null;
  initialDate?: string | null;
  photos: GbpPhoto[];
  ctx: AiContext;
  connected: boolean;
}) {
  const [type, setType] = useState<PostType>(post?.type ?? "Standard");
  const [topic, setTopic] = useState("");
  const [headline, setHeadline] = useState(post?.headline ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [tone, setTone] = useState<Tone>("friendly");
  const [cta, setCta] = useState(post?.cta ?? "");
  const [image, setImage] = useState<string | null>(post?.image ?? initialImage ?? null);
  const [imageTab, setImageTab] = useState<"library" | "ai" | null>(null);
  const [url, setUrl] = useState("");
  const [publishNow, setPublishNow] = useState(post ? post.status !== "scheduled" && !initialDate : !initialDate);
  const [when, setWhen] = useState(() => (post?.status === "scheduled" ? localInput(new Date(post.date)) : initialDate ? `${initialDate}T09:00` : ""));
  const [policy, setPolicy] = useState<PolicyResult[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [variant, setVariant] = useState(0);
  const { run, pending } = useAction();
  const { push } = useToast();
  const { upload, uploading } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  const hasContent = body.trim().length > 0;
  const isEdit = !!post;
  const published = post?.status === "published";

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const g = generatePost(ctx, type, topic, tone, variant);
      setHeadline(g.headline);
      setBody(g.body);
      if (!cta) setCta(g.cta);
      setVariant((v) => v + 1);
      setPolicy(null);
      setGenerating(false);
    }, 650);
  };

  const submit = (mode: "publish" | "schedule" | "draft") => {
    let scheduledAt: string | null = null;
    if (mode === "schedule") {
      if (!when) return push({ kind: "error", text: "Pick a date and time to schedule the post." });
      scheduledAt = new Date(when).toISOString();
    }
    run(() => savePostAction({ id: post?.id, type, headline, body, cta: cta || null, image, mode, scheduledAt }), (r) => !r?.error && onClose());
  };

  const applyUrl = () => {
    try {
      const u = new URL(url.trim());
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
      setImage(u.toString());
      setUrl("");
    } catch {
      push({ kind: "error", text: "Paste a full image URL starting with https://" });
    }
  };

  const primaryLabel = publishNow ? (published ? "Update post" : "Publish Now") : "Schedule Post";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Post" : "Create Post"}
      description="Compose a new Google Business Profile post with AI assistance, humanizer, and policy checking."
      footer={
        <>
          {!hasContent && <span className="mr-auto text-xs text-ink/50">Write some post content to continue.</span>}
          {hasContent && !connected && <span className="mr-auto text-xs text-amber-700">Connect Google to publish. Drafts still save.</span>}
          <button type="button" onClick={() => submit("draft")} disabled={pending || (!hasContent && !headline.trim())} className={btn.outline}>
            Save Draft
          </button>
          <button type="button" onClick={() => submit(publishNow ? "publish" : "schedule")} disabled={pending || !hasContent || !connected} className={btn.fuchsia}>
            {pending && <LoaderCircle className="size-4 animate-spin" />} {primaryLabel}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Post Type</Label>
          <div className="grid grid-cols-4 rounded-xl bg-[#efeaf5] p-1" role="tablist" aria-label="Post type">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={type === t}
                onClick={() => setType(t)}
                className={clsx("rounded-lg py-1.5 text-sm font-semibold", type === t ? "bg-white text-fuchsia-700 shadow-sm" : "text-ink/55 hover:text-ink")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="pc-topic" hint="Details for AI">
            Topic
          </Label>
          <div className="flex gap-2">
            <input
              id="pc-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  generate();
                }
              }}
              placeholder="e.g., Spring sale on all services, New team member"
              className={input}
              maxLength={200}
            />
            <button type="button" onClick={generate} disabled={generating} className={clsx(btn.fuchsia, "shrink-0 !rounded-lg")}>
              {generating ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <Label htmlFor="pc-headline">Headline</Label>
            <span className="mb-1.5 text-xs text-ink/45">
              {headline.length}/{HEADLINE_MAX}
            </span>
          </div>
          <input id="pc-headline" value={headline} onChange={(e) => setHeadline(e.target.value.slice(0, HEADLINE_MAX))} placeholder="e.g., Same-day drain clearing, seven days a week" className={input} />
          <p className="mt-1 text-xs text-ink/50">Optional. Shows as the first line of your post. Generate writes one for you, and you can rewrite it.</p>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <Label htmlFor="pc-body">Post Content</Label>
            <span className={clsx("mb-1.5 text-xs", body.length > BODY_MAX ? "font-semibold text-red-600" : "text-ink/45")}>
              {body.length}/{BODY_MAX}
            </span>
          </div>
          <textarea
            id="pc-body"
            value={body}
            onChange={(e) => {
              setBody(e.target.value.slice(0, BODY_MAX));
              setPolicy(null);
            }}
            rows={6}
            placeholder="What do you want customers to know?"
            className={clsx(textarea, "leading-relaxed")}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-[#f6effb] p-2">
            <select value={tone} onChange={(e) => setTone(e.target.value as Tone)} className={clsx(input, "!h-8 !w-auto !py-0 capitalize")} aria-label="Tone">
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!hasContent}
              onClick={() => {
                const next = humanize(body);
                setBody(next);
                setHeadline((h) => humanize(h).slice(0, HEADLINE_MAX));
                push({ kind: next === body ? "info" : "ok", text: next === body ? "Already reads naturally — nothing to change." : "Rewrote stiff phrases in plain language." });
              }}
              className={clsx(btn.outline, btn.sm)}
            >
              <Smile className="size-3.5" /> Humanize
            </button>
            <button type="button" disabled={!hasContent} onClick={() => setPolicy(checkPolicy(headline, body))} className={clsx(btn.outline, btn.sm)}>
              <ShieldCheck className="size-3.5" /> Check Policy
            </button>
          </div>
          {policy && (
            <div className={clsx("mt-2 rounded-xl border p-3", policy.every((r) => r.ok) ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60")} role="status">
              <p className="text-sm font-semibold">{policy.every((r) => r.ok) ? "Looks good — this post meets Google's guidelines." : `${policy.filter((r) => !r.ok).length} thing${policy.filter((r) => !r.ok).length === 1 ? "" : "s"} to fix`}</p>
              <ul className="mt-1.5 space-y-1">
                {policy.map((r) => (
                  <li key={r.label} className="flex items-start gap-1.5 text-xs">
                    {r.ok ? <CircleCheck className="mt-px size-3.5 shrink-0 text-emerald-600" /> : <CircleX className="mt-px size-3.5 shrink-0 text-red-500" />}
                    <span>
                      <strong>{r.label}.</strong> {r.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="pc-cta">Call to Action</Label>
          <select id="pc-cta" value={cta} onChange={(e) => setCta(e.target.value)} className={input}>
            <option value="">Select CTA type</option>
            {CTAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Post Image</Label>
          <div className="rounded-xl border border-[#e4dcef] p-3">
            {image && (
              <div className="relative mb-3 overflow-hidden rounded-lg border border-[#ece6f4]">
                <img src={image} alt="Selected post image" className="aspect-[16/9] w-full object-cover" />
                <button type="button" onClick={() => setImage(null)} className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white" aria-label="Remove image">
                  <X className="size-4" />
                </button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setImageTab((t) => (t === "library" ? null : "library"))} className={clsx("flex flex-col items-center gap-1 rounded-lg border py-2.5 text-xs font-semibold", imageTab === "library" ? "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700" : "border-[#ece6f4] hover:bg-[#f8f6fb]")}>
                <Images className="size-4" /> My Photos
              </button>
              <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-1 rounded-lg border border-[#ece6f4] py-2.5 text-xs font-semibold hover:bg-[#f8f6fb] disabled:opacity-60">
                {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />} {uploading ? "Uploading…" : "Upload Photo"}
              </button>
              <button type="button" onClick={() => setImageTab((t) => (t === "ai" ? null : "ai"))} className={clsx("flex flex-col items-center gap-1 rounded-lg border py-2.5 text-xs font-semibold", imageTab === "ai" ? "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700" : "border-[#ece6f4] hover:bg-[#f8f6fb]")}>
                <WandSparkles className="size-4" /> AI Generate
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                upload(e.target.files, (added) => added[0] && setImage(added[0].src));
                e.target.value = "";
              }}
            />
            {imageTab === "library" && (
              <div className="mt-3 grid max-h-48 grid-cols-4 gap-2 overflow-y-auto">
                {photos.length === 0 && <p className="col-span-4 py-4 text-center text-xs text-ink/50">No photos yet — upload one.</p>}
                {photos.map((p) => (
                  <button key={p.id} type="button" onClick={() => setImage(p.src)} className={clsx("overflow-hidden rounded-lg border-2", image === p.src ? "border-fuchsia-500" : "border-transparent hover:border-fuchsia-200")} title={p.name}>
                    <img src={p.src} alt={p.name} className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {imageTab === "ai" && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((v) => {
                  const src = aiImage(headline || topic || ctx.name, v);
                  return (
                    <button key={v} type="button" onClick={() => setImage(src)} className={clsx("overflow-hidden rounded-lg border-2", image === src ? "border-fuchsia-500" : "border-transparent hover:border-fuchsia-200")}>
                      <img src={src} alt={`AI image option ${v + 1}`} className="aspect-square w-full object-cover" />
                    </button>
                  );
                })}
                <p className="col-span-4 text-xs text-ink/50">Generated from your headline or topic. Pick one to use it.</p>
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyUrl();
                }
              }} placeholder="Or paste image URL" className={clsx(input, "!h-9")} aria-label="Image URL" />
              <button type="button" onClick={applyUrl} disabled={!url.trim()} className={clsx(btn.outline, btn.sm, "shrink-0")}>
                <ImagePlus className="size-3.5" /> Use
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#e4dcef] p-3">
          <div className="flex items-center gap-3">
            <CalendarClock className="size-4 text-fuchsia-600" />
            <span className="flex-1 text-sm font-semibold">Publish Now</span>
            <Switch
              checked={publishNow}
              onChange={(v) => {
                setPublishNow(v);
                if (!v && !when) setWhen(tomorrowAtNine());
              }}
              label="Publish now"
            />
          </div>
          {!publishNow && (
            <div className="mt-3">
              <Label htmlFor="pc-when">Schedule for</Label>
              <input id="pc-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className={input} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
