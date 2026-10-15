import type { Metadata } from "next";
import { Globe, Lightbulb, ListChecks, Star, Swords, Target, Users, Wrench } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { Card, CardHeader, IconTile, PageHeader } from "@/components/app/ui";
import { StrategyActions } from "@/components/app/autopilot/strategy-actions";
import { KeywordEditor } from "@/components/app/autopilot/keyword-editor";
import { StrategyFieldEditor, TargetKeywordsInput, WebsiteLearned } from "@/components/app/autopilot/strategy-fields";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Ranking Strategy" };

export default async function StrategyPage() {
  const { account, business: s } = await getApp();
  const st = s.strategy;
  const p = s.profile;

  const counters = [
    { label: "Keywords", value: st.keywords.length, icon: Target },
    { label: "Services", value: st.services.length, icon: Wrench },
    { label: "Differentiators", value: st.differentiators.length, icon: Lightbulb },
    { label: "Competitors", value: st.competitors.length, icon: Swords },
  ];

  const hasStrategy = st.keywords.length > 0 || st.services.length > 0 || !!st.customer;

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <PageHeader
        icon={Target}
        title="Ranking Strategy"
        subtitle="One source of truth for what your business is going after. Every agent, including auto-post, review responder, and profile monitor, works off this."
      />

      <Card>
        <CardHeader title="Your strategy" description="Tag the keywords, customer, and edge. Every bot reads from here on its next run." />
        <div className="mt-4">
          <StrategyActions
            hasStrategy={hasStrategy}
            defaults={{
              services: (st.services.length ? st.services : p.services).join(", "),
              customer: st.customer,
              area: p.city,
            }}
          />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {counters.map((c) => (
            <div key={c.label} className="flex items-center gap-3 rounded-xl border border-[#ece6f4] bg-[#f8f6fb] px-3 py-3">
              <IconTile icon={c.icon} size="sm" />
              <div>
                <p className="text-xl leading-none font-extrabold">{c.value}</p>
                <p className="mt-1 text-[10px] font-bold tracking-wider text-ink/50 uppercase">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          icon={Star}
          title="Main and secondary keywords"
          description="Your main keyword is the search you most want to win. Secondary keywords are the other services and searches that bring you customers. Checked keywords are tracked in your map scans."
        />
        <KeywordEditor
          key={JSON.stringify(st.keywords)}
          keywords={st.keywords}
          max={account.maxKeywords}
          planName={account.planName}
          neverScanned={s.scans.length === 0}
        />
      </Card>

      <Card>
        <CardHeader
          icon={ListChecks}
          title="Target keywords"
          description="What we'll scan in your map ranking checks. Type a phrase and press Enter to add it. The first map scan for this location is free; later scans use credits."
        />
        <div className="mt-4">
          <TargetKeywordsInput value={st.targetKeywords} />
        </div>
      </Card>

      <Card>
        <CardHeader
          icon={Globe}
          title="What we learned from your website"
          description="Ranklit reads your website for the services you sell and the areas you serve, and builds keywords from them."
        />
        <WebsiteLearned learned={st.websiteLearned} website={p.website} services={[...p.services, p.primaryCategory]} />
      </Card>

      <Card>
        <CardHeader icon={Users} title="Target customer" description="One sentence. Who is this for?" />
        <StrategyFieldEditor field="customer" value={st.customer} placeholder={`e.g. Homeowners in ${p.city} who need help fast`} />
      </Card>

      <Card>
        <CardHeader icon={Wrench} title="Services to grow" description="The lines you want more of. Bots prioritize posts + topics around these." />
        <StrategyFieldEditor field="services" value={st.services} placeholder="e.g. Water heater installs" />
      </Card>

      <Card>
        <CardHeader icon={Lightbulb} title="What makes you different" description="Quick reasons customers pick you. Used in posts + review replies, so keep it natural." />
        <StrategyFieldEditor field="differentiators" value={st.differentiators} placeholder="e.g. Same-day service" />
      </Card>

      <Card>
        <CardHeader icon={Swords} title="Competitors" description="Local rivals you want to outrank. Names are fine. We'll figure out the rest." />
        <StrategyFieldEditor field="competitors" value={st.competitors} placeholder="e.g. Mile High Plumbing" />
      </Card>
    </div>
  );
}
