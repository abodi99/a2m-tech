"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  /** Use on dark backgrounds (footer). */
  tone?: "default" | "onDark";
};

const options = [
  { locale: "sv" as const, label: "Svenska" },
  { locale: "en" as const, label: "English" },
];

export function LanguageSwitcher({
  className,
  tone = "default",
}: LanguageSwitcherProps) {
  const locale = useLocale() as "sv" | "en";
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const current = options.find((o) => o.locale === locale) ?? options[0];

  const switchLocale = (target: "sv" | "en") => {
    setOpen(false);
    if (target === locale) return;
    router.replace(pathname, { locale: target });
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-block text-sm", className)}>
      <button
        type="button"
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-sm border px-3 font-medium transition-colors",
          tone === "onDark"
            ? "border-white/25 text-white hover:border-white/45 hover:bg-white/5"
            : "border-line text-brand-900 hover:border-brand-800/40 hover:bg-surface"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Language"
        onClick={() => setOpen((value) => !value)}
      >
        <span lang={locale}>{current.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={cn(
            "transition-transform",
            open && "rotate-180",
            tone === "onDark" ? "text-white/70" : "text-ink-500"
          )}
        >
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Language"
          className={cn(
            "absolute right-0 z-50 mt-1 min-w-full overflow-hidden rounded-sm border py-1 shadow-sm",
            tone === "onDark"
              ? "border-white/20 bg-brand-900"
              : "border-line bg-surface"
          )}
        >
          {options.map((option) => {
            const selected = option.locale === locale;
            return (
              <li key={option.locale} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  lang={option.locale}
                  className={cn(
                    "flex w-full min-h-11 items-center px-3 text-left font-medium transition-colors",
                    tone === "onDark"
                      ? selected
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                      : selected
                        ? "bg-accent text-brand-900"
                        : "text-ink-700 hover:bg-accent hover:text-brand-900"
                  )}
                  onClick={() => switchLocale(option.locale)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
