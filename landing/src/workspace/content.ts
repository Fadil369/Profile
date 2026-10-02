export type Lang = "ar" | "en";
export type Localized = { ar: string; en: string };
export type AppId = "about" | "projects" | "brainsait" | "writing" | "contact" | "terminal" | "faq";

export type ThemeName = "dark" | "light";

export function local(value: Localized, lang: Lang): string {
  return value[lang];
}

export const APP_TITLES: Record<AppId, Localized> = {
  about: { ar: "عنّي", en: "About me" },
  projects: { ar: "مشاريعي", en: "Projects" },
  brainsait: { ar: "برين سايت", en: "BrainSAIT" },
  writing: { ar: "كتاباتي", en: "Writing" },
  contact: { ar: "لنتعاون", en: "Collaborate" },
  terminal: { ar: "الطرفية", en: "Terminal" },
  faq: { ar: "عن عملي", en: "About my work" },
};

export { BOOKING_URL, BOOKING_AVAILABLE } from "../booking";
export const CONTACT_EMAIL = "info@brainsait.org";

export const PROFILE = {
  name: { ar: "د. محمد الفاضل أبو عاقلة", en: "Dr. Mohamed El Fadil Abuagla" },
  role: { ar: "طبيب، مؤسس، وصانع حلول.", en: "Physician, founder, and builder." },
  tagline: { ar: "رؤية طبيب. وعقلية صانع.", en: "A physician's perspective. A builder's mindset." },
  intro: {
    ar: "أحوّل خبرة الميدان إلى أدوات ذكية، وأنظمة عملية، وقصص تستحق أن تُروى.",
    en: "I turn frontline experience into intelligent tools, practical systems, and stories worth sharing.",
  },
  bio: [
    {
      ar: "أنا د. فاضل، طبيب ورائد أعمال وكاتب، ومؤسس BrainSAIT Ltd. أعمل من الرياض عند تقاطع الرعاية الصحية والذكاء الاصطناعي وهندسة البرمجيات.",
      en: "I'm Dr. Fadil, a physician, technology entrepreneur, writer, and founder of BrainSAIT Ltd. Based in Riyadh, I work where healthcare, artificial intelligence, and software engineering meet.",
    },
    {
      ar: "بدأت أسئلتي من داخل التجربة: المناوبات، والسجلات، وأنظمة المستشفى، والعمل الذي يمتد بعد نهاية يوم الطبيب. دفعتني هذه الخبرة إلى التفكير في التقنية بوصفها وسيلة لتقليل التعقيد وإعادة الوقت إلى الناس.",
      en: "My questions began inside the experience: on-call shifts, records, hospital systems, and the work that continues after a physician's day ends. That experience led me to technology as a way to reduce friction and return time to people.",
    },
    {
      ar: "من خلال برين سايت، أصل بين الهوية الرقمية وسير العمل والأدوات الذكية. ومن خلال الكتابة، أستكشف ما تعلّمنا إياه الرعاية الصحية عن الأنظمة، والإنسان، وطريقة بناء مستقبل أفضل.",
      en: "Through BrainSAIT, I connect digital identity, workflows, and intelligent tools. Through writing, I explore what healthcare teaches us about systems, people, and building a better future.",
    },
  ],
  principles: [
    {
      title: { ar: "ابدأ من الإنسان", en: "Start with the person" },
      body: { ar: "افهم العمل كما يحدث، قبل أن تقترح كيف يجب أن يحدث.", en: "Understand the work as it happens before proposing how it should happen." },
    },
    {
      title: { ar: "صل بين الأنظمة", en: "Connect the systems" },
      body: { ar: "لا ينبغي أن يكون الطبيب هو الجسر اليدوي بين أدواته.", en: "A physician should not have to be the manual bridge between their tools." },
    },
    {
      title: { ar: "ابنِ ما ينفع", en: "Build what helps" },
      body: { ar: "قيمة الأداة في وضوحها وفائدتها اليومية، لا في تعقيدها.", en: "An instrument earns its place through clarity and everyday usefulness." },
    },
    {
      title: { ar: "العربية نقطة بداية", en: "Begin in Arabic" },
      body: { ar: "تجارب تنطلق من لغتنا وسياقنا، وتبقى مفتوحة للعالم.", en: "Experiences grounded in our language and context, and open to the world." },
    },
  ],
};

