/**
 * Insights & aktuellt – typed content model and editorial articles.
 *
 * HOW TO ADD A NEW ARTICLE
 * ────────────────────────
 * 1. Add a Swedish entry to `svArticles` and an English entry to `enArticles`
 *    with matching `slug` values so language-switching works.
 * 2. Set `draft: true` while you're writing. Draft articles never appear
 *    in the index, homepage, sitemap, or related articles.
 * 3. Set `draft: false` and add a real ISO date to `publishedAt` when ready.
 * 4. Slugs must be lowercase, hyphen-separated, ASCII-only. No trailing slash.
 * 5. Categories: 'public-sector' | 'delivery-capability' | 'quality-security'
 *    | 'maintenance' | 'procurement' | 'collaboration' | 'a2m-tech'
 * 6. `readingMinutes` is an integer estimate of reading time at ~200 words/min.
 * 7. `featured: true` on at most one article per locale to get visual emphasis
 *    on the homepage.
 * 8. Diagrams: add inline SVG in the `sections` array with type 'diagram'.
 *    Always include an `altText` description for accessibility.
 * 9. Before publishing verify that all internal links exist in routing.ts.
 */

export type InsightCategory =
  | 'public-sector'
  | 'delivery-capability'
  | 'quality-security'
  | 'maintenance'
  | 'procurement'
  | 'collaboration'
  | 'a2m-tech';

export type InsightType = 'article' | 'guide' | 'company-news';

export type SectionType =
  | 'paragraph'
  | 'heading2'
  | 'heading3'
  | 'list-unordered'
  | 'list-ordered'
  | 'checklist'
  | 'note'       // #BCEAF2 info panel
  | 'blockquote'
  | 'diagram';

export interface InsightSection {
  type: SectionType;
  /** Plain text for headings/paragraphs/notes/blockquotes. */
  text?: string;
  /** Array of strings for list or checklist items. */
  items?: string[];
  /** SVG markup (decorative diagrams). Include altText for accessibility. */
  svg?: string;
  altText?: string;
}

export interface InsightArticle {
  slug: string;
  /** Canonical locale for this copy. */
  locale: 'sv' | 'en';
  type: InsightType;
  category: InsightCategory;
  title: string;
  /** One-sentence lead shown in lists and meta description. */
  description: string;
  /** ISO 8601 date, e.g. "2026-08-16" */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  /** Promote to featured slot on homepage. Max one per locale. */
  featured?: boolean;
  /** True = never shown publicly. Default false. */
  draft?: boolean;
  seo: {
    title: string;
    description: string;
  };
  sections: InsightSection[];
}

// ─── Helper utilities ───────────────────────────────────────────────────────

