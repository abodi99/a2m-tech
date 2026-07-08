import { useTranslations } from "next-intl";
import { Code2, Globe, Link2, Mail } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TEAM } from "@/lib/constants";

export function Team() {
  const t = useTranslations("team");

  return (
    <section id="team" className="bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-6 md:grid-cols-2">
          {TEAM.map((member) => (
            <Card key={member.name} className="border-border/80 bg-white">
              <CardHeader>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-brand">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-brand-accent">
                    {t(member.roleKey)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {t(member.bioKey)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {t(`tags.${tag}`)}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Link2 className="h-4 w-4" />
                  </a>
                  {"github" in member && member.github ? (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                      aria-label={`${member.name} GitHub`}
                    >
                      <Code2 className="h-4 w-4" />
                    </a>
                  ) : null}
                  {"website" in member && member.website ? (
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                      aria-label={`${member.name} website`}
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  ) : null}
                  <a
                    href={member.email}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                    aria-label={`${member.name} email`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
