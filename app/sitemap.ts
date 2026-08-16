import type { MetadataRoute } from "next";
import { routing, type AppPathname } from "@/i18n/routing";
import { absoluteLocalizedUrl } from "@/lib/locale-url";
import { demoCases } from "@/content/demo-cases";
import { getPublishedArticles, crossRefMap } from "@/content/insights-articles";

const pathnames: AppPathname[] = [
  "/",
  "/services",
  "/public-sector",
  "/quality-security",
  "/for-procuring-organizations",
  "/partnership",
  "/about",
  "/insights",
  "/contact",
  "/privacy",
  "/cookies",
  "/cases",
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-16");

  const staticEntries = pathnames.flatMap((pathname) =>
    routing.locales.map((locale) => ({
      url: absoluteLocalizedUrl(locale, pathname),
      lastModified,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((loc) => [
            loc,
            absoluteLocalizedUrl(loc, pathname),
          ]),
          ["x-default", absoluteLocalizedUrl(routing.defaultLocale, pathname)],
        ]),
      },
    }))
  );

  // Demo case pages – marked noindex in metadata, but included for crawlability
  const caseEntries = demoCases.flatMap((c) =>
    routing.locales.map((locale) => ({
      url: `https://a2m-tech.com/${locale}/cases/${c.slug}`,
      lastModified,
    }))
  );

  // Insight article pages with hreflang alternates
  const svArticles = getPublishedArticles("sv");
  const insightEntries = svArticles.flatMap((svArticle) => {
    const enSlug =
      crossRefMap.svToEn[svArticle.slug as keyof typeof crossRefMap.svToEn];
    const svUrl = `https://a2m-tech.com/sv/insikter/${svArticle.slug}`;
    const enUrl = enSlug
      ? `https://a2m-tech.com/en/insights/${enSlug}`
      : null;

    const entries: MetadataRoute.Sitemap[number][] = [
      {
        url: svUrl,
        lastModified: new Date(svArticle.publishedAt),
        alternates: {
          languages: {
            sv: svUrl,
            ...(enUrl ? { en: enUrl } : {}),
            "x-default": svUrl,
          },
        },
      },
    ];

    if (enUrl) {
      entries.push({
        url: enUrl,
        lastModified: new Date(svArticle.publishedAt),
        alternates: {
          languages: {
            sv: svUrl,
            en: enUrl,
            "x-default": svUrl,
          },
        },
      });
    }

    return entries;
  });

  return [...staticEntries, ...caseEntries, ...insightEntries];
}
