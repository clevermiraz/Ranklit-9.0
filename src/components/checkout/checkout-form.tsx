"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft, ChevronDown, CreditCard, Loader2, Mail, Minus, Plus, X } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { startTrial } from "@/app/actions/checkout";
import { getCheckoutPlan, MAX_CHECKOUT_LOCATIONS, periodPrice, type Interval } from "@/lib/pricing";

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const TRIAL_DAYS = 3;

function luhnOk(num: string) {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function expiryOk(v: string) {
  const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};

type Errors = Partial<Record<"email" | "card" | "name" | "form", string>>;

export function CheckoutForm() {
  const params = useSearchParams();
  const plan = getCheckoutPlan(params.get("plan")) ?? getCheckoutPlan("foundation")!;
  const interval: Interval = params.get("interval") === "annual" ? "annual" : "monthly";
  const [locations, setLocations] = useState(() =>
    Math.min(MAX_CHECKOUT_LOCATIONS, Math.max(1, Number(params.get("locations")) || 1)),
  );
  const [qtyOpen, setQtyOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoError, setPromoError] = useState("");

  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("United States");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, startTransition] = useTransition();

  const due = periodPrice(plan, interval, locations);
  const per = interval === "annual" ? "year" : "month";
  const [startDate] = useState(() =>
    new Date(Date.now() + TRIAL_DAYS * 864e5).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  );
  const productName = `Ranklit — ${plan.name} Subscription`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = email ? "Your email address is invalid." : "Required";
    if (!card && !expiry && !cvc) next.card = "Required";
    else if (!luhnOk(card)) next.card = "Your card number is invalid.";
    else if (!expiryOk(expiry)) next.card = "Your card's expiration date is invalid or in the past.";
    else if (!/^\d{3,4}$/.test(cvc)) next.card = "Your card's security code is incomplete.";
    if (!name.trim()) next.name = "Required";
    setErrors(next);
    if (Object.keys(next).length) return;

    startTransition(async () => {
      const res = await startTrial({ email, plan: plan.id, interval, locations });
      if (res?.error) setErrors({ form: res.error });
    });
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Order summary */}
      <section className="bg-brand-700 px-6 py-10 text-white sm:px-12 lg:py-[200px]">
        <div className="mx-auto max-w-[380px] lg:mr-20">
          <Link href="/pricing?checkout=canceled" className="flex items-center gap-2 text-[15px] text-white/90 hover:text-white">
            <ArrowLeft className="size-4 text-white/60" />
            <span className="grid size-7 place-items-center rounded-full bg-night">
              <LogoMark className="size-4" />
            </span>
            Ranklit
          </Link>
          <p className="mt-8 text-white/80">Try {productName.replace(" — ", " — ")}</p>
          <p className="mt-1 text-4xl font-semibold">{TRIAL_DAYS} days free</p>
          <p className="mt-1 text-sm text-white/85">
            Then <strong>{money(due)}</strong> per {per} starting {startDate}
          </p>

          <div className="mt-10 flex items-start justify-between gap-4 text-sm">
            <div>
              <p className="font-medium">{productName}</p>
              <button
                type="button"
                onClick={() => setQtyOpen(true)}
                className="mt-1 inline-flex items-center gap-1 rounded bg-white/15 px-1.5 py-0.5 text-xs font-medium hover:bg-white/25"
              >
                Qty {locations} <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="text-right">
              <p className="font-medium">{TRIAL_DAYS} days free</p>
              <p className="mt-1 text-xs text-white/75">
                {money(due)} / {per} after
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-white/20 pt-4 text-sm">
            <p className="flex justify-between font-medium">
              <span>Subtotal</span> <span>{money(due)}</span>
            </p>
            {promoOpen ? (
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setPromoError(promo.trim() ? "This code is invalid." : "Enter a code.");
                }}
              >
                <input
                  value={promo}
                  onChange={(e) => {
                    setPromo(e.target.value);
                    setPromoError("");
                  }}
                  placeholder="Add promotion code"
                  autoFocus
                  className="h-10 flex-1 rounded-md bg-white/15 px-3 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/60"
                />
                <button className="rounded-md bg-white/20 px-3 font-medium hover:bg-white/30">Apply</button>
              </form>
            ) : (
              <button type="button" onClick={() => setPromoOpen(true)} className="mt-3 rounded-md bg-white/15 px-3 py-2 font-medium hover:bg-white/25">
                Add promotion code
              </button>
            )}
            {promoError && <p className="mt-2 text-xs text-white">{promoError}</p>}
          </div>
          <div className="mt-4 space-y-1 border-t border-white/20 pt-4 text-sm">
            <p className="flex justify-between">
              <span>Total after trial</span> <span>{money(due)}</span>
            </p>
            <p className="flex justify-between text-base font-semibold">
              <span>Total due today</span> <span>{money(0)}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Payment details */}
      <section className="bg-white px-6 py-10 sm:px-12 lg:py-[200px]">
        <form onSubmit={submit} noValidate className="mx-auto max-w-[380px] lg:ml-20">
          <h1 className="text-xl font-medium">Enter payment details</h1>

          <FieldLabel label="Contact details" error={errors.email} />
          <div className={clsx("flex items-center rounded-md border shadow-sm", errors.email ? "border-red-500" : "border-ink/15")}>
            <Mail className="ml-3 size-4 text-ink/40" />
            <input
              type="email"
              autoComplete="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md px-2.5 text-[15px] outline-none"
              aria-label="Email"
            />
          </div>
          {errors.email && errors.email !== "Required" && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}

          <p className="mt-6 text-[15px] font-medium">Payment method</p>
          <div className="mt-2 rounded-md border border-ink/15 p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="size-4" /> Card
            </p>
            <FieldLabel label="Card information" error={errors.card} />
            <div className={clsx("rounded-md border", errors.card ? "border-red-500" : "border-ink/15")}>
              <input
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 1234 1234 1234"
                value={card}
                onChange={(e) => setCard(formatCard(e.target.value))}
                className="h-10 w-full rounded-t-md border-b border-ink/10 px-3 text-[15px] outline-none"
                aria-label="Card number"
              />
              <div className="grid grid-cols-2">
                <input
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="h-10 border-r border-ink/10 px-3 text-[15px] outline-none"
                  aria-label="Expiration date"
                />
                <input
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="CVC"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="h-10 px-3 text-[15px] outline-none"
                  aria-label="Security code"
                />
              </div>
            </div>
            {errors.card && errors.card !== "Required" && <p className="mt-1 text-xs text-red-600">{errors.card}</p>}

            <FieldLabel label="Cardholder name" error={errors.name} />
            <input
              autoComplete="cc-name"
              placeholder="Full name on card"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={clsx("h-10 w-full rounded-md border px-3 text-[15px] outline-none", errors.name ? "border-red-500" : "border-ink/15")}
              aria-label="Cardholder name"
            />

            <FieldLabel label="Country or region" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-10 w-full rounded-md border border-ink/15 bg-white px-3 text-[15px] outline-none"
              aria-label="Country or region"
            >
              {["United States", "Canada", "United Kingdom", "Australia", "New Zealand", "Ireland", "Bangladesh", "India", "Germany", "Other"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {errors.form && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-md bg-night text-[17px] font-medium text-white hover:bg-ink disabled:opacity-70"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? "Processing…" : "Start trial"}
          </button>
          <p className="mt-4 text-center text-[13px] text-ink/60">
            By subscribing, you authorize Ranklit to charge you according to the terms until you cancel.
          </p>
          <p className="mt-6 text-center text-xs text-ink/45">
            Test mode · use card 4242 4242 4242 4242, any future date and any CVC ·{" "}
            <Link href="/terms" className="hover:text-ink">Terms</Link> ·{" "}
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          </p>
        </form>
      </section>

      {qtyOpen && (
        <QuantityModal
          productName={productName}
          initial={locations}
          onClose={() => setQtyOpen(false)}
          onSave={(n) => {
            setLocations(n);
            setQtyOpen(false);
          }}
        />
      )}
    </div>
  );
}

function FieldLabel({ label, error }: { label: string; error?: string }) {
  return (
    <p className="mt-5 mb-1.5 flex justify-between text-sm text-ink/70">
      {label}
      {error === "Required" && <span className="text-xs font-semibold tracking-wide text-red-600 uppercase">Required</span>}
    </p>
  );
}

function QuantityModal({
  productName,
  initial,
  onClose,
  onSave,
}: {
  productName: string;
  initial: number;
  onClose: () => void;
  onSave: (n: number) => void;
}) {
  const [qty, setQty] = useState(String(initial));
  const n = Math.min(MAX_CHECKOUT_LOCATIONS, Math.max(1, Number(qty) || 1));
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal aria-labelledby="qty-title" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 id="qty-title" className="text-lg font-semibold">Update quantity</h2>
            <p className="text-sm text-ink/60">{productName}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink/50 hover:text-ink">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button type="button" aria-label="decrease quantity" onClick={() => setQty(String(Math.max(1, n - 1)))} className="grid size-10 place-items-center rounded-md border border-ink/15 hover:bg-canvas">
            <Minus className="size-4" />
          </button>
          <input
            value={qty}
            onChange={(e) => setQty(e.target.value.replace(/\D/g, "").slice(0, 2))}
            className="h-10 w-16 rounded-md border border-ink/15 text-center outline-none focus:border-brand-600"
            aria-label="Quantity"
            inputMode="numeric"
          />
          <button type="button" aria-label="increase quantity" onClick={() => setQty(String(Math.min(MAX_CHECKOUT_LOCATIONS, n + 1)))} className="grid size-10 place-items-center rounded-md border border-ink/15 hover:bg-canvas">
            <Plus className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-ink/50">One per location. Growth rates drop at 5 and 15 locations.</p>
        <button type="button" onClick={() => onSave(n)} className="mt-5 h-11 w-full rounded-md bg-night font-medium text-white hover:bg-ink">
          Update
        </button>
      </div>
    </div>
  );
}
