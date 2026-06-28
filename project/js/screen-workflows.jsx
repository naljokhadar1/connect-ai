/* Connect AI — Workflows: library, builder canvas, stage panel */

/* ---------- inline edit ---------- */
function InlineEdit({ value, onCommit, className, style, inputStyle, placeholder, multiline }) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(value);
  React.useEffect(() => setVal(value), [value]);
  const commit = () => { setEditing(false); if (val !== value) onCommit(val); };
  if (editing) {
    const C = multiline ? "textarea" : "input";
    return (
      <C className={multiline ? "textarea" : "input"} autoFocus value={val} placeholder={placeholder}
        style={{ ...inputStyle, ...(multiline ? { minHeight: 60 } : {}) }}
        onChange={e => setVal(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === "Enter" && !multiline) commit(); if (e.key === "Escape") { setVal(value); setEditing(false); } }} />
    );
  }
  return (
    <div className={className} style={{ ...style, cursor: "text" }} onClick={() => setEditing(true)} title="Click to edit">
      {value || <span className="faint">{placeholder}</span>}
    </div>
  );
}

/* ---------- canonical type chip ---------- */
function CTChip({ type, sm }) {
  const { t } = useApp();
  const color = window.CT_COLOR[type] || "neutral";
  return <span className={"badge badge-" + color} style={{ height: sm ? 18 : 20, fontSize: sm ? 10.5 : 11 }}>{t("ct." + type)}</span>;
}

/* ============================================================
   Container
   ============================================================ */
function Workflows({ toast }) {
  const { t } = useApp();
  const [view, setView] = React.useState("library");
  const [wfId, setWfId] = React.useState(null);
  const [workflows, setWorkflows] = React.useState(() => window.WORKFLOWS);

  const open = (id) => { setWfId(id); setView("builder"); };

  const createNew = () => {
    const id = "custom-" + Date.now();
    const sid = () => Math.random().toString(36).slice(2, 8);
    const blank = {
      id, preset: false, jobs: 0,
      name: { en: "Untitled workflow", ar: "سير عمل بلا عنوان" },
      desc: { en: "Add a description…", ar: "أضف وصفاً…" },
      modified: { en: "just now", ar: "الآن" },
      stages: [
        { id: sid(), name: { en: "Applied", ar: "تقدّم" }, type: "applied", count: 0, email: null, optional: false, terminal: null, color: "gray", desc: null },
        { id: sid(), name: { en: "Hired",    ar: "تم التوظيف" }, type: "hired",    count: 0, email: null, optional: false, terminal: "success", color: "gray", desc: null },
        { id: sid(), name: { en: "Rejected", ar: "مرفوض" },     type: "rejected", count: 0, email: null, optional: false, terminal: "exit",    color: "gray", desc: null },
      ],
    };
    setWorkflows(ws => [...ws, blank]);
    setWfId(id);
    setView("builder");
  };

  const wf = workflows.find(w => w.id === wfId);

  if (view === "builder" && wf) {
    return <WorkflowBuilder wf={wf} onBack={() => setView("library")} toast={toast}
      onUpdate={(next) => setWorkflows(ws => ws.map(w => w.id === next.id ? next : w))} />;
  }
  return <WorkflowsLibrary onOpen={open} onCreateNew={createNew} toast={toast} workflows={workflows} />;
}

/* ============================================================
   View 1 — Library
   ============================================================ */
