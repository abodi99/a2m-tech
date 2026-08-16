"use client";

/**
 * GDPR/ePrivacy cookie preference banner.
 *
 * Categories:
 *  - necessary  — always on (locale, consent storage)
 *  - analytics  — Umami (privacy-friendly, first-party)
 *  - marketing  — Google Analytics 4 (only if configured)
 *
 * Umami and GA4 load only after the visitor opts in.
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "a2m_cookie_prefs";

export type CookiePrefs = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    loadGA4?: () => void;
    loadUmami?: () => void;
    __a2mApplyConsent?: (prefs: CookiePrefs) => void;
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
    // Legacy flag for older GA loader
    localStorage.setItem(
      "a2m_cookie_consent",
      prefs.marketing || prefs.analytics ? "accepted" : "declined"
    );
  } catch {
    /* noop */
  }
}

function applyPrefs(prefs: CookiePrefs) {
  if (typeof window === "undefined") return;
  if (prefs.analytics) window.loadUmami?.();
  if (prefs.marketing) window.loadGA4?.();
  window.__a2mApplyConsent?.(prefs);
}

export function CookieConsent() {
  const t = useTranslations("cookieBanner");
  const [visible, setVisible] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const gaConfigured = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  useEffect(() => {
    const existing = readPrefs();
    if (existing) {
      applyPrefs(existing);
      return;
    }
    setVisible(true);
  }, []);

  function save(nextAnalytics: boolean, nextMarketing: boolean) {
    const prefs: CookiePrefs = {
      necessary: true,
      analytics: nextAnalytics,
      marketing: gaConfigured ? nextMarketing : false,
      updatedAt: new Date().toISOString(),
    };
    writePrefs(prefs);
    applyPrefs(prefs);
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

      {openDetails && (
        <fieldset className="mt-4 space-y-3 rounded-lg border border-[#D7E1E5] bg-[#F7F9F8] p-3">
          <legend className="sr-only">{t("categories")}</legend>

          <label className="flex items-start gap-3 text-sm text-[#334B58]">
            <input type="checkbox" checked disabled className="mt-1" />
            <span>
              <span className="font-semibold text-[#003347]">{t("necessary")}</span>
              <span className="block text-xs text-[#334B58]/80">{t("necessaryHint")}</span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-[#334B58]">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="font-semibold text-[#003347]">{t("analytics")}</span>
              <span className="block text-xs text-[#334B58]/80">{t("analyticsHint")}</span>
            </span>
          </label>

          {gaConfigured && (
            <label className="flex items-start gap-3 text-sm text-[#334B58]">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="font-semibold text-[#003347]">{t("marketing")}</span>
                <span className="block text-xs text-[#334B58]/80">{t("marketingHint")}</span>
              </span>
            </label>
          )}
        </fieldset>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => save(true, gaConfigured)}
          className="flex-1 rounded-lg bg-[#003347] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004869] focus:outline-none focus:ring-2 focus:ring-[#003347] focus:ring-offset-1"
        >
          {t("acceptAll")}
        </button>
        <button
          type="button"
          onClick={() => save(false, false)}
          className="flex-1 rounded-lg border border-[#D7E1E5] px-4 py-2.5 text-sm font-semibold text-[#334B58] transition-colors hover:border-[#004869] hover:text-[#003347] focus:outline-none focus:ring-2 focus:ring-[#D7E1E5] focus:ring-offset-1"
        >
          {t("necessaryOnly")}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#334B58]/70">
        <button
          type="button"
          onClick={() => setOpenDetails((v) => !v)}
          className="underline hover:text-[#003347]"
        >
          {openDetails ? t("hideDetails") : t("showDetails")}
        </button>
        {openDetails && (
          <button
            type="button"
            onClick={() => save(analytics, marketing)}
            className="font-semibold text-[#003347] underline"
          >
            {t("save")}
          </button>
        )}
        <Link href="/cookies" className="underline hover:text-[#003347]">
          {t("policy")}
        </Link>
      </div>
    </div>
  );
}
