/* Connect AI — Admin View 3: Roles management + side panel */

import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'
import { PERM_CATS, ALL_PERMS, PERM_TOTAL, ROLE_DEFS, grantedCount, ADMIN_USERS, usersByRole, USER_OVERRIDES, effectivePerms, USER_JOBS, USER_ACTIVITY, Switch, RoleBadge, StatusDot, AccessPill, Kebab, catCount } from './admin'

function Roles({ go, toast }) {
  const { t, lang } = useApp();
  const [panel, setPanel] = React.useState(null); // role key or null
  const order = ["admin", "recruiter", "hm", "interviewer", "external"];

  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">{t("r.title")}</h1><div className="page-sub">{t("r.sub")}</div></div>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={() => setPanel("__new")}><Icon name="plus" size={17} />{t("r.create")}</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {order.map(rk => <RoleCard key={rk} roleKey={rk} onOpen={() => setPanel(rk)} />)}
        <button className="role-card-new" onClick={() => setPanel("__new")}>
          <span style={{ width: 44, height: 44, borderRadius: 11, background: "var(--surface-3)", display: "grid", placeItems: "center" }}><Icon name="plus" size={22} /></span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{t("r.create")}</span>
        </button>
      </div>

      <RolePanel roleKey={panel} onClose={() => setPanel(null)} toast={toast} />
    </div>
  );
}

function RoleCard({ roleKey, onOpen }) {
  const { t, lang } = useApp();
  const def = ROLE_DEFS[roleKey];
  const members = usersByRole(roleKey);
  const granted = grantedCount(roleKey);
  return (
    <div className="card role-card" onClick={onOpen}>
      <div className="flex" style={{ alignItems: "center", gap: 10 }}>
        <span style={{ width: 36, height: 36, borderRadius: 9, display: "grid", placeItems: "center", flex: "0 0 auto",
          background: `color-mix(in oklch, var(--${def.color === "neutral" ? "text-3" : def.color}) 14%, var(--surface))`,
          color: def.color === "neutral" ? "var(--text-2)" : `var(--${def.color})` }}>
          <Icon name={roleKey === "admin" ? "shield" : roleKey === "external" ? "lock" : "users"} size={18} />
        </span>
        <div style={{ flex: 1 }}>
          <div className="flex" style={{ alignItems: "center", gap: 8 }}>
            <h3 style={{ fontSize: 15.5, fontWeight: 600 }}>{t(def.key)}</h3>
            {def.system && <span className="badge badge-neutral" style={{ height: 19, fontSize: 10.5 }}>{t("r.system")}</span>}
          </div>
        </div>
      </div>
      <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, minHeight: 38 }}>{lang === "ar" ? def.descAr : def.descEn}</div>
      <hr className="divider" />
      <div className="flex" style={{ alignItems: "center", gap: 12 }}>
        {members.length > 0
          ? <AvatarStack items={members} size={28} />
          : <span className="faint" style={{ fontSize: 12.5 }}>—</span>}
        <span className="faint" style={{ fontSize: 12.5 }}>{members.length} {members.length === 1 ? t("r.member") : t("r.members")}</span>
        <div className="spacer" style={{ flex: 1 }} />
        <span className="mono faint" style={{ fontSize: 12, fontWeight: 600 }}>{granted} {t("ud.of")} {PERM_TOTAL}</span>
      </div>
      <button className="btn btn-subtle btn-sm" style={{ alignSelf: "flex-start" }} onClick={(e) => { e.stopPropagation(); onOpen(); }}>
        {t("r.viewPerms")}<Icon name="chevRight" size={14} />
      </button>
    </div>
  );
}

