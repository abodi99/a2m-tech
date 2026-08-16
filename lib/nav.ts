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
    | "insights"
    | "cases"
    | "investors";
};

/** Primary navigation – concise and purposeful */
export const primaryNav: NavItem[] = [
  { href: "/public-sector", key: "publicSector" },
  { href: "/quality-security", key: "quality" },
  { href: "/insights", key: "insights" },
  { href: "/for-procuring-organizations", key: "procuring" },
  { href: "/investors", key: "investors" },
];

/** Footer nav split into two balanced columns */
export const footerNav1: NavItem[] = [
  { href: "/public-sector", key: "publicSector" },
  { href: "/quality-security", key: "quality" },
  { href: "/partnership", key: "partnership" },
  { href: "/for-procuring-organizations", key: "procuring" },
];

export const footerNav2: NavItem[] = [
  { href: "/insights", key: "insights" },
  { href: "/cases", key: "cases" },
  { href: "/investors", key: "investors" },
  { href: "/contact", key: "contact" },
];

/** @deprecated use footerNav1 + footerNav2 */
export const footerNav: NavItem[] = [...footerNav1, ...footerNav2];

export const legalNav = [
  { href: "/privacy" as const, key: "privacy" as const },
  { href: "/cookies" as const, key: "cookies" as const },
];
