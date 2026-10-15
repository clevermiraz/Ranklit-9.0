import { industries, getCity, getIndustry, type City, type Industry } from "./industries";
import { getPostsByTag, tagSlug, type Block } from "./blog";

/* ------------------------------------------------------------------ */
/* Static profiles used to fill the city-guide template                 */
/* ------------------------------------------------------------------ */

type CityProfile = { neighborhoods: string[]; county: string; chamber: string; climate: string };

const cityProfiles: Record<string, CityProfile> = {
  "austin-tx": { neighborhoods: ["South Congress", "Mueller", "Hyde Park", "East Austin"], county: "Travis County", chamber: "Greater Austin Chamber of Commerce", climate: "long, hot Texas summers" },
  "denver-co": { neighborhoods: ["Capitol Hill", "Highlands", "Washington Park", "Stapleton"], county: "Denver County", chamber: "Denver Metro Chamber of Commerce", climate: "sudden spring snowstorms and dry winters" },
  "phoenix-az": { neighborhoods: ["Arcadia", "Ahwatukee", "Downtown Phoenix", "North Mountain"], county: "Maricopa County", chamber: "Greater Phoenix Chamber", climate: "extreme summer heat and monsoon storms" },
  "charlotte-nc": { neighborhoods: ["South End", "Plaza Midwood", "Ballantyne", "NoDa"], county: "Mecklenburg County", chamber: "Charlotte Regional Business Alliance", climate: "humid summers and the odd ice storm" },
  "tampa-fl": { neighborhoods: ["Hyde Park", "Seminole Heights", "Westchase", "Ybor City"], county: "Hillsborough County", chamber: "Tampa Bay Chamber", climate: "hurricane season and year-round humidity" },
  "nashville-tn": { neighborhoods: ["East Nashville", "The Gulch", "Green Hills", "Germantown"], county: "Davidson County", chamber: "Nashville Area Chamber of Commerce", climate: "humid summers and spring storms" },
  "columbus-oh": { neighborhoods: ["German Village", "Short North", "Clintonville", "Grandview Heights"], county: "Franklin County", chamber: "Columbus Chamber of Commerce", climate: "freezing winters and wet springs" },
  "houston-tx": { neighborhoods: ["The Heights", "Montrose", "Katy", "Memorial"], county: "Harris County", chamber: "Greater Houston Partnership", climate: "flood-prone storms and heavy humidity" },
  "atlanta-ga": { neighborhoods: ["Buckhead", "Midtown", "Decatur", "Old Fourth Ward"], county: "Fulton County", chamber: "Metro Atlanta Chamber", climate: "hot summers and occasional hard freezes" },
  "dallas-tx": { neighborhoods: ["Uptown", "Lakewood", "Bishop Arts", "Preston Hollow"], county: "Dallas County", chamber: "Dallas Regional Chamber", climate: "hail season and summer heat waves" },
  "san-diego-ca": { neighborhoods: ["North Park", "La Jolla", "Pacific Beach", "Hillcrest"], county: "San Diego County", chamber: "San Diego Regional Chamber of Commerce", climate: "mild weather and coastal salt air" },
  "orlando-fl": { neighborhoods: ["Winter Park", "College Park", "Lake Nona", "Baldwin Park"], county: "Orange County", chamber: "Orlando Economic Partnership", climate: "summer storms and hurricane season" },
  "oklahoma-city-ok": { neighborhoods: ["Midtown", "Nichols Hills", "Edmond", "Bricktown"], county: "Oklahoma County", chamber: "Greater Oklahoma City Chamber", climate: "tornado season and large hail" },
  "kansas-city-mo": { neighborhoods: ["Brookside", "Waldo", "the Crossroads", "Westport"], county: "Jackson County", chamber: "Greater Kansas City Chamber of Commerce", climate: "spring hail and cold snaps" },
  "fort-worth-tx": { neighborhoods: ["Tanglewood", "Near Southside", "Alliance", "Arlington Heights"], county: "Tarrant County", chamber: "Fort Worth Chamber of Commerce", climate: "hailstorms and summer heat" },
  "raleigh-nc": { neighborhoods: ["Five Points", "North Hills", "Oakwood", "Brier Creek"], county: "Wake County", chamber: "Raleigh Chamber", climate: "summer thunderstorms and tropical systems" },
  "omaha-ne": { neighborhoods: ["Dundee", "Benson", "Elkhorn", "Midtown Crossing"], county: "Douglas County", chamber: "Greater Omaha Chamber", climate: "hail, high winds and harsh winters" },
  "las-vegas-nv": { neighborhoods: ["Summerlin", "Henderson", "Spring Valley", "Centennial Hills"], county: "Clark County", chamber: "Vegas Chamber", climate: "triple-digit summers and dust storms" },
  "san-antonio-tx": { neighborhoods: ["Alamo Heights", "Stone Oak", "Southtown", "Leon Valley"], county: "Bexar County", chamber: "San Antonio Chamber of Commerce", climate: "long summers and flash floods" },
  "jacksonville-fl": { neighborhoods: ["Riverside", "San Marco", "Mandarin", "Jacksonville Beach"], county: "Duval County", chamber: "JAX Chamber", climate: "humid summers and tropical storms" },
  "scottsdale-az": { neighborhoods: ["Old Town", "McCormick Ranch", "Gainey Ranch", "North Scottsdale"], county: "Maricopa County", chamber: "Scottsdale Area Chamber of Commerce", climate: "desert heat and an active outdoor lifestyle" },
  "boise-id": { neighborhoods: ["the North End", "Bench", "Harris Ranch", "Meridian"], county: "Ada County", chamber: "Boise Metro Chamber", climate: "cold winters and dry summers" },
  "salt-lake-city-ut": { neighborhoods: ["Sugar House", "the Avenues", "Liberty Wells", "Millcreek"], county: "Salt Lake County", chamber: "Salt Lake Chamber", climate: "snowy winters and a ski-season crowd" },
  "indianapolis-in": { neighborhoods: ["Broad Ripple", "Fountain Square", "Irvington", "Carmel"], county: "Marion County", chamber: "Indy Chamber", climate: "icy winters and humid summers" },
  "louisville-ky": { neighborhoods: ["the Highlands", "Germantown", "St. Matthews", "Crescent Hill"], county: "Jefferson County", chamber: "Greater Louisville Inc.", climate: "pothole-heavy winters and humid summers" },
  "sacramento-ca": { neighborhoods: ["Midtown", "East Sacramento", "Land Park", "Natomas"], county: "Sacramento County", chamber: "Sacramento Metro Chamber", climate: "hot, dry summers and wildfire smoke" },
  "tulsa-ok": { neighborhoods: ["Brookside", "Cherry Street", "Maple Ridge", "South Tulsa"], county: "Tulsa County", chamber: "Tulsa Regional Chamber", climate: "storm season and summer drought" },
  "richmond-va": { neighborhoods: ["the Fan", "Church Hill", "Scott's Addition", "Carytown"], county: "Henrico County", chamber: "ChamberRVA", climate: "humid summers and mild winters" },
};

