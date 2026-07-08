import { useTranslations } from "next-intl";
import { Building2, Handshake, Landmark } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const audiences = [
  { key: "public", icon: Landmark },
  { key: "business", icon: Building2 },
  { key: "partners", icon: Handshake },
] as const;

export function ForWho() {
  const t = useTranslations("forWho");

  return (
    <section id="for-who" className="bg-brand py-20 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="[&_h2]:text-white [&_p]:text-white/80"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-6 text-xl font-bold">{t(`${key}.title`)}</h3>
              <p className="mt-3 leading-relaxed text-white/80">
                {t(`${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
