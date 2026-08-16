/**
 * Investor Relations content for A2M Tech AB.
 *
 * IMPORTANT — DATA GOVERNANCE
 * ───────────────────────────
 * All fields whose `status` is "TODO_VERIFY" or that are `undefined`
 * are automatically omitted from the public UI by the `isPublishable()`
 * helper below. Never hard-code a value into JSX to bypass this guard.
 *
 * Add real, verified values directly to the relevant fields below.
 * Remove the TODO_VERIFY placeholder and set status to "verified".
 *
 * HOW TO ADD A DOCUMENT
 * ─────────────────────
 * 1. Place the PDF (or other file) under public/investor-docs/
 * 2. Add an entry to `investorContent.documents` with href pointing
 *    to the correct public path.
 * 3. Never add links to files that do not yet exist.
 */

import { company, contacts } from "./site";

// ─── Guard ───────────────────────────────────────────────────────────────────

export function isPublishable(value?: string | number | null): boolean {
  if (value === undefined || value === null) return false;
  const s = String(value).trim();
  return (
    s !== "" &&
    s !== "TODO_VERIFY" &&
    s !== "TBD" &&
    s !== "N/A" &&
    s !== "PLACEHOLDER"
  );
}

// ─── Type definitions ─────────────────────────────────────────────────────────

export interface InvestorFinancial {
  key: string;
  labelSv: string;
  labelEn: string;
  value?: string;
  /** "TODO_VERIFY" = omit from public UI */
  status: "verified" | "TODO_VERIFY";
}

export interface FinancialDataPoint {
  year: string;
  value: number;
  type: "actual" | "forecast";
  /** Label shown on chart and in the text table (e.g. "8,4 MSEK") */
  displayValue: string;
  status: "verified" | "TODO_VERIFY";
}

export interface BusinessMixItem {
  labelSv: string;
  labelEn: string;
  /** 0–100, omit or set to undefined if not verified */
  percentage?: number;
  status: "verified" | "TODO_VERIFY";
}

export interface CapitalField {
  labelSv: string;
  labelEn: string;
  value?: string;
  status: "verified" | "TODO_VERIFY";
}

export interface CapitalAllocationItem {
  labelSv: string;
  labelEn: string;
  /** 0–100, omit if not verified */
  percentage?: number;
  status: "verified" | "TODO_VERIFY";
}

export interface InvestorMilestone {
  year: string;
  titleSv: string;
  titleEn: string;
  descriptionSv: string;
  descriptionEn: string;
  status: "verified" | "TODO_VERIFY";
}

export interface OwnershipItem {
  label: string;
  percentage?: number;
  status: "verified" | "TODO_VERIFY";
}

export interface InvestorDocument {
  titleSv: string;
  titleEn: string;
  type: string;
  /** Must be a real path under /public; e.g. "/investor-docs/presentation.pdf" */
  href: string;
  /** ISO date, e.g. "2026-08-16" */
  updatedAt?: string;
  fileSizeKb?: number;
  /** Opens in new tab; defaults true for documents */
  external?: boolean;
  status: "verified" | "TODO_VERIFY";
}

export interface InvestorContent {
  financials: InvestorFinancial[];
  financialDevelopment: FinancialDataPoint[];
  businessMix: BusinessMixItem[];
  capitalFields: CapitalField[];
  capitalAllocation: CapitalAllocationItem[];
  milestones: InvestorMilestone[];
  ownership: OwnershipItem[];
  documents: InvestorDocument[];
}

// ─── Content ──────────────────────────────────────────────────────────────────

/**
 * Replace TODO_VERIFY values with real, verified data before publishing.
 * Fields with status "TODO_VERIFY" will never render in the public UI.
 */
