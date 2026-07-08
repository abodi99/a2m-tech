import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { localeUrl } from "@/lib/locale-url";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SetHtmlLang } from "@/components/layout/set-html-lang";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = localeUrl(loc);
  }
  languages["x-default"] = localeUrl(routing.defaultLocale);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localeUrl(locale),
      languages,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl(locale),
      siteName: "A2M Tech",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
      images: [{ url: "/brand/logo.png", width: 512, height: 512, alt: "A2M Tech" }],
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
      images: ["/brand/logo.png"],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SetHtmlLang />
      <Header />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
