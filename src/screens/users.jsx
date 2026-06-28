/* Connect AI — Admin Views 1 & 2: Users list + User detail */

import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'
import { PERM_CATS, ALL_PERMS, PERM_TOTAL, ROLE_DEFS, grantedCount, ADMIN_USERS, usersByRole, USER_OVERRIDES, effectivePerms, USER_JOBS, USER_ACTIVITY, Switch, RoleBadge, StatusDot, AccessPill, Kebab, catCount } from './admin'

function UsersList({ go }) {
  const { t, L, lang } = useApp();
  const [query, setQuery] = React.useState("");
  const [roleF, setRoleF] = React.useState("all");
  const [statusF, setStatusF] = React.useState("all");

  const rows = ADMIN_USERS.filter(u =>
    (!query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())) &&
    (roleF === "all" || u.role === roleF) &&
    (statusF === "all" || u.status === statusF));

  const stats = [
    { label: t("u.total"), value: 47, icon: "users", color: "var(--accent)" },
    { label: t("u.active"), value: 42, icon: "check", color: "var(--success)" },
    { label: t("u.pending"), value: 3, icon: "clock", color: "var(--warning)" },
    { label: t("u.suspended"), value: 2, icon: "ban", color: "var(--text-3)" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">{t("u.title")}</h1><div className="page-sub">{t("u.sub")}</div></div>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={() => go("userDetail", { id: "u6" })}><Icon name="userPlus" size={17} />{t("u.invite")}</button>
      </div>

      {/* compact stat row */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "var(--gap)" }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-pad flex" style={{ alignItems: "center", gap: 13 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, flex: "0 0 auto", display: "grid", placeItems: "center",
              background: `color-mix(in oklch, ${s.color} 13%, var(--surface))`, color: s.color }}><Icon name={s.icon} size={19} /></span>
            <div>
              <div className="mono tnum" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>{s.value}</div>
              <div className="faint" style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* filter bar */}
      <div className="flex" style={{ gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div className="searchbar" style={{ maxWidth: 300, height: 38 }}>
          <Icon name="search" size={16} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t("common.search") + "…"} />
        </div>
        <select className="select" style={{ width: "auto", minWidth: 150, height: 38 }} value={roleF} onChange={e => setRoleF(e.target.value)}>
          <option value="all">{t("u.allRoles")}</option>
          {Object.keys(ROLE_DEFS).map(r => <option key={r} value={r}>{t(ROLE_DEFS[r].key)}</option>)}
        </select>
        <select className="select" style={{ width: "auto", minWidth: 150, height: 38 }} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="all">{t("u.allStatuses")}</option>
          <option value="active">{t("st.active")}</option>
          <option value="pending">{t("st.pending")}</option>
          <option value="suspended">{t("st.suspended")}</option>
        </select>
        <div className="spacer" style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 13 }}>{rows.length} {lang === "ar" ? "مستخدم" : "users"}</span>
      </div>

      <div className="card" style={{ overflow: "visible" }}>
        <table className="tbl">
          <thead><tr>
            <th>{t("u.col.user")}</th><th>{t("u.col.role")}</th><th>{t("u.col.jobs")}</th>
            <th>{t("u.col.status")}</th><th>{t("u.col.lastActive")}</th><th style={{ width: 48 }}></th>
          </tr></thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id} onClick={() => go("userDetail", { id: u.id })}>
                <td>
                  <div className="flex" style={{ alignItems: "center", gap: 11 }}>
                    <Avatar c={u} size={38} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div className="faint" style={{ fontSize: 12 }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><RoleBadge roleKey={u.role} /></td>
                <td><span className="mono" style={{ fontWeight: 600, color: u.jobs ? "var(--accent)" : "var(--text-3)" }}>{u.jobs} {t("u.jobsUnit")}</span></td>
                <td><StatusDot status={u.status} /></td>
                <td><span className="faint" style={{ fontSize: 12.5 }}>{L(u.last)}</span></td>
                <td onClick={e => e.stopPropagation()}>
                  <Kebab items={[
                    { icon: "eye", label: t("common.openProfile"), onClick: () => go("userDetail", { id: u.id }) },
                    { icon: "edit", label: t("ud.editUser") },
                    { icon: "ban", label: t("ud.suspend"), danger: true },
                  ]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ View 2 — User detail & permissions ============ */
function UserDetail({ id, go, toast }) {
  const { t, L, lang } = useApp();
  const user = ADMIN_USERS.find(u => u.id === id) || ADMIN_USERS[1];
  const [perms, setPerms] = React.useState(() => effectivePerms(user));
  const [open, setOpen] = React.useState({ candidates: true });
  const [scope, setScope] = React.useState("assigned");
  const overrides = USER_OVERRIDES[user.id] || [];

  React.useEffect(() => { setPerms(effectivePerms(user)); setOpen({ candidates: true }); }, [id]);

  const toggle = (pid) => { setPerms(p => ({ ...p, [pid]: !p[pid] })); toast(t("toast.permUpdated"), "check"); };
  const grantedTotal = ALL_PERMS.filter(p => perms[p]).length;
  const showWarn = perms["interviews.scorecard_submit"] && !perms["interviews.conduct"];

  const jobsOn = USER_JOBS[user.id] || USER_JOBS.u2;
  const activity = USER_ACTIVITY[user.id] || USER_ACTIVITY.u2;

  return (
    <div className="page">
      <div className="crumbs">
        <a onClick={() => go("users")}>{t("nav.users")}</a><span className="sep">›</span><span>{user.name}</span>
      </div>

      {/* header card */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="flex" style={{ gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar c={user} size={64} ring />
          <div style={{ flex: 1, minWidth: 180 }}>
            <div className="flex" style={{ alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 600 }}>{user.name}</h1>
              <RoleBadge roleKey={user.role} />
            </div>
            <div className="flex" style={{ alignItems: "center", gap: 14, marginTop: 5, flexWrap: "wrap" }}>
              <span className="muted flex" style={{ alignItems: "center", gap: 6, fontSize: 13 }}><Icon name="mail" size={14} />{user.email}</span>
              <StatusDot status={user.status} />
            </div>
          </div>
          <div className="flex" style={{ gap: 8 }}>
            <button className="btn btn-ghost"><Icon name="edit" size={15} />{t("ud.editUser")}</button>
            <button className="btn btn-subtle" style={{ color: "var(--danger)" }}><Icon name="ban" size={15} />{t("ud.suspend")}</button>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr", alignItems: "start" }}>
        {/* LEFT */}
        <div className="grid">
          {/* role & overrides */}
          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>{t("ud.rolePerm")}</h3>
            <div className="flex" style={{ gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="field" style={{ flex: 1, minWidth: 180 }}>
                <label>{t("ud.currentRole")}</label>
                <select className="select" defaultValue={user.role}>
                  {Object.keys(ROLE_DEFS).map(r => <option key={r} value={r}>{t(ROLE_DEFS[r].key)}</option>)}
                </select>
              </div>
              <button className="btn btn-ghost" style={{ marginBottom: 0 }} onClick={() => go("roles")}>
                <Icon name="shield" size={15} />{t("ud.manageRoles")}
              </button>
            </div>

            {overrides.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div className="faint" style={{ fontSize: 12, fontWeight: 600, marginBottom: 9 }}>{t("ud.overrides")} ({overrides.length})</div>
                <div className="flex" style={{ flexWrap: "wrap", gap: 8 }}>
                  {overrides.map((o, i) => {
                    const meta = PERM_CATS.flatMap(c => c.perms).find(p => p.id === o.perm);
                    const grant = o.type === "grant";
                    return (
                      <span key={i} className="badge" style={{ height: 26, background: grant ? "var(--success-soft)" : "var(--danger-soft)", color: grant ? "var(--success)" : "var(--danger)" }}>
                        <Icon name={grant ? "plus" : "x"} size={12} />{meta ? meta.name : o.perm}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* permissions by category */}
          <div className="card">
            <div className="card-head"><h3>{t("ud.permsByCat")}</h3><div className="spacer" /><span className="badge badge-accent mono">{grantedTotal} {t("ud.of")} {PERM_TOTAL}</span></div>
            <div className="card-pad">
              {showWarn && (
                <div className="warn-bar" style={{ marginBottom: 14 }}>
                  <span className="wb-ico"><Icon name="alert" size={18} /></span>
                  <span className="wb-text">{t("ud.warning")}</span>
                </div>
              )}
              {PERM_CATS.map(cat => {
                const { granted, total } = catCount(cat, perms);
                const isOpen = !!open[cat.id];
                return (
                  <div key={cat.id} className="acc">
                    <button className={"acc-head" + (isOpen ? " open" : "")} onClick={() => setOpen(o => ({ ...o, [cat.id]: !o[cat.id] }))}>
                      <Icon name="chevRight" size={16} className="chev" />
                      <span style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", background: "var(--surface-3)", color: "var(--text-2)", flex: "0 0 auto" }}><Icon name={cat.icon} size={16} /></span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{t("cat." + cat.id)}</span>
                      <div className="spacer" style={{ flex: 1 }} />
                      <span className="mono faint" style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>{granted} {t("ud.of")} {total} {t("ud.granted").toLowerCase()}</span>
                    </button>
                    <div className={"acc-body" + (isOpen ? " open" : "")}>
                      <div className="acc-inner"><div>
                        {cat.perms.map(p => (
                          <div key={p.id}>
                            <div className="perm-row">
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="flex" style={{ alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                  <span className="pr-name">{p.name}</span><code>{p.id}</code>
                                </div>
                                <div className="pr-desc">{p.desc}</div>
                              </div>
                              <Switch on={perms[p.id]} onChange={() => toggle(p.id)} />
                            </div>
                            {p.scope && perms[p.id] && (
                              <div style={{ padding: "2px 4px 12px 4px" }}>
                                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: 6 }}>
                                  {[["all", "ud.scopeAll"], ["assigned", "ud.scopeAssigned"], ["mine", "ud.scopeMine"]].map(([v, k]) => (
                                    <div key={v} className={"scope-opt" + (scope === v ? " on" : "")} onClick={() => { setScope(v); toast(t("toast.permUpdated"), "check"); }}>
                                      <span className="radio" />{t(k)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid">
          <div className="card">
            <div className="card-head"><h3>{t("ud.jobsOn")}</h3></div>
            <div style={{ padding: "6px 8px" }}>
              {jobsOn.map((j, i) => (
                <div key={i} className="flex" style={{ alignItems: "center", gap: 11, padding: "11px 12px", borderRadius: "var(--r-sm)" }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-3)", color: "var(--text-2)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="briefcase" size={15} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{L(j.title)}</div>
                    <div className="faint" style={{ fontSize: 11.5 }}>{L(j.dept)}</div>
                  </div>
                  <AccessPill level={j.access} />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>{t("ud.recentActivity")}</h3></div>
            <div className="card-pad">
              {activity.map((a, i) => (
                <div key={i} className="flex" style={{ gap: 12 }}>
                  <div className="flex" style={{ flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: i === 0 ? "var(--accent)" : "var(--border-strong)", marginTop: 6 }} />
                    {i < activity.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 18 }} />}
                  </div>
                  <div style={{ paddingBottom: i < activity.length - 1 ? 14 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{L(a)}</div>
                    <div className="faint" style={{ fontSize: 11.5 }}>{L(a.w)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.UsersList = UsersList;
window.UserDetail = UserDetail;

export { UsersList, UserDetail };
