/* Connect AI — Link screening agent to job: shared linkage modal + linked-jobs management (View C) */

function AgentLinkageModal({ entry, agentName, jobName, onClose, onConfirm, toast }) {
  // entry: 'wizard' | 'workflow' | 'agent'
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const ag = agentName || "Connect AI Senior FE Screen";
  const [job, setJob] = React.useState(entry === "agent" ? "" : "j2");
  const [open, setOpen] = React.useState({ ko: true, kb: false, goals: false, style: false });
  const [koAuto, setKoAuto] = React.useState(true);
  const [kbAuto, setKbAuto] = React.useState(true);
  const [kos, setKos] = React.useState([T("Are you authorized to work in KSA without sponsorship?", "هل أنت مخوّل للعمل في السعودية دون كفالة؟")]);
  const [kbs, setKbs] = React.useState([{ k: T("Salary range", "نطاق الراتب"), v: "SAR 22,000 – 28,000 / month" }, { k: T("Day-to-day", "المهام اليومية"), v: T("You'll work on the customer-facing dashboard…", "ستعمل على لوحة العملاء…") }]);
  const jobs = (window.DATA ? window.DATA.jobs : []);
  const linkedIds = ["j2", "j3"];

  const titles = {
    wizard: [T(`Customize '${ag}' for this job`, `خصّص '${ag}' لهذه الوظيفة`), T("Add job-specific overrides on top of the base agent.", "أضف تخصيصات خاصة بالوظيفة فوق الوكيل الأساسي.")],
    workflow: [T("Link or replace screening agent", "ربط أو استبدال وكيل الفرز"), T("Connect an agent to this stage and customize for the job.", "اربط وكيلاً بهذه المرحلة وخصّصه للوظيفة.")],
    agent: [T(`Link '${ag}' to a job`, `اربط '${ag}' بوظيفة`), T("Pick a job and set its job-specific overrides.", "اختر وظيفة واضبط تخصيصاتها.")],
  };
  const cta = { wizard: T("Save and continue", "حفظ ومتابعة"), workflow: T("Save linkage", "حفظ الربط"), agent: T("Link to this job", "اربط بهذه الوظيفة") };

  const Section = ({ id, title, sub, children }) => (
    <div className="card" style={{ boxShadow: "none", border: "1px solid var(--border)", overflow: "hidden" }}>
      <button className="flex" style={{ width: "100%", alignItems: "center", gap: 10, padding: "11px 13px", textAlign: "start" }} onClick={() => setOpen(o => ({ ...o, [id]: !o[id] }))}>
        <Icon name={open[id] ? "chevDown" : "chevRight"} size={14} style={{ color: "var(--text-3)", flex: "0 0 auto" }} />
        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div></div>
      </button>
      {open[id] && <div style={{ padding: "0 13px 13px", display: "flex", flexDirection: "column", gap: 9 }}>{sub && <div className="faint" style={{ fontSize: 12 }}>{sub}</div>}{children}</div>}
    </div>
  );

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 720, width: "100%" }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ai-soft)", color: "var(--ai)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="link2" size={16} /></span>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 15.5 }}>{titles[entry][0]}</div><div className="faint" style={{ fontSize: 12.5 }}>{titles[entry][1]}</div></div>
          <button className="btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17} /></button>
        </div>
        <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 18 }}>
          {/* LEFT — job */}
          <div>
            {entry === "agent" ? (
              <React.Fragment>
                <div className="field"><label>{T("Which job?", "أي وظيفة؟")}</label>
                  <select className="select" value={job} onChange={e => setJob(e.target.value)}><option value="">{T("Choose a job…", "اختر وظيفة…")}</option>{jobs.map(j => <option key={j.id} value={j.id}>{j[ar ? "ar" : "en"]}{linkedIds.includes(j.id) ? T(" (already linked)", " (مرتبطة)") : ""}</option>)}</select>
                </div>
                {job && (() => { const j = jobs.find(x => x.id === job); return (
                  <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none", marginTop: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{j[ar ? "ar" : "en"]}</div>
                    <div className="faint" style={{ fontSize: 12, marginTop: 4 }}>{T("Workflow", "سير العمل")}: Standard Hire · {T("Stage", "المرحلة")}: {T("Screening Call", "مكالمة الفرز")}</div>
                    <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>{T("Salary band", "نطاق الراتب")}: SAR {j.salary}</div>
                  </div>
                ); })()}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="faint" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 6 }}>{T("Job context (read-only)", "سياق الوظيفة (للقراءة)")}</div>
                <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{T("Senior Frontend Engineer", "مهندس واجهات أول")}</div>
                  <div className="faint" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{T("Engineering · Workflow: Standard Hire · Stage: Screening Call", "الهندسة · سير العمل: Standard Hire · المرحلة: مكالمة الفرز")}</div>
                  <div style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.55, color: "var(--text-2)" }}>{T("Build our customer-facing React platform with a focus on performance and design systems.", "بناء منصة React الموجّهة للعملاء مع التركيز على الأداء وأنظمة التصميم.")}</div>
                  <div className="flex" style={{ gap: 6, marginTop: 10, flexWrap: "wrap" }}><span className="badge badge-accent" style={{ height: 19 }}>6 {T("must", "إلزامي")}</span><span className="badge badge-neutral" style={{ height: 19 }}>4 {T("nice", "مفضّل")}</span><span className="badge badge-danger" style={{ height: 19 }}>1 {T("dealbreaker", "شرط")}</span></div>
                  <div className="faint" style={{ fontSize: 12, marginTop: 8 }}>SAR 22,000 – 28,000</div>
                </div>
              </React.Fragment>
            )}
          </div>

          {/* RIGHT — customizations */}
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{T("Customizations for this job", "تخصيصات هذه الوظيفة")}</div>
            <div className="faint" style={{ fontSize: 12, marginBottom: 12 }}>{T("These apply only to this job. The base agent template is unchanged.", "تنطبق على هذه الوظيفة فقط. قالب الوكيل الأساسي لا يتغيّر.")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Section id="ko" title={T("Job-specific knockout questions", "أسئلة استبعاد خاصة")}>
                {kos.map((k, i) => (
                  <div key={i} className="flex" style={{ alignItems: "center", gap: 8, padding: "7px 10px", background: "var(--surface-2)", borderRadius: "var(--r-sm)", fontSize: 12.5 }}>
                    <Icon name="alert" size={13} style={{ color: "var(--danger)", flex: "0 0 auto" }} /><span style={{ flex: 1 }}>{k}</span><button className="btn-icon btn-sm" onClick={() => setKos(ks => ks.filter((_, j) => j !== i))}><Icon name="x" size={13} /></button>
                  </div>
                ))}
                <button className="btn btn-subtle btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => { setKos(ks => [...ks, T("New knockout question", "سؤال استبعاد جديد")]); toast && toast(T("Question added", "أُضيف السؤال")); }}><Icon name="plus" size={13} />{T("Add knockout question", "أضف سؤال استبعاد")}</button>
                <label className="flex" style={{ alignItems: "center", gap: 9, cursor: "pointer", fontSize: 12 }} onClick={() => setKoAuto(v => !v)}><span style={{ width: 28, height: 16, borderRadius: 20, background: koAuto ? "var(--accent)" : "var(--border-strong)", position: "relative", flex: "0 0 28px" }}><span style={{ position: "absolute", top: 2, insetInlineStart: koAuto ? 14 : 2, width: 12, height: 12, borderRadius: "50%", background: "#fff", transition: "inset-inline-start .2s" }} /></span>{T("Pull from job's dealbreakers automatically", "اسحب من شروط الوظيفة تلقائياً")}</label>
              </Section>
              <Section id="kb" title={T("Job-specific knowledge base", "قاعدة معرفة خاصة")}>
                {kbs.map((e, i) => (
                  <div key={i} className="flex" style={{ alignItems: "flex-start", gap: 8, padding: "7px 10px", background: "var(--surface-2)", borderRadius: "var(--r-sm)", fontSize: 12.5 }}>
                    <div style={{ flex: 1 }}><b>{e.k}:</b> {e.v}</div><button className="btn-icon btn-sm" onClick={() => setKbs(ks => ks.filter((_, j) => j !== i))}><Icon name="x" size={13} /></button>
                  </div>
                ))}
                <button className="btn btn-subtle btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => toast && toast(T("Entry editor opened", "فُتح المحرّر"))}><Icon name="plus" size={13} />{T("Add knowledge base entry", "أضف مدخل قاعدة معرفة")}</button>
                <label className="flex" style={{ alignItems: "center", gap: 9, cursor: "pointer", fontSize: 12 }} onClick={() => setKbAuto(v => !v)}><span style={{ width: 28, height: 16, borderRadius: 20, background: kbAuto ? "var(--accent)" : "var(--border-strong)", position: "relative", flex: "0 0 28px" }}><span style={{ position: "absolute", top: 2, insetInlineStart: kbAuto ? 14 : 2, width: 12, height: 12, borderRadius: "50%", background: "#fff", transition: "inset-inline-start .2s" }} /></span>{T("Pull from job's JD automatically", "اسحب من وصف الوظيفة تلقائياً")}</label>
              </Section>
              <Section id="goals" title={T("Custom screening goals", "أهداف فرز مخصّصة")} sub={T("Add screening goals from this job's rubric, or define your own.", "أضف أهدافاً من معايير الوظيفة أو عرّف خاصتك.")}>
                <button className="btn btn-subtle btn-sm" style={{ alignSelf: "flex-start" }}><Icon name="plus" size={13} />{T("Add goal", "أضف هدفاً")}</button>
              </Section>
              <Section id="style" title={T("Agent style overrides", "تخصيص أسلوب الوكيل")} sub={T("Override tone, length, or language just for this job.", "تجاوز النبرة أو المدة أو اللغة لهذه الوظيفة فقط.")}>
                <div className="faint" style={{ fontSize: 12 }}>{T("Using template defaults: Professional · 15 min · EN/AR", "يستخدم الإعدادات الافتراضية: مهنية · 15 د · EN/AR")}</div>
              </Section>
            </div>
          </div>
        </div>

        {/* summary */}
        <div style={{ padding: "0 22px 14px" }}>
          <div className="card card-pad" style={{ background: "color-mix(in oklch, var(--ai) 6%, var(--surface))", borderInlineStart: "3px solid var(--ai)", boxShadow: "none", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div className="flex" style={{ alignItems: "center", gap: 6, marginBottom: 4 }}><Icon name="sparkles" size={13} fill style={{ color: "var(--ai)" }} /><span style={{ fontWeight: 600, fontSize: 12.5 }}>{T("Linkage summary", "ملخص الربط")}</span></div>
              <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-2)" }}>{T(`Runs for candidates reaching the Screening Call stage. Uses base template '${ag}' with ${kos.length + kbs.length} job-specific overrides.`, `يعمل للمرشحين عند بلوغ مرحلة مكالمة الفرز. يستخدم القالب '${ag}' مع ${kos.length + kbs.length} تخصيصات للوظيفة.`)}</div>
            </div>
            <div className="flex" style={{ alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 600 }}>
              <span className="badge badge-neutral" style={{ height: 19 }}>{T("Template", "قالب")}</span><Icon name={ar ? "arrowLeft" : "arrowRight"} size={12} style={{ color: "var(--text-3)" }} />
              <span className="badge badge-warning" style={{ height: 19 }}>{T("Job layer", "طبقة الوظيفة")}</span><Icon name={ar ? "arrowLeft" : "arrowRight"} size={12} style={{ color: "var(--text-3)" }} />
              <span className="badge badge-success" style={{ height: 19 }}>{T("Active", "نشط")}</span>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>{T("Cancel", "إلغاء")}</button>
          <a className="muted flex" style={{ alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginInlineStart: 8 }} onClick={() => toast && toast(T("Opening call preview…", "فتح المعاينة…"))}><Icon name="sparkles" size={13} fill style={{ color: "var(--ai)" }} />{T("Preview the call", "معاينة المكالمة")}</a>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-primary btn-sm" disabled={entry === "agent" && !job} onClick={() => { onConfirm && onConfirm(); toast && toast(T("Linkage saved", "حُفظ الربط")); }}>{cta[entry]}</button>
        </div>
      </div>
    </div>
  );
}