function WorkflowsLibrary({ onOpen, onCreateNew, toast, workflows }) {
  const { t, L, lang } = useApp();
  const presets = workflows.filter(w => w.preset);
  const custom = workflows.filter(w => !w.preset);

  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">{t("wf.title")}</h1><div className="page-sub">{t("wf.sub")}</div></div>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={onCreateNew}><Icon name="plus" size={17} />{t("wf.new")}</button>
      </div>

      {/* stat row */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 26 }}>
        <div className="card card-pad flex" style={{ alignItems: "center", gap: 13 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, flex: "0 0 auto", display: "grid", placeItems: "center", background: "color-mix(in oklch, var(--accent) 13%, var(--surface))", color: "var(--accent)" }}><Icon name="workflow" size={19} /></span>
          <div><div className="mono tnum" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>7</div><div className="faint" style={{ fontSize: 12, fontWeight: 600 }}>{t("wf.total")}</div></div>
        </div>
        <div className="card card-pad flex" style={{ alignItems: "center", gap: 13 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, flex: "0 0 auto", display: "grid", placeItems: "center", background: "color-mix(in oklch, var(--info) 13%, var(--surface))", color: "var(--info)" }}><Icon name="briefcase" size={19} /></span>
          <div><div className="mono tnum" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>34</div><div className="faint" style={{ fontSize: 12, fontWeight: 600 }}>{t("wf.activeJobs")}</div></div>
        </div>
        <div className="card card-pad flex" style={{ alignItems: "center", gap: 13 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, flex: "0 0 auto", display: "grid", placeItems: "center", background: "color-mix(in oklch, var(--success) 13%, var(--surface))", color: "var(--success)" }}><Icon name="check" size={19} /></span>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2, whiteSpace: "nowrap" }}>{lang === "ar" ? "توظيف قياسي" : "Standard Hire"}</div><div className="faint" style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{t("wf.defaultWf")}</div></div>
        </div>
      </div>

      {/* presets */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600 }}>{t("wf.presets")}</h2>
        <div className="faint" style={{ fontSize: 13, marginTop: 2 }}>{t("wf.presetsSub")}</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 34 }}>
        {presets.map(w => <PresetCard key={w.id} w={w} onOpen={onOpen} toast={toast} />)}
      </div>

      {/* custom */}
      <div className="flex" style={{ alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>{t("wf.yourWorkflows")}</h2>
        <button className="btn btn-ghost btn-sm">{t("wf.allWorkflows")}<Icon name="chevDown" size={15} /></button>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {custom.map(w => <CustomCard key={w.id} w={w} onOpen={onOpen} toast={toast} />)}
        <button className="role-card-new" onClick={() => onOpen("eng-junior")}>
          <span style={{ width: 42, height: 42, borderRadius: 11, background: "var(--surface-3)", display: "grid", placeItems: "center" }}><Icon name="plus" size={20} /></span>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{t("wf.createScratch")}</span>
        </button>
      </div>
    </div>
  );
}

function PresetCard({ w, onOpen, toast }) {
  const { t, L, lang } = useApp();
  return (
    <div className="card card-pad role-card" style={{ position: "relative" }} onClick={() => onOpen(w.id)}>
      <span className="badge badge-neutral" style={{ position: "absolute", top: 14, insetInlineEnd: 14, height: 19, fontSize: 10.5 }}>{t("wf.preset")}</span>
      <div className="flex" style={{ alignItems: "center", gap: 9, paddingInlineEnd: 56 }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, flex: "0 0 auto", display: "grid", placeItems: "center", background: "var(--accent-soft)", color: "var(--accent-strong)" }}><Icon name="workflow" size={17} /></span>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{L(w.name)}</h3>
      </div>
      <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, minHeight: 38 }}>{L(w.desc)}</div>
      <div className="flex" style={{ alignItems: "center", gap: 14, fontSize: 12.5 }}>
        <span className="faint flex" style={{ alignItems: "center", gap: 5 }}><Icon name="pipeline" size={14} />{w.stages.length} {t("wf.stagesUnit")}</span>
        <span className="faint flex" style={{ alignItems: "center", gap: 5 }}><Icon name="briefcase" size={14} />{t("wf.usedBy")} {w.jobs} {t("wf.jobsUnit")}</span>
        {w.isDefault && <span className="badge badge-accent" style={{ height: 20 }}>{t("wf.defaultBadge")}</span>}
      </div>
      <hr className="divider" />
      <div className="flex" style={{ gap: 8 }}>
        <button className="btn btn-subtle btn-sm" onClick={(e) => { e.stopPropagation(); toast(t("wf.autoSaved"), "check"); onOpen(w.id); }}><Icon name="plus" size={14} />{t("wf.useTemplate")}</button>
        <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onOpen(w.id); }}><Icon name="eye" size={14} />{t("wf.preview")}</button>
      </div>
    </div>
  );
}

