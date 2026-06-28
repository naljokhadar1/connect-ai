/* Connect AI — Admin / Permissions: data model + shared primitives */

/* ---------- Permission catalog (7 categories, 28 permissions) ---------- */
const PERM_CATS = [
  { id: "jobs", icon: "briefcase", perms: [
    { id: "jobs.view", name: "View jobs", desc: "View jobs and requisitions" },
    { id: "jobs.create", name: "Create jobs", desc: "Create new job requisitions" },
    { id: "jobs.edit", name: "Edit jobs", desc: "Edit job details and descriptions" },
    { id: "jobs.archive", name: "Archive jobs", desc: "Archive or close jobs" },
    { id: "jobs.manage_team", name: "Manage hiring team", desc: "Add or remove people on a job" },
  ]},
  { id: "candidates", icon: "users", perms: [
    { id: "candidates.view", name: "View candidates", desc: "View candidate profiles", scope: true },
    { id: "candidates.move", name: "Move candidates", desc: "Move candidates between stages" },
    { id: "candidates.edit", name: "Edit candidates", desc: "Edit candidate information" },
    { id: "candidates.delete", name: "Delete candidates", desc: "Permanently delete candidate records" },
    { id: "candidates.self_assign_interview", name: "Self-assign interviews", desc: "Add themselves as an interviewer" },
  ]},
  { id: "interviews", icon: "video", perms: [
    { id: "interviews.schedule", name: "Schedule interviews", desc: "Book interviews on the calendar" },
    { id: "interviews.conduct", name: "Conduct interviews", desc: "Host and run interviews" },
    { id: "interviews.scorecard_submit", name: "Submit scorecard", desc: "Submit interview scorecards" },
    { id: "interviews.scorecard_view_others", name: "View others' scorecards", desc: "See scorecards from other interviewers" },
  ]},
  { id: "workflows", icon: "workflow", perms: [
    { id: "workflows.view", name: "View workflows", desc: "View hiring workflows" },
    { id: "workflows.create", name: "Create workflows", desc: "Create new workflows" },
    { id: "workflows.edit", name: "Edit workflows", desc: "Edit workflow stages and rules" },
  ]},
  { id: "templates", icon: "mail", perms: [
    { id: "templates.view", name: "View templates", desc: "View email templates" },
    { id: "templates.create", name: "Create templates", desc: "Create email templates" },
    { id: "templates.edit", name: "Edit templates", desc: "Edit email templates" },
    { id: "templates.send_manual", name: "Send manual emails", desc: "Send one-off emails to candidates" },
  ]},
  { id: "offers", icon: "offer", perms: [
    { id: "offers.create", name: "Create offers", desc: "Create and draft offers" },
    { id: "offers.approve", name: "Approve offers", desc: "Approve offers for sending" },
    { id: "offers.send", name: "Send offers", desc: "Send offers to candidates" },
  ]},
  { id: "assessments", icon: "assessment", perms: [
    { id: "assessments.view", name: "View assessments", desc: "View the assessment library and results" },
    { id: "assessments.create", name: "Create assessments", desc: "Build, AI-generate, and edit assessments" },
    { id: "assessments.publish", name: "Publish assessments", desc: "Publish and version assessments" },
    { id: "assessments.send", name: "Send assessments", desc: "Assign assessments to candidates" },
    { id: "assessments.grade", name: "Grade & override", desc: "Confirm or override AI grading" },
    { id: "assessments.manage_integrations", name: "Manage providers", desc: "Connect or disconnect external providers" },
  ]},
  { id: "screening", icon: "phone", perms: [
    { id: "screening.view", name: "View screening agents", desc: "View the screening agent library and calls" },
    { id: "screening.build", name: "Build agents", desc: "Create and edit screening agents and templates" },
    { id: "screening.link", name: "Link to jobs", desc: "Link or unlink agents to job openings" },
    { id: "screening.monitor", name: "Monitor live calls", desc: "Listen in on active screening calls" },
    { id: "screening.takeover", name: "Take over calls", desc: "Step into a live call as a human recruiter" },
    { id: "screening.review", name: "Review & score", desc: "Review calls and confirm or override evaluations" },
    { id: "screening.manage_compliance", name: "Manage compliance", desc: "Edit consent, analysis, and compliance settings" },
  ]},
  { id: "settings", icon: "gear", perms: [
    { id: "settings.manage_users", name: "Manage users", desc: "Invite and manage users" },
    { id: "settings.manage_roles", name: "Manage roles", desc: "Create and edit roles" },
    { id: "settings.manage_integrations", name: "Manage integrations", desc: "Configure integrations and API" },
    { id: "settings.audit_log", name: "View audit log", desc: "Access the security audit log" },
  ]},
];

