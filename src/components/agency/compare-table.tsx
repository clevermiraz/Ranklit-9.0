import { Bot, Check, X } from "lucide-react";
import { agencyCompareRows } from "@/lib/data/agency";

/** Ranklit vs. an in-house team. Rows collapse to label-over-two-cells on mobile. */
export function AgencyCompareTable() {
  return (
    <div className="mx-auto max-w-[848px] overflow-hidden rounded-3xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(35,25,56,.05),0_12px_32px_-12px_rgba(35,25,56,.16)]">
      <dl className="grid grid-cols-2 sm:grid-cols-[0.9fr_1.1fr_1fr]">
        <div className="hidden sm:block" aria-hidden />
        <div className="flex items-center gap-2 bg-gradient-to-r from-brand-700 to-night px-4 py-4 text-[15px] font-bold tracking-[0.04em] text-white uppercase sm:h-[60px] sm:px-6 sm:text-base">
          <Bot className="size-5 shrink-0" aria-hidden /> Ranklit
        </div>
        <div className="flex items-center px-4 py-4 text-[15px] font-extrabold tracking-[0.02em] text-ink/55 uppercase sm:h-[60px] sm:px-6 sm:text-base">
          In-house team
        </div>
        {agencyCompareRows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="col-span-2 border-t border-ink/[0.06] px-4 pt-4 pb-1 text-[13px] font-bold tracking-[0.08em] text-ink/45 uppercase sm:col-span-1 sm:flex sm:min-h-[60px] sm:items-center sm:px-6 sm:py-0">
              {row.label}
            </dt>
            <dd className="flex items-center gap-2.5 bg-[#fcdffe]/35 px-4 py-3 font-bold sm:min-h-[60px] sm:border-t sm:border-ink/[0.06] sm:px-6 sm:py-0">
              <Check className="size-4 shrink-0 text-green-600" aria-hidden />
              <span>
                <span className="sr-only">Ranklit: </span>
                {row.us}
              </span>
            </dd>
            <dd className="flex items-center gap-2.5 px-4 py-3 text-ink/55 sm:min-h-[60px] sm:border-t sm:border-ink/[0.06] sm:px-6 sm:py-0">
              <X className="size-3.5 shrink-0 text-red-500" aria-hidden />
              <span>
                <span className="sr-only">In-house team: </span>
                {row.them}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
