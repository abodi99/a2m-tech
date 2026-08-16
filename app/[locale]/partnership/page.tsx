import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { contacts } from "@/content/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "partnership",
    pathname: "/partnership",
  });
}

export default async function PartnershipPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partnership");
  const crumbs = await getTranslations("breadcrumbs");
  const keys = ["p1", "p2", "p3"] as const;

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("partnership"), pathname: "/partnership" },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "partnership" }]} />
      <PageHero title={t("title")} intro={t("intro")} />
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
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={contacts.calendly}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants()}
        >
          {t("cta")}
        </a>
        <Link href="/delivery-capability" className={buttonVariants({ variant: "outline" })}>
          {locale === "sv" ? "Leveransförmåga" : "Delivery capability"}
        </Link>
      </div>
    </PageShell>
  );
}
