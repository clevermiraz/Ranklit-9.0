"use client";

import { useState } from "react";
import { Loader2, RotateCw, Sparkles } from "lucide-react";
import { generateStrategyAction } from "@/app/actions/autopilot";
import { Label, btn, input, textarea } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import { Modal } from "@/components/app/settings/modal";

export function StrategyActions({
  hasStrategy,
  defaults,
}: {
  hasStrategy: boolean;
  defaults: { services: string; customer: string; area: string };
}) {
  const { run, pending } = useAction();
  const [confirm, setConfirm] = useState(false);
  const [interview, setInterview] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(defaults);

  const generate = () => run(() => generateStrategyAction(), () => setConfirm(false));
  const questions = [
    { key: "services", q: "What services do you want more of?", hint: "Separate with commas — e.g. drain cleaning, water heaters.", long: true },
    { key: "customer", q: "Who is your ideal customer?", hint: "One sentence. Who is this for?", long: true },
    { key: "area", q: "Which town or area do you serve?", hint: "We'll build local keywords around it.", long: false },
  ] as const;
  const current = questions[step];
  const value = answers[current.key];

  const openInterview = () => {
    setAnswers(defaults);
    setStep(0);
    setInterview(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={pending} onClick={() => (hasStrategy ? setConfirm(true) : generate())} className={btn.primary}>
          {pending && !interview && !confirm ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Let Ranklit set it
        </button>
        <button type="button" disabled={pending} onClick={openInterview} className={btn.outline}>
          <RotateCw className="size-4" /> Re-run interview
        </button>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Let Ranklit set your strategy?"
        description="We'll build keywords, your customer, services, differentiators and competitors from your Google profile. This replaces what's here now."
        size="sm"
        footer={
          <>
            <button type="button" className={btn.outline} onClick={() => setConfirm(false)}>
              Keep mine
            </button>
            <button type="button" className={btn.primary} disabled={pending} onClick={generate}>
              {pending && <Loader2 className="size-4 animate-spin" />} Replace my strategy
            </button>
          </>
        }
      />

      <Modal
        open={interview}
        onClose={() => setInterview(false)}
        title="Strategy interview"
        description={`Question ${step + 1} of ${questions.length}. Three quick answers and your bot rebuilds the strategy.`}
        footer={
          <>
            {step > 0 && (
              <button type="button" className={btn.outline} onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < questions.length - 1 ? (
              <button type="button" className={btn.primary} disabled={!value.trim()} onClick={() => setStep(step + 1)}>
                Next
              </button>
            ) : (
              <button
                type="button"
                className={btn.primary}
                disabled={pending || !value.trim()}
                onClick={() => run(() => generateStrategyAction(answers), (r) => !r?.error && setInterview(false))}
              >
                {pending && <Loader2 className="size-4 animate-spin" />} Rebuild my strategy
              </button>
            )}
          </>
        }
      >
        <div className="mb-4 flex gap-1.5">
          {questions.map((q, i) => (
            <span key={q.key} className={i <= step ? "h-1 flex-1 rounded-full bg-brand-700" : "h-1 flex-1 rounded-full bg-[#ece6f4]"} />
          ))}
        </div>
        <Label htmlFor={`q-${current.key}`}>{current.q}</Label>
        {current.long ? (
          <textarea
            key={current.key}
            id={`q-${current.key}`}
            rows={3}
            className={textarea}
            value={value}
            onChange={(e) => setAnswers({ ...answers, [current.key]: e.target.value })}
          />
        ) : (
          <input
            key={current.key}
            id={`q-${current.key}`}
            className={input}
            value={value}
            onChange={(e) => setAnswers({ ...answers, [current.key]: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && value.trim() && run(() => generateStrategyAction(answers), (r) => !r?.error && setInterview(false))}
          />
        )}
        <p className="mt-1.5 text-xs text-ink/55">{current.hint}</p>
      </Modal>
    </>
  );
}
