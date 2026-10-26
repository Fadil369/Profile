export type Lang = "ar" | "en";
export type ThemeName = "dark" | "light";

export interface StatItem {
  value: string;
  label: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  org: string;
  line: string;
}

export interface ProjectItem {
  name: string;
  status: "Active" | "Maintained";
  year?: string;
  desc: string;
  tech: string[];
  link: string;
}

export interface PublicationItem {
  title: string;
  venue: string;
  year: string;
  url: string;
}

export interface LinkItem {
  label: string;
  url: string;
  source?: string;
}

export interface LangContent {
  brand: string;
  langToggle: string;
  nav: { bpr: string; why: string; founder: string; research: string; work: string; contact: string };
  leveragePoint: string;

  heroKicker: string;
  heroName: string;
  heroTitle: string;
  heroLead: string;
  heroLocation: string;
  heroCtaMeet: string;
  heroProofPending: string;
  heroProofOk: string;
  heroProofFail: string;

  whyKicker: string;
  whyTitle: string;
  whyBeats: { label: string; text: string }[];

  registryJoin: string;
  registryVerify: string;

  founderKicker: string;
  founderTitle: string;
  founderBio: string[];
  impactStats: StatItem[];
  timelineTitle: string;
  timeline: TimelineItem[];
  linksTitle: string;
  links: LinkItem[];
  recognitionTitle: string;
  recognition: LinkItem[];

  researchKicker: string;
  researchTitle: string;
  commonsTag: string;
  commonsTitle: string;
  commonsDesc: string;
  commonsStatus: string;
  commonsRead: { en: string; ar: string; record: string };
  publicationsTitle: string;
  publications: PublicationItem[];

  workKicker: string;
  workTitle: string;
  projects: ProjectItem[];
  statuses: Record<ProjectItem["status"], string>;

  contactKicker: string;
  contactTitle: string;
  contactText: string;
  contactJoin: string;
  footerText: string;

  bookModalTitle: string;
  bookModalSubtitle: string;
  bookModalClose: string;
  bookModalOpenExternal: string;

  workspaceCta: string;
  workspaceHint: string;
  workspaceExit: string;
  workspaceBack: string;
  workspaceStandard: string;
  workspaceDock: { about: string; projects: string; collaborate: string };
}

export const BOOKING_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0edxToXuq6bDCBKRZ8_EOcx-Qp6M_bgUVjGQKEeNE2sxMLRxCNlsjk2flHMwMU2hvJyhFy_8Og?gv=true";

const LINKS = {
  bpr: "https://registry.brainsait.de/p/SA-PHY-000003",
  orcid: "https://orcid.org/0009-0003-7485-3575",
  zenodo: "https://zenodo.org/communities/bpr-doctors/",
  hf: "https://huggingface.co/Fadil369",
  github: "https://github.com/Fadil369",
  linkedin: "https://sa.linkedin.com/in/fadil369",
  x: "https://x.com/Fadil369",
  blog: "https://brainsait369.blogspot.com/"
};

const TECH = {
  lincFhir: ["FHIR R4", "InterSystems", "Agents"],
  masterlinc: ["Imaging", "PACS", "Orchestration"],
  rcm: ["NPHIES", "FHIR R4", "TypeScript"],
  mcp: ["MCP", "FHIR R4", "Audit"],
  academy: ["Arabic", "English", "NPHIES / FHIR"]
};

const GH = "https://github.com/Fadil369";
const EVIDENCE = {
  gayanvoice: "https://github.com/gayanvoice/top-github-users/blob/main/markdown/public_contributions/saudi_arabia.md",
  committers: "https://committers.top/saudi_arabia",
  digest: "https://community.intersystems.com/post/intersystems-open-exchange-applications-digest-june-2026",
  contest: "https://openexchange.intersystems.com/contest/46"
};

