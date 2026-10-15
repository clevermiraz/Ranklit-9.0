import { Check, Grid2x2, Link2, Search, Sparkles, Star } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

const meetItems = [
  { icon: Sparkles, label: "Posts on your Google profile", freq: "3× a week", tone: "bg-brand-400/20 text-brand-200" },
  { icon: Star, label: "Replies to your reviews", freq: "As they come in", tone: "bg-amber-400/15 text-amber-300" },
  { icon: Link2, label: "Lists you on other sites", freq: "500+ in month one", tone: "bg-emerald-400/15 text-emerald-300" },
  { icon: Grid2x2, label: "Tracks your rank on the map", freq: "Every week", tone: "bg-white/10 text-white/80" },
  { icon: Search, label: "Checks your profile for problems", freq: "Every month", tone: "bg-rose-400/15 text-rose-300" },
];

export function MeetAgent({
  title = "Google rewards active businesses.",
  highlight = "Your agent keeps you active.",
  intro = "Most owners don't have time to post, reply, and fix listings every week. Your AI agent does it for you. You run your business.",
  eyebrow = "Meet your AI agent",
  aside,
}: {
  title?: string;
  highlight?: string;
  intro?: string;
  eyebrow?: string;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-night py-24 sm:py-28">
      <div className="bg-grid-dark absolute inset-0" aria-hidden />
      <div className="absolute right-0 bottom-0 size-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-brand-700/40 blur-[140px]" aria-hidden />
      <Container className="relative grid items-center gap-14 lg:grid-cols-2">
        <SectionHeading
          align="left"
          dark
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          intro={intro}
        />
        {aside && <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">{aside}</div>}
        <ul className={aside ? "space-y-3 lg:col-start-1 lg:row-start-2" : "space-y-3"}>
          {meetItems.map((item, i) => (
            <Reveal key={item.label} delay={i * 80}>
              <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur">
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${item.tone}`}>
                  <item.icon className="size-4" />
                </span>
                <span className="flex-1 font-semibold text-white">{item.label}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white/85">{item.freq}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function AccountManager() {
  const points = [
    "Every customer gets a real account manager — an experienced local SEO specialist who oversees your agent.",
    "You get automation plus human oversight. You pay the low cost of software, and specialists check the work.",
    "Our team already manages hundreds of Google Business Profiles.",
  ];
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Account manager" title="A real person oversees your Ranklit agent." className="max-w-4xl" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p} delay={i * 80}>
              <div className="flex h-full gap-3 rounded-3xl border border-ink/[0.06] bg-white p-6 text-[15px] leading-relaxed text-ink/70 shadow-card">
                <Check className="mt-0.5 size-4 shrink-0 text-brand-600" />
                {p}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-6 max-w-3xl rounded-3xl border border-brand-200 bg-brand-50 px-6 py-6 text-center text-lg leading-relaxed text-ink/75">
          Want help getting started?{" "}
          <a href={site.bookingUrl} target="_blank" rel="noreferrer" className="font-bold text-brand-700 underline underline-offset-2">
            Book an optional onboarding call
            <span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          with your account manager. Or skip it and we&apos;ll set everything up for you.
        </Reveal>
      </Container>
    </section>
  );
}

