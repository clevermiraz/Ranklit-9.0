"use client";

import { useState } from "react";
import clsx from "clsx";
import { AlertTriangle, ChevronRight, KeyRound, Loader2, Plus, Trash2 } from "lucide-react";
import { createApiKeyAction, revokeApiKeyAction } from "@/app/actions/settings";
import type { ApiKey } from "@/lib/app/types";
import { Badge, CardHeader, Label, btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import { CopyButton } from "@/components/app/copy-button";
import { Modal } from "./modal";

type Scope = ApiKey["scopes"][number];
const MCP_URL = "https://app.ranklit.com/api/mcp";
const PLACEHOLDER = "rl_live_YOUR_KEY";

const SCOPES: { value: Scope; title: string; text: string }[] = [
  { value: "post", title: "Post to Google", text: "Draft, schedule or publish posts on your Google Business Profile." },
  { value: "reply", title: "Reply to reviews", text: "Post replies to your Google reviews. Replies are public." },
  { value: "scan", title: "Run map scans", text: "Start rank scans. They spend credits, like Scan Now does." },
];
const scopeLabel = (s: Scope) => SCOPES.find((x) => x.value === s)!.title;

type Tool = "Claude Code" | "Claude app" | "Cursor" | "Codex" | "Anything else";
const TOOLS: Tool[] = ["Claude Code", "Claude app", "Cursor", "Codex", "Anything else"];

const intro = (business: string) =>
  `I use Ranklit (ranklit.com) to manage local SEO for my business, ${business}. Connect yourself to my Ranklit account through its MCP server so you can read my map rankings, reviews, AI visibility and reports, and help me act on them.`;

const outro = `When it's connected, call the "whoami" tool to confirm you can see my account, then give me a two-line summary of how my business is doing. If anything fails, tell me the exact error.`;

function promptFor(tool: Tool, key: string, business: string) {
  const k = key || PLACEHOLDER;
  const ask = key ? "" : `\n\nI haven't given you my API key yet. Ask me for it (it starts with rl_live_) before you change any settings.`;
  switch (tool) {
    case "Claude Code":
      return `${intro(business)}

Add it as a remote MCP server for my user, using HTTP transport:

claude mcp add --transport http --scope user ranklit ${MCP_URL} --header "Authorization: Bearer ${k}"

Then run "claude mcp list" to check that ranklit shows as connected.${ask}

${outro}`;
    case "Claude app":
      return `${intro(business)}

Walk me through adding it as a custom connector, one step at a time:
1. Settings → Connectors → Add custom connector.
2. Name: Ranklit
3. Remote MCP server URL: ${MCP_URL}
4. Under advanced settings, add the header  Authorization: Bearer ${k}
5. Save, then enable the Ranklit connector in this chat.${ask}

${outro}`;
    case "Cursor":
      return `${intro(business)}

Add this server to my global Cursor MCP config at ~/.cursor/mcp.json (merge it with anything already there, don't overwrite):

{
  "mcpServers": {
    "ranklit": {
      "url": "${MCP_URL}",
      "headers": { "Authorization": "Bearer ${k}" }
    }
  }
}

Then tell me to reload Cursor's MCP servers (Settings → MCP).${ask}

${outro}`;
    case "Codex":
      return `${intro(business)}

Add this to my Codex config at ~/.codex/config.toml (keep any existing servers):

[mcp_servers.ranklit]
url = "${MCP_URL}"
http_headers = { Authorization = "Bearer ${k}" }

Then restart Codex so it picks up the new server.${ask}

${outro}`;
    default:
      return `${intro(business)}

Ranklit speaks the Model Context Protocol (streamable HTTP):
- Server URL: ${MCP_URL}
- Auth header: Authorization: Bearer ${k}

Add it however your app adds remote MCP servers. If you can't use MCP, tell me and we'll stop here.${ask}

${outro}`;
  }
}

const captions: Record<Tool, string> = {
  "Claude Code": "Paste into Claude Code, in any folder.",
  "Claude app": "Paste into a new chat in the Claude desktop or web app.",
  Cursor: "Paste into Cursor's agent chat.",
  Codex: "Paste into Codex in any folder.",
  "Anything else": "Paste into any assistant that supports MCP servers.",
};

const abilities = [
  "Read your map rankings, scan history and AI visibility checks",
  "Read your reviews, review replies and Google profile performance",
  "Pull your monthly reports and bot activity",
  "Draft, schedule or publish Google posts — if the key allows it",
  "Reply to reviews — if the key allows it",
  "Start map scans, which spend credits — if the key allows it",
];

export function ConnectAI({ business }: { business: string }) {
  const { run, pending } = useAction();
  const [tool, setTool] = useState<Tool>("Claude Code");
  const [keys, setKeys] = useState<Partial<Record<Tool, string>>>({});
  const [more, setMore] = useState(false);
  const key = keys[tool] ?? "";
  const prompt = promptFor(tool, key, business);

  return (
    <div>
      <CardHeader
        title="Connect your AI"
        description={
          <>
            <strong className="text-ink">Let your AI set up Ranklit for you.</strong> Copy the prompt below into your AI tool and it connects itself to your account.
          </>
        }
      />
      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-[#ece6f4]" role="tablist" aria-label="AI tool">
        {TOOLS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tool === t}
            onClick={() => setTool(t)}
            className={clsx("-mb-px border-b-2 px-3 py-2 text-sm font-semibold whitespace-nowrap", tool === t ? "border-brand-700 text-brand-700" : "border-transparent text-ink/55 hover:text-ink")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Your setup prompt</p>
        <CopyButton value={prompt} label="Copy prompt" />
      </div>
      <pre className="mt-2 max-h-72 overflow-auto rounded-xl bg-night p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-white/90">{prompt}</pre>
      <p className="mt-2 text-xs text-ink/55">
        {captions[tool]} {key ? "Your key is filled in — this is the only time you'll see it, so copy the prompt now." : "No key in it yet: make one below and it is filled in, or your AI will ask you for it."}
      </p>

      <div className="mt-5 rounded-xl border border-[#ece6f4] bg-[#f8f6fb] p-4">
        <p className="text-sm font-semibold">Your API key</p>
        {key ? (
          <>
            <p className="mt-1 flex items-start gap-1.5 text-xs text-amber-700">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" /> Shown once. It&apos;s in the prompt above — copy it before you leave this page.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="rounded-md bg-white px-2 py-1 font-mono text-xs ring-1 ring-[#ece6f4]">{key}</code>
              <CopyButton value={key} label="Copy key" />
            </div>
          </>
        ) : (
          <>
            <p className="mt-0.5 text-xs text-ink/60">The prompt needs a key and you don&apos;t have one for {tool} yet. We&apos;ll make one that can read, post, reply and scan, and put it straight into the prompt.</p>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => createApiKeyAction(tool, ["post", "reply", "scan"]), (r) => r?.key && setKeys((k) => ({ ...k, [tool]: r.key })))}
              className={clsx(btn.primary, "mt-3")}
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />} Create a key for {tool}
            </button>
            <p className="mt-2 text-xs text-ink/50">Want a read-only key instead? Make one in API keys below and paste it when your AI asks.</p>
          </>
        )}
      </div>

      <button type="button" onClick={() => setMore(!more)} aria-expanded={more} className="mt-4 flex items-center gap-1 text-sm font-semibold text-ink/70 hover:text-ink">
        <ChevronRight className={clsx("size-4 transition-transform", more && "rotate-90")} /> What it can do once connected
      </button>
      {more && (
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-ink/70">
          {abilities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ApiKeys({ keys }: { keys: (ApiKey & { created: string })[] }) {
  const { run, pending } = useAction();
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [created, setCreated] = useState<{ name: string; key: string } | null>(null);
  const [revoke, setRevoke] = useState<ApiKey | null>(null);

  const create = () =>
    run(
      () => createApiKeyAction(name, scopes),
      (r) => {
        if (r?.key) {
          setCreated({ name: name.trim(), key: r.key });
          setName("");
          setScopes([]);
        }
      },
    );

  return (
    <div>
      <CardHeader
        icon={KeyRound}
        title="API keys"
        description="Each key works like a password for your account. Every key can read; tick what it may also do. Revoke a key and every assistant using it loses access at once."
      />
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) create();
        }}
      >
        <Label htmlFor="key-name">Key name</Label>
        <div className="flex flex-wrap gap-2">
          <input id="key-name" className={clsx(input, "max-w-sm flex-1")} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="e.g. Claude on my laptop" />
          <button type="submit" disabled={!name.trim() || pending} className={btn.primary}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Create key
          </button>
        </div>
        <p className="mt-4 text-sm font-semibold">What this key may do, besides read</p>
        <div className="mt-2 space-y-2">
          {SCOPES.map((s) => (
            <label key={s.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#ece6f4] px-3 py-2.5 hover:border-brand-200">
              <input
                type="checkbox"
                checked={scopes.includes(s.value)}
                onChange={(e) => setScopes((x) => (e.target.checked ? [...x, s.value] : x.filter((v) => v !== s.value)))}
                className="mt-0.5 size-4 accent-brand-700"
              />
              <span>
                <span className="block text-sm font-semibold">{s.title}</span>
                <span className="block text-xs text-ink/55">{s.text}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink/50">You&apos;ll see the key once, right after you create it. Untick all three for a read-only key.</p>
      </form>

      <div className="mt-6 border-t border-[#f0ebf6] pt-4">
        {keys.length === 0 ? (
          <p className="py-4 text-center text-sm text-ink/55">No keys yet. Create one to connect an AI assistant.</p>
        ) : (
          <ul className="divide-y divide-[#f0ebf6]">
            {keys.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#f3e8fb] text-brand-700">
                  <KeyRound className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{k.name}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-ink/55">
                    <code className="font-mono">{k.prefix}••••••••</code> · Created {k.created}
                  </span>
                </span>
                <span className="flex flex-wrap gap-1">
                  <Badge tone="gray">Read</Badge>
                  {k.scopes.map((s) => (
                    <Badge key={s} tone={s === "scan" ? "amber" : "purple"}>
                      {scopeLabel(s)}
                    </Badge>
                  ))}
                </span>
                <button type="button" onClick={() => setRevoke(k)} className={clsx(btn.danger, btn.sm)}>
                  <Trash2 className="size-3.5" /> Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={!!created}
        onClose={() => setCreated(null)}
        title={`Key “${created?.name}” created`}
        description="Copy it now. For your security we only keep a fingerprint of it, so you won't be able to see it again."
        footer={
          <button type="button" className={btn.primary} onClick={() => setCreated(null)}>
            I&apos;ve copied it
          </button>
        }
      >
        {created && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-night p-3">
            <code className="min-w-0 flex-1 font-mono text-sm break-all text-white">{created.key}</code>
            <CopyButton value={created.key} label="Copy key" />
          </div>
        )}
      </Modal>

      <Modal
        open={!!revoke}
        onClose={() => setRevoke(null)}
        size="sm"
        title={`Revoke “${revoke?.name}”?`}
        description="Every assistant using this key loses access immediately. This can't be undone."
        footer={
          <>
            <button type="button" className={btn.outline} onClick={() => setRevoke(null)}>
              Keep it
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => revoke && run(() => revokeApiKeyAction(revoke.id), (r) => !r?.error && setRevoke(null))}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {pending && <Loader2 className="size-4 animate-spin" />} Revoke key
            </button>
          </>
        }
      />
    </div>
  );
}
