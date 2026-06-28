import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge, ToastHost } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Executive Dashboard */

function Dashboard({ go }) {
  const { t, L, lang } = useApp();
  const D = window.DATA;

  const funnel = [
    { k: "stage.applied", v: 642, c: "var(--text-3)" },
    { k: "stage.screening", v: 318, c: "var(--info)" },
    { k: "stage.assessment", v: 196, c: "var(--purple)" },
    { k: "stage.aiInterview", v: 112, c: "var(--ai)" },
    { k: "stage.offer", v: 38, c: "var(--warning)" },
    { k: "stage.hired", v: 21, c: "var(--success)" },
  ];
  const fmax = funnel[0].v;

  const recs = [
    { icon: "target", color: "var(--accent)",
      tEn: "3 strong matches idle in screening", tAr: "3 مرشحين أقوياء متوقفون في الفرز",
      dEn: "Senior Frontend Engineer candidates scoring 86%+ haven't advanced in 4 days.", dAr: "مرشحو مهندس واجهات أول بنسبة 86%+ لم يتقدموا منذ 4 أيام.",
      ctaEn: "Review now", ctaAr: "مراجعة الآن", to: "pipeline" },
    { icon: "zap", color: "var(--ai)",
      tEn: "Re-engage 12 silver-medalists", tAr: "إعادة التواصل مع 12 مرشحاً بديلاً",
      dEn: "Past finalists match 2 new open roles in Data & AI.", dAr: "مرشحون نهائيون سابقون يطابقون وظيفتين جديدتين في البيانات والذكاء.",
      ctaEn: "View talent pool", ctaAr: "عرض المواهب", to: null },
    { icon: "clock", color: "var(--warning)",
      tEn: "Financial Analyst offer expiring", tAr: "عرض المحلل المالي ينتهي قريباً",
      dEn: "Fatima Al-Shamsi's offer needs approval within 2 days.", dAr: "عرض فاطمة الشامسي يحتاج اعتماداً خلال يومين.",
      ctaEn: "Open offers", ctaAr: "فتح العروض", to: "offers" },
  ];

  const interviews = [
    { c: D.candidates[4], role: { en: "Sr. Frontend Engineer", ar: "مهندس واجهات أول" }, when: { en: "Today · 2:30 PM", ar: "اليوم · 2:30 م" }, type: { en: "Technical", ar: "تقنية" }, tag: "techInterview" },
    { c: D.candidates[7], role: { en: "Data Scientist", ar: "عالم بيانات" }, when: { en: "Today · 4:00 PM", ar: "اليوم · 4:00 م" }, type: { en: "AI Interview review", ar: "مراجعة مقابلة الذكاء" }, tag: "aiInterview" },
    { c: D.candidates[0], role: { en: "Senior Product Manager", ar: "مدير منتجات أول" }, when: { en: "Tomorrow · 11:00 AM", ar: "غداً · 11:00 ص" }, type: { en: "Hiring Manager", ar: "مدير التوظيف" }, tag: "hrInterview" },
  ];

  const attention = [
    { job: D.jobs[3], reason: { en: "Offer pending 3 days", ar: "العرض معلّق منذ 3 أيام" }, sev: "warning" },
    { job: D.jobs[5], reason: { en: "0 candidates in screening", ar: "لا مرشحين في الفرز" }, sev: "danger" },
    { job: D.jobs[1], reason: { en: "142 unreviewed applicants", ar: "142 متقدماً دون مراجعة" }, sev: "info" },
  ];

  const trend = [38, 52, 47, 63, 58, 72, 84, 79, 96, 88, 104, 112];
  const hires = [4, 6, 5, 7, 6, 8, 9, 8, 11, 10, 12, 14];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t("dash.greeting")}</h1>
          <div className="page-sub">{t("dash.sub")}</div>
        </div>
        <div className="spacer" />
        <div className="seg">
          <button className="on">{t("common.thisQuarter")}</button>
          <button>YTD</button>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={16} />{t("common.export")}</button>
      </div>

      {/* KPI row */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "var(--gap)" }}>
        <Stat icon="jobs" label={t("dash.openJobs")} value="34" delta={9} color="var(--accent)" spark={[20,24,22,28,30,29,34]} onClick={() => go("jobs")} />
        <Stat icon="users" label={t("dash.applications")} value="1,284" delta={18} color="var(--info)" spark={[800,920,870,1010,1120,1180,1284]} />
        <Stat icon="pipeline" label={t("dash.inPipeline")} value="327" delta={5} color="var(--purple)" spark={[260,280,300,290,310,320,327]} onClick={() => go("pipeline")} />
        <Stat icon="sparkles" label={t("dash.aiAccuracy")} value="94.2" unit="%" delta={3} color="var(--ai)" spark={[88,89,90,91,92,93,94]} />
      </div>

      {/* main grid */}
      <div className="grid" style={{ gridTemplateColumns: "1.55fr 1fr", alignItems: "start" }}>
        {/* LEFT column */}
        <div className="grid">
          {/* Funnel */}
          <div className="card">
            <div className="card-head">
              <h3>{t("dash.funnel")}</h3>
              <div className="spacer" />
              <span className="badge badge-ai"><Icon name="sparkles" size={11} fill /> {t("common.poweredAi")}</span>
            </div>
            <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {funnel.map((f, i) => {
                const pct = (f.v / fmax) * 100;
                const conv = i ? Math.round((f.v / funnel[i - 1].v) * 100) : 100;
                return (
                  <div key={i} className="fade-up" style={{ animationDelay: i * 50 + "ms" }}>
                    <div className="flex" style={{ alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 104, whiteSpace: "nowrap" }}>{t(f.k)}</span>
                      <span className="mono tnum" style={{ fontSize: 13, fontWeight: 700 }}>{f.v}</span>
                      {i > 0 && <span className="mono" style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap" }}>{conv}% {lang === "ar" ? "تحويل" : "conv."}</span>}
                    </div>
                    <div style={{ height: 26, borderRadius: 7, background: "var(--surface-3)", overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: `linear-gradient(90deg, ${f.c}, color-mix(in oklch, ${f.c} 70%, var(--surface)))`,
                        borderRadius: 7, transition: "width .9s cubic-bezier(.2,.8,.2,1)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance trend */}
          <div className="card">
            <div className="card-head">
              <h3>{t("dash.perfTrend")}</h3>
              <div className="spacer" />
              <span className="flex" style={{ gap: 14, fontSize: 12, color: "var(--text-2)", fontWeight: 600 }}>
                <span className="flex" style={{ alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />{t("dash.applications")}</span>
                <span className="flex" style={{ alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--success)" }} />{t("stage.hired")}</span>
              </span>
            </div>
            <div className="card-pad">
              <DualLine a={trend} b={hires} />
            </div>
          </div>

          {/* bottom KPIs */}
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <MiniStat label={t("dash.timeToHire")} value="28" unit={t("common.days")} delta={-12} good icon="clock" />
            <MiniStat label={t("dash.costPerHire")} value="9.4k" unit="SAR" delta={-6} good icon="offer" />
            <MiniStat label={t("dash.dropoff")} value="11" unit="%" delta={-4} good icon="trending" />
          </div>
        </div>

        {/* RIGHT column */}
        <div className="grid">
          {/* AI recommendations */}
          <div className="card" style={{ background: "linear-gradient(180deg, var(--ai-soft), var(--surface) 55%)" }}>
            <div className="card-head" style={{ borderColor: "transparent" }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--ai)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="sparkles" size={17} fill /></span>
              <h3>{t("dash.aiRecs")}</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {recs.map((r, i) => (
                <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: 14 }}>
                  <div className="flex" style={{ gap: 11 }}>
                    <span style={{ width: 30, height: 30, flex: "0 0 auto", borderRadius: 8, display: "grid", placeItems: "center",
                      background: `color-mix(in oklch, ${r.color} 14%, var(--surface))`, color: r.color }}><Icon name={r.icon} size={16} /></span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{lang === "ar" ? r.tAr : r.tEn}</div>
                      <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5 }}>{lang === "ar" ? r.dAr : r.dEn}</div>
                      <button className="btn btn-sm" style={{ marginTop: 9, padding: "0 10px", color: r.color, background: `color-mix(in oklch, ${r.color} 11%, transparent)` }}
                        onClick={() => r.to && go(r.to)}>
                        {lang === "ar" ? r.ctaAr : r.ctaEn}<Icon name={lang === "ar" ? "chevLeft" : "chevRight"} size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming interviews */}
          <div className="card">
            <div className="card-head"><h3>{t("dash.upcoming")}</h3><div className="spacer" /><a className="muted" style={{ fontSize: 12.5, fontWeight: 600 }} onClick={() => go("interviews")}>{t("common.viewAll")}</a></div>
            <div style={{ padding: "6px 8px" }}>
              {interviews.map((iv, i) => (
                <div key={i} className="flex" style={{ alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: "var(--r-sm)", cursor: "pointer" }}
                  onClick={() => go("candidate", { id: iv.c.id, from: "dashboard" })}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <Avatar c={iv.c} size={38} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{L(iv.c.name)}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{L(iv.role)} · {L(iv.type)}</div>
                  </div>
                  <div style={{ textAlign: lang === "ar" ? "left" : "right" }}>
                    <div className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--accent)" }}>{L(iv.when)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source of hire + Saudization */}
          <div className="card card-pad">
            <h3 style={{ fontSize: "var(--fs-lg)", marginBottom: 16 }}>{t("dash.sourceOfHire")}</h3>
            <div className="flex" style={{ gap: 18, alignItems: "center" }}>
              <Donut size={118} stroke={16} segments={[
                { value: 38, color: "var(--accent)" }, { value: 26, color: "var(--ai)" },
                { value: 18, color: "var(--purple)" }, { value: 18, color: "var(--text-3)" },
              ]} center={<div><div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>21</div><div style={{ fontSize: 10, color: "var(--text-3)" }}>{t("stage.hired")}</div></div>} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  { l: { en: "LinkedIn", ar: "لينكدإن" }, v: 38, c: "var(--accent)" },
                  { l: { en: "Referrals", ar: "الترشيحات" }, v: 26, c: "var(--ai)" },
                  { l: { en: "Career Portal", ar: "بوابة التوظيف" }, v: 18, c: "var(--purple)" },
                  { l: { en: "Bayt / Indeed", ar: "بيت / إنديد" }, v: 18, c: "var(--text-3)" },
                ].map((s, i) => (
                  <div key={i} className="flex" style={{ alignItems: "center", gap: 8, fontSize: 12.5 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: s.c }} />
                    <span style={{ flex: 1, fontWeight: 500 }}>{L(s.l)}</span>
                    <span className="mono" style={{ fontWeight: 600 }}>{s.v}%</span>
                  </div>
                ))}
              </div>
            </div>
            <hr className="divider" style={{ margin: "16px 0" }} />
            <div className="flex" style={{ alignItems: "center", gap: 12 }}>
              <ScoreRing value={72} size={52} stroke={5} color="var(--success)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t("dash.saudization")}</div>
                <div className="faint" style={{ fontSize: 12 }}>{lang === "ar" ? "الهدف 70% · نمتثل" : "Target 70% · compliant"}</div>
              </div>
              <div className="spacer" style={{ flex: 1 }} />
              <span className="badge badge-success"><Icon name="check" size={11} />{lang === "ar" ? "ممتثل" : "On track"}</span>
            </div>
          </div>

          {/* Jobs needing attention */}
          <div className="card">
            <div className="card-head"><h3>{t("dash.attention")}</h3></div>
            <div style={{ padding: "6px 8px" }}>
              {attention.map((a, i) => (
                <div key={i} className="flex" style={{ alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: "var(--r-sm)", cursor: "pointer" }}
                  onClick={() => go("pipeline", { job: a.job.id })}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: `var(--${a.sev})`, flex: "0 0 auto" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{L(a.job)}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{L(a.reason)}</div>
                  </div>
                  <Icon name={lang === "ar" ? "chevLeft" : "chevRight"} size={16} style={{ color: "var(--text-3)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit, delta, good, icon }) {
  return (
    <div className="card card-pad">
      <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon name={icon} size={16} style={{ color: "var(--text-3)" }} />
        <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 600 }}>{label}</span>
      </div>
      <div className="flex" style={{ alignItems: "baseline", gap: 4 }}>
        <span className="mono tnum" style={{ fontSize: 24, fontWeight: 600 }}>{value}</span>
        <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 600 }}>{unit}</span>
        {delta != null && (
          <span className="mono" style={{ marginInlineStart: "auto", fontSize: 12, fontWeight: 600, color: good ? "var(--success)" : "var(--danger)", display: "flex", alignItems: "center", gap: 2 }}>
            <Icon name={delta >= 0 ? "arrowUp" : "arrowDown"} size={12} />{Math.abs(delta)}%
          </span>
        )}
      </div>
    </div>
  );
}

/* dual line chart */
function DualLine({ a, b }) {
  const w = 640, h = 170, pad = 6;
  const max = Math.max(...a) * 1.1;
  const xs = (i, arr) => (i / (arr.length - 1)) * (w - pad * 2) + pad;
  const ys = v => h - pad - (v / max) * (h - pad * 2);
  const path = arr => arr.map((v, i) => (i ? "L" : "M") + xs(i, arr).toFixed(1) + " " + ys(v).toFixed(1)).join(" ");
  const [grow, setGrow] = React.useState(0);
  React.useEffect(() => { const id = setTimeout(() => setGrow(1), 40); return () => clearTimeout(id); }, []);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <defs><linearGradient id="dlg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" /><stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
      </linearGradient></defs>
      {[0.25, 0.5, 0.75].map((g, i) => <line key={i} x1={pad} x2={w - pad} y1={h * g} y2={h * g} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />)}
      <path d={path(a) + ` L${w - pad} ${h - pad} L${pad} ${h - pad} Z`} fill="url(#dlg)" style={{ opacity: grow }} />
      <path d={path(a)} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray: 2000, strokeDashoffset: 2000 * (1 - grow), transition: "stroke-dashoffset 1.1s ease" }} />
      <path d={path(b)} fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray: 2000, strokeDashoffset: 2000 * (1 - grow), transition: "stroke-dashoffset 1.1s ease .15s" }} />
    </svg>
  );
}

window.Dashboard = Dashboard;

export { Dashboard }
