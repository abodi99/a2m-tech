import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

type Crumb = {
  href?: AppPathname;
  labelKey?: string;
  label?: string;
};

type BreadcrumbsProps = {
  locale: string;
  items: Crumb[];
};

export async function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = await getTranslations("breadcrumbs");

  return (
    <nav aria-label={t("aria")} className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
        <li>
          <Link href="/" className="hover:text-brand-800">
            {t("home")}
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const label = item.label ?? (item.labelKey ? t(item.labelKey) : "");
          return (
            <li key={`${label}-${index}`} className="flex items-center gap-2">
              <span aria-hidden className="text-line">
                /
              </span>
              {isLast || !item.href ? (
                <span aria-current="page" className="text-ink-700">
                  {label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-brand-800">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
