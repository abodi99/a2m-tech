import { localeUrl } from "@/lib/locale-url";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

export default function sitemap() {
  return routing.locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, localeUrl(l)])
      ),
    },
  }));
}
