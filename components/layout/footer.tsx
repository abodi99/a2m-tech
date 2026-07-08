import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

const footerNav = [
  { href: "#services", key: "services" as const },
  { href: "#how-we-work", key: "howWeWork" as const },
  { href: "#about", key: "about" as const },
];

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-white/10 bg-brand-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-lg font-bold">A2M Tech</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {t("tagline")}
            </p>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Navigation
            </p>
            <ul className="mt-4 space-y-2">
              {footerNav.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {nav(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/60">
          © {new Date().getFullYear()} {t("company")}. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
