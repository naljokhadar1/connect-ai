import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Candidate Profile: shell, rails, switcher */

/* ──────────────────────────────────────────
   Application context state + toast hook
   ────────────────────────────────────────── */
function useCandidateProfile(candidate) {
  const [activeAppId, setActiveAppId] = React.useState(candidate.applications[0].id);
  const [ctxToast, setCtxToast] = React.useState(null);
  const toastTimer = React.useRef();

  const switchApp = React.useCallback((appId) => {
    const app = candidate.applications.find(a => a.id === appId);
    if (!app || app.id === activeAppId) return;
    setActiveAppId(appId);
    clearTimeout(toastTimer.current);
    setCtxToast(`Switched to ${app.jobTitle} application`);
    toastTimer.current = setTimeout(() => setCtxToast(null), 2800);
  }, [activeAppId, candidate]);

  const activeApp = candidate.applications.find(a => a.id === activeAppId);
  return { activeAppId, activeApp, switchApp, ctxToast };
}

/* ──────────────────────────────────────────
   Application Switcher Dropdown
   ────────────────────────────────────────── */
function AppSwitcherDropdown({ candidate, activeAppId, switchApp, onClose }) {
  const activeApps = candidate.applications.filter(a => a.status === "active");
  const closedApps = candidate.applications.filter(a => a.status === "closed");

  const TierBadge = ({ app }) => {
    const colMap = { Strong:"badge-success", Good:"badge-accent", Possible:"badge-warning", Weak:"badge-neutral" };
    return <span className={"badge " + (colMap[app.tier] || "badge-neutral")} style={{height:20,fontSize:11}}>{app.tier}</span>;
  };

  const AppRow = ({ app, isActive }) => (
    <div className={"app-switch-item" + (isActive?" active":"") + (app.status==="closed"?" closed":"")}
      onClick={() => { switchApp(app.id); onClose(); }}>
      <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${isActive?"var(--accent)":"var(--border-strong)"}`,display:"grid",placeItems:"center",flex:"0 0 auto"}}>
        {isActive && <span style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)"}}/>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:13.5,display:"flex",alignItems:"center",gap:7}}>
          {app.jobTitle}
          {isActive && <span className="badge badge-accent" style={{height:18,fontSize:10}}>Viewing</span>}
          {app.status==="closed" && <span className="badge badge-neutral" style={{height:18,fontSize:10}}>Closed</span>}
        </div>
        <div className="faint" style={{fontSize:12}}>
          {app.dept} · {app.status==="closed"? app.closedLabel : app.stage}
        </div>
      </div>
      <div className="flex" style={{flexDirection:"column",alignItems:"flex-end",gap:4}}>
        <span className="mono" style={{fontSize:13,fontWeight:700,color:app.tierColor}}>{app.match}</span>
        <TierBadge app={app}/>
      </div>
    </div>
  );

  return (
    <div className="app-switch-dropdown" onClick={e=>e.stopPropagation()}>
      <div style={{padding:"4px 0"}}>
        <div className="app-switch-section">Active applications ({activeApps.length})</div>
        {activeApps.map(a => <AppRow key={a.id} app={a} isActive={a.id===activeAppId}/>)}
        {closedApps.length > 0 && (
          <React.Fragment>
            <div className="app-switch-section" style={{marginTop:4}}>Closed applications ({closedApps.length})</div>
            {closedApps.map(a => <AppRow key={a.id} app={a} isActive={a.id===activeAppId}/>)}
          </React.Fragment>
        )}
      </div>
      <div className="app-switch-footer">
        <button className="app-switch-footer-btn"><Icon name="users" size={15}/>View candidate-wide summary</button>
        <button className="app-switch-footer-btn"><Icon name="plus" size={15}/>Add {candidate.name} to a new job</button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Application Switcher Row (Sub-row A)
   ────────────────────────────────────────── */
function AppSwitcherRow({ candidate, activeApp, activeAppId, switchApp }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="app-switcher-row">
      <div className="flex" style={{alignItems:"center",gap:8,position:"relative"}} ref={ref}>
        <span className="faint" style={{fontSize:12.5,fontWeight:600}}>Viewing for:</span>
        <button className="app-switcher-trigger" onClick={() => setOpen(o=>!o)}>
          {activeApp.jobTitle} · {activeApp.stage}
          <Icon name="chevDown" size={14}/>
        </button>
        <span className="badge badge-accent" style={{height:20,fontSize:11}}>{activeApp.match} match</span>
        {open && (
          <AppSwitcherDropdown candidate={candidate} activeAppId={activeAppId}
            switchApp={switchApp} onClose={() => setOpen(false)}/>
        )}
      </div>
      <button className="muted flex" style={{alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,cursor:"pointer"}} onClick={() => setOpen(o=>!o)}>
        {candidate.applications.length} applications
        <Icon name="chevDown" size={14}/>
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────
   Candidate Identity Row (Sub-row B)
   ────────────────────────────────────────── */
function CandidateIdentityRow({ candidate, activeApp, goBack, lens, setLens }) {
  const tierColMap = { Strong:"var(--success-soft):#16a34a", Good:"var(--accent-soft):var(--accent-strong)", Possible:"var(--warning-soft):var(--warning)", Weak:"var(--surface-3):var(--text-3)" };
  const [tierBg, tierText] = (tierColMap[activeApp.tier] || "var(--surface-3):var(--text-3)").split(":");

  return (
    <div className="cand-identity">
      <div className="cand-avatar" style={{background:candidate.avatarColor,color:candidate.avatarText}}>
        {candidate.initials}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div className="flex" style={{alignItems:"center",gap:9,flexWrap:"wrap"}}>
          <span className="cand-name">{candidate.name}</span>
          <span className="badge" style={{background:tierBg,color:tierText,height:22}}>{activeApp.tier} match</span>
        </div>
        <div className="cand-sub">
          Applied: {activeApp.jobTitle} · {activeApp.appliedDaysAgo} days ago · {candidate.location}
        </div>
      </div>
      <div className="flex" style={{alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <div className="lens-seg">
          {["Full","Interview","Manager"].map(l => (
            <button key={l} className={lens===l?"on":""} onClick={() => setLens(l)}>{l}</button>
          ))}
        </div>
        {activeApp.nextAction && (
          <div className="move-btn-wrap">
            <button className="btn btn-primary" style={{borderRadius:"var(--r-sm) 0 0 var(--r-sm)",paddingInlineEnd:10}}>
              <Icon name="arrowUp" size={15}/>{activeApp.nextAction}
            </button>
            <button className="btn btn-primary caret" style={{borderRadius:"0 var(--r-sm) var(--r-sm) 0"}}><Icon name="chevDown" size={14}/></button>
          </div>
        )}
        <button className="icon-btn"><Icon name="more" size={18}/></button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Mini Pipeline Strip
   ────────────────────────────────────────── */
function MiniPipeline({ app }) {
  return (
    <div style={{background:"var(--surface-2)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
      <div className="flex" style={{alignItems:"center",justifyContent:"space-between",paddingInline:20,paddingBlock:0}}>
        <div className="mini-pipe">
          {app.workflow.map((stage, i) => {
            const isActive = stage === app.stage;
            const isDone = i < app.stageIdx;
            const isRejected = stage === "Rejected" && app.status === "closed";
            return (
              <div key={i} className="mini-pipe-stage">
                {i > 0 && <Icon name="chevRight" size={14} className="mp-chevron"/>}
                <span className={"mp-pill" + (isActive?" active":"") + (isDone?" done":"") + (isRejected?" rejected":"")}>
                  {isDone && !isActive && <Icon name="check" size={11}/>}
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
        {app.daysInStage && (
          <span className="faint mono" style={{fontSize:12,whiteSpace:"nowrap",paddingInlineStart:16}}>
            <Icon name="clock" size={13} style={{verticalAlign:"-2px",marginInlineEnd:4}}/>
            {app.daysInStage} days in stage
          </span>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Left Rail
   ────────────────────────────────────────── */
function LeftRail({ candidate, activeApp, activeAppId, switchApp }) {
  return (
    <aside className="profile-left" style={{ width: 240, flex: "0 0 240px" }}>
      <AIMatchCard app={activeApp}/>
      <QuickFactsCard candidate={candidate}/>
      <InsightsCard strengths={activeApp.strengths} concerns={activeApp.concerns}/>
      {candidate.applications.length > 1 && (
        <OtherAppsCard candidate={candidate} activeAppId={activeAppId} switchApp={switchApp}/>
      )}
    </aside>
  );
}

function QuickFactsCard({ candidate }) {
  return (
    <div className="card card-pad">
      <div className="flex" style={{flexDirection:"column",gap:9}}>
        <div className="flex" style={{alignItems:"center",gap:9,fontSize:13}}><Icon name="pin" size={15} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>{candidate.location}</div>
        <div className="flex" style={{alignItems:"center",gap:9,fontSize:13}}><Icon name="briefcase" size={15} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>{candidate.experience} years experience</div>
        <div className="flex" style={{alignItems:"center",gap:9,fontSize:13}}><Icon name="globe" size={15} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>{candidate.languages.join(", ")}</div>
        <a className="flex" style={{alignItems:"center",gap:9,fontSize:13,color:"var(--accent)"}} href="#"><Icon name="link" size={15} style={{flex:"0 0 auto"}}/>LinkedIn profile</a>
      </div>
      <div className="flex" style={{flexWrap:"wrap",gap:7,marginTop:12,paddingTop:12,borderTop:"1px solid var(--border)"}}>
        {candidate.tags.map((tag,i) => <span key={i} className="chip chip-accent">{tag}</span>)}
        <button className="chip" style={{borderStyle:"dashed"}}><Icon name="plus" size={12}/>Add</button>
      </div>
    </div>
  );
}

function InsightsCard({ strengths, concerns }) {
  return (
    <div className="card card-pad">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div>
          <div className="flex" style={{alignItems:"center",gap:6,marginBottom:8}}><Icon name="thumb" size={14} style={{color:"var(--success)"}}/><span style={{fontWeight:600,fontSize:12.5}}>Strengths</span></div>
          <ul style={{paddingInlineStart:14,display:"flex",flexDirection:"column",gap:5,margin:0}}>{strengths.map((s,i) => <li key={i} style={{fontSize:12,color:"var(--text-2)",lineHeight:1.5}}>{s}</li>)}</ul>
        </div>
        <div>
          <div className="flex" style={{alignItems:"center",gap:6,marginBottom:8}}><Icon name="alert" size={14} style={{color:"var(--warning)"}}/><span style={{fontWeight:600,fontSize:12.5}}>Concerns</span></div>
          <ul style={{paddingInlineStart:14,display:"flex",flexDirection:"column",gap:5,margin:0}}>{concerns.map((c,i) => <li key={i} style={{fontSize:12,color:"var(--text-2)",lineHeight:1.5}}>{c}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

function AIMatchCard({ app }) {
  const tierColMap = { Strong:"var(--success)", Good:"var(--accent)", Possible:"var(--warning)", Weak:"var(--text-3)" };
  const col = tierColMap[app.tier] || "var(--accent)";
  return (
    <div className="card card-pad">
      <div className="faint" style={{fontSize:10.5,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",marginBottom:10}}>
        <Icon name="sparkles" size={12} fill style={{color:"var(--ai)",verticalAlign:"-1px",marginInlineEnd:5}}/>AI Match
      </div>
      <div className="flex" style={{alignItems:"flex-end",gap:10,marginBottom:8}}>
        <span className="ai-score-big" style={{color:col}}>{app.match}</span>
        <span style={{fontSize:13,color:"var(--text-3)",fontWeight:600,paddingBottom:6}}>/100</span>
        <div style={{marginInlineStart:"auto",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <span className="badge" style={{background:`color-mix(in oklch,${col} 14%,var(--surface))`,color:col,height:22}}>{app.tier} match</span>
          <span className="faint" style={{fontSize:11.5}}>High confidence</span>
        </div>
      </div>
      <Bar value={app.match} color={col} h={5}/>
      <div style={{marginTop:14,fontSize:12.5,fontWeight:600,color:"var(--text-2)",marginBottom:6}}>Signals contributing:</div>
      {app.signals.map((s,i) => (
        <div key={i} className="signal-row">
          <span className={"signal-dot "+(s.done?"done":"pending")}/>
          <span style={{flex:1,color:s.done?"var(--text)":"var(--text-3)"}}>{s.label}</span>
          {s.score != null
            ? <span className="mono" style={{fontWeight:700,fontSize:13}}>{s.score.toFixed(1)}</span>
            : <span className="faint" style={{fontSize:12}}>—</span>}
        </div>
      ))}
      <a className="muted flex" style={{alignItems:"center",gap:5,fontSize:12,fontWeight:600,marginTop:10,cursor:"pointer"}}>
        <Icon name="bulb" size={13} style={{color:"var(--ai)"}}/>How is this calculated?
      </a>
    </div>
  );
}

function CandidateInfoCard({ candidate }) {
  return (
    <div className="card card-pad">
      <div className="faint" style={{fontSize:10.5,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",marginBottom:10}}>Candidate</div>
      <div className="flex" style={{flexDirection:"column",gap:9}}>
        <div className="flex" style={{alignItems:"center",gap:9,fontSize:13}}><Icon name="pin" size={15} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>{candidate.location}</div>
        <div className="flex" style={{alignItems:"center",gap:9,fontSize:13}}><Icon name="briefcase" size={15} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>{candidate.experience} years experience</div>
        <div className="flex" style={{alignItems:"center",gap:9,fontSize:13}}><Icon name="globe" size={15} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>{candidate.languages.join(", ")}</div>
        <a className="flex" style={{alignItems:"center",gap:9,fontSize:13,color:"var(--accent)"}} href="#"><Icon name="link" size={15} style={{flex:"0 0 auto"}}/>LinkedIn profile</a>
      </div>
    </div>
  );
}

function StrengthsCard({ strengths }) {
  return (
    <div className="card card-pad">
      <div className="flex" style={{alignItems:"center",gap:7,marginBottom:10}}>
        <Icon name="thumb" size={15} style={{color:"var(--success)"}}/>
        <span style={{fontWeight:600,fontSize:13.5}}>Strengths</span>
      </div>
      <ul style={{paddingInlineStart:16,display:"flex",flexDirection:"column",gap:5}}>
        {strengths.map((s,i) => <li key={i} style={{fontSize:13,color:"var(--text-2)"}}>{s}</li>)}
      </ul>
    </div>
  );
}

function ConcernsCard({ concerns }) {
  return (
    <div className="card card-pad">
      <div className="flex" style={{alignItems:"center",gap:7,marginBottom:10}}>
        <Icon name="alert" size={15} style={{color:"var(--warning)"}}/>
        <span style={{fontWeight:600,fontSize:13.5}}>Concerns</span>
      </div>
      <ul style={{paddingInlineStart:16,display:"flex",flexDirection:"column",gap:5}}>
        {concerns.map((c,i) => <li key={i} style={{fontSize:13,color:"var(--text-2)"}}>{c}</li>)}
      </ul>
    </div>
  );
}

function TagsCard({ tags }) {
  return (
    <div className="card card-pad">
      <div style={{fontWeight:600,fontSize:13.5,marginBottom:10}}>Tags</div>
      <div className="flex" style={{flexWrap:"wrap",gap:7}}>
        {tags.map((tag,i) => <span key={i} className="chip chip-accent">{tag}</span>)}
        <button className="chip" style={{borderStyle:"dashed"}}><Icon name="plus" size={12}/>Add</button>
      </div>
    </div>
  );
}

function OtherAppsCard({ candidate, activeAppId, switchApp }) {
  const others = candidate.applications.filter(a => a.id !== activeAppId);
  const tierColMap = { Strong:"var(--success)", Good:"var(--accent)", Possible:"var(--warning)", Weak:"var(--text-3)" };
  return (
    <div className="card">
      <div className="card-head">
        <h3 style={{fontSize:13.5}}>Other applications</h3>
        <span className="badge badge-neutral" style={{height:20,fontSize:11}}>{others.length}</span>
      </div>
      <div style={{padding:"4px 8px"}}>
        {others.map(app => (
          <div key={app.id} className={"other-app-row"+(app.status==="closed"?" closed":"")} onClick={() => switchApp(app.id)}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:7}}>
                {app.jobTitle}
                {app.status==="closed" && <span className="badge badge-neutral" style={{height:17,fontSize:10}}>Closed</span>}
              </div>
              <div className="faint" style={{fontSize:11.5}}>
                {app.status==="closed" ? app.closedLabel : `${app.stage} · ${app.match} · ${app.tier}`}
              </div>
            </div>
            <span className="mono" style={{fontSize:13,fontWeight:700,color:tierColMap[app.tier]||"var(--text-3)"}}>{app.match}</span>
          </div>
        ))}
      </div>
      <div style={{padding:"8px 16px",borderTop:"1px solid var(--border)"}}>
        <a className="muted flex" style={{alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,cursor:"pointer",color:"var(--ai)"}}>
          View all {candidate.applications.length} →
        </a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Right Rail
   ────────────────────────────────────────── */
function RightRail({ candidate, activeApp, go }) {
  const [aiQuery, setAiQuery] = React.useState("");
  const [aiAnswer, setAiAnswer] = React.useState(null);
  const [aiLoading, setAiLoading] = React.useState(false);

  const prompts = [
    "Summarise this candidate for hiring",
    "What are the key risks?",
    "Compare to our best hire",
    "Draft an interview invite",
  ];
  const [panel, setPanel] = React.useState(null); // ai | similar | actions

  const askAI = (q) => {
    const query = q || aiQuery;
    if (!query.trim()) return;
    setAiLoading(true); setAiAnswer(null);
    setTimeout(() => {
      setAiLoading(false);
      setAiAnswer(`Based on ${candidate.name}'s ${activeApp.match}% match score for ${activeApp.jobTitle}: ${activeApp.overview?.summary || "Strong candidate with relevant experience."}`);
    }, 900);
  };

  const fabBtn = (id, icon, label, primary) => (
    <button title={label} onClick={() => setPanel(p => p === id ? null : id)}
      style={{ width: primary ? 56 : 44, height: primary ? 56 : 44, borderRadius: "50%", display: "grid", placeItems: "center",
        background: primary ? "var(--ai)" : "var(--surface)", color: primary ? "#fff" : "var(--text-2)",
        border: primary ? "none" : "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
        animation: primary ? "cp-pulse 2.2s ease-in-out 3" : undefined }}>
      <Icon name={icon} size={primary ? 24 : 19} fill={primary} />
    </button>
  );

  return (
    <React.Fragment>
      <style>{`@keyframes cp-pulse{0%,100%{box-shadow:0 0 0 0 color-mix(in oklch,var(--ai) 45%,transparent),var(--shadow-lg)}50%{box-shadow:0 0 0 10px transparent,var(--shadow-lg)}}`}</style>
      {/* floating stack */}
      <div style={{ position: "fixed", bottom: 28, insetInlineEnd: 28, zIndex: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {fabBtn("similar", "users", "Similar candidates")}
        {fabBtn("actions", "zap", "Quick actions")}
        {fabBtn("ai", "sparkles", "Ask AI about " + candidate.name, true)}
      </div>

      {/* slide-in panel */}
      <div className={"drawer-scrim" + (panel ? " open" : "")} style={{ pointerEvents: panel ? "auto" : "none" }} onClick={() => setPanel(null)} />
      <aside className={"drawer" + (panel ? " open" : "")} aria-hidden={!panel} style={{ width: 380 }}>
        {panel === "ai" && (
          <React.Fragment>
            <div className="drawer-head"><span style={{width:28,height:28,borderRadius:8,background:"var(--ai)",color:"#fff",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="sparkles" size={15} fill/></span><h3 style={{fontSize:14,flex:1}}>Ask AI about {candidate.name}</h3><button className="icon-btn btn-sm" onClick={()=>setPanel(null)}><Icon name="x" size={18}/></button></div>
            <div className="drawer-body" style={{display:"flex",flexDirection:"column",gap:10}}>
              <span className="badge badge-neutral" style={{height:22,alignSelf:"flex-start"}}><Icon name="briefcase" size={11}/>{activeApp.jobTitle}</span>
              <div className="ask-ai-input" onClick={() => document.getElementById("ai-q-input").focus()}>
                <Icon name="sparkles" size={14} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
                <input id="ai-q-input" value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askAI()} placeholder="Ask anything about this candidate…" style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13}}/>
                {aiQuery && <button onClick={() => askAI()} style={{color:"var(--ai)"}}><Icon name="send" size={14}/></button>}
              </div>
              <div className="flex" style={{flexWrap:"wrap",gap:6}}>{prompts.map((p,i) => <button key={i} className="ask-prompt-chip" onClick={() => { setAiQuery(p); askAI(p); }}>{p}</button>)}</div>
              {aiLoading && <div className="flex" style={{alignItems:"center",gap:8,padding:"10px 0"}}><Icon name="sparkles" size={14} fill style={{color:"var(--ai)"}}/><span className="muted ai-cursor" style={{fontSize:13}}>Analysing…</span></div>}
              {aiAnswer && <div style={{padding:"12px 14px",background:"var(--surface-2)",borderRadius:"var(--r-md)",border:"1px solid var(--border)",fontSize:13,lineHeight:1.7}}>{aiAnswer}</div>}
            </div>
          </React.Fragment>
        )}
        {panel === "actions" && (
          <React.Fragment>
            <div className="drawer-head"><h3 style={{fontSize:14,flex:1}}>Quick actions</h3><button className="icon-btn btn-sm" onClick={()=>setPanel(null)}><Icon name="x" size={18}/></button></div>
            <div className="drawer-body"><div className="flex" style={{flexDirection:"column",gap:8}}>
              {[["send","Send email",null],["calendar","Schedule interview",null],["phone","Screening call","var(--ai)"],["assessment","View assessment","var(--purple)"],["video","Watch video interview","var(--ai)"],["x","Reject candidate","var(--danger)"]].map(([ic,label,col])=>(
                <button key={label} className="btn btn-subtle" style={{justifyContent:"flex-start",gap:10,height:40,color:col||"var(--text)"}} onClick={()=>{ if(label==="Screening call" && go){ setPanel(null); go("screening-review"); } }}><Icon name={ic} size={16}/>{label}</button>
              ))}
            </div></div>
          </React.Fragment>
        )}
        {panel === "similar" && (
          <React.Fragment>
            <div className="drawer-head"><h3 style={{fontSize:14,flex:1}}>Similar candidates</h3><button className="icon-btn btn-sm" onClick={()=>setPanel(null)}><Icon name="x" size={18}/></button></div>
            <div className="drawer-body">{candidate.similar.map((s,i) => (
              <div key={i} className="similar-row"><div className="avatar" style={{width:34,height:34,background:s.color,fontSize:12,flex:"0 0 auto"}}>{s.initials}</div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13}}>{s.name}</div><div className="faint" style={{fontSize:11.5}}>{s.title}</div></div><span className="badge badge-accent" style={{height:20,fontSize:11}}>{s.match}%</span></div>
            ))}</div>
          </React.Fragment>
        )}
      </aside>
    </React.Fragment>
  );
}

export { useCandidateProfile, AppSwitcherDropdown, AppSwitcherRow, CandidateIdentityRow, MiniPipeline, LeftRail, RightRail, QuickFactsCard, InsightsCard, AIMatchCard, CandidateInfoCard, StrengthsCard, ConcernsCard, TagsCard, OtherAppsCard };