function CustomCard({ w, onOpen, toast }) {
  const { t, L, lang } = useApp();
  const chips = w.stages.slice(0, 4);
  const extra = w.stages.length - chips.length;
  return (
    <div className="card card-pad role-card" onClick={() => onOpen(w.id)}>
      <div className="flex" style={{ alignItems: "flex-start", gap: 9 }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, flex: "0 0 auto", display: "grid", placeItems: "center", background: "var(--surface-3)", color: "var(--text-2)" }}><Icon name="workflow" size={17} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>{L(w.name)}</h3>
          <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{L(w.desc)}</div>
        </div>
        <div onClick={e => e.stopPropagation()}>
          <Kebab items={[
            { icon: "edit", label: t("wf.edit"), onClick: () => onOpen(w.id) },
            { icon: "file", label: t("wf.duplicate"), onClick: () => toast(t("wf.autoSaved"), "check") },
            { icon: "check", label: t("wf.setDefault"), onClick: () => toast(t("wf.autoSaved"), "check") },
            { icon: "trash", label: t("wf.archive"), danger: true },
          ]} />
        </div>
      </div>
      <div className="flex" style={{ flexWrap: "wrap", gap: 6 }}>
        {chips.map((s, i) => <span key={i} className="chip" style={{ height: 24, fontSize: 11.5 }}>{L(s.name)}</span>)}
        {extra > 0 && <span className="chip" style={{ height: 24, fontSize: 11.5, background: "transparent" }}>+{extra} {t("wf.more")}</span>}
      </div>
      <hr className="divider" />
      <div className="flex" style={{ alignItems: "center", gap: 14, fontSize: 12 }}>
        <span className="faint flex" style={{ alignItems: "center", gap: 5 }}><Icon name="pipeline" size={13} />{w.stages.length} {t("wf.stagesUnit")}</span>
        <span className="faint flex" style={{ alignItems: "center", gap: 5 }}><Icon name="briefcase" size={13} />{w.jobs} {w.jobs === 1 ? t("wf.jobUnit") : t("wf.jobsUnit")}</span>
        <div className="spacer" style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 11.5 }}>{t("wf.modified")} {L(w.modified)}</span>
      </div>
    </div>
  );
}

/* ============================================================
   View 2 — Builder canvas
   ============================================================ */
