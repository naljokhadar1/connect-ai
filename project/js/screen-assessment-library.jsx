/* Connect AI — Assessment Library (Epic 12.1 browse + detail) */

function AssessmentLibrary({ go, toast }) {
  const { t, L, lang } = useApp();
  const { TYPES, DOMAINS, DIFF, QTYPES, STATUS } = window.ASSESS;
  const [items, setItems] = React.useState(() => window.ASSESS.ASSESSMENTS.map(a => ({ ...a })));
  const [view, setView] = React.useState("library");      // library | detail
  const [selId, setSelId] = React.useState(null);
  const [createMenu, setCreateMenu] = React.useState(false);
  const [builder, setBuilder] = React.useState(null);     // {mode:'scratch'|'ai', seed?}
  const [sendFor, setSendFor] = React.useState(null);     // assessment to send
  const [candFor, setCandFor] = React.useState(null);     // assessment for candidate experience

  // filters
  const [q, setQ] = React.useState("");
  const [fType, setFType] = React.useState("all");
  const [fDomain, setFDomain] = React.useState("all");
  const [fDiff, setFDiff] = React.useState("all");
  const [fDur, setFDur] = React.useState("all");

  const ar = lang === "ar";
  const sel = items.find(a => a.id === selId);

  const filtered = items.filter(a => {
    if (q && !L(a.title).toLowerCase().includes(q.toLowerCase())) return false;
    if (fType !== "all" && a.type !== fType) return false;
    if (fDomain !== "all" && a.domain !== fDomain) return false;
    if (fDiff !== "all" && a.difficulty !== fDiff) return false;
    if (fDur !== "all") {
      if (fDur === "s" && a.duration > 30) return false;
      if (fDur === "m" && (a.duration <= 30 || a.duration > 45)) return false;
      if (fDur === "l" && a.duration <= 45) return false;
    }
    return true;
  });

  const published = items.filter(a => a.status === "published").length;
  const drafts = items.filter(a => a.status === "draft").length;
  const bankSize = 520; // default question bank

  const saveAssessment = (a) => {
    setItems(list => list.find(x => x.id === a.id) ? list.map(x => x.id === a.id ? a : x) : [...list, a]);
    setBuilder(null);
    setSelId(a.id); setView("detail");
    toast(a.status === "draft" ? (ar ? "حُفظ كمسودة" : "Saved as draft") : (ar ? "نُشر التقييم" : "Assessment published"));
  };

  const dup = (a) => {
    const copy = { ...a, id: "as" + Date.now(), title: { en: L(a.title) + " (copy)", ar: L(a.title) + " (نسخة)" }, status: "draft", source: "custom", usage: 0, avgScore: null,
      versions: [{ v: "v1", date: { en: "just now", ar: "الآن" }, status: "current", usage: 0 }], version: "v1" };
    setItems(list => [...list, copy]);
    toast(ar ? "تم التكرار" : "Assessment duplicated");
  };

  if (builder) {
    return <AssessmentBuilder mode={builder.mode} seed={builder.seed} onCancel={() => setBuilder(null)} onSave={saveAssessment} go={go} toast={toast} />;
  }

  if (view === "detail" && sel) {
    return <React.Fragment>
      <AssessmentDetail a={sel} go={go} toast={toast}
      onBack={() => { setView("library"); setSelId(null); }}
      onSend={() => setSendFor(sel)}
      onEdit={() => setBuilder({ mode: "scratch", seed: sel })}
      onCandidate={() => setCandFor(sel)}
      onResults={() => setView("results")}
      sendModal={sendFor && <SendAssessmentModal a={sendFor} onClose={() => setSendFor(null)} toast={toast} />} />
      {candFor && <CandidateAssessment a={candFor} onClose={() => setCandFor(null)} />}
    </React.Fragment>;
  }

  if (view === "results" && sel) {
    return <AssessmentResultsReview a={sel} onBack={() => setView("detail")} toast={toast} />;
  }

  if (view === "integrations") {
    return <AssessmentIntegrations onBack={() => setView("library")} toast={toast} />;
  }

  const TypeBadge = ({ type, sm }) => (
    <span className="badge" style={{ background: `color-mix(in oklch, ${TYPES[type].color} 14%, var(--surface))`, color: TYPES[type].color, height: sm ? 20 : 22 }}>
      {L(TYPES[type])}
    </span>
  );

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{ar ? "مكتبة التقييمات" : "Assessment Library"}</h1>
          <div className="page-sub">{ar ? "تصفّح وأنشئ وعيّن التقييمات عبر مؤسستك." : "Browse, build, and assign assessments across your organization."}</div>
        </div>
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={() => setView("integrations")}><Icon name="plug" size={16} />{ar ? "التكاملات" : "Integrations"}</button>
        <div style={{ position: "relative" }}>
          <button className="btn btn-primary" onClick={() => setCreateMenu(m => !m)}>
            <Icon name="plus" size={17} />{ar ? "إنشاء تقييم" : "Create assessment"}<Icon name="chevDown" size={15} />
          </button>
          {createMenu && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setCreateMenu(false)} />
              <div className="kebab-menu" style={{ minWidth: 280, insetInlineEnd: 0 }}>
                <button onClick={() => { setCreateMenu(false); setBuilder({ mode: "ai" }); }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", background: "var(--ai-soft)", color: "var(--ai)", flex: "0 0 auto" }}><Icon name="sparkles" size={16} fill /></span>
                  <span style={{ textAlign: "start" }}>
                    <div style={{ fontWeight: 600 }}>{ar ? "توليد بالذكاء الاصطناعي" : "Generate with AI"}</div>
                    <div className="faint" style={{ fontSize: 11.5, fontWeight: 400 }}>{ar ? "من وصف وظيفي أو وظيفة قائمة" : "From a job description or existing job"}</div>
                  </span>
                </button>
                <button onClick={() => { setCreateMenu(false); setBuilder({ mode: "scratch" }); }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", background: "var(--accent-soft)", color: "var(--accent-strong)", flex: "0 0 auto" }}><Icon name="edit" size={15} /></span>
                  <span style={{ textAlign: "start" }}>
                    <div style={{ fontWeight: 600 }}>{ar ? "إنشاء من الصفر" : "Build from scratch"}</div>
                    <div className="faint" style={{ fontSize: 11.5, fontWeight: 400 }}>{ar ? "أضف الأسئلة يدوياً أو من بنك الأسئلة" : "Add questions manually or from the bank"}</div>
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* stats */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: "var(--gap)" }}>
        <Stat icon="assessment" label={ar ? "إجمالي التقييمات" : "Total assessments"} value={items.length} color="var(--accent)" />
        <Stat icon="check" label={ar ? "منشورة" : "Published"} value={published} color="var(--success)" />
        <Stat icon="edit" label={ar ? "مسودات" : "Drafts"} value={drafts} color="var(--warning)" />
        <Stat icon="list" label={ar ? "بنك الأسئلة" : "Question bank"} value={bankSize} unit={ar ? "سؤال" : "questions"} color="var(--ai)" />
      </div>

      {/* filter bar */}
      <div className="card card-pad flex" style={{ gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: "var(--gap)" }}>
        <div className="searchbar" style={{ height: 38, flex: "1 1 200px", maxWidth: 320 }}>
          <Icon name="search" size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder={ar ? "ابحث عن تقييم…" : "Search assessments…"} />
        </div>
        <select className="select" style={{ height: 38, width: "auto" }} value={fType} onChange={e => { setFType(e.target.value); setFDomain("all"); }}>
          <option value="all">{ar ? "كل الأنواع" : "All types"}</option>
          {Object.keys(TYPES).map(k => <option key={k} value={k}>{L(TYPES[k])}</option>)}
        </select>
        <select className="select" style={{ height: 38, width: "auto" }} value={fDomain} onChange={e => setFDomain(e.target.value)}>
          <option value="all">{ar ? "كل المجالات" : "All domains"}</option>
          {Object.keys(DOMAINS).filter(k => fType === "all" || DOMAINS[k].type === fType).map(k => <option key={k} value={k}>{L(DOMAINS[k])}</option>)}
        </select>
        <select className="select" style={{ height: 38, width: "auto" }} value={fDiff} onChange={e => setFDiff(e.target.value)}>
          <option value="all">{ar ? "كل المستويات" : "All difficulties"}</option>
          {Object.keys(DIFF).map(k => <option key={k} value={k}>{L(DIFF[k])}</option>)}
        </select>
        <select className="select" style={{ height: 38, width: "auto" }} value={fDur} onChange={e => setFDur(e.target.value)}>
          <option value="all">{ar ? "أي مدة" : "Any duration"}</option>
          <option value="s">{ar ? "≤ 30 دقيقة" : "≤ 30 min"}</option>
          <option value="m">{ar ? "31–45 دقيقة" : "31–45 min"}</option>
          <option value="l">{ar ? "> 45 دقيقة" : "> 45 min"}</option>
        </select>
        <div className="spacer" style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 12.5 }}>{filtered.length} {ar ? "نتيجة" : "results"}</span>
      </div>

      {/* cards */}
      {filtered.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: "center", padding: 50, color: "var(--text-3)" }}>
          <Icon name="search" size={28} /><div style={{ marginTop: 10, fontSize: 14 }}>{ar ? "لا توجد تقييمات مطابقة." : "No assessments match your filters."}</div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))" }}>
          {filtered.map(a => (
            <AssessmentCard key={a.id} a={a} TypeBadge={TypeBadge}
              onOpen={() => { setSelId(a.id); setView("detail"); }}
              onSend={() => setSendFor(a)} onDup={() => dup(a)} />
          ))}
        </div>
      )}

      {sendFor && <SendAssessmentModal a={sendFor} onClose={() => setSendFor(null)} toast={toast} />}
    </div>
  );
}

