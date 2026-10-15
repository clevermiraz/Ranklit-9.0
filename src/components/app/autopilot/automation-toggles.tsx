"use client";

import { useState } from "react";
import { Bot, ClipboardCheck, Link2, MessageSquare, Radar, Store, type LucideIcon } from "lucide-react";
import { toggleAutomationAction, type AutomationKey } from "@/app/actions/app";
import type { Automations } from "@/lib/app/types";
import { Switch } from "@/components/app/controls";
import { Badge, IconTile, type Tone } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";

const rows: { key: AutomationKey; icon: LucideIcon; tone: Tone; title: string; text: string; chip?: string }[] = [
  { key: "autoReply", icon: MessageSquare, tone: "amber", title: "Auto-reply to Google reviews", text: "Your bot writes and posts a reply to each new review. Replies are public.", chip: "Off by default" },
  { key: "autoPost", icon: Store, tone: "fuchsia", title: "Auto-post to your Google profile", text: "Fresh posts about your services, about three times a week." },
  { key: "autoCitations", icon: Link2, tone: "teal", title: "Auto-build citations", text: "Lists your business on directories so Google trusts your details." },
  { key: "autoScan", icon: Radar, tone: "purple", title: "Auto-scan your map rankings", text: "A weekly map scan of your keywords, on the day you choose below." },
  { key: "refreshDescription", icon: ClipboardCheck, tone: "blue", title: "Refresh your Google description", text: "Monthly check of your description, with a sharper rewrite when it helps." },
];

export function AutomationToggles({ automations }: { automations: Automations }) {
  const { run } = useAction();
  const [state, setState] = useState(automations);
  const [prev, setPrev] = useState(automations);
  if (prev !== automations) {
    setPrev(automations);
    setState(automations);
  }
  const [busy, setBusy] = useState<AutomationKey | null>(null);

  const flip = (key: AutomationKey, value: boolean) => {
    setState((s) => ({ ...s, [key]: value }));
    setBusy(key);
    run(
      () => toggleAutomationAction(key, value),
      (r) => {
        setBusy(null);
        if (r?.error) setState((s) => ({ ...s, [key]: !value }));
      },
    );
  };

  return (
    <ul className="divide-y divide-[#f0ebf6]">
      {rows.map((r) => (
        <li key={r.key} className="flex items-center gap-3 py-3.5">
          <IconTile icon={r.icon} tone={r.tone} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              {r.title}
              {r.chip && <Badge tone="gray">{r.chip}</Badge>}
            </span>
            <span className="block text-xs text-ink/55">{r.text}</span>
          </span>
          <Switch checked={state[r.key]} disabled={busy === r.key} onChange={(v) => flip(r.key, v)} label={r.title} />
        </li>
      ))}
    </ul>
  );
}

export function AutopilotStatusCard({ on }: { on: boolean }) {
  return (
    <div className={on ? "flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5" : "flex items-start gap-3 rounded-2xl border border-[#ece6f4] bg-white p-5"}>
      <IconTile icon={Bot} tone={on ? "green" : "gray"} />
      <div>
        <p className="font-bold">Autopilot is {on ? "ON" : "OFF"}</p>
        <p className="text-sm text-ink/60">
          {on
            ? "The actions you've turned on below run on schedule. Turn off the Autopilot switch in the sidebar to pause them all."
            : "These actions are paused. Turn on the Autopilot switch in the sidebar to let the enabled ones run."}
        </p>
      </div>
    </div>
  );
}
