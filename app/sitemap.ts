import { SITE_URL } from "@/lib/constants";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

export default function sitemap() {
  const locales = routing.locales;

  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/`])
      ),
    },
  }));
}
