import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import ServicesPage, { generateMetadata as baseMeta } from "../services/page";

type Props = { params: Promise<{ locale: string }> };

/** Swedish public slug — mirrors `/services` for static export without middleware. */
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
  return ServicesPage(props);
}