function RolePanel({ roleKey, onClose, toast }) {
  const { t, lang } = useApp();
  const open = !!roleKey;
  const isNew = roleKey === "__new";
  const def = open && !isNew ? ROLE_DEFS[roleKey] : null;
  const system = def ? def.system : false;

  const [acc, setAcc] = React.useState({});
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setAcc({});
      setName(isNew ? "" : t(def.key));
      setDesc(isNew ? "" : (lang === "ar" ? def.descAr : def.descEn));
    }
  }, [roleKey]);

  const members = !isNew && def ? usersByRole(roleKey) : [];
  const permSet = def ? def.perms : new Set();

  return (
    <React.Fragment>
      <div className={"drawer-scrim" + (open ? " open" : "")} style={{ pointerEvents: open ? "auto" : "none" }} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        {open && (
          <React.Fragment>
            <div className="drawer-head">
              <span style={{ width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center", flex: "0 0 auto",
                background: isNew ? "var(--accent-soft)" : `color-mix(in oklch, var(--${def.color === "neutral" ? "text-3" : def.color}) 14%, var(--surface))`,
                color: isNew ? "var(--accent-strong)" : (def.color === "neutral" ? "var(--text-2)" : `var(--${def.color})`) }}>
                <Icon name={isNew ? "plus" : roleKey === "admin" ? "shield" : roleKey === "external" ? "lock" : "users"} size={18} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{isNew ? t("r.create") : t(def.key)}</div>
                {!isNew && def.system && <div className="faint" style={{ fontSize: 11.5 }}>{t("r.system")} {lang === "ar" ? "" : "role"}</div>}
              </div>
              <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
            </div>

            <div className="drawer-body">
              {system && (
                <div className="flex" style={{ alignItems: "center", gap: 9, padding: "10px 13px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", marginBottom: 18 }}>
                  <Icon name="lock" size={15} style={{ color: "var(--text-3)", flex: "0 0 auto" }} />
                  <span className="faint" style={{ fontSize: 12.5, lineHeight: 1.45 }}>{t("r.systemNote")}</span>
                </div>
              )}

              <div className="field" style={{ marginBottom: 16 }}>
                <label>{t("r.roleName")}</label>
                <input className="input" value={name} disabled={system} onChange={e => setName(e.target.value)}
                  placeholder={isNew ? (lang === "ar" ? "مثال: منسّق توظيف" : "e.g. Sourcing Coordinator") : ""} />
              </div>
              <div className="field" style={{ marginBottom: 22 }}>
                <label>{t("r.description")}</label>
                <textarea className="textarea" value={desc} disabled={system} onChange={e => setDesc(e.target.value)} style={{ minHeight: 70 }}
                  placeholder={isNew ? (lang === "ar" ? "ماذا يمكن لهذا الدور فعله؟" : "What can this role do?") : ""} />
              </div>

              <div className="flex" style={{ alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ fontSize: 13.5, flex: 1 }}>{t("r.permissions")}</h4>
                <span className="mono faint" style={{ fontSize: 12, fontWeight: 600 }}>{isNew ? 0 : permSet.size} {t("ud.of")} {PERM_TOTAL}</span>
              </div>

              {PERM_CATS.map(cat => {
                const granted = isNew ? 0 : cat.perms.filter(p => permSet.has(p.id)).length;
                const isOpen = !!acc[cat.id];
                return (
                  <div key={cat.id} className="acc">
                    <button className={"acc-head" + (isOpen ? " open" : "")} onClick={() => setAcc(a => ({ ...a, [cat.id]: !a[cat.id] }))}>
                      <Icon name="chevRight" size={16} className="chev" />
                      <span style={{ width: 28, height: 28, borderRadius: 7, display: "grid", placeItems: "center", background: "var(--surface-3)", color: "var(--text-2)", flex: "0 0 auto" }}><Icon name={cat.icon} size={15} /></span>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{t("cat." + cat.id)}</span>
                      <div className="spacer" style={{ flex: 1 }} />
                      <span className="mono faint" style={{ fontSize: 12, fontWeight: 600 }}>{granted}/{cat.perms.length}</span>
                    </button>
                    <div className={"acc-body" + (isOpen ? " open" : "")}>
                      <div className="acc-inner"><div>
                        {cat.perms.map(p => (
                          <div key={p.id} className="perm-row">
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="pr-name">{p.name}</div>
                              <div className="pr-desc">{p.desc}</div>
                            </div>
                            <Switch on={isNew ? false : permSet.has(p.id)} disabled={system}
                              onChange={() => toast(t("toast.permUpdated"), "check")} />
                          </div>
                        ))}
                      </div></div>
                    </div>
                  </div>
                );
              })}

              {!isNew && (
                <div style={{ marginTop: 22 }}>
                  <div className="flex" style={{ alignItems: "center", marginBottom: 10 }}>
                    <h4 style={{ fontSize: 13.5, flex: 1 }}>{t("r.membersSection")}</h4>
                    <a className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{t("r.manageMembers")}</a>
                  </div>
                  <div className="flex" style={{ alignItems: "center", gap: 12 }}>
                    {members.length ? <AvatarStack items={members} size={32} max={6} /> : <span className="faint" style={{ fontSize: 13 }}>—</span>}
                    <span className="faint" style={{ fontSize: 12.5 }}>{members.length} {members.length === 1 ? t("r.member") : t("r.members")}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="drawer-foot">
              <button className="btn btn-subtle" onClick={onClose}>{t("common.cancel")}</button>
              <div className="spacer" style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={() => { toast(t("toast.roleSaved"), "check"); onClose(); }}>
                <Icon name="check" size={16} />{t("r.save")}
              </button>
            </div>
          </React.Fragment>
        )}
      </aside>
    </React.Fragment>
  );
}

/* placeholder for Workflows / Email Templates nav items */
function AdminPlaceholder({ icon, titleKey }) {
  const { t } = useApp();
  return (
    <div className="page">
      <div className="page-head"><div><h1 className="page-title">{t(titleKey)}</h1></div></div>
      <div className="card card-pad" style={{ textAlign: "center", padding: "64px 20px" }}>
        <span style={{ width: 56, height: 56, borderRadius: 14, background: "var(--surface-3)", color: "var(--text-3)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}><Icon name={icon} size={28} /></span>
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>{t("ph.title")}</h3>
        <div className="muted" style={{ fontSize: 13.5, maxWidth: 360, margin: "0 auto" }}>{t("ph.sub")}</div>
      </div>
    </div>
  );
}

window.Roles = Roles;
window.AdminPlaceholder = AdminPlaceholder;

export { Roles, RoleCard, RolePanel, AdminPlaceholder };
