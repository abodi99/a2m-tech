/**
 * All cases in this file are fictional design examples only.
 * The isDemo: true flag must be present on every entry.
 * Any component rendering these cases must check isDemo and display the mandatory disclaimer.
 */

export const DEMO_DISCLAIMER = {
  sv: "Illustrativt exempel – inte en faktisk kundreferens.",
  en: "Illustrative example – not an actual A2M Tech client reference.",
} as const;

export const CASES_BANNER = {
  sv: "Illustrativa kundcase – ej faktiska A2M Tech-referenser",
  en: "Illustrative cases – not actual A2M Tech client references",
} as const;

export type LocaleString = {
  sv: string;
  en: string;
};

export type DemoCase = {
  /** Must always be true. Prevents accidental use as verified reference. */
  readonly isDemo: true;
  index: number;
  slug: string;
  customer: string;
  sector: LocaleString;
  logoPath: string;
  title: LocaleString;
  intro: LocaleString;
  utgangslage: LocaleString;
  uppdrag: LocaleString;
  genomforande: LocaleString;
  leverans: LocaleString;
  resultat: LocaleString;
  capabilities: string[];
};

/**
 * Returns localized text. Throws at runtime if isDemo is not set,
 * preventing any accidental promotion to a real reference.
 */
export function requireDemo(c: DemoCase): DemoCase {
  if (!c.isDemo) {
    throw new Error(
      `[demo-cases] Case "${(c as DemoCase).slug}" is missing isDemo: true. ` +
        "Real customer references must go through the verified content model."
    );
  }
  return c;
}

export function loc(field: LocaleString, locale: string): string {
  return locale === "en" ? field.en : field.sv;
}

