import { useTranslations } from "next-intl";
import { Calendar, Link2, Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const contactItems = [
  {
    key: "phone",
    icon: Phone,
    href: LINKS.phone,
    value: LINKS.phoneDisplay,
  },
  {
    key: "email",
    icon: Mail,
    href: LINKS.email,
    value: LINKS.emailDisplay,
  },
  {
    key: "linkedin",
    icon: Link2,
    href: LINKS.linkedin,
    value: "linkedin.com/company/a2m-tech",
    external: true,
  },
  {
    key: "address",
    icon: MapPin,
    value: LINKS.address,
  },
] as const;

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <ul className="space-y-6">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-brand">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t(item.key)}
                      </p>
                      <p className="mt-1 font-medium text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <li key={item.key}>
                    {"href" in item && item.href ? (
                      <a
                        href={item.href}
                        target={"external" in item ? "_blank" : undefined}
                        rel={
                          "external" in item ? "noopener noreferrer" : undefined
                        }
                        className="block rounded-lg transition-colors hover:bg-secondary/50"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
              <li className="border-t border-border pt-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("orgNumber")}
                </p>
                <p className="mt-1 font-medium">{LINKS.orgNumber}</p>
              </li>
            </ul>

            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 w-full bg-brand text-white hover:bg-brand-dark"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t("bookMeeting")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
