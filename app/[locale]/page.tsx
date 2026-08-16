import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company, contacts } from "@/content/site";
import {
  JsonLd,
  buildPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { PartnerTicker } from "@/components/partners/partner-ticker";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { TrackedHref } from "@/components/analytics/tracked-href";
import {
  getPublishedArticles,
  categoryLabels,
  type InsightArticle,
} from "@/content/insights-articles";

type Props = {
  params: Promise<{ locale: string }>;
};

// ─── Insights Section ────────────────────────────────────────────────────────

function InsightPreviewRow({
  article,
  locale,
  featured,
}: {
  article: InsightArticle;
  locale: string;
  featured: boolean;
}) {
  const catLabel = categoryLabels[article.category][locale as "sv" | "en"];
  const href = `/${locale}/${locale === "sv" ? "insikter" : "insights"}/${article.slug}`;
  const readLabel = locale === "sv" ? "Läs artikeln" : "Read article";

  const d = new Date(article.publishedAt);
  const dateStr = d.toLocaleDateString(locale === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (featured) {
    return (
      <article className="group border-b border-[#D7E1E5] pb-10">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#BCEAF2]/30 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-[#004869]">
            {locale === "sv" ? "Utvald" : "Featured"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
            {catLabel}
          </span>
          <span className="text-[#D7E1E5]" aria-hidden>·</span>
          <time dateTime={article.publishedAt} className="text-xs text-[#334B58]">
            {dateStr}
          </time>
          <span className="text-[#D7E1E5]" aria-hidden>·</span>
          <span className="text-xs text-[#334B58]">
            {article.readingMinutes}&nbsp;{locale === "sv" ? "min" : "min"}
          </span>
        </div>
        <h3 className="mb-3 font-display text-2xl font-bold leading-snug text-[#003347] transition-colors duration-150 group-hover:text-[#176BE0] lg:text-3xl">
          <TrackedHref
            href={href}
            event="insight_open"
            eventData={{ slug: article.slug, placement: "home_featured" }}
            className="focus:outline-none focus-visible:underline"
          >
            {article.title}
          </TrackedHref>
        </h3>
        <p className="mb-5 max-w-2xl text-base leading-relaxed text-[#334B58]">
          {article.description}
        </p>
        <TrackedHref
          href={href}
          event="insight_open"
          eventData={{ slug: article.slug, placement: "home_featured_cta" }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#176BE0] transition-all duration-150 hover:gap-3 focus:outline-none focus-visible:underline"
          aria-label={`${readLabel}: ${article.title}`}
        >
          {readLabel}
          <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1">→</span>
        </TrackedHref>
      </article>
    );
  }

  return (
    <article className="group">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
          {catLabel}
        </span>
        <span className="text-[#D7E1E5]" aria-hidden>·</span>
        <time dateTime={article.publishedAt} className="text-xs text-[#334B58]">
          {dateStr}
        </time>
      </div>
      <h3 className="mb-2 font-display text-lg font-bold leading-snug text-[#003347] transition-colors duration-150 group-hover:text-[#176BE0]">
        <TrackedHref
          href={href}
          event="insight_open"
          eventData={{ slug: article.slug, placement: "home_secondary" }}
          className="focus:outline-none focus-visible:underline"
        >
          {article.title}
        </TrackedHref>
      </h3>
      <p className="mb-3 text-sm leading-relaxed text-[#334B58] line-clamp-3">
        {article.description}
      </p>
      <TrackedHref
        href={href}
        event="insight_open"
        eventData={{ slug: article.slug, placement: "home_secondary_cta" }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176BE0] transition-all duration-150 hover:gap-2.5 focus:outline-none focus-visible:underline"
        aria-label={`${readLabel}: ${article.title}`}
      >
        {readLabel}
        <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
      </TrackedHref>
    </article>
  );
}

async function InsightsSection({ locale }: { locale: string }) {
  const articles = getPublishedArticles(locale as "sv" | "en").slice(0, 3);
  if (articles.length === 0) return null;

  const insightsHref = `/${locale}/${locale === "sv" ? "insikter" : "insights"}`;
  const eyebrow = locale === "sv" ? "INSIKTER & AKTUELLT" : "INSIGHTS & UPDATES";
  const heading =
    locale === "sv"
      ? "Insikter för tydligare digitala leveranser"
      : "Insights for clearer digital deliveries";
  const intro =
    locale === "sv"
      ? "Perspektiv, guider och praktiska resonemang kring upphandling, leveransstyrning, kvalitet och långsiktig förvaltning."
      : "Perspectives, guides and practical thinking on procurement, delivery governance, quality and long-term maintenance.";
  const allLabel = locale === "sv" ? "Se alla insikter" : "View all insights";

  const [featured, ...rest] = articles;

  return (
    <section className="bg-white py-20" aria-labelledby="insights-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
            {eyebrow}
          </p>
          <h2
            id="insights-heading"
            className="mb-4 font-display text-4xl font-bold leading-tight text-[#003347] lg:text-5xl"
          >
            {heading}
          </h2>
          <p className="text-lg leading-relaxed text-[#334B58]">{intro}</p>
        </div>

        {/* Featured article */}
        <InsightPreviewRow
          article={featured}
          locale={locale}
          featured={true}
        />

        {/* Secondary articles grid */}
        {rest.length > 0 && (
          <div className="mt-10 grid gap-8 border-b border-[#D7E1E5] pb-10 sm:grid-cols-2">
            {rest.map((a) => (
              <InsightPreviewRow
                key={a.slug}
                article={a}
                locale={locale}
                featured={false}
              />
            ))}
          </div>
        )}

        {/* See all link */}
        <div className="mt-8 flex justify-end">
          <TrackedHref
            href={insightsHref}
            event="cta_click"
            eventData={{ placement: "home_insights_all" }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#176BE0] transition-all duration-150 hover:gap-3 focus:outline-none focus-visible:underline"
          >
            {allLabel}
            <span aria-hidden className="transition-transform duration-150">→</span>
          </TrackedHref>
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "home",
    pathname: "/",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const common = await getTranslations("common");

  const needs = ["n1", "n2", "n3", "n4", "n5", "n6"] as const;
  const risks = ["r1", "r2", "r3", "r4"] as const;
  const sectors = ["s1", "s2", "s3"] as const;
  const crossCaps = ["c1", "c2", "c3", "c4", "c5", "c6"] as const;
  const cases = ["case1", "case2", "case3"] as const;

  const solutionItems = [
    t("solutionItem1"),
    t("solutionItem2"),
    t("solutionItem3"),
    t("solutionItem4"),
    t("solutionItem5"),
    t("solutionItem6"),
    t("solutionItem7"),
  ];

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale)]} />

      {/* ── Hero ── */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden text-white" style={{background: 'linear-gradient(150deg, #001e2d 0%, #003347 45%, #004869 100%)'}}>

        {/* Dot-grid atmospheric overlay */}
        <div
          className="absolute inset-0 opacity-25"
          style={{backgroundImage: 'radial-gradient(circle, rgba(188,234,242,0.35) 1px, transparent 1px)', backgroundSize: '44px 44px'}}
          aria-hidden
        />

        {/* Radial glow spots */}
        <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-[#007a96]/15 blur-3xl" aria-hidden />
        <div className="absolute -right-20 bottom-10 h-[400px] w-[400px] rounded-full bg-[#176be0]/10 blur-3xl" aria-hidden />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#001e2d]/80 to-transparent" aria-hidden />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Left: Copy */}
            <div>
              <h1 className="mb-7 font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
                {t("heroTitle")}
              </h1>
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/80 lg:text-xl">
                {t("heroSubtitle")}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <TrackedLink
                  href="/contact"
                  event="cta_click"
                  eventData={{ placement: "hero_primary" }}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-900 transition-all hover:bg-signal focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-900"
                >
                  {t("ctaPrimary")}
                </TrackedLink>
                <a
                  href={contacts.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-900"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M1.5 2A1.5 1.5 0 0 0 0 3.5v1c0 5.523 4.477 10 10 10h1a1.5 1.5 0 0 0 1.5-1.5v-1.09a1.5 1.5 0 0 0-1.077-1.443l-2.2-.628a1.5 1.5 0 0 0-1.585.526l-.388.51a.75.75 0 0 1-.92.22 8.5 8.5 0 0 1-3.977-3.978.75.75 0 0 1 .22-.919l.51-.388a1.5 1.5 0 0 0 .526-1.585L3.59 3.077A1.5 1.5 0 0 0 2.5 2H1.5Z" clipRule="evenodd" />
                  </svg>
                  {contacts.phoneDisplay}
                </a>
              </div>
            </div>

            {/* Right: Abstract civic-tech illustration */}
            <div className="hidden lg:flex lg:items-center lg:justify-center" aria-hidden>
              <svg viewBox="0 0 460 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md opacity-90">
                {/* Outer ring */}
                <circle cx="230" cy="230" r="200" stroke="rgba(188,234,242,0.10)" strokeWidth="1" />
                <circle cx="230" cy="230" r="155" stroke="rgba(188,234,242,0.08)" strokeWidth="1" />
                <circle cx="230" cy="230" r="105" stroke="rgba(188,234,242,0.06)" strokeWidth="1" />

                {/* City silhouette – buildings */}
                <rect x="30" y="320" width="50" height="110" rx="2" fill="rgba(188,234,242,0.06)" stroke="rgba(188,234,242,0.12)" strokeWidth="1" />
                <rect x="40" y="340" width="8" height="8" fill="rgba(188,234,242,0.2)" />
                <rect x="54" y="340" width="8" height="8" fill="rgba(188,234,242,0.15)" />
                <rect x="40" y="354" width="8" height="8" fill="rgba(188,234,242,0.1)" />
                <rect x="54" y="354" width="8" height="8" fill="rgba(188,234,242,0.2)" />

                <rect x="92" y="280" width="70" height="150" rx="2" fill="rgba(188,234,242,0.08)" stroke="rgba(188,234,242,0.14)" strokeWidth="1" />
                <rect x="103" y="298" width="9" height="9" fill="rgba(188,234,242,0.25)" />
                <rect x="119" y="298" width="9" height="9" fill="rgba(188,234,242,0.15)" />
                <rect x="135" y="298" width="9" height="9" fill="rgba(188,234,242,0.20)" />
                <rect x="103" y="314" width="9" height="9" fill="rgba(188,234,242,0.10)" />
                <rect x="119" y="314" width="9" height="9" fill="rgba(188,234,242,0.25)" />
                <rect x="135" y="314" width="9" height="9" fill="rgba(188,234,242,0.15)" />
                <rect x="103" y="330" width="9" height="9" fill="rgba(188,234,242,0.20)" />
                <rect x="119" y="330" width="9" height="9" fill="rgba(188,234,242,0.10)" />
                <rect x="135" y="330" width="9" height="9" fill="rgba(188,234,242,0.20)" />

                <rect x="178" y="240" width="90" height="190" rx="2" fill="rgba(188,234,242,0.10)" stroke="rgba(188,234,242,0.18)" strokeWidth="1" />
                <rect x="190" y="258" width="10" height="10" fill="rgba(188,234,242,0.30)" />
                <rect x="208" y="258" width="10" height="10" fill="rgba(188,234,242,0.20)" />
                <rect x="226" y="258" width="10" height="10" fill="rgba(188,234,242,0.25)" />
                <rect x="244" y="258" width="10" height="10" fill="rgba(188,234,242,0.15)" />
                <rect x="190" y="276" width="10" height="10" fill="rgba(188,234,242,0.15)" />
                <rect x="208" y="276" width="10" height="10" fill="rgba(188,234,242,0.30)" />
                <rect x="226" y="276" width="10" height="10" fill="rgba(188,234,242,0.20)" />
                <rect x="244" y="276" width="10" height="10" fill="rgba(188,234,242,0.25)" />
                <rect x="190" y="294" width="10" height="10" fill="rgba(188,234,242,0.20)" />
                <rect x="208" y="294" width="10" height="10" fill="rgba(188,234,242,0.15)" />
                <rect x="226" y="294" width="10" height="10" fill="rgba(188,234,242,0.30)" />
                <rect x="244" y="294" width="10" height="10" fill="rgba(188,234,242,0.20)" />

                <rect x="282" y="268" width="72" height="162" rx="2" fill="rgba(188,234,242,0.08)" stroke="rgba(188,234,242,0.14)" strokeWidth="1" />
                <rect x="293" y="284" width="9" height="9" fill="rgba(188,234,242,0.20)" />
                <rect x="308" y="284" width="9" height="9" fill="rgba(188,234,242,0.15)" />
                <rect x="323" y="284" width="9" height="9" fill="rgba(188,234,242,0.25)" />
                <rect x="293" y="300" width="9" height="9" fill="rgba(188,234,242,0.15)" />
                <rect x="308" y="300" width="9" height="9" fill="rgba(188,234,242,0.25)" />
                <rect x="323" y="300" width="9" height="9" fill="rgba(188,234,242,0.10)" />
                <rect x="293" y="316" width="9" height="9" fill="rgba(188,234,242,0.25)" />
                <rect x="308" y="316" width="9" height="9" fill="rgba(188,234,242,0.10)" />
                <rect x="323" y="316" width="9" height="9" fill="rgba(188,234,242,0.20)" />

                <rect x="366" y="300" width="55" height="130" rx="2" fill="rgba(188,234,242,0.06)" stroke="rgba(188,234,242,0.12)" strokeWidth="1" />
                <rect x="376" y="316" width="8" height="8" fill="rgba(188,234,242,0.20)" />
                <rect x="390" y="316" width="8" height="8" fill="rgba(188,234,242,0.15)" />
                <rect x="376" y="330" width="8" height="8" fill="rgba(188,234,242,0.10)" />
                <rect x="390" y="330" width="8" height="8" fill="rgba(188,234,242,0.20)" />

                {/* Ground line */}
                <line x1="20" y1="430" x2="440" y2="430" stroke="rgba(188,234,242,0.12)" strokeWidth="1" />

                {/* Network nodes above buildings */}
                <circle cx="105" cy="180" r="6" fill="rgba(188,234,242,0.6)" />
                <circle cx="200" cy="120" r="8" fill="rgba(188,234,242,0.8)" />
                <circle cx="310" cy="150" r="6" fill="rgba(188,234,242,0.6)" />
                <circle cx="380" cy="100" r="5" fill="rgba(188,234,242,0.5)" />
                <circle cx="60" cy="200" r="4" fill="rgba(188,234,242,0.4)" />
                <circle cx="420" cy="200" r="4" fill="rgba(188,234,242,0.4)" />

                {/* Connection lines between nodes */}
                <line x1="105" y1="180" x2="200" y2="120" stroke="rgba(188,234,242,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="200" y1="120" x2="310" y2="150" stroke="rgba(188,234,242,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="310" y1="150" x2="380" y2="100" stroke="rgba(188,234,242,0.20)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="60" y1="200" x2="105" y2="180" stroke="rgba(188,234,242,0.18)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="420" y1="200" x2="380" y2="100" stroke="rgba(188,234,242,0.18)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="105" y1="180" x2="223" y2="280" stroke="rgba(188,234,242,0.12)" strokeWidth="1" strokeDasharray="3 6" />
                <line x1="310" y1="150" x2="318" y2="268" stroke="rgba(188,234,242,0.12)" strokeWidth="1" strokeDasharray="3 6" />

                {/* Floating data cards */}
                <rect x="148" y="60" width="110" height="42" rx="8" fill="rgba(0,72,105,0.7)" stroke="rgba(188,234,242,0.25)" strokeWidth="1" />
                <circle cx="170" cy="81" r="7" fill="rgba(188,234,242,0.2)" />
                <rect x="184" y="73" width="56" height="6" rx="3" fill="rgba(188,234,242,0.35)" />
                <rect x="184" y="84" width="36" height="4" rx="2" fill="rgba(188,234,242,0.18)" />

                <rect x="300" y="50" width="120" height="38" rx="8" fill="rgba(0,51,71,0.8)" stroke="rgba(188,234,242,0.20)" strokeWidth="1" />
                <rect x="315" y="62" width="80" height="5" rx="2" fill="rgba(188,234,242,0.30)" />
                <rect x="315" y="73" width="55" height="4" rx="2" fill="rgba(188,234,242,0.15)" />

                {/* Signal glow on tallest building node */}
                <circle cx="200" cy="120" r="18" fill="rgba(188,234,242,0.06)" />
                <circle cx="200" cy="120" r="28" fill="rgba(188,234,242,0.03)" />
              </svg>
            </div>
          </div>
        </div>
      </section>


      {/* ── Partner ticker ── */}
      <PartnerTicker />

      {/* ── Mission statement – Civica big-text style ── */}
      <section className="relative overflow-hidden bg-paper py-20">
        {/* Decorative circle accent */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-brand-800/8" aria-hidden />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-brand-800/6" aria-hidden />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-800">
                {t("missionEyebrow")}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-snug text-brand-900 lg:text-5xl">
                {t("missionTitle")}
              </h2>
              <p className="mt-6 text-xl leading-relaxed text-ink-700">
                {t("missionBody")}
              </p>
            </div>

            {/* Visual accent: process strip */}
            <div className="lg:col-span-2" aria-hidden>
              <div className="grid gap-3">
                {[
                  { num: "01", label: "Förankra", icon: "M12 1v22M1 12h22" },
                  { num: "02", label: "Planera", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                  { num: "03", label: "Genomföra", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                  { num: "04", label: "Följa upp", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                  { num: "05", label: "Säkra kontinuitet", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                ].map((step, i, arr) => (
                  <div key={step.num} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                        <path d={step.icon} />
                      </svg>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="absolute ml-[18px] mt-10 h-3 w-px bg-brand-800/20" aria-hidden />
                    )}
                    <div>
                      <span className="text-xs font-semibold text-brand-800/60 uppercase tracking-wide">{step.num}</span>
                      <p className="font-semibold text-brand-900">{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sectors we serve – Civica-inspired ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="mb-4 font-display text-4xl font-bold text-brand-900 lg:text-5xl">
              {t("sectorsTitle")}
            </h2>
            <p className="max-w-3xl text-xl text-ink-700">{t("sectorsSubtitle")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((key) => (
              <article
                key={key}
                className="group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-paper to-white p-8 transition-all hover:-translate-y-1 hover:border-brand-800/30 hover:shadow-xl"
              >
                {/* icon placeholder */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-brand-900">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d={t(`sector.${key}.icon`)} />
                  </svg>
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-brand-900">
                  {t(`sector.${key}.title`)}
                </h3>
                <p className="mb-6 text-ink-700 leading-relaxed">
                  {t(`sector.${key}.body`)}
                </p>
                <Link
                  href={t(`sector.${key}.href`) as `/public-sector` | `/services`}
                  className="inline-flex items-center text-sm font-semibold text-brand-800 transition-colors group-hover:text-action-600"
                >
                  {t("learnMore")} →
                </Link>
                <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-brand-800 to-signal transition-transform group-hover:scale-x-100" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Our solutions support you to" – Civica checklist ── */}
      <section className="relative overflow-hidden bg-brand-900 py-20 text-white">
        {/* Background dot grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{backgroundImage: 'radial-gradient(circle, rgba(188,234,242,0.4) 1px, transparent 1px)', backgroundSize: '36px 36px'}}
          aria-hidden
        />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#007a96]/15 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-signal">
                {t("solutionsEyebrow")}
              </p>
              <h2 className="mb-6 font-display text-4xl font-bold lg:text-5xl">
                {t("solutionsTitle")}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                {t("solutionsBody")}
              </p>
              <div className="mt-8">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-brand-900 transition-all hover:bg-signal"
                >
                  {t("audienceBusinessCta")}
                </Link>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {solutionItems.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/25">
                    <svg className="h-3 w-3 text-signal" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                      <path d="M10.28 2.28a.75.75 0 0 0-1.06 0L4.5 7l-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06z" />
                    </svg>
                  </div>
                  <span className="text-white/90 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Cross-sector capabilities – Civica grid ── */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-brand-900 lg:text-5xl">
              {t("crossCapTitle")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-ink-700">
              {t("crossCapSubtitle")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {crossCaps.map((key, i) => (
              <div
                key={key}
                className="group rounded-xl border border-line bg-white p-6 transition-all hover:border-brand-800/30 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-signal/10">
                  <span className="text-sm font-bold text-brand-900">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mb-2 font-display font-semibold text-brand-900">
                  {t(`crossCap.${key}.title`)}
                </h3>
                <p className="text-sm text-ink-700 leading-relaxed">
                  {t(`crossCap.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Needs index ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-brand-900 lg:text-5xl">
              {t("needsTitle")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-ink-700">{t("needsSubtitle")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {needs.map((key, index) => (
              <div
                key={key}
                className="group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-paper to-white p-8 transition-all hover:-translate-y-1 hover:border-brand-800/30 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-brand-900 text-white">
                  <span className="text-lg font-bold">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-brand-900">
                  {t(`needs.${key}.title`)}
                </h3>
                <p className="text-ink-700 leading-relaxed">{t(`needs.${key}.body`)}</p>
                <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-brand-800 to-signal transition-transform group-hover:scale-x-100" />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg bg-brand-900 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-800"
            >
              {t("audienceBusinessCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Case studies – Civica customer stories ── */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mb-3 font-display text-4xl font-bold text-brand-900 lg:text-5xl">
                {t("caseStudiesTitle")}
              </h2>
              <p className="max-w-2xl text-xl text-ink-700">{t("caseStudiesSubtitle")}</p>
            </div>
            <Link
              href="/for-procuring-organizations"
              className="shrink-0 text-sm font-semibold text-brand-800 transition-colors hover:text-brand-900"
            >
              {t("evidenceCta")} →
            </Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {cases.map((key) => (
              <article
                key={key}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* color stripe */}
                <div className="h-2 w-full bg-gradient-to-r from-brand-800 to-signal" />
                <div className="p-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-800">
                    {t(`caseStudy.${key}.tag`)}
                  </p>
                  <h3 className="mb-4 font-display text-xl font-semibold text-brand-900 leading-snug">
                    {t(`caseStudy.${key}.title`)}
                  </h3>
                  <p className="mb-6 text-ink-700 leading-relaxed">
                    {t(`caseStudy.${key}.body`)}
                  </p>
                  <div className="inline-flex items-center text-sm font-semibold text-brand-800 transition-colors group-hover:text-action-600">
                    {t("learnMore")} →
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & compliance – Civica-inspired ── */}
      <section className="bg-brand-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 font-display text-4xl font-bold lg:text-5xl">
                {t("trustTitle")}
              </h2>
              <p className="mb-8 text-xl text-white/80 leading-relaxed">
                {t("trustBody")}
              </p>
              <Link
                href="/for-procuring-organizations"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-6 py-3 font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                {t("trustCta")}
              </Link>
            </div>
            <ul className="space-y-4">
              {(["t1", "t2", "t3"] as const).map((key) => (
                <li key={key} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-signal/20 flex items-center justify-center">
                    <svg className="h-3.5 w-3.5 text-signal" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                      <path d="M10.28 2.28a.75.75 0 0 0-1.06 0L4.5 7l-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06z" />
                    </svg>
                  </div>
                  <p className="text-white/90">{t(`trust.${key}`)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-brand-900 lg:text-5xl">
              {t("testimonialTitle")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-ink-700">
              {t("testimonialSubtitle")}
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {([1, 2] as const).map((n) => (
              <blockquote
                key={n}
                className="rounded-2xl border border-line bg-gradient-to-br from-paper to-white p-8"
              >
                <p className="mb-6 text-lg leading-relaxed text-ink-700 italic">
                  &ldquo;{t(`testimonial${n}Quote`)}&rdquo;
                </p>
                <footer className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white">
                    {t(`testimonial${n}Initials`)}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-900">{t(`testimonial${n}Name`)}</p>
                    <p className="text-sm text-ink-600">{t(`testimonial${n}Role`)}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Risk reduction ── */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="mb-4 font-display text-4xl font-bold text-brand-900 lg:text-5xl">
              {t("riskTitle")}
            </h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {risks.map((key, index) => (
              <li
                key={key}
                className="rounded-xl border border-line bg-white p-6 transition-all hover:border-brand-800/30 hover:shadow-lg"
              >
                <span className="mb-4 block text-3xl font-bold text-brand-800/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2 font-display font-semibold text-brand-900">
                  {t(`riskItems.${key}.title`)}
                </h3>
                <p className="text-sm text-ink-700 leading-relaxed">
                  {t(`riskItems.${key}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Insights section ── */}
      <InsightsSection locale={locale} />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-paper py-24">
        {/* Accent top border */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-signal via-signal/60 to-transparent" aria-hidden />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-start">
            {/* Left: headline + CTAs */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-signal">
                {t("ctaEyebrow")}
              </p>
              <h2 className="mb-5 font-display text-4xl font-bold leading-tight text-brand-900 lg:text-5xl">
                {t("closeTitle")}
              </h2>
              <p className="mb-10 max-w-lg text-lg leading-relaxed text-ink-700">{t("closeBody")}</p>
              <div className="flex flex-wrap gap-4">
                <TrackedLink
                  href="/contact"
                  event="cta_click"
                  eventData={{ placement: "home_close" }}
                  className="inline-flex items-center justify-center rounded-lg bg-brand-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2"
                >
                  {t("closeCta")}
                </TrackedLink>
                <a
                  href={contacts.phoneHref}
                  className="inline-flex items-center gap-2.5 rounded-lg border border-line px-8 py-4 text-base font-semibold text-brand-900 transition-all hover:border-brand-800/50 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2"
                >
                  <svg className="h-4 w-4 text-ink-400" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 0 0 2 3.5v1c0 5.523 4.477 10 10 10h1a1.5 1.5 0 0 0 1.5-1.5v-1.09a1.5 1.5 0 0 0-1.077-1.443l-2.2-.628a1.5 1.5 0 0 0-1.585.526l-.388.51a.75.75 0 0 1-.92.22 8.5 8.5 0 0 1-3.977-3.978.75.75 0 0 1 .22-.919l.51-.388a1.5 1.5 0 0 0 .526-1.585L5.59 3.077A1.5 1.5 0 0 0 4.5 2H3.5Z" clipRule="evenodd" />
                  </svg>
                  {contacts.phoneDisplay}
                </a>
              </div>
            </div>

            {/* Right: process card */}
            <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
              <h3 className="mb-6 font-display text-lg font-semibold text-brand-900">
                {t("ctaInfoTitle")}
              </h3>
              <ol className="space-y-5">
                {(["i1", "i2", "i3"] as const).map((key, idx) => (
                  <li key={key} className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-ink-700">{t(`ctaInfo.${key}`)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