export const demoCases: DemoCase[] = [
  {
    isDemo: true,
    index: 1,
    slug: "nordhamn-infrastruktur",
    customer: "Nordhamn Infrastruktur",
    sector: { sv: "Infrastruktur", en: "Infrastructure" },
    logoPath: "/demo-customers/nordhamn.svg",
    title: {
      sv: "Strukturerad modernisering av ett komplext förvaltningssystem",
      en: "Structured modernisation of a complex management system",
    },
    intro: {
      sv: "En infrastrukturorganisation behövde fasa ut ett äldre förvaltningssystem utan att äventyra kontinuiteten i den löpande driften. A2M Tech bidrog med ett fasindelat tillvägagångssätt med dokumentation som grund för hela moderniseringsresan.",
      en: "An infrastructure organisation needed to phase out a legacy management system without jeopardising continuity in ongoing operations. A2M Tech contributed a phased approach built on documentation as the foundation for the entire modernisation journey.",
    },
    utgangslage: {
      sv: "Organisationen förlitade sig på ett system som byggts upp successivt under ett decennium. Dokumentationen var fragmentarisk och stor del av driftskompetensen satt hos enstaka nyckelpersoner. En tidigare anskaffning hade initierats men avbrutits utan tydlig alternativplan, vilket lämnade organisationen i ett oklart läge.",
      en: "The organisation relied on a system built incrementally over a decade. Documentation was fragmented, and much of the operational knowledge resided with specific key individuals. A previous procurement had been initiated but halted without a clear alternative plan, leaving the organisation in an unclear position.",
    },
    uppdrag: {
      sv: "A2M Tech anlitades för att kartlägga nuläget, upprätta fullständig teknisk dokumentation och ta fram en fasindelad migrationsplan med minimerad riskexponering. Uppdraget inkluderade parallell drift under övergångsperioden och ett formellt överlämningsförfarande med godkänd acceptanstestning.",
      en: "A2M Tech was engaged to map the current state, establish complete technical documentation and develop a phased migration plan with minimised risk exposure. The assignment included parallel operation during the transition period and a formal handover procedure with approved acceptance testing.",
    },
    genomforande: {
      sv: "Arbetet delades in i tre faser: inventering och dokumentation, kontrollerad migrering med parallell drift, samt formell överlämning med utbildningsunderlag. Varje fas avslutades med skriftlig statusrapport och acceptanstestning med verksamhetens representanter. Avvikelser dokumenterades och hanterades strukturerat.",
      en: "The work was divided into three phases: inventory and documentation, controlled migration with parallel operation, and formal handover with training materials. Each phase concluded with a written status report and acceptance testing with business representatives. Deviations were documented and handled systematically.",
    },
    leverans: {
      sv: "Det nya systemet driftsattes med fullständig teknisk dokumentation, processkarta och strukturerat utbildningsunderlag för driftpersonal. Överlämningsprotokollet innehöll testresultat, kända begränsningar och en underhållsplan för de närmaste 24 månaderna. All dokumentation levererades på strukturerat format.",
      en: "The new system was deployed with complete technical documentation, a process map and structured training materials for operational staff. The handover protocol included test results, known limitations and a maintenance plan for the next 24 months. All documentation was delivered in a structured format.",
    },
    resultat: {
      sv: "I detta illustrativa scenario möjliggjorde dokumentationsfokuset en ordnad övergång utan driftstörning. Uppdraget slutfördes inom ursprunglig tidsram med tydligt ägarskap för varje leverans. Dessa resultat beskriver ett fiktivt scenario och utgör inte faktiska prestationspåståenden från A2M Tech.",
      en: "In this illustrative scenario, the documentation-first approach enabled an orderly transition without operational disruption. The assignment was completed within the original timeline with clear ownership for each deliverable. These outcomes describe a fictional scenario and do not represent actual A2M Tech performance claims.",
    },
    capabilities: [
      "Digital utveckling & integrationer",
      "Förvaltning & modernisering",
      "Dokumentation & överlämning",
    ],
  },

  {
    isDemo: true,
    index: 2,
    slug: "sundkraft-energi",
    customer: "Sundkraft Energi",
    sector: { sv: "Energi", en: "Energy" },
    logoPath: "/demo-customers/sundkraft.svg",
    title: {
      sv: "Sammanhållet informationsflöde för beslutsstöd i en energiverksamhet",
      en: "Unified information flow for decision support in an energy organisation",
    },
    intro: {
      sv: "Sundkraft Energi hade ett flertal operativa system utan inbördes integration. Beslutsfattare på olika nivåer saknade tillgång till samlad, spårbar information. A2M Tech utformade en strukturerad informationsmodell och genomförde integrationsarbetet stegvis.",
      en: "Sundkraft Energi operated several systems without mutual integration. Decision-makers at various levels lacked access to consolidated, traceable information. A2M Tech designed a structured information model and carried out the integration work incrementally.",
    },
    utgangslage: {
      sv: "Verksamheten använde separata system för drift, underhåll och rapportering. Sammanställning av beslutsunderlag krävde manuell datainsamling från flera källor, vilket var tidskrävande och gav upphov till tolkningsskillnader. Ingen etablerad ägarstruktur för informationsflödet existerade.",
      en: "The organisation used separate systems for operations, maintenance and reporting. Compiling decision support required manual data collection from multiple sources, which was time-consuming and led to differing interpretations. No established ownership structure for information flow existed.",
    },
    uppdrag: {
      sv: "Uppdraget innebar att kartlägga befintliga informationsflöden, identifiera beroenden och ta fram en integrationsarkitektur med tydlig ägarstruktur. Implementeringen skulle ske i kontrollerade steg med möjlighet till rollback och utan att störa den operativa verksamheten.",
      en: "The assignment involved mapping existing information flows, identifying dependencies and developing an integration architecture with clear ownership. Implementation was to proceed in controlled steps with rollback capability, without disrupting operational activities.",
    },
    genomforande: {
      sv: "Arbetet inleddes med workshopar med representanter från samtliga berörda enheter. En informationsmodell togs fram med utgångspunkt i verksamhetens faktiska beslutsprocess. Integrationerna implementerades en i taget med dokumentation och test vid varje steg. Slutresultatet validerades av respektive processägare.",
      en: "The work began with workshops involving representatives from all affected units. An information model was developed based on the organisation's actual decision-making process. Integrations were implemented one at a time, with documentation and testing at each step. The final result was validated by respective process owners.",
    },
    leverans: {
      sv: "En integrerad informationsplattform med rollbaserad åtkomst, strukturerad rapportering och en teknisk specifikation som möjliggör vidare förvaltning. Verksamheten erhöll ett arkitekturdokument och en driftshandbok som underlag för intern förvaltning och framtida upphandlingar.",
      en: "An integrated information platform with role-based access, structured reporting and a technical specification enabling continued maintenance. The organisation received an architecture document and operations manual as a basis for internal management and future procurements.",
    },
    resultat: {
      sv: "I detta illustrativa scenario fick beslutsfattare tillgång till samlad och spårbar information utan manuell sammanställning. Dessa resultat beskriver ett fiktivt scenario och utgör inte faktiska prestationspåståenden från A2M Tech.",
      en: "In this illustrative scenario, decision-makers gained access to consolidated and traceable information without manual compilation. These outcomes describe a fictional scenario and do not represent actual A2M Tech performance claims.",
    },
    capabilities: [
      "Data & informationsstöd",
      "Digital utveckling & integrationer",
      "Säkerhet & efterlevnad",
    ],
  },

  {
    isDemo: true,
    index: 3,
    slug: "civenta",
    customer: "Civenta",
    sector: { sv: "Samhällstjänster", en: "Community services" },
    logoPath: "/demo-customers/civenta.svg",
    title: {
      sv: "Verksamhetsnära digital tjänst för en samhällsorienterad organisation",
      en: "Business-oriented digital service for a community-focused organisation",
    },
    intro: {
      sv: "Civenta hanterade ett flertal manuella arbetsprocesser som var tidskrävande och svåra att följa upp. A2M Tech genomförde en processinventering och tog fram en digital tjänst anpassad direkt till verksamhetens behov och befintliga systemlandskap.",
      en: "Civenta managed several manual work processes that were time-consuming and difficult to follow up. A2M Tech conducted a process inventory and developed a digital service adapted directly to the organisation's needs and existing system landscape.",
    },
    utgangslage: {
      sv: "Handläggning skedde till stor del via e-post och kalkylblad utan spårbarhet. Interna rutiner varierade mellan enheter och det saknades ett gemensamt sätt att följa ärendestatus. Medarbetare efterfrågade ett strukturerat stöd som ändå var enkelt att använda i det dagliga arbetet.",
      en: "Case handling was largely conducted via email and spreadsheets without traceability. Internal routines varied between units and there was no common way to track case status. Staff requested structured support that was still simple to use in daily work.",
    },
    uppdrag: {
      sv: "Uppdraget var att kartlägga och standardisera de centrala ärendeprocesserna samt implementera ett digitalt stöd som integrerades med befintliga system. Fokus låg på att minska administrativ tid utan att komplicera arbetsflödet för handläggarna.",
      en: "The assignment was to map and standardise the central case management processes and implement a digital service that integrated with existing systems. The focus was on reducing administrative time without complicating the workflow for case handlers.",
    },
    genomforande: {
      sv: "Processinventeringen genomfördes tillsammans med handläggare och enhetschefer. Prototyper testades iterativt med slutanvändare innan slutgiltig implementering. Integrationspunkter mot befintliga system dokumenterades och implementerades med tydliga felhanteringsrutiner.",
      en: "The process inventory was conducted together with case handlers and unit managers. Prototypes were tested iteratively with end users before final implementation. Integration points with existing systems were documented and implemented with clear error-handling routines.",
    },
    leverans: {
      sv: "En digital ärendetjänst integrerad med organisationens befintliga systemmiljö, komplett med användardokumentation, administratörsgränssnitt och teknisk specifikation. Tjänsten togs i drift med parallellt stöd under en etableringsperiod.",
      en: "A digital case service integrated with the organisation's existing system environment, complete with user documentation, administrator interface and technical specification. The service was put into operation with parallel support during an establishment period.",
    },
    resultat: {
      sv: "I detta illustrativa scenario minskade den manuella handläggningstiden och ärendestatusen blev synlig för samtliga berörda. Dessa resultat beskriver ett fiktivt scenario och utgör inte faktiska prestationspåståenden från A2M Tech.",
      en: "In this illustrative scenario, manual case handling time decreased and case status became visible to all involved parties. These outcomes describe a fictional scenario and do not represent actual A2M Tech performance claims.",
    },
    capabilities: [
      "Systemutveckling & förvaltning",
      "Processutveckling",
      "Integrationer & API",
    ],
  },

  {
    isDemo: true,
    index: 4,
    slug: "oresund-logistik",
    customer: "Öresund Logistik",
    sector: { sv: "Logistik", en: "Logistics" },
    logoPath: "/demo-customers/oresund-logistik.svg",
    title: {
      sv: "Integration av fristående system för ett sammanhållet informationsflöde",
      en: "Integration of standalone systems for a unified information flow",
    },
    intro: {
      sv: "Öresund Logistik använde ett flertal specialistsystem utan koppling sinsemellan. Manuell dataöverföring skapade förseningar och felkällor. A2M Tech tog fram en integrationsarkitektur och genomförde integrationsarbetet i kontrollerade steg.",
      en: "Öresund Logistik used several specialist systems without connection to each other. Manual data transfer created delays and sources of error. A2M Tech developed an integration architecture and carried out the integration work in controlled steps.",
    },
    utgangslage: {
      sv: "Operativa system för planering, transport och fakturering saknade direktkoppling. Medarbetare exporterade data manuellt och importerade i nästa system, ett förfarande som var felkänsligt och tidskrävande. Inga etablerade övervakningsmekanismer för informationsflödet existerade.",
      en: "Operational systems for planning, transport and invoicing lacked direct connection. Staff manually exported data and imported it into the next system – a process that was error-prone and time-consuming. No established monitoring mechanisms for information flow existed.",
    },
    uppdrag: {
      sv: "Uppdraget bestod i att inventera systemlandskapet, identifiera de mest kritiska datapunkterna och implementera API-baserade integrationer med loggning och felhantering. Integrationsarbetet skulle ske utan avbrott i den operativa driften.",
      en: "The assignment consisted of inventorying the system landscape, identifying the most critical data points and implementing API-based integrations with logging and error handling. Integration work was to proceed without interruption to operational activities.",
    },
    genomforande: {
      sv: "En systeminventering kartlade dataformat, frekvens och ägarskap för varje informationsström. Integrationerna implementerades en åt gången med automatiserade tester och driftsatt rollback-kapacitet. Varje integration godkändes av ansvarig processägare innan nästa påbörjades.",
      en: "A system inventory mapped data formats, frequency and ownership for each information stream. Integrations were implemented one at a time with automated testing and deployed rollback capability. Each integration was approved by the responsible process owner before the next began.",
    },
    leverans: {
      sv: "Ett integrerat systemlandskap med API-dokumentation, loggning för varje integration, och en driftshandbok som beskriver felsökning och eskaleringsrutiner. Organisationen erhöll ett tekniskt arkitekturdokument som underlag för framtida systemval.",
      en: "An integrated system landscape with API documentation, logging for each integration, and an operations manual describing troubleshooting and escalation routines. The organisation received a technical architecture document as a basis for future system decisions.",
    },
    resultat: {
      sv: "I detta illustrativa scenario eliminerades manuell dataöverföring mellan de integrerade systemen och informationsflödet fick en gemensam spårbar källa. Dessa resultat beskriver ett fiktivt scenario och utgör inte faktiska prestationspåståenden från A2M Tech.",
      en: "In this illustrative scenario, manual data transfer between integrated systems was eliminated and the information flow gained a common traceable source. These outcomes describe a fictional scenario and do not represent actual A2M Tech performance claims.",
    },
    capabilities: [
      "Integrationer & API",
      "Data & informationsstöd",
      "Digital utveckling & integrationer",
    ],
  },

  {
    isDemo: true,
    index: 5,
    slug: "alvera-fastigheter",
    customer: "Alvera Fastigheter",
    sector: { sv: "Fastighet", en: "Property" },
    logoPath: "/demo-customers/alvera.svg",
    title: {
      sv: "Långsiktig förvaltning av fastighetssystem med planerad modernisering",
      en: "Long-term management of property systems with planned modernisation",
    },
    intro: {
      sv: "Alvera Fastigheter stod inför att ett centralt fastighetssystem nådde slutet av supportlivscykeln. En ogenomtänkt migration riskerade att störa hela den operativa verksamheten. A2M Tech tog fram en förvaltningsplan med riskanalys och ett stegvist migrationsprogram.",
      en: "Alvera Fastigheter faced the situation where a central property system was reaching the end of its support lifecycle. An ill-considered migration risked disrupting the entire operational business. A2M Tech developed a management plan with risk analysis and a stepwise migration programme.",
    },
    utgangslage: {
      sv: "Fastighetssystemet hade vuxit organiskt och innehöll anpassningar utan dokumentation. Systemleverantörens supportavtal löpte ut och en uppgradering till ny version var inte möjlig utan kostbar datakonvertering. Organisationen ville behålla operativ kontinuitet under hela moderniseringsprocessen.",
      en: "The property system had grown organically and contained customisations without documentation. The system supplier's support agreement was expiring and an upgrade to a new version was not possible without costly data conversion. The organisation wanted to maintain operational continuity throughout the modernisation process.",
    },
    uppdrag: {
      sv: "A2M Tech fick i uppdrag att genomföra en nulägesanalys, upprätta en dokumenterad förvaltningsplan och ta fram ett stegvist migrationsprogram med identifierade risker och godkännandekriterier för varje fas. Uppdraget inkluderade även en leverantörsoberoende kravspecifikation.",
      en: "A2M Tech was tasked with conducting a current-state analysis, establishing a documented management plan and developing a stepwise migration programme with identified risks and approval criteria for each phase. The assignment also included a supplier-independent requirements specification.",
    },
    genomforande: {
      sv: "Nulägesanalysen inkluderade systemgenomgång, datakvalitetsbedömning och intervjuer med nyckelpersoner. Migrationsprogrammet delades in i etapper med valideringsgrindlar och möjlighet att pausa utan att äventyra driften. Datakonverteringen testades mot parallell miljö innan produktionssättning.",
      en: "The current-state analysis included a system review, data quality assessment and interviews with key individuals. The migration programme was divided into stages with validation gates and the ability to pause without jeopardising operations. Data conversion was tested against a parallel environment before production deployment.",
    },
    leverans: {
      sv: "Ett modernt fastighetssystem i drift med komplett datamigration, teknisk dokumentation och utbildningsunderlag för förvaltningspersonalen. Överlämningsrapporten innehöll konfigurationsspecifikation, testat rollback-förfarande och en underhållsplan.",
      en: "A modern property system in operation with complete data migration, technical documentation and training materials for facility management staff. The handover report included a configuration specification, tested rollback procedure and a maintenance plan.",
    },
    resultat: {
      sv: "I detta illustrativa scenario bibehölls operativ kontinuitet under hela moderniseringsperioden. Organisationen erhöll ett förvaltningsbart system med fullständig dokumentation och oberoende av en enskild systemleverantör. Dessa resultat beskriver ett fiktivt scenario och utgör inte faktiska prestationspåståenden från A2M Tech.",
      en: "In this illustrative scenario, operational continuity was maintained throughout the modernisation period. The organisation gained a manageable system with complete documentation and independence from a single system supplier. These outcomes describe a fictional scenario and do not represent actual A2M Tech performance claims.",
    },
    capabilities: [
      "Förvaltning & modernisering",
      "Riskanalys & planering",
      "Dokumentation & överlämning",
    ],
  },

  {
    isDemo: true,
    index: 6,
    slug: "navet-service",
    customer: "Navet Service",
    sector: { sv: "Serviceorganisation", en: "Service organisation" },
    logoPath: "/demo-customers/navet.svg",
    title: {
      sv: "Gemensamt digitalt driftstöd för en intern serviceorganisation",
      en: "Shared digital operational support for an internal service organisation",
    },
    intro: {
      sv: "Navet Service tillhandahöll stödfunktioner till ett flertal interna enheter, var och en med egna digitala verktyg. Fragmenteringen skapade dubbelarbete och bristande samordning. A2M Tech bistod med kravhantering och implementering av en gemensam digital driftsplattform.",
      en: "Navet Service provided support functions to several internal units, each with their own digital tools. The fragmentation created duplicate work and poor coordination. A2M Tech assisted with requirements management and implementation of a shared digital operations platform.",
    },
    utgangslage: {
      sv: "Varje enhet använde egna system för ärendehantering, resursbookning och rapportering. Ingen samlad vy över pågående arbete existerade och eskaleringsrutiner skiljde sig åt. Serviceorganisationens ledning saknade möjlighet att följa upp kapacitetsutnyttjandet övergripande.",
      en: "Each unit used its own systems for case management, resource booking and reporting. No consolidated view of ongoing work existed and escalation routines differed. Service organisation management lacked the ability to monitor capacity utilisation at an overall level.",
    },
    uppdrag: {
      sv: "Uppdraget var att samla in och strukturera krav från samtliga enheter, identifiera gemensam funktionalitet och genomföra en fasindelad implementation av en delad plattform. Hänsyn skulle tas till enheternas olika behov utan att skapa ett överblastat system.",
      en: "The assignment was to collect and structure requirements from all units, identify common functionality and carry out a phased implementation of a shared platform. Consideration was to be given to the units' different needs without creating an overloaded system.",
    },
    genomforande: {
      sv: "Kravinhämtning genomfördes enhetsvis följt av en konsolideringsworkshop. En modulbaserad arkitektur valdes för att möjliggöra gradvis utrullning. Varje modul implementerades och godkändes av berörda enheter innan nästa påbörjades. Migreringen från befintliga verktyg planerades för att minimera parallelldrift.",
      en: "Requirements gathering was carried out unit by unit, followed by a consolidation workshop. A modular architecture was chosen to enable gradual rollout. Each module was implemented and approved by the relevant units before the next began. Migration from existing tools was planned to minimise parallel operation.",
    },
    leverans: {
      sv: "En modulbaserad driftsplattform med gemensam ärendevy, resursbookning och rapportering. Plattformen levererades med driftshandbok, administratörsdokumentation och en förvaltningsplan för de närmaste 12 månaderna. Migrationshistorik dokumenterades per enhet.",
      en: "A modular operations platform with a shared case view, resource booking and reporting. The platform was delivered with an operations manual, administrator documentation and a management plan for the next 12 months. Migration history was documented per unit.",
    },
    resultat: {
      sv: "I detta illustrativa scenario minskade dubbelarbetet och serviceorganisationens ledning fick en samlad bild av kapacitetsutnyttjande och ärendestatus. Dessa resultat beskriver ett fiktivt scenario och utgör inte faktiska prestationspåståenden från A2M Tech.",
      en: "In this illustrative scenario, duplicate work decreased and service organisation management gained a consolidated view of capacity utilisation and case status. These outcomes describe a fictional scenario and do not represent actual A2M Tech performance claims.",
    },
    capabilities: [
      "Systemutveckling & förvaltning",
      "Processutveckling",
      "Dokumentation & överlämning",
    ],
  },
].map((c) => requireDemo(c as DemoCase));