export interface Project {
  slug: string;
  name: Localized;
  category: "healthcare" | "ai" | "identity" | "education" | "creative";
  summary: Localized;
  problem: Localized;
  audience: Localized;
  contribution: Localized;
  approach: Localized;
  status: Localized;
  url?: string;
  action: Localized;
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "brainsait",
    name: { ar: "برين سايت", en: "BrainSAIT" },
    category: "healthcare",
    summary: { ar: "من الخبرة السريرية إلى أنظمة صحية مترابطة.", en: "From clinical experience to connected healthcare systems." },
    problem: { ar: "توزّع الأدوات والبيانات يزيد العمل اليدوي ويصعّب متابعة رحلة الرعاية.", en: "Fragmented tools and data create manual work and make care workflows harder to follow." },
    audience: { ar: "فرق الرعاية الصحية، والمطورون، ومؤسسو المنتجات.", en: "Healthcare teams, developers, and product founders." },
    contribution: { ar: "المؤسس؛ أصل بين الخبرة الطبية واتجاه المنتج وهندسة الأنظمة.", en: "Founder, connecting medical experience with product direction and systems engineering." },
    approach: { ar: "هوية رقمية وتكامل بين الأنظمة وأتمتة، مع مسارات للتعلّم والبناء واستكشاف الحلول.", en: "Digital identity, interoperability, and automation, with pathways to learn, build, and explore solutions." },
    status: { ar: "موقع عام متاح", en: "Public website" },
    url: "https://brainsait.org/",
    action: { ar: "استكشف برين سايت", en: "Explore BrainSAIT" },
  },
  {
    slug: "provider-registry",
    name: { ar: "سجل مقدمي الرعاية", en: "BrainSAIT Provider Registry" },
    category: "identity",
    summary: { ar: "هوية رقمية قابلة للتحقق، تربط الأشخاص بالأنظمة.", en: "Verifiable digital identity connecting people and systems." },
    problem: { ar: "تحتاج الأنظمة المترابطة إلى طريقة واضحة للتعرّف إلى مقدم الخدمة والتحقق من هويته.", en: "Connected systems need a clear way to identify a provider and verify their digital identity." },
    audience: { ar: "مقدمو الرعاية وفرق التكامل والهوية الرقمية.", en: "Healthcare providers and teams building identity and integration services." },
    contribution: { ar: "توجيه منظومة الهوية ضمن برين سايت وربطها برؤية نظام يتمحور حول الطبيب.", en: "Directing BrainSAIT's identity ecosystem as part of a system built around the physician." },
    approach: { ar: "سجل عام لمعرّفات OID، ومعرّفات مقدمي الخدمة، وصفحات للتحقق من الهوية.", en: "A public OID registry, provider identifiers, and dedicated identity verification pages." },
    status: { ar: "سجل عام متاح", en: "Public registry" },
    url: "https://registry.brainsait.org/oid",
    action: { ar: "تصفّح السجل", en: "Browse the registry" },
  },
  {
    slug: "linc-agents",
    name: { ar: "منظومة وكلاء LINC", en: "LINC Agent Ecosystem" },
    category: "ai",
    summary: { ar: "توثيق وأفكار تكامل لوكلاء ذكاء اصطناعي في الرعاية الصحية.", en: "Documentation and integration patterns for healthcare AI agents." },
    problem: { ar: "تحتاج الأفكار الذكية إلى سياق وتعليمات واضحة ومسار للتكامل مع العمل القائم.", en: "Intelligent tools need context, clear instructions, and a route into existing workflows." },
    audience: { ar: "مطورو الرعاية الصحية وفرق الأتمتة والتكامل.", en: "Healthcare developers, automation teams, and integration engineers." },
    contribution: { ar: "تطوير رؤية منظومة LINC ومشاركة توثيقها ضمن برين سايت.", en: "Developing the LINC ecosystem vision and sharing its documentation through BrainSAIT." },
    approach: { ar: "مستودع عام يشرح إعداد الوكلاء وتعليمات النظام وأمثلة التكامل.", en: "A public repository covering agent setup, system instructions, and integration examples." },
    status: { ar: "توثيق مفتوح", en: "Public documentation" },
    url: "https://github.com/Fadil369/brainsait-linc-docs",
    action: { ar: "اقرأ التوثيق", en: "Read the documentation" },
  },
  {
    slug: "basma",
    name: { ar: "بسمة", en: "Basma" },
    category: "ai",
    summary: { ar: "استكشاف الصوت العربي كمدخل أبسط إلى الأدوات الذكية.", en: "Exploring Arabic voice as a simpler way into intelligent tools." },
    problem: { ar: "العمل عبر الشاشات وحدها لا يناسب كل سياق أو كل مستخدم.", en: "Screen-only workflows do not suit every situation or every user." },
    audience: { ar: "الفرق التي تستكشف المساعدات الصوتية العربية وسير العمل بالمحادثة.", en: "Teams exploring Arabic voice assistants and conversational workflows." },
    contribution: { ar: "توجيه المنتج ضمن منظومة برين سايت، مع التركيز على التجربة العربية.", en: "Product direction within BrainSAIT, with a focus on the Arabic experience." },
    approach: { ar: "مساعد صوتي عربي موصوف في صفحة المنتج، مع تحديد نطاق التكامل بحسب الاستخدام.", en: "An Arabic-first voice assistant described on its product page, with integration scope defined for each use case." },
    status: { ar: "صفحة منتج متاحة", en: "Public product page" },
    url: "https://store.brainsait.de/products/solutions-ready-basma-voice",
    action: { ar: "اطّلع على نطاق المنتج", en: "View the product scope" },
  },
  {
    slug: "academy",
    name: { ar: "أكاديمية برين سايت", en: "BrainSAIT Academy" },
    category: "education",
    summary: { ar: "مسار للتعلّم عند تقاطع الرعاية الصحية والذكاء الاصطناعي.", en: "Learning at the intersection of healthcare and artificial intelligence." },
    problem: { ar: "يتطلب بناء التقنية الصحية فهماً للعمل السريري والتكامل والأدوات الجديدة معاً.", en: "Building healthcare technology calls for an understanding of clinical work, integration, and new tools together." },
    audience: { ar: "المهنيون الصحيون والمطورون والفرق التي تبني قدراتها التقنية.", en: "Healthcare professionals, developers, and teams developing their technical capabilities." },
    contribution: { ar: "توجيه الرؤية التعليمية ضمن برين سايت، وربط التعلّم بالتطبيق.", en: "Shaping BrainSAIT's educational direction and connecting learning with practice." },
    approach: { ar: "دليل تعليمي عام يتناول نفيس ووكلاء الذكاء الاصطناعي وسير العمل السريري.", en: "A public learning catalog covering NPHIES, AI agents, and clinical workflows." },
    status: { ar: "دليل تعليمي متاح", en: "Public learning catalog" },
    url: "https://academy.brainsait.org/",
    action: { ar: "استكشف الأكاديمية", en: "Explore the academy" },
  },
  {
    slug: "republic-of-cells",
    name: { ar: "جمهورية الخلايا", en: "The Republic of Cells" },
    category: "creative",
    summary: { ar: "رواية تستكشف الجسد بوصفه جمهورية حية من الخلايا.", en: "A literary exploration of the body as a living republic of cells." },
    problem: { ar: "كيف نقرّب تعقيد الجسد من القارئ من خلال حكاية؟", en: "How can a story bring the body's complexity closer to the reader?" },
    audience: { ar: "القراء الفضوليون تجاه الطب والأدب والأسئلة الإنسانية.", en: "Readers curious about medicine, literature, and human questions." },
    contribution: { ar: "الكتابة وإعادة صياغة العمل بالعربية بصوت أدبي خاص.", en: "Writing the work and recreating it in Arabic with its own literary voice." },
    approach: { ar: "المناعة والذاكرة والحياة اليومية للجسد تتحول إلى أصوات وشخصيات وأسئلة عن الانتماء والاستمرار.", en: "Immunity, memory, and the body's daily life become voices, characters, and questions about belonging and endurance." },
    status: { ar: "مدرج في المكتبة", en: "Listed in the library" },
    url: "https://store.brainsait.de/products/republic-of-cells",
    action: { ar: "اطّلع على الكتاب", en: "View the book" },
    image: "/assets/img/republic-of-cells.webp",
  },
];