const fallbackCity: CityProfile = { neighborhoods: ["downtown", "the north side", "the south side", "nearby suburbs"], county: "the county", chamber: "the local chamber of commerce", climate: "seasonal weather swings" };

type IndustryProfile = {
  primaryCategory: string;
  secondaryCategories: string[];
  directories: string[];
  contentIdeas: (city: City, climate: string) => string[];
  nameStems: string[];
  urgent: string;
};

const industryProfiles: Record<string, IndustryProfile> = {
  dentists: {
    primaryCategory: "Dentist",
    secondaryCategories: ["Cosmetic dentist", "Emergency dental service", "Pediatric dentist"],
    directories: ["Healthgrades", "Zocdoc", "Yelp", "WebMD Care", "Better Business Bureau", "Bing Places"],
    contentIdeas: (c) => [`What a first visit costs at a ${c.name} dental office`, "Same-day emergency dental care: what counts as urgent", "Insurance plans accepted and payment options explained", `Teeth whitening vs. veneers for ${c.name} patients`, "How often kids should see the dentist"],
    nameStems: ["Dental", "Family Dentistry", "Smile Studio", "Dental Care", "Dental Group"],
    urgent: "same-day and emergency appointments",
  },
  plumbers: {
    primaryCategory: "Plumber",
    secondaryCategories: ["Drain cleaning service", "Water heater installation service", "Emergency plumber"],
    directories: ["Angi", "HomeAdvisor", "Thumbtack", "Yelp", "Better Business Bureau", "Nextdoor"],
    contentIdeas: (c, climate) => [`How ${climate} affect pipes in ${c.name} homes`, "Signs your water heater is about to fail", "What to do in the first ten minutes of a burst pipe", `Older-home plumbing problems common in ${c.name}`, "Tank vs. tankless water heaters: a cost breakdown"],
    nameStems: ["Plumbing", "Rooter", "Plumbing & Drain", "Plumbing Co.", "Pipe Pros"],
    urgent: "24/7 emergency calls",
  },
  roofers: {
    primaryCategory: "Roofing contractor",
    secondaryCategories: ["Roofing service", "Gutter service", "Siding contractor"],
    directories: ["Angi", "HomeAdvisor", "GAF or Owens Corning contractor finders", "Yelp", "Better Business Bureau", "Nextdoor"],
    contentIdeas: (c, climate) => [`Roof inspections after ${climate}`, "How insurance claims for storm damage work", "Asphalt vs. metal roofing: lifespan and cost", `Permit rules for re-roofing in ${c.name}`, "How to spot a storm-chasing roofer"],
    nameStems: ["Roofing", "Roofing & Exteriors", "Roof Pros", "Roofing Co.", "Restoration"],
    urgent: "storm damage and leak repairs",
  },
  hvac: {
    primaryCategory: "HVAC contractor",
    secondaryCategories: ["Air conditioning repair service", "Furnace repair service", "Heating contractor"],
    directories: ["Angi", "HomeAdvisor", "Thumbtack", "Yelp", "Better Business Bureau", "manufacturer dealer locators"],
    contentIdeas: (c, climate) => [`Getting your system ready for ${climate}`, "Repair or replace: when an old AC isn't worth fixing", "Heat pump rebates and tax credits explained", `What a tune-up includes and what it costs in ${c.name}`, "Why your AC runs but won't cool"],
    nameStems: ["Heating & Air", "Air Conditioning", "Comfort Systems", "HVAC", "Climate Control"],
    urgent: "no-cool and no-heat emergencies",
  },
  chiropractors: {
    primaryCategory: "Chiropractor",
    secondaryCategories: ["Sports medicine clinic", "Physical therapy clinic", "Massage therapist"],
    directories: ["Healthgrades", "Zocdoc", "Yelp", "Vitals", "Better Business Bureau", "Bing Places"],
    contentIdeas: (c) => [`What to expect at a first chiropractic visit in ${c.name}`, "Chiropractic care after a car accident", "Desk-job back pain: simple fixes between visits", "Does insurance cover chiropractic care?", "Sports injuries we see most often"],
    nameStems: ["Chiropractic", "Spine & Wellness", "Family Chiropractic", "Chiropractic Center", "Back & Neck Clinic"],
    urgent: "same-week new-patient visits",
  },
  "auto-repair": {
    primaryCategory: "Auto repair shop",
    secondaryCategories: ["Brake shop", "Oil change service", "Car inspection station"],
    directories: ["RepairPal", "CarFax service locator", "Yelp", "Better Business Bureau", "AAA approved auto repair", "Nextdoor"],
    contentIdeas: (c, climate) => [`Car maintenance before ${climate}`, "What a check engine light usually means", "How to tell if your brakes need attention", `State inspection requirements for ${c.name} drivers`, "Dealer vs. independent shop: what you really pay"],
    nameStems: ["Auto Repair", "Automotive", "Auto Care", "Car Care", "Motor Works"],
    urgent: "same-day diagnostics",
  },
  electricians: {
    primaryCategory: "Electrician",
    secondaryCategories: ["Electrical installation service", "Lighting contractor", "EV charging station installer"],
    directories: ["Angi", "HomeAdvisor", "Thumbtack", "Yelp", "Better Business Bureau", "Nextdoor"],
    contentIdeas: (c) => [`Panel upgrades for older ${c.name} homes`, "Installing a home EV charger: costs and permits", "Warning signs of faulty wiring", "Whole-home surge protection explained", "Generator hookups for power outages"],
    nameStems: ["Electric", "Electrical Services", "Electric Co.", "Power & Light", "Wiring Pros"],
    urgent: "emergency electrical repairs",
  },
  landscapers: {
    primaryCategory: "Landscaper",
    secondaryCategories: ["Lawn care service", "Landscape designer", "Tree service"],
    directories: ["Angi", "HomeAdvisor", "Thumbtack", "Yelp", "Better Business Bureau", "Nextdoor"],
    contentIdeas: (c, climate) => [`Lawn care calendar for ${climate}`, `Native plants that thrive in ${c.name}`, "What a landscape design project really costs", "Irrigation tips to cut water bills", "Spring cleanup checklist"],
    nameStems: ["Landscaping", "Lawn & Garden", "Outdoor Living", "Landscape Co.", "Green Works"],
    urgent: "seasonal cleanups and recurring lawn care",
  },
};

