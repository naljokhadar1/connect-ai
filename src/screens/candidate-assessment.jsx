import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui';
import { Icon } from '../lib/icons';

/* Connect AI — Candidate test-taking experience (Epic 12.3)
   Full-screen flow, account-free, bilingual (EN/AR RTL). Launched from assessment detail. */

function CandidateAssessment({ a, onClose }) {
  const appCtx = useApp();
  const L0 = appCtx.L;
  // candidate picks their own language; default to assessment primary
  const [clang, setClang] = React.useState(a.qLang || "en");
  const ar = clang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const Lq = (o) => (o ? (o[clang] ?? o.en) : "");

  const navMode = a.navMode || "free";       // forward | section | free
  const timerMode = a.timerMode || "soft";   // hard | soft
  const total = a.questions.length;

  const [stage, setStage] = React.useState("email"); // email | landing | resume | test | review | submitted | expired
  const [accepted, setAccepted] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [flags, setFlags] = React.useState({});
  const [saveState, setSaveState] = React.useState("saved"); // saving | saved
  const [secs, setSecs] = React.useState(a.duration * 60);
  const [offline, setOffline] = React.useState(false);
  const [confId] = React.useState("CA-" + Math.random().toString(36).slice(2, 8).toUpperCase());
  const [submittedAt, setSubmittedAt] = React.useState(null);
  const [acceptedAt, setAcceptedAt] = React.useState(null);
  const startRef = React.useRef(null);

  // timer
  React.useEffect(() => {
    if (stage !== "test") return;
    if (offline && timerMode === "soft") return; // soft timer pauses offline
    if (secs <= 0) return;
    const id = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [stage, secs, offline, timerMode]);

  // autosave indicator
  const touch = () => {
    setSaveState("saving");
    clearTimeout(touch._t);
    touch._t = setTimeout(() => setSaveState("saved"), 900);
  };
  const setAns = (v) => { setAnswers(p => ({ ...p, [idx]: v })); touch(); };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const low = secs <= 300;
  const answered = Object.keys(answers).filter(k => answers[k] != null && answers[k] !== "").length;
  const q = a.questions[idx];

  const startTest = () => { setAcceptedAt(new Date()); startRef.current = Date.now(); setStage("test"); };
  const submit = () => { setSubmittedAt(new Date()); setStage("submitted"); };

  const dir = ar ? "rtl" : "ltr";

  // ---- chrome wrapper ----
  const Shell = ({ children, showHeader }) => (
    <div dir={dir} style={{ position: "fixed", inset: 0, zIndex: 300, background: "var(--canvas)", display: "flex", flexDirection: "column", overflow: "auto", fontFamily: ar ? '"IBM Plex Sans Arabic", sans-serif' : undefined }}>
      {/* demo toolbar */}
      <div style={{ position: "absolute", insetInlineEnd: 14, top: 12, zIndex: 5, display: "flex", gap: 8 }}>
        <button className="btn btn-subtle btn-sm" onClick={() => setClang(c => c === "ar" ? "en" : "ar")} title="Demo: toggle language"><Icon name="globe" size={14} />{clang === "ar" ? "EN" : "ع"}</button>
        <button className="btn-icon btn-sm" onClick={onClose} title="Close preview" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}><Icon name="x" size={16} /></button>
      </div>
      {showHeader && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 22px", height: 60, background: "var(--surface)", borderBottom: "1px solid var(--border)", flex: "0 0 auto", position: "sticky", top: 0, zIndex: 4 }}>
          <div className="flex" style={{ alignItems: "center", gap: 9 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(140deg, var(--accent), color-mix(in oklch, var(--accent) 55%, var(--ai)))", display: "grid", placeItems: "center", color: "#fff" }}><Icon name="sparkles" size={15} fill /></span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Connect <b style={{ color: "var(--accent)" }}>AI</b></span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{Lq(a.title)}</div></div>
          {saveState && <span className="faint flex" style={{ alignItems: "center", gap: 5, fontSize: 12 }}>{saveState === "saving" ? <><span className="ai-cursor" />{T("Saving…", "جارٍ الحفظ…")}</> : <><Icon name="check" size={13} style={{ color: "var(--success)" }} />{T("Saved", "تم الحفظ")}</>}</span>}
          {a.duration > 0 && stage === "test" && (
            <span className="mono flex" style={{ alignItems: "center", gap: 6, fontWeight: 700, fontSize: 15, padding: "5px 11px", borderRadius: 8, background: low ? "var(--warning-soft)" : "var(--surface-3)", color: low ? "var(--warning)" : "var(--text)" }}>
              <Icon name="clock" size={15} />{fmt(secs)}
            </span>
          )}
        </div>
      )}
      {offline && stage === "test" && (
        <div style={{ background: "var(--warning-soft)", borderBottom: "1px solid color-mix(in oklch, var(--warning) 30%, transparent)", padding: "9px 22px", display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--warning)", fontWeight: 600 }}>
          <Icon name="alert" size={15} />{T("Connection lost — your test is paused. Answers are safe.", "انقطع الاتصال — توقف الاختبار مؤقتاً. إجاباتك محفوظة.")}
          {timerMode === "hard" && <span style={{ fontWeight: 400 }}>{T("(timer keeps running)", "(المؤقّت مستمر)")}</span>}
          <button className="btn btn-subtle btn-sm" style={{ marginInlineStart: "auto" }} onClick={() => setOffline(false)}><Icon name="refresh" size={13} />{T("Reconnect", "إعادة الاتصال")}</button>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );

  /* ===== 12.3.1 — INVITATION EMAIL ===== */
  if (stage === "email") {
    return (
      <Shell>
        <div style={{ maxWidth: 600, margin: "auto", padding: 24, width: "100%" }}>
          <div className="faint" style={{ fontSize: 12, marginBottom: 10, textAlign: "center" }}>{T("Invitation email preview", "معاينة بريد الدعوة")}</div>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
              <div style={{ fontSize: 12.5, color: "var(--text-2)" }}>{T("From", "من")}: <b>Connect AI Talent</b> &lt;careers@connect-ai.com&gt;</div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)" }}>{T("To", "إلى")}: ahmed.hassan@email.com</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{T(`Assessment invitation — ${L0(a.title)}`, `دعوة لتقييم — ${a.title.ar || a.title.en}`)}</div>
            </div>
            <div style={{ padding: 22, fontSize: 13.5, lineHeight: 1.7, color: "var(--text)" }}>
              <p style={{ marginBottom: 12 }}>{T("Hi Ahmed,", "مرحباً أحمد،")}</p>
              <p style={{ marginBottom: 14 }}>{T(`You've been invited to complete an assessment for the Senior Frontend Engineer role at Connect AI.`, `لقد دُعيت لإكمال تقييم لوظيفة مهندس واجهات أول في Connect AI.`)}</p>
              <div className="card" style={{ background: "var(--surface-2)", boxShadow: "none", padding: 14, marginBottom: 16 }}>
                <Field2 label={T("Role", "الوظيفة")} value={T("Senior Frontend Engineer", "مهندس واجهات أول")} />
                <Field2 label={T("Assessment", "التقييم")} value={Lq(a.title)} />
                <Field2 label={T("Type", "النوع")} value={Lq(window.ASSESS.TYPES[a.type])} />
                <Field2 label={T("Estimated duration", "المدة التقديرية")} value={a.duration + T(" minutes", " دقيقة")} />
                <Field2 label={T("Deadline", "الموعد النهائي")} value={T("June 29, 2026", "29 يونيو 2026")} last />
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setStage("landing")}>{T("Start assessment", "ابدأ التقييم")}</button>
              <p className="faint" style={{ fontSize: 11.5, marginTop: 12, textAlign: "center" }}>{T("This is a unique single-use link valid until the deadline.", "هذا رابط فريد للاستخدام مرة واحدة وصالح حتى الموعد النهائي.")}</p>
            </div>
          </div>
          <div className="flex" style={{ justifyContent: "center", gap: 8, marginTop: 14 }}>
            <button className="btn btn-subtle btn-sm" onClick={() => setStage("expired")}>{T("Demo: expired link", "تجربة: رابط منتهٍ")}</button>
            <button className="btn btn-subtle btn-sm" onClick={() => { setAnswers({ 0: a.questions[0].opts ? 1 : "Sample" }); setStage("resume"); }}>{T("Demo: resume", "تجربة: استئناف")}</button>
          </div>
        </div>
      </Shell>
    );
  }

  /* ===== expired link ===== */
  if (stage === "expired") {
    return (
      <Shell>
        <div style={{ maxWidth: 460, margin: "auto", padding: 24, textAlign: "center" }}>
          <span style={{ width: 52, height: 52, borderRadius: 14, background: "var(--danger-soft)", color: "var(--danger)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}><Icon name="clock" size={26} /></span>
          <h2 style={{ fontSize: 20 }}>{T("This assessment has expired", "انتهت صلاحية هذا التقييم")}</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{T("The deadline for this assessment has passed. If you believe this is a mistake, please contact the recruiter.", "لقد انقضى الموعد النهائي لهذا التقييم. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المسؤول.")}</p>
          <div className="card card-pad" style={{ marginTop: 18, textAlign: "start" }}>
            <Field2 label={T("Recruiter", "المسؤول")} value="Layla Al-Fayez" />
            <Field2 label={T("Email", "البريد")} value="l.alfayez@connect-ai.com" last />
          </div>
        </div>
      </Shell>
    );
  }

  /* ===== 12.3.2/12.3.3 — LANDING + HONOR CODE ===== */
  if (stage === "landing") {
    const allowed = ar
      ? ["تأكد من اتصال إنترنت مستقر", "خصّص وقتاً غير منقطع لإكمال التقييم"]
      : ["Ensure a stable internet connection", "Set aside uninterrupted time to finish"];
    const notAllowed = ar
      ? ["لا تستخدم مراجع أو مواقع خارجية", "لا تستخدم أدوات ذكاء اصطناعي للإجابة", "لا تشارك الأسئلة مع أي شخص"]
      : ["No external references or websites", "No AI tools to answer questions", "Don't share questions with anyone"];
    return (
      <Shell showHeader>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "30px 24px", width: "100%" }}>
          <h1 style={{ fontSize: 24, letterSpacing: "-.02em", marginBottom: 6 }}>{Lq(a.title)}</h1>
          <p className="muted" style={{ fontSize: 14 }}>{T("Senior Frontend Engineer · Connect AI", "مهندس واجهات أول · Connect AI")}</p>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, margin: "20px 0" }}>
            <Tile icon="clock" label={T("Duration", "المدة")} value={a.duration + T(" min", " د")} />
            <Tile icon="list" label={T("Questions", "الأسئلة")} value={total} />
            <Tile icon="refresh" label={T("Attempts", "المحاولات")} value={a.attempts || 1} />
            <Tile icon="globe" label={T("Language", "اللغة")} value={ar ? "العربية" : "English"} />
          </div>

          {/* language picker */}
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>{T("Choose your language", "اختر لغتك")}</div>
            <div className="seg" style={{ display: "inline-flex" }}>
              <button className={!ar ? "on" : ""} onClick={() => setClang("en")}>English</button>
              <button className={ar ? "on" : ""} onClick={() => setClang("ar")}>العربية</button>
            </div>
          </div>

          {/* before you start */}
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>{T("Before you start", "قبل أن تبدأ")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {allowed.map((x, i) => <Rule key={"a" + i} ok text={x} n={i + 1} />)}
              {notAllowed.map((x, i) => <Rule key={"n" + i} text={x} n={allowed.length + i + 1} />)}
            </div>
          </div>

          {/* min requirements */}
          <div className="warn-bar" style={{ marginBottom: 16, background: "var(--info-soft)", borderColor: "color-mix(in oklch, var(--info) 28%, transparent)" }}>
            <span className="wb-ico"><Icon name="alert" size={15} style={{ color: "var(--info)" }} /></span>
            <span className="wb-text" style={{ fontSize: 12.5 }}>{T("Works best on the latest Chrome, Safari, or Firefox with JavaScript enabled. Some questions may require a microphone or camera.", "يعمل بأفضل صورة على أحدث إصدارات Chrome أو Safari أو Firefox مع تفعيل JavaScript. قد تتطلب بعض الأسئلة ميكروفوناً أو كاميرا.")}</span>
          </div>

          {/* honor code */}
          <div className="card card-pad" style={{ marginBottom: 18, borderInlineStart: "3px solid var(--accent)" }}>
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>{T("Honor code", "ميثاق الشرف")}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-2)", marginBottom: 12 }}>{T("I confirm that I will complete this assessment on my own, without external help or AI tools, and that the work I submit is entirely my own.", "أقرّ بأنني سأكمل هذا التقييم بنفسي، دون مساعدة خارجية أو أدوات ذكاء اصطناعي، وأن العمل الذي أقدّمه هو من إنتاجي بالكامل.")}</p>
            <label className="flex" style={{ alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setAccepted(v => !v)}>
              <span style={{ width: 20, height: 20, borderRadius: 5, border: "1.5px solid " + (accepted ? "var(--accent)" : "var(--border-strong)"), background: accepted ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto" }}>{accepted && <Icon name="check" size={13} style={{ color: "#fff" }} />}</span>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{T("I accept the honor code", "أوافق على ميثاق الشرف")}</span>
            </label>
            <div className="flex" style={{ gap: 8, alignItems: "flex-start", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <Icon name="eye" size={14} style={{ color: "var(--text-3)", flex: "0 0 auto", marginTop: 1 }} />
              <span className="faint" style={{ fontSize: 11.5, lineHeight: 1.55 }}>{T("For fairness, this assessment logs tab-switch and copy-paste events while you're taking it. These are signals shared with the hiring team — your screen is not recorded.", "للإنصاف، يسجّل هذا التقييم أحداث تبديل التبويبات والنسخ واللصق أثناء أدائك. هذه إشارات تُشارَك مع فريق التوظيف — ولا يتم تسجيل شاشتك.")}</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: "100%", height: 46 }} disabled={!accepted} onClick={startTest}>{T("Start assessment", "ابدأ التقييم")}</button>
        </div>
      </Shell>
    );
  }

  /* ===== 12.3.6 — RESUME ===== */
  if (stage === "resume") {
    return (
      <Shell showHeader>
        <div style={{ maxWidth: 480, margin: "auto", padding: 24, textAlign: "center" }}>
          <span style={{ width: 50, height: 50, borderRadius: 13, background: "var(--accent-soft)", color: "var(--accent-strong)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}><Icon name="refresh" size={24} /></span>
          <h2 style={{ fontSize: 21 }}>{T("Welcome back", "مرحباً بعودتك")}</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>{T("You have an assessment in progress. Pick up where you left off.", "لديك تقييم قيد التنفيذ. تابع من حيث توقفت.")}</p>
          <div className="card card-pad" style={{ marginTop: 18, textAlign: "start" }}>
            <Field2 label={T("Progress", "التقدّم")} value={`${answered} / ${total} ${T("answered", "مُجاب")}`} />
            <Field2 label={T("Time remaining", "الوقت المتبقي")} value={timerMode === "hard" ? fmt(secs) : T("Full time (soft timer)", "الوقت كامل (مؤقّت مرن)")} last />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", height: 46, marginTop: 18 }} onClick={() => { startRef.current = Date.now(); setStage("test"); }}>{T("Resume assessment", "استئناف التقييم")}</button>
        </div>
      </Shell>
    );
  }

  /* ===== 12.3.5 — SUBMITTED ===== */
  if (stage === "submitted") {
    const taken = startRef.current ? Math.round((Date.now() - startRef.current) / 60000) : (a.duration - Math.floor(secs / 60));
    return (
      <Shell showHeader>
        <div style={{ maxWidth: 480, margin: "auto", padding: 24, textAlign: "center" }}>
          <span style={{ width: 54, height: 54, borderRadius: 14, background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}><Icon name="check" size={28} /></span>
          <h2 style={{ fontSize: 22 }}>{T("Assessment submitted", "تم تسليم التقييم")}</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>{T("Thank you. Your responses have been recorded.", "شكراً لك. تم تسجيل إجاباتك.")}</p>
          <div className="card card-pad" style={{ marginTop: 18, textAlign: "start" }}>
            <Field2 label={T("Assessment", "التقييم")} value={Lq(a.title)} />
            <Field2 label={T("Submitted", "وقت التسليم")} value={submittedAt ? submittedAt.toLocaleString(ar ? "ar" : "en", { dateStyle: "medium", timeStyle: "short" }) : "—"} />
            <Field2 label={T("Time taken", "الوقت المستغرق")} value={Math.max(1, taken) + T(" min", " د")} />
            <Field2 label={T("Questions answered", "الأسئلة المُجابة")} value={`${answered} / ${total}`} />
            <Field2 label={T("Confirmation ID", "رقم التأكيد")} value={<span className="mono">{confId}</span>} last />
          </div>
          <div className="card card-pad" style={{ marginTop: 14, background: "var(--surface-2)", boxShadow: "none", textAlign: "start" }}>
            <div className="flex" style={{ gap: 9, alignItems: "flex-start" }}>
              <Icon name="bell" size={15} style={{ color: "var(--accent)", flex: "0 0 auto", marginTop: 1 }} />
              <span style={{ fontSize: 13, lineHeight: 1.6 }}>{T("What's next: the hiring team will review your submission within 3 business days and reach out by email.", "الخطوة التالية: سيراجع فريق التوظيف إجابتك خلال 3 أيام عمل وسيتواصل معك عبر البريد.")}</span>
            </div>
          </div>
          <p className="faint" style={{ fontSize: 11.5, marginTop: 14 }}>{T("A confirmation email has been sent. This link can no longer be used.", "تم إرسال بريد تأكيد. لم يعد بالإمكان استخدام هذا الرابط.")}</p>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={onClose}>{T("Close", "إغلاق")}</button>
        </div>
      </Shell>
    );
  }

  /* ===== 12.3.4 — REVIEW (flagged summary) ===== */
  if (stage === "review") {
    const flagged = Object.keys(flags).filter(k => flags[k]).map(Number);
    const unanswered = a.questions.map((_, i) => i).filter(i => answers[i] == null || answers[i] === "");
    return (
      <Shell showHeader>
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "30px 24px", width: "100%" }}>
          <h2 style={{ fontSize: 21, marginBottom: 6 }}>{T("Review before submitting", "المراجعة قبل التسليم")}</h2>
          <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}>{`${answered} / ${total} ${T("answered", "مُجاب")}`}{flagged.length > 0 && ` · ${flagged.length} ${T("flagged", "موسوم")}`}</p>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(52px,1fr))", gap: 8, marginBottom: 22 }}>
            {a.questions.map((_, i) => {
              const ans = answers[i] != null && answers[i] !== "";
              return (
                <button key={i} onClick={() => { setIdx(i); setStage("test"); }} style={{ aspectRatio: "1", borderRadius: "var(--r-sm)", border: "1.5px solid " + (flags[i] ? "var(--warning)" : ans ? "var(--success)" : "var(--border-strong)"), background: flags[i] ? "var(--warning-soft)" : ans ? "var(--success-soft)" : "var(--surface)", fontWeight: 700, fontSize: 13, color: flags[i] ? "var(--warning)" : ans ? "var(--success)" : "var(--text-3)", position: "relative" }}>
                  {i + 1}{flags[i] && <Icon name="flag" size={10} style={{ position: "absolute", top: 3, insetInlineEnd: 3 }} />}
                </button>
              );
            })}
          </div>
          {unanswered.length > 0 && (
            <div className="warn-bar" style={{ marginBottom: 18 }}>
              <span className="wb-ico"><Icon name="alert" size={15} /></span>
              <span className="wb-text" style={{ fontSize: 12.5 }}>{T(`${unanswered.length} question(s) not yet answered. You can still submit.`, `${unanswered.length} سؤال لم يُجَب بعد. لا يزال بإمكانك التسليم.`)}</span>
            </div>
          )}
          <div className="flex" style={{ gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setStage("test")}><Icon name={ar ? "chevRight" : "chevLeft"} size={15} />{T("Back to test", "العودة للاختبار")}</button>
            <div className="spacer" style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={submit}><Icon name="check" size={16} />{T("Submit assessment", "تسليم التقييم")}</button>
          </div>
        </div>
      </Shell>
    );
  }

  /* ===== 12.3.4 — TAKING ===== */
  const canBack = navMode !== "forward";
  return (
    <Shell showHeader>
      {/* progress */}
      <div style={{ padding: "0 22px", flex: "0 0 auto" }}>
        <div className="flex" style={{ justifyContent: "space-between", fontSize: 12, color: "var(--text-2)", padding: "12px 0 8px" }}>
          <span>{T("Question", "سؤال")} {idx + 1} {T("of", "من")} {total}</span>
          <span>{Math.round(((idx + 1) / total) * 100)}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 20, background: "var(--surface-3)" }}><div style={{ height: "100%", width: (((idx + 1) / total) * 100) + "%", background: "var(--accent)", borderRadius: 20, transition: "width .3s" }} /></div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 22px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="flex" style={{ gap: 8, marginBottom: 14, alignItems: "center" }}>
            <QType t={q.t} />
            {q.pts > 0 && <span className="faint mono" style={{ fontSize: 12 }}>{q.pts} {T("pts", "نقطة")}</span>}
            <div className="spacer" style={{ flex: 1 }} />
            {canBack && (
              <button className="btn btn-subtle btn-sm" onClick={() => { setFlags(f => ({ ...f, [idx]: !f[idx] })); }} style={{ color: flags[idx] ? "var(--warning)" : undefined }}>
                <Icon name="flag" size={13} />{flags[idx] ? T("Flagged", "موسوم") : T("Flag for review", "وسم للمراجعة")}
              </button>
            )}
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.5, marginBottom: 20 }}>{Lq(q.q)}</div>

          {/* answer inputs */}
          {q.opts && q.opts.map((o, j) => {
            const on = q.t === "multi" ? (answers[idx] || []).includes(j) : answers[idx] === j;
            return (
              <button key={j} onClick={() => q.t === "multi" ? setAns((answers[idx] || []).includes(j) ? answers[idx].filter(x => x !== j) : [...(answers[idx] || []), j]) : setAns(j)}
                className="flex" style={{ width: "100%", alignItems: "center", gap: 12, padding: "14px 16px", border: "1.5px solid " + (on ? "var(--accent)" : "var(--border-strong)"), background: on ? "var(--accent-soft)" : "var(--surface)", borderRadius: "var(--r-md)", marginBottom: 10, textAlign: "start" }}>
                <span style={{ width: 20, height: 20, borderRadius: q.t === "multi" ? 5 : "50%", border: "1.5px solid " + (on ? "var(--accent)" : "var(--border-strong)"), background: on ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto" }}>{on && <Icon name="check" size={12} style={{ color: "#fff" }} />}</span>
                <span style={{ fontSize: 15 }}>{Lq(o)}</span>
              </button>
            );
          })}
          {q.t === "boolean" && [{ en: "True", ar: "صح", v: true }, { en: "False", ar: "خطأ", v: false }].map((o, j) => {
            const on = answers[idx] === o.v;
            return <button key={j} onClick={() => setAns(o.v)} className="flex" style={{ width: "100%", alignItems: "center", gap: 12, padding: "14px 16px", border: "1.5px solid " + (on ? "var(--accent)" : "var(--border-strong)"), background: on ? "var(--accent-soft)" : "var(--surface)", borderRadius: "var(--r-md)", marginBottom: 10, textAlign: "start" }}><span style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid " + (on ? "var(--accent)" : "var(--border-strong)"), background: on ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto" }}>{on && <Icon name="check" size={12} style={{ color: "#fff" }} />}</span><span style={{ fontSize: 15 }}>{Lq(o)}</span></button>;
          })}
          {(q.t === "short" || q.t === "long") && <textarea className="textarea" rows={q.t === "long" ? 7 : 3} value={answers[idx] || ""} onChange={e => setAns(e.target.value)} placeholder={T("Type your answer…", "اكتب إجابتك…")} />}
          {q.t === "code" && <textarea className="textarea mono" dir="ltr" rows={9} value={answers[idx] || "function solution(input) {\n  \n}"} onChange={e => setAns(e.target.value)} style={{ fontSize: 13, background: "var(--surface-3)" }} />}
          {q.t === "file" && (
            <div style={{ border: "2px dashed var(--border-strong)", borderRadius: "var(--r-md)", padding: 32, textAlign: "center", color: "var(--text-3)", cursor: "pointer" }} onClick={() => setAns("uploaded.pdf")}>
              <Icon name="upload" size={24} /><div style={{ marginTop: 8, fontSize: 13.5 }}>{answers[idx] ? <span style={{ color: "var(--success)", fontWeight: 600 }}><Icon name="check" size={13} /> {answers[idx]}</span> : T("Drag a file or click to upload (max 25 MB)", "اسحب ملفاً أو انقر للرفع (بحد أقصى 25 ميجابايت)")}</div>
            </div>
          )}
          {q.t === "likert" && (
            <div className="flex" style={{ justifyContent: "space-between", gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => { const on = answers[idx] === n; return <button key={n} onClick={() => setAns(n)} style={{ flex: 1, padding: "16px 0", border: "1.5px solid " + (on ? "var(--accent)" : "var(--border-strong)"), background: on ? "var(--accent-soft)" : "var(--surface)", color: on ? "var(--accent-strong)" : "var(--text-2)", borderRadius: "var(--r-sm)", fontWeight: 700, fontSize: 16 }}>{n}</button>; })}
            </div>
          )}
          {q.t === "likert" && <div className="flex" style={{ justifyContent: "space-between", fontSize: 11.5, color: "var(--text-3)", marginTop: 6 }}><span>{T("Strongly disagree", "أعارض بشدة")}</span><span>{T("Strongly agree", "أوافق بشدة")}</span></div>}
        </div>
      </div>

      {/* footer nav */}
      <div style={{ flex: "0 0 auto", borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "12px 22px", display: "flex", alignItems: "center", gap: 10 }}>
        <button className="btn btn-ghost btn-sm" disabled={!canBack || idx === 0} onClick={() => setIdx(i => i - 1)}><Icon name={ar ? "chevRight" : "chevLeft"} size={15} />{T("Previous", "السابق")}</button>
        <button className="btn btn-subtle btn-sm" onClick={() => setOffline(o => !o)} title="Demo"><Icon name="alert" size={13} />{offline ? T("Go online", "اتصال") : T("Simulate offline", "محاكاة انقطاع")}</button>
        <div className="spacer" style={{ flex: 1 }} />
        {idx < total - 1
          ? <button className="btn btn-primary btn-sm" onClick={() => setIdx(i => i + 1)}>{T("Next", "التالي")}<Icon name={ar ? "chevLeft" : "chevRight"} size={15} /></button>
          : <button className="btn btn-primary btn-sm" onClick={() => setStage(canBack ? "review" : "submitted")}>{canBack ? T("Review & submit", "مراجعة وتسليم") : T("Submit", "تسليم")}<Icon name="check" size={15} /></button>}
      </div>
    </Shell>
  );
}

