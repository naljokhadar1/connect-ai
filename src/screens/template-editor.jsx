/* Connect AI — Email Templates: editor, variable picker, live preview */

import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'
import { AddLangModal } from './lang-variants'

/* ---------- VariableChip ---------- */
function VarChip({ name }) {
  return <span className="var-chip"><Icon name="zap" size={10} fill />{name}</span>;
}

/* ---------- BodyDisplay: render body segments ---------- */
function BodyDisplay({ segs }) {
  return (
    <React.Fragment>
      {segs.map((s, i) =>
        s.t === "var"
          ? <VarChip key={i} name={s.v} />
          : <React.Fragment key={i}>{s.v}</React.Fragment>
      )}
    </React.Fragment>
  );
}

/* ---------- Resolve body for preview ---------- */
function resolveSegs(segs, vars) {
  const resolveText = (str) =>
    str.split(/(\{\{[^}]+\}\})/g).map((part, i) => {
      const m = part.match(/^\{\{([^}]+)\}\}$/);
      return m
        ? <span key={i} style={{ fontWeight: 600 }}>{vars[m[1]] || part}</span>
        : part;
    });
  return segs.map((s, i) =>
    s.t === "var"
      ? <span key={i} style={{ fontWeight: 600 }}>{vars[s.v] || `{{${s.v}}}`}</span>
      : <React.Fragment key={i}>{resolveText(s.v)}</React.Fragment>
  );
}

