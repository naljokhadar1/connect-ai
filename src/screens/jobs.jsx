import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge, ToastHost } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Job Management + AI Create Job wizard */

function JobsScreen({ go, openCreate, onConsumeCreate, toast }) {
  const { t, L, lang } = useApp();
  const D = window.DATA;
  const [view, setView] = React.useState("list");
  const [create, setCreate] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => { if (openCreate) { go("job-create"); onConsumeCreate && onConsumeCreate(); } }, [openCreate]);

  const dept = id => D.departments.find(d => d.id === id);
  const jobs = D.jobs.filter(j => !query || L(j).toLowerCase().includes(query.toLowerCase()));

  const statusBadge = s => {
    const m = { open: "success", draft: "neutral", closing: "warning", onhold: "info" };
    return <span className={"badge badge-" + m[s]}><span className="b-dot" />{t("jobs.status." + s)}</span>;
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t("jobs.title")}</h1>
          <div className="page-sub">{t("jobs.sub")}</div>
        </div>
        <div className="spacer" />
        <div className="seg">
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}><Icon name="list" size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 5 }} />{t("jobs.list")}</button>
          <button className={view === "board" ? "on" : ""} onClick={() => setView("board")}><Icon name="grid" size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 5 }} />{t("jobs.kanban")}</button>
          <button className={view === "analytics" ? "on" : ""} onClick={() => setView("analytics")}><Icon name="analytics" size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 5 }} />{t("jobs.analytics")}</button>
        </div>
        <button className="btn btn-primary" onClick={() => go("job-create")}><Icon name="plus" size={17} />{t("jobs.create")}</button>
      </div>

      <div className="flex" style={{ gap: 10, marginBottom: 16, alignItems: "center" }}>
        <div className="searchbar" style={{ maxWidth: 320, height: 38 }}>
          <Icon name="search" size={16} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t("common.search") + "…"} />
        </div>
        <button className="btn btn-ghost btn-sm"><Icon name="filter" size={15} />{t("common.filter")}</button>
        <div className="spacer" style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 13 }}>{jobs.length} {lang === "ar" ? "وظيفة" : "jobs"}</span>
      </div>

      {view === "list" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr>
              <th>{t("jobs.col.job")}</th><th>{t("jobs.col.dept")}</th><th>{t("jobs.col.candidates")}</th>
              <th>{t("jobs.col.stage")}</th><th>{t("jobs.col.manager")}</th><th>{t("jobs.col.status")}</th><th>{t("jobs.col.posted")}</th>
            </tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} onClick={() => go("pipeline", { job: j.id })}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{L(j)}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{L(j.loc)} · {L(j.type)} · {j.grade} · {j.openings} {t("jobs.openings")}</div>
                  </td>
                  <td><span className="badge badge-neutral">{L(dept(j.dept))}</span></td>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{j.applicants}</span></td>
                  <td>{j.status === "draft" ? <span className="faint">—</span> : <StageBadge stage={j.top} />}</td>
                  <td><span style={{ fontSize: 13 }}>{L(j.mgr)}</span></td>
                  <td>{statusBadge(j.status)}</td>
                  <td><span className="faint mono" style={{ fontSize: 12.5 }}>{j.posted ? `${j.posted}${lang === "ar" ? "ي" : "d"}` : "—"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "board" && (
        <div className="flex" style={{ gap: 14, overflowX: "auto", paddingBottom: 10 }}>
          {["open", "closing", "onhold", "draft"].map(st => {
            const col = jobs.filter(j => j.status === st);
            return (
              <div key={st} style={{ flex: "0 0 280px", minWidth: 280 }}>
                <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 10, padding: "0 4px" }}>
                  {statusBadge(st)}<span className="mono faint" style={{ fontSize: 12 }}>{col.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.map(j => (
                    <div key={j.id} className="card card-pad" style={{ cursor: "pointer" }} onClick={() => go("pipeline", { job: j.id })}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{L(j)}</div>
                      <div className="faint" style={{ fontSize: 12, marginBottom: 10 }}>{L(dept(j.dept))} · {L(j.loc)}</div>
                      <div className="flex" style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <span className="mono" style={{ fontSize: 12.5, fontWeight: 600 }}><Icon name="users" size={13} style={{ verticalAlign: "-2px" }} /> {j.applicants}</span>
                        <span className="faint" style={{ fontSize: 12 }}>{j.openings} {t("jobs.openings")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "analytics" && <JobsAnalytics />}

      {create && <CreateJob onClose={() => setCreate(false)} toast={toast} />}
    </div>
  );
}

function JobsAnalytics() {
  const { t, L, lang } = useApp();
  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="card">
        <div className="card-head"><h3>{lang === "ar" ? "الطلبات حسب القسم" : "Applications by Department"}</h3></div>
        <div className="card-pad">
          <VBars data={[
            { l: lang === "ar" ? "الهندسة" : "Eng", v: 215, color: "var(--accent)" },
            { l: lang === "ar" ? "المنتجات" : "Product", v: 127 },
            { l: lang === "ar" ? "البيانات" : "Data", v: 128 },
            { l: lang === "ar" ? "المالية" : "Finance", v: 98 },
            { l: lang === "ar" ? "التسويق" : "Mktg", v: 41 },
          ]} />
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>{lang === "ar" ? "متوسط مدة التوظيف حسب القسم" : "Avg. Time to Hire by Dept"}</h3></div>
        <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { l: lang === "ar" ? "الهندسة" : "Engineering", v: 34, max: 45 },
            { l: lang === "ar" ? "المنتجات" : "Product", v: 28, max: 45 },
            { l: lang === "ar" ? "البيانات والذكاء" : "Data & AI", v: 41, max: 45 },
            { l: lang === "ar" ? "المالية" : "Finance", v: 22, max: 45 },
            { l: lang === "ar" ? "التسويق" : "Marketing", v: 19, max: 45 },
          ].map((d, i) => (
            <div key={i}>
              <div className="flex" style={{ justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                <span style={{ fontWeight: 500 }}>{d.l}</span><span className="mono" style={{ fontWeight: 600 }}>{d.v} {t("common.days")}</span>
              </div>
              <Bar value={(d.v / d.max) * 100} color={d.v > 35 ? "var(--warning)" : "var(--accent)"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ AI Create Job wizard ============ */
function useTypewriter() {
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef();
  const run = React.useCallback((full) => {
    setBusy(true); setText(""); clearInterval(ref.current);
    let i = 0;
    ref.current = setInterval(() => {
      i += Math.max(2, Math.round(full.length / 90));
      setText(full.slice(0, i));
      if (i >= full.length) { clearInterval(ref.current); setText(full); setBusy(false); }
    }, 18);
  }, []);
  React.useEffect(() => () => clearInterval(ref.current), []);
  return { text, busy, run, setText };
}

function CreateJob({ onClose, toast }) {
  const { t, lang } = useApp();
  const D = window.DATA;
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({ title: "Senior Product Manager", dept: "prod", loc: "Riyadh", type: "Full-time", grade: "M3", salary: "28,000 – 36,000", mgr: "Faisal Al-Otaibi", openings: 2 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const steps = ["cj.step1", "cj.step2", "cj.step3", "cj.step4"];

  const desc = useTypewriter();
  const [skills, setSkills] = React.useState([]);
  const [iq, setIq] = React.useState([]);
  const [genState, setGenState] = React.useState({ skills: false, iq: false });

  const descText = lang === "ar"
    ? `نبحث عن ${form.title} متمرّس للانضمام إلى فريق المنتجات لدينا في ${form.loc}. ستقود رؤية المنتج واستراتيجيته على مدار دورة الحياة الكاملة، من الاكتشاف إلى الإطلاق، بالتعاون الوثيق مع الهندسة والتصميم وأصحاب المصلحة. هذا الدور محوري لتحقيق طموحات النمو لدينا في السوق السعودي ودول الخليج.`
    : `We are seeking an experienced ${form.title} to join our Product team in ${form.loc}. You will own product vision and strategy across the full lifecycle — from discovery to launch — partnering closely with Engineering, Design, and senior stakeholders. This role is pivotal to delivering our growth ambitions across the Saudi and GCC market.`;

  const skillSet = ["Product Strategy", "Roadmapping", "Stakeholder Management", "Data Analysis", "Agile / Scrum", "User Research", "A/B Testing", "Fintech"];
  const iqSet = lang === "ar"
    ? ["صف منتجاً أطلقته من الصفر وكيف قِست نجاحه.", "كيف تحدد أولويات الميزات عند محدودية الموارد الهندسية؟", "احكِ عن قرار منتج اتخذته بناءً على البيانات وعارض الحدس.", "كيف تتعامل مع أصحاب مصلحة متعارضين في الأولويات؟"]
    : ["Describe a product you launched from zero and how you measured success.", "How do you prioritize features when engineering capacity is limited?", "Tell me about a data-driven product decision that went against intuition.", "How do you align stakeholders with conflicting priorities?"];

  const genSkills = () => { setGenState(s => ({ ...s, skills: true })); setSkills([]); skillSet.forEach((sk, i) => setTimeout(() => setSkills(p => [...p, sk]), 140 * (i + 1))); setTimeout(() => setGenState(s => ({ ...s, skills: false })), 140 * (skillSet.length + 1)); };
  const genIq = () => { setGenState(s => ({ ...s, iq: true })); setIq([]); iqSet.forEach((q, i) => setTimeout(() => setIq(p => [...p, q]), 260 * (i + 1))); setTimeout(() => setGenState(s => ({ ...s, iq: false })), 260 * (iqSet.length + 1)); };

  const L2 = o => o[lang];
  const next = () => step < 3 ? setStep(step + 1) : (toast(t("cj.published"), "check"), onClose());

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-strong)", display: "grid", placeItems: "center" }}><Icon name="briefcase" size={17} /></span>
          <h3 style={{ fontSize: 17, fontWeight: 600 }}>{t("cj.title")}</h3>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        {/* stepper */}
        <div className="flex" style={{ gap: 0, padding: "14px 22px", borderBottom: "1px solid var(--border)" }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex" style={{ alignItems: "center", gap: 8 }}>
                <span className="mono" style={{ width: 24, height: 24, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700,
                  background: i <= step ? "var(--accent)" : "var(--surface-3)", color: i <= step ? "#fff" : "var(--text-3)" }}>{i < step ? "✓" : i + 1}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: i <= step ? "var(--text)" : "var(--text-3)" }}>{t(s)}</span>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: i < step ? "var(--accent)" : "var(--border)", margin: "0 10px", borderRadius: 2 }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="modal-body" style={{ minHeight: 320 }}>
          {step === 0 && (
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>{t("cj.jobTitle")}</label>
                <input className="input" value={form.title} onChange={e => set("title", e.target.value)} />
              </div>
              <div className="field"><label>{t("cj.dept")}</label>
                <select className="select" value={form.dept} onChange={e => set("dept", e.target.value)}>{D.departments.map(d => <option key={d.id} value={d.id}>{L2(d)}</option>)}</select></div>
              <div className="field"><label>{t("cj.location")}</label>
                <select className="select" value={form.loc} onChange={e => set("loc", e.target.value)}>{D.locations.map(l => <option key={l.en} value={l.en}>{L2(l)}</option>)}</select></div>
              <div className="field"><label>{t("cj.type")}</label>
                <select className="select" value={form.type} onChange={e => set("type", e.target.value)}>{D.employmentTypes.map(l => <option key={l.en} value={l.en}>{L2(l)}</option>)}</select></div>
              <div className="field"><label>{t("cj.grade")}</label>
                <select className="select" value={form.grade} onChange={e => set("grade", e.target.value)}>{D.grades.map(g => <option key={g}>{g}</option>)}</select></div>
              <div className="field"><label>{t("cj.salary")}</label><input className="input mono" value={form.salary} onChange={e => set("salary", e.target.value)} /></div>
              <div className="field"><label>{t("cj.openings")}</label><input className="input mono" type="number" value={form.openings} onChange={e => set("openings", e.target.value)} /></div>
            </div>
          )}

          {step === 1 && (
            <div className="field">
              <div className="flex" style={{ alignItems: "center" }}>
                <label style={{ flex: 1 }}>{t("cj.descLabel")}</label>
                <button className="btn btn-ai btn-sm" disabled={desc.busy} onClick={() => desc.run(descText)}>
                  <Icon name="sparkles" size={14} fill />{desc.busy ? t("common.generating") : (desc.text ? t("common.regenerate") : t("common.aiGenerate"))}
                </button>
              </div>
              <div className="hint" style={{ marginBottom: 4 }}>{t("cj.aiDescHint")}</div>
              <div className="textarea" style={{ minHeight: 180, whiteSpace: "pre-wrap", background: desc.busy ? "var(--ai-soft)" : "var(--surface)", transition: "background .3s" }}>
                <span className={desc.busy ? "ai-cursor" : ""}>{desc.text || <span className="faint">{lang === "ar" ? "اكتب الوصف أو دع الذكاء ينشئه…" : "Write a description or let AI generate one…"}</span>}</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div className="field">
                <div className="flex" style={{ alignItems: "center" }}>
                  <label style={{ flex: 1 }}>{t("cj.skillsLabel")}</label>
                  <button className="btn btn-ai btn-sm" disabled={genState.skills} onClick={genSkills}><Icon name="sparkles" size={14} fill />{genState.skills ? t("common.generating") : t("common.aiGenerate")}</button>
                </div>
                <div className="flex" style={{ flexWrap: "wrap", gap: 8, minHeight: 36, marginTop: 4 }}>
                  {skills.length === 0 && !genState.skills && <span className="faint" style={{ fontSize: 13 }}>{lang === "ar" ? "لا مهارات بعد" : "No skills yet"}</span>}
                  {skills.map((s, i) => <span key={i} className="chip chip-accent fade-up">{s}</span>)}
                </div>
              </div>
              <div className="field">
                <div className="flex" style={{ alignItems: "center" }}>
                  <label style={{ flex: 1 }}>{t("cj.interviewQ")}</label>
                  <button className="btn btn-ai btn-sm" disabled={genState.iq} onClick={genIq}><Icon name="sparkles" size={14} fill />{genState.iq ? t("common.generating") : t("common.aiGenerate")}</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  {iq.length === 0 && !genState.iq && <span className="faint" style={{ fontSize: 13 }}>{lang === "ar" ? "لا أسئلة بعد" : "No questions yet"}</span>}
                  {iq.map((q, i) => (
                    <div key={i} className="fade-up flex" style={{ gap: 10, padding: "10px 12px", background: "var(--surface-2)", borderRadius: "var(--r-sm)", fontSize: 13.5 }}>
                      <span className="mono faint" style={{ flex: "0 0 auto" }}>{i + 1}.</span><span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex" style={{ alignItems: "center", gap: 12, marginBottom: 18 }}>
                <span style={{ width: 44, height: 44, borderRadius: 11, background: "var(--accent-soft)", color: "var(--accent-strong)", display: "grid", placeItems: "center" }}><Icon name="briefcase" size={22} /></span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{form.title}</div>
                  <div className="faint" style={{ fontSize: 13 }}>{L2(D.departments.find(d => d.id === form.dept))} · {form.loc} · {form.grade} · {form.openings} {t("jobs.openings")}</div>
                </div>
              </div>
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["cj.type", form.type], ["cj.salary", form.salary + " SAR"], ["cj.manager", form.mgr], ["cj.skillsLabel", (skills.length || 8) + (lang === "ar" ? " مهارات" : " skills")]].map(([k, v], i) => (
                  <div key={i} style={{ padding: 12, background: "var(--surface-2)", borderRadius: "var(--r-sm)" }}>
                    <div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 3 }}>{t(k)}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex" style={{ gap: 8, marginTop: 16, padding: 13, background: "var(--ai-soft)", borderRadius: "var(--r-md)", alignItems: "flex-start" }}>
                <Icon name="sparkles" size={16} fill style={{ color: "var(--ai)", flex: "0 0 auto", marginTop: 1 }} />
                <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5 }}>
                  {lang === "ar" ? "سيبدأ الذكاء الاصطناعي بمطابقة المرشحين فور النشر، ويُنشئ تقييماً تلقائياً، ويُرتّب الطلبات الواردة." : "AI will begin matching candidates on publish, auto-generate an assessment, and rank incoming applications."}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(step - 1)}><Icon name={lang === "ar" ? "chevRight" : "chevLeft"} size={16} />{t("common.back")}</button>}
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" onClick={next}>
            {step === 3 ? <><Icon name="check" size={16} />{t("cj.publish")}</> : <>{t("common.continue")}<Icon name={lang === "ar" ? "chevLeft" : "chevRight"} size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

window.JobsScreen = JobsScreen;

export { JobsScreen }
