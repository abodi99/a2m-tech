import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sv", "en"],
  defaultLocale: "sv",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/services": {
      sv: "/tjanster",
      en: "/services",
    },
    "/public-sector": {
      sv: "/offentlig-sektor",
      en: "/public-sector",
    },
    "/delivery-capability": {
      sv: "/leveransformaga",
      en: "/delivery-capability",
    },
    "/quality-security": {
      sv: "/kvalitet-sakerhet",
      en: "/quality-security",
    },
    "/for-procuring-organizations": {
      sv: "/for-upphandlande-organisationer",
      en: "/for-procuring-organizations",
    },
    "/partnership": {
      sv: "/partnerskap",
      en: "/partnership",
    },
    "/about": {
      sv: "/om-oss",
      en: "/about",
    },
    "/insights": {
      sv: "/insikter",
      en: "/insights",
    },
    "/contact": {
      sv: "/kontakt",
      en: "/contact",
    },
    "/privacy": {
      sv: "/integritet",
      en: "/privacy",
    },
    "/cookies": {
      sv: "/cookies",
      en: "/cookies",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
