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
  { locale: "sv" as const, label: "Svenska", short: "SV" },
  { locale: "en" as const, label: "English", short: "EN" },
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
          "inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold tracking-wide transition-colors",
          tone === "onDark"
            ? "text-white/70 hover:bg-white/10 hover:text-white"
            : "text-ink-500 hover:bg-accent hover:text-brand-900"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Switch language"
        onClick={() => setOpen((value) => !value)}
      >
        {/* Globe icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className={tone === "onDark" ? "text-white/50" : "text-ink-400"}
        >
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 1.5C6.5 3.5 5.5 5.6 5.5 8s1 4.5 2.5 6.5M8 1.5C9.5 3.5 10.5 5.6 10.5 8s-1 4.5-2.5 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span lang={locale}>{current.short}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={cn(
            "transition-transform",
            open && "rotate-180",
            tone === "onDark" ? "text-white/40" : "text-ink-400"
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
                    "flex w-full min-h-10 items-center gap-3 px-3 text-left text-sm font-medium transition-colors",
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
                  <span className="w-5 text-xs font-bold tracking-wide opacity-60">
                    {option.short}
                  </span>
                  {option.label}
                  {selected && (
                    <svg className="ml-auto h-3.5 w-3.5 shrink-0 text-signal" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                      <path d="M11.28 3.28a.75.75 0 0 0-1.06 0L5.5 8l-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06z" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
