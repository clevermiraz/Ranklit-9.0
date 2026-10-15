import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AIToolForm } from "@/components/tools/ai-tool-form";
import { Calculator } from "@/components/tools/calculators";
import { ToolCtaBand } from "@/components/tools/tool-cta-band";
import { getTool, toolCtas, tools } from "@/lib/data/tools";

// Fully prerendered via generateStaticParams; params are known at build time.
export const instant = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return { title: tool.title, description: tool.description };
}

export default async function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-ink">{tool.name}</h1>
        <p className="mt-3 text-lg text-ink/70">{tool.description}</p>
      </header>

      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        {tool.type === "ai" ? <AIToolForm slug={tool.slug} cta={tool.button} fields={tool.fields} /> : <Calculator id={tool.calculator} />}
      </div>

      <div className="mt-12">
        {tool.article.map((section) => (
          <section key={section.heading} className="mt-14 first:mt-0">
            <h2 className="mb-8 text-[30px] leading-10 font-bold tracking-tight text-ink">{section.heading}</h2>
            <p className="mb-6 text-lg leading-8 text-ink/[0.82]">{section.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-16 border-t border-black/5 pt-10" aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-2xl font-bold tracking-tight text-ink">
          Frequently asked questions
        </h2>
        <dl className="mt-6 space-y-6">
          {tool.faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="font-semibold text-ink">{faq.q}</dt>
              <dd className="mt-2 text-ink/70">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <ToolCtaBand cta={toolCtas[tool.cta]} />
    </div>
  );
}
