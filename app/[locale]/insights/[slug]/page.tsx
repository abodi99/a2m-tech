import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL, company } from "@/content/site";
import {
  getArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
  getPairedArticle,
  categoryLabels,
  type InsightArticle,
  type InsightSection,
} from "@/content/insights-articles";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["sv", "en"] as const) {
    const articles = getPublishedArticles(locale);
    for (const a of articles) {
      params.push({ locale, slug: a.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug, locale as "sv" | "en");
  if (!article) return {};

  const canonical = `${SITE_URL}/${locale}/${locale === "sv" ? "insikter" : "insights"}/${slug}`;
  const paired = getPairedArticle(slug, locale as "sv" | "en");
  const pairedLocale = locale === "sv" ? "en" : "sv";
  const pairedUrl = paired
    ? `${SITE_URL}/${pairedLocale}/${pairedLocale === "sv" ? "insikter" : "insights"}/${paired.slug}`
    : null;
  const defaultUrl = `${SITE_URL}/sv/insikter/${slug}`;

  const languages: Record<string, string> = { [locale]: canonical };
  if (pairedUrl) languages[pairedLocale] = pairedUrl;
  languages["x-default"] = pairedLocale === "sv" && pairedUrl ? pairedUrl : defaultUrl;

  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      url: canonical,
      siteName: company.displayName,
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo.title,
      description: article.seo.description,
    },
  };
}

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleBody({ sections }: { sections: InsightSection[] }) {
  return (
    <div className="prose-article">
      {sections.map((section, idx) => {
        switch (section.type) {
          case "paragraph":
            return (
              <p key={idx} className="mb-6 text-base leading-[1.75] text-[#0B1820]">
                {section.text}
              </p>
            );

          case "heading2":
            return (
              <h2
                key={idx}
                className="mb-4 mt-10 font-display text-2xl font-bold text-[#003347]"
              >
                {section.text}
              </h2>
            );

          case "heading3":
            return (
              <h3
                key={idx}
                className="mb-3 mt-8 font-display text-lg font-semibold text-[#003347]"
              >
                {section.text}
              </h3>
            );

          case "list-unordered":
            return (
              <ul
                key={idx}
                className="mb-6 space-y-2 pl-5"
                style={{ listStyleType: "disc" }}
              >
                {(section.items ?? []).map((item, i) => (
                  <li key={i} className="text-base leading-[1.75] text-[#0B1820]">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "list-ordered":
            return (
              <ol
                key={idx}
                className="mb-6 space-y-2 pl-5"
                style={{ listStyleType: "decimal" }}
              >
                {(section.items ?? []).map((item, i) => (
                  <li key={i} className="text-base leading-[1.75] text-[#0B1820]">
                    {item}
                  </li>
                ))}
              </ol>
            );

          case "checklist":
            return (
              <ul key={idx} className="mb-6 space-y-3" role="list">
                {(section.items ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#004869]/30 bg-[#BCEAF2]/30"
                      aria-hidden
                    >
                      <svg viewBox="0 0 12 10" fill="none" className="h-3 w-3" aria-hidden>
                        <path
                          d="M1 5l3.5 3.5L11 1"
                          stroke="#004869"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-base leading-[1.75] text-[#0B1820]">{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "note":
            return (
              <div
                key={idx}
                className="my-8 rounded-r-lg border-l-4 border-[#BCEAF2] bg-[#BCEAF2]/20 px-5 py-4"
                role="note"
              >
                <p className="text-sm leading-[1.7] text-[#003347]">{section.text}</p>
              </div>
            );

          case "blockquote":
            return (
              <blockquote
                key={idx}
                className="my-8 border-l-4 border-[#D7E1E5] pl-5 text-lg italic leading-relaxed text-[#334B58]"
              >
                <p>{section.text}</p>
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

function RelatedArticles({
  related,
  locale,
}: {
  related: InsightArticle[];
  locale: string;
}) {
  if (related.length === 0) return null;
  const heading = locale === "sv" ? "RELATERADE INSIKTER" : "RELATED INSIGHTS";
  const readLabel = locale === "sv" ? "Läs" : "Read";

  return (
    <section className="mt-16 border-t border-[#D7E1E5] pt-12" aria-label={heading}>
      <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-[#334B58]">
        {heading}
      </p>
      <ol className="space-y-6">
        {related.map((a, i) => {
          const href = `/${locale}/${locale === "sv" ? "insikter" : "insights"}/${a.slug}`;
          const catLabel = categoryLabels[a.category][locale as "sv" | "en"];
          return (
            <li key={a.slug} className="group flex items-start gap-4">
              <span
                className="mt-0.5 w-6 shrink-0 font-mono text-sm font-medium tabular-nums text-[#334B58]/40"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mb-1 font-display text-base font-semibold leading-snug text-[#003347] transition-colors duration-150 group-hover:text-[#176BE0]">
                  <Link
                    href={href}
                    className="focus:outline-none focus-visible:underline"
                  >
                    {a.title}
                  </Link>
                </h3>
                <p className="text-xs text-[#334B58]">{catLabel}</p>
              </div>
              <Link
                href={href}
                className="ml-auto mt-0.5 shrink-0 text-[#176BE0] transition-transform duration-150 group-hover:translate-x-1 focus:outline-none"
                aria-label={`${readLabel}: ${a.title}`}
                tabIndex={-1}
                aria-hidden
              >
                →
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default async function InsightArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticleBySlug(slug, locale as "sv" | "en");
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const paired = getPairedArticle(slug, locale as "sv" | "en");
  const pairedLocale = locale === "sv" ? "en" : "sv";

  const catLabel = categoryLabels[article.category][locale as "sv" | "en"];
  const insightsHref = `/${locale}/${locale === "sv" ? "insikter" : "insights"}`;
  const articleUrl = `${SITE_URL}/${locale}/${locale === "sv" ? "insikter" : "insights"}/${slug}`;
  const pairedUrl = paired
    ? `/${pairedLocale}/${pairedLocale === "sv" ? "insikter" : "insights"}/${paired.slug}`
    : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo.description,
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    inLanguage: locale === "sv" ? "sv-SE" : "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    publisher: {
      "@type": "Organization",
      name: company.legalName,
      url: SITE_URL,
    },
    author: {
      "@type": "Organization",
      name: company.legalName,
      url: SITE_URL,
    },
  };

  const backLabel = locale === "sv" ? "← Alla insikter" : "← All insights";
  const publishedLabel = locale === "sv" ? "Publicerad" : "Published";
  const readingLabel = locale === "sv" ? "min läsning" : "min read";
  const ctaHeading =
    locale === "sv"
      ? "Planerar ni ett kommande digitalt uppdrag?"
      : "Planning an upcoming digital assignment?";
  const ctaBody =
    locale === "sv"
      ? "Vi tar gärna en första dialog om behov, ansvarsfördelning, leveransform och långsiktig förvaltning."
      : "We are happy to start with a conversation about needs, responsibilities, delivery model and long-term maintainability.";
  const ctaButton = locale === "sv" ? "Inled en dialog →" : "Start a conversation →";
  const langSwitch =
    locale === "sv" ? "Read in English" : "Läs på svenska";

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            {
              name: locale === "sv" ? "Insikter" : "Insights",
              pathname: "/insights",
            },
            { name: article.title },
          ]),
          articleJsonLd,
        ]}
      />

      {/* ── Back + lang switch bar ── */}
      <div className="border-b border-[#D7E1E5] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumbs
            locale={locale}
            items={[
              { labelKey: "insights" },
              { label: article.title },
            ]}
          />
          {pairedUrl && (
            <Link
              href={pairedUrl}
              className="hidden text-xs font-medium text-[#176BE0] hover:underline focus:outline-none focus-visible:underline sm:block"
              hrefLang={pairedLocale}
            >
              {langSwitch}
            </Link>
          )}
        </div>
      </div>

      {/* ── Article header ── */}
      <div className="border-b border-[#D7E1E5] bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
          <div className="max-w-[720px]">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
                {locale === "sv" ? "INSIKT" : "INSIGHT"}
              </span>
              <span className="text-[#D7E1E5]" aria-hidden>
                ·
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#334B58]">
                {catLabel.toUpperCase()}
              </span>
            </div>

            <h1 className="mb-5 font-display text-3xl font-bold leading-tight text-[#003347] lg:text-4xl">
              {article.title}
            </h1>

            <p className="mb-6 text-lg leading-relaxed text-[#334B58]">
              {article.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#334B58]">
              <span>
                {publishedLabel}{" "}
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt, locale)}
                </time>
              </span>
              <span className="text-[#D7E1E5]" aria-hidden>
                ·
              </span>
              <span>
                {article.readingMinutes}&nbsp;{readingLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ── */}
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_260px]">
          {/* Body */}
          <div className="max-w-[720px]">
            <ArticleBody sections={article.sections} />

            <RelatedArticles related={related} locale={locale} />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              <Link
                href={insightsHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#176BE0] hover:underline focus:outline-none focus-visible:underline"
              >
                {backLabel}
              </Link>

              <div className="rounded-lg border border-[#D7E1E5] bg-white p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#334B58]/60">
                  {locale === "sv" ? "Kategori" : "Category"}
                </p>
                <p className="text-sm font-medium text-[#003347]">{catLabel}</p>

                <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-[#334B58]/60">
                  {publishedLabel}
                </p>
                <p className="text-sm text-[#334B58]">
                  {formatDate(article.publishedAt, locale)}
                </p>

                <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-[#334B58]/60">
                  {locale === "sv" ? "Lästid" : "Reading time"}
                </p>
                <p className="text-sm text-[#334B58]">
                  {article.readingMinutes}&nbsp;{readingLabel}
                </p>

                {pairedUrl && (
                  <>
                    <div className="my-4 border-t border-[#D7E1E5]" />
                    <Link
                      href={pairedUrl}
                      className="text-xs font-medium text-[#176BE0] hover:underline focus:outline-none focus-visible:underline"
                      hrefLang={pairedLocale}
                    >
                      {langSwitch}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Closing CTA ── */}
      <div className="border-t border-[#D7E1E5] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
              A2M TECH
            </p>
            <h2 className="mb-4 font-display text-2xl font-bold text-[#003347] lg:text-3xl">
              {ctaHeading}
            </h2>
            <p className="mb-7 text-base leading-relaxed text-[#334B58]">
              {ctaBody}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-lg bg-[#003347] px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#004869] focus:outline-none focus:ring-2 focus:ring-[#003347] focus:ring-offset-2"
            >
              {ctaButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
