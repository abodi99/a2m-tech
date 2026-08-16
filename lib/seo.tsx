import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type AppPathname } from "@/i18n/routing";
import {
  absoluteLocalizedUrl,
  localeUrl,
} from "@/lib/locale-url";
import { SITE_URL, company, contacts } from "@/content/site";

type MetaKey =
  | "home"
  | "services"
  | "publicSector"
  | "delivery"
  | "quality"
  | "procuring"
  | "partnership"
  | "insights"
  | "about"
  | "contact"
  | "privacy"
  | "cookies"
  | "notFound";

export async function buildPageMetadata(options: {
  locale: string;
  metaKey: MetaKey;
  pathname: AppPathname;
}): Promise<Metadata> {
  const { locale, metaKey, pathname } = options;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t(`${metaKey}.title`);
  const description = t(`${metaKey}.description`);
  const canonical = absoluteLocalizedUrl(locale, pathname);

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = absoluteLocalizedUrl(loc, pathname);
  }
  languages["x-default"] = absoluteLocalizedUrl(
    routing.defaultLocale,
    pathname
  );

  const ogImage =
    locale === "sv"
      ? "/brand/og-sv.jpg"
      : "/brand/og-en.jpg";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: company.displayName,
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: company.displayName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    alternateName: company.displayName,
    url: SITE_URL,
    telephone: contacts.phoneE164,
    address: {
      "@type": "PostalAddress",
      addressCountry: "SE",
    },
    sameAs: [contacts.linkedin],
  };
}

export function websiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.displayName,
    url: localeUrl(locale),
    inLanguage: locale === "sv" ? "sv-SE" : "en-US",
    publisher: {
      "@type": "Organization",
      name: company.legalName,
    },
  };
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; pathname?: AppPathname }[]
) {
  const list = [
    {
      "@type": "ListItem",
      position: 1,
      name: locale === "sv" ? "Start" : "Home",
      item: localeUrl(locale),
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.name,
      ...(item.pathname
        ? { item: absoluteLocalizedUrl(locale, item.pathname) }
        : {}),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };
}

export function serviceJsonLd(locale: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: company.legalName,
      url: SITE_URL,
    },
    areaServed: "SE",
    url: absoluteLocalizedUrl(locale, "/services"),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
