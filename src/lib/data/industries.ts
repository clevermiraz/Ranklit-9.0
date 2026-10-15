import { Car, Droplets, Flower2, Hammer, HeartPulse, Home, Smile, ThermometerSun, Zap, type LucideIcon } from "lucide-react";

export type City = { slug: string; name: string; state: string };

export type Industry = {
  slug: string;
  name: string;
  singular: string;
  short: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  cities: City[];
};

const city = (name: string, state: string): City => ({
  slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${state.toLowerCase()}`,
  name,
  state,
});

export const industries: Industry[] = [
  {
    slug: "dentists",
    name: "Dentists",
    singular: "dentist",
    short: "Fill chairs from the map pack",
    description: "Playbooks for dental practices that want to show up in the map pack when nearby patients search for a dentist.",
    icon: Smile,
    keywords: ["dentist near me", "emergency dentist", "teeth cleaning", "cosmetic dentist", "family dentist"],
    cities: [city("Austin", "TX"), city("Denver", "CO"), city("Phoenix", "AZ"), city("Charlotte", "NC"), city("Tampa", "FL"), city("Nashville", "TN"), city("Columbus", "OH")],
  },
  {
    slug: "plumbers",
    name: "Plumbers",
    singular: "plumber",
    short: "Win emergency and booked jobs",
    description: "City guides and plumbing-specific SEO pages for companies that need to win emergency calls and booked jobs.",
    icon: Droplets,
    keywords: ["plumber near me", "emergency plumber", "water heater repair", "drain cleaning", "leak detection"],
    cities: [city("Houston", "TX"), city("Atlanta", "GA"), city("Dallas", "TX"), city("San Diego", "CA"), city("Orlando", "FL")],
  },
  {
    slug: "roofers",
    name: "Roofers",
    singular: "roofer",
    short: "Rank for repairs and replacements",
    description: "Roofing-focused local SEO guides, including city pages for contractors competing on Google Maps.",
    icon: Home,
    keywords: ["roofer near me", "roof repair", "roof replacement", "storm damage roofing", "metal roofing"],
    cities: [city("Oklahoma City", "OK"), city("Kansas City", "MO"), city("Fort Worth", "TX"), city("Raleigh", "NC"), city("Omaha", "NE")],
  },
  {
    slug: "hvac",
    name: "HVAC",
    singular: "HVAC company",
    short: "Own AC repair and heating searches",
    description: "Local SEO guides for HVAC companies ranking for AC repair, heating and installation searches in their service area.",
    icon: ThermometerSun,
    keywords: ["ac repair near me", "hvac company", "furnace repair", "heat pump installation", "ac installation"],
    cities: [city("Phoenix", "AZ"), city("Las Vegas", "NV"), city("San Antonio", "TX"), city("Jacksonville", "FL")],
  },
  {
    slug: "chiropractors",
    name: "Chiropractors",
    singular: "chiropractor",
    short: "More new-patient calls",
    description: "Guides for chiropractic practices that want more new-patient calls from Google Maps.",
    icon: HeartPulse,
    keywords: ["chiropractor near me", "back pain doctor", "sports chiropractor"],
    cities: [city("Scottsdale", "AZ"), city("Boise", "ID"), city("Salt Lake City", "UT")],
  },
  {
    slug: "auto-repair",
    name: "Auto repair",
    singular: "auto repair shop",
    short: "Win “near me” service searches",
    description: "Local SEO playbooks for auto repair shops competing for “near me” and city-specific service searches.",
    icon: Car,
    keywords: ["auto repair near me", "mechanic near me", "brake repair", "oil change"],
    cities: [city("Indianapolis", "IN"), city("Louisville", "KY")],
  },
  {
    slug: "electricians",
    name: "Electricians",
    singular: "electrician",
    short: "Show up for urgent electrical work",
    description: "Guides for electrical contractors who need to show up for emergency and booked electrical work in their city.",
    icon: Zap,
    keywords: ["electrician near me", "emergency electrician", "panel upgrade", "ev charger installation"],
    cities: [city("Charlotte", "NC"), city("Sacramento", "CA")],
  },
  {
    slug: "landscapers",
    name: "Landscapers",
    singular: "landscaper",
    short: "Lawn care and design leads",
    description: "Local SEO pages for landscaping companies targeting lawn care and design searches in their market.",
    icon: Flower2,
    keywords: ["landscaper near me", "lawn care service", "landscape design", "sod installation"],
    cities: [city("Tulsa", "OK"), city("Richmond", "VA")],
  },
];

export const extraIndustryIcon = Hammer;

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}

export function getCity(industry: Industry, citySlug: string) {
  return industry.cities.find((c) => c.slug === citySlug);
}