/* ------------------------------------------------------------------ */
/* Deterministic mock scan data                                         */
/* ------------------------------------------------------------------ */

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small seeded PRNG so every guide gets stable numbers between builds. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const surnames = ["Baxter", "Holloway", "Navarro", "Whitfield", "Okafor", "Lindqvist", "Delgado", "Brennan", "Castellano", "Hargrove", "Pruitt", "Mercer", "Ashford", "Kowalski", "Tran", "Gallagher"];
const adjectives = ["Blue Ridge", "True North", "Summit", "Keystone", "Bright Line", "Evergreen", "Ironwood", "Crescent", "Patriot", "Lone Oak", "Red Oak", "Silver Creek"];

export type ScanBusiness = { name: string; rating: number; reviews: number; cells: number };
export type CityScan = { competitors: number; avgRating: number; avgReviews: number; gridCells: number; top: ScanBusiness[] };

function buildScan(industry: Industry, city: City): CityScan {
  const rand = seeded(hash(`${industry.slug}:${city.slug}`));
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];
  const stems = industryProfiles[industry.slug]?.nameStems ?? [industry.name];
  const used = new Set<string>();
  const makeName = (): string => {
    const stem = pick(stems);
    const patterns = [`${pick(surnames)} ${stem}`, `${pick(adjectives)} ${stem}`, `${city.name} ${stem}`, `${pick(surnames)} & Sons ${stem}`, `${pick(surnames)} & ${pick(surnames)} ${stem}`];
    const name = pick(patterns);
    if (used.has(name)) return makeName();
    used.add(name);
    return name;
  };

  const gridCells = 25;
  const competitors = 18 + Math.floor(rand() * 32);
  const cellCounts = [13 + Math.floor(rand() * 7), 10 + Math.floor(rand() * 4), 8 + Math.floor(rand() * 3), 6 + Math.floor(rand() * 3), 4 + Math.floor(rand() * 3), 2 + Math.floor(rand() * 3)];
  const top: ScanBusiness[] = cellCounts.map((cells) => ({
    name: makeName(),
    cells,
    rating: Math.round((4.3 + rand() * 0.6) * 10) / 10,
    reviews: 80 + Math.floor(rand() * 320),
  }));
  // Story beats: the leader wins with few reviews, a review-heavy profile sits low,
  // and one lower-rated business still makes the top four.
  top[0].reviews = 40 + Math.floor(rand() * 70);
  top[0].rating = 4.9;
  top[5].reviews = 450 + Math.floor(rand() * 500);
  top[5].rating = 4.8;
  top[3].rating = Math.round((3.4 + rand() * 0.4) * 10) / 10;

  return {
    competitors,
    gridCells,
    avgRating: Math.round((4.4 + rand() * 0.3) * 10) / 10,
    avgReviews: 150 + Math.floor(rand() * 250),
    top,
  };
}

