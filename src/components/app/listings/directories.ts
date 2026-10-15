// Directory coverage model for the Directory Listings page. Pure + deterministic, safe anywhere.

export type ListingStatus = "synced" | "needs-update" | "duplicate";

export type DirectoryListing = {
  name: string;
  domain: string;
  reach: "Essential" | "High" | "Medium";
  status: ListingStatus;
  issue: string | null;
};

export const DIRECTORIES: { name: string; domain: string; reach: DirectoryListing["reach"] }[] = [
  { name: "Google", domain: "google.com", reach: "Essential" },
  { name: "Apple Maps", domain: "maps.apple.com", reach: "Essential" },
  { name: "Bing Places", domain: "bingplaces.com", reach: "Essential" },
  { name: "Yelp", domain: "yelp.com", reach: "Essential" },
  { name: "Facebook", domain: "facebook.com", reach: "High" },
  { name: "Yellow Pages", domain: "yellowpages.com", reach: "High" },
  { name: "Foursquare", domain: "foursquare.com", reach: "High" },
  { name: "BBB", domain: "bbb.org", reach: "High" },
  { name: "Nextdoor", domain: "nextdoor.com", reach: "High" },
  { name: "MapQuest", domain: "mapquest.com", reach: "Medium" },
  { name: "Angi", domain: "angi.com", reach: "Medium" },
  { name: "Superpages", domain: "superpages.com", reach: "Medium" },
  { name: "Manta", domain: "manta.com", reach: "Medium" },
  { name: "Hotfrog", domain: "hotfrog.com", reach: "Medium" },
  { name: "CitySquares", domain: "citysquares.com", reach: "Medium" },
];

const ISSUES = [
  "Phone number doesn't match your Google profile",
  "Opening hours missing",
  "Old address on file",
  "Business name spelled differently",
  "Website link missing",
  "Category doesn't match",
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}

/** Status per directory, derived from the business id; directories in `synced` were fixed by the user. */
export function directoryCoverage(businessId: string, connected: boolean, synced: string[]): DirectoryListing[] {
  return DIRECTORIES.map((d) => {
    const r = hash(`${businessId}:${d.name}`);
    let status: ListingStatus = r < 0.5 ? "synced" : r < 0.82 ? "needs-update" : "duplicate";
    let issue: string | null = null;
    if (d.name === "Google") status = connected ? "synced" : "needs-update";
    if (status === "needs-update") issue = d.name === "Google" ? "Google profile not connected yet" : ISSUES[Math.floor(hash(`${d.name}:${businessId}`) * ISSUES.length)];
    if (status === "duplicate") issue = `${2 + Math.floor(r * 10) % 2} listings found for your business`;
    if (synced.includes(d.name) && (d.name !== "Google" || connected)) {
      status = "synced";
      issue = null;
    }
    return { ...d, status, issue };
  });
}

export function consistencyScore(rows: DirectoryListing[]) {
  return rows.length ? Math.round((rows.filter((r) => r.status === "synced").length / rows.length) * 100) : 0;
}
