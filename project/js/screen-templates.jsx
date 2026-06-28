/* Connect AI — Email Templates: container + library + create modal */

/* ============================================================
   Container
   ============================================================ */
function EmailTemplates({ toast }) {
  const [view, setView] = React.useState("library");
  const [selTpl, setSelTpl] = React.useState(null);
  const [aiDraft, setAiDraft] = React.useState(false);
  // modal removed — new templates open editor directly

  const handleNew = () => handleCreate({ name: "Untitled template", cat: "interview", lang: "en", startFrom: "blank", starterBase: "", aiDesc: "" });

  const openEditor = (tpl, isDuplicate) => {
    setSelTpl(tpl);
    setAiDraft(false);
    setView("editor");
    if (isDuplicate) toast(selTpl ? "Template duplicated. Edit and save when ready." : "", "check");
  };

  const openById = (id) => {
    const tpl = ET_TEMPLATES.find(t => t.id === id);
    if (tpl) openEditor(tpl);
  };

  const handleCreate = ({ name, cat, lang, startFrom, starterBase, aiDesc }) => {
    let base = ET_TEMPLATES.find(t => t.id === starterBase);
    const isAI = startFrom === "ai";
    const newTpl = {
      id: "t-new-" + Date.now(), starter: false, cat: cat || "interview", lang: lang === "ar" ? "AR" : "EN",
      status: "draft",
      name: { en: name, ar: name },
      subject: startFrom === "blank" ? "Subject…" : (base ? base.subject : name),
      subjectSegs: startFrom === "blank" ? [{ t: "text", v: "Subject…" }] : (base ? base.subjectSegs : [{ t: "text", v: name }]),
      body: startFrom === "blank" ? [] : (base ? base.body : [
        { t: "text", v: "Hi " }, { t: "var", v: "candidate.first_name" }, { t: "text", v: ",\n\n" + (aiDesc || "Your email content will appear here.") + "\n\nBest,\n" }, { t: "var", v: "recruiter.name" },
      ]),
      wfCount: 0, wfList: [], modified: { en: "just now", ar: "الآن" },
    };
    setAiDraft(isAI);
    setSelTpl(newTpl);
    setView("editor");
  };

  const handleDuplicate = (tpl) => {
    const dup = { ...tpl, id: "t-dup-" + Date.now(), starter: false, status: "draft", name: { en: tpl.name.en + " (copy)", ar: tpl.name.ar + " (copy)" }, wfCount: 0, wfList: [] };
    setAiDraft(false);
    setSelTpl(dup);
    setView("editor");
    toast("Template duplicated. Edit and save when ready.", "check");
  };

  if (view === "editor") {
    const tpl = selTpl || ET_TEMPLATES[2];
    return <TemplateEditor tpl={tpl} aiDraft={aiDraft} onBack={() => setView("library")} onManageVars={() => setView("vars")} onLinkWorkflow={() => setView("library")} toast={toast} />;
  }
  if (view === "vars") return <VariablesManager onBack={() => setView("library")} toast={toast} />;
  return (
<TemplatesLibrary onOpen={openById} onManageVars={() => setView("vars")} onNew={handleNew} onDuplicate={handleDuplicate} toast={toast} />
  );
}

/* ============================================================
   View 1 — Templates Library
   ============================================================ */
