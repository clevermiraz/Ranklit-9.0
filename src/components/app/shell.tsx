import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { needsYouCount, onboardingSteps } from "@/lib/app/types";
import { ACCOUNT_MANAGER_EMAIL } from "@/lib/app/types";
import { Sidebar, type SidebarData } from "./sidebar";
import { AppHeader } from "./header";
import { SubNav, TrialBanner } from "./chrome";
import { ToastProvider } from "./toast";
import { PageSkeleton } from "./ui";

/** Dashboard frame: dark sidebar, header, trial banner, section sub-tabs, content. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-dvh bg-[#f5f2f9]">
        <Suspense fallback={<aside className="sticky top-0 hidden h-dvh w-[210px] shrink-0 bg-[#231938] lg:block" />}>
          <SidebarLoader />
        </Suspense>
        <div className="flex min-w-0 flex-1 flex-col">
          <Suspense fallback={<header className="h-[52px] border-b border-[#ece6f4] bg-white" />}>
            <HeaderLoader />
          </Suspense>
          <Suspense>
            <TrialLoader />
          </Suspense>
          <Suspense>
            <SubNav />
          </Suspense>
          <main className="flex-1 px-4 py-6 sm:px-5">
            <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
          </main>
        </div>
        <a
          href={`mailto:${ACCOUNT_MANAGER_EMAIL}`}
          className="fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full bg-brand-700 text-white shadow-brand hover:bg-[#7b2fa8]"
          aria-label="Message support"
        >
          <MessageCircle className="size-5" />
        </a>
      </div>
    </ToastProvider>
  );
}

async function SidebarLoader() {
  const { account, business } = await getApp();
  const steps = onboardingSteps(business);
  const data: SidebarData = {
    businessName: business.profile.name,
    businesses: account.businesses.map((b) => ({ id: b.id, name: b.name, address: b.address })),
    currentBusinessId: account.currentBusinessId,
    badges: { home: needsYouCount(business), gbp: business.suggestions.length },
    autopilot: business.autopilot,
    setupDone: steps.every((s) => s.done),
    planName: account.planName,
    credits: account.credits,
  };
  return <Sidebar data={data} />;
}

async function HeaderLoader() {
  const { account, business } = await getApp();
  return <AppHeader email={account.email} initial={account.firstName.charAt(0).toUpperCase()} autopilot={business.autopilot} autoReply={business.automations.autoReply} />;
}

async function TrialLoader() {
  const { account } = await getApp();
  if (!account.trialEndsAt) {
    if (account.planId) return null;
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:mx-5">
        You don&apos;t have an active plan, so your agent is paused.{" "}
        <Link href="/settings/plans" className="font-semibold underline">
          Choose a plan
        </Link>
      </div>
    );
  }
  const chargeDate = new Date(account.trialEndsAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return <TrialBanner daysLeft={account.trialDaysLeft} chargeDate={chargeDate} />;
}
