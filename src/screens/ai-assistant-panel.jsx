import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'
import { Switch } from './job-creation-app'

/* Connect AI — AI Assistant panel (appended to screen-template-editor) */

const IMPROVE_OPTS = [
  { key:"concise",  en:"Make more concise",              ar:"اجعله أكثر إيجازاً" },
  { key:"friendly", en:"Make more friendly",             ar:"اجعله أكثر ودية" },
  { key:"formal",   en:"Make more formal",               ar:"اجعله أكثر رسمية" },
  { key:"cta",      en:"Strengthen the call to action",  ar:"قوِّ نداء العمل" },
  { key:"warm",     en:"Add a warm opening",             ar:"أضف مقدمة دافئة" },
  { key:"subj",     en:"Suggest 3 subject line variants",ar:"اقترح 3 موضوعات" },
];

const IMPROVE_TEXTS = {
  concise:  "Hi {{candidate.first_name}},\n\nWe'd love to invite you to interview for {{job.title}} on {{interview.date}} at {{interview.time}} with {{interviewer.name}}.\n\nJoin here: {{interview.link}} · Reschedule: {{scheduling_link}}\n\nBest,\n{{recruiter.name}}, {{company.name}}",
  friendly: "Hi {{candidate.first_name}} 👋,\n\nGreat news — we loved your profile and would love to get to know you better!\n\nYou're booked with {{interviewer.name}} on {{interview.date}} at {{interview.time}}. Here's your link: {{interview.link}}\n\nNeed a different time? {{scheduling_link}}\n\nCan't wait to chat!\n{{recruiter.name}} · {{company.name}} Talent Team",
  formal:   "Dear {{candidate.first_name}},\n\nThank you for your continued interest in the {{job.title}} position. We are pleased to invite you to a formal interview with {{interviewer.name}} on {{interview.date}} at {{interview.time}}.\n\nJoin the session here: {{interview.link}}\n\nTo reschedule, please use: {{scheduling_link}}\n\nYours sincerely,\n{{recruiter.name}}\n{{company.name}}",
  cta:      "Hi {{candidate.first_name}},\n\nWe're excited to move forward with your application for {{job.title}}!\n\n▶ Join your interview: {{interview.link}}\n\nDate: {{interview.date}} · Time: {{interview.time}} · Interviewer: {{interviewer.name}}\n\nReschedule in 30 seconds: {{scheduling_link}}\n\n{{recruiter.name}}, {{company.name}}",
  warm:     "Hi {{candidate.first_name}},\n\nThank you so much for applying — we've enjoyed learning about your background!\n\nWe'd love to invite you for an interview with {{interviewer.name}} on {{interview.date}} at {{interview.time}}.\n\nJoin: {{interview.link}} · Reschedule: {{scheduling_link}}\n\nLooking forward to our conversation,\n{{recruiter.name}}\n{{company.name}} Talent Team",
  subj:     "1. Your interview is scheduled — {{job.title}} at {{company.name}}\n2. It's on! Meet {{interviewer.name}} for {{job.title}} · {{interview.date}}\n3. {{candidate.first_name}}, your next step: {{job.title}} interview",
};

