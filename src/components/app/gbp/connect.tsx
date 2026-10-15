"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, LoaderCircle, MessageSquare, FileText, ShieldCheck, Star, TrendingUp, Store } from "lucide-react";
import { connectGoogleAction, disconnectGoogleAction } from "@/app/actions/gbp";
import { useAction } from "@/components/app/toast";
import { btn, Card, IconTile } from "@/components/app/ui";
import { ConfirmDialog, Modal } from "./modal";
import { GoogleG } from "./google-g";

const perks = [
  { icon: Star, text: "Read new reviews and draft replies for you" },
  { icon: FileText, text: "Publish posts and photos on your schedule" },
  { icon: Store, text: "Suggest description, category and service updates" },
  { icon: TrendingUp, text: "Track calls, clicks, directions and views" },
];

const scopes = [
  "See, edit, create and delete your Google business listings",
  "Read and reply to reviews on your business profile",
  "Publish posts and photos to your business profile",
  "See performance data for your business profile",
];

export function ConnectCard({ email, name, businessName }: { email: string; name: string; businessName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card className="!p-0">
        <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
          <div>
            <GoogleG size="lg" />
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Connect your Google Business Profile</h2>
            <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink/60">
              Link {businessName}&apos;s Google profile so your agent can read reviews, post updates, and keep your listing in shape. Nothing changes on Google until you approve it.
            </p>
            <button type="button" onClick={() => setOpen(true)} className={clsx(btn.primary, "mt-5 !px-5 !py-2.5")}>
              <GoogleG size="xs" bare /> Connect with Google
            </button>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/50">
              <ShieldCheck className="size-3.5 text-emerald-600" /> Secure Google sign-in. You can disconnect any time.
            </p>
          </div>
          <ul className="space-y-2.5 self-center">
            {perks.map((p) => (
              <li key={p.text} className="flex items-center gap-3 rounded-xl bg-[#f8f6fb] px-3 py-2.5 text-sm">
                <IconTile icon={p.icon} size="sm" />
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <OAuthModal open={open} onClose={() => setOpen(false)} email={email} name={name} />
    </>
  );
}

function OAuthModal({ open, onClose, email, name }: { open: boolean; onClose: () => void; email: string; name: string }) {
  const [step, setStep] = useState<"account" | "consent">("account");
  const { run, pending } = useAction();
  const close = () => {
    if (pending) return;
    setStep("account");
    onClose();
  };
  const allow = () => run(() => connectGoogleAction(), (r) => !r?.error && close());

  return (
    <Modal
      open={open}
      onClose={close}
      width="max-w-[440px]"
      title={
        <span className="flex items-center gap-2 text-base font-semibold text-ink/70">
          <GoogleG size="xs" bare /> Sign in with Google
        </span>
      }
    >
      {step === "account" ? (
        <div className="py-2 text-center">
          <p className="text-xl font-semibold">Choose an account</p>
          <p className="mt-1 text-sm text-ink/60">
            to continue to <span className="font-semibold text-brand-700">Ranklit</span>
          </p>
          <button type="button" onClick={() => setStep("consent")} className="mt-5 flex w-full items-center gap-3 rounded-xl border border-[#e4dcef] px-4 py-3 text-left hover:bg-[#f8f6fb]">
            <span className="grid size-9 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white">{name.charAt(0).toUpperCase()}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{name}</span>
              <span className="block truncate text-xs text-ink/55">{email}</span>
            </span>
          </button>
          <p className="mt-5 text-xs leading-relaxed text-ink/45">
            To continue, Google will share your name, email address and profile picture with Ranklit.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-center gap-3 py-2">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-700 text-lg font-extrabold text-white">R</span>
            <span className="text-ink/30">⇄</span>
            <GoogleG size="lg" />
          </div>
          <p className="mt-3 text-center text-lg font-semibold">Ranklit wants to manage your Google Business Profile</p>
          <p className="mt-1 text-center text-xs text-ink/55">{email}</p>
          <p className="mt-5 text-sm font-semibold">This will allow Ranklit to:</p>
          <ul className="mt-2 divide-y divide-[#ece6f4] rounded-xl border border-[#ece6f4]">
            {scopes.map((s) => (
              <li key={s} className="flex items-start gap-2.5 px-3 py-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-blue-600" /> {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">
            <MessageSquare className="mr-1 inline size-3.5" />
            Make sure you trust Ranklit. You can see or remove its access any time in your Google Account. Every change your agent proposes waits for your approval.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={close} disabled={pending} className={btn.outline}>
              Cancel
            </button>
            <button type="button" onClick={allow} disabled={pending} className={clsx(btn.primary, "!bg-blue-600 hover:!bg-blue-700")}>
              {pending && <LoaderCircle className="size-4 animate-spin" />} Allow
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function DisconnectLink() {
  const [open, setOpen] = useState(false);
  const { run, pending } = useAction();
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-ink/60 underline underline-offset-2 hover:text-red-600">
        Disconnect
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => run(() => disconnectGoogleAction(), () => setOpen(false))}
        pending={pending}
        danger
        title="Disconnect Google Business Profile?"
        text="Your agent will stop posting, replying to reviews, and syncing performance data until you reconnect. Your history in Ranklit stays put."
        confirmLabel="Disconnect"
      />
    </>
  );
}
