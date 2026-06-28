import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui';
import { Icon } from '../lib/icons';

/* Connect AI — Third-party assessment integrations (Epic 12.5) */

function AssessmentIntegrations({ onBack, toast }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [provs, setProvs] = React.useState(() => window.ASSESS.PROVIDERS.map(p => ({ ...p })));
  const [connectFor, setConnectFor] = React.useState(null);
  const [disconnectFor, setDisconnectFor] = React.useState(null);

  const kindLabel = { coding: T("Coding", "برمجة"), psychometric: T("Psychometric", "سيكومتري"), mixed: T("Mixed", "مختلط") };
  const connected = provs.filter(p => p.status === "connected" || p.status === "syncing");

  const statusMeta = {
    connected: { c: "var(--success)", s: "var(--success-soft)", l: T("Connected", "متصل"), dot: true },
    syncing: { c: "var(--warning)", s: "var(--warning-soft)", l: T("Syncing", "مزامنة") },
    error: { c: "var(--danger)", s: "var(--danger-soft)", l: T("Error", "خطأ") },
    disconnected: { c: "var(--text-3)", s: "var(--surface-3)", l: T("Not connected", "غير متصل") },
  };

  const doConnect = (id) => {
    setProvs(ps => ps.map(p => p.id === id ? { ...p, status: "connected", tests: p.tests || 8, synced: { en: "just now", ar: "الآن" } } : p));
    setConnectFor(null);
    toast(T("Provider connected", "تم ربط المزوّد"));
  };
  const doDisconnect = (id) => {
    setProvs(ps => ps.map(p => p.id === id ? { ...p, status: "disconnected", tests: 0 } : p));
    setDisconnectFor(null);
    toast(T("Provider disconnected — historical data preserved", "تم فصل المزوّد — حُفظت البيانات التاريخية"));
  };

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <div className="crumbs" style={{ marginBottom: 12 }}>
        <a onClick={onBack}>{ar ? "مكتبة التقييمات" : "Assessment Library"}</a>
        <Icon name={ar ? "chevLeft" : "chevRight"} size={13} /><span style={{ color: "var(--text-2)" }}>{T("Integrations", "التكاملات")}</span>
      </div>
      <div className="page-head">
        <div>
          <h1 className="page-title">{T("Assessment integrations", "تكاملات التقييم")}</h1>
          <div className="page-sub">{T("Offer specialized coding and psychometric assessments via integrated providers — results stay inside Connect AI.", "قدّم تقييمات برمجية وسيكومترية متخصصة عبر مزوّدين متكاملين — تبقى النتائج داخل Connect AI.")}</div>
        </div>
      </div>

      {/* sync failure log */}
      {provs.some(p => p.status === "error") && (
        <div className="warn-bar" style={{ marginBottom: "var(--gap)" }}>
          <span className="wb-ico"><Icon name="alert" size={15} /></span>
          <span className="wb-text">{T("One provider has a sync error. Connections failing for more than 24 hours notify the admin by email.", "أحد المزوّدين لديه خطأ مزامنة. التكاملات الفاشلة لأكثر من 24 ساعة تُنبّه المسؤول بالبريد.")}</span>
        </div>
      )}

      {/* connected summary */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: "var(--gap)" }}>
        <Stat icon="link2" label={T("Connected providers", "مزوّدون متصلون")} value={connected.length} color="var(--success)" />
        <Stat icon="assessment" label={T("External tests in library", "اختبارات خارجية بالمكتبة")} value={connected.reduce((s, p) => s + (p.tests || 0), 0)} color="var(--accent)" />
        <Stat icon="refresh" label={T("Last sync", "آخر مزامنة")} value={T("2 min ago", "قبل دقيقتين")} color="var(--ai)" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))" }}>
        {provs.map(p => {
          const m = statusMeta[p.status];
          return (
            <div key={p.id} className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="flex" style={{ alignItems: "flex-start", gap: 11 }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface-3)", display: "grid", placeItems: "center", flex: "0 0 auto", fontWeight: 700, fontSize: 15, color: "var(--text-2)" }}>{p.name[0]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                  <div className="faint" style={{ fontSize: 12 }}>{kindLabel[p.kind]}{p.cobrand ? " · " + T("co-branding", "علامة مشتركة") : ""}</div>
                </div>
                <span className="badge" style={{ background: m.s, color: m.c, height: 22 }}>{m.dot && <span className="b-dot" />}{m.l}</span>
              </div>

              {p.status === "error" && p.error && <div style={{ fontSize: 12.5, color: "var(--danger)", background: "var(--danger-soft)", borderRadius: "var(--r-sm)", padding: "8px 11px" }}>{p.error[ar ? "ar" : "en"]}</div>}
              {(p.status === "connected" || p.status === "syncing") && (
                <div className="flex" style={{ gap: 18, fontSize: 12.5, color: "var(--text-2)" }}>
                  <span><b className="mono">{p.tests}</b> {T("tests", "اختبار")}</span>
                  {p.synced && <span className="flex" style={{ alignItems: "center", gap: 4 }}><Icon name="refresh" size={12} />{T("Synced", "تمت المزامنة")} {p.synced[ar ? "ar" : "en"]}</span>}
                </div>
              )}

              <div className="flex" style={{ gap: 8, marginTop: "auto" }}>
                {p.status === "disconnected" && <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setConnectFor(p)}><Icon name="plug" size={14} />{T("Connect", "ربط")}</button>}
                {p.status === "error" && <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setConnectFor(p)}><Icon name="refresh" size={14} />{T("Reconnect", "إعادة الربط")}</button>}
                {(p.status === "connected" || p.status === "syncing") && (
                  <React.Fragment>
                    <button className="btn btn-subtle btn-sm" style={{ flex: 1 }} onClick={() => setConnectFor(p)}><Icon name="gear" size={14} />{T("Configure", "إعداد")}</button>
                    <button className="btn btn-subtle btn-sm" style={{ color: "var(--danger)" }} onClick={() => setDisconnectFor(p)}>{T("Disconnect", "فصل")}</button>
                  </React.Fragment>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {connectFor && <ConnectProviderModal p={connectFor} onClose={() => setConnectFor(null)} onConnect={() => doConnect(connectFor.id)} />}
      {disconnectFor && <DisconnectModal p={disconnectFor} onClose={() => setDisconnectFor(null)} onConfirm={() => doDisconnect(disconnectFor.id)} />}
    </div>
  );
}

function ConnectProviderModal({ p, onClose, onConnect }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [key, setKey] = React.useState("");
  const [sync, setSync] = React.useState("auto");
  const [mapping, setMapping] = React.useState("percent");
  const isOauth = p.auth === "oauth";
  const ready = isOauth || key.length > 8;

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 540, width: "100%" }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--surface-3)", display: "grid", placeItems: "center", fontWeight: 700, color: "var(--text-2)" }}>{p.name[0]}</span>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 16 }}>{T("Connect", "ربط")} {p.name}</div><div className="faint" style={{ fontSize: 12.5 }}>{T("Specialized assessments synced into your library", "تقييمات متخصصة تُزامَن إلى مكتبتك")}</div></div>
          <button className="btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17} /></button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {isOauth ? (
            <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none", textAlign: "center" }}>
              <Icon name="lock" size={20} style={{ color: "var(--accent)" }} />
              <div style={{ fontSize: 13.5, fontWeight: 600, margin: "8px 0 4px" }}>{T("Authorize via OAuth", "التفويض عبر OAuth")}</div>
              <div className="faint" style={{ fontSize: 12.5, marginBottom: 12 }}>{T("You'll be redirected to sign in and grant access.", "ستُحوَّل لتسجيل الدخول ومنح الإذن.")}</div>
              <button className="btn btn-ghost btn-sm">{T("Authorize", "تفويض")} {p.name} →</button>
            </div>
          ) : (
            <div className="field"><label>{T("API key", "مفتاح API")}</label><input className="input" value={key} onChange={e => setKey(e.target.value)} placeholder={T("Paste your API key…", "ألصق مفتاح API…")} /><span className="hint">{T("Find this in your provider's developer settings.", "تجده في إعدادات المطوّر لدى المزوّد.")}</span></div>
          )}
          <div className="field"><label>{T("Sync mode", "وضع المزامنة")}</label>
            <div className="seg" style={{ display: "inline-flex" }}>
              <button className={sync === "auto" ? "on" : ""} onClick={() => setSync("auto")}>{T("Auto (real-time)", "تلقائي (فوري)")}</button>
              <button className={sync === "manual" ? "on" : ""} onClick={() => setSync("manual")}>{T("Manual", "يدوي")}</button>
            </div>
          </div>
          <div className="field"><label>{T("Score mapping", "تخطيط الدرجات")}</label>
            <select className="select" value={mapping} onChange={e => setMapping(e.target.value)}>
              <option value="percent">{T("Use provider percentage as-is", "استخدم نسبة المزوّد كما هي")}</option>
              <option value="tier">{T("Map to Connect AI tiers (Strong/Good/…)", "ربط بفئات Connect AI (قوي/جيد/…)")}</option>
              <option value="raw">{T("Keep raw points", "الإبقاء على النقاط الخام")}</option>
            </select>
          </div>
          <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none" }}>
            <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 8 }}><Icon name="assessment" size={14} style={{ color: "var(--accent)" }} /><span style={{ fontWeight: 600, fontSize: 13 }}>{T("Tests to expose in library", "الاختبارات التي ستظهر بالمكتبة")}</span></div>
            <div className="faint" style={{ fontSize: 12.5 }}>{T("All available tests will be imported. You can hide individual tests later.", "ستُستورد كل الاختبارات المتاحة. يمكنك إخفاء أي منها لاحقاً.")}</div>
          </div>
        </div>
        <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={onClose}>{T("Cancel", "إلغاء")}</button><button className="btn btn-primary btn-sm" disabled={!ready} onClick={onConnect}><Icon name="plug" size={14} />{T("Connect provider", "ربط المزوّد")}</button></div>
      </div>
    </div>
  );
}

