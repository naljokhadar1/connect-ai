import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui';
import { Icon } from '../lib/icons';

/* Connect AI — AI Assessment Platform */

function Assessments({ id, cands, go }) {
  const { t, L, lang } = useApp();
  const ranked = cands.filter(c => c.assess > 0).sort((a, b) => b.assess - a.assess);
  const [sel, setSel] = React.useState(id && cands.find(c => c.id === id && c.assess) ? id : (ranked[0] && ranked[0].id));
  const c = cands.find(x => x.id === sel) || ranked[0];

  const sections = lang === "ar"
    ? [{ l: "اختيار من متعدد", w: 1 }, { l: "أسئلة تقنية", w: -2 }, { l: "اختبار برمجي", w: 3 }, { l: "إجابات مكتوبة", w: -1 }, { l: "اختبار سيكومتري", w: 2 }]
    : [{ l: "Multiple Choice", w: 1 }, { l: "Technical", w: -2 }, { l: "Coding Test", w: 3 }, { l: "Written Response", w: -1 }, { l: "Psychometric", w: 2 }];
  const secScores = sections.map(s => ({ ...s, v: Math.max(40, Math.min(99, c.assess + s.w * 3)) }));
  const pass = c.assess >= 80;

  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">{t("as.title")}</h1><div className="page-sub">{t("as.sub")}</div></div>
        <div className="spacer" />
        <button className="btn btn-ghost"><Icon name="download" size={16} />{t("common.export")}</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "320px 1fr", alignItems: "start" }}>
        {/* ranking */}
        <div className="card">
          <div className="card-head"><h3>{t("as.ranking")}</h3><span className="spacer" style={{ flex: 1 }} /><span className="badge badge-neutral">{ranked.length}</span></div>
          <div style={{ padding: "6px" }}>
            {ranked.map((r, i) => (
              <button key={r.id} onClick={() => setSel(r.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: "var(--r-sm)",
                background: sel === r.id ? "var(--accent-soft)" : "transparent", textAlign: "start" }}>
                <span className="mono" style={{ width: 22, fontWeight: 700, fontSize: 13, color: i < 3 ? "var(--accent-strong)" : "var(--text-3)" }}>{i + 1}</span>
                <Avatar c={r} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{L(r.name)}</div>
                  <div className="faint" style={{ fontSize: 11.5 }}>{t("as.percentile")} {r.percentile}</div>
                </div>
                <span className="mono" style={{ fontWeight: 700, fontSize: 15, color: r.assess >= 90 ? "var(--success)" : "var(--purple)" }}>{r.assess}</span>
              </button>
            ))}
          </div>
        </div>

        {/* detail */}
        <div className="grid">
          <div className="card card-pad">
            <div className="flex" style={{ gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <Avatar c={c} size={56} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div className="flex" style={{ alignItems: "center", gap: 9 }}>
                  <h3 style={{ fontSize: 18 }}>{L(c.name)}</h3><StageBadge stage={c.stage} />
                </div>
                <div className="muted" style={{ fontSize: 13 }}>{L(c.title)}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => go("candidate", { id: c.id, from: "pipeline" })}>{t("common.openProfile")}<Icon name={lang === "ar" ? "chevLeft" : "chevRight"} size={15} /></button>
            </div>
            <hr className="divider" style={{ margin: "18px 0" }} />
            <div className="flex" style={{ gap: 28, alignItems: "center", flexWrap: "wrap" }}>
              <div className="flex" style={{ flexDirection: "column", alignItems: "center", gap: 6 }}>
                <ScoreRing value={c.assess} size={104} stroke={9} color="var(--purple)" sub={t("as.overall")} />
              </div>
              <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 14 }}>
                <ComparisonRow label={t("as.benchmark")} a={c.assess} b={74} />
                <div className="flex" style={{ gap: 22, flexWrap: "wrap" }}>
                  <MiniMetric label={t("as.percentile")} value={c.percentile + (lang === "ar" ? "" : "th")} icon="trending" />
                  <MiniMetric label={t("as.timeTaken")} value={lang === "ar" ? "42 دقيقة" : "42 min"} icon="clock" />
                  <MiniMetric label={t("as.integrity")} value={t("as.passed")} icon="shield" good />
                </div>
              </div>
            </div>
          </div>

          {/* recommendation */}
          <div className="card card-pad flex" style={{ gap: 13, alignItems: "center",
            background: pass ? "var(--success-soft)" : "var(--warning-soft)", borderColor: pass ? "color-mix(in oklch, var(--success) 35%, transparent)" : "color-mix(in oklch, var(--warning) 35%, transparent)" }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: pass ? "var(--success)" : "var(--warning)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name={pass ? "thumb" : "flag"} size={20} /></span>
            <div style={{ flex: 1 }}>
              <div className="flex" style={{ alignItems: "center", gap: 7 }}><Icon name="sparkles" size={14} fill style={{ color: pass ? "var(--success)" : "var(--warning)" }} /><span style={{ fontSize: 12, fontWeight: 600, color: pass ? "var(--success)" : "var(--warning)" }}>{t("as.recommendation")}</span></div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{pass ? t("as.pass") : t("as.review")}</div>
            </div>
          </div>

          {/* section breakdown */}
          <div className="card">
            <div className="card-head"><h3>{t("as.sections")}</h3></div>
            <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              {secScores.map((s, i) => (
                <div key={i}>
                  <div className="flex" style={{ justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                    <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{s.l}</span>
                    <span className="mono" style={{ fontWeight: 600, color: s.v >= 85 ? "var(--success)" : s.v >= 70 ? "var(--accent)" : "var(--warning)" }}>{s.v}%</span>
                  </div>
                  <Bar value={s.v} color={s.v >= 85 ? "var(--success)" : s.v >= 70 ? "var(--purple)" : "var(--warning)"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ label, a, b }) {
  const { lang } = useApp();
  return (
    <div>
      <div className="flex" style={{ justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
        <span className="muted">{label}: <span className="mono" style={{ fontWeight: 600 }}>{b}%</span></span>
        <span className="mono" style={{ fontWeight: 700, color: "var(--success)" }}>+{a - b} {lang === "ar" ? "نقطة" : "pts"}</span>
      </div>
      <div style={{ position: "relative", height: 8, borderRadius: 20, background: "var(--surface-3)" }}>
        <div style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: a + "%", background: "var(--purple)", borderRadius: 20 }} />
        <div style={{ position: "absolute", insetInlineStart: b + "%", top: -3, bottom: -3, width: 2, background: "var(--text)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, icon, good }) {
  return (
    <div>
      <div className="faint flex" style={{ alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, marginBottom: 3, whiteSpace: "nowrap" }}><Icon name={icon} size={13} />{label}</div>
      <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: good ? "var(--success)" : "var(--text)" }}>{value}</div>
    </div>
  );
}

export { Assessments };
