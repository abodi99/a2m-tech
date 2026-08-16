import type { MetadataRoute } from "next";
import { routing, type AppPathname } from "@/i18n/routing";
import { absoluteLocalizedUrl } from "@/lib/locale-url";

const pathnames: AppPathname[] = [
  "/",
  "/services",
  "/public-sector",
  "/delivery-capability",
  "/quality-security",
  "/for-procuring-organizations",
  "/partnership",
  "/about",
  "/insights",
  "/contact",
  "/privacy",
  "/cookies",
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-16");

  return pathnames.flatMap((pathname) =>
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
}
