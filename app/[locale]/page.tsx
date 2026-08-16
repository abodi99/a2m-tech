import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company, contacts } from "@/content/site";
import { SectionAtmosphere } from "@/components/brand/visual-system";
// import { VideoPlayer } from "@/components/media/video-player";
import { buttonVariants } from "@/components/ui/button";
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
  const predictable = ["p1", "p2", "p3", "p4", "p5"] as const;
  const risks = ["r1", "r2", "r3", "r4"] as const;
  const capabilities = ["c1", "c2", "c3", "c4"] as const;

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale)]} />

      {/* Hero Section - Netcompany inspired */}
      <section className="relative min-h-[75vh] overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-signal/20 px-4 py-2 text-sm font-medium text-signal">
                {t("eyebrow")}
              </span>
            </div>
            
            <h1 className="mb-8 font-display text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
              {t("heroTitle")}
            </h1>
            
            <p className="mb-12 max-w-2xl text-xl leading-relaxed text-white/90 lg:text-2xl">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <a
                href={contacts.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-brand-900 transition-all hover:bg-signal hover:text-brand-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-900"
              >
                {t("ctaPrimary")}
              </a>
              
              <Link
                href="/delivery-capability"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-900"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-8 border-t border-white/20 pt-8 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-signal" />
                <span>{company.legalName}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-signal" />
                <a href={contacts.phoneHref} className="hover:text-white transition-colors">
                  {contacts.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-signal" />
                <span>{t("heroEstablished")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Insights Section - Netcompany inspired */}
      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="mb-4 font-display text-4xl font-bold text-brand-900 lg:text-5xl">
              {t("insightsTitle")}
            </h2>
            <p className="max-w-3xl text-xl text-ink-700">
              {t("insightsSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {predictable.slice(0, 3).map((key, index) => (
              <article 
                key={key}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-signal/20">
                    <span className="text-xl font-bold text-brand-900">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold text-brand-900">
                    {t(`predictable.${key}.title`)}
                  </h3>
                  <p className="text-ink-700 leading-relaxed">
                    {t(`predictable.${key}.body`)}
                  </p>
                </div>
                <div className="inline-flex items-center text-sm font-semibold text-brand-800 group-hover:text-action-600">
                  {t("learnMore")} →
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/delivery-capability"
              className="inline-flex items-center justify-center rounded-lg bg-brand-900 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-800"
            >
              {t("viewAllCapabilities")}
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-brand-900 lg:text-5xl">
              {t("needsTitle")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-ink-700">
              {t("needsSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {needs.map((key, index) => (
              <div
                key={key}
                className="group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-paper to-white p-8 transition-all hover:border-brand-800/30 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-6">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-brand-900 text-white">
                    <span className="text-lg font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mb-4 font-display text-xl font-semibold text-brand-900">
                    {t(`needs.${key}.title`)}
                  </h3>
                  <p className="text-ink-700 leading-relaxed">
                    {t(`needs.${key}.body`)}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-brand-800 to-signal transform scale-x-0 transition-transform group-hover:scale-x-100" />
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg bg-brand-900 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-800"
            >
              {t("audienceBusinessCta")}
            </Link>
          </div>
        </div>
      </section>


      {/* Quality & Partnership Section */}
      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 font-display text-3xl font-bold text-brand-900">
                {t("qualityTitle")}
              </h2>
              <p className="mb-8 text-lg text-ink-700 leading-relaxed">
                {t("qualityBody")}
              </p>
              <Link
                href="/quality-security"
                className="inline-flex items-center justify-center rounded-lg border-2 border-brand-900 px-6 py-3 font-semibold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
              >
                {t("qualityCta")}
              </Link>
            </div>

            <div>
              <h2 className="mb-6 font-display text-3xl font-bold text-brand-900">
                {t("partnershipTitle")}
              </h2>
              <p className="mb-8 text-lg text-ink-700 leading-relaxed">
                {t("partnershipBody")}
              </p>
              <Link
                href="/partnership"
                className="inline-flex items-center justify-center rounded-lg border-2 border-brand-900 px-6 py-3 font-semibold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
              >
                {t("partnershipCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Success Stories Section */}
      <section className="bg-brand-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold lg:text-5xl">
              {t("testimonialTitle")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/80">
              {t("testimonialSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="mb-6">
                <p className="text-lg leading-relaxed text-white/90">
                  "{t('testimonial1Quote')}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-signal/20 flex items-center justify-center">
                  <span className="font-bold text-brand-900">KS</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{t('testimonial1Name')}</p>
                  <p className="text-sm text-white/70">{t('testimonial1Role')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="mb-6">
                <p className="text-lg leading-relaxed text-white/90">
                  "{t('testimonial2Quote')}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-signal/20 flex items-center justify-center">
                  <span className="font-bold text-brand-900">MÖ</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{t('testimonial2Name')}</p>
                  <p className="text-sm text-white/70">{t('testimonial2Role')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionAtmosphere tone="paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">
              {t("qualityTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-700">{t("qualityBody")}</p>
            <Link
              href="/quality-security"
              className="mt-6 inline-flex text-sm font-semibold text-brand-800 hover:text-brand-900"
            >
              {t("qualityCta")} →
            </Link>
            <h2 className="mt-10 font-display text-2xl font-bold text-brand-900">
              {t("partnershipTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-700">
              {t("partnershipBody")}
            </p>
            <Link
              href="/partnership"
              className="mt-6 inline-flex text-sm font-semibold text-brand-800 hover:text-brand-900"
            >
              {t("partnershipCta")} →
            </Link>
          </div>
        </div>
      </SectionAtmosphere>

      <SectionAtmosphere tone="surface" className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
              {t("riskTitle")}
            </h2>
            <ol className="mt-10 space-y-6">
              {risks.map((key, index) => (
                <li key={key} className="flex gap-4">
                  <span className="font-display text-2xl font-bold text-brand-800">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand-900">
                      {t(`riskItems.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-700">
                      {t(`riskItems.${key}.body`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </SectionAtmosphere>



      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-900 to-brand-800 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display text-4xl font-bold lg:text-5xl">
            {t("closeTitle")}
          </h2>
          <p className="mb-12 text-xl text-white/90 leading-relaxed">
            {t("closeBody")}
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <a
              href={contacts.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-brand-900 transition-all hover:bg-signal hover:text-brand-900"
            >
              {common("bookMeeting")}
            </a>
            
            <a
              href={contacts.phoneHref}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              {common("callUs")}: {contacts.phoneDisplay}
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 border-t border-white/20 pt-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-signal" />
              <span>{t("evidenceTitle")}</span>
            </div>
            <Link
              href="/for-procuring-organizations"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <div className="h-2 w-2 rounded-full bg-signal" />
              <span>{t("evidenceCta")}</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
