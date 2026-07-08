import { useTranslations } from "next-intl";
import {
  BarChart3,
  Cloud,
  MonitorSmartphone,
  Shield,
  Users,
  Workflow,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const services = [
  { key: "mobile", icon: MonitorSmartphone },
  { key: "data", icon: BarChart3 },
  { key: "consulting", icon: Users },
  { key: "security", icon: Shield },
  { key: "devops", icon: Workflow },
  { key: "workspace", icon: Cloud },
] as const;

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ key, icon: Icon }) => (
            <Card
              key={key}
              className="border-border/80 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <CardTitle className="text-lg text-brand">
                  {t(`${key}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t(`${key}.description`)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
