import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import InsightArticlePage, {
  generateMetadata as baseMeta,
  generateStaticParams as baseParams,
} from "../../insights/[slug]/page";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return baseParams().then((params) =>
    params.filter((p) => p.locale === "sv")
  );
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (locale !== "sv") return {};
  return baseMeta(props);
}

export default async function Page(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(["sv"], locale)) notFound();
  return InsightArticlePage(props);
}
