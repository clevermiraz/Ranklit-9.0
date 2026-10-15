import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts, getAllTags } from "@/lib/data/blog";
import { getAllCategories, getAllGuideParams } from "@/lib/data/guides";
import { caseStudies } from "@/lib/data/case-studies";
import { tools } from "@/lib/data/tools";

const staticRoutes = [
  "",
  "/features",
  "/pricing",
  "/agencies",
  "/agencies/pricing",
  "/local-business",
  "/rank-tracker",
  "/case-studies",
  "/tools",
  "/blog",
  "/local-seo",
  "/about",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    ...staticRoutes.map((p) => ({ url: url(p) })),
    ...getAllPosts().map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: p.date })),
    ...getAllTags().map((t) => ({ url: url(`/blog/tag/${t.slug}`) })),
    ...getAllCategories().map((c) => ({ url: url(`/local-seo/${c.slug}`) })),
    ...getAllGuideParams().map((g) => ({ url: url(`/local-seo/${g.industry}/${g.city}`) })),
    ...caseStudies.map((c) => ({ url: url(`/case-studies/${c.slug}`) })),
    ...tools.map((t) => ({ url: url(`/tools/${t.slug}`) })),
  ];
}
