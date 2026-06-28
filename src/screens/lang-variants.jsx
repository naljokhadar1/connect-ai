import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Language Variants: AddLangModal + AR body */

/* Arabic body segments for Interview Invitation (variables preserved) */
const AR_BODY_SEGS = [
  {t:"text",v:"مرحباً "},{t:"var",v:"candidate.first_name"},{t:"text",v:"،\n\nشكراً لتقديمك لوظيفة "},
  {t:"var",v:"job.title"},{t:"text",v:" في فريق "},{t:"var",v:"job.department"},
  {t:"text",v:". بعد مراجعة ملفك، يسعدنا دعوتك لإجراء مقابلة.\n\nموعد مقابلتك مع "},
  {t:"var",v:"interviewer.name"},{t:"text",v:" بتاريخ "},{t:"var",v:"interview.date"},
  {t:"text",v:" الساعة "},{t:"var",v:"interview.time"},{t:"text",v:".\n\n📎 رابط الانضمام: "},
  {t:"var",v:"interview.link"},{t:"text",v:"\n\nلتغيير الموعد: "},{t:"var",v:"scheduling_link"},
  {t:"text",v:"\n\nنتطلع إلى لقائك.\n\nمع التحية،\n"},{t:"var",v:"recruiter.name"},
  {t:"text",v:"\n"},{t:"var",v:"company.name"},{t:"text",v:" · فريق استقطاب المواهب"},
];

const AR_SUBJ_SEGS = [
  {t:"text",v:"دعوة لمقابلة وظيفة "},{t:"var",v:"job.title"},{t:"text",v:" في "},{t:"var",v:"company.name"},
];

const LANG_OPTIONS = [
  {code:"ar", label:"العربية (Arabic)", dir:"rtl"},
  {code:"fr", label:"Français (French)", dir:"ltr"},
  {code:"es", label:"Español (Spanish)", dir:"ltr"},
  {code:"de", label:"Deutsch (German)", dir:"ltr"},
  {code:"zh", label:"中文 (Chinese)", dir:"ltr"},
  {code:"ur", label:"اردو (Urdu)", dir:"rtl"},
];

const LANG_LABELS = {ar:"Arabic", fr:"Français", es:"Español", de:"Deutsch", zh:"中文", ur:"اردو"};

function makeAIBody(code, bodySegs) {
  if (code === "ar") return AR_BODY_SEGS;
  // Generic placeholder for other languages
  return [{t:"text", v:"[AI-translated draft — review before publishing]\n\n"}].concat(bodySegs);
}

function AddLangModal({ existingCodes, tplBodySegs, tplSubjSegs, onClose, onAdd }) {
  const { t, lang } = useApp();
  const [selCode, setSelCode] = React.useState("");
  const [mode, setMode] = React.useState("ai");
  const avail = LANG_OPTIONS.filter(l => !existingCodes.includes(l.code));
  const valid = selCode && mode;

  const create = () => {
    if (!valid) return;
    const isAI = mode === "ai";
    const bodySegs = isAI ? makeAIBody(selCode, tplBodySegs) : [{t:"text",v:""}];
    const subjSegs = (isAI && selCode === "ar") ? AR_SUBJ_SEGS : [{t:"text",v:""}];
    onAdd({ code: selCode, label: LANG_LABELS[selCode] || selCode.toUpperCase(), isAI, bodySegs, subjSegs });
    onClose();
  };

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head" style={{ alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <h3 style={{ fontSize:16.5 }}>{lang==="ar"?"إضافة نسخة لغوية":"Add a language variant"}</h3>
            <div className="muted" style={{ fontSize:12.5, marginTop:2 }}>{lang==="ar"?"أنشئ نسخة من هذا القالب بلغة أخرى.":"Create a version of this template in another language."}</div>
          </div>
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div className="field">
            <label>{lang==="ar"?"اللغة":"Language"}</label>
            <select className="select" value={selCode} onChange={e => setSelCode(e.target.value)}>
              <option value="">{lang==="ar"?"اختر اللغة…":"Choose a language…"}</option>
              {avail.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label>{lang==="ar"?"نقطة البداية":"Starting point"}</label>
            <div className={"rad-opt" + (mode==="ai"?" on":"")} onClick={() => setMode("ai")}>
              <span className="rad" />
              <div>
                <div style={{ fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                  <Icon name="sparkles" size={14} fill style={{ color:"var(--ai)" }} />
                  {lang==="ar"?"✶ ترجمة بالذكاء الاصطناعي من الإنجليزية (موصى به)":"✦ Translate from English with AI (recommended)"}
                </div>
                <div className="muted" style={{ fontSize:12, marginTop:2 }}>{lang==="ar"?"سنصيغ الترجمة. أنت تراجع وتعدّل قبل النشر. تبقى المتغيرات كما هي.":"We'll draft the translation. You review and edit before publishing. Variables and formatting are preserved."}</div>
              </div>
            </div>
            <div className={"rad-opt" + (mode==="blank"?" on":"")} onClick={() => setMode("blank")}>
              <span className="rad" />
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{lang==="ar"?"ابدأ من فراغ":"Start from blank"}</div>
                <div className="muted" style={{ fontSize:12 }}>{lang==="ar"?"اكتب النسخة من الصفر.":"Write the variant from scratch."}</div>
              </div>
            </div>
          </div>

          <div className="flex" style={{ alignItems:"center", gap:7, padding:"9px 12px", background:"var(--surface-2)", borderRadius:"var(--r-sm)", border:"1px solid var(--border)" }}>
            <Icon name="zap" size={13} style={{ color:"var(--ai)", flex:"0 0 auto" }} />
            <span style={{ fontSize:12, color:"var(--text-2)" }}>{lang==="ar"?"تُحفظ المتغيرات تلقائياً.":"Variables are preserved automatically."}</span>
          </div>
        </div>

        <div className="modal-foot">
          <div className="spacer" style={{ flex:1 }} />
          <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" disabled={!valid} onClick={create}>
            <Icon name="plus" size={15} />{lang==="ar"?"إنشاء النسخة":"Create variant"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { AddLangModal, AR_BODY_SEGS, AR_SUBJ_SEGS, LANG_OPTIONS, LANG_LABELS, makeAIBody };
