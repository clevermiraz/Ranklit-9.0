"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  Camera,
  Check,
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import { Card, CardHeader, PageHeader, btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import {
  updateAgencyEmailSettingsAction,
  sendClientEmailPreviewAction,
} from "@/app/actions/agency";
import type { AgencyEmailSettings } from "@/lib/server/agency-store";

export function AgencyEmailsView({ emails }: { emails: AgencyEmailSettings }) {
  const { run, pending } = useAction();

  const [scheduledEnabled, setScheduledEnabled] = useState(emails.scheduledEmailsEnabled);
  const [frequency, setFrequency] = useState(emails.digestFrequency);
  const [subjectTemplate, setSubjectTemplate] = useState(emails.digestSubjectTemplate);
  const [digestMsg, setDigestMsg] = useState(emails.digestCustomMessage);

  const [photoEnabled, setPhotoEnabled] = useState(emails.photoNudgesEnabled);
  const [photoMsg, setPhotoMsg] = useState(emails.photoNudgeMessage);

  const [reviewEnabled, setReviewEnabled] = useState(emails.reviewNudgesEnabled);
  const [reviewMsg, setReviewMsg] = useState(emails.reviewNudgeMessage);

  const [previewSent, setPreviewSent] = useState<string | null>(null);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    run(() =>
      updateAgencyEmailSettingsAction({
        scheduledEmailsEnabled: scheduledEnabled,
        digestFrequency: frequency,
        digestSubjectTemplate: subjectTemplate,
        digestCustomMessage: digestMsg,
        photoNudgesEnabled: photoEnabled,
        photoNudgeMessage: photoMsg,
        reviewNudgesEnabled: reviewEnabled,
        reviewNudgeMessage: reviewMsg,
      }),
    );
  };

  const sendPreview = (type: "digest" | "photo" | "review") => {
    run(
      () => sendClientEmailPreviewAction(type),
      (res) => {
        if (!res?.error) {
          setPreviewSent(type);
          setTimeout(() => setPreviewSent(null), 3000);
        }
      },
    );
  };

  return (
    <div className="mx-auto max-w-[940px] space-y-6">
      <PageHeader
        title="Client emails"
        subtitle="Everything your clients receive from you: turn each type on or off, set the wording, and send yourself a preview before it goes out."
      />

      <form onSubmit={saveSettings} className="space-y-6">
        {/* Master Scheduled Emails Card */}
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">Scheduled emails to clients</h2>
            <p className="mt-0.5 text-xs text-ink/60">
              {scheduledEnabled
                ? "On. Each client gets updates on the schedule you set for them, plus any nudges below."
                : "Paused. No automatic client emails will be dispatched."}
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={scheduledEnabled}
              onChange={(e) => setScheduledEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="h-6 w-11 rounded-full bg-ink/20 peer-checked:bg-brand-700 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
          </label>
        </Card>

        {/* Placeholders note */}
        <div className="flex items-center gap-2 rounded-xl border border-brand-200/70 bg-[#faf6fe] px-3.5 py-2.5 text-xs text-brand-900">
          <Info className="size-4 shrink-0 text-brand-700" />
          <p>
            Available placeholders: <code className="font-mono font-bold">{"{{client_name}}"}</code>,{" "}
            <code className="font-mono font-bold">{"{{business_name}}"}</code>,{" "}
            <code className="font-mono font-bold">{"{{agency_name}}"}</code>,{" "}
            <code className="font-mono font-bold">{"{{dashboard_url}}"}</code>
          </p>
        </div>

        {/* 1. Digest Emails Card */}
        <Card>
          <div className="flex items-start justify-between border-b border-[#f0ebf6] pb-4">
            <CardHeader
              title="Digest emails"
              description="Periodic updates showing your clients how their business is performing on Google Maps."
              icon={Mail}
              tone="purple"
            />
            <button
              type="button"
              onClick={() => sendPreview("digest")}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#ece6f4] px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-brand-200 hover:text-brand-700"
            >
              {previewSent === "digest" ? <Check className="size-3 text-emerald-600" /> : <Send className="size-3" />}
              {previewSent === "digest" ? "Sent!" : "Send preview"}
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-ink/80">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as "weekly" | "biweekly" | "monthly")}
                className={clsx(input, "mt-1 h-9 max-w-xs text-xs")}
              >
                <option value="weekly">Weekly (recommended)</option>
                <option value="biweekly">Every 2 weeks</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/80">Subject line</label>
              <input
                type="text"
                value={subjectTemplate}
                onChange={(e) => setSubjectTemplate(e.target.value)}
                className={clsx(input, "mt-1 text-xs")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/80">Custom intro message</label>
              <textarea
                rows={3}
                value={digestMsg}
                onChange={(e) => setDigestMsg(e.target.value)}
                className={clsx(input, "mt-1 h-auto text-xs py-2")}
              />
              <p className="mt-1 text-[11px] text-ink/45">Blank uses our default wording shown in grey.</p>
            </div>
          </div>
        </Card>

        {/* 2. Photo Nudges Card */}
        <Card>
          <div className="flex items-start justify-between border-b border-[#f0ebf6] pb-4">
            <CardHeader
              title="Photo nudges"
              description="Asks clients for new photos when their Google profile hasn't had a new upload in a while."
              icon={Camera}
              tone="amber"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => sendPreview("photo")}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#ece6f4] px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-brand-200 hover:text-brand-700"
              >
                {previewSent === "photo" ? <Check className="size-3 text-emerald-600" /> : <Send className="size-3" />}
                {previewSent === "photo" ? "Sent!" : "Send preview"}
              </button>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={photoEnabled}
                  onChange={(e) => setPhotoEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="h-5 w-9 rounded-full bg-ink/20 peer-checked:bg-brand-700 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <div className="mt-4 text-xs">
            <label className="block text-xs font-semibold text-ink/80">Nudge message</label>
            <textarea
              rows={3}
              value={photoMsg}
              onChange={(e) => setPhotoMsg(e.target.value)}
              className={clsx(input, "mt-1 h-auto text-xs py-2")}
            />
          </div>
        </Card>

        {/* 3. Review Nudges Card */}
        <Card>
          <div className="flex items-start justify-between border-b border-[#f0ebf6] pb-4">
            <CardHeader
              title="Review nudges"
              description="Asks clients to encourage more customer reviews when incoming reviews have slowed down."
              icon={MessageSquare}
              tone="green"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => sendPreview("review")}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#ece6f4] px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-brand-200 hover:text-brand-700"
              >
                {previewSent === "review" ? <Check className="size-3 text-emerald-600" /> : <Send className="size-3" />}
                {previewSent === "review" ? "Sent!" : "Send preview"}
              </button>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={reviewEnabled}
                  onChange={(e) => setReviewEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="h-5 w-9 rounded-full bg-ink/20 peer-checked:bg-brand-700 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <div className="mt-4 text-xs">
            <label className="block text-xs font-semibold text-ink/80">Nudge message</label>
            <textarea
              rows={3}
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              className={clsx(input, "mt-1 h-auto text-xs py-2")}
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={pending} className={btn.primary}>
            {pending && <Loader2 className="size-4 animate-spin" />} Save email settings
          </button>
        </div>
      </form>
    </div>
  );
}
