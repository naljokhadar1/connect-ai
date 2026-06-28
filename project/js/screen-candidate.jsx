/* Connect AI — Candidate 360 profile */

function Candidate360({ id, cands, setCands, go, from, toast }) {
  const { t, L, lang } = useApp();
  const c = cands.find(x => x.id === id) || cands[0];
  const D = window.DATA;
  const job = D.jobs.find(j => j.id === c.job);
  const [tab, setTab] = React.useState("overview");

  const stageIdx = PIPE_STAGES.indexOf(c.stage);
  const advance = () => {
    const ni = Math.min(stageIdx + 1, PIPE_STAGES.length - 1);
    setCands(cs => cs.map(x => x.id === c.id ? { ...x, stage: PIPE_STAGES[ni] } : x));
    toast(`${L(c.name)} → ${t("stage." + PIPE_STAGES[ni])}`, "arrowUp");
  };
  const reject = () => { setCands(cs => cs.map(x => x.id === c.id ? { ...x, stage: "rejected" } : x)); toast(`${L(c.name)} ${t("of.status.rejected")}`, "x"); };

  const tabs = [
    { id: "overview", label: "c360.overview", icon: "users" },
    { id: "cv", label: "c360.cv", icon: "file" },
    { id: "assessment", label: "c360.assessment", icon: "assessment" },
    { id: "video", label: "c360.video", icon: "video" },
    { id: "feedback", label: "c360.feedback", icon: "message" },
    { id: "activity", label: "c360.activity", icon: "clock" },
  ];

  const factorLabels = { skills: "mf.skills", experience: "mf.experience", education: "mf.education", industry: "mf.industry", certs: "mf.certs", language: "mf.language" };

  return (
    <div className="page">
      <div className="crumbs">
        <a onClick={() => go(from || "pipeline")}>{t("nav." + (from === "dashboard" ? "dashboard" : "pipeline"))}</a>
        <span className="sep">/</span><span>{L(c.name)}</span>
      </div>

      {/* header */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="flex" style={{ gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Avatar c={c} size={72} ring />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="flex" style={{ alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 24, fontWeight: 600 }}>{L(c.name)}</h1>
              <StageBadge stage={c.stage} />
            </div>
            <div className="muted" style={{ fontSize: 14.5, marginTop: 3 }}>{L(c.title)}</div>
            <div className="flex" style={{ gap: 16, marginTop: 10, flexWrap: "wrap", fontSize: 12.5, color: "var(--text-2)" }}>
              <span className="flex" style={{ alignItems: "center", gap: 5 }}><Icon name="pin" size={14} />{L(c.loc)}</span>
              <span className="flex" style={{ alignItems: "center", gap: 5 }}><Icon name="briefcase" size={14} />{c.exp} {lang === "ar" ? "سنوات خبرة" : "yrs exp"}</span>
              <span className="flex" style={{ alignItems: "center", gap: 5 }}><Icon name="jobs" size={14} />{L(job)}</span>
              <span className="flex" style={{ alignItems: "center", gap: 5 }}><Icon name="link" size={14} />{L(c.source)}</span>
            </div>
          </div>
          <div className="flex" style={{ flexDirection: "column", alignItems: "center", gap: 4 }}>
            <ScoreRing value={c.match} size={74} stroke={6} />
            <span className="faint" style={{ fontSize: 11, fontWeight: 600 }}>{t("common.aiMatch")}</span>
          </div>
          <div className="flex" style={{ gap: 8, alignSelf: "center", flexDirection: "column" }}>
            <button className="btn btn-primary" onClick={advance} disabled={c.stage === "hired" || c.stage === "rejected"}><Icon name="arrowUp" size={16} />{t("c360.advance")}</button>
            <div className="flex" style={{ gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={reject} disabled={c.stage === "rejected"}><Icon name="x" size={15} />{t("c360.reject")}</button>
              <button className="btn btn-ghost btn-sm btn-icon"><Icon name="message" size={16} /></button>
              <button className="btn btn-ghost btn-sm btn-icon"><Icon name="more" size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="flex" style={{ gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 20, overflowX: "auto" }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 14px", fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap",
              color: tab === tb.id ? "var(--accent-strong)" : "var(--text-2)", borderBottom: "2px solid " + (tab === tb.id ? "var(--accent)" : "transparent"), marginBottom: -1 }}>
            <Icon name={tb.icon} size={16} />{t(tb.label)}
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 300px", alignItems: "start" }}>
        <div className="grid">
          {tab === "overview" && <OverviewTab c={c} factorLabels={factorLabels} />}
          {tab === "cv" && <CVTab c={c} />}
          {tab === "assessment" && <AssessTab c={c} go={go} />}
          {tab === "video" && <VideoTab c={c} go={go} />}
          {tab === "feedback" && <FeedbackTab c={c} />}
          {tab === "activity" && <ActivityTab c={c} />}
        </div>

        {/* right rail */}
        <div className="grid">
          <div className="card card-pad">
            <h4 style={{ fontSize: 13, marginBottom: 12 }}>{t("c360.matchBreak")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {Object.keys(c.factors).map(k => (
                <div key={k}>
                  <div className="flex" style={{ justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500 }}>{t(factorLabels[k])}</span><span className="mono" style={{ fontWeight: 600 }}>{c.factors[k]}%</span>
                  </div>
                  <Bar value={c.factors[k]} color={c.factors[k] >= 85 ? "var(--success)" : c.factors[k] >= 70 ? "var(--accent)" : "var(--warning)"} h={6} />
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h4 style={{ fontSize: 13, marginBottom: 12 }}>{t("c360.contact")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 13 }}>
              <a className="flex" style={{ alignItems: "center", gap: 9, color: "var(--text-2)" }} href="#"><Icon name="mail" size={15} />{c.email}</a>
              <a className="flex" style={{ alignItems: "center", gap: 9, color: "var(--text-2)" }} href="#"><span className="mono">{c.phone}</span></a>
            </div>
            <hr className="divider" style={{ margin: "13px 0" }} />
            <h4 style={{ fontSize: 13, marginBottom: 10 }}>{t("c360.languages")}</h4>
            {c.langs.map((l, i) => (
              <div key={i} className="flex" style={{ justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                <span>{L(l)}</span><span className="faint">{l.lvl}</span>
              </div>
            ))}
            <hr className="divider" style={{ margin: "13px 0" }} />
            <h4 style={{ fontSize: 13, marginBottom: 10 }}>{t("c360.certs")}</h4>
            <div className="flex" style={{ flexWrap: "wrap", gap: 6 }}>
              {c.certs.map((cc, i) => <span key={i} className="chip" style={{ height: 24 }}><Icon name="award" size={12} />{cc}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ c, factorLabels }) {
  const { t, L, lang } = useApp();
  const exp = expFor(c, lang);
  return (
    <React.Fragment>
      {/* AI summary */}
      <div className="card" style={{ background: "linear-gradient(135deg, var(--ai-soft), var(--surface) 60%)", borderColor: "color-mix(in oklch, var(--ai) 30%, var(--border))" }}>
        <div className="card-pad">
          <div className="flex" style={{ alignItems: "center", gap: 9, marginBottom: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--ai)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="sparkles" size={16} fill /></span>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>{t("c360.summary")}</h3>
            <span className="spacer" style={{ flex: 1 }} />
            <span className="badge badge-ai">{c.match}% {t("common.match")}</span>
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--text)", textWrap: "pretty" }}>{L(c.summary)}</p>
        </div>
      </div>

      {/* strengths / gaps */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card card-pad">
          <div className="flex" style={{ alignItems: "center", gap: 7, marginBottom: 12 }}><Icon name="thumb" size={16} style={{ color: "var(--success)" }} /><h4 style={{ fontSize: 13.5 }}>{t("c360.strengths")}</h4></div>
          <div className="flex" style={{ flexWrap: "wrap", gap: 7 }}>{c.skills.slice(0, 5).map((s, i) => <span key={i} className="chip" style={{ background: "var(--success-soft)", color: "var(--success)" }}><Icon name="check" size={12} />{s}</span>)}</div>
        </div>
        <div className="card card-pad">
          <div className="flex" style={{ alignItems: "center", gap: 7, marginBottom: 12 }}><Icon name="flag" size={16} style={{ color: "var(--warning)" }} /><h4 style={{ fontSize: 13.5 }}>{t("c360.gaps")}</h4></div>
          <div className="flex" style={{ flexWrap: "wrap", gap: 7 }}>{c.missing.map((s, i) => <span key={i} className="chip" style={{ background: "var(--warning-soft)", color: "var(--warning)" }}>{s}</span>)}</div>
        </div>
      </div>

      {/* experience */}
      <div className="card">
        <div className="card-head"><h3>{t("c360.experience")}</h3></div>
        <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {exp.map((e, i) => (
            <div key={i} className="flex" style={{ gap: 14 }}>
              <div className="flex" style={{ flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: i === 0 ? "var(--accent)" : "var(--border-strong)", marginTop: 4, border: "2px solid var(--surface)", boxShadow: "0 0 0 1.5px " + (i === 0 ? "var(--accent)" : "var(--border-strong)") }} />
                {i < exp.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 30 }} />}
              </div>
              <div style={{ paddingBottom: i < exp.length - 1 ? 20 : 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.role}</div>
                <div className="muted" style={{ fontSize: 13 }}>{e.company} · {e.period}</div>
                <div className="faint" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* education + skills */}
      <div className="card card-pad">
        <div className="flex" style={{ alignItems: "center", gap: 7, marginBottom: 10 }}><Icon name="grad" size={16} style={{ color: "var(--text-2)" }} /><h4 style={{ fontSize: 13.5 }}>{t("c360.education")}</h4></div>
        <div style={{ fontSize: 13.5 }}>{L(c.edu)}</div>
        <hr className="divider" style={{ margin: "16px 0" }} />
        <div className="flex" style={{ alignItems: "center", gap: 7, marginBottom: 10 }}><Icon name="zap" size={16} style={{ color: "var(--text-2)" }} /><h4 style={{ fontSize: 13.5 }}>{t("c360.skills")}</h4></div>
        <div className="flex" style={{ flexWrap: "wrap", gap: 7 }}>{c.skills.map((s, i) => <span key={i} className="chip chip-accent">{s}</span>)}</div>
      </div>
    </React.Fragment>
  );
}

function CVTab({ c }) {
  const { t, L, lang } = useApp();
  const fields = [
    { l: lang === "ar" ? "الاسم" : "Name", v: L(c.name) },
    { l: lang === "ar" ? "البريد" : "Email", v: c.email },
    { l: lang === "ar" ? "الهاتف" : "Phone", v: c.phone, mono: true },
    { l: t("c360.education"), v: L(c.edu) },
    { l: lang === "ar" ? "سنوات الخبرة" : "Experience", v: c.exp + (lang === "ar" ? " سنوات" : " years") },
    { l: t("c360.certs"), v: c.certs.join(" · ") },
  ];
  return (
    <React.Fragment>
      <div className="card">
        <div className="card-head">
          <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--ai)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="sparkles" size={15} fill /></span>
          <h3>{lang === "ar" ? "الحقول المستخرجة" : "Parsed Fields"}</h3>
          <span className="spacer" style={{ flex: 1 }} /><span className="badge badge-ai">{t("c360.parsed")}</span>
        </div>
        <div className="card-pad grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {fields.map((f, i) => (
            <div key={i} style={{ gridColumn: f.l === t("c360.education") || f.l === t("c360.certs") ? "1 / -1" : "auto" }}>
              <div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 3 }}>{f.l}</div>
              <div className={f.mono ? "mono" : ""} style={{ fontSize: 13.5, fontWeight: 500 }}>{f.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card card-pad flex" style={{ alignItems: "center", gap: 14 }}>
        <span style={{ width: 46, height: 46, borderRadius: 10, background: "var(--danger-soft)", color: "var(--danger)", display: "grid", placeItems: "center" }}><Icon name="file" size={22} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{L(c.name).replace(/\s/g, "_")}_CV.pdf</div>
          <div className="faint" style={{ fontSize: 12 }}>{lang === "ar" ? "مرفوع · 2.1 ميغابايت · تم الاستخراج بالكامل" : "Uploaded · 2.1 MB · fully parsed"}</div>
        </div>
        <button className="btn btn-ghost btn-sm"><Icon name="eye" size={15} />{lang === "ar" ? "عرض" : "View"}</button>
        <button className="btn btn-ghost btn-sm btn-icon"><Icon name="download" size={16} /></button>
      </div>
    </React.Fragment>
  );
}

function AssessTab({ c, go }) {
  const { t, lang } = useApp();
  if (!c.assess) return <EmptyState icon="assessment" text={lang === "ar" ? "لم يكمل المرشح التقييم بعد" : "Candidate has not completed the assessment yet"} />;
  return (
    <div className="card card-pad">
      <div className="flex" style={{ alignItems: "center", gap: 16 }}>
        <ScoreRing value={c.assess} size={72} stroke={6} color="var(--purple)" />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16 }}>{t("as.title")}</h3>
          <div className="muted" style={{ fontSize: 13 }}>{t("as.percentile")}: {c.percentile} · {t("as.passed")}</div>
        </div>
        <button className="btn btn-primary" onClick={() => go("assessments", { id: c.id })}>{lang === "ar" ? "عرض التفاصيل" : "View details"}<Icon name={lang === "ar" ? "chevLeft" : "chevRight"} size={16} /></button>
      </div>
    </div>
  );
}

function VideoTab({ c, go }) {
  const { t, lang } = useApp();
  if (!c.video) return <EmptyState icon="video" text={lang === "ar" ? "لا توجد مقابلة مرئية مسجلة بعد" : "No video interview recorded yet"} />;
  return (
    <div className="card card-pad">
      <div className="flex" style={{ alignItems: "center", gap: 16 }}>
        <ScoreRing value={c.video} size={72} stroke={6} color="var(--ai)" />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16 }}>{t("vi.title")}</h3>
          <div className="muted" style={{ fontSize: 13 }}>{t("vi.aiScore")} · {lang === "ar" ? "4 أسئلة · تم التحليل" : "4 questions · analyzed"}</div>
        </div>
        <button className="btn btn-primary" onClick={() => go("interviews", { id: c.id })}><Icon name="play" size={15} fill />{lang === "ar" ? "عرض المقابلة" : "View interview"}</button>
      </div>
    </div>
  );
}

function FeedbackTab({ c }) {
  const { L, lang } = useApp();
  const fb = [
    { who: { en: "Faisal Al-Otaibi", ar: "فيصل العتيبي" }, role: { en: "Hiring Manager", ar: "مدير التوظيف" }, score: 4.5, note: { en: "Strong strategic thinking and clear communication. Would be an asset to the team.", ar: "تفكير استراتيجي قوي وتواصل واضح. سيكون إضافة قيّمة للفريق." }, av: "oklch(0.6 0.13 250)" },
    { who: { en: "Noura Al-Qahtani", ar: "نورة القحطاني" }, role: { en: "Engineering Lead", ar: "قائدة الهندسة" }, score: 4, note: { en: "Technically sound, collaborative. Slightly light on data tooling depth.", ar: "متمكّن تقنياً ومتعاون. خبرة أقل قليلاً في أدوات البيانات." }, av: "oklch(0.6 0.14 20)" },
  ];
  return (
    <React.Fragment>
      {fb.map((f, i) => (
        <div key={i} className="card card-pad">
          <div className="flex" style={{ gap: 12, alignItems: "center", marginBottom: 10 }}>
            <div className="avatar" style={{ width: 38, height: 38, background: f.av, fontSize: 14 }}>{L(f.who)[0]}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{L(f.who)}</div><div className="faint" style={{ fontSize: 12 }}>{L(f.role)}</div></div>
            <div className="flex" style={{ gap: 2 }}>{[1, 2, 3, 4, 5].map(s => <Icon key={s} name="star" size={15} fill={s <= f.score} style={{ color: s <= f.score ? "var(--warning)" : "var(--border-strong)" }} />)}</div>
          </div>
          <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{L(f.note)}</p>
        </div>
      ))}
    </React.Fragment>
  );
}

function ActivityTab({ c }) {
  const { L, lang } = useApp();
  const acts = [
    { ic: "arrowUp", t: { en: "Advanced to " + c.stage, ar: "تمت الترقية" }, w: { en: "2 hours ago", ar: "قبل ساعتين" }, col: "var(--accent)" },
    { ic: "video", t: { en: "Completed AI video interview", ar: "أكمل المقابلة المرئية بالذكاء" }, w: { en: "Yesterday", ar: "أمس" }, col: "var(--ai)" },
    { ic: "assessment", t: { en: "Submitted assessment", ar: "أرسل التقييم" }, w: { en: "2 days ago", ar: "قبل يومين" }, col: "var(--purple)" },
    { ic: "sparkles", t: { en: "AI matched to role (" + c.match + "%)", ar: "طابقه الذكاء بالوظيفة (" + c.match + "%)" }, w: { en: "3 days ago", ar: "قبل 3 أيام" }, col: "var(--success)" },
    { ic: "file", t: { en: "Applied via " + L(c.source), ar: "تقدّم عبر " + L(c.source) }, w: { en: c.applied + " days ago", ar: "قبل " + c.applied + " أيام" }, col: "var(--text-3)" },
  ];
  return (
    <div className="card card-pad">
      {acts.map((a, i) => (
        <div key={i} className="flex" style={{ gap: 14 }}>
          <div className="flex" style={{ flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: `color-mix(in oklch, ${a.col} 14%, var(--surface))`, color: a.col, display: "grid", placeItems: "center" }}><Icon name={a.ic} size={15} /></span>
            {i < acts.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 18 }} />}
          </div>
          <div style={{ paddingBottom: i < acts.length - 1 ? 16 : 0, paddingTop: 5 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{L(a.t)}</div>
            <div className="faint" style={{ fontSize: 12 }}>{L(a.w)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="card card-pad" style={{ textAlign: "center", padding: "48px 20px" }}>
      <span style={{ width: 52, height: 52, borderRadius: 13, background: "var(--surface-3)", color: "var(--text-3)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}><Icon name={icon} size={26} /></span>
      <div className="muted" style={{ fontSize: 14 }}>{text}</div>
    </div>
  );
}

/* synthesize experience entries */
function expFor(c, lang) {
  const company = (L => L)(c.title[lang === "ar" ? "ar" : "en"]).split("·").pop().trim();
  const role = c.title[lang === "ar" ? "ar" : "en"].split("·")[0].trim();
  if (lang === "ar") return [
    { role: role, company: company, period: "2022 — الآن", desc: "يقود مبادرات رئيسية ضمن فريق متعدد التخصصات بتأثير مباشر على نمو الإيرادات." },
    { role: "خبرة سابقة", company: "شركة إقليمية رائدة", period: "2019 — 2022", desc: "تولى مسؤوليات متزايدة وحقق نتائج قابلة للقياس عبر عدة مشاريع." },
    { role: "بداية المسيرة", company: "مؤسسة ناشئة", period: "2016 — 2019", desc: "بنى أساساً قوياً في التخصص مع التركيز على التنفيذ والجودة." },
  ];
  return [
    { role: role, company: company, period: "2022 — Present", desc: "Leads key initiatives within a cross-functional team with direct impact on revenue growth." },
    { role: "Previous role", company: "Leading regional firm", period: "2019 — 2022", desc: "Took on increasing responsibility and delivered measurable outcomes across multiple projects." },
    { role: "Early career", company: "Growth-stage startup", period: "2016 — 2019", desc: "Built a strong foundation in the discipline with a focus on execution and quality." },
  ];
}

window.Candidate360 = Candidate360;
