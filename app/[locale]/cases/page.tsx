import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { demoCases, loc } from "@/content/demo-cases";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageShell } from "@/components/layout/page-shell";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CasesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const crumbs = await getTranslations("breadcrumbs");

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("cases"), pathname: "/cases" },
        ])}
      />

      {/* Disclaimer banner */}
      <div
        role="note"
        className="mb-10 flex items-start gap-3 rounded border border-amber-200 bg-amber-50 px-5 py-4"
      >
        <svg
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 5a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5Zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
            fill="currentColor"
          />
        </svg>
        <div>
          <p className="text-sm font-semibold text-amber-800">{t("banner")}</p>
          <p className="mt-0.5 text-sm text-amber-700">{t("bannerDetail")}</p>
        </div>
      </div>

      <Breadcrumbs locale={locale} items={[{ labelKey: "cases" }]} />

      {/* Page header */}
      <header className="mt-8 max-w-3xl border-b border-[#D7E1E5] pb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#003347] sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#004869]/80">
          {t("pageIntro")}
        </p>
      </header>

      {/* Editorial case rows */}
      <ol className="mt-0 divide-y divide-[#D7E1E5]" aria-label={t("pageTitle")}>
        {demoCases.map((c) => (
          <li key={c.slug} className="group py-12">
            <article className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
              {/* Text side */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-mono text-4xl font-bold text-[#D7E1E5] select-none">
                    {String(c.index).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-[#D7E1E5] px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-[#004869]">
                    {loc(c.sector, locale)}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-[#003347] sm:text-2xl">
                  <NextLink
                    href={`/${locale}/cases/${c.slug}`}
                    className="hover:text-[#176BE0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176BE0]"
                  >
                    {loc(c.title, locale)}
                  </NextLink>
                </h2>

                <p className="mt-3 max-w-2xl leading-relaxed text-[#004869]/80">
                  {loc(c.intro, locale)}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <NextLink
                    href={`/${locale}/cases/${c.slug}`}
                    className="text-sm font-medium text-[#176BE0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176BE0]"
                  >
                    {t("readCase")}
                  </NextLink>
                  <span className="text-xs text-[#004869]/50 italic">
                    {t("disclaimer")}
                  </span>
                </div>
              </div>

              {/* Logo side */}
              <div className="flex-shrink-0 self-start">
                <div className="flex flex-col items-center gap-3 rounded border border-[#D7E1E5] bg-[#F7F9F8] p-6 w-40">
                  <Image
                    src={c.logoPath}
                    alt={`${c.customer} logotyp`}
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-center text-xs font-medium text-[#003347] leading-tight">
                    {c.customer}
                  </span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
