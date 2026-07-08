"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (nextLocale: "sv" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-muted/50 p-1",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {(["sv", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLocale(lang)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
            locale === lang
              ? "bg-brand text-white"
              : "text-muted-foreground hover:text-brand"
          )}
          aria-pressed={locale === lang}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
