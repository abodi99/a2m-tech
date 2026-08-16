"use client";

/**
 * Newsletter / mailing-list subscription form.
 * Syncs to Listmonk and emails admin with attribution context.
 */

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { collectAttribution } from "@/lib/attribution";

type State = "idle" | "submitting" | "success" | "error" | "invalid";

interface NewsletterFormProps {
  source?: string;
  className?: string;
}

export function NewsletterForm({ source = "footer", className }: NewsletterFormProps) {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState("invalid");
      return;
    }

    setState("submitting");

    try {
      const attribution = collectAttribution(locale);
      const res = await fetch("/api/subscribe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source,
          ...attribution,
        }),
      });

      if (!res.ok) throw new Error("submit_failed");
      setState("success");
      setEmail("");

      const w = window as Window & {
        umami?: { track: (event: string, props?: Record<string, string>) => void };
        gtag?: (...args: unknown[]) => void;
      };
      w.umami?.track("newsletter_signup", { source, locale });
      w.gtag?.("event", "newsletter_signup", { event_category: "engagement", source });
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className={cn("rounded-xl border border-white/20 bg-white/10 p-5 text-center", className)}>
        <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white">{t("successTitle")}</p>
        <p className="mt-1 text-xs text-white/65">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-3", className)}>
      <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
        {t("heading")}
      </p>
      <p className="text-sm leading-relaxed text-white/70">{t("body")}</p>

      <div className="flex gap-2 pt-1">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid") setState("idle");
          }}
          placeholder={t("placeholder")}
          autoComplete="email"
          aria-label={t("placeholder")}
          aria-invalid={state === "invalid"}
          className={cn(
            "min-w-0 flex-1 rounded-lg border bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 transition focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/50",
            state === "invalid" ? "border-red-400" : "border-white/20"
          )}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="shrink-0 rounded-lg border border-white/25 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-60"
        >
          {state === "submitting" ? "…" : t("submit")}
        </button>
      </div>

      {state === "invalid" && (
        <p role="alert" className="text-xs text-red-300">{t("invalidEmail")}</p>
      )}
      {state === "error" && (
        <p role="alert" className="text-xs text-red-300">{t("errorGeneral")}</p>
      )}

      <p className="text-xs text-white/35">{t("disclaimer")}</p>
    </form>
  );
}
