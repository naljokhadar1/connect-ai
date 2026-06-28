/* Connect AI — Add Stage modal (workflow builder) */

const STAGE_TYPE_DESCS = {
  applied:    { en: "Candidates who just applied", ar: "المرشحون الذين تقدّموا للتو" },
  screening:  { en: "Initial review, recruiter calls, CV screening", ar: "المراجعة الأولية ومكالمات المسؤول وفرز السيرة" },
  interview:  { en: "Live interviews with the team", ar: "المقابلات المباشرة مع الفريق" },
  assessment: { en: "Tests, take-homes, technical evaluations", ar: "الاختبارات والتقييمات التقنية" },
  offer:      { en: "Offer extended, awaiting response", ar: "العرض مُقدَّم وبانتظار الرد" },
  hired:      { en: "Successful hires (terminal)", ar: "التوظيف الناجح (نهائي)" },
  rejected:   { en: "Did not progress (terminal)", ar: "لم يتقدم (نهائي)" },
  other:      { en: "Custom stage type", ar: "نوع مرحلة مخصص" },
};

function AddStageModal({ existingStages, insertAfterIndex, onClose, onAdd, toast }) {
  const { t, lang } = useApp();
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("screening");
  const [position, setPosition] = React.useState(insertAfterIndex != null ? "after" : "end");
  const [afterIdx, setAfterIdx] = React.useState(insertAfterIndex ?? 0);
  const [required, setRequired] = React.useState(true);
  const [color, setColor] = React.useState("gray");
  const [advOpen, setAdvOpen] = React.useState(false);
  const [emailOn, setEmailOn] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [linkedTpl, setLinkedTpl] = React.useState(null);

  const isTerminal = type === "hired" || type === "rejected";
  const valid = name.trim().length > 0 && type;

  const nonTerminal = existingStages.filter(s => !s.terminal);

  const swatches = [["gray","var(--text-3)"],["blue","var(--info)"],["purple","var(--purple)"],["teal","var(--ai)"],["amber","var(--warning)"]];

  const submit = () => {
    const newStage = {
      id: "s-" + Date.now(),
      name: { en: name.trim(), ar: name.trim() },
      type,
      count: 0,
      email: linkedTpl ? linkedTpl.template : null,
      optional: !required,
      terminal: isTerminal ? (type === "hired" ? "success" : "exit") : null,
      color,
      isNew: true,
    };
    onAdd(newStage, position === "end" ? existingStages.length : afterIdx + 1);
    onClose();
  };

  return (
    <React.Fragment>
      <div className="scrim" onClick={onClose}>
        <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
          <div className="modal-head" style={{ alignItems:"flex-start" }}>
            <div style={{ flex:1 }}>
              <h3 style={{ fontSize:17 }}>{t("wf.addStageTitle")}</h3>
              <div className="muted" style={{ fontSize:12.5, marginTop:2 }}>{t("wf.addStageSub")}</div>
            </div>
            <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
          </div>

          <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:18 }}>

            {/* name */}
            <div className="field">
              <label>{t("wf.stageName")} <span style={{ color:"var(--danger)" }}>*</span></label>
              <input className="input" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder={lang==="ar"?"مثال: مقابلة تقنية":"e.g. Technical Interview"} />
              <div className="hint">{t("wf.nameHelper")}</div>
            </div>

            {/* type */}
            <div className="field">
              <label>{t("wf.canonicalType")} <span style={{ color:"var(--danger)" }}>*</span></label>
              <select className="select" value={type} onChange={e => setType(e.target.value)}>
                {Object.keys(STAGE_TYPE_DESCS).map(k => (
                  <option key={k} value={k}>{t("ct."+k)} — {STAGE_TYPE_DESCS[k][lang] || STAGE_TYPE_DESCS[k].en}</option>
                ))}
              </select>
              <div className="hint">{t("wf.typeHelper2")}</div>
              {isTerminal && (
                <div className="flex" style={{ alignItems:"center", gap:8, marginTop:8, padding:"9px 12px", background:"var(--warning-soft)", border:"1px solid color-mix(in oklch,var(--warning) 35%,transparent)", borderRadius:"var(--r-sm)" }}>
                  <Icon name="alert" size={14} style={{ color:"var(--warning)", flex:"0 0 auto" }} />
                  <span style={{ fontSize:12.5, color:"var(--text-2)" }}>{t("wf.terminalNote")}</span>
                </div>
              )}
            </div>

            {/* position */}
            <div className="field">
              <label>{t("wf.position")}</label>
              <div className={"rad-opt" + (position==="end"?" on":"")} onClick={() => setPosition("end")}>
                <span className="rad" /><div><div style={{ fontWeight:600, fontSize:13 }}>{t("wf.posAtEnd")}</div></div>
              </div>
              <div className={"rad-opt" + (position==="after"?" on":"")} onClick={() => setPosition("after")}>
                <span className="rad" /><div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom: position==="after"?8:0 }}>{t("wf.posAfter")}</div>
                  {position === "after" && (
                    <div className="flex" style={{ alignItems:"center", gap:9 }}>
                      <span className="muted" style={{ fontSize:13, whiteSpace:"nowrap" }}>{t("wf.afterStage")}</span>
                      <select className="select" style={{ flex:1, height:36 }} value={afterIdx} onChange={e => setAfterIdx(Number(e.target.value))}>
                        {nonTerminal.map((s, i) => <option key={i} value={i}>{s.name[lang] || s.name.en}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* required / optional */}
            <div className="field">
              <label>{lang==="ar"?"إلزامي أم اختياري":"Required or optional"}</label>
              <div className={"rad-opt" + (required?" on":"")} onClick={() => setRequired(true)}>
                <span className="rad" /><div><div style={{ fontWeight:600, fontSize:13 }}>{t("wf.requiredStage")}</div><div className="muted" style={{ fontSize:12 }}>{t("wf.everyMust")}</div></div>
              </div>
              <div className={"rad-opt" + (!required?" on":"")} onClick={() => setRequired(false)}>
                <span className="rad" /><div><div style={{ fontWeight:600, fontSize:13 }}>{t("wf.optionalSkip").split("—")[0].trim()}</div><div className="muted" style={{ fontSize:12 }}>{t("wf.canSkip")}</div></div>
              </div>
            </div>

            {/* color */}
            <div className="field">
              <label>{t("wf.colorAccent")}</label>
              <div className="swatches">
                {swatches.map(([k,c])=>(
                  <button key={k} className={"swatch"+(color===k?" on":"")} style={{ background:c }} onClick={()=>setColor(k)}>
                    {color===k && <span style={{ position:"absolute",inset:0,display:"grid",placeItems:"center",color:"#fff" }}><Icon name="check" size={15} /></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* advanced */}
            <div>
              <button className="flex" style={{ alignItems:"center", gap:7, fontSize:13, fontWeight:600, color:"var(--text-2)" }} onClick={() => setAdvOpen(a=>!a)}>
                <Icon name={advOpen?"chevDown":"chevRight"} size={15} />
                {lang==="ar"?"متقدم":"Advanced"}
              </button>
              {advOpen && (
                <div style={{ marginTop:12, padding:14, background:"var(--surface-2)", borderRadius:"var(--r-md)", border:"1px solid var(--border)", display:"flex", flexDirection:"column", gap:14 }}>
                  <div className="flex" style={{ alignItems:"center", gap:11 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:13.5 }}>{t("wf.linkEmailNow")}</div>
                      <div className="muted" style={{ fontSize:12 }}>{lang==="ar"?"يمكنك الإعداد لاحقاً من لوحة المرحلة.":"You can configure email later from the stage side panel."}</div>
                    </div>
                    <Switch on={emailOn} onChange={v => { setEmailOn(v); if (v) setPickerOpen(true); }} />
                  </div>
                  {emailOn && linkedTpl ? (
                    <div className="flex" style={{ alignItems:"center", gap:11, padding:"10px 13px", background:"var(--surface)", border:"1px solid var(--border-strong)", borderRadius:"var(--r-sm)" }}>
                      <span style={{ width:28,height:28,borderRadius:7,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto" }}><Icon name="mail" size={15} /></span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:13.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{linkedTpl.template}</div>
                      </div>
                      <button className="btn btn-subtle btn-sm" onClick={() => setPickerOpen(true)}>{lang==="ar"?"تغيير":"Change"}</button>
                    </div>
                  ) : emailOn && (
                    <button className="btn btn-subtle btn-sm" style={{ alignSelf:"flex-start" }} onClick={() => setPickerOpen(true)}><Icon name="mail" size={14} />{lang==="ar"?"اختر قالباً":"Choose a template"}</button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="modal-foot">
            <div className="spacer" style={{ flex:1 }} />
            <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
            <button className="btn btn-primary" disabled={!valid} onClick={submit}><Icon name="plus" size={16} />{t("wf.addStageBtn")}</button>
          </div>
        </div>
      </div>

      {pickerOpen && <TemplatePicker stageType={type} stageName={name||"this stage"} open onClose={() => setPickerOpen(false)} onLink={v => { setLinkedTpl(v); setPickerOpen(false); }} />}
    </React.Fragment>
  );
}

window.AddStageModal = AddStageModal;
