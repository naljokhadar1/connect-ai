/* Connect AI — AI Assistant panel (appended to screen-template-editor) */

const IMPROVE_OPTS = [
  { key:"concise",  en:"Make more concise",              ar:"\u0627\u062c\u0639\u0644\u0647 \u0623\u0643\u062b\u0631 \u0625\u064a\u062c\u0627\u0632\u0627\u064b" },
  { key:"friendly", en:"Make more friendly",             ar:"\u0627\u062c\u0639\u0644\u0647 \u0623\u0643\u062b\u0631 \u0648\u062f\u064a\u0629" },
  { key:"formal",   en:"Make more formal",               ar:"\u0627\u062c\u0639\u0644\u0647 \u0623\u0643\u062b\u0631 \u0631\u0633\u0645\u064a\u0629" },
  { key:"cta",      en:"Strengthen the call to action",  ar:"\u0642\u0648\u0651\u0650 \u0646\u062f\u0627\u0621 \u0627\u0644\u0639\u0645\u0644" },
  { key:"warm",     en:"Add a warm opening",             ar:"\u0623\u0636\u0641 \u0645\u0642\u062f\u0645\u0629 \u062f\u0627\u0641\u0626\u0629" },
  { key:"subj",     en:"Suggest 3 subject line variants",ar:"\u0627\u0642\u062a\u0631\u062d 3 \u0645\u0648\u0636\u0648\u0639\u0627\u062a" },
];

const IMPROVE_TEXTS = {
  concise:  "Hi {{candidate.first_name}},\n\nWe'd love to invite you to interview for {{job.title}} on {{interview.date}} at {{interview.time}} with {{interviewer.name}}.\n\nJoin here: {{interview.link}} · Reschedule: {{scheduling_link}}\n\nBest,\n{{recruiter.name}}, {{company.name}}",
  friendly: "Hi {{candidate.first_name}} \uD83D\uDC4B,\n\nGreat news \u2014 we loved your profile and would love to get to know you better!\n\nYou're booked with {{interviewer.name}} on {{interview.date}} at {{interview.time}}. Here's your link: {{interview.link}}\n\nNeed a different time? {{scheduling_link}}\n\nCan't wait to chat!\n{{recruiter.name}} \u00B7 {{company.name}} Talent Team",
  formal:   "Dear {{candidate.first_name}},\n\nThank you for your continued interest in the {{job.title}} position. We are pleased to invite you to a formal interview with {{interviewer.name}} on {{interview.date}} at {{interview.time}}.\n\nJoin the session here: {{interview.link}}\n\nTo reschedule, please use: {{scheduling_link}}\n\nYours sincerely,\n{{recruiter.name}}\n{{company.name}}",
  cta:      "Hi {{candidate.first_name}},\n\nWe're excited to move forward with your application for {{job.title}}!\n\n\u25B6 Join your interview: {{interview.link}}\n\nDate: {{interview.date}} \u00B7 Time: {{interview.time}} \u00B7 Interviewer: {{interviewer.name}}\n\nReschedule in 30 seconds: {{scheduling_link}}\n\n{{recruiter.name}}, {{company.name}}",
  warm:     "Hi {{candidate.first_name}},\n\nThank you so much for applying \u2014 we've enjoyed learning about your background!\n\nWe'd love to invite you for an interview with {{interviewer.name}} on {{interview.date}} at {{interview.time}}.\n\nJoin: {{interview.link}} \u00B7 Reschedule: {{scheduling_link}}\n\nLooking forward to our conversation,\n{{recruiter.name}}\n{{company.name}} Talent Team",
  subj:     "1. Your interview is scheduled \u2014 {{job.title}} at {{company.name}}\n2. It's on! Meet {{interviewer.name}} for {{job.title}} \u00B7 {{interview.date}}\n3. {{candidate.first_name}}, your next step: {{job.title}} interview",
};

