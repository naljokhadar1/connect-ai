import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui';
import { Icon } from '../lib/icons';

/* Connect AI — Assessment Results Review (Epic 12.4) */

function AssessmentResultsReview({ a, cand, onBack, toast }) {
  const { L, lang } = useApp();
  const { TYPES, DIFF } = window.ASSESS;
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);

  const [res] = React.useState(() => window.ASSESS.buildResult(a, cand));
  const [tab, setTab] = React.useState("overview");
  const [status, setStatus] = React.useState(res.status); // submitted | scored
  const [scores, setScores] = React.useState(res.rubric.map(r => r.ai)); // recruiter scores start = AI
  const [justify, setJustify] = React.useState({});
  const [comments, setComments] = React.useState({});
  const [calc, setCalc] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [dismissedFlags, setDismissedFlags] = React.useState({});
  const [trustDetail, setTrustDetail] = React.useState(null);
  const tr = res.trust;
  const activeFlags = (tr.flags || []).filter(f => !dismissedFlags[f.id]);

  const c = res.cand;
  const weightedAI = res.rubric.reduce((s, r, i) => s + r.ai * r.weight, 0) / 100;
  const weightedRec = res.rubric.reduce((s, r, i) => s + scores[i] * r.weight, 0) / 100;
  const tierOf = (v10) => v10 >= 8 ? "strong" : v10 >= 6.5 ? "good" : v10 >= 5 ? "possible" : "weak";
  const tierLabel = { strong: T("Strong", "قوي"), good: T("Good", "جيد"), possible: T("Possible", "محتمل"), weak: T("Weak", "ضعيف") };
  const tierColor = { strong: "var(--success)", good: "var(--accent)", possible: "var(--warning)", weak: "var(--danger)" };
  const finalTier = tierOf(weightedRec);

  const lowConf = res.rubric.some((r, i) => r.conf === "low");
  const needsJustify = res.rubric.some((r, i) => Math.abs(scores[i] - r.ai) > 2 && !justify[i]);

  const setScore = (i, v) => setScores(s => s.map((x, j) => j === i ? Math.max(0, Math.min(10, v)) : x));

  const finalize = (mode) => {
    setStatus("scored");
    toast(mode === "confirm" ? T("AI score confirmed", "تم تأكيد درجة الذكاء") : T("Override saved", "تم حفظ التعديل"));
  };

  const tabs = [
    { id: "overview", label: T("Overview", "نظرة عامة") },
    { id: "rubric", label: T("AI rubric grading", "تقييم الذكاء حسب المعايير") },
    { id: "cohort", label: T("Cohort comparison", "المقارنة بالمجموعة") },
    { id: "questions", label: T("Question-level review", "مراجعة على مستوى السؤال") },
    { id: "trust", label: T("Submission integrity", "نزاهة التسليم") },
  ];

  const StatusPill = () => status === "scored"
    ? <span className="badge badge-success"><span className="b-dot" />{T("Scored", "تم التقييم")}</span>
    : <span className="badge badge-purple">{T("Submitted", "تم التسليم")}</span>;

  const ConfChip = ({ conf }) => {
    const m = { high: ["var(--success)", T("High confidence", "ثقة عالية")], medium: ["var(--warning)", T("Medium", "متوسطة")], low: ["var(--danger)", T("Low — review", "منخفضة — راجع")] };
    return <span className="badge" style={{ background: `color-mix(in oklch, ${m[conf][0]} 14%, var(--surface))`, color: m[conf][0], height: 20 }}>{m[conf][1]}</span>;
  };

  // QType used in questions tab — inline local copy
  const QType = ({ t, sm }) => {
    const q = window.ASSESS.QTYPES[t];
    return <span className="badge badge-neutral" style={{ height: sm ? 19 : 22, gap: 4 }}><Icon name={q.icon} size={sm ? 10 : 12} />{L(q)}</span>;
  };

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <div className="crumbs" style={{ marginBottom: 12 }}>
        <a onClick={onBack}>{ar ? "مكتبة التقييمات" : "Assessment Library"}</a>
        <Icon name={ar ? "chevLeft" : "chevRight"} size={13} /><span>{L(a.title)}</span>
        <Icon name={ar ? "chevLeft" : "chevRight"} size={13} /><span style={{ color: "var(--text-2)" }}>{L(c.name)}</span>
      </div>

      {/* header */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="flex" style={{ alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Avatar c={c} size={52} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="flex" style={{ alignItems: "center", gap: 9, flexWrap: "wrap" }}><h1 style={{ fontSize: 21 }}>{L(c.name)}</h1><StatusPill />
              {activeFlags.length > 0 && <span className="badge badge-warning" style={{ height: 22, cursor: "pointer" }} onClick={() => setTab("trust")}><Icon name="alert" size={11} />{T(`${activeFlags.length} flag`, `${activeFlags.length} تنبيه`)}</span>}
            </div>
            <div className="muted" style={{ fontSize: 13 }}>{L(c.title)} · {L(a.title)}</div>
            {a.external && <div className="flex" style={{ alignItems: "center", gap: 5, fontSize: 12, marginTop: 4, color: "var(--ai)" }}><Icon name="plug" size={12} />{T("Synced from", "مُزامن من")} {window.ASSESS.PROVIDER_BY[a.provider]?.name} · <a style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => toast(T("Opening provider…", "فتح المزوّد…"))}>{T("View on", "عرض على")} {window.ASSESS.PROVIDER_BY[a.provider]?.name}</a></div>}
          </div>
          <div className="flex" style={{ gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => toast(T("Exported question-level PDF", "تم تصدير ملف PDF"))}><Icon name="download" size={15} />{T("Export PDF", "تصدير PDF")}</button>
          </div>
        </div>
      </div>

      <div className="ptabs" style={{ marginBottom: "var(--gap)" }}>
        {tabs.map(x => <button key={x.id} className={tab === x.id ? "on" : ""} onClick={() => setTab(x.id)}>{x.label}{x.id === "rubric" && lowConf && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--danger)", display: "inline-block", marginInlineStart: 6, verticalAlign: "middle" }} />}</button>)}
      </div>

      {/* ===== OVERVIEW ===== */}
      {tab === "overview" && (
        <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
          <div className="grid">
            {/* score summary */}
            <div className="card card-pad">
              <div className="flex" style={{ gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                <ScoreRing value={res.pct} size={110} stroke={9} color="var(--purple)" sub={T("OBJECTIVE", "موضوعي")} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="flex" style={{ gap: 22, flexWrap: "wrap", marginBottom: 14 }}>
                    <Bq label={T("Raw points", "النقاط الخام")} value={`${res.raw} / ${res.max}`} />
                    <Bq label={T("Percentage", "النسبة")} value={res.pct + "%"} />
                    <Bq label={T("Tier", "الفئة")} value={tierLabel[finalTier]} color={tierColor[finalTier]} />
                    <Bq label={T("Time taken", "الوقت")} value={res.timeTaken + T(" min", " د") + T(` of ${res.limit}`, ` من ${res.limit}`)} />
                  </div>
                  <div className="faint" style={{ fontSize: 12 }}>{T("Objective questions auto-graded on submission. Subjective answers graded by AI in the rubric tab.", "صُحّحت الأسئلة الموضوعية تلقائياً عند التسليم. الأسئلة المقالية يقيّمها الذكاء في تبويب المعايير.")}</div>
                </div>
              </div>
            </div>

            {/* section breakdown */}
            <div className="card">
              <div className="card-head"><h3>{T("Section breakdown", "تفصيل الأقسام")}</h3></div>
              <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {res.sections.map((s, i) => {
                  const p = Math.round((s.score / s.max) * 100);
                  return (
                    <div key={i}>
                      <div className="flex" style={{ justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                        <span style={{ fontWeight: 500 }}>{L(s.name)}</span>
                        <span className="mono" style={{ fontWeight: 600, color: p >= 85 ? "var(--success)" : p >= 70 ? "var(--accent)" : "var(--warning)" }}>{s.score}/{s.max}</span>
                      </div>
                      <Bar value={p} color={p >= 85 ? "var(--success)" : p >= 70 ? "var(--purple)" : "var(--warning)"} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI summary */}
            <div className="card card-pad" style={{ borderInlineStart: "3px solid var(--ai)" }}>
              <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon name="sparkles" size={15} fill style={{ color: "var(--ai)" }} /><h3 style={{ fontSize: 14, flex: 1 }}>{T("AI evaluation summary", "ملخص تقييم الذكاء")}</h3>
                {status !== "scored" && <span className="badge badge-warning" style={{ height: 20 }}>{T("Draft", "مسودة")}</span>}
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-2)" }}>{L(res.aiSummary)}</p>
              <div className="flex" style={{ alignItems: "center", gap: 8, marginTop: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{T("Recommendation:", "التوصية:")}</span>
                <span className="badge" style={{ background: `color-mix(in oklch, ${tierColor[res.aiTier]} 14%, var(--surface))`, color: tierColor[res.aiTier] }}>{tierLabel[res.aiTier]} {T("match", "تطابق")}</span>
              </div>
            </div>
          </div>

          {/* right: scoring panel */}
          <div className="grid">
            <div className="card card-pad">
              <h3 style={{ fontSize: 14, marginBottom: 14 }}>{T("Final score", "الدرجة النهائية")}</h3>
              <div className="flex" style={{ gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1, textAlign: "center", padding: "12px 0", borderRadius: "var(--r-md)", background: "var(--surface-2)" }}>
                  <div className="faint" style={{ fontSize: 11, fontWeight: 600 }}>{T("AI DRAFT", "مسودة الذكاء")}</div>
                  <div className="mono" style={{ fontSize: 26, fontWeight: 600, color: "var(--ai)" }}>{weightedAI.toFixed(1)}</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "12px 0", borderRadius: "var(--r-md)", background: "var(--accent-soft)" }}>
                  <div className="faint" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-strong)" }}>{T("RECRUITER", "المُوظِّف")}</div>
                  <div className="mono" style={{ fontSize: 26, fontWeight: 600, color: "var(--accent-strong)" }}>{weightedRec.toFixed(1)}</div>
                </div>
              </div>
              {status === "scored" ? (
                <div className="card card-pad" style={{ background: "var(--success-soft)", boxShadow: "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Icon name="check" size={16} style={{ color: "var(--success)", flex: "0 0 auto", marginTop: 1 }} />
                  <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{T("Scored. This result now feeds the candidate's composite AI Match.", "تم التقييم. تُغذّي هذه النتيجة الآن مطابقة الذكاء المركّبة للمرشح.")}</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <button className="btn btn-primary" onClick={() => finalize("confirm")}><Icon name="sparkles" size={15} fill />{T("Confirm AI score", "تأكيد درجة الذكاء")}</button>
                  <button className="btn btn-ghost" disabled={needsJustify} onClick={() => finalize("override")}><Icon name="check" size={15} />{T("Save override", "حفظ التعديل")}</button>
                  <div className="flex" style={{ gap: 9 }}>
                    <button className="btn btn-subtle btn-sm" style={{ flex: 1, color: "var(--danger)" }} onClick={() => setRejectOpen(true)}><Icon name="ban" size={14} />{T("Reject", "رفض")}</button>
                    <button className="btn btn-subtle btn-sm" style={{ flex: 1 }} onClick={() => toast(T("Team discussion requested", "تم طلب نقاش الفريق"))}><Icon name="users" size={14} />{T("Discuss", "نقاش")}</button>
                  </div>
                  {needsJustify && <div className="faint" style={{ fontSize: 11.5, color: "var(--warning)" }}>{T("Justification required for overrides >2 pts (see rubric tab).", "يلزم تبرير عند التعديل بأكثر من نقطتين (انظر تبويب المعايير).")}</div>}
                </div>
              )}
            </div>

            {/* composite feed */}
            <div className="card card-pad">
              <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Icon name="sparkles" size={14} fill style={{ color: "var(--accent)" }} /><h3 style={{ fontSize: 13.5, flex: 1 }}>{T("Composite AI Match", "مطابقة الذكاء المركّبة")}</h3>
                <a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--ai)" }} onClick={() => setCalc(true)}>{T("How is this calculated?", "كيف تُحتسب؟")}</a>
              </div>
              <div className="flex" style={{ alignItems: "center", gap: 12 }}>
                <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--text-3)" }}>{res.composite.before}</span>
                <Icon name={ar ? "arrowLeft" : "arrowRight"} size={16} style={{ color: "var(--text-3)" }} />
                <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: status === "scored" ? "var(--accent-strong)" : "var(--text-3)" }}>{status === "scored" ? res.composite.after : "—"}</span>
                {status === "scored" && <span className="badge badge-success" style={{ height: 20 }}>+{res.composite.after - res.composite.before}</span>}
              </div>
              <div className="faint" style={{ fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>{T("Recalculates when this score is finalized. Past scores aren't changed if the rubric changes later.", "يُعاد الاحتساب عند إنهاء هذه الدرجة. لا تتغيّر الدرجات السابقة إذا تغيّرت المعايير لاحقاً.")}</div>
            </div>
          </div>
        </div>
      )}

      {/* ===== RUBRIC ===== */}
      {tab === "rubric" && (
        <div className="grid">
          {lowConf && (
            <div className="warn-bar">
              <span className="wb-ico"><Icon name="alert" size={15} /></span>
              <span className="wb-text">{T("One or more criteria have low AI confidence and are flagged for mandatory human review.", "معيار أو أكثر بثقة منخفضة من الذكاء وموسوم لمراجعة بشرية إلزامية.")}</span>
            </div>
          )}
          {res.rubric.map((r, i) => {
            const diff = scores[i] - r.ai;
            const mustJustify = Math.abs(diff) > 2;
            return (
              <div key={i} className="card card-pad" style={{ borderInlineStart: r.conf === "low" ? "3px solid var(--danger)" : undefined }}>
                <div className="flex" style={{ alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 14.5, flex: 1 }}>{L(r.crit)}</h3>
                  <span className="faint mono" style={{ fontSize: 12 }}>{T("weight", "وزن")} {r.weight}%</span>
                  <ConfChip conf={r.conf} />
                </div>
                <div className="flex" style={{ gap: 8, alignItems: "center", marginBottom: 12, padding: "8px 11px", background: "var(--ai-soft)", borderRadius: "var(--r-sm)" }}>
                  <Icon name="sparkles" size={13} fill style={{ color: "var(--ai)", flex: "0 0 auto" }} />
                  <span style={{ fontSize: 12.5, color: "var(--text-2)", fontStyle: "italic" }}>{L(r.evidence)}</span>
                </div>
                <div className="flex" style={{ gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div className="flex" style={{ justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                      <span className="faint">{T("AI score", "درجة الذكاء")}: <span className="mono" style={{ fontWeight: 700, color: "var(--ai)" }}>{r.ai.toFixed(1)}</span></span>
                      <span className="faint">{T("Recruiter", "المُوظِّف")}: <span className="mono" style={{ fontWeight: 700, color: "var(--accent-strong)" }}>{scores[i].toFixed(1)}</span></span>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type="range" min="0" max="10" step="0.5" value={scores[i]} onChange={e => setScore(i, +e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }} />
                    </div>
                  </div>
                  <div className="flex" style={{ gap: 6, alignItems: "center" }}>
                    <button className="btn-icon btn-sm" onClick={() => setScore(i, scores[i] - 0.5)}><Icon name="arrowDown" size={14} /></button>
                    <input className="input mono" value={scores[i]} onChange={e => setScore(i, +e.target.value || 0)} style={{ width: 56, height: 32, textAlign: "center" }} />
                    <button className="btn-icon btn-sm" onClick={() => setScore(i, scores[i] + 0.5)}><Icon name="arrowUp" size={14} /></button>
                  </div>
                </div>
                {mustJustify && (
                  <div style={{ marginTop: 12 }}>
                    <div className="flex" style={{ alignItems: "center", gap: 6, marginBottom: 5 }}><Icon name="alert" size={13} style={{ color: "var(--warning)" }} /><span style={{ fontSize: 12, fontWeight: 600, color: "var(--warning)" }}>{T("Justification required", "يلزم تبرير")} ({diff > 0 ? "+" : ""}{diff.toFixed(1)} {T("vs AI", "مقابل الذكاء")})</span></div>
                    <input className="input" value={justify[i] || ""} onChange={e => setJustify(j => ({ ...j, [i]: e.target.value }))} placeholder={T("Why does your score differ from the AI's?", "لماذا تختلف درجتك عن درجة الذكاء؟")} style={{ height: 36, fontSize: 13 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== COHORT ===== */}
      {tab === "cohort" && (
        <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start" }}>
          <div className="card card-pad">
            <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 14, flex: 1 }}>{T("Score distribution", "توزيع الدرجات")}</h3>
              <span className="faint" style={{ fontSize: 12 }}>n = {res.cohort.n}</span>
            </div>
            <div className="faint" style={{ fontSize: 12, marginBottom: 18 }}>{T("All candidates who took this assessment for Senior Frontend Engineer", "جميع من أدّوا هذا التقييم لوظيفة مهندس واجهات أول")}</div>
            <VBars data={res.cohort.dist.map((v, i) => ({ v, l: `${i * 15 + 30}+`, color: i === res.cohort.me ? "var(--accent)" : "var(--surface-3)" }))} h={170} />
            <div className="flex" style={{ alignItems: "center", gap: 7, marginTop: 14, fontSize: 12.5 }}>
              <span style={{ width: 11, height: 11, borderRadius: 3, background: "var(--accent)" }} />{T("This candidate's band", "نطاق هذا المرشح")}
            </div>
            <div className="faint" style={{ fontSize: 11.5, marginTop: 10 }}>{T("For confidentiality, individual names and scores of other candidates are never shown.", "للحفاظ على السرية، لا تُعرض أسماء أو درجات المرشحين الآخرين.")}</div>
          </div>
          <div className="grid">
            <div className="card card-pad flex" style={{ gap: 26, justifyContent: "space-around" }}>
              <div style={{ textAlign: "center" }}><div className="mono" style={{ fontSize: 30, fontWeight: 600, color: "var(--accent-strong)" }}>{T("Top ", "أعلى ")}{100 - res.cohort.percentile}%</div><div className="faint" style={{ fontSize: 12, marginTop: 3 }}>{T("Percentile", "المئين")}</div></div>
              <div style={{ textAlign: "center" }}><div className="mono" style={{ fontSize: 30, fontWeight: 600 }}>{res.cohort.rank}<span style={{ fontSize: 16, color: "var(--text-3)" }}> / {res.cohort.n}</span></div><div className="faint" style={{ fontSize: 12, marginTop: 3 }}>{T("Rank", "الترتيب")}</div></div>
            </div>
            <div className="card card-pad">
              <h3 style={{ fontSize: 13.5, marginBottom: 12 }}>{T("Relative to cohort", "مقارنة بالمجموعة")}</h3>
              <div className="flex" style={{ alignItems: "center", gap: 9, marginBottom: 10 }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="arrowUp" size={14} /></span>
                <div style={{ fontSize: 13 }}><span className="faint">{T("Strongest", "الأقوى")}: </span><b>{L(res.cohort.strong)}</b></div>
              </div>
              <div className="flex" style={{ alignItems: "center", gap: 9 }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, background: "var(--warning-soft)", color: "var(--warning)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="arrowDown" size={14} /></span>
                <div style={{ fontSize: 13 }}><span className="faint">{T("Weakest", "الأضعف")}: </span><b>{L(res.cohort.weak)}</b></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== QUESTION-LEVEL ===== */}
      {tab === "questions" && (
        <div className="grid">
          {res.responses.map((r, i) => (
            <div key={i} className="card card-pad">
              <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <span className="mono" style={{ width: 24, height: 24, borderRadius: 6, background: "var(--surface-3)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 11.5 }}>{i + 1}</span>
                <QType t={r.t} sm />
                {r.objective && (r.correct
                  ? <span className="badge badge-success" style={{ height: 20 }}><Icon name="check" size={11} />{T("Correct", "صحيح")}</span>
                  : <span className="badge badge-danger" style={{ height: 20 }}><Icon name="x" size={11} />{T("Incorrect", "خاطئ")}</span>)}
                {r.subjective && <span className="badge badge-ai" style={{ height: 20 }}><Icon name="sparkles" size={10} fill />{T("AI graded", "تقييم ذكي")}</span>}
                <div className="spacer" style={{ flex: 1 }} />
                <span className="faint flex" style={{ alignItems: "center", gap: 4, fontSize: 11.5 }}><Icon name="clock" size={12} />{Math.floor(r.time / 60)}:{String(r.time % 60).padStart(2, "0")}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, marginBottom: 12 }}>{L(r.q)}</div>

              {/* objective answers */}
              {r.opts && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                  {r.opts.map((o, j) => {
                    const picked = r.t === "multi" ? (r.answer || []).includes(j) : r.answer === j;
                    const correct = r.t === "multi" ? (r.correctSet || []).includes(j) : r.correctIdx === j;
                    return (
                      <div key={j} className="flex" style={{ alignItems: "center", gap: 9, fontSize: 13, padding: "7px 10px", borderRadius: "var(--r-sm)", background: correct ? "var(--success-soft)" : picked ? "var(--danger-soft)" : "transparent", color: correct ? "var(--success)" : picked && !correct ? "var(--danger)" : "var(--text-2)", fontWeight: (correct || picked) ? 600 : 400 }}>
                        <Icon name={correct ? "check" : picked ? "x" : "circle"} size={13} />{L(o)}
                        {picked && <span className="faint" style={{ fontSize: 11, marginInlineStart: "auto" }}>{T("candidate's answer", "إجابة المرشح")}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
              {r.t === "boolean" && <div className="flex" style={{ gap: 16, fontSize: 13, marginBottom: 8 }}><span style={{ color: r.correct ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>{T("Answered", "أجاب")}: {r.answer ? T("True", "صح") : T("False", "خطأ")}</span>{!r.correct && <span className="faint">{T("Correct", "الصحيح")}: {r.correctVal ? T("True", "صح") : T("False", "خطأ")}</span>}</div>}
              {r.t === "likert" && <div className="mono" style={{ fontSize: 13, marginBottom: 8 }}>{T("Selected", "اختار")}: {r.answer} / {r.scale}</div>}

              {/* subjective response + AI scoring */}
              {r.subjective && (
                <React.Fragment>
                  <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-sm)", padding: 13, fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap", marginBottom: 12, fontFamily: r.t === "code" ? '"IBM Plex Mono", ui-monospace, monospace' : undefined }} dir={r.t === "code" ? "ltr" : undefined}>{r.answer}</div>
                  <div className="flex" style={{ gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    {res.rubric.slice(0, 2).map((rc, k) => (
                      <span key={k} className="badge badge-neutral" style={{ height: 22 }}><Icon name="sparkles" size={10} fill style={{ color: "var(--ai)" }} />{L(rc.crit)}: <b className="mono" style={{ marginInlineStart: 3 }}>{rc.ai.toFixed(1)}</b></span>
                    ))}
                  </div>
                </React.Fragment>
              )}

              {/* comment */}
              <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                {comments[i] != null ? (
                  <div className="flex" style={{ gap: 8, alignItems: "flex-start" }}>
                    <input className="input" value={comments[i]} onChange={e => setComments(c => ({ ...c, [i]: e.target.value }))} placeholder={T("Comment for the hiring team…", "تعليق لفريق التوظيف…")} style={{ height: 34, fontSize: 13 }} />
                    <button className="btn-icon btn-sm" onClick={() => setComments(c => { const n = { ...c }; delete n[i]; return n; })}><Icon name="x" size={15} /></button>
                  </div>
                ) : (
                  <button className="muted flex" style={{ alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }} onClick={() => setComments(c => ({ ...c, [i]: "" }))}><Icon name="message" size={13} />{T("Add comment", "إضافة تعليق")}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== TRUST / SUBMISSION INTEGRITY (12.6) ===== */}
      {tab === "trust" && (
        <div className="grid">
          <div className="card card-pad" style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "var(--surface-2)", boxShadow: "none" }}>
            <Icon name="shield" size={16} style={{ color: "var(--text-2)", flex: "0 0 auto", marginTop: 1 }} />
            <span className="muted" style={{ fontSize: 12.5, lineHeight: 1.55 }}>{T("These are signals to aid your judgement — not accusations or automatic decisions. The candidate was informed at the start that these events are logged.", "هذه إشارات لمساعدة حكمك — وليست اتهامات أو قرارات تلقائية. أُبلغ المرشح في البداية بأن هذه الأحداث تُسجّل.")}</span>
          </div>

          {/* flagged patterns */}
          {activeFlags.length > 0 && activeFlags.map((f, i) => (
            <div key={i} className="card card-pad" style={{ borderInlineStart: "3px solid var(--warning)", background: "color-mix(in oklch, var(--warning) 6%, var(--surface))" }}>
              <div className="flex" style={{ alignItems: "center", gap: 10 }}>
                <Icon name="alert" size={16} style={{ color: "var(--warning)", flex: "0 0 auto" }} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{L(f.label)}</div></div>
                <button className="btn btn-subtle btn-sm" onClick={() => setTrustDetail({ title: T("Why was this flagged?", "لماذا وُسم هذا؟"), body: L(f.why) })}>{T("Why?", "لماذا؟")}</button>
                <button className="btn btn-subtle btn-sm" onClick={() => setDismissedFlags(d => ({ ...d, [f.id]: true }))}><Icon name="check" size={13} />{T("Dismiss", "تجاهل")}</button>
              </div>
            </div>
          ))}

          {/* signal grid */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
            <TrustCard icon="check" good label={T("Honor code", "ميثاق الشرف")} value={T("Accepted", "مقبول")} sub={L(tr.honorAt)} onInfo={() => setTrustDetail({ title: T("Honor code", "ميثاق الشرف"), body: L(tr.honorText) + "\n\n" + T("Accepted at: ", "قُبل في: ") + L(tr.honorAt) })} />
            <TrustCard icon="panel" label={T("Tab switches", "تبديل التبويبات")} value={tr.tabSwitches} sub={T("during the test", "أثناء الاختبار")} onInfo={() => setTrustDetail({ title: T("Tab-switch events", "أحداث تبديل التبويبات"), rows: tr.tabDetail.map(d => `${d.at} · ${d.dur} · ${L(d.note)}`) })} />
            <TrustCard icon="copy" label={T("Copy / paste", "نسخ / لصق")} value={`${tr.copyEvents} / ${tr.pasteEvents}`} sub={T("copy / paste events", "أحداث نسخ / لصق")} warn={tr.pasteDetail.some(p => p.flagged)} onInfo={() => setTrustDetail({ title: T("Copy-paste events", "أحداث النسخ واللصق"), rows: tr.pasteDetail.map(d => `${d.at} · ${d.len} ${T("chars", "حرف")}${d.flagged ? " ⚠" : ""} · ${L(d.note)}`) })} />
            <TrustCard icon="clock" label={T("Time vs median", "الوقت مقابل الوسيط")} value={(tr.timeVsMedian > 0 ? "+" : "") + tr.timeVsMedian + "%"} sub={T(`median ${tr.medianMin} min`, `الوسيط ${tr.medianMin} د`)} onInfo={() => setTrustDetail({ title: T("Completion time", "زمن الإكمال"), body: T(`Completed ${Math.abs(tr.timeVsMedian)}% ${tr.timeVsMedian < 0 ? "faster" : "slower"} than the median candidate (${tr.medianMin} min). Submissions more than 50% faster than median are flagged.`, `أُكمل بنسبة ${Math.abs(tr.timeVsMedian)}% ${tr.timeVsMedian < 0 ? "أسرع" : "أبطأ"} من الوسيط (${tr.medianMin} د). تُوسم التسليمات الأسرع من الوسيط بأكثر من 50٪.`) })} />
            <TrustCard icon="globe" good={tr.deviceConsistent} label={T("Device consistency", "اتساق الجهاز")} value={tr.deviceConsistent ? T("Consistent", "متسق") : T("Multiple", "متعدد")} sub={T(`${tr.devices} device, 1 IP`, `${tr.devices} جهاز، IP واحد`)} onInfo={() => setTrustDetail({ title: T("Device consistency", "اتساق الجهاز"), body: T("One device and one IP address were used throughout. Multiple devices or IPs would be flagged for review.", "استُخدم جهاز واحد وعنوان IP واحد طوال الوقت. تُوسم الأجهزة أو العناوين المتعددة للمراجعة.") })} />
            <TrustCard icon="flag" good={activeFlags.length === 0} warn={activeFlags.length > 0} label={T("Pattern flags", "تنبيهات النمط")} value={activeFlags.length} sub={activeFlags.length ? T("needs review", "تحتاج مراجعة") : T("none", "لا شيء")} />
          </div>
        </div>
      )}

      {/* calc modal */}
      {calc && (
        <div className="scrim" onClick={() => setCalc(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{T("How composite AI Match is calculated", "كيف تُحتسب مطابقة الذكاء المركّبة")}</div><button className="btn-icon btn-sm" onClick={() => setCalc(false)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body" style={{ fontSize: 13.5, lineHeight: 1.7 }}>
              <p style={{ marginBottom: 12 }}>{T("The composite blends every received signal, each weighted:", "تمزج النتيجة المركّبة كل إشارة مستلمة بوزنها:")}</p>
              {[["CV match", "تطابق السيرة", 25], ["Pre-screen", "الفرز المبدئي", 15], ["Assessment", "التقييم", 30], ["Video interview", "مقابلة الفيديو", 15], ["Human evaluation", "التقييم البشري", 15]].map((x, i) => (
                <div key={i} className="flex" style={{ justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}><span>{T(x[0], x[1])}</span><span className="mono" style={{ fontWeight: 600 }}>{x[2]}%</span></div>
              ))}
              <p className="faint" style={{ fontSize: 12, marginTop: 12 }}>{T("Only received signals are normalized into the score; pending signals are excluded until they arrive.", "تُطبَّع الإشارات المستلمة فقط ضمن الدرجة؛ وتُستبعد الإشارات المعلّقة حتى وصولها.")}</p>
            </div>
          </div>
        </div>
      )}

      {/* reject modal */}
      {rejectOpen && (
        <div className="scrim" onClick={() => setRejectOpen(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{T("Reject submission with feedback", "رفض التسليم مع ملاحظات")}</div><button className="btn-icon btn-sm" onClick={() => setRejectOpen(false)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body"><div className="field"><label>{T("Feedback (shared with the team)", "الملاحظات (تُشارَك مع الفريق)")}</label><textarea className="textarea" rows={4} placeholder={T("Reason for rejection…", "سبب الرفض…")} /></div></div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={() => setRejectOpen(false)}>{T("Cancel", "إلغاء")}</button><button className="btn btn-danger btn-sm" onClick={() => { setRejectOpen(false); setStatus("scored"); toast(T("Submission rejected", "تم رفض التسليم")); }}>{T("Reject submission", "رفض التسليم")}</button></div>
          </div>
        </div>
      )}

      {/* trust detail modal */}
      {trustDetail && (
        <div className="scrim" onClick={() => setTrustDetail(null)}>
          <div className="modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{trustDetail.title}</div><button className="btn-icon btn-sm" onClick={() => setTrustDetail(null)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body">
              {trustDetail.body && <p style={{ fontSize: 13.5, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{trustDetail.body}</p>}
              {trustDetail.rows && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{trustDetail.rows.map((r, i) => <div key={i} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 13, padding: "8px 11px", background: "var(--surface-2)", borderRadius: "var(--r-sm)" }}><span className="mono faint" style={{ fontSize: 12 }}>{r}</span></div>)}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Bq({ label, value, color }) {
  return <div><div className="mono" style={{ fontSize: 17, fontWeight: 600, color: color || "var(--text)" }}>{value}</div><div className="faint" style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{label}</div></div>;
}

function TrustCard({ icon, label, value, sub, good, warn, onInfo }) {
  const col = warn ? "var(--warning)" : good ? "var(--success)" : "var(--text-2)";
  return (
    <div className="card card-pad" style={{ padding: 16 }}>
      <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: `color-mix(in oklch, ${col} 14%, var(--surface))`, color: col, display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name={icon} size={15} /></span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", flex: 1 }}>{label}</span>
        {onInfo && <button className="btn-icon btn-sm" onClick={onInfo} title="What does this mean?"><Icon name="alert" size={13} style={{ color: "var(--text-3)" }} /></button>}
      </div>
      <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: warn ? "var(--warning)" : "var(--text)" }}>{value}</div>
      {sub && <div className="faint" style={{ fontSize: 11.5, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export { AssessmentResultsReview };
