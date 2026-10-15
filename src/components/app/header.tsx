"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { CreditCard, LogOut, Moon, Search, Sun, UserRound, Zap } from "lucide-react";
import { sections, sectionFor } from "@/lib/app/nav";
import { setAutopilotAction, signOutAction, toggleAutomationAction } from "@/app/actions/app";
import { useAction } from "./toast";

type Command = { label: string; hint?: string; icon: typeof Zap; run: () => void };

export function AppHeader({ email, initial, autopilot, autoReply }: { email: string; initial: string; autopilot: boolean; autoReply: boolean }) {
  const pathname = usePathname();
  const title = sectionFor(pathname).section.label;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ranklit-theme") === "dark";
    document.documentElement.classList.toggle("app-dark", saved);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with persisted preference on mount
    setDark(saved);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("app-dark", next);
    localStorage.setItem("ranklit-theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-30 flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-[#ece6f4] bg-white pr-4 pl-14 lg:pl-5">
      <h1 className="text-[17px] font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-[#ece6f4] bg-[#faf8fc] px-3 text-sm text-ink/45 hover:border-brand-200 sm:flex"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">Search or jump to...</span>
          <kbd className="rounded border border-ink/10 bg-white px-1.5 text-[11px] font-semibold text-ink/60">Ctrl K</kbd>
        </button>
        <button type="button" onClick={() => setPaletteOpen(true)} className="grid size-9 place-items-center rounded-lg border border-[#ece6f4] sm:hidden" aria-label="Search">
          <Search className="size-4" />
        </button>
        <button type="button" onClick={toggleTheme} className="grid size-9 place-items-center rounded-lg border border-[#ece6f4] text-ink/70 hover:text-ink" aria-label="Toggle dark mode">
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <AvatarMenu email={email} initial={initial} />
      </div>
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} autopilot={autopilot} autoReply={autoReply} />}
    </header>
  );
}

function AvatarMenu({ email, initial }: { email: string; initial: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="grid size-9 place-items-center rounded-full bg-[#f3e8fb] text-sm font-bold text-brand-700"
      >
        {initial}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-[#ece6f4] bg-white p-1 shadow-lift">
          <p className="truncate border-b border-[#ece6f4] px-3 py-2 text-xs text-ink/55">{email}</p>
          <Link href="/settings" role="menuitem" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[#f7f4fb]">
            <UserRound className="size-4 text-ink/50" /> Account
          </Link>
          <Link href="/settings/plans" role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[#f7f4fb]">
            <CreditCard className="size-4 text-ink/50" /> Billing &amp; plan
          </Link>
          <form action={signOutAction} className="mt-1 border-t border-[#ece6f4] pt-1">
            <button role="menuitem" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[#f7f4fb]">
              <LogOut className="size-4 text-ink/50" /> Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function CommandPalette({ onClose, autopilot, autoReply }: { onClose: () => void; autopilot: boolean; autoReply: boolean }) {
  const router = useRouter();
  const { run } = useAction();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const groups = useMemo(() => {
    const goto: Command[] = [
      ...sections.map((s) => ({ label: s.label, icon: s.icon, run: () => router.push(s.href) })),
      ...sections.flatMap((s) =>
        s.tabs.filter((t) => t.href !== s.href).map((t) => ({ label: t.label, hint: s.label, icon: t.icon, run: () => router.push(t.href) })),
      ),
    ];
    const actions: Command[] = [
      { label: `Turn Autopilot ${autopilot ? "off" : "on"}`, hint: "Autopilot", icon: Zap, run: () => run(() => setAutopilotAction(!autopilot)) },
      { label: `Turn review auto-reply ${autoReply ? "off" : "on"}`, hint: "Autopilot", icon: Zap, run: () => run(() => toggleAutomationAction("autoReply", !autoReply)) },
      { label: "Run a map scan", hint: "Rankings", icon: Zap, run: () => router.push("/dashboard/scans") },
      { label: "Create a Google post", hint: "Google Profile", icon: Zap, run: () => router.push("/dashboard/gbp/posts?compose=1") },
      { label: "Buy extra credits", hint: "Settings", icon: Zap, run: () => router.push("/settings/plans#credits") },
    ];
    const q = query.trim().toLowerCase();
    const filter = (list: Command[]) => (q ? list.filter((c) => `${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q)) : list.slice(0, 9));
    return [
      { title: "Go to", items: filter(goto) },
      { title: "Do it now", items: filter(actions) },
    ].filter((g) => g.items.length);
  }, [query, autopilot, autoReply, router, run]);

  const flat = groups.flatMap((g) => g.items);
  const choose = (c?: Command) => {
    if (!c) return;
    onClose();
    c.run();
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-start bg-ink/30 px-4 pt-[12vh] backdrop-blur-[2px]" onClick={onClose} role="dialog" aria-modal aria-label="Search">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#ece6f4] bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-[#ece6f4] p-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(flat.length - 1, i + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(0, i - 1));
              }
              if (e.key === "Enter") choose(flat[index]);
            }}
            placeholder="Search pages and actions…"
            className="h-10 w-full rounded-lg bg-[#f7f4fb] px-3 text-sm outline-none"
            aria-label="Search pages and actions"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {groups.map((g) => (
            <div key={g.title} className="mb-1">
              <p className="px-2 py-1 text-xs font-semibold text-ink/45">{g.title}</p>
              {g.items.map((c) => {
                const i = flat.indexOf(c);
                return (
                  <button
                    key={`${g.title}-${c.label}-${c.hint ?? ""}`}
                    type="button"
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => choose(c)}
                    className={clsx(
                      "flex w-full items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-1.5 text-left text-sm",
                      i === index ? "border-brand-600 bg-[#f6ecfc]" : "border-transparent",
                    )}
                  >
                    <c.icon className={clsx("size-4", g.title === "Do it now" ? "text-amber-500" : "text-ink/50")} />
                    <span className="flex-1">{c.label}</span>
                    {c.hint && <span className="text-xs text-ink/40">{c.hint}</span>}
                  </button>
                );
              })}
            </div>
          ))}
          {!flat.length && <p className="px-3 py-6 text-center text-sm text-ink/50">No matches.</p>}
        </div>
        <p className="border-t border-[#ece6f4] px-3 py-2 text-[11px] text-ink/45">
          <strong>↑↓</strong> to move · <strong>Enter</strong> to open · <strong>Esc</strong> to close
        </p>
      </div>
    </div>
  );
}
