import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GovernanceLayersVisual } from "@/components/brand/visual-system";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "publicSector",
    pathname: "/public-sector",
  });
}

export default async function PublicSectorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("publicSector");
  const crumbs = await getTranslations("breadcrumbs");
  const keys = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"] as const;

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("publicSector"), pathname: "/public-sector" },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "publicSector" }]} />
      <PageHero
        title={t("title")}
        intro={t("intro")}
        visual={
          <GovernanceLayersVisual
            caption={t("visualCaption")}
            layers={[
              t("visual.l1"),
              t("visual.l2"),
              t("visual.l3"),
              t("visual.l4"),
            ]}
          />
        }
      />
      <div className="mt-12 overflow-hidden border border-line bg-brand-900 text-white">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
            <p className="text-sm font-semibold tracking-wide text-signal">
              {t("statementEyebrow")}
            </p>
            <p className="mt-4 font-display text-2xl font-semibold leading-snug sm:text-3xl">
              {t("statement")}
            </p>
          </div>
          <div className="bg-[#003347] p-8">
            <h2 className="font-display text-xl font-semibold">
              {t("checklistTitle")}
            </h2>
            <ul className="mt-6 space-y-3">
              {keys.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 border-l-2 border-signal/70 pl-4 text-sm text-white/85"
                >
                  {t(`items.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/for-procuring-organizations"
          className={cn(buttonVariants())}
        >
          {t("ctaProcuring")}
        </Link>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          {t("ctaContact")}
        </Link>
      </div>
    </PageShell>
  );
}