function AIAssistantPanel({ tpl, lang, t, toast }) {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState("improve");
  const [activeKey, setActiveKey] = React.useState(null);
  const [sugg, setSugg] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [toneIdx, setToneIdx] = React.useState(1);
  const [voiceMatch, setVoiceMatch] = React.useState(true);
  const [toneApplied, setToneApplied] = React.useState(false);

  const tones = ["Formal","Professional","Neutral","Friendly","Casual"];
  const tonesAr = ["رسمي","مهني","محايد","ودي","غير رسمي"];

  const runChip = (key) => {
    setActiveKey(key); setSugg(null); setBusy(true);
    setTimeout(() => { setBusy(false); setSugg({ key, text: IMPROVE_TEXTS[key] }); }, 1100);
  };

  const applyTone = () => {
    setToneApplied(true);
    toast((lang === "ar" ? "تم تطبيق الأسلوب: " : "Tone applied: ") + (lang === "ar" ? tonesAr[toneIdx] : tones[toneIdx]), "check");
    setTimeout(() => setToneApplied(false), 3000);
  };

  const reviewItems = [
    { type:"warn", icon:"alert", en:"Subject line is 92 characters — may truncate on mobile (limit ~78)", ar:"سطر الموضوع 92 حرفاً — قد يتقطع على الجوال", fix:true },
    { type:"warn", icon:"alert", en:"No clear call to action detected", ar:"لم يُرصد نداء واضح للعمل", fix:true },
    { type:"ok",   icon:"check", en:"Variables resolve correctly with sample data", ar:"المتغيرات تتحول صحيحاً مع البيانات التجريبية", fix:false },
    { type:"ok",   icon:"check", en:"Reading level: Grade 8 (appropriate for general audience)", ar:"مستوى القراءة: الصف 8 (مناسب للجمهور العام)", fix:false },
    { type:"tip",  icon:"bulb",  en:"Consider mentioning the interview length up front", ar:"فكّر في ذكر مدة المقابلة مسبقاً", fix:true },
  ];

  return (
    <div className="aia-panel">
      <div className={"aia-header" + (open ? " open" : "")} onClick={() => setOpen(o => !o)}>
        <Icon name="sparkles" size={16} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} />
        <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{lang === "ar" ? "✶ مساعد الذكاء الاصطناعي" : "✶ AI Assistant"}</span>
        <span className="muted" style={{ fontSize: 12.5 }}>{lang === "ar" ? "اقتراحات لهذا القالب" : "Get suggestions for this template"}</span>
        <Icon name="chevRight" size={16} className="aia-chev" />
      </div>

      {open && (
        <div className="aia-body">
          <div className="aia-tabs">
            {[["improve","Improve","تحسين"],["tone","Tone","الأسلوب"],["review","Review","مراجعة"]].map(([k,en,ar]) => (
              <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{lang === "ar" ? ar : en}</button>
            ))}
          </div>

          <div className="aia-content">

            {/* IMPROVE */}
            {tab === "improve" && (
              <React.Fragment>
                <div className="ai-chips">
                  {IMPROVE_OPTS.map(o => (
                    <button key={o.key} className={"ai-chip-btn" + (activeKey === o.key ? " active" : "")} onClick={() => runChip(o.key)}>
                      <Icon name="sparkles" size={12} fill />{lang === "ar" ? o.ar : o.en}
                    </button>
                  ))}
                </div>

                {busy && (
                  <div className="flex" style={{ alignItems: "center", gap: 10, padding: "12px 4px" }}>
                    <Icon name="sparkles" size={15} fill style={{ color: "var(--ai)" }} />
                    <span className="muted ai-cursor" style={{ fontSize: 13 }}>{lang === "ar" ? "جارٍ التحليل…" : "Analyzing…"}</span>
                  </div>
                )}

                {sugg && !busy && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {lang === "ar" ? "اقتراح بناءً على: فئة المقابلة · أسلوب كونكت · أفضل ممارسات البريد"
                        : "Suggestion based on: Interview category · Connect AI's voice · Email best practices"}
                    </div>
                    <div className="aia-suggestion">{sugg.text}</div>
                    <div className="flex" style={{ gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <button className="btn btn-primary btn-sm" onClick={() => toast(lang === "ar" ? "تم استبدال المسودة" : "Draft replaced", "check")}>
                        <Icon name="check" size={14} />{lang === "ar" ? "استبدال المسودة" : "Replace draft"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast(lang === "ar" ? "تمت الإضافة" : "Inserted as new section", "check")}>
                        {lang === "ar" ? "إدراج كقسم جديد" : "Insert as new section"}
                      </button>
                      <a className="muted flex" style={{ alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginInlineStart: "auto" }} onClick={() => runChip(sugg.key)}>
                        <Icon name="refresh" size={13} />{lang === "ar" ? "أعد المحاولة" : "Try again"}
                      </a>
                    </div>
                  </div>
                )}

                {!busy && !sugg && (
                  <div className="faint" style={{ fontSize: 12.5, textAlign: "center", padding: "8px 0" }}>
                    {lang === "ar" ? "انقر على اقتراح أعلاه للبدء." : "Click a suggestion chip above to get started."}
                  </div>
                )}
              </React.Fragment>
            )}

            {/* TONE */}
            {tab === "tone" && (
              <React.Fragment>
                <div>
                  <div className="flex" style={{ justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span className="muted">{lang === "ar" ? "أسلوب الكتابة الحالي:" : "Current tone:"}</span>
                    <span style={{ fontWeight: 600, color: "var(--ai)" }}>{lang === "ar" ? tonesAr[toneIdx] : tones[toneIdx]}</span>
                  </div>
                  <div className="tone-track" style={{ cursor: "pointer" }} onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    setToneIdx(Math.max(0, Math.min(4, Math.round(pct * 4))));
                  }}>
                    <div className="tone-thumb" style={{ left: ((toneIdx / 4) * 100) + "%" }} />
                  </div>
                  <div className="tone-labels">{(lang === "ar" ? tonesAr : tones).map(tn => <span key={tn}>{tn}</span>)}</div>
                </div>
                <div className="flex" style={{ gap: 10, alignItems: "center", marginTop: 4 }}>
                  <button className="btn btn-primary btn-sm" onClick={applyTone}>
                    <Icon name="sparkles" size={14} fill />{lang === "ar" ? "تطبيق" : "Apply"}
                  </button>
                  {toneApplied && <span className="save-ind saved flex" style={{ alignItems: "center", gap: 6 }}><Icon name="check" size={14} />{lang === "ar" ? "طُبِّق الأسلوب" : "Tone applied"}</span>}
                </div>
                <hr className="divider" />
                <div className="flex" style={{ alignItems: "center", gap: 11 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{lang === "ar" ? "مطابقة أسلوب شركتنا" : "Match our company voice"}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{lang === "ar" ? "نحلّل قوالبك المنشورة لمطابقة أسلوبك المعتاد." : "We'll analyze your published templates to match your typical tone."}</div>
                    {voiceMatch && <div className="faint flex" style={{ alignItems: "center", gap: 5, fontSize: 12, marginTop: 5 }}><Icon name="sparkles" size={12} fill style={{ color: "var(--ai)" }} />{lang === "ar" ? "إشارات الأسلوب من 8 قوالب" : "Voice signals from 8 templates"}</div>}
                  </div>
                  <Switch on={voiceMatch} onChange={setVoiceMatch} />
                </div>
              </React.Fragment>
            )}

            {/* REVIEW */}
            {tab === "review" && (
              <React.Fragment>
                {reviewItems.map((item, i) => (
                  <div key={i} className={"aia-review-item " + item.type}>
                    <Icon name={item.icon} size={16} style={{ color: item.type === "warn" ? "var(--warning)" : item.type === "ok" ? "var(--success)" : "var(--ai)", flex: "0 0 auto", marginTop: 1 }} />
                    <span style={{ flex: 1, fontSize: 13, lineHeight: 1.55 }}>{lang === "ar" ? item.ar : item.en}</span>
                    {item.fix && <a className="muted" style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => toast(lang === "ar" ? "تم التطبيق" : "Fix applied", "check")}>{lang === "ar" ? "إصلاح" : "Fix"}</a>}
                  </div>
                ))}
              </React.Fragment>
            )}

          </div>

          <div className="aia-ctx">
            {lang === "ar"
              ? "الاقتراحات مبنية على: فئة هذا القالب (مقابلة)، أسلوب مؤسستك عبر 8 قوالب، وأفضل ممارسات البريد. المراحل المرتبطة: Standard Hire → Recruiter Screen (+4 أخرى)."
              : "Suggestions are based on: this template's category (Interview), your organization's voice across 8 templates, and email best practices. Linked workflow stages: Standard Hire → Recruiter Screen (+4 more)."}
          </div>
        </div>
      )}
    </div>
  );
}

export { AIAssistantPanel, IMPROVE_OPTS, IMPROVE_TEXTS };