/* ---------- Variable Picker ---------- */
function VariablePicker({ open, onClose, onInsert, toast }) {
  const { t } = useApp();
  const [q, setQ] = React.useState("");
  const [tab, setTab] = React.useState("system");
  if (!open) return null;

  const filtered = ET_SYS_VARS.map(g => ({
    ...g, vars: g.vars.filter(v => !q || v.id.includes(q.toLowerCase()) || v.name.toLowerCase().includes(q.toLowerCase()))
  })).filter(g => g.vars.length);

  return (
    <div className="var-picker" style={{ top: "calc(100% + 6px)", insetInlineStart: 0, animationName: "drawerIn" }}>
      <div style={{ padding: "10px 10px 0" }}>
        <div className="searchbar" style={{ height: 36, maxWidth: "100%" }}>
          <Icon name="search" size={15} /><input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={t("ev.searchVars")} />
        </div>
        <div className="flex" style={{ gap: 0, borderBottom: "1px solid var(--border)", marginTop: 8 }}>
          {["system","custom"].map(tb => (
            <button key={tb} onClick={() => setTab(tb)} style={{ padding: "8px 12px", fontSize: 12.5, fontWeight: 600, color: tab===tb?"var(--accent-strong)":"var(--text-2)", borderBottom: `2px solid ${tab===tb?"var(--accent)":"transparent"}`, marginBottom: -1 }}>
              {t("ev.tab" + tb.charAt(0).toUpperCase() + tb.slice(1))}
            </button>
          ))}
        </div>
      </div>
      <div className="var-picker-list">
        {tab === "system" && filtered.map(g => (
          <React.Fragment key={g.group}>
            <div className="var-group-label">{g.group}</div>
            {g.vars.map(v => (
              <div key={v.id} className="var-row" onClick={() => { onInsert(v.id); onClose(); toast(t("wf.autoSaved"), "check"); }}>
                <span className="vr-id">{v.id}</span>
                <span className="vr-type">{v.type}</span>
                <span className="vr-val">{v.preview}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
        {tab === "custom" && ET_CUSTOM_VARS.map(v => (
          <div key={v.id} className="var-row" onClick={() => { onInsert(v.id); onClose(); toast(t("wf.autoSaved"), "check"); }}>
            <span className="vr-id">{v.id}</span>
            <span className="vr-type">{v.type}</span>
            <span className="vr-val">{v.fallback}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border)" }}>
        <a className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}><Icon name="plus" size={13} style={{ verticalAlign: "-2px" }} />{t("ev.createCustom")}</a>
      </div>
    </div>
  );
}

/* ---------- Send test modal ---------- */
function SendTestModal({ onClose, toast }) {
  const { t } = useApp();
  const [email, setEmail] = React.useState("layla.alfayez@connect.sa");
  const send = () => { toast(t("ed.testSent"), "send"); onClose(); };
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-strong)", display: "grid", placeItems: "center" }}><Icon name="send" size={15} /></span>
          <h3 style={{ fontSize: 16 }}>{t("et.sendTest")}</h3>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="field"><label>{t("ed.sendTestModal")}</label><input className="input" value={email} onChange={e => setEmail(e.target.value)} /></div>
        </div>
        <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button><button className="btn btn-primary" onClick={send}><Icon name="send" size={15} />{t("ed.send")}</button></div>
      </div>
    </div>
  );
}

/* ============================================================
   View 2 — Template Editor
   ============================================================ */
function TemplateEditor({ tpl, aiDraft, onBack, onManageVars, onLinkWorkflow, toast }) {
  const { t, L, lang } = useApp();
  const [name, setName] = React.useState(tpl.name.en);
  const [variants, setVariants] = React.useState(() => [{code:'en',label:'English',primary:true,bodySegs:tpl.body,subjSegs:tpl.subjectSegs,reviewed:true,dirty:false}]);
  const [activeCode, setActiveCode] = React.useState('en');
  const [langModal, setLangModal] = React.useState(false);
  const [aiTransBanner, setAiTransBanner] = React.useState(null);
  const [syncDirty, setSyncDirty] = React.useState(false);
  const activeVar = variants.find(v => v.code === activeCode) || variants[0];
  const bodySegs = activeVar.bodySegs;
  const subjSegs = activeVar.subjSegs;
  const setBodySegs = fn => setVariants(vs => vs.map(v => v.code === activeCode ? {...v, bodySegs: typeof fn==='function'?fn(v.bodySegs):fn} : v));
  const setSubjSegs = fn => setVariants(vs => vs.map(v => v.code === activeCode ? {...v, subjSegs: typeof fn==='function'?fn(v.subjSegs):fn} : v));
  const [saveStatus, setSaveStatus] = React.useState("saved"); // "saved"|"saving"
  const [pickerOpen, setPickerOpen] = React.useState(null); // "body"|"subject"|null
  const [prevCand, setPrevCand] = React.useState(ET_PREVIEW_CANDS[0].id);
  const [prevView, setPrevView] = React.useState("desktop");
  const [showSendTest, setShowSendTest] = React.useState(false);
  const [linkages, setLinkages] = React.useState(() => tpl.id === 't-invite' ? INIT_LINKAGES : []);
  const [aiBodyBusy, setAiBodyBusy] = React.useState(false);
  const [aiBodyGenerated, setAiBodyGenerated] = React.useState(false);
  const [toolbar, setToolbar] = React.useState([]);
  const [editName, setEditName] = React.useState(false);

  const subjInputRef = React.useRef();
  const bodyTaRef = React.useRef();

  // Convert between segments array and editable plain text
  const segsToText = segs => (segs||[]).map(s => s.t==='var'?`{{${s.v}}}`:s.v).join('');
  const parseToSegs = text => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map(p => { const m = p.match(/^\{\{([^}]+)\}\}$/); return m ? {t:'var',v:m[1]} : {t:'text',v:p}; }).filter(s => s.t==='var'||s.v!=='');
  };

  const cand = ET_PREVIEW_CANDS.find(c => c.id === prevCand) || ET_PREVIEW_CANDS[0];
  const cat  = ET_CATS[tpl.cat];

  const change = () => {
    setSaveStatus("saving");
    setTimeout(() => setSaveStatus("saved"), 1200);
    if (activeCode === 'en' && variants.length > 1) {
      setSyncDirty(true);
      setVariants(vs => vs.map(v => v.code !== 'en' ? {...v, dirty: true} : v));
    }
  };

  const insertVar = (target) => (varId) => {
    const chip = `{{${varId}}}`;
    const insertAtCursor = (ref, setSegs) => {
      const el = ref.current;
      if (el) {
        const start = el.selectionStart || el.value.length;
        const end = el.selectionEnd || el.value.length;
        const newVal = el.value.slice(0, start) + chip + el.value.slice(end);
        setSegs(parseToSegs(newVal));
        setTimeout(() => { el.focus(); try { el.setSelectionRange(start + chip.length, start + chip.length); } catch(e){} }, 0);
      } else {
        setSegs(s => [...s, { t: "var", v: varId }]);
      }
    };
    if (target === "body") insertAtCursor(bodyTaRef, setBodySegs);
    if (target === "subject") insertAtCursor(subjInputRef, setSubjSegs);
    change();
  };

  const tbToggle = (k) => setToolbar(t => t.includes(k) ? t.filter(x => x !== k) : [...t, k]);

  const resolvedSubj = subjSegs.map(s => s.t === "var" ? (cand.vars[s.v] || `{{${s.v}}}`) : s.v).join("");
  const subjRawText = subjSegs.map(s => s.t === 'var' ? '' : s.v).join('').toLowerCase();
  const pickBody = () => {
    const tpls = window.ET_TEMPLATES || [];
    if (/interview/.test(subjRawText)) return (tpls.find(t=>t.id==='t-invite')||{}).body || [];
    if (/screen|recruiter/.test(subjRawText)) return (tpls.find(t=>t.id==='t-screen')||{}).body || [];
    if (/assessment/.test(subjRawText)) return (tpls.find(t=>t.id==='t-assess')||{}).body || [];
    if (/offer/.test(subjRawText)) return (tpls.find(t=>t.id==='t-offer')||{}).body || [];
    if (/reject/.test(subjRawText)) return (tpls.find(t=>t.id==='t-rej-pre')||{}).body || [];
    if (/welcome|hired/.test(subjRawText)) return (tpls.find(t=>t.id==='t-welcome')||{}).body || [];
    return (tpls.find(t=>t.id==='t-invite')||{}).body || [];
  };
  const generateBody = () => {
    if (aiBodyBusy) return;
    setAiBodyBusy(true); setAiBodyGenerated(false);
    setTimeout(() => {
      const bodyString = segsToText(pickBody());
      setBodySegs(parseToSegs(bodyString));
      setAiBodyBusy(false); setAiBodyGenerated(true); change();
    }, 820);
  };
  const showGenBtn = bodySegs.length < 3 && !aiBodyBusy;

  const TOOLS = [
    { k:"bold", label:"B" }, { k:"italic", label:"I", style:{fontStyle:"italic"} }, { k:"underline", label:"U", style:{textDecoration:"underline"} },
  ];

  return (
    <div className="page" style={{ maxWidth: "100%" }}>
      <div className="crumbs"><a onClick={onBack}>{t("et.title")}</a><span className="sep">›</span><span>{name}</span></div>

      {/* header */}
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="flex" style={{ gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            {editName
              ? <input className="input" autoFocus value={name} style={{ fontSize: 20, fontWeight: 600, height: 40, marginBottom: 6 }}
                  onChange={e => { setName(e.target.value); change(); }} onBlur={() => setEditName(false)} />
              : <div style={{ fontSize: 22, fontWeight: 600, cursor: "text", letterSpacing: "-.02em", marginBottom: 6 }} onClick={() => setEditName(true)}>{name}</div>}
            <div className="flex" style={{ gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span className={"badge " + cat.badge}>{t(cat.key)}</span>
              <div className="lang-vtabs">
                {variants.map(v => (
                  <button key={v.code} className={"lang-vtab"+(activeCode===v.code?" active":"")} onClick={() => setActiveCode(v.code)}>
                    {v.primary && <span style={{fontSize:9.5,fontWeight:700,opacity:.8}}>{lang==="ar"?"A:":"P:"}</span>}
                    {v.label}
                    {activeCode===v.code && <Icon name="check" size={11} />}
                    {v.dirty && <span className="lang-vtab-dot" />}
                  </button>
                ))}
                <button className="lang-vtab lang-vtab-add" onClick={() => setLangModal(true)}>
                  <Icon name="plus" size={13} />{lang==="ar"?"+ إضافة لغة":"+ Add language"}
                </button>
              </div>
              <span className="badge badge-success" style={{ height: 20 }}>{t("et.statusActive")}</span>
              <a className="faint flex" style={{ alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600 }}><Icon name="workflow" size={13} />{t("et.usedIn")} {tpl.wfCount} {tpl.wfCount===1?t("et.wfUnit1"):t("et.wfUnit")}</a>
            </div>
          </div>
          <div className="flex" style={{ gap: 10, alignItems: "center" }}>
            <button className="btn btn-ghost" onClick={() => setShowSendTest(true)}><Icon name="send" size={15} />{t("et.sendTest")}</button>
            <button className="btn btn-ghost btn-icon btn-sm"><Icon name="file" size={16} /></button>
            <div className={"save-ind " + saveStatus}>
              {saveStatus === "saving"
                ? <><Icon name="refresh" size={14} />{t("ed.saving")}</>
                : <><Icon name="check" size={14} />{t("ed.allSaved")}</>}
            </div>
          </div>
        </div>
      </div>

      {/* two-column layout */}
      <div className="grid" style={{ gridTemplateColumns: "55fr 45fr", alignItems: "start" }}>
        {/* LEFT — editor */}
        <div className="grid">
      {/* Language variant banners */}
          {aiTransBanner === activeCode && (
            <div className="ai-trans-banner">
              <Icon name="sparkles" size={15} fill style={{color:"var(--ai)",flex:"0 0 auto"}} />
              <span style={{flex:1,fontSize:13,fontWeight:500}}>{lang==="ar"?"✶ مُترجَم بالذكاء من الإنجليزية · راجع قبل النشر":"✶ AI-translated from English · Review before publishing"}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => toast(lang==="ar"?"جارٍ إعادة الترجمة":"Re-translating…","sparkles")}>{lang==="ar"?"إعادة ترجمة":"Re-translate"}</button>
              <button className="btn btn-primary btn-sm" onClick={() => { setVariants(vs=>vs.map(v=>v.code===activeCode?{...v,reviewed:true}:v)); setAiTransBanner(null); toast(lang==="ar"?"تمت المراجعة":"Marked as reviewed","check"); }}>{lang==="ar"?"تمت المراجعة":"Mark as reviewed"}</button>
              <button className="icon-btn btn-sm" onClick={() => setAiTransBanner(null)}><Icon name="x" size={15} /></button>
            </div>
          )}
          {activeCode !== 'en' && activeVar.dirty && (
            <div className="sync-warn-banner">
              <Icon name="alert" size={15} style={{color:"var(--warning)",flex:"0 0 auto"}} />
              <span style={{flex:1,fontSize:13}}>{lang==="ar"?"⚠ تغيّرت النسخة الإنجليزية منذ آخر ترجمة.":"⚠ The English version has changed since this was translated."}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => { setVariants(vs=>vs.map(v=>v.code===activeCode?{...v,bodySegs:AR_BODY_SEGS,dirty:false}:v)); setSyncDirty(false); toast(lang==="ar"?"تمت إعادة الترجمة":"Re-translated","check"); }}>{lang==="ar"?"إعادة ترجمة":"Re-translate"}</button>
              <button className="btn btn-subtle btn-sm" onClick={() => setVariants(vs=>vs.map(v=>v.code===activeCode?{...v,dirty:false}:v))}>{lang==="ar"?"تجاهل":"Dismiss"}</button>
            </div>
          )}

          {/* AI draft banner */}
          {aiDraft && (
            <div className="flex" style={{ alignItems: "center", gap: 11, padding: "11px 14px", background: "var(--ai-soft)", border: "1px solid color-mix(in oklch, var(--ai) 35%, transparent)", borderRadius: "var(--r-md)", marginBottom: -8 }}>
              <Icon name="sparkles" size={16} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--ai)" }}>{lang === "ar" ? "✦ مسودة مُنشأة بالذكاء — راجعها قبل الحفظ" : "✦ AI-generated draft — review before saving."}</span>
              <button className="btn btn-ai btn-sm" onClick={() => toast(t("common.regenerate"), "sparkles")}>{lang === "ar" ? "إعادة الإنشاء" : "Regenerate"}</button>
            </div>
          )}

          {/* Email details */}
          <div className="card">
            <div className="card-head"><h3>{lang==="ar"?"تفاصيل البريد":"Email details"}</h3></div>
            <div className="card-pad" style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="field"><label>{t("ed.from")}</label><select className="select"><option>careers@connect-ai.com</option><option>noreply@connect-ai.com</option></select></div>
              <div className="field"><label>{t("ed.replyTo")}</label>
                <select className="select"><option>{lang==="ar"?"استخدام خيوط المنصة (افتراضي)":"Use platform threading (default)"}</option><option>careers@connect-ai.com</option></select>
                <div className="hint">{t("ed.replyHelper")}</div>
              </div>
              <div className="field"><label>{t("ed.recipients")}</label>
                <div className="flex" style={{ gap: 8, flexWrap:"wrap", alignItems:"center" }}>
                  <span className="chip chip-accent"><Icon name="check" size={12} />{lang==="ar"?"المرشح":"Candidate"}</span>
                  <button className="btn btn-subtle btn-sm" onClick={change}><Icon name="plus" size={14} />{t("ed.addRecipient")}</button>
                </div>
                <div className="hint" style={{ marginTop: 6 }}>{t("ed.recipHelper")}</div>
              </div>
            </div>
          </div>

          {/* Subject line */}
          <div className="card" style={{ position: "relative" }}>
            <div className="card-head">
              <h3>{t("ed.subject")}</h3>
              <div className="spacer" style={{ flex: 1 }} />
              <span className="mono faint" style={{ fontSize: 12 }}>42 / 78</span>
              <div style={{ position: "relative" }}>
                <button className="btn btn-subtle btn-sm" onClick={() => setPickerOpen(pickerOpen==="subject"?null:"subject")}><Icon name="zap" size={14} />+ {t("ed.insertVar")}</button>
                {pickerOpen === "subject" && (
                  <React.Fragment>
                    <div style={{ position:"fixed",inset:0,zIndex:49 }} onClick={() => setPickerOpen(null)} />
                    <VariablePicker open onClose={() => setPickerOpen(null)} onInsert={insertVar("subject")} toast={toast} />
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="card-pad">
              <input ref={subjInputRef} className="input" dir={activeCode==='ar'||activeCode==='ur'?'rtl':'ltr'}
                style={{fontSize:"var(--fs-base)",height:42}}
                value={segsToText(subjSegs)}
                onChange={e => { setSubjSegs(parseToSegs(e.target.value)); change(); }}
                placeholder={lang==="ar"?"مثال: دعوة لمقابلة لوظيفة {{job.title}}":"e.g. Interview invitation for {{job.title}}"} />

            </div>
              {(showGenBtn || aiBodyBusy || aiBodyGenerated) && (
                <div className="flex" style={{alignItems:"center",gap:10,marginTop:10,padding:"9px 13px",background:"var(--ai-soft)",borderRadius:"var(--r-sm)",border:"1px solid color-mix(in oklch,var(--ai) 30%,transparent)"}}>
                  <Icon name="sparkles" size={14} fill style={{color:"var(--ai)",flex:"0 0 auto"}} />
                  {aiBodyBusy && <span className="muted ai-cursor" style={{fontSize:13}}>{lang==="ar"?"جارٍ إنشاء نص الرسالة…":"Generating body from subject…"}</span>}
                  {aiBodyGenerated && !aiBodyBusy && <span style={{fontSize:13,fontWeight:600,color:"var(--ai)",flex:1}}>{lang==="ar"?"✔ تم إنشاء النص — راجعه وعدّله.":"✔ Body generated from subject — review and edit."}</span>}
                  {showGenBtn && <button className="btn btn-ai btn-sm" onClick={generateBody}><Icon name="sparkles" size={14} fill />{lang==="ar"?"إنشاء نص الرسالة":"Generate body"}</button>}
                  {aiBodyGenerated && !aiBodyBusy && <button className="btn btn-subtle btn-sm" onClick={generateBody}><Icon name="refresh" size={13} />{lang==="ar"?"إعادة إنشاء":"Regenerate"}</button>}
                </div>
              )}
          </div>

          {/* Body */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="card-head"><h3>{t("ed.body")}</h3></div>
            <div className="rt-toolbar">
              {TOOLS.map(tb => (
                <button key={tb.k} className={"rt-btn" + (toolbar.includes(tb.k)?" on":"")} style={tb.style} onClick={() => tbToggle(tb.k)}>{tb.label}</button>
              ))}
              <div className="rt-sep" />
              <button className="rt-btn has-tip" data-tip="Bullet list" onClick={() => tbToggle("ul")}><Icon name="list" size={15} /></button>
              <button className="rt-btn has-tip" data-tip="Numbered list" onClick={() => tbToggle("ol")}><Icon name={toolbar.includes("ol")?"check":"list"} size={15} /></button>
              <button className="rt-btn has-tip" data-tip="Link"><Icon name="link" size={15} /></button>
              <button className="rt-btn has-tip" data-tip="Blockquote" onClick={() => tbToggle("bq")}><Icon name="message" size={15} /></button>
              <div className="rt-sep" />
              <button className="rt-btn-wide"><Icon name="chevDown" size={13} />{lang==="ar"?"عنوان":"Heading"}</button>
              <div className="rt-sep" />
              <div style={{ position:"relative" }}>
                <button className="rt-btn-wide" onClick={() => setPickerOpen(pickerOpen==="body"?null:"body")}><Icon name="zap" size={13} />+ {t("ed.insertVar")}</button>
                {pickerOpen === "body" && (
                  <React.Fragment>
                    <div style={{ position:"fixed",inset:0,zIndex:49 }} onClick={() => setPickerOpen(null)} />
                    <VariablePicker open onClose={() => setPickerOpen(null)} onInsert={insertVar("body")} toast={toast} />
                  </React.Fragment>
                )}
              </div>
              <button className="rt-btn-wide"><Icon name="upload" size={13} />{lang==="ar"?"مرفق":"Attach"}</button>
            </div>
            <textarea ref={bodyTaRef} dir={activeCode==='ar'||activeCode==='ur'?'rtl':'ltr'}
                style={{width:"100%",minHeight:280,padding:16,fontSize:14,lineHeight:1.85,fontFamily:"'IBM Plex Sans','IBM Plex Sans Arabic',system-ui",border:"none",outline:"none",background:"transparent",resize:"vertical",color:"var(--text)"}}
                value={segsToText(bodySegs)}
                onChange={e => { setBodySegs(parseToSegs(e.target.value)); change(); }}
                placeholder={lang==="ar"?"اكتب نص الرسالة هنا، أو انقر 'إنشاء نص' أعلاه.":"Write your email body here, or click 'Generate body' above."} />
            <div className="ai-suggestions">
              <Icon name="sparkles" size={13} fill style={{color:"var(--ai)"}} />
              <a style={{cursor:"pointer"}} onClick={() => { change(); toast(lang==="ar"?"جارٍ تحسين الأسلوب":t("ed.improvetone"),"check"); }}><Icon name="zap" size={13} />{t("ed.improvetone")}</a>
              <a style={{cursor:"pointer"}} onClick={() => { change(); toast(lang==="ar"?"جارٍ الترجمة":t("ed.translate"),"check"); }}><Icon name="globe" size={13} />{t("ed.translate")}</a>
            </div>
          </div>

          {/* Attachments (collapsed) */}
          <div className="card card-pad">
            <div className="flex" style={{ alignItems:"center", gap:9 }}>
              <Icon name="upload" size={16} style={{ color:"var(--text-3)" }} />
              <span style={{ fontSize:13.5, fontWeight:600 }}>{t("ed.attachments")}</span>
              <div className="spacer" style={{ flex:1 }} />
              <button className="btn btn-ghost btn-sm"><Icon name="plus" size={14} />{t("ed.addAttach")}</button>
            </div>
            <div className="faint" style={{ fontSize:12.5, marginTop:6 }}>{t("ed.noAttach")}</div>
          </div>

          {/* Linked stages */}
          <LinkedStages linkages={linkages} setLinkages={setLinkages} toast={toast} />
        </div>

        {/* RIGHT — live preview */}
        <div style={{ position:"sticky", top:16 }}>
          <div className="card">
            <div className="card-head">
              <div className="flex" style={{ gap:8, flex:1, alignItems:"center", flexWrap:"wrap" }}>
                <select className="select" style={{ width:"auto", minWidth:220, height:34, fontSize:13 }} value={prevCand} onChange={e=>setPrevCand(e.target.value)}>
                  {ET_PREVIEW_CANDS.map(c=><option key={c.id} value={c.id}>{c.name} — {c.vars["job.title"]}</option>)}
                </select>
                <div className="seg" style={{ marginInlineStart:"auto" }}>
                  <button className={prevView==="desktop"?"on":""} onClick={()=>setPrevView("desktop")}><Icon name="dashboard" size={13} />&nbsp;{t("ed.desktop")}</button>
                  <button className={prevView==="mobile"?"on":""} onClick={()=>setPrevView("mobile")}><Icon name="phone" size={13} />&nbsp;{t("ed.mobile")}</button>
                </div>
              </div>
            </div>
            <div className="card-pad">
              <div className="email-mock" style={{ maxWidth: prevView==="mobile"?"390px":"100%", margin:"0 auto" }}>
                <div className="em-header">
                  <div style={{ marginBottom:2 }}><span style={{ color:"var(--text-3)" }}>{lang==="ar"?"من:":"From:"}</span> <span style={{ fontWeight:600 }}>Connect AI Talent &lt;careers@connect-ai.com&gt;</span></div>
                  <div style={{ marginBottom:2 }}><span style={{ color:"var(--text-3)" }}>{lang==="ar"?"إلى:":"To:"}</span> {cand.vars["candidate.email"]}</div>
                  <div className="em-subject">{resolvedSubj}</div>
                </div>
                <div className="em-body" style={{ fontSize: prevView==="mobile"?13:13.5 }}>
                  {resolveSegs(bodySegs, cand.vars)}
                </div>
              </div>

              {/* unresolved indicator */}
              <div className="flex" style={{ alignItems:"center", gap:8, marginTop:14, padding:"9px 12px", borderRadius:"var(--r-sm)", background:"var(--success-soft)", border:"1px solid color-mix(in oklch,var(--success) 35%,transparent)" }}>
                <Icon name="check" size={15} style={{ color:"var(--success)", flex:"0 0 auto" }} />
                <span style={{ fontSize:12.5, fontWeight:600, color:"var(--success)" }}>{t("ed.allResolved")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSendTest && <SendTestModal onClose={() => setShowSendTest(false)} toast={toast} />}
      {langModal && <AddLangModal existingCodes={variants.map(v=>v.code)} tplBodySegs={bodySegs} tplSubjSegs={subjSegs} onClose={() => setLangModal(false)} onAdd={v => { setVariants(vs=>[...vs,{code:v.code,label:v.label,primary:false,bodySegs:v.bodySegs,subjSegs:v.subjSegs,reviewed:false,dirty:false}]); setActiveCode(v.code); if(v.isAI) setAiTransBanner(v.code); }} />}
    </div>
  );
}

window.TemplateEditor = TemplateEditor;
window.VariablePicker = VariablePicker;
window.VarChip = VarChip;
window.CTChip = CTChip;
window.SendTestModal = SendTestModal;

export { TemplateEditor, VariablePicker, VarChip, BodyDisplay, resolveSegs, SendTestModal };
