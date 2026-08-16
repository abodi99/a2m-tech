import Image from "next/image";
import { useTranslations } from "next-intl";

type Partner = {
  slug: string;
  name: string;
  descKey: string;
};

const partners: Partner[] = [
  { slug: "nordlank",     name: "Nordlänk",      descKey: "nordlank" },
  { slug: "civora",       name: "Civora",         descKey: "civora" },
  { slug: "styrpunkt",    name: "Styrpunkt",      descKey: "styrpunkt" },
  { slug: "kontinuum",    name: "Kontinuum",      descKey: "kontinuum" },
  { slug: "databro",      name: "Databro",        descKey: "databro" },
  { slug: "tryggnod",     name: "TryggNod",       descKey: "tryggnod" },
  { slug: "forankra",     name: "Förankra",       descKey: "forankra" },
  { slug: "flodesverket", name: "Flödesverket",   descKey: "flodesverket" },
  { slug: "samband",      name: "Samband",        descKey: "samband" },
  { slug: "klarlinje",    name: "Klarlinje",      descKey: "klarlinje" },
  { slug: "veridion",     name: "Veridion",       descKey: "veridion" },
  { slug: "infraholm",    name: "Infraholm",      descKey: "infraholm" },
];

export function PartnerGrid() {
  const t = useTranslations("partners");

  return (
    <section className="bg-[#f5f3ef] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800/60">
            {t("eyebrow")}
          </p>
          <h2 className="mb-5 font-display text-3xl font-bold leading-snug text-brand-900 lg:text-4xl">
            {t("title")}
          </h2>
          <p className="text-base leading-relaxed text-ink-600">
            {t("body")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {partners.map((partner) => (
            <article
              key={partner.slug}
              className="group flex flex-col gap-5 border border-[#e0dbd3] bg-[#f5f3ef] px-7 py-8 transition-colors hover:bg-white hover:shadow-sm"
            >
              {/* Icon mark */}
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#d8d3cb] bg-white p-2">
                  <Image
                    src={`/partners/${partner.slug}.svg`}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="font-display text-sm font-semibold tracking-tight text-brand-900">
                  {partner.name}
                </h3>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e0dbd3]" aria-hidden />

              {/* Descriptor */}
              <p className="text-xs leading-relaxed text-ink-500">
                {t(`desc.${partner.descKey}`)}
              </p>
            </article>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-[11px] text-ink-400">
          * {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
