import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'
import { Switch } from './admin'

/* Connect AI — Screening Agent Setup Wizard (guided 6-step creation) */

function ScreeningWizard({ go, toast, job }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [discard, setDiscard] = React.useState(false);

  // shared state
  const [name, setName] = React.useState("");
  const [cat, setCat] = React.useState("technical");
  const [langs, setLangs] = React.useState("both");
  const [linkMode, setLinkMode] = React.useState("link");
  const [linkedJob, setLinkedJob] = React.useState(job || "j2");
  const [startFrom, setStartFrom] = React.useState("ai");

  const steps = [T("Basics", "الأساسيات"), T("What to ask", "ماذا يُسأل"), T("What to say", "ماذا يُقال"), T("How it sounds", "كيف يبدو"), T("How it scores", "كيف يُقيّم"), T("Review & launch", "مراجعة وإطلاق")];
  const jobs = (window.DATA ? window.DATA.jobs : []).filter(j => j.status === "open");
  const jobName = (() => { const j = jobs.find(x => x.id === linkedJob); return j ? j[ar ? "ar" : "en"] : T("Senior Frontend Engineer", "مهندس واجهات أول"); })();
  const drafted = startFrom === "ai" && linkMode === "link";

  const valid = step === 0 ? (name.trim() && cat && langs && startFrom) : true;

  if (done) return <WizardSuccess T={T} ar={ar} go={go} name={name || "Engineering Senior Screen"} jobName={jobName} />;

  return (
    <div className="page" style={{ maxWidth: 920 }}>
      <div className="crumbs" style={{ marginBottom: 12 }}><a onClick={() => go("screening")}>{T("Screening Calls", "مكالمات الفرز")}</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} /><span style={{ color: "var(--text-2)" }}>{T("New agent", "وكيل جديد")}</span></div>

      {/* header */}
      <div className="card card-pad" style={{ marginBottom: 14 }}>
        <div className="flex" style={{ alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{T("New screening agent", "وكيل فرز جديد")}</div>
            <div className="faint" style={{ fontSize: 13, marginTop: 2 }}>{name || T("Engineering Senior Screen", "فرز الهندسة الأول")}</div>
          </div>
          <a className="muted" style={{ fontSize: 12.5, cursor: "pointer" }} onClick={() => { toast(T("Draft saved", "حُفظت المسودة")); go("screening"); }}>{T("Save and exit", "حفظ وخروج")}</a>
          <a style={{ fontSize: 12.5, cursor: "pointer", color: "var(--danger)", fontWeight: 600 }} onClick={() => setDiscard(true)}>{T("Discard", "إلغاء")}</a>
        </div>
      </div>

      {/* step indicator */}
      <div className="flex" style={{ alignItems: "center", marginBottom: 6, overflowX: "auto", paddingBottom: 4 }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <button onClick={() => i < step && setStep(i)} className="flex" style={{ alignItems: "center", gap: 7, flex: "0 0 auto", cursor: i < step ? "pointer" : "default" }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", display: "grid", placeItems: "center", flex: "0 0 auto", fontWeight: 700, fontSize: 12,
                background: i < step ? "var(--accent)" : i === step ? "transparent" : "var(--surface-3)",
                border: i === step ? "2px solid var(--accent)" : "none",
                color: i < step ? "#fff" : i === step ? "var(--accent-strong)" : "var(--text-3)" }}>{i < step ? <Icon name="check" size={13} /> : i + 1}</span>
              <span style={{ fontSize: 12.5, fontWeight: i === step ? 600 : 500, color: i === step ? "var(--text)" : "var(--text-3)", whiteSpace: "nowrap" }}>{s}</span>
            </button>
            {i < steps.length - 1 && <span style={{ flex: "1 1 16px", height: 1, background: "var(--border)", margin: "0 8px", minWidth: 12 }} />}
          </React.Fragment>
        ))}
      </div>
      <div className="faint" style={{ fontSize: 11.5, textAlign: "end", marginBottom: 14 }}>{T("Auto-saved · just now", "حُفظ تلقائياً · الآن")}</div>

      {/* step content */}
      <div className="card card-pad" style={{ padding: 28, marginBottom: 14 }}>
        {step === 0 && <WizBasics {...{ T, ar, name, setName, cat, setCat, langs, setLangs, linkMode, setLinkMode, linkedJob, setLinkedJob, startFrom, setStartFrom, jobs }} />}
        {step === 1 && <WizAsk T={T} ar={ar} drafted={drafted} jobName={jobName} toast={toast} />}
        {step === 2 && <WizSay T={T} ar={ar} drafted={drafted} />}
        {step === 3 && <WizSound T={T} ar={ar} langs={langs} toast={toast} />}
        {step === 4 && <WizScore T={T} ar={ar} drafted={drafted} />}
        {step === 5 && <WizReview T={T} ar={ar} setStep={setStep} name={name} cat={cat} langs={langs} jobName={jobName} drafted={drafted} />}
      </div>

      {/* footer */}
      <div className="flex" style={{ alignItems: "center", gap: 12, position: "sticky", bottom: 0, background: "var(--canvas)", padding: "10px 0" }}>
        <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(s => s - 1)}><Icon name={ar ? "chevRight" : "chevLeft"} size={15} />{T("Back", "رجوع")}</button>
        <div className="spacer" style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 12 }}>{T(`Step ${step + 1} of 6`, `الخطوة ${step + 1} من 6`)}</span>
        {step < 5
          ? <button className="btn btn-primary" disabled={!valid} onClick={() => setStep(s => s + 1)}>{T("Next", "التالي")}<Icon name={ar ? "chevLeft" : "chevRight"} size={15} /></button>
          : <React.Fragment>
              <button className="btn btn-ghost" onClick={() => { toast(T("Saved as draft", "حُفظ كمسودة")); go("screening"); }}>{T("Save as draft", "حفظ كمسودة")}</button>
              <button className="btn btn-primary" onClick={() => setDone(true)}><Icon name="check" size={16} />{T("Launch agent", "إطلاق الوكيل")}</button>
            </React.Fragment>}
      </div>

      {discard && (
        <div className="scrim" onClick={() => setDiscard(false)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{T("Discard this agent?", "إلغاء هذا الوكيل؟")}</div><button className="btn-icon btn-sm" onClick={() => setDiscard(false)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body"><p style={{ fontSize: 14 }}>{T("Your progress will be lost. This can't be undone.", "سيُفقد تقدّمك. لا يمكن التراجع.")}</p></div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={() => setDiscard(false)}>{T("Keep editing", "متابعة")}</button><button className="btn btn-danger btn-sm" onClick={() => go("screening")}>{T("Discard", "إلغاء")}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* STEP 1 */
function WizBasics({ T, ar, name, setName, cat, setCat, langs, setLangs, linkMode, setLinkMode, linkedJob, setLinkedJob, startFrom, setStartFrom, jobs }) {
  const cats = [["technical", T("Technical", "تقني")], ["functional", T("Functional", "وظيفي")], ["behavioral", T("Behavioral", "سلوكي")], ["generic", T("Generic", "عام")]];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div><h1 style={{ fontSize: 22, letterSpacing: "-.02em" }}>{T("Let's set up your screening agent", "لنُعدّ وكيل الفرز")}</h1><p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{T("A few basics to get started. You can change everything later.", "أساسيات للبدء. يمكنك تغيير كل شيء لاحقاً.")}</p></div>
      <div className="field"><label>{T("Agent name", "اسم الوكيل")} *</label><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder={T("e.g. Engineering Senior Screen", "مثال: فرز الهندسة الأول")} autoFocus /><span className="hint">{T("Use a name your team will recognize.", "استخدم اسماً يعرفه فريقك.")}</span></div>
      <div className="field"><label>{T("Category", "الفئة")} *</label><select className="select" value={cat} onChange={e => setCat(e.target.value)}>{cats.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select><span className="hint">{T("We'll suggest different defaults based on category.", "سنقترح إعدادات مختلفة حسب الفئة.")}</span></div>
      <div className="field"><label>{T("Languages", "اللغات")} *</label>
        <div className="seg" style={{ display: "inline-flex", flexWrap: "wrap" }}>{[["en", T("English only", "الإنجليزية فقط")], ["ar", T("Arabic only", "العربية فقط")], ["both", T("English and Arabic", "الإنجليزية والعربية")]].map(([v, l]) => <button key={v} className={langs === v ? "on" : ""} onClick={() => setLangs(v)}>{l}</button>)}</div>
        <span className="hint">{T("Candidates choose which language to take the call in.", "يختار المرشحون لغة المكالمة.")}</span>
      </div>
      <div className="field"><label>{T("Link this agent to a job", "اربط الوكيل بوظيفة")}</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label className="flex" style={{ alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "10px 12px", border: "1.5px solid " + (linkMode === "link" ? "var(--accent)" : "var(--border)"), borderRadius: "var(--r-sm)", background: linkMode === "link" ? "var(--accent-soft)" : "transparent" }} onClick={() => setLinkMode("link")}>
            <span style={{ width: 17, height: 17, borderRadius: "50%", border: "1.5px solid " + (linkMode === "link" ? "var(--accent)" : "var(--border-strong)"), background: linkMode === "link" ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto", marginTop: 1 }}>{linkMode === "link" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}</span>
            <span style={{ flex: 1, fontSize: 13.5 }}><b>{T("Link to a specific job now", "اربط بوظيفة الآن")}</b>
              {linkMode === "link" && <div style={{ marginTop: 10 }} onClick={e => e.stopPropagation()}>
                <select className="select" value={linkedJob} onChange={e => setLinkedJob(e.target.value)}>{jobs.map(j => <option key={j.id} value={j.id}>{j[ar ? "ar" : "en"]}</option>)}</select>
                <div className="flex" style={{ alignItems: "flex-start", gap: 6, marginTop: 8, fontSize: 12, color: "var(--ai)" }}><Icon name="sparkles" size={12} fill style={{ flex: "0 0 auto", marginTop: 1 }} />{T("We'll use this job's JD, rubric, skills, and salary range to draft the agent.", "سنستخدم وصف الوظيفة ومعاييرها ومهاراتها ونطاق راتبها لصياغة الوكيل.")}</div>
              </div>}
            </span>
          </label>
          <label className="flex" style={{ alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "10px 12px", border: "1.5px solid " + (linkMode === "library" ? "var(--accent)" : "var(--border)"), borderRadius: "var(--r-sm)", background: linkMode === "library" ? "var(--accent-soft)" : "transparent" }} onClick={() => { setLinkMode("library"); if (startFrom === "ai") setStartFrom("starter"); }}>
            <span style={{ width: 17, height: 17, borderRadius: "50%", border: "1.5px solid " + (linkMode === "library" ? "var(--accent)" : "var(--border-strong)"), background: linkMode === "library" ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto", marginTop: 1 }}>{linkMode === "library" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}</span>
            <span style={{ fontSize: 13.5 }}><b>{T("Save to library — link to jobs later", "احفظ بالمكتبة — اربط لاحقاً")}</b><div className="faint" style={{ fontSize: 11.5, marginTop: 2 }}>{T("Build a generic template. Link it to jobs from the library after.", "ابنِ قالباً عاماً واربطه لاحقاً.")}</div></span>
          </label>
        </div>
      </div>
      <div className="field"><label>{T("Start from", "ابدأ من")} *</label>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[["ai", "sparkles", T("Draft from the linked job", "صياغة من الوظيفة"), T("AI generates a draft from the job's JD, rubric, and salary.", "يصيغ الذكاء مسودة من الوظيفة."), linkMode === "link"],
            ["starter", "doc", T("Start from a starter", "ابدأ من قالب"), T("Pick from Connect AI's starter library and customize.", "اختر قالباً جاهزاً وخصّصه."), true],
            ["blank", "edit", T("Start from blank", "ابدأ فارغاً"), T("Configure every step from scratch.", "اضبط كل خطوة من الصفر."), true]].map(([v, ic, t, d, avail]) => (
            <button key={v} disabled={!avail} onClick={() => setStartFrom(v)} className="card" style={{ padding: 14, textAlign: "start", opacity: avail ? 1 : .5, border: "1.5px solid " + (startFrom === v ? "var(--accent)" : "var(--border)"), background: startFrom === v ? "var(--accent-soft)" : "transparent", boxShadow: "none" }}>
              <Icon name={ic} size={17} fill={ic === "sparkles"} style={{ color: ic === "sparkles" ? "var(--ai)" : "var(--accent-strong)" }} />
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8 }}>{t}</div>
              <div className="faint" style={{ fontSize: 11.5, lineHeight: 1.5, marginTop: 3 }}>{d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* STEP 2 */
function WizAsk({ T, ar, drafted, jobName, toast }) {
  const [regen, setRegen] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [closers, setClosers] = React.useState(true);
  const goals = [
    { id: "g1", type: "knockout", title: T("Work authorization for KSA", "تصريح العمل في السعودية"), body: T("Are you currently authorized to work in Saudi Arabia without sponsorship?", "هل أنت مخوّل للعمل في السعودية دون كفالة؟"), meta: T("On fail: Flag for recruiter review", "عند الرسوب: وسم للمراجعة") },
    { id: "g2", type: "knockout", title: T("Salary expectation alignment", "توافق توقعات الراتب"), body: T("What's your salary expectation in SAR per month?", "ما توقعك للراتب بالريال شهرياً؟"), meta: T("Acceptable: 18,000 – 35,000", "المقبول: 18,000 – 35,000") },
    { id: "g3", type: "skill", title: T("React expertise depth", "عمق خبرة React"), body: T("Ask the candidate to describe a complex React component. Probe on state management, performance, and trade-offs.", "اطلب وصف مكوّن React معقّد. تعمّق في الحالة والأداء والمقايضات."), signal: T("Can articulate trade-offs, not just patterns", "يوضّح المقايضات لا الأنماط"), rubric: T("React (must)", "React (إلزامي)") },
    { id: "g4", type: "skill", title: T("Leadership experience", "الخبرة القيادية"), body: T("Ask about team size and direct mentoring. Probe on feedback style and biggest team challenge.", "اسأل عن حجم الفريق والإرشاد وأسلوب الملاحظات."), signal: T("Has actually led, not just been senior", "قاد فعلاً لا مجرد أقدمية"), rubric: T("Leadership (must)", "القيادة (إلزامي)") },
    { id: "g5", type: "standard", title: T("Closing questions", "أسئلة الختام"), body: T("Any questions about the role? · When could you start? · Anything else we should know?", "أسئلة عن الوظيفة؟ · متى تبدأ؟ · أي شيء آخر؟") },
  ];
  const pill = { knockout: ["var(--danger)", T("Knockout", "استبعاد")], skill: ["var(--accent)", T("Skill", "مهارة")], standard: ["var(--text-3)", T("Standard", "قياسي")] };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div><h1 style={{ fontSize: 22, letterSpacing: "-.02em" }}>{T("What should the AI screen for?", "ما الذي يفرزه الذكاء؟")}</h1><p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{T("Define the goals. The AI adapts the conversation to cover them.", "حدّد الأهداف. يكيّف الذكاء المحادثة لتغطيتها.")}</p></div>
      {drafted && <div className="card card-pad flex" style={{ gap: 12, alignItems: "center", borderInlineStart: "3px solid var(--ai)", background: "color-mix(in oklch, var(--ai) 7%, var(--surface))" }}><Icon name="sparkles" size={16} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} /><span style={{ flex: 1, fontSize: 13 }}>{regen ? <span className="ai-cursor">{T("Regenerating", "إعادة التوليد")}</span> : T(`AI drafted these from the ${jobName} job. Review before continuing.`, `صاغها الذكاء من وظيفة ${jobName}. راجعها قبل المتابعة.`)}</span><button className="btn btn-subtle btn-sm" onClick={() => { setRegen(true); setTimeout(() => { setRegen(false); toast(T("Goals regenerated", "أُعيد التوليد")); }, 1300); }}><Icon name="refresh" size={13} />{T("Regenerate", "إعادة")}</button></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {goals.map(g => (
          <div key={g.id} className="card" style={{ background: "var(--surface-2)", boxShadow: "none" }}>
            <div className="card-pad" style={{ padding: 14 }}>
              <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon name="drag" size={15} style={{ color: "var(--text-3)", cursor: "grab", flex: "0 0 auto" }} />
                <span className="badge" style={{ background: `color-mix(in oklch, ${pill[g.type][0]} 14%, var(--surface))`, color: pill[g.type][0], height: 19 }}>{pill[g.type][1]}</span>
                <span style={{ fontWeight: 600, fontSize: 13.5, flex: 1 }}>{g.title}</span>
                {g.type === "standard" ? <Switch on={closers} onChange={setClosers} /> : <React.Fragment><button className="btn-icon btn-sm" onClick={() => setEditId(editId === g.id ? null : g.id)}><Icon name="edit" size={14} /></button><button className="btn-icon btn-sm"><Icon name="trash" size={14} style={{ color: "var(--danger)" }} /></button></React.Fragment>}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55, paddingInlineStart: 23 }}>{g.body}</div>
              {g.meta && <div className="faint" style={{ fontSize: 11.5, marginTop: 5, paddingInlineStart: 23 }}>{g.meta}</div>}
              {g.signal && <div className="flex" style={{ gap: 8, marginTop: 8, paddingInlineStart: 23, flexWrap: "wrap" }}><span className="faint" style={{ fontSize: 11.5 }}><Icon name="target" size={11} style={{ color: "var(--ai)", verticalAlign: "-1px" }} /> {g.signal}</span><span className="badge badge-accent" style={{ height: 18, fontSize: 10.5 }}>{g.rubric}</span></div>}
              {editId === g.id && <div style={{ marginTop: 12, paddingInlineStart: 23, display: "flex", flexDirection: "column", gap: 8 }}><input className="input" defaultValue={g.title} style={{ height: 34 }} /><textarea className="textarea" rows={2} defaultValue={g.body} /><div className="flex" style={{ gap: 6, justifyContent: "flex-end" }}><button className="btn btn-subtle btn-sm" onClick={() => setEditId(null)}>{T("Cancel", "إلغاء")}</button><button className="btn btn-primary btn-sm" onClick={() => setEditId(null)}>{T("Save", "حفظ")}</button></div></div>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex" style={{ gap: 8, flexWrap: "wrap" }}>
        <button className="btn btn-subtle btn-sm" style={{ color: "var(--danger)" }}><Icon name="plus" size={13} />{T("Add knockout goal", "هدف استبعاد")}</button>
        <button className="btn btn-subtle btn-sm" style={{ color: "var(--accent-strong)" }}><Icon name="plus" size={13} />{T("Add skill goal", "هدف مهارة")}</button>
        <button className="btn btn-subtle btn-sm" style={{ color: "var(--text-2)" }}><Icon name="plus" size={13} />{T("Add standard goal", "هدف قياسي")}</button>
      </div>
      <div className="flex" style={{ alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--surface-2)", borderRadius: "var(--r-md)", fontSize: 12.5 }}><Icon name="clock" size={14} style={{ color: "var(--text-3)" }} />{T("Expected duration: ~14 min · 5 goals · 2 knockouts · 2 skill probes · 1 standard", "المدة المتوقعة: ~14 د · 5 أهداف · استبعادان · مهارتان · قياسي")}</div>
    </div>
  );
}

/* STEP 3 */
function WizSay({ T, ar, drafted }) {
  const [filter, setFilter] = React.useState("all");
  const [adding, setAdding] = React.useState(false);
  const [disclose, setDisclose] = React.useState(true);
  const entries = [
    { type: "role", title: T("Day-to-day responsibilities", "المهام اليومية"), body: T("Lead frontend development of our customer dashboard. Build features, mentor 2 juniors, contribute to architecture.", "قيادة تطوير واجهة لوحة العملاء. بناء الميزات وإرشاد مبتدئَين والمساهمة في المعمارية.") },
    { type: "role", title: T("Tech stack", "التقنيات"), body: "React, TypeScript, Next.js, Tailwind, GraphQL, Node.js, PostgreSQL, AWS" },
    { type: "comp", title: T("Salary range to disclose", "نطاق الراتب"), body: T("SAR 22,000 – 28,000 per month, depending on experience", "22,000 – 28,000 ريال شهرياً حسب الخبرة"), lock: true },
    { type: "comp", title: T("Vacation and benefits", "الإجازات والمزايا"), body: T("25 days paid vacation, health insurance, learning budget SAR 5,000/year", "25 يوم إجازة، تأمين صحي، ميزانية تعلّم 5,000 ريال/سنة") },
    { type: "process", title: T("Hiring process", "عملية التوظيف"), body: T("After this screen: technical interview, final interview, then offer. 2–3 weeks total.", "بعد الفرز: مقابلة تقنية، نهائية، ثم عرض. 2–3 أسابيع.") },
    { type: "process", title: T("Office and remote policy", "سياسة العمل"), body: T("Hybrid — 3 days in Riyadh office, 2 days remote.", "هجين — 3 أيام بمكتب الرياض، يومان عن بُعد.") },
  ];
  const pill = { role: ["var(--accent)", T("Role", "الوظيفة")], comp: ["var(--warning)", T("Compensation", "التعويض")], process: ["var(--ai)", T("Process", "العملية")] };
  const filters = [["all", T("All types", "الكل")], ["role", T("Role", "الوظيفة")], ["comp", T("Compensation", "التعويض")], ["process", T("Process", "العملية")]];
  const shown = entries.filter(e => filter === "all" || e.type === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div><h1 style={{ fontSize: 22, letterSpacing: "-.02em" }}>{T("What can the AI tell candidates?", "ماذا يخبر الذكاء المرشحين؟")}</h1><p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{T("The AI answers from this knowledge base. It never makes up information.", "يجيب الذكاء من قاعدة المعرفة هذه ولا يختلق معلومات.")}</p></div>
      {drafted && <div className="card card-pad flex" style={{ gap: 12, alignItems: "center", borderInlineStart: "3px solid var(--ai)", background: "color-mix(in oklch, var(--ai) 7%, var(--surface))" }}><Icon name="sparkles" size={16} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} /><span style={{ flex: 1, fontSize: 13 }}>{T("AI populated this from the job's JD and salary band. Review and add anything specific.", "ملأها الذكاء من الوظيفة. راجعها وأضف ما يلزم.")}</span></div>}
      <div className="warn-bar" style={{ padding: "10px 13px" }}><span className="wb-ico"><Icon name="alert" size={14} /></span><span className="wb-text" style={{ fontSize: 12.5 }}>{T("Anything not here, the AI responds: “Let me note that for your recruiter.” Be specific.", "ما ليس هنا، يردّ الذكاء: «سأدوّنه للمسؤول». كن محدّداً.")}</span></div>
      <div className="flex" style={{ gap: 7, flexWrap: "wrap" }}>{filters.map(([v, l]) => <button key={v} className={"btn btn-sm " + (filter === v ? "btn-primary" : "btn-subtle")} style={{ height: 28, fontSize: 12 }} onClick={() => setFilter(v)}>{l}</button>)}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {shown.map((e, i) => (
          <div key={i} className="card card-pad" style={{ padding: 14 }}>
            <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: `color-mix(in oklch, ${pill[e.type][0]} 14%, var(--surface))`, color: pill[e.type][0], height: 19 }}>{pill[e.type][1]}</span>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{e.title}</span>
              {e.lock && <Icon name="lock" size={12} style={{ color: "var(--text-3)" }} title={T("Sensitive — AI cites exactly", "حساس — يستشهد حرفياً")} />}
              <div className="spacer" style={{ flex: 1 }} />
              {e.lock && <label className="flex" style={{ alignItems: "center", gap: 6, fontSize: 11.5 }}><Switch on={disclose} onChange={setDisclose} />{T("Disclose", "إفصاح")}</label>}
              <button className="btn-icon btn-sm"><Icon name="edit" size={13} /></button>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55 }}>{e.body}</div>
          </div>
        ))}
      </div>
      {adding
        ? <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}><select className="select"><option>{T("Role", "الوظيفة")}</option><option>{T("Compensation", "التعويض")}</option><option>{T("Process", "العملية")}</option></select><input className="input" placeholder={T("Title", "العنوان")} /><textarea className="textarea" rows={2} placeholder={T("What the AI can say…", "ما يمكن للذكاء قوله…")} /><div className="flex" style={{ gap: 6, justifyContent: "flex-end" }}><button className="btn btn-subtle btn-sm" onClick={() => setAdding(false)}>{T("Cancel", "إلغاء")}</button><button className="btn btn-primary btn-sm" onClick={() => setAdding(false)}>{T("Save", "حفظ")}</button></div></div>
        : <button className="btn btn-subtle btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setAdding(true)}><Icon name="plus" size={13} />{T("Add knowledge entry", "أضف مدخلاً")}</button>}
      <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none" }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{T("What the AI says when it doesn't know", "ماذا يقول عند عدم المعرفة")}</div>
        <textarea className="textarea" rows={2} defaultValue={T("That's a good question. Let me note that for [Recruiter Name] to confirm after this call. Anything else?", "سؤال جيد. سأدوّنه ليؤكده [المسؤول] بعد المكالمة. أي شيء آخر؟")} />
        <label className="flex" style={{ alignItems: "center", gap: 9, marginTop: 10, cursor: "pointer", fontSize: 13 }}><Switch on={true} onChange={() => {}} />{T("Email recruiter with unanswered questions after the call", "إرسال الأسئلة غير المُجابة للمسؤول")}</label>
      </div>
    </div>
  );
}

/* STEP 4 */
function WizSound({ T, ar, langs, toast }) {
  const [voiceEn, setVoiceEn] = React.useState("sarah");
  const [voiceAr, setVoiceAr] = React.useState("layla");
  const [tone, setTone] = React.useState("professional");
  const [pace, setPace] = React.useState("natural");
  const [len, setLen] = React.useState("15");
  const voices = [
    { id: "sarah", lang: "en", name: "Sarah", desc: T("Warm · Professional · Female · English (American)", "ودود · مهني · أنثى · إنجليزي") },
    { id: "james", lang: "en", name: "James", desc: T("Calm · Direct · Male · English (British)", "هادئ · مباشر · ذكر · إنجليزي") },
    { id: "layla", lang: "ar", name: "Layla", desc: T("Warm · Professional · Female · Arabic (Gulf)", "ودود · مهني · أنثى · عربي خليجي") },
    { id: "omar", lang: "ar", name: "Omar", desc: T("Calm · Direct · Male · Arabic (Levantine)", "هادئ · مباشر · ذكر · عربي شامي") },
  ];
  const showEn = langs !== "ar", showAr = langs !== "en";
  const VoiceCard = ({ v, sel, onSel }) => (
    <div onClick={onSel} className="card card-pad" style={{ cursor: "pointer", border: "1.5px solid " + (sel ? "var(--accent)" : "var(--border)"), boxShadow: sel ? "var(--ring)" : "none" }}>
      <div className="flex" style={{ alignItems: "center", gap: 11 }}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, color-mix(in oklch,var(--ai) 55%,var(--accent)),var(--accent))", color: "#fff", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="sparkles" size={16} fill /></span>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{v.name}</div><div className="faint" style={{ fontSize: 11.5 }}>{v.desc}</div></div>
        <button className="btn-icon btn-sm" onClick={e => { e.stopPropagation(); toast(T("Playing voice…", "تشغيل الصوت…")); }}><Icon name="play" size={14} /></button>
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div><h1 style={{ fontSize: 22, letterSpacing: "-.02em" }}>{T("How should the AI sound?", "كيف يبدو الذكاء؟")}</h1><p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{T("Pick a voice and conversation style. Preview before saving.", "اختر صوتاً وأسلوباً. عاينه قبل الحفظ.")}</p></div>
      <div>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>{T("Voice", "الصوت")}</h3>
        {showEn && <div style={{ marginBottom: 10 }}><div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 6 }}>{T("English voice", "صوت إنجليزي")}</div><div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>{voices.filter(v => v.lang === "en").map(v => <VoiceCard key={v.id} v={v} sel={voiceEn === v.id} onSel={() => setVoiceEn(v.id)} />)}</div></div>}
        {showAr && <div><div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 6 }}>{T("Arabic voice", "صوت عربي")}</div><div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>{voices.filter(v => v.lang === "ar").map(v => <VoiceCard key={v.id} v={v} sel={voiceAr === v.id} onSel={() => setVoiceAr(v.id)} />)}</div></div>}
      </div>
      <div>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>{T("Conversation style", "أسلوب المحادثة")}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field"><label>{T("Tone", "النبرة")}</label><div className="seg" style={{ display: "inline-flex", flexWrap: "wrap" }}>{[["formal", T("Formal", "رسمي")], ["professional", T("Professional", "مهني")], ["friendly", T("Friendly", "ودّي")], ["casual", T("Casual", "عفوي")]].map(([v, l]) => <button key={v} className={tone === v ? "on" : ""} onClick={() => setTone(v)}>{l}</button>)}</div></div>
          <div className="field"><label>{T("Pace", "الإيقاع")}</label><div className="seg" style={{ display: "inline-flex" }}>{[["fast", T("Fast", "سريع")], ["natural", T("Natural", "طبيعي")], ["patient", T("Patient", "متأنٍّ")]].map(([v, l]) => <button key={v} className={pace === v ? "on" : ""} onClick={() => setPace(v)}>{l}</button>)}</div></div>
          <div className="field"><label>{T("Length target", "المدة المستهدفة")}</label><div className="seg" style={{ display: "inline-flex" }}>{["10", "15", "20"].map(v => <button key={v} className={len === v ? "on" : ""} onClick={() => setLen(v)}>~{v}m</button>)}</div><span className="hint">{T("Hard cap at 25 minutes regardless.", "حد أقصى 25 دقيقة.")}</span></div>
        </div>
      </div>
      <div className="card card-pad" style={{ borderInlineStart: "3px solid var(--ai)" }}>
        <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 10 }}><Icon name="sparkles" size={15} fill style={{ color: "var(--ai)" }} /><h3 style={{ fontSize: 14, flex: 1 }}>{T("Preview the agent", "معاينة الوكيل")}</h3><a className="muted" style={{ fontSize: 12, cursor: "pointer" }} onClick={() => toast(T("Regenerated", "أُعيد التوليد"))}>{T("Regenerate", "إعادة")}</a></div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-2)", fontStyle: "italic" }}>{T("“Hi Ahmed, thanks for taking the time today. I'm Sarah, an AI screening agent for Connect AI. We'll spend about 15 minutes talking through your background. Before we begin — are you ready?”", "«مرحباً أحمد، شكراً لوقتك. أنا سارة، وكيلة فرز بالذكاء من Connect AI. سنقضي نحو 15 دقيقة في الحديث عن خلفيتك. هل أنت مستعد؟»")}</p>
        <button className="btn btn-ai btn-sm" style={{ marginTop: 10 }} onClick={() => toast(T("Playing preview…", "تشغيل المعاينة…"))}><Icon name="play" size={14} />{T("Hear how this sounds (24s)", "اسمع كيف يبدو (24ث)")}</button>
      </div>
    </div>
  );
}