/* ------------------------------------------------------------------ */
/* Naming helpers                                                       */
/* ------------------------------------------------------------------ */

/** "Plumbers" -> "plumbers", but keep acronyms like "HVAC". */
export function lowerName(name: string) {
  return name === name.toUpperCase() ? name : name.toLowerCase();
}

export const cityLabel = (city: City) => `${city.name}, ${city.state}`;
export const guideHref = (industry: Industry, city: City) => `/local-seo/${industry.slug}/${city.slug}`;
export const guideTitle = (industry: Industry, city: City) => `Local SEO for ${industry.name} in ${cityLabel(city)}`;

export type GuideLink = { title: string; href: string };

/* ------------------------------------------------------------------ */
/* Hub categories: industries, cities, topics                          */
/* ------------------------------------------------------------------ */

export type CityRegion = City & { industries: Industry[] };

/** Every city that has at least one guide, with the industries covering it. */
export function getAllCities(): CityRegion[] {
  const map = new Map<string, CityRegion>();
  for (const industry of industries) {
    for (const city of industry.cities) {
      const entry = map.get(city.slug) ?? { ...city, industries: [] };
      entry.industries.push(industry);
      map.set(city.slug, entry);
    }
  }
  return [...map.values()];
}

type Topic = { slug: string; name: string; tag: string; description: string };

