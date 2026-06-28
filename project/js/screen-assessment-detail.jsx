/* Connect AI — Assessment detail, builder, AI-generate, send modal (Epic 12.1/12.2) */

/* ============== DETAIL ============== */
function AssessmentDetail({ a, go, toast, onBack, onSend, onEdit, onCandidate, onResults, sendModal }) {
  const { L, lang } = useApp();
  const { TYPES, DOMAINS, DIFF, QTYPES, STATUS } = window.ASSESS;
  const ar = lang === "ar";
  const [tab, setTab] = React.useState("overview");
  const [preview, setPreview] = React.useState(false);
  const tabs = [
    { id: "overview", label: ar ? "نظرة عامة" : "Overview" },
    { id: "questions", label: (ar ? "الأسئلة" : "Questions") + " (" + a.qCount + ")" },
    { id: "versions", label: (ar ? "الإصدارات" : "Versions") + " (" + a.versions.length + ")" },
    { id: "results", label: ar ? "النتائج" : "Results" },
  ];
  const mixSegs = Object.keys(a.typeMix).map((k, i) => ({
    label: L(QTYPES[k]), value: a.typeMix[k],
    color: ["var(--accent)", "var(--ai)", "var(--purple)", "var(--info)", "var(--warning)", "var(--success)"][i % 6],
  }));

  return (
    <div className="page">
      <div className="crumbs" style={{ marginBottom: 12 }}>
        <a onClick={onBack}>{ar ? "مكتبة التقييمات" : "Assessment Library"}</a>
        <Icon name={ar ? "chevLeft" : "chevRight"} size={13} /><span style={{ color: "var(--text-2)" }}>{L(a.title)}</span>
      </div>

      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="flex" style={{ alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="flex" style={{ gap: 8, marginBottom: 9, flexWrap: "wrap" }}>
              <span className="badge" style={{ background: `color-mix(in oklch, ${TYPES[a.type].color} 14%, var(--surface))`, color: TYPES[a.type].color }}>{L(TYPES[a.type])}</span>
              <span className="badge badge-neutral">{L(DOMAINS[a.domain])}</span>
              {a.status === "draft"
                ? <span className="badge badge-warning">{ar ? "مسودة" : "Draft"}</span>
                : <span className="badge badge-success"><span className="b-dot" />{ar ? "منشور" : "Published"}</span>}
              <span className="badge badge-neutral mono">{a.version}</span>
              {a.source === "ai" && <span className="badge badge-ai"><Icon name="sparkles" size={11} fill />{ar ? "مولّد بالذكاء" : "AI-generated"}</span>}
            </div>
            <h1 style={{ fontSize: 24, letterSpacing: "-.02em" }}>{L(a.title)}</h1>
          </div>
          <div className="flex" style={{ gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setPreview(true)}><Icon name="eye" size={16} />{ar ? "معاينة" : "Preview"}</button>
            <button className="btn btn-ghost" onClick={onCandidate}><Icon name="users" size={16} />{ar ? "تجربة المرشح" : "Candidate view"}</button>
            <button className="btn btn-ghost" onClick={onEdit}><Icon name="edit" size={16} />{ar ? "تحرير" : "Edit"}</button>
            {a.status !== "draft" && <button className="btn btn-primary" onClick={onSend}><Icon name="send" size={16} />{ar ? "إرسال" : "Send"}</button>}
          </div>
        </div>
      </div>

      <div className="ptabs" style={{ marginBottom: "var(--gap)" }}>
        {tabs.map(x => <button key={x.id} className={tab === x.id ? "on" : ""} onClick={() => setTab(x.id)}>{x.label}</button>)}
      </div>

      {tab === "overview" && (
        <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
          <div className="grid">
            <div className="card">
              <div className="card-head"><h3>{ar ? "التفاصيل" : "Details"}</h3></div>
              <div className="card-pad" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 28px" }}>
                <KV label={ar ? "المدة" : "Time limit"} value={a.duration + (ar ? " دقيقة" : " minutes")} />
                <KV label={ar ? "عدد الأسئلة" : "Questions"} value={a.qCount} />
                <KV label={ar ? "الصعوبة" : "Difficulty"} value={L(DIFF[a.difficulty])} color={DIFF[a.difficulty].color} />
                <KV label={ar ? "درجة النجاح" : "Pass mark"} value={a.passMark ? a.passMark + "%" : (ar ? "لا يوجد" : "None")} />
                <KV label={ar ? "المصدر" : "Source"} value={a.source === "default" ? (ar ? "افتراضي" : "Default") : a.source === "ai" ? (ar ? "ذكاء اصطناعي" : "AI") : (ar ? "مخصص" : "Custom")} />
                <KV label={ar ? "آخر تحديث" : "Last updated"} value={L(a.updated)} />
              </div>
            </div>
            {a.instr && (
              <div className="card">
                <div className="card-head"><h3>{ar ? "التعليمات للمرشح" : "Candidate instructions"}</h3></div>
                <div className="card-pad" style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-2)" }}>{L(a.instr)}</div>
              </div>
            )}
          </div>
          <div className="grid">
            <div className="card">
              <div className="card-head"><h3>{ar ? "تكوين الأسئلة" : "Question mix"}</h3></div>
              <div className="card-pad flex" style={{ gap: 18, alignItems: "center" }}>
                <Donut segments={mixSegs} size={108} stroke={16}
                  center={<div><div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{a.qCount}</div><div className="faint" style={{ fontSize: 10 }}>{ar ? "سؤال" : "items"}</div></div>} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                  {mixSegs.map((s, i) => (
                    <div key={i} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 12.5 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flex: "0 0 auto" }} />
                      <span style={{ flex: 1 }}>{s.label}</span><span className="mono faint">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {a.status !== "draft" && (
              <div className="card">
                <div className="card-head"><h3>{ar ? "إحصاءات الاستخدام" : "Usage stats"}</h3></div>
                <div className="card-pad flex" style={{ gap: 26, flexWrap: "wrap" }}>
                  <BigStat value={a.usage} label={ar ? "مرشح كُلّف" : "Candidates assigned"} />
                  {a.avgScore != null && <BigStat value={a.avgScore + "%"} label={ar ? "متوسط الدرجة" : "Average score"} color="var(--purple)" />}
                  {a.passMark && a.avgScore != null && <BigStat value={Math.round((a.avgScore / a.passMark) * 58) + "%"} label={ar ? "نسبة النجاح" : "Pass rate"} color="var(--success)" />}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "questions" && <QuestionList a={a} />}
      {tab === "versions" && <VersionList a={a} toast={toast} />}
      {tab === "results" && (
        <div className="card card-pad" style={{ textAlign: "center", padding: 44 }}>
          <Icon name="trending" size={28} style={{ color: "var(--text-3)" }} />
          <div style={{ marginTop: 10, fontWeight: 600 }}>{a.usage > 0 ? (ar ? `${a.usage} نتيجة مسجّلة` : `${a.usage} results recorded`) : (ar ? "لا نتائج بعد" : "No results yet")}</div>
          {a.usage > 0 && <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={onResults}><Icon name="eye" size={14} />{ar ? "فتح مراجعة النتائج" : "Open results review"}</button>}
        </div>
      )}

      {preview && <PreviewModal a={a} onClose={() => setPreview(false)} />}
      {sendModal}
    </div>
  );
}

function KV({ label, value, color }) {
  return <div><div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 3 }}>{label}</div><div style={{ fontSize: 14, fontWeight: 500, color: color || "var(--text)" }}>{value}</div></div>;
}
function BigStat({ value, label, color }) {
  return <div><div className="mono" style={{ fontSize: 26, fontWeight: 600, color: color || "var(--text)" }}>{value}</div><div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginTop: 2 }}>{label}</div></div>;
}

/* ============== QUESTION LIST ============== */
function QType({ t, sm }) {
  const { L } = useApp();
  const q = window.ASSESS.QTYPES[t];
  return <span className="badge badge-neutral" style={{ height: sm ? 19 : 22, gap: 4 }}><Icon name={q.icon} size={sm ? 10 : 12} />{L(q)}</span>;
}

function QuestionList({ a }) {
  const { L, lang } = useApp();
  const ar = lang === "ar";
  return (
    <div className="grid">
      {a.questions.map((qq, i) => (
        <div key={i} className="card card-pad">
          <div className="flex" style={{ alignItems: "flex-start", gap: 12 }}>
            <span className="mono" style={{ width: 26, height: 26, borderRadius: 7, background: "var(--surface-3)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12, flex: "0 0 auto" }}>{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex" style={{ gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <QType t={qq.t} sm />
                {qq.lang && <span className="badge badge-accent" style={{ height: 19 }}>{qq.lang}</span>}
                {qq.pts > 0 && <span className="faint mono" style={{ fontSize: 11.5 }}>{qq.pts} {ar ? "نقطة" : "pts"}</span>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, marginBottom: qq.opts ? 10 : 0 }}>{L(qq.q)}</div>
              {qq.opts && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {qq.opts.map((o, j) => (
                    <div key={j} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 13, color: o.correct ? "var(--success)" : "var(--text-2)", fontWeight: o.correct ? 600 : 400 }}>
                      <span style={{ width: 15, height: 15, borderRadius: qq.t === "multi" ? 4 : "50%", border: "1.5px solid " + (o.correct ? "var(--success)" : "var(--border-strong)"), display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                        {o.correct && <Icon name="check" size={10} style={{ color: "var(--success)" }} />}
                      </span>{L(o)}
                    </div>
                  ))}
                </div>
              )}
              {qq.t === "boolean" && <div className="faint" style={{ fontSize: 12.5, marginTop: 4 }}>{ar ? "الإجابة الصحيحة: " : "Correct: "}{qq.answer ? (ar ? "صح" : "True") : (ar ? "خطأ" : "False")}</div>}
              {qq.t === "likert" && <div className="flex" style={{ gap: 6, marginTop: 4 }}>{[1, 2, 3, 4, 5].map(n => <span key={n} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border-strong)", display: "grid", placeItems: "center", fontSize: 11, color: "var(--text-3)" }}>{n}</span>)}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============== VERSION LIST ============== */
function VersionList({ a, toast }) {
  const { L, lang } = useApp();
  const ar = lang === "ar";
  return (
    <div className="card">
      <div className="card-head"><h3>{ar ? "سجل الإصدارات" : "Version history"}</h3><div className="spacer" style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 12 }}>{ar ? "تحرير نسخة منشورة يُنشئ إصداراً جديداً" : "Editing a published version creates a new one"}</span></div>
      <table className="tbl">
        <thead><tr>
          <th>{ar ? "الإصدار" : "Version"}</th><th>{ar ? "التاريخ" : "Date"}</th><th>{ar ? "الحالة" : "Status"}</th>
          <th style={{ textAlign: "end" }}>{ar ? "الاستخدام" : "Usage"}</th><th></th>
        </tr></thead>
        <tbody>
          {a.versions.slice().reverse().map((v, i) => (
            <tr key={i} style={{ cursor: "default" }}>
              <td><span className="mono" style={{ fontWeight: 700 }}>{v.v}</span></td>
              <td className="faint">{L(v.date)}</td>
              <td>{v.status === "current"
                ? <span className="badge badge-success"><span className="b-dot" />{ar ? "حالي" : "Current"}</span>
                : <span className="badge badge-neutral">{ar ? "متوقف" : "Deprecated"}</span>}</td>
              <td style={{ textAlign: "end" }}><span className="mono">{v.usage}</span> <span className="faint" style={{ fontSize: 11.5 }}>{ar ? "مرشح" : "candidates"}</span></td>
              <td style={{ textAlign: "end" }}>
                {v.status === "current"
                  ? <span className="faint" style={{ fontSize: 12 }}>{ar ? "قابل للتعيين" : "Assignable"}</span>
                  : <button className="btn btn-subtle btn-sm" onClick={() => toast(ar ? "عرض النتائج التاريخية" : "Viewing historical results")}><Icon name="history" size={13} />{ar ? "النتائج" : "Results"}</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="card-pad" style={{ borderTop: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "flex-start", background: "var(--surface-2)" }}>
        <Icon name="alert" size={15} style={{ color: "var(--text-3)", flex: "0 0 auto", marginTop: 1 }} />
        <span className="faint" style={{ fontSize: 12.5, lineHeight: 1.55 }}>{ar ? "الجلسات الجارية تستخدم دائماً الإصدار الذي أُرسل به. الإصدارات المتوقفة لا يمكن تعيينها لمرشحين جدد لكنها تبقى متاحة للنتائج التاريخية." : "In-progress sessions always use the version they were sent. Deprecated versions can't be assigned to new candidates but remain accessible for historical results."}</span>
      </div>
    </div>
  );
}

/* ============== PREVIEW MODAL (candidate-facing) ============== */
function PreviewModal({ a, onClose }) {
  const { L, lang } = useApp();
  const ar = lang === "ar";
  const [idx, setIdx] = React.useState(0);
  const q = a.questions[idx];
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 720, width: "100%" }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span className="badge badge-ai" style={{ height: 20 }}><Icon name="eye" size={11} />{ar ? "معاينة المرشح" : "Candidate preview"}</span>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 15 }}>{L(a.title)}</div></div>
          <button className="btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17} /></button>
        </div>
        <div className="modal-body" style={{ background: "var(--surface-2)" }}>
          <div className="flex" style={{ justifyContent: "space-between", marginBottom: 14, fontSize: 12.5, color: "var(--text-2)" }}>
            <span>{ar ? "سؤال" : "Question"} {idx + 1} / {a.questions.length}</span>
            <span className="flex" style={{ alignItems: "center", gap: 5 }}><Icon name="clock" size={13} />{a.duration}:00</span>
          </div>
          <div style={{ height: 4, borderRadius: 20, background: "var(--surface-3)", marginBottom: 20 }}>
            <div style={{ height: "100%", width: ((idx + 1) / a.questions.length * 100) + "%", background: "var(--accent)", borderRadius: 20, transition: "width .3s" }} />
          </div>
          <div className="card card-pad">
            <div className="flex" style={{ gap: 8, marginBottom: 12 }}><QType t={q.t} />{q.pts > 0 && <span className="faint mono" style={{ fontSize: 12 }}>{q.pts} {ar ? "نقطة" : "pts"}</span>}</div>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5, marginBottom: 16 }}>{L(q.q)}</div>
            {q.opts && q.opts.map((o, j) => (
              <label key={j} className="flex" style={{ alignItems: "center", gap: 10, padding: "11px 13px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", marginBottom: 8, cursor: "pointer" }}>
                <span style={{ width: 17, height: 17, borderRadius: q.t === "multi" ? 4 : "50%", border: "1.5px solid var(--border-strong)", flex: "0 0 auto" }} />
                <span style={{ fontSize: 14 }}>{L(o)}</span>
              </label>
            ))}
            {q.t === "boolean" && [{ en: "True", ar: "صح" }, { en: "False", ar: "خطأ" }].map((o, j) => (
              <label key={j} className="flex" style={{ alignItems: "center", gap: 10, padding: "11px 13px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", marginBottom: 8, cursor: "pointer" }}>
                <span style={{ width: 17, height: 17, borderRadius: "50%", border: "1.5px solid var(--border-strong)", flex: "0 0 auto" }} /><span style={{ fontSize: 14 }}>{L(o)}</span>
              </label>
            ))}
            {(q.t === "short" || q.t === "long") && <textarea className="textarea" rows={q.t === "long" ? 6 : 3} placeholder={ar ? "اكتب إجابتك…" : "Type your answer…"} />}
            {q.t === "code" && <div style={{ background: "var(--surface-3)", borderRadius: "var(--r-sm)", padding: 14, fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 13, color: "var(--text-2)" }}>{"function solution(input) {\n  // " + (ar ? "اكتب الحل هنا" : "write your solution") + "\n}"}</div>}
            {q.t === "file" && <div style={{ border: "2px dashed var(--border-strong)", borderRadius: "var(--r-md)", padding: 28, textAlign: "center", color: "var(--text-3)" }}><Icon name="upload" size={22} /><div style={{ marginTop: 8, fontSize: 13 }}>{ar ? "اسحب ملفاً أو انقر للرفع" : "Drag a file or click to upload"}</div></div>}
            {q.t === "likert" && (
              <div className="flex" style={{ justifyContent: "space-between", gap: 8 }}>
                {[1, 2, 3, 4, 5].map(n => <button key={n} style={{ flex: 1, padding: "14px 0", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", fontWeight: 600 }}>{n}</button>)}
              </div>
            )}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost btn-sm" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}><Icon name={ar ? "chevRight" : "chevLeft"} size={15} />{ar ? "السابق" : "Back"}</button>
          <div className="spacer" style={{ flex: 1 }} />
          {idx < a.questions.length - 1
            ? <button className="btn btn-primary btn-sm" onClick={() => setIdx(i => i + 1)}>{ar ? "التالي" : "Next"}<Icon name={ar ? "chevLeft" : "chevRight"} size={15} /></button>
            : <button className="btn btn-primary btn-sm" onClick={onClose}>{ar ? "إنهاء المعاينة" : "Finish preview"}</button>}
        </div>
      </div>
    </div>
  );
}

window.AssessmentDetail = AssessmentDetail;
window.QType = QType;
window.PreviewModal = PreviewModal;
