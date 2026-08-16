import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { SetHtmlLang } from "@/components/layout/set-html-lang";

const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL ?? "";
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
      <SkipLink />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      {umamiUrl && umamiWebsiteId && (
        <Script
          src={`${umamiUrl}/script.js`}
          data-website-id={umamiWebsiteId}
          strategy="afterInteractive"
          data-domains="a2m-tech.com"
        />
      )}
    </NextIntlClientProvider>
  );
}
