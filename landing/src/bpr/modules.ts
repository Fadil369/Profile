import type { Lang } from "../content";
import { REGISTRY, SPID } from "./live";

// The BPR feature map shown on the site and in the 3D workspace. Every line here describes
// something that runs today on registry.brainsait.de — keep it that way.

export type BprAppId = "verify" | "ledger" | "identity" | "join" | "research" | "toolkit" | "emr" | "fhir";
export type BprIcon = "key" | "link" | "fingerprint" | "users" | "flask" | "calculator" | "server" | "layers";

export interface BprModule {
  id: BprAppId;
  icon: BprIcon;
  /** hex accent used for the module's chip in 3D and its card edge */
  color: string;
  live: boolean;
  title: string;
  tag: string;
  desc: string;
  facts: string[];
  links: { label: string; url: string }[];
}

const COLORS: Record<BprAppId, string> = {
  verify: "#a89bf5",
  ledger: "#7dd3c0",
  identity: "#f5c97a",
  join: "#f59ab5",
  research: "#8fc1ff",
  toolkit: "#b7e27d",
  emr: "#ff9f6e",
  fhir: "#c9a6ff"
};

const MODULES: Record<Lang, Omit<BprModule, "color">[]> = {
  en: [
    {
      id: "verify",
      icon: "key",
      live: true,
      title: "Signed credentials",
      tag: "W3C VC 2.0 · Ed25519",
      desc: "A W3C credential signed by the registry — anyone can check it on their own device, with no account and no upload.",
      facts: ["Issuer did:web:registry.brainsait.de", "VC-JOSE (vc+jwt, EdDSA)", "Public facts only — never licence numbers", "Live status: current / superseded / revoked"],
      links: [
        { label: "Open the verifier", url: `${REGISTRY}/verify` },
        { label: "Download my credential", url: `${REGISTRY}/vc/${SPID}.jwt` }
      ]
    },
    {
      id: "ledger",
      icon: "link",
      live: true,
      title: "Transparency log",
      tag: "Append-only · signed head",
      desc: "Every issue, renewal and revocation is a line in a public, signed hash chain that browsers can replay.",
      facts: ["hash = sha256(line)", "line.prev = previous hash", "Genesis = 64 zeros", "Signed head: BPR-TLOG-v1"],
      links: [
        { label: "Replay the log", url: `${REGISTRY}/transparency` },
        { label: "log.json", url: `${REGISTRY}/transparency/log.json` }
      ]
    },
    {
      id: "identity",
      icon: "fingerprint",
      live: true,
      title: "Provider identity",
      tag: "SPID · OID 1.3.6.1.4.1.61026",
      desc: "One permanent provider ID, linked to ORCID, a public profile, a member card and the verified directory.",
      facts: ["SPID format SA-PHY-000003", "ORCID-linked sign-in", "Public profile + QR member card", "Searchable verified directory"],
      links: [
        { label: "My public profile", url: `${REGISTRY}/p/${SPID}` },
        { label: "Member card", url: `${REGISTRY}/card.php?spid=${SPID}` },
        { label: "Directory", url: `${REGISTRY}/directory.php` }
      ]
    },
    {
      id: "join",
      icon: "users",
      live: false,
      title: "Onboarding",
      tag: "One question per slide",
      desc: "A bilingual wizard asks one thing at a time; uploaded documents are reviewed into verified qualifications.",
      facts: ["Arabic-first, English alongside", "Document upload + reviewer queue", "11-step provider journey, application → renewal", "Membership & invoicing built in"],
      links: [{ label: "Join the registry", url: `${REGISTRY}/join.php` }]
    },
    {
      id: "research",
      icon: "flask",
      live: true,
      title: "Research footprint",
      tag: "ORCID × Zenodo × Hugging Face",
      desc: "Works matched by DOI across ORCID, Zenodo and Hugging Face into one verifiable research record.",
      facts: ["DOI-matched across 3 sources", "Views, downloads and community badges", "Zenodo community: bpr-doctors", "Refreshed automatically"],
      links: [
        { label: "My research page", url: `${REGISTRY}/research/${SPID}` },
        { label: "BPR on Zenodo", url: "https://zenodo.org/communities/bpr-doctors/" }
      ]
    },
    {
      id: "toolkit",
      icon: "calculator",
      live: false,
      title: "Specialty toolkit",
      tag: "13 kits · 72 tools",
      desc: "Checklists, pre-filled templates and 15 clinical calculators, matched to the provider's specialty.",
      facts: ["13 specialty kits", "15 calculators (eGFR, CHA₂DS₂-VASc, NEWS2, SOFA…)", "A4 print with live QR verification", "Reference aids — checked against local protocol"],
      links: [{ label: "Open the toolkit (members)", url: `${REGISTRY}/tools.php` }]
    },
    {
      id: "emr",
      icon: "server",
      live: false,
      title: "Personal EMR",
      tag: "One OpenEMR per provider",
      desc: "An isolated OpenEMR instance for each provider, on its own subdomain with its own database and TLS.",
      facts: ["{spid}.emr.brainsait.de", "OpenEMR 7 + MariaDB per provider", "Wildcard TLS, encrypted offsite backups", "Provisioned from the registry"],
      links: [{ label: "EMR portal", url: "https://emr.brainsait.de/" }]
    },
    {
      id: "fhir",
      icon: "layers",
      live: true,
      title: "FHIR R4 API",
      tag: "Interoperability",
      desc: "Providers published as FHIR R4 resources, so NPHIES-era systems can read them instead of re-keying.",
      facts: ["Practitioner · PractitionerRole · Organization", "read, search, vread", "Public JSON API + webhooks", "Linked from every credential"],
      links: [
        { label: "CapabilityStatement", url: `${REGISTRY}/fhir/metadata` },
        { label: "My Practitioner record", url: `${REGISTRY}/fhir/Practitioner/${SPID}` }
      ]
    }
  ],
  ar: [
    {
      id: "verify",
      icon: "key",
      live: true,
      title: "شهادات موقّعة",
      tag: "W3C VC 2.0 · Ed25519",
      desc: "شهادة W3C يوقّعها السجل — يتحقق منها أي شخص على جهازه دون حساب ودون رفع أي شيء.",
      facts: ["المُصدر did:web:registry.brainsait.de", "VC-JOSE (vc+jwt, EdDSA)", "بيانات عامة فقط — لا أرقام تراخيص", "حالة مباشرة: سارية / مستبدلة / ملغاة"],
      links: [
        { label: "افتح أداة التحقق", url: `${REGISTRY}/verify` },
        { label: "نزّل شهادتي", url: `${REGISTRY}/vc/${SPID}.jwt` }
      ]
    },
    {
      id: "ledger",
      icon: "link",
      live: true,
      title: "سجل الشفافية",
      tag: "إلحاق فقط · رأس موقّع",
      desc: "كل إصدار وتجديد وإلغاء سطرٌ في سلسلة تجزئة عامة موقّعة يستطيع المتصفح إعادة تشغيلها.",
      facts: ["hash = sha256(line)", "line.prev = التجزئة السابقة", "البداية = 64 صفرًا", "رأس موقّع: BPR-TLOG-v1"],
      links: [
        { label: "أعد تشغيل السجل", url: `${REGISTRY}/transparency` },
        { label: "log.json", url: `${REGISTRY}/transparency/log.json` }
      ]
    },
    {
      id: "identity",
      icon: "fingerprint",
      live: true,
      title: "هوية مقدم الخدمة",
      tag: "SPID · OID 1.3.6.1.4.1.61026",
      desc: "معرّف دائم واحد لمقدم الخدمة، مرتبط بـ ORCID وملف عام وبطاقة عضوية والدليل المعتمد.",
      facts: ["صيغة المعرّف SA-PHY-000003", "دخول مرتبط بـ ORCID", "ملف عام + بطاقة عضوية برمز QR", "دليل معتمد قابل للبحث"],
      links: [
        { label: "ملفي العام", url: `${REGISTRY}/p/${SPID}` },
        { label: "بطاقة العضوية", url: `${REGISTRY}/card.php?spid=${SPID}` },
        { label: "الدليل", url: `${REGISTRY}/directory.php` }
      ]
    },
    {
      id: "join",
      icon: "users",
      live: false,
      title: "الانضمام",
      tag: "سؤال واحد في كل شريحة",
      desc: "معالج ثنائي اللغة يسأل سؤالًا واحدًا في كل مرة، وتُراجَع الوثائق المرفوعة لتصبح مؤهلات موثّقة.",
      facts: ["العربية أولًا والإنجليزية معها", "رفع الوثائق + قائمة مراجعة", "رحلة من 11 خطوة من الطلب حتى التجديد", "العضوية والفوترة مدمجتان"],
      links: [{ label: "انضم إلى السجل", url: `${REGISTRY}/join.php` }]
    },
    {
      id: "research",
      icon: "flask",
      live: true,
      title: "الأثر البحثي",
      tag: "ORCID × Zenodo × Hugging Face",
      desc: "أعمال مطابَقة بمعرّف DOI عبر ORCID وZenodo وHugging Face في سجل بحثي واحد قابل للتحقق.",
      facts: ["مطابقة DOI عبر 3 مصادر", "مشاهدات وتنزيلات وشارات المجتمع", "مجتمع Zenodo: bpr-doctors", "تحديث تلقائي"],
      links: [
        { label: "صفحة أبحاثي", url: `${REGISTRY}/research/${SPID}` },
        { label: "BPR على Zenodo", url: "https://zenodo.org/communities/bpr-doctors/" }
      ]
    },
    {
      id: "toolkit",
      icon: "calculator",
      live: false,
      title: "عدّة التخصص",
      tag: "13 عدّة · 72 أداة",
      desc: "قوائم تحقق ونماذج مملوءة مسبقًا و15 حاسبة سريرية، بحسب تخصص مقدم الخدمة.",
      facts: ["13 عدّة تخصصية", "15 حاسبة (eGFR وCHA₂DS₂-VASc وNEWS2 وSOFA…)", "طباعة A4 برمز تحقق مباشر", "أدوات مرجعية — تُراجع وفق البروتوكول المحلي"],
      links: [{ label: "افتح العدّة (للأعضاء)", url: `${REGISTRY}/tools.php` }]
    },
    {
      id: "emr",
      icon: "server",
      live: false,
      title: "سجل طبي خاص",
      tag: "OpenEMR لكل مقدم خدمة",
      desc: "نسخة OpenEMR معزولة لكل مقدم خدمة، على نطاق فرعي خاص بقاعدة بيانات وشهادة TLS مستقلتين.",
      facts: ["{spid}.emr.brainsait.de", "OpenEMR 7 + MariaDB لكل مقدم خدمة", "TLS شاملة ونسخ احتياطي مشفّر خارجي", "تُجهّز من السجل"],
      links: [{ label: "بوابة السجل الطبي", url: "https://emr.brainsait.de/" }]
    },
    {
      id: "fhir",
      icon: "layers",
      live: true,
      title: "واجهة FHIR R4",
      tag: "قابلية التشغيل البيني",
      desc: "يُنشر مقدمو الخدمة موارد FHIR R4 لتقرأها أنظمة عصر نفيس بدل إعادة الإدخال.",
      facts: ["Practitioner · PractitionerRole · Organization", "read وsearch وvread", "واجهة JSON عامة + Webhooks", "مرتبطة من كل شهادة"],
      links: [
        { label: "CapabilityStatement", url: `${REGISTRY}/fhir/metadata` },
        { label: "سجلي Practitioner", url: `${REGISTRY}/fhir/Practitioner/${SPID}` }
      ]
    }
  ]
};

