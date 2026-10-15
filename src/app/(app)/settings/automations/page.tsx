import type { Metadata } from "next";
import { Grid3x3 } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { Card, CardHeader, PageHeader } from "@/components/app/ui";
import { AutomationToggles, AutopilotStatusCard } from "@/components/app/autopilot/automation-toggles";
import { WeeklyScanSetup } from "@/components/app/autopilot/weekly-scan-setup";
import { ScanAreaEditor } from "@/components/app/rankings/scan-area";
import { getScanCenter } from "@/lib/server/rankings-store";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Automations" };

export default async function AutomationsPage() {
  const { account, business: s } = await getApp();
  const keywords = s.strategy.keywords.filter((k) => k.checked).length;
  const center = getScanCenter(s.profile.id);

  return (
    <div className="mx-auto max-w-[944px] space-y-5">
      <PageHeader title="Automations" subtitle="Choose what your bot does automatically. You're in control of each action." />

      <AutopilotStatusCard on={s.autopilot} />

      <Card>
        <CardHeader title="What runs automatically" description="Each action is independent — turn any on or off anytime." />
        <div className="mt-2">
          <AutomationToggles automations={s.automations} />
        </div>
        <div className="mt-4">
          <WeeklyScanSetup weekly={s.weeklyScan} keywords={keywords} monthlyCredits={account.monthlyCredits} credits={account.credits} />
        </div>
      </Card>

      <Card>
        <CardHeader icon={Grid3x3} title="Scan area" description="How wide each map scan looks, and how far apart the check points are." />
        <div className="mt-4">
          <ScanAreaEditor key={`${s.scanArea.grid}-${s.scanArea.spacing}-${center.east}-${center.north}`} area={s.scanArea} center={center} maxGrid={account.maxGrid} />
        </div>
      </Card>

      <p className="text-center text-sm text-ink/55">The master on/off switch for all automation lives at the bottom of the sidebar.</p>
    </div>
  );
}
