import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "insights",
    pathname: "/insights",
  });
}

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const crumbs = await getTranslations("breadcrumbs");
  const topics = ["t1", "t2", "t3", "t4", "t5", "t6"] as const;

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("insights"), pathname: "/insights" },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "insights" }]} />
      <PageHero title={t("title")} intro={t("intro")} />
      <p className="mt-4 text-sm text-ink-500">{t("roadmapNote")}</p>
      <ol className="mt-10 list-decimal space-y-4 pl-5 text-ink-700">
        {topics.map((key) => (
          <li key={key}>{t(`topics.${key}`)}</li>
        ))}
      </ol>
      <Link href="/contact" className={`${buttonVariants()} mt-10`}>
        {t("cta")}
      </Link>
    </PageShell>
  );
}
