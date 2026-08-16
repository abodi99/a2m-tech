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

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale)]} />

      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(188,234,242,0.22), transparent 40%), radial-gradient(circle at 10% 80%, rgba(23,107,224,0.18), transparent 42%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-20 lg:px-8">
          <p className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            A2M Tech
          </p>
          <p className="mt-4 text-sm font-semibold tracking-wide text-signal">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={contacts.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg", variant: "soft" }))}
            >
              {t("ctaPrimary")}
            </a>
            <Link
              href="/delivery-capability"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
              )}
            >
              {t("ctaSecondary")}
            </Link>
          </div>
          <p className="mt-10 max-w-3xl border-t border-white/15 pt-6 text-sm text-white/75">
            <span className="font-semibold text-white">{company.legalName}</span>
            {" · "}
            <a href={contacts.phoneHref} className="hover:text-white">
              {contacts.phoneDisplay}
            </a>
          </p>
        </div>

      </section>

      <SectionAtmosphere tone="paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
              {t("predictableTitle")}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-700">
              {t("predictableIntro")}
            </p>
            <ol className="mt-10 space-y-6">
              {predictable.map((key, index) => (
                <li
                  key={key}
                  className="grid gap-2 border-t border-line pt-5 md:grid-cols-[3rem_1fr]"
                >
                  <span className="font-display text-xl font-bold text-brand-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand-900">
                      {t(`predictable.${key}.title`)}
                    </h3>
                    <p className="mt-1 text-ink-700">
                      {t(`predictable.${key}.body`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </SectionAtmosphere>

      <SectionAtmosphere tone="surface" className="border-y border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
            {t("needsTitle")}
          </h2>
          <p className="mt-3 text-ink-700">{t("needsSubtitle")}</p>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {needs.map((key, index) => (
              <li
                key={key}
                className="border border-line bg-paper/80 p-5 transition-colors hover:border-brand-800/30"
              >
                <p className="text-sm font-semibold text-brand-800">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-brand-900">
                  {t(`needs.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {t(`needs.${key}.body`)}
                </p>
              </li>
            ))}
          </ol>
          <Link
            href="/services"
            className="mt-10 inline-flex text-sm font-semibold text-brand-800 hover:text-brand-900"
          >
            {t("audienceBusinessCta")} →
          </Link>
        </div>
      </SectionAtmosphere>


      <SectionAtmosphere tone="brand">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            {t("audiencePublicTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-white/75">{t("audiencesSubtitle")}</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-[2px]">
              <h3 className="font-display text-xl font-semibold">
                {t("audienceBusinessTitle")}
              </h3>
              <p className="mt-3 leading-relaxed text-white/80">
                {t("audienceBusinessBody")}
              </p>
              <Link
                href="/services"
                className={cn(buttonVariants({ size: "lg", variant: "soft" }), "mt-6")}
              >
                {t("audienceBusinessCta")}
              </Link>
            </div>
            <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-[2px]">
              <h3 className="font-display text-xl font-semibold">
                {t("audiencePublicTitle")}
              </h3>
              <p className="mt-3 leading-relaxed text-white/80">
                {t("audiencePublicBody")}
              </p>
              <Link
                href="/public-sector"
                className={cn(buttonVariants({ size: "lg", variant: "soft" }), "mt-6")}
              >
                {t("audiencePublicCta")}
              </Link>
            </div>
          </div>
        </div>
      </SectionAtmosphere>

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


      {/* Optional video section - shown only if authentic material exists */}
      <section className="relative bg-ink-950 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {t("videoTitle")}
            </h2>
            <p className="mt-4 text-lg text-white/80">
              {t("videoBody")}
            </p>
          </div>
          <div className="mt-12">
            {/* Placeholder for when real video content is available */}
            <div className="aspect-[16/9] overflow-hidden rounded-lg bg-brand-900/50">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-surface/20 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-white/80 font-medium">
                    {t("videoPlaceholder")}
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    {t("videoNote")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
          {t("evidenceTitle")}
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-700">
          {t("evidenceBody")}
        </p>
        <Link
          href="/for-procuring-organizations"
          className="mt-6 inline-flex text-sm font-semibold text-brand-800 hover:text-brand-900"
        >
          {t("evidenceCta")} →
        </Link>
      </section>

      <section className="border-t border-line bg-[#eef3f5]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-brand-900">
            {t("closeTitle")}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-700">
            {t("closeBody")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={contacts.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              {common("bookMeeting")}
            </a>
            <a
              href={contacts.phoneHref}
              className={buttonVariants({ variant: "outline" })}
            >
              {common("callUs")}: {contacts.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
