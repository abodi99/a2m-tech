import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { company, contacts } from "@/content/site";
import { footerNav, legalNav } from "@/lib/nav";
import { LanguageSwitcher } from "./language-switcher";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-brand-900 text-white">

      {/* ── Top band: logo + tagline ── */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* Outline logo – inverted to white */}
            <div className="shrink-0">
              <Image
                src="/logo-outline.png"
                alt="A2M Tech"
                width={220}
                height={64}
                className="h-14 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            </div>

            {/* Tagline + CTA */}
            <div className="max-w-xl">
              <p className="font-display text-xl font-semibold leading-snug text-white lg:text-2xl">
                {t("tagline")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {t("taglineBody")}
              </p>
            </div>

            {/* CTA button */}
            <div className="shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {t("bookMeeting")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main nav grid ── */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1: About */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
              A2M Tech AB
            </p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-signal/70" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M1.5 2A1.5 1.5 0 0 0 0 3.5v1c0 5.523 4.477 10 10 10h1a1.5 1.5 0 0 0 1.5-1.5v-1.09a1.5 1.5 0 0 0-1.077-1.443l-2.2-.628a1.5 1.5 0 0 0-1.585.526l-.388.51a.75.75 0 0 1-.92.22 8.5 8.5 0 0 1-3.977-3.978.75.75 0 0 1 .22-.919l.51-.388a1.5 1.5 0 0 0 .526-1.585L3.59 3.077A1.5 1.5 0 0 0 2.5 2H1.5Z" clipRule="evenodd" />
                </svg>
                <a href={contacts.phoneHref} className="hover:text-white transition-colors">
                  {contacts.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-signal/70" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("bookMeeting")}
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-signal/70" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                </svg>
                <a
                  href={contacts.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <LanguageSwitcher tone="onDark" />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
              {t("navigation")}
            </p>
            <ul className="mt-5 space-y-3">
              {footerNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
              {t("legal")}
            </p>
            <ul className="mt-5 space-y-3">
              {legalNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust note */}
            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs leading-relaxed text-white/55">
                {t("trustNote")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} {company.legalName}. {t("rights")}</span>
          <span className="text-white/25">Sverige · Distans & på plats</span>
        </div>
      </div>
    </footer>
  );
}
