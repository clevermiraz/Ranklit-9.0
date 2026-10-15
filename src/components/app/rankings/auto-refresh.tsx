"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-renders the server page every `ms` while `active` (e.g. while a scan is running). */
export function AutoRefresh({ active, ms = 2000 }: { active: boolean; ms?: number }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => router.refresh(), ms);
    return () => clearInterval(t);
  }, [active, ms, router]);
  return null;
}

/** Smoothly scrolls this marker into view when mounted (used when a scan is picked from history). */
export function ScrollHere({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    document.getElementById("scan-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [enabled]);
  return null;
}