function DisconnectModal({ p, onClose, onConfirm }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500, width: "100%" }} onClick={e => e.stopPropagation()}>
        <div className="modal-head"><div style={{ flex: 1, fontWeight: 600, fontSize: 16 }}>{T("Disconnect", "فصل")} {p.name}?</div><button className="btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17} /></button></div>
        <div className="modal-body">
          <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none", marginBottom: 14 }}>
            <ImpactRow icon="assessment" label={T("Tests removed from library", "اختبارات ستُزال من المكتبة")} value={p.tests || 0} />
            <ImpactRow icon="clock" label={T("In-progress assessments affected", "تقييمات جارية متأثرة")} value={4} />
            <ImpactRow icon="shield" label={T("Historical results preserved", "نتائج تاريخية محفوظة")} value={p.id === "hackerrank" ? 57 : 124} good last />
          </div>
          <div className="warn-bar">
            <span className="wb-ico"><Icon name="alert" size={15} /></span>
            <span className="wb-text" style={{ fontSize: 12.5 }}>{T("In-progress candidates can still finish on the provider's platform, but their results will NOT sync back. Historical synced data is kept. Reconnecting later restores library entries automatically.", "يمكن للمرشحين الجارين الإكمال على منصة المزوّد، لكن نتائجهم لن تُزامَن. تُحفظ البيانات التاريخية. وإعادة الربط لاحقاً تستعيد عناصر المكتبة تلقائياً.")}</span>
          </div>
        </div>
        <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={onClose}>{T("Cancel", "إلغاء")}</button><button className="btn btn-danger btn-sm" onClick={onConfirm}>{T("Disconnect provider", "فصل المزوّد")}</button></div>
      </div>
    </div>
  );
}

function ImpactRow({ icon, label, value, good, last }) {
  return (
    <div className="flex" style={{ alignItems: "center", gap: 10, padding: "8px 0", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <Icon name={icon} size={15} style={{ color: good ? "var(--success)" : "var(--text-3)", flex: "0 0 auto" }} />
      <span style={{ flex: 1, fontSize: 13 }}>{label}</span>
      <span className="mono" style={{ fontWeight: 700, fontSize: 15, color: good ? "var(--success)" : "var(--text)" }}>{value}</span>
    </div>
  );
}

export { AssessmentIntegrations };