export function bprModules(lang: Lang): BprModule[] {
  return MODULES[lang].map((m) => ({ ...m, color: COLORS[m.id] }));
}

export const BPR_TEXT = {
  en: {
    showcaseKicker: "Inside BPR",
    showcaseTitle: "Eight systems around one provider identity",
    showcaseSub:
      "The BrainSAIT Provider Registry runs today. Everything marked live reads registry.brainsait.de as you scroll, and the signature is checked by your own browser. A registry record complements professional licensure — it does not replace it.",
    liveBadge: "live",
    openIn3d: "Open in the 3D workspace",
    enter3d: "Enter the BPR workspace",
    workspaceTitle: "BPR OS",
    launcherHint: "Pick a system — every window reads the live registry.",
    console: {
      title: "brainsait verify",
      fetching: "fetching credential from registry.brainsait.de…",
      sig: "Ed25519 signature",
      sigDevice: "checked on this device",
      sigServer: "checked by the registry server",
      status: "live status",
      chain: "transparency chain",
      head: "signed log head",
      level: "verification level",
      membership: "membership",
      providers: "providers in registry"
    },
    states: { ok: "valid", fail: "failed", pending: "checking…", unavailable: "unavailable" } as Record<string, string>,
    levels: { not_assessed: "not yet assessed", basic: "basic", verified: "verified" } as Record<string, string>,
    verify: {
      lead: "This is my real BPR credential, fetched now and verified in your browser against the registry's public key.",
      claims: "Signed claims",
      tamper: "Try to forge it",
      tamperHint: "Change the name and keep the original signature — what a forger would hand you.",
      forgedName: "Dr. Somebody Else",
      forged: "Forged copy",
      restore: "Back to the original",
      raw: "Raw credential (JWT)"
    },
    ledger: {
      lead: "Replayed in your browser: every line is re-hashed and linked to the one before, then the signed head is checked.",
      entries: "log lines",
      genesis: "genesis",
      replay: "Replay again"
    },
    research: { lead: "Read live from the registry's research API — newest first.", works: "works", dois: "DOIs", community: "in BPR community", downloads: "downloads" },
    toolkit: {
      lead: "The same CKD-EPI 2021 equation the members' cockpit uses, computed in your browser. Type creatinine in mg/dL or µmol/L. A reference aid, not a substitute for clinical judgement.",
      calc: "eGFR — CKD-EPI 2021 (race-free)",
      age: "Age (years)",
      scr: "Serum creatinine (mg/dL or µmol/L)",
      sex: "Sex",
      female: "Female",
      male: "Male",
      result: "eGFR",
      unit: "mL/min/1.73 m²",
      stage: "CKD stage"
    },
    fhir: { lead: "The registry's live CapabilityStatement — what other systems can read today.", version: "FHIR version" },
    backToScene: "Back to the scene",
    about: "About",
    projects: "Projects",
    collaborate: "Collaborate",
    home: "BPR home",
    hint3d: "Click the monitor, the credential or a module — or press 1–8",
    lamp: "Desk lamp — switch light / dark"
  },
  ar: {
    showcaseKicker: "داخل BPR",
    showcaseTitle: "ثمانية أنظمة حول هوية واحدة لمقدم الخدمة",
    showcaseSub:
      "سجل برينسايت لمقدمي الخدمة يعمل اليوم. كل ما يحمل علامة «مباشر» يُقرأ من registry.brainsait.de أثناء تصفحك، ومتصفحك أنت من يتحقق من التوقيع. سجل BPR مكمّل للترخيص المهني ولا يحل محله.",
    liveBadge: "مباشر",
    openIn3d: "افتحه في مساحة العمل ثلاثية الأبعاد",
    enter3d: "ادخل مساحة عمل BPR",
    workspaceTitle: "BPR OS",
    launcherHint: "اختر نظامًا — كل نافذة تقرأ السجل مباشرة.",
    console: {
      title: "brainsait verify",
      fetching: "جلب الشهادة من registry.brainsait.de…",
      sig: "توقيع Ed25519",
      sigDevice: "تم التحقق على هذا الجهاز",
      sigServer: "تحقق خادم السجل",
      status: "الحالة المباشرة",
      chain: "سلسلة الشفافية",
      head: "رأس السجل الموقّع",
      level: "مستوى التحقق",
      membership: "العضوية",
      providers: "مقدمو خدمة في السجل"
    },
    states: { ok: "صحيح", fail: "فشل", pending: "جارٍ التحقق…", unavailable: "غير متاح" } as Record<string, string>,
    levels: { not_assessed: "لم يُقيَّم بعد", basic: "أساسي", verified: "موثّق" } as Record<string, string>,
    verify: {
      lead: "هذه شهادتي الحقيقية في BPR، جُلبت الآن وتحقق منها متصفحك بمفتاح السجل العام.",
      claims: "البيانات الموقّعة",
      tamper: "جرّب تزويرها",
      tamperHint: "غيّر الاسم واحتفظ بالتوقيع الأصلي — ما قد يقدمه لك المزوِّر.",
      forgedName: "د. شخص آخر",
      forged: "نسخة مزوّرة",
      restore: "العودة إلى الأصل",
      raw: "الشهادة الخام (JWT)"
    },
    ledger: {
      lead: "يُعاد تشغيله في متصفحك: يُعاد حساب تجزئة كل سطر وربطه بما قبله، ثم يُتحقق من الرأس الموقّع.",
      entries: "أسطر السجل",
      genesis: "البداية",
      replay: "أعد التشغيل"
    },
    research: { lead: "تُقرأ مباشرة من واجهة الأبحاث في السجل — الأحدث أولًا.", works: "عمل", dois: "معرّف DOI", community: "في مجتمع BPR", downloads: "تنزيل" },
    toolkit: {
      lead: "معادلة CKD-EPI 2021 نفسها المستخدمة في قمرة الأعضاء، تُحسب في متصفحك. أدخل الكرياتينين بوحدة mg/dL أو µmol/L. أداة مرجعية لا تغني عن التقدير السريري.",
      calc: "eGFR — CKD-EPI 2021 (دون معامل العرق)",
      age: "العمر (سنة)",
      scr: "كرياتينين المصل (mg/dL أو µmol/L)",
      sex: "الجنس",
      female: "أنثى",
      male: "ذكر",
      result: "eGFR",
      unit: "mL/min/1.73 m²",
      stage: "مرحلة CKD"
    },
    fhir: { lead: "CapabilityStatement المباشر للسجل — ما تستطيع الأنظمة الأخرى قراءته اليوم.", version: "إصدار FHIR" },
    backToScene: "العودة إلى المشهد",
    about: "عنّي",
    projects: "مشاريعي",
    collaborate: "لنتعاون",
    home: "واجهة BPR",
    hint3d: "انقر الشاشة أو الشهادة أو أي وحدة — أو اضغط 1–8",
    lamp: "مصباح المكتب — بدّل المظهر الفاتح / الداكن"
  }
};

export type BprText = (typeof BPR_TEXT)["en"];
