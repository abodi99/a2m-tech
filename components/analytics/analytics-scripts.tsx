/**
 * Analytics & tracking scripts for A2M Tech.
 *
 * Activated entirely by environment variables — nothing loads without config.
 *
 * Set in .env.local (dev) or Hostinger / Coolify env vars (production):
 *
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID   =  your-umami-website-id
 *   NEXT_PUBLIC_UMAMI_URL          =  https://analytics.yourdomain.com
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID  =  G-XXXXXXXXXX   (Google Analytics 4)
 *
 * Umami is privacy-friendly and GDPR-compliant without cookie consent.
 * GA4 requires cookie consent — it is NOT loaded until the user accepts.
 *
 * Import this component once in app/[locale]/layout.tsx.
 */

const UMAMI_ID  = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL;
const GA_ID     = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function AnalyticsScripts() {
  return (
    <>
      {/* ── Umami (privacy-friendly, no consent needed, self-hosted) ── */}
      {UMAMI_ID && UMAMI_URL && (
        <script
          defer
          src={`${UMAMI_URL}/script.js`}
          data-website-id={UMAMI_ID}
          // Respects Do Not Track automatically
          data-do-not-track="true"
          data-auto-track="true"
        />
      )}

      {/* ── Google Analytics 4 (loaded only after cookie consent) ── */}
      {GA_ID && (
        <>
          <script
            id="ga4-loader"
            dangerouslySetInnerHTML={{
              __html: `
                // GA4 is loaded only when analytics cookies are accepted.
                // The CookieConsent component sets window.__a2m_analytics = true
                // and calls loadGA4() after the user accepts.
                window.__GA_ID = ${JSON.stringify(GA_ID)};
                window.loadGA4 = function() {
                  if (window.__ga4Loaded) return;
                  window.__ga4Loaded = true;
                  var s = document.createElement('script');
                  s.async = true;
                  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.__GA_ID;
                  document.head.appendChild(s);
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', window.__GA_ID, {
                    anonymize_ip: true,
                    cookie_flags: 'SameSite=None;Secure'
                  });
                };
                // Auto-load if consent was previously given
                try {
                  if (localStorage.getItem('a2m_cookie_consent') === 'accepted') {
                    window.loadGA4();
                  }
                } catch(e) {}
              `,
            }}
          />
        </>
      )}
    </>
  );
}
