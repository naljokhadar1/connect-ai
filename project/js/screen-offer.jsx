/* Connect AI — Offer Management */

function Offers({ cands, go, toast }) {
  const { t, L, lang } = useApp();
  const D = window.DATA;

  const offerList = [
    { c: cands.find(x => x.id === "c10"), status: "pending", base: "18,000", housing: "4,500", transport: "1,200", start: lang === "ar" ? "1 يوليو 2026" : "1 Jul 2026", step: 2 },
    { c: cands.find(x => x.id === "c5"), status: "draft", base: "26,000", housing: "6,500", transport: "1,500", start: lang === "ar" ? "15 يوليو 2026" : "15 Jul 2026", step: 0 },
    { c: cands.find(x => x.id === "c8"), status: "sent", base: "28,000", housing: "7,000", transport: "1,500", start: lang === "ar" ? "1 أغسطس 2026" : "1 Aug 2026", step: 3 },
    { c: cands.find(x => x.id === "c1"), status: "accepted", base: "30,000", housing: "7,500", transport: "1,800", start: lang === "ar" ? "10 يوليو 2026" : "10 Jul 2026", step: 4 },
  ].filter(o => o.c);

  const [sel, setSel] = React.useState(0);
  const o = offerList[sel];
  const total = (s) => s.split(",").join("");

  const statusBadge = s => {
    const m = { draft: "neutral", pending: "warning", sent: "info", accepted: "success", rejected: "danger" };
    return <span className={"badge badge-" + m[s]}><span className="b-dot" />{t("of.status." + s)}</span>;
  };

  const grand = (parseInt(total(o.base)) + parseInt(total(o.housing)) + parseInt(total(o.transport))).toLocaleString();

  const steps = lang === "ar"
    ? ["المسؤول", "مدير التوظيف", "المالية", "أُرسل", "وُقّع"]
    : ["Recruiter", "Hiring Manager", "Finance", "Sent", "Signed"];

  const advanceOffer = () => {
    if (o.status === "draft") toast(t("of.send"), "send");
    else if (o.status === "pending") toast(lang === "ar" ? "تم الاعتماد وأُرسل العرض" : "Approved & offer sent", "check");
    else toast(lang === "ar" ? "تم التحديث" : "Updated", "check");
  };

  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">{t("of.title")}</h1><div className="page-sub">{t("of.sub")}</div></div>
        <div className="spacer" />
        <button className="btn btn-primary"><Icon name="plus" size={16} />{t("of.generate")}</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "340px 1fr", alignItems: "start" }}>
        {/* list */}
        <div className="grid" style={{ gap: 10 }}>
          {offerList.map((it, i) => (
            <div key={i} className="card card-pad" onClick={() => setSel(i)} style={{ cursor: "pointer", borderColor: sel === i ? "var(--accent)" : "var(--border)", boxShadow: sel === i ? "var(--ring)" : "var(--shadow-xs)" }}>
              <div className="flex" style={{ gap: 11, alignItems: "center" }}>
                <Avatar c={it.c} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{L(it.c.name)}</div>
                  <div className="faint" style={{ fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{L(D.jobs.find(j => j.id === it.c.job))}</div>
                </div>
              </div>
              <div className="flex" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 11 }}>
                {statusBadge(it.status)}
                <span className="mono" style={{ fontSize: 12.5, fontWeight: 600 }}>{(parseInt(total(it.base)) + parseInt(total(it.housing)) + parseInt(total(it.transport))).toLocaleString()} <span className="faint">SAR</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* detail */}
        <div className="grid">
          {/* approval workflow */}
          <div className="card card-pad">
            <div className="flex" style={{ alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, flex: 1 }}>{t("of.approval")}</h3>{statusBadge(o.status)}
            </div>
            <div className="flex" style={{ alignItems: "flex-start" }}>
              {steps.map((s, i) => (
                <React.Fragment key={i}>
                  <div className="flex" style={{ flexDirection: "column", alignItems: "center", gap: 7, flex: "0 0 auto", width: 64 }}>
                    <span style={{ width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center",
                      background: i < o.step ? "var(--success)" : i === o.step ? "var(--accent)" : "var(--surface-3)",
                      color: i <= o.step ? "#fff" : "var(--text-3)" }}>
                      {i < o.step ? <Icon name="check" size={15} /> : i === o.step ? <Icon name="clock" size={15} /> : <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, textAlign: "center", color: i <= o.step ? "var(--text)" : "var(--text-3)" }}>{s}</span>
                  </div>
                  {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < o.step ? "var(--success)" : "var(--border)", marginTop: 15, borderRadius: 2 }} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
            {/* letter */}
            <div className="card">
              <div className="card-head"><span style={{ width: 26, height: 26, borderRadius: 7, background: "var(--accent-soft)", color: "var(--accent-strong)", display: "grid", placeItems: "center" }}><Icon name="file" size={15} /></span><h3>{t("of.letter")}</h3><span className="spacer" style={{ flex: 1 }} /><button className="btn btn-ghost btn-sm btn-icon"><Icon name="download" size={15} /></button></div>
              <div className="card-pad" style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-2)" }}>
                <div className="flex" style={{ alignItems: "center", gap: 9, marginBottom: 16 }}>
                  <div className="brand-mark" style={{ width: 30, height: 30 }}><Icon name="sparkles" size={15} fill /></div>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>Connect AI</span>
                </div>
                <p style={{ marginBottom: 10 }}>{lang === "ar" ? `عزيزي/عزيزتي ${L(o.c.name)}،` : `Dear ${L(o.c.name)},`}</p>
                <p style={{ marginBottom: 10 }}>
                  {lang === "ar"
                    ? `يسعدنا أن نقدم لك عرضاً للانضمام إلى فريقنا في وظيفة ${L(D.jobs.find(j => j.id === o.c.job))} في ${L(D.jobs.find(j => j.id === o.c.job).loc)}.`
                    : `We are delighted to offer you the position of ${L(D.jobs.find(j => j.id === o.c.job))} based in ${L(D.jobs.find(j => j.id === o.c.job).loc)}.`}
                </p>
                <p style={{ marginBottom: 10 }}>
                  {lang === "ar"
                    ? `الراتب الإجمالي الشهري ${grand} ريال سعودي، شاملاً البدلات، على أن تبدأ مباشرة عملك في ${o.start}.`
                    : `Your total monthly package is SAR ${grand}, inclusive of allowances, with a start date of ${o.start}.`}
                </p>
                <p>{lang === "ar" ? "نتطلع إلى انضمامك إلينا." : "We look forward to welcoming you aboard."}</p>
                {o.status !== "draft" && o.status !== "accepted" && (
                  <div className="flex" style={{ alignItems: "center", gap: 8, marginTop: 18, padding: 11, background: "var(--warning-soft)", borderRadius: "var(--r-sm)", color: "var(--warning)", fontSize: 12.5, fontWeight: 600 }}>
                    <Icon name="edit" size={14} />{t("of.esign")}
                  </div>
                )}
                {o.status === "accepted" && (
                  <div className="flex" style={{ alignItems: "center", gap: 8, marginTop: 18, padding: 11, background: "var(--success-soft)", borderRadius: "var(--r-sm)", color: "var(--success)", fontSize: 12.5, fontWeight: 600 }}>
                    <Icon name="check" size={14} />{lang === "ar" ? "تم التوقيع إلكترونياً" : "Signed electronically"}
                  </div>
                )}
              </div>
            </div>

            {/* financials */}
            <div className="grid">
              <div className="card">
                <div className="card-head"><h3>{t("of.basics")}</h3></div>
                <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[[t("of.baseSalary"), o.base], [t("of.housing"), o.housing], [t("of.transport"), o.transport]].map(([l, v], i) => (
                    <div key={i} className="flex" style={{ justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                      <span className="muted" style={{ whiteSpace: "nowrap" }}>{l}</span><span className="mono" style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                  <div className="flex" style={{ justifyContent: "space-between", padding: "12px 0 2px", fontSize: 14 }}>
                    <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{lang === "ar" ? "الإجمالي الشهري" : "Monthly total"}</span>
                    <span className="mono" style={{ fontWeight: 700, color: "var(--accent)" }}>{grand} SAR</span>
                  </div>
                  <div className="flex" style={{ justifyContent: "space-between", paddingTop: 12, marginTop: 8, borderTop: "1px solid var(--border)", fontSize: 13 }}>
                    <span className="muted flex" style={{ alignItems: "center", gap: 6, whiteSpace: "nowrap" }}><Icon name="calendar" size={14} />{t("of.startDate")}</span>
                    <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{o.start}</span>
                  </div>
                </div>
              </div>
              {o.status !== "accepted" && (
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={advanceOffer}>
                  <Icon name={o.status === "draft" ? "send" : "check"} size={16} />
                  {o.status === "draft" ? t("of.send") : o.status === "pending" ? (lang === "ar" ? "اعتماد وإرسال" : "Approve & send") : (lang === "ar" ? "إرسال تذكير" : "Send reminder")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Offers = Offers;
