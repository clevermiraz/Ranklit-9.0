"use client";

/* eslint-disable @next/next/no-img-element -- post images are data URLs or pasted URLs */

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Bot,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FilePen,
  FileText,
  LoaderCircle,
  Pencil,
  Play,
  Plus,
  Send,
  Sparkles,
  Trash2,
  TriangleAlert,
  Zap,
} from "lucide-react";
import type { Post } from "@/lib/app/types";
import { deletePostAction, publishPostNowAction, refreshDescriptionAction, runAgentNowAction, runEverythingAction } from "@/app/actions/gbp";
import { useAction } from "@/components/app/toast";
import { ChipGroup, Segmented } from "@/components/app/controls";
import { Badge, btn, Card, CardHeader, EmptyState, IconTile, StatCard, formatDate, timeAgo } from "@/components/app/ui";
import { ConfirmDialog } from "./modal";
import { PostComposer } from "./composer";
import { PhotoLibrary } from "./photos";
import type { AiContext, GbpPhoto } from "./logic";

export type PostsTab = "all" | "calendar" | "photos" | "automation";
type Filter = "all" | Post["status"];

const STATUS = {
  published: { label: "Published", tone: "green", color: "#10b981" },
  scheduled: { label: "Scheduled", tone: "blue", color: "#3b82f6" },
  draft: { label: "Draft", tone: "amber", color: "#f59e0b" },
  failed: { label: "Failed", tone: "red", color: "#ef4444" },
} as const;

const TYPE = {
  Standard: { color: "#8d3ebb", cls: "bg-[#f3e8fb] text-brand-700" },
  Event: { color: "#6366f1", cls: "bg-indigo-50 text-indigo-700" },
  Offer: { color: "#14b8a6", cls: "bg-teal-50 text-teal-700" },
  Alert: { color: "#ef4444", cls: "bg-red-50 text-red-700" },
} as const;

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const when = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

type ComposerState = { open: boolean; post: Post | null; image?: string | null; date?: string | null; n: number };

export function PostsView({
  posts,
  photos,
  ctx,
  connected,
  initialTab,
  compose,
  today,
  agentActive,
  nowMs,
}: {
  posts: Post[];
  photos: GbpPhoto[];
  ctx: AiContext;
  connected: boolean;
  initialTab: PostsTab;
  compose: boolean;
  today: string;
  agentActive: boolean;
  nowMs: number;
}) {
  const [tab, setTabState] = useState<PostsTab>(initialTab);
  const [composer, setComposer] = useState<ComposerState>({ open: compose, post: null, n: 0 });

  const setUrl = (t: PostsTab, withCompose: boolean) => {
    const sp = new URLSearchParams();
    if (t !== "all") sp.set("tab", t);
    if (withCompose) sp.set("compose", "1");
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };
  const setTab = (t: PostsTab) => {
    setTabState(t);
    setUrl(t, composer.open && !composer.post);
  };
  const openComposer = (opts: { post?: Post; image?: string | null; date?: string | null } = {}) => {
    setComposer((c) => ({ open: true, post: opts.post ?? null, image: opts.image, date: opts.date, n: c.n + 1 }));
    if (!opts.post) setUrl(tab, true);
  };
  const closeComposer = () => {
    setComposer((c) => ({ ...c, open: false }));
    setUrl(tab, false);
  };

  const usage = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of posts) if (p.image) m[p.image] = (m[p.image] ?? 0) + 1;
    return m;
  }, [posts]);

  const createBtn = (
    <button type="button" onClick={() => openComposer()} className={btn.fuchsia}>
      <Plus className="size-4" /> Create Post
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] leading-tight font-extrabold tracking-tight">Posts</h1>
          <p className="mt-1 max-w-3xl text-[15px] leading-relaxed text-ink/60">Draft, schedule, automate, and manage the photos that go with your Google Business Profile posts.</p>
        </div>
      </div>

      {!connected && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <TriangleAlert className="size-4 shrink-0" />
          <span className="flex-1">Your Google Business Profile isn&apos;t connected, so posts can be drafted but not published.</span>
          <Link href="/dashboard/gbp" className="font-semibold underline">
            Connect Google
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Posts view"
          value={tab}
          onChange={setTab}
          options={[
            { value: "all", label: "All posts" },
            { value: "calendar", label: "Calendar" },
            { value: "photos", label: "Photo library" },
            { value: "automation", label: "Automation" },
          ]}
        />
        {tab === "all" && createBtn}
      </div>

      {tab === "all" && <AllPosts posts={posts} onCreate={() => openComposer()} onEdit={(p) => openComposer({ post: p })} />}
      {tab === "calendar" && <CalendarView posts={posts} today={today} onCreate={(date) => openComposer({ date })} onEdit={(p) => openComposer({ post: p })} />}
      {tab === "photos" && <PhotoLibrary photos={photos} usage={usage} onUse={(src) => openComposer({ image: src })} />}
      {tab === "automation" && <Automation posts={posts} agentActive={agentActive} connected={connected} nowMs={nowMs} />}

      {composer.open && (
        <PostComposer
          key={composer.n}
          open
          onClose={closeComposer}
          post={composer.post}
          initialImage={composer.image}
          initialDate={composer.date}
          photos={photos}
          ctx={ctx}
          connected={connected}
        />
      )}
    </div>
  );
}

