import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, SupportEmail } from "../privacy/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service: Accounts, Billing & Use",
  description:
    "Read Ranklit's Terms of Service covering accounts, subscriptions, Google Business Profile access, acceptable use, and your legal responsibilities.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" path="/terms">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) are an agreement between you and Ranklit LLC (&ldquo;Ranklit,&rdquo;
        &ldquo;we,&rdquo; or &ldquo;us&rdquo;) and govern your use of our website, web application, and related services
        (the &ldquo;Services&rdquo;). By creating an account or using the Services, you agree to these Terms. If you are
        accepting them for a business, you confirm that you have authority to bind that business.
      </p>

      <h2>1. The Services</h2>
      <p>
        Ranklit provides done-for-you local SEO, including Google Business Profile management, posts, review replies,
        citation building, rank tracking, and reporting. Features vary by plan and may change over time. We aim to improve
        your local visibility, but search rankings depend on factors outside our control, and except for the ranking
        guarantee described in Section 4 we do not promise any specific result.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must be at least 18 years old and give us accurate, complete information when you sign up. You are responsible
        for keeping your login credentials secure and for all activity under your account. Tell us right away if you
        suspect unauthorized access.
      </p>

      <h2>3. Google account access</h2>
      <p>
        To deliver the Services you may connect a Google account and authorize us to manage one or more Google Business
        Profiles. You confirm that you own or are authorized to manage those profiles. We act on your behalf within the
        permissions you grant, and you can revoke access at any time. How we handle Google user data is explained in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>4. Subscriptions, billing, and refunds</h2>
      <p>
        Paid plans are billed in advance on a monthly or annual basis and renew automatically until cancelled. Free trials
        convert to a paid plan when they end unless you cancel first. You can cancel at any time, and cancellation takes
        effect at the end of the current billing period. Fees are non-refundable except under our 30-day money-back
        ranking guarantee: if your tracked map rankings have not improved within your first 30 days of a paid plan, contact
        us and we will refund that first payment. Prices may change with at least 30 days&apos; notice.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Services for any business, listing, or content that is unlawful, deceptive, or infringing;</li>
        <li>Ask us to post fake reviews, misleading information, or content that breaks Google&apos;s policies;</li>
        <li>Attempt to access, probe, or disrupt our systems or other customers&apos; data;</li>
        <li>Resell or sublicense the Services except through an agency plan that permits it.</li>
      </ul>

      <h2>6. Customer content and license</h2>
      <p>
        You keep ownership of the business information, photos, and other content you provide (&ldquo;Customer
        Content&rdquo;). You grant us a limited license to use, copy, and publish Customer Content only as needed to
        provide the Services, including posting it to your Google Business Profile and directory listings. You are
        responsible for having the rights to everything you give us.
      </p>

      <h2>7. Third-party services</h2>
      <p>
        The Services work with third-party platforms such as Google, directory sites, and payment processors. Your use of
        those platforms is subject to their own terms, and we are not responsible for their availability, policies, or
        decisions, including changes Google makes to how it ranks or displays businesses.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        Except as expressly stated in these Terms, the Services are provided &ldquo;as is&rdquo; and &ldquo;as
        available,&rdquo; without warranties of any kind, whether express or implied, including warranties of
        merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent allowed by law, Ranklit will not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or for lost profits, revenue, or data. Our total liability for any claim
        relating to the Services is limited to the amount you paid us in the 12 months before the claim arose.
      </p>

      <h2>10. Termination</h2>
      <p>
        You may stop using the Services and close your account at any time. We may suspend or end your access if you
        breach these Terms or if continuing would expose us or others to legal or security risk. Sections that by their
        nature should survive termination, including Sections 6, 8, 9, and 12, will continue to apply.
      </p>

      <h2>11. Changes to these Terms</h2>
      <p>
        We may revise these Terms from time to time. If a change is material we will notify you by email or in the app
        before it takes effect. Continuing to use the Services after the effective date means you accept the updated
        Terms.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, without regard to its conflict-of-law rules. Any
        dispute will be resolved in the state or federal courts located in Delaware, and both parties consent to their
        jurisdiction.
      </p>

      <h2>13. Contact us</h2>
      <p>
        Questions about these Terms? Email us at <SupportEmail />.
      </p>
      <p>We&apos;re happy to walk you through anything here before you sign up.</p>
    </LegalShell>
  );
}
