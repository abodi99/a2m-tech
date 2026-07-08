import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/constants";
import { LanguageSwitcher } from "./language-switcher";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#services", key: "services" as const },
  { href: "#how-we-work", key: "howWeWork" as const },
  { href: "#for-who", key: "forWho" as const },
  { href: "#about", key: "about" as const },
];

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="A2M Tech"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-brand">
            A2M Tech
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-brand"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:flex" />
          <a
            href={LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden bg-brand text-white hover:bg-brand-dark sm:inline-flex"
            )}
          >
            {t("bookMeeting")}
          </a>

          <details className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-lg border border-border px-3 py-2 text-sm font-medium text-brand">
              <span className="sr-only">{t("menu")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white p-2 shadow-lg">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  {t(item.key)}
                </a>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                <LanguageSwitcher />
              </div>
              <a
                href={LINKS.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "mt-2 w-full bg-brand text-white hover:bg-brand-dark"
                )}
              >
                {t("bookMeeting")}
              </a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
