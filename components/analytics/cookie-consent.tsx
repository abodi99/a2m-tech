"use client";

/**
 * GDPR cookie consent banner for A2M Tech.
 *
 * - Shows on first visit if analytics (GA4) is configured
 * - Stores choice in localStorage under 'a2m_cookie_consent'
 * - If accepted, calls window.loadGA4() to activate Google Analytics
 * - If Umami is configured it runs without consent (privacy-friendly)
 * - Respects prefers-reduced-motion for the slide-in animation
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "a2m_cookie_consent";
const GA_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!GA_CONFIGURED) return; // no consent banner needed if GA4 not configured
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage blocked (private mode etc.) — skip banner
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch { /* noop */ }
    setVisible(false);
    if (typeof window !== "undefined" && typeof (window as Window & { loadGA4?: () => void }).loadGA4 === "function") {
      (window as Window & { loadGA4?: () => void }).loadGA4?.();
    }
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch { /* noop */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie-inställningar"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D7E1E5] bg-white px-4 py-4 shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:rounded-xl sm:border sm:shadow-xl"
      style={{ animation: "slideUp 200ms ease-out" }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes slideUp { from { opacity:0 } to { opacity:1 } }
        }
      `}</style>

      <p className="text-xs font-semibold uppercase tracking-widest text-[#176BE0] mb-1.5">
        Kakor & analys
      </p>
      <p className="text-sm leading-relaxed text-[#334B58] mb-4">
        Vi använder analyskakor för att förstå hur besökare hittar och använder sajten.
        Inga personuppgifter säljs. Du kan alltid ändra ditt val.
      </p>

      <div className="flex gap-3">
        <button
          onClick={accept}
          className="flex-1 rounded-lg bg-[#003347] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004869] focus:outline-none focus:ring-2 focus:ring-[#003347] focus:ring-offset-1"
        >
          Acceptera
        </button>
        <button
          onClick={decline}
          className="flex-1 rounded-lg border border-[#D7E1E5] px-4 py-2.5 text-sm font-semibold text-[#334B58] transition-colors hover:border-[#004869] hover:text-[#003347] focus:outline-none focus:ring-2 focus:ring-[#D7E1E5] focus:ring-offset-1"
        >
          Avböj
        </button>
      </div>

      <p className="mt-3 text-xs text-[#334B58]/60">
        Läs mer i vår{" "}
        <a href="/sv/integritet" className="underline hover:text-[#003347]">
          integritetspolicy
        </a>
        .
      </p>
    </div>
  );
}
