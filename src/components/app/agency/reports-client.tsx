"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Check,
  Copy,
  Eye,
  FileText,
  Loader2,
  Palette,
  Printer,
  Sparkles,
  X,
} from "lucide-react";
import { Card, PageHeader, btn, input } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";
import { generateClientReportAction } from "@/app/actions/agency";
import type { AgencyBranding, ClientReport } from "@/lib/server/agency-store";

export function AgencyReportsView({
  branding,
  businesses,
  reports,
}: {
  branding: AgencyBranding;
  businesses: { id: string; name: string }[];
  reports: ClientReport[];
}) {
  const { run, pending } = useAction();
  const [selectedBiz, setSelectedBiz] = useState(businesses[0]?.id || "");
  const [selectedPeriod, setSelectedPeriod] = useState("September 2026");
  const [viewingReport, setViewingReport] = useState<ClientReport | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const periods = [
    "September 2026",
    "August 2026",
    "July 2026",
    "June 2026",
    "May 2026",
  ];

  const generateReport = () => {
    if (!selectedBiz) return;
    run(() => generateClientReportAction(selectedBiz, selectedPeriod));
  };

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/dashboard/reports?view=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-[940px] space-y-6">
      <PageHeader
        title="Client Reports"
        subtitle="White-label monthly SEO performance reports for your clients."
        actions={
          <Link href="/dashboard/agency/branding" className={btn.outline}>
            <Palette className="size-4" /> Branding
          </Link>
        }
      />

      {/* Generator Toolbar Card */}
      <Card className="flex flex-wrap items-center justify-between gap-4 bg-[#fbf9fe]">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-ink/60">Select client</label>
            <select
              value={selectedBiz}
              onChange={(e) => setSelectedBiz(e.target.value)}
              className={clsx(input, "mt-1 h-9 text-xs")}
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink/60">Report period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={clsx(input, "mt-1 h-9 text-xs")}
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          disabled={pending || !selectedBiz}
          onClick={generateReport}
          className={clsx(btn.primary, "mt-auto")}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          Generate report
        </button>
      </Card>

      {/* Reports List */}
      <Card>
        <div className="border-b border-[#f0ebf6] pb-3">
          <h2 className="text-base font-bold text-ink">Generated reports</h2>
          <p className="mt-0.5 text-xs text-ink/60">Download, view, or share reports directly with your clients.</p>
        </div>

        {reports.length === 0 ? (
          <div className="py-12 text-center text-xs text-ink/50">
            No reports generated yet. Select a client and period above to generate your first report.
          </div>
        ) : (
          <div className="mt-3 divide-y divide-[#f7f4fb]">
            {reports.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#f3e8fb] text-brand-700">
                    <FileText className="size-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-ink">{r.businessName}</p>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {r.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink/50">
                      {r.period} · Generated {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Metrics preview */}
                <div className="flex items-center gap-4 text-xs font-semibold text-ink">
                  <div className="text-right">
                    <p className="text-emerald-700">#{r.metrics.avgRank} Avg Rank</p>
                    <p className="text-[10px] text-ink/50">{r.metrics.top3Percent}% in top 3</p>
                  </div>
                  <div className="text-right">
                    <p>{r.metrics.calls} Calls</p>
                    <p className="text-[10px] text-ink/50">{r.metrics.citationsLive} citations</p>
                  </div>

                  <div className="flex items-center gap-1.5 pl-2">
                    <button
                      type="button"
                      onClick={() => setViewingReport(r)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#ece6f4] px-2.5 py-1 text-xs font-semibold text-ink hover:border-brand-300 hover:text-brand-700"
                    >
                      <Eye className="size-3.5" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => copyShareLink(r.id)}
                      className="rounded-lg border border-[#ece6f4] p-1.5 text-ink/60 hover:text-ink"
                      title="Copy report link"
                    >
                      {copiedId === r.id ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Report Modal Viewer */}
      {viewingReport && (
        <ReportViewerModal
          report={viewingReport}
          branding={branding}
          onClose={() => setViewingReport(null)}
        />
      )}
    </div>
  );
}

function ReportViewerModal({
  report,
  branding,
  onClose,
}: {
  report: ClientReport;
  branding: AgencyBranding;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-[#ece6f4] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f0ebf6] pb-3">
          <div className="flex items-center gap-2">
            <span
              className="grid size-6 place-items-center rounded text-xs font-bold text-white"
              style={{ backgroundColor: branding.primaryColor }}
            >
              {branding.clientAppName[0]}
            </span>
            <span className="font-bold text-sm text-ink">{branding.clientAppName}</span>
            <span className="text-xs text-ink/40">· Monthly SEO Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 rounded-lg border border-[#ece6f4] px-2 py-1 text-xs font-semibold text-ink/70 hover:bg-ink/5"
            >
              <Printer className="size-3.5" /> Print / PDF
            </button>
            <button type="button" onClick={onClose} className="rounded-lg p-1 text-ink/50 hover:bg-ink/5">
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black text-ink">{report.businessName}</h2>
            <p className="text-xs text-ink/60">
              Local SEO Performance Summary · {report.period}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[#ece6f4] bg-[#faf8fc] p-3 text-center">
              <p className="text-[10px] font-semibold text-ink/50">Google Rating</p>
              <p className="mt-1 text-2xl font-black text-ink">{report.metrics.rating.toFixed(1)} ★</p>
              <p className="text-[10px] text-ink/40">{report.metrics.totalReviews} reviews</p>
            </div>
            <div className="rounded-xl border border-[#ece6f4] bg-[#faf8fc] p-3 text-center">
              <p className="text-[10px] font-semibold text-ink/50">Map Rank</p>
              <p className="mt-1 text-2xl font-black text-emerald-700">#{report.metrics.avgRank}</p>
              <p className="text-[10px] text-ink/40">{report.metrics.top3Percent}% in top 3</p>
            </div>
            <div className="rounded-xl border border-[#ece6f4] bg-[#faf8fc] p-3 text-center">
              <p className="text-[10px] font-semibold text-ink/50">Phone Calls</p>
              <p className="mt-1 text-2xl font-black text-ink">{report.metrics.calls}</p>
              <p className="text-[10px] text-ink/40">From Google Maps</p>
            </div>
            <div className="rounded-xl border border-[#ece6f4] bg-[#faf8fc] p-3 text-center">
              <p className="text-[10px] font-semibold text-ink/50">Citations Live</p>
              <p className="mt-1 text-2xl font-black text-ink">{report.metrics.citationsLive}</p>
              <p className="text-[10px] text-ink/40">Directories built</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#ece6f4] p-4 text-xs space-y-2">
            <p className="font-bold text-ink">Executive Highlights</p>
            <p className="text-ink/70 leading-relaxed">
              During {report.period}, {report.businessName} saw strong visibility gains across local Google search.
              Reviews climbed, high-authority citations were published by hand, and map rankings reached top-tier
              visibility in the local pack.
            </p>
          </div>

          <div className="rounded-xl bg-[#faf6fe] p-4 text-center text-xs">
            <p className="font-semibold text-brand-900">
              Report prepared by {branding.clientAppName}
            </p>
            <p className="text-[11px] text-brand-700/70">
              Questions? Reach out to your agency partner at {branding.replyToEmail}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className={btn.primary}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
