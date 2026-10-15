import clsx from "clsx";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { whiteLabelRows } from "@/lib/data/agency";
import { whiteLabelMockups } from "@/components/agency/white-label-mockups";

/** "Your brand on everything" — four alternating text/mockup rows. */
export function WhiteLabelSection() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">White-label</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your brand on everything your clients see</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/65 sm:text-xl">
            Set up your agency once (name, logo, domain, email) and every place a client touches carries your brand, not
            ours.
          </p>
        </div>

        <div className="mt-16 space-y-20 lg:space-y-28">
          {whiteLabelRows.map((row, i) => {
            const Mockup = whiteLabelMockups[i];
            const flip = i % 2 === 1;
            return (
              <div key={row.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <Reveal className={clsx(flip && "lg:order-2")}>
                  <Mockup />
                </Reveal>
                <Reveal delay={110}>
                  <h3 className="text-2xl font-bold tracking-tight sm:text-[30px] sm:leading-tight">{row.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink/70">{row.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {row.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-ink/80">
                        <Check className="size-4 shrink-0 text-brand-700" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            );
          })}
        </div>

        <p className="mt-16 text-center">
          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Set up your agency <ArrowRight className="size-[18px]" aria-hidden />
          </Link>
        </p>
      </Container>
    </section>
  );
}
