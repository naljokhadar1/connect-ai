/* Connect AI — Linked workflow stages table + link-to-stage modal */

/* initial linkages for "Interview Invitation" */
const INIT_LINKAGES = [
  { id:"l1", wf:"Standard Hire",           wfId:"standard",  stage:"Recruiter Screen",  stageType:"screening", recipients:["Candidate"],                   sendMode:"auto",  delay:"immediately", status:"active" },
  { id:"l2", wf:"Engineering \u2014 Senior",    wfId:"eng-senior",stage:"Recruiter Screen",  stageType:"screening", recipients:["Candidate","Hiring Manager"],  sendMode:"auto",  delay:"immediately", status:"active" },
  { id:"l3", wf:"Engineering \u2014 Junior",    wfId:"eng-junior",stage:"Phone Screen",       stageType:"screening", recipients:["Candidate"],                   sendMode:"draft", delay:"immediately", status:"active" },
  { id:"l4", wf:"Sales \u2014 Account Executive",wfId:"sales-ae",  stage:"Discovery Call",    stageType:"screening", recipients:["Candidate"],                   sendMode:"auto",  delay:"1h",          status:"active" },
  { id:"l5", wf:"Internship Program 2026",  wfId:"internship",stage:"Initial Chat",      stageType:"screening", recipients:["Candidate"],                   sendMode:"auto",  delay:"immediately", status:"paused" },
];

/* ============================================================
   LinkedStages — table + empty state
   ============================================================ */
