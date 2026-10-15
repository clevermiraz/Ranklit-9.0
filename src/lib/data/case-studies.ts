/**
 * Sample case studies. The businesses are fictional composites used to illustrate
 * the kind of results the product tracks. They are labelled as samples on the site.
 * Body text supports **bold** spans.
 */
export type CaseStudy = {
  slug: string;
  business: string;
  industry: string;
  region: string;
  headlineMetric: string;
  headlineCaption: string;
  title: string;
  summary: string;
  seoTitle: string;
  stats: { label: string; value: string }[];
  sections: { heading: string; text: string }[];
  quote: { text: string; author: string; role: string };
};

const NOTE =
  "This is a sample case study. The business is a fictional composite, and the figures illustrate the kind of Google Business Profile and geo-grid data your Ranklit dashboard reports.";

export const caseStudyNote = NOTE;

export const caseStudies: CaseStudy[] = [
  {
    slug: "window-tint-austin",
    business: "Lone Star Tint Co.",
    industry: "Window tinting",
    region: "Austin, TX",
    headlineMetric: "#12.4 → #2.8",
    headlineCaption: "average Google Maps rank",
    title: "Window-Tint Shop: From Page Two to the Map's Top 3 Across Town",
    summary:
      "A window-tinting shop in Austin moved from an average Google Maps rank of #12.4 to #2.8 and now appears in the Maps top 3 across 78% of its service-area grid.",
    seoTitle: "Window Tinting Local SEO Case Study (Sample): Google Maps Top 3",
    stats: [
      { label: "top-3 grid coverage", value: "14% → 78%" },
      { label: "website clicks (last 90 days)", value: "6 → 142" },
      { label: "calls from profile (last 90 days)", value: "49" },
    ],
    sections: [
      {
        heading: "Where it started",
        text: "Lone Star Tint Co. served a big metro but hardly showed up on Google Maps. Its average grid rank sat around #12, and it reached the top 3 in only about 14% of the area around the shop. Most nearby drivers searching for tint never saw it.",
      },
      {
        heading: "What changed",
        text: "A steady local SEO routine: a fully optimized Google Business Profile, cleaned-up citations, and fresh profile posts every week. Weekly geo-grid scans kept the work aimed at the searches most likely to turn into booked jobs.",
      },
      {
        heading: "The results",
        text: "Over the tracked period the shop's average Maps rank improved from **#12.4 to #2.8**, and its top-3 coverage of the service-area grid grew from **14% to 78%**. Profile activity followed: website clicks rose to **142** and calls reached **49** in the latest 90-day window, up from almost nothing. The profile now holds a **4.8★** rating across 60+ reviews.",
      },
    ],
    quote: {
      text: "We used to be invisible on the map. Now we come up first when people nearby search for window tint, and the clicks show it.",
      author: "Owner",
      role: "Lone Star Tint Co. (sample)",
    },
  },
  {
    slug: "flooring-store-long-island",
    business: "Harborline Floors",
    industry: "Flooring retailer",
    region: "Long Island, NY",
    headlineMetric: "+128%",
    headlineCaption: "website clicks from Google profile",
    title: "Flooring Retailer: +128% Website Clicks and a Place in the Map's Top 3",
    summary:
      "A suburban flooring store broke into the Google Maps top 3 across half of its service-area grid and more than doubled the website clicks coming from its profile.",
    seoTitle: "Flooring Store Local SEO Case Study (Sample): +128% Website Clicks",
    stats: [
      { label: "website clicks from profile", value: "+128%" },
      { label: "top-3 grid coverage", value: "11% → 52%" },
      { label: "direction requests (last 90 days)", value: "87" },
    ],
    sections: [
      {
        heading: "Where it started",
        text: "Harborline Floors had a showroom customers loved, but on Google Maps it sat behind big-box chains. It reached the top 3 in only about 11% of the grid around the store, and its profile had gone months without a new post.",
      },
      {
        heading: "What changed",
        text: "The agent filled in missing categories and services, added product photos, and began posting three times a week. Our team placed premium home-improvement citations by hand, and review replies went out within a day.",
      },
      {
        heading: "The results",
        text: "Top-3 coverage climbed from **11% to 52%** of the service-area grid. Website clicks from the profile rose **128%** compared with the prior period, and direction requests reached **87** in the latest 90 days, a clear sign of more showroom visits.",
      },
    ],
    quote: {
      text: "We finally show up next to the big stores, and more people walk in already knowing what they want.",
      author: "Store manager",
      role: "Harborline Floors (sample)",
    },
  },
  {
    slug: "house-cleaning-washington-dc",
    business: "Capitol Fresh Cleaning",
    industry: "House cleaning",
    region: "Washington, DC",
    headlineMetric: "1,290",
    headlineCaption: "website clicks in the last 90 days",
    title: "House-Cleaning Service: Kept the Top 3 While Demand Took Off",
    summary:
      "A house-cleaning service held a top-3 Google Maps position in a crowded metro while website clicks and calls from its profile grew into the hundreds.",
    seoTitle: "House Cleaning Local SEO Case Study (Sample): Holding the Top 3",
    stats: [
      { label: "website clicks (last 90 days)", value: "1,290" },
      { label: "calls from profile (last 90 days)", value: "214" },
      { label: "average Maps rank", value: "#2.1" },
    ],
    sections: [
      {
        heading: "Where it started",
        text: "Capitol Fresh Cleaning already ranked well, but new competitors were opening every month. The goal was to protect its spot in the map pack and turn more of that visibility into booked cleanings.",
      },
      {
        heading: "What changed",
        text: "Weekly posts kept the profile active, every review got a quick and personal reply, and a review-request page with a QR code went out with each finished job. Rank scans flagged any slipping neighborhoods early.",
      },
      {
        heading: "The results",
        text: "The business held an average Maps rank of **#2.1** across its grid. Website clicks from the profile reached **1,290** and calls hit **214** in the latest 90-day window, while its review count grew by more than **40** new reviews.",
      },
    ],
    quote: {
      text: "Holding our spot used to feel like a second job. Now it just happens, and the phone keeps ringing.",
      author: "Co-owner",
      role: "Capitol Fresh Cleaning (sample)",
    },
  },
  {
    slug: "plumber-denver",
    business: "Summit Ridge Plumbing",
    industry: "Plumbing",
    region: "Denver, CO",
    headlineMetric: "+64%",
    headlineCaption: "more calls from Google profile",
    title: "Plumbing Company: +64% Calls After Reaching the Top 3 in Its Core Suburbs",
    summary:
      "A family plumbing company reached the Google Maps top 3 across its core suburbs and saw calls from its profile rise 64% within 90 days.",
    seoTitle: "Plumber Local SEO Case Study (Sample): +64% Calls From Google",
    stats: [
      { label: "calls from profile", value: "+64%" },
      { label: "average Maps rank", value: "#8.7 → #3.1" },
      { label: "new reviews (90 days)", value: "37" },
    ],
    sections: [
      {
        heading: "Where it started",
        text: "Summit Ridge Plumbing did great work but relied on word of mouth. On Google Maps it averaged around #9, so emergency searches in nearby suburbs went to competitors with busier profiles.",
      },
      {
        heading: "What changed",
        text: "The agent rebuilt the profile around high-intent services like water heater repair and drain cleaning, posted three times a week, and requested reviews after every job. Hand-placed citations on trusted trade directories filled the gaps.",
      },
      {
        heading: "The results",
        text: "The average Maps rank improved from **#8.7 to #3.1**, and calls from the profile rose **64%** compared with the previous 90 days. The business also earned **37** new reviews over the same period.",
      },
    ],
    quote: {
      text: "Emergency calls from the suburbs we wanted most started coming in within a couple of months.",
      author: "Owner",
      role: "Summit Ridge Plumbing (sample)",
    },
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