export interface Article {
  slug: string;
  title: Localized;
  category: Localized;
  description: Localized;
  paragraphs: Localized[];
  sourceLabel: Localized;
  sourceUrl?: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "a-system-around-the-physician",
    title: { ar: "نظام يُبنى حول الطبيب", en: "A system built around the physician" },
    category: { ar: "من ملاحظاتي", en: "From my notes" },
    description: { ar: "السؤال الذي وصل بين التجربة السريرية وبناء برين سايت.", en: "The question connecting clinical experience with building BrainSAIT." },
    paragraphs: [
      { ar: "قبل الحديث عن الذكاء الاصطناعي أو مستقبل الأنظمة الصحية، أبدأ من التجربة. من المناوبات وغرف الطوارئ، ومن السجلات وأنظمة المستشفى والمطالبات. من تلك اللحظة التي ينتهي فيها يوم الطبيب، لكن العمل لا ينتهي.", en: "Before talking about artificial intelligence or the future of health systems, I start with the experience. With on-call shifts and emergency rooms. With records, hospital systems, and claims. With the moment when a physician's day ends, but the work does not." },
      { ar: "الطبيب يقف في الصف الأول مع المرضى، ثم يتنقل بين شاشات وأنظمة كثيرة. وفي المسافة بين كل أداة وأخرى، يتراكم عمل إضافي: معلومة تُنقل، أو إجراء يُعاد، أو سياق يجب شرحه من جديد.", en: "The physician stands on the front line with patients, then moves between screens and systems. In the space between one tool and the next, more work accumulates: information to transfer, a step to repeat, or context to explain again." },
      { ar: "كانت جائحة كوفيد اختبار ضغط للأنظمة الصحية. ومن داخل هذه التجربة عاد السؤال: إذا كان الطبيب هو من يواجه أصعب الأزمات في الميدان، فلماذا لا تُبنى التقنية حوله؟", en: "COVID-19 was a stress test for health systems. From inside that experience, the question returned: if the physician faces the hardest crises on the front line, why isn't the technology built around them?" },
      { ar: "من هنا بدأت رؤية برين سايت. هوية رقمية واضحة، وأدوات تظهر بحسب السياق، وأنظمة تتبادل المعلومات بدلاً من أن يصبح الطبيب الجسر اليدوي بينها. هذه رؤية أعمل على بنائها، وليست وعداً بأن التقنية وحدها تحل كل مشكلة.", en: "That is where the BrainSAIT vision began. A clear digital identity, tools that appear in context, and systems that exchange information without making the physician their manual bridge. It is a direction I am working toward, not a promise that technology alone solves every problem." },
      { ar: "ما يشغلني هو ما يعود إلى الإنسان: وضوح أكثر، وتعقيد أقل، ووقت يمكن أن يذهب إلى ما يستحق الانتباه. أبدأ بالسؤال عن العمل الحقيقي، ثم أبحث عن الأداة المناسبة له.", en: "What matters to me is what returns to the person: more clarity, less friction, and time for what deserves attention. I start by asking about the real work, then look for the right tool to support it." },
    ],
    sourceLabel: { ar: "مقتبس بتصرّف من السيرة المنشورة سابقاً على هذا الموقع.", en: "Adapted from the personal narrative previously published on this website." },
  },
  {
    slug: "the-leverage-point",
    title: { ar: "نقطة الرفع", en: "The Leverage Point" },
    category: { ar: "تفكير في الأنظمة", en: "Systems thinking" },
    description: { ar: "قراءة مختصرة في وثيقة عمل تستكشف وصل المنهج بالتنفيذ.", en: "A short reading of a working document exploring the link between method and execution." },
    paragraphs: [
      { ar: "تستكشف وثيقة «نقطة الرفع» كيف يمكن أن تلتقي منهجية التفكير في الأنظمة مع أدوات التنفيذ في الرعاية الصحية. وهي وثيقة استراتيجية استكشافية، وليست إعلاناً عن شراكة قائمة.", en: "The Leverage Point explores how systems-thinking methods could meet practical healthcare tools. It is an exploratory strategy document, not an announcement of an established partnership." },
      { ar: "تنطلق الفكرة من النظر إلى القدرات الموجودة: المعرفة، والأدوات، وسير العمل، وقنوات التعلّم. قد تكون نقطة البداية المفيدة هي وصل هذه القدرات بطريقة تجعل تدفق المعرفة والعمل أوضح.", en: "Its starting point is the capability already present: knowledge, tools, workflows, and learning channels. A useful first step can be to connect these capabilities so that knowledge and work flow more clearly." },
      { ar: "تعرض الوثيقة جسوراً محتملة بين التعليم التنفيذي والتطبيق، مع تصور لمسار يمتد تسعين يوماً. هذه الخطوات مقترحات للتجربة والنقاش، ولا تمثل أنشطة مكتملة أو نتائج مثبتة.", en: "The document outlines possible bridges between executive education and implementation, including a proposed ninety-day sequence. These are suggestions for experimentation and discussion, not completed activities or demonstrated outcomes." },
      { ar: "ما يهمني في هذا النوع من التفكير هو أن نحدد أين يغيّر اتصال صغير طريقة عمل النظام كله. فالسؤال لا يتوقف عند بناء أداة جديدة؛ بل يمتد إلى علاقتها بالأشخاص والقرارات والأدوات المحيطة بها.", en: "What interests me in this approach is finding where a small connection could change how a wider system works. The question extends beyond making a tool to its relationship with people, decisions, and the tools around it." },
    ],
    sourceLabel: { ar: "ملخص ثنائي اللغة لوثيقة «نقطة الرفع» الأصلية باللغة الإنجليزية.", en: "A bilingual summary of the original English-language Leverage Point working document." },
    sourceUrl: "/the_leverage_point",
  },
  {
    slug: "republic-of-cells",
    title: { ar: "وطنٌ لا نراه", en: "A country we cannot see" },
    category: { ar: "من جمهورية الخلايا", en: "From The Republic of Cells" },
    description: { ar: "مقتطف من مقدمة الكاتب عن الجسد والحكاية وصوت العربية.", en: "An excerpt from the author's introduction on the body, storytelling, and Arabic." },
    paragraphs: [
      { ar: "هذه ليست رواية عن الجسد. وليست رواية عن الطب. إنها رواية عن وطنٍ لا نراه، نحيا به، ويحيا بنا.", en: "This is not a novel about the body. Nor is it a novel about medicine. It is a novel about a country we cannot see, through which we live, and which lives through us." },
      { ar: "عندما بدأتُ بكتابة هذه الرواية بالإنجليزية، ظننتُ أنني أروي قصةَ الجسد. ثم أدركتُ: الجسدُ يروي قصتَهُ بنفسِه. أنا مجردُ مترجِم.", en: "When I began writing this novel in English, I thought I was telling the body's story. Then I realized: the body tells its own story. I am only a translator." },
      { ar: "لكنّ العربية مختلفة. العربية ليستُ لغةً للترجمةِ فقط. إنها لغةٌ للحكاياتِ التي لا تنتهي. لأنّها تحملُ في حروفِها أصداءَ ألفِ سنة. ولأنّها تعرفُ أنّ القصصَ الحقيقيةَ تلكُ التي يرويها القلبُ قبلَ العقلِ.", en: "But Arabic is different. Arabic is not merely a language of translation. It is a language for stories that do not end. Its letters carry the echoes of a thousand years. It knows that true stories are those the heart tells before the mind." },
      { ar: "كتبتُ هذه الرواية بالإنجليزية أولاً. ثم أدركتُ: القصصَ تحتاجُ إلى أن تُروى بلغةِ من يسمعُها. ولغتي هي العربية. فأعدتُ كتابتَها. ليسَ كترجمةٍ. بل كأنّني أكتُبُها للمرّةِ الأولى.", en: "I first wrote this novel in English. Then I realized that stories need to be told in the language of those who hear them. My language is Arabic. So I wrote it again. Not as a translation, but as though I were writing it for the first time." },
      { ar: "في الرواية، ستجدُ حكاماً لا يعرفونَ أنّهم يحكمون. ستجدُ جنوداً يموتونَ دونَ أن يعرفوا لماذا. ستجدُ ذاكرةً تحفظُ ما نسيناهُ. وستجدُ قلباً لا يقودُ الجسدَ، بل يُقنعُهُ أن يستمرّ.", en: "In the novel, you will find rulers who do not know they rule. Soldiers who die without knowing why. Memory that keeps what we have forgotten. And a heart that does not command the body, but persuades it to continue." },
    ],
    sourceLabel: { ar: "مقتطف من المقدمة العربية في مخطوطة جمهورية الخلايا؛ النص الإنجليزي ترجمة لهذا المقتطف.", en: "Excerpt from the Arabic manuscript introduction; the English text is a translation of this excerpt." },
    sourceUrl: "https://store.brainsait.de/products/republic-of-cells",
  },
];

