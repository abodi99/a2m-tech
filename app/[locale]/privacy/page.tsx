import { getTranslations, setRequestLocale } from "next-intl/server";
import { contacts } from "@/content/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "privacy",
    pathname: "/privacy",
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const crumbs = await getTranslations("breadcrumbs");

  const sections = [
    "controller",
    "collect",
    "purpose",
    "share",
    "analytics",
    "rights",
  ] as const;

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("privacy"), pathname: "/privacy" },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "privacy" }]} />
      <PageHero title={t("title")} intro={t("intro")} />
      <p className="mt-4 text-sm text-ink-500">{t("updated")}</p>
      <div className="mt-10 space-y-10">
        {sections.map((key) => (
          <section key={key} className="border-t border-line pt-6">
            <h2 className="font-display text-lg font-semibold text-brand-900">
              {t(`${key}Title`)}
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
              {t(`${key}Body`)}
            </p>
          </section>
        ))}
        <section className="border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold text-brand-900">
            {t("contactTitle")}
          </h2>
          <p className="mt-3 text-ink-700">
            <a href={contacts.phoneHref}>{contacts.phoneDisplay}</a>
            {" · "}
            <a href={contacts.calendly} target="_blank" rel="noopener noreferrer">
              Calendly
            </a>
          </p>
        </section>
      </div>
    </PageShell>
  );
}