// Peer-reviewed journal articles from the ORCID record (0009-0003-7485-3575), newest first.
const PUBLICATIONS: PublicationItem[] = [
  {
    title: "The role of artificial intelligence in developing meal plans in outpatient dietetics: a feasibility and proof-of-concept study",
    venue: "Nutrition in Clinical Practice",
    year: "2026",
    url: "https://doi.org/10.1002/ncp.70169"
  },
  {
    title: "Use of telemedicine to provide initial home parenteral nutrition training during the COVID-19 pandemic: a case series",
    venue: "Nutrition and Health",
    year: "2025",
    url: "https://doi.org/10.1177/02601060251374384"
  },
  {
    title: "Roles, responsibilities, and opportunities for the nutrition support physician working with adults: a critical review",
    venue: "JPEN",
    year: "2025",
    url: "https://doi.org/10.1002/jpen.2790"
  },
  {
    title: "Optimizing intravenous access for long-term parenteral nutrition",
    venue: "Current Nutrition Reports",
    year: "2024",
    url: "https://doi.org/10.1007/s13668-024-00534-y"
  },
  {
    title: "Patients' and caregivers' perspective on challenges and outcomes with tube feeding: analysis of home enteral nutrition survey data",
    venue: "Clinical Nutrition ESPEN",
    year: "2024",
    url: "https://doi.org/10.1016/j.clnesp.2024.03.005"
  },
  {
    title: "Safety and effectiveness of radiologic and endoscopic percutaneous gastrostomy placement: a randomized study",
    venue: "JPEN",
    year: "2022",
    url: "https://doi.org/10.1002/jpen.2365"
  },
  {
    title: "Use of telehealth in home nutrition support: challenges and advantages",
    venue: "Nutrition in Clinical Practice",
    year: "2021",
    url: "https://doi.org/10.1002/ncp.10736"
  },
  {
    title: "Myocardial injury is associated with higher morbidity and mortality in patients with 2019 novel coronavirus disease (COVID-19)",
    venue: "SN Comprehensive Clinical Medicine",
    year: "2020",
    url: "https://doi.org/10.1007/s42399-020-00569-6"
  }
];

