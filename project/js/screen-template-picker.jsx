/* Connect AI — Template Picker modal (used in stage panel + add-stage modal) */

const CAT_REC = {
  screening:   ["screening","application"],
  interview:   ["interview","screening"],
  assessment:  ["assessment"],
  offer:       ["offer"],
  hired:       ["onboarding"],
  rejected:    ["rejection"],
  applied:     ["application"],
  other:       Object.keys(window.ET_CATS || {}),
};

function TemplatePicker({ stageType, stageName, open, onClose, onLink }) {
  const { t, L, lang } = useApp();
  const [q, setQ] = React.useState("");
  const [catF, setCatF] = React.useState("all");
  const [langF, setLangF] = React.useState("all");
  const [showRec, setShowRec] = React.useState(true);
  const [aiDismissed, setAiDismissed] = React.useState(false);
  const [selId, setSelId] = React.useState(null);
  const [settings, setSettings] = React.useState({ recipients: ["Candidate"], sendMode: "auto", delay: "now" });

  // reset on open
  React.useEffect(() => { if (open) { setQ(""); setCatF("all"); setLangF("all"); setShowRec(true); setAiDismissed(false); setSelId(null); } }, [open]);

  if (!open) return null;

  const recommended = CAT_REC[stageType] || [];
  const tpls = (window.ET_TEMPLATES || []).filter(tp => {
    if (!tp.status || tp.status === "draft") return false; // hide drafts
    if (q && !tp.name.en.toLowerCase().includes(q.toLowerCase())) return false;
    if (catF !== "all" && tp.cat !== catF) return false;
    if (langF !== "all" && tp.lang !== langF) return false;
    return true;
  });

  const visible = showRec && recommended.length
    ? tpls.filter(tp => recommended.includes(tp.cat))
    : tpls;

  const selTpl = (window.ET_TEMPLATES || []).find(t => t.id === selId);

  const setSetting = (k, v) => setSettings(s => ({ ...s, [k]: v }));
  const toggleR = (r) => setSetting("recipients", settings.recipients.includes(r) ? settings.recipients.filter(x => x !== r) : [...settings.recipients, r]);

  const submit = () => {
    if (!selTpl) return;
    onLink({ template: selTpl.name.en, settings });
    toast && toast(`${t("tp.linked")} ${stageName || "stage"}.`, "check");
    onClose();
  };

  return (
    <div className="scrim" style={{ zIndex: 200 }} onClick={onClose}>
      <div className="modal" style={{ maxWidth: 700, maxHeight: "88vh" }} onClick={e => e.stopPropagation()}>
        <div className="modal-head" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16.5 }}>{t("tp.title")}</h3>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{t("tp.sub").replace("this stage", stageName || "this stage")}</div>
          </div>
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        {/* search bar */}
        <div className="flex" style={{ gap: 10, padding: "12px 22px 0", flexWrap: "wrap" }}>
          <div className="searchbar" style={{ maxWidth: 260, height: 38 }}>
            <Icon name="search" size={15} /><input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={lang === "ar" ? "ابحث في القوالب…" : "Search templates…"} />
          </div>
          <select className="select" style={{ width: "auto", minWidth: 140, height: 38 }} value={catF} onChange={e => setCatF(e.target.value)}>
            <option value="all">{t("et.allCats")}</option>
            {Object.entries(window.ET_CATS || {}).map(([k, v]) => <option key={k} value={k}>{t(v.key)}</option>)}
          </select>
          <select className="select" style={{ width: "auto", minWidth: 120, height: 38 }} value={langF} onChange={e => setLangF(e.target.value)}>
            <option value="all">{t("et.allLangs")}</option>
            <option value="EN">EN</option><option value="AR">AR</option>
          </select>
          <a className="muted" style={{ fontSize: 12.5, fontWeight: 600, marginInlineStart: "auto", display:"flex",alignItems:"center", gap:4, cursor:"pointer" }}>
            <Icon name="plus" size={13} />{lang==="ar"?"قالب جديد":"+ New template"}
          </a>
        </div>

        {/* AI banner */}
        {!aiDismissed && recommended.length > 0 && (
          <div className="flex" style={{ alignItems: "center", gap: 10, margin: "12px 22px 0", padding: "10px 13px", background: "var(--ai-soft)", border: "1px solid color-mix(in oklch,var(--ai) 30%,transparent)", borderRadius: "var(--r-sm)" }}>
            <Icon name="sparkles" size={14} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} />
            <span style={{ flex: 1, fontSize: 12.5, color: "var(--text-2)" }}>{lang==="ar"?`بناءً على نوع المرحلة (${t("ct."+(stageType||"screening"))}), نوصي بفئات: ${recommended.join(", ")}`:`Based on this stage's type (${t("ct."+(stageType||"screening"))}), we recommend: ${recommended.join(", ")}`}</span>
            <div className="flex" style={{ gap: 10, alignItems: "center" }}>
              <button className="seg" style={{ padding: 2 }}>
                <button className={showRec?"on":""} onClick={() => setShowRec(true)} style={{ fontSize:11.5, padding:"3px 9px" }}>{t("tp.showRec")}</button>
                <button className={!showRec?"on":""} onClick={() => setShowRec(false)} style={{ fontSize:11.5, padding:"3px 9px" }}>{lang==="ar"?"الكل":"All"}</button>
              </button>
              <button onClick={() => setAiDismissed(true)} className="icon-btn btn-sm" style={{ width:22,height:22 }}><Icon name="x" size={13} /></button>
            </div>
          </div>
        )}

        <div className="modal-body" style={{ padding: "14px 0 0", display: "flex", gap: 0, minHeight: 360, overflow: "hidden" }}>
          {/* template grid */}
          <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "0 22px 14px" }}>
            {visible.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 16px" }}>
                <Icon name="mail" size={28} style={{ color:"var(--text-3)",display:"block",margin:"0 auto 12px" }} />
                <div style={{ fontWeight:600, marginBottom:6 }}>{t("tp.noMatch")}</div>
                <div className="muted" style={{ fontSize:13 }}>{lang==="ar"?"جرب مسح المرشّحات أو إنشاء قالب جديد.":"Try clearing filters or creating a new template."}</div>
                <div className="flex" style={{ justifyContent:"center", gap:10, marginTop:14 }}>
                  <button className="btn btn-subtle btn-sm" onClick={() => { setCatF("all"); setLangF("all"); setShowRec(false); }}>{lang==="ar"?"مسح المرشّحات":"Clear filters"}</button>
                  <button className="btn btn-primary btn-sm"><Icon name="plus" size={13} />{t("et.new")}</button>
                </div>
              </div>
            ) : (
              <div className="grid" style={{ gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {visible.map(tp => {
                  const cat = window.ET_CATS && window.ET_CATS[tp.cat];
                  return (
                    <div key={tp.id} className={"tp-card" + (selId===tp.id?" on":"")} style={{ borderInlineStartColor: cat?cat.color:"var(--border-strong)" }} onClick={() => setSelId(selId===tp.id?null:tp.id)}>
                      <div className="flex" style={{ alignItems:"center", gap:8 }}>
                        {cat && <span className={"badge "+cat.badge} style={{ height:19,fontSize:10.5 }}>{t(cat.key)}</span>}
                        <div className="spacer" style={{ flex:1 }} />
                        {tp.starter && <span className="badge badge-neutral" style={{ height:18,fontSize:10 }}>{t("et.starter")}</span>}
                        <span className="tp-radio" />
                      </div>
                      <div style={{ fontWeight:600, fontSize:13.5 }}>{tp.name.en}</div>
                      <div className="faint" style={{ fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tp.subject}</div>
                      <div className="flex" style={{ alignItems:"center", gap:9, fontSize:11.5, marginTop:2 }}>
                        <span className="lang-pill">{tp.lang}</span>
                        <span className="faint">{tp.wfCount} {t("et.wfUnit")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* preview pane */}
          <div className={"tp-preview-pane" + (selTpl?" open":"")} style={{ borderInlineStart:"1px solid var(--border)", overflowY:"auto", padding:"0 20px" }}>
            {selTpl && (
              <div style={{ display:"flex", flexDirection:"column", gap:14, paddingTop:4 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{selTpl.name.en}</div>
                <div className="email-mock">
                  <div className="em-header" style={{ padding:"10px 14px" }}>
                    <div style={{ fontWeight:600, fontSize:12.5 }}>{selTpl.subjectSegs.map((s,i)=>s.t==="var"?<span key={i} className="var-chip" style={{ fontSize:10.5 }}>{s.v}</span>:<span key={i}>{s.v}</span>)}</div>
                  </div>
                  <div style={{ padding:"10px 14px", fontSize:12, color:"var(--text-2)", lineHeight:1.6, maxHeight:110, overflow:"hidden" }}>
                    {selTpl.body.slice(0,6).map((s,i)=>s.t==="var"?<span key={i} className="var-chip" style={{ fontSize:10.5 }}>{s.v}</span>:<span key={i}>{s.v}</span>)}
                    {selTpl.body.length > 6 && <span className="faint">…</span>}
                  </div>
                </div>
                <a className="muted" style={{ fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:5 }}><Icon name="eye" size={12} />{t("tp.viewFull")}</a>
                <hr className="divider" />
                {/* linkage settings */}
                <div style={{ fontSize:13, fontWeight:600, color:"var(--text-2)" }}>{lang==="ar"?"إعدادات الربط":"Linkage settings"}</div>
                <div className="field">
                  <label>{t("wf.recipients")}</label>
                  <div className="flex" style={{ flexWrap:"wrap", gap:7 }}>
                    {["Candidate","Hiring Manager","Recruiter"].map(r=>(
                      <span key={r} className={"chip chip-sel"+(settings.recipients.includes(r)?" on":"")} style={{ height:26,fontSize:12 }} onClick={()=>toggleR(r)}>
                        {settings.recipients.includes(r)&&<Icon name="check" size={11} />}{r}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>{t("wf.sendMode")}</label>
                  {[["auto","wf.autoSend"],["draft","wf.draftMode"]].map(([v,k])=>(
                    <div key={v} className={"rad-opt"+(settings.sendMode===v?" on":"")} style={{ padding:"8px 10px" }} onClick={()=>setSetting("sendMode",v)}>
                      <span className="rad" /><span style={{ fontSize:12.5, fontWeight:600 }}>{t(k)}</span>
                    </div>
                  ))}
                </div>
                <div className="field">
                  <label>{t("wf.delay")}</label>
                  <select className="select" style={{ height:36,fontSize:12.5 }} value={settings.delay} onChange={e=>setSetting("delay",e.target.value)}>
                    <option value="now">{t("wf.sendNow")}</option>
                    <option value="1h">{t("wf.after1h")}</option>
                    <option value="1d">{t("wf.after1d")}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-foot">
          <span className="muted" style={{ fontSize:12.5 }}>{selTpl ? `${lang==="ar"?"سيُرسَل القالب عند دخول المرشحين":"Template fires on entry to"} ${stageName||"stage"}` : ""}</span>
          <div className="spacer" style={{ flex:1 }} />
          <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" disabled={!selId} onClick={submit}><Icon name="link" size={15} />{t("tp.linkBtn")}</button>
        </div>
      </div>
    </div>
  );
}

window.TemplatePicker = TemplatePicker;