/* STEP 5 */
function WizScore({ T, ar, drafted }) {
  const [crits, setCrits] = React.useState([
    { l: T("React expertise", "خبرة React"), t: "must", w: 25 }, { l: "TypeScript", t: "must", w: 20 }, { l: T("Leadership", "القيادة"), t: "must", w: 20 },
    { l: T("Communication", "التواصل"), t: "must", w: 15 }, { l: T("Cultural fit", "الملاءمة"), t: "nice", w: 10 }, { l: T("Fintech motivation", "الدافع المالي"), t: "nice", w: 10 },
  ]);
  const [autoAdv, setAutoAdv] = React.useState(false);
  const [autoRej, setAutoRej] = React.useState(false);
  const total = crits.reduce((s, c) => s + c.w, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div><h1 style={{ fontSize: 22, letterSpacing: "-.02em" }}>{T("How is the evaluation scored?", "كيف يُقيَّم؟")}</h1><p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{T("The AI gives a draft score after the call. You always have the final say.", "يعطي الذكاء درجة مبدئية بعد المكالمة. القرار النهائي لك دائماً.")}</p></div>
      {drafted && <div className="card card-pad flex" style={{ gap: 12, alignItems: "center", borderInlineStart: "3px solid var(--ai)", background: "color-mix(in oklch, var(--ai) 7%, var(--surface))" }}><Icon name="sparkles" size={16} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} /><span style={{ flex: 1, fontSize: 13 }}>{T("Scoring criteria pulled from the job's rubric. Adjust weights below.", "سُحبت المعايير من معايير الوظيفة. عدّل الأوزان أدناه.")}</span></div>}
      <div>
        <h3 style={{ fontSize: 14, marginBottom: 4 }}>{T("What the AI scores", "ما يقيّمه الذكاء")}</h3>
        <p className="faint" style={{ fontSize: 12, marginBottom: 12 }}>{T("Each criterion comes from the linked job's rubric.", "كل معيار من معايير الوظيفة المرتبطة.")}</p>
        <div className="card" style={{ boxShadow: "none", border: "1px solid var(--border)" }}>
          {crits.map((c, i) => (
            <div key={i} className="flex" style={{ alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ flex: "0 0 150px", fontSize: 13, fontWeight: 500 }}>{c.l}</span>
              <span className={"badge " + (c.t === "must" ? "badge-accent" : "badge-neutral")} style={{ height: 18, fontSize: 10 }}>{c.t}</span>
              <input type="range" min="0" max="40" value={c.w} onChange={e => setCrits(cs => cs.map((x, j) => j === i ? { ...x, w: +e.target.value } : x))} style={{ flex: 1, accentColor: "var(--accent)" }} />
              <span className="mono" style={{ flex: "0 0 40px", textAlign: "end", fontWeight: 600 }}>{c.w}%</span>
            </div>
          ))}
          <div className="flex" style={{ alignItems: "center", padding: "10px 14px", fontWeight: 600, fontSize: 13 }}><span style={{ flex: 1 }}>{T("Total", "المجموع")}</span><span className="mono" style={{ color: total === 100 ? "var(--success)" : "var(--warning)" }}>{total}%</span></div>
        </div>
        <a className="muted" style={{ fontSize: 12, cursor: "pointer", marginTop: 8, display: "inline-block" }}>{T("Reset to job defaults", "إعادة لافتراضي الوظيفة")}</a>
      </div>
      <div>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>{T("AI recommendation", "توصية الذكاء")}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="flex" style={{ alignItems: "center", gap: 10 }}>
            <span style={{ width: 38, height: 22, borderRadius: 20, background: "var(--accent)", position: "relative", flex: "0 0 38px", opacity: .85 }}><span style={{ position: "absolute", top: 2, insetInlineStart: 18, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} /></span>
            <span style={{ flex: 1, fontSize: 13.5 }}>{T("Generate AI recommendation", "توليد توصية الذكاء")}<div className="faint" style={{ fontSize: 11.5 }}>{T("Suggests Advance or Reject based on scores.", "يقترح التقدّم أو الرفض حسب الدرجات.")}</div></span>
            <span className="badge badge-neutral" style={{ height: 19 }}><Icon name="lock" size={10} />{T("Locked", "مقفل")}</span>
          </div>
          {[["adv", autoAdv, setAutoAdv, T("Auto-advance high-confidence candidates", "تقديم تلقائي للمرشحين عالي الثقة")], ["rej", autoRej, setAutoRej, T("Auto-reject low-confidence candidates", "رفض تلقائي لمنخفضي الثقة")]].map(([k, val, set, label]) => (
            <div key={k}>
              <label className="flex" style={{ alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => set(v => !v)}>
                <span style={{ width: 38, height: 22, borderRadius: 20, background: val ? "var(--warning)" : "var(--border-strong)", position: "relative", flex: "0 0 38px", transition: "background .2s" }}><span style={{ position: "absolute", top: 2, insetInlineStart: val ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "inset-inline-start .2s" }} /></span>
                <span style={{ fontSize: 13.5 }}>{label}</span>
              </label>
              {val && <div className="warn-bar" style={{ marginTop: 8, marginInlineStart: 48 }}><span className="wb-ico"><Icon name="alert" size={14} /></span><span className="wb-text" style={{ fontSize: 12 }}>{T("This bypasses recruiter review. Most teams keep this OFF.", "هذا يتخطّى مراجعة المسؤول. معظم الفرق تُبقيه معطّلاً.")}</span></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* STEP 6 */
function WizReview({ T, ar, setStep, name, cat, langs, jobName, drafted }) {
  const langLabel = langs === "both" ? T("English and Arabic", "الإنجليزية والعربية") : langs === "ar" ? T("Arabic only", "العربية فقط") : T("English only", "الإنجليزية فقط");
  const card = (n, title, rows) => (
    <div className="card card-pad">
      <div className="flex" style={{ alignItems: "center", marginBottom: 10 }}><span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{n}. {title}</span><a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)" }} onClick={() => setStep(n - 1)}>{T("Edit", "تحرير")}</a></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{rows.map(([k, v], i) => <div key={i} className="flex" style={{ justifyContent: "space-between", gap: 12, fontSize: 13 }}><span className="faint">{k}</span><span style={{ fontWeight: 500, textAlign: "end" }}>{v}</span></div>)}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div><h1 style={{ fontSize: 22, letterSpacing: "-.02em" }}>{T("Ready to launch?", "جاهز للإطلاق؟")}</h1><p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{T("Review everything before going live. You can edit any section after launch.", "راجع كل شيء قبل الإطلاق. يمكنك التحرير لاحقاً.")}</p></div>
      {card(1, T("Basics", "الأساسيات"), [[T("Agent name", "الاسم"), name || "Engineering Senior Screen"], [T("Category", "الفئة"), cat], [T("Languages", "اللغات"), langLabel], [T("Linked to", "مرتبط بـ"), jobName], [T("Started from", "بدأ من"), drafted ? T("AI draft", "مسودة ذكاء") : T("Template", "قالب")]])}
      {card(2, T("What to ask", "ماذا يُسأل"), [[T("Goals", "الأهداف"), T("5 (2 knockouts · 2 skills · 1 standard)", "5 (استبعادان · مهارتان · قياسي)")], [T("Top goal", "أهم هدف"), T("React expertise depth", "عمق خبرة React")], [T("Duration", "المدة"), T("~14 minutes", "~14 دقيقة")]])}
      {card(3, T("What to say", "ماذا يُقال"), [[T("Knowledge entries", "المدخلات"), T("6 (2 role · 2 comp · 2 process)", "6 (وظيفة · تعويض · عملية)")], [T("Salary disclosure", "إفصاح الراتب"), T("ON", "مفعّل")]])}
      {card(4, T("How it sounds", "كيف يبدو"), [[T("Voice", "الصوت"), "Sarah (EN) + Layla (AR)"], [T("Style", "الأسلوب"), T("Professional · Natural · ~15 min", "مهني · طبيعي · ~15 د")]])}
      {card(5, T("How it scores", "كيف يُقيّم"), [[T("Criteria", "المعايير"), T("6 from job rubric", "6 من معايير الوظيفة")], [T("Auto-advance", "تقديم تلقائي"), T("OFF", "معطّل")], [T("Auto-reject", "رفض تلقائي"), T("OFF", "معطّل")]])}

      <div className="card card-pad" style={{ borderInlineStart: "3px solid var(--ai)" }}>
        <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 10 }}><Icon name="shield" size={15} style={{ color: "var(--ai)" }} /><h3 style={{ fontSize: 14, flex: 1 }}>{T("Compliance & consent", "الامتثال والموافقة")}</h3><a className="muted" style={{ fontSize: 12, cursor: "pointer" }}>{T("Customize consent text", "تخصيص نص الموافقة")}</a></div>
        <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "var(--text-2)", background: "var(--surface-2)", borderRadius: "var(--r-sm)", padding: "10px 12px", marginBottom: 12 }}>{T("This call will be conducted by an AI agent. The conversation will be recorded, transcribed, and analyzed. Kept for 90 days and reviewed by our team. You can stop anytime. By continuing, you consent.", "ستُجرى هذه المكالمة بواسطة وكيل ذكاء. ستُسجَّل وتُفرَّغ وتُحلَّل، وتُحفظ 90 يوماً ويراجعها فريقنا. يمكنك التوقف في أي وقت. بالمتابعة فإنك توافق.")}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[T("Content analysis only (no behavioral inference) — locked", "تحليل المحتوى فقط — مقفل"), T("Human always decides (no auto-reject) — confirmed", "القرار بشري دائماً — مؤكّد"), T("Right to challenge available — ON", "حق الاعتراض متاح — مفعّل")].map((l, i) => <div key={i} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 12.5 }}><Icon name="check" size={14} style={{ color: "var(--success)", flex: "0 0 auto" }} />{l}</div>)}
        </div>
        <div className="faint" style={{ fontSize: 11.5, marginTop: 10 }}>{T("Stricter rules apply for: EU, NYC, Illinois (auto-detected by candidate location)", "قواعد أصرم لـ: الاتحاد الأوروبي، نيويورك، إلينوي")}</div>
      </div>
    </div>
  );
}

