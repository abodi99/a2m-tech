import { getTranslations, setRequestLocale } from "next-intl/server";
import { company, contacts, supplierFacts } from "@/content/site";
import { FactSheetVisual } from "@/components/brand/visual-system";
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
    metaKey: "procuring",
    pathname: "/for-procuring-organizations",
  });
}

function statusLabel(
  status: "available" | "onRequest" | "omitted",
  available: string,
  onRequest: string
) {
  if (status === "available") return available;
  if (status === "onRequest") return onRequest;
  return null;
}

export default async function ProcuringPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("procuring");
  const common = await getTranslations("common");
  const crumbs = await getTranslations("breadcrumbs");

  const docKeys = Object.keys(supplierFacts.documents) as Array<
    keyof typeof supplierFacts.documents
  >;

  return (
    <PageShell className="print-friendly">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          {
            name: crumbs("procuring"),
            pathname: "/for-procuring-organizations",
          },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "procuring" }]} />
      <PageHero
        title={t("title")}
        intro={t("intro")}
        visual={
          <FactSheetVisual
            caption={t("visualCaption")}
            rows={[
              { label: t("legalName"), value: company.legalName },
              { label: common("phone"), value: contacts.phoneDisplay },
              { label: t("geographyTitle"), value: t("geographyBody") },
              { label: t("languagesTitle"), value: t("languages") },
            ]}
          />
        }
      />
      <p className="mt-4 text-sm text-ink-500">
        {common("lastUpdated")}: {supplierFacts.lastUpdated} · {t("printHint")}
      </p>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("companyTitle")}
        </h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              {t("legalName")}
            </dt>
            <dd className="mt-1 text-ink-950">{company.legalName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              {common("phone")}
            </dt>
            <dd className="mt-1 text-ink-950">
              <a href={contacts.phoneHref}>{contacts.phoneDisplay}</a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("deliveryTitle")}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-700">
          {supplierFacts.deliveryModels.map((model) => (
            <li key={model}>{t(`models.${model}`)}</li>
          ))}
        </ul>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-ink-950">
              {t("languagesTitle")}
            </h3>
            <p className="mt-1 text-ink-700">{t("languages")}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-950">
              {t("geographyTitle")}
            </h3>
            <p className="mt-1 text-ink-700">{supplierFacts.geography.value}</p>
          </div>
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("docsTitle")}
        </h2>
        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-500">
              <th className="py-2 font-semibold">{t("docColumn")}</th>
              <th className="py-2 font-semibold">{t("statusColumn")}</th>
            </tr>
          </thead>
          <tbody>
            {docKeys.map((key) => {
              const status = supplierFacts.documents[key];
              const label = statusLabel(
                status,
                common("available"),
                common("onRequest")
              );
              if (!label) return null;
              return (
                <tr key={key} className="border-b border-line">
                  <td className="py-3 text-ink-950">{t(`docs.${key}`)}</td>
                  <td className="py-3 text-ink-700">{label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-ink-500">{t("omittedNote")}</p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("contactTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-ink-700">{t("contactBody")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={contacts.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants()
            )}
          >
            {common("bookMeeting")}
          </a>
          <a
            href={contacts.phoneHref}
            className={cn(
              buttonVariants({ variant: "outline" })
            )}
          >
            {contacts.phoneDisplay}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
