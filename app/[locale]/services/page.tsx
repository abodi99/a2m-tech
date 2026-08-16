import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
import {
  JsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  serviceJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "services",
    pathname: "/services",
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const crumbs = await getTranslations("breadcrumbs");

  const items = [
    { key: "i1" as const, href: "/about" as const },
    { key: "i2" as const, href: "/about" as const },
    { key: "i3" as const, href: "/contact" as const },
    { key: "i4" as const, href: "/about" as const },
  ];

  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: crumbs("services"), pathname: "/services" },
          ]),
          serviceJsonLd(locale, t("title"), t("intro")),
        ]}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "services" }]} />
      <PageHero title={t("title")} intro={t("intro")} />
      <ol className="mt-12 space-y-10">
        {items.map((item, index) => (
          <li key={item.key} className="border-t border-line pt-8">
            <p className="text-sm font-semibold text-brand-800">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold text-brand-900">
              {t(`items.${item.key}.title`)}
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
              {t(`items.${item.key}.body`)}
            </p>
            <Link
              href={item.href}
              className="mt-4 inline-flex text-sm font-semibold text-brand-800 hover:text-brand-900"
            >
              {t(`items.${item.key}.link`)} →
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-12 max-w-3xl border-t border-line pt-8 text-ink-700">
        {t("closing")}
      </p>
    </PageShell>
  );
}