const topics: Topic[] = [
  { slug: "google-business-profile", name: "Google Business Profile", tag: "google business profile", description: "Setting up, completing and keeping your Business Profile in shape, the single biggest lever for map rankings." },
  { slug: "google-maps", name: "Google Maps SEO", tag: "google maps ranking", description: "How the map pack decides who shows up, and the practical work that moves you up it." },
  { slug: "google-reviews", name: "Google reviews", tag: "reviews", description: "Asking for, replying to and protecting reviews, the reputation signals customers and Google both read." },
  { slug: "rank-tracking", name: "Rank tracking", tag: "rank tracking", description: "Geo-grids, heatmaps and keyword tracking so you know where you rank, not just near your front door." },
  { slug: "citations", name: "Citations", tag: "citations", description: "Directory listings and NAP consistency, so Google trusts your name, address and phone number." },
  { slug: "local-seo-audits", name: "Local SEO audits", tag: "local seo audit", description: "Checklists and audit walkthroughs that turn a messy listing into a prioritized fix list." },
  { slug: "schema-markup", name: "Schema markup", tag: "schema markup", description: "Structured data for local businesses: what to add, what to skip and how to test it." },
  { slug: "for-agencies", name: "For agencies", tag: "agencies", description: "Reporting, rank tracking and delivery playbooks for agencies running local SEO for clients." },
];

export type CategoryKind = "industry" | "city" | "topic";

export type Category = {
  kind: CategoryKind;
  slug: string;
  /** short card title, e.g. "Plumbers" or "Austin, TX" */
  name: string;
  /** page H1 */
  title: string;
  description: string;
  guides: GuideLink[];
};

function industryCategory(industry: Industry): Category {
  return {
    kind: "industry",
    slug: industry.slug,
    name: industry.name,
    title: `Local SEO for ${lowerName(industry.name)}`,
    description: industry.description,
    guides: industry.cities
      .map((city) => ({ title: guideTitle(industry, city), href: guideHref(industry, city) }))
      .sort((a, b) => a.title.localeCompare(b.title)),
  };
}

function cityCategory(city: CityRegion): Category {
  return {
    kind: "city",
    slug: city.slug,
    name: cityLabel(city),
    title: `Local SEO in ${cityLabel(city)}`,
    description: `Local SEO guides for ${city.industries.map((i) => lowerName(i.name)).join(", ").replace(/, ([^,]*)$/, " and $1")} competing on Google Maps in ${cityLabel(city)}.`,
    guides: city.industries.map((industry) => ({ title: guideTitle(industry, city), href: guideHref(industry, city) })).sort((a, b) => a.title.localeCompare(b.title)),
  };
}

function topicCategory(topic: Topic): Category {
  return {
    kind: "topic",
    slug: topic.slug,
    name: topic.name,
    title: topic.name,
    description: topic.description,
    guides: getPostsByTag(tagSlug(topic.tag)).map((p) => ({ title: p.title, href: `/blog/${p.slug}` })),
  };
}

const byCount = (a: Category, b: Category) => b.guides.length - a.guides.length || a.name.localeCompare(b.name);

export function getIndustryCategories() {
  return industries.map(industryCategory).sort(byCount);
}

export function getCityCategories() {
  return getAllCities().map(cityCategory).sort(byCount);
}

export function getTopicCategories() {
  return topics.map(topicCategory).filter((t) => t.guides.length > 0).sort(byCount);
}

export function getAllCategories() {
  return [...getIndustryCategories(), ...getCityCategories(), ...getTopicCategories()];
}

export function getCategory(slug: string) {
  return getAllCategories().find((c) => c.slug === slug);
}

/* ------------------------------------------------------------------ */
/* City guide template                                                  */
/* ------------------------------------------------------------------ */