function WizardSuccess({ T, ar, go, name, jobName }) {
  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}><Icon name="check" size={36} /></span>
        <h1 style={{ fontSize: 25, letterSpacing: "-.02em" }}>{T("Your screening agent is live", "وكيل الفرز جاهز")}</h1>
        <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>{name} {T("is ready to take calls.", "جاهز لإجراء المكالمات.")}</p>
      </div>
      <div className="card card-pad" style={{ marginTop: 18, borderInlineStart: "3px solid var(--accent)" }}>
        <div className="flex" style={{ alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{T("Linked to", "مرتبط بـ")}: {jobName}</div><div className="faint" style={{ fontSize: 12.5, marginTop: 3 }}>{T("When candidates reach the Screening Call stage, the agent invites them automatically.", "عند بلوغ المرشحين مرحلة الفرز، يدعوهم الوكيل تلقائياً.")}</div></div>
          <a className="muted" style={{ fontSize: 12.5, cursor: "pointer", color: "var(--accent)" }} onClick={() => go("jobs")}>{T("View job", "الوظيفة")} →</a>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
        {[["eye", T("Preview a call yourself", "عاين مكالمة"), () => go("screening-agent")], ["doc", T("View in library", "في المكتبة"), () => go("screening")], ["link2", T("Link to another job", "اربط بوظيفة أخرى"), () => go("screening-linked")], ["gear", T("Edit settings", "تحرير الإعدادات"), () => go("screening-agent")]].map(([ic, l, fn], i) => (
          <button key={i} className="card card-interactive card-pad" style={{ textAlign: "start" }} onClick={fn}><Icon name={ic} size={18} style={{ color: "var(--accent)" }} /><div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{l}</div></button>
        ))}
      </div>
      <div className="card card-pad flex" style={{ gap: 10, alignItems: "center", marginTop: 16, background: "var(--ai-soft)", boxShadow: "none" }}>
        <Icon name="alert" size={15} style={{ color: "var(--ai)", flex: "0 0 auto" }} />
        <span style={{ fontSize: 12.5, flex: 1 }}>{T("3 candidates are waiting in the Screening Call stage. They'll receive invitations within 1 hour.", "3 مرشحين ينتظرون في مرحلة الفرز. ستصلهم الدعوات خلال ساعة.")}</span>
        <a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)", fontWeight: 600 }} onClick={() => go("pipeline")}>{T("View pipeline", "المسار")} →</a>
      </div>
    </div>
  );
}

window.ScreeningWizard = ScreeningWizard;

export { ScreeningWizard, WizBasics, WizAsk, WizSay, WizSound, WizScore, WizReview, WizardSuccess }
