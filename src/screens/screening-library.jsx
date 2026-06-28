import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Screening Agents Library (browse + create entry point) */

function ScreeningSubnav({ active, go, T, ar }) {
  const items = [["screening", T("Agents library", "مكتبة الوكلاء")], ["screening-live", T("Live monitoring", "المراقبة المباشرة")], ["screening-done", T("Completed calls", "المكالمات المكتملة")]];
  return (
    <div className="ptabs" style={{ marginBottom: "var(--gap)" }}>
      {items.map(([id, l]) => <button key={id} className={active === id ? "on" : ""} onClick={() => go(id)}>{l}</button>)}
    </div>
  );
}

function ScreeningLibrary({ go, toast }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [q, setQ] = React.useState("");
  const [fType, setFType] = React.useState("all");
  const [fStatus, setFStatus] = React.useState("all");
  const [startersOpen, setStartersOpen] = React.useState(true);

  const TYPES = { technical: ["var(--accent)", T("Technical", "تقني")], functional: ["var(--ai)", T("Functional", "وظيفي")], behavioral: ["var(--warning)", T("Behavioral", "سلوكي")], generic: ["var(--text-3)", T("Generic", "عام")] };
  const TypePill = ({ t }) => <span className="badge" style={{ background: `color-mix(in oklch, ${TYPES[t][0]} 14%, var(--surface))`, color: TYPES[t][0], height: 20 }}>{TYPES[t][1]}</span>;

  const starters = [
    { id: "s1", type: "technical", name: T("Senior Engineering Screen", "فرز الهندسة الأول"), desc: T("15-minute screen covering technical depth, leadership, and motivation.", "فرز 15 دقيقة يغطّي العمق التقني والقيادة والدافع."), goals: 5, min: 15, langs: "EN/AR" },
    { id: "s2", type: "technical", name: T("Mid-Level Engineering Screen", "فرز الهندسة المتوسط"), desc: T("Lighter screen for mid-level engineers. Fundamentals and recent project work.", "فرز أخفّ للمهندسين المتوسطين. الأساسيات والمشاريع الأخيرة."), goals: 4, min: 12, langs: "EN/AR" },
    { id: "s3", type: "functional", name: T("Sales Screen — Outbound", "فرز المبيعات الصادرة"), desc: T("Screen for outbound sales reps. Pipeline management and motivation.", "فرز لمندوبي المبيعات الصادرة. إدارة الصفقات والدافع."), goals: 5, min: 15, langs: "EN" },
    { id: "s4", type: "functional", name: T("Customer Service Screen", "فرز خدمة العملاء"), desc: T("High-volume screen for customer service hires. Experience and communication.", "فرز عالي الحجم لخدمة العملاء. الخبرة والتواصل."), goals: 4, min: 10, langs: "EN/AR" },
    { id: "s5", type: "generic", name: T("Generic Knockout Screen", "فرز الاستبعاد العام"), desc: T("Just knockout questions — work auth, notice period, salary.", "أسئلة استبعاد فقط — تصريح العمل، الإشعار، الراتب."), goals: 3, min: 5, langs: "EN/AR" },
    { id: "s6", type: "behavioral", name: T("Internal Mobility Screen", "فرز التنقّل الداخلي"), desc: T("For internal transfers. Motivation, fit with new team, growth context.", "للتنقلات الداخلية. الدافع والملاءمة والنمو."), goals: 4, min: 12, langs: "EN/AR" },
  ];
  const mine = [
    { id: "m1", type: "technical", status: "live", name: T("Engineering Senior Screen", "فرز الهندسة الأول"), sub: T("Customized · 6 goals · 15 min · EN/AR", "مخصّص · 6 أهداف · 15 د · EN/AR"), stats: T("Linked to 4 jobs · 47 calls · 91% agreement", "4 وظائف · 47 مكالمة · 91% اتفاق"), mod: T("Modified 2 days ago", "عُدّل قبل يومين") },
    { id: "m2", type: "functional", status: "live", name: T("Saudi-First Customer Service", "خدمة عملاء بالعربية أولاً"), sub: T("Customized · 5 goals · 10 min · AR", "مخصّص · 5 أهداف · 10 د · AR"), stats: T("Linked to 2 jobs · 23 calls · 88% agreement", "وظيفتان · 23 مكالمة · 88% اتفاق"), mod: T("Modified 1 week ago", "عُدّل قبل أسبوع") },
    { id: "m3", type: "behavioral", status: "live", name: T("Engineering Leadership Screen", "فرز القيادة الهندسية"), sub: T("Customized · 5 goals · 20 min · EN", "مخصّص · 5 أهداف · 20 د · EN"), stats: T("Linked to 1 job · 8 calls · 100% agreement", "وظيفة · 8 مكالمات · 100% اتفاق"), mod: T("Modified 3 weeks ago", "عُدّل قبل 3 أسابيع") },
    { id: "m4", type: "technical", status: "draft", name: T("Data Engineer Screen", "فرز مهندس البيانات"), sub: T("Draft · 3 goals · ~15 min · EN", "مسودة · 3 أهداف · ~15 د · EN"), stats: T("Not yet launched", "لم يُطلق بعد"), mod: T("Modified yesterday", "عُدّل أمس"), foot: T("Complete draft to launch", "أكمل المسودة للإطلاق") },
    { id: "m5", type: "technical", status: "paused", name: T("Old Frontend Screen", "فرز الواجهات القديم"), sub: T("Customized · 4 goals · 15 min · EN", "مخصّص · 4 أهداف · 15 د · EN"), stats: T("Linked to 0 jobs · 12 historical calls", "0 وظيفة · 12 مكالمة سابقة"), mod: T("Modified 2 months ago", "عُدّل قبل شهرين"), foot: T("Paused — replace or archive?", "متوقف — استبدل أو أرشِف؟") },
  ];
  const statusDot = { live: "var(--success)", draft: "var(--warning)", paused: "var(--text-3)" };
  const statusLabel = { live: T("Live", "مباشر"), draft: T("Draft", "مسودة"), paused: T("Paused", "متوقف") };

  const match = (a) => (!q || a.name.toLowerCase().includes(q.toLowerCase())) && (fType === "all" || a.type === fType);
  const matchStatus = (a) => fStatus === "all" || a.status === fStatus;
  const fStarters = starters.filter(match);
  const fMine = mine.filter(a => match(a) && matchStatus(a));

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">{T("Screening Agents", "وكلاء الفرز")}</h1>
          <div className="page-sub">{T("AI agents that conduct first-round screening calls. Build once, link to many jobs.", "وكلاء ذكاء يجرون مكالمات الفرز الأولى. ابنِ مرة واربط بوظائف متعددة.")}</div>
        </div>
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={() => toast(T("Opening integrations…", "فتح التكاملات…"))}><Icon name="plug" size={15} />{T("Manage integrations", "إدارة التكاملات")}</button>
        <button className="btn btn-primary" onClick={() => go("screening-wizard")}><Icon name="plus" size={16} />{T("New agent", "وكيل جديد")}</button>
      </div>

      <ScreeningSubnav active="screening" go={go} T={T} ar={ar} />

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: "var(--gap)" }}>
        <Stat icon="users" label={T("Total agents", "إجمالي الوكلاء")} value="6" color="var(--accent)" />
        <Stat icon="check" label={T("Active", "نشط")} value="4" color="var(--success)" />
        <Stat icon="link2" label={T("Linked to jobs", "مرتبط بوظائف")} value="11" color="var(--ai)" />
        <Stat icon="phone" label={T("Calls this month", "مكالمات الشهر")} value="142" color="var(--purple)" />
      </div>

      <div className="card card-pad flex" style={{ gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: "var(--gap)" }}>
        <div className="searchbar" style={{ height: 38, flex: "1 1 220px", maxWidth: 320 }}><Icon name="search" size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder={T("Search agents…", "ابحث عن وكلاء…")} /></div>
        <select className="select" style={{ height: 38, width: "auto" }} value={fType} onChange={e => setFType(e.target.value)}><option value="all">{T("All types", "كل الأنواع")}</option>{Object.keys(TYPES).map(k => <option key={k} value={k}>{TYPES[k][1]}</option>)}</select>
        <select className="select" style={{ height: 38, width: "auto" }}><option>{T("All languages", "كل اللغات")}</option></select>
        <select className="select" style={{ height: 38, width: "auto" }} value={fStatus} onChange={e => setFStatus(e.target.value)}><option value="all">{T("All statuses", "كل الحالات")}</option><option value="live">{T("Live", "مباشر")}</option><option value="paused">{T("Paused", "متوقف")}</option><option value="draft">{T("Draft", "مسودة")}</option></select>
      </div>

      {/* starters */}
      <button className="flex" style={{ alignItems: "center", gap: 8, width: "100%", textAlign: "start" }} onClick={() => setStartersOpen(o => !o)}>
        <Icon name={startersOpen ? "chevDown" : (ar ? "chevLeft" : "chevRight")} size={16} style={{ color: "var(--text-3)", flex: "0 0 auto" }} />
        <h2 style={{ fontSize: 16 }}>{T("Starter templates", "قوالب جاهزة")}</h2>
        <span className="faint" style={{ fontSize: 12.5 }}>{fStarters.length}</span>
      </button>
      {startersOpen && <p className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 14 }}>{T("Pre-built by Connect AI. Pick one to start the wizard with a draft.", "مبنية مسبقاً. اختر واحداً لبدء المعالج بمسودة.")}</p>}
      {startersOpen && <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", marginBottom: "calc(var(--gap) + 6px)" }}>
        {fStarters.map(a => <StarterCard key={a.id} a={a} TypePill={TypePill} T={T} go={go} />)}
      </div>}
      {!startersOpen && <div style={{ marginBottom: "calc(var(--gap) + 6px)" }} />}

      {/* mine */}
      <div className="flex" style={{ alignItems: "baseline", gap: 10, marginBottom: 14 }}>
        <h2 style={{ fontSize: 16 }}>{T("Your agents", "وكلاؤك")}</h2>
        <span className="faint" style={{ fontSize: 12.5 }}>{T("5 agents · 4 active", "5 وكلاء · 4 نشطون")}</span>
      </div>
      {fMine.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: "center", padding: 44, color: "var(--text-3)" }}><Icon name="message" size={28} /><div style={{ fontWeight: 600, fontSize: 14, marginTop: 10, color: "var(--text)" }}>{T("No agents match", "لا وكلاء مطابقون")}</div><div style={{ fontSize: 13, marginTop: 4 }}>{T("Pick a starter above, or create from scratch.", "اختر قالباً أعلاه أو ابدأ من الصفر.")}</div></div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))" }}>
          {fMine.map(a => (
            <div key={a.id} className="card card-interactive" style={{ display: "flex", flexDirection: "column" }} onClick={() => go("screening-agent", a.status === "draft" ? { fresh: true } : {})}>
              <div className="card-pad" style={{ flex: 1 }}>
                <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 11 }}>
                  <span className="flex" style={{ alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: statusDot[a.status] }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: statusDot[a.status] }} />{statusLabel[a.status]}</span>
                  <TypePill t={a.type} />
                  <div className="spacer" style={{ flex: 1 }} />
                  <div onClick={e => e.stopPropagation()}><Kebab items={[{ icon: "edit", label: T("Edit", "تحرير"), onClick: () => go("screening-agent") }, { icon: "copy", label: T("Duplicate", "تكرار") }, { icon: a.status === "paused" ? "play" : "pause", label: a.status === "paused" ? T("Resume", "استئناف") : T("Pause", "إيقاف") }, { icon: "archive", label: T("Archive", "أرشفة"), danger: true }]} /></div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 5 }}>{a.name}</div>
                <div className="faint" style={{ fontSize: 12, marginBottom: 10 }}>{a.sub}</div>
                <div className="faint" style={{ fontSize: 11.5, lineHeight: 1.5 }}>{a.stats}</div>
              </div>
              <div className="flex" style={{ alignItems: "center", padding: "10px 16px", borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}>
                {a.foot ? <a style={{ fontSize: 12, fontWeight: 600, cursor: "pointer", color: a.status === "draft" ? "var(--accent-strong)" : "var(--text-3)" }} onClick={e => { e.stopPropagation(); go("screening-agent", a.status === "draft" ? { fresh: true } : {}); }}>{a.foot}{a.status === "draft" ? " →" : ""}</a> : <span className="faint" style={{ fontSize: 11.5 }}>{a.mod}</span>}
              </div>
            </div>
          ))}
          {/* create from scratch */}
          <button className="card" style={{ border: "2px dashed var(--border-strong)", background: "transparent", display: "grid", placeItems: "center", minHeight: 180, cursor: "pointer", color: "var(--text-2)" }} onClick={() => go("screening-wizard")}>
            <div style={{ textAlign: "center" }}><Icon name="plus" size={24} /><div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 8 }}>{T("Create a new agent", "إنشاء وكيل جديد")}</div><div className="faint" style={{ fontSize: 11.5, marginTop: 3 }}>{T("Opens the setup wizard", "يفتح معالج الإعداد")}</div></div>
          </button>
        </div>
      )}
    </div>
  );
}