function AssessmentCard({ a, TypeBadge, onOpen, onSend, onDup }) {
  const { t, L, lang } = useApp();
  const { DOMAINS, DIFF, STATUS } = window.ASSESS;
  const ar = lang === "ar";
  const [menu, setMenu] = React.useState(false);
  const isDraft = a.status === "draft";
  return (
    <div className="card card-interactive" style={{ padding: 0, display: "flex", flexDirection: "column" }} onClick={onOpen}>
      <div className="card-pad" style={{ paddingBottom: 14, flex: 1 }}>
        <div className="flex" style={{ alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <TypeBadge type={a.type} sm />
            {a.external && <Icon name="plug" size={13} style={{ color: window.ASSESS.PROVIDER_BY[a.provider] ? "var(--ai)" : "var(--text-3)" }} title="External provider" />}
          </span>
          <span className="badge badge-neutral" style={{ height: 20 }}>{L(DOMAINS[a.domain])}</span>
          <div className="spacer" style={{ flex: 1 }} />
          {a.source === "ai" && !a.external && <span className="badge badge-ai" style={{ height: 20 }}><Icon name="sparkles" size={10} fill />AI</span>}
          {isDraft && <span className="badge badge-warning" style={{ height: 20 }}>{ar ? "مسودة" : "Draft"}</span>}
        </div>
        <div style={{ fontWeight: 600, fontSize: 15.5, lineHeight: 1.3, marginBottom: a.external ? 5 : 12 }}>{L(a.title)}</div>
        {a.external && <div className="faint flex" style={{ alignItems: "center", gap: 5, fontSize: 11.5, marginBottom: 12 }}><Icon name="plug" size={11} style={{ color: "var(--ai)" }} />{ar ? "بواسطة " : "Powered by "}{window.ASSESS.PROVIDER_BY[a.provider]?.name}</div>}
        <div className="flex" style={{ gap: 16, flexWrap: "wrap" }}>
          <Meta icon="clock" label={a.duration + (ar ? " د" : " min")} />
          <Meta icon="list" label={a.qCount + (ar ? " سؤال" : " Qs")} />
          <Meta icon="flag" label={L(DIFF[a.difficulty])} color={DIFF[a.difficulty].color} />
        </div>
      </div>
      <div className="flex" style={{ alignItems: "center", gap: 8, padding: "11px 16px", borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}>
        <span className="faint" style={{ fontSize: 11.5 }}>{ar ? "حُدّث " : "Updated "}{L(a.updated)}</span>
        <div className="spacer" style={{ flex: 1 }} />
        {!isDraft && <button className="btn btn-subtle btn-sm" onClick={e => { e.stopPropagation(); onSend(); }}><Icon name="send" size={13} />{ar ? "إرسال" : "Send"}</button>}
        <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
          <button className="btn-icon btn-sm" onClick={() => setMenu(m => !m)}><Icon name="kebab" size={16} /></button>
          {menu && (<>
            <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setMenu(false)} />
            <div className="kebab-menu">
              <button onClick={() => { setMenu(false); onOpen(); }}><Icon name="edit" size={14} />{ar ? "تحرير" : "Edit"}</button>
              <button onClick={() => { setMenu(false); onDup(); }}><Icon name="copy" size={14} />{ar ? "تكرار" : "Duplicate"}</button>
              {!isDraft && <button onClick={() => { setMenu(false); onSend(); }}><Icon name="send" size={14} />{ar ? "إرسال لمرشح" : "Send to candidate"}</button>}
              <button className="danger" onClick={() => setMenu(false)}><Icon name="archive" size={14} />{ar ? "أرشفة" : "Archive"}</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, label, color }) {
  return (
    <span className="flex" style={{ alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 500, color: color || "var(--text-2)" }}>
      <Icon name={icon} size={13} style={{ color: color || "var(--text-3)" }} />{label}
    </span>
  );
}

window.AssessmentLibrary = AssessmentLibrary;