export function getPublishedArticles(locale: 'sv' | 'en'): InsightArticle[] {
  const source = locale === 'sv' ? svArticles : enArticles;
  return source
    .filter((a) => !a.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticleBySlug(
  slug: string,
  locale: 'sv' | 'en'
): InsightArticle | undefined {
  const source = locale === 'sv' ? svArticles : enArticles;
  return source.find((a) => a.slug === slug && !a.draft);
}

/**
 * Returns the matching article in the other locale, or undefined.
 * Used for hreflang and language-switching.
 */
export function getPairedArticle(
  slug: string,
  currentLocale: 'sv' | 'en'
): InsightArticle | undefined {
  const targetLocale = currentLocale === 'sv' ? 'en' : 'sv';
  // Find English slug matching Swedish slug by checking the cross-ref map
  const map = crossRefMap[currentLocale === 'sv' ? 'svToEn' : 'enToSv'] as Record<string, string>;
  const pairedSlug = map[slug];
  if (!pairedSlug) return undefined;
  return getArticleBySlug(pairedSlug, targetLocale);
}

export function getRelatedArticles(
  article: InsightArticle,
  count = 3
): InsightArticle[] {
  const source =
    article.locale === 'sv' ? svArticles : enArticles;
  return source
    .filter(
      (a) =>
        !a.draft &&
        a.slug !== article.slug &&
        (a.category === article.category || true)
    )
    .sort((a, b) => {
      // Same category first
      const aScore = a.category === article.category ? 2 : 0;
      const bScore = b.category === article.category ? 2 : 0;
      if (aScore !== bScore) return bScore - aScore;
      // Then most recent
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, count);
}

/** Category display labels */
export const categoryLabels: Record<
  InsightCategory,
  { sv: string; en: string }
> = {
  'public-sector':       { sv: 'Offentlig sektor',  en: 'Public sector' },
  'delivery-capability': { sv: 'Leveransförmåga',   en: 'Delivery capability' },
  'quality-security':    { sv: 'Kvalitet & säkerhet', en: 'Quality & security' },
  'maintenance':         { sv: 'Förvaltning',        en: 'Maintenance' },
  'procurement':         { sv: 'Upphandling',        en: 'Procurement' },
  'collaboration':       { sv: 'Samverkan',          en: 'Collaboration' },
  'a2m-tech':            { sv: 'A2M Tech',           en: 'A2M Tech' },
};

/**
 * Maps Swedish slugs to their English equivalents and vice-versa.
 * Keep this in sync whenever you add new articles.
 */
export const crossRefMap = {
  svToEn: {
    'fran-tilldelning-till-forvaltning': 'from-award-to-maintenance',
    'kontinuitet-och-overlamning': 'continuity-and-handover',
    'leverantorsunderlag-vid-upphandling': 'supplier-documentation-procurement',
    'avvikelsehantering-digitala-uppdrag': 'deviation-management-digital-assignments',
    'ansvarsfordelning-digitala-uppdrag': 'responsibility-assignment-digital-projects',
    'utvardera-digital-leveranspartner': 'evaluating-digital-delivery-partner',
  },
  enToSv: {
    'from-award-to-maintenance': 'fran-tilldelning-till-forvaltning',
    'continuity-and-handover': 'kontinuitet-och-overlamning',
    'supplier-documentation-procurement': 'leverantorsunderlag-vid-upphandling',
    'deviation-management-digital-assignments': 'avvikelsehantering-digitala-uppdrag',
    'responsibility-assignment-digital-projects': 'ansvarsfordelning-digitala-uppdrag',
    'evaluating-digital-delivery-partner': 'utvardera-digital-leveranspartner',
  },
} as const;

// ─── Swedish articles ────────────────────────────────────────────────────────

export const svArticles: InsightArticle[] = [
  {
    slug: 'fran-tilldelning-till-forvaltning',
    locale: 'sv',
    type: 'article',
    category: 'delivery-capability',
    title: 'Från tilldelning till förvaltning – så skapas en uppföljningsbar leverans',
    description:
      'En tydlig leverans kräver mer än en bra start. Ansvar, dokumentation och uppföljning behöver följa med genom hela uppdraget.',
    publishedAt: '2026-08-16',
    readingMinutes: 7,
    featured: true,
    draft: false,
    seo: {
      title: 'Från tilldelning till förvaltning – uppföljningsbar leverans | A2M Tech',
      description:
        'Praktisk guide om hur ansvar, dokumentation och uppföljning bör följa med från uppdragsstart till förvaltning i digitala leveranser.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'Många digitala uppdrag börjar med en tydlig kravbild och ett avtal – men tappar riktning längre in i leveransen. Ofta beror det inte på tekniska problem, utan på otydliga ansvarsförhållanden, underdokumenterade beslut eller avsaknad av strukturerad uppföljning. Den här artikeln beskriver ett möjligt arbetssätt för att skapa en leverans som är uppföljningsbar från start till förvaltning.',
      },
      {
        type: 'heading2',
        text: 'Varför leveransstyrning bör börja innan genomförandet',
      },
      {
        type: 'paragraph',
        text: 'En vanlig brist i digitala uppdrag är att styrningsstrukturen sätts upp sent – ibland inte förrän problem uppstår. Det leder till att oklarheter kring roller, beslutsbefogenheter och eskaleringsvägar uppstår i ett läge när det är svårt att ändra kurs.',
      },
      {
        type: 'paragraph',
        text: 'En tydlig leveransplan bör finnas på plats innan genomförandefasen börjar. Den behöver inte vara komplicerad, men den ska svara på: vem ansvarar för vad, hur fattas och dokumenteras beslut, hur rapporteras status, och vad gäller vid avvikelser.',
      },
      {
        type: 'heading2',
        text: 'Roller och ansvar',
      },
      {
        type: 'paragraph',
        text: 'En tydlig leverans förutsätter att ansvaret är namngivet och accepterat av berörda parter. Vanliga roller att definiera är:',
      },
      {
        type: 'list-unordered',
        items: [
          'Uppdragsägare eller beställaransvarig – den person hos beställarorganisationen som godkänner leveranser och eskalerar beslut.',
          'Produktansvarig eller kravansvarig – den person som äger kravbilden och prioriteringar löpande under uppdraget.',
          'Leveransansvarig hos leverantören – den person som är ansvarig för att leveransen sker enligt plan och som är primär kontakt.',
          'Teknisk ansvarig – den person som äger de tekniska besluten och dokumentationen.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Är rollerna otydliga är det svårt att veta vem som ska kontaktas vid problem, vem som kan fatta beslut och vem som skriver under på att en leverans är godkänd.',
      },
      {
        type: 'heading2',
        text: 'Dokumenterade leverabler och beslut',
      },
      {
        type: 'paragraph',
        text: 'Varje uppdrag bör ha en förteckning över vad som ska levereras, när, och vad som krävs för att en leverans ska anses godkänd. Det räcker inte med ett avtal som anger "ett system" – leveransen behöver brytas ner i godkännbara delar med acceptanskriterier.',
      },
      {
        type: 'note',
        text: 'Praktisk tumregel: om det inte är skrivet finns det inte. Muntliga överenskommelser om leveranser eller ändringar skapar oklarheter som ofta eskalerar sent i projektet.',
      },
      {
        type: 'paragraph',
        text: 'Beslut som påverkar leveransens scope, tid eller kostnad bör dokumenteras skriftligen med datum, fattande part och konsekvens. Det gäller både beslut fattade av beställaren och leverantören.',
      },
      {
        type: 'heading2',
        text: 'Ändringshantering',
      },
      {
        type: 'paragraph',
        text: 'Förändringar i krav eller scope är vanliga i digitala uppdrag. Utan en tydlig hanteringsprocess riskerar de att orsaka scope creep, oklart ansvar och missnöje på båda sidor.',
      },
      {
        type: 'paragraph',
        text: 'En enkel ändringsprocess kan se ut så här:',
      },
      {
        type: 'list-ordered',
        items: [
          'Ändringen identifieras och beskrivs av den part som initierar den.',
          'Konsekvensanalys görs av leverantören: påverkan på tid, kostnad och andra leveranser.',
          'Ändringen godkänns skriftligen av rätt part hos beställaren.',
          'Ändringen läggs till i leveransplanen med nytt datum och acceptanskriterie.',
          'Ändringsloggen uppdateras.',
        ],
      },
      {
        type: 'heading2',
        text: 'Statusrapportering',
      },
      {
        type: 'paragraph',
        text: 'Regelbunden statusrapportering ger beställaren insyn och möjlighet att fatta informerade beslut. En statusrapport behöver inte vara ett tungt dokument – det viktiga är att den är regelbunden, ärlig och inkluderar eventuella risker eller avvikelser.',
      },
      {
        type: 'paragraph',
        text: 'Relevant att inkludera i en statusrapport kan vara:',
      },
      {
        type: 'list-unordered',
        items: [
          'Sammanfattning av perioden: vad är gjort, vad är planerat.',
          'Status för varje pågående leverabel: på plan, försenat, blockat.',
          'Aktuella risker och avvikelser med ägar- och åtgärdsansvar.',
          'Kommande beslutspunkter eller godkännanden som beställaren behöver ta.',
        ],
      },
      {
        type: 'heading2',
        text: 'Acceptans och överlämning',
      },
      {
        type: 'paragraph',
        text: 'Acceptansprocessen är ofta den fas som leder till störst friktion om den inte förberetts tidigt. En tydlig acceptansprocess inkluderar:',
      },
      {
        type: 'list-unordered',
        items: [
          'Förutbestämda acceptanskriterier per leverabel.',
          'En utsedd person hos beställaren som ansvarar för acceptanstestning.',
          'En definierad period för acceptanstestning.',
          'En process för att rapportera och hantera fel eller brister under acceptansen.',
          'Formell signering eller skriftlig bekräftelse av godkänd leverans.',
        ],
      },
      {
        type: 'heading2',
        text: 'Förvaltning och kontinuitet',
      },
      {
        type: 'paragraph',
        text: 'En leverans är inte klar när systemet är driftsatt – det är klar när beställarorganisationen självständigt kan förvalta och vidareutveckla det som levererats. Det kräver:',
      },
      {
        type: 'list-unordered',
        items: [
          'Teknisk dokumentation som är tillräcklig för att en ny driftansvarig ska kunna ta över.',
          'Rutindokumentation för drift, felhantering och vanliga ändringar.',
          'Uppgifter om externa beroenden, licenser och tjänster.',
          'Tydlig ägandestruktur för kod, data och konfiguration.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Tidpunkten att planera för förvaltning är inte vid leveranstillfället – utan redan under uppdragets genomförandefas.',
      },
      {
        type: 'note',
        text: 'Läs mer om ansvarsfördelning och tydlighet i leveranser i artikeln Checklista för tydlig ansvarsfördelning i digitala uppdrag.',
      },
    ],
  },

  {
    slug: 'kontinuitet-och-overlamning',
    locale: 'sv',
    type: 'guide',
    category: 'maintenance',
    title: 'Vad bör en kontinuitets- och överlämningsplan innehålla?',
    description:
      'En guide för beställare och leverantörer om vilka delar som bör ingå i en strukturerad överlämning och hur kontinuitet säkras vid personbyten eller leverantörsbyte.',
    publishedAt: '2026-08-16',
    readingMinutes: 6,
    featured: false,
    draft: false,
    seo: {
      title: 'Kontinuitets- och överlämningsplan – vad bör ingå? | A2M Tech',
      description:
        'Guide om vad en strukturerad överlämningsplan bör innehålla: dokumentation, ägandeskap, tillgångar och rutiner för leverantörsbyte.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'En kontinuitets- och överlämningsplan är ett av de dokument som är lättast att skjuta upp och svårast att ta igen. Den är avsedd att säkerställa att en digital lösning kan förvaltas och vidareutvecklas även när de ursprungliga personerna inte längre är involverade – oavsett om det handlar om personalbyten, leverantörsbyte eller avtalets naturliga slut.',
      },
      {
        type: 'heading2',
        text: 'Kunskapsöverföring',
      },
      {
        type: 'paragraph',
        text: 'Den kanske viktigaste, och mest underskattade, delen av en överlämning är kunskapsöverföringen. Teknisk dokumentation täcker formell kunskap, men det finns ofta en betydande mängd informell kunskap som finns hos nyckelpersoner: varför specifika tekniska val gjordes, vilka undantag som gjorts i kravbilden, vilka integrationer som är instabila och varför.',
      },
      {
        type: 'paragraph',
        text: 'Kunskapsöverföring bör ske aktivt genom exempelvis samarbetssessioner, genomgångar av kritiska delar och frågor och svar med mottagande part. Att leverera ett dokument är inte detsamma som att leverera förståelse.',
      },
      {
        type: 'heading2',
        text: 'Dokumentation',
      },
      {
        type: 'paragraph',
        text: 'Dokumentation är grunden för en lyckad överlämning. Relevanta dokumentationskategorier kan inkludera:',
      },
      {
        type: 'list-unordered',
        items: [
          'Arkitekturdokumentation: systemöversikt, komponentbeskrivningar, databaser och external beroenden.',
          'Driftsdokumentation: miljöer, konfiguration, deployment-procedurer och övervakningsinställningar.',
          'Rutiner: vanliga driftsuppgifter, felsökning vid kända problem, kontakter vid driftstörning.',
          'Kravhistorik: dokumentation av ursprungliga krav, ändringar som gjorts och motivering till dem.',
          'Testdokumentation: teststrategier, testfall och kända brister.',
          'Datastruktur: databeskrivning, datamodell och regler för datahantering.',
        ],
      },
      {
        type: 'heading2',
        text: 'Beroenden och externa tjänster',
      },
      {
        type: 'paragraph',
        text: 'En förteckning över externa beroenden är väsentlig för att en ny förvaltande part ska kunna ta ansvar. Det inkluderar:',
      },
      {
        type: 'list-unordered',
        items: [
          'Tredjepartstjänster med leverantör, syfte och avtalsstatus.',
          'Licenser: vilka, när de löper ut och vem som förvaltar dem.',
          'API-integrationer mot externa system.',
          'Infrastrukturleverantörer och hosting-avtal.',
          'Domäner och certifikat.',
        ],
      },
      {
        type: 'heading2',
        text: 'Ägande och tillgångar',
      },
      {
        type: 'paragraph',
        text: 'Klargör ägandeförhållandena för alla väsentliga tillgångar:',
      },
      {
        type: 'list-unordered',
        items: [
          'Kod: var finns källkod, vem äger den, under vilka villkor.',
          'Data: var finns den, i vilka system, vem äger den, hur exporteras den.',
          'Konfiguration: infrastrukturkonfiguration, miljövariabler, hemligheter.',
          'Dokumentation: var finns den lagrad, vem har tillgång, i vilket format.',
        ],
      },
      {
        type: 'heading2',
        text: 'Tillgång och miljöer',
      },
      {
        type: 'paragraph',
        text: 'Överlämning av tillgång bör planeras och genomföras systematiskt:',
      },
      {
        type: 'list-unordered',
        items: [
          'Förteckning över alla miljöer: produktion, test, staging.',
          'Tillgång till källkodsrepository.',
          'Tillgång till deploymentsystem och CI/CD-pipeline.',
          'Tillgång till övervakningsverktyg och loggningssystem.',
          'Lösenord och secrets – hantering och överlämning.',
          'Administratörsrättigheter för externa tjänster.',
        ],
      },
      {
        type: 'note',
        text: 'Praktisk rekommendation: genomför en testöverlämning i förväg om möjligt. Låt mottagande part försöka genomföra en enklare driftsuppgift baserat på den överlämnade dokumentationen, för att identifiera luckor.',
      },
      {
        type: 'heading2',
        text: 'Ansvar och kontakter',
      },
      {
        type: 'paragraph',
        text: 'En överlämningsplan bör innehålla en förteckning med namngivna kontakter, inte bara roller. Det bör framgå vem som kan kontaktas vid frågor om specifika delar av systemet, och hur länge de är tillgängliga för frågor efter överlämningens formella slut.',
      },
      {
        type: 'heading2',
        text: 'Kvarstående frågor',
      },
      {
        type: 'paragraph',
        text: 'Ingen överlämning är perfekt. En ärlig förteckning över kvarstående frågor, kända brister och planerade åtgärder är mer värdefull än en överlämningsplan som låtsas att allt är löst. Det ger mottagaren möjlighet att planera och sätta rätt förväntningar.',
      },
      {
        type: 'heading2',
        text: 'Transition vid leverantörsbyte',
      },
      {
        type: 'paragraph',
        text: 'Vid leverantörsbyte tillkommer ett antal specifika överväganden:',
      },
      {
        type: 'list-unordered',
        items: [
          'Parallell drift under övergångsperioden om möjligt.',
          'Rollback-plan om den nya leverantören stöter på oförutsedda problem.',
          'Formell acceptans av att mottagande part har tagit över ansvaret.',
          'Klargörande om vem som ansvarar vid eventuella incidenter under transitionsperioden.',
          'Kommunikationsplan till slutanvändare om det påverkar dem.',
        ],
      },
    ],
  },

  {
    slug: 'leverantorsunderlag-vid-upphandling',
    locale: 'sv',
    type: 'guide',
    category: 'procurement',
    title: 'Vilket underlag behöver en upphandlande organisation från en digital leverantör?',
    description:
      'En översikt av vanliga kategorier av leverantörsinformation som kan efterfrågas vid upphandling av digitala tjänster. Vilket underlag som är relevant beror på uppdragets omfattning och kravbild.',
    publishedAt: '2026-08-16',
    readingMinutes: 6,
    featured: false,
    draft: false,
    seo: {
      title: 'Leverantörsunderlag vid digital upphandling | A2M Tech',
      description:
        'Vilken information kan en upphandlande organisation begära från en digital leverantör? En praktisk översikt av vanliga kategorier utan juridiska råd.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'Vid upphandling av digitala tjänster behöver den upphandlande organisationen bilda sig en uppfattning om leverantörens förutsättningar att genomföra uppdraget. Vilket underlag som är relevant beror på upphandlingens omfattning, kravbild och avtalsform. Den här artikeln ger en översikt av vanliga informationskategorier – inte en uttömmande lista som gäller för alla upphandlingar.',
      },
      {
        type: 'note',
        text: 'Den här artikeln ger inte juridisk rådgivning. Krav och dokumentation vid upphandling regleras av lag (LOU, LUFS m.fl.) och det specifika avtalet. Upphandlande organisationer bör rådfråga sin juridiska funktion eller upphandlingskompetens.',
      },
      {
        type: 'heading2',
        text: 'Bolagsinformation',
      },
      {
        type: 'paragraph',
        text: 'Grundläggande information om leverantörens bolagsstruktur är vanligen relevant:',
      },
      {
        type: 'list-unordered',
        items: [
          'Juridiskt namn och organisationsnummer.',
          'Bolagsform och registreringsland.',
          'Kontaktuppgifter till registrerat säte och fakturaadress.',
          'Information om ägarstruktur om relevant för bedömning av leverantörens stabilitet.',
        ],
      },
      {
        type: 'heading2',
        text: 'Ansvariga kontakter',
      },
      {
        type: 'paragraph',
        text: 'En namngiven kontakt för upphandlingsfrågor och en namngiven kontakt för genomförande är vanligen minimum. Vid större uppdrag kan det vara relevant att veta vilka nyckelpersoner som är planerade för uppdraget.',
      },
      {
        type: 'heading2',
        text: 'Leveransförmåga',
      },
      {
        type: 'paragraph',
        text: 'Underlag om leverantörens förmåga att genomföra det specifika uppdraget kan inkludera:',
      },
      {
        type: 'list-unordered',
        items: [
          'Beskrivning av leverantörens arbetssätt och leveransmodell.',
          'Relevant erfarenhet och kompetensområden.',
          'Teamstruktur och nyckelroller för uppdraget.',
          'Geografisk förmåga och tillgänglighet.',
          'Subkontraktörsstruktur om underentreprenörer är planerade.',
        ],
      },
      {
        type: 'heading2',
        text: 'Ekonomisk information',
      },
      {
        type: 'paragraph',
        text: 'Beroende på uppdragets storlek och löptid kan ekonomisk information vara relevant för att bedöma leverantörens stabilitet:',
      },
      {
        type: 'list-unordered',
        items: [
          'Omsättning och eventuellt resultat för de senaste åren, om tillgängligt via årsredovisning.',
          'Betalningsanmärkningar och skulder via kreditupplysning.',
          'Skatteuppgifter (skatteinbetalning, F-skattsedel) om tillämpligt.',
        ],
      },
      {
        type: 'heading2',
        text: 'Kvalitets- och processrutiner',
      },
      {
        type: 'paragraph',
        text: 'Underlag om leverantörens interna kvalitetsrutiner kan inkludera:',
      },
      {
        type: 'list-unordered',
        items: [
          'Beskrivning av hur kvalitet säkerställs i leveransen.',
          'Dokumentationsrutiner och leveransdokumentation.',
          'Avvikelse- och ändringshanteringsprocess.',
          'Uppföljnings- och rapporteringsmodell.',
          'Eventuella certifieringar om de är relevanta och verifierbara.',
        ],
      },
      {
        type: 'note',
        text: 'Certifieringar bör verifieras hos utfärdande organ. Att ett bolag påstår sig vara certifierat räcker inte som underlag.',
      },
      {
        type: 'heading2',
        text: 'Informationssäkerhet',
      },
      {
        type: 'paragraph',
        text: 'Vid uppdrag som innefattar känsliga uppgifter eller offentliga system kan informationssäkerhetsunderlag vara relevant:',
      },
      {
        type: 'list-unordered',
        items: [
          'Hur hanteras och skyddas personuppgifter?',
          'Rutiner för åtkomstkontroll till system och data.',
          'Backup- och återställningsrutiner.',
          'Incidenthanteringsprocess.',
          'Användning av underleverantörer med tillgång till känsliga data.',
        ],
      },
      {
        type: 'heading2',
        text: 'Försäkringar',
      },
      {
        type: 'paragraph',
        text: 'Beroende på avtalets art kan det vara relevant att efterfråga uppgifter om ansvarsförsäkring och eventuell projektförsäkring. Vilka försäkringar som krävs bör framgå av avtalsvillkoren.',
      },
      {
        type: 'heading2',
        text: 'Kontinuitet',
      },
      {
        type: 'paragraph',
        text: 'Information om hur leverantören hanterar personkontinuitet och leveransstabilitet vid förändring kan inkludera:',
      },
      {
        type: 'list-unordered',
        items: [
          'Plan för kompetensöverföring vid personalbyten.',
          'Förvaltningsmodell för leveransen efter avslut.',
          'Hur dokumentation och kunskap bevaras och överlämnas.',
        ],
      },
      {
        type: 'heading2',
        text: 'Referenser',
      },
      {
        type: 'paragraph',
        text: 'Om upphandlingen kräver referenser bör det framgå tydligt: vilken typ av uppdrag som är relevanta, hur många som efterfrågas, och hur de verifieras. Leverantören bör aldrig ange referenser utan de refererade kundernas godkännande.',
      },
      {
        type: 'heading2',
        text: 'Hållbarhetsinformation',
      },
      {
        type: 'paragraph',
        text: 'Beroende på organisationens egna hållbarhetskrav kan information om leverantörens hållbarhetsarbete efterfrågas. Det kan inkludera policy, ansvarsfull sourcing och miljöaspekter för hosting och infrastruktur.',
      },
    ],
  },

  {
    slug: 'avvikelsehantering-digitala-uppdrag',
    locale: 'sv',
    type: 'article',
    category: 'quality-security',
    title: 'Så arbetar beställare och leverantör med avvikelser utan att tappa tempo',
    description:
      'En strukturerad avvikelsehantering skapar trygghet och spårbarhet i digitala leveranser. Så kan processen se ut i praktiken.',
    publishedAt: '2026-08-16',
    readingMinutes: 5,
    featured: false,
    draft: false,
    seo: {
      title: 'Avvikelsehantering i digitala uppdrag | A2M Tech',
      description:
        'Hur beställare och leverantör kan arbeta strukturerat med avvikelser i digitala leveranser – utan att tappa tempo eller förlora spårbarhet.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'Avvikelser uppstår i alla digitala uppdrag. Det är inte avvikelsens existens som avgör om ett uppdrag lyckas, utan hur den hanteras. En tydlig, snabb och dokumenterad process för avvikelsehantering minskar risken för att småproblem växer sig stora och skapar onödig friktion i relationen mellan beställare och leverantör.',
      },
      {
        type: 'heading2',
        text: 'Vad är en avvikelse?',
      },
      {
        type: 'paragraph',
        text: 'En avvikelse i ett digitalt uppdrag är när något avviker från vad som är avtalat, planerat eller förväntat. Det kan handla om:',
      },
      {
        type: 'list-unordered',
        items: [
          'En leverabel som inte uppfyller acceptanskriterierna.',
          'En planerad leverans som försenas.',
          'En förändring i krav som påverkar scope eller tidplan.',
          'En incident i produktionsmiljön.',
          'En teknisk brist eller säkerhetsproblem som identifieras under drift.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Avgränsningen är viktig: inte alla oklarheter är avvikelser. Löpande dialoger, frågor och diskussioner hanteras i den normala kommunikationskanalen. En avvikelse är något som behöver ett formellt svar och dokumentation.',
      },
      {
        type: 'heading2',
        text: 'Rapporteringskanal och ägarskap',
      },
      {
        type: 'paragraph',
        text: 'Från dag ett bör det vara tydligt: var rapporteras avvikelser, och vem tar emot dem? Det bör finnas en dedikerad kanal – inte en blandad e-posttråd – och en namngiven person hos leverantören som äger avvikelsens hantering från rapport till avslut.',
      },
      {
        type: 'note',
        text: 'En avvikelse som rapporteras till "leverantören i allmänhet" riskerar att fastna i otydlighet. Namnge ägarrollen tydligt i leveransavtalet.',
      },
      {
        type: 'heading2',
        text: 'Allvarlighetsgrad och prioritering',
      },
      {
        type: 'paragraph',
        text: 'Alla avvikelser är inte lika allvarliga. En enkel klassificering kan hjälpa till att prioritera rätt:',
      },
      {
        type: 'list-unordered',
        items: [
          'Kritisk: produktionsmiljön är ned eller otillgänglig för slutanvändare. Kräver omedelbar åtgärd.',
          'Hög: väsentlig funktionalitet är påverkad men systemet är inte nere. Kräver snabb åtgärd.',
          'Medium: icke-kritisk funktion är påverkad. Hanteras i nästa cykel.',
          'Låg: kosmetisk brist eller förbättringsförslag. Hanteras efter prioritering.',
        ],
      },
      {
        type: 'heading2',
        text: 'Omedelbara åtgärder',
      },
      {
        type: 'paragraph',
        text: 'Vid allvarliga avvikelser bör det finnas ett definierat första steg: vad är den omedelbara åtgärden för att begränsa skadan? Det kan handla om att dra tillbaka en driftsättning, temporärt stänga av en funktion, eller eskalera till nästa ansvarsnivå.',
      },
      {
        type: 'paragraph',
        text: 'Den omedelbara åtgärden behöver inte lösa problemet – den ska stabilisera situationen medan utredning och permanent lösning planeras.',
      },
      {
        type: 'heading2',
        text: 'Rotorsak och beslut',
      },
      {
        type: 'paragraph',
        text: 'Efter att den omedelbara åtgärden är vidtagen bör en enklare rotorsaksanalys genomföras. Det behöver inte vara ett avancerat verktyg – det räcker med att svara på: vad orsakade avvikelsen, och vad behöver förändras för att det inte ska upprepas?',
      },
      {
        type: 'paragraph',
        text: 'Rotorsaken dokumenteras i avvikelseloggen tillsammans med det beslut om åtgärd som fattats och vem som fattade det.',
      },
      {
        type: 'heading2',
        text: 'Spårbarhet och uppföljning',
      },
      {
        type: 'paragraph',
        text: 'En avvikelse är inte hanterad förrän den är bekräftad avslutad av rätt person. Det bör framgå av avvikelseloggen:',
      },
      {
        type: 'list-unordered',
        items: [
          'Rapportdatum och vem som rapporterade.',
          'Klassificering.',
          'Omedelbara åtgärder vidtagna.',
          'Rotorsak.',
          'Beslut om permanent åtgärd.',
          'Avslutsdatum och vem som bekräftade avslut.',
        ],
      },
      {
        type: 'heading2',
        text: 'Erfarenhetsåterföring',
      },
      {
        type: 'paragraph',
        text: 'Återkommande avvikelser inom samma kategori är en indikation på ett systemiskt problem. En enkel regelbunden genomgång av avvikelseloggen – en gång per sprint, månad eller per fas – ger möjlighet att identifiera mönster och åtgärda grundorsaker innan de eskalerar.',
      },
    ],
  },

  {
    slug: 'ansvarsfordelning-digitala-uppdrag',
    locale: 'sv',
    type: 'guide',
    category: 'delivery-capability',
    title: 'Checklista för tydlig ansvarsfördelning i digitala uppdrag',
    description:
      'Vilka roller och ansvarsområden behöver vara tydligt definierade i ett digitalt uppdrag? En praktisk checklista för beställare och leverantörer.',
    publishedAt: '2026-08-16',
    readingMinutes: 5,
    featured: false,
    draft: false,
    seo: {
      title: 'Ansvarsfördelning i digitala uppdrag – checklista | A2M Tech',
      description:
        'Vilka roller och ansvar behöver vara tydliga i ett digitalt uppdrag? Praktisk checklista för beställare och leverantör.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'En vanlig källa till friktion i digitala uppdrag är otydlig ansvarsfördelning. Vem kan fatta vilket beslut? Vem godkänner en leverans? Vem kontaktas vid problem? Den här checklistan är ett stöd för att tidigt i ett uppdrag klargöra ansvarsförhållandena. Anpassa den till uppdragets storlek och form.',
      },
      {
        type: 'heading2',
        text: 'Beställarorganisationens roller',
      },
      {
        type: 'checklist',
        items: [
          'Uppdragsägare / sponsor – namngivet och kommunicerat. Personen som har det yttersta ansvaret och ger formella godkännanden.',
          'Produktansvarig / kravansvarig – namngivet och kommunicerat. Den person som äger kravbilden och löpande prioriteringar.',
          'Acceptansansvarig – definierat vem som godkänner leveranser och hur.',
          'Informationssäkerhetsansvarig – definierat om och hur informationssäkerhetsaspekter ägs på beställarens sida.',
          'Kontraktansvarig – vem som ansvarar för tolkning och uppföljning av avtalsvillkoren.',
        ],
      },
      {
        type: 'heading2',
        text: 'Leverantörens roller',
      },
      {
        type: 'checklist',
        items: [
          'Leveransansvarig – namngivet och kommunicerat. Primär kontakt och ansvarig för att leveransen sker enligt plan.',
          'Teknisk ansvarig – namngivet och kommunicerat. Ansvarig för tekniska beslut och teknisk dokumentation.',
          'Kontakt för avvikelser – definierat vem man kontaktar vid avvikelse eller incident.',
        ],
      },
      {
        type: 'heading2',
        text: 'Beslutsbefogenheter',
      },
      {
        type: 'checklist',
        items: [
          'Vilka beslut kan leverantören fatta utan beställarens godkännande?',
          'Vilka beslut kräver beställarens godkännande?',
          'Vem hos beställaren kan godkänna ändringar som påverkar scope, kostnad eller tidplan?',
          'Hur eskaleras beslut om det primära beslutsfattarsystemet inte är tillgängligt?',
        ],
      },
      {
        type: 'heading2',
        text: 'Kommunikation och rapportering',
      },
      {
        type: 'checklist',
        items: [
          'Primär kommunikationskanal för löpande dialog är definierad.',
          'Kanal för formella beslut och dokumenterade överenskommelser är definierad.',
          'Rapporteringsform och -frekvens är överenskommen.',
          'Kanal för avvikelserapportering är definierad.',
          'Hur sker eskalering om det normala kommunikationssystemet inte fungerar?',
        ],
      },
      {
        type: 'heading2',
        text: 'Dokumentationsansvar',
      },
      {
        type: 'checklist',
        items: [
          'Vem ansvarar för teknisk dokumentation?',
          'Vem ansvarar för krav- och beslutsdokumentation?',
          'Var förvaras dokumentationen och vem har tillgång?',
          'I vilket format och på vilket språk ska dokumentation levereras?',
          'Vem ansvarar för att dokumentationen är aktuell under uppdragets gång?',
        ],
      },
      {
        type: 'heading2',
        text: 'Acceptans och leveransgodkännande',
      },
      {
        type: 'checklist',
        items: [
          'Acceptanskriterier per leverabel är definierade och skriftligen överenskomna.',
          'Acceptansperiod och -process är definierad.',
          'Vem genomför acceptanstestning?',
          'Hur dokumenteras godkänd leverans?',
          'Vad händer om en leverabel inte godkänns – hur ser processen ut?',
        ],
      },
      {
        type: 'heading2',
        text: 'Informations- och säkerhetsansvar',
      },
      {
        type: 'checklist',
        items: [
          'Är det tydligt vilken data leverantören har tillgång till, och under vilka villkor?',
          'Är hantering av personuppgifter reglerat i ett personuppgiftsbiträdesavtal?',
          'Vilka säkerhetskrav gäller för leverantörens åtkomst till beställarens system?',
          'Vem ansvarar för att informationssäkerhetskrav följs av leverantören?',
        ],
      },
      {
        type: 'heading2',
        text: 'Överlämning och förvaltning',
      },
      {
        type: 'checklist',
        items: [
          'Vem ansvarar för överlämningsdokumentation?',
          'Vem tar emot överlämningen och bekräftar att den är fullständig?',
          'Vem förvalta leveransen efter avslutad projektfas?',
          'Hur hanteras garantiperiod och eventuella garanti-åtgärder?',
        ],
      },
      {
        type: 'note',
        text: 'Checklistan är ett stöd, inte ett avtal. Formal reglering av ansvar sker i avtalet. Använd checklistan som underlag för dialog tidigt i uppdraget.',
      },
    ],
  },

  {
    slug: 'utvardera-digital-leveranspartner',
    locale: 'sv',
    type: 'article',
    category: 'public-sector',
    title: 'Så utvärderar ni en långsiktig digital leveranspartner',
    description:
      'Vilka dimensioner bör en upphandlande organisation och etablerad verksamhet beakta när de utvärderar en digital leverantör för ett längre åtagande?',
    publishedAt: '2026-08-16',
    readingMinutes: 7,
    featured: false,
    draft: false,
    seo: {
      title: 'Utvärdera en digital leveranspartner | A2M Tech',
      description:
        'Vilka faktorer bör väga tungt vid val av digital leverantör? En genomgång av utvärderingsdimensioner för organisationer som söker en långsiktig partner.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'Att välja en digital leverantör för ett längre uppdrag är ett beslut med konsekvenser som sträcker sig längre än kontraktsperioden. En leverantör som inte kan dokumentera sitt arbete, inte äger sina leveranser eller inte kan hantera personalbyten utan att tappa kontinuitet, kan bli en källa till problem som är svåra att åtgärda mitt i leveransen. Den här artikeln beskriver dimensioner som kan vägas in vid utvärderingen.',
      },
      {
        type: 'heading2',
        text: 'Stabilitet',
      },
      {
        type: 'paragraph',
        text: 'Bolagets ekonomiska och organisatoriska stabilitet är relevant, särskilt vid längre åtaganden. Det handlar inte om att ett bolag ska vara stort, utan om att det ska ha förutsättningar att slutföra uppdraget:',
      },
      {
        type: 'list-unordered',
        items: [
          'Bolagets ekonomiska situation och historik.',
          'Ägarstruktur och eventuella förändringar.',
          'Förmågan att upprätthålla bemanningen under avtalstiden.',
          'Kontinuitetsplan vid nyckelperoners frånvaro.',
        ],
      },
      {
        type: 'heading2',
        text: 'Ansvarighet och ägarskap',
      },
      {
        type: 'paragraph',
        text: 'En leverantör som tar ansvar för sina leveranser – inte bara utför uppdrag – skapar ett fundamentalt annorlunda samarbete. Relevanta frågor att ställa:',
      },
      {
        type: 'list-unordered',
        items: [
          'Har leverantören en namngiven kontaktperson för hela uppdraget?',
          'Tar leverantören ansvar för leveransen som helhet, inte bara sin del av arbetet?',
          'Hur hanterar leverantören en situation när något gått fel?',
          'Tar leverantören initiativ till att rapportera problem tidigt, eller väntar på att beställaren ska identifiera dem?',
        ],
      },
      {
        type: 'heading2',
        text: 'Styrning och transparens',
      },
      {
        type: 'paragraph',
        text: 'En transparent leverantör skapar förutsättningar för en välstyrd leverans. Relevanta indikationer:',
      },
      {
        type: 'list-unordered',
        items: [
          'Har leverantören ett tydligt och kommunicerat arbetssätt?',
          'Hur rapporteras status – på beställarens initiativ eller proaktivt?',
          'Är leverantörens organisation och roller tydliga?',
          'Finns bolagsinformation och faktunderlag tillgängliga utan krav på NDA?',
        ],
      },
      {
        type: 'heading2',
        text: 'Dokumentationsförmåga',
      },
      {
        type: 'paragraph',
        text: 'Dokumentation är det som gör en leverans valbar av en tredje part. En leverantör med svag dokumentationskultur skapar inlåsning, oavsett avsikt. Indikationer:',
      },
      {
        type: 'list-unordered',
        items: [
          'Kan leverantören visa exempel på teknisk dokumentation och leveransdokumentation?',
          'Ingår dokumentation som en naturlig del av leveransen, eller är det något som beror på om det "hinner med"?',
          'Hur hanteras dokumentationsansvar vid personalbyten?',
        ],
      },
      {
        type: 'heading2',
        text: 'Kontinuitet',
      },
      {
        type: 'paragraph',
        text: 'Personberoende är en av de vanligaste riskerna i digitala leveranser. Relevanta frågor:',
      },
      {
        type: 'list-unordered',
        items: [
          'Hur hanterar leverantören personalbyten under pågående uppdrag?',
          'Finns dokumentation och processer som gör leveransen möjlig att ta över av en ny person eller leverantör?',
          'Har leverantören en plan för kontinuitet som inte bygger på att specifika individer ska finnas kvar?',
        ],
      },
      {
        type: 'heading2',
        text: 'Kompetensmodell',
      },
      {
        type: 'paragraph',
        text: 'Det är relevant att förstå hur leverantörens kompetens ser ut:',
      },
      {
        type: 'list-unordered',
        items: [
          'Är kompetensen intern, eller baseras den till stor del på subkontraktörer?',
          'Hur säkerställs kompetens vid personalbyten?',
          'Är den kompetens som presenterats under upphandlingen densamma som genomför uppdraget?',
        ],
      },
      {
        type: 'heading2',
        text: 'Samarbetsmodell',
      },
      {
        type: 'paragraph',
        text: 'En leverantör bör gå att arbeta med, inte bara upphandla. Hur fungerar samarbetet i praktiken?',
      },
      {
        type: 'list-unordered',
        items: [
          'Hur hanteras meningsskiljaktigheter om krav eller prioritering?',
          'Är leverantören proaktiv med information, eller reaktiv?',
          'Hur kommunicerar leverantören risk tidigt, innan den blir ett problem?',
        ],
      },
      {
        type: 'heading2',
        text: 'Informationssäkerhet',
      },
      {
        type: 'paragraph',
        text: 'Beroende på uppdragets karaktär kan informationssäkerhet vara en central utvärderingsdimension:',
      },
      {
        type: 'list-unordered',
        items: [
          'Hur hanteras åtkomst till känsliga data?',
          'Vilka rutiner finns för hantering av personuppgifter?',
          'Hur hanteras incidenter med informationssäkerhetspåverkan?',
          'Vilka säkerhetskrav klarar leverantören att uppfylla, och kan det verifieras?',
        ],
      },
      {
        type: 'heading2',
        text: 'Förvaltningsbarhet och överlämning',
      },
      {
        type: 'paragraph',
        text: 'En leverans som inte är förvaltningsbar är ett framtida problem:',
      },
      {
        type: 'list-unordered',
        items: [
          'Är leverantörens leveranser teknikoberoende nog att förvaltas av en annan part?',
          'Levereras dokumentation som gör förvaltning möjlig utan leverantörens närvaro?',
          'Hur hanterar leverantören överlämning i slutet av avtalsperioden?',
        ],
      },
      {
        type: 'note',
        text: 'En bra leverantörsutvärdering kombinerar dokumentgranskning med direkt dialog. Hur en leverantör svarar på svåra frågor är ofta lika informativt som vad de svarar.',
      },
    ],
  },
];

