import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company, contacts } from "@/content/site";
import { cn } from "@/lib/utils";
import {
  JsonLd,
  buildPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

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
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
          aria-hidden
        />
        {/* Glow */}
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-signal/5 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-brand-800/30 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_440px]">
            {/* Left: copy */}
            <div>
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-4 py-1.5 text-sm font-medium text-signal">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                  {t("eyebrow")}
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                {t("heroTitle")}
              </h1>
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/85 lg:text-xl">
                {t("heroSubtitle")}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-900 transition-all hover:bg-signal focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-900"
                >
                  {t("ctaPrimary")}
                </Link>
                <Link
                  href="/delivery-capability"
                  className="inline-flex items-center justify-center rounded-lg border border-white/25 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-900"
                >
                  {t("ctaSecondary")}
                </Link>
              </div>

              {/* Trust strip */}
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-8 text-sm text-white/65">
                {(["heroTrustItem1", "heroTrustItem2", "heroTrustItem3"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0 text-signal" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                    {t(key)}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-signal" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path d="M8 1a4.5 4.5 0 0 0-4.5 4.5c0 1.526.76 2.873 1.926 3.685L4.012 14.5H12l-1.414-5.315A4.5 4.5 0 0 0 12.5 5.5 4.5 4.5 0 0 0 8 1Z" />
                  </svg>
                  <a href={contacts.phoneHref} className="transition-colors hover:text-white">
                    {contacts.phoneDisplay}
                  </a>
                </li>
              </ul>
            </div>

            {/* Right: Delivery lifecycle card visual */}
            <div className="hidden lg:block" aria-hidden>
              <div className="relative">
                {/* Main card */}
                <div className="rounded-2xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-signal">
                      {locale === "sv" ? "Leveranscykel" : "Delivery lifecycle"}
                    </span>
                    <span className="rounded-full bg-signal/20 px-2.5 py-0.5 text-xs font-medium text-signal">
                      {locale === "sv" ? "Aktivt uppdrag" : "Active"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {([
                      { phase: locale === "sv" ? "Kravanalyis & förankring" : "Requirements & alignment", done: true },
                      { phase: locale === "sv" ? "Planering & arkitektur" : "Planning & architecture", done: true },
                      { phase: locale === "sv" ? "Genomförande" : "Implementation", active: true },
                      { phase: locale === "sv" ? "Uppföljning & QA" : "Follow-up & QA", done: false },
                      { phase: locale === "sv" ? "Förvaltning & kontinuitet" : "Management & continuity", done: false },
                    ] as { phase: string; done?: boolean; active?: boolean }[]).map(({ phase, done, active }) => (
                      <div key={phase} className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5",
                        active ? "bg-signal/15 ring-1 ring-signal/30" : "bg-white/5"
                      )}>
                        <div className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          done ? "bg-signal" : active ? "border-2 border-signal" : "border border-white/20"
                        )}>
                          {done && (
                            <svg className="h-3 w-3 text-brand-900" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M10.28 2.28a.75.75 0 0 0-1.06 0L4.5 7l-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06z" />
                            </svg>
                          )}
                          {active && <div className="h-1.5 w-1.5 rounded-full bg-signal" />}
                        </div>
                        <span className={cn(
                          "text-sm",
                          done ? "text-white/60 line-through decoration-white/30" : active ? "font-medium text-white" : "text-white/50"
                        )}>
                          {phase}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Contact person */}
                  <div className="mt-4 flex items-center gap-3 rounded-lg border border-signal/20 bg-signal/5 px-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white">
                      AM
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {locale === "sv" ? "Kontaktperson" : "Your contact"}
                      </p>
                      <p className="text-xs text-white/55">{contacts.phoneDisplay}</p>
                    </div>
                    <div className="ml-auto h-2 w-2 rounded-full bg-signal" />
                  </div>
                </div>

                {/* Floating doc card */}
                <div className="absolute -right-6 -top-6 rounded-xl border border-white/10 bg-brand-900/90 px-4 py-3 shadow-xl backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-signal">
                    {locale === "sv" ? "Dokumentation" : "Documentation"}
                  </p>
                  <p className="mt-0.5 text-xs text-white/70">
                    {locale === "sv" ? "Spårbar · Komplett · Tillgänglig" : "Traceable · Complete · Accessible"}
                  </p>
                </div>

                {/* Floating trust badge */}
                <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/10 bg-brand-900/90 px-4 py-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-signal" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M8 1.5a.75.75 0 0 1 .692.461l1.25 3a.75.75 0 0 1-.138.822l-2.25 2.25a.75.75 0 1 1-1.06-1.06l1.85-1.85-.982-2.355A.75.75 0 0 1 8 1.5ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Zm6-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs font-semibold text-white">
                      {locale === "sv" ? "100 % transparens" : "100% transparency"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Mission statement – Civica big-text style ── */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-800">
            {t("missionEyebrow")}
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-3xl font-bold leading-snug text-brand-900 lg:text-5xl">
            {t("missionTitle")}
          </h2>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-ink-700">
            {t("missionBody")}
          </p>
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
      <section className="bg-brand-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/20">
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
              {(["t1", "t2", "t3", "t4"] as const).map((key) => (
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
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2"
                >
                  {t("closeCta")}
                </Link>
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
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-signal/20 bg-signal/5 px-4 py-3">
                <svg className="h-5 w-5 shrink-0 text-signal" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .75.75V6h3.5a.75.75 0 0 1 0 1.5H8.75v3.5a.75.75 0 0 1-1.5 0V7.5H3.75a.75.75 0 0 1 0-1.5h3.5V1.75A.75.75 0 0 1 8 1Z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-medium text-ink-700">{t("ctaNoCommit")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
