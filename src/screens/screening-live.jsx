import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Live monitoring of active AI screening calls */

function ScreeningLive({ go, toast }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [expanded, setExpanded] = React.useState("c1");
  const [tFilter, setTFilter] = React.useState("all");
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [listen, setListen] = React.useState(false);
  const [takeover, setTakeover] = React.useState(false);
  const [suggest, setSuggest] = React.useState(false);
  const [suggestText, setSuggestText] = React.useState("");
  const transRef = React.useRef();

  const calls = [
    { id: "c1", name: { en: "Ahmed Hassan", ar: "أحمد حسن" }, initials: "AH", avatar: "oklch(0.6 0.14 255)", role: T("Senior Frontend Engineer", "مهندس واجهات أول"), started: T("6 min ago", "قبل 6 د"), channel: T("Browser", "متصفح"), callLang: T("English", "الإنجليزية"), quality: T("Excellent", "ممتازة"), goals: 2 },
    { id: "c2", name: { en: "Sara Mansour", ar: "سارة منصور" }, initials: "SM", avatar: "oklch(0.6 0.14 20)", role: T("Senior Backend Engineer", "مهندسة خادم أولى"), started: T("12 min ago", "قبل 12 د"), channel: T("Phone", "هاتف"), callLang: T("Arabic", "العربية"), quality: T("Good", "جيدة"), goals: 4 },
    { id: "c3", name: { en: "Khalid Al-Otaibi", ar: "خالد العتيبي" }, initials: "KO", avatar: "oklch(0.6 0.14 150)", role: T("Data Analyst", "محلل بيانات"), started: T("2 min ago", "قبل دقيقتين"), channel: T("Browser", "متصفح"), callLang: T("English", "الإنجليزية"), quality: T("Excellent", "ممتازة"), goals: 0 },
  ];

  const transcript = [
    { ts: "5:42", who: "ai", text: T("Got it — six years of React experience, with the last three at Acme Fintech. Can you walk me through a particularly complex component you built there?", "تمام — ست سنوات خبرة React، آخر ثلاث في Acme Fintech. هل تصف لي مكوّناً معقّداً بنيته؟") },
    { ts: "5:54", who: "cand", text: T("Sure. We had a transaction timeline that showed up to ten thousand transactions per user…", "بالتأكيد. كان لدينا سجل معاملات يعرض حتى عشرة آلاف معاملة للمستخدم…") },
    { ts: "6:18", who: "ai", text: T("Interesting. How did you approach that?", "مثير. كيف عالجت ذلك؟") },
    { ts: "6:23", who: "cand", live: true, text: T("We used virtualization with react-window, combined with memoization…", "استخدمنا virtualization مع react-window مع memoization…") },
  ];
  const tf = transcript.filter(l => tFilter === "all" || (tFilter === "ai" && l.who === "ai") || (tFilter === "cand" && l.who === "cand"));

  const goals = [
    { done: true, l: T("Background & work auth", "الخلفية وتصريح العمل") },
    { done: true, prog: true, l: T("React experience", "خبرة React") },
    { l: T("Leadership experience", "الخبرة القيادية") },
    { l: T("Fintech motivation", "الدافع للتقنية المالية") },
    { l: T("Closing", "الختام") },
  ];

  const done = [
    { t: "10:42 AM", n: "Fatima Al-Shamsi", r: T("Senior Frontend Engineer", "مهندسة واجهات أولى"), dur: "15:23", rec: T("Strong", "قوي"), color: "var(--success)" },
    { t: "10:15 AM", n: "Omar Al-Rahman", r: T("Backend Engineer", "مهندس خادم"), dur: "18:14", rec: T("Mixed", "متباين"), color: "var(--warning)" },
    { t: "9:33 AM", n: "Noura Hassan", r: T("Product Designer", "مصمّمة منتجات"), dur: T("4:21 · ended early", "4:21 · انتهت مبكراً"), rec: T("Needs follow-up", "تحتاج متابعة"), color: "var(--text-3)" },
  ];

  const Mini = ({ title, icon, children, accent }) => (
    <div className="card card-pad" style={{ padding: 16, borderInlineStart: accent ? "3px solid " + accent : undefined }}>
      {title && <div className="flex" style={{ alignItems: "center", gap: 7, marginBottom: 11 }}>{icon && <Icon name={icon} size={14} style={{ color: accent || "var(--text-2)" }} fill={icon === "sparkles"} />}<h3 style={{ fontSize: 13 }}>{title}</h3></div>}
      {children}
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">{T("Screening Agents", "وكلاء الفرز")}</h1>
          <div className="page-sub">{T("Active calls happening right now. You can listen in or step in if needed.", "مكالمات نشطة الآن. يمكنك الاستماع أو التدخّل عند الحاجة.")}</div>
        </div>
        <div className="spacer" />
        <select className="select" style={{ width: "auto", height: 38 }}><option>{T("All jobs", "كل الوظائف")}</option></select>
      </div>
      <ScreeningSubnav active="screening-live" go={go} T={T} ar={ar} />

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: "var(--gap)" }}>
        <Stat icon="phone" label={T("Active now", "نشطة الآن")} value="3" color="var(--success)" />
        <Stat icon="check" label={T("Completed today", "اكتملت اليوم")} value="12" color="var(--accent)" />
        <Stat icon="clock" label={T("Avg duration today", "متوسط المدة اليوم")} value={T("14:28", "14:28")} color="var(--ai)" />
        <Stat icon="sparkles" label={T("Avg AI confidence", "متوسط ثقة الذكاء")} value="4.2" unit="/ 5" color="var(--purple)" />
      </div>

      {/* active calls */}
      <div className="grid">
        {calls.map(call => {
          const open = expanded === call.id;
          return (
            <div key={call.id} className="card" style={{ overflow: "hidden" }}>
              <button className="flex" style={{ width: "100%", alignItems: "center", gap: 13, padding: "14px 18px", textAlign: "start" }} onClick={() => setExpanded(open ? null : call.id)}>
                <Avatar c={call} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{call.name[ar ? "ar" : "en"]}</div>
                  <div className="faint" style={{ fontSize: 12 }}>{call.role} · {T("Started", "بدأت")} {call.started} · {call.channel} · {call.callLang}</div>
                </div>
                {!open && <span className="faint" style={{ fontSize: 12.5 }}>{T("Goals", "الأهداف")}: {call.goals}/5</span>}
                <span className="flex" style={{ alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--success)" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", animation: "scl-pulse 1.4s ease-in-out infinite" }} />LIVE</span>
                <span className="faint" style={{ fontSize: 12 }}>{call.quality}</span>
                <Icon name={open ? "chevDown" : (ar ? "chevLeft" : "chevRight")} size={16} style={{ color: "var(--text-3)" }} />
              </button>
              <style>{`@keyframes scl-pulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes scl-dots{0%,100%{opacity:.3}50%{opacity:1}}`}</style>

              {open && (
                <div style={{ borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 0 }}>
                  {/* transcript */}
                  <div style={{ padding: 18, borderInlineEnd: "1px solid var(--border)" }}>
                    <div className="flex" style={{ gap: 6, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
                      {[["all", T("All", "الكل")], ["ai", T("AI only", "الذكاء فقط")], ["cand", T("Candidate only", "المرشح فقط")]].map(([v, l]) => (
                        <button key={v} className={"btn btn-sm " + (tFilter === v ? "btn-primary" : "btn-subtle")} style={{ height: 27, fontSize: 12 }} onClick={() => setTFilter(v)}>{l}</button>
                      ))}
                      <div className="spacer" style={{ flex: 1 }} />
                      <button className="flex" onClick={() => setAutoScroll(a => !a)} style={{ alignItems: "center", gap: 5, fontSize: 11.5, color: autoScroll ? "var(--accent)" : "var(--text-3)", fontWeight: 600 }}><Icon name={autoScroll ? "pause" : "play"} size={12} />{autoScroll ? T("Auto-scrolling", "تمرير تلقائي") : T("Paused", "متوقف")}</button>
                    </div>
                    <div ref={transRef} style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                      {tf.map((l, i) => (
                        <div key={i} style={{ textAlign: l.who === "cand" ? "end" : "start" }}>
                          <div className="flex" style={{ gap: 6, alignItems: "center", marginBottom: 3, justifyContent: l.who === "cand" ? "flex-end" : "flex-start" }}>
                            {l.who === "ai" && <Icon name="sparkles" size={11} fill style={{ color: "var(--accent)" }} />}
                            <span className="faint" style={{ fontSize: 11, fontWeight: 600 }}>{l.who === "ai" ? T("AI", "الذكاء") : call.name[ar ? "ar" : "en"].split(" ")[0]} · {l.ts}</span>
                            {l.live && <span style={{ display: "inline-flex", gap: 2 }}>{[0, 1, 2].map(d => <span key={d} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--success)", animation: `scl-dots 1s ease-in-out ${d * 0.15}s infinite` }} />)}</span>}
                          </div>
                          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: l.who === "cand" ? "var(--text)" : "var(--text-2)" }}>{l.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* insights */}
                  <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12, background: "var(--surface-2)" }}>
                    <Mini title={T("Call progress", "تقدّم المكالمة")}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {goals.map((g, i) => (
                          <div key={i} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 12.5, color: g.done ? "var(--text)" : "var(--text-3)" }}>
                            <span style={{ width: 15, height: 15, borderRadius: "50%", flex: "0 0 auto", display: "grid", placeItems: "center", background: g.done ? "var(--success)" : "transparent", border: g.done ? "none" : "1.5px solid var(--border-strong)" }}>{g.done && <Icon name="check" size={9} style={{ color: "#fff" }} />}</span>
                            <span style={{ flex: 1, fontWeight: g.prog ? 600 : 400 }}>{g.l}</span>
                            {g.prog && <span className="badge badge-accent" style={{ height: 16, fontSize: 9.5 }}>{T("now", "الآن")}</span>}
                          </div>
                        ))}
                      </div>
                    </Mini>
                    <Mini title={T("AI thinks so far…", "ما يراه الذكاء…")} icon="sparkles" accent="var(--ai)">
                      <ul style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--text-2)", paddingInlineStart: 16, margin: 0 }}>
                        <li>{T("Candidate has strong React depth", "عمق قوي في React")}</li>
                        <li>{T("Communication is clear and structured", "تواصل واضح ومنظّم")}</li>
                        <li>{T("Salary expectation not yet captured", "لم تُسجَّل توقعات الراتب بعد")}</li>
                      </ul>
                      <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, color: "var(--success)" }}>{T("Tentative: Advance (4.5/5)", "مبدئياً: التقدّم (4.5/5)")}</div>
                    </Mini>
                    <Mini title={T("Audio", "الصوت")}>
                      <button className={"btn btn-sm " + (listen ? "btn-primary" : "btn-subtle")} style={{ width: "100%", marginBottom: listen ? 10 : 0 }} onClick={() => setListen(l => !l)}><Icon name="headphones" size={14} />{listen ? T("Listening (silent)", "أستمع (صامت)") : T("Listen in (silent mode)", "استمع (وضع صامت)")}</button>
                      {listen && <div className="flex" style={{ alignItems: "center", gap: 8 }}><Icon name="mic" size={14} style={{ color: "var(--text-3)" }} /><input type="range" defaultValue="70" style={{ flex: 1, accentColor: "var(--accent)" }} /></div>}
                    </Mini>
                    <Mini title={T("Quick actions", "إجراءات سريعة")}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button className="btn btn-subtle btn-sm" style={{ justifyContent: "flex-start", gap: 8 }} onClick={() => setSuggest(true)}><Icon name="sparkles" size={13} style={{ color: "var(--ai)" }} />{T("Suggest a follow-up question", "اقترح سؤال متابعة")}</button>
                        <button className="btn btn-subtle btn-sm" style={{ justifyContent: "flex-start", gap: 8 }} onClick={() => toast(T("Asked AI to repeat", "طُلب من الذكاء الإعادة"))}><Icon name="refresh" size={13} />{T("Repeat the last question", "أعد آخر سؤال")}</button>
                        <button className="btn btn-subtle btn-sm" style={{ justifyContent: "flex-start", gap: 8 }} onClick={() => toast(T("Moment flagged for review", "وُسمت اللحظة للمراجعة"))}><Icon name="flag" size={13} style={{ color: "var(--warning)" }} />{T("Flag for review", "وسم للمراجعة")}</button>
                        <button className="btn btn-subtle btn-sm" style={{ justifyContent: "flex-start", gap: 8 }} onClick={() => toast(T("Private note added", "أُضيفت ملاحظة خاصة"))}><Icon name="edit" size={13} />{T("Add a private note", "أضف ملاحظة خاصة")}</button>
                      </div>
                      {suggest && (
                        <div style={{ marginTop: 10 }}>
                          <input className="input" value={suggestText} onChange={e => setSuggestText(e.target.value)} placeholder={T("Type a question for the AI to ask…", "اكتب سؤالاً ليطرحه الذكاء…")} style={{ height: 34, fontSize: 12.5 }} />
                          <div className="flex" style={{ gap: 6, marginTop: 6, justifyContent: "flex-end" }}>
                            <button className="btn btn-subtle btn-sm" onClick={() => setSuggest(false)}>{T("Cancel", "إلغاء")}</button>
                            <button className="btn btn-primary btn-sm" disabled={!suggestText.trim()} onClick={() => { setSuggest(false); setSuggestText(""); toast(T("Sent to AI", "أُرسل للذكاء")); }}>{T("Send", "إرسال")}</button>
                          </div>
                        </div>
                      )}
                    </Mini>
                    <Mini accent="var(--danger)">
                      <button className="btn btn-sm" style={{ width: "100%", background: "var(--danger-soft)", color: "var(--danger)", fontWeight: 600 }} onClick={() => setTakeover(call)}><Icon name="mic" size={14} />{T("Take over the call", "تولّي المكالمة")}</button>
                      <div className="faint" style={{ fontSize: 11, lineHeight: 1.5, marginTop: 8 }}>{T("The AI ends gracefully and you're patched in. Candidate hears: “I'm passing you to Layla, our recruiter, who has joined us.”", "ينهي الذكاء بلطف وتُوصَل بالمكالمة. يسمع المرشح: «سأحوّلك إلى ليلى، المسؤولة، التي انضمّت إلينا.»")}</div>
                    </Mini>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* just completed */}
      <div style={{ marginTop: "calc(var(--gap) + 6px)" }}>
        <h2 style={{ fontSize: 15, marginBottom: 12 }}>{T("Just completed (today)", "اكتملت اليوم")}</h2>
        <div className="card">
          {done.map((d, i) => (
            <div key={i} className="flex" style={{ alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < done.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span className="mono faint" style={{ fontSize: 12, flex: "0 0 64px" }}>{d.t}</span>
              <span style={{ fontWeight: 600, fontSize: 13.5, flex: "0 0 auto", minWidth: 130 }}>{d.n}</span>
              <span className="faint" style={{ fontSize: 12.5, flex: 1 }}>{d.r}</span>
              <span className="mono faint" style={{ fontSize: 12 }}>{d.dur}</span>
              <span className="badge" style={{ background: `color-mix(in oklch, ${d.color} 14%, var(--surface))`, color: d.color, height: 20 }}>{d.rec}</span>
              <button className="btn btn-subtle btn-sm" onClick={() => go("screening-review")}>{T("Review", "مراجعة")}<Icon name={ar ? "chevLeft" : "chevRight"} size={13} /></button>
            </div>
          ))}
        </div>
      </div>

      {takeover && (
        <div className="scrim" onClick={() => setTakeover(false)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{T("Take over this call?", "تولّي هذه المكالمة؟")}</div><button className="btn-icon btn-sm" onClick={() => setTakeover(false)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body"><p style={{ fontSize: 14, lineHeight: 1.65 }}>{T("The AI will wrap up its current question and hand off to you. The candidate will be told a human recruiter has joined. This can't be undone.", "سينهي الذكاء سؤاله الحالي ويحوّلك. سيُخبَر المرشح بانضمام مسؤول بشري. لا يمكن التراجع.")}</p></div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={() => setTakeover(false)}>{T("Cancel", "إلغاء")}</button><button className="btn btn-danger btn-sm" onClick={() => { setTakeover(false); toast(T("Patching you into the call…", "جارٍ توصيلك بالمكالمة…")); }}><Icon name="mic" size={14} />{T("Take over now", "تولّ الآن")}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

window.ScreeningLive = ScreeningLive;

export { ScreeningLive }
