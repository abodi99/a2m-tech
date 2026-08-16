/**
 * Central typed company facts for A2M Tech.
 * Values marked TODO_VERIFY must not be rendered in the public UI.
 */

export const SITE_URL = "https://a2m-tech.com" as const;

export type VerificationStatus = "verified" | "TODO_VERIFY" | "onRequest" | "omitted";

export type PublicField<T> = {
  value: T;
  status: VerificationStatus;
};

export const company = {
  legalName: "A2M Tech AB",
  displayName: "A2M Tech",
  orgNumber: "559506-4915",
  registeredOffice: "Helsingborg",
  country: "SE",
  foundingYear: {
    value: null as number | null,
    status: "TODO_VERIFY" as VerificationStatus,
    note: "Confirm registration year before publishing.",
  },
} as const;

export const contacts = {
  phoneDisplay: "010-114 65 59",
  phoneHref: "tel:+46101146559",
  phoneE164: "+46101146559",
  /** Personal mailbox — do not show as company email until a domain mailbox exists. */
  companyEmail: {
    value: "anas-mofleh@hotmail.com",
    status: "TODO_VERIFY" as VerificationStatus,
    note: "Replace with @a2m-tech.com mailbox before public display.",
  },
  address: {
    street: "Närlundavägen 11",
    postalCode: "252 75",
    city: "Helsingborg",
    country: "Sweden",
    status: "verified" as VerificationStatus,
    note: "Confirm with owner if registry address differs.",
  },
  /** Public contact email */
  email: "info@a2m-tech.com",
  emailHref: "mailto:info@a2m-tech.com",
  /** @deprecated Calendly is no longer used – contact via email */
  calendly: "https://calendly.com/a2m-tech",
  linkedin: "https://www.linkedin.com/company/a2m-tech",
} as const;

export const team = [
  {
    id: "anas",
    name: "Anas Muhannad Mofleh",
    roleKey: "anasRole" as const,
    bioKey: "anasBio" as const,
    linkedin: "https://www.linkedin.com/in/anas-mofleh",
    email: {
      value: "anas-mofleh@hotmail.com",
      status: "TODO_VERIFY" as VerificationStatus,
    },
    publishEmail: false,
    publishPortrait: false,
    status: "verified" as VerificationStatus,
  },
  {
    id: "abdulrahman",
    name: "Abdulrahman Mofleh",
    roleKey: "abdulrahmanRole" as const,
    bioKey: "abdulrahmanBio" as const,
    linkedin: "https://www.linkedin.com/in/abdulrahman-mofleh",
    website: "https://abdulrahman-mofleh.com",
    github: "https://github.com/abodi99",
    email: {
      value: "abed.mofleh.93@gmail.com",
      status: "TODO_VERIFY" as VerificationStatus,
    },
    publishEmail: false,
    publishPortrait: false,
    status: "verified" as VerificationStatus,
  },
] as const;

export type SupplierDocStatus = "available" | "onRequest" | "omitted";

export const supplierFacts = {
  lastUpdated: "2026-08-16",
  deliveryModels: [
    "definedAssignment",
    "teamDelivery",
    "specialistReinforcement",
    "partnerCollaboration",
  ] as const,
  languages: ["sv", "en"] as const,
  geography: {
    value: "Sweden (remote and on site by agreement)",
    status: "verified" as VerificationStatus,
  },
  documents: {
    companyRegistration: "onRequest" as SupplierDocStatus,
    financials: "onRequest" as SupplierDocStatus,
    insurance: "onRequest" as SupplierDocStatus,
    qualityRoutines: "onRequest" as SupplierDocStatus,
    securityDocumentation: "onRequest" as SupplierDocStatus,
    sustainability: "omitted" as SupplierDocStatus,
    references: "onRequest" as SupplierDocStatus,
    cvs: "onRequest" as SupplierDocStatus,
  },
  certificates: {
    value: [] as string[],
    status: "omitted" as VerificationStatus,
    note: "Do not list ISO or other certificates without documentary proof.",
  },
  frameworkAgreements: {
    value: [] as string[],
    status: "omitted" as VerificationStatus,
    note: "Do not claim awarded frameworks without proof.",
  },
} as const;

/** Claims that must not appear until verified. */
export const omittedClaims = [
  "10+ years combined experience",
  "Named customer logos or case outcomes",
  "ISO certifications / security clearances",
  "Awarded public contracts or framework agreements",
  "Company domain email as public contact",
] as const;

/** Backward-compatible exports used by older components during migration. */
export const LINKS = {
  calendly: contacts.calendly,
  linkedin: contacts.linkedin,
  phone: contacts.phoneHref,
  phoneDisplay: contacts.phoneDisplay,
  orgNumber: company.orgNumber,
  address: `${contacts.address.street}, ${contacts.address.postalCode} ${contacts.address.city}`,
} as const;

export const TEAM = team;

export function isPubliclyRenderable(status: VerificationStatus): boolean {
  return status === "verified" || status === "onRequest";
}
