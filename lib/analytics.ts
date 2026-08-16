/**
 * First-party analytics helpers (Umami).
 * Safe no-ops when Umami is not loaded.
 */

type TrackProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void;
    };
  }
}

function cleanProps(props?: TrackProps): Record<string, string | number> | undefined {
  if (!props) return undefined;
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === "") continue;
    out[k] = typeof v === "boolean" ? (v ? 1 : 0) : v;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Fire a named Umami event (e.g. cta_click, insight_open). */
export function trackEvent(event: string, props?: TrackProps) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, cleanProps(props));
  } catch {
    /* noop */
  }
}
