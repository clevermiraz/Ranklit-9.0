"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <h1 className="tracking-display text-3xl">Something went wrong.</h1>
        <p className="mt-3 text-ink/65">A server error occurred. Reload to try again.</p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
        {error.digest && <p className="mt-4 text-xs text-ink/40">Reference: {error.digest}</p>}
      </div>
    </main>
  );
}
