import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";

export function About() {
  const t = useTranslations("about");

  const stats = [
    { label: t("stats.experience"), value: t("stats.experienceValue") },
    { label: t("stats.focus"), value: t("stats.focusValue") },
    { label: t("stats.delivery"), value: t("stats.deliveryValue") },
  ];

  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              title={t("title")}
              align="left"
              className="mb-6"
            />
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
              <p>{t("paragraph3")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-secondary p-6 text-center lg:text-left"
              >
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-brand">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
