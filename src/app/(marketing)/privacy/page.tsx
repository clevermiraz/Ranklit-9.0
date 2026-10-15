import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, SupportEmail } from "./legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy: Google Data & Your Rights",
  description:
    "How Ranklit collects, uses, stores, and shares your information, including Google user data accessed through Google APIs, and the choices you have.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" path="/privacy">
      <p>
        Ranklit LLC (&ldquo;Ranklit,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) runs Ranklit, a
        done-for-you local SEO service that helps businesses rank higher on Google Maps. This Privacy Policy describes the
        information we collect, how we use and share it, and the choices available to you. It covers our website at{" "}
        <Link href="/">ranklit.com</Link>, our web application, and the related services we provide (together, the
        &ldquo;Services&rdquo;).
      </p>

      <h2>Information we collect</h2>
      <p>We collect the following kinds of information:</p>
      <ul>
        <li>
          <strong>Account information.</strong> When you create an account we collect your name, email address, business
          name, and billing details. Payments are handled by our payment processor (Stripe), and we never store full card
          numbers.
        </li>
        <li>
          <strong>Google account and Google Business Profile data.</strong> When you connect a Google account, we request
          access through Google&apos;s OAuth process to the data needed to manage your local presence, such as your
          Business Profile name, address, phone number, categories, hours, posts, reviews, photos, and performance
          insights. We only ask for the permissions required by the features you use, and you can review or revoke that
          access whenever you like.
        </li>
        <li>
          <strong>Usage and device data.</strong> Like most online services, we automatically record log data such as IP
          address, browser type, pages visited, and timestamps so we can operate, secure, and improve the Services.
        </li>
        <li>
          <strong>Communications.</strong> If you email or chat with our support team, we keep a record of those
          conversations.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To provide, maintain, and improve the Services;</li>
        <li>
          To optimize your Google Business Profile, publish posts, respond to reviews, build citations, and track your map
          rankings on your behalf;
        </li>
        <li>To process payments and manage your subscription;</li>
        <li>To send service and account notices and to answer support requests;</li>
        <li>To detect, prevent, and respond to fraud, abuse, and security incidents;</li>
        <li>To meet our legal obligations.</li>
      </ul>

      <h2>How Ranklit&apos;s use of Google user data complies with Google&apos;s Limited Use requirements</h2>
      <p>
        Ranklit&apos;s use and transfer of information received from Google APIs follows the{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">
          Google API Services User Data Policy
        </a>
        , including the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy#limited-use"
          target="_blank"
          rel="noreferrer"
        >
          Limited Use
        </a>{" "}
        requirements. In particular:
      </p>
      <ul>
        <li>We use Google user data only to provide and improve the features you can see in the Services.</li>
        <li>
          We do not sell Google user data or use it for advertising, and we do not use it to build profiles unrelated to
          the Services.
        </li>
        <li>
          We do not let people read Google user data unless you give permission, it is needed for security or legal
          reasons, or the data has been aggregated and anonymized for internal operations.
        </li>
        <li>We do not use Google user data to train generalized AI or machine learning models.</li>
      </ul>

      <h2>How we share information</h2>
      <p>We do not sell your personal information. We share it only in these situations:</p>
      <ul>
        <li>
          <strong>With service providers</strong> who host our infrastructure, process payments, send email, or provide
          support tools, under contracts that limit how they may use the data.
        </li>
        <li>
          <strong>With Google</strong> when we publish posts, replies, or profile updates to your Business Profile at your
          direction.
        </li>
        <li>
          <strong>For legal reasons</strong> when required by law, or to protect the rights, property, or safety of
          Ranklit, our customers, or others.
        </li>
        <li>
          <strong>In a business transfer</strong> such as a merger, acquisition, or sale of assets, in which case this
          policy will continue to apply to your information.
        </li>
      </ul>

      <h2>Data retention</h2>
      <p>
        We keep your information for as long as your account is active and as needed to provide the Services. After you
        close your account or disconnect Google, we delete or anonymize the related data within a reasonable period,
        unless we must keep certain records for legal, tax, or accounting purposes.
      </p>

      <h2>Your choices and rights</h2>
      <ul>
        <li>
          <strong>Revoke Google access.</strong> You can disconnect Ranklit at any time from your dashboard or from your{" "}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
            Google Account permissions
          </a>{" "}
          page.
        </li>
        <li>
          <strong>Access, correct, or delete.</strong> Depending on where you live, you may have the right to request a
          copy of your data or ask us to correct or delete it. Email us and we will respond within the time required by
          law.
        </li>
        <li>
          <strong>Close your account.</strong> You can cancel your subscription and ask us to delete your account at any
          time.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        We use industry-standard safeguards, including encryption in transit, restricted access to production systems,
        and secure storage of OAuth tokens. No method of transmission or storage is perfectly secure, but we work hard to
        protect your information and will notify you of a breach where the law requires it.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        The Services are meant for businesses and are not directed to children under 16. We do not knowingly collect
        personal information from children. If you believe a child has given us information, contact us and we will
        delete it.
      </p>

      <h2>International users</h2>
      <p>
        Ranklit is based in the United States, and your information may be processed in the United States or other
        countries where our providers operate. Where required, we rely on appropriate safeguards for transferring personal
        data across borders.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will change the &ldquo;Last updated&rdquo; date
        above, and if the changes are significant we will let you know by email or through the Services.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy or how we handle your data? Email us at <SupportEmail />.
      </p>
      <p>
        To make a privacy request, write to <SupportEmail /> with the subject line &ldquo;Privacy request&rdquo; and tell us
        which account it concerns.
      </p>
    </LegalShell>
  );
}