export const FAQ: { question: Localized; answer: Localized; app: AppId }[] = [
  {
    question: { ar: "ما الذي يجمع الطب والتقنية في عملك؟", en: "How do medicine and technology connect in your work?" },
    answer: { ar: "توجّه خبرتي السريرية أسئلتي عن الوقت والتعقيد وسير العمل. أبني أدوات وأنظمة تساعد على وصل المعلومات وتقليل العمل اليدوي.", en: "My clinical experience shapes my questions about time, friction, and workflows. I build tools and systems that connect information and reduce manual work." },
    app: "about",
  },
  {
    question: { ar: "من أين أبدأ استكشاف المشاريع؟", en: "Where should I start exploring the projects?" },
    answer: { ar: "ابدأ ببرين سايت للصورة العامة، ثم سجل مقدمي الرعاية للهوية الرقمية، أو توثيق LINC لاستكشاف الوكلاء والتكامل.", en: "Start with BrainSAIT for the wider picture, the Provider Registry for digital identity, or the LINC documentation for agents and integration." },
    app: "projects",
  },
  {
    question: { ar: "هل يمكن مناقشة ورشة أو تعاون؟", en: "Can we discuss a workshop or collaboration?" },
    answer: { ar: "أرحب بالنقاش حول الذكاء الاصطناعي الصحي، وتحسين سير العمل، والورش، والمنتجات، والشراكات. ابدأ بتحديد موضوعك في صفحة التعاون.", en: "I welcome conversations about healthcare AI, workflow transformation, workshops, products, and partnerships. Start by choosing your topic in Collaborate." },
    app: "contact",
  },
  {
    question: { ar: "أين أجد الكتابات والأعمال الإبداعية؟", en: "Where can I find your writing and creative work?" },
    answer: { ar: "تضم الكتابات ملاحظات عن بناء الأنظمة، ووثيقة نقطة الرفع، ومقتطفاً من جمهورية الخلايا، مع روابط إلى المصادر المتاحة.", en: "Writing brings together notes on systems, The Leverage Point, and an excerpt from The Republic of Cells, with links to available sources." },
    app: "writing",
  },
  {
    question: { ar: "هل هذه قناة للاستشارات الطبية الشخصية؟", en: "Is this a channel for personal medical consultations?" },
    answer: { ar: "هذا موقع شخصي للتعريف بالأعمال والتعاون المهني. لا ترسل معلومات مرضى أو سجلات طبية عبر قنوات التواصل هنا.", en: "This personal website is for exploring my work and professional collaboration. Please do not send patient information or medical records through these contact channels." },
    app: "contact",
  },
];