export const investorContent: InvestorContent = {
  // ── Financial metrics ──────────────────────────────────────────────────────
  financials: [
    {
      key: "revenue",
      labelSv: "Omsättning",
      labelEn: "Revenue",
      value: undefined,
      status: "TODO_VERIFY",
    },
    {
      key: "revenueGrowth",
      labelSv: "Tillväxt",
      labelEn: "Growth",
      value: undefined,
      status: "TODO_VERIFY",
    },
    {
      key: "recurringRevenue",
      labelSv: "Återkommande intäkter",
      labelEn: "Recurring revenue",
      value: undefined,
      status: "TODO_VERIFY",
    },
    {
      key: "operatingMargin",
      labelSv: "Rörelsemarginal",
      labelEn: "Operating margin",
      value: undefined,
      status: "TODO_VERIFY",
    },
    {
      key: "liquidity",
      labelSv: "Likviditet",
      labelEn: "Liquidity",
      value: undefined,
      status: "TODO_VERIFY",
    },
  ],

  // ── Historical / forecast data points for optional chart ──────────────────
  // Add verified annual revenue (MSEK) when available.
  financialDevelopment: [],

  // ── Business / revenue mix ─────────────────────────────────────────────────
  businessMix: [
    {
      labelSv: "Definierade digitala uppdrag",
      labelEn: "Defined digital assignments",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Teamleveranser",
      labelEn: "Team deliveries",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Specialistförstärkning",
      labelEn: "Specialist reinforcement",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Förvaltning & vidareutveckling",
      labelEn: "Maintenance & further development",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
  ],

  // ── Capital / financing information ────────────────────────────────────────
  capitalFields: [
    {
      labelSv: "Kapitalbehov",
      labelEn: "Capital need",
      value: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Bolagsvärdering",
      labelEn: "Valuation",
      value: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Investeringstyp",
      labelEn: "Investment type",
      value: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Andel till salu",
      labelEn: "Equity offered",
      value: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Status",
      labelEn: "Status",
      value: undefined,
      status: "TODO_VERIFY",
    },
  ],

  // ── Capital allocation (how investment would be used) ──────────────────────
  capitalAllocation: [
    {
      labelSv: "Leveranskapacitet",
      labelEn: "Delivery capacity",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Försäljning och marknadsutveckling",
      labelEn: "Sales and market development",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Interna kvalitets- och styrningssystem",
      labelEn: "Internal quality and governance systems",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Kompetensutveckling",
      labelEn: "Competence development",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
    {
      labelSv: "Rörelsekapital",
      labelEn: "Working capital",
      percentage: undefined,
      status: "TODO_VERIFY",
    },
  ],

  // ── Qualitative milestones (not financial forecasts) ──────────────────────
  milestones: [
    {
      year: "2026",
      titleSv: "Strukturerat leveranssystem",
      titleEn: "Structured delivery system",
      descriptionSv:
        "Etablera en tydlig och uppföljningsbar leveransmodell med dokumentation, kvalitetsrutiner och intern styrning.",
      descriptionEn:
        "Establish a clear and traceable delivery model with documentation, quality routines and internal governance.",
      status: "verified",
    },
    {
      year: "2027",
      titleSv: "Utökad leveranskapacitet",
      titleEn: "Extended delivery capacity",
      descriptionSv:
        "Bygg ut kapaciteten genom en kombination av intern kompetens, specialistförstärkning och strukturerad samverkan.",
      descriptionEn:
        "Scale capacity through a combination of internal competence, specialist reinforcement and structured collaboration.",
      status: "verified",
    },
    {
      year: "2028",
      titleSv: "Etablerade långsiktiga uppdrag",
      titleEn: "Established long-term assignments",
      descriptionSv:
        "Konsolidera bolagets position med återkommande uppdrag, långsiktiga kundrelationer och tydlig förvaltningskapacitet.",
      descriptionEn:
        "Consolidate the company's position with recurring assignments, long-term client relationships and clear maintenance capability.",
      status: "verified",
    },
  ],

  // ── Ownership ──────────────────────────────────────────────────────────────
  // Populate with verified data before rendering.
  ownership: [],

  // ── Investor documents ─────────────────────────────────────────────────────
  // Only add entries whose files exist under public/.
  documents: [],
};

// Re-export company facts for convenience
export { company, contacts };
