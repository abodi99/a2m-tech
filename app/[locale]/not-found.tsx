import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params?: Promise<{ locale?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolved = params ? await params : {};
  const locale = resolved.locale ?? "sv";
  return buildPageMetadata({
    locale,
    metaKey: "notFound",
    pathname: "/",
  });
}

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-brand-900">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-xl text-ink-700">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className={cn(
            buttonVariants()
          )}
        >
          {t("home")}
        </Link>
        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "outline" })
          )}
        >
          {t("contact")}
        </Link>
      </div>
    </div>
  );
}
