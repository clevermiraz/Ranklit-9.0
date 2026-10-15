"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2, Lock } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/reviews";
import { ReviewPageCard, type ReviewPageLook } from "./review-page-card";

type Step = "rate" | "google" | "feedback" | "done";

const field =
  "w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-[#1f1a2b] outline-none transition placeholder:text-black/35 focus:border-black/30 focus:ring-4 focus:ring-black/5";

export function PublicReviewFlow({ slug, look, prompt, googleUrl, sendAllToGoogle }: { slug: string; look: ReviewPageLook; prompt: string; googleUrl: string; sendAllToGoogle: boolean }) {
  const [rating, setRating] = useState(0);
  const [step, setStep] = useState<Step>("rate");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const rate = (n: number) => {
    if (step === "done") return;
    setRating(n);
    setError(null);
    setStep(n >= 4 || sendAllToGoogle ? "google" : "feedback");
  };

  const submit = () =>
    start(async () => {
      const r = await submitFeedbackAction({ slug, rating, name, contact, text });
      if (r.error) setError(r.error);
      else {
        setError(null);
        setStep("done");
      }
    });

  const accentBtn = "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60";

  return (
    <ReviewPageCard look={look} rating={rating} onRate={step === "done" ? undefined : rate}>
      {step === "rate" && <p className="mt-4 text-xs text-black/40">1 = not great · 5 = amazing</p>}

      {step === "google" && (
        <div className="animate-fade-up mt-6 [animation-duration:250ms]">
          <p className="text-lg font-bold">{rating >= 4 ? "Thanks! That made our day." : "Thanks for letting us know."}</p>
          <p className="mt-1 text-sm text-black/55">
            {rating >= 4 ? `Would you share it on Google? It takes 30 seconds and helps neighbours find ${look.name}.` : `You can leave your review for ${look.name} on Google.`}
          </p>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={`${accentBtn} mt-5`} style={{ background: look.accent }}>
            <GoogleG /> Leave it on Google <ExternalLink className="size-4 opacity-80" />
          </a>
          <button type="button" onClick={() => {
              setRating(0);
              setStep("rate");
            }} className="mt-3 inline-flex items-center gap-1 text-xs text-black/45 hover:text-black/70">
            <ArrowLeft className="size-3" /> Change my rating
          </button>
        </div>
      )}

      {step === "feedback" && (
        <form
          className="animate-fade-up mt-6 space-y-3 text-left [animation-duration:250ms]"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label htmlFor="fb-text" className="block text-sm font-semibold">
            {prompt}
          </label>
          <textarea
            id="fb-text"
            required
            minLength={3}
            maxLength={2000}
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`${field} min-h-28 py-2.5`}
            placeholder="What happened, and what could we have done better?"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={`${field} h-10`} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" aria-label="Your name" />
            <input className={`${field} h-10`} value={contact} maxLength={120} onChange={(e) => setContact(e.target.value)} placeholder="Email or phone (optional)" aria-label="Email or phone" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={pending || text.trim().length < 3} className={accentBtn} style={{ background: look.accent }}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />} Send privately
          </button>
          <p className="text-center text-xs text-black/45">
            This goes privately to the owner.{" "}
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black/70">
              Prefer to post a public Google review?
            </a>
          </p>
        </form>
      )}

      {step === "done" && (
        <div className="animate-fade-up mt-6 [animation-duration:250ms]">
          <CheckCircle2 className="mx-auto size-10" style={{ color: look.accent }} />
          <p className="mt-2 text-lg font-bold">Thank you — we&apos;re on it.</p>
          <p className="mt-1 text-sm text-black/55">Your feedback went straight to the owner of {look.name}. If you left your contact details, expect to hear back soon.</p>
        </div>
      )}
    </ReviewPageCard>
  );
}

function GoogleG() {
  return (
    <span className="grid size-6 place-items-center rounded-full bg-white">
      <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
    </span>
  );
}
