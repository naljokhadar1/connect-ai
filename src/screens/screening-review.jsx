import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Recruiter review surface for an AI screening call (linear, progressive) */

function ScreeningReview({ go, toast }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const cand = { name: { en: "Ahmed Hassan", ar: "أحمد حسن" }, initials: "AH", avatar: "oklch(0.6 0.14 255)" };

  const [fullReason, setFullReason] = React.useState(false);
  const [trustFull, setTrustFull] = React.useState(false);
  const [deeper, setDeeper] = React.useState(false);
  const [scores, setScores] = React.useState({ react: 9, lead: 8, fintech: 9, comm: 9 });
  const [reason, setReason] = React.useState("");
  const [rec, setRec] = React.useState("ai");
  const [decided, setDecided] = React.useState(false);
  const [headMenu, setHeadMenu] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const transRef = React.useRef();
  const rowRefs = React.useRef({});

  const aiScores = { react: 9, lead: 8, fintech: 9, comm: 9 };
  const needsReason = Object.keys(scores).some(k => Math.abs(scores[k] - aiScores[k]) >= 2) && !reason.trim();

  const goals = [
    { id: "react", label: T("React expertise depth", "عمق خبرة React"), tier: T("must", "إلزامي"), ai: 9, ts: "6:24", ev: T("…virtualization with react-window, combined with memoization on the row components…", "…virtualization مع react-window مع memoization لمكوّنات الصفوف…") },
    { id: "lead", label: T("Leadership experience", "الخبرة القيادية"), tier: T("must", "إلزامي"), ai: 8, ts: "10:47", ev: T("I gave Mariam weekly 1-on-1s for six months…", "عقدت مع مريم جلسات أسبوعية لستة أشهر…") },
    { id: "fintech", label: T("Fintech motivation", "الدافع المالي"), tier: T("nice", "مفضّل"), ai: 9, ts: "13:15", ev: T("I've been a customer of Saudi neobanks for two years…", "كنت عميلاً للبنوك الرقمية السعودية لعامين…") },
  ];
  const knockouts = [
    { label: T("Work authorization", "تصريح العمل"), status: "ok", detail: T("KSA citizen — no sponsorship needed", "مواطن سعودي — دون كفالة"), ts: "1:24" },
    { label: T("Salary expectation", "توقعات الراتب"), status: "warn", detail: T("Said 'around twenty-eight' without currency or range. Needs follow-up.", "قال «نحو ثمانية وعشرين» دون عملة أو نطاق. يحتاج متابعة."), ts: "14:30", followup: true },
    { label: T("Notice period", "مدة الإشعار"), status: "ok", detail: T("1 month", "شهر واحد"), ts: "15:02" },
  ];
  const transcript = [
    { ts: "0:00", who: "ai", text: T("Hi Ahmed, thanks for taking the time today. I'm an AI screening agent for Connect AI.", "مرحباً أحمد، شكراً لوقتك. أنا وكيل فرز بالذكاء من Connect AI.") },
    { ts: "0:18", who: "cand", text: T("Yes, I'm ready.", "نعم، مستعد.") },
    { ts: "0:21", who: "ai", text: T("Great. Are you authorized to work in Saudi Arabia without sponsorship?", "رائع. هل أنت مخوّل للعمل في السعودية دون كفالة؟") },
    { ts: "0:28", who: "cand", text: T("Yes, I'm a Saudi citizen.", "نعم، أنا مواطن سعودي."), hl: true },
    { ts: "6:24", who: "cand", text: T("We used virtualization with react-window, combined with memoization.", "استخدمنا virtualization مع react-window مع memoization."), hl: true },
    { ts: "10:47", who: "cand", text: T("I gave Mariam weekly 1-on-1s for six months.", "عقدت مع مريم جلسات أسبوعية لستة أشهر."), hl: true },
    { ts: "14:30", who: "cand", text: T("I'd want something competitive — around twenty-eight, but flexible.", "أريد راتباً تنافسياً — نحو ثمانية وعشرين، لكنني مرن.") },
  ];
  const filtered = transcript.filter(l => !search || l.text.toLowerCase().includes(search.toLowerCase()));
  const jump = (ts) => { setDeeper(true); setTimeout(() => { const el = rowRefs.current[ts]; if (el && transRef.current) { transRef.current.scrollTop = el.offsetTop - transRef.current.offsetTop - 8; el.style.background = "var(--accent-soft)"; setTimeout(() => el.style.background = "", 1400); } }, 120); };

  const trustSignals = [
    [T("Consent accepted", "الموافقة"), T("14:32 PM GST", "14:32")],
    [T("Recording quality", "جودة التسجيل"), T("Excellent", "ممتازة")],
    [T("Voice identity matched", "تطابق الصوت"), T("Same as application", "مطابق للطلب")],
    [T("AI-use not detected", "لا اشتباه ذكاء"), T("Natural pauses", "توقفات طبيعية")],
    [T("No suspicious patterns", "لا أنماط مريبة"), T("Time + responses normal", "الوقت والإجابات طبيعية")],
    [T("All topics covered", "كل المواضيع"), T("5 of 5", "5 من 5")],
  ];

  const finalRec = rec === "ai" ? T("Advance to Technical Interview", "التقدّم للمقابلة التقنية") : rec === "reject" ? T("Reject candidate", "رفض المرشح") : T("Request another screening", "طلب فرز آخر");

  return (
    <div className="page" style={{ maxWidth: 880, paddingBottom: 90 }}>
      <div className="crumbs" style={{ marginBottom: 12 }}>
        <a onClick={() => go("pipeline")}>{T("Pipeline", "المسار")}</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} />
        <a onClick={() => go("pipeline")}>{T("Senior Frontend Engineer", "مهندس واجهات أول")}</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} />
        <a onClick={() => go("candidate-profile", { id: "ahmed", from: "pipeline" })}>{cand.name[ar ? "ar" : "en"]}</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} />
        <span style={{ color: "var(--text-2)" }}>{T("Screening Call", "مكالمة الفرز")}</span>
      </div>

      {/* header */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="flex" style={{ alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Avatar c={cand} size={40} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{cand.name[ar ? "ar" : "en"]}</div>
            <div className="faint" style={{ fontSize: 12.5 }}>{T("Senior Frontend Engineer · AI Screening Call · Completed June 9, 2026 at 3:42 PM GST", "مهندس واجهات أول · مكالمة فرز · اكتملت 9 يونيو 2026 · 3:42 م")}</div>
          </div>
          <div className="flex" style={{ gap: 8, flexWrap: "wrap" }}>
            <a className="muted" style={{ fontSize: 12.5, cursor: "pointer", alignSelf: "center" }} onClick={() => go("candidate-profile", { id: "ahmed", from: "pipeline" })}>{T("View profile", "الملف")} →</a>
            <button className="btn btn-ghost btn-sm" onClick={() => toast(T("Re-running evaluation…", "إعادة التقييم…"))}><Icon name="refresh" size={14} />{T("Re-run AI", "إعادة الذكاء")}</button>
            <div style={{ position: "relative" }}>
              <button className="btn btn-primary btn-sm" onClick={() => setHeadMenu(m => !m)}><Icon name="check" size={15} />{T("Confirm & advance", "تأكيد وتقديم")}<Icon name="chevDown" size={14} /></button>
              {headMenu && (<><div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setHeadMenu(false)} /><div className="kebab-menu" style={{ insetInlineEnd: 0, minWidth: 220 }}>{[T("Confirm & advance", "تأكيد وتقديم"), T("Confirm & reject", "تأكيد ورفض"), T("Save without decision", "حفظ دون قرار")].map((l, i) => <button key={i} onClick={() => { setHeadMenu(false); toast(l); if (i < 2) go("pipeline"); }}>{l}</button>)}</div></>)}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1 — recommendation */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)", borderInlineStart: "3px solid var(--ai)", textAlign: "center", padding: 28 }}>
        <div className="faint" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 14 }}><Icon name="sparkles" size={12} fill style={{ color: "var(--ai)", verticalAlign: "-1px", marginInlineEnd: 5 }} />{T("AI Recommendation", "توصية الذكاء")}</div>
        <div className="flex" style={{ alignItems: "center", gap: 9, justifyContent: "center" }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--success)" }} />
          <span style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-.02em" }}>{T("Advance to Technical Interview", "التقدّم للمقابلة التقنية")}</span>
        </div>
        <div className="faint" style={{ fontSize: 13, marginTop: 6 }}>{T("High confidence (4.5/5)", "ثقة عالية (4.5/5)")}</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--text-2)", maxWidth: 620, margin: "16px auto 0" }}>{fullReason
          ? T("Ahmed showed strong technical depth on React, particularly performance optimization and component design, with concrete quantified examples. His leadership examples were specific and showed real mentorship rather than just seniority. He articulated genuine, well-reasoned motivation for fintech. The only gap: salary expectation was vague (no currency or range), which should be confirmed during follow-up. All six must-haves were met.", "أظهر أحمد عمقاً تقنياً قوياً في React، خاصة تحسين الأداء وتصميم المكوّنات بأمثلة مُقاسة. أمثلته القيادية محدّدة وتُظهر إرشاداً حقيقياً. وأبدى دافعاً صادقاً ومُعلّلاً للتقنية المالية. الفجوة الوحيدة: توقعات الراتب كانت غامضة، وينبغي تأكيدها في المتابعة. استُوفيت كل المتطلبات الإلزامية الستة.")
          : T("Ahmed showed strong technical depth on React, gave specific leadership examples, and articulated clear motivation for fintech. Salary expectation was vague — recommend confirming with him.", "أظهر أحمد عمقاً تقنياً في React، وقدّم أمثلة قيادية محدّدة، وعبّر عن دافع واضح للتقنية المالية. توقعات الراتب كانت غامضة — يُنصح بالتأكيد معه.")}</p>
        <div className="flex" style={{ gap: 8, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
          <button className="btn btn-primary btn-sm" onClick={() => { setDecided(true); toast(T("Advancing…", "جارٍ التقديم…")); }}><Icon name="check" size={14} />{T("Advance to Technical Interview", "التقدّم للمقابلة التقنية")}</button>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--text-2)" }}><Icon name="x" size={14} />{T("Reject with feedback", "رفض مع ملاحظات")}</button>
          <button className="btn btn-ghost btn-sm"><Icon name="clock" size={14} />{T("Save for later", "حفظ لاحقاً")}</button>
        </div>
        <a className="muted" style={{ fontSize: 12, cursor: "pointer", display: "inline-block", marginTop: 14, color: "var(--accent-strong)" }} onClick={() => setFullReason(f => !f)}><Icon name={fullReason ? "chevUp" : "chevDown"} size={12} /> {fullReason ? T("Show less", "أقل") : T("Show full reasoning", "التفسير الكامل")}</a>
      </div>

      {/* SECTION 2 — trust */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="flex" style={{ alignItems: "center", marginBottom: 14 }}><span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{T("Submission integrity", "نزاهة التسليم")}</span><span className="faint flex" style={{ alignItems: "center", gap: 5, fontSize: 12, color: "var(--success)" }}><Icon name="check" size={13} />{T("All checks clear", "كل الفحوص سليمة")}</span></div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
          {trustSignals.map(([l, v], i) => (
            <div key={i} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 12.5 }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="check" size={11} /></span>
              <span><b style={{ fontWeight: 500 }}>{l}</b> <span className="faint">· {v}</span></span>
            </div>
          ))}
        </div>
        {trustFull && <div className="faint" style={{ fontSize: 12, lineHeight: 1.6, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>{T("Device: 1 (Chrome / macOS) · IP consistent throughout · 0 disconnects · Honor code accepted at 14:32 · 2 minor cross-talk events (within normal range) · Completion time 16m 42s vs 18m median (−8%).", "جهاز واحد · IP ثابت · 0 انقطاع · قُبل ميثاق الشرف 14:32 · حدثا تداخل بسيطان · زمن الإكمال 16:42 مقابل وسيط 18 د.")}</div>}
        <a className="muted" style={{ fontSize: 12, cursor: "pointer", display: "inline-block", marginTop: 12 }} onClick={() => setTrustFull(f => !f)}><Icon name={trustFull ? "chevUp" : "chevDown"} size={12} /> {trustFull ? T("Hide details", "إخفاء") : T("Show full submission details", "تفاصيل التسليم")}</a>
      </div>

      {/* SECTION 3 — per-goal */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <h3 style={{ fontSize: 14 }}>{T("Per-goal evaluation", "التقييم حسب الهدف")}</h3>
        <p className="faint" style={{ fontSize: 12.5, marginTop: 3, marginBottom: 16 }}>{T("How the AI scored against the agent's goals.", "كيف قيّم الذكاء مقابل أهداف الوكيل.")}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {goals.map(g => (
            <div key={g.id}>
              <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600, fontSize: 13.5, flex: 1 }}>{g.label}</span>
                <span className={"badge " + (g.tier.includes("must") || g.tier.includes("إلزامي") ? "badge-accent" : "badge-neutral")} style={{ height: 18, fontSize: 10 }}>{g.tier}</span>
                <span className="mono" style={{ fontWeight: 700, color: g.ai >= 8 ? "var(--success)" : "var(--accent)" }}>{g.ai}/10</span>
              </div>
              <Bar value={g.ai * 10} color={g.ai >= 8 ? "var(--success)" : "var(--purple)"} />
              <div className="flex" style={{ alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, fontStyle: "italic", color: "var(--text-2)", flex: 1, minWidth: 200 }}>"{g.ev}"</span>
                <a className="flex" onClick={() => jump(g.ts)} style={{ alignItems: "center", gap: 4, fontSize: 12, color: "var(--ai)", cursor: "pointer", fontWeight: 600 }}><Icon name="play" size={11} />{T("Jump to", "انتقل إلى")} {g.ts}</a>
              </div>
            </div>
          ))}
        </div>
        <div className="flex" style={{ alignItems: "center", gap: 8, margin: "18px 0 12px" }}><span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--text-3)" }}>{T("Knockouts", "الاستبعاد")}</span><span style={{ flex: 1, height: 1, background: "var(--border)" }} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {knockouts.map((k, i) => (
            <div key={i} className="flex" style={{ gap: 10, alignItems: "flex-start" }}>
              <Icon name={k.status === "ok" ? "check" : "alert"} size={16} style={{ color: k.status === "ok" ? "var(--success)" : "var(--warning)", flex: "0 0 auto", marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div className="flex" style={{ alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{k.label}</span>
                  <span className={"badge " + (k.status === "ok" ? "badge-success" : "badge-warning")} style={{ height: 18, fontSize: 10 }}>{k.status === "ok" ? T("Confirmed", "مؤكّد") : T("Unclear", "غير واضح")}</span>
                  <div className="spacer" style={{ flex: 1 }} />
                  <a className="flex" onClick={() => jump(k.ts)} style={{ alignItems: "center", gap: 4, fontSize: 12, color: "var(--ai)", cursor: "pointer", fontWeight: 600 }}><Icon name="play" size={11} />{k.ts}</a>
                </div>
                <div className="faint" style={{ fontSize: 12.5, marginTop: 3, lineHeight: 1.5 }}>{k.detail}</div>
                {k.followup && <a style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer", fontWeight: 600, marginTop: 4, display: "inline-block" }} onClick={() => toast(T("Added to follow-up", "أُضيف للمتابعة"))}>+ {T("Add to follow-up email", "أضف لبريد المتابعة")}</a>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex" style={{ alignItems: "center", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}><span className="faint" style={{ fontSize: 12.5, flex: 1 }}>{T("Weighted score: 87/100 · 6 of 6 must-haves met", "الدرجة المرجّحة: 87/100 · 6 من 6 متطلبات")}</span><a className="muted" style={{ fontSize: 12, cursor: "pointer", color: "var(--ai)" }}>{T("How is this calculated?", "كيف تُحتسب؟")}</a></div>
      </div>

      {/* SECTION 4 — deeper review */}
      <div className="card" style={{ marginBottom: "var(--gap)", overflow: "hidden" }}>
        <button className="flex" style={{ width: "100%", alignItems: "center", gap: 12, padding: "14px 18px", textAlign: "start" }} onClick={() => setDeeper(d => !d)}>
          <Icon name="doc" size={16} style={{ color: "var(--text-2)", flex: "0 0 auto" }} />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{T("Deeper review", "مراجعة أعمق")}</div>{!deeper && <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>{T("Full transcript · Candidate questions · Audio · Override scores", "النص الكامل · أسئلة المرشح · الصوت · تعديل الدرجات")}</div>}</div>
          <Icon name={deeper ? "chevUp" : "chevDown"} size={16} style={{ color: "var(--text-3)", flex: "0 0 auto" }} />
        </button>
        {deeper && (
          <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 22 }}>
            {/* 4A transcript */}
            <div>
              <div className="flex" style={{ alignItems: "center", gap: 10, marginBottom: 10 }}><span style={{ fontWeight: 600, fontSize: 13 }}>{T("Transcript", "النص")}</span><div className="searchbar" style={{ height: 30, maxWidth: 160 }}><Icon name="search" size={13} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={T("Search…", "بحث…")} /></div><div className="spacer" style={{ flex: 1 }} /><a className="muted" style={{ fontSize: 12, cursor: "pointer" }} onClick={() => toast(T("Downloaded", "تم التنزيل"))}>PDF</a></div>
              <div ref={transRef} style={{ maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: 12 }}>
                {filtered.map((l, i) => (
                  <div key={i} ref={el => rowRefs.current[l.ts] = el} className="flex" style={{ gap: 8, alignItems: "baseline", transition: "background .4s", borderRadius: 4, padding: "2px 4px" }}>
                    <span className="mono faint" style={{ fontSize: 11, flex: "0 0 34px" }}>{l.ts}</span>
                    <span style={{ fontWeight: 700, fontSize: 12, color: l.who === "ai" ? "var(--accent-strong)" : "var(--text)", flex: "0 0 auto" }}>{l.who === "ai" ? T("AI", "ذكاء") : "Ahmed"}:</span>
                    <span style={{ fontSize: 13, lineHeight: 1.6 }}>{l.hl ? <mark style={{ background: "var(--accent-soft)", color: "var(--accent-strong)", borderRadius: 3, padding: "1px 4px" }}>{l.text}</mark> : l.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex" style={{ alignItems: "center", gap: 12, marginTop: 10 }}><button className="btn-icon btn-sm" style={{ background: "var(--accent)", color: "#fff" }}><Icon name="play" size={14} /></button><div style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, height: 22 }}>{Array.from({ length: 42 }).map((_, i) => <span key={i} style={{ flex: 1, height: (6 + Math.abs(Math.sin(i * 0.7)) * 14) + "px", background: i < 17 ? "var(--accent)" : "var(--border-strong)", borderRadius: 2 }} />)}</div><span className="mono faint" style={{ fontSize: 11.5 }}>16:42</span></div>
            </div>
            {/* 4B questions */}
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--success)", marginBottom: 8 }}>{T("Answered by AI (4)", "أجابها الذكاء (4)")}</div>
                {[[T("What's the team size?", "حجم الفريق؟"), "11:15"], [T("Is the role remote-friendly?", "عن بُعد؟"), "13:45"], [T("What's the tech stack?", "التقنيات؟"), "9:30"], [T("Career progression?", "المسار المهني؟"), "12:10"]].map((q, i) => (
                  <div key={i} className="flex" style={{ alignItems: "center", gap: 6, padding: "6px 0", fontSize: 12.5 }}><Icon name="check" size={12} style={{ color: "var(--success)", flex: "0 0 auto" }} /><span style={{ flex: 1 }}>{q[0]}</span><a className="muted" style={{ fontSize: 11.5, cursor: "pointer", color: "var(--ai)" }} onClick={() => jump(q[1])}>{q[1]}</a></div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--warning)", marginBottom: 8 }}>{T("Noted for follow-up (2)", "مدوّنة للمتابعة (2)")}</div>
                {[T("Is there a sign-on bonus?", "مكافأة انضمام؟"), T("How much travel is expected?", "حجم السفر؟")].map((q, i) => (
                  <div key={i} style={{ padding: "6px 0", fontSize: 12.5 }}><div>{q}</div><a style={{ fontSize: 11.5, cursor: "pointer", color: "var(--accent)", fontWeight: 600 }} onClick={() => toast(T("Added", "أُضيف"))}>+ {T("Add to follow-up", "أضف للمتابعة")}</a></div>
                ))}
              </div>
            </div>
            {/* 4C override */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{T("Adjust scores if you disagree", "عدّل الدرجات عند الاختلاف")}</div>
              <p className="faint" style={{ fontSize: 11.5, marginBottom: 10 }}>{T("Your override becomes the final score. Reason required if you differ by 2+ points.", "يصبح تعديلك الدرجة النهائية. يلزم سبب عند الاختلاف بنقطتين أو أكثر.")}</p>
              {[["react", T("React expertise", "خبرة React")], ["lead", T("Leadership", "القيادة")], ["fintech", T("Fintech motivation", "الدافع المالي")], ["comm", T("Communication", "التواصل")]].map(([k, l]) => {
                const over = scores[k] !== aiScores[k];
                return (
                  <div key={k} className="flex" style={{ alignItems: "center", gap: 12, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ flex: 1, fontSize: 13 }}>{l}</span>
                    <span className="faint mono" style={{ fontSize: 12 }}>{T("AI:", "ذكاء:")} {aiScores[k]}</span>
                    <input className="input mono" value={scores[k]} onChange={e => setScores(s => ({ ...s, [k]: +e.target.value || 0 }))} style={{ width: 54, height: 30, textAlign: "center", borderColor: over ? "var(--accent)" : undefined, background: over ? "var(--accent-soft)" : undefined }} />
                  </div>
                );
              })}
              {Object.keys(scores).some(k => Math.abs(scores[k] - aiScores[k]) >= 2) && <div className="field" style={{ marginTop: 12 }}><label style={{ color: "var(--warning)" }}>{T("Why did you change this score? (required)", "لماذا غيّرت الدرجة؟ (مطلوب)")}</label><textarea className="textarea" rows={2} value={reason} onChange={e => setReason(e.target.value)} /></div>}
              <div className="field" style={{ marginTop: 14 }}><label>{T("Final recommendation", "التوصية النهائية")}</label>
                {[["ai", T("Use AI: Advance to Technical Interview", "الذكاء: التقدّم للمقابلة")], ["reject", T("Override: Reject candidate", "تجاوز: رفض")], ["another", T("Override: Request another screening", "تجاوز: فرز آخر")]].map(([v, l]) => (
                  <label key={v} className="flex" style={{ alignItems: "flex-start", gap: 9, cursor: "pointer", padding: "5px 0" }} onClick={() => setRec(v)}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid " + (rec === v ? "var(--accent)" : "var(--border-strong)"), background: rec === v ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto", marginTop: 1 }}>{rec === v && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}</span>
                    <span style={{ fontSize: 13 }}>{l}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5 — follow-up */}
      <div className="card card-pad">
        <div className="flex" style={{ alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ fontSize: 14 }}>{T("Things to follow up on", "أمور للمتابعة")}</h3>
            <p className="faint" style={{ fontSize: 12, marginTop: 3, marginBottom: 12 }}>{T("Auto-generated from the call. Edit as needed.", "مولّدة من المكالمة. عدّل حسب الحاجة.")}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[T("Confirm exact salary expectation (candidate was vague)", "أكّد توقعات الراتب (كانت غامضة)"), T("Answer: Sign-on bonus availability", "أجب: مكافأة الانضمام"), T("Answer: Travel expectations for the role", "أجب: توقعات السفر"), T("Schedule technical interview", "حدّد المقابلة التقنية")].map((f, i) => (
                <label key={i} className="flex" style={{ alignItems: "flex-start", gap: 9, fontSize: 13, cursor: "pointer" }}><span style={{ width: 17, height: 17, borderRadius: 5, border: "1.5px solid var(--border-strong)", flex: "0 0 auto", marginTop: 1 }} />{f}</label>
              ))}
            </div>
          </div>
          <div className="flex" style={{ flexDirection: "column", gap: 8 }}>
            <button className="btn btn-ai btn-sm" onClick={() => go("templates")}><Icon name="sparkles" size={14} fill />{T("Generate follow-up email", "أنشئ بريد متابعة")}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => toast(T("Note added for @hiring-team", "أُضيفت ملاحظة للفريق"))}><Icon name="users" size={14} />{T("Discuss with team", "ناقش مع الفريق")}</button>
          </div>
        </div>
      </div>

      {/* sticky footer */}
      <div style={{ position: "sticky", bottom: 0, marginTop: "var(--gap)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-lg)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", zIndex: 30 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{T("Your decision:", "قرارك:")} {finalRec}</div>
          <div className="faint" style={{ fontSize: 11.5, marginTop: 2 }}>{rec === "ai" ? T("Matching AI recommendation", "مطابق لتوصية الذكاء") : T("Overriding AI (was: Advance)", "تجاوز الذكاء (كان: تقدّم)")}</div>
        </div>
        <div className="flex" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { toast(T("Saved", "حُفظ")); }}>{T("Save without deciding", "حفظ دون قرار")}</button>
          <button className="btn btn-primary" disabled={needsReason} onClick={() => { toast(T("Confirmed", "تم التأكيد")); go("pipeline"); }}><Icon name="check" size={16} />{rec === "reject" ? T("Confirm & reject", "تأكيد ورفض") : T("Confirm & advance", "تأكيد وتقديم")}</button>
        </div>
      </div>
    </div>
  );
}

function L_(o, lang) { return o ? (o[lang] ?? o.en) : ""; }

export { ScreeningReview, L_ }
