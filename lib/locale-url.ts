import { routing, type AppPathname } from "@/i18n/routing";
import { SITE_URL } from "@/content/site";

/** Absolute site path for a locale home, always prefixed. */
export function localePath(locale: string): string {
  return `/${locale}/`;
}

export function localeUrl(locale: string): string {
  return `${SITE_URL}${localePath(locale)}`;
}

/** Localized public path for a shared pathname key. */
export function localizedPath(locale: string, pathname: AppPathname): string {
  const entry = routing.pathnames[pathname];
  if (typeof entry === "string") {
    return `/${locale}${entry === "/" ? "/" : `${entry}/`}`;
  }

  const localized = entry[locale as "sv" | "en"] ?? entry.en;
  return `/${locale}${localized}/`;
}

export function absoluteLocalizedUrl(
  locale: string,
  pathname: AppPathname
): string {
  const path = localizedPath(locale, pathname);
  return `${SITE_URL}${path}`;
}