function AIAssistantPanel({ tpl, lang, t, toast }) {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState("improve");
  const [activeKey, setActiveKey] = React.useState(null);
  const [sugg, setSugg] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [toneIdx, setToneIdx] = React.useState(1);
  const [voiceMatch, setVoiceMatch] = React.useState(true);
  const [toneApplied, setToneApplied] = React.useState(false);

  const tones = ["Formal","Professional","Neutral","Friendly","Casual"];
  const tonesAr = ["\u0631\u0633\u0645\u064a","\u0645\u0647\u0646\u064a","\u0645\u062d\u0627\u064a\u062f","\u0648\u062f\u064a","\u063a\u064a\u0631 \u0631\u0633\u0645\u064a"];

  const runChip = (key) => {
    setActiveKey(key); setSugg(null); setBusy(true);
    setTimeout(() => { setBusy(false); setSugg({ key, text: IMPROVE_TEXTS[key] }); }, 1100);
  };

  const applyTone = () => {
    setToneApplied(true);
    toast((lang === "ar" ? "\u062a\u0645 \u062a\u0637\u0628\u064a\u0642 \u0627\u0644\u0623\u0633\u0644\u0648\u0628: " : "Tone applied: ") + (lang === "ar" ? tonesAr[toneIdx] : tones[toneIdx]), "check");
    setTimeout(() => setToneApplied(false), 3000);
  };

  const reviewItems = [
    { type:"warn", icon:"alert", en:"Subject line is 92 characters — may truncate on mobile (limit ~78)", ar:"\u0633\u0637\u0631 \u0627\u0644\u0645\u0648\u0636\u0648\u0639 92 \u062d\u0631\u0641\u0627\u064b \u2014 \u0642\u062f \u064a\u062a\u0642\u0637\u0639 \u0639\u0644\u0649 \u0627\u0644\u062c\u0648\u0627\u0644", fix:true },
    { type:"warn", icon:"alert", en:"No clear call to action detected", ar:"\u0644\u0645 \u064a\u064f\u0631\u0635\u062f \u0646\u062f\u0627\u0621 \u0648\u0627\u0636\u062d \u0644\u0644\u0639\u0645\u0644", fix:true },
    { type:"ok",   icon:"check", en:"Variables resolve correctly with sample data", ar:"\u0627\u0644\u0645\u062a\u063a\u064a\u0631\u0627\u062a \u062a\u062a\u062d\u0648\u0644 \u0635\u062d\u064a\u062d\u0627\u064b \u0645\u0639 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u062c\u0631\u064a\u0628\u064a\u0629", fix:false },
    { type:"ok",   icon:"check", en:"Reading level: Grade 8 (appropriate for general audience)", ar:"\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0642\u0631\u0627\u0621\u0629: \u0627\u0644\u0635\u0641 8 (\u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u062c\u0645\u0647\u0648\u0631 \u0627\u0644\u0639\u0627\u0645)", fix:false },
    { type:"tip",  icon:"bulb",  en:"Consider mentioning the interview length up front", ar:"\u0641\u0643\u0651\u0631 \u0641\u064a \u0630\u0643\u0631 \u0645\u062f\u0629 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0645\u0633\u0628\u0642\u0627\u064b", fix:true },
  ];

  return (
    <div className="aia-panel">
      <div className={"aia-header" + (open ? " open" : "")} onClick={() => setOpen(o => !o)}>
        <Icon name="sparkles" size={16} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} />
        <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{lang === "ar" ? "\u2736 \u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a" : "\u2736 AI Assistant"}</span>
        <span className="muted" style={{ fontSize: 12.5 }}>{lang === "ar" ? "\u0627\u0642\u062a\u0631\u0627\u062d\u0627\u062a \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0627\u0644\u0628" : "Get suggestions for this template"}</span>
        <Icon name="chevRight" size={16} className="aia-chev" />
      </div>

      {open && (
        <div className="aia-body">
          <div className="aia-tabs">
            {[["improve","Improve","\u062a\u062d\u0633\u064a\u0646"],["tone","Tone","\u0627\u0644\u0623\u0633\u0644\u0648\u0628"],["review","Review","\u0645\u0631\u0627\u062c\u0639\u0629"]].map(([k,en,ar]) => (
              <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{lang === "ar" ? ar : en}</button>
            ))}
          </div>

          <div className="aia-content">

            {/* IMPROVE */}
            {tab === "improve" && (
              <React.Fragment>
                <div className="ai-chips">
                  {IMPROVE_OPTS.map(o => (
                    <button key={o.key} className={"ai-chip-btn" + (activeKey === o.key ? " active" : "")} onClick={() => runChip(o.key)}>
                      <Icon name="sparkles" size={12} fill />{lang === "ar" ? o.ar : o.en}
                    </button>
                  ))}
                </div>

                {busy && (
                  <div className="flex" style={{ alignItems: "center", gap: 10, padding: "12px 4px" }}>
                    <Icon name="sparkles" size={15} fill style={{ color: "var(--ai)" }} />
                    <span className="muted ai-cursor" style={{ fontSize: 13 }}>{lang === "ar" ? "\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0644\u064a\u0644\u2026" : "Analyzing\u2026"}</span>
                  </div>
                )}

                {sugg && !busy && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {lang === "ar" ? "\u0627\u0642\u062a\u0631\u0627\u062d \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649: \u0641\u0626\u0629 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u00B7 \u0623\u0633\u0644\u0648\u0628 \u0643\u0648\u0646\u0643\u062a \u00B7 \u0623\u0641\u0636\u0644 \u0645\u0645\u0627\u0631\u0633\u0627\u062a \u0627\u0644\u0628\u0631\u064a\u062f"
                        : "Suggestion based on: Interview category \u00B7 Connect AI's voice \u00B7 Email best practices"}
                    </div>
                    <div className="aia-suggestion">{sugg.text}</div>
                    <div className="flex" style={{ gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <button className="btn btn-primary btn-sm" onClick={() => toast(lang === "ar" ? "\u062a\u0645 \u0627\u0633\u062a\u0628\u062f\u0627\u0644 \u0627\u0644\u0645\u0633\u0648\u062f\u0629" : "Draft replaced", "check")}>
                        <Icon name="check" size={14} />{lang === "ar" ? "\u0627\u0633\u062a\u0628\u062f\u0627\u0644 \u0627\u0644\u0645\u0633\u0648\u062f\u0629" : "Replace draft"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast(lang === "ar" ? "\u062a\u0645\u062a \u0627\u0644\u0625\u0636\u0627\u0641\u0629" : "Inserted as new section", "check")}>
                        {lang === "ar" ? "\u0625\u062f\u0631\u0627\u062c \u0643\u0642\u0633\u0645 \u062c\u062f\u064a\u062f" : "Insert as new section"}
                      </button>
                      <a className="muted flex" style={{ alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginInlineStart: "auto" }} onClick={() => runChip(sugg.key)}>
                        <Icon name="refresh" size={13} />{lang === "ar" ? "\u0623\u0639\u062f \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629" : "Try again"}
                      </a>
                    </div>
                  </div>
                )}

                {!busy && !sugg && (
                  <div className="faint" style={{ fontSize: 12.5, textAlign: "center", padding: "8px 0" }}>
                    {lang === "ar" ? "\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0627\u0642\u062a\u0631\u0627\u062d \u0623\u0639\u0644\u0627\u0647 \u0644\u0644\u0628\u062f\u0621." : "Click a suggestion chip above to get started."}
                  </div>
                )}
              </React.Fragment>
            )}

            {/* TONE */}
            {tab === "tone" && (
              <React.Fragment>
                <div>
                  <div className="flex" style={{ justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span className="muted">{lang === "ar" ? "\u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u0643\u062a\u0627\u0628\u0629 \u0627\u0644\u062d\u0627\u0644\u064a:" : "Current tone:"}</span>
                    <span style={{ fontWeight: 600, color: "var(--ai)" }}>{lang === "ar" ? tonesAr[toneIdx] : tones[toneIdx]}</span>
                  </div>
                  <div className="tone-track" style={{ cursor: "pointer" }} onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    setToneIdx(Math.max(0, Math.min(4, Math.round(pct * 4))));
                  }}>
                    <div className="tone-thumb" style={{ left: ((toneIdx / 4) * 100) + "%" }} />
                  </div>
                  <div className="tone-labels">{(lang === "ar" ? tonesAr : tones).map(tn => <span key={tn}>{tn}</span>)}</div>
                </div>
                <div className="flex" style={{ gap: 10, alignItems: "center", marginTop: 4 }}>
                  <button className="btn btn-primary btn-sm" onClick={applyTone}>
                    <Icon name="sparkles" size={14} fill />{lang === "ar" ? "\u062a\u0637\u0628\u064a\u0642" : "Apply"}
                  </button>
                  {toneApplied && <span className="save-ind saved flex" style={{ alignItems: "center", gap: 6 }}><Icon name="check" size={14} />{lang === "ar" ? "\u0637\u064f\u0628\u0651\u0650\u0642 \u0627\u0644\u0623\u0633\u0644\u0648\u0628" : "Tone applied"}</span>}
                </div>
                <hr className="divider" />
                <div className="flex" style={{ alignItems: "center", gap: 11 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{lang === "ar" ? "\u0645\u0637\u0627\u0628\u0642\u0629 \u0623\u0633\u0644\u0648\u0628 \u0634\u0631\u0643\u062a\u0646\u0627" : "Match our company voice"}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{lang === "ar" ? "\u0646\u062d\u0644\u0651\u0644 \u0642\u0648\u0627\u0644\u0628\u0643 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629 \u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u0623\u0633\u0644\u0648\u0628\u0643 \u0627\u0644\u0645\u0639\u062a\u0627\u062f." : "We'll analyze your published templates to match your typical tone."}</div>
                    {voiceMatch && <div className="faint flex" style={{ alignItems: "center", gap: 5, fontSize: 12, marginTop: 5 }}><Icon name="sparkles" size={12} fill style={{ color: "var(--ai)" }} />{lang === "ar" ? "\u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0623\u0633\u0644\u0648\u0628 \u0645\u0646 8 \u0642\u0648\u0627\u0644\u0628" : "Voice signals from 8 templates"}</div>}
                  </div>
                  <Switch on={voiceMatch} onChange={setVoiceMatch} />
                </div>
              </React.Fragment>
            )}

            {/* REVIEW */}
            {tab === "review" && (
              <React.Fragment>
                {reviewItems.map((item, i) => (
                  <div key={i} className={"aia-review-item " + item.type}>
                    <Icon name={item.icon} size={16} style={{ color: item.type === "warn" ? "var(--warning)" : item.type === "ok" ? "var(--success)" : "var(--ai)", flex: "0 0 auto", marginTop: 1 }} />
                    <span style={{ flex: 1, fontSize: 13, lineHeight: 1.55 }}>{lang === "ar" ? item.ar : item.en}</span>
                    {item.fix && <a className="muted" style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => toast(lang === "ar" ? "\u062a\u0645 \u0627\u0644\u062a\u0637\u0628\u064a\u0642" : "Fix applied", "check")}>{lang === "ar" ? "\u0625\u0635\u0644\u0627\u062d" : "Fix"}</a>}
                  </div>
                ))}
              </React.Fragment>
            )}

          </div>

          <div className="aia-ctx">
            {lang === "ar"
              ? "\u0627\u0644\u0627\u0642\u062a\u0631\u0627\u062d\u0627\u062a \u0645\u0628\u0646\u064a\u0629 \u0639\u0644\u0649: \u0641\u0626\u0629 \u0647\u0630\u0627 \u0627\u0644\u0642\u0627\u0644\u0628 (\u0645\u0642\u0627\u0628\u0644\u0629)\u060c \u0623\u0633\u0644\u0648\u0628 \u0645\u0624\u0633\u0633\u062a\u0643 \u0639\u0628\u0631 8 \u0642\u0648\u0627\u0644\u0628\u060c \u0648\u0623\u0641\u0636\u0644 \u0645\u0645\u0627\u0631\u0633\u0627\u062a \u0627\u0644\u0628\u0631\u064a\u062f. \u0627\u0644\u0645\u0631\u0627\u062d\u0644 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0629: Standard Hire \u2192 Recruiter Screen (\u2795 4 \u0623\u062e\u0631\u0649)."
              : "Suggestions are based on: this template's category (Interview), your organization's voice across 8 templates, and email best practices. Linked workflow stages: Standard Hire \u2192 Recruiter Screen (+4 more)."}
          </div>
        </div>
      )}
    </div>
  );
}

window.AIAssistantPanel = AIAssistantPanel;