export const CONTENT: Record<Lang, LangContent> = {
  en: {
    brand: "Dr. El Fadil",
    langToggle: "ع",
    nav: { bpr: "BPR", why: "Why", founder: "Founder", research: "Research", work: "Work", contact: "Contact" },
    leveragePoint: "The Leverage Point",

    heroKicker: "Physician · Founder of BrainSAIT",
    heroName: "Dr. Mohamed El Fadil",
    heroTitle: "I build BPR — a verifiable identity for every clinician.",
    heroLead:
      "The BrainSAIT Provider Registry gives each physician one signed, portable identity, and connects the records, research and tools that should follow it. Built from the bedside. Running today.",
    heroLocation: "Riyadh, Saudi Arabia",
    heroCtaMeet: "Book a meeting",
    heroProofPending: "Verifying my BPR credential in your browser…",
    heroProofOk: "My BPR credential was just verified in your browser",
    heroProofFail: "Live check unavailable right now",

    whyKicker: "Why BPR",
    whyTitle: "Clinicians shouldn't be the glue between systems.",
    whyBeats: [
      {
        label: "The problem",
        text: "Physicians move between dozens of systems built for billing, not care. Claims are rejected, gaps surface late, and the clinician ends up as the human bridge."
      },
      {
        label: "The idea",
        text: "Start from identity: a signed record of who a clinician is and what they are credentialed for, so systems can trust it instead of asking again."
      },
      {
        label: "Why now",
        text: "FHIR R4 and W3C Verifiable Credentials are mature, NPHIES has put interoperability at the centre of Saudi healthcare, and AI can finally do the paperwork."
      }
    ],

    registryJoin: "Join the registry",
    registryVerify: "Verify a provider",

    founderKicker: "Founder",
    founderTitle: "Built from the bedside",
    founderBio: [
      "I'm a physician and the founder of BrainSAIT. I have practised medicine since 2010, including eight years in Riyadh's emergency, neurosurgery and intensive-care units — that is where I learned where healthcare workflows break: on-call nights, handovers, rejected claims.",
      "COVID-19 made it plain: clinicians stand on the front line, yet the technology is built around everyone else. BrainSAIT starts from the other side — a system built around the physician, not the physician around the system.",
      "Today I lead BrainSAIT Ltd from Riyadh, building AI-native healthcare infrastructure for Saudi Arabia and MENA: Arabic-native AI, interoperable data, trusted provider identity and accountable automation."
    ],
    impactStats: [
      { value: "2010", label: "In clinical practice since" },
      { value: "20", label: "Works on ORCID" },
      { value: "10", label: "DOIs in the BPR community on Zenodo" },
      { value: "293", label: "Public GitHub repositories" }
    ],
    timelineTitle: "Path",
    timeline: [
      { year: "2019 — now", title: "Founder & CEO", org: "BrainSAIT Ltd · Riyadh", line: "Healthcare AI products, NPHIES-oriented claims workflows, the LINC agents and BPR" },
      { year: "2021 — 2024", title: "Critical Care & ICU Physician", org: "Anfas Medical Care Hospital · Riyadh", line: "Critically ill patients; bedside documentation and handover turned into product requirements" },
      { year: "2018 — 2021", title: "Physician, Neurosurgery Service", org: "Aster Sanad Hospital · Riyadh", line: "Multidisciplinary neurosurgical care and coordination across teams" },
      { year: "2016 — 2018", title: "Emergency Medicine Physician", org: "Rafa Medical Center · Riyadh", line: "Acute care: rapid assessment and decisions under pressure" },
      { year: "MBBS", title: "Bachelor of Medicine & Surgery", org: "International University of Africa", line: "Arabic native · English fluent" }
    ],
    linksTitle: "Verify the work",
    links: [
      { label: "BPR profile", url: LINKS.bpr },
      { label: "ORCID", url: LINKS.orcid },
      { label: "Zenodo · BPR", url: LINKS.zenodo },
      { label: "Hugging Face", url: LINKS.hf },
      { label: "GitHub", url: LINKS.github },
      { label: "LinkedIn", url: LINKS.linkedin },
      { label: "X", url: LINKS.x },
      { label: "Blog", url: LINKS.blog }
    ],
    recognitionTitle: "Public milestones",
    recognition: [
      { label: "Listed among Saudi Arabia's most active public GitHub contributors", source: "gayanvoice", url: EVIDENCE.gayanvoice },
      { label: "Listed among Saudi Arabia's most active GitHub committers", source: "committers.top", url: EVIDENCE.committers },
      { label: "BRAINSAIT-LINC-FHIR in the Open Exchange applications digest, June 2026", source: "InterSystems", url: EVIDENCE.digest },
      { label: "Entered in the AI Agents for FHIR contest, 2026", source: "InterSystems", url: EVIDENCE.contest }
    ],

    researchKicker: "Research",
    researchTitle: "Writing and research",
    commonsTag: "Bilingual study · v1.2 · Zenodo",
    commonsTitle: "The Clinical Commons",
    commonsDesc:
      "An institutional design for hospitals in which multidisciplinary clinical teams steward care, an accountable board manages resources, and community representatives oversee mission and equity — starting with a limited, reversible pilot and expanding only after independent evaluation.",
    commonsStatus: "A proposal for discussion, not an established framework.",
    commonsRead: { en: "Read in English", ar: "اقرأ بالعربية", record: "DOI record" },
    publicationsTitle: "Peer-reviewed publications",
    publications: PUBLICATIONS,

    workKicker: "Work",
    workTitle: "Selected work",
    projects: [
      {
        name: "LINC FHIR",
        status: "Active",
        desc: "Bilingual healthcare agents and FHIR integration for the InterSystems ecosystem.",
        tech: TECH.lincFhir,
        link: `${GH}/brainsait-linc-fhir`
      },
      {
        name: "BrainSAIT RCM",
        status: "Active",
        desc: "Saudi claims, rejection management and revenue-cycle automation, with NPHIES integration.",
        tech: TECH.rcm,
        link: `${GH}/brainsait-rcm`
      },
      {
        name: "MasterLinc",
        status: "Active",
        desc: "Orchestration for imaging — RadioLinc, PACS and viewers — and the communication around it.",
        tech: TECH.masterlinc,
        link: `${GH}/masterlinc`
      },
      {
        name: "Healthcare MCP",
        status: "Active",
        desc: "Healthcare tool connectors for AI assistants: FHIR operations, access controls and audit.",
        tech: TECH.mcp,
        link: `${GH}/brainsait-mcp-dxt`
      },
      {
        name: "BrainSAIT Academy",
        status: "Active",
        desc: "Practical bilingual learning where healthcare, AI, business and software development meet.",
        tech: TECH.academy,
        link: "https://brainsait.de/academy/"
      }
    ],
    statuses: { Active: "Active", Maintained: "Maintained" },

    contactKicker: "Contact",
    contactTitle: "Building something with clinicians?",
    contactText: "I work with hospitals, health-tech teams and investors across Saudi Arabia, the Gulf and Africa. The quickest way in is a short call.",
    contactJoin: "Join BPR as a provider",
    footerText: "© 2026 Dr. Mohamed El Fadil · BrainSAIT",

    bookModalTitle: "Book a meeting",
    bookModalSubtitle: "Pick a time that suits you — confirmed instantly via Google Calendar.",
    bookModalClose: "Close",
    bookModalOpenExternal: "Open in a new tab ↗",

    workspaceCta: "Step into the BPR workspace",
    workspaceHint: "A 3D desk that reads the live BPR registry",
    workspaceExit: "Back to the site",
    workspaceBack: "Back to the desk",
    workspaceStandard: "Close",
    workspaceDock: { about: "About", projects: "Work", collaborate: "Book a call" }
  },
  ar: {
    brand: "د. الفاضل",
    langToggle: "EN",
    nav: { bpr: "BPR", why: "لماذا", founder: "المؤسس", research: "الأبحاث", work: "الأعمال", contact: "تواصل" },
    leveragePoint: "نقطة الرفع",

    heroKicker: "طبيب · مؤسس برينسايت",
    heroName: "د. محمد الفاضل",
    heroTitle: "أبني BPR — هوية قابلة للتحقق لكل ممارس صحي.",
    heroLead:
      "يمنح سجل برينسايت لمقدمي الخدمة كل طبيب هوية واحدة موقّعة ينقلها معه، ويربط بها السجلات والأبحاث والأدوات التي ينبغي أن تتبعه. بُني من جوار سرير المريض، ويعمل اليوم.",
    heroLocation: "الرياض، المملكة العربية السعودية",
    heroCtaMeet: "احجز اجتماعًا",
    heroProofPending: "جارٍ التحقق من شهادتي في BPR داخل متصفحك…",
    heroProofOk: "تحقق متصفحك للتو من شهادتي في BPR",
    heroProofFail: "الفحص المباشر غير متاح حاليًا",

    whyKicker: "لماذا BPR",
    whyTitle: "لا ينبغي أن يكون الطبيب حلقة الوصل بين الأنظمة.",
    whyBeats: [
      {
        label: "المشكلة",
        text: "يتنقّل الطبيب بين عشرات الأنظمة المصمَّمة للفوترة لا للرعاية. تُرفض المطالبات، وتُكتشف الثغرات متأخرة، ويبقى الطبيب هو الجسر البشري بينها."
      },
      {
        label: "الفكرة",
        text: "البداية من الهوية: سجل موقّع يثبت من هو الممارس وما الذي اعتُمد له، فتثق به الأنظمة بدل أن تطلب الإثبات من جديد."
      },
      {
        label: "لماذا الآن",
        text: "معايير FHIR R4 والشهادات القابلة للتحقق من W3C ناضجة، ومنصة نفيس جعلت التشغيل البيني في قلب الرعاية الصحية السعودية، والذكاء الاصطناعي قادر أخيرًا على تولّي الأعمال الورقية."
      }
    ],

    registryJoin: "انضم إلى السجل",
    registryVerify: "تحقق من مقدم خدمة",

    founderKicker: "المؤسس",
    founderTitle: "بُني من جوار سرير المريض",
    founderBio: [
      "أنا طبيب ومؤسس برينسايت. أمارس الطب منذ 2010، منها ثماني سنوات في أقسام الطوارئ وجراحة الأعصاب والعناية المركزة في الرياض — وهناك عرفت أين تتعطّل مسارات الرعاية: المناوبات الليلية، وتسليم المرضى، والمطالبات المرفوضة.",
      "كشفت جائحة كوفيد-19 الحقيقة بوضوح: الطبيب في الصف الأول، لكن التقنية مبنية حول الجميع إلا هو. تبدأ برينسايت من الجهة الأخرى — نظام يعمل حول الطبيب، لا طبيب يعمل حول النظام.",
      "أقود برينسايت اليوم من الرياض، وأبني بنية تحتية صحية أصيلة في الذكاء الاصطناعي للسعودية والشرق الأوسط وشمال أفريقيا: ذكاء اصطناعي يفهم العربية، وبيانات مترابطة، وهوية موثوقة لمقدمي الرعاية، وأتمتة قابلة للمساءلة."
    ],
    impactStats: [
      { value: "2010", label: "في الممارسة السريرية منذ" },
      { value: "20", label: "عملًا في سجل ORCID" },
      { value: "10", label: "معرّف DOI في مجتمع BPR على Zenodo" },
      { value: "293", label: "مستودعًا عامًا على GitHub" }
    ],
    timelineTitle: "المسار",
    timeline: [
      { year: "2019 — الآن", title: "المؤسس والرئيس التنفيذي", org: "برينسايت المحدودة · الرياض", line: "منتجات ذكاء اصطناعي صحي، ومسارات مطالبات موجّهة لنفيس، ووكلاء LINC، وسجل BPR" },
      { year: "2021 — 2024", title: "طبيب عناية حرجة ومركزة", org: "مستشفى أنفاس للرعاية الطبية · الرياض", line: "رعاية الحالات الحرجة؛ وتحويل احتياجات التوثيق والتسليم إلى متطلبات منتج" },
      { year: "2018 — 2021", title: "طبيب، خدمة جراحة الأعصاب", org: "مستشفى أستر سند · الرياض", line: "رعاية جراحية عصبية متعددة التخصصات وتنسيق بين الفرق" },
      { year: "2016 — 2018", title: "طبيب طب طوارئ", org: "مركز رفاء الطبي · الرياض", line: "رعاية الحالات الحادة: تقييم سريع وقرارات تحت الضغط" },
      { year: "MBBS", title: "بكالوريوس الطب والجراحة", org: "جامعة أفريقيا العالمية", line: "العربية لغة أم · الإنجليزية بطلاقة" }
    ],
    linksTitle: "تحقق من الأعمال",
    links: [
      { label: "ملف BPR", url: LINKS.bpr },
      { label: "ORCID", url: LINKS.orcid },
      { label: "Zenodo · BPR", url: LINKS.zenodo },
      { label: "Hugging Face", url: LINKS.hf },
      { label: "GitHub", url: LINKS.github },
      { label: "LinkedIn", url: LINKS.linkedin },
      { label: "X", url: LINKS.x },
      { label: "المدونة", url: LINKS.blog }
    ],
    recognitionTitle: "محطات علنية",
    recognition: [
      { label: "ضمن أكثر المساهمين نشاطًا على GitHub في السعودية", source: "gayanvoice", url: EVIDENCE.gayanvoice },
      { label: "ضمن أكثر المطورين التزامًا للشيفرة على GitHub في السعودية", source: "committers.top", url: EVIDENCE.committers },
      { label: "BRAINSAIT-LINC-FHIR في ملخص تطبيقات Open Exchange، يونيو 2026", source: "InterSystems", url: EVIDENCE.digest },
      { label: "مشارك في مسابقة وكلاء الذكاء الاصطناعي لـ FHIR، 2026", source: "InterSystems", url: EVIDENCE.contest }
    ],

    researchKicker: "الأبحاث",
    researchTitle: "كتابات وأبحاث",
    commonsTag: "دراسة ثنائية اللغة · الإصدار 1.2 · Zenodo",
    commonsTitle: "المشاع السريري",
    commonsDesc:
      "تصميم مؤسسي للمستشفيات تتولى فيه الفرق السريرية متعددة التخصصات رعاية المرضى، ويدير مجلس خاضع للمساءلة الموارد، ويشرف ممثلو المجتمع على الرسالة والعدالة — بدءًا بتجربة محدودة قابلة للتراجع، والتوسع فقط بعد تقييم مستقل.",
    commonsStatus: "مقترح للنقاش، وليس إطارًا معتمدًا.",
    commonsRead: { en: "Read in English", ar: "اقرأ بالعربية", record: "سجل DOI" },
    publicationsTitle: "أبحاث محكّمة",
    publications: PUBLICATIONS,

    workKicker: "الأعمال",
    workTitle: "أعمال مختارة",
    projects: [
      {
        name: "LINC FHIR",
        status: "Active",
        desc: "وكلاء صحيون ثنائيو اللغة وتكامل FHIR ضمن منظومة InterSystems.",
        tech: TECH.lincFhir,
        link: `${GH}/brainsait-linc-fhir`
      },
      {
        name: "BrainSAIT RCM",
        status: "Active",
        desc: "مطالبات سعودية وإدارة الرفض وأتمتة دورة الإيرادات، مع تكامل نفيس.",
        tech: TECH.rcm,
        link: `${GH}/brainsait-rcm`
      },
      {
        name: "MasterLinc",
        status: "Active",
        desc: "تنسيق خدمات التصوير الطبي — RadioLinc وأنظمة PACS والعارضات — والتواصل المرتبط بها.",
        tech: TECH.masterlinc,
        link: `${GH}/masterlinc`
      },
      {
        name: "Healthcare MCP",
        status: "Active",
        desc: "موصلات أدوات صحية للمساعدين الذكيين: عمليات FHIR وضوابط الوصول والتدقيق.",
        tech: TECH.mcp,
        link: `${GH}/brainsait-mcp-dxt`
      },
      {
        name: "أكاديمية برينسايت",
        status: "Active",
        desc: "تعلّم عملي ثنائي اللغة حيث تلتقي الرعاية الصحية والذكاء الاصطناعي والأعمال وتطوير البرمجيات.",
        tech: TECH.academy,
        link: "https://brainsait.de/academy/"
      }
    ],
    statuses: { Active: "نشط", Maintained: "مُصان" },

    contactKicker: "تواصل",
    contactTitle: "تبني شيئًا مع الممارسين الصحيين؟",
    contactText: "أعمل مع المستشفيات وفرق التقنية الصحية والمستثمرين في السعودية والخليج وأفريقيا. أسرع طريق للبدء مكالمة قصيرة.",
    contactJoin: "انضم إلى BPR كمقدم خدمة",
    footerText: "© 2026 د. محمد الفاضل · برينسايت",

    bookModalTitle: "احجز اجتماعًا",
    bookModalSubtitle: "اختر الوقت الأنسب لك — يُؤكَّد فورًا عبر تقويم Google.",
    bookModalClose: "إغلاق",
    bookModalOpenExternal: "فتح في نافذة جديدة ↗",

    workspaceCta: "ادخل مساحة عمل BPR",
    workspaceHint: "مكتب ثلاثي الأبعاد يقرأ سجل BPR مباشرة",
    workspaceExit: "العودة إلى الموقع",
    workspaceBack: "العودة إلى المكتب",
    workspaceStandard: "إغلاق",
    workspaceDock: { about: "عنّي", projects: "الأعمال", collaborate: "احجز مكالمة" }
  }
};
