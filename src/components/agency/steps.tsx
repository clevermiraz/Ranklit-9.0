import { Reveal } from "@/components/reveal";
import { agencySteps } from "@/lib/data/agency";

/** Four numbered steps joined by a gradient line on desktop. */
export function AgencySteps() {
  return (
    <ol className="relative mt-14 grid gap-10 text-center lg:grid-cols-4 lg:gap-6">
      <span
        className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-[3px] rounded-full bg-gradient-to-r from-[#c8a8f5] to-brand-700 lg:block"
        aria-hidden
      />
      {agencySteps.map((step, i) => (
        <li key={step.title} className="relative">
          <Reveal delay={i * 110} className="flex flex-col items-center">
            <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand-700 to-night text-[22px] font-extrabold text-white shadow-[0_0_0_6px_#f9f7fc,0_12px_24px_-10px_rgba(141,62,187,.7)]">
              {i + 1}
            </span>
            <h3 className="mt-5 text-[22px] tracking-tight">{step.title}</h3>
            <p className="mt-2 max-w-[260px] text-ink/65">{step.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
