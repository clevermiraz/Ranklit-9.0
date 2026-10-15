import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { getPhotos } from "@/lib/server/gbp-store";
import type { BusinessState } from "@/lib/app/types";
import { PostsView, type PostsTab } from "@/components/app/gbp/posts";
import { aiContext } from "@/components/app/gbp/logic";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Posts" };

const TABS: PostsTab[] = ["all", "calendar", "photos", "automation"];

/** Scheduled posts whose time has come are published (mock of the publishing worker). */
function settleScheduled(s: BusinessState) {
  const now = Date.now();
  for (const p of s.posts) {
    if (p.status === "scheduled" && new Date(p.date).getTime() <= now && s.profile.connected) {
      p.status = "published";
      s.activity.unshift({ id: crypto.randomUUID(), emoji: "📝", text: `Published a scheduled Google post: “${p.headline || p.body.slice(0, 40)}”.`, at: new Date().toISOString() });
    }
  }
  const d = new Date(now);
  return { nowMs: now, today: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` };
}

export default async function GbpPostsPage(props: PageProps<"/dashboard/gbp/posts">) {
  const { business: s } = await getApp();
  const sp = await props.searchParams;
  const tab = TABS.includes(sp.tab as PostsTab) ? (sp.tab as PostsTab) : "all";
  const { nowMs, today } = settleScheduled(s);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PostsView
        posts={s.posts}
        photos={getPhotos(s.profile.id, s.profile.name)}
        ctx={aiContext(s)}
        connected={s.profile.connected}
        initialTab={tab}
        compose={sp.compose === "1"}
        today={today}
        agentActive={s.autopilot && s.automations.autoPost && s.profile.connected}
        nowMs={nowMs}
      />
    </div>
  );
}