/* ===== VIEW C — Linked jobs management ===== */
function ScreeningLinkedJobs({ go, toast }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const T = (en, arr) => (ar ? arr : en);
  const [modal, setModal] = React.useState(false);
  const [unlink, setUnlink] = React.useState(null);
  const rows = [
    { job: T("Senior Frontend Engineer", "مهندس واجهات أول"), dept: T("Engineering", "الهندسة"), status: "active", since: T("May 15, 2026", "15 مايو 2026"), ov: 2 },
    { job: T("Senior Full-Stack Engineer", "مهندس متكامل أول"), dept: T("Engineering", "الهندسة"), status: "active", since: T("Jun 1, 2026", "1 يونيو 2026"), ov: 0 },
    { job: T("Senior React Engineer", "مهندس React أول"), dept: T("Engineering", "الهندسة"), status: "closed", since: T("Apr 3, 2026", "3 أبريل 2026"), ov: 1 },
    { job: T("Engineering Manager", "مدير هندسة"), dept: T("Engineering", "الهندسة"), status: "active", since: T("Jun 5, 2026", "5 يونيو 2026"), ov: 3 },
  ];
  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="crumbs" style={{ marginBottom: 12 }}>
        <a onClick={() => go("screening")}>{T("Screening Calls", "مكالمات الفرز")}</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} />
        <a onClick={() => go("screening-agent")}>Connect AI Senior FE Screen</a><Icon name={ar ? "chevLeft" : "chevRight"} size={13} />
        <span style={{ color: "var(--text-2)" }}>{T("Linked jobs", "الوظائف المرتبطة")}</span>
      </div>
      <div className="page-head">
        <div><h1 className="page-title">{T("Linked jobs", "الوظائف المرتبطة")}: Connect AI Senior FE Screen</h1><div className="page-sub">{T("This agent is currently used by 4 jobs.", "يُستخدم هذا الوكيل في 4 وظائف.")}</div></div>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={() => setModal(true)}><Icon name="plus" size={16} />{T("Link to another job", "اربط بوظيفة أخرى")}</button>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>{T("Job title", "الوظيفة")}</th><th>{T("Department", "القسم")}</th><th>{T("Status", "الحالة")}</th><th>{T("Stage", "المرحلة")}</th><th>{T("Linked since", "مرتبط منذ")}</th><th>{T("Customizations", "التخصيصات")}</th><th></th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ cursor: "default", opacity: r.status === "closed" ? 0.65 : 1 }}>
                <td style={{ fontWeight: 600 }}>{r.job}</td>
                <td className="faint">{r.dept}</td>
                <td>{r.status === "active" ? <span className="badge badge-success" style={{ height: 19 }}><span className="b-dot" />{T("Active", "نشطة")}</span> : <span className="badge badge-neutral" style={{ height: 19 }}>{T("Closed", "مغلقة")}</span>}</td>
                <td className="faint">{T("Screening Call", "مكالمة الفرز")}</td>
                <td className="faint">{r.since}</td>
                <td>{r.ov > 0 ? <span className="badge badge-accent" style={{ height: 19 }}>{r.ov} {T("overrides", "تخصيصات")}</span> : <span className="faint">{T("None", "لا شيء")}</span>}</td>
                <td style={{ textAlign: "end", whiteSpace: "nowrap" }}>
                  {r.status === "closed"
                    ? <button className="btn btn-subtle btn-sm" onClick={() => go("screening-review")}>{T("View archive", "عرض الأرشيف")}</button>
                    : <span className="flex" style={{ gap: 6, justifyContent: "flex-end" }}>
                        <button className="btn btn-subtle btn-sm" onClick={() => setModal(true)}>{T("Edit", "تحرير")}</button>
                        <button className="btn-icon btn-sm" onClick={() => setUnlink(r)} title={T("Unlink", "فك الربط")}><Icon name="ban" size={14} style={{ color: "var(--danger)" }} /></button>
                      </span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <AgentLinkageModal entry="agent" agentName="Connect AI Senior FE Screen" onClose={() => setModal(false)} onConfirm={() => setModal(false)} toast={toast} />}
      {unlink && (
        <div className="scrim" onClick={() => setUnlink(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div style={{ flex: 1, fontWeight: 600 }}>{T("Unlink from", "فك الربط عن")} {unlink.job}?</div><button className="btn-icon btn-sm" onClick={() => setUnlink(null)}><Icon name="x" size={17} /></button></div>
            <div className="modal-body"><p style={{ fontSize: 14, lineHeight: 1.6 }}>{T("Candidates reaching this job's screening stage will no longer get this agent. Its job-specific overrides will be archived (not deleted) in case you re-link.", "لن يحصل المرشحون في مرحلة الفرز على هذا الوكيل. ستُؤرشَف التخصيصات الخاصة (لا تُحذف) تحسّباً لإعادة الربط.")}</p></div>
            <div className="modal-foot"><div className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm" onClick={() => setUnlink(null)}>{T("Cancel", "إلغاء")}</button><button className="btn btn-danger btn-sm" onClick={() => { setUnlink(null); toast(T("Unlinked", "تم فك الربط")); }}>{T("Unlink", "فك الربط")}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

window.AgentLinkageModal = AgentLinkageModal;
window.ScreeningLinkedJobs = ScreeningLinkedJobs;
