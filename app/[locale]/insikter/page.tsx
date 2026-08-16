import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import InsightsPage, {
  generateMetadata as baseMeta,
} from "../insights/page";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "sv" }];
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (locale !== "sv") return {};
  return baseMeta(props);
}

export default async function Page(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(["sv"], locale)) notFound();
  return InsightsPage(props);
}