// ─── English articles ────────────────────────────────────────────────────────

export const enArticles: InsightArticle[] = [
  {
    slug: 'from-award-to-maintenance',
    locale: 'en',
    type: 'article',
    category: 'delivery-capability',
    title: 'From award to maintenance – creating a traceable delivery',
    description:
      'A successful delivery requires more than a good start. Clear responsibility, documentation and follow-up need to carry through the entire assignment.',
    publishedAt: '2026-08-16',
    readingMinutes: 7,
    featured: true,
    draft: false,
    seo: {
      title: 'From award to maintenance – traceable digital delivery | A2M Tech',
      description:
        'Practical guidance on how responsibility, documentation and follow-up should carry through from start to maintenance in digital assignments.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'Many digital assignments start with a clear requirements brief and a signed contract – only to lose direction further into the delivery. The cause is often not technical failure but unclear responsibilities, underdocumented decisions, or a lack of structured progress tracking. This article describes a practical approach for building a delivery that remains traceable from initiation through long-term maintenance.',
      },
      {
        type: 'heading2',
        text: 'Why governance should begin before implementation',
      },
      {
        type: 'paragraph',
        text: 'A common shortcoming in digital assignments is that governance structures are set up late – sometimes only after problems emerge. This leads to ambiguity about roles, decision authority, and escalation paths at a point when changing course is difficult.',
      },
      {
        type: 'paragraph',
        text: 'A clear delivery plan should be in place before the implementation phase begins. It does not need to be complex, but it should address: who is responsible for what, how decisions are made and documented, how status is reported, and what applies when deviations occur.',
      },
      {
        type: 'heading2',
        text: 'Roles and responsibilities',
      },
      {
        type: 'paragraph',
        text: 'A traceable delivery requires named and acknowledged responsibilities. Common roles to define include:',
      },
      {
        type: 'list-unordered',
        items: [
          'Assignment owner or client responsible – the person at the client organisation who approves deliverables and escalates decisions.',
          'Product or requirements owner – the person who owns the requirements brief and ongoing prioritisation.',
          'Delivery responsible at the supplier – the primary contact accountable for the delivery proceeding to plan.',
          'Technical responsible – the person who owns technical decisions and documentation.',
        ],
      },
      {
        type: 'paragraph',
        text: 'When roles are unclear it becomes difficult to know who to contact when something goes wrong, who can make decisions, and who signs off on an accepted deliverable.',
      },
      {
        type: 'heading2',
        text: 'Documented deliverables and decisions',
      },
      {
        type: 'paragraph',
        text: 'Every assignment should have an inventory of what is to be delivered, when, and what is required for a deliverable to be accepted. A contract that describes "a system" is insufficient – the delivery needs to be broken down into approvable components with acceptance criteria.',
      },
      {
        type: 'note',
        text: 'A useful rule of thumb: if it is not written down, it does not exist. Verbal agreements about deliverables or changes create ambiguities that tend to surface and escalate late in the project.',
      },
      {
        type: 'paragraph',
        text: 'Decisions that affect scope, timeline, or cost should be documented in writing with date, decision-maker, and consequence. This applies to decisions made by both client and supplier.',
      },
      {
        type: 'heading2',
        text: 'Change management',
      },
      {
        type: 'paragraph',
        text: 'Requirement or scope changes are common in digital assignments. Without a clear handling process they risk causing scope creep, unclear accountability, and mutual dissatisfaction.',
      },
      {
        type: 'list-ordered',
        items: [
          'The change is identified and described by the initiating party.',
          'A consequence analysis is performed by the supplier: impact on time, cost, and other deliverables.',
          'The change is approved in writing by the appropriate person at the client.',
          'The change is added to the delivery plan with a new date and acceptance criterion.',
          'The change log is updated.',
        ],
      },
      {
        type: 'heading2',
        text: 'Status reporting',
      },
      {
        type: 'paragraph',
        text: 'Regular status reporting gives the client visibility and the ability to make informed decisions. A status report does not need to be a heavy document – what matters is that it is regular, honest, and includes risks or deviations. Useful elements in a status report may include:',
      },
      {
        type: 'list-unordered',
        items: [
          'Summary of the period: what has been done, what is planned.',
          'Status per active deliverable: on track, delayed, blocked.',
          'Current risks and deviations with ownership and action responsibility.',
          'Upcoming decision points that require client input.',
        ],
      },
      {
        type: 'heading2',
        text: 'Acceptance and handover',
      },
      {
        type: 'paragraph',
        text: 'The acceptance phase is often where the most friction emerges if it has not been prepared early. A clear acceptance process includes:',
      },
      {
        type: 'list-unordered',
        items: [
          'Pre-defined acceptance criteria per deliverable.',
          'A named person at the client responsible for acceptance testing.',
          'A defined acceptance testing period.',
          'A process for reporting and handling deficiencies found during acceptance.',
          'Formal sign-off or written confirmation of an approved deliverable.',
        ],
      },
      {
        type: 'heading2',
        text: 'Maintenance and continuity',
      },
      {
        type: 'paragraph',
        text: 'A delivery is not complete when the system goes live – it is complete when the client organisation can independently maintain and develop what has been delivered. This requires:',
      },
      {
        type: 'list-unordered',
        items: [
          'Technical documentation sufficient for a new operations responsible to take over.',
          'Operational documentation for routine tasks, issue handling, and common changes.',
          'Details of external dependencies, licences, and third-party services.',
          'Clear ownership of code, data, and configuration.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The right time to plan for maintenance is not at handover – it is during the implementation phase of the assignment.',
      },
      {
        type: 'note',
        text: 'For more on responsibility and accountability in delivery, see the article Responsibility assignment checklist for digital projects.',
      },
    ],
  },

  {
    slug: 'continuity-and-handover',
    locale: 'en',
    type: 'guide',
    category: 'maintenance',
    title: 'What should a continuity and handover plan contain?',
    description:
      'A guide for clients and suppliers on what a structured handover plan should include and how continuity is preserved through personnel changes or supplier transitions.',
    publishedAt: '2026-08-16',
    readingMinutes: 6,
    featured: false,
    draft: false,
    seo: {
      title: 'Continuity and handover plan – what should it contain? | A2M Tech',
      description:
        'What should a structured handover plan include? Documentation, ownership, environments, and routines for supplier transition.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'A continuity and handover plan is among the easiest documents to defer and the hardest to reconstruct later. Its purpose is to ensure that a digital solution can be maintained and developed even when the original people are no longer involved – whether due to personnel changes, supplier transition, or the natural end of a contract.',
      },
      {
        type: 'heading2',
        text: 'Knowledge transfer',
      },
      {
        type: 'paragraph',
        text: 'The most important and most underestimated element of a handover is knowledge transfer. Technical documentation captures formal knowledge, but there is often a significant body of tacit knowledge held by key individuals: why specific technical choices were made, which requirement exceptions were agreed, which integrations are fragile and why.',
      },
      {
        type: 'paragraph',
        text: 'Knowledge transfer should be an active process – walkthroughs of critical components, question-and-answer sessions with the receiving party, and collaborative review of documentation. Delivering a document is not the same as delivering understanding.',
      },
      {
        type: 'heading2',
        text: 'Documentation',
      },
      {
        type: 'paragraph',
        text: 'Documentation is the foundation of a successful handover. Relevant categories may include:',
      },
      {
        type: 'list-unordered',
        items: [
          'Architecture documentation: system overview, component descriptions, databases, and external dependencies.',
          'Operations documentation: environments, configuration, deployment procedures, and monitoring settings.',
          'Routines: common operational tasks, troubleshooting for known issues, escalation contacts.',
          'Requirements history: original requirements, changes made, and their rationale.',
          'Test documentation: test strategy, test cases, and known deficiencies.',
          'Data structure: data description, data model, and data management rules.',
        ],
      },
      {
        type: 'heading2',
        text: 'Dependencies and external services',
      },
      {
        type: 'paragraph',
        text: 'An inventory of external dependencies is essential for a new maintainer to take responsibility. It includes:',
      },
      {
        type: 'list-unordered',
        items: [
          'Third-party services with supplier, purpose, and contract status.',
          'Licences: which, when they expire, and who manages them.',
          'API integrations with external systems.',
          'Infrastructure providers and hosting agreements.',
          'Domains and certificates.',
        ],
      },
      {
        type: 'heading2',
        text: 'Ownership and assets',
      },
      {
        type: 'paragraph',
        text: 'Clarify ownership of all material assets:',
      },
      {
        type: 'list-unordered',
        items: [
          'Code: where is the source code, who owns it, under what terms.',
          'Data: where is it stored, in which systems, who owns it, how is it exported.',
          'Configuration: infrastructure configuration, environment variables, secrets.',
          'Documentation: where is it stored, who has access, in what format.',
        ],
      },
      {
        type: 'heading2',
        text: 'Access and environments',
      },
      {
        type: 'paragraph',
        text: 'Handover of access should be planned and executed systematically:',
      },
      {
        type: 'list-unordered',
        items: [
          'Inventory of all environments: production, test, staging.',
          'Access to source code repository.',
          'Access to deployment systems and CI/CD pipeline.',
          'Access to monitoring and logging systems.',
          'Passwords and secrets – handling and transfer.',
          'Administrator access for external services.',
        ],
      },
      {
        type: 'note',
        text: 'A practical recommendation: conduct a test handover in advance if possible. Ask the receiving party to carry out a simple operational task using only the handover documentation, to identify gaps before the formal date.',
      },
      {
        type: 'heading2',
        text: 'Responsibilities and contacts',
      },
      {
        type: 'paragraph',
        text: 'A handover plan should list named contacts, not just roles. It should be clear who can be contacted for questions about specific parts of the system, and for how long they remain available for post-handover questions.',
      },
      {
        type: 'heading2',
        text: 'Outstanding issues',
      },
      {
        type: 'paragraph',
        text: 'No handover is perfect. An honest inventory of outstanding questions, known deficiencies, and planned actions is more valuable than a handover plan that pretends everything is resolved. It gives the receiving party the ability to plan and set realistic expectations.',
      },
      {
        type: 'heading2',
        text: 'Supplier transition',
      },
      {
        type: 'paragraph',
        text: 'When handing over to a new supplier, several additional considerations apply:',
      },
      {
        type: 'list-unordered',
        items: [
          'Parallel operation during the transition period if possible.',
          'Rollback plan if the new supplier encounters unforeseen issues.',
          'Formal acceptance that the receiving party has taken over responsibility.',
          'Clarification of who is responsible for incidents during the transition period.',
          'Communication plan for end users if the transition affects them.',
        ],
      },
    ],
  },

  {
    slug: 'supplier-documentation-procurement',
    locale: 'en',
    type: 'guide',
    category: 'procurement',
    title: 'What documentation does a procuring organisation need from a digital supplier?',
    description:
      'An overview of common supplier information categories that may be requested when procuring digital services. Relevant documentation depends on the assignment scope and requirements.',
    publishedAt: '2026-08-16',
    readingMinutes: 6,
    featured: false,
    draft: false,
    seo: {
      title: 'Supplier documentation in digital procurement | A2M Tech',
      description:
        'What information can a procuring organisation request from a digital supplier? A practical overview without legal advice.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'When procuring digital services, the client organisation needs to form a view of the supplier\'s capacity to carry out the assignment. Relevant documentation depends on the scope, requirements, and contractual form of the procurement. This article provides an overview of common information categories – not an exhaustive list applicable to every procurement.',
      },
      {
        type: 'note',
        text: 'This article does not constitute legal advice. Requirements and documentation in procurement are governed by applicable law (LOU, LUF, etc. in Sweden) and the specific contract. Procuring organisations should consult their legal or procurement function.',
      },
      {
        type: 'heading2',
        text: 'Company information',
      },
      {
        type: 'paragraph',
        text: 'Basic information about the supplier\'s company structure is generally relevant:',
      },
      {
        type: 'list-unordered',
        items: [
          'Legal name and registration number.',
          'Legal form and country of registration.',
          'Contact details for registered office and invoice address.',
          'Ownership structure if relevant to assessing supplier stability.',
        ],
      },
      {
        type: 'heading2',
        text: 'Named contacts',
      },
      {
        type: 'paragraph',
        text: 'A named contact for procurement questions and a named contact for delivery are generally the minimum. For larger assignments it may be relevant to know which key individuals are planned for the engagement.',
      },
      {
        type: 'heading2',
        text: 'Delivery capability',
      },
      {
        type: 'paragraph',
        text: 'Documentation of the supplier\'s ability to carry out the specific assignment may include:',
      },
      {
        type: 'list-unordered',
        items: [
          'Description of the supplier\'s working methods and delivery model.',
          'Relevant experience and capability areas.',
          'Team structure and key roles for the assignment.',
          'Geographic availability and presence.',
          'Subcontractor structure if sub-contractors are planned.',
        ],
      },
      {
        type: 'heading2',
        text: 'Financial information',
      },
      {
        type: 'paragraph',
        text: 'Depending on the scale and duration of the assignment, financial information may be relevant to assess supplier stability:',
      },
      {
        type: 'list-unordered',
        items: [
          'Revenue and results for recent years where available through annual report.',
          'Payment defaults and liabilities via credit check.',
          'Tax compliance information where applicable.',
        ],
      },
      {
        type: 'heading2',
        text: 'Quality and process routines',
      },
      {
        type: 'paragraph',
        text: 'Documentation of the supplier\'s quality management may include:',
      },
      {
        type: 'list-unordered',
        items: [
          'Description of how quality is maintained in the delivery.',
          'Documentation practices and delivery documentation.',
          'Deviation and change management process.',
          'Follow-up and reporting model.',
          'Certifications where relevant and verifiable.',
        ],
      },
      {
        type: 'note',
        text: 'Certifications should be verified with the issuing body. A supplier\'s claim to be certified is not sufficient as a basis for evaluation.',
      },
      {
        type: 'heading2',
        text: 'Information security',
      },
      {
        type: 'paragraph',
        text: 'Where the assignment involves sensitive data or public systems, information security documentation may be relevant:',
      },
      {
        type: 'list-unordered',
        items: [
          'How is sensitive and personal data handled and protected?',
          'Access control routines for systems and data.',
          'Backup and recovery procedures.',
          'Incident management process.',
          'Use of sub-processors with access to sensitive data.',
        ],
      },
      {
        type: 'heading2',
        text: 'Insurance',
      },
      {
        type: 'paragraph',
        text: 'Depending on the nature of the contract it may be relevant to request information about liability insurance. Required coverage should be specified in the contract terms.',
      },
      {
        type: 'heading2',
        text: 'Continuity',
      },
      {
        type: 'paragraph',
        text: 'Information about how the supplier handles continuity and delivery stability through change may include:',
      },
      {
        type: 'list-unordered',
        items: [
          'Plan for competence transfer during personnel changes.',
          'Maintenance model for the delivery after project completion.',
          'How documentation and knowledge is preserved and handed over.',
        ],
      },
      {
        type: 'heading2',
        text: 'References',
      },
      {
        type: 'paragraph',
        text: 'If the procurement requires references it should be clearly stated: what type of assignments are relevant, how many are required, and how they will be verified. Suppliers should never list references without the consent of the referenced clients.',
      },
      {
        type: 'heading2',
        text: 'Sustainability',
      },
      {
        type: 'paragraph',
        text: 'Depending on the organisation\'s own sustainability requirements, information about the supplier\'s sustainability practices may be requested, including policy, responsible sourcing, and environmental aspects of hosting and infrastructure.',
      },
    ],
  },

  {
    slug: 'deviation-management-digital-assignments',
    locale: 'en',
    type: 'article',
    category: 'quality-security',
    title: 'How clients and suppliers handle deviations without losing momentum',
    description:
      'Structured deviation management creates safety and traceability in digital deliveries. A practical look at how the process can work.',
    publishedAt: '2026-08-16',
    readingMinutes: 5,
    featured: false,
    draft: false,
    seo: {
      title: 'Deviation management in digital assignments | A2M Tech',
      description:
        'How clients and suppliers can handle deviations systematically in digital deliveries without losing pace or traceability.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'Deviations occur in every digital assignment. What determines whether an assignment succeeds is not the absence of deviations but how they are handled. A clear, swift, and documented deviation management process reduces the risk of small issues becoming large problems and creating unnecessary friction between client and supplier.',
      },
      {
        type: 'heading2',
        text: 'What is a deviation?',
      },
      {
        type: 'paragraph',
        text: 'A deviation in a digital assignment is when something differs from what is contracted, planned, or expected. Examples include:',
      },
      {
        type: 'list-unordered',
        items: [
          'A deliverable that does not meet its acceptance criteria.',
          'A planned delivery that is delayed.',
          'A change in requirements that affects scope or timeline.',
          'An incident in the production environment.',
          'A technical deficiency or security issue identified during operation.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The boundary matters: not every question or uncertainty is a deviation. Ongoing dialogue, queries, and discussions are handled through the normal communication channel. A deviation is something requiring a formal response and documentation.',
      },
      {
        type: 'heading2',
        text: 'Reporting channel and ownership',
      },
      {
        type: 'paragraph',
        text: 'From day one it should be clear: where are deviations reported, and who receives them? There should be a dedicated channel – not a mixed email thread – and a named person at the supplier who owns the deviation from report through closure.',
      },
      {
        type: 'note',
        text: 'A deviation reported to "the supplier in general" risks stalling in ambiguity. Name the owner role explicitly in the delivery agreement.',
      },
      {
        type: 'heading2',
        text: 'Severity and prioritisation',
      },
      {
        type: 'paragraph',
        text: 'Not all deviations are equally serious. A simple classification helps prioritise correctly:',
      },
      {
        type: 'list-unordered',
        items: [
          'Critical: production environment is down or unavailable to end users. Requires immediate action.',
          'High: significant functionality is affected but the system is not down. Requires prompt action.',
          'Medium: non-critical function affected. Handled in the next cycle.',
          'Low: cosmetic issue or improvement suggestion. Handled after prioritisation.',
        ],
      },
      {
        type: 'heading2',
        text: 'Immediate actions',
      },
      {
        type: 'paragraph',
        text: 'For serious deviations there should be a defined first step: what is the immediate action to limit damage? This may mean rolling back a deployment, temporarily disabling a function, or escalating to the next responsibility level.',
      },
      {
        type: 'paragraph',
        text: 'The immediate action does not need to resolve the issue – it should stabilise the situation while investigation and permanent remediation are planned.',
      },
      {
        type: 'heading2',
        text: 'Root cause and decisions',
      },
      {
        type: 'paragraph',
        text: 'After the immediate action, a lightweight root cause analysis should be performed. No advanced framework is required – the question to answer is: what caused the deviation, and what needs to change to prevent recurrence?',
      },
      {
        type: 'paragraph',
        text: 'The root cause is documented in the deviation log along with the remediation decision and who made it.',
      },
      {
        type: 'heading2',
        text: 'Traceability and follow-up',
      },
      {
        type: 'paragraph',
        text: 'A deviation is not handled until confirmed closed by the right person. The deviation log should record:',
      },
      {
        type: 'list-unordered',
        items: [
          'Report date and who reported.',
          'Classification.',
          'Immediate actions taken.',
          'Root cause.',
          'Decision on permanent remediation.',
          'Closure date and who confirmed closure.',
        ],
      },
      {
        type: 'heading2',
        text: 'Lessons learned',
      },
      {
        type: 'paragraph',
        text: 'Recurring deviations in the same category indicate a systemic issue. A regular review of the deviation log – once per sprint, month, or phase – provides the opportunity to identify patterns and address root causes before they escalate.',
      },
    ],
  },

  {
    slug: 'responsibility-assignment-digital-projects',
    locale: 'en',
    type: 'guide',
    category: 'delivery-capability',
    title: 'Responsibility assignment checklist for digital projects',
    description:
      'Which roles and responsibilities need to be clearly defined in a digital assignment? A practical checklist for clients and suppliers.',
    publishedAt: '2026-08-16',
    readingMinutes: 5,
    featured: false,
    draft: false,
    seo: {
      title: 'Responsibility assignment in digital projects – checklist | A2M Tech',
      description:
        'Which roles and responsibilities need to be clear in a digital assignment? A practical checklist for clients and suppliers.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'One of the most common sources of friction in digital assignments is unclear responsibility. Who can make which decisions? Who approves a deliverable? Who is contacted when something goes wrong? This checklist supports early clarification of responsibilities in an assignment. Adapt it to the assignment\'s scale and form.',
      },
      {
        type: 'heading2',
        text: 'Client organisation roles',
      },
      {
        type: 'checklist',
        items: [
          'Assignment owner / sponsor – named and communicated. The person with ultimate accountability who approves formal deliverables.',
          'Product or requirements owner – named and communicated. The person who owns the requirements and ongoing prioritisation.',
          'Acceptance responsible – defined: who approves deliverables and how.',
          'Information security responsible – defined: if and how information security is owned on the client side.',
          'Contract responsible – who is responsible for interpreting and following up contract terms.',
        ],
      },
      {
        type: 'heading2',
        text: 'Supplier roles',
      },
      {
        type: 'checklist',
        items: [
          'Delivery responsible – named and communicated. Primary contact accountable for the delivery proceeding to plan.',
          'Technical responsible – named and communicated. Responsible for technical decisions and technical documentation.',
          'Deviation contact – defined: who is contacted for deviations or incidents.',
        ],
      },
      {
        type: 'heading2',
        text: 'Decision authority',
      },
      {
        type: 'checklist',
        items: [
          'Which decisions can the supplier make without client approval?',
          'Which decisions require client approval?',
          'Who at the client can approve changes affecting scope, cost, or timeline?',
          'How are decisions escalated when the primary decision-maker is unavailable?',
        ],
      },
      {
        type: 'heading2',
        text: 'Communication and reporting',
      },
      {
        type: 'checklist',
        items: [
          'Primary communication channel for ongoing dialogue is defined.',
          'Channel for formal decisions and documented agreements is defined.',
          'Reporting format and frequency are agreed.',
          'Channel for deviation reporting is defined.',
          'How is escalation handled if the normal communication system fails?',
        ],
      },
      {
        type: 'heading2',
        text: 'Documentation responsibility',
      },
      {
        type: 'checklist',
        items: [
          'Who is responsible for technical documentation?',
          'Who is responsible for requirements and decision documentation?',
          'Where is documentation stored and who has access?',
          'In what format and language should documentation be delivered?',
          'Who is responsible for keeping documentation current during the assignment?',
        ],
      },
      {
        type: 'heading2',
        text: 'Acceptance and delivery approval',
      },
      {
        type: 'checklist',
        items: [
          'Acceptance criteria per deliverable are defined and agreed in writing.',
          'Acceptance period and process are defined.',
          'Who carries out acceptance testing?',
          'How is an approved deliverable documented?',
          'What happens if a deliverable is not approved – what does the process look like?',
        ],
      },
      {
        type: 'heading2',
        text: 'Information and security responsibility',
      },
      {
        type: 'checklist',
        items: [
          'Is it clear what data the supplier has access to, and under what conditions?',
          'Is personal data handling governed by a data processing agreement?',
          'What security requirements apply to the supplier\'s access to client systems?',
          'Who is responsible for ensuring the supplier meets information security requirements?',
        ],
      },
      {
        type: 'heading2',
        text: 'Handover and maintenance',
      },
      {
        type: 'checklist',
        items: [
          'Who is responsible for handover documentation?',
          'Who receives the handover and confirms it is complete?',
          'Who maintains the delivery after the project phase ends?',
          'How is the warranty period and any warranty actions handled?',
        ],
      },
      {
        type: 'note',
        text: 'This checklist is a supporting tool, not a contract. Formal responsibility is governed by the contract. Use the checklist as a basis for early dialogue in the assignment.',
      },
    ],
  },

  {
    slug: 'evaluating-digital-delivery-partner',
    locale: 'en',
    type: 'article',
    category: 'public-sector',
    title: 'How to evaluate a long-term digital delivery partner',
    description:
      'Which dimensions should a procuring organisation consider when assessing a digital supplier for a longer commitment?',
    publishedAt: '2026-08-16',
    readingMinutes: 7,
    featured: false,
    draft: false,
    seo: {
      title: 'Evaluating a digital delivery partner | A2M Tech',
      description:
        'Which factors should carry weight when selecting a digital supplier? An overview of evaluation dimensions for organisations seeking a long-term partner.',
    },
    sections: [
      {
        type: 'paragraph',
        text: 'Choosing a digital supplier for a longer assignment is a decision with consequences that extend beyond the contract period. A supplier that cannot document its work, does not own its deliveries, or cannot maintain continuity through staff changes can become a source of difficulties that are hard to address mid-delivery. This article describes dimensions that may carry weight in the evaluation.',
      },
      {
        type: 'heading2',
        text: 'Stability',
      },
      {
        type: 'paragraph',
        text: 'The supplier\'s economic and organisational stability is relevant, particularly for longer commitments. The question is not whether the company is large, but whether it has the conditions to complete the assignment:',
      },
      {
        type: 'list-unordered',
        items: [
          'The company\'s financial situation and history.',
          'Ownership structure and potential changes.',
          'Ability to maintain staffing over the contract period.',
          'Continuity plan for key persons\' absence.',
        ],
      },
      {
        type: 'heading2',
        text: 'Accountability and ownership',
      },
      {
        type: 'paragraph',
        text: 'A supplier that takes responsibility for its deliveries – rather than simply executing instructions – creates a fundamentally different working relationship. Relevant questions to ask:',
      },
      {
        type: 'list-unordered',
        items: [
          'Does the supplier have a named contact person for the entire assignment?',
          'Does the supplier take responsibility for the delivery as a whole, not just their part of the work?',
          'How does the supplier handle a situation when something has gone wrong?',
          'Does the supplier proactively report issues early, or wait for the client to identify them?',
        ],
      },
      {
        type: 'heading2',
        text: 'Governance and transparency',
      },
      {
        type: 'paragraph',
        text: 'A transparent supplier creates the conditions for a well-governed delivery. Relevant indicators:',
      },
      {
        type: 'list-unordered',
        items: [
          'Does the supplier have a clear and communicated way of working?',
          'Is status reported on the client\'s initiative, or proactively?',
          'Are the supplier\'s organisation and roles clear?',
          'Is company information and factual documentation available without requiring an NDA?',
        ],
      },
      {
        type: 'heading2',
        text: 'Documentation capability',
      },
      {
        type: 'paragraph',
        text: 'Documentation is what makes a delivery transferable to a third party. A supplier with a weak documentation culture creates lock-in regardless of intent:',
      },
      {
        type: 'list-unordered',
        items: [
          'Can the supplier show examples of technical and delivery documentation?',
          'Is documentation a natural part of the delivery, or does it depend on whether there is "time for it"?',
          'How is documentation handled through personnel changes?',
        ],
      },
      {
        type: 'heading2',
        text: 'Continuity',
      },
      {
        type: 'paragraph',
        text: 'Personnel dependency is one of the most common risks in digital deliveries:',
      },
      {
        type: 'list-unordered',
        items: [
          'How does the supplier handle staff changes during an ongoing assignment?',
          'Is there documentation and process that makes the delivery transferable to a new person or supplier?',
          'Does the supplier have a continuity plan that does not rely on specific individuals remaining in post?',
        ],
      },
      {
        type: 'heading2',
        text: 'Competence model',
      },
      {
        type: 'paragraph',
        text: 'It is worth understanding the nature of the supplier\'s competence:',
      },
      {
        type: 'list-unordered',
        items: [
          'Is the competence internal, or largely based on sub-contractors?',
          'How is competence maintained through personnel changes?',
          'Is the competence presented during procurement the same as who will carry out the work?',
        ],
      },
      {
        type: 'heading2',
        text: 'Collaboration model',
      },
      {
        type: 'paragraph',
        text: 'A supplier should be workable, not just procurable. How does the collaboration function in practice?',
      },
      {
        type: 'list-unordered',
        items: [
          'How are disagreements about requirements or prioritisation handled?',
          'Is the supplier proactive with information, or reactive?',
          'How does the supplier communicate risk early, before it becomes a problem?',
        ],
      },
      {
        type: 'heading2',
        text: 'Information security',
      },
      {
        type: 'paragraph',
        text: 'Depending on the assignment\'s nature, information security may be a central evaluation dimension:',
      },
      {
        type: 'list-unordered',
        items: [
          'How is access to sensitive data handled?',
          'What routines exist for personal data management?',
          'How are information security incidents handled?',
          'Which security requirements can the supplier meet, and can this be verified?',
        ],
      },
      {
        type: 'heading2',
        text: 'Maintainability and handover',
      },
      {
        type: 'paragraph',
        text: 'A delivery that cannot be maintained is a future problem:',
      },
      {
        type: 'list-unordered',
        items: [
          'Are the supplier\'s deliveries sufficiently technology-independent to be maintained by another party?',
          'Is documentation delivered that makes maintenance possible without the supplier\'s presence?',
          'How does the supplier manage handover at the end of the contract period?',
        ],
      },
      {
        type: 'note',
        text: 'A good supplier evaluation combines document review with direct dialogue. How a supplier responds to difficult questions is often as informative as what they answer.',
      },
    ],
  },
];
