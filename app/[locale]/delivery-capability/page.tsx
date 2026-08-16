import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContinuityMotif } from "@/components/brand/continuity-motif";
import { AccountabilityChainVisual } from "@/components/brand/visual-system";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
import { PlaceholderImage } from "@/components/media/placeholder-generator";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "delivery",
    pathname: "/delivery-capability",
  });
}

export default async function DeliveryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("delivery");
  const crumbs = await getTranslations("breadcrumbs");
  const stageKeys = ["s1", "s2", "s3", "s4", "s5"] as const;

  const motifStages = stageKeys.map((key, index) => ({
    number: String(index + 1),
    label: t(`stages.${key}.title`),
  }));

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("delivery"), pathname: "/delivery-capability" },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "delivery" }]} />
      <PageHero
        title={t("title")}
        intro={t("intro")}
        visual={
          <AccountabilityChainVisual
            caption={t("visualCaption")}
            steps={motifStages.map((s) => s.label)}
          />
        }
      />
      <ContinuityMotif
        className="mt-10"
        stages={motifStages}
        variant="editorial"
      />
      <ol className="mt-14 space-y-12">
        {stageKeys.map((key, index) => (
          <li
            key={key}
            className="grid gap-4 border-t border-line pt-8 md:grid-cols-[4rem_1fr]"
          >
            <span className="font-display text-3xl font-bold text-brand-800">
              {index + 1}
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-brand-900">
                {t(`stages.${key}.title`)}
              </h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
                {t(`stages.${key}.body`)}
              </p>
              <p className="mt-4 text-sm font-semibold text-ink-500">
                {t("deliverablesLabel")}
              </p>
              <p className="mt-1 text-sm text-ink-700">
                {t(`stages.${key}.deliverables`)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* Process visualization section */}
      <section className="mt-16 border-t border-line pt-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold text-brand-900">
              {t("visualizationTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-700">
              {t("visualizationBody")}
            </p>
          </div>
          <div className="space-y-6">
            <PlaceholderImage
              width={600}
              height={300}
              text="Delivery Timeline"
              type="context"
              className="w-full rounded-lg"
            />
            <PlaceholderImage
              width={600}
              height={250}
              text="Quality Gates"
              type="context"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>
      <div className="mt-14 max-w-3xl border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("riskTitle")}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-700">{t("riskBody")}</p>
      </div>
    </PageShell>
  );
}