function WorkflowBuilder({ wf, onBack, toast, onUpdate }) {
  const { t, L, lang } = useApp();
  const [selStage, setSelStage] = React.useState(null);
  const [pending, setPending] = React.useState(false);
  const [isDefault, setIsDefault] = React.useState(!!wf.isDefault);
  const [stages, setStages] = React.useState(wf.stages);
  const [addStage, setAddStage] = React.useState(null); // null | {insertAfterIndex}
  const [newStageId, setNewStageId] = React.useState(null);
  const canvasRef = React.useRef();

  // stages is now tracked in state above
  const sel = stages.find(s => s.id === selStage) || (wf._terminals || []).find(s => s.id === selStage);

  // terminal stages (built once)
  const terminals = React.useMemo(() => ([
    { id: "term-hired", name: { en: "Hired", ar: "تم التوظيف" }, type: "hired", count: 0, email: "Welcome / Onboarding", terminal: "success", optional: false, color: "teal" },
    { id: "term-rejected", name: { en: "Rejected", ar: "مرفوض" }, type: "rejected", count: 0, email: null, terminal: "exit", optional: false, color: "gray" },
  ]), []);
  wf._terminals = terminals;

  const commitName = (v) => { onUpdate({ ...wf, name: { ...wf.name, [lang]: v } }); setPending(true); };
  const commitDesc = (v) => { onUpdate({ ...wf, desc: { ...wf.desc, [lang]: v } }); setPending(true); };
  const save = () => { setPending(false); toast(t("wf.autoSaved"), "check"); };
  const change = () => toast(t("wf.autoSaved"), "check");

  return (
    <div className="page" style={{ maxWidth: "100%" }}>
      <div className="crumbs">
        <a onClick={onBack}>{t("wf.title")}</a><span className="sep">›</span><span>{L(wf.name)}</span>
      </div>

      {/* header strip */}
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div className="flex" style={{ gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <InlineEdit value={L(wf.name)} onCommit={commitName} className="page-title" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.02em", borderRadius: 6, padding: "1px 4px", marginInlineStart: -4 }} inputStyle={{ fontSize: 22, fontWeight: 600, height: 40 }} />
            <InlineEdit value={L(wf.desc)} onCommit={commitDesc} className="muted" style={{ fontSize: 13.5, marginTop: 3, borderRadius: 6, padding: "1px 4px", marginInlineStart: -4 }} inputStyle={{ fontSize: 13.5 }} placeholder={t("wf.descOptional")} />
          </div>
          <div className="flex" style={{ alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <a className="faint flex" style={{ alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600 }}><Icon name="briefcase" size={14} />{t("wf.usedBy")} {wf.jobs} {wf.jobs === 1 ? t("wf.jobUnit") : t("wf.jobsUnit")}</a>
            <button className="flex" onClick={() => { setIsDefault(d => !d); change(); }} style={{ alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border-strong)", fontSize: 12.5, fontWeight: 600, background: isDefault ? "var(--accent-soft)" : "var(--surface)", color: isDefault ? "var(--accent-strong)" : "var(--text-2)" }}>
              <span style={{
                width: 30, height: 17, borderRadius: 20, flex: "0 0 30px",
                background: isDefault ? "var(--accent)" : "var(--border-strong)",
                position: "relative", display: "inline-block", transition: "background var(--t)",
                pointerEvents: "none"
              }}>
                <span style={{
                  position: "absolute", top: 2, insetInlineStart: isDefault ? 15 : 2,
                  width: 13, height: 13, borderRadius: "50%", background: "#fff",
                  boxShadow: "0 1px 2px rgba(0,0,0,.3)", transition: "inset-inline-start var(--t)"
                }} />
              </span>
              {t("wf.setDefault")}
            </button>
            {pending
              ? <button className="btn btn-primary" onClick={save}><Icon name="check" size={16} />{t("wf.save")}</button>
              : <span className="faint flex" style={{ alignItems: "center", gap: 6, fontSize: 12.5 }}><Icon name="check" size={14} style={{ color: "var(--success)" }} />{t("wf.savedAgo")}</span>}
          </div>
        </div>
      </div>

      {/* canvas */}
      <div className="wf-canvas">
        <div className="wf-zoom">
          <button title="zoom out"><Icon name="x" size={14} style={{ display: "none" }} /><span style={{ fontSize: 16, lineHeight: 1 }}>−</span></button>
          <span className="zlabel mono">100%</span>
          <button title="zoom in"><Icon name="plus" size={14} /></button>
          <div className="vr" style={{ height: 18, margin: "0 2px" }} />
          <button className="has-tip" data-tip={t("wf.fit")}><Icon name="target" size={16} /></button>
        </div>

        <div className="wf-flow">
          {stages.map((s, i) => (
            <React.Fragment key={s.id}>
              <StageCard s={s} onClick={() => setSelStage(s.id)} />
              <Connector onInsert={change} />
            </React.Fragment>
          ))}
          <div className="wf-addstage" onClick={() => setAddStage({ insertAfterIndex: stages.length })} ref={canvasRef}>
            <Icon name="plus" size={20} /><span style={{ fontSize: 12.5, fontWeight: 600 }}>{t("wf.addStage")}</span>
          </div>
          <Connector onInsert={change} noInsert />
          <div className="wf-branch">
            {terminals.map(s => <StageCard key={s.id} s={s} terminal onClick={() => setSelStage(s.id)} />)}
          </div>
        </div>
      </div>

      {/* legend */}
      <div className="wf-legend">
        <span><span className="sdot" style={{ background: "var(--accent)" }} />{t("wf.legendRequired")}</span>
        <span><span style={{ width: 11, height: 11, borderRadius: "50%", border: "1.5px dashed var(--text-3)" }} />{t("wf.legendOptional")}</span>
        <span><Icon name="check" size={14} style={{ color: "var(--success)" }} />{t("wf.legendSuccess")}</span>
        <span><Icon name="x" size={14} style={{ color: "var(--text-3)" }} />{t("wf.legendExit")}</span>
      </div>

      <StagePanel stage={sel} onClose={() => setSelStage(null)} toast={toast} onChange={change} />

      {addStage && <AddStageModal
        existingStages={stages}
        insertAfterIndex={addStage.insertAfterIndex < stages.length ? addStage.insertAfterIndex : null}
        onClose={() => setAddStage(null)}
        toast={toast}
        onAdd={(newS, idx) => {
          const next = [...stages];
          next.splice(idx, 0, newS);
          setStages(next);
          setNewStageId(newS.id);
          setTimeout(() => setNewStageId(null), 1600);
          toast(t("wf.stageAdded"), "check");
          if (canvasRef.current) setTimeout(() => canvasRef.current.scrollLeft = canvasRef.current.scrollWidth, 50);
        }}
      />}
    </div>
  );
}

function Connector({ onInsert, noInsert }) {
  const { t } = useApp();
  return (
    <div className="wf-connector">
      {!noInsert && (
        <button className="ins has-tip" data-tip={t("wf.insertStage")} onClick={onInsert}><Icon name="plus" size={14} /></button>
      )}
    </div>
  );
}

function StageCard({ s, onClick, terminal, isNew }) {
  const { t, L, lang } = useApp();
  const cls = "stage-card" + (s.optional ? " optional" : "") + (s.terminal === "success" ? " term-success" : "") + (s.terminal === "exit" ? " term-exit" : "") + (isNew ? " stage-new" : "");
  return (
    <div className={cls} onClick={onClick}>
      <span className="stage-drag"><Icon name="drag" size={15} /></span>
      {!terminal && <span className="stage-configure"><Icon name="sliders" size={11} />Configure</span>}
      <div className="flex" style={{ alignItems: "center", gap: 7 }}>
        {s.terminal === "success" && <Icon name="check" size={15} style={{ color: "var(--success)" }} />}
        {s.terminal === "exit" && <Icon name="x" size={15} style={{ color: "var(--text-3)" }} />}
        <span className="sc-name">{L(s.name)}</span>
        {s.optional && <span className="badge badge-neutral" style={{ height: 17, fontSize: 9.5, marginInlineStart: "auto" }}>{t("wf.optionalSkip").split(" ")[0]}</span>}
      </div>
      <div style={{ marginTop: 6 }}><CTChip type={s.type} sm /></div>
      <div className="sc-foot">
        <span className="sc-mail">
          <Icon name="mail" size={13} fill={!!s.email} style={{ color: s.email ? "var(--accent)" : "var(--text-3)", flex: "0 0 auto" }} />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: s.email ? "var(--text-2)" : "var(--text-3)", fontWeight: s.email ? 600 : 400 }}>{s.email || t("wf.noEmail")}</span>
        </span>
        {!terminal && <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>{s.count}</span>}
      </div>
    </div>
  );
}

window.Workflows = Workflows;
