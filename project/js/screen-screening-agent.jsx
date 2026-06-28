/* Connect AI — Screening Agent Settings (editing surface, collapsible sections) */

function ScreeningAgent({ go, toast, job, fresh }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [live, setLive] = React.useState(!fresh);
  const [open, setOpen] = React.useState({ basics: !!fresh });
  const [nameEdit, setNameEdit] = React.useState(false);
  const [name, setName] = React.useState(T("Engineering Senior Screen", "فرز الهندسة الأول"));
  const [confirm, setConfirm] = React.useState(null);
  const [candPreview, setCandPreview] = React.useState(false);
  const toggle = (k) => setOpen(o => ({ ...o, [k]: !o[k] }));
  const allOpen = ["basics","ask","say","sound","score","compliance"].every(k => open[k]);
  const setAll = (v) => setOpen({ basics: v, ask: v, say: v, sound: v, score: v, compliance: v });

  const Section = ({ id, icon, title, summary, children }) => (
    <div className="card" style={{ overflow: "hidden" }}>
      <button className="flex" style={{ width: "100%", alignItems: "center", gap: 12, padding: "14px 18px", textAlign: "start" }} onClick={() => toggle(id)}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-3)", color: "var(--text-2)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name={icon} size={16} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
          {!open[id] && <div className="faint" style={{ fontSize: 12, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{summary}</div>}
        </div>
        <Icon name={open[id] ? "chevDown" : (ar ? "chevLeft" : "chevRight")} size={16} style={{ color: "var(--text-3)", flex: "0 0 auto" }} />
      </button>
      {open[id] && <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--border)", paddingTop: 16 }}>{children}</div>}
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <div className="crumbs" style={{ marginBottom: 12 }}><a onClick={() => go("screening")}>{T("Screening Calls", "مكالمات الفرز")}</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} /><span style={{ color: "var(--text-2)" }}>{name}</span></div>

      {!live && !fresh && (
        <div className="flex" style={{ alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--warning-soft)", borderRadius: "var(--r-sm)", marginBottom: 12, border: "1px solid color-mix(in oklch, var(--warning) 30%, transparent)" }}>
          <Icon name="alert" size={15} style={{ color: "var(--warning)", flex: "0 0 auto" }} />
          <span style={{ fontSize: 12.5, flex: 1, color: "var(--warning)" }}>{T("This agent is paused. Candidates won't receive screening calls until you resume.", "هذا الوكيل متوقف. لن يتلقى المرشحون مكالمات حتى تستأنفه.")}</span>
          <a style={{ fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "var(--warning)" }} onClick={() => setLive(true)}>{T("Resume agent", "استئناف")}</a>
        </div>
      )}

      {/* header */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="flex" style={{ alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            {nameEdit
              ? <input className="input" value={name} autoFocus onBlur={() => { setNameEdit(false); toast(T("Saved", "حُفظ")); }} onChange={e => setName(e.target.value)} style={{ fontSize: 16, fontWeight: 600, maxWidth: 320 }} />
              : <h1 style={{ fontSize: 18, fontWeight: 600, cursor: "pointer" }} onClick={() => setNameEdit(true)}>{name}</h1>}
            <div className="faint" style={{ fontSize: 12.5, marginTop: 4 }}>{T("Technical · EN/AR · Last edited 2 days ago by Layla", "تقني · EN/AR · آخر تعديل قبل يومين بواسطة ليلى")}</div>
            <div className="flex" style={{ alignItems: "center", gap: 7, marginTop: 8 }}>
              {fresh ? <span className="badge badge-neutral">{T("Draft", "مسودة")}</span>
                : live ? <span className="badge badge-success"><span className="b-dot" />{T("Live · accepting calls", "مباشر · يستقبل مكالمات")}</span>
                : <span className="badge badge-warning"><span className="b-dot" />{T("Paused", "متوقف")}</span>}
            </div>
          </div>
          <div className="flex" style={{ gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setCandPreview(true)}><Icon name="sparkles" size={15} fill />{T("Preview a call", "معاينة مكالمة")}</button>
            {fresh
              ? <button className="btn btn-primary btn-sm" onClick={() => { setLive(true); toast(T("Agent launched", "أُطلق الوكيل")); }}><Icon name="check" size={15} />{T("Launch this agent", "إطلاق الوكيل")}</button>
              : <button className="btn btn-ghost btn-sm" onClick={() => toast(T("Calling your number…", "نتصل برقمك…"))}><Icon name="send" size={15} />{T("Test on myself", "جرّب على نفسي")}</button>}
          </div>
        </div>
        {!fresh && (
          <div className="flex" style={{ alignItems: "center", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
            <Switch on={live} onChange={v => v ? setLive(true) : setConfirm("pause")} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{T("Agent is live", "الوكيل مباشر")}</span>
            <div className="spacer" style={{ flex: 1 }} />
            <div className="flex" style={{ gap: 18, flexWrap: "wrap", fontSize: 12.5 }}>
              {[[T("Calls", "مكالمات"), "47"], [T("Avg duration", "متوسط المدة"), "14m 32s"], [T("Completion", "إكمال"), "87%"], [T("AI agreement", "اتفاق الذكاء"), "91%"], [T("Last call", "آخر مكالمة"), "2h ago"]].map(([k, v], i) => (
                <span key={i}><span className="faint">{k}: </span><b className="mono">{v}</b></span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2.6fr 1fr", alignItems: "start" }}>
        {/* LEFT — sections */}
        <div className="grid">
          <div className="flex" style={{ justifyContent: "flex-end", marginBottom: -4 }}><a className="muted" style={{ fontSize: 12, cursor: "pointer" }} onClick={() => setAll(!allOpen)}>{allOpen ? T("Collapse all", "طيّ الكل") : T("Expand all", "توسيع الكل")}</a></div>

          <Section id="basics" icon="bulb" title={T("Basics", "الأساسيات")} summary={T("Engineering Senior Screen · Technical · EN/AR · Linked to 4 jobs", "فرز الهندسة · تقني · EN/AR · 4 وظائف")}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[[T("Agent name", "الاسم"), name, true], [T("Category", "الفئة"), T("Technical", "تقني"), true], [T("Languages", "اللغات"), T("English and Arabic", "الإنجليزية والعربية"), true], [T("Created", "أُنشئ"), T("May 28, 2026 by Layla", "28 مايو 2026 · ليلى"), false], [T("Last edited", "آخر تعديل"), T("June 22, 2026 by Layla", "22 يونيو 2026 · ليلى"), false]].map(([k, v, ed], i) => (
                <div key={i} className="flex" style={{ alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <span className="faint" style={{ fontSize: 12.5, flex: "0 0 130px" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{v}</span>
                  {ed && <a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)" }} onClick={() => toast(T("Editing…", "تحرير…"))}>{T("Edit", "تحرير")}</a>}
                </div>
              ))}
            </div>
          </Section>

          <Section id="ask" icon="message" title={T("What it asks", "ماذا يسأل")} summary={T("5 goals · 2 knockouts · 2 skill probes · 1 standard · ~14 min", "5 أهداف · استبعادان · مهارتان · قياسي · ~14 د")}>
            <div className="flex" style={{ gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
              {[T("All goals", "الكل"), T("Knockout", "استبعاد"), T("Skill", "مهارة"), T("Standard", "قياسي")].map((l, i) => <button key={i} className={"btn btn-sm " + (i === 0 ? "btn-primary" : "btn-subtle")} style={{ height: 27, fontSize: 12 }}>{l}</button>)}
              <div className="spacer" style={{ flex: 1 }} />
              <button className="btn btn-subtle btn-sm" onClick={() => toast(T("Add goal", "أضف هدفاً"))}><Icon name="plus" size={13} />{T("Add goal", "هدف")}</button>
            </div>
            {[["knockout", "var(--danger)", T("Knockout", "استبعاد"), T("Work authorization for KSA", "تصريح العمل"), T("Q: Authorized to work in KSA without sponsorship? · On fail: Flag", "س: مخوّل دون كفالة؟ · عند الرسوب: وسم")],
              ["knockout", "var(--danger)", T("Knockout", "استبعاد"), T("Salary expectation alignment", "توافق الراتب"), T("Range: SAR 18,000–35,000 · On out-of-range: Flag", "النطاق: 18,000–35,000 · خارج النطاق: وسم")],
              ["skill", "var(--accent)", T("Skill", "مهارة"), T("React expertise depth", "عمق خبرة React"), T("AI probes: complex component, state, performance · React (must)", "يتعمّق: مكوّن معقّد، الحالة، الأداء · React")],
              ["skill", "var(--accent)", T("Skill", "مهارة"), T("Leadership experience", "الخبرة القيادية"), T("AI probes: team size, mentoring, feedback · Leadership (must)", "يتعمّق: الفريق، الإرشاد · القيادة")],
              ["standard", "var(--text-3)", T("Standard", "قياسي"), T("Closing questions", "أسئلة الختام"), T("3 standard questions at the end", "3 أسئلة قياسية")]].map((g, i) => (
              <div key={i} className="flex" style={{ alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", marginBottom: 7 }}>
                <Icon name="drag" size={14} style={{ color: "var(--text-3)", cursor: "grab", flex: "0 0 auto" }} />
                <span className="badge" style={{ background: `color-mix(in oklch, ${g[1]} 14%, var(--surface))`, color: g[1], height: 18, fontSize: 10 }}>{g[2]}</span>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{g[3]}</div><div className="faint" style={{ fontSize: 11.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g[4]}</div></div>
                {g[0] === "standard" ? <Switch on={true} onChange={() => {}} /> : <button className="btn-icon btn-sm" onClick={() => toast(T("Editing goal", "تحرير الهدف"))}><Icon name="edit" size={14} /></button>}
              </div>
            ))}
          </Section>

          <Section id="say" icon="doc" title={T("What it says", "ماذا يقول")} summary={T("8 knowledge entries · Salary disclosure: ON · Updated 2 days ago", "8 مدخلات · إفصاح الراتب: مفعّل · قبل يومين")}>
            <div className="flex" style={{ gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
              {[T("All", "الكل"), T("Role", "الوظيفة"), T("Compensation", "التعويض"), T("Process", "العملية"), T("Company", "الشركة")].map((l, i) => <button key={i} className={"btn btn-sm " + (i === 0 ? "btn-primary" : "btn-subtle")} style={{ height: 27, fontSize: 12 }}>{l}</button>)}
              <div className="spacer" style={{ flex: 1 }} />
              <button className="btn btn-subtle btn-sm"><Icon name="plus" size={13} />{T("Add entry", "مدخل")}</button>
            </div>
            <div className="card" style={{ boxShadow: "none", border: "1px solid var(--border)" }}>
              {[["Role", T("Day-to-day responsibilities", "المهام اليومية"), "2 days ago", false], ["Role", T("Tech stack", "التقنيات"), "1 week ago", false], ["Comp", T("Salary range", "نطاق الراتب"), "3 weeks ago", true], ["Comp", T("Benefits and vacation", "المزايا والإجازات"), "3 weeks ago", false], ["Process", T("Hiring process steps", "خطوات التوظيف"), "1 week ago", false], ["Process", T("Office and remote policy", "سياسة العمل"), "1 month ago", false], ["Company", T("About Connect AI", "عن Connect AI"), "2 months ago", false], ["Other", T("Common FAQs", "أسئلة شائعة"), "2 weeks ago", false]].map((e, i, arr) => (
                <div key={i} className="flex" style={{ alignItems: "center", gap: 10, padding: "9px 12px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }} onClick={() => toast(T("Editing entry", "تحرير المدخل"))}>
                  <span className="badge badge-neutral" style={{ height: 18, fontSize: 10, flex: "0 0 auto" }}>{e[0]}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{e[1]}{e[3] && <Icon name="lock" size={11} style={{ color: "var(--text-3)", marginInlineStart: 6, verticalAlign: "-1px" }} />}</span>
                  <span className="faint" style={{ fontSize: 11.5 }}>{e[2]}</span>
                  <a className="muted" style={{ fontSize: 12, color: "var(--accent)" }}>{T("Edit", "تحرير")}</a>
                </div>
              ))}
            </div>
            <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none", marginTop: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{T("When the AI doesn't know", "عند عدم المعرفة")}</div>
              <p className="faint" style={{ fontSize: 12.5, fontStyle: "italic", lineHeight: 1.55 }}>{T("“That's a good question. Let me note that for Layla to confirm with you after this call…”", "«سؤال جيد. سأدوّنه لتؤكده ليلى بعد المكالمة…»")}</p>
              <label className="flex" style={{ alignItems: "center", gap: 9, marginTop: 10, cursor: "pointer", fontSize: 12.5 }}><Switch on={true} onChange={() => {}} />{T("Email recruiter with unanswered questions", "إرسال الأسئلة غير المُجابة")}</label>
            </div>
          </Section>

          <Section id="sound" icon="smile" title={T("How it sounds", "كيف يبدو")} summary={T("Sarah (English) + Layla (Arabic) · Professional · ~15 min", "سارة (EN) + ليلى (AR) · مهني · ~15 د")}>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["Sarah", T("Warm · Professional · Female · American", "ودود · مهني · أنثى · أمريكي"), T("English", "إنجليزي")], ["Layla", T("Warm · Professional · Female · Gulf", "ودود · مهني · أنثى · خليجي"), T("Arabic", "عربي")]].map((v, i) => (
                <div key={i} className="card card-pad" style={{ padding: 14 }}>
                  <div className="faint" style={{ fontSize: 11, fontWeight: 600, marginBottom: 7 }}>{v[2]}</div>
                  <div className="flex" style={{ alignItems: "center", gap: 10 }}>
                    <span style={{ width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, color-mix(in oklch,var(--ai) 55%,var(--accent)),var(--accent))", color: "#fff", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="sparkles" size={15} fill /></span>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{v[0]}</div><div className="faint" style={{ fontSize: 11 }}>{v[1]}</div></div>
                    <button className="btn-icon btn-sm" onClick={() => toast(T("Playing…", "تشغيل…"))}><Icon name="play" size={13} /></button>
                  </div>
                  <a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)", marginTop: 8, display: "inline-block" }} onClick={() => setConfirm("voice")}>{T("Change voice", "تغيير الصوت")}</a>
                </div>
              ))}
            </div>
            {[[T("Tone", "النبرة"), [T("Formal", "رسمي"), T("Professional", "مهني"), T("Friendly", "ودّي"), T("Casual", "عفوي")], 1], [T("Pace", "الإيقاع"), [T("Fast", "سريع"), T("Natural", "طبيعي"), T("Patient", "متأنٍّ")], 1], [T("Length", "المدة"), ["~10m", "~15m", "~20m"], 1]].map(([label, opts, sel], i) => (
              <div key={i} className="field" style={{ marginBottom: 12 }}><label>{label}</label><div className="seg" style={{ display: "inline-flex", flexWrap: "wrap" }}>{opts.map((o, j) => <button key={j} className={j === sel ? "on" : ""}>{o}</button>)}</div></div>
            ))}
            <button className="btn btn-ai btn-sm" onClick={() => toast(T("Playing opening line…", "تشغيل الافتتاحية…"))}><Icon name="sparkles" size={14} fill />{T("Preview opening line", "معاينة الافتتاحية")}</button>
          </Section>

          <Section id="score" icon="trending" title={T("How it scores", "كيف يُقيّم")} summary={T("6 criteria from job rubric · Auto-advance: OFF · Auto-reject: OFF", "6 معايير · تقديم تلقائي: معطّل · رفض: معطّل")}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{T("Scoring criteria", "معايير التقييم")}</div>
            <p className="faint" style={{ fontSize: 11.5, marginBottom: 10 }}>{T("Weights pulled from linked job's rubric. Adjust to override.", "الأوزان من معايير الوظيفة. عدّل للتجاوز.")}</p>
            {[[T("React expertise", "خبرة React"), "must", 25], ["TypeScript", "must", 20], [T("Leadership", "القيادة"), "must", 20], [T("Communication", "التواصل"), "must", 15], [T("Cultural fit", "الملاءمة"), "nice", 10], [T("Fintech motivation", "الدافع المالي"), "nice", 10]].map((c, i) => (
              <div key={i} className="flex" style={{ alignItems: "center", gap: 10, padding: "6px 0" }}>
                <span style={{ flex: "0 0 140px", fontSize: 12.5, fontWeight: 500 }}>{c[0]}</span>
                <span className={"badge " + (c[1] === "must" ? "badge-accent" : "badge-neutral")} style={{ height: 17, fontSize: 9.5 }}>{c[1]}</span>
                <input type="range" min="0" max="40" defaultValue={c[2]} style={{ flex: 1, accentColor: "var(--accent)" }} onChange={() => {}} />
                <span className="mono" style={{ flex: "0 0 36px", textAlign: "end", fontWeight: 600, fontSize: 12.5 }}>{c[2]}%</span>
              </div>
            ))}
            <a className="muted" style={{ fontSize: 12, cursor: "pointer", display: "inline-block", marginTop: 8 }}>{T("Reset to job rubric defaults", "إعادة لافتراضي المعايير")}</a>
            <hr className="divider" style={{ margin: "16px 0" }} />
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>{T("Recommendation behavior", "سلوك التوصية")}</div>
            <div className="flex" style={{ alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 38, height: 22, borderRadius: 20, background: "var(--accent)", position: "relative", flex: "0 0 38px", opacity: .85 }}><span style={{ position: "absolute", top: 2, insetInlineStart: 18, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} /></span>
              <span style={{ flex: 1, fontSize: 13 }}>{T("Generate AI recommendation", "توليد توصية الذكاء")}</span>
              <span className="badge badge-neutral" style={{ height: 18, fontSize: 10 }}><Icon name="lock" size={10} />{T("Locked", "مقفل")}</span>
            </div>
            {[T("Auto-advance high-confidence candidates", "تقديم تلقائي عالي الثقة"), T("Auto-reject low-confidence candidates", "رفض تلقائي منخفض الثقة")].map((l, i) => (
              <label key={i} className="flex" style={{ alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer" }} onClick={() => toast(T("Most teams keep this off", "معظم الفرق تُبقيه معطّلاً"))}>
                <span style={{ width: 38, height: 22, borderRadius: 20, background: "var(--border-strong)", position: "relative", flex: "0 0 38px" }}><span style={{ position: "absolute", top: 2, insetInlineStart: 2, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} /></span>
                <span style={{ fontSize: 13 }}>{l}</span>
              </label>
            ))}
          </Section>

          <Section id="compliance" icon="shield" title={T("Compliance & consent", "الامتثال والموافقة")} summary={T("✓ Content only · ✓ Human decides · ✓ Challenge ON · 3 region rules", "✓ المحتوى فقط · ✓ القرار بشري · ✓ الاعتراض مفعّل · 3 مناطق")}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{T("Candidate consent text", "نص موافقة المرشح")}</div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--text-2)", background: "var(--surface-2)", borderRadius: "var(--r-sm)", padding: "10px 12px", borderInlineStart: "3px solid var(--border-strong)" }}>{T("This call will be conducted by an AI agent. The conversation will be recorded, transcribed, and analyzed. Kept for 90 days and reviewed by our team. You can stop anytime. By continuing, you consent.", "ستُجرى هذه المكالمة بواسطة وكيل ذكاء. ستُسجَّل وتُفرَّغ وتُحلَّل، وتُحفظ 90 يوماً ويراجعها فريقنا. يمكنك التوقف في أي وقت. بالمتابعة فإنك توافق.")}</p>
            <a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)", display: "inline-block", marginTop: 6 }}>{T("Edit consent text", "تحرير النص")}</a>
            <div style={{ fontWeight: 600, fontSize: 13, margin: "16px 0 10px" }}>{T("Analysis level", "مستوى التحليل")}</div>
            {[[T("Content analysis only (what the candidate says)", "تحليل المحتوى فقط"), true, false], [T("Content + speech patterns", "المحتوى + أنماط الكلام"), false, true], [T("Content + voice analysis", "المحتوى + تحليل الصوت"), false, true]].map((r, i) => (
              <div key={i} className="flex" style={{ alignItems: "flex-start", gap: 9, padding: "5px 0", opacity: r[2] ? .5 : 1 }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid " + (r[1] ? "var(--accent)" : "var(--border-strong)"), background: r[1] ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto", marginTop: 1 }}>{r[1] && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}</span>
                <div><div style={{ fontSize: 13 }}>{r[0]}</div>{r[2] && <div className="faint" style={{ fontSize: 11, marginTop: 1 }}>{T("Not available — EU AI Act restricts behavioral inference.", "غير متاح — قانون الذكاء الأوروبي يقيّد الاستدلال السلوكي.")}</div>}</div>
              </div>
            ))}
            <div style={{ fontWeight: 600, fontSize: 13, margin: "16px 0 10px" }}>{T("Apply stricter rules for candidates in:", "قواعد أصرم للمرشحين في:")}</div>
            <div className="flex" style={{ gap: 16, flexWrap: "wrap" }}>{["EU", "NYC", "Illinois"].map((l, i) => <label key={i} className="flex" style={{ alignItems: "center", gap: 7, fontSize: 13 }}><span style={{ width: 18, height: 18, borderRadius: 5, background: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name="check" size={12} style={{ color: "#fff" }} /></span>{l}</label>)}</div>
            <div className="flex" style={{ alignItems: "center", gap: 10, marginTop: 16 }}>
              <span style={{ width: 38, height: 22, borderRadius: 20, background: "var(--accent)", position: "relative", flex: "0 0 38px", opacity: .85 }}><span style={{ position: "absolute", top: 2, insetInlineStart: 18, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} /></span>
              <span style={{ flex: 1, fontSize: 13 }}>{T("Log every decision for bias audit", "تسجيل كل قرار لتدقيق التحيّز")}</span><span className="badge badge-neutral" style={{ height: 18, fontSize: 10 }}><Icon name="lock" size={10} />{T("Locked", "مقفل")}</span>
            </div>
            <label className="flex" style={{ alignItems: "center", gap: 10, marginTop: 10, cursor: "pointer" }}><Switch on={true} onChange={() => {}} /><span style={{ fontSize: 13 }}>{T("Allow candidates to challenge AI evaluation", "السماح بالاعتراض على التقييم")}</span></label>
          </Section>

          {/* danger zone */}
          <hr className="divider" style={{ margin: "8px 0" }} />
          <div className="card card-pad" style={{ borderColor: "color-mix(in oklch, var(--danger) 25%, var(--border))" }}>
            <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--danger)", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>{T("Danger zone", "منطقة الخطر")}</div>
            <div className="flex" style={{ alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{T("Pause agent", "إيقاف الوكيل")}</div><div className="faint" style={{ fontSize: 11.5 }}>{T("Stops accepting calls; settings preserved.", "يوقف استقبال المكالمات؛ الإعدادات محفوظة.")}</div></div>
              <Switch on={!live} onChange={v => v ? setConfirm("pause") : setLive(true)} />
            </div>
            <div className="flex" style={{ alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{T("Duplicate this agent", "تكرار الوكيل")}</div><div className="faint" style={{ fontSize: 11.5 }}>{T("Create a copy as a new draft.", "إنشاء نسخة كمسودة.")}</div></div>
              <button className="btn btn-ghost btn-sm" onClick={() => toast(T("Duplicated", "تم التكرار"))}>{T("Duplicate", "تكرار")}</button>
            </div>
            <div className="flex" style={{ alignItems: "center", gap: 12, padding: "8px 0" }}>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{T("Archive agent", "أرشفة الوكيل")}</div><div className="faint" style={{ fontSize: 11.5 }}>{T("Hide and unlink from all jobs. Calls preserved.", "إخفاء وفك الربط. المكالمات محفوظة.")}</div></div>
              <button className="btn btn-subtle btn-sm" style={{ color: "var(--danger)" }} onClick={() => setConfirm("archive")}>{T("Archive", "أرشفة")}</button>
            </div>
          </div>
        </div>

        {/* RIGHT — context */}
        <div className="grid" style={{ position: "sticky", top: 0 }}>
          <div className="card">
            <div className="card-head"><h3 style={{ fontSize: 13.5 }}>{T("Linked to 4 jobs", "مرتبط بـ 4 وظائف")}</h3><div className="spacer" style={{ flex: 1 }} /><a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)" }} onClick={() => go("screening-linked")}>{T("Manage", "إدارة")}</a></div>
            <div style={{ padding: "4px 6px" }}>
              {[[T("Senior Frontend Engineer", "مهندس واجهات أول"), T("Active · 14 calls", "نشط · 14 مكالمة"), false], [T("Senior Full-Stack Engineer", "مهندس متكامل أول"), T("Active · 11 calls", "نشط · 11 مكالمة"), false], [T("Engineering Manager", "مدير هندسة"), T("Active · 8 calls", "نشط · 8 مكالمات"), false], [T("Senior React Engineer", "مهندس React أول"), T("Archived · 14 calls", "مؤرشف · 14 مكالمة"), true]].map((j, i) => (
                <div key={i} className="flex" style={{ flexDirection: "column", gap: 2, padding: "9px 10px", borderRadius: "var(--r-sm)", cursor: "pointer", opacity: j[2] ? .6 : 1 }} onClick={() => go("jobs")}>
                  <span style={{ fontWeight: 600, fontSize: 12.5 }}>{j[0]}</span>
                  <span className="faint" style={{ fontSize: 11 }}>{T("Screening Call", "مكالمة الفرز")} · {j[1]}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)" }}><a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)" }} onClick={() => go("screening-linked")}>+ {T("Link to another job", "اربط بوظيفة")}</a></div>
          </div>
          <div className="card">
            <div className="card-head"><h3 style={{ fontSize: 13.5 }}>{T("Recent calls", "آخر المكالمات")}</h3><div className="spacer" style={{ flex: 1 }} /><a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--accent)" }} onClick={() => go("screening-done")}>{T("View all", "الكل")}</a></div>
            <div style={{ padding: "4px 6px" }}>
              {[["Ahmed Hassan", "87 · Advanced", "var(--success)", "2h"], ["Sara Mansour", "78 · Awaiting", "var(--warning)", "6h"], ["Khalid Al-Rahman", "92 · Advanced", "var(--success)", "1d"], ["Fatima Al-Shamsi", "45 · Rejected", "var(--danger)", "2d"], ["Omar Al-Otaibi", "81 · Advanced", "var(--success)", "2d"]].map((c, i) => (
                <div key={i} className="flex" style={{ alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: "var(--r-sm)", cursor: "pointer" }} onClick={() => go("screening-review")}>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12.5 }}>{c[0]}</div><div className="faint" style={{ fontSize: 11, color: c[2] }}>{c[1]}</div></div>
                  <span className="faint" style={{ fontSize: 11 }}>{c[3]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {confirm && (
        <div className="scrim" onClick={() => setConfirm(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{confirm === "pause" ? T("Pause this agent?", "إيقاف الوكيل؟") : confirm === "voice" ? T("Change voice for 4 active jobs?", "تغيير الصوت لـ 4 وظائف؟") : T("Archive this agent?", "أرشفة الوكيل؟")}</div><button className="btn-icon btn-sm" onClick={() => setConfirm(null)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body"><p style={{ fontSize: 14, lineHeight: 1.6 }}>{confirm === "pause" ? T("Candidates won't receive screening calls until you resume. Settings are preserved.", "لن يتلقى المرشحون مكالمات حتى الاستئناف. الإعدادات محفوظة.") : confirm === "voice" ? T("Candidates currently being screened continue with the current voice. New calls use the new voice.", "المرشحون الجاريون يكملون بالصوت الحالي. المكالمات الجديدة تستخدم الجديد.") : T("This hides the agent from the library and unlinks it from all jobs. Historical calls are preserved.", "يُخفي الوكيل من المكتبة ويفك ربطه. المكالمات محفوظة.")}</p></div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)}>{T("Cancel", "إلغاء")}</button><button className={"btn btn-sm " + (confirm === "voice" ? "btn-primary" : "btn-danger")} onClick={() => { if (confirm === "pause") setLive(false); setConfirm(null); toast(confirm === "pause" ? T("Agent paused", "تم الإيقاف") : confirm === "voice" ? T("Voice changed", "تم تغيير الصوت") : T("Agent archived", "تمت الأرشفة")); if (confirm === "archive") go("screening"); }}>{confirm === "pause" ? T("Pause agent", "إيقاف") : confirm === "voice" ? T("Change voice", "تغيير") : T("Archive", "أرشفة")}</button></div>
          </div>
        </div>
      )}
      {candPreview && <ScreeningCandidate onClose={() => setCandPreview(false)} />}
    </div>
  );
}

window.ScreeningAgent = ScreeningAgent;
