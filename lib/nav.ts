import type { AppPathname } from "@/i18n/routing";

export type NavItem = {
  href: AppPathname;
  key:
    | "services"
    | "publicSector"
    | "delivery"
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
  { href: "/delivery-capability", key: "delivery" },
  { href: "/about", key: "about" },
  { href: "/for-procuring-organizations", key: "procuring" },
];

export const footerNav: NavItem[] = [
  { href: "/services", key: "services" },
  { href: "/public-sector", key: "publicSector" },
  { href: "/delivery-capability", key: "delivery" },
  { href: "/quality-security", key: "quality" },
  { href: "/partnership", key: "partnership" },
  { href: "/for-procuring-organizations", key: "procuring" },
  { href: "/about", key: "about" },
  { href: "/insights", key: "insights" },
  { href: "/contact", key: "contact" },
];

export const legalNav = [
  { href: "/privacy" as const, key: "privacy" as const },
  { href: "/cookies" as const, key: "cookies" as const },
];
