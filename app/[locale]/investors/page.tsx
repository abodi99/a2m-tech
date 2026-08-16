import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { contacts } from "@/content/site";
import {
  investorContent,
  isPublishable,
  type InvestorMilestone,
  type BusinessMixItem,
  type InvestorDocument,
  type CapitalField,
  type CapitalAllocationItem,
  type OwnershipItem,
  type InvestorFinancial,
  type FinancialDataPoint,
} from "@/content/investor";
import { absoluteLocalizedUrl } from "@/lib/locale-url";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({ locale, metaKey: "investors", pathname: "/investors" });
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function SectionNumber({ n }: { n: string }) {
  return (
    <span className="font-mono text-sm font-medium tabular-nums text-[#334B58]/40" aria-hidden>
      {n}
    </span>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
      {children}
    </p>
  );
}

// ─── Financial metrics ────────────────────────────────────────────────────────

function FinancialMetrics({
  metrics,
}: {
  metrics: InvestorFinancial[];
}) {
  const publishable = metrics.filter((m) => m.status === "verified" && isPublishable(m.value));
  if (publishable.length === 0) return null;

  return (
    <dl className="grid gap-px border border-[#D7E1E5] bg-[#D7E1E5] sm:grid-cols-2 lg:grid-cols-4">
      {publishable.map((m) => (
        <div key={m.key} className="bg-white px-7 py-8">
          <dt className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#334B58]/60">
            {m.labelSv}
          </dt>
          <dd className="font-display text-3xl font-bold tabular-nums text-[#003347] lg:text-4xl">
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FinancialMetricsEn({ metrics }: { metrics: InvestorFinancial[] }) {
  const publishable = metrics.filter((m) => m.status === "verified" && isPublishable(m.value));
  if (publishable.length === 0) return null;

  return (
    <dl className="grid gap-px border border-[#D7E1E5] bg-[#D7E1E5] sm:grid-cols-2 lg:grid-cols-4">
      {publishable.map((m) => (
        <div key={m.key} className="bg-white px-7 py-8">
          <dt className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#334B58]/60">
            {m.labelEn}
          </dt>
          <dd className="font-display text-3xl font-bold tabular-nums text-[#003347] lg:text-4xl">
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ─── SVG Revenue chart ────────────────────────────────────────────────────────

function RevenueChart({
  data,
  locale,
}: {
  data: FinancialDataPoint[];
  locale: string;
}) {
  const publishable = data.filter((d) => d.status === "verified");
  if (publishable.length === 0) return null;

  const maxVal = Math.max(...publishable.map((d) => d.value), 1);
  const W = 600;
  const H = 180;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const barW = Math.max(20, (innerW / publishable.length) * 0.55);
  const gap = innerW / publishable.length;

  return (
    <figure className="mt-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="chart-title chart-desc"
        className="w-full max-w-[600px]"
      >
        <title id="chart-title">
          {locale === "sv" ? "Finansiell utveckling" : "Financial development"}
        </title>
        <desc id="chart-desc">
          {publishable
            .map((d) => `${d.year}: ${d.displayValue}`)
            .join(", ")}
        </desc>
        {/* Baseline */}
        <line
          x1={padL}
          y1={H - padB}
          x2={W - padR}
          y2={H - padB}
          stroke="#D7E1E5"
          strokeWidth="1"
        />
        {publishable.map((d, i) => {
          const barH = (d.value / maxVal) * innerH;
          const x = padL + i * gap + (gap - barW) / 2;
          const y = padT + innerH - barH;
          const isForecast = d.type === "forecast";
          return (
            <g key={d.year}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={isForecast ? "none" : "#004869"}
                stroke={isForecast ? "#004869" : "none"}
                strokeWidth={isForecast ? "1.5" : 0}
                strokeDasharray={isForecast ? "4 3" : undefined}
              />
              {/* Year label */}
              <text
                x={x + barW / 2}
                y={H - padB + 16}
                textAnchor="middle"
                fontSize="11"
                fill="#334B58"
                fontFamily="inherit"
              >
                {d.year}
              </text>
              {/* Value label */}
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="11"
                fill={isForecast ? "#334B58" : "#003347"}
                fontFamily="inherit"
                fontWeight={isForecast ? "normal" : "600"}
              >
                {d.displayValue}
              </text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <figcaption className="mt-3 flex flex-wrap items-center gap-6 text-xs text-[#334B58]">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-5 bg-[#004869]" />
          {locale === "sv" ? "Utfall" : "Actual"}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-5 border border-dashed border-[#004869]" />
          {locale === "sv" ? "Prognos" : "Forecast"}
        </span>
      </figcaption>
    </figure>
  );
}

// ─── Business mix ─────────────────────────────────────────────────────────────

function BusinessMix({ items, locale }: { items: BusinessMixItem[]; locale: string }) {
  const hasAnyPercentage = items.some(
    (i) => i.status === "verified" && isPublishable(i.percentage)
  );

  return (
    <ul className="space-y-4" role="list">
      {items.map((item) => {
        const label = locale === "sv" ? item.labelSv : item.labelEn;
        const pct = item.status === "verified" ? item.percentage : undefined;
        return (
          <li key={item.labelSv} className="group">
            <div className="mb-1.5 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-[#003347]">{label}</span>
              {isPublishable(pct) && (
                <span className="font-mono text-sm font-semibold tabular-nums text-[#003347]">
                  {pct}%
                </span>
              )}
            </div>
            {hasAnyPercentage && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D7E1E5]">
                {isPublishable(pct) && (
                  <div
                    className="h-full rounded-full bg-[#004869]"
                    style={{ width: `${pct}%` }}
                    aria-hidden
                  />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ─── Capital fields ───────────────────────────────────────────────────────────

function CapitalFields({
  fields,
  locale,
}: {
  fields: CapitalField[];
  locale: string;
}) {
  const publishable = fields.filter(
    (f) => f.status === "verified" && isPublishable(f.value)
  );
  if (publishable.length === 0) return null;

  return (
    <dl className="divide-y divide-[#D7E1E5] border-y border-[#D7E1E5]">
      {publishable.map((f) => (
        <div key={f.labelSv} className="flex items-start justify-between gap-8 py-4">
          <dt className="text-sm text-[#334B58]">
            {locale === "sv" ? f.labelSv : f.labelEn}
          </dt>
          <dd className="text-sm font-semibold text-[#003347]">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ─── Capital allocation ───────────────────────────────────────────────────────

function CapitalAllocation({
  items,
  locale,
}: {
  items: CapitalAllocationItem[];
  locale: string;
}) {
  const hasAny = items.some(
    (i) => i.status === "verified" && isPublishable(i.percentage)
  );
  if (!hasAny) {
    // Show labels without percentages
    return (
      <ul className="space-y-3" role="list">
        {items.map((item) => (
          <li key={item.labelSv} className="flex items-center gap-3">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#004869]" aria-hidden />
            <span className="text-sm text-[#334B58]">
              {locale === "sv" ? item.labelSv : item.labelEn}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-4" role="list">
      {items.map((item) => {
        const pct = item.status === "verified" ? item.percentage : undefined;
        const label = locale === "sv" ? item.labelSv : item.labelEn;
        return (
          <li key={item.labelSv}>
            <div className="mb-1.5 flex items-center justify-between gap-4">
              <span className="text-sm text-[#334B58]">{label}</span>
              {isPublishable(pct) && (
                <span className="font-mono text-sm tabular-nums text-[#003347]">{pct}%</span>
              )}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D7E1E5]">
              {isPublishable(pct) && (
                <div
                  className="h-full rounded-full bg-[#004869]"
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({
  milestones,
  locale,
}: {
  milestones: InvestorMilestone[];
  locale: string;
}) {
  const publishable = milestones.filter((m) => m.status === "verified");
  if (publishable.length === 0) return null;

  return (
    <div className="relative">
      {/* Connecting line */}
      <div
        className="absolute left-[27px] top-8 h-[calc(100%-56px)] w-px bg-[#D7E1E5] lg:left-1/2 lg:top-6 lg:h-px lg:w-[calc(100%-80px)] lg:-translate-x-1/2"
        aria-hidden
      />

      <ol className="relative space-y-10 lg:flex lg:items-start lg:justify-between lg:space-y-0 lg:gap-8">
        {publishable.map((m, i) => (
          <li key={m.year} className="relative flex items-start gap-6 lg:flex-col lg:items-center lg:text-center lg:flex-1">
            {/* Year node */}
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#004869] bg-white font-mono text-sm font-bold text-[#003347]">
              {m.year}
            </div>
            <div className="lg:mt-3">
              <p className="mb-1 font-display text-base font-semibold text-[#003347]">
                {locale === "sv" ? m.titleSv : m.titleEn}
              </p>
              <p className="text-sm leading-relaxed text-[#334B58]">
                {locale === "sv" ? m.descriptionSv : m.descriptionEn}
              </p>
            </div>
            {i < publishable.length - 1 && (
              <div className="absolute left-7 top-14 h-10 w-px bg-[#D7E1E5] lg:hidden" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Ownership ────────────────────────────────────────────────────────────────

function OwnershipTable({
  items,
  locale,
}: {
  items: OwnershipItem[];
  locale: string;
}) {
  const publishable = items.filter(
    (i) => i.status === "verified" && i.label
  );
  if (publishable.length === 0) return null;

  const ownersLabel = locale === "sv" ? "Ägare" : "Owner";
  const shareLabel = locale === "sv" ? "Andel" : "Share";

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-[#D7E1E5]">
          <th scope="col" className="py-3 text-left font-semibold text-[#334B58]/60 text-xs uppercase tracking-wider">
            {ownersLabel}
          </th>
          <th scope="col" className="py-3 text-right font-semibold text-[#334B58]/60 text-xs uppercase tracking-wider">
            {shareLabel}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#D7E1E5]">
        {publishable.map((item) => (
          <tr key={item.label}>
            <td className="py-3 text-[#0B1820]">{item.label}</td>
            <td className="py-3 text-right font-mono tabular-nums text-[#003347]">
              {isPublishable(item.percentage) ? `${item.percentage}%` : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Documents ───────────────────────────────────────────────────────────────

function DocumentList({
  docs,
  locale,
}: {
  docs: InvestorDocument[];
  locale: string;
}) {
  const publishable = docs.filter((d) => d.status === "verified");
  if (publishable.length === 0) return null;

  const updatedLabel = locale === "sv" ? "Uppdaterad" : "Updated";

  return (
    <ul className="divide-y divide-[#D7E1E5]" role="list">
      {publishable.map((doc) => {
        const title = locale === "sv" ? doc.titleSv : doc.titleEn;
        return (
          <li key={doc.href} className="group py-5">
            <a
              href={doc.href}
              target={doc.external !== false ? "_blank" : undefined}
              rel={doc.external !== false ? "noopener noreferrer" : undefined}
              className="flex items-start justify-between gap-6 focus:outline-none focus-visible:underline"
              aria-label={`${title} (${doc.type})`}
            >
              <div>
                <p className="mb-1 font-display text-base font-semibold text-[#003347] transition-colors group-hover:text-[#176BE0]">
                  {title}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#334B58]">
                  <span className="rounded-sm border border-[#D7E1E5] px-1.5 py-0.5 font-mono uppercase">
                    {doc.type}
                  </span>
                  {doc.fileSizeKb && (
                    <span>{doc.fileSizeKb}&nbsp;KB</span>
                  )}
                  {doc.updatedAt && (
                    <span>
                      {updatedLabel}{" "}
                      {new Date(doc.updatedAt).toLocaleDateString(
                        locale === "sv" ? "sv-SE" : "en-GB",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </span>
                  )}
                </div>
              </div>
              <span
                className="mt-1 shrink-0 text-[#176BE0] transition-transform duration-150 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function InvestorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isSv = locale === "sv";

  const crumbLabel = isSv ? "Investerare" : "Investors";
  const canonicalUrl = absoluteLocalizedUrl(locale, "/investors");

  const jsonLd = breadcrumbJsonLd(locale, [
    { name: crumbLabel, pathname: "/investors" },
  ]);

  // ── Content strings ──────────────────────────────────────────────────────
  const eyebrow = isSv ? "INVESTERARE" : "INVESTORS";
  const heroH1 = isSv
    ? "En plattform för långsiktigt värdeskapande"
    : "A platform for long-term value creation";
  const heroIntro = isSv
    ? "A2M Tech utvecklar sin position som leveranspartner för organisationer med höga krav på ansvar, struktur och långsiktig förmåga. Här samlar vi information om bolagets inriktning, utvecklingsprioriteringar och finansiella perspektiv."
    : "A2M Tech is developing its position as a delivery partner for organizations with high expectations on accountability, structure and long-term capability. This section brings together information about the company's direction, development priorities and financial perspective.";

  // Continuity chain
  const chain = isSv
    ? ["Position", "Kapacitet", "Leverans", "Tillväxt", "Långsiktigt värde"]
    : ["Position", "Capacity", "Delivery", "Growth", "Long-term value"];

  // Investment case pillars
  const pillars = isSv
    ? [
        {
          title: "Tydlig position",
          body: "Fokus på digitala leveranser för organisationer där ansvar, kontinuitet, kvalitet och struktur är centrala delar av leveransen.",
        },
        {
          title: "Långsiktiga relationer",
          body: "Bolagets inriktning är att kombinera definierade uppdrag, teamleveranser, specialistkompetens och långsiktig förvaltning.",
        },
        {
          title: "Skalbar leveransförmåga",
          body: "Kapacitet kan byggas genom en kombination av intern kompetens, specialistförstärkning och strukturerad samverkan med andra leverantörer.",
        },
        {
          title: "Disciplinerad utveckling",
          body: "Tillväxt ska stödjas av tydlig leveransstyrning, kvalitet, kompetens, försäljning och en stabil operativ grund.",
        },
      ]
    : [
        {
          title: "Clear position",
          body: "Focus on digital deliveries for organizations where accountability, continuity, quality and structure are central elements of the delivery.",
        },
        {
          title: "Long-term relationships",
          body: "The company's direction is to combine defined assignments, team deliveries, specialist competence and long-term maintenance.",
        },
        {
          title: "Scalable delivery capability",
          body: "Capacity can be built through a combination of internal competence, specialist reinforcement and structured collaboration with other suppliers.",
        },
        {
          title: "Disciplined development",
          body: "Growth should be supported by clear delivery governance, quality, competence, sales and a stable operational foundation.",
        },
      ];

  // Market drivers
  const marketIntro = isSv
    ? "Behovet av digital utveckling, modernisering, förvaltning och specialistkompetens skapar en långsiktig efterfrågan på leverantörer som kan kombinera teknisk kompetens med ansvar, struktur och kontinuitet."
    : "The need for digital development, modernisation, maintenance and specialist competence creates a long-term demand for suppliers that can combine technical competence with accountability, structure and continuity.";

  const drivers = isSv
    ? [
        {
          title: "Digital förvaltning",
          body: "Digitala tjänster behöver underhållas, vidareutvecklas och anpassas i takt med att verksamhetens behov förändras.",
        },
        {
          title: "Modernisering",
          body: "Befintliga system, integrationer och arbetssätt skapar återkommande behov av kontrollerad modernisering.",
        },
        {
          title: "Leveransförmåga",
          body: "Beställare behöver leverantörer som kan kombinera specialistkompetens med styrning, dokumentation och långsiktigt ansvar.",
        },
      ]
    : [
        {
          title: "Digital maintenance",
          body: "Digital services need to be maintained, developed further and adapted as the organisation's needs change.",
        },
        {
          title: "Modernisation",
          body: "Existing systems, integrations and working practices create recurring needs for controlled modernisation.",
        },
        {
          title: "Delivery capability",
          body: "Clients need suppliers that can combine specialist competence with governance, documentation and long-term accountability.",
        },
      ];

  // Strategic priorities
  const priorities = isSv
    ? [
        {
          title: "Stärka leveranskapaciteten",
          body: "Bygga intern kompetens och strukturer som möjliggör fler och mer komplexa uppdrag med bibehållen leveranskvalitet.",
        },
        {
          title: "Utveckla långsiktiga kundrelationer",
          body: "Arbeta aktivt med att fördjupa relationer med befintliga och kommande kunder mot återkommande och förlängningsbara uppdrag.",
        },
        {
          title: "Öka strukturen kring kvalitet och styrning",
          body: "Fortsätta förstärka interna kvalitetssystem, dokumentationsrutiner och uppföljningsmodeller för att hålla hög leveranskvalitet konsekvent.",
        },
        {
          title: "Utveckla partnerskap och specialistnätverk",
          body: "Etablera och fördjupa samarbeten med kompletterande leverantörer och specialister för att bredda kapaciteten utan att öka den fasta kostnadsbasen.",
        },
        {
          title: "Bygga en stabil grund för fortsatt expansion",
          body: "Skapa förutsättningar för hållbar tillväxt genom att säkerställa struktur, kompetens, försäljning och operativ förmåga i linje med bolagets ambitioner.",
        },
      ]
    : [
        {
          title: "Strengthen delivery capacity",
          body: "Build internal competence and structures that enable more and more complex assignments while maintaining delivery quality.",
        },
        {
          title: "Develop long-term client relationships",
          body: "Actively work to deepen relationships with existing and future clients towards recurring and extendable assignments.",
        },
        {
          title: "Increase structure around quality and governance",
          body: "Continue to strengthen internal quality systems, documentation routines and follow-up models to maintain consistently high delivery quality.",
        },
        {
          title: "Develop partnerships and specialist networks",
          body: "Establish and deepen collaborations with complementary suppliers and specialists to broaden capacity without increasing the fixed cost base.",
        },
        {
          title: "Build a stable foundation for continued expansion",
          body: "Create the conditions for sustainable growth by ensuring structure, competence, sales and operational capability aligned with the company's ambitions.",
        },
      ];

  // Closing CTA
  const ctaH2 = isSv
    ? "Dialog om A2M Techs långsiktiga utveckling"
    : "A conversation about A2M Tech's long-term development";
  const ctaBody = isSv
    ? "För frågor om bolagets utveckling, strategi eller framtida finansiering är ni välkomna att kontakta A2M Tech."
    : "For questions about the company's development, strategy or future financing, you are welcome to contact A2M Tech.";
  const ctaPrimary = isSv ? "Kontakta A2M Tech" : "Contact A2M Tech";
  const ctaSecondary = isSv ? "Skicka e-post" : "Send an email";

  // Section headings
  const h = (sv: string, en: string) => (isSv ? sv : en);

  const publishableFinancials = investorContent.financials.filter(
    (m) => m.status === "verified" && isPublishable(m.value)
  );
  const publishableMix = investorContent.businessMix;
  const publishableCapFields = investorContent.capitalFields.filter(
    (f) => f.status === "verified" && isPublishable(f.value)
  );
  const publishableOwnership = investorContent.ownership.filter(
    (o) => o.status === "verified"
  );
  const publishableDocs = investorContent.documents.filter(
    (d) => d.status === "verified"
  );

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <JsonLd data={jsonLd} />

      {/* ── Breadcrumb bar ── */}
      <div className="border-b border-[#D7E1E5] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs locale={locale} items={[{ labelKey: "investors" }]} />
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="border-b border-[#D7E1E5] bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#176BE0]">
            {eyebrow}
          </p>
          <h1 className="mb-5 max-w-3xl font-display text-4xl font-bold leading-tight text-[#003347] lg:text-5xl">
            {heroH1}
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[#334B58]">
            {heroIntro}
          </p>

          {/* Continuity chain */}
          <div
            className="flex flex-wrap items-center gap-0"
            role="presentation"
            aria-label={chain.join(" → ")}
          >
            {chain.map((step, i) => (
              <div key={step} className="flex items-center">
                <span className="rounded-sm border border-[#D7E1E5] bg-[#F7F9F8] px-3 py-1.5 text-xs font-semibold text-[#003347]">
                  {step}
                </span>
                {i < chain.length - 1 && (
                  <span className="px-1.5 text-[#D7E1E5] text-sm" aria-hidden>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 01 Investment case ── */}
      <section className="border-b border-[#D7E1E5] bg-white py-20" aria-labelledby="invest-case-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-start gap-6">
            <SectionNumber n="01" />
            <div>
              <SectionEyebrow>
                {h("INVESTERINGSCASE", "INVESTMENT CASE")}
              </SectionEyebrow>
              <h2 id="invest-case-heading" className="font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                {h("Investeringscase", "Investment case")}
              </h2>
            </div>
          </div>

          <div className="grid gap-px border border-[#D7E1E5] bg-[#D7E1E5] sm:grid-cols-2">
            {pillars.map((p, i) => (
              <div key={p.title} className="bg-white px-8 py-8">
                <p className="mb-3 font-mono text-xs text-[#334B58]/40" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mb-3 font-display text-lg font-bold text-[#003347]">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#334B58]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 Financial overview (only if verified data exists) ── */}
      {publishableFinancials.length > 0 && (
        <section className="border-b border-[#D7E1E5] bg-[#F7F9F8] py-20" aria-labelledby="financials-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-start gap-6">
              <SectionNumber n="02" />
              <div>
                <SectionEyebrow>
                  {h("FINANSIELL ÖVERSIKT", "FINANCIAL OVERVIEW")}
                </SectionEyebrow>
                <h2 id="financials-heading" className="font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                  {h("Finansiell översikt", "Financial overview")}
                </h2>
              </div>
            </div>
            {isSv ? (
              <FinancialMetrics metrics={investorContent.financials} />
            ) : (
              <FinancialMetricsEn metrics={investorContent.financials} />
            )}
            <RevenueChart
              data={investorContent.financialDevelopment}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* ── 03 Business mix ── */}
      <section className="border-b border-[#D7E1E5] bg-white py-20" aria-labelledby="bizMix-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-12 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="mb-10 flex items-start gap-6">
                <SectionNumber n={publishableFinancials.length > 0 ? "03" : "02"} />
                <div>
                  <SectionEyebrow>
                    {h("AFFÄRSMIX", "BUSINESS MIX")}
                  </SectionEyebrow>
                  <h2 id="bizMix-heading" className="font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                    {h("Affärsmix", "Business mix")}
                  </h2>
                </div>
              </div>
              <p className="max-w-lg text-base leading-relaxed text-[#334B58]">
                {h(
                  "A2M Tech arbetar med en kombination av leveransmodeller anpassade till uppdragets karaktär och kundens behov.",
                  "A2M Tech works with a combination of delivery models adapted to the nature of the assignment and the client's needs."
                )}
              </p>
            </div>
            <div className="mt-2">
              <BusinessMix items={publishableMix} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 Market position ── */}
      <section className="border-b border-[#D7E1E5] bg-[#F7F9F8] py-20" aria-labelledby="market-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-start gap-6">
            <SectionNumber n={publishableFinancials.length > 0 ? "04" : "03"} />
            <div>
              <SectionEyebrow>
                {h("MARKNAD", "MARKET")}
              </SectionEyebrow>
              <h2 id="market-heading" className="mb-4 font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                {h("Marknad och långsiktiga drivkrafter", "Market and long-term drivers")}
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-[#334B58]">
                {marketIntro}
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-px border border-[#D7E1E5] bg-[#D7E1E5] lg:grid-cols-3">
            {drivers.map((d) => (
              <div key={d.title} className="bg-white px-8 py-8">
                <div className="mb-3 h-0.5 w-8 bg-[#004869]" aria-hidden />
                <h3 className="mb-3 font-display text-lg font-bold text-[#003347]">
                  {d.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#334B58]">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 Strategic priorities ── */}
      <section className="border-b border-[#D7E1E5] bg-white py-20" aria-labelledby="strategy-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-start gap-6">
            <SectionNumber n={publishableFinancials.length > 0 ? "05" : "04"} />
            <div>
              <SectionEyebrow>
                {h("STRATEGI", "STRATEGY")}
              </SectionEyebrow>
              <h2 id="strategy-heading" className="font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                {h("Strategiska prioriteringar", "Strategic priorities")}
              </h2>
            </div>
          </div>

          <ol className="divide-y divide-[#D7E1E5]">
            {priorities.map((p, i) => (
              <li key={p.title} className="grid gap-4 py-8 lg:grid-cols-[80px_1fr_2fr] lg:gap-8">
                <span className="font-mono text-3xl font-bold tabular-nums text-[#D7E1E5]" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-bold text-[#003347]">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#334B58]">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 06 Capital and development priorities ── */}
      <section className="border-b border-[#D7E1E5] bg-[#F7F9F8] py-20" aria-labelledby="capital-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-start gap-6">
            <SectionNumber n={publishableFinancials.length > 0 ? "06" : "05"} />
            <div>
              <SectionEyebrow>
                {h("KAPITAL", "CAPITAL")}
              </SectionEyebrow>
              <h2 id="capital-heading" className="font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                {h("Kapital och utvecklingsprioriteringar", "Capital and development priorities")}
              </h2>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              {publishableCapFields.length > 0 ? (
                <CapitalFields fields={investorContent.capitalFields} locale={locale} />
              ) : (
                <p className="text-sm text-[#334B58]">
                  {h(
                    "Kapitalbehov och villkor specificeras i samband med aktiva investeringsdialoger.",
                    "Capital needs and terms are specified in connection with active investment dialogues."
                  )}
                </p>
              )}
            </div>
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#334B58]/60">
                {h("Utvecklingsprioriteringar", "Development priorities")}
              </p>
              <CapitalAllocation
                items={investorContent.capitalAllocation}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 Timeline ── */}
      <section className="border-b border-[#D7E1E5] bg-white py-20" aria-labelledby="timeline-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-start gap-6">
            <SectionNumber n={publishableFinancials.length > 0 ? "07" : "06"} />
            <div>
              <SectionEyebrow>
                {h("UTVECKLINGSFAS", "DEVELOPMENT PHASE")}
              </SectionEyebrow>
              <h2 id="timeline-heading" className="font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                {h("Nästa utvecklingsfas", "Next development phase")}
              </h2>
            </div>
          </div>
          <Timeline milestones={investorContent.milestones} locale={locale} />
        </div>
      </section>

      {/* ── 08 Ownership (only if verified data exists) ── */}
      {publishableOwnership.length > 0 && (
        <section className="border-b border-[#D7E1E5] bg-[#F7F9F8] py-20" aria-labelledby="ownership-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-start gap-6">
              <SectionNumber n="08" />
              <div>
                <SectionEyebrow>
                  {h("ÄGARSTRUKTUR", "OWNERSHIP")}
                </SectionEyebrow>
                <h2 id="ownership-heading" className="font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                  {h("Ägarstruktur", "Ownership")}
                </h2>
              </div>
            </div>
            <div className="max-w-md">
              <OwnershipTable items={investorContent.ownership} locale={locale} />
            </div>
          </div>
        </section>
      )}

      {/* ── 09 Investor documents (only if verified docs exist) ── */}
      {publishableDocs.length > 0 && (
        <section className="border-b border-[#D7E1E5] bg-white py-20" aria-labelledby="docs-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-start gap-6">
              <SectionNumber n="09" />
              <div>
                <SectionEyebrow>
                  {h("INVESTERARUNDERLAG", "INVESTOR MATERIALS")}
                </SectionEyebrow>
                <h2 id="docs-heading" className="font-display text-3xl font-bold text-[#003347] lg:text-4xl">
                  {h("Investerarunderlag", "Investor materials")}
                </h2>
              </div>
            </div>
            <div className="max-w-2xl">
              <DocumentList docs={investorContent.documents} locale={locale} />
            </div>
          </div>
        </section>
      )}

      {/* ── Closing CTA ── */}
      <section className="border-t border-[#D7E1E5] bg-[#003347] py-20 text-white" aria-labelledby="inv-cta-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#BCEAF2]">
                A2M TECH
              </p>
              <h2 id="inv-cta-heading" className="mb-5 font-display text-3xl font-bold leading-tight lg:text-4xl">
                {ctaH2}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/80">
                {ctaBody}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-white px-7 py-3 text-sm font-semibold text-[#003347] transition-colors hover:bg-[#F7F9F8] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#003347]"
                >
                  {ctaPrimary}
                </Link>
                <a
                  href={contacts.emailHref}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#003347]"
                >
                  {ctaSecondary}
                </a>
              </div>
            </div>

            {/* Contact card */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-8">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/50">
                {h("KONTAKT", "CONTACT")}
              </p>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs text-white/50">{h("Bolag", "Company")}</dt>
                  <dd className="text-sm font-medium text-white">{isSv ? "A2M Tech AB" : "A2M Tech AB"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-white/50">{h("Telefon", "Phone")}</dt>
                  <dd>
                    <a
                      href={contacts.phoneHref}
                      className="text-sm font-medium text-white hover:underline focus:outline-none focus-visible:underline"
                    >
                      {contacts.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-white/50">LinkedIn</dt>
                  <dd>
                    <a
                      href={contacts.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white hover:underline focus:outline-none focus-visible:underline"
                    >
                      linkedin.com/company/a2m-tech
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
