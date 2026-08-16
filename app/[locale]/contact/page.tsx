import { getTranslations, setRequestLocale } from "next-intl/server";
import { contacts } from "@/content/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero, PageShell } from "@/components/layout/page-shell";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact/contact-form";

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

      <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_380px]">
        {/* Contact form – main */}
        <section>
          <h2 className="mb-6 font-display text-2xl font-bold text-brand-900">
            {t("formTitle")}
          </h2>
          <ContactForm />
        </section>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Phone */}
          <div className="rounded-xl border border-line bg-paper p-6">
            <h3 className="mb-3 font-display text-lg font-semibold text-brand-900">
              {t("phoneTitle")}
            </h3>
            <a
              href={contacts.phoneHref}
              className="text-xl font-semibold text-brand-800 hover:text-brand-900 transition-colors"
            >
              {contacts.phoneDisplay}
            </a>
            <p className="mt-3 text-sm text-ink-600">{t("phoneNote")}</p>
          </div>

          {/* After contact */}
          <div className="rounded-xl border border-line bg-paper p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-brand-900">
              {t("afterTitle")}
            </h3>
            <ol className="space-y-3">
              {after.map((key, index) => (
                <li key={key} className="flex gap-3 text-sm text-ink-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-900 text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  {t(`afterItems.${key}`)}
                </li>
              ))}
            </ol>
          </div>

          {/* LinkedIn */}
          <div className="rounded-xl border border-line bg-paper p-6">
            <h3 className="mb-3 font-display text-lg font-semibold text-brand-900">
              {t("socialTitle")}
            </h3>
            <a
              href={contacts.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-brand-900 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
