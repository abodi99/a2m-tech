"use client";

/**
 * Calm engagement prompt after meaningful scroll.
 * Offers newsletter signup or contact — Nordic institutional, not startup pop-up.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "a2m_engagement_prompt";
const SCROLL_THRESHOLD = 0.35; // 35% of page

export function EngagementPrompt() {
  const t = useTranslations("engagementPrompt");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"choose" | "subscribe">("choose");

  useEffect(() => {
    // Don't interrupt contact/privacy/cookies flows
    if (
      pathname?.includes("/contact") ||
      pathname?.includes("/kontakt") ||
      pathname?.includes("/privacy") ||
      pathname?.includes("/integritet") ||
      pathname?.includes("/cookies")
    ) {
      return;
    }

    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* continue */
    }

    let shown = false;

    function show() {
      if (shown) return;
      shown = true;
      setVisible(true);
      trackEvent("engagement_prompt_shown", { path: pathname || "/" });
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* noop */
      }
    }

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= SCROLL_THRESHOLD) {
        show();
        window.removeEventListener("scroll", onScroll);
      }
    }

    const timer = window.setTimeout(show, 45000); // fallback after 45s
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  function dismiss() {
    trackEvent("engagement_prompt_dismiss", { path: pathname || "/" });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="engagement-prompt-title"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#D7E1E5] bg-white shadow-[0_-8px_30px_rgba(0,51,71,0.08)] sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md sm:rounded-xl sm:border"
      style={{ animation: "a2mEngageIn 220ms ease-out" }}
    >
      <style>{`
        @keyframes a2mEngageIn {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes a2mEngageIn { from { opacity: 0 } to { opacity: 1 } }
        }
      `}</style>

      <div className="relative px-5 py-5 sm:px-6">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-sm p-2 text-[#334B58]/60 transition hover:text-[#003347] focus:outline-none focus:ring-2 focus:ring-[#003347]/30"
          aria-label={t("close")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <p className="pr-8 text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
          {t("eyebrow")}
        </p>
        <h2
          id="engagement-prompt-title"
          className="mt-1.5 font-display text-lg font-semibold text-[#003347]"
        >
          {t("title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#334B58]">{t("body")}</p>

        {mode === "choose" ? (
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMode("subscribe");
                trackEvent("engagement_prompt_subscribe_open", { path: pathname || "/" });
              }}
              className="rounded-lg bg-[#003347] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004869] focus:outline-none focus:ring-2 focus:ring-[#003347] focus:ring-offset-1"
            >
              {t("subscribeCta")}
            </button>
            <TrackedLink
              href="/contact"
              event="engagement_prompt_contact"
              eventData={{ path: pathname || "/" }}
              onClick={() => setVisible(false)}
              className="rounded-lg border border-[#D7E1E5] px-4 py-3 text-center text-sm font-semibold text-[#003347] transition hover:border-[#004869] focus:outline-none focus:ring-2 focus:ring-[#003347]/30"
            >
              {t("contactCta")}
            </TrackedLink>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-[#D7E1E5] bg-[#F7F9F8] p-4">
            <NewsletterForm source="engagement_prompt" tone="onLight" compact />
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="mt-3 text-xs font-semibold text-[#176BE0] underline"
            >
              {t("back")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
