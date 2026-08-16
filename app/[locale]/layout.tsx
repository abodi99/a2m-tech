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
import { CookieConsent } from "@/components/analytics/cookie-consent";
import { VisitNotifier } from "@/components/analytics/visit-notifier";

const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL ?? "";
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "";
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

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

      {/* Umami loads immediately — privacy-friendly first-party analytics */}
      {umamiUrl && umamiWebsiteId && (
        <Script
          src={`${umamiUrl.replace(/\/$/, "")}/script.js`}
          data-website-id={umamiWebsiteId}
          data-domains="a2m-tech.com,www.a2m-tech.com"
          strategy="afterInteractive"
        />
      )}

      {/* GA4 only after marketing consent */}
      {gaMeasurementId && (
        <Script id="a2m-ga4-init" strategy="afterInteractive">
          {`
(function(){
  window.__GA_ID = ${JSON.stringify(gaMeasurementId)};
  window.loadGA4 = function(){
    if (window.__ga4Loaded || !window.__GA_ID) return;
    window.__ga4Loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.__GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', window.__GA_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });
  };
  try {
    var raw = localStorage.getItem('a2m_cookie_prefs');
    if (raw) {
      var prefs = JSON.parse(raw);
      if (prefs && prefs.marketing) window.loadGA4();
    }
  } catch (e) {}
})();
          `}
        </Script>
      )}

      <VisitNotifier />
      <CookieConsent />
    </NextIntlClientProvider>
  );
}
