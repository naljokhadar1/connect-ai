/* Connect AI — Language Variants: AddLangModal + AR body */

/* Arabic body segments for Interview Invitation (variables preserved) */
const AR_BODY_SEGS = [
  {t:"text",v:"\u0645\u0631\u062d\u0628\u0627\u064b "},{t:"var",v:"candidate.first_name"},{t:"text",v:"\u060c\n\n\u0634\u0643\u0631\u0627\u064b \u0644\u062a\u0642\u062f\u064a\u0645\u0643 \u0644\u0648\u0638\u064a\u0641\u0629 "},
  {t:"var",v:"job.title"},{t:"text",v:" \u0641\u064a \u0641\u0631\u064a\u0642 "},{t:"var",v:"job.department"},
  {t:"text",v:". \u0628\u0639\u062f \u0645\u0631\u0627\u062c\u0639\u0629 \u0645\u0644\u0641\u0643\u060c \u064a\u0633\u0639\u062f\u0646\u0627 \u062f\u0639\u0648\u062a\u0643 \u0644\u0625\u062c\u0631\u0627\u0621 \u0645\u0642\u0627\u0628\u0644\u0629.\n\n\u0645\u0648\u0639\u062f \u0645\u0642\u0627\u0628\u0644\u062a\u0643 \u0645\u0639 "},
  {t:"var",v:"interviewer.name"},{t:"text",v:" \u0628\u062a\u0627\u0631\u064a\u062e "},{t:"var",v:"interview.date"},
  {t:"text",v:" \u0627\u0644\u0633\u0627\u0639\u0629 "},{t:"var",v:"interview.time"},{t:"text",v:".\n\n\uD83D\uDCCE \u0631\u0627\u0628\u0637 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645: "},
  {t:"var",v:"interview.link"},{t:"text",v:"\n\n\u0644\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0645\u0648\u0639\u062f: "},{t:"var",v:"scheduling_link"},
  {t:"text",v:"\n\n\u0646\u062a\u0637\u0644\u0639 \u0625\u0644\u0649 \u0644\u0642\u0627\u0626\u0643.\n\n\u0645\u0639 \u0627\u0644\u062a\u062d\u064a\u0629\u060c\n"},{t:"var",v:"recruiter.name"},
  {t:"text",v:"\n"},{t:"var",v:"company.name"},{t:"text",v:" \u00B7 \u0641\u0631\u064a\u0642 \u0627\u0633\u062a\u0642\u0637\u0627\u0628 \u0627\u0644\u0645\u0648\u0627\u0647\u0628"},
];

const AR_SUBJ_SEGS = [
  {t:"text",v:"\u062f\u0639\u0648\u0629 \u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0648\u0638\u064a\u0641\u0629 "},{t:"var",v:"job.title"},{t:"text",v:" \u0641\u064a "},{t:"var",v:"company.name"},
];

const LANG_OPTIONS = [
  {code:"ar", label:"\u0627\u0644\u0639\u0631\u0628\u064a\u0629 (Arabic)", dir:"rtl"},
  {code:"fr", label:"Fran\u00E7ais (French)", dir:"ltr"},
  {code:"es", label:"Espa\u00F1ol (Spanish)", dir:"ltr"},
  {code:"de", label:"Deutsch (German)", dir:"ltr"},
  {code:"zh", label:"\u4E2D\u6587 (Chinese)", dir:"ltr"},
  {code:"ur", label:"\u0627\u0631\u062F\u0648 (Urdu)", dir:"rtl"},
];

const LANG_LABELS = {ar:"Arabic", fr:"Fran\u00E7ais", es:"Espa\u00F1ol", de:"Deutsch", zh:"\u4E2D\u6587", ur:"\u0627\u0631\u062F\u0648"};

function makeAIBody(code, bodySegs) {
  if (code === "ar") return AR_BODY_SEGS;
  // Generic placeholder for other languages
  return [{t:"text", v:"[AI-translated draft \u2014 review before publishing]\n\n"}].concat(bodySegs);
}

