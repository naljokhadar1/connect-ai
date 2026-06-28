/* Connect AI — shared UI primitives, context, data-viz */

const AppCtx = React.createContext(null);
const useApp = () => React.useContext(AppCtx);

/* ---------- Avatar ---------- */
function Avatar({ c, size = 38, ring }) {
  const fs = Math.round(size * 0.4);
  return (
    <div className={"avatar" + (ring ? " avatar-ring" : "")}
      style={{ width: size, height: size, background: c.avatar, fontSize: fs }}>
      {c.initials}
    </div>
  );
}

/* ---------- Score ring ---------- */
function ScoreRing({ value, size = 56, stroke = 5, color, label, sub }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const col = color || (value >= 85 ? "var(--success)" : value >= 70 ? "var(--accent)" : value >= 55 ? "var(--warning)" : "var(--danger)");
  const [dash, setDash] = React.useState(circ);
  React.useEffect(() => {
    const id = setTimeout(() => setDash(circ - (circ * value) / 100), 40);
    return () => clearTimeout(id);
  }, [value, circ]);
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}
          style={{ transition: "stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", lineHeight: 1 }}>
        <div style={{ textAlign: "center" }}>
          <div className="mono" style={{ fontSize: size * 0.3, fontWeight: 600, color: col }}>{value}</div>
          {sub && <div style={{ fontSize: 9, color: "var(--text-3)", fontWeight: 600 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Match pill ---------- */
function MatchPill({ value, sm }) {
  const col = value >= 90 ? "var(--success)" : value >= 80 ? "var(--accent)" : value >= 70 ? "var(--warning)" : "var(--text-3)";
  const bg = value >= 90 ? "var(--success-soft)" : value >= 80 ? "var(--accent-soft)" : value >= 70 ? "var(--warning-soft)" : "var(--surface-3)";
  const { t } = useApp();
  return (
    <span className="badge mono" style={{ background: bg, color: col, fontWeight: 700, height: sm ? 20 : 22, gap: 4 }}>
      <Icon name="sparkles" size={sm ? 11 : 12} fill /> {value}%
    </span>
  );
}

/* ---------- Progress bar ---------- */
function Bar({ value, color = "var(--accent)", h = 7, track = "var(--surface-3)" }) {
  const [w, setW] = React.useState(0);
  React.useEffect(() => { const id = setTimeout(() => setW(value), 40); return () => clearTimeout(id); }, [value]);
  return <div className="pbar" style={{ height: h, background: track }}><span style={{ width: w + "%", background: color }} /></div>;
}

/* ---------- Stat card ---------- */
function Stat({ icon, label, value, unit, delta, deltaGood = true, spark, color = "var(--accent)", onClick }) {
  return (
    <div className="card card-pad" style={{ cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden" }} onClick={onClick}>
      <div className="flex" style={{ alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center",
          background: `color-mix(in oklch, ${color} 13%, var(--surface))`, color }}>
          <Icon name={icon} size={18} />
        </div>
        <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-2)", fontWeight: 600 }}>{label}</div>
        {delta != null && (
          <div className="mono" style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600,
            color: deltaGood ? "var(--success)" : "var(--danger)" }}>
            <Icon name={delta >= 0 ? "arrowUp" : "arrowDown"} size={13} />{Math.abs(delta)}%
          </div>
        )}
      </div>
      <div className="flex" style={{ alignItems: "baseline", gap: 5 }}>
        <span className="mono tnum" style={{ fontSize: "var(--fs-stat)", fontWeight: 600, letterSpacing: "-.02em" }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600 }}>{unit}</span>}
      </div>
      {spark && <div style={{ marginTop: 12 }}><Sparkline data={spark} color={color} /></div>}
    </div>
  );
}

/* ---------- Sparkline ---------- */
function Sparkline({ data, color = "var(--accent)", w = 220, h = 38, fill = true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * w, h - ((d - min) / rng) * (h - 4) - 2]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  const gid = React.useId();
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" className="spark">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.22" /><stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Donut ---------- */
function Donut({ segments, size = 132, stroke = 18, center }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let off = 0;
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { const id = setTimeout(() => setShow(true), 40); return () => clearTimeout(id); }, []);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        {segments.map((s, i) => {
          const len = show ? (s.value / total) * circ : 0;
          const c = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color}
            strokeWidth={stroke} strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-off}
            style={{ transition: "stroke-dasharray .9s cubic-bezier(.2,.8,.2,1)" }} />;
          off += (s.value / total) * circ;
          return c;
        })}
      </svg>
      {center && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", lineHeight: 1.1 }}>{center}</div>}
    </div>
  );
}

/* ---------- Bars (vertical) ---------- */
function VBars({ data, color = "var(--accent)", h = 150, labels }) {
  const max = Math.max(...data.map(d => d.v)) || 1;
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { const id = setTimeout(() => setShow(true), 40); return () => clearTimeout(id); }, []);
  return (
    <div className="flex" style={{ alignItems: "flex-end", gap: 10, height: h }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
          <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)" }}>{d.v}</div>
          <div style={{ width: "100%", maxWidth: 38, height: show ? `${(d.v / max) * (h - 44)}px` : 0,
            background: d.color || color, borderRadius: "6px 6px 3px 3px", transition: `height .8s cubic-bezier(.2,.8,.2,1) ${i * 60}ms`, minHeight: 3 }} />
          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textAlign: "center", whiteSpace: "nowrap" }}>{d.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Empty initials avatar group ---------- */
function AvatarStack({ items, max = 4, size = 28 }) {
  const show = items.slice(0, max);
  const extra = items.length - show.length;
  return (
    <div className="flex" style={{ alignItems: "center" }}>
      {show.map((c, i) => (
        <div key={i} style={{ marginInlineStart: i ? -9 : 0, borderRadius: "50%", boxShadow: "0 0 0 2px var(--surface)" }}>
          <Avatar c={c} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div className="avatar mono" style={{ marginInlineStart: -9, width: size, height: size, fontSize: 11,
          background: "var(--surface-3)", color: "var(--text-2)", boxShadow: "0 0 0 2px var(--surface)" }}>+{extra}</div>
      )}
    </div>
  );
}

/* ---------- Toast host ---------- */
function useToasts() {
  const [toasts, setToasts] = React.useState([]);
  const push = React.useCallback((msg, icon = "check") => {
    const id = Math.random();
    setToasts(t => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return { toasts, push };
}
function ToastHost({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span className="t-ico"><Icon name={t.icon} size={17} /></span>{t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------- Stage badge ---------- */
function StageBadge({ stage }) {
  const { t } = useApp();
  const map = {
    applied: "neutral", screening: "info", assessment: "purple", aiInterview: "ai",
    hrInterview: "accent", techInterview: "accent", managerInterview: "accent",
    offer: "warning", hired: "success", rejected: "danger",
  };
  return <span className={"badge badge-" + (map[stage] || "neutral")}><span className="b-dot" />{t("stage." + stage)}</span>;
}

Object.assign(window, {
  AppCtx, useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars,
  AvatarStack, useToasts, ToastHost, StageBadge,
});
