# A2M Tech – institutional website

Bilingual (Swedish / English) company site for [A2M Tech](https://a2m-tech.com). Next.js App Router, static export, Hostinger-compatible.

## Stack

- Next.js 16 (App Router, `output: 'export'`, trailing slash)
- Tailwind CSS 4 + Institutional Calm tokens
- next-intl (`localePrefix: "always"`, localized pathnames)
- Playwright + Node test runner for quality gates

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/sv/](http://localhost:3000/sv/) (locale prefix is always required). Root `/` redirects to `/sv/`.

Swedish public slugs (`/sv/tjanster/`, `/sv/om-oss/`, …) are real App Router routes so they work in `next_dev` without middleware (middleware is incompatible with `output: 'export'`).

## Content editing

| What | Where |
|------|--------|
| Verified company facts | [`content/site.ts`](content/site.ts) |
| Marketing copy (SV/EN) | [`messages/sv.json`](messages/sv.json), [`messages/en.json`](messages/en.json) |
| Navigation | [`lib/nav.ts`](lib/nav.ts) |
| Verification inventory | [`docs/content-verification.md`](docs/content-verification.md) |

**Rule:** Do not render fields marked `TODO_VERIFY` or `omitted` in the public UI. Prefer omitting over inventing.

## Routes

| Swedish | English |
|---------|---------|
| `/sv/` | `/en/` |
| `/sv/tjanster/` | `/en/services/` |
| `/sv/offentlig-sektor/` | `/en/public-sector/` |
| `/sv/leveransformaga/` | `/en/delivery-capability/` |
| `/sv/kvalitet-sakerhet/` | `/en/quality-security/` |
| `/sv/for-upphandlande-organisationer/` | `/en/for-procuring-organizations/` |
| `/sv/partnerskap/` | `/en/partnership/` |
| `/sv/om-oss/` | `/en/about/` |
| `/sv/insikter/` | `/en/insights/` |
| `/sv/kontakt/` | `/en/contact/` |
| `/sv/integritet/` | `/en/privacy/` |
| `/sv/cookies/` | `/en/cookies/` |

Root `/` redirects to `/sv/` via `out/index.html` + `.htaccess`.

## Build

```bash
npm run build
```

Output: `out/`. Postbuild copies Swedish localized folders and writes the root redirect.

Preview:

```bash
npx serve out
```

## Quality gates

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:links
npm run test:e2e
# or
npm run qa
```

## Assets

- Logo / favicon: `public/brand/`
- OG images: `public/brand/og-sv.jpg`, `public/brand/og-en.jpg` (SVG sources also in `public/brand/`)
- Third-party media licenses: [`public/media/ASSET-LICENSES.md`](public/media/ASSET-LICENSES.md)

Replace brand assets in place; keep filenames unless you update references.

## Hostinger deploy

**Deploy only the contents of `out/` to `public_html`.** Never deploy the Next.js source tree (that yields 403 / missing `index.html`).

### Zip + MCP / File Manager

```bash
npm run build
cd out && zip -r ../deploy-a2m.zip .
```

Upload / deploy `deploy-a2m.zip` to the hosting domain’s document root.

### After deploy — verify

1. HTTPS works
2. `https://a2m-tech.com/` → `/sv/`
3. Trailing slashes on locale routes
4. `/sitemap.xml` and `/robots.txt`
5. Swedish paths (`/sv/tjanster/`, …) and English paths (`/en/services/`, …)

### Git auto-deploy warning

If hPanel Git deploy points at the repo root, it will publish source without `index.html`. Prefer CI that runs `npm run build` and uploads `out/`, or manual/MCP zip deploy of `out/`.

## SEO notes

- Per-page metadata, hreflang, JSON-LD (Organization / WebSite / BreadcrumbList / Service)
- Article keyword roadmap: [`docs/seo-content-roadmap.md`](docs/seo-content-roadmap.md)
- Analytics off by default; no cookie banner unless consent-gated analytics is enabled

## Company facts (public)

- A2M Tech AB
- Phone `010-114 65 59`
- Calendly and LinkedIn as in `content/site.ts`

Org.nr and postal address remain in `content/site.ts` for owner use but are not shown in the public UI.
- Calendly + company LinkedIn
- Address as in `content/site.ts` (confirm with owner if registry differs)

Personal emails are **not** shown as company contact until a domain mailbox is verified.
