import { getTranslations, setRequestLocale } from "next-intl/server";
import { contacts, supplierFacts } from "@/content/site";
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
      <PageHero title={t("title")} intro={t("intro")} />
      <p className="mt-4 text-sm text-ink-500">
        {common("lastUpdated")}: {supplierFacts.lastUpdated}
      </p>

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
            href={contacts.emailHref}
            className={cn(buttonVariants())}
          >
            {common("sendEmail")}
          </a>
          <a
            href={contacts.phoneHref}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {contacts.phoneDisplay}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
