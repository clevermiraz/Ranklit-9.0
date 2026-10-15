import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { getSettings } from "@/lib/server/settings-store";
import { ACCOUNT_MANAGER_EMAIL } from "@/lib/app/types";
import { Card, CardHeader, PageHeader, btn } from "@/components/app/ui";
import { AgencyToolsLink, BusinessInfoForm, EmailForm, PasswordForm, ProfileForm } from "@/components/app/settings/account-forms";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const { user, account, business } = await getApp();
  const p = business.profile;
  const settings = getSettings(user.id);
  const onGrowth = !!account.planId && /growth/.test(account.planId);

  return (
    <div className="mx-auto max-w-[840px] space-y-5">
      <PageHeader
        title="Account"
        subtitle={
          <>
            Your name, business details and password. Your plan, billing and credits are on{" "}
            <Link href="/settings/plans" className="font-semibold text-brand-700 hover:underline">
              Plans &amp; Credits
            </Link>
            .
          </>
        }
      />

      <Card>
        <CardHeader title="Profile Information" description="Your personal account details" />
        <div className="mt-5">
          <ProfileForm firstName={account.firstName} lastName={account.lastName} />
        </div>
        <hr className="my-5 border-[#f0ebf6]" />
        <EmailForm email={account.email} pendingEmail={settings.pendingEmail} />
        <hr className="my-5 border-[#f0ebf6]" />
        <AgencyToolsLink onGrowth={onGrowth} />
      </Card>

      <Card>
        <CardHeader title="Business Information" description={`Your business details used for SEO${account.businesses.length > 1 ? ` — editing ${p.name}` : ""}`} />
        <div className="mt-5">
          <BusinessInfoForm key={p.id} name={p.name} phone={p.phone} address={p.address} website={p.website} gbpUrl={p.gbpUrl} />
        </div>
      </Card>

      <Card className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <CardHeader title="Your account manager" description="A real person who checks your account and tunes your bot every month." />
          <p className="mt-3 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 font-bold text-white">{account.accountManager[0]}</span>
            <span>
              <span className="block font-semibold">{account.accountManager}</span>
              <span className="block text-xs text-ink/55">{ACCOUNT_MANAGER_EMAIL}</span>
            </span>
          </p>
        </div>
        <a href={`mailto:${ACCOUNT_MANAGER_EMAIL}`} className={btn.primary}>
          <Mail className="size-4" /> Email {account.accountManager}
        </a>
      </Card>

      <Card>
        <CardHeader title="Change Password" description="Update your account password" />
        <div className="mt-5">
          <PasswordForm />
        </div>
      </Card>
    </div>
  );
}
