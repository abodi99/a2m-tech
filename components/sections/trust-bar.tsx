import { useTranslations } from "next-intl";
import { FileText, Landmark, ShieldCheck, Users } from "lucide-react";

const items = [
  { key: "security", icon: ShieldCheck },
  { key: "documentation", icon: FileText },
  { key: "procurement", icon: Landmark },
  { key: "delivery", icon: Users },
] as const;

export function TrustBar() {
  const t = useTranslations("trustBar");

  return (
    <section className="border-b border-border bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ key, icon: Icon }) => (
            <div key={key} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold text-brand">{t(`${key}.title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