function AddLangModal({ existingCodes, tplBodySegs, tplSubjSegs, onClose, onAdd }) {
  const { t, lang } = useApp();
  const [selCode, setSelCode] = React.useState("");
  const [mode, setMode] = React.useState("ai");
  const avail = LANG_OPTIONS.filter(l => !existingCodes.includes(l.code));
  const valid = selCode && mode;

  const create = () => {
    if (!valid) return;
    const isAI = mode === "ai";
    const bodySegs = isAI ? makeAIBody(selCode, tplBodySegs) : [{t:"text",v:""}];
    const subjSegs = (isAI && selCode === "ar") ? AR_SUBJ_SEGS : [{t:"text",v:""}];
    onAdd({ code: selCode, label: LANG_LABELS[selCode] || selCode.toUpperCase(), isAI, bodySegs, subjSegs });
    onClose();
  };

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head" style={{ alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <h3 style={{ fontSize:16.5 }}>{lang==="ar"?"\u0625\u0636\u0627\u0641\u0629 \u0646\u0633\u062e\u0629 \u0644\u063a\u0648\u064a\u0629":"Add a language variant"}</h3>
            <div className="muted" style={{ fontSize:12.5, marginTop:2 }}>{lang==="ar"?"\u0623\u0646\u0634\u0626 \u0646\u0633\u062e\u0629 \u0645\u0646 \u0647\u0630\u0627 \u0627\u0644\u0642\u0627\u0644\u0628 \u0628\u0644\u063a\u0629 \u0623\u062e\u0631\u0649.":"Create a version of this template in another language."}</div>
          </div>
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div className="field">
            <label>{lang==="ar"?"\u0627\u0644\u0644\u063a\u0629":"Language"}</label>
            <select className="select" value={selCode} onChange={e => setSelCode(e.target.value)}>
              <option value="">{lang==="ar"?"\u0627\u062e\u062a\u0631 \u0627\u0644\u0644\u063a\u0629\u2026":"Choose a language\u2026"}</option>
              {avail.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label>{lang==="ar"?"\u0646\u0642\u0637\u0629 \u0627\u0644\u0628\u062f\u0627\u064a\u0629":"Starting point"}</label>
            <div className={"rad-opt" + (mode==="ai"?" on":"")} onClick={() => setMode("ai")}>
              <span className="rad" />
              <div>
                <div style={{ fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                  <Icon name="sparkles" size={14} fill style={{ color:"var(--ai)" }} />
                  {lang==="ar"?"\u2736 \u062a\u0631\u062c\u0645\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0645\u0646 \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629 (\u0645\u0648\u0635\u0649 \u0628\u0647)":"✦ Translate from English with AI (recommended)"}
                </div>
                <div className="muted" style={{ fontSize:12, marginTop:2 }}>{lang==="ar"?"\u0633\u0646\u0635\u064a\u063a \u0627\u0644\u062a\u0631\u062c\u0645\u0629. \u0623\u0646\u062a \u062a\u0631\u0627\u062c\u0639 \u0648\u062a\u0639\u062f\u0651\u0644 \u0642\u0628\u0644 \u0627\u0644\u0646\u0634\u0631. \u062a\u0628\u0642\u0649 \u0627\u0644\u0645\u062a\u063a\u064a\u0631\u0627\u062a \u0643\u0645\u0627 \u0647\u064a.":"We'll draft the translation. You review and edit before publishing. Variables and formatting are preserved."}</div>
              </div>
            </div>
            <div className={"rad-opt" + (mode==="blank"?" on":"")} onClick={() => setMode("blank")}>
              <span className="rad" />
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{lang==="ar"?"\u0627\u0628\u062f\u0623 \u0645\u0646 \u0641\u0631\u0627\u063a":"Start from blank"}</div>
                <div className="muted" style={{ fontSize:12 }}>{lang==="ar"?"\u0627\u0643\u062a\u0628 \u0627\u0644\u0646\u0633\u062e\u0629 \u0645\u0646 \u0627\u0644\u0635\u0641\u0631.":"Write the variant from scratch."}</div>
              </div>
            </div>
          </div>

          <div className="flex" style={{ alignItems:"center", gap:7, padding:"9px 12px", background:"var(--surface-2)", borderRadius:"var(--r-sm)", border:"1px solid var(--border)" }}>
            <Icon name="zap" size={13} style={{ color:"var(--ai)", flex:"0 0 auto" }} />
            <span style={{ fontSize:12, color:"var(--text-2)" }}>{lang==="ar"?"\u062a\u064f\u062d\u0641\u0638 \u0627\u0644\u0645\u062a\u063a\u064a\u0631\u0627\u062a \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b.":"Variables are preserved automatically."}</span>
          </div>
        </div>

        <div className="modal-foot">
          <div className="spacer" style={{ flex:1 }} />
          <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" disabled={!valid} onClick={create}>
            <Icon name="plus" size={15} />{lang==="ar"?"\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0646\u0633\u062e\u0629":"Create variant"}
          </button>
        </div>
      </div>
    </div>
  );
}

window.AddLangModal = AddLangModal;
window.AR_BODY_SEGS = AR_BODY_SEGS;
window.LANG_LABELS = LANG_LABELS;