// ---- all posts ------------------------------------------------------------------------------

function AllPosts({ posts, onCreate, onEdit }: { posts: Post[]; onCreate: () => void; onEdit: (p: Post) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const count = (s: Post["status"]) => posts.filter((p) => p.status === s).length;
  const shown = [...posts].filter((p) => filter === "all" || p.status === filter).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Posts" value={posts.length} icon={FileText} tone="fuchsia" />
        <StatCard label="Published" value={count("published")} icon={CheckCircle} tone="green" />
        <StatCard label="Scheduled" value={count("scheduled")} icon={Clock} tone="blue" />
        <StatCard label="Drafts" value={count("draft")} icon={FilePen} tone="amber" />
      </div>
      <ChipGroup
        label="Filter posts"
        tone="fuchsia"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All" },
          { value: "draft", label: `Drafts (${count("draft")})` },
          { value: "scheduled", label: `Scheduled (${count("scheduled")})` },
          { value: "published", label: `Published (${count("published")})` },
          { value: "failed", label: `Failed (${count("failed")})` },
        ]}
      />
      {shown.length === 0 ? (
        <Card>
          {posts.length === 0 ? (
            <EmptyState icon={FileText} tone="fuchsia" title="No posts yet" text="Create your first post to engage with customers and improve local search visibility.">
              <button type="button" onClick={onCreate} className={btn.fuchsia}>
                <Plus className="size-4" /> Create Post
              </button>
            </EmptyState>
          ) : (
            <EmptyState icon={FileText} tone="fuchsia" title={`No ${STATUS[filter as Post["status"]].label.toLowerCase()} posts`} text="Try another filter, or create a new post." />
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {shown.map((p) => (
            <PostCard key={p.id} p={p} onEdit={() => onEdit(p)} />
          ))}
        </div>
      )}
    </>
  );
}

