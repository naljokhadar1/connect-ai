import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge, ToastHost } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — ATS Pipeline (Kanban + Table, filters, bulk actions, saved views) */

const PIPE_STAGES = ["applied", "screening", "assessment", "aiInterview", "hrInterview", "techInterview", "offer", "hired"];

function Pipeline({ go, cands, setCands, jobFilter, setJobFilter, toast }) {
  const { t, L, lang } = useApp();
  const D = window.DATA;
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [drag, setDrag] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [view, setView] = React.useState("kanban");
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState({});
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [quick, setQuick] = React.useState({});
  const [savedView, setSavedView] = React.useState("all");
  const [sort, setSort] = React.useState({ key: "match", dir: "desc" });
  const [rejectedOpen, setRejectedOpen] = React.useState(false);
  const [bulkModal, setBulkModal] = React.useState(null);

  const jobsWithCands = D.jobs.filter(j => cands.some(c => c.job === j.id));
  const selCount = Object.values(sel).filter(Boolean).length;

  const matchSearch = (c) => !q || L(c.name).toLowerCase().includes(q.toLowerCase()) || L(c.title).toLowerCase().includes(q.toLowerCase());
  const matchQuick = (c) => {
    if (quick.strong && c.match < 85) return false;
    if (quick.stuck && c.applied <= 5) return false;
    if (quick.noassess && c.assess) return false;
    if (savedView === "strong" && c.match < 85) return false;
    if (savedView === "stuck" && c.applied <= 5) return false;
    return true;
  };
  const visible = cands.filter(c => (jobFilter === "all" || c.job === jobFilter) && matchSearch(c) && matchQuick(c));
  const byStage = s => visible.filter(c => c.stage === s).sort((a, b) => b.match - a.match);

  const jobName = (id) => { const j = D.jobs.find(x => x.id === id); return j ? L(j) : ""; };

  const onDrop = (stage) => {
    if (!drag) return;
    const c = cands.find(x => x.id === drag);
    if (c && c.stage !== stage) {
      setCands(cs => cs.map(x => x.id === drag ? { ...x, stage } : x));
      toast(`${L(c.name)} ${t("pipe.moved")} ${t("stage." + stage)}`, "arrowRight");
    }
    setDrag(null); setOver(null);
  };
  const advance = (c) => {
    const i = PIPE_STAGES.indexOf(c.stage);
    if (i >= 0 && i < PIPE_STAGES.length - 1) {
      const ns = PIPE_STAGES[i + 1];
      setCands(cs => cs.map(x => x.id === c.id ? { ...x, stage: ns } : x));
      toast(`${L(c.name)} → ${t("stage." + ns)}`, "arrowRight");
    }
  };
  const toggleSel = (id) => setSel(s => ({ ...s, [id]: !s[id] }));
  const clearSel = () => setSel({});
  const bulkMove = (stage) => { const ids = Object.keys(sel).filter(k => sel[k]); setCands(cs => cs.map(x => ids.includes(x.id) ? { ...x, stage } : x)); clearSel(); setBulkModal(null); toast(T(`Moved ${ids.length} candidates`, `نُقل ${ids.length} مرشح`), "arrowRight"); };

  const savedViews = [["all", T("All candidates", "كل المرشحين")], ["strong", T("Strong matches", "تطابقات قوية")], ["mine", T("My active queue", "قائمتي")], ["stuck", T("Stuck candidates", "متعثّرون")]];
  const quickFilters = [["strong", T("Strong 85+", "قوي 85+"), "sparkles"], ["stuck", T("Stuck > 5 days", "متعثّر > 5 أيام"), "alert"], ["noassess", T("Missing assessment", "بلا تقييم"), "assessment"]];

  return (
    <div className="page" style={{ maxWidth: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="page-head" style={{ marginBottom: 12 }}>
        <div>
          <h1 className="page-title">{t("pipe.title")}</h1>
          <div className="page-sub">{T("Drag candidates between stages · AI-ranked", "اسحب المرشحين بين المراحل · مرتّب بالذكاء")}</div>
        </div>
        <div className="spacer" />
        <div className="searchbar" style={{ height: 38, width: 240 }}><Icon name="search" size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder={T("Search candidates…", "ابحث عن مرشحين…")} /></div>
        <select className="select" style={{ width: "auto", minWidth: 170, height: 38 }} value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
          <option value="all">{T("All jobs", "جميع الوظائف")}</option>
          {jobsWithCands.map(j => <option key={j.id} value={j.id}>{L(j)}</option>)}
        </select>
        <div className="seg" style={{ display: "inline-flex" }}>
          <button className={view === "kanban" ? "on" : ""} onClick={() => setView("kanban")}><Icon name="grid" size={14} /></button>
          <button className={view === "table" ? "on" : ""} onClick={() => setView("table")}><Icon name="list" size={14} /></button>
        </div>
        <button className="btn btn-ghost" onClick={() => setFilterOpen(true)}><Icon name="filter" size={16} />{t("common.filter")}{Object.values(quick).filter(Boolean).length > 0 && <span className="badge badge-accent" style={{ height: 18, marginInlineStart: 4 }}>{Object.values(quick).filter(Boolean).length}</span>}</button>
      </div>

      {/* saved views */}
      <div className="ptabs" style={{ marginBottom: 12 }}>
        {savedViews.map(([id, l]) => <button key={id} className={savedView === id ? "on" : ""} onClick={() => setSavedView(id)}>{l}</button>)}
        <button onClick={() => toast(T("View saved", "حُفظ العرض"))} style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "var(--text-3)" }}><Icon name="plus" size={13} style={{ verticalAlign: "-2px" }} /> {T("Save current view", "حفظ العرض")}</button>
      </div>

      {/* context strip */}
      {jobFilter === "all" ? (
        <div className="flex" style={{ alignItems: "center", gap: 9, padding: "8px 12px", background: "var(--ai-soft)", borderRadius: "var(--r-sm)", marginBottom: 12 }}>
          <Icon name="alert" size={14} style={{ color: "var(--ai)", flex: "0 0 auto" }} />
          <span style={{ fontSize: 12.5, flex: 1, color: "var(--text-2)" }}>{T("Showing candidates across all active jobs. AI match scores are job-specific — comparing across jobs may mislead.", "عرض المرشحين عبر كل الوظائف. درجات التطابق خاصة بكل وظيفة — المقارنة بينها قد تكون مضلّلة.")}</span>
        </div>
      ) : (
        <div className="flex" style={{ alignItems: "center", gap: 9, padding: "8px 12px", background: "var(--surface-2)", borderRadius: "var(--r-sm)", marginBottom: 12, border: "1px solid var(--border)" }}>
          <Icon name="briefcase" size={14} style={{ color: "var(--accent)", flex: "0 0 auto" }} />
          <span style={{ fontSize: 12.5, flex: 1 }}><b>{jobName(jobFilter)}</b> · {visible.length} {T("in pipeline", "في المسار")}</span>
          <a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)" }} onClick={() => go("jobs")}>{T("View job details", "تفاصيل الوظيفة")} ↗</a>
        </div>
      )}

      {view === "kanban"
        ? <KanbanView {...{ PIPE_STAGES, byStage, visible, drag, over, setDrag, setOver, onDrop, go, sel, toggleSel, advance, rejectedOpen, setRejectedOpen, jobFilter, jobName, T, ar, lang, t, L }} />
        : <TableView {...{ visible, sort, setSort, sel, toggleSel, setSel, go, jobName, jobFilter, T, ar, t, L }} />}

      {/* bulk bar */}
      {selCount > 0 && (
        <div style={{ position: "sticky", bottom: 0, marginTop: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-lg)", padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", zIndex: 30 }}>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{selCount} {T("selected", "محدد")}</span>
          <a className="muted" style={{ fontSize: 12.5, cursor: "pointer" }} onClick={clearSel}>{T("Clear", "مسح")}</a>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-primary btn-sm" onClick={() => setBulkModal("move")}><Icon name="arrowRight" size={14} />{T("Move to stage", "نقل لمرحلة")}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => toast(T("Email composer opened", "فُتح محرّر البريد"))}><Icon name="mail" size={14} />{T("Send email", "إرسال بريد")}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => toast(T("Assessment picker opened", "فُتح اختيار التقييم"))}><Icon name="assessment" size={14} />{T("Send assessment", "إرسال تقييم")}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => toast(T("Tag added", "أُضيف الوسم"))}><Icon name="plus" size={14} />{T("Add tag", "وسم")}</button>
          <button className="btn btn-subtle btn-sm" style={{ color: "var(--danger)" }} onClick={() => setBulkModal("reject")}><Icon name="ban" size={14} />{T("Reject", "رفض")}</button>
        </div>
      )}

      {/* filter drawer */}
      <div className={"drawer-scrim" + (filterOpen ? " open" : "")} style={{ pointerEvents: filterOpen ? "auto" : "none" }} onClick={() => setFilterOpen(false)} />
      <aside className={"drawer" + (filterOpen ? " open" : "")} aria-hidden={!filterOpen} style={{ width: 360 }}>
        {filterOpen && (
          <React.Fragment>
            <div className="drawer-head"><div style={{ flex: 1, fontWeight: 600, fontSize: 16 }}>{T("Filter pipeline", "تصفية المسار")}</div><a className="muted" style={{ fontSize: 12.5, cursor: "pointer", marginInlineEnd: 10 }} onClick={() => setQuick({})}>{T("Clear all", "مسح الكل")}</a><button className="icon-btn btn-sm" onClick={() => setFilterOpen(false)}><Icon name="x" size={18} /></button></div>
            <div className="drawer-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="field"><label>{T("Quick filters", "تصفية سريعة")}</label>
                <div className="flex" style={{ gap: 7, flexWrap: "wrap" }}>
                  {quickFilters.map(([k, l, ic]) => <button key={k} className={"chip" + (quick[k] ? " chip-accent" : "")} style={{ cursor: "pointer", background: quick[k] ? "var(--accent)" : undefined, color: quick[k] ? "#fff" : undefined, height: 30 }} onClick={() => setQuick(s => ({ ...s, [k]: !s[k] }))}><Icon name={ic} size={12} />{l}</button>)}
                </div>
              </div>
              <div className="field"><label>{T("By job", "حسب الوظيفة")}</label>
                {jobsWithCands.slice(0, 5).map(j => <label key={j.id} className="cbx"><span className="box" /> {L(j)} <span className="faint" style={{ marginInlineStart: "auto" }}>{cands.filter(c => c.job === j.id).length}</span></label>)}
              </div>
              <div className="field"><label>{T("By AI match tier", "حسب فئة التطابق")}</label>
                {[T("Strong (85+)", "قوي (85+)"), T("Good (70–84)", "جيد (70–84)"), T("Possible (50–69)", "محتمل (50–69)"), T("Weak (<50)", "ضعيف (<50)")].map((l, i) => <label key={i} className="cbx"><span className="box" /> {l}</label>)}
              </div>
              <div className="field"><label>{T("By signal", "حسب الإشارة")}</label>
                {[T("Pre-screen completed", "اكتمل الفرز"), T("Assessment completed", "اكتمل التقييم"), T("AI interview completed", "اكتملت مقابلة الذكاء"), T("Has notes", "لديه ملاحظات")].map((l, i) => <label key={i} className="cbx"><span className="box" /> {l}</label>)}
              </div>
            </div>
            <div className="drawer-foot"><a className="muted" style={{ fontSize: 12.5, cursor: "pointer" }}>{T("Save as preset", "حفظ كإعداد")}</a><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-primary btn-sm" onClick={() => setFilterOpen(false)}>{T("Apply filters", "تطبيق")}</button></div>
          </React.Fragment>
        )}
      </aside>

      {bulkModal && (
        <div className="scrim" onClick={() => setBulkModal(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{bulkModal === "move" ? T("Move candidates", "نقل المرشحين") : T("Reject candidates", "رفض المرشحين")}</div><button className="btn-icon btn-sm" onClick={() => setBulkModal(null)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body">
              {bulkModal === "move" ? (
                <div className="field"><label>{T("Move", "نقل")} {selCount} {T("candidates to", "مرشح إلى")}</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{PIPE_STAGES.map(s => <button key={s} className="btn btn-subtle btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => bulkMove(s)}>{t("stage." + s)}</button>)}</div>
                </div>
              ) : (
                <React.Fragment><p style={{ fontSize: 14, marginBottom: 12 }}>{T(`Reject ${selCount} candidates with feedback?`, `رفض ${selCount} مرشح مع ملاحظات؟`)}</p><textarea className="textarea" rows={3} placeholder={T("Rejection reason…", "سبب الرفض…")} /></React.Fragment>
              )}
            </div>
            {bulkModal === "reject" && <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={() => setBulkModal(null)}>{T("Cancel", "إلغاء")}</button><button className="btn btn-danger btn-sm" onClick={() => { clearSel(); setBulkModal(null); toast(T("Candidates rejected", "تم الرفض")); }}>{T("Reject", "رفض")}</button></div>}
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanView({ PIPE_STAGES, byStage, visible, drag, over, setDrag, setOver, onDrop, go, sel, toggleSel, advance, rejectedOpen, setRejectedOpen, jobFilter, jobName, T, ar, lang, t, L }) {
  return (
    <div className="flex" style={{ gap: 12, overflowX: "auto", flex: 1, paddingBottom: 16, alignItems: "flex-start" }}>
      {PIPE_STAGES.map(stage => {
        const items = byStage(stage);
        const isOver = over === stage;
        const ready = items.filter(c => c.match >= 85).length;
        const stuck = items.filter(c => c.applied > 5).length;
        const term = stage === "hired";
        return (
          <div key={stage}
            onDragOver={e => { e.preventDefault(); setOver(stage); }}
            onDragLeave={() => setOver(o => o === stage ? null : o)}
            onDrop={() => onDrop(stage)}
            style={{ flex: "0 0 272px", minWidth: 272, display: "flex", flexDirection: "column", maxHeight: "100%" }}>
            <div className="flex" style={{ alignItems: "center", gap: 8, padding: "0 6px 8px" }}>
              <StageBadge stage={stage} />
              <span className="mono faint" style={{ fontSize: 12, fontWeight: 600 }}>{items.length}</span>
              <div className="spacer" style={{ flex: 1 }} />
              <button className="icon-btn btn-sm" style={{ width: 26, height: 26 }}><Icon name="plus" size={15} /></button>
            </div>
            {(ready > 0 || stuck > 0) && (
              <div className="flex" style={{ gap: 10, padding: "0 6px 8px", fontSize: 11, fontWeight: 600 }}>
                {ready > 0 && <span style={{ color: "var(--accent-strong)" }}>● {ready} {T("ready", "جاهز")}</span>}
                {stuck > 0 && <span style={{ color: "var(--warning)" }}>⚠ {stuck} {T("stuck", "متعثّر")}</span>}
              </div>
            )}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 9, padding: "4px 4px 8px",
              borderRadius: "var(--r-md)", background: isOver ? "var(--accent-soft)" : (term ? "var(--success-soft)" : "transparent"),
              outline: isOver ? "2px dashed var(--accent)" : "2px dashed transparent", transition: "background .15s, outline-color .15s", minHeight: 80 }}>
              {items.map((c, i) => (
                <PipeCard key={c.id} c={c} dragging={drag === c.id} selected={!!sel[c.id]}
                  onToggleSel={() => toggleSel(c.id)} onAdvance={() => advance(c)}
                  onDragStart={() => setDrag(c.id)} onDragEnd={() => { setDrag(null); setOver(null); }}
                  onClick={() => go("candidate-profile", { id: c.id, from: "pipeline" })} idx={i}
                  showJob={jobFilter === "all"} jobName={jobName(c.job)} T={T} ar={ar} lang={lang} t={t} L={L} />
              ))}
              {items.length === 0 && <div className="faint" style={{ fontSize: 12, textAlign: "center", padding: "18px 0" }}>{T("No candidates yet", "لا مرشحين بعد")}</div>}
            </div>
          </div>
        );
      })}
      {/* rejected collapsed */}
      <div style={{ flex: rejectedOpen ? "0 0 240px" : "0 0 90px", minWidth: rejectedOpen ? 240 : 90, transition: "flex-basis .2s" }}>
        <button className="flex" onClick={() => setRejectedOpen(o => !o)} style={{ width: "100%", alignItems: "center", gap: 6, padding: "0 6px 8px", color: "var(--text-3)" }}>
          <span className="badge badge-danger" style={{ height: 20 }}><span className="b-dot" />{T("Rejected", "مرفوض")}</span>
          <Icon name={rejectedOpen ? "chevLeft" : "chevRight"} size={14} />
        </button>
        {rejectedOpen
          ? <div style={{ display: "flex", flexDirection: "column", gap: 7, padding: 4 }}>{["Rana Aboud", "Bilal Najjar", "Dana Saleh"].map((n, i) => <div key={i} className="card card-pad" style={{ padding: 10, opacity: .7 }}><div style={{ fontWeight: 600, fontSize: 12.5 }}>{n}</div><span className="badge badge-neutral" style={{ height: 17, fontSize: 10, marginTop: 5 }}>{T("Skills mismatch", "عدم تطابق")}</span></div>)}</div>
          : <div className="card" style={{ padding: 12, textAlign: "center", color: "var(--text-3)", fontSize: 11.5 }}>{T("12 rejected this month — click to expand", "12 مرفوض هذا الشهر — انقر للتوسيع")}</div>}
      </div>
    </div>
  );
}

function PipeCard({ c, dragging, selected, onToggleSel, onAdvance, onDragStart, onDragEnd, onClick, idx, showJob, jobName, T, ar, lang, t, L }) {
  const [hover, setHover] = React.useState(false);
  const stuck = c.applied > 5;
  const veryStuck = c.applied > 10;
  const ex = (() => {
    if (c.stage === "assessment" && c.assess) return { ic: "assessment", tx: `${t("nav.assessments")} ${c.assess}%`, col: "var(--purple)" };
    if (c.stage === "aiInterview" && c.video) return { ic: "video", tx: `${t("vi.aiScore")} ${c.video}%`, col: "var(--ai)" };
    if (c.stage === "offer") return { ic: "offer", tx: t("of.status.pending"), col: "var(--warning)" };
    return null;
  })();
  return (
    <div className="card card-pad fade-up" draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: 13, cursor: "grab", opacity: dragging ? 0.4 : 1, animationDelay: idx * 25 + "ms", borderColor: selected ? "var(--accent)" : dragging ? "var(--accent)" : "var(--border)", boxShadow: selected ? "var(--ring)" : undefined, position: "relative" }}>
      <div className="flex" style={{ gap: 10, alignItems: "flex-start" }}>
        {(hover || selected) ? (
          <span onClick={e => { e.stopPropagation(); onToggleSel(); }} style={{ width: 36, height: 36, borderRadius: 9, display: "grid", placeItems: "center", flex: "0 0 auto", border: "1.5px solid " + (selected ? "var(--accent)" : "var(--border-strong)"), background: selected ? "var(--accent)" : "var(--surface)" }}>{selected && <Icon name="check" size={16} style={{ color: "#fff" }} />}</span>
        ) : <Avatar c={c} size={36} />}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{L(c.name)}</div>
          <div className="faint" style={{ fontSize: 11.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{L(c.title)}</div>
        </div>
        <MatchPill value={c.match} sm />
      </div>
      {showJob && <span className="badge badge-accent" style={{ height: 18, fontSize: 10.5, marginTop: 9 }}>{jobName}</span>}
      <div className="flex" style={{ alignItems: "center", gap: 8, marginTop: 11, flexWrap: "wrap" }}>
        {ex && <span className="badge" style={{ background: `color-mix(in oklch, ${ex.col} 13%, var(--surface))`, color: ex.col, height: 20, fontSize: 11 }}><Icon name={ex.ic} size={11} />{ex.tx}</span>}
        <span className="faint" style={{ fontSize: 11, marginInlineStart: "auto", color: veryStuck ? "var(--danger)" : stuck ? "var(--warning)" : "var(--text-3)", fontWeight: stuck ? 600 : 400 }}>
          <Icon name="clock" size={11} style={{ verticalAlign: "-2px" }} /> {c.applied}{ar ? "ي" : "d"}
        </span>
      </div>
      {hover && (
        <div className="flex" style={{ gap: 4, position: "absolute", bottom: 8, insetInlineEnd: 8, background: "var(--surface)", borderRadius: "var(--r-sm)", padding: 2, boxShadow: "var(--shadow-sm)" }} onClick={e => e.stopPropagation()}>
          <button className="btn-icon btn-sm" title={T("View", "عرض")} onClick={onClick}><Icon name="eye" size={14} /></button>
          <button className="btn-icon btn-sm" title={T("Advance", "تقديم")} onClick={onAdvance}><Icon name="arrowRight" size={14} /></button>
        </div>
      )}
    </div>
  );
}

function TableView({ visible, sort, setSort, sel, toggleSel, setSel, go, jobName, jobFilter, T, ar, t, L }) {
  const sorted = [...visible].sort((a, b) => {
    let r = 0;
    if (sort.key === "match") r = a.match - b.match;
    else if (sort.key === "name") r = L(a.name).localeCompare(L(b.name));
    else if (sort.key === "stage") r = a.stage.localeCompare(b.stage);
    else if (sort.key === "days") r = a.applied - b.applied;
    return sort.dir === "desc" ? -r : r;
  });
  const th = (key, label) => <th onClick={() => setSort(s => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }))} style={{ cursor: "pointer" }}>{label}{sort.key === key && <Icon name={sort.dir === "desc" ? "arrowDown" : "arrowUp"} size={11} style={{ marginInlineStart: 4, verticalAlign: "-1px" }} />}</th>;
  const allSel = sorted.length > 0 && sorted.every(c => sel[c.id]);
  return (
    <div className="card" style={{ flex: 1, overflow: "auto" }}>
      <table className="tbl">
        <thead><tr>
          <th style={{ width: 36 }}><span onClick={() => { const v = !allSel; const n = { ...sel }; sorted.forEach(c => n[c.id] = v); setSel(n); }} style={{ width: 18, height: 18, borderRadius: 5, border: "1.5px solid " + (allSel ? "var(--accent)" : "var(--border-strong)"), background: allSel ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}>{allSel && <Icon name="check" size={12} style={{ color: "#fff" }} />}</span></th>
          {th("name", T("Candidate", "المرشح"))}
          {jobFilter === "all" && <th>{T("Job", "الوظيفة")}</th>}
          {th("stage", T("Stage", "المرحلة"))}
          {th("match", T("AI Match", "التطابق"))}
          <th>{T("Signals", "الإشارات")}</th>
          {th("days", T("Days", "الأيام"))}
          <th></th>
        </tr></thead>
        <tbody>
          {sorted.map(c => (
            <tr key={c.id} onClick={() => go("candidate-profile", { id: c.id, from: "pipeline" })} style={{ background: sel[c.id] ? "var(--accent-soft)" : undefined }}>
              <td onClick={e => { e.stopPropagation(); toggleSel(c.id); }}><span style={{ width: 18, height: 18, borderRadius: 5, border: "1.5px solid " + (sel[c.id] ? "var(--accent)" : "var(--border-strong)"), background: sel[c.id] ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}>{sel[c.id] && <Icon name="check" size={12} style={{ color: "#fff" }} />}</span></td>
              <td><div className="flex" style={{ alignItems: "center", gap: 10 }}><Avatar c={c} size={32} /><div><div style={{ fontWeight: 600 }}>{L(c.name)}</div><div className="faint" style={{ fontSize: 11.5 }}>{L(c.title)}</div></div></div></td>
              {jobFilter === "all" && <td className="faint">{jobName(c.job)}</td>}
              <td><StageBadge stage={c.stage} /></td>
              <td><MatchPill value={c.match} sm /></td>
              <td>{c.assess ? <span className="badge badge-purple" style={{ height: 19 }}><Icon name="check" size={10} />{c.assess}%</span> : <span className="faint">—</span>}</td>
              <td><span className="mono" style={{ color: c.applied > 5 ? "var(--warning)" : "var(--text)" }}>{c.applied}d{c.applied > 5 && " ⚠"}</span></td>
              <td style={{ textAlign: "end" }} onClick={e => e.stopPropagation()}><button className="btn-icon btn-sm"><Icon name="kebab" size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && <div style={{ textAlign: "center", padding: 50, color: "var(--text-3)" }}><Icon name="search" size={28} /><div style={{ marginTop: 10 }}>{T("No candidates match your filters", "لا مرشحين مطابقين")}</div></div>}
    </div>
  );
}

window.Pipeline = Pipeline;
window.PIPE_STAGES = PIPE_STAGES;

export { Pipeline }
