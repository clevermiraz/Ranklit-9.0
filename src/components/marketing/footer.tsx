import Link from "next/link";
import { Logo } from "@/components/logo";
import { ButtonLink, Container } from "@/components/ui";
import { footerNav, site } from "@/lib/site";

function SocialIcon({ name }: { name: "facebook" | "youtube" | "x" }) {
  const paths = {
    facebook:
      "M12 2a10 10 0 0 0-1.56 19.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v7A10 10 0 0 0 12 2z",
    youtube:
      "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z",
    x: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3zm-1.08 16.17h1.7L7.4 4.73H5.58l11.1 14.44z",
  };
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink/[0.06] bg-white">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-5 text-[15px] leading-relaxed text-ink/65">
            The AI agent for your Google Business Profile. It runs your local SEO every week, so you climb higher on
            Google Maps.
          </p>
          <ButtonLink href="/pricing" size="sm" className="mt-6">
            See plans
          </ButtonLink>
          <div className="mt-6 flex gap-4 text-ink/45">
            <a href={site.social.facebook} aria-label="Ranklit on Facebook" className="hover:text-ink" target="_blank" rel="noreferrer">
              <SocialIcon name="facebook" />
            </a>
            <a href={site.social.youtube} aria-label="Ranklit on YouTube" className="hover:text-ink" target="_blank" rel="noreferrer">
              <SocialIcon name="youtube" />
            </a>
            <a href={site.social.x} aria-label="Ranklit on X" className="hover:text-ink" target="_blank" rel="noreferrer">
              <SocialIcon name="x" />
            </a>
          </div>
        </div>
        {footerNav.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-[15px] font-bold text-ink">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-ink/55 transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t border-ink/[0.06]">
        <Container className="flex flex-col gap-2 py-6 text-[13px] text-ink/45 sm:flex-row sm:justify-between">
          <p>© Ranklit LLC. All rights reserved.</p>
          <p>30-day money-back ranking guarantee.</p>
        </Container>
      </div>
    </footer>
  );
}
