"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, ChevronDown, Code2, Copy, MapPinned } from "lucide-react";
import type { BusinessProfile, Weekday } from "@/lib/app/types";
import { Card, IconTile, Label, btn, input } from "@/components/app/ui";
import { MapBackdrop } from "@/components/rank-grid";

export const SCHEMA_TYPES = [
  { value: "LocalBusiness", label: "Local Business" },
  { value: "Plumber", label: "Plumber" },
  { value: "Dentist", label: "Dentist" },
  { value: "HVACBusiness", label: "HVAC Business" },
  { value: "Electrician", label: "Electrician" },
  { value: "RoofingContractor", label: "Roofing Contractor" },
  { value: "GeneralContractor", label: "General Contractor" },
  { value: "AutoRepair", label: "Auto Repair" },
  { value: "Locksmith", label: "Locksmith" },
  { value: "HousePainter", label: "House Painter" },
  { value: "MovingCompany", label: "Moving Company" },
  { value: "LegalService", label: "Lawyer / Legal Service" },
  { value: "MedicalClinic", label: "Medical Clinic" },
  { value: "BeautySalon", label: "Beauty Salon" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "RealEstateAgent", label: "Real Estate Agent" },
];

const DAY_NAMES: Record<Weekday, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

/** "9:00 AM" → "09:00" */
function to24(t: string) {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return t;
  let h = Number(m[1]);
  const ap = m[3]?.toUpperCase();
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

/** Splits "1200 Market St, Denver, CO 80202" into schema.org PostalAddress parts. */
function postalAddress(address: string, city: string) {
  const parts = address.split(",").map((s) => s.trim());
  const stateZip = parts.at(-1)?.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
  return {
    "@type": "PostalAddress",
    streetAddress: parts[0] ?? address,
    addressLocality: parts.length >= 3 ? parts[parts.length - 2] : city,
    ...(stateZip ? { addressRegion: stateZip[1], postalCode: stateZip[2] } : {}),
    addressCountry: "US",
  };
}

export function buildJsonLd(p: BusinessProfile, type: string) {
  const open = p.hours.filter((h) => h.open && h.close);
  // Group days that share the same hours so the markup stays short.
  const groups = new Map<string, string[]>();
  for (const h of open) {
    const k = `${to24(h.open!)}-${to24(h.close!)}`;
    groups.set(k, [...(groups.get(k) ?? []), DAY_NAMES[h.day]]);
  }
  const data = {
    "@context": "https://schema.org",
    "@type": type,
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    url: p.website,
    telephone: p.phone,
    address: postalAddress(p.address, p.city),
    areaServed: p.city,
    ...(p.gbpUrl ? { hasMap: p.gbpUrl } : {}),
    ...(groups.size
      ? {
          openingHoursSpecification: [...groups].map(([k, days]) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: days,
            opens: k.split("-")[0],
            closes: k.split("-")[1],
          })),
        }
      : {}),
    ...(p.services.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Services",
            itemListElement: p.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
          },
        }
      : {}),
  };
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
}

function guessType(category: string) {
  const c = category.toLowerCase();
  const hit = SCHEMA_TYPES.find((t) => t.value !== "LocalBusiness" && c.includes(t.label.toLowerCase().split(" ")[0]));
  return hit?.value ?? "LocalBusiness";
}

function CopyCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button type="button" onClick={copy} className={clsx(btn.primary, btn.sm, "!rounded-lg")}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copied" : "Copy code"}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-2 max-h-[320px] overflow-auto rounded-xl bg-[#231938] p-4 font-mono text-[12.5px] leading-relaxed text-[#e9defa]">
      <code>{code}</code>
    </pre>
  );
}

function HowTo({ children }: { children: ReactNode }) {
  return (
    <details className="group mt-4 rounded-xl border border-[#ece6f4] bg-[#faf8fc]">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        How to add it to your site
        <ChevronDown className="size-4 text-ink/45 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-ink/70">{children}</div>
    </details>
  );
}

