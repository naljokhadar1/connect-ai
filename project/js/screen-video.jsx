/* Connect AI — AI Video Interview */

function Interviews({ id, cands, go }) {
  const { t, L, lang } = useApp();
  const withVid = cands.filter(c => c.video > 0).sort((a, b) => b.video - a.video);
  const [sel, setSel] = React.useState(id && cands.find(c => c.id === id && c.video) ? id : (withVid[0] && withVid[0].id));
  const c = cands.find(x => x.id === sel) || withVid[0];

  const [playing, setPlaying] = React.useState(false);
  const [prog, setProg] = React.useState(0);
  const [q, setQ] = React.useState(0);
  const ref = React.useRef();
  React.useEffect(() => {
    if (playing) {
      ref.current = setInterval(() => setProg(p => { if (p >= 100) { setPlaying(false); return 100; } return p + 0.7; }), 50);
    } else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [playing]);
  React.useEffect(() => { setProg(0); setPlaying(false); setQ(0); }, [sel]);

  const questions = lang === "ar"
    ? ["عرّف عن نفسك وعن خبرتك المهنية.", "صف تحدياً كبيراً واجهته وكيف تغلبت عليه.", "لماذا ترغب بالانضمام إلى فريقنا؟", "أين ترى نفسك بعد خمس سنوات؟"]
    : ["Tell us about yourself and your professional background.", "Describe a major challenge you faced and how you overcame it.", "Why do you want to join our team?", "Where do you see yourself in five years?"];

  const competencies = [
    { k: "vi.communication", v: Math.min(98, c.video + 4) },
    { k: "vi.confidence", v: Math.min(96, c.video + 1) },
    { k: "vi.language", v: Math.min(97, c.video + 3) },
    { k: "vi.relevance", v: Math.max(60, c.video - 2) },
    { k: "vi.engagement", v: Math.min(95, c.video) },
  ];

  const transcript = lang === "ar"
    ? [{ s: "أنا متخصص في ", h: "إدارة المنتجات", e: " مع خبرة تتجاوز ", h2: "ثماني سنوات", e2: " في قطاع التقنية المالية بالمملكة." },
       { s: "قدت إطلاق ", h: "منصة مدفوعات", e: " خدمت أكثر من ", h2: "مليون مستخدم", e2: " وحققت نمواً سنوياً قوياً." }]
    : [{ s: "I specialize in ", h: "product management", e: " with over ", h2: "eight years", e2: " of experience in the fintech sector across the Kingdom." },
       { s: "I led the launch of a ", h: "payments platform", e: " that served more than ", h2: "one million users", e2: " and delivered strong year-over-year growth." }];

  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">{t("vi.title")}</h1><div className="page-sub">{t("vi.sub")}</div></div>
        <div className="spacer" />
        <select className="select" style={{ width: "auto", minWidth: 200 }} value={sel} onChange={e => setSel(e.target.value)}>
          {withVid.map(v => <option key={v.id} value={v.id}>{L(v.name)}</option>)}
        </select>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 320px", alignItems: "start" }}>
        {/* main */}
        <div className="grid">
          {/* player */}
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            <div style={{ position: "relative", aspectRatio: "16/8", background: "radial-gradient(circle at 50% 35%, #1c2433, #0a0d13)", display: "grid", placeItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <Avatar c={c} size={92} />
                <div style={{ color: "#fff", fontWeight: 600, marginTop: 12, fontSize: 15, whiteSpace: "nowrap" }}>{L(c.name)}</div>
                <div style={{ color: "rgba(255,255,255,.55)", fontSize: 12.5 }}>{L(c.title)}</div>
              </div>
              {/* question caption */}
              <div style={{ position: "absolute", insetInline: 18, top: 16, display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span className="badge badge-ai" style={{ background: "rgba(13,148,148,.25)", color: "#7fe9e7", backdropFilter: "blur(4px)" }}><Icon name="message" size={11} />{t("vi.questions")} {q + 1}/{questions.length}</span>
                <span style={{ color: "rgba(255,255,255,.9)", fontSize: 12.5, background: "rgba(0,0,0,.4)", padding: "5px 10px", borderRadius: 8, backdropFilter: "blur(4px)" }}>{questions[q]}</span>
              </div>
              <button onClick={() => setPlaying(p => !p)} style={{ position: "absolute", width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.92)", display: "grid", placeItems: "center", boxShadow: "0 8px 30px rgba(0,0,0,.4)" }}>
                <Icon name={playing ? "pause" : "play"} size={24} fill style={{ color: "#0a0d13", marginInlineStart: playing ? 0 : 3 }} />
              </button>
              {/* live analysis tag */}
              {playing && <div style={{ position: "absolute", bottom: 58, insetInlineEnd: 18 }}><span className="badge" style={{ background: "rgba(220,38,38,.9)", color: "#fff" }}><span className="b-dot" style={{ animation: "blink 1s infinite" }} />{lang === "ar" ? "تحليل مباشر" : "Analyzing"}</span></div>
              }
            </div>
            {/* controls */}
            <div style={{ padding: "12px 16px", background: "#0a0d13" }}>
              <div style={{ height: 5, borderRadius: 20, background: "rgba(255,255,255,.15)", cursor: "pointer" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProg(Math.round(((lang === "ar" ? r.right - e.clientX : e.clientX - r.left) / r.width) * 100)); }}>
                <div style={{ width: prog + "%", height: "100%", background: "var(--ai)", borderRadius: 20 }} />
              </div>
              <div className="flex" style={{ alignItems: "center", gap: 12, marginTop: 10 }}>
                <button onClick={() => setPlaying(p => !p)} style={{ color: "#fff" }}><Icon name={playing ? "pause" : "play"} size={18} fill /></button>
                <span className="mono" style={{ color: "rgba(255,255,255,.7)", fontSize: 12 }}>{fmtTime(prog * 1.8)} / 03:00</span>
                <div className="spacer" style={{ flex: 1 }} />
                {questions.map((_, i) => <button key={i} onClick={() => setQ(i)} style={{ width: 8, height: 8, borderRadius: "50%", background: i === q ? "var(--ai)" : "rgba(255,255,255,.3)" }} />)}
              </div>
            </div>
          </div>

          {/* transcript */}
          <div className="card">
            <div className="card-head">
              <h3>{t("vi.transcript")}</h3><span className="spacer" style={{ flex: 1 }} />
              <span className="badge badge-ai"><Icon name="sparkles" size={11} fill />{lang === "ar" ? "نسخ تلقائي" : "Auto-transcribed"}</span>
            </div>
            <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="hint flex" style={{ alignItems: "center", gap: 6 }}><Icon name="bulb" size={13} />{t("vi.aiNote")}</div>
              {transcript.map((seg, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.75 }}>
                  <span className="mono faint" style={{ marginInlineEnd: 8, fontSize: 11 }}>{fmtTime(i * 28 + 4)}</span>
                  {seg.s}<mark style={{ background: "var(--ai-soft)", color: "var(--ai)", padding: "1px 4px", borderRadius: 4, fontWeight: 600 }}>{seg.h}</mark>{seg.e}
                  <mark style={{ background: "var(--accent-soft)", color: "var(--accent-strong)", padding: "1px 4px", borderRadius: 4, fontWeight: 600 }}>{seg.h2}</mark>{seg.e2}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* right rail */}
        <div className="grid">
          <div className="card card-pad" style={{ textAlign: "center" }}>
            <div className="faint" style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{t("vi.aiScore")}</div>
            <div style={{ display: "grid", placeItems: "center" }}><ScoreRing value={c.video} size={120} stroke={10} color="var(--ai)" /></div>
            <div className="flex" style={{ justifyContent: "center", gap: 7, marginTop: 14 }}>
              <span className="badge badge-success"><Icon name="smile" size={12} />{t("vi.sentiment")}: {t("vi.positive")}</span>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={() => go("candidate", { id: c.id, from: "pipeline" })}>{t("common.openProfile")}</button>
          </div>

          <div className="card card-pad">
            <h4 style={{ fontSize: 13, marginBottom: 14 }}>{t("vi.competencies")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {competencies.map((cp, i) => (
                <div key={i}>
                  <div className="flex" style={{ justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{t(cp.k)}</span><span className="mono" style={{ fontWeight: 600 }}>{cp.v}</span>
                  </div>
                  <Bar value={cp.v} color="var(--ai)" h={6} />
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad" style={{ background: "var(--ai-soft)", borderColor: "color-mix(in oklch, var(--ai) 30%, transparent)" }}>
            <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 8 }}><Icon name="sparkles" size={15} fill style={{ color: "var(--ai)" }} /><span style={{ fontSize: 12, fontWeight: 600, color: "var(--ai)", whiteSpace: "nowrap" }}>{t("common.recommend")}</span></div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text)" }}>{lang === "ar" ? "تواصل واضح وثقة عالية وإجابات وثيقة الصلة. يُوصى بالانتقال للمقابلة مع مدير التوظيف." : "Clear communication, high confidence, and highly relevant answers. Recommended to advance to the hiring-manager interview."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

window.Interviews = Interviews;
