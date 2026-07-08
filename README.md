# A2M Tech – Företagswebbplats

Professionell tvåspråkig (svenska/engelska) webbplats för [A2M Tech](https://a2m-tech.com), byggd med Next.js och exporterad som statisk HTML för Hostinger.

## Teknik

- **Next.js 16** (App Router, static export)
- **Tailwind CSS** + shadcn/ui
- **next-intl** för svenska (`/sv/`) och engelska (`/en/`)

## Utveckling lokalt

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) – du omdirigeras till `/sv/`.

## Bygga för produktion

```bash
npm run build
```

Det genererar en statisk sajt i mappen `out/`.

Förhandsgranska bygget lokalt:

```bash
npx serve out
```

## Publicera på Hostinger

### Förhandsgranska (live)

Den nya sajten är deployad och tillgänglig på:

**https://career.a2m-tech.com/sv/**

### Ersätta a2m-tech.com (rot-domänen)

Rot-domänen `a2m-tech.com` är fortfarande kopplad till **Hostinger Website Builder** (den gamla Zyro-sajten). Hostinger Hosting MCP kan inte deploya dit förrän Website Builder kopplas bort.

**Steg i hPanel:**

1. Logga in på **hPanel** → **Webbplatser**
2. Hitta **a2m-tech.com** (Website Builder) och **ta bort/avpublicera** den gamla sajten
3. Lägg till **a2m-tech.com** som webbhotellssajt (Webbhotell → Lägg till webbplats)
4. Vänta tills domänen syns i webbhotell (kan ta några minuter)
5. Kör deploy igen (se nedan) med `domain: a2m-tech.com`

Efter migrering pekar `https://a2m-tech.com/` till den nya sajten.

### Deploy via terminal + Hostinger MCP

```bash
npm run build
cd out && zip -r ../out_YYYYMMDD_HHMMSS.zip .
```

Be sedan agenten deploya med Hostinger Hosting MCP:

- Verktyg: `hosting_deployStaticWebsite`
- `domain`: `a2m-tech.com` (eller `career.a2m-tech.com` för test)
- `archivePath`: absolut sökväg till zip-filen

### Manuell uppladdning (alternativ)

Kör `npm run build` på din dator. Mappen `out/` innehåller alla filer som ska publiceras.

### 2. Ladda upp till `public_html`

1. Logga in på **Hostinger hPanel**
2. Gå till **Filer** → **File Manager** → `public_html`
3. **Ta backup** av befintliga filer (nuvarande Website Builder-sida)
4. Ta bort gamla webbfiler i `public_html` (behåll ev. `.well-known` om den finns)
5. Ladda upp **hela innehållet** i `out/` till `public_html` (inte själva mappen `out`, utan filerna inuti)

Efter uppladdning ska du ha t.ex.:

- `public_html/index.html`
- `public_html/sv/index.html`
- `public_html/en/index.html`
- `public_html/.htaccess`
- `public_html/brand/logo.png`
- `public_html/_next/...`

### 3. `.htaccess`

Filen `public/.htaccess` kopieras automatiskt till `out/` vid build. Den omdirigerar rot-URL:en till `/sv/`.

Om omdirigeringen inte fungerar, kontrollera att Apache `mod_rewrite` är aktiverat i Hostinger (standard).

### 4. SSL och domän

Kontrollera att `a2m-tech.com` pekar på Hostinger och att SSL (HTTPS) är aktivt.

### 5. Verifiera

- [https://a2m-tech.com/](https://a2m-tech.com/) → omdirigerar till `/sv/`
- [https://a2m-tech.com/sv/](https://a2m-tech.com/sv/)
- [https://a2m-tech.com/en/](https://a2m-tech.com/en/)
- Språkväxlare fungerar
- Calendly-länkar öppnas korrekt

## Uppdatera innehåll

| Vad | Var |
|-----|-----|
| Texter (SV/EN) | `messages/sv.json`, `messages/en.json` |
| Länkar, kontakt, team | `lib/constants.ts` |
| Färger och typsnitt | `app/globals.css`, `lib/fonts.ts` |
| Logotyp | `public/brand/logo.png` |

Efter ändringar: `npm run build` och ladda upp `out/` igen.

## Projektstruktur

```
app/
  [locale]/          # Svenska och engelska sidor
  globals.css        # Design tokens och tema
  sitemap.ts         # Automatisk sitemap
components/
  layout/            # Header, Footer, språkväxlare
  sections/          # Hero, Tjänster, Om oss, m.m.
messages/            # Översättningar
public/
  brand/             # Logotyp och favicon
  robots.txt
  .htaccess
```

## SEO

- Metadata och Open Graph per språk
- `hreflang` mellan `/sv/` och `/en/`
- `sitemap.xml` och `robots.txt` genereras vid build