function TemplatesLibrary({ onOpen, onManageVars, onNew, onDuplicate, toast }) {
  const { t, lang } = useApp();
  const [query, setQuery] = React.useState("");
  const [catF, setCatF] = React.useState("all");
  const [langF, setLangF] = React.useState("all");
  const [statusF, setStatusF] = React.useState("all");

  const filter = (tpl) =>
    (!query || tpl.name.en.toLowerCase().includes(query.toLowerCase())) &&
    (catF === "all" || tpl.cat === catF) &&
    (langF === "all" || tpl.lang === langF) &&
    (statusF === "all" || tpl.status === statusF);

  const starters = ET_TEMPLATES.filter(t => t.starter && filter(t));
  const customs  = ET_TEMPLATES.filter(t => !t.starter && filter(t));

  const stats = [
    { label: t("et.total"),     value: 18, icon: "mail",     color: "var(--accent)" },
    { label: t("et.active"),    value: 16, icon: "check",    color: "var(--success)" },
    { label: t("et.linked"),    value: 12, icon: "workflow", color: "var(--ai)" },
    { label: t("et.languages"), value: "2",icon: "globe",    color: "var(--warning)" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">{t("et.title")}</h1><div className="page-sub">{t("et.sub")}</div></div>
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={onManageVars}><Icon name="sliders" size={16} />{t("et.manageVars")}</button>
        <button className="btn btn-primary" onClick={onNew}><Icon name="plus" size={17} />{t("et.new")}</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-pad flex" style={{ alignItems: "center", gap: 12 }}>
            <span style={{ width: 36, height: 36, borderRadius: 9, flex: "0 0 auto", display: "grid", placeItems: "center", background: `color-mix(in oklch, ${s.color} 13%, var(--surface))`, color: s.color }}><Icon name={s.icon} size={18} /></span>
            <div><div className="mono tnum" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>{s.value}</div><div className="faint" style={{ fontSize: 11.5, fontWeight: 600 }}>{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="flex" style={{ gap: 10, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div className="searchbar" style={{ maxWidth: 280, height: 38 }}>
          <Icon name="search" size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t("common.search") + "…"} />
        </div>
        <select className="select" style={{ width: "auto", minWidth: 150, height: 38 }} value={catF} onChange={e => setCatF(e.target.value)}>
          <option value="all">{t("et.allCats")}</option>
          {Object.keys(ET_CATS).map(k => <option key={k} value={k}>{t(ET_CATS[k].key)}</option>)}
        </select>
        <select className="select" style={{ width: "auto", minWidth: 130, height: 38 }} value={langF} onChange={e => setLangF(e.target.value)}>
          <option value="all">{t("et.allLangs")}</option>
          <option value="EN">EN</option><option value="AR">AR</option>
        </select>
        <select className="select" style={{ width: "auto", minWidth: 130, height: 38 }} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="all">{t("et.allStatuses")}</option>
          <option value="active">{t("et.statusActive")}</option>
          <option value="draft">{t("et.statusDraft")}</option>
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600 }}>{t("et.starters")}</h2>
        <div className="faint" style={{ fontSize: 13, marginTop: 2 }}>{t("et.startersSub")}</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 34 }}>
        {starters.map(tpl => <TemplateCard key={tpl.id} tpl={tpl} onOpen={onOpen} onDuplicate={onDuplicate} toast={toast} />)}
      </div>

      <div className="flex" style={{ alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>{t("et.yours")}</h2>
        <button className="btn btn-ghost btn-sm"><Icon name="filter" size={14} />{lang === "ar" ? "جميع القوالب" : "All templates"}<Icon name="chevDown" size={14} /></button>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {customs.map(tpl => <TemplateCard key={tpl.id} tpl={tpl} onOpen={onOpen} onDuplicate={onDuplicate} toast={toast} />)}
        <button className="role-card-new" onClick={onNew}>
          <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface-3)", display: "grid", placeItems: "center" }}><Icon name="plus" size={20} /></span>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{t("et.scratch")}</span>
        </button>
      </div>
    </div>
  );
}

