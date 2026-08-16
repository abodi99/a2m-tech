import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { demoCases, loc, requireDemo } from "@/content/demo-cases";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageShell } from "@/components/layout/page-shell";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const locales = ["sv", "en"];
  return locales.flatMap((locale) =>
    demoCases.map((c) => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = demoCases.find((x) => x.slug === slug);
  if (!c) return {};
  const t = await getTranslations({ locale, namespace: "cases" });
  return {
    title: `${c.customer} – ${loc(c.title, locale)} | A2M Tech`,
    description: loc(c.intro, locale).slice(0, 160),
    robots: { index: false },
  };
}

export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const c = demoCases.find((x) => x.slug === slug);
  if (!c) notFound();

  requireDemo(c);

  const t = await getTranslations("cases");
  const crumbs = await getTranslations("breadcrumbs");

  const sections: { key: string; label: string; body: string }[] = [
    { key: "utgangslage", label: t("sectionUtgangslage"), body: loc(c.utgangslage, locale) },
    { key: "uppdrag", label: t("sectionUppdrag"), body: loc(c.uppdrag, locale) },
    { key: "genomforande", label: t("sectionGenomforande"), body: loc(c.genomforande, locale) },
    { key: "leverans", label: t("sectionLeverans"), body: loc(c.leverans, locale) },
    { key: "resultat", label: t("sectionResultat"), body: loc(c.resultat, locale) },
  ];

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("cases"), pathname: "/cases" },
          { name: c.customer },
        ])}
      />

      {/* Mandatory disclaimer banner */}
      <div
        role="note"
        aria-label={t("disclaimer")}
        className="mb-8 flex items-start gap-3 rounded border border-amber-200 bg-amber-50 px-5 py-4"
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
        <p className="text-sm text-amber-800">
          <strong className="font-semibold">{t("disclaimer")} </strong>
          {t("disclaimer_long")}
        </p>
      </div>

      {/* Breadcrumb */}
      <Breadcrumbs
        locale={locale}
        items={[
          { labelKey: "cases" },
          { label: c.customer },
        ]}
      />

      {/* Case header */}
      <header className="mt-8 grid gap-8 border-b border-[#D7E1E5] pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-[#004869]/50">
              {String(c.index).padStart(2, "0")}
            </span>
            <span className="rounded-full border border-[#D7E1E5] px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-[#004869]">
              {loc(c.sector, locale)}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-[#003347] sm:text-4xl">
            {loc(c.title, locale)}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#004869]/80">
            {loc(c.intro, locale)}
          </p>
        </div>

        {/* Customer logo card */}
        <div className="flex-shrink-0 self-start">
          <div className="flex flex-col items-center gap-3 rounded border border-[#D7E1E5] bg-[#F7F9F8] p-6 w-44">
            <Image
              src={c.logoPath}
              alt={`${c.customer} logotyp`}
              width={72}
              height={72}
              className="h-16 w-16 object-contain"
            />
            <span className="text-center text-xs font-medium leading-tight text-[#003347]">
              {c.customer}
            </span>
          </div>
        </div>
      </header>

      {/* Main content – editorial sections */}
      <div className="mt-0 lg:grid lg:grid-cols-[1fr_280px] lg:gap-16">
        {/* Sections */}
        <div className="divide-y divide-[#D7E1E5]">
          {sections.map((s, i) => (
            <section key={s.key} className="py-10">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-[#D7E1E5] select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-base font-semibold uppercase tracking-widest text-[#004869]">
                  {s.label}
                </h2>
              </div>
              <p className="mt-4 max-w-2xl leading-relaxed text-[#003347]/90">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="mt-10 lg:mt-0">
          <div className="sticky top-24 space-y-8">
            {/* Capabilities */}
            <div className="rounded border border-[#D7E1E5] bg-[#F7F9F8] p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#004869]">
                {t("capabilitiesTitle")}
              </h3>
              <ul className="space-y-2">
                {c.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="flex items-center gap-2 text-sm text-[#003347]"
                  >
                    <span
                      className="h-1 w-4 flex-shrink-0 rounded-full bg-[#176BE0]"
                      aria-hidden="true"
                    />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>

            {/* Back link */}
            <NextLink
              href={`/${locale}/cases`}
              className="block text-sm font-medium text-[#176BE0] hover:underline"
            >
              {t("backToAll")}
            </NextLink>
          </div>
        </aside>
      </div>

      {/* CTA section */}
      <section className="mt-16 border-t border-[#D7E1E5] pt-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-[#003347]">
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 leading-relaxed text-[#004869]/80">{t("ctaBody")}</p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center rounded bg-[#176BE0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1459c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176BE0] focus-visible:ring-offset-2"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
