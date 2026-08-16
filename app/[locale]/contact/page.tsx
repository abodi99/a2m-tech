import { getTranslations, setRequestLocale } from "next-intl/server";
import { contacts } from "@/content/site";
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
    metaKey: "contact",
    pathname: "/contact",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const crumbs = await getTranslations("breadcrumbs");
  const after = ["a1", "a2", "a3"] as const;

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: crumbs("contact"), pathname: "/contact" },
        ])}
      />
      <Breadcrumbs locale={locale} items={[{ labelKey: "contact" }]} />
      <PageHero title={t("title")} intro={t("intro")} />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section className="border-t border-line pt-8">
          <h2 className="font-display text-xl font-semibold text-brand-900">
            {t("bookTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">{t("bookBody")}</p>
          <a
            href={contacts.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(), "mt-6"
            )}
          >
            {t("bookCta")}
          </a>
        </section>

        <section className="border-t border-line pt-8">
          <h2 className="font-display text-xl font-semibold text-brand-900">
            {t("phoneTitle")}
          </h2>
          <p className="mt-3">
            <a
              href={contacts.phoneHref}
              className="text-lg font-semibold text-brand-800 hover:text-brand-800"
            >
              {contacts.phoneDisplay}
            </a>
          </p>
          <p className="mt-6 text-sm text-ink-500">{t("noEmailNote")}</p>
        </section>
      </div>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("afterTitle")}
        </h2>
        <ol className="mt-6 space-y-4">
          {after.map((key, index) => (
            <li key={key} className="flex gap-3 text-ink-700">
              <span className="font-semibold text-brand-800">{index + 1}.</span>
              {t(`afterItems.${key}`)}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t("socialTitle")}
        </h2>
        <a
          href={contacts.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-sm font-semibold text-brand-800 hover:text-brand-900"
        >
          LinkedIn →
        </a>
      </section>
    </PageShell>
  );
}
