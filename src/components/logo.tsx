import Link from "next/link";
import clsx from "clsx";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="ranklit-pin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b95fe0" />
          <stop offset="1" stopColor="#6f2d99" />
        </linearGradient>
      </defs>
      <path
        fill="url(#ranklit-pin)"
        d="M12 1.75c-4.3 0-7.75 3.36-7.75 7.6 0 5.37 6.53 11.95 7.04 12.45a1 1 0 0 0 1.42 0c.51-.5 7.04-7.08 7.04-12.45 0-4.24-3.45-7.6-7.75-7.6z"
      />
      <path fill="#fff" d="M12 5.6l1.15 2.36 2.6.38-1.88 1.83.44 2.59L12 11.53l-2.31 1.23.44-2.59-1.88-1.83 2.6-.38L12 5.6z" />
    </svg>
  );
}

export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={clsx("flex items-center gap-2", className)} aria-label="Ranklit home">
      <LogoMark className="size-8 sm:size-9" />
      <span className={clsx("text-lg font-bold tracking-tight sm:text-2xl", dark ? "text-white" : "text-ink")}>
        rank<span className="text-brand-600">lit</span>
      </span>
    </Link>
  );
}
