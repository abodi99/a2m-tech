"use client";

import { useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { collectAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";

type FormState = "idle" | "submitting" | "success" | "error";

type FormData = {
  name: string;
  organization: string;
  contact: string;
  message: string;
  honeypot: string;
};

const initialData: FormData = {
  name: "",
  organization: "",
  contact: "",
  message: "",
  honeypot: "",
};

export function ContactForm({ className }: { className?: string }) {
  const t = useTranslations("contactForm");
  const locale = useLocale();
  const [state, setState] = useState<FormState>("idle");
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validate = () => {
    const e: typeof errors = {};
    if (!data.name.trim()) e.name = t("errorRequired");
    if (!data.contact.trim()) e.contact = t("errorRequired");
    if (!data.message.trim()) e.message = t("errorRequired");
    if (data.message.trim().length < 10) e.message = t("errorTooShort");
    return e;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.honeypot) return; // spam bot
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setState("submitting");

    try {
      const attribution = collectAttribution(locale);
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          organization: data.organization,
          contact: data.contact,
          message: data.message,
          ...attribution,
        }),
      });
      if (!res.ok) throw new Error("submit_failed");
      setState("success");
      setData(initialData);
      formRef.current?.reset();

      trackEvent("contact_submit", {
        source: attribution.page,
        locale,
      });
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className={cn("rounded-2xl border border-green-200 bg-green-50 p-8 text-center", className)}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 font-display text-xl font-semibold text-green-900">{t("successTitle")}</h3>
        <p className="text-green-800">{t("successBody")}</p>
        <button
          onClick={() => setState("idle")}
          className="mt-6 text-sm font-semibold text-green-700 underline hover:text-green-900"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={cn("space-y-6", className)}
      aria-label={t("ariaLabel")}
    >
      {/* honeypot – hidden from real users */}
      <div className="hidden" aria-hidden>
        <input
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={data.honeypot}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="cf-name" className="mb-2 block text-sm font-semibold text-brand-900">
            {t("labelName")} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={data.name}
            onChange={handleChange}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
            aria-invalid={!!errors.name}
            className={cn(
              "w-full rounded-lg border bg-white px-4 py-3 text-brand-900 placeholder:text-ink-400 transition focus:outline-none focus:ring-2 focus:ring-brand-800",
              errors.name ? "border-red-400 focus:ring-red-400" : "border-line"
            )}
            placeholder={t("placeholderName")}
          />
          {errors.name && (
            <p id="cf-name-err" role="alert" className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="cf-org" className="mb-2 block text-sm font-semibold text-brand-900">
            {t("labelOrg")}
          </label>
          <input
            id="cf-org"
            name="organization"
            type="text"
            autoComplete="organization"
            value={data.organization}
            onChange={handleChange}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-brand-900 placeholder:text-ink-400 transition focus:outline-none focus:ring-2 focus:ring-brand-800"
            placeholder={t("placeholderOrg")}
          />
        </div>
      </div>

      {/* Contact (email or phone) */}
      <div>
        <label htmlFor="cf-contact" className="mb-2 block text-sm font-semibold text-brand-900">
          {t("labelContact")} <span className="text-red-500" aria-hidden>*</span>
        </label>
        <input
          id="cf-contact"
          name="contact"
          type="text"
          autoComplete="email"
          required
          value={data.contact}
          onChange={handleChange}
          aria-describedby={errors.contact ? "cf-contact-err" : "cf-contact-hint"}
          aria-invalid={!!errors.contact}
          className={cn(
            "w-full rounded-lg border bg-white px-4 py-3 text-brand-900 placeholder:text-ink-400 transition focus:outline-none focus:ring-2 focus:ring-brand-800",
            errors.contact ? "border-red-400 focus:ring-red-400" : "border-line"
          )}
          placeholder={t("placeholderContact")}
        />
        <p id="cf-contact-hint" className="mt-1 text-xs text-ink-500">{t("contactHint")}</p>
        {errors.contact && (
          <p id="cf-contact-err" role="alert" className="mt-1 text-xs text-red-600">{errors.contact}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className="mb-2 block text-sm font-semibold text-brand-900">
          {t("labelMessage")} <span className="text-red-500" aria-hidden>*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          value={data.message}
          onChange={handleChange}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
          aria-invalid={!!errors.message}
          className={cn(
            "w-full resize-none rounded-lg border bg-white px-4 py-3 text-brand-900 placeholder:text-ink-400 transition focus:outline-none focus:ring-2 focus:ring-brand-800",
            errors.message ? "border-red-400 focus:ring-red-400" : "border-line"
          )}
          placeholder={t("placeholderMessage")}
        />
        {errors.message && (
          <p id="cf-message-err" role="alert" className="mt-1 text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      {state === "error" && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {t("errorGeneral")}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-900 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 disabled:opacity-60"
        >
          {state === "submitting" ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("sending")}
            </>
          ) : (
            t("submit")
          )}
        </button>
        <p className="text-xs text-ink-500">{t("noSpam")}</p>
      </div>
    </form>
  );
}