function LinkedStages({ linkages, setLinkages, toast }) {
  const { t, lang } = useApp();
  const [linkModal, setLinkModal] = React.useState(null); // null | "new" | linkage (edit)

  const colHd = (label) => <th style={{ textAlign: "start", fontSize: 11, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-3)", padding: "11px 14px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{label}</th>;

  const delayLabel = (d) => ({ immediately: "Immediately", "1h": "After 1 hour", "1d": "After 1 business day" }[d] || d);

  const unlink = (id) => { setLinkages(ls => ls.filter(l => l.id !== id)); toast(lang === "ar" ? "تم فك الرابط" : "Linkage removed", "check"); };
  const togglePause = (id) => { setLinkages(ls => ls.map(l => l.id === id ? { ...l, status: l.status === "active" ? "paused" : "active" } : l)); toast(t("wf.autoSaved"), "check"); };

  const onLink = (newLinkages) => {
    setLinkages(prev => {
      const replaced = newLinkages.filter(nl => prev.some(pl => pl.wfId === nl.wfId && pl.stage === nl.stage)).length;
      const merged = [...prev.filter(pl => !newLinkages.some(nl => nl.wfId === pl.wfId && nl.stage === pl.stage)), ...newLinkages];
      const msg = lang === "ar" ? `تم الربط بـ ${newLinkages.length} مراحل.` + (replaced ? ` ${replaced} روابط مستبدَلة.` : "") : `Template linked to ${newLinkages.length} stage(s).` + (replaced ? ` ${replaced} previous linkage(s) replaced.` : "");
      toast(msg, "check");
      return merged;
    });
    setLinkModal(null);
  };

  return (
    <React.Fragment>
      <div className="card">
        <div className="card-head" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3>{t("ed.linkedStages")}</h3>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 3, fontWeight: 400 }}>{t("ed.linkedSub")}</div>
          </div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 2 }} onClick={() => setLinkModal("new")}><Icon name="plus" size={15} />{t("ed.linkStage")}</button>
        </div>

        {linkages.length === 0 ? (
          <div className="card-pad" style={{ textAlign: "center", padding: "44px 20px" }}>
            <span style={{ width: 48, height: 48, borderRadius: 12, background: "var(--surface-3)", color: "var(--text-3)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}><Icon name="mail" size={24} /></span>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{t("ed.noLinkages")}</div>
            <div className="muted" style={{ fontSize: 13, maxWidth: 360, margin: "0 auto 16px" }}>{t("ed.noLinkagesSub")}</div>
            <button className="btn btn-primary btn-sm" onClick={() => setLinkModal("new")}><Icon name="plus" size={14} />{t("ed.linkStage")}</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                {colHd(lang === "ar" ? "المسار" : "Workflow")}
                {colHd(lang === "ar" ? "المرحلة" : "Stage")}
                {colHd(lang === "ar" ? "المستلمون" : "Recipients")}
                {colHd(lang === "ar" ? "وضع الإرسال" : "Send mode")}
                {colHd(lang === "ar" ? "التأخير" : "Delay")}
                {colHd(lang === "ar" ? "الحالة" : "Status")}
                <th style={{ width: 48 }} />
              </tr></thead>
              <tbody>
                {linkages.map(l => (
                  <tr key={l.id} style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "12px 14px" }}>
                      <div className="flex" style={{ alignItems: "center", gap: 7 }}>
                        <Icon name="workflow" size={14} style={{ color: "var(--text-3)", flex: "0 0 auto" }} />
                        <a style={{ fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>{l.wf}</a>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{l.stage}</div>
                      <CTChip type={l.stageType} sm />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div className="flex" style={{ gap: 5, flexWrap: "wrap" }}>
                        {l.recipients.map((r, i) => <span key={i} className="chip" style={{ height: 22, fontSize: 11.5, background: "var(--accent-soft)", color: "var(--accent-strong)" }}>{r}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      {l.sendMode === "auto"
                        ? <span className="badge badge-success" style={{ height: 21 }}><span className="b-dot" />{t("ed.autoSendPill")}</span>
                        : <span className="badge badge-warning" style={{ height: 21 }}><span className="b-dot" />{t("ed.draftPill")}</span>}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-2)", whiteSpace: "nowrap" }}>{delayLabel(l.delay)}</td>
                    <td style={{ padding: "12px 14px" }}>
                      {l.status === "active"
                        ? <span className="badge badge-success" style={{ height: 21 }}><span className="b-dot" />Active</span>
                        : <span className="badge badge-neutral" style={{ height: 21 }}><span className="b-dot" />Paused</span>}
                    </td>
                    <td style={{ padding: "12px 8px" }} onClick={e => e.stopPropagation()}>
                      <Kebab items={[
                        { icon: "edit",    label: t("ed.editLinkage"),  onClick: () => setLinkModal(l) },
                        { icon: "pause",   label: t("ed.pauseLinkage"), onClick: () => togglePause(l.id) },
                        { icon: "x",       label: t("ed.unlinkage"),    onClick: () => unlink(l.id), danger: true },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {linkModal && <LinkToStageModal mode={typeof linkModal === "object" ? "edit" : "new"} editLinkage={typeof linkModal === "object" ? linkModal : null} currentLinkages={linkages} onClose={() => setLinkModal(null)} onLink={onLink} />}
    </React.Fragment>
  );
}

/* ============================================================
   LinkToStageModal
   ============================================================ */
function LinkToStageModal({ mode, editLinkage, currentLinkages, onClose, onLink }) {
  const { t, lang } = useApp();
  const isEdit = mode === "edit";

  const allWfs = window.WORKFLOWS || [];
  const [wfPickerOpen, setWfPickerOpen] = React.useState(false);
  const [selWfs, setSelWfs] = React.useState(() => isEdit ? new Set([editLinkage.wfId]) : new Set(["eng-senior", "eng-junior"]));
  const [selStages, setSelStages] = React.useState(() => {
    const init = new Set();
    if (isEdit) init.add(editLinkage.wfId + ":" + editLinkage.stage);
    else {
      currentLinkages.forEach(l => init.add(l.wfId + ":" + l.stage));
    }
    return init;
  });
  const [replaceMap, setReplaceMap] = React.useState({});
  const [settings, setSettings] = React.useState(() => isEdit ? {
    recipients: editLinkage.recipients, sendMode: editLinkage.sendMode, delay: editLinkage.delay, status: editLinkage.status,
  } : { recipients: ["Candidate"], sendMode: "auto", delay: "immediately", status: "active" });

  const setSetting = (k, v) => setSettings(s => ({ ...s, [k]: v }));
  const toggleRecipient = (r) => setSetting("recipients", settings.recipients.includes(r) ? settings.recipients.filter(x => x !== r) : [...settings.recipients, r]);

  const selectedWfList = allWfs.filter(w => selWfs.has(w.id));
  const totalSelected = selStages.size;
  const replacements = [...selStages].filter(k => {
    const [wfId, stage] = k.split(":");
    return currentLinkages.some(l => l.wfId === wfId && l.stage === stage && !(isEdit && l.id === editLinkage.id));
  }).length;

  const toggleWf = (id) => setSelWfs(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleStage = (key, stageName, stageType) => {
    setSelStages(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
    if (replaceMap[key]) { /* already shown */ } else {
      const [wfId, stage] = key.split(":");
      const conflict = currentLinkages.find(l => l.wfId !== (isEdit ? editLinkage.wfId : "") && l.stage === stageName && l.wfId !== wfId);
      if (conflict) setReplaceMap(m => ({ ...m, [key]: conflict.wf }));
    }
  };
  const autoSelect = () => {
    const rec = ["screening", "interview"];
    const keys = new Set(selStages);
    selectedWfList.forEach(wf => wf.stages.forEach(s => { if (rec.includes(s.type)) keys.add(wf.id + ":" + s.name.en); }));
    setSelStages(keys);
  };

  const submit = () => {
    const newLinkages = [...selStages].map((key, i) => {
      const [wfId, stageName] = key.split(":");
      const wf = allWfs.find(w => w.id === wfId);
      const stage = wf && wf.stages.find(s => s.name.en === stageName);
      return { id: "l" + Date.now() + i, wf: wf ? wf.name.en : wfId, wfId, stage: stageName, stageType: stage ? stage.type : "screening", recipients: settings.recipients, sendMode: settings.sendMode, delay: settings.delay, status: settings.status };
    });
    onLink(newLinkages);
  };

  const CONFLICT_MAP = { "CV Review": "Application Received", "Applied": "Application Received" };

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3 style={{ fontSize: 16.5 }}>{isEdit ? (lang === "ar" ? "تعديل الرابط" : "Edit linkage") : (lang === "ar" ? "ربط القالب بمرحلة مسار" : "Link template to workflow stage")}</h3>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{lang === "ar" ? "يُرسَل القالب تلقائياً عند دخول المرشحين المراحل المحددة." : "This template will send automatically when candidates enter the selected stage(s)."}</div>
          </div>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div className="modal-body" style={{ padding: 0, maxHeight: "72vh", overflow: "hidden", display: "flex" }}>
          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 0, borderInlineEnd: "1px solid var(--border)", padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Workflow picker */}
            <div className="field">
              <label style={{ marginBottom: 8, display: "block" }}>{lang === "ar" ? "الخطوة 1 — اختر المسارات" : "Step 1 — Pick workflows"}</label>
              {/* Selected chips */}
              {selWfs.size > 0 && (
                <div className="flex" style={{ flexWrap: "wrap", gap: 7, marginBottom: 9 }}>
                  {[...selWfs].map(id => { const w = allWfs.find(x => x.id === id); return (
                    <span key={id} className="chip chip-accent removable">
                      {w ? w.name.en : id}
                      <button className="x" onClick={() => toggleWf(id)}><Icon name="x" size={11} /></button>
                    </span>
                  ); })}
                </div>
              )}
              {/* Dropdown trigger */}
              <div style={{ position: "relative" }}>
                <button className="input flex" style={{ height: 40, textAlign: "start", alignItems: "center", gap: 8, color: "var(--text-3)" }}
                  onClick={() => setWfPickerOpen(o => !o)}>
                  <Icon name="search" size={16} />{t("ed.lsPickWorkflows")}<Icon name="chevDown" size={14} style={{ marginInlineStart: "auto" }} />
                </button>
                {wfPickerOpen && (
                  <React.Fragment>
                    <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setWfPickerOpen(false)} />
                    <div style={{ position: "absolute", insetInlineStart: 0, top: "calc(100% + 4px)", width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-lg)", zIndex: 50, padding: "6px 0", maxHeight: 240, overflowY: "auto" }}>
                      {allWfs.map(w => (
                        <div key={w.id} className="flex" style={{ alignItems: "center", gap: 10, padding: "8px 14px", cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = ""}
                          onClick={() => toggleWf(w.id)}>
                          <span className={"cbx" + (selWfs.has(w.id) ? " on" : "")} style={{ display: "flex", gap: 10, width: "100%", padding: 0 }}>
                            <span className="box" style={{ flex: "0 0 auto" }}>{selWfs.has(w.id) && <Icon name="check" size={13} />}</span>
                            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{w.name.en}</span>
                            {w.preset && <span className="badge badge-neutral" style={{ height: 18, fontSize: 10 }}>Preset</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div className="hint">{lang === "ar" ? "يمكنك ربط هذا القالب بمسارات متعددة دفعة واحدة." : "You can link this template to multiple workflows at once."}</div>
            </div>

            {/* Stage picker */}
            {selWfs.size > 0 && (
              <div className="field">
                <label style={{ marginBottom: 10, display: "block" }}>{lang === "ar" ? "الخطوة 2 — اختر المراحل" : "Step 2 — Pick stages"}</label>
                {/* AI suggestion */}
                <div className="flex" style={{ alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--ai-soft)", border: "1px solid color-mix(in oklch,var(--ai) 30%,transparent)", borderRadius: "var(--r-sm)", marginBottom: 12 }}>
                  <Icon name="sparkles" size={14} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} />
                  <span style={{ flex: 1, fontSize: 12.5, color: "var(--text-2)" }}>{t("ed.lsAiSuggest")}</span>
                  <a style={{ fontSize: 12, fontWeight: 600, color: "var(--ai)", cursor: "pointer", whiteSpace: "nowrap" }} onClick={autoSelect}>{t("ed.lsAutoSelect")}</a>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {selectedWfList.map(wf => (
                    <div key={wf.id}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--text-3)", padding: "10px 2px 6px" }}>{wf.name.en}</div>
                      {wf.stages.concat([{ name:{en:"Hired",ar:"تم التوظيف"}, type:"hired" },{ name:{en:"Rejected",ar:"مرفوض"}, type:"rejected" }]).map((s, si) => {
                        const key = wf.id + ":" + s.name.en;
                        const checked = selStages.has(key);
                        const conflict = CONFLICT_MAP[s.name.en];
                        return (
                          <React.Fragment key={si}>
                            <div className={"cbx" + (checked ? " on" : "")} onClick={() => toggleStage(key, s.name.en, s.type)} style={{ borderRadius: "var(--r-sm)", padding: "7px 8px" }}>
                              <span className="box">{checked && <Icon name="check" size={13} />}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="flex" style={{ alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                                  <span style={{ fontWeight: 600, fontSize: 13 }}>{s.name.en}</span>
                                  <CTChip type={s.type} sm />
                                  {s.optional && <span className="badge badge-neutral" style={{ height: 16, fontSize: 9.5 }}>Optional</span>}
                                  {s.terminal && <span className="badge" style={{ height: 16, fontSize: 9.5, background: s.type==="hired"?"var(--success-soft)":"var(--surface-3)", color: s.type==="hired"?"var(--success)":"var(--text-3)" }}>{s.type==="hired"?"Terminal":"Exit"}</span>}
                                  {conflict && !checked && <span className="muted" style={{ fontSize: 11, display:"flex", alignItems:"center", gap:4 }}><Icon name="alert" size={11} style={{ color:"var(--warning)" }} />{t("ed.alreadyLinked")} '{conflict}'</span>}
                                </div>
                              </div>
                            </div>
                            {conflict && checked && (
                              <div style={{ margin: "0 8px 6px 34px", padding: "7px 11px", background: "var(--warning-soft)", border: "1px solid color-mix(in oklch,var(--warning) 35%,transparent)", borderRadius: "var(--r-sm)", fontSize: 12.5, color: "var(--text-2)" }}>
                                <Icon name="alert" size={13} style={{ color:"var(--warning)", verticalAlign:"-2px", marginInlineEnd:5 }} />
                                {lang==="ar"?`استبدال '${conflict}' بهذا القالب في ${s.name.en}؟`:`Replace '${conflict}' with this template on ${s.name.en}?`}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ flex: "0 0 280px", minWidth: 0, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18, background: "var(--surface-2)" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t("ed.lsSettings")}</div>
              <div className="muted" style={{ fontSize: 12 }}>{t("ed.lsSettingsHelper")}</div>
            </div>
            <div className="field">
              <label>{t("ed.recipients")}</label>
              <div className="flex" style={{ flexWrap: "wrap", gap: 8 }}>
                {["Candidate","Hiring Manager","Recruiter","Interviewer"].map(r => (
                  <span key={r} className={"chip chip-sel" + (settings.recipients.includes(r) ? " on" : "")} onClick={() => toggleRecipient(r)}>
                    {settings.recipients.includes(r) && <Icon name="check" size={12} />}{r}
                  </span>
                ))}
              </div>
            </div>
            <div className="field">
              <label>{t("wf.sendMode")}</label>
              {[["auto","Auto-send immediately"],["draft","Create draft for review"]].map(([v,l]) => (
                <div key={v} className={"rad-opt" + (settings.sendMode===v?" on":"")} onClick={() => setSetting("sendMode",v)}>
                  <span className="rad" /><span style={{ fontSize:13, fontWeight:600 }}>{l}</span>
                </div>
              ))}
            </div>
            <div className="field">
              <label>{t("wf.delay")}</label>
              <select className="select" value={settings.delay} onChange={e => setSetting("delay", e.target.value)}>
                <option value="immediately">{t("wf.sendNow")}</option>
                <option value="1h">{t("wf.after1h")}</option>
                <option value="1d">{t("wf.after1d")}</option>
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              {[["active","Active"],["paused","Paused"]].map(([v,l]) => (
                <div key={v} className={"rad-opt" + (settings.status===v?" on":"")} onClick={() => setSetting("status",v)}>
                  <span className="rad" /><span style={{ fontSize:13, fontWeight:600 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <span className="muted" style={{ fontSize: 13 }}>{t("ed.lsSelected")} <strong>{totalSelected}</strong> {t("ed.lsStages")} <strong>{selWfs.size}</strong> {t("ed.lsWorkflows")}</span>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" disabled={totalSelected === 0} onClick={submit}>
            <Icon name="link" size={15} />{isEdit ? t("ed.lsSave") : (replacements > 0 ? `${t("ed.lsSubmit")} (replaces ${replacements})` : t("ed.lsSubmit"))}
          </button>
        </div>
      </div>
    </div>
  );
}

window.LinkedStages = LinkedStages;
window.LinkToStageModal = LinkToStageModal;
window.INIT_LINKAGES = INIT_LINKAGES;
