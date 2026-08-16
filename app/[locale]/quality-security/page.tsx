import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GovernanceLayersVisual } from "@/components/brand/visual-system";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "quality",
    pathname: "/quality-security",
  });
}

export default async function QualitySecurityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quality");
  const crumbs = await getTranslations("breadcrumbs");
  const keys = ["q1", "q2", "q3", "q4"] as const;

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("quality"), pathname: "/quality-security" },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "quality" }]} />
      <PageHero
        title={t("title")}
        intro={t("intro")}
        visual={
          <GovernanceLayersVisual
            caption={t("visualCaption")}
            layers={keys.map((key) => t(`items.${key}.title`))}
          />
        }
      />
      <ol className="mt-12 space-y-8">
        {keys.map((key, index) => (
          <li key={key} className="border-t border-line pt-6">
            <p className="text-sm font-semibold text-brand-800">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold text-brand-900">
              {t(`items.${key}.title`)}
            </h2>
            <p className="mt-3 max-w-3xl text-ink-700">{t(`items.${key}.body`)}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-sm text-ink-500">{t("note")}</p>
      <Link
        href="/for-procuring-organizations"
        className={`${buttonVariants()} mt-8`}
      >
        {t("cta")}
      </Link>
    </PageShell>
  );
}