function StarterCard({ a, TypePill, T, go }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div className="card card-interactive" style={{ padding: 0, display: "flex", flexDirection: "column", background: "var(--surface-2)" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => go("screening-wizard")}>
      <div className="card-pad" style={{ flex: 1, padding: 16 }}>
        <div className="flex" style={{ alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
          <TypePill t={a.type} />
          <div className="spacer" style={{ flex: 1 }} />
          <span className="badge badge-neutral" style={{ height: 19, fontSize: 10.5 }}>{T("Starter", "جاهز")}</span>
        </div>
        <div style={{ fontWeight: 500, fontSize: 14.5, marginBottom: 6 }}>{a.name}</div>
        <p className="muted" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.desc}</p>
        <div className="faint" style={{ fontSize: 11.5 }}>{a.goals} {T("goals", "أهداف")} · ~{a.min} {T("min", "د")} · {a.langs}</div>
      </div>
      {hover && <div style={{ padding: "0 16px 14px" }}><button className="btn btn-primary btn-sm" style={{ width: "100%" }} onClick={e => { e.stopPropagation(); go("screening-wizard"); }}>{T("Use this template", "استخدم هذا القالب")} →</button></div>}
    </div>
  );
}

/* ===== Completed calls ===== */
function ScreeningDone({ go, toast }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [q, setQ] = React.useState("");
  const recColor = { strong: "var(--success)", mixed: "var(--warning)", followup: "var(--text-3)", reject: "var(--danger)" };
  const rows = [
    { d: T("Today · 10:42 AM", "اليوم · 10:42 ص"), n: "Fatima Al-Shamsi", r: T("Senior Frontend Engineer", "مهندسة واجهات أولى"), dur: "15:23", lang: "EN", conf: 4.6, rec: "strong", recL: T("Strong", "قوي") },
    { d: T("Today · 10:15 AM", "اليوم · 10:15 ص"), n: "Omar Al-Rahman", r: T("Backend Engineer", "مهندس خادم"), dur: "18:14", lang: "EN", conf: 3.4, rec: "mixed", recL: T("Mixed", "متباين") },
    { d: T("Today · 9:33 AM", "اليوم · 9:33 ص"), n: "Noura Hassan", r: T("Product Designer", "مصمّمة منتجات"), dur: T("4:21 · early", "4:21 · مبكر"), lang: "AR", conf: null, rec: "followup", recL: T("Needs follow-up", "تحتاج متابعة") },
    { d: T("Yesterday · 4:12 PM", "أمس · 4:12 م"), n: "Yousef Al-Qahtani", r: T("Data Analyst", "محلل بيانات"), dur: "12:50", lang: "EN", conf: 4.1, rec: "strong", recL: T("Strong", "قوي") },
    { d: T("Yesterday · 2:30 PM", "أمس · 2:30 م"), n: "Maryam Al-Otaibi", r: T("Sales Executive", "تنفيذية مبيعات"), dur: "11:08", lang: "AR", conf: 2.8, rec: "reject", recL: T("Below bar", "دون المستوى") },
  ];
  const f = rows.filter(r => !q || r.n.toLowerCase().includes(q.toLowerCase()) || r.r.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <div className="page-head"><div><h1 className="page-title">{T("Screening Agents", "وكلاء الفرز")}</h1><div className="page-sub">{T("Completed AI screening calls across all jobs.", "مكالمات الفرز المكتملة عبر كل الوظائف.")}</div></div></div>
      <ScreeningSubnav active="screening-done" go={go} T={T} ar={ar} />
      <div className="card card-pad flex" style={{ gap: 10, alignItems: "center", marginBottom: "var(--gap)" }}>
        <div className="searchbar" style={{ height: 38, flex: "1 1 220px", maxWidth: 320 }}><Icon name="search" size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder={T("Search by candidate or role…", "ابحث بالمرشح أو الدور…")} /></div>
        <div className="spacer" style={{ flex: 1 }} />
        <select className="select" style={{ height: 38, width: "auto" }}><option>{T("All jobs", "كل الوظائف")}</option></select>
        <select className="select" style={{ height: 38, width: "auto" }}><option>{T("All recommendations", "كل التوصيات")}</option></select>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>{T("When", "متى")}</th><th>{T("Candidate", "المرشح")}</th><th>{T("Role", "الدور")}</th><th>{T("Duration", "المدة")}</th><th>{T("Lang", "اللغة")}</th><th>{T("AI confidence", "ثقة الذكاء")}</th><th>{T("Recommendation", "التوصية")}</th><th></th></tr></thead>
          <tbody>
            {f.map((r, i) => (
              <tr key={i} onClick={() => go("screening-review")}>
                <td className="faint" style={{ whiteSpace: "nowrap" }}>{r.d}</td>
                <td style={{ fontWeight: 600 }}>{r.n}</td>
                <td className="faint">{r.r}</td>
                <td className="mono">{r.dur}</td>
                <td><span className="badge badge-neutral" style={{ height: 19 }}>{r.lang}</span></td>
                <td>{r.conf != null ? <span className="mono" style={{ fontWeight: 600 }}>{r.conf}<span className="faint" style={{ fontWeight: 400 }}> / 5</span></span> : <span className="faint">—</span>}</td>
                <td><span className="badge" style={{ background: `color-mix(in oklch, ${recColor[r.rec]} 14%, var(--surface))`, color: recColor[r.rec], height: 20 }}>{r.recL}</span></td>
                <td style={{ textAlign: "end" }}><button className="btn btn-subtle btn-sm" onClick={e => { e.stopPropagation(); go("screening-review"); }}>{T("Review", "مراجعة")}<Icon name={ar ? "chevLeft" : "chevRight"} size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { ScreeningSubnav, ScreeningLibrary, StarterCard, ScreeningDone }
