import type { AppPathname } from "@/i18n/routing";

export type NavItem = {
  href: AppPathname;
  key:
    | "services"
    | "publicSector"
    | "procuring"
    | "about"
    | "contact"
    | "quality"
    | "partnership"
    | "insights";
};

/** Compact primary nav per brief */
export const primaryNav: NavItem[] = [
  { href: "/services", key: "services" },
  { href: "/public-sector", key: "publicSector" },
  { href: "/about", key: "about" },
  { href: "/for-procuring-organizations", key: "procuring" },
];

/** Footer nav split into two columns for symmetry */
export const footerNav1: NavItem[] = [
  { href: "/services", key: "services" },
  { href: "/public-sector", key: "publicSector" },
  { href: "/quality-security", key: "quality" },
  { href: "/partnership", key: "partnership" },
];

export const footerNav2: NavItem[] = [
  { href: "/for-procuring-organizations", key: "procuring" },
  { href: "/about", key: "about" },
  { href: "/insights", key: "insights" },
  { href: "/contact", key: "contact" },
];

/** @deprecated use footerNav1 + footerNav2 */
export const footerNav: NavItem[] = [...footerNav1, ...footerNav2];

export const legalNav = [
  { href: "/privacy" as const, key: "privacy" as const },
  { href: "/cookies" as const, key: "cookies" as const },
];
