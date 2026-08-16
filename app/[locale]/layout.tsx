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

  const analyticsCfg = JSON.stringify({
    umamiUrl,
    umamiWebsiteId,
    gaMeasurementId,
  });

  return (
    <NextIntlClientProvider messages={messages}>
      <SetHtmlLang />
      <SkipLink />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />

      {/* Loaders only — scripts activate after cookie consent */}
      <Script id="a2m-analytics-init" strategy="afterInteractive">
        {`
(function(){
  var cfg = ${analyticsCfg};
  window.__a2mAnalytics = cfg;

  window.loadUmami = function(){
    if (window.__umamiLoaded || !cfg.umamiUrl || !cfg.umamiWebsiteId) return;
    window.__umamiLoaded = true;
    var s = document.createElement('script');
    s.defer = true;
    s.src = String(cfg.umamiUrl).replace(/\\/$/, '') + '/script.js';
    s.setAttribute('data-website-id', cfg.umamiWebsiteId);
    s.setAttribute('data-domains', 'a2m-tech.com');
    s.setAttribute('data-do-not-track', 'true');
    document.head.appendChild(s);
  };

  window.loadGA4 = function(){
    if (window.__ga4Loaded || !cfg.gaMeasurementId) return;
    window.__ga4Loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.gaMeasurementId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', cfg.gaMeasurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });
  };

  try {
    var raw = localStorage.getItem('a2m_cookie_prefs');
    if (!raw) return;
    var prefs = JSON.parse(raw);
    if (prefs && prefs.analytics) window.loadUmami();
    if (prefs && prefs.marketing) window.loadGA4();
  } catch (e) {}
})();
        `}
      </Script>

      <CookieConsent />
    </NextIntlClientProvider>
  );
}
