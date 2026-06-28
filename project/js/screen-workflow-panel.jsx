/* Connect AI — Workflows: stage configuration side panel (View 3) */

function StagePanel({ stage, onClose, toast, onChange }) {
  const { t, L, lang } = useApp();
  const open = !!stage;
  const [tab, setTab] = React.useState("basics");

  // per-stage config state (seeded when a stage opens)
  const [cfg, setCfg] = React.useState(null);
  const [removeWarn, setRemoveWarn] = React.useState(false);
  const [linkModal, setLinkModal] = React.useState(false);

  React.useEffect(() => {
    if (stage) {
      setTab("basics");
      setRemoveWarn(false);
      setCfg({
        name: L(stage.name),
        type: stage.type,
        required: !stage.optional,
        color: stage.color || "gray",
        emailOn: !!stage.email,
        template: stage.email || null,
        recipients: { candidate: true, hm: false, recruiter: false, interviewer: false, custom: false },
        sendMode: "auto",
        delay: "now",
        who: { admin: false, recruiter: true, hm: true, interviewer: false },
        reqScorecards: false, reqAssessment: false, reqApproval: false,
        reqRejection: stage.terminal === "exit",
        sla: 3,
        agentLinked: stage.type === "screening",
        assessOn: stage.type === "assessment", assessId: stage.type === "assessment" ? "as1" : null, assessDeadline: 5, assessRemind: true,
      });
    }
  }, [stage && stage.id]);

  const upd = (patch) => { setCfg(c => ({ ...c, ...patch })); onChange(); };
  const [tplPickerOpen, setTplPickerOpen] = React.useState(false);
  const toggleObj = (key, sub) => { setCfg(c => ({ ...c, [key]: { ...c[key], [sub]: !c[key][sub] } })); onChange(); };

  const swatches = [["gray", "var(--text-3)"], ["blue", "var(--info)"], ["purple", "var(--purple)"], ["teal", "var(--ai)"], ["amber", "var(--warning)"]];
  const ctypes = ["applied", "screening", "interview", "assessment", "offer", "hired", "rejected", "other"];

  return (
    <React.Fragment>
      <div className={"drawer-scrim" + (open ? " open" : "")} style={{ pointerEvents: open ? "auto" : "none" }} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        {open && cfg && (
          <React.Fragment>
            <div className="drawer-head" style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <InlineEdit value={cfg.name} onCommit={(v) => upd({ name: v })} style={{ fontSize: 18, fontWeight: 600, borderRadius: 6, padding: "1px 4px", marginInlineStart: -4 }} inputStyle={{ fontSize: 18, fontWeight: 600, height: 38 }} />
                <div style={{ marginTop: 6 }}><CTChip type={cfg.type} /></div>
              </div>
              <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18} /></button>
            </div>

            <div className="ptabs">
              <button className={tab === "basics" ? "on" : ""} onClick={() => setTab("basics")}>{t("wf.tabBasics")}</button>
              <button className={tab === "email" ? "on" : ""} onClick={() => setTab("email")}>{t("wf.tabEmail")}</button>
              <button className={tab === "rules" ? "on" : ""} onClick={() => setTab("rules")}>{t("wf.tabRules")}</button>
              {(cfg.type === "screening" || cfg.type === "assessment") && <button className={tab === "agent" ? "on" : ""} onClick={() => setTab("agent")}>{lang === "ar" ? "وكيل الفرز" : "Screening Agent"}</button>}
            </div>

            <div className="drawer-body">
              {tab === "basics" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div className="field"><label>{t("wf.stageName")}</label><input className="input" value={cfg.name} onChange={e => upd({ name: e.target.value })} /></div>
                  <div className="field"><label>{t("wf.descOptional")}</label><textarea className="textarea" style={{ minHeight: 70 }} placeholder={t("wf.description") + "…"} onChange={onChange} /></div>
                  <div className="field">
                    <label>{t("wf.canonicalType")}</label>
                    <select className="select" value={cfg.type} onChange={e => upd({ type: e.target.value })}>
                      {ctypes.map(ct => <option key={ct} value={ct}>{t("ct." + ct)}</option>)}
                    </select>
                    <div className="hint">{t("wf.canonicalHelper")}</div>
                  </div>
                  <div className="field">
                    <label>{cfg.required ? t("wf.requiredStage") : t("wf.optionalSkip")}</label>
                    <div className="flex" style={{ gap: 10, alignItems: "center" }}>
                      <Switch on={cfg.required} onChange={(v) => upd({ required: v })} />
                      <span className="muted" style={{ fontSize: 13 }}>{cfg.required ? t("wf.requiredStage") : t("wf.optionalSkip")}</span>
                    </div>
                  </div>
                  <div className="field">
                    <label>{t("wf.colorAccent")}</label>
                    <div className="swatches">
                      {swatches.map(([k, c]) => (
                        <button key={k} className={"swatch" + (cfg.color === k ? " on" : "")} style={{ background: c }} onClick={() => upd({ color: k })}>
                          {cfg.color === k && <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff" }}><Icon name="check" size={15} /></span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email template — same design as Add Stage modal */}
                  <hr className="divider" />
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div className="flex" style={{ alignItems:"center", gap:11 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:13.5 }}>{t("wf.linkEmailNow")}</div>
                        <div className="muted" style={{ fontSize:12 }}>{lang==="ar"?"يمكنك ضبط التفاصيل في تبويب «أتمتة البريد».":"Details configurable in the Email automation tab."}</div>
                      </div>
                      <Switch on={cfg.emailOn} onChange={(v) => { upd({ emailOn: v }); if (v && !cfg.template) setTplPickerOpen(true); }} />
                    </div>
                    {cfg.emailOn && cfg.template && (
                      <div className="flex" style={{ alignItems:"center", gap:11, padding:"10px 13px", background:"var(--surface)", border:"1.5px solid var(--border-strong)", borderRadius:"var(--r-sm)" }}>
                        <span style={{ width:28,height:28,borderRadius:7,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto" }}><Icon name="mail" size={15} /></span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cfg.template}</div>
                          <div className="muted" style={{ fontSize:11.5 }}>{lang==="ar"?"نقر لتغيير القالب":"Click to change"}</div>
                        </div>
                        <button className="btn btn-subtle btn-sm" onClick={() => setTplPickerOpen(true)}>{lang==="ar"?"تغيير":"Change"}</button>
                      </div>
                    )}
                    {cfg.emailOn && !cfg.template && (
                      <button className="btn btn-subtle btn-sm" style={{ alignSelf:"flex-start" }} onClick={() => setTplPickerOpen(true)}><Icon name="mail" size={14} />{lang==="ar"?"اختر قالباً":"Choose a template"}</button>
                    )}
                  </div>
                </div>
              )}

              {tab === "email" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div className="flex" style={{ alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface-2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{t("wf.emailToggle")}</div></div>
                    <Switch on={cfg.emailOn} onChange={(v) => upd({ emailOn: v })} />
                  </div>

                  {cfg.emailOn ? (
                    <React.Fragment>
                      {/* template card (linked) */}
                      {cfg.template ? (
                        <React.Fragment>
                          <div className="field"><label>{t("wf.template")}</label>
                            <div className="flex" style={{ alignItems: "center", gap: 11, padding: "12px 14px", border: "1.5px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)" }}>
                              <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-strong)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="mail" size={16} /></span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cfg.template}</div>
                                <div className="flex" style={{ gap: 12, marginTop: 2 }}>
                                  <a className="muted" style={{ fontSize: 11.5, fontWeight: 600, cursor: "pointer" }} onClick={() => setTplPickerOpen(true)}>{t("wf.changeTemplate")}</a>
                                  <a className="muted" style={{ fontSize: 11.5, fontWeight: 600 }}>{t("wf.viewTemplate")}</a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="field"><label>{t("wf.recipients")}</label>
                            <div>{[["candidate","wf.rcpCandidate"],["hm","wf.rcpHM"],["recruiter","wf.rcpRecruiter"],["interviewer","wf.rcpInterviewer"]].map(([k,lab])=>(
                              <div key={k} className={"cbx"+(cfg.recipients[k]?" on":"")} onClick={()=>toggleObj("recipients",k)}><span className="box">{cfg.recipients[k]&&<Icon name="check" size={13}/>}</span>{t(lab)}</div>
                            ))}</div>
                          </div>
                          <div className="field"><label>{t("wf.sendMode")}</label>
                            <div className={"rad-opt"+(cfg.sendMode==="auto"?" on":"")} onClick={()=>upd({sendMode:"auto"})}><span className="rad"/><div style={{fontWeight:600,fontSize:13}}>{t("wf.autoSend")}</div></div>
                            <div className={"rad-opt"+(cfg.sendMode==="draft"?" on":"")} onClick={()=>upd({sendMode:"draft"})}><span className="rad"/><div style={{fontWeight:600,fontSize:13}}>{t("wf.draftMode")}</div></div>
                          </div>
                          <div className="field"><label>{t("wf.delay")}</label>
                            <select className="select" value={cfg.delay} onChange={e=>upd({delay:e.target.value})}>
                              <option value="now">{t("wf.sendNow")}</option><option value="1h">{t("wf.after1h")}</option><option value="1d">{t("wf.after1d")}</option>
                            </select>
                          </div>
                          <a className="muted" style={{ fontSize:12.5, fontWeight:600, color:"var(--danger)", cursor:"pointer" }} onClick={()=>upd({template:null})}><Icon name="trash" size={13} />{t("wf.removeEmail")}</a>
                        </React.Fragment>
                      ) : (
                        /* no template yet */
                        <div style={{ padding:"16px", background:"var(--surface-2)", border:"1.5px dashed var(--border-strong)", borderRadius:"var(--r-md)", textAlign:"center" }}>
                          <div style={{ fontWeight:600, fontSize:13.5, marginBottom:6 }}>{lang==="ar"?"لم يُحدَّد قالب بعد.":"No template selected."}</div>
                          <button className="btn btn-subtle btn-sm" onClick={()=>setTplPickerOpen(true)}><Icon name="mail" size={14}/>{lang==="ar"?"اختر قالباً":"Choose a template"}</button>
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    <div style={{ textAlign:"center", padding:"26px 16px", background:"var(--surface-2)", borderRadius:"var(--r-md)", border:"1px dashed var(--border-strong)" }}>
                      <Icon name="mail" size={26} style={{ color:"var(--text-3)" }} />
                      <div className="muted" style={{ fontSize:13, margin:"10px 0 12px" }}>{t("wf.noEmailEntry")}</div>
                      <button className="btn btn-ai btn-sm" onClick={()=>{ upd({emailOn:true}); setTplPickerOpen(true); }}><Icon name="plus" size={14}/>{t("wf.setupEmail")}</button>
                    </div>
                  )}
                </div>
              )}

              {tab === "rules" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <div className="field">
                    <label>{t("wf.whoCanMove")}</label>
                    <div className="flex" style={{ flexWrap: "wrap", gap: 8 }}>
                      {[["admin", "role.admin"], ["recruiter", "role.recruiter"], ["hm", "role.hm"], ["interviewer", "role.interviewer"]].map(([k, lab]) => (
                        <span key={k} className={"chip chip-sel" + (cfg.who[k] ? " on" : "")} onClick={() => toggleObj("who", k)}>
                          {cfg.who[k] && <Icon name="check" size={12} />}{t(lab)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>{t("wf.requiredBefore")}</label>
                    <div>
                      <div className={"cbx" + (cfg.reqScorecards ? " on" : "")} onClick={() => upd({ reqScorecards: !cfg.reqScorecards })}><span className="box">{cfg.reqScorecards && <Icon name="check" size={13} />}</span>{t("wf.reqScorecards")}</div>
                      <div className={"cbx" + (cfg.reqAssessment ? " on" : "")} onClick={() => upd({ reqAssessment: !cfg.reqAssessment })}><span className="box">{cfg.reqAssessment && <Icon name="check" size={13} />}</span>{t("wf.reqAssessment")}</div>
                      <div className={"cbx" + (cfg.reqApproval ? " on" : "")} onClick={() => upd({ reqApproval: !cfg.reqApproval })}><span className="box">{cfg.reqApproval && <Icon name="check" size={13} />}</span>{t("wf.reqApproval")}</div>
                      {stage.terminal === "exit" && (
                        <div className={"cbx" + (cfg.reqRejection ? " on" : "")} onClick={() => upd({ reqRejection: !cfg.reqRejection })}><span className="box">{cfg.reqRejection && <Icon name="check" size={13} />}</span>{t("wf.reqRejection")}</div>
                      )}
                    </div>
                  </div>

                  <div className="field">
                    <label>{t("wf.sla")}</label>
                    <div className="flex" style={{ alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                      <span className="muted" style={{ fontSize: 13 }}>{t("wf.slaText1")}</span>
                      <input className="input mono" type="number" value={cfg.sla} onChange={e => upd({ sla: e.target.value })} style={{ width: 64, textAlign: "center", height: 36 }} />
                      <span className="muted" style={{ fontSize: 13 }}>{t("wf.slaText2")}</span>
                    </div>
                    <a className="muted flex" style={{ alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, marginTop: 4 }}><Icon name="plus" size={13} />{t("wf.addEscalation")}</a>
                  </div>

                  {/* Auto-assign assessment (Epic 12.2.2) */}
                  <hr className="divider" />
                  <div className="field">
                    <div className="flex" style={{ alignItems: "center", gap: 11, marginBottom: cfg.assessOn ? 12 : 0 }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--ai-soft)", color: "var(--ai)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="assessment" size={16} /></span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{lang === "ar" ? "إرسال تقييم عند الدخول" : "Send assessment on entry"}</div>
                        <div className="muted" style={{ fontSize: 12 }}>{lang === "ar" ? "يُرسَل تلقائياً عند وصول المرشح لهذه المرحلة" : "Auto-assigns when a candidate reaches this stage"}</div>
                      </div>
                      <Switch on={!!cfg.assessOn} onChange={v => upd({ assessOn: v })} />
                    </div>
                    {cfg.assessOn && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div className="field"><label>{lang === "ar" ? "التقييم" : "Assessment"}</label>
                          <select className="select" value={cfg.assessId || ""} onChange={e => upd({ assessId: e.target.value })}>
                            <option value="">{lang === "ar" ? "اختر تقييماً منشوراً…" : "Choose a published assessment…"}</option>
                            {window.ASSESS.ASSESSMENTS.filter(a => a.status === "published").map(a => <option key={a.id} value={a.id}>{L(a.title)}</option>)}
                          </select>
                        </div>
                        <div className="flex" style={{ gap: 12, flexWrap: "wrap" }}>
                          <div className="field" style={{ flex: "1 1 130px" }}><label>{lang === "ar" ? "الموعد النهائي" : "Deadline"}</label>
                            <select className="select" value={cfg.assessDeadline} onChange={e => upd({ assessDeadline: +e.target.value })}>{[3, 5, 7, 14].map(d => <option key={d} value={d}>{d} {lang === "ar" ? "أيام" : "days"}</option>)}</select></div>
                          <div className="field" style={{ flex: "1 1 130px" }}><label>{lang === "ar" ? "التذكير" : "Reminder"}</label>
                            <button className="flex" onClick={() => upd({ assessRemind: !cfg.assessRemind })} style={{ alignItems: "center", gap: 8, height: "var(--row-h)", padding: "0 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", width: "100%" }}>
                              <Switch on={!!cfg.assessRemind} onChange={() => {}} /><span style={{ fontSize: 12.5, color: "var(--text-2)" }}>{lang === "ar" ? "قبل 24 ساعة" : "24h before"}</span></button></div>
                        </div>
                        <div className="warn-bar" style={{ padding: "11px 13px", background: "var(--info-soft)", borderColor: "color-mix(in oklch, var(--info) 30%, transparent)" }}>
                          <span className="wb-ico"><Icon name="alert" size={15} style={{ color: "var(--info)" }} /></span>
                          <span className="wb-text" style={{ fontSize: 12 }}>{lang === "ar"
                            ? "إن كان لدى المرشح نتيجة مُسلَّمة لنفس التقييم، يُتخطّى الإرسال وتُعرَض النتيجة مع وسم «مُعاد استخدامها». وإن كان لديه محاولة منتهية أو قيد التنفيذ، يُنبَّه المُوظِّف قبل تقدّم سير العمل."
                            : "If the candidate already submitted this assessment, sending is skipped and the existing result shows a “Reused from previous submission” tag. If they have an expired or in-progress attempt, the recruiter is notified before the workflow advances."}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === "agent" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 8 }}>{lang === "ar" ? "وكيل الفرز الحالي" : "Current screening agent"}</div>
                    {cfg.agentLinked ? (
                      <div className="card card-pad" style={{ background: "var(--surface-2)", boxShadow: "none" }}>
                        <div className="flex" style={{ alignItems: "center", gap: 10 }}>
                          <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--ai-soft)", color: "var(--ai)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="sparkles" size={15} fill /></span>
                          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>Connect AI Senior FE Screen</div><div className="faint" style={{ fontSize: 11.5 }}>{lang === "ar" ? "مخصّص · 6 أهداف · 15 د · EN/AR" : "Custom · 6 goals · 15 min · EN/AR"}</div></div>
                          <span className="badge badge-success" style={{ height: 19 }}><span className="b-dot" />{lang === "ar" ? "نشط" : "Active"}</span>
                        </div>
                        <div className="flex" style={{ gap: 8, marginTop: 12 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setLinkModal(true)}><Icon name="edit" size={13} />{lang === "ar" ? "تحرير الربط" : "Edit linkage"}</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setLinkModal(true)}>{lang === "ar" ? "استبدال" : "Replace agent"}</button>
                          <div className="spacer" style={{ flex: 1 }} />
                          <button className="btn btn-subtle btn-sm" style={{ color: "var(--danger)" }} onClick={() => upd({ agentLinked: false })}>{lang === "ar" ? "فك الربط" : "Unlink"}</button>
                        </div>
                      </div>
                    ) : (
                      <div className="card card-pad" style={{ textAlign: "center", background: "var(--surface-2)", boxShadow: "none", padding: 22 }}>
                        <Icon name="sparkles" size={24} fill style={{ color: "var(--text-3)" }} />
                        <div style={{ fontSize: 13.5, fontWeight: 600, margin: "8px 0 3px" }}>{lang === "ar" ? "لا وكيل فرز مرتبط بهذه المرحلة" : "No screening agent linked to this stage."}</div>
                        <div className="faint" style={{ fontSize: 12, marginBottom: 12 }}>{lang === "ar" ? "سيتخطّى المرشحون الفرز ما لم يُربط وكيل." : "Candidates will skip screening unless an agent is linked."}</div>
                        <button className="btn btn-primary btn-sm" onClick={() => setLinkModal(true)}><Icon name="plus" size={14} />{lang === "ar" ? "ربط وكيل فرز" : "Link a screening agent"}</button>
                      </div>
                    )}
                  </div>
                  {cfg.agentLinked && (
                    <React.Fragment>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{lang === "ar" ? "تخصيصات خاصة بالوظيفة" : "Job-specific overrides"}</div>
                        <div className="faint" style={{ fontSize: 11.5, marginBottom: 10 }}>{lang === "ar" ? "تُضاف إلى إعداد الوكيل الأساسي لهذه الوظيفة فقط." : "Added to the agent's base config for this job only."}</div>
                        {[{ t: lang === "ar" ? "+ سؤال: تصريح العمل في السعودية دون تأشيرة" : "+ 1 question: Authorization to work in KSA without visa" }, { t: lang === "ar" ? "+ 3 مدخلات: نطاقات الرواتب، سياسة العمل المرن، عنوان المكتب" : "+ 3 entries: Compensation bands, hybrid policy, office address" }].map((o, i) => (
                          <div key={i} className="flex" style={{ alignItems: "center", gap: 8, padding: "9px 11px", background: "var(--surface-2)", borderRadius: "var(--r-sm)", marginBottom: 7, fontSize: 12.5 }}>
                            <span style={{ flex: 1 }}>{o.t}</span><span className="badge badge-accent" style={{ height: 18, fontSize: 10 }}>{lang === "ar" ? "لهذه الوظيفة" : "This job"}</span>
                          </div>
                        ))}
                        <button className="btn btn-subtle btn-sm" onClick={() => setLinkModal(true)}><Icon name="plus" size={13} />{lang === "ar" ? "إضافة تخصيص" : "Add override"}</button>
                      </div>
                      <div className="card card-pad flex" style={{ gap: 10, alignItems: "center", background: "var(--success-soft)", boxShadow: "none" }}>
                        <Icon name="check" size={15} style={{ color: "var(--success)", flex: "0 0 auto" }} />
                        <span style={{ fontSize: 12.5 }}>{lang === "ar" ? "متزامن مع القالب (v3 من 'Connect AI Senior FE Screen')" : "In sync with template (v3 of 'Connect AI Senior FE Screen')"}</span>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>

            <div className="drawer-foot" style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
              {removeWarn && (
                <div className="warn-bar" style={{ padding: "10px 13px" }}>
                  <span className="wb-ico"><Icon name="alert" size={16} /></span>
                  <span className="wb-text">{stage.count} {t("wf.removeWarn1")}</span>
                </div>
              )}
              <div className="flex" style={{ gap: 10 }}>
                <button className="btn btn-subtle" style={{ color: "var(--danger)" }} onClick={() => setRemoveWarn(true)}><Icon name="trash" size={15} />{t("wf.removeStage")}</button>
                <div className="spacer" style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={onClose}><Icon name="check" size={16} />{t("wf.done")}</button>
              </div>
            </div>
          </React.Fragment>
        )}
      </aside>
      {tplPickerOpen && cfg && <TemplatePicker stageType={cfg.type} stageName={cfg.name} open onClose={() => setTplPickerOpen(false)} onLink={v => { upd({ template: v.template, emailOn: true }); setTplPickerOpen(false); }} />}
      {linkModal && <AgentLinkageModal entry="workflow" onClose={() => setLinkModal(false)} onConfirm={() => { upd({ agentLinked: true }); setLinkModal(false); }} toast={(m) => {}} />}
    </React.Fragment>
  );
}

window.StagePanel = StagePanel;
