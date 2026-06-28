import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui';
import { Icon } from '../lib/icons';

/* Connect AI — Assessment builder (scratch + AI) and send/assign modal */

/* ============== BUILDER ============== */
function AssessmentBuilder({ mode, seed, onCancel, onSave, go, toast }) {
  const { L, lang } = useApp();
  const { TYPES, DOMAINS, DIFF, QTYPES } = window.ASSESS;
  const ar = lang === "ar";
  const editing = !!seed;

  // AI sub-state
  const [aiStage, setAiStage] = React.useState(mode === "ai" && !seed ? "input" : "form"); // input | generating | form
  const [jdSource, setJdSource] = React.useState("paste"); // paste | job | describe
  const [jdText, setJdText] = React.useState("");
  const [jdJob, setJdJob] = React.useState("");
  const [steer, setSteer] = React.useState(null);

  const [title, setTitle] = React.useState(seed ? L(seed.title) : "");
  const [type, setType] = React.useState(seed ? seed.type : "technical");
  const [domain, setDomain] = React.useState(seed ? seed.domain : "programming");
  const [diff, setDiff] = React.useState(seed ? seed.difficulty : "medium");
  const [dur, setDur] = React.useState(seed ? seed.duration : 45);
  const [pass, setPass] = React.useState(seed ? (seed.passMark || "") : "");
  const [instr, setInstr] = React.useState(seed ? L(seed.instr || {}) : "");
  const [qLang, setQLang] = React.useState(seed && seed.qLang ? seed.qLang : lang);
  const [qs, setQs] = React.useState(seed ? seed.questions.map(q => ({ ...q })) : []);
  const [preview, setPreview] = React.useState(false);
  const [addMenu, setAddMenu] = React.useState(false);
  const [aiBanner, setAiBanner] = React.useState(false);
  const [explAll, setExplAll] = React.useState(true);

  const domainOpts = Object.keys(DOMAINS).filter(k => DOMAINS[k].type === type);
  React.useEffect(() => { if (!domainOpts.includes(domain)) setDomain(domainOpts[0]); }, [type]);

  const runAI = (steering) => {
    setAiStage("generating");
    setSteer(steering || null);
    setTimeout(() => {
      const gen = window.ASSESS.sampleQ(type, domain);
      const job = window.DATA.jobs.find(j => j.id === jdJob);
      const rationales = ar
        ? ["يختبر مهارة أساسية مطلوبة", "يقيس العمق التقني في الدور", "يكشف مهارة مرغوبة إضافية", "يقيّم التواصل والوضوح", "يتحقق من القدرة على حل المشكلات"]
        : ["Tests a must-have skill", "Measures technical depth for the role", "Probes a nice-to-have skill", "Assesses communication & clarity", "Checks problem-solving ability"];
      setTitle(jdSource === "job" && job ? L(job) + (ar ? " — تقييم" : " — Assessment") : (ar ? "تقييم مولّد بالذكاء" : "AI-generated assessment"));
      setQs(gen.map((q, i) => ({ ...q, _ai: true, rationale: rationales[i % rationales.length], qdiff: q.qdiff || diff, skills: [], expl: { en: "", ar: "" } })));
      setDur(45); setPass(70);
      setInstr(ar ? "أكمل جميع الأسئلة خلال الوقت المحدد. تُقيَّم الأسئلة المفتوحة بواسطة الذكاء الاصطناعي ثم يراجعها فريق التوظيف." : "Complete all questions within the time limit. Open-ended questions are AI-scored and reviewed by the hiring team.");
      setAiBanner(true);
      setAiStage("form");
    }, 2200);
  };

  const regenQ = (i) => {
    const pool = window.ASSESS.sampleQ(type, domain);
    const fresh = pool[Math.floor(Math.random() * pool.length)];
    upQ(i, { ...fresh, _ai: true, rationale: (ar ? "أُعيد توليده — " : "Regenerated — ") + (ar ? "يختبر مهارة أساسية" : "tests a must-have skill"), qdiff: diff, skills: [], expl: { en: "", ar: "" } });
    toast && toast(ar ? "أُعيد توليد السؤال" : "Question regenerated");
  };

  const buildObj = (status) => {
    const typeMix = {}; qs.forEach(q => typeMix[q.t] = (typeMix[q.t] || 0) + 1);
    return {
      id: seed ? seed.id : "as" + Date.now(),
      title: { en: title, ar: title }, type, domain, difficulty: diff, duration: +dur, qLang,
      passMark: pass ? +pass : null, instr: { en: instr, ar: instr },
      questions: qs, qCount: qs.length, typeMix,
      status, source: seed ? seed.source : (mode === "ai" ? "ai" : "custom"),
      updated: { en: "just now", ar: "الآن" }, usage: seed ? seed.usage : 0, avgScore: seed ? seed.avgScore : null,
      versions: seed ? seed.versions : [{ v: "v1", date: { en: "just now", ar: "الآن" }, status: "current", usage: 0 }],
      version: seed ? seed.version : "v1",
    };
  };

  const addQ = (qt) => {
    setAddMenu(false);
    setQs(list => [...list, { t: qt, q: { en: "", ar: "" }, pts: qt === "likert" ? 0 : 5, qdiff: "medium", skills: [], expl: { en: "", ar: "" }, opts: (qt === "mcq" || qt === "multi") ? [{ en: "", ar: "" }, { en: "", ar: "" }] : undefined }]);
  };
  const upQ = (i, patch) => setQs(list => list.map((q, j) => j === i ? { ...q, ...patch } : q));
  const delQ = (i) => setQs(list => list.filter((_, j) => j !== i));

  // AI input stage
  if (aiStage === "input") {
    return (
      <div className="page" style={{ maxWidth: 760 }}>
        <div className="crumbs" style={{ marginBottom: 12 }}><a onClick={onCancel}>{ar ? "مكتبة التقييمات" : "Assessment Library"}</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} /><span style={{ color: "var(--text-2)" }}>{ar ? "توليد بالذكاء" : "Generate with AI"}</span></div>
        <div className="card card-pad" style={{ borderInlineStart: "3px solid var(--ai)" }}>
          <div className="flex" style={{ alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 36, height: 36, borderRadius: 9, background: "var(--ai-soft)", color: "var(--ai)", display: "grid", placeItems: "center" }}><Icon name="sparkles" size={19} fill /></span>
            <div><h2 style={{ fontSize: 18 }}>{ar ? "توليد تقييم بالذكاء الاصطناعي" : "Generate an assessment with AI"}</h2>
              <div className="faint" style={{ fontSize: 13 }}>{ar ? "ألصق وصفاً وظيفياً أو اختر وظيفة، وسننشئ تقييماً مناسباً للدور." : "Paste a job description or pick a job, and we'll build a role-relevant assessment."}</div></div>
          </div>
          <div className="seg" style={{ margin: "16px 0", flexWrap: "wrap" }}>
            <button className={jdSource === "paste" ? "on" : ""} onClick={() => setJdSource("paste")}>{ar ? "لصق وصف وظيفي" : "Paste a JD"}</button>
            <button className={jdSource === "job" ? "on" : ""} onClick={() => setJdSource("job")}>{ar ? "وظيفة قائمة" : "Existing job"}</button>
            <button className={jdSource === "describe" ? "on" : ""} onClick={() => setJdSource("describe")}>{ar ? "وصف بجملة" : "Describe it"}</button>
          </div>
          {jdSource === "paste" &&
            <><textarea className="textarea" rows={7} value={jdText} onChange={e => setJdText(e.target.value)} placeholder={ar ? "ألصق الوصف الوظيفي هنا…" : "Paste the job description here…"} />
              <div className="faint" style={{ fontSize: 11.5, marginTop: 5, textAlign: "end" }}>{jdText.length} / 100 {ar ? "حرف كحد أدنى" : "min characters"}</div></>}
          {jdSource === "job" &&
            <select className="select" value={jdJob} onChange={e => setJdJob(e.target.value)}><option value="">{ar ? "اختر وظيفة…" : "Choose a job…"}</option>{window.DATA.jobs.map(j => <option key={j.id} value={j.id}>{L(j)}</option>)}</select>}
          {jdSource === "describe" &&
            <textarea className="textarea" rows={3} value={jdText} onChange={e => setJdText(e.target.value)} placeholder={ar ? "صف التقييم في جملة أو جملتين… مثال: تقييم عملي لمهندس واجهات أول يركز على React والأداء." : "Describe the assessment in 1–2 sentences… e.g. A practical assessment for a senior frontend engineer focused on React and performance."} />}
          <div className="flex" style={{ gap: 14, marginTop: 16, flexWrap: "wrap" }}>
            <div className="field" style={{ flex: "1 1 150px" }}><label>{ar ? "نوع التقييم" : "Assessment type"}</label>
              <select className="select" value={type} onChange={e => setType(e.target.value)}>{Object.keys(TYPES).map(k => <option key={k} value={k}>{L(TYPES[k])}</option>)}</select></div>
            <div className="field" style={{ flex: "1 1 150px" }}><label>{ar ? "المجال" : "Domain"}</label>
              <select className="select" value={domain} onChange={e => setDomain(e.target.value)}>{domainOpts.map(k => <option key={k} value={k}>{L(DOMAINS[k])}</option>)}</select></div>
            <div className="field" style={{ flex: "1 1 130px" }}><label>{ar ? "لغة التوليد" : "Generate in"}</label>
              <select className="select" value={qLang} onChange={e => setQLang(e.target.value)}><option value="en">English</option><option value="ar">العربية</option></select></div>
          </div>
          <div className="flex" style={{ gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={onCancel}>{ar ? "إلغاء" : "Cancel"}</button>
            <button className="btn btn-ai" disabled={jdSource === "job" ? !jdJob : jdSource === "paste" ? jdText.length < 100 : jdText.length < 20} onClick={() => runAI()}><Icon name="sparkles" size={16} fill />{ar ? "توليد التقييم" : "Generate assessment"}</button>
          </div>
        </div>
      </div>
    );
  }

  if (aiStage === "generating") {
    return (
      <div className="page" style={{ maxWidth: 760 }}>
        <div className="card card-pad" style={{ textAlign: "center", padding: 60, borderInlineStart: "3px solid var(--ai)" }}>
          <span style={{ width: 52, height: 52, borderRadius: 13, background: "var(--ai-soft)", color: "var(--ai)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}><Icon name="sparkles" size={26} fill /></span>
          <div style={{ fontSize: 16, fontWeight: 600 }} className="ai-cursor">{ar ? "الذكاء الاصطناعي يكتب تقييمك" : "AI is writing your assessment"}</div>
          <div className="faint" style={{ fontSize: 13, marginTop: 8 }}>{ar ? "اقتراح نوع الأسئلة، العدد، والوقت المناسب…" : "Suggesting question mix, count, and time limit…"}</div>
        </div>
      </div>
    );
  }

  // FORM (scratch or post-AI)
  const valid = title.trim() && qs.length > 0;
  return (
    <div className="page" style={{ maxWidth: 920 }}>
      <div className="crumbs" style={{ marginBottom: 12 }}><a onClick={onCancel}>{ar ? "مكتبة التقييمات" : "Assessment Library"}</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} /><span style={{ color: "var(--text-2)" }}>{editing ? (ar ? "تحرير" : "Edit") : (ar ? "تقييم جديد" : "New assessment")}</span></div>

      <div className="page-head">
        <h1 className="page-title">{editing ? (ar ? "تحرير التقييم" : "Edit assessment") : (ar ? "إنشاء تقييم" : "Create assessment")}</h1>
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={() => toast && toast(ar ? "أُرسل رابط اختبار إلى بريدك" : "Test link sent to your email")} disabled={!qs.length}><Icon name="send" size={16} />{ar ? "إرسال اختبار لنفسي" : "Send test to myself"}</button>
        <button className="btn btn-ghost" onClick={() => setPreview(true)} disabled={!qs.length}><Icon name="eye" size={16} />{ar ? "معاينة" : "Preview"}</button>
        <button className="btn btn-ghost" onClick={() => onSave(buildObj("draft"))} disabled={!title.trim()}>{ar ? "حفظ كمسودة" : "Save draft"}</button>
        <button className="btn btn-primary" onClick={() => onSave(buildObj("published"))} disabled={!valid}>{ar ? "نشر" : "Publish"}</button>
      </div>

      {aiBanner && (
        <div className="card card-pad" style={{ borderInlineStart: "3px solid var(--ai)", background: "color-mix(in oklch, var(--ai) 7%, var(--surface))", marginBottom: "var(--gap)" }}>
          <div className="flex" style={{ gap: 12, alignItems: "center" }}>
            <Icon name="sparkles" size={17} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} />
            <span style={{ flex: 1, fontSize: 13 }}>{ar ? "مسودة مولّدة بالذكاء — راجع وعدّل قبل النشر." : "AI-generated draft — review and edit before publishing."}</span>
            <button className="btn btn-subtle btn-sm" onClick={() => { setQs(list => list.map(q => { const c = { ...q }; delete c._ai; return c; })); setAiBanner(false); toast && toast(ar ? "تمت المراجعة" : "Marked as reviewed"); }}><Icon name="check" size={13} />{ar ? "تمت المراجعة" : "Mark reviewed"}</button>
            <button className="btn-icon btn-sm" onClick={() => setAiBanner(false)}><Icon name="x" size={15} /></button>
          </div>
          <div className="flex" style={{ gap: 7, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span className="faint" style={{ fontSize: 12, fontWeight: 600 }}>{ar ? "إعادة توليد الكل:" : "Regenerate all:"}</span>
            {[{ k: "practical", en: "More practical", ar: "أكثر عملية" }, { k: "theoretical", en: "More theoretical", ar: "أكثر نظرية" }, { k: "harder", en: "Harder", ar: "أصعب" }].map(s => (
              <button key={s.k} className="chip" style={{ cursor: "pointer", height: 28 }} onClick={() => runAI(s.k)}><Icon name="sparkles" size={12} />{L(s)}</button>
            ))}
            <button className="btn btn-subtle btn-sm" onClick={() => runAI()}><Icon name="refresh" size={13} />{ar ? "إعادة توليد" : "Regenerate"}</button>
          </div>
        </div>
      )}

      {/* details */}
      <div className="card" style={{ marginBottom: "var(--gap)" }}>
        <div className="card-head"><h3>{ar ? "تفاصيل التقييم" : "Assessment details"}</h3></div>
        <div className="card-pad grid" style={{ gap: 16 }}>
          <div className="field"><label>{ar ? "العنوان" : "Title"} *</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder={ar ? "مثال: مهارات هندسة الواجهات" : "e.g. Frontend Engineering Skills"} /></div>
          <div className="flex" style={{ gap: 16, flexWrap: "wrap" }}>
            <div className="field" style={{ flex: "1 1 160px" }}><label>{ar ? "النوع" : "Type"} *</label><select className="select" value={type} onChange={e => setType(e.target.value)}>{Object.keys(TYPES).map(k => <option key={k} value={k}>{L(TYPES[k])}</option>)}</select></div>
            <div className="field" style={{ flex: "1 1 160px" }}><label>{ar ? "المجال" : "Domain"} *</label><select className="select" value={domain} onChange={e => setDomain(e.target.value)}>{domainOpts.map(k => <option key={k} value={k}>{L(DOMAINS[k])}</option>)}</select></div>
            <div className="field" style={{ flex: "1 1 120px" }}><label>{ar ? "الصعوبة" : "Difficulty"}</label><select className="select" value={diff} onChange={e => setDiff(e.target.value)}>{Object.keys(DIFF).map(k => <option key={k} value={k}>{L(DIFF[k])}</option>)}</select></div>
            <div className="field" style={{ flex: "1 1 110px" }}><label>{ar ? "المدة (دقيقة)" : "Time (min)"}</label><input className="input" type="number" value={dur} onChange={e => setDur(e.target.value)} /></div>
            <div className="field" style={{ flex: "1 1 110px" }}><label>{ar ? "درجة النجاح %" : "Pass mark %"}</label><input className="input" type="number" value={pass} onChange={e => setPass(e.target.value)} placeholder={ar ? "اختياري" : "Optional"} /></div>
            <div className="field" style={{ flex: "1 1 120px" }}><label>{ar ? "اللغة" : "Language"}</label><select className="select" value={qLang} onChange={e => setQLang(e.target.value)}><option value="en">English</option><option value="ar">العربية</option></select></div>
          </div>
          <div className="field"><label>{ar ? "التعليمات (اختياري)" : "Instructions (optional)"}</label><textarea className="textarea" rows={2} value={instr} onChange={e => setInstr(e.target.value)} /></div>
          <label className="flex" style={{ alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13 }}>
            <span onClick={() => setExplAll(v => !v)} style={{ width: 30, height: 17, borderRadius: 20, background: explAll ? "var(--accent)" : "var(--border-strong)", position: "relative", flex: "0 0 30px", transition: "background .2s" }}><span style={{ position: "absolute", top: 2, insetInlineStart: explAll ? 15 : 2, width: 13, height: 13, borderRadius: "50%", background: "#fff", transition: "inset-inline-start .2s" }} /></span>
            {ar ? "إظهار شرح الإجابة للمرشح بعد التسليم" : "Show answer explanations to candidate after submission"}
          </label>
        </div>
      </div>

      {/* questions */}
      <div className="card">
        <div className="card-head"><h3>{ar ? "الأسئلة" : "Questions"} <span className="faint mono" style={{ fontWeight: 400, fontSize: 13 }}>({qs.length})</span></h3>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-subtle btn-sm" onClick={() => { setQs(list => [...list, ...window.ASSESS.sampleQ(type, domain).slice(0, 2).map(q => ({ ...q }))]); }}><Icon name="list" size={14} />{ar ? "من بنك الأسئلة" : "From bank"}</button>
          <div style={{ position: "relative" }}>
            <button className="btn btn-primary btn-sm" onClick={() => setAddMenu(m => !m)}><Icon name="plus" size={15} />{ar ? "إضافة سؤال" : "Add question"}</button>
            {addMenu && (<>
              <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setAddMenu(false)} />
              <div className="kebab-menu" style={{ insetInlineEnd: 0, minWidth: 220 }}>
                {Object.keys(QTYPES).filter(k => QTYPES[k].scope.includes(type) && QTYPES[k].authored !== false).map(k => (
                  <button key={k} onClick={() => addQ(k)}><Icon name={QTYPES[k].icon} size={14} />{L(QTYPES[k])}{QTYPES[k].note && <span className="faint" style={{ fontSize: 10.5, marginInlineStart: "auto" }}>{L(QTYPES[k].note)}</span>}</button>
                ))}
                {type === "technical" && (
                  <div style={{ padding: "8px 10px", borderTop: "1px solid var(--border)", marginTop: 4 }}>
                    <div className="faint" style={{ fontSize: 11, lineHeight: 1.5 }}><Icon name="code" size={11} style={{ marginInlineEnd: 4 }} />{ar ? "التحديات البرمجية تُوجّه عبر مزود متكامل (Epic 12.5)" : "Code challenges are routed via an integrated provider (Epic 12.5)"}</div>
                  </div>
                )}
              </div>
            </>)}
          </div>
        </div>
        <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {qs.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "var(--text-3)", fontSize: 13.5 }}>{ar ? "لا أسئلة بعد. أضف سؤالاً أو اسحب من بنك الأسئلة." : "No questions yet. Add one or pull from the question bank."}</div>}
          {qs.map((qq, i) => (
            <div key={i} className="card" style={{ background: "var(--surface-2)", boxShadow: "none" }}>
              <div className="card-pad" style={{ padding: 14 }}>
                <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span className="mono" style={{ width: 24, height: 24, borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 11.5 }}>{i + 1}</span>
                  <QType t={qq.t} sm />
                  {qq._ai && <span className="badge badge-ai" style={{ height: 19 }}><Icon name="sparkles" size={10} fill />{ar ? "ذكاء" : "AI"}</span>}
                  <div className="spacer" style={{ flex: 1 }} />
                  {qq._ai && <button className="btn-icon btn-sm" title={ar ? "إعادة توليد هذا السؤال" : "Regenerate this question"} onClick={() => regenQ(i)}><Icon name="refresh" size={14} style={{ color: "var(--ai)" }} /></button>}
                  {qq.t !== "likert" && <input className="input" type="number" value={qq.pts} onChange={e => upQ(i, { pts: +e.target.value })} style={{ width: 78, height: 30, fontSize: 12.5 }} title={ar ? "النقاط" : "Points"} />}
                  <button className="btn-icon btn-sm" onClick={() => delQ(i)}><Icon name="trash" size={15} style={{ color: "var(--danger)" }} /></button>
                </div>
                {qq._ai && qq.rationale && <div className="flex" style={{ alignItems: "center", gap: 6, marginBottom: 9, fontSize: 11.5, color: "var(--ai)" }}><Icon name="sparkles" size={11} />{ar ? "سبب الإدراج: " : "Why included: "}<span style={{ color: "var(--text-2)" }}>{qq.rationale}</span></div>}
                <input className="input" value={L(qq.q)} onChange={e => upQ(i, { q: { en: e.target.value, ar: e.target.value } })} placeholder={ar ? "نص السؤال…" : "Question text…"} style={{ marginBottom: qq.opts ? 10 : 0 }} />
                {qq.opts && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {qq.opts.map((o, j) => (
                      <div key={j} className="flex" style={{ alignItems: "center", gap: 8 }}>
                        <button onClick={() => upQ(i, { opts: qq.opts.map((x, k) => qq.t === "multi" ? (k === j ? { ...x, correct: !x.correct } : x) : { ...x, correct: k === j }) })}
                          style={{ width: 18, height: 18, borderRadius: qq.t === "multi" ? 4 : "50%", border: "1.5px solid " + (o.correct ? "var(--success)" : "var(--border-strong)"), background: o.correct ? "var(--success)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                          {o.correct && <Icon name="check" size={11} style={{ color: "#fff" }} />}
                        </button>
                        <input className="input" value={L(o)} onChange={e => upQ(i, { opts: qq.opts.map((x, k) => k === j ? { en: e.target.value, ar: e.target.value, correct: x.correct } : x) })} placeholder={(ar ? "خيار " : "Option ") + (j + 1)} style={{ height: 32, fontSize: 13 }} />
                        {qq.opts.length > 2 && <button className="btn-icon btn-sm" onClick={() => upQ(i, { opts: qq.opts.filter((_, k) => k !== j) })}><Icon name="x" size={14} /></button>}
                      </div>
                    ))}
                    <button className="btn btn-subtle btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => upQ(i, { opts: [...qq.opts, { en: "", ar: "" }] })}><Icon name="plus" size={13} />{ar ? "خيار" : "Option"}</button>
                  </div>
                )}
                {/* per-question advanced: difficulty, skill tags, explanation */}
                <div className="flex" style={{ gap: 10, marginTop: 11, flexWrap: "wrap", alignItems: "center" }}>
                  <div className="flex" style={{ alignItems: "center", gap: 6 }}>
                    <span className="faint" style={{ fontSize: 11.5, fontWeight: 600 }}>{ar ? "الصعوبة" : "Difficulty"}</span>
                    <select className="select" value={qq.qdiff || "medium"} onChange={e => upQ(i, { qdiff: e.target.value })} style={{ height: 28, width: "auto", fontSize: 12 }}>
                      {Object.keys(DIFF).map(k => <option key={k} value={k}>{L(DIFF[k])}</option>)}
                    </select>
                  </div>
                  <div className="flex" style={{ alignItems: "center", gap: 6, flex: "1 1 160px" }}>
                    <span className="faint" style={{ fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap" }}>{ar ? "وسوم المهارة" : "Skill tags"}</span>
                    <input className="input" value={(qq.skills || []).join(", ")} onChange={e => upQ(i, { skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} placeholder={ar ? "مثال: React، أداء" : "e.g. React, performance"} style={{ height: 28, fontSize: 12, flex: 1 }} />
                  </div>
                </div>
                {explAll && (
                  <input className="input" value={L(qq.expl || {})} onChange={e => upQ(i, { expl: { en: e.target.value, ar: e.target.value } })} placeholder={ar ? "شرح الإجابة (يُعرَض بعد التسليم)…" : "Answer explanation (shown after submission)…"} style={{ height: 32, fontSize: 12.5, marginTop: 9 }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {preview && <PreviewModal a={buildObj("draft")} onClose={() => setPreview(false)} />}
    </div>
  );
}

/* ============== SEND / ASSIGN MODAL ============== */
function SendAssessmentModal({ a, onClose, toast, presetCandidate }) {
  const { L, lang } = useApp();
  const { STATUS } = window.ASSESS;
  const ar = lang === "ar";
  const pool = window.ASSESS.SEND_POOL;
  const [step, setStep] = React.useState("select"); // select | confirm | report
  const [picked, setPicked] = React.useState(presetCandidate ? [presetCandidate] : []);
  const [q, setQ] = React.useState("");
  const [deadline, setDeadline] = React.useState(5);
  const [remind, setRemind] = React.useState(true);
  const [msg, setMsg] = React.useState("");

  const toggle = (id) => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : (p.length >= 50 ? p : [...p, id]));
  const filtered = pool.filter(c => !q || L(c.name).toLowerCase().includes(q.toLowerCase()));
  const failed = picked.map(id => pool.find(c => c.id === id)).filter(c => c.asState === "expired");
  const ok = picked.filter(id => { const c = pool.find(x => x.id === id); return c.asState !== "expired"; });

  const send = () => { setStep("report"); };

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 620, width: "100%" }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{ar ? "إرسال تقييم" : "Send assessment"}</div>
            <div className="faint" style={{ fontSize: 12.5, marginTop: 2 }}>{L(a.title)}</div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17} /></button>
        </div>

        {step === "select" && (
          <>
            <div className="modal-body">
              <div className="flex" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{ar ? "اختر المرشحين" : "Select candidates"}</span>
                <span className="faint" style={{ fontSize: 12 }}>{picked.length}/50 {ar ? "محدد" : "selected"}</span>
              </div>
              <div className="searchbar" style={{ height: 36, marginBottom: 10 }}><Icon name="search" size={14} /><input value={q} onChange={e => setQ(e.target.value)} placeholder={ar ? "ابحث…" : "Search…"} /></div>
              <div style={{ maxHeight: 230, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, marginBottom: 18 }}>
                {filtered.map(c => {
                  const on = picked.includes(c.id);
                  const st = STATUS[c.asState];
                  return (
                    <button key={c.id} onClick={() => toggle(c.id)} className="flex" style={{ alignItems: "center", gap: 11, padding: "8px 10px", borderRadius: "var(--r-sm)", background: on ? "var(--accent-soft)" : "transparent", textAlign: "start" }}>
                      <span style={{ width: 18, height: 18, borderRadius: 5, border: "1.5px solid " + (on ? "var(--accent)" : "var(--border-strong)"), background: on ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto" }}>{on && <Icon name="check" size={12} style={{ color: "#fff" }} />}</span>
                      <Avatar c={c} size={30} />
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{L(c.name)}</div><div className="faint" style={{ fontSize: 11.5 }}>{c.email}</div></div>
                      {c.asState !== "none" && <span className="badge" style={{ background: st.soft, color: st.color, height: 19 }}>{L(st)}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="flex" style={{ gap: 14, flexWrap: "wrap" }}>
                <div className="field" style={{ flex: "1 1 150px" }}><label>{ar ? "الموعد النهائي" : "Deadline"}</label>
                  <select className="select" value={deadline} onChange={e => setDeadline(+e.target.value)}>{[3, 5, 7, 14].map(d => <option key={d} value={d}>{d} {ar ? "أيام" : "days"}</option>)}</select></div>
                <div className="field" style={{ flex: "1 1 150px" }}><label>{ar ? "التذكير" : "Reminders"}</label>
                  <button className="flex" onClick={() => setRemind(r => !r)} style={{ alignItems: "center", gap: 9, height: "var(--row-h)", padding: "0 13px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", width: "100%" }}>
                    <span style={{ width: 30, height: 17, borderRadius: 20, background: remind ? "var(--accent)" : "var(--border-strong)", position: "relative", flex: "0 0 30px", transition: "background .2s" }}><span style={{ position: "absolute", top: 2, insetInlineStart: remind ? 15 : 2, width: 13, height: 13, borderRadius: "50%", background: "#fff", transition: "inset-inline-start .2s" }} /></span>
                    <span style={{ fontSize: 12.5, color: "var(--text-2)" }}>{ar ? "قبل 24 ساعة" : "24h before"}</span>
                  </button></div>
              </div>
              <div className="field" style={{ marginTop: 14 }}><label>{ar ? "رسالة شخصية (اختياري)" : "Personal message (optional)"}</label><textarea className="textarea" rows={2} value={msg} onChange={e => setMsg(e.target.value)} placeholder={ar ? "أضف ملاحظة للمرشح…" : "Add a note for the candidate…"} /></div>
            </div>
            <div className="modal-foot">
              <span className="faint" style={{ fontSize: 12.5, flex: 1 }}>{ar ? `كل مرشح يتلقى رابطاً فريداً للاستخدام مرة واحدة` : "Each candidate gets a unique, single-use link"}</span>
              <button className="btn btn-ghost btn-sm" onClick={onClose}>{ar ? "إلغاء" : "Cancel"}</button>
              <button className="btn btn-primary btn-sm" disabled={!picked.length} onClick={() => picked.length > 1 ? setStep("confirm") : send()}><Icon name="send" size={14} />{picked.length > 1 ? (ar ? `مراجعة (${picked.length})` : `Review (${picked.length})`) : (ar ? "إرسال" : "Send")}</button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <div className="modal-body">
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>{ar ? "تأكيد الإرسال الجماعي" : "Confirm bulk send"}</div>
              <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none", marginBottom: 14 }}>
                <Row label={ar ? "التقييم" : "Assessment"} value={L(a.title)} />
                <Row label={ar ? "المرشحون" : "Candidates"} value={picked.length} />
                <Row label={ar ? "الموعد النهائي" : "Deadline"} value={deadline + (ar ? " أيام" : " days")} />
                <Row label={ar ? "التذكير" : "Reminders"} value={remind ? (ar ? "مفعّل" : "On") : (ar ? "معطّل" : "Off")} last />
              </div>
              {failed.length > 0 && (
                <div className="card card-pad flex" style={{ gap: 10, alignItems: "flex-start", background: "var(--warning-soft)", borderColor: "color-mix(in oklch, var(--warning) 35%, transparent)" }}>
                  <Icon name="alert" size={15} style={{ color: "var(--warning)", flex: "0 0 auto", marginTop: 1 }} />
                  <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>{ar ? `${failed.length} مرشح لديه حالة تمنع الإرسال وسيُدرج في تقرير الإرسال.` : `${failed.length} candidate(s) have a status that blocks sending and will appear in the send report.`}</span>
                </div>
              )}
            </div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={() => setStep("select")}>{ar ? "رجوع" : "Back"}</button><button className="btn btn-primary btn-sm" onClick={send}><Icon name="send" size={14} />{ar ? `إرسال إلى ${ok.length}` : `Send to ${ok.length}`}</button></div>
          </>
        )}

        {step === "report" && (
          <>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <span style={{ width: 48, height: 48, borderRadius: 13, background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center", margin: "6px auto 14px" }}><Icon name="check" size={24} /></span>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{ar ? `أُرسل إلى ${ok.length} مرشح` : `Sent to ${ok.length} candidate${ok.length > 1 ? "s" : ""}`}</div>
              <div className="faint" style={{ fontSize: 13, marginTop: 6 }}>{ar ? "ستظهر الحالة على ملف كل مرشح فور الدعوة." : "Status will appear on each candidate profile once invited."}</div>
              {failed.length > 0 && (
                <div className="card card-pad" style={{ textAlign: "start", marginTop: 18, background: "var(--surface-2)", boxShadow: "none" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--danger)", marginBottom: 8 }}>{ar ? `${failed.length} إرسال فاشل` : `${failed.length} failed`}</div>
                  {failed.map(c => <div key={c.id} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 12.5, padding: "4px 0" }}><Icon name="ban" size={13} style={{ color: "var(--danger)" }} />{L(c.name)} — <span className="faint">{ar ? "حالة منتهية" : "expired status"}</span></div>)}
                </div>
              )}
            </div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-primary btn-sm" onClick={() => { onClose(); toast(ar ? `أُرسل التقييم إلى ${ok.length} مرشح` : `Assessment sent to ${ok.length}`); }}>{ar ? "تم" : "Done"}</button></div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, last }) {
  return <div className="flex" style={{ justifyContent: "space-between", padding: "7px 0", borderBottom: last ? "none" : "1px solid var(--border)", fontSize: 13 }}><span className="faint">{label}</span><span style={{ fontWeight: 600 }}>{value}</span></div>;
}

export { AssessmentBuilder, SendAssessmentModal };
