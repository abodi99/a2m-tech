"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const MARKS = [25, 50, 75, 100] as const;

/** Fires Umami scroll_depth events at 25/50/75/100% once per page view. */
export function ScrollDepthTracker() {
  const sent = useRef<Set<number>>(new Set());

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const mark of MARKS) {
        if (pct >= mark && !sent.current.has(mark)) {
          sent.current.add(mark);
          trackEvent("scroll_depth", {
            depth: mark,
            path: window.location.pathname,
          });
        }
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