function PostCard({ p, onEdit, compact }: { p: Post; onEdit: () => void; compact?: boolean }) {
  const { run, pending } = useAction();
  const [confirm, setConfirm] = useState(false);
  const st = STATUS[p.status];
  const dateText = p.status === "published" ? `Published ${when(p.date)}` : p.status === "scheduled" ? `Scheduled for ${when(p.date)}` : p.status === "failed" ? `Failed ${when(p.date)}` : `Draft · ${when(p.date)}`;
  return (
    <Card className={clsx("flex gap-4", compact && "!p-3.5")}>
      {p.image && !compact && <img src={p.image} alt="" className="hidden size-28 shrink-0 rounded-xl object-cover sm:block" />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-semibold", TYPE[p.type].cls)}>{p.type}</span>
          <Badge tone={st.tone}>{st.label}</Badge>
          {p.byAgent && (
            <Badge tone="gray" icon={Bot}>
              Agent
            </Badge>
          )}
          {p.cta && <Badge tone="fuchsia" variant="outline">{p.cta}</Badge>}
        </div>
        {p.headline && <p className="mt-2 font-bold">{p.headline}</p>}
        <p className={clsx("mt-1 text-sm leading-relaxed text-ink/65", compact ? "line-clamp-2" : "line-clamp-3")}>{p.body || <span className="italic">No content yet.</span>}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mr-auto text-xs text-ink/50" suppressHydrationWarning>
            {dateText}
          </span>
          <button type="button" onClick={onEdit} disabled={pending} className={clsx(btn.ghost, "!text-xs")}>
            <Pencil className="size-3.5" /> Edit
          </button>
          <button type="button" onClick={() => setConfirm(true)} disabled={pending} className={clsx(btn.ghost, "!text-xs hover:!text-red-600")}>
            <Trash2 className="size-3.5" /> Delete
          </button>
          {p.status !== "published" && (
            <button type="button" onClick={() => run(() => publishPostNowAction(p.id))} disabled={pending} className={clsx(btn.fuchsia, btn.sm)}>
              {pending ? <LoaderCircle className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} Publish now
            </button>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => run(() => deletePostAction(p.id), () => setConfirm(false))}
        pending={pending}
        danger
        title="Delete this post?"
        text={p.status === "published" ? "It will be removed from your Google Business Profile too." : "This can't be undone."}
        confirmLabel="Delete post"
      />
    </Card>
  );
}

// ---- calendar -------------------------------------------------------------------------------

function CalendarView({ posts, today, onCreate, onEdit }: { posts: Post[]; today: string; onCreate: (date: string) => void; onEdit: (p: Post) => void }) {
  const [ty, tm] = today.split("-").map(Number);
  const [month, setMonth] = useState({ y: ty, m: tm - 1 });
  const [selected, setSelected] = useState<string | null>(null);
  const [colorBy, setColorBy] = useState<"status" | "type">("status");

  const byDay = useMemo(() => {
    const m = new Map<string, Post[]>();
    for (const p of posts) {
      const k = dayKey(new Date(p.date));
      m.set(k, [...(m.get(k) ?? []), p]);
    }
    return m;
  }, [posts]);

  const first = new Date(month.y, month.m, 1);
  const start = new Date(month.y, month.m, 1 - first.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const rows = cells.slice(35).every((d) => d.getMonth() !== month.m) ? cells.slice(0, 35) : cells;
  const shift = (n: number) => setMonth((m) => ({ y: new Date(m.y, m.m + n, 1).getFullYear(), m: new Date(m.y, m.m + n, 1).getMonth() }));
  const selectedPosts = selected ? (byDay.get(selected) ?? []) : [];
  const monthCount = posts.filter((p) => {
    const d = new Date(p.date);
    return d.getFullYear() === month.y && d.getMonth() === month.m;
  }).length;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
      <Card className="!p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#ece6f4] px-5 py-3">
          <button type="button" onClick={() => shift(-1)} className="grid size-8 place-items-center rounded-lg border border-[#ece6f4] hover:bg-[#f8f6fb]" aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </button>
          <h2 className="min-w-40 text-center text-[17px] font-bold">{first.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
          <button type="button" onClick={() => shift(1)} className="grid size-8 place-items-center rounded-lg border border-[#ece6f4] hover:bg-[#f8f6fb]" aria-label="Next month">
            <ChevronRight className="size-4" />
          </button>
          <span className="text-xs text-ink/50">
            {monthCount} post{monthCount === 1 ? "" : "s"}
          </span>
          <span className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMonth({ y: ty, m: tm - 1 });
                setSelected(today);
              }}
              className={clsx(btn.outline, btn.sm)}
            >
              Today
            </button>
            <button type="button" onClick={() => onCreate(selected && selected >= today ? selected : today)} className={clsx(btn.fuchsia, btn.sm)}>
              <Plus className="size-3.5" /> Create Post
            </button>
          </span>
        </div>
        <div className="grid grid-cols-7 px-3 pt-3 text-center text-[11px] font-bold tracking-wider text-ink/45 uppercase">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 p-3">
          {rows.map((d) => {
            const k = dayKey(d);
            const list = byDay.get(k) ?? [];
            const inMonth = d.getMonth() === month.m;
            const isToday = k === today;
            const isSel = k === selected;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelected(k)}
                aria-pressed={isSel}
                aria-label={`${d.toDateString()}${list.length ? `, ${list.length} post${list.length === 1 ? "" : "s"}` : ""}`}
                className={clsx(
                  "flex min-h-[74px] flex-col items-center gap-1.5 rounded-xl border p-1.5 transition-colors",
                  isSel ? "border-fuchsia-400 bg-fuchsia-50/60" : "border-transparent hover:bg-[#f8f6fb]",
                  !inMonth && "opacity-40",
                )}
              >
                <span className={clsx("grid size-7 place-items-center rounded-full text-sm", isToday ? "bg-fuchsia-600 font-bold text-white" : "font-medium")}>{d.getDate()}</span>
                <span className="flex flex-wrap justify-center gap-1">
                  {list.slice(0, 6).map((p) => (
                    <span key={p.id} className="size-2 rounded-full" style={{ background: colorBy === "status" ? STATUS[p.status].color : TYPE[p.type].color }} title={`${p.headline || p.type} · ${STATUS[p.status].label}`} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          {selected ? (
            <>
              <p className="flex items-center gap-2 font-bold">
                <CalendarDays className="size-4 text-fuchsia-600" />
                {new Date(`${selected}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              {selectedPosts.length ? (
                <div className="mt-3 space-y-2">
                  {selectedPosts.map((p) => (
                    <button key={p.id} type="button" onClick={() => onEdit(p)} className="block w-full rounded-xl border border-[#ece6f4] p-2.5 text-left hover:border-fuchsia-200">
                      <span className="flex items-center gap-1.5">
                        <span className={clsx("rounded-full px-1.5 py-px text-[10px] font-semibold", TYPE[p.type].cls)}>{p.type}</span>
                        <Badge tone={STATUS[p.status].tone}>{STATUS[p.status].label}</Badge>
                        <span className="ml-auto text-[11px] text-ink/45" suppressHydrationWarning>
                          {new Date(p.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-sm font-semibold">{p.headline || p.body.slice(0, 50) || "Untitled"}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-ink/55">Nothing on this day.</p>
              )}
              {selected >= today && (
                <button type="button" onClick={() => onCreate(selected)} className={clsx(btn.outline, btn.sm, "mt-3 w-full")}>
                  <Plus className="size-3.5" /> Schedule a post for this day
                </button>
              )}
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 font-bold">📅 Select a date</p>
              <p className="mt-1 text-sm text-ink/55">Click a date on the calendar to see scheduled posts.</p>
            </>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-bold">Legend</p>
            <div className="flex rounded-lg bg-[#efeaf5] p-0.5 text-[11px] font-semibold" role="group" aria-label="Dots show">
              {(["status", "type"] as const).map((c) => (
                <button key={c} type="button" aria-pressed={colorBy === c} onClick={() => setColorBy(c)} className={clsx("rounded-md px-2 py-0.5 capitalize", colorBy === c ? "bg-white shadow-sm" : "text-ink/55")}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-1 text-xs text-ink/50">Dots are coloured by {colorBy}.</p>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
            {Object.values(STATUS).map((s) => (
              <span key={s.label} className={clsx("flex items-center gap-2", colorBy !== "status" && "opacity-45")}>
                <span className="size-2.5 rounded-full" style={{ background: s.color }} /> {s.label}
              </span>
            ))}
            {(Object.keys(TYPE) as Post["type"][]).map((t) => (
              <span key={t} className={clsx("flex items-center gap-2", colorBy !== "type" && "opacity-45")}>
                <span className="size-2.5 rounded-full" style={{ background: TYPE[t].color }} /> {t}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---- automation -----------------------------------------------------------------------------

function Automation({ posts, agentActive, connected, nowMs }: { posts: Post[]; agentActive: boolean; connected: boolean; nowMs: number }) {
  const { run, pending } = useAction();
  const [busy, setBusy] = useState<string | null>(null);
  const agentPosts = posts.filter((p) => p.byAgent && p.status !== "draft").sort((a, b) => b.date.localeCompare(a.date));
  const published = agentPosts.filter((p) => p.status === "published" && new Date(p.date).getTime() <= nowMs);
  const last = published[0];
  const go = (key: string, fn: () => Promise<{ ok?: string; error?: string }>) => {
    setBusy(key);
    run(fn, () => setBusy(null));
  };

  const rows = [
    { key: "post", icon: Play, title: "Run the agent now", text: "Bypass the cadence wait and have the agent draft + publish one post immediately. Policy checks still run.", label: "Run now", fn: runAgentNowAction },
    { key: "desc", icon: Sparkles, title: "Refresh description", text: "Use this after real changes to your business — new services, a new area, new hours. Your agent drafts a fresh description for you to approve.", label: "Refresh now", fn: refreshDescriptionAction },
    { key: "all", icon: Zap, title: "Run every agent task now", text: "Bypasses all cadence gates and fires the post, reviews, optimization, audit, and scan workers in one pass. Takes 30-60s.", label: "Run everything", fn: runEverythingAction },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink/65">Your AI agent drafts and publishes Google Business Profile posts on schedule. They are keyword-driven, policy-checked, and photo-rotated.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Agent status" value={<span className={agentActive ? "text-emerald-600" : "text-amber-600"}>{agentActive ? "Active" : "Paused"}</span>} icon={Bot} tone={agentActive ? "green" : "amber"} sub={agentActive ? "Posting about twice a week" : "Flip the sidebar toggle to enable"} />
        <StatCard label="Posts published" value={published.length} icon={Send} tone="fuchsia" sub="By the agent on this location" />
        <StatCard label="Last published" value={<span suppressHydrationWarning>{last ? timeAgo(last.date, nowMs) : "—"}</span>} icon={Clock} tone="purple" sub={last ? formatDate(last.date, "long") : agentActive ? "Nothing yet" : "Agent paused"} />
      </div>

      <Card className="!p-0">
        {rows.map((r, i) => (
          <div key={r.key} className={clsx("flex flex-wrap items-center gap-4 px-5 py-4", i > 0 && "border-t border-[#ece6f4]")}>
            <IconTile icon={r.icon} tone="fuchsia" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{r.title}</p>
              <p className="text-sm text-ink/60">{r.text}</p>
            </div>
            <button type="button" onClick={() => go(r.key, r.fn)} disabled={pending || !connected} className={clsx(r.key === "all" ? btn.fuchsia : btn.outline, "shrink-0")} title={connected ? undefined : "Connect Google first"}>
              {busy === r.key ? <LoaderCircle className="size-4 animate-spin" /> : <r.icon className="size-4" />} {r.label}
            </button>
          </div>
        ))}
      </Card>

      <Card>
        <CardHeader title="Recent agent posts" description="The last 10 posts your agent drafted, in order" />
        {agentPosts.length ? (
          <ul className="mt-4 divide-y divide-[#ece6f4]">
            {agentPosts.slice(0, 10).map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                {p.image ? <img src={p.image} alt="" className="size-10 shrink-0 rounded-lg object-cover" /> : <IconTile icon={FileText} tone="fuchsia" size="sm" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{p.headline || p.body.slice(0, 60)}</span>
                  <span className="block truncate text-xs text-ink/50">{p.body}</span>
                </span>
                <Badge tone={STATUS[p.status].tone}>{STATUS[p.status].label}</Badge>
                <span className="w-24 text-right text-xs text-ink/45" suppressHydrationWarning>
                  {formatDate(p.date)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-[#e4dcef] px-4 py-6 text-center text-sm text-ink/55">No agent posts yet. Turn the agent on, or press Run now to publish the first one.</p>
        )}
      </Card>

      <Card>
        <CardHeader title="How it works" />
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink/70 marker:text-fuchsia-500">
          <li>Every 6 hours, the agent checks whether a post is due — it aims for about twice per week.</li>
          <li>It picks a random keyword from your strategy and a fresh photo from your library that wasn&apos;t used in the last 5 posts.</li>
          <li>It drafts the post following Google&apos;s posting guidelines, then audits it (no phone numbers, links or shouting) before publishing.</li>
          <li>It publishes through the Google Business Profile API and logs the post in your activity feed.</li>
        </ul>
        <p className="mt-3 text-sm text-ink/55">You can always edit or delete an agent post from the All posts tab, and pause the agent any time from the sidebar.</p>
      </Card>
    </div>
  );
}
