/* Connect AI — Email Templates: Variables management + new-variable panel */

import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'
import { Kebab } from './admin'

function VariablesManager({ onBack, toast }) {
  const { t, lang } = useApp();
  const [tab, setTab] = React.useState("custom");
  const [panelOpen, setPanelOpen] = React.useState(false);

  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">{t("ev.title")}</h1><div className="page-sub">{t("ev.sub")}</div></div>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={() => setPanelOpen(true)}><Icon name="plus" size={17} />{t("ev.newVar")}</button>
      </div>

      <div className="crumbs" style={{ marginBottom: 14 }}>
        <a onClick={onBack}>{t("et.title")}</a><span className="sep">›</span><span>{t("ev.title")}</span>
      </div>

      {/* tab bar */}
      <div className="flex" style={{ borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
        {[["system","ev.system"],["custom","ev.custom"]].map(([k,lk]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ padding:"12px 16px", fontSize:14, fontWeight:600, whiteSpace:"nowrap",
              color: tab===k?"var(--accent-strong)":"var(--text-2)",
              borderBottom:`2px solid ${tab===k?"var(--accent)":"transparent"}`, marginBottom:-1 }}>
            {t(lk)}
          </button>
        ))}
      </div>

      {tab === "system" && (
        <React.Fragment>
          <div className="flex" style={{ alignItems:"center", gap:10, padding:"10px 14px", background:"var(--surface-2)", borderRadius:"var(--r-sm)", border:"1px solid var(--border)", marginBottom:16 }}>
            <Icon name="lock" size={15} style={{ color:"var(--text-3)", flex:"0 0 auto" }} />
            <span className="muted" style={{ fontSize:13 }}>{t("ev.systemNote")}</span>
          </div>
          <div className="card" style={{ overflow:"hidden" }}>
            <table className="tbl">
              <thead><tr>
                <th>{t("ev.colName")}</th><th>{t("ev.colId")}</th><th>{t("ev.colType")}</th>
                <th>{lang==="ar"?"المصدر":"Source"}</th><th>{t("ev.colUsedIn")}</th>
              </tr></thead>
              <tbody>
                {ET_SYS_VARS.flatMap(g => g.vars.map(v => (
                  <tr key={v.id}>
                    <td><div style={{ fontWeight:600 }}>{v.name}</div><div className="faint" style={{ fontSize:11.5 }}>{g.group}</div></td>
                    <td><code style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:12, background:"var(--surface-3)", padding:"2px 8px", borderRadius:5 }}>{v.id}</code></td>
                    <td><span className="badge badge-neutral" style={{ height:20 }}>{v.type}</span></td>
                    <td><span className="faint" style={{ fontSize:13 }}>{lang==="ar"?"النظام":"System"}</span></td>
                    <td>
                      <span className="faint mono" style={{ fontSize:13 }}>
                        {ET_TEMPLATES.filter(t => JSON.stringify(t.body).includes(v.id) || JSON.stringify(t.subjectSegs).includes(v.id)).length} {t("et.wfUnit")}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      )}

      {tab === "custom" && (
        <div className="card" style={{ overflow:"hidden" }}>
          <table className="tbl">
            <thead><tr>
              <th>{t("ev.colName")}</th><th>{t("ev.colId")}</th><th>{t("ev.colType")}</th>
              <th>{t("ev.colSource")}</th><th>{t("ev.colFallback")}</th>
              <th>{t("ev.colUsedIn")}</th><th></th>
            </tr></thead>
            <tbody>
              {ET_CUSTOM_VARS.map(v => (
                <tr key={v.id}>
                  <td><div style={{ fontWeight:600 }}>{v.name}</div></td>
                  <td><code style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:11.5, background:"var(--accent-soft)", color:"var(--accent-strong)", padding:"2px 8px", borderRadius:5 }}>{v.id}</code></td>
                  <td><span className="badge badge-neutral" style={{ height:20 }}>{v.type}</span></td>
                  <td><span className="muted" style={{ fontSize:13 }}>{v.source}</span></td>
                  <td>
                    {v.fallback === "—"
                      ? <span className="faint">—</span>
                      : <span className="mono" style={{ fontSize:12, maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", display:"block", whiteSpace:"nowrap" }}>{v.fallback}</span>}
                  </td>
                  <td><span className="faint mono" style={{ fontSize:13 }}>{v.usedIn} {v.usedIn===1?t("et.wfUnit1"):t("et.wfUnit")}</span></td>
                  <td onClick={e=>e.stopPropagation()}>
                    <Kebab items={[
                      { icon:"edit", label:t("wf.edit"), onClick:()=>setPanelOpen(true) },
                      { icon:"file", label:t("et.duplicate"), onClick:()=>toast(t("wf.autoSaved"),"check") },
                      { icon:"trash", label:t("et.archive"), danger:true },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding:"14px 20px", borderTop:"1px solid var(--border)" }}>
            <button className="btn btn-subtle btn-sm" onClick={() => setPanelOpen(true)}><Icon name="plus" size={14} />{t("ev.newVar")}</button>
          </div>
        </div>
      )}

      <NewVarPanel open={panelOpen} onClose={() => setPanelOpen(false)} toast={toast} />
    </div>
  );
}

/* ---------- New variable side panel ---------- */
function NewVarPanel({ open, onClose, toast }) {
  const { t } = useApp();
  const [name, setName] = React.useState("");
  const [identifier, setIdentifier] = React.useState("");
  const [type, setType] = React.useState("Text");
  const [source, setSource] = React.useState("candidate");
  const [fallback, setFallback] = React.useState("");

  const updateName = (v) => {
    setName(v);
    setIdentifier(v.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_.]/g, ""));
  };

  const save = () => { toast(t("ev.save"), "check"); onClose(); setName(""); setIdentifier(""); setFallback(""); };

  return (
    <React.Fragment>
      <div className={"drawer-scrim" + (open ? " open" : "")} style={{ pointerEvents: open ? "auto" : "none" }} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        {open && (
          <React.Fragment>
            <div className="drawer-head">
              <span style={{ width:32, height:32, borderRadius:8, background:"var(--accent-soft)", color:"var(--accent-strong)", display:"grid", placeItems:"center", flex:"0 0 auto" }}><Icon name="zap" size={16} /></span>
              <h3 style={{ fontSize:17, fontWeight:600 }}>{t("ev.newVar")}</h3>
              <div className="spacer" style={{ flex:1 }} />
              <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
            </div>

            <div className="drawer-body">
              <div className="grid" style={{ gap:18 }}>
                <div className="field">
                  <label>{t("ev.varName")}</label>
                  <input className="input" value={name} onChange={e => updateName(e.target.value)} placeholder={t("ev.colName") + "…"} />
                </div>
                <div className="field">
                  <label>{t("ev.identifier")}</label>
                  <input className="input mono" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="e.g. candidate.preferred_language" />
                  <div className="hint">{lang==="ar"?"يستخدم في القوالب كـ":"Used in templates as"} <span className="var-chip" style={{ fontSize:11 }}>{identifier || "candidate.my_var"}</span></div>
                </div>
                <div className="field">
                  <label>{t("ev.type")}</label>
                  <select className="select" value={type} onChange={e => setType(e.target.value)}>
                    {["Text","Number","Date","Yes/No","Link","Email"].map(tp => <option key={tp}>{tp}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>{t("ev.source")}</label>
                  <select className="select" value={source} onChange={e => setSource(e.target.value)}>
                    <option value="candidate">{lang==="ar"?"حقل المرشح":"Candidate field"}</option>
                    <option value="job">Job field</option>
                    <option value="manual">Manual entry</option>
                    <option value="static">Static value</option>
                  </select>
                </div>
                <div className="field">
                  <label>{t("ev.fallback")}</label>
                  <input className="input" value={fallback} onChange={e => setFallback(e.target.value)} placeholder={lang==="ar"?"القيمة عند غياب البيانات":"Value when data is missing"} />
                  <div className="hint">{t("ev.fallbackHelper")}</div>
                </div>
              </div>
            </div>

            <div className="drawer-foot">
              <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
              <div className="spacer" style={{ flex:1 }} />
              <button className="btn btn-primary" onClick={save}><Icon name="check" size={16} />{t("ev.save")}</button>
            </div>
          </React.Fragment>
        )}
      </aside>
    </React.Fragment>
  );
}

window.VariablesManager = VariablesManager;
window.NewVarPanel = NewVarPanel;

export { VariablesManager, NewVarPanel };