function TemplateCard({ tpl, onOpen, onDuplicate, toast }) {
  const { t } = useApp();
  const cat = ET_CATS[tpl.cat];
  const statusBadge = tpl.status === "draft"
    ? <span className="badge badge-warning" style={{ height: 19 }}>{t("et.statusDraft")}</span> : null;

  return (
    <div className="card tpl-card" style={{ borderInlineStartColor: cat.color, cursor: "pointer" }} onClick={() => onOpen(tpl.id)}>
      <div className="flex" style={{ alignItems: "center", gap: 8, padding: "13px 14px 0" }}>
        <span className={"badge " + cat.badge} style={{ height: 20 }}>{t(cat.key)}</span>
        {statusBadge}
        <div className="spacer" style={{ flex: 1 }} />
        {tpl.starter && <span className="badge badge-neutral" style={{ height: 18, fontSize: 10 }}>{t("et.starter")}</span>}
        <div onClick={e => e.stopPropagation()}>
          <Kebab items={[
            { icon: "edit",      label: t("et.edit"),      onClick: () => onOpen(tpl.id) },
            { icon: "file",      label: t("et.duplicate"), onClick: () => onDuplicate(tpl) },
            { icon: "send",      label: t("et.sendTest"),  onClick: () => toast(t("ed.testSent"), "send") },
            { icon: "trash",     label: t("et.archive"),   danger: true },
          ]} />
        </div>
      </div>
      <div style={{ padding: "10px 14px 12px" }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{tpl.name.en}</div>
        <div className="faint" style={{ fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tpl.subject}</div>
      </div>
      <div className="flex" style={{ alignItems: "center", gap: 10, padding: "8px 14px", borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
        <span className="lang-pill">{tpl.lang}</span>
        <span className="faint flex" style={{ alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
          <Icon name="workflow" size={12} />{t("et.usedIn")} {tpl.wfCount} {tpl.wfCount === 1 ? t("et.wfUnit1") : t("et.wfUnit")}
        </span>
        {tpl.starter && (
          <button className="btn btn-subtle btn-sm" style={{ marginInlineStart: "auto", fontSize: 11.5, height: 26, padding: "0 9px" }}
            onClick={e => { e.stopPropagation(); onDuplicate(tpl); }}>
            <Icon name="plus" size={12} />{t("et.useTemplate")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Create Template Modal
   ============================================================ */
function CreateTemplateModal({ onClose, onCreate, toast }) {
  const { t, lang } = useApp();
  const [name, setName] = React.useState("");
  const [cat, setCat] = React.useState("");
  const [lng, setLng] = React.useState("en");
  const [startFrom, setStartFrom] = React.useState("starter");
  const [starterBase, setStarterBase] = React.useState("");
  const [aiDesc, setAiDesc] = React.useState("");
  const [advOpen, setAdvOpen] = React.useState(false);

  const filteredStarters = ET_TEMPLATES.filter(t => t.starter && (!cat || t.cat === cat));
  const valid =
    name.trim().length > 0 && cat &&
    (startFrom !== "starter" || starterBase) &&
    (startFrom !== "ai" || aiDesc.length >= 20);

  const submit = () => { if (valid) onCreate({ name: name.trim(), cat, lang: lng, startFrom, starterBase, aiDesc }); };

  const RadioCard = ({ value, icon, title, desc, teal }) => (
    <button onClick={() => setStartFrom(value)} style={{
      flex: 1, padding: 14, borderRadius: "var(--r-md)", border: `1.5px solid ${startFrom === value ? (teal ? "var(--ai)" : "var(--accent)") : "var(--border-strong)"}`,
      background: startFrom === value ? (teal ? "var(--ai-soft)" : "var(--accent-soft)") : "var(--surface)", textAlign: "start",
      transition: "var(--t-fast)", cursor: "pointer",
    }}>
      <div className="flex" style={{ alignItems: "center", gap: 9, marginBottom: 9 }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", flex: "0 0 auto",
          background: startFrom === value ? (teal ? "var(--ai)" : "var(--accent)") : "var(--surface-3)",
          color: startFrom === value ? "#fff" : "var(--text-2)" }}>
          <Icon name={icon} size={16} fill={teal && startFrom === value} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5, color: startFrom === value ? (teal ? "var(--ai)" : "var(--accent-strong)") : "var(--text)" }}>{title}</div>
        </div>
        <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${startFrom === value ? (teal ? "var(--ai)" : "var(--accent)") : "var(--border-strong)"}`, display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          {startFrom === value && <span style={{ width: 8, height: 8, borderRadius: "50%", background: teal ? "var(--ai)" : "var(--accent)" }} />}
        </span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{desc}</div>
    </button>
  );

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3 style={{ fontSize: 17 }}>{lang === "ar" ? "إنشاء قالب بريد جديد" : "Create new email template"}</h3>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{lang === "ar" ? "بضع تفاصيل سريعة للبدء. يمكنك تغيير كل شيء لاحقاً." : "A few quick details to get you started. You can change everything later."}</div>
          </div>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name */}
          <div className="field">
            <label>{lang === "ar" ? "اسم القالب" : "Template name"} <span style={{ color: "var(--danger)" }}>*</span></label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder={lang === "ar" ? "مثال: تأكيد المقابلة النهائية" : "e.g. Final Interview Confirmation"} />
          </div>

          {/* Category */}
          <div className="field">
            <label>{lang === "ar" ? "الفئة" : "Category"} <span style={{ color: "var(--danger)" }}>*</span></label>
            <select className="select" value={cat} onChange={e => { setCat(e.target.value); setStarterBase(""); }}>
              <option value="">{lang === "ar" ? "اختر الفئة…" : "Choose a category…"}</option>
              {Object.entries(ET_CATS).map(([k, v]) => <option key={k} value={k}>{t(v.key)}</option>)}
            </select>
          </div>

          {/* Language */}
          <div className="field">
            <label>{lang === "ar" ? "اللغة" : "Language"}</label>
            <div className="seg" style={{ alignSelf: "flex-start" }}>
              <button className={lng === "en" ? "on" : ""} onClick={() => setLng("en")}>English</button>
              <button className={lng === "ar" ? "on" : ""} onClick={() => setLng("ar")} style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>العربية</button>
            </div>
            <div className="hint">{lang === "ar" ? "يمكنك إنشاء نسخ بلغات أخرى لاحقاً من المحرر." : "You can create variants in other languages later from the editor."}</div>
          </div>

          {/* Start from */}
          <div className="field">
            <label>{lang === "ar" ? "ابدأ من" : "Start from"} <span style={{ color: "var(--danger)" }}>*</span></label>
            <div className="flex" style={{ gap: 10 }}>
              <RadioCard value="blank" icon="file" title={lang === "ar" ? "قالب فارغ" : "Blank template"} desc={lang === "ar" ? "ابدأ بموضوع ونص فارغَين. مُوصى به إذا كان لديك محتوى محدد." : "Start with empty subject and body. Recommended if you have specific content in mind."} />
              <RadioCard value="starter" icon="list" title={lang === "ar" ? "قالب جاهز" : "Starter template"} desc={lang === "ar" ? "ابدأ من قالب كونكت إيه آي وخصّصه. مُوصى به لمعظم الفرق." : "Begin from a Connect AI starter and customize. Recommended for most teams."} />
              <RadioCard value="ai" icon="sparkles" title={lang === "ar" ? "✦ إنشاء بالذكاء" : "✦ Generate with AI"} desc={lang === "ar" ? "صف ما تريد قوله. الذكاء يصيغ الموضوع والنص بالمتغيرات المناسبة." : "Describe what you want to say. AI drafts subject and body with the right variables."} teal />
            </div>

            {/* Starter sub-select */}
            {startFrom === "starter" && (
              <select className="select" style={{ marginTop: 10 }} value={starterBase} onChange={e => setStarterBase(e.target.value)}>
                <option value="">{lang === "ar" ? "اختر قالباً جاهزاً…" : "Choose a starter…"}</option>
                {filteredStarters.map(s => <option key={s.id} value={s.id}>{s.name.en}</option>)}
                {filteredStarters.length === 0 && <option disabled>{lang === "ar" ? "لا قوالب لهذه الفئة" : "No starters for this category"}</option>}
              </select>
            )}

            {/* AI textarea */}
            {startFrom === "ai" && (
              <div style={{ marginTop: 10 }}>
                <textarea className="textarea" rows={3} value={aiDesc} onChange={e => setAiDesc(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: ادعُ المرشح لمقابلة تقنية مدتها 60 دقيقة…" : "e.g. Invite the candidate to a 60-minute technical interview with two engineers, mention it's via video call, and include the scheduling link."} />
                <div className="hint flex" style={{ justifyContent: "flex-end" }}>
                  <span className={aiDesc.length < 20 ? "faint" : "save-ind saved"}>{aiDesc.length} / 20 min</span>
                </div>
              </div>
            )}
          </div>

          {/* Advanced */}
          <div>
            <button className="flex" style={{ alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}
              onClick={() => setAdvOpen(a => !a)}>
              <Icon name={advOpen ? "chevDown" : "chevRight"} size={15} />
              {lang === "ar" ? "خيارات متقدمة" : "Advanced"}
            </button>
            {advOpen && (
              <div style={{ marginTop: 12, padding: 14, background: "var(--surface-2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
                <div className="field"><label style={{ marginBottom: 8, display: "block" }}>{lang === "ar" ? "المستلم الافتراضي" : "Default recipient(s)"}</label>
                  <div className="flex" style={{ gap: 8, flexWrap: "wrap" }}>
                    <span className="chip chip-accent"><Icon name="check" size={12} />{lang === "ar" ? "المرشح" : "Candidate"}</span>
                    <button className="btn btn-subtle btn-sm"><Icon name="plus" size={13} />{t("ed.addRecipient")}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-foot">
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
          <button className="btn btn-primary" disabled={!valid} onClick={submit}>
            <Icon name={startFrom === "ai" ? "sparkles" : "plus"} size={16} fill={startFrom === "ai"} />
            {lang === "ar" ? "إنشاء القالب" : "Create template"}
          </button>
        </div>
      </div>
    </div>
  );
}

window.EmailTemplates = EmailTemplates;
window.TemplatesLibrary = TemplatesLibrary;
window.TemplateCard = TemplateCard;
window.CreateTemplateModal = CreateTemplateModal;
