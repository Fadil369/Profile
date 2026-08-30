export type Lang = "ar" | "en";
export type ThemeName = "dark" | "light";

export interface StatItem {
  value: string;
  label: string;
}

export interface ExperienceItem {
  year: string;
  title: string;
  org: string;
  desc: string[];
}

export interface SkillItem {
  name: string;
  level: "Expert" | "Advanced" | "Intermediate" | "Native" | "Fluent";
}

export interface SkillCategory {
  name: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  name: string;
  status: "Active" | "Maintained" | "Enterprise";
  year: string;
  desc: string;
  tech: string[];
  link: string;
}

export interface EcosystemItem {
  name: string;
  urlLabel: string;
  url: string;
  badge?: string;
  featured?: boolean;
}

export interface LangContent {
  brand: string;
  langToggle: string;
  heroKicker: string;
  heroName: string;
  heroTitle: string;
  heroLocation: string;
  heroCtaMeet: string;
  heroCtaCv: string;
  bookModalTitle: string;
  bookModalSubtitle: string;
  bookModalClose: string;
  bookModalOpenExternal: string;
  aboutKicker: string;
  aboutP1: string;
  aboutP2: string;
  expKicker: string;
  expTitle: string;
  skillsKicker: string;
  skillsTitle: string;
  projectsKicker: string;
  projectsTitle: string;
  ecosystemKicker: string;
  ecosystemTitle: string;
  contactKicker: string;
  contactTitle: string;
  contactText: string;
  footerText: string;
  nav: {
    about: string;
    experience: string;
    skills: string;
    projects: string;
    ecosystem: string;
    contact: string;
  };
  levels: Record<SkillItem["level"], string>;
  statuses: Record<ProjectItem["status"], string>;
  stats: StatItem[];
  experience: ExperienceItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  ecosystem: EcosystemItem[];
}

export const MEET_URL = "https://meet.google.com/wcb-ovvp-jzp";
export const CV_URL = "/cv/";
export const BOOKING_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0edxToXuq6bDCBKRZ8_EOcx-Qp6M_bgUVjGQKEeNE2sxMLRxCNlsjk2flHMwMU2hvJyhFy_8Og?gv=true";

