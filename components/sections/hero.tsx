import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("hero");

  const trustItems = [t("trust1"), t("trust2"), t("trust3")];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-[#005f85] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(23,107,224,0.3) 0%, transparent 40%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <Badge className="mb-6 border-white/20 bg-white/10 text-white hover:bg-white/10">
            {t("badge")}
          </Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85 sm:text-xl">
            {t("subtitle")}
          </p>

          <div className="mt-10">
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-brand hover:bg-white/90"
              )}
            >
              {t("ctaPrimary")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <ul className="mt-12 flex flex-col gap-3">
            {trustItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-white/90 sm:text-base"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden lg:block">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
            <Image
              src="/brand/hero-visual.svg"
              alt=""
              width={480}
              height={400}
              priority
              className="h-auto w-full"
            />
          </div>
          <div
            className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-brand-accent/20 blur-2xl"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
