import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

export function localePath(locale: string): string {
  if (locale === routing.defaultLocale) {
    return "/";
  }

  return `/${locale}/`;
}

export function localeUrl(locale: string): string {
  const path = localePath(locale);
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
