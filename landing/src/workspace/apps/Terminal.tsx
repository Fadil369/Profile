import React, { useState } from 'react';
import type { Lang, ThemeName } from '../../workspace/content';
import { Monitor } from 'lucide-react';

interface TerminalAppProps {
  lang: Lang;
  theme: ThemeName;
  quality?: 'low' | 'high';
  onClose: () => void;
}

export default function TerminalApp({ lang, onClose }: TerminalAppProps) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<Array<{ command: string; output: string; timestamp: number }>>([]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command);
      setCommand('');
    }
  };

  const executeCommand = (cmd: string) => {
    const normalized = cmd.trim().toLowerCase();
    const output = generateOutput(normalized);

    setHistory(prev => [...prev, {
      command: cmd,
      output,
      timestamp: Date.now(),
    }]);
  };

  const generateOutput = (cmd: string): string => {
    switch (cmd) {
      case 'help':
      case 'welcome':
        return lang === 'ar'
          ? `Dr. Fadil's Terminal — قاموس الأوامر المتاحة:

available commands:
  ${getCommandList()}

للطرفية العربية: ${getCommandList(true)}
Type 'help' or 'help دو' for Arabic commands.`
          : `Dr. Fadil's Terminal — Available commands:

available commands:
  ${getCommandList()}

For Arabic: ${getCommandList(true)}
Type 'help' or 'help ar' for Arabic commands.`;

      case 'about':
        if (lang === 'ar') {
          return `Dr. Fadil — نبذة عن الدكتور

اسم: د. محمد الفاضل أبو عاقلة
الدور: طبيب، مؤسس، صانع حلول
اللقب: رؤية طبيب، وعقلية صانع

أحوّل خبرة الميدان إلى أدوات ذكية وأنظمة عملية.
ابنِ الذكاء الاصطناعي الصحي - nabi.tech/brainsait
GitHub: github.com/Fadil369`;
        }
        return `Dr. Fadil — About

Name: Dr. Mohamed El Fadil Abuagla
Role: Physician, founder, builder
Tagline: A physician's perspective. A builder's mindset.

I turn frontline experience into intelligent tools and practical systems.
Bringing healthcare AI to life - nabi.tech/brainsait
GitHub: github.com/Fadil369`;

      case 'projects':
        if (lang === 'ar') {
          return `مشاريعي — My Projects

د. فاضل لديه مشاريع في:
1. BrainSAIT Ltd — BraninSAIT.com
   mabi.brainsait.de — موبايل السناريو
   nabi.tech — الذكاء الاصطناعي الصحي
   registry.brainsait.org — السجل

2. LINC Documentation — mabi.brainsait.org/incubator/linc
3. HIVI Agent — hivi.brainsait.org
4. Market — market.brainsait.de
5. Other — son.elfadil.com — portal.elfadil.com — work.elfadil.com`;
        }
        return `My Projects — my Projects

Dr. Fadil has projects in:
1. BrainSAIT Ltd — BraninSAIT.com
   mabi.brainsait.de — Scenario Mobile
   nabi.tech — Healthcare AI
   registry.brainsait.org — Registry

2. LINC Documentation — mabi.brainsait.org/incubator/linc
3. HIVI Agent — hivi.brainsait.org
4. Market — market.brainsait.de
5. Other — son.elfadil.com — portal.elfadil.com — work.elfadil.com`;

      case 'writing':
        if (lang === 'ar') {
          return `كتاباتي — My Writing

Articles:
• نظام التعاون في Pittsburgh & سبيل
• أمراض مفهوم الأدوات الصحيحة

البودكاست: hub.brainsait.org`;
        }
        return `My Writing — My Writing

Articles:
• Collaboration system in Pittsburgh & Cielo
• Prescription for the right tools

Podcast: hub.brainsait.org`;

      case 'brainsait':
        if (lang === 'ar') {
          return `BrainSAIT — BrainSAIT

موقع: brainsait.org
الأكاديمية: academy.brainsait.org
السجل: registry.brainsait.org/related-network
العملاء: store.brainsait.de
الخطة: platforms.brainsait.org/related-network

المدونة: brainsait369.blogspot.com
التفاعل الإلكتروني: hub.brainsait.org
GitHub: github.com/Fadil369
Documentation: https://github.com/Fadil369/brainsait-linc-docs?tab=readme-ov-file`;
        }
        return `BrainSAIT — BrainSAIT

Site: brainsait.org
Academy: academy.brainsait.org
Registry: registry.brainsait.org/related-network
Store: store.brainsait.de
Platforms: platforms.brainsait.org/related-network

Blog: brainsait369.blogspot.com
Hub: hub.brainsait.org
GitHub: github.com/Fadil369
Documentation: https://github.com/Fadil369/brainsait-linc-docs?tab=readme-ov-file`;

      case 'contact':
        if (lang === 'ar') {
          return `لنتعاون — Let's Collaborate

المسارات المتاحة:
• advisory — الاستشارات الاستراتيجية للذكاء الاصطناعي الصحي
• workshop — ورش عمل وتدريب تنفيذي
• speaking — الالقاءات في المؤتمرات والفعاليات
• collaboration — شراكات منتجات وسير عمل

ارسل طلباً عبر النموذج في صفحة التعاون، أو احجز موعداً عبر Google Calendar.

البريد: info@brainsait.org`;
        }
        return `Let's Collaborate — Let's Collaborate

Available paths:
• advisory — AI healthcare strategy consulting
• workshop — Workshops and executive training
• speaking — Conferences and events speaking
• collaboration — Product and workflow partnerships

Send your request through the form in the Collaboration page, or book an appointment via Google Calendar.

Email: info@brainsait.org`;

      case 'clear':
        setHistory([]);
        return '';

      case 'status':
      case 'date':
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit' });

        if (lang === 'ar') {
          return `الحالة — Status
الوقت — Time
الرياض — Riyadh
${now.toLocaleDateString('ar-SA')} ${timeStr} WIB

المنصة — Platform: Active
الخدمات — Services: Online`;
        }
        return `Status — Status
Time — Time
Riyadh — Riyadh
${now.toLocaleDateString('en-US')} ${timeStr} WIB

Platform — Platform: Active
Services — Services: Online`;

      case 'helping':
        if (lang === 'ar') {
          return `محارب — Helping Links

وعي — Awareness:
• hearts.brainsait.org — شبكة الصحة
• nabi.tech — الذكاء الاصطناعي الصحي
• brainsait.org — منصة BrainSAIT

بناء — Building:
• registry.brainsait.org — السجل
• market.brainsait.de — السوق
• HIVI Agent — hivi.brainsait.org
• brainsait.org/incubator — incubator

الخلاصة — Summary:
موقع BrainSAIT: brainsait.org
الروابط القريبة:
  hearts.brainsait.org — شبكة الصحة
  spark.brainsait.org — BrainSAIT Spark
  brainsait.org/incubator — BrainSAIT Incubator
  hivi.brainsait.org — HIVI Agent
  market.brainsait.de — BrainSAIT Market
  dr.elfadil.com — Clinical Profile
  portal.elfadil.com — Portal
  work.elfadil.com — Work
  son.elfadil.com — Our Sons

جاهز للمساعدة.
اكتب 'help' للمساعدة.`;
        }
        return `Helping Links — Helping Links

Awareness — Awareness:
• hearts.brainsait.org — Health Network Hub
• nabi.tech — Healthcare AI
• brainsait.org — BrainSAIT Platform

Building — Building:
• registry.brainsait.org — Registry
• market.brainsait.de — Market
• HIVI Agent — hivi.brainsait.org
• brainsait.org/incubator — incubator

Summary — Summary:
BrainSAIT: brainsait.org
Related links:
  hearts.brainsait.org — Health Network Hub
  spark.brainsait.org — BrainSAIT Spark
  brainsait.org/incubator — BrainSAIT Incubator
  hivi.brainsait.org — HIVI Agent
  market.brainsait.de — BrainSAIT Market
  dr.elfadil.com — Clinical Profile
  portal.elfadil.com — Portal
  work.elfadil.com — Work
  son.elfadil.com — Our Sons

Ready to assist.
Type 'help' for help.`;

      default:
        if (lang === 'ar') {
          return `التركيب — Error
أمر غير معروف: "${cmd}"
اكتب 'help' للحصول على قائمة بالأوامر المسموح بها.
استخدم الأحرف الأولى فقط مثل: ab, pr, w, cl`;
        }
        return `Error — Error
Command unknown: "${cmd}"
Type 'help' for a list of available commands.
Use first-letter abbreviations: ab, pr, w, cl`;
    }
  };

  const getCommandList = (arabic: boolean = false): string => {
    if (arabic) {
      return `  help / help دو — Show this help
  about / عن — About Dr. Fadil
  projects / مشاريعي — Show my projects
  writing / كتاباتي — The available writings
  brainsait / برين سايت — BrainSAIT platform
  contact / لنتعاون — Contact options
  clear / مسح — Clear screen
  status / حالة — System status and Riyadh time
  date / التاريخ/الوقت — Time in Riyadh
  helping / محارب — Collaborative links`;
    }
    return `  help / welcome — Show this help
  about — About Dr. Fadil
  projects — Show my projects
  writing — The available writings
  brainsait — BrainSAIT platform
  contact — Contact options
  clear — Clear screen
  status — System status and Riyadh time
  date — Time in Riyadh
  helping — Collaborative links`;
  };

  return (
    <div className="terminal-app">
      <div className="terminal-header">
        <div className="terminal-title">
          <Monitor size={24} />
          <span className="terminal-text">{lang === 'ar' ? 'طرفيّة' : 'Terminal'} — Dr. Fadil</span>
          <span className="terminal-subtitle">{lang === 'ar' ? 'جاهز للمساعدة' : 'Ready to assist'}</span>
        </div>
        <div className="terminal-controls">
          <button className="terminal-control" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      <div className="terminal-body">
        <div className="terminal-output">
          {history.slice(-10).map((entry, idx) => (
            <div key={idx} className="output-block">
              <div className="output-header">
                <span className="input-prompt">$</span>
                <span className="output-line">{entry.command}</span>
              </div>
              <div className="output-result">{entry.output}</div>
            </div>
          ))}
        </div>

        <div className="terminal-input-line">
          <span className="input-prompt">$</span>
          <input
            className="terminal-input"
            type="text"
            value={command}
            onChange={e => setCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={lang === 'ar' ? 'اكتب أمراً أو اكتب help للمساعدة...' : 'Type a command or type help...'}
            aria-label={lang === "ar" ? "أمر الطرفية" : "Terminal command"}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}