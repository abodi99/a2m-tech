import Image from "next/image";
import { useTranslations } from "next-intl";

type Partner = {
  slug: string;
  name: string;
  descKey: string;
};

const partners: Partner[] = [
  { slug: "nordlank",     name: "Nordlänk",    descKey: "nordlank" },
  { slug: "civora",       name: "Civora",       descKey: "civora" },
  { slug: "styrpunkt",    name: "Styrpunkt",    descKey: "styrpunkt" },
  { slug: "kontinuum",    name: "Kontinuum",    descKey: "kontinuum" },
  { slug: "databro",      name: "Databro",      descKey: "databro" },
  { slug: "tryggnod",     name: "TryggNod",     descKey: "tryggnod" },
  { slug: "forankra",     name: "Förankra",     descKey: "forankra" },
  { slug: "flodesverket", name: "Flödesverket", descKey: "flodesverket" },
  { slug: "samband",      name: "Samband",      descKey: "samband" },
  { slug: "klarlinje",    name: "Klarlinje",    descKey: "klarlinje" },
  { slug: "veridion",     name: "Veridion",     descKey: "veridion" },
  { slug: "infraholm",    name: "Infraholm",    descKey: "infraholm" },
];

export function PartnerTicker() {
  const t = useTranslations("partners");

  return (
    <section className="border-y border-line bg-[#f5f3ef] py-10" aria-label={t("title")}>
      <div className="mx-auto mb-7 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800/55">
          {t("eyebrow")}
        </p>
      </div>

      {/* Marquee container – overflow hidden with soft fade on edges */}
      <div className="relative overflow-hidden" aria-hidden>
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#f5f3ef] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#f5f3ef] to-transparent" />

        {/* Ticker track – duplicated for seamless loop */}
        <div className="partner-ticker-track flex w-max items-center gap-0">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={i}
              className="group flex shrink-0 items-center gap-3.5 border-r border-line/60 px-10 py-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#dcd8d0] bg-white">
                <Image
                  src={`/partners/${partner.slug}.svg`}
                  alt=""
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px] object-contain"
                  unoptimized
                />
              </div>
              <span className="whitespace-nowrap text-sm font-semibold text-brand-900/75 group-hover:text-brand-900">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