export function SchemaGenerator({ profile }: { profile: BusinessProfile }) {
  const [type, setType] = useState(() => guessType(profile.primaryCategory));
  const code = buildJsonLd(profile, type);
  return (
    <Card>
      <div className="flex items-start gap-3">
        <IconTile icon={Code2} size="sm" />
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">Business details for Google</h2>
          <p className="mt-0.5 text-sm text-ink/60">
            Code that tells Google your name, address, phone and hours. Built from your{" "}
            <Link href="/dashboard/gbp" className="font-semibold text-brand-700 hover:underline">
              Google profile
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="mt-5 max-w-xs">
        <Label htmlFor="schema-type">Business type</Label>
        <select id="schema-type" value={type} onChange={(e) => setType(e.target.value)} className={input}>
          {SCHEMA_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm font-semibold">Your code</p>
        <CopyCode value={code} />
      </div>
      <CodeBlock code={code} />
      <HowTo>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Copy the code above.</li>
          <li>
            <strong>WordPress:</strong> install a header/footer plugin (e.g. WPCode), open <em>Header</em>, paste, save.
          </li>
          <li>
            <strong>Wix:</strong> Settings → Custom code → Add code → paste → place in <em>Head</em> on all pages.
          </li>
          <li>
            <strong>Squarespace:</strong> Settings → Advanced → Code injection → paste into <em>Header</em>.
          </li>
          <li>
            <strong>Anything else:</strong> paste it just before <code className="rounded bg-ink/5 px-1">&lt;/head&gt;</code> on your homepage.
          </li>
        </ol>
        <p>Check it worked with Google&apos;s Rich Results Test. If your hours or phone change, come back and copy the new code.</p>
      </HowTo>
    </Card>
  );
}

const SIZES = [
  { value: "full", label: "Full width (100% x 450)", w: "100%", h: 450 },
  { value: "large", label: "Large (800 x 600)", w: "800", h: 600 },
  { value: "medium", label: "Medium (600 x 450)", w: "600", h: 450 },
  { value: "small", label: "Small (400 x 300)", w: "400", h: 300 },
];

const MAP_TYPES = [
  { value: "standard", label: "Standard (works right away)" },
  { value: "satellite", label: "Satellite (works right away)" },
  { value: "api", label: "Embed API (needs a Google API key)" },
];

export function buildMapEmbed(p: BusinessProfile, size: string, mapType: string) {
  const s = SIZES.find((x) => x.value === size) ?? SIZES[0];
  const q = encodeURIComponent(`${p.name}, ${p.address}`);
  const src =
    mapType === "api"
      ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${q}`
      : `https://maps.google.com/maps?q=${q}&t=${mapType === "satellite" ? "k" : "m"}&z=15&output=embed`;
  return `<iframe\n  src="${src}"\n  width="${s.w}"\n  height="${s.h}"\n  style="border:0;"\n  allowfullscreen=""\n  loading="lazy"\n  referrerpolicy="no-referrer-when-downgrade"\n  title="${p.name.replace(/"/g, "&quot;")} on Google Maps"\n></iframe>`;
}

export function MapEmbedGenerator({ profile }: { profile: BusinessProfile }) {
  const [size, setSize] = useState("full");
  const [mapType, setMapType] = useState("standard");
  const code = buildMapEmbed(profile, size, mapType);
  const s = SIZES.find((x) => x.value === size)!;
  return (
    <Card>
      <div className="flex items-start gap-3">
        <IconTile icon={MapPinned} size="sm" />
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">Google map for your site</h2>
          <p className="mt-0.5 text-sm text-ink/60">Shows customers where you are ({profile.name}), and ties your site to your map pin.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="map-size">Size</Label>
          <select id="map-size" value={size} onChange={(e) => setSize(e.target.value)} className={input}>
            {SIZES.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="map-type">Map type</Label>
          <select id="map-type" value={mapType} onChange={(e) => setMapType(e.target.value)} className={input}>
            {MAP_TYPES.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold text-ink/55">Preview (illustration)</p>
        <div className="relative overflow-hidden rounded-xl border border-[#ece6f4]" style={{ maxWidth: s.w === "100%" ? "100%" : `${s.w}px`, aspectRatio: s.w === "100%" ? "16 / 5" : `${s.w} / ${s.h}` }}>
          <MapBackdrop className={mapType === "satellite" ? "saturate-50 brightness-75 hue-rotate-[60deg]" : undefined} />
          <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
            <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold shadow">{profile.name}</span>
            <MapPinned className="mt-1 size-7 fill-red-500 text-red-700" />
          </span>
        </div>
      </div>

      {mapType === "api" && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Replace YOUR_API_KEY with a Maps Embed API key from Google Cloud. The standard map works without one.</p>
      )}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm font-semibold">Your code</p>
        <CopyCode value={code} />
      </div>
      <CodeBlock code={code} />
      <HowTo>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Copy the code above.</li>
          <li>Open your contact page (or footer) in your website editor.</li>
          <li>
            Add an <strong>HTML</strong> / <strong>Embed</strong> / <strong>Custom code</strong> block where you want the map and paste the code.
          </li>
          <li>Publish, then open the page to check the pin sits on your business.</li>
        </ol>
        <p>Putting the map next to your address and phone number helps Google connect your site and your profile.</p>
      </HowTo>
    </Card>
  );
}
