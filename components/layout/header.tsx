"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { primaryNav } from "@/lib/nav";
import { LanguageSwitcher } from "./language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color]",
        scrolled
          ? "border-line bg-surface shadow-sm"
          : "border-transparent bg-paper/95 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group shrink-0 rounded-sm focus-visible:outline-offset-4"
          aria-label="A2M Tech – Hem"
        >
          <Image
            src="/logo-cropped.png"
            alt="A2M Tech"
            width={494}
            height={179}
            className="h-10 w-auto object-contain transition-opacity group-hover:opacity-85"
            priority
            unoptimized
          />
        </Link>

        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label={t("mainNav")}
        >
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-sm px-2.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-accent hover:text-brand-900"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <TrackedLink
            href="/contact"
            event="cta_click"
            eventData={{ placement: "header" }}
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            {t("contact")}
          </TrackedLink>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-line text-brand-900 xl:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? t("closeMenu") : t("menu")}</span>
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={menuId}
          className="border-t border-line bg-surface xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label={t("mainNav")}>
            {primaryNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-sm px-3 py-3 text-base font-medium text-ink-950 hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
            <TrackedLink
              href="/contact"
              event="cta_click"
              eventData={{ placement: "header_mobile" }}
              className="rounded-sm px-3 py-3 text-base font-medium text-ink-950 hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              {t("contact")}
            </TrackedLink>
            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-3">
              <LanguageSwitcher />
              <TrackedLink
                href="/contact"
                event="cta_click"
                eventData={{ placement: "header_mobile_button" }}
                className={cn(buttonVariants(), "w-full")}
                onClick={() => setOpen(false)}
              >
                {t("contact")}
              </TrackedLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