export type CityGuide = {
  industry: Industry;
  city: City;
  title: string;
  description: string;
  scan: CityScan;
  blocks: Block[];
  related: GuideLink[];
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function getAllGuideParams() {
  return industries.flatMap((industry) => industry.cities.map((city) => ({ industry: industry.slug, city: city.slug })));
}

export function getCityGuide(industrySlug: string, citySlug: string): CityGuide | undefined {
  const industry = getIndustry(industrySlug);
  const city = industry && getCity(industry, citySlug);
  if (!industry || !city) return undefined;

  const profile = industryProfiles[industry.slug];
  const place = cityProfiles[city.slug] ?? fallbackCity;
  const scan = buildScan(industry, city);
  const [leader, second, third, lowRated, fifth, reviewHeavy] = scan.top;
  const label = cityLabel(city);
  // "plumbers", but "HVAC companies" so sentences read naturally
  const trade = industry.name === industry.name.toUpperCase() ? `${industry.name} companies` : lowerName(industry.name);
  const singular = industry.singular;
  const [n1, n2, n3, n4] = place.neighborhoods;
  const k = industry.keywords;

  const description = `How ${trade} in ${label} can climb the Google Maps pack: profile setup, reviews, citations and content, with a snapshot of the ${scan.competitors} competitors in the market.`;

  const otherCities = industry.cities.filter((c) => c.slug !== city.slug);
  const sameCity = industries.filter((i) => i.slug !== industry.slug && i.cities.some((c) => c.slug === city.slug));

  const blocks: Block[] = [
    { type: "h2", text: `The ${city.name} ${singular} market at a glance` },
    {
      type: "p",
      text: `Our latest grid scan picked up **${scan.competitors} ${trade}** competing for map visibility across ${label}. The field is busy but not locked up: the average business holds a ${scan.avgRating}-star rating with roughly ${scan.avgReviews} reviews, which means good service alone no longer sets anyone apart.`,
    },
    {
      type: "p",
      text: `The leaderboard tells a more interesting story. ${leader.name} shows up in ${leader.cells} of ${scan.gridCells} map points with just ${leader.reviews} reviews, while ${reviewHeavy.name} has ${reviewHeavy.reviews} reviews and still appears in only ${reviewHeavy.cells}. Review count matters, but it is clearly not the whole game. Profile completeness, relevance and [consistent local signals](/blog/local-seo-audit-checklist) are doing a lot of the work.`,
    },
    {
      type: "p",
      text: `${second.name} and ${third.name} hold steady coverage behind the leader, and ${lowRated.name} makes the top four with a ${lowRated.rating}-star average. If a lower-rated competitor can rank there, a well-run ${singular} with a tidy profile can too. [Check where you rank today](/rank-tracker) before you change anything, so you can measure what moves.`,
    },

    { type: "h2", text: `Google Business Profile setup for ${trade} in ${city.name}` },
    {
      type: "p",
      text: `Your Business Profile is what people see when they search "${k[0]}" from a phone in ${city.name}. Google's own [guidance on local ranking](https://support.google.com/business/answer/7091) is clear that complete, accurate information helps you show up for the right searches.`,
    },
    { type: "h3", text: "Profile fields that matter most" },
    {
      type: "ul",
      items: [
        "Business name exactly as it appears on your signage, with no added keywords",
        `Primary category: "${profile.primaryCategory}"`,
        `Secondary categories such as ${profile.secondaryCategories.map((c) => `"${c}"`).join(", ")}`,
        `A service area that covers ${n1}, ${n2}, ${n3} and the rest of ${place.county}`,
        `Opening hours, including ${profile.urgent} if you offer them`,
        "Real photos of your team, your work and your premises, refreshed every month",
      ],
    },
    { type: "h3", text: "Make the profile unmistakably local" },
    {
      type: "p",
      text: `Write a description that names the parts of ${city.name} you actually serve, such as ${n1}, ${n2} and ${n4}. Mentioning real neighborhoods helps Google connect your listing to searches made there, and it reassures customers that you know the area.`,
    },
    {
      type: "p",
      text: `Use services, products and attributes to list what you do in plain words, and post an update at least once a week. Ranklit drafts and publishes these updates for you and keeps the profile in sync with your website, so it never goes stale while you are on a job.`,
    },

    { type: "h2", text: "Reviews: recency and detail beat raw volume" },
    {
      type: "p",
      text: `With ${city.name} ${trade} averaging ${scan.avgRating} stars, a good rating is the minimum, not the edge. The edge is a steady flow of fresh, specific reviews and replies that show a real person is paying attention.`,
    },
    { type: "h3", text: "Build a steady review rhythm" },
    {
      type: "ul",
      items: [
        "Ask at the moment the customer is happiest, right after the job or visit",
        "Send a direct link to your Google review form by text or email",
        "Make asking part of the team routine, not a quarterly campaign",
        "Reply to every review, good or bad, within two days",
      ],
    },
    { type: "h3", text: "Reply like a local business" },
    {
      type: "p",
      text: `Mention the service you provided and, where appropriate, the neighborhood. A reply such as "Glad we could sort out the ${k[2] ?? k[0]} in ${n2}" reads as genuine and quietly adds local relevance. Never offer discounts or gifts in exchange for reviews; Google's [review policies](https://support.google.com/contributionpolicy/answer/7400114) prohibit it.`,
    },
    { type: "callout", label: "Pro tip", text: `Customers reading reviews in ${city.name} often decide on the replies, not the stars. One thoughtful response to a negative review can win more calls than five extra five-star ratings.` },

    { type: "h2", text: "Citations and NAP consistency" },
    {
      type: "p",
      text: "Citations are listings of your business name, address and phone number (NAP) on other sites. When they disagree, Google trusts your details less and customers end up calling old numbers.",
    },
    { type: "h3", text: "Where to get listed first" },
    { type: "ul", items: [...profile.directories, place.chamber] },
    { type: "h3", text: "Keep every listing identical" },
    {
      type: "p",
      text: `Pick one format for your address and phone number and use it everywhere, down to "Suite" versus "Ste". Clean up duplicates and old addresses before adding new listings. Our free [citation consistency analyzer](/tools/citation-consistency-analyzer) shows mismatches in one pass.`,
    },

    { type: "h2", text: "Website, schema and mobile speed" },
    {
      type: "p",
      text: `Your website backs up everything your profile claims. Follow the basics in [Google Search Essentials](https://developers.google.com/search/docs/essentials), then add [LocalBusiness schema](https://schema.org/LocalBusiness) so search engines can read your details without guessing.`,
    },
    { type: "h3", text: "LocalBusiness schema essentials" },
    {
      type: "ul",
      items: ["Business name, address and phone number matching your profile", `Service area covering ${city.name} and ${place.county}`, "Opening hours, including any after-hours availability", `Services offered, such as ${k.slice(1, 4).join(", ")}`, "Accepted payment methods and price range"],
    },
    { type: "h3", text: "Built for phone searches" },
    {
      type: "p",
      text: `Most "${k[0]}" searches in ${city.name} happen on a phone, often in a hurry. Keep pages fast, put a click-to-call button at the top of every page and make your service area obvious within the first screen.`,
    },

    { type: "h2", text: `Content that earns relevance in ${city.name}` },
    {
      type: "p",
      text: `Local content gives Google more reasons to show you for long-tail searches like "${k[1] ?? k[0]} ${city.name.toLowerCase()}" or "${k[2] ?? k[0]} near ${n1}". Write for the questions customers actually ask.`,
    },
    { type: "h3", text: "Topics that tend to convert" },
    { type: "ul", items: profile.contentIdeas(city, place.climate) },
    { type: "h3", text: "Neighborhood pages done properly" },
    {
      type: "p",
      text: `A page for each area you serve can help, as long as each one is genuinely useful: real projects in ${n3}, local driving times, permits or details that differ across ${place.county}. Thin copies with the town name swapped are more likely to hurt than help. See our guide to [service area pages](/blog/service-area-pages) for a safe structure.`,
    },

    { type: "h2", text: "Reading the competition" },
    {
      type: "p",
      text: `Look at where each competitor appears on the map, not only at the top spot. ${fifth.name} appears in ${plural(fifth.cells, "map point")}, which leaves parts of ${city.name} with weak coverage from established names. Those gaps are usually the fastest wins.`,
    },
    { type: "h3", text: "Advantages worth highlighting" },
    { type: "ul", items: ["Faster response times or same-day availability", "Services the top-ranked businesses do not list", "Clear, upfront pricing or financing options", "Licenses, certifications and warranties", "Photos and reviews that mention specific neighborhoods"] },
    {
      type: "p",
      text: `Our [local competitor analysis tool](/tools/local-competitor-analysis-tool) compares categories, reviews and profile completeness side by side, so you can see exactly what the leaders have that you do not.`,
    },

    { type: "h2", text: "Putting it on autopilot with Ranklit" },
    {
      type: "p",
      text: `Doing all of this by hand takes hours every week, and with ${scan.competitors} competitors in ${city.name} the businesses that stay consistent are the ones that climb. Ranklit is an AI agent that optimizes your Google Business Profile, posts updates, replies to reviews, builds citations and tracks your map rank across your whole service area.`,
    },
    { type: "p", text: `[See plans and pricing](/pricing) to put it to work for your ${singular} business in ${city.name}.` },

    { type: "h2", text: "Frequently asked questions" },
    { type: "p", text: `**Q: How long does local SEO take for ${trade} in ${city.name}?**` },
    { type: "p", text: `A: Most businesses notice early movement within 30 to 60 days, with larger gains over three to six months. How complete your profile is, how quickly you earn reviews and how crowded your part of ${city.name} is all change the timeline.` },
    { type: "p", text: `**Q: Why do some ${city.name} ${trade} with fewer reviews rank higher?**` },
    { type: "p", text: `A: Reviews are one signal among many. ${leader.name} ranks widely with ${leader.reviews} reviews because relevance, distance and profile quality also count. A complete, consistent profile can outrank a bigger review count.` },
    { type: "p", text: `**Q: Should I target specific ${city.name} neighborhoods?**` },
    { type: "p", text: `A: Yes. Mentioning areas like ${n1}, ${n2} and ${n4} in your profile, replies and website content helps you show up for searches made there, especially where competitors have weak coverage.` },

    { type: "h2", text: "Key takeaways" },
    {
      type: "ul",
      items: [
        `${label} has ${scan.competitors} active ${trade} on Google Maps, so consistency is what separates the leaders`,
        "A complete Business Profile and identical NAP details everywhere are the foundation",
        "Fresh, detailed reviews and thoughtful replies matter more than total review count",
        `Neighborhood-level content helps you win searches across ${place.county}`,
        "Schema markup and a fast, mobile-friendly site support everything else",
        "Map-wide rank tracking shows where competitors are weak and where to focus next",
      ],
    },
    { type: "p", text: `Ready to win more ${city.name} searches? [See our plans and pricing](/pricing) and let Ranklit handle the weekly work.` },

    { type: "h2", text: `Top ${industry.name} ranking in ${city.name} right now` },
    {
      type: "table",
      head: ["#", "Business", "Rating", "Reviews"],
      rows: scan.top.map((b, i) => [String(i + 1), b.name, `${b.rating.toFixed(1)}★`, `${b.reviews} reviews`]),
      caption: `Illustrative snapshot from a Ranklit grid scan across ${scan.gridCells} map points: ${scan.competitors} businesses seen.`,
    },
  ];

  if (otherCities.length > 0 || sameCity.length > 0) {
    blocks.push({ type: "h2", text: "Related local SEO guides" });
    if (otherCities.length > 0) {
      blocks.push({ type: "h3", text: `More ${trade} in other cities` });
      blocks.push({ type: "ul", items: otherCities.slice(0, 4).map((c) => `[${guideTitle(industry, c)}](${guideHref(industry, c)})`) });
    }
    if (sameCity.length > 0) {
      blocks.push({ type: "h3", text: `Other trades in ${city.name}` });
      blocks.push({ type: "ul", items: sameCity.map((i) => `[${guideTitle(i, city)}](${guideHref(i, city)})`) });
    }
  }

  const related: GuideLink[] = [
    ...otherCities.slice(0, 3).map((c) => ({ title: guideTitle(industry, c), href: guideHref(industry, c) })),
    ...sameCity.slice(0, 2).map((i) => ({ title: guideTitle(i, city), href: guideHref(i, city) })),
    { title: "Local SEO Audit Checklist", href: "/blog/local-seo-audit-checklist" },
  ];

  return { industry, city, title: guideTitle(industry, city), description, scan, blocks, related };
}
