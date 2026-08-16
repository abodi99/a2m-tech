/**
 * First-party attribution context for forms.
 * Captures as much useful marketing context as possible without invasive fingerprinting.
 * Identity (name/email) only comes when the visitor submits a form.
 */

const LANDING_KEY = "a2m_landing";
const REFERRER_KEY = "a2m_referrer";

export type AttributionContext = {
  page: string;
  landing: string;
  referrer: string;
  locale: string;
  language: string;
  timezone: string;
  screen: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  gclid: string;
  fbclid: string;
  msclkid: string;
};

function readParam(sp: URLSearchParams, key: string): string {
  return (sp.get(key) || "").slice(0, 200);
}

export function collectAttribution(locale = ""): AttributionContext {
  if (typeof window === "undefined") {
    return {
      page: "",
      landing: "",
      referrer: "",
      locale,
      language: "",
      timezone: "",
      screen: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      gclid: "",
      fbclid: "",
      msclkid: "",
    };
  }

  const sp = new URLSearchParams(window.location.search);
  const path = window.location.pathname + window.location.search;

  let landing = "";
  let firstReferrer = "";
  try {
    landing = sessionStorage.getItem(LANDING_KEY) || "";
    firstReferrer = sessionStorage.getItem(REFERRER_KEY) || "";
    if (!landing) {
      landing = path;
      sessionStorage.setItem(LANDING_KEY, landing);
    }
    if (!firstReferrer) {
      firstReferrer = document.referrer || "";
      sessionStorage.setItem(REFERRER_KEY, firstReferrer);
    }
  } catch {
    landing = path;
    firstReferrer = document.referrer || "";
  }

  return {
    page: path.slice(0, 500),
    landing: landing.slice(0, 500),
    referrer: firstReferrer.slice(0, 500),
    locale,
    language: (navigator.language || "").slice(0, 40),
    timezone: (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      } catch {
        return "";
      }
    })(),
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    utm_source: readParam(sp, "utm_source"),
    utm_medium: readParam(sp, "utm_medium"),
    utm_campaign: readParam(sp, "utm_campaign"),
    utm_content: readParam(sp, "utm_content"),
    utm_term: readParam(sp, "utm_term"),
    gclid: readParam(sp, "gclid"),
    fbclid: readParam(sp, "fbclid"),
    msclkid: readParam(sp, "msclkid"),
  };
}
