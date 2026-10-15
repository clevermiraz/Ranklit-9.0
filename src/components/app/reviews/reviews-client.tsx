"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Archive, Inbox, Loader2, MessageSquare, RefreshCw, Send, Sparkles, Star, Store } from "lucide-react";
import type { Feedback, Review } from "@/lib/app/types";
import { Badge, Card, CardHeader, EmptyState, IconTile, btn, formatDate, textarea } from "@/components/app/ui";
import { ChipGroup, Switch } from "@/components/app/controls";
import { useAction } from "@/components/app/toast";
import {
  discardDraftAction,
  dismissFeedbackAction,
  generateAllRepliesAction,
  generateReplyAction,
  postReplyAction,
  saveDraftAction,
  setAutoReplyAction,
  syncReviewsAction,
} from "@/app/actions/reviews";
import { initial } from "./shared";

export function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={clsx(size === "sm" ? "size-3.5" : "size-4", i <= rating ? "fill-amber-400 text-amber-400" : "fill-[#ece6f4] text-[#ece6f4]")} />
      ))}
    </span>
  );
}

// ---- header actions ------------------------------------------------------------------------------

export function ReviewsHeaderActions({ syncedLabel, unreplied, connected }: { syncedLabel: string; unreplied: number; connected: boolean }) {
  const sync = useAction();
  const gen = useAction();
  return (
    <>
      <span className="hidden text-xs text-ink/45 sm:inline">{syncedLabel}</span>
      <button type="button" className={btn.outline} disabled={sync.pending} onClick={() => sync.run(() => syncReviewsAction())}>
        <RefreshCw className={clsx("size-4", sync.pending && "animate-spin")} /> {sync.pending ? "Syncing…" : "Sync Reviews"}
      </button>
      <button
        type="button"
        className={btn.amber}
        disabled={gen.pending || !connected}
        title={!connected ? "Connect Google to pull in reviews first" : unreplied ? undefined : "No unreplied reviews"}
        onClick={() => gen.run(() => generateAllRepliesAction())}
      >
        {gen.pending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate All Replies
      </button>
    </>
  );
}

// ---- automatic replies --------------------------------------------------------------------------

export function AutoReplyCard({ on }: { on: boolean }) {
  const { run, pending } = useAction();
  return (
    <Card className="flex items-center gap-4">
      <IconTile icon={Sparkles} tone="amber" />
      <div className="min-w-0 flex-1">
        <p className="font-bold">Automatic review replies</p>
        <p className="text-sm text-ink/60">
          {on
            ? "Automatic replies are on. Your bot answers new 4–5★ reviews for you; lower ratings wait for you to review a draft."
            : "Automatic replies are paused. You can still generate and post replies manually below."}
        </p>
      </div>
      <Switch checked={on} disabled={pending} label="Automatic review replies" onChange={(v) => run(() => setAutoReplyAction(v))} />
    </Card>
  );
}

// ---- feedback inbox -------------------------------------------------------------------------------

export function FeedbackInbox({ feedback }: { feedback: Feedback[] }) {
  const { run, pending } = useAction();
  return (
    <Card className="flex flex-col">
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <Inbox className="size-5 text-amber-500" /> Feedback inbox
          </span>
        }
        description="Private feedback from unhappy customers before they leave a review."
        badge={feedback.length > 0 ? <Badge tone="amber">{feedback.length}</Badge> : undefined}
      />
      {feedback.length === 0 ? (
        <p className="mt-4 flex flex-1 items-center rounded-xl bg-[#f8f6fb] p-4 text-sm text-ink/55">
          No feedback yet. When a customer rates below your threshold, their private feedback lands here.
        </p>
      ) : (
        <ul className="mt-4 max-h-[236px] space-y-2 overflow-y-auto pr-1">
          {feedback.map((f) => (
            <li key={f.id} className="group rounded-xl border border-[#ece6f4] bg-[#fbfaff] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-semibold">{f.name}</span>
                  <Stars rating={f.rating} />
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <span className="text-xs text-ink/45">{formatDate(f.date, "numeric")}</span>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => dismissFeedbackAction(f.id))}
                    className="rounded-md p-1 text-ink/40 hover:bg-ink/5 hover:text-ink"
                    aria-label="Archive feedback"
                    title="Archive"
                  >
                    <Archive className="size-3.5" />
                  </button>
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/75">{f.text}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ---- review list ------------------------------------------------------------------------------------

type StatusFilter = "all" | "unreplied" | "draft" | "replied";
type StarFilter = "all" | 1 | 2 | 3 | 4 | 5;
type Sort = "newest" | "oldest" | "lowest";

export function ReviewsList({ reviews, connected }: { reviews: Review[]; connected: boolean }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [stars, setStars] = useState<StarFilter>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const shown = useMemo(() => {
    const list = reviews.filter((r) => (status === "all" || r.status === status) && (stars === "all" || r.rating === stars));
    return list.sort((a, b) =>
      sort === "oldest" ? a.date.localeCompare(b.date) : sort === "lowest" ? a.rating - b.rating || b.date.localeCompare(a.date) : b.date.localeCompare(a.date),
    );
  }, [reviews, status, stars, sort]);

  if (!reviews.length) {
    return (
      <Card>
        <EmptyState
          icon={connected ? MessageSquare : Store}
          tone="amber"
          title={connected ? "No reviews yet" : "Connect Google to see your reviews"}
          text={
            connected
              ? "New Google reviews show up here within a few hours. Share your review link to get the first ones in."
              : "Link your Google Business Profile and we'll pull in every review so you can reply from here."
          }
        >
          <Link href={connected ? "/dashboard/get-reviews" : "/dashboard/gbp"} className={btn.amber}>
            {connected ? "Get your review link" : "Connect Google"}
          </Link>
        </EmptyState>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <ChipGroup
          tone="amber"
          label="Filter by status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "unreplied", label: "Unreplied" },
            { value: "draft", label: "AI Draft Ready" },
            { value: "replied", label: "Replied" },
          ]}
        />
        <ChipGroup
          tone="amber"
          label="Filter by stars"
          value={stars}
          onChange={setStars}
          options={[{ value: "all" as StarFilter, label: "All Stars" }, ...([5, 4, 3, 2, 1] as const).map((n) => ({ value: n as StarFilter, label: `${n}★` }))]}
        />
        <ChipGroup
          tone="amber"
          label="Sort"
          value={sort}
          onChange={setSort}
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "lowest", label: "Lowest Rating" },
          ]}
        />
      </div>

      {shown.length === 0 ? (
        <Card className="text-center text-sm text-ink/55">
          No reviews match these filters.{" "}
          <button
            type="button"
            className="font-semibold text-amber-600 hover:underline"
            onClick={() => {
              setStatus("all");
              setStars("all");
            }}
          >
            Clear filters
          </button>
        </Card>
      ) : (
        <ul className="space-y-3">
          {shown.map((r) => (
            <li key={r.id}>
              <ReviewCard review={r} connected={connected} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Review["status"] }) {
  if (status === "replied") return <Badge tone="green" variant="outline">Replied</Badge>;
  if (status === "draft") return <Badge tone="purple" variant="outline" icon={Sparkles}>AI Draft Ready</Badge>;
  return <Badge tone="amber" variant="outline">Unreplied</Badge>;
}

function ReviewCard({ review: r, connected }: { review: Review; connected: boolean }) {
  const { run, pending } = useAction();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(r.reply ?? "");
  const [variant, setVariant] = useState(0);
  const [synced, setSynced] = useState(r.reply);

  // Keep the editor in sync when the server sends a new draft (e.g. "Generate All Replies").
  if (synced !== r.reply) {
    setSynced(r.reply);
    setText(r.reply ?? "");
  }

  const showEditor = r.status === "draft" || editing;

  const generate = (v: number) =>
    run(
      () => generateReplyAction(r.id, v),
      (res) => {
        if (res.reply) setText(res.reply);
      },
    );

  return (
    <article className="rounded-xl border border-[#ece6f4] bg-white p-4 shadow-[0_1px_2px_rgba(35,25,56,.04)] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">{initial(r.author)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{r.author}</span>
                <StatusBadge status={r.status} />
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-ink/50">
                <Stars rating={r.rating} />
                {formatDate(r.date, "numeric")}
              </p>
            </div>
            {r.status === "unreplied" && (
              <button type="button" className={clsx(btn.outline, btn.sm, "!border-amber-300 !text-amber-700 hover:!bg-amber-50")} disabled={pending} onClick={() => generate(0)}>
                {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} Generate
              </button>
            )}
          </div>
          {r.text ? <p className="mt-2 text-sm leading-relaxed text-ink/80">{r.text}</p> : <p className="mt-2 text-sm text-ink/40 italic">Rating only — no written review.</p>}

          {showEditor && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">{editing && r.status === "replied" ? "Edit your reply" : "AI draft"}</p>
                {r.status === "draft" && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-ink/55 hover:text-ink"
                    disabled={pending}
                    onClick={() => {
                      const v = variant + 1;
                      setVariant(v);
                      generate(v);
                    }}
                  >
                    <RefreshCw className={clsx("size-3", pending && "animate-spin")} /> Rewrite
                  </button>
                )}
              </div>
              <textarea
                className={clsx(textarea, "mt-2 min-h-24 bg-white")}
                value={text}
                maxLength={4000}
                onChange={(e) => setText(e.target.value)}
                aria-label={`Reply to ${r.author}`}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={clsx(btn.amber, btn.sm)}
                  disabled={pending || !text.trim() || !connected}
                  title={!connected ? "Connect Google to post replies" : undefined}
                  onClick={() => run(() => postReplyAction(r.id, text), (res) => !res.error && setEditing(false))}
                >
                  <Send className="size-3.5" /> {r.status === "replied" ? "Update reply" : "Post reply"}
                </button>
                {r.status !== "replied" && (
                  <button type="button" className={clsx(btn.outline, btn.sm)} disabled={pending || !text.trim() || text === r.reply} onClick={() => run(() => saveDraftAction(r.id, text))}>
                    Save draft
                  </button>
                )}
                <button
                  type="button"
                  className={clsx(btn.ghost, "!text-xs")}
                  disabled={pending}
                  onClick={() => {
                    if (r.status === "replied") {
                      setEditing(false);
                      setText(r.reply ?? "");
                    } else run(() => discardDraftAction(r.id));
                  }}
                >
                  {r.status === "replied" ? "Cancel" : "Discard"}
                </button>
                <span className="ml-auto text-[11px] text-ink/40">{text.length}/4000</span>
              </div>
            </div>
          )}

          {r.status === "replied" && !editing && (
            <div className="mt-3 rounded-xl bg-[#f6f2fa] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">Your Reply</p>
                <button type="button" className="text-xs font-semibold text-ink/50 hover:text-ink" onClick={() => setEditing(true)}>
                  Edit
                </button>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink/80">{r.reply}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
