/* Connect AI — app shell: Sidebar + Topbar */
import { useApp } from './ui';
import { Icon } from './icons';

const NAV = [
  { section: "nav.main", items: [
    { id: "dashboard", icon: "dashboard", label: "nav.dashboard" },
  ]},
  { section: "nav.hiring", items: [
    { id: "jobs", icon: "jobs", label: "nav.jobs", badge: "8" },
    { id: "pipeline", icon: "pipeline", label: "nav.pipeline", badge: "64" },
    { id: "assessments", icon: "assessment", label: "nav.assessments" },
    { id: "interviews", icon: "video", label: "nav.interviews" },
    { id: "screening", icon: "phone", label: "nav.screening" },
    { id: "offers", icon: "offer", label: "nav.offers", badge: "5", soon: true },
  ]},
  { section: "nav.admin", items: [
    { id: "users", icon: "users", label: "nav.users", badge: "47" },
    { id: "roles", icon: "shield", label: "nav.roles" },
    { id: "workflows", icon: "workflow", label: "nav.workflows" },
    { id: "templates", icon: "mail", label: "nav.templates" },
  ]},
];

function Sidebar({ route, go, collapsed, setCollapsed }) {
  const { t, lang } = useApp();
  return (
    <aside className={"sidebar" + (collapsed ? " collapsed" : "")}>
      <div className="brand">
        <div className="brand-mark">
          <Icon name="sparkles" size={19} fill />
        </div>
        <div className="brand-name">Connect <b>AI</b></div>
      </div>
      <nav className="nav">
        {NAV.map((grp) => (
          <div key={grp.section}>
            <div className="nav-section-label">{t(grp.section)}</div>
            {grp.items.map((it) => (
              <button key={it.id} className={"nav-item" + (route === it.id ? " active" : "")}
                onClick={() => go(it.id)} title={t(it.label)}>
                <span className="nav-ico"><Icon name={it.icon} size={19} /></span>
                <span className="nav-label">{t(it.label)}</span>
                {it.soon && <span className="nav-badge" style={{ background: "var(--ai-soft)", color: "var(--ai)", textTransform: "uppercase", fontSize: 9.5, letterSpacing: ".04em" }}>{lang === "ar" ? "قريباً" : "Soon"}</span>}
                {it.badge && !it.soon && <span className="nav-badge">{it.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="side-foot">
        <button className="nav-item" style={{ marginBottom: 4 }} onClick={() => setCollapsed(c => !c)} title="Toggle">
          <span className="nav-ico"><Icon name="panel" size={19} /></span>
          <span className="nav-label">{collapsed ? "Expand" : "Collapse"}</span>
        </button>
        <div className="side-user">
          <div className="avatar" style={{ width: 36, height: 36, background: "oklch(0.6 0.15 300)", fontSize: 14 }}>
            {lang === "ar" ? "ل" : "L"}
          </div>
          <div className="side-foot-text">
            <div className="nm">{lang === "ar" ? "ليلى الفايز" : "Layla Al-Fayez"}</div>
            <div className="rl">{t("user.role")}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ go }) {
  const { t, lang, setLang, theme, setTheme } = useApp();
  return (
    <header className="topbar">
      <div className="searchbar">
        <Icon name="search" size={17} />
        <input placeholder={t("search.placeholder")} />
        <span className="ai-pill"><Icon name="sparkles" size={11} fill /> {t("search.ai")}</span>
      </div>
      <div className="spacer" style={{ flex: 1 }} />

      <div className="seg" role="group" aria-label="language">
        <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
        <button className={lang === "ar" ? "on" : ""} onClick={() => setLang("ar")} style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>ع</button>
      </div>

      <button className="icon-btn has-tip" data-tip={theme === "light" ? t("tw.dark") : t("tw.light")}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        <Icon name={theme === "light" ? "moon" : "sun"} size={19} />
      </button>

      <button className="icon-btn"><Icon name="bell" size={19} /><span className="dot" /></button>


    </header>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
export { Sidebar, Topbar };