const ALL_PERMS = PERM_CATS.flatMap(c => c.perms.map(p => p.id));
const PERM_TOTAL = ALL_PERMS.length; // 41

/* ---------- Role permission sets ---------- */
const ROLE_DEFS = {
  admin: { key: "role.admin", color: "accent", system: true, descEn: "Full access to everything", descAr: "وصول كامل إلى كل شيء",
    perms: new Set(ALL_PERMS) },
  recruiter: { key: "role.recruiter", color: "info", system: true, descEn: "Manage candidates, jobs, and outreach", descAr: "إدارة المرشحين والوظائف والتواصل",
    perms: new Set(["jobs.view","jobs.create","jobs.edit","jobs.manage_team","candidates.view","candidates.move","candidates.edit","candidates.self_assign_interview","interviews.schedule","interviews.scorecard_view_others","workflows.view","workflows.edit","templates.view","templates.create","templates.send_manual","offers.create","assessments.view","assessments.create","assessments.send","assessments.grade","screening.view","screening.build","screening.link","screening.monitor","screening.review"]) },
  hm: { key: "role.hm", color: "warning", system: true, descEn: "Make hiring decisions on assigned jobs", descAr: "اتخاذ قرارات التوظيف للوظائف المسندة",
    perms: new Set(["jobs.view","jobs.manage_team","candidates.view","candidates.move","interviews.schedule","interviews.conduct","interviews.scorecard_submit","interviews.scorecard_view_others","workflows.view","offers.create","offers.approve","assessments.view","assessments.grade","screening.view","screening.monitor","screening.review"]) },
  interviewer: { key: "role.interviewer", color: "ai", system: true, descEn: "Conduct interviews and submit feedback", descAr: "إجراء المقابلات وتقديم الملاحظات",
    perms: new Set(["jobs.view","candidates.view","interviews.schedule","interviews.conduct","interviews.scorecard_submit","assessments.view","screening.view"]) },
  external: { key: "role.external", color: "neutral", system: false, descEn: "Read-only access for external consultants", descAr: "وصول للقراءة فقط للمستشارين الخارجيين",
    perms: new Set(["jobs.view","candidates.view","interviews.scorecard_submit","interviews.scorecard_view_others"]) },
};

const grantedCount = (roleKey) => ROLE_DEFS[roleKey].perms.size;

/* ---------- Users (9) ---------- */
const C = (h) => `oklch(0.6 0.14 ${h})`;
const ADMIN_USERS = [
  { id: "u1", name: "Layla Al-Fayez", initials: "LF", avatar: C(300), email: "layla.alfayez@connect.sa", role: "admin", jobs: 12, status: "active", last: { en: "just now", ar: "الآن" } },
  { id: "u2", name: "Ahmed Hassan", initials: "AH", avatar: C(255), email: "ahmed.hassan@connect.sa", role: "recruiter", jobs: 8, status: "active", last: { en: "2h ago", ar: "قبل ساعتين" } },
  { id: "u3", name: "Sara Mansour", initials: "SM", avatar: C(20), email: "sara.mansour@connect.sa", role: "recruiter", jobs: 6, status: "active", last: { en: "5h ago", ar: "قبل 5 ساعات" } },
  { id: "u4", name: "Khalid Al-Rahman", initials: "KR", avatar: C(150), email: "khalid.alrahman@connect.sa", role: "hm", jobs: 3, status: "active", last: { en: "1d ago", ar: "قبل يوم" } },
  { id: "u5", name: "Fatima Al-Shamsi", initials: "FS", avatar: C(10), email: "fatima.alshamsi@connect.sa", role: "hm", jobs: 4, status: "active", last: { en: "3h ago", ar: "قبل 3 ساعات" } },
  { id: "u6", name: "Omar Saleh", initials: "OS", avatar: C(85), email: "omar.saleh@connect.sa", role: "hm", jobs: 0, status: "pending", last: { en: "invited 2d ago", ar: "دُعي قبل يومين" } },
  { id: "u7", name: "Noura Al-Otaibi", initials: "NO", avatar: C(190), email: "noura.alotaibi@connect.sa", role: "interviewer", jobs: 5, status: "active", last: { en: "4h ago", ar: "قبل 4 ساعات" } },
  { id: "u8", name: "James Mitchell", initials: "JM", avatar: C(230), email: "james.mitchell@connect.sa", role: "interviewer", jobs: 2, status: "active", last: { en: "yesterday", ar: "أمس" } },
  { id: "u9", name: "Priya Sharma", initials: "PS", avatar: C(330), email: "priya.sharma@external.com", role: "external", jobs: 1, status: "suspended", last: { en: "30d ago", ar: "قبل 30 يوماً" } },
];

const usersByRole = (roleKey) => ADMIN_USERS.filter(u => u.role === roleKey);