export const CONTENT: Record<Lang, LangContent> = {
  ar: {
    brand: "د. الفاضل",
    langToggle: "EN",
    heroKicker: "طبيب · مؤسس · مبتكر ذكاء اصطناعي صحي",
    heroName: "د. محمد الفاضل",
    heroTitle: "طبيب وريادي أعمال ومبتكر في الذكاء الاصطناعي الصحي",
    heroLocation: "الرياض، السعودية  ·  الخرطوم، السودان",
    heroCtaMeet: "احجز اجتماعاً",
    heroCtaCv: "السيرة الذاتية",
    bookModalTitle: "احجز موعداً",
    bookModalSubtitle: "اختر الوقت الأنسب لك — تأكيد فوري عبر جوجل كالندر.",
    bookModalClose: "إغلاق",
    bookModalOpenExternal: "فتح في نافذة جديدة ↗",
    aboutKicker: "نبذة عني",
    aboutP1:
      "أجمع بين الطب السريري والذكاء الاصطناعي — أبني أنظمة تجعل الرعاية الصحية أذكى وأسرع وأكثر إنسانية عبر الشرق الأوسط وأفريقيا.",
    aboutP2:
      "أكثر من 10 سنوات في غرف العمليات وعنابر العناية المركزة وأقسام الطوارئ منحتني فهماً حقيقياً لما تحتاجه الرعاية الصحية فعلاً. اليوم، بصفتي المؤسس والرئيس التنفيذي لـ BrainSAIT، أحوّل هذه الرؤية إلى منتجات ذكاء اصطناعي مُنشرة في مستشفيات من الرياض إلى الخرطوم.",
    expKicker: "المسار المهني",
    expTitle: "الخبرة والتعليم",
    skillsKicker: "الخبرات التقنية",
    skillsTitle: "المهارات",
    projectsKicker: "الأعمال",
    projectsTitle: "مشاريع مختارة",
    ecosystemKicker: "المنظومة",
    ecosystemTitle: "أين تجدني",
    contactKicker: "لنتحدث",
    contactTitle: "هل لديك مشروع رعاية صحية بالذكاء الاصطناعي؟",
    contactText:
      "أرحب بالتعاون مع المستشفيات والمطورين والمستثمرين المهتمين بتقنية الرعاية الصحية عبر الشرق الأوسط وأفريقيا.",
    footerText: "© 2026 د. محمد الفاضل — مؤسس BrainSAIT",
    nav: {
      about: "نبذة",
      experience: "الخبرة",
      skills: "المهارات",
      projects: "المشاريع",
      ecosystem: "المنظومة",
      contact: "تواصل"
    },
    levels: {
      Expert: "خبير",
      Advanced: "متقدم",
      Intermediate: "متوسط",
      Native: "لغة أم",
      Fluent: "بارع"
    },
    statuses: {
      Active: "نشط",
      Maintained: "مُحدَّث",
      Enterprise: "مؤسسي"
    },
    stats: [
      { value: "+10", label: "سنوات سريرية وتقنية" },
      { value: "+50k", label: "تنزيل مفتوح المصدر" },
      { value: "3", label: "قارات وصل إليها الأثر" }
    ],
    experience: [
      {
        year: "2023 — الآن",
        title: "المؤسس والرئيس التنفيذي",
        org: "BrainSAIT",
        desc: [
          "قيادة تطوير منصة ذكاء اصطناعي صحية لدعم القرار السريري",
          "بناء وكلاء ذكاء اصطناعي ثنائيي اللغة على مستوى المؤسسات للعمليات الصحية",
          "نشر الحلول في أنظمة الرعاية الصحية بالسودان والسعودية"
        ]
      },
      {
        year: "2021 — 2023",
        title: "مطوّر ذكاء اصطناعي صحي",
        org: "مستشار مستقل",
        desc: [
          "تطوير حزم بايثون للذكاء الاصطناعي الصحي (PyHeart، PyBrain)",
          "نشر أطر عمل طبية مفتوحة المصدر على PyPI",
          "استشارات في تحسين سير العمل السريري وتكامل الذكاء الاصطناعي"
        ]
      },
      {
        year: "2021 — 2022",
        title: "طبيب سريري",
        org: "منشآت صحية، السودان",
        desc: [
          "تقديم رعاية للمرضى مع تحديد أوجه القصور في سير العمل",
          "تصميم حلول رقمية للتوثيق السريري",
          "التعاون مع فرق تقنية المعلومات في مشاريع تكامل السجلات الصحية"
        ]
      },
      {
        year: "2015 — 2021",
        title: "دكتور في الطب (MD)",
        org: "كلية الطب",
        desc: [
          "طب سريري بتركيز على تكامل تقنية الرعاية الصحية",
          "بحث في المعلوماتية الطبية وتطبيقات الذكاء الاصطناعي"
        ]
      },
      {
        year: "2021 — 2024",
        title: "تخصص في الذكاء الاصطناعي الصحي",
        org: "تعلم ذاتي وتطوير مهني",
        desc: [
          "تدريب متقدم في الذكاء الاصطناعي السريري وتعلّم الآلة",
          "شهادة في معايير التشغيل البيني FHIR/HL7"
        ]
      }
    ],
    skillCategories: [
      {
        name: "الذكاء الاصطناعي الصحي",
        skills: [
          { name: "Clinical Decision Support", level: "Expert" },
          { name: "Medical Coding", level: "Expert" },
          { name: "HL7 FHIR R4", level: "Expert" },
          { name: "Ambient AI Documentation", level: "Advanced" }
        ]
      },
      {
        name: "الذكاء الاصطناعي والتعلم الآلي",
        skills: [
          { name: "LLMs", level: "Expert" },
          { name: "RAG", level: "Expert" },
          { name: "Fine-tuning", level: "Advanced" },
          { name: "PyTorch", level: "Advanced" }
        ]
      },
      {
        name: "البرمجة والتطوير",
        skills: [
          { name: "Python", level: "Expert" },
          { name: "FastAPI", level: "Expert" },
          { name: "React / Node.js", level: "Advanced" },
          { name: "Docker / K8s", level: "Advanced" }
        ]
      },
      {
        name: "الامتثال الصحي",
        skills: [
          { name: "HIPAA", level: "Expert" },
          { name: "NPHIES", level: "Expert" },
          { name: "PDPL", level: "Advanced" },
          { name: "SaMD", level: "Advanced" }
        ]
      },
      {
        name: "البيانات",
        skills: [
          { name: "Vector DBs", level: "Advanced" },
          { name: "PostgreSQL", level: "Advanced" },
          { name: "MongoDB", level: "Advanced" }
        ]
      },
      {
        name: "اللغات",
        skills: [
          { name: "العربية", level: "Native" },
          { name: "English", level: "Fluent" },
          { name: "Medical Terminology", level: "Expert" }
        ]
      }
    ],
    projects: [
      {
        name: "BrainSAIT Healthcare AI Platform",
        status: "Active",
        year: "2023–2024",
        desc: "منصة ذكاء اصطناعي شاملة لدعم القرار السريري، والتحقق التلقائي من مطالبات NPHIES، وتكامل كامل مع HL7 FHIR R4.",
        tech: ["Python", "OpenAI GPT", "FHIR R4"],
        link: "https://github.com/Fadil369/brainsait-healthcare-ai"
      },
      {
        name: "BrainSAIT LINC Agent",
        status: "Active",
        year: "2024",
        desc: "وكيل ذكاء اصطناعي ثنائي اللغة على مستوى المؤسسات للعمليات الصحية — ترميز طبي، معالجة مطالبات، وفرز مرضى.",
        tech: ["Qwen3-8B", "Arabic NLP"],
        link: "https://github.com/Fadil369/brainsait-linc-docs"
      },
      {
        name: "Neural Cloud Portal",
        status: "Active",
        year: "2024",
        desc: "بوابة عيادات ثنائية اللغة وصوتية بالزمن الحقيقي، متكاملة مع الذكاء الاصطناعي الخلفي وسير العمل السريري.",
        tech: ["React", "WebRTC"],
        link: "https://elfadil.com/"
      },
      {
        name: "AFHAM AI Studio & BrainSAIT Suite",
        status: "Active",
        year: "2024",
        desc: "حزمة أدوات ذكاء اصطناعي شاملة لمقدمي الرعاية الصحية باستخدام RAG على Google Gemini.",
        tech: ["Gemini", "RAG", "FastAPI"],
        link: "https://github.com/Fadil369/brainsait-suite"
      },
      {
        name: "PyHeart — Cardiac AI Analysis",
        status: "Maintained",
        year: "2023",
        desc: "حزمة بايثون لتحليل بيانات القلب ودعم التشخيص بالذكاء الاصطناعي، منشورة على PyPI.",
        tech: ["Python", "NumPy"],
        link: "https://pypi.org/project/brainsait-pyheart/"
      },
      {
        name: "PyBrain — Neural Intelligence",
        status: "Maintained",
        year: "2023",
        desc: "إطار ذكاء اصطناعي عصبي متقدم لتطبيقات الرعاية الصحية ومعالجة البيانات الطبية.",
        tech: ["TensorFlow", "Keras"],
        link: "https://pypi.org/project/brainsait-pybrain/"
      },
      {
        name: "Healthcare Interoperability Solutions",
        status: "Enterprise",
        year: "2023–2024",
        desc: "حلول مؤسسية للتشغيل البيني الصحي مع التركيز على معايير FHIR/HL7 وامتثال NPHIES.",
        tech: ["FHIR R4", "NPHIES", "OAuth2"],
        link: "https://brainsait.org"
      },
      {
        name: "Clinical Documentation Automation",
        status: "Active",
        year: "2024",
        desc: "حل بالذكاء الاصطناعي لأتمتة التوثيق السريري وخفض إجهاد الأطباء بتقنية الاستماع الذكي.",
        tech: ["Whisper", "GPT-4"],
        link: "https://brainsait.org"
      },
      {
        name: "DeepSeek Harness — Intelligent Agent Platform",
        status: "Active",
        year: "2024–2026",
        desc: "منصة وكلاء ذكية — 9 مزودين (Xkiro, Groq, Hetzner, CF, TeamoRouter) 40+ نموذج، تحويل تلقائي عند الاستهلاك، ALLAM و Orpheus Saudi TTS.",
        tech: ["DeepSeek V4", "ALLAM", "Groq Orpheus", "Qwen3.8", "Muse Spark"],
        link: "https://agent.brainsait.org"
      },
      {
        name: "ALLAM — Arabic LLM (SDAIA) & Saudi TTS",
        status: "Active",
        year: "2024–2026",
        desc: "تكامل ALLAM 2-7B و Groq Orpheus Saudi (عبدالله/نورا) — واجهة صوتية سعودية، تحويل النص إلى كلام عربي فاخر.",
        tech: ["ALLAM 2-7B", "Orpheus Arabic", "Groq LPU", "Whisper"],
        link: "https://platforms.brainsait.org/v1/catalog"
      },
      {
        name: "BrainSAIT Stores — gh.io + Shopify",
        status: "Active",
        year: "2024–2026",
        desc: "متجران متكاملان — 40 كتاب تعليمي + 60 حل + حاضنة 16 يومًا، متزامنان مع Shopify store.brainsait.de (182/499/24k SAR).",
        tech: ["fadil369.github.io", "Shopify", "MyFatoorah", "R2"],
        link: "https://fadil369.github.io"
      },
      {
        name: "Cloudflare Workers & Pages — 146 Workers",
        status: "Active",
        year: "2023–2026",
        desc: "146 Worker + 74 KV + R2 + D1 + AI Gateway — hub.brainsait.org، build-apply، store-delivery، platforms-dispatcher.",
        tech: ["CF Workers", "KV", "R2", "D1", "AI"],
        link: "https://platforms.brainsait.org/v1/projects"
      },
      {
        name: "GitHub — 50+ Repos & Ecosystem",
        status: "Active",
        year: "2020–2026",
        desc: "50+ مستودع — OID, HNH, GIVC, SBS, Momfood, NPHIES، وأكثر مع CI/CD و Canva/Airtable.",
        tech: ["GitHub", "Git", "Actions", "Canva", "Airtable"],
        link: "https://github.com/Fadil369"
      },
      {
        name: "n8n Workflows — 20 Automated",
        status: "Active",
        year: "2024–2026",
        desc: "20 سير عمل — Shopify Concierge، License Issuance، Order Fanout، Lark، Telegram، 3CX، مع تكامل Hermes و Hub.",
        tech: ["n8n", "Hub", "Lark", "Telegram", "3CX"],
        link: "https://hub.brainsait.org"
      }
    ],
    ecosystem: [
      { name: "BrainSAIT", urlLabel: "brainsait.org", url: "https://brainsait.org" },
      {
        name: "المدونة",
        urlLabel: "brainsait369.blogspot.com",
        url: "https://brainsait369.blogspot.com/",
        badge: "✍️",
        featured: true
      },
      { name: "Health Network Hub", urlLabel: "hnh.brainsait.org", url: "https://hnh.brainsait.org" },
      { name: "BrainSAIT Spark", urlLabel: "spark.brainsait.org", url: "https://spark.brainsait.org" },
      { name: "BrainSAIT Incubator", urlLabel: "brainsait.org/incubator", url: "https://brainsait.org/incubator" },
      { name: "HIVI Health Agent", urlLabel: "hivi.brainsait.org", url: "https://hivi.brainsait.org" },
      { name: "BrainSAIT Market", urlLabel: "market.brainsait.de", url: "https://market.brainsait.de" },
      { name: "الملف السريري", urlLabel: "dr.elfadil.com", url: "https://dr.elfadil.com" },
      { name: "البوابة", urlLabel: "portal.elfadil.com", url: "https://portal.elfadil.com" },
      { name: "العمل", urlLabel: "work.elfadil.com", url: "https://work.elfadil.com" },
      { name: "أبنائي — إرثي", urlLabel: "son.elfadil.com", url: "https://son.elfadil.com" }
    ]
  },
  en: {
    brand: "Dr. El Fadil",
    langToggle: "ع",
    heroKicker: "Physician · Founder · Healthcare AI Innovator",
    heroName: "Dr. Mohamed El Fadil",
    heroTitle: "Physician, Entrepreneur & Healthcare AI Innovator",
    heroLocation: "Riyadh, Saudi Arabia  ·  Khartoum, Sudan",
    heroCtaMeet: "Book a meeting",
    heroCtaCv: "View CV",
    bookModalTitle: "Book a meeting",
    bookModalSubtitle: "Pick a time that works for you — instantly confirmed via Google Calendar.",
    bookModalClose: "Close",
    bookModalOpenExternal: "Open in a new tab ↗",
    aboutKicker: "About",
    aboutP1:
      "I bridge clinical medicine and artificial intelligence — building systems that make healthcare smarter, faster, and more human across the Middle East and Africa.",
    aboutP2:
      "Over 10 years at the bedside — in ICUs, neurosurgery wards, and emergency rooms — gave me an insider’s grasp of what healthcare truly needs. Today, as Founder & CEO of BrainSAIT, I channel that clarity into AI products deployed in hospitals from Riyadh to Khartoum.",
    expKicker: "Career",
    expTitle: "Experience & Education",
    skillsKicker: "Technical Expertise",
    skillsTitle: "Skills",
    projectsKicker: "Work",
    projectsTitle: "Featured Projects",
    ecosystemKicker: "Ecosystem",
    ecosystemTitle: "Where to Find Me",
    contactKicker: "Let’s Talk",
    contactTitle: "Have a healthcare AI project in mind?",
    contactText:
      "Open to collaborating with hospitals, developers, and investors working on healthcare technology across the Middle East and Africa.",
    footerText: "© 2026 Dr. Mohamed El Fadil — Founder, BrainSAIT",
    nav: {
      about: "About",
      experience: "Experience",
      skills: "Skills",
      projects: "Projects",
      ecosystem: "Ecosystem",
      contact: "Contact"
    },
    levels: {
      Expert: "Expert",
      Advanced: "Advanced",
      Intermediate: "Intermediate",
      Native: "Native",
      Fluent: "Fluent"
    },
    statuses: {
      Active: "Active",
      Maintained: "Maintained",
      Enterprise: "Enterprise"
    },
    stats: [
      { value: "10+", label: "Years Clinical & AI" },
      { value: "50k+", label: "Open Source Downloads" },
      { value: "3", label: "Continents Reached" }
    ],
    experience: [
      {
        year: "2023 — Present",
        title: "Founder & CEO",
        org: "BrainSAIT",
        desc: [
          "Leading development of an AI healthcare platform for clinical decision support",
          "Built enterprise-grade bilingual AI agents for healthcare operations",
          "Deployed solutions across Sudan and Saudi Arabia healthcare systems"
        ]
      },
      {
        year: "2021 — 2023",
        title: "Healthcare AI Developer",
        org: "Independent Consultant",
        desc: [
          "Developed Python packages for healthcare AI (PyHeart, PyBrain)",
          "Published open-source medical AI frameworks on PyPI",
          "Consulted on clinical workflow optimization and AI integration"
        ]
      },
      {
        year: "2021 — 2022",
        title: "Clinical Physician",
        org: "Healthcare Facilities, Sudan",
        desc: [
          "Provided patient care while identifying workflow inefficiencies",
          "Designed digital solutions for clinical documentation",
          "Collaborated with IT teams on EHR integration projects"
        ]
      },
      {
        year: "2015 — 2021",
        title: "Medical Doctor (MD)",
        org: "Medical School",
        desc: [
          "Clinical medicine with focus on healthcare technology integration",
          "Research in medical informatics and AI applications"
        ]
      },
      {
        year: "2021 — 2024",
        title: "Healthcare AI Specialization",
        org: "Self-directed Learning & Development",
        desc: [
          "Advanced training in clinical AI and machine learning",
          "FHIR/HL7 interoperability standards certification"
        ]
      }
    ],
    skillCategories: [
      {
        name: "Healthcare AI & Clinical Intelligence",
        skills: [
          { name: "Clinical Decision Support", level: "Expert" },
          { name: "Medical Coding", level: "Expert" },
          { name: "HL7 FHIR R4", level: "Expert" },
          { name: "Ambient AI Documentation", level: "Advanced" }
        ]
      },
      {
        name: "AI & Machine Learning",
        skills: [
          { name: "LLMs", level: "Expert" },
          { name: "RAG", level: "Expert" },
          { name: "Fine-tuning", level: "Advanced" },
          { name: "PyTorch", level: "Advanced" }
        ]
      },
      {
        name: "Programming & Development",
        skills: [
          { name: "Python", level: "Expert" },
          { name: "FastAPI", level: "Expert" },
          { name: "React / Node.js", level: "Advanced" },
          { name: "Docker / K8s", level: "Advanced" }
        ]
      },
      {
        name: "Healthcare Compliance",
        skills: [
          { name: "HIPAA", level: "Expert" },
          { name: "NPHIES", level: "Expert" },
          { name: "PDPL", level: "Advanced" },
          { name: "SaMD", level: "Advanced" }
        ]
      },
      {
        name: "Data & Databases",
        skills: [
          { name: "Vector DBs", level: "Advanced" },
          { name: "PostgreSQL", level: "Advanced" },
          { name: "MongoDB", level: "Advanced" }
        ]
      },
      {
        name: "Languages",
        skills: [
          { name: "Arabic", level: "Native" },
          { name: "English", level: "Fluent" },
          { name: "Medical Terminology", level: "Expert" }
        ]
      }
    ],
    projects: [
      {
        name: "BrainSAIT Healthcare AI Platform",
        status: "Active",
        year: "2023–2024",
        desc: "Comprehensive AI healthcare platform for clinical decision support, automated NPHIES claims validation, and full HL7 FHIR R4 integration.",
        tech: ["Python", "OpenAI GPT", "FHIR R4"],
        link: "https://github.com/Fadil369/brainsait-healthcare-ai"
      },
      {
        name: "BrainSAIT LINC Agent",
        status: "Active",
        year: "2024",
        desc: "Enterprise-grade bilingual AI agent for healthcare operations — medical coding, claims processing, and patient triage.",
        tech: ["Qwen3-8B", "Arabic NLP"],
        link: "https://github.com/Fadil369/brainsait-linc-docs"
      },
      {
        name: "Neural Cloud Portal",
        status: "Active",
        year: "2024",
        desc: "Bilingual, audio-ready clinic portal with real-time voice support, integrated with backend AI and clinical workflows.",
        tech: ["React", "WebRTC"],
        link: "https://elfadil.com/"
      },
      {
        name: "AFHAM AI Studio & BrainSAIT Suite",
        status: "Active",
        year: "2024",
        desc: "Comprehensive AI tools suite for healthcare providers with RAG built on Google Gemini for clinical analytics.",
        tech: ["Gemini", "RAG", "FastAPI"],
        link: "https://github.com/Fadil369/brainsait-suite"
      },
      {
        name: "PyHeart — Cardiac AI Analysis",
        status: "Maintained",
        year: "2023",
        desc: "Python package for cardiac data analysis and AI-powered diagnostic support, published on PyPI.",
        tech: ["Python", "NumPy"],
        link: "https://pypi.org/project/brainsait-pyheart/"
      },
      {
        name: "PyBrain — Neural Intelligence",
        status: "Maintained",
        year: "2023",
        desc: "Advanced neural intelligence framework for healthcare AI applications and medical data processing.",
        tech: ["TensorFlow", "Keras"],
        link: "https://pypi.org/project/brainsait-pybrain/"
      },
      {
        name: "Healthcare Interoperability Solutions",
        status: "Enterprise",
        year: "2023–2024",
        desc: "Enterprise solutions for healthcare data interoperability focused on FHIR/HL7 standards and NPHIES compliance.",
        tech: ["FHIR R4", "NPHIES", "OAuth2"],
        link: "https://brainsait.org"
      },
      {
        name: "Clinical Documentation Automation",
        status: "Active",
        year: "2024",
        desc: "AI-powered solution automating clinical documentation and reducing physician burnout with ambient listening.",
        tech: ["Whisper", "GPT-4"],
        link: "https://brainsait.org"
      },
      {
        name: "DeepSeek Harness — Intelligent Agent Platform",
        status: "Active",
        year: "2024–2026",
        desc: "Intelligent agent platform — 9 providers (Xkiro, Groq, Hetzner, CF, TeamoRouter) 40+ models, auto-failover, ALLAM & Orpheus Saudi TTS.",
        tech: ["DeepSeek V4", "ALLAM", "Groq Orpheus", "Qwen3.8", "Muse Spark"],
        link: "https://agent.brainsait.org"
      },
      {
        name: "ALLAM — Arabic LLM & Saudi TTS",
        status: "Active",
        year: "2024–2026",
        desc: "ALLAM 2-7B + Groq Orpheus Saudi (abdullah/noura) — premium Saudi voice, Arabic TTS.",
        tech: ["ALLAM 2-7B", "Orpheus Arabic", "Groq LPU", "Whisper"],
        link: "https://platforms.brainsait.org/v1/catalog"
      },
      {
        name: "BrainSAIT Stores — gh.io + Shopify",
        status: "Active",
        year: "2024–2026",
        desc: "Two integrated stores — 40 Learn + 60 Solutions + 16-day incubator, synced with Shopify store.brainsait.de (182/499/24k SAR).",
        tech: ["fadil369.github.io", "Shopify", "MyFatoorah", "R2"],
        link: "https://fadil369.github.io"
      },
      {
        name: "Cloudflare Workers & Pages — 146 Workers",
        status: "Active",
        year: "2023–2026",
        desc: "146 Workers + 74 KV + R2 + D1 + AI Gateway — hub.brainsait.org, build-apply, store-delivery, platforms-dispatcher.",
        tech: ["CF Workers", "KV", "R2", "D1", "AI"],
        link: "https://platforms.brainsait.org/v1/projects"
      },
      {
        name: "GitHub — 50+ Repos & Ecosystem",
        status: "Active",
        year: "2020–2026",
        desc: "50+ repos — OID, HNH, GIVC, SBS, Momfood, NPHIES with CI/CD & Canva/Airtable.",
        tech: ["GitHub", "Git", "Actions", "Canva", "Airtable"],
        link: "https://github.com/Fadil369"
      },
      {
        name: "n8n Workflows — 20 Automated",
        status: "Active",
        year: "2024–2026",
        desc: "20 workflows — Shopify Concierge, License Issuance, Order Fanout, Lark, Telegram, 3CX via Hermes & Hub.",
        tech: ["n8n", "Hub", "Lark", "Telegram", "3CX"],
        link: "https://hub.brainsait.org"
      }
    ],
    ecosystem: [
      { name: "BrainSAIT", urlLabel: "brainsait.org", url: "https://brainsait.org" },
      {
        name: "The Blog",
        urlLabel: "brainsait369.blogspot.com",
        url: "https://brainsait369.blogspot.com/",
        badge: "✍️",
        featured: true
      },
      { name: "Health Network Hub", urlLabel: "hnh.brainsait.org", url: "https://hnh.brainsait.org" },
      { name: "BrainSAIT Spark", urlLabel: "spark.brainsait.org", url: "https://spark.brainsait.org" },
      { name: "BrainSAIT Incubator", urlLabel: "brainsait.org/incubator", url: "https://brainsait.org/incubator" },
      { name: "HIVI Health Agent", urlLabel: "hivi.brainsait.org", url: "https://hivi.brainsait.org" },
      { name: "BrainSAIT Market", urlLabel: "market.brainsait.de", url: "https://market.brainsait.de" },
      { name: "Clinical Profile", urlLabel: "dr.elfadil.com", url: "https://dr.elfadil.com" },
      { name: "Portal", urlLabel: "portal.elfadil.com", url: "https://portal.elfadil.com" },
      { name: "Work", urlLabel: "work.elfadil.com", url: "https://work.elfadil.com" },
      { name: "My Sons — A Legacy", urlLabel: "son.elfadil.com", url: "https://son.elfadil.com" }
    ]
  }
};

export const THEMES: Record<
  ThemeName,
  {
    bg: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    accentSoft2: string;
    glow: string;
  }
> = {
  dark: {
    bg: "#12141c",
    surface: "rgba(35,37,50,.55)",
    border: "rgba(233,233,237,.14)",
    text: "#e9e9ed",
    muted: "rgba(233,233,237,.62)",
    accent: "#9184d9",
    accentSoft: "rgba(145,132,217,.16)",
    accentSoft2: "rgba(167,161,219,.12)",
    glow: "0 8px 30px rgba(145,132,217,.35)"
  },
  light: {
    bg: "#f3f5fe",
    surface: "rgba(255,255,255,.6)",
    border: "rgba(41,43,49,.12)",
    text: "#20222b",
    muted: "rgba(32,34,43,.62)",
    accent: "#5d5294",
    accentSoft: "rgba(93,82,148,.14)",
    accentSoft2: "rgba(93,82,148,.1)",
    glow: "0 8px 26px rgba(93,82,148,.25)"
  }
};
