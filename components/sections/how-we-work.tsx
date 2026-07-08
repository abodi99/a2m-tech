import { useTranslations } from "next-intl";
import { FileCheck, Layers, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const pillars = [
  { key: "solutions", icon: Layers, step: "01" },
  { key: "procurement", icon: FileCheck, step: "02" },
  { key: "consultants", icon: ShieldCheck, step: "03" },
] as const;

export function HowWeWork() {
  const t = useTranslations("howWeWork");

  return (
    <section id="how-we-work" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-8 lg:grid-cols-3">
          {pillars.map(({ key, icon: Icon, step }) => (
            <article
              key={key}
              className="relative rounded-2xl border border-border bg-white p-8 shadow-sm"
            >
              <span className="text-5xl font-bold text-brand/10">{step}</span>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-6 text-xl font-bold text-brand">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