/* per-user overrides (on top of role). Ahmed = 2 overrides */
const USER_OVERRIDES = {
  u2: [
    { perm: "interviews.scorecard_submit", type: "grant" },
    { perm: "candidates.edit", type: "revoke" },
  ],
};

/* compute effective permission map for a user */
function effectivePerms(user) {
  const base = new Set(ROLE_DEFS[user.role].perms);
  (USER_OVERRIDES[user.id] || []).forEach(o => {
    if (o.type === "grant") base.add(o.perm);
    else base.delete(o.perm);
  });
  const map = {};
  ALL_PERMS.forEach(p => { map[p] = base.has(p); });
  return map;
}

/* jobs a user is on (View 2 right rail) */
const USER_JOBS = {
  u2: [
    { title: { en: "Senior Frontend Engineer", ar: "مهندس واجهات أول" }, dept: { en: "Engineering", ar: "الهندسة" }, access: "full" },
    { title: { en: "Senior Product Manager", ar: "مدير منتجات أول" }, dept: { en: "Product", ar: "المنتجات" }, access: "interview" },
    { title: { en: "Data Scientist", ar: "عالم بيانات" }, dept: { en: "Data & AI", ar: "البيانات والذكاء" }, access: "browse" },
    { title: { en: "Growth Marketing Lead", ar: "قائد تسويق النمو" }, dept: { en: "Marketing", ar: "التسويق" }, access: "full" },
  ],
};
const USER_ACTIVITY = {
  u2: [
    { en: "Moved Sara Mansour to Interview", ar: "نقل سارة منصور إلى المقابلة", w: { en: "2h ago", ar: "قبل ساعتين" } },
    { en: "Submitted scorecard for Khalid Al-Rahman", ar: "أرسل بطاقة تقييم لخالد الرحمن", w: { en: "yesterday", ar: "أمس" } },
    { en: "Created job 'Growth Marketing Lead'", ar: "أنشأ وظيفة «قائد تسويق النمو»", w: { en: "2d ago", ar: "قبل يومين" } },
    { en: "Edited candidate Yousef Al-Rashid", ar: "عدّل المرشح يوسف الراشد", w: { en: "3d ago", ar: "قبل 3 أيام" } },
    { en: "Invited Omar Saleh to Connect AI", ar: "دعا عمر صالح إلى كونكت إيه آي", w: { en: "5d ago", ar: "قبل 5 أيام" } },
  ],
};

/* ---------- Shared primitives ---------- */
function Switch({ on, onChange, disabled }) {
  return (
    <button className={"switch" + (on ? " on" : "")} role="switch" aria-checked={on} disabled={disabled}
      onClick={(e) => { e.stopPropagation(); if (!disabled) onChange(!on); }} />
  );
}

function RoleBadge({ roleKey, sm }) {
  const { t } = useApp();
  const color = ROLE_DEFS[roleKey] ? ROLE_DEFS[roleKey].color : "neutral";
  return <span className={"badge badge-" + color} style={{ height: sm ? 20 : 22 }}>{t(ROLE_DEFS[roleKey].key)}</span>;
}

function StatusDot({ status }) {
  const { t } = useApp();
  const c = { active: "var(--success)", pending: "var(--warning)", suspended: "var(--text-3)" }[status];
  return (
    <span className="flex" style={{ alignItems: "center", gap: 8 }}>
      <span className="sdot" style={{ background: c }} />
      <span style={{ fontSize: 13, fontWeight: 500 }}>{t("st." + status)}</span>
    </span>
  );
}

function AccessPill({ level }) {
  const { t } = useApp();
  const map = { browse: "neutral", interview: "info", full: "accent" };
  return <span className={"badge badge-" + map[level]}>{t("access." + level)}</span>;
}

function Kebab({ items }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
      <button className="icon-btn btn-sm" onClick={() => setOpen(o => !o)}><Icon name="more" size={18} /></button>
      {open && (
        <React.Fragment>
          <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div className="kebab-menu">
            {items.map((it, i) => (
              <button key={i} className={it.danger ? "danger" : ""} onClick={() => { setOpen(false); it.onClick && it.onClick(); }}>
                <Icon name={it.icon} size={15} />{it.label}
              </button>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

/* category granted-count for a given permission-state map */
function catCount(cat, map) {
  const granted = cat.perms.filter(p => map[p.id]).length;
  return { granted, total: cat.perms.length };
}

Object.assign(window, {
  PERM_CATS, ALL_PERMS, PERM_TOTAL, ROLE_DEFS, grantedCount, ADMIN_USERS, usersByRole,
  USER_OVERRIDES, effectivePerms, USER_JOBS, USER_ACTIVITY,
  Switch, RoleBadge, StatusDot, AccessPill, Kebab, catCount,
});
