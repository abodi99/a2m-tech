import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { company, contacts } from "@/content/site";
import { footerNav, legalNav } from "@/lib/nav";
import { LanguageSwitcher } from "./language-switcher";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-white/10 bg-brand-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold">{company.displayName}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
              {t("tagline")}
            </p>
            <p className="mt-4 text-sm text-white/65">{company.legalName}</p>
            <div className="mt-5">
              <LanguageSwitcher tone="onDark" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/55">
              {t("navigation")}
            </p>
            <ul className="mt-4 space-y-2">
              {footerNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/55">
              {t("contact")}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>
                <a href={contacts.phoneHref} className="hover:text-white">
                  {contacts.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={contacts.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {t("bookMeeting")}
                </a>
              </li>
              <li>
                <a
                  href={contacts.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/55">
              {t("legal")}
            </p>
            <ul className="mt-3 space-y-2">
              {legalNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/55">
          © {new Date().getFullYear()} {company.legalName}. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