function Field2({ label, value, last }) {
  return <div className="flex" style={{ justifyContent: "space-between", gap: 16, padding: "6px 0", borderBottom: last ? "none" : "1px solid var(--border)", fontSize: 13 }}><span className="faint">{label}</span><span style={{ fontWeight: 600, textAlign: "end" }}>{value}</span></div>;
}
function Tile({ icon, label, value }) {
  return <div className="card card-pad" style={{ padding: 14, textAlign: "center" }}><Icon name={icon} size={17} style={{ color: "var(--accent)" }} /><div className="mono" style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}>{value}</div><div className="faint" style={{ fontSize: 11 }}>{label}</div></div>;
}
function Rule({ ok, text, n }) {
  return (
    <div className="flex" style={{ gap: 10, alignItems: "flex-start", fontSize: 13.5 }}>
      <span style={{ width: 20, height: 20, borderRadius: 6, background: ok ? "var(--success-soft)" : "var(--danger-soft)", color: ok ? "var(--success)" : "var(--danger)", display: "grid", placeItems: "center", flex: "0 0 auto", fontWeight: 700, fontSize: 11 }}>
        <Icon name={ok ? "check" : "x"} size={12} />
      </span>
      <span style={{ lineHeight: 1.5, color: "var(--text)" }}>{text}</span>
    </div>
  );
}

// QType is used here but defined in assessment-detail.jsx — inline a local copy
function QType({ t, sm }) {
  const { L } = useApp();
  const q = window.ASSESS.QTYPES[t];
  return <span className="badge badge-neutral" style={{ height: sm ? 19 : 22, gap: 4 }}><Icon name={q.icon} size={sm ? 10 : 12} />{L(q)}</span>;
}

export { CandidateAssessment };
