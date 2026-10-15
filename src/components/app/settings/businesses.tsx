"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRightLeft, Loader2, MapPin, Pencil, Star, Tag, XCircle } from "lucide-react";
import { switchBusinessAction } from "@/app/actions/app";
import { addBusinessAction, cancelLocationAction, editBusinessAction } from "@/app/actions/settings";
import { Label, btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import { Modal } from "./modal";

type Biz = { id: string; name: string; address: string; category: string; kind: string };

export function AddBusinessButton() {
  const { run, pending } = useAction();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const close = () => {
    setOpen(false);
    setName("");
    setAddress("");
  };
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btn.primary}>
        <span className="grid size-5 place-items-center rounded-full bg-white text-[11px] font-extrabold text-brand-700">G</span> Add a business
      </button>
      <Modal
        open={open}
        onClose={close}
        title="Add a business"
        description="Every business is fully covered by your subscription. Once added, the dashboard switches to it so you can finish setting it up."
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => addBusinessAction(name, address), (r) => !r?.error && close());
          }}
        >
          <div>
            <Label htmlFor="nb-name">Business name</Label>
            <input id="nb-name" className={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required placeholder="e.g. Avery Plumbing — Boulder" />
          </div>
          <div>
            <Label htmlFor="nb-address">Address</Label>
            <input id="nb-address" className={input} value={address} onChange={(e) => setAddress(e.target.value)} maxLength={200} required placeholder="Street, City, State ZIP" />
            <p className="mt-1 text-xs text-ink/55">Use the address shown on your Google Business Profile.</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={btn.outline} onClick={close}>
              Cancel
            </button>
            <button type="submit" className={btn.primary} disabled={pending || !name.trim() || !address.trim()}>
              {pending && <Loader2 className="size-4 animate-spin" />} Add business
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function BusinessCard({ biz, current, onlyOne }: { biz: Biz; current: boolean; onlyOne: boolean }) {
  const { run, pending } = useAction();
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({ name: biz.name, address: biz.address, category: biz.category });

  return (
    <div className={clsx("rounded-2xl border p-5", current ? "border-brand-400 bg-[#f6edfc]" : "border-[#ece6f4] bg-white")}>
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-[17px] font-bold">{biz.name}</span>
            {current && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                <Star className="size-3.5 fill-brand-700" /> Currently viewing
              </span>
            )}
            <span className="text-xs text-ink/50">{biz.kind}</span>
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink/65">
            <MapPin className="size-3.5 shrink-0" /> {biz.address || "No address yet"}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink/65">
            <Tag className="size-3.5 shrink-0" /> {biz.category}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!current && (
            <button type="button" disabled={pending} onClick={() => run(() => switchBusinessAction(biz.id))} className={clsx(btn.primary, btn.sm)}>
              <ArrowRightLeft className="size-3.5" /> Switch to
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setForm({ name: biz.name, address: biz.address, category: biz.category });
              setEdit(true);
            }}
            className={clsx(btn.outline, btn.sm)}
          >
            <Pencil className="size-3.5" /> Edit
          </button>
          <button type="button" onClick={() => setConfirm(true)} className={clsx(btn.danger, btn.sm, "bg-red-50/60")}>
            <XCircle className="size-3.5" /> Cancel location
          </button>
        </div>
      </div>

      <Modal open={edit} onClose={() => setEdit(false)} title={`Edit ${biz.name}`}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => editBusinessAction(biz.id, form), (r) => !r?.error && setEdit(false));
          }}
        >
          <div>
            <Label htmlFor={`e-name-${biz.id}`}>Business name</Label>
            <input id={`e-name-${biz.id}`} className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
          </div>
          <div>
            <Label htmlFor={`e-addr-${biz.id}`}>Address</Label>
            <input id={`e-addr-${biz.id}`} className={input} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required maxLength={200} />
          </div>
          <div>
            <Label htmlFor={`e-cat-${biz.id}`}>Primary category</Label>
            <input id={`e-cat-${biz.id}`} className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} maxLength={80} placeholder="e.g. Plumber" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={btn.outline} onClick={() => setEdit(false)}>
              Cancel
            </button>
            <button type="submit" className={btn.primary} disabled={pending || !form.name.trim() || !form.address.trim()}>
              {pending && <Loader2 className="size-4 animate-spin" />} Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        title={onlyOne ? "This is your only business" : `Cancel ${biz.name}?`}
        description={
          onlyOne
            ? "You can't remove your last business. To stop everything, cancel your subscription on Plans & Credits."
            : "Your bot stops posting, replying, scanning and building citations for this location, and its reports are removed from your dashboard."
        }
        footer={
          onlyOne ? (
            <>
              <button type="button" className={btn.outline} onClick={() => setConfirm(false)}>
                Close
              </button>
              <Link href="/settings/plans#billing" className={btn.primary}>
                Go to Plans &amp; Credits
              </Link>
            </>
          ) : (
            <>
              <button type="button" className={btn.outline} onClick={() => setConfirm(false)}>
                Keep it
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => cancelLocationAction(biz.id), (r) => !r?.error && setConfirm(false))}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {pending && <Loader2 className="size-4 animate-spin" />} Cancel location
              </button>
            </>
          )
        }
      />
    </div>
  );
}
