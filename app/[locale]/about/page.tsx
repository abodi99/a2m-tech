import { getTranslations, setRequestLocale } from "next-intl/server";
import { company, team } from "@/content/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
// import { ContextImage } from "@/components/media/image-responsive";
import { PlaceholderImage } from "@/components/media/placeholder-generator";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    metaKey: "about",
    pathname: "/about",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const crumbs = await getTranslations("breadcrumbs");

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("about"), pathname: "/about" },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "about" }]} />
      <PageHero title={t("title")} intro={t("intro")} />

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("ownershipTitle")}
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
          {t("ownershipBody")}
        </p>
        <p className="mt-4 text-sm text-ink-500">{company.legalName}</p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("teamTitle")}
        </h2>
        <p className="mt-3 max-w-3xl text-ink-700">{t("teamIntro")}</p>
        
        {/* Team portraits grid */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person) => (
            <article key={person.id} className="text-center">
              <div className="overflow-hidden rounded-lg bg-line/10">
                <PlaceholderImage
                  width={300}
                  height={400}
                  text={person.name}
                  type="portrait"
                  className="aspect-[3/4] w-full"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">
                {person.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-brand-800">
                {t(person.roleKey)}
              </p>
              <p className="mt-2 text-sm text-ink-700">{t(person.bioKey)}</p>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-brand-800 hover:text-brand-900"
              >
                {t("linkedin")} →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("locationTitle")}
        </h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-ink-700">{t("locationBody")}</p>
          </div>
          <div>
            <PlaceholderImage
              width={600}
              height={400}
              text="Helsingborg Office & Remote Work"
              type="context"
              className="w-full rounded-lg"
            />
            <p className="mt-3 text-sm text-ink-700">
              {t("workspaceCaption")}
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
