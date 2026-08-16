import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { TrackedHref } from "@/components/analytics/tracked-href";
import {
  getPublishedArticles,
  categoryLabels,
  type InsightArticle,
} from "@/content/insights-articles";
import { absoluteLocalizedUrl } from "@/lib/locale-url";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "insights",
    pathname: "/insights",
  });
}

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleRow({
  article,
  index,
  locale,
}: {
  article: InsightArticle;
  index: number;
  locale: string;
}) {
  const catLabel = categoryLabels[article.category][locale as "sv" | "en"];
  const href = `/${locale}/${locale === "sv" ? "insikter" : "insights"}/${article.slug}`;
  const readLabel = locale === "sv" ? "Läs artikeln" : "Read article";
  const minLabel = locale === "sv" ? "min" : "min";

  return (
    <li className="group border-t border-[#D7E1E5] py-10 first:border-t-0">
      <article>
        <div className="grid gap-6 lg:grid-cols-[56px_1fr_200px] lg:gap-8">
          {/* Number */}
          <div
            className="hidden font-mono text-sm font-medium tabular-nums text-[#334B58]/50 lg:block"
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Main content */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
                {catLabel}
              </span>
              <span className="text-[#D7E1E5]" aria-hidden>
                ·
              </span>
              <time
                dateTime={article.publishedAt}
                className="text-xs text-[#334B58]"
              >
                {formatDate(article.publishedAt, locale)}
              </time>
              <span className="text-[#D7E1E5]" aria-hidden>
                ·
              </span>
              <span className="text-xs text-[#334B58]">
                {article.readingMinutes}&nbsp;{minLabel}
              </span>
            </div>

            <h2 className="mb-3 font-display text-xl font-bold leading-snug text-[#003347] transition-colors duration-150 group-hover:text-[#176BE0] lg:text-2xl">
              <TrackedHref
                href={href}
                event="insight_open"
                eventData={{ slug: article.slug, placement: "insights_list" }}
                className="focus:outline-none focus-visible:underline"
              >
                {article.title}
              </TrackedHref>
            </h2>

            <p className="mb-5 max-w-prose text-base leading-relaxed text-[#334B58]">
              {article.description}
            </p>

            <TrackedHref
              href={href}
              event="insight_open"
              eventData={{ slug: article.slug, placement: "insights_list_cta" }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#176BE0] transition-all duration-150 hover:gap-3 focus:outline-none focus-visible:underline"
              aria-label={`${readLabel}: ${article.title}`}
            >
              {readLabel}
              <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1">
                →
              </span>
            </TrackedHref>
          </div>

          {/* Meta sidebar on desktop */}
          <div className="hidden lg:block">
            {article.featured && (
              <span className="inline-block rounded-full border border-[#BCEAF2] bg-[#BCEAF2]/20 px-2.5 py-0.5 text-xs font-medium text-[#004869]">
                {locale === "sv" ? "Utvald" : "Featured"}
              </span>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const crumbs = await getTranslations("breadcrumbs");

  const articles = getPublishedArticles(locale as "sv" | "en");

  const insightsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("pageTitle"),
    description: t("pageIntro"),
    url: absoluteLocalizedUrl(locale, "/insights"),
    inLanguage: locale === "sv" ? "sv-SE" : "en-US",
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: crumbs("insights"), pathname: "/insights" },
          ]),
          insightsJsonLd,
        ]}
      />

      {/* ── Page header ── */}
      <div className="border-b border-[#D7E1E5] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs locale={locale} items={[{ labelKey: "insights" }]} />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
            {locale === "sv" ? "INSIKTER & AKTUELLT" : "INSIGHTS & UPDATES"}
          </p>
          <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-[#003347] lg:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#334B58]">
            {t("pageIntro")}
          </p>
        </div>
      </div>

      {/* ── Article list ── */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <p className="py-20 text-center text-[#334B58]">
            {locale === "sv"
              ? "Inga publicerade artiklar ännu."
              : "No published articles yet."}
          </p>
        ) : (
          <ol aria-label={t("pageTitle")}>
            {articles.map((article, i) => (
              <ArticleRow
                key={article.slug}
                article={article}
                index={i}
                locale={locale}
              />
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
