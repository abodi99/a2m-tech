"use client";

/**
 * Sends one visit beacon per browser session to /api/visit.php
 * so A2M receives an email alert for new visitors (rate-limited server-side).
 */

import { useEffect } from "react";

const SESSION_KEY = "a2m_visit_notified";

export function VisitNotifier() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable — still attempt once this page load
    }

    const params = new URLSearchParams(window.location.search);
    const payload = {
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || "",
      title: document.title || "",
      locale: document.documentElement.lang || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
      screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    };

    // fire-and-forget; ignore errors
    fetch("/api/visit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
