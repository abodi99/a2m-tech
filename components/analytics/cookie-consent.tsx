"use client";

/**
 * Cookie preference banner.
 *
 * Umami (privacy-friendly first-party analytics) runs immediately.
 * This banner is mainly for optional Google Analytics 4 / marketing cookies.
 * If GA4 is not configured, the banner still informs visitors and links to policy.
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "a2m_cookie_prefs";

export type CookiePrefs = {
  necessary: true;
  analytics: true; // Umami always on
  marketing: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    loadGA4?: () => void;
  }
}

function readPrefs(): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePrefs;
  } catch {
    return null;
  }
}

function writePrefs(prefs: CookiePrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    localStorage.setItem(
      "a2m_cookie_consent",
      prefs.marketing ? "accepted" : "acknowledged"
    );
  } catch {
    /* noop */
  }
}

export function CookieConsent() {
  const t = useTranslations("cookieBanner");
  const [visible, setVisible] = useState(false);
  const gaConfigured = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  useEffect(() => {
    const existing = readPrefs();
    if (existing) {
      if (existing.marketing) window.loadGA4?.();
      return;
    }
    setVisible(true);
  }, []);

  function acknowledge(marketing: boolean) {
    const prefs: CookiePrefs = {
      necessary: true,
      analytics: true,
      marketing: gaConfigured ? marketing : false,
      updatedAt: new Date().toISOString(),
    };
    writePrefs(prefs);
    if (prefs.marketing) window.loadGA4?.();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D7E1E5] bg-white px-4 py-5 shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-xl sm:border sm:shadow-xl"
      style={{ animation: "a2mCookieIn 200ms ease-out" }}
    >
      <style>{`
        @keyframes a2mCookieIn {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes a2mCookieIn { from { opacity: 0 } to { opacity: 1 } }
        }
      `}</style>

      <p
        id="cookie-banner-title"
        className="text-xs font-semibold uppercase tracking-widest text-[#176BE0]"
      >
        {t("eyebrow")}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-[#334B58]">
        {t("body")}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => acknowledge(gaConfigured)}
          className="flex-1 rounded-lg bg-[#003347] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004869] focus:outline-none focus:ring-2 focus:ring-[#003347] focus:ring-offset-1"
        >
          {gaConfigured ? t("acceptAll") : t("gotIt")}
        </button>
        {gaConfigured && (
          <button
            type="button"
            onClick={() => acknowledge(false)}
            className="flex-1 rounded-lg border border-[#D7E1E5] px-4 py-2.5 text-sm font-semibold text-[#334B58] transition-colors hover:border-[#004869] hover:text-[#003347] focus:outline-none focus:ring-2 focus:ring-[#D7E1E5] focus:ring-offset-1"
          >
            {t("necessaryOnly")}
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-[#334B58]/70">
        <Link href="/cookies" className="underline hover:text-[#003347]">
          {t("policy")}
        </Link>
      </p>
    </div>
  );
}
