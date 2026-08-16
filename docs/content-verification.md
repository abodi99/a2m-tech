# Content verification inventory

Last reviewed: 2026-08-16

This document lists facts that are published, omitted, or pending verification. Public UI must follow [`content/site.ts`](../content/site.ts).

## Published (verified for phase 1)

| Fact | Source | Notes |
|------|--------|-------|
| Legal name A2M Tech AB | Company materials / LinkedIn | Shown publicly |
| Phone 010-114 65 59 | Existing constants | |
| Calendly `calendly.com/a2m-tech` | Existing constants | |
| Company LinkedIn | Existing constants | |
| Anas Muhannad Mofleh + LinkedIn | Constants + LinkedIn URL | Role labels from messages only |
| Abdulrahman Mofleh + LinkedIn | Constants + LinkedIn URL | Role labels from messages only |
| Geography: Sweden (remote / on site) | Owner preference | Not presented as Helsingborg-only |

## Stored but not shown publicly (owner request)

| Item | Where | Notes |
|------|--------|-------|
| Org.nr 559506-4915 | `content/site.ts` | Kept for internal/supplier packs; not rendered in UI or JSON-LD |
| Helsingborg / postal address | `content/site.ts` | Not published as sole base; UI describes Sweden-wide delivery |

## TODO_VERIFY (do not publish until confirmed)

| Item | Current placeholder / note |
|------|----------------------------|
| Company email on `@a2m-tech.com` | Personal Hotmail/Gmail exist in config but `publishEmail: false` / status `TODO_VERIFY` |
| Founding / registration year | `company.foundingYear` null |
| Named responsible contact for procurements (title beyond short role lines) | Use Calendly + phone until formal role text approved |
| Insurance certificates | Supplier docs → on request only |
| Formal quality / security document packs | On request |
| References / named clients | On request; never invent |
| Team portraits | `publishPortrait: false` |
| Detailed bios beyond short role lines | Keep minimal until approved |
| Authentic documentary photos | Prefer custom SVG until licensed/approved assets exist |

## Explicitly omitted (marketing-only or unverified)

- “10+ years” (or similar tenure claims)
- Customer logos, case studies, testimonials, award counters
- ISO certifications / clearances
- Awarded framework agreements / named public contracts
- Personal emails as the public company contact channel
- Cookie consent theatre while analytics is disabled
- Empty insight articles (topics listed only on `/sv/insikter/`)

## Supplier fact sheet statuses

See `supplierFacts.documents` in `content/site.ts`:

- **Available** — none listed as downloadable on the site today
- **On request** — registration extract, financials, insurance, quality/security docs, references, CVs
- **Omitted** — sustainability pack, certificates list, frameworks list

Update `supplierFacts.lastUpdated` when the public fact sheet changes.
