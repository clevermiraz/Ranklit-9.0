import Link from "next/link";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <Container className="relative py-28 text-center">
          <p className="text-gradient text-7xl font-extrabold tracking-tight">404</p>
          <h1 className="tracking-display mt-4 text-4xl">This spot isn&apos;t on the map.</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink/65">The page you&apos;re looking for moved or never existed.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink href="/tools" variant="secondary">
              Try a free tool
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-ink/55">
            Need help? <Link href="mailto:support@ranklit.com" className="font-semibold text-brand-700">support@ranklit.com</Link>
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
