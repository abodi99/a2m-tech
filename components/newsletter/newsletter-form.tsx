"use client";

/**
 * Newsletter / mailing-list subscription form.
 * Syncs to Listmonk and emails admin with attribution context.
 */

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { collectAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";

type State = "idle" | "submitting" | "success" | "error" | "invalid";

interface NewsletterFormProps {
  source?: string;
  className?: string;
  /** Footer uses dark surface; engagement prompt uses light. */
  tone?: "onDark" | "onLight";
  /** Hide heading/body when parent already provides copy */
  compact?: boolean;
}

export function NewsletterForm({
  source = "footer",
  className,
  tone = "onDark",
  compact = false,
}: NewsletterFormProps) {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const light = tone === "onLight";

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
      trackEvent("newsletter_signup", { source, locale });
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        className={cn(
          "rounded-xl p-5 text-center",
          light ? "border border-green-200 bg-green-50" : "border border-white/20 bg-white/10",
          className
        )}
      >
        <p className={cn("text-sm font-semibold", light ? "text-green-900" : "text-white")}>
          {t("successTitle")}
        </p>
        <p className={cn("mt-1 text-xs", light ? "text-green-700" : "text-white/65")}>
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-3", className)}>
      {!compact && (
        <>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              light ? "text-[#176BE0]" : "text-white/45"
            )}
          >
            {t("heading")}
          </p>
          <p className={cn("text-sm leading-relaxed", light ? "text-[#334B58]" : "text-white/70")}>
            {t("body")}
          </p>
        </>
      )}

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
            "min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2",
            light
              ? "border-[#D7E1E5] bg-white text-[#003347] placeholder:text-[#334B58]/50 focus:ring-[#003347]/40"
              : "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15 focus:ring-white/50",
            state === "invalid" && (light ? "border-red-400" : "border-red-400")
          )}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:opacity-60",
            light
              ? "bg-[#003347] text-white hover:bg-[#004869] focus:ring-[#003347]"
              : "border border-white/25 bg-white/8 text-white hover:border-white/50 hover:bg-white/15 focus:ring-white/50"
          )}
        >
          {state === "submitting" ? "…" : t("submit")}
        </button>
      </div>

      {state === "invalid" && (
        <p role="alert" className={cn("text-xs", light ? "text-red-600" : "text-red-300")}>
          {t("invalidEmail")}
        </p>
      )}
      {state === "error" && (
        <p role="alert" className={cn("text-xs", light ? "text-red-600" : "text-red-300")}>
          {t("errorGeneral")}
        </p>
      )}

      <p className={cn("text-xs", light ? "text-[#334B58]/60" : "text-white/35")}>{t("disclaimer")}</p>
    </form>
  );
}
