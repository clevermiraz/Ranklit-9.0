"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Briefcase, Check, Loader2, Mail } from "lucide-react";
import {
  cancelEmailChangeAction,
  changePasswordAction,
  requestEmailChangeAction,
  updateBusinessInfoAction,
  updateProfileAction,
} from "@/app/actions/settings";
import { ACCOUNT_MANAGER_EMAIL } from "@/lib/app/types";
import { Label, btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import { Modal } from "./modal";

/** "✓ Saved" when clean, "Save changes" when dirty. */
function SaveButton({ dirty, pending, label = "Save changes" }: { dirty: boolean; pending: boolean; label?: string }) {
  return (
    <button type="submit" disabled={!dirty || pending} className={clsx(btn.primary, !dirty && "!bg-[#ead6f8] !text-brand-700 !opacity-100")}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : !dirty && <Check className="size-4" />}
      {dirty ? label : "Saved"}
    </button>
  );
}

function useSynced<T>(value: T) {
  const [draft, setDraft] = useState(value);
  const [prev, setPrev] = useState(value);
  if (JSON.stringify(prev) !== JSON.stringify(value)) {
    setPrev(value);
    setDraft(value);
  }
  return [draft, setDraft] as const;
}

export function ProfileForm({ firstName, lastName }: { firstName: string; lastName: string }) {
  const { run, pending } = useAction();
  const [v, setV] = useSynced({ firstName, lastName });
  const dirty = v.firstName !== firstName || v.lastName !== lastName;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => updateProfileAction(v));
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="first">First name</Label>
          <input id="first" className={input} value={v.firstName} maxLength={60} required onChange={(e) => setV({ ...v, firstName: e.target.value })} autoComplete="given-name" />
        </div>
        <div>
          <Label htmlFor="last" hint="(optional)">
            Last name
          </Label>
          <input id="last" className={input} value={v.lastName} maxLength={60} onChange={(e) => setV({ ...v, lastName: e.target.value })} autoComplete="family-name" />
        </div>
      </div>
      <p className="mt-2 text-xs text-ink/55">Used in your dashboard greeting and on emails we send you.</p>
      <div className="mt-4">
        <SaveButton dirty={dirty && !!v.firstName.trim()} pending={pending} />
      </div>
    </form>
  );
}

export function EmailForm({ email, pendingEmail }: { email: string; pendingEmail: string | null }) {
  const { run, pending, push } = useAction();
  const [value, setValue] = useState(email);
  const send = () => {
    const v = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return push({ kind: "error", text: "Enter a valid email address." });
    if (v === email) return push({ kind: "error", text: "That's already your email address." });
    run(() => requestEmailChangeAction(v));
  };
  return (
    <div>
      <Label htmlFor="email">Email</Label>
      <div className="flex flex-wrap gap-2">
        <input id="email" type="email" className={clsx(input, "max-w-md flex-1")} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <button type="button" disabled={pending || value.trim().toLowerCase() === email} onClick={send} className={btn.outline}>
          {pending && <Loader2 className="size-4 animate-spin" />} Send confirmation
        </button>
      </div>
      <p className="mt-2 text-xs text-ink/55">Changing your email requires confirming the change from both your current address and the new one.</p>
      {pendingEmail && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Mail className="size-3.5" /> Waiting for confirmation: <strong>{pendingEmail}</strong>. Your email stays {email} until both links are clicked.
          <button type="button" className="ml-auto font-semibold underline" onClick={() => run(() => cancelEmailChangeAction())}>
            Cancel change
          </button>
        </div>
      )}
    </div>
  );
}

export function AgencyToolsLink({ onGrowth }: { onGrowth: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className="text-ink/65">
          Managing local SEO for clients?
        </p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agency" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
            <Briefcase className="size-3.5" /> Open Agency Dashboard
          </Link>
          <button type="button" onClick={() => setOpen(true)} className="text-ink/45 hover:text-ink">
            Details
          </button>
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title={
          <span className="flex items-center gap-2">
            <Briefcase className="size-5 text-brand-700" /> Agency tools
          </span>
        }
        description="Client workspaces, white-label reports and per-client billing for agencies managing several businesses."
        footer={
          onGrowth ? (
            <a href={`mailto:${ACCOUNT_MANAGER_EMAIL}?subject=Enable%20agency%20tools`} className={btn.primary}>
              Ask Lukas to turn them on
            </a>
          ) : (
            <Link href="/settings/plans#switch-plan" className={btn.primary} onClick={() => setOpen(false)}>
              See the Growth plan
            </Link>
          )
        }
      >
        <ul className="space-y-2 text-sm">
          {["Add and switch between client businesses", "White-label PDF reports with your logo", "Client-ready review links and widgets", "Agency pricing per client location"].map((t) => (
            <li key={t} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /> {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-[#f8f1fc] px-3 py-2 text-xs text-ink/70">
          {onGrowth ? "Agency tools are included on Growth. Your account manager switches them on for you — usually within a business day." : "Agency tools come with the Growth plan. Switch plans and your account manager will set them up."}
        </p>
      </Modal>
    </>
  );
}

type BizInfo = { name: string; phone: string; address: string; website: string; gbpUrl: string };

export function BusinessInfoForm(props: BizInfo) {
  const { run, pending } = useAction();
  const [v, setV] = useSynced<BizInfo>(props);
  const dirty = (Object.keys(props) as (keyof BizInfo)[]).some((k) => v[k] !== props[k]);
  const field = (k: keyof BizInfo, label: string, extra: React.ComponentProps<"input"> = {}) => (
    <div>
      <Label htmlFor={`biz-${k}`}>{label}</Label>
      <input id={`biz-${k}`} className={input} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} {...extra} />
    </div>
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => updateBusinessInfoAction(v));
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "Business Name", { required: true, maxLength: 100 })}
        {field("phone", "Phone", { type: "tel", maxLength: 30 })}
      </div>
      {field("address", "Address", { maxLength: 200 })}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("website", "Website", { placeholder: "https://yourbusiness.com" })}
        {field("gbpUrl", "Google Business Profile URL", { placeholder: "https://g.page/..." })}
      </div>
      <SaveButton dirty={dirty} pending={pending} />
    </form>
  );
}

export function PasswordForm() {
  const { run, pending, push } = useAction();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm.length > 0 && pw !== confirm;
  return (
    <form
      className="max-w-[370px] space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (pw.length < 8) return push({ kind: "error", text: "Use at least 8 characters." });
        if (pw !== confirm) return push({ kind: "error", text: "The passwords don't match." });
        run(
          () => changePasswordAction(pw, confirm),
          (r) => {
            if (!r?.error) {
              setPw("");
              setConfirm("");
            }
          },
        );
      }}
    >
      <div>
        <Label htmlFor="pw">New Password</Label>
        <input id="pw" type="password" className={input} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" minLength={8} />
        {pw.length > 0 && pw.length < 8 && <p className="mt-1 text-xs text-ink/55">At least 8 characters ({8 - pw.length} more).</p>}
      </div>
      <div>
        <Label htmlFor="pw2">Confirm Password</Label>
        <input id="pw2" type="password" className={clsx(input, mismatch && "!border-red-300")} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        {mismatch && <p className="mt-1 text-xs text-red-600">Passwords don&apos;t match.</p>}
      </div>
      <button type="submit" disabled={pending || !pw || !confirm} className={btn.primary}>
        {pending && <Loader2 className="size-4 animate-spin" />} Update Password
      </button>
    </form>
  );
}
