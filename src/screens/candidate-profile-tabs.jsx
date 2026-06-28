import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Connect AI — Candidate Profile: tab bar + tab content + full page */

/* ──────────────────────────────────────────
   Tab Bar
   ────────────────────────────────────────── */
function ProfileTabBar({ activeTab, setActiveTab, app }) {
  const tc = app.tabCounts;
  const groups = [
    [ { id:"overview", label:"Overview" }, { id:"cv", label:"CV & Parsing" }, { id:"evaluations", label:"Evaluations", count: tc.evaluations } ],
    [ { id:"notes", label:"Notes", count: tc.notes }, { id:"activity", label:"Activity" } ],
    [ { id:"screening", label:"Screening Call" }, { id:"assessment", label:"Assessment" }, { id:"video", label:"Video Interview" }, { id:"emails", label:"Emails", count: tc.emails } ],
  ];
  return (
    <div className="profile-tabs">
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          {gi > 0 && <span style={{ width: 1, height: 20, background: "var(--border)", margin: "0 6px", alignSelf: "center", flex: "0 0 auto" }} />}
          {g.map(tb => (
            <button key={tb.id} className={"profile-tab"+(activeTab===tb.id?" on":"")} onClick={()=>setActiveTab(tb.id)}>
              {tb.label}
              {tb.count != null && <span className="tb-badge">{tb.count}</span>}
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   Tab Content
   ────────────────────────────────────────── */
function ProfileTabContent({ tab, candidate, app, setActiveTab, openSwitcher, switchApp, toast, go }) {
  switch (tab) {
    case "overview":    return <TabOverview candidate={candidate} app={app} setActiveTab={setActiveTab} openSwitcher={openSwitcher} go={go}/>;
    case "cv":          return <TabCV candidate={candidate} app={app} switchApp={switchApp}/>;
    case "screening":   return <TabScreening go={go} toast={toast}/>;
    case "assessment":  return <TabAssessment app={app} toast={toast} go={go}/>;
    case "video":       return <TabVideo app={app} toast={toast} go={go}/>;
    case "evaluations": return <TabEvaluations app={app} toast={toast} switchApp={switchApp}/>;
    case "emails":      return <TabEmails candidate={candidate} app={app} toast={toast}/>;
    case "notes":       return <TabNotes candidate={candidate} app={app} toast={toast}/>;
    case "activity":    return <TabActivity candidate={candidate} app={app}/>;
    default:            return null;
  }
}

/* ── OVERVIEW ── */
function TabOverview({ candidate, app, setActiveTab, openSwitcher, go }) {
  const [regenLoading, setRegenLoading] = React.useState(false);
  const [summaryText, setSummaryText] = React.useState(app.overview?.summary || '');
  const [confirmModal, setConfirmModal] = React.useState(null);
  const [fullSummary, setFullSummary] = React.useState(false);
  const [allRubric, setAllRubric] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(true);

  const condensed = "Ahmed is a strong technical match for this role with 6 years of React experience, including 3 years leading a 4-person frontend team at Acme Fintech. His TypeScript and design system expertise aligns with must-haves; the primary gap is Arabic fluency.\n\nRecommendation: Advance to Technical Interview.";

  React.useEffect(() => { setSummaryText(app.overview?.summary || ''); }, [app.id]);

  const regen = () => {
    setRegenLoading(true);
    setTimeout(() => {
      setRegenLoading(false);
      setSummaryText(
        'Ahmed remains a strong technical match for this role. Updated analysis incorporates his latest assessment scores. Key strength: exceptional React + TypeScript depth demonstrated in both the CV and the technical assessment. The Arabic fluency gap is confirmed as a nice-to-have for this specific role and should not block advancement.\n\nRecommendation: Advance to Technical Interview.'
      );
    }, 1100);
  };

  const rubricRows = [
    { label:'React',               tier:'must',        score:9.5 },
    { label:'TypeScript',          tier:'must',        score:9.0 },
    { label:'Leadership',          tier:'must',        score:8.0 },
    { label:'5+ yrs frontend',     tier:'must',        score:10 },
    { label:'Authorization KSA',   tier:'dealbreaker', score:10, pass:true },
    { label:'Arabic communication',tier:'nice',        score:1.0 },
    { label:'Fintech background',  tier:'nice',        score:9.0 },
    { label:'Open source',         tier:'nice',        score:6.0 },
  ];

  const barColor = (tier, score) => {
    if (tier === 'dealbreaker') return 'var(--success)';
    if (score >= 8) return 'var(--accent)';
    if (score >= 5) return 'var(--warning)';
    return tier === 'must' ? 'var(--danger)' : 'var(--text-3)';
  };

  const tierBadge = (tier) => {
    const m = { must:'badge-accent', nice:'badge-neutral', dealbreaker:'badge-danger' };
    return <span className={"badge " + m[tier]} style={{height:17,fontSize:9.5,fontWeight:700}}>{tier}</span>;
  };

  const signals = [
    { label:'CV Match',         by:'AI',                    when:'June 4',  score:9.0, tier:'Strong',  done:true,  tab:'cv'          },
    { label:'Pre-screen',       by:'AI Agent',              when:'June 5',  score:8.5, tier:'Yes',     done:true,  tab:'evaluations', route:'screening-review' },
    { label:'Assessment',       by:'Frontend Skills',       when:'June 6',  score:8.7, tier:'Strong',  done:true,  tab:'assessment'  },
    { label:'Video Interview',  by:'Not yet sent',          when:'',        score:null,tier:'Pending', done:false, tab:'video'       },
    { label:'Human Evaluation', by:'Not yet started',       when:'',        score:null,tier:'Pending', done:false, tab:'evaluations' },
  ];

  const keyFacts = [
    ['Current role',    'Senior Frontend Engineer at Acme Fintech (2 yrs)'],
    ['Total experience','6 years'],
    ['Education',       'B.Sc. Computer Engineering, Cairo University'],
    ['Languages',       'English (fluent), Arabic (none)'],
    ['Notice period',   '1 month'],
    ['Salary expect.',  'SAR 28,000 / month (from pre-screen)'],
    ['Authorization',   'KSA citizen ✓'],
    ['Location',        'Riyadh, KSA (no relocation needed)'],
  ];

  const glanceTags = [
    { label:'Bilingual hire candidate', special:false },
    { label:'Has led teams',            special:false },
    { label:'Open to remote',           special:false },
    { label:'Fintech experience',       special:false },
    { label:'Available in 1 month',     special:false },
    { label:'3rd application this year',special:true },
  ];

  return (
    <div className="tab-content" style={{display:'flex',flexDirection:'column',gap:14}}>

      {/* 1 — AI SUMMARY */}
      <div className="card" style={{borderInlineStart:'3px solid var(--ai)'}}>
        <div className="card-pad">
          <div className="flex" style={{alignItems:'center',gap:9,marginBottom:12}}>
            <Icon name="sparkles" size={15} fill style={{color:'var(--ai)',flex:'0 0 auto'}}/>
            <span style={{fontWeight:500,fontSize:14}}>AI summary</span>
            <span className="spacer" style={{flex:1}}/>
            <span className="faint" style={{fontSize:12}}>Updated 2h ago · v3</span>
            <a className="muted" style={{fontSize:12.5,fontWeight:600,cursor:'pointer',color:'var(--ai)',marginInlineStart:8}}
              onClick={regen}>{regenLoading ? <><Icon name="refresh" size={13} style={{verticalAlign:'-2px'}}/> Regenerating…</> : 'Regenerate'}</a>
          </div>
          {regenLoading
            ? <div className="flex" style={{alignItems:'center',gap:8,padding:'8px 0'}}><Icon name="sparkles" size={13} fill style={{color:'var(--ai)'}}/><span className="muted ai-cursor" style={{fontSize:13}}>Analysing signals…</span></div>
            : <p style={{fontSize:13,lineHeight:1.7,color:'var(--text-2)',whiteSpace:'pre-wrap',marginBottom:10}}>{fullSummary ? summaryText : condensed}</p>}
          {!regenLoading && <a className="muted flex" style={{alignItems:'center',gap:4,fontSize:12,fontWeight:600,cursor:'pointer',marginBottom:14,color:'var(--accent-strong)'}} onClick={()=>setFullSummary(f=>!f)}><Icon name={fullSummary?'chevUp':'chevDown'} size={13}/>{fullSummary?'Show less':'Show full summary'}</a>}
          <div className="flex" style={{gap:8,flexWrap:'wrap',marginTop:4}}>
            <button className="btn btn-primary btn-sm" onClick={() => setConfirmModal('advance')}><Icon name="arrowUp" size={14}/>Advance to Technical Interview</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmModal('info')}><Icon name="message" size={14}/>Request more info</button>
            <button className="btn btn-subtle btn-sm" style={{color:'var(--text-2)'}} onClick={() => setConfirmModal('reject')}><Icon name="x" size={14}/>Reject with feedback</button>
          </div>
        </div>
      </div>

      {/* 2 — RUBRIC BREAKDOWN */}
      <div className="card card-pad">
        <div className="flex" style={{alignItems:'center',marginBottom:14}}>
          <span style={{fontWeight:500,fontSize:14,flex:1}}>Rubric breakdown</span>
          <a className="muted flex" style={{alignItems:'center',gap:5,fontSize:12.5,fontWeight:600,cursor:'pointer'}} onClick={() => setActiveTab && setActiveTab('evaluations')}>
            View full evaluation <Icon name="chevRight" size={13}/>
          </a>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {(allRubric ? rubricRows : rubricRows.filter(r => r.tier!=='nice' || r.label==='Arabic communication')).map((r,i,arr) => (
            <div key={i} className="flex" style={{alignItems:'center',gap:12,padding:'7px 0',borderBottom:i<arr.length-1?'1px solid var(--border)':'none'}}>
              <span style={{flex:'0 0 160px',fontSize:13,fontWeight:500,whiteSpace:'nowrap'}}>{r.label}</span>
              {tierBadge(r.tier)}
              <div style={{flex:1,position:'relative',height:6,borderRadius:20,background:'var(--surface-3)',overflow:'hidden'}}>
                {r.pass
                  ? <div style={{position:'absolute',insetInlineStart:0,top:0,bottom:0,width:'100%',background:'var(--success)',borderRadius:20}}/>
                  : <div style={{position:'absolute',insetInlineStart:0,top:0,bottom:0,width:(r.score/10*100)+'%',background:barColor(r.tier,r.score),borderRadius:20}}/>}
              </div>
              <span className="mono" style={{flex:'0 0 38px',textAlign:'end',fontSize:13,fontWeight:700,color:barColor(r.tier,r.score)}}>
                {r.pass ? <Icon name="check" size={14}/> : r.score}{r.label==='Arabic communication' && <Icon name="alert" size={12} style={{color:'var(--warning)',marginInlineStart:3,verticalAlign:'-1px'}}/>}
              </span>
            </div>
          ))}
        </div>
        <a className="muted flex" style={{alignItems:'center',gap:4,fontSize:12,fontWeight:600,cursor:'pointer',marginTop:10,color:'var(--accent-strong)'}} onClick={()=>setAllRubric(a=>!a)}><Icon name={allRubric?'chevUp':'chevDown'} size={13}/>{allRubric?'Show fewer':'Show 3 more criteria'}</a>
        <div className="faint" style={{fontSize:11.5,marginTop:8}}>Weighted score: {app.match}/100. Signals: CV + Pre-screen + Assessment.</div>
      </div>

      {/* 3 — SIGNAL TIMELINE (horizontal compact) */}
      <div className="card card-pad">
        <div className="flex" style={{alignItems:'center',marginBottom:14}}>
          <span style={{fontWeight:500,fontSize:14,flex:1}}>Evaluation signals</span>
          <span className="faint" style={{fontSize:12}}>3 of 5 received</span>
        </div>
        <div className="flex" style={{gap:8}}>
          {signals.map((s,i) => (
            <button key={i} onClick={() => s.route && go ? go(s.route) : (setActiveTab && setActiveTab(s.tab))}
              style={{flex:1,minWidth:0,textAlign:'center',padding:'12px 6px',borderRadius:'var(--r-md)',border:'1px solid var(--border)',background:s.done?'var(--surface-2)':'transparent'}}>
              <span style={{width:12,height:12,borderRadius:'50%',display:'inline-block',border:`2px solid ${s.done?'var(--accent)':'var(--border-strong)'}`,background:s.done?'var(--accent)':'transparent'}}/>
              <div style={{fontSize:12,fontWeight:600,marginTop:7,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.label}</div>
              {s.score != null
                ? <div className="mono" style={{fontSize:13,fontWeight:700,marginTop:3,color:s.score>=8?'var(--accent)':'var(--warning)'}}>{s.score.toFixed(1)} <span style={{fontWeight:600,fontSize:10.5,color:'var(--text-3)'}}>{s.tier}</span></div>
                : <div className="faint" style={{fontSize:11.5,marginTop:3}}>Pending</div>}
              <div className="faint" style={{fontSize:10.5,marginTop:2}}>{s.when || '—'}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Show all details expander */}
      {!showDetails ? (
        <button className="card card-pad" style={{border:'1.5px dashed var(--border-strong)',background:'transparent',textAlign:'start',cursor:'pointer'}} onClick={()=>setShowDetails(true)}>
          <div className="flex" style={{alignItems:'center',gap:9}}>
            <Icon name="chevDown" size={16} style={{color:'var(--text-3)'}}/>
            <span style={{fontWeight:600,fontSize:13.5}}>Show all details</span>
          </div>
          <div className="faint" style={{fontSize:12,marginTop:5,marginInlineStart:25}}>Key facts · At a glance · Full signal history</div>
        </button>
      ) : (
      <React.Fragment>

      {/* 4 — KEY FACTS */}
      <div className="card card-pad">
        <div style={{fontWeight:500,fontSize:14,marginBottom:12}}>Key facts from CV</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 20px'}}>
          {keyFacts.map(([k,v],i) => (
            <div key={i} style={{display:'flex',flexDirection:'column',gap:2}}>
              <span className="faint" style={{fontSize:11.5,fontWeight:600}}>{k}</span>
              <span style={{fontSize:13,fontWeight:500}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5 — AT A GLANCE */}
      <div className="card card-pad">
        <div style={{fontWeight:500,fontSize:14,marginBottom:12}}>At a glance</div>
        <div className="flex" style={{flexWrap:'wrap',gap:7}}>
          {glanceTags.map((g,i) => (
            <span key={i} className={g.special?"chip chip-accent":"chip"} style={g.special?{cursor:'pointer',fontWeight:600}:{}}
              onClick={g.special ? openSwitcher : undefined}>
              {g.label}
              {g.special && <Icon name="chevDown" size={11}/>}
            </span>
          ))}
        </div>
      </div>
      </React.Fragment>
      )}

      {/* Confirm modal */}
      {confirmModal && (
        <div className="scrim" onClick={() => setConfirmModal(null)}>
          <div className="modal" style={{maxWidth:400}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h3 style={{fontSize:15}}>{confirmModal==='advance'?'Advance to Technical Interview':confirmModal==='reject'?'Reject with feedback':'Request more info'}</h3>
              <div className="spacer" style={{flex:1}}/>
              <button className="icon-btn btn-sm" onClick={() => setConfirmModal(null)}><Icon name="x" size={17}/></button>
            </div>
            <div className="modal-body" style={{color:'var(--text-2)',fontSize:13.5}}>
              {confirmModal==='advance' && "This will move Ahmed Hassan to the Technical Interview stage and send an automated email invitation."}
              {confirmModal==='reject' && <textarea className="textarea" placeholder="Optional: Rejection reason for your records…" rows={3}/>}
              {confirmModal==='info' && <textarea className="textarea" placeholder="What additional information do you need?" rows={3}/>}
            </div>
            <div className="modal-foot">
              <div className="spacer" style={{flex:1}}/>
              <button className="btn btn-subtle" onClick={() => setConfirmModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setConfirmModal(null)}>
                {confirmModal==='advance'?'Confirm advance':confirmModal==='reject'?'Reject':'Send request'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ── CV ── */
function TabCV({ candidate, switchApp }) {
  const [reparsing, setReparse] = React.useState(false);
  const [cvPage, setCvPage] = React.useState(1);
  const [expandedSecs, setExpandedSecs] = React.useState({contact:true, experience:true, education:false, skills:true, certs:false, flags:true});
  const [hoveredSkill, setHoveredSkill] = React.useState(null);
  const [editField, setEditField] = React.useState(null);
  const [historyVisible, setHistoryVisible] = React.useState(true);

  const toggle = (k) => setExpandedSecs(s=>({...s,[k]:!s[k]}));

  const reparse = () => { setReparse(true); setTimeout(()=>setReparse(false), 1400); };

  const parsedSkills = {
    technical:["React","TypeScript","Next.js","Node.js","GraphQL","Tailwind CSS","Jest","Cypress","Figma","Git"],
    tools:["Docker","Linux","Figma","Git"],
    soft:["Team leadership","Mentoring","Cross-functional"],
  };

  const appHistory = [
    { id:"app-sfe",  title:"Senior Frontend Engineer", dept:"Engineering", stage:"Recruiter Screen", applied:"June 4, 2026",  match:87, tier:"Strong", status:"active",  current:true  },
    { id:"app-em",   title:"Engineering Manager",       dept:"Engineering", stage:"Applied",          applied:"June 6, 2026",  match:78, tier:"Good",   status:"active",  current:false },
    { id:"app-be",   title:"Backend Engineer",          dept:"Engineering", stage:"Rejected",         applied:"May 2026",      match:52, tier:"Weak",   status:"closed",  reason:"Skills mismatch on backend depth", current:false },
    { id:"app-fe24", title:"Frontend Engineer",         dept:"Engineering", stage:"Rejected",         applied:"Jan 2025",      match:74, tier:"Good",   status:"closed",  reason:"Cultural fit concerns", old:true, current:false },
    { id:"app-rn",   title:"Mid-level React Engineer",  dept:"Engineering", stage:"Withdrew",         applied:"Aug 2024",      match:69, tier:"Good",   status:"withdrawn",reason:"Accepted another offer", old:true, current:false },
  ];

  const tierColor = {Strong:"var(--success)",Good:"var(--accent)",Possible:"var(--warning)",Weak:"var(--text-3)"};

  const SectionHeader = ({k,label,meta}) => (
    <div className="flex" style={{alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",userSelect:"none",background:"var(--surface-2)",borderBottom:"1px solid var(--border)"}}
      onClick={()=>toggle(k)}>
      <Icon name={expandedSecs[k]?"chevDown":"chevRight"} size={15} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>
      <span style={{fontWeight:600,fontSize:13.5,flex:1}}>{label}</span>
      {meta && <span className="faint" style={{fontSize:12}}>{meta}</span>}
    </div>
  );

  const ParsedRow = ({label,value,verified,warning,link}) => (
    <div className="flex" style={{alignItems:"flex-start",gap:0,padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
      <span className="faint" style={{flex:"0 0 160px",fontSize:12.5,fontWeight:600,paddingTop:1}}>{label}</span>
      <span style={{flex:1,fontSize:13,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        {value}
        {verified && <Icon name="check" size={13} style={{color:"var(--success)"}}/>}
        {warning && <Icon name="alert" size={13} style={{color:"var(--warning)"}}/>}
        {link && <a href="#" style={{color:"var(--accent)"}}>↗</a>}
      </span>
      <button className="icon-btn btn-sm" style={{opacity:.3}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.3}
        onClick={()=>setEditField(label)}><Icon name="edit" size={13}/></button>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,padding:16}}>
      {/* TOP TOOLBAR */}
      <div className="card card-pad flex" style={{alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <span style={{width:40,height:40,borderRadius:10,background:"var(--danger-soft)",color:"var(--danger)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="file" size={21}/></span>
        <div style={{flex:1,minWidth:160}}>
          <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>Ahmed_Hassan_CV.pdf</div>
          <div className="faint" style={{fontSize:12}}>245 KB · Parsed in 2.1s · 98% parsing confidence</div>
          <span className="badge badge-neutral" style={{height:18,fontSize:10.5,marginTop:4}}>Used across 3 applications</span>
        </div>
        <div className="flex" style={{gap:8,flexWrap:"wrap"}}>
          <button className="btn btn-ghost btn-sm btn-icon" title="Download"><Icon name="download" size={15}/></button>
          <button className="btn btn-ghost btn-sm"><Icon name="eye" size={15}/>View raw PDF</button>
          <button className="btn btn-sm" disabled={reparsing} onClick={reparse}
            style={{background:"var(--ai)",borderColor:"var(--ai)",color:"#fff"}}>
            {reparsing ? <><Icon name="refresh" size={14}/>Re-parsing…</> : <><Icon name="sparkles" size={14} fill/>✦ Re-parse with AI</>}
          </button>
          <Kebab items={[{icon:"edit",label:"Replace CV"},{icon:"trash",label:"Remove CV",danger:true}]}/>
        </div>
      </div>

      {/* SPLIT VIEW */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"start"}}>
        {/* LEFT — CV Preview */}
        <div className="card" style={{overflow:"hidden"}}>
          <div className="card-head">
            <Icon name="file" size={15} style={{color:"var(--text-3)"}}/>
            <h3 style={{fontSize:13.5}}>Original CV</h3>
            <div className="spacer" style={{flex:1}}/>
            <div className="flex" style={{alignItems:"center",gap:6}}>
              <button className="icon-btn btn-sm" disabled={cvPage===1} onClick={()=>setCvPage(1)}><Icon name="chevLeft" size={14}/></button>
              <span className="faint mono" style={{fontSize:12}}>Page {cvPage} of 2</span>
              <button className="icon-btn btn-sm" disabled={cvPage===2} onClick={()=>setCvPage(2)}><Icon name="chevRight" size={14}/></button>
            </div>
          </div>
          <div style={{background:"var(--canvas)",padding:"12px 10px",minHeight:500}}>
            <div style={{background:"white",border:"1px solid var(--border)",borderRadius:4,padding:"24px 28px",maxWidth:480,margin:"0 auto",fontFamily:"'IBM Plex Mono','Courier New',monospace",fontSize:11,lineHeight:1.7,boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}>
              {cvPage === 1 ? (
                <React.Fragment>
                  <div style={{textAlign:"center",marginBottom:16,borderBottom:"2px solid #333",paddingBottom:12}}>
                    <div style={{fontSize:18,fontWeight:700,letterSpacing:"-.01em"}}>Ahmed Hassan</div>
                    <div style={{fontSize:12,fontWeight:600,marginTop:3}}>Senior Frontend Engineer</div>
                    <div style={{fontSize:10.5,color:"#555",marginTop:4}}>Riyadh, KSA · ahmed.hassan@email.com · +966 50 123 4567</div>
                    <div style={{fontSize:10.5,color:"#1a56db",marginTop:2}}>linkedin.com/in/ahmedhassan</div>
                  </div>
                  <div style={{marginBottom:14}}>
                    <div style={{fontWeight:700,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",borderBottom:"1px solid #aaa",paddingBottom:3,marginBottom:7}}>SUMMARY</div>
                    <div style={{color:"#333",fontSize:10.5}}>Frontend engineer with 6+ years of experience building scalable web applications. Led a 4-person team at Acme Fintech, delivered a design system used across 3 product surfaces, and drove performance improvements of up to 60%. Passionate about TypeScript-first codebases, accessibility, and shipping things that users notice.</div>
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",borderBottom:"1px solid #aaa",paddingBottom:3,marginBottom:8}}>EXPERIENCE</div>
                    <div style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontWeight:700}}>
                        <span>Senior Frontend Engineer · Acme Fintech</span><span style={{color:"#666"}}>Jan 2023 – Present</span>
                      </div>
                      <div style={{color:"#666",fontSize:10.5,marginBottom:5}}>Riyadh, KSA · Full-time</div>
                      {["Led 4-person frontend team building customer-facing React app","Migrated Webpack to Vite, reduced bundle size by 40%","Established design system used across 3 product surfaces",<span>Mentored 2 junior engineers to mid-level; both promoted in 2024</span>].map((b,i)=>(
                        <div key={i} style={{paddingInlineStart:12,marginBottom:2,color:"#333",fontSize:10.5}}>• <span style={hoveredSkill&&String(b).toLowerCase().includes(hoveredSkill.toLowerCase())?{background:"#fef08a"}:{}}>{b}</span></div>
                      ))}
                    </div>
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",fontWeight:700}}>
                        <span>Frontend Engineer · TechCo</span><span style={{color:"#666"}}>Mar 2020 – Dec 2022</span>
                      </div>
                      <div style={{color:"#666",fontSize:10.5,marginBottom:5}}>Cairo, Egypt · Full-time</div>
                      {["Built component library used in 5 product surfaces","Shipped React Native mobile app from scratch","Reduced page load time by 60%"].map((b,i)=>(
                        <div key={i} style={{paddingInlineStart:12,marginBottom:2,color:"#333",fontSize:10.5}}>• {b}</div>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{marginBottom:14}}>
                    <div style={{fontWeight:700,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",borderBottom:"1px solid #aaa",paddingBottom:3,marginBottom:8}}>EDUCATION</div>
                    <div style={{fontWeight:700}}>B.Sc. Computer Engineering · Cairo University</div>
                    <div style={{color:"#666",fontSize:10.5}}>2016 – 2020 · GPA 3.7 / 4.0</div>
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",borderBottom:"1px solid #aaa",paddingBottom:3,marginBottom:8}}>SKILLS</div>
                    <div style={{color:"#333",fontSize:10.5,lineHeight:1.9}}>
                      <strong>Frontend:</strong> React, TypeScript, Next.js, GraphQL, Tailwind CSS, CSS-in-JS<br/>
                      <strong>Testing:</strong> Jest, Cypress, React Testing Library<br/>
                      <strong>Tools:</strong> Figma, Git, Docker, Linux, Vite, Webpack<br/>
                      <strong>Languages:</strong> English (native), Arabic (conversational)
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Parsed data */}
        <div className="card" style={{overflow:"hidden"}}>
          <div className="card-head">
            <h3 style={{fontSize:13.5}}>Parsed information</h3>
            <div className="spacer" style={{flex:1}}/>
            <span className="badge badge-success" style={{height:20,fontSize:11}}>98% confidence</span>
            <a className="muted" style={{fontSize:12,fontWeight:600,cursor:"pointer",marginInlineStart:10}}>Report issue</a>
          </div>

          {/* Contact */}
          <SectionHeader k="contact" label="Contact information"/>
          {expandedSecs.contact && (
            <div style={{padding:"4px 14px 8px"}}>
              <ParsedRow label="Full name"  value="Ahmed Hassan"/>
              <ParsedRow label="Email"      value="ahmed.hassan@email.com" verified/>
              <ParsedRow label="Phone"      value="+966 50 123 4567" verified/>
              <ParsedRow label="Location"   value="Riyadh, KSA"/>
              <ParsedRow label="LinkedIn"   value="linkedin.com/in/ahmedhassan" link/>
              <ParsedRow label="Languages"  value={<><span style={{marginInlineEnd:8}}>English (fluent)</span><span style={{color:"var(--warning)"}}>Arabic (none detected)</span></>} warning/>
              <ParsedRow label="Authorization" value="KSA citizen" verified/>
            </div>
          )}

          {/* Experience */}
          <SectionHeader k="experience" label="Experience" meta="6.2 years total"/>
          {expandedSecs.experience && (
            <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:10}}>
              {[
                {title:"Senior Frontend Engineer",company:"Acme Fintech",period:"Jan 2023 – Present",duration:"2 yrs 5 mo",loc:"Riyadh, KSA",type:"Full-time",skills:["React","TypeScript","Design Systems","Vite","Mentoring"]},
                {title:"Frontend Engineer",company:"TechCo",period:"Mar 2020 – Dec 2022",duration:"2 yrs 10 mo",loc:"Cairo, Egypt",type:"Full-time",skills:["React","React Native","CSS"]},
              ].map((r,i) => (
                <div key={i} style={{border:"1px solid var(--border)",borderRadius:"var(--r-md)",padding:12}}>
                  <div style={{fontWeight:600,fontSize:13.5,marginBottom:2}}>{r.title}</div>
                  <div className="flex" style={{alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:8}}>
                    <span style={{fontSize:12.5,fontWeight:500}}>{r.company}</span>
                    <span className="faint" style={{fontSize:12}}>{r.period} · {r.duration}</span>
                    <span className="faint" style={{fontSize:12}}>{r.loc} · {r.type}</span>
                  </div>
                  <div className="flex" style={{flexWrap:"wrap",gap:5}}>
                    {r.skills.map(sk=>(
                      <span key={sk} className={"chip"+(hoveredSkill===sk?" chip-accent":"")} style={{height:22,fontSize:11.5,cursor:"pointer"}}
                        onMouseEnter={()=>setHoveredSkill(sk)} onMouseLeave={()=>setHoveredSkill(null)}>{sk}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          <SectionHeader k="education" label="Education" meta="1 degree · B.Sc. Computer Engineering"/>
          {expandedSecs.education && (
            <div style={{padding:"10px 14px"}}>
              <ParsedRow label="Degree" value="B.Sc. Computer Engineering"/>
              <ParsedRow label="Institution" value="Cairo University"/>
              <ParsedRow label="Years" value="2016 – 2020"/>
              <ParsedRow label="GPA" value="3.7 / 4.0"/>
            </div>
          )}

          {/* Skills */}
          <SectionHeader k="skills" label="Skills" meta={Object.values(parsedSkills).flat().length+" skills"}/>
          {expandedSecs.skills && (
            <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:10}}>
              <div className="faint" style={{fontSize:11.5}}>Hover a skill to highlight in CV</div>
              {[["Technical",parsedSkills.technical],["Tools & platforms",parsedSkills.tools],["Soft & leadership",parsedSkills.soft]].map(([grp,skills])=>(
                <div key={grp}>
                  <div style={{fontSize:11,fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>{grp}</div>
                  <div className="flex" style={{flexWrap:"wrap",gap:6}}>
                    {skills.map(sk=>(
                      <span key={sk} className={"chip removable"+(hoveredSkill===sk?" chip-accent":"")} style={{height:24,fontSize:12,cursor:"pointer"}}
                        onMouseEnter={()=>setHoveredSkill(sk)} onMouseLeave={()=>setHoveredSkill(null)}>
                        {sk}<button className="x"><Icon name="x" size={10}/></button>
                      </span>
                    ))}
                    <button className="chip" style={{borderStyle:"dashed",height:24,fontSize:12}}><Icon name="plus" size={11}/>Add</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certs */}
          <SectionHeader k="certs" label="Certifications & links" meta="0 certifications · 2 external links"/>

          {/* Parsing flags */}
          <SectionHeader k="flags" label="Parsing flags" meta="2 flags"/>
          {expandedSecs.flags && (
            <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:9}}>
              {[
                {icon:"alert",color:"var(--warning)",title:"Arabic proficiency",desc:"No Arabic detected in CV. Inferred not Arabic-speaking. Confirm during screen?",actions:["Confirm","Mark as unknown","Edit"]},
                {icon:"bulb",color:"var(--ai)",title:"Notice period",desc:"Not stated in CV. Captured from pre-screen: 1 month.",actions:["View source"]},
              ].map((f,i)=>(
                <div key={i} style={{padding:"11px 13px",border:`1px solid color-mix(in oklch,${f.color} 35%,var(--border))`,borderRadius:"var(--r-md)",background:`color-mix(in oklch,${f.color} 7%,var(--surface))`}}>
                  <div className="flex" style={{alignItems:"flex-start",gap:9}}>
                    <Icon name={f.icon} size={14} style={{color:f.color,flex:"0 0 auto",marginTop:1}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{f.title}</div>
                      <div style={{fontSize:12.5,color:"var(--text-2)",marginBottom:8}}>{f.desc}</div>
                      <div className="flex" style={{gap:7}}>
                        {f.actions.map(a=><button key={a} className="btn btn-ghost btn-sm" style={{height:26,padding:"0 10px",fontSize:12}}>{a}</button>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* APPLICATION HISTORY */}
      {historyVisible && (
        <div className="card">
          <div className="card-head">
            <div>
              <h3 style={{fontSize:14}}>Application history with your company</h3>
              <div className="faint" style={{fontSize:12,marginTop:2}}>This candidate has {appHistory.length} applications total — 2 active, 1 closed, 2 older</div>
            </div>
            <div className="spacer" style={{flex:1}}/>
            <button className="btn btn-subtle btn-sm" onClick={()=>setHistoryVisible(false)}>Hide history</button>
          </div>
          <div style={{padding:"12px 16px",overflowX:"auto"}}>
            <div className="flex" style={{gap:12,width:"max-content"}}>
              {appHistory.map((app,i)=>(
                <div key={app.id} style={{width:220,border:`1.5px solid ${app.current?"var(--accent)":app.old?"var(--border)":"var(--border)"}`,borderRadius:"var(--r-lg)",padding:14,background:app.old?"var(--surface-2)":"var(--surface)",opacity:app.old?.75:1,display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6}}>
                    <span style={{fontWeight:600,fontSize:13.5,lineHeight:1.3}}>{app.title}</span>
                    {app.current && <span className="badge badge-accent" style={{height:17,fontSize:9.5,flex:"0 0 auto"}}>Viewing</span>}
                    {app.status==="closed" && <span className="badge badge-neutral" style={{height:17,fontSize:9.5,flex:"0 0 auto"}}>Closed</span>}
                    {app.status==="withdrawn" && <span className="badge badge-neutral" style={{height:17,fontSize:9.5,flex:"0 0 auto"}}>Withdrew</span>}
                  </div>
                  <div className="faint" style={{fontSize:12}}>{app.dept} · {app.stage}</div>
                  <div className="faint" style={{fontSize:11.5}}>Applied {app.applied}</div>
                  <div className="flex" style={{alignItems:"center",gap:7}}>
                    <span className="mono" style={{fontWeight:700,color:tierColor[app.tier]||"var(--text-3)",fontSize:14}}>{app.match}</span>
                    <span className="badge" style={{height:18,fontSize:10.5,background:`color-mix(in oklch,${tierColor[app.tier]||"var(--text-3)"} 13%,var(--surface))`,color:tierColor[app.tier]||"var(--text-3)"}}>{app.tier}</span>
                  </div>
                  {app.reason && <div className="faint" style={{fontSize:11.5,fontStyle:"italic"}}>"{app.reason}"</div>}
                  {!app.current && (
                    <button className="btn btn-subtle btn-sm" style={{marginTop:4,fontSize:12}} onClick={()=>switchApp&&switchApp(app.id)}>
                      {app.status==="active"?"Switch to this →":"View this →"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"10px 16px",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
            <Icon name="bulb" size={13} style={{color:"var(--info)",flex:"0 0 auto"}}/>
            <span className="faint" style={{fontSize:12}}>Application history is candidate-wide. Each application has its own evaluations and emails.</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ASSESSMENT ── */
function TabAssessment({ app, toast, go }) {
  const [expanded2, setExpanded2] = React.useState(false);
  const [sendModal, setSendModal] = React.useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = React.useState(false);
  const [aiSummaryText, setAiSummaryText] = React.useState("Ahmed performed very strongly across React and TypeScript sections, with near-perfect scores on type system questions and component lifecycle. State management was his weakest area — he solved the problems correctly but spent more time than median candidates, suggesting comfort but not mastery with complex Redux patterns. Overall: a strong technical candidate with clear depth in fundamentals.");
  const [selectedAssessment, setSelectedAssessment] = React.useState("Frontend Engineering Skills Assessment");
  const [deadline, setDeadline] = React.useState("2026-06-11");
  const [sendMsg, setSendMsg] = React.useState("");

  const regenSummary = () => {
    setAiSummaryLoading(true);
    setTimeout(()=>{
      setAiSummaryLoading(false);
      setAiSummaryText("Updated analysis: Ahmed's React fundamentals are exceptional (95th percentile). The TypeScript performance confirms he writes production-grade typed code. The 6m45s on state management is worth probing in the technical interview — recommend asking about async Redux patterns and selector performance.");
    }, 1100);
  };

  const sections = [
    {label:"React fundamentals", score:19, max:20, time:"4m 12s"},
    {label:"TypeScript types",   score:18, max:20, time:"5m 03s"},
    {label:"State management",   score:16, max:20, time:"6m 45s"},
    {label:"Performance",        score:17, max:20, time:"5m 20s"},
    {label:"Accessibility",      score:17, max:20, time:"4m 50s"},
  ];

  const assessmentOptions = [
    "Frontend Engineering Skills Assessment",
    "System Design & Architecture",
    "Cognitive Reasoning Assessment",
    "Communication & Culture Fit",
    "Leadership Potential (Behavioral)",
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,padding:16}}>

      {/* TOP TOOLBAR */}
      <div className="card card-pad flex" style={{alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{flex:1}}>
          <span style={{fontWeight:600,fontSize:15}}>Assessments</span>
          <span className="muted" style={{fontSize:13,marginInlineStart:10}}>2 completed · 1 pending · for this application</span>
        </div>
        <button className="btn btn-primary" onClick={()=>setSendModal(true)}><Icon name="plus" size={16}/>Send assessment</button>
      </div>

      {/* ASSESSMENT 1 — COMPLETED DETAILED */}
      <div className="card" style={{borderInlineStart:"3px solid var(--ai)"}}>
        <div className="card-head">
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:14}}>Frontend Engineering Skills Assessment</div>
            <div className="faint" style={{fontSize:12,marginTop:2}}>Technical · Auto-graded · Sent June 5 · Completed June 6</div>
          </div>
          <span className="badge badge-success" style={{height:22}}>Completed</span>
          <button className="btn btn-primary btn-sm" onClick={() => go && go("assessment-results-review",{from:"candidate-profile"})}><Icon name="eye" size={13}/>Results review</button>
          <button className="btn btn-ghost btn-sm" onClick={() => go && go("assessment-preview",{from:"candidate-profile"})}>View raw responses</button>
          <Kebab items={[{icon:"download",label:"Export results"},{icon:"refresh",label:"Re-grade"},{icon:"trash",label:"Remove",danger:true}]}/>
        </div>
        <div className="card-pad" style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Score summary */}
          <div className="flex" style={{alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div>
              <span className="mono" style={{fontSize:28,fontWeight:500,color:"var(--accent)"}}>87</span>
              <span className="muted" style={{fontSize:16,fontWeight:400}}> / 100</span>
            </div>
            <div style={{flex:1,minWidth:120}}>
              <Bar value={87} color="var(--accent)" h={8}/>
            </div>
            <div className="flex" style={{flexDirection:"column",alignItems:"flex-end",gap:5}}>
              <span className="badge badge-success" style={{height:22}}>Strong</span>
              <span className="faint" style={{fontSize:12}}>Top 8% of test-takers</span>
            </div>
          </div>

          {/* Section breakdown */}
          <div>
            <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>Section breakdown</div>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {sections.map((sec,i)=>(
                <div key={i} className="flex" style={{alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<sections.length-1?"1px solid var(--border)":"none"}}>
                  <span style={{flex:"0 0 160px",fontSize:13,fontWeight:500,whiteSpace:"nowrap"}}>{sec.label}</span>
                  <span className="mono" style={{flex:"0 0 36px",fontSize:13,fontWeight:700,color:sec.score/sec.max>=.9?"var(--success)":sec.score/sec.max>=.8?"var(--accent)":"var(--warning)"}}>{sec.score}/{sec.max}</span>
                  <div style={{flex:1,height:6,borderRadius:20,background:"var(--surface-3)",overflow:"hidden"}}>
                    <div style={{width:(sec.score/sec.max*100)+"%",height:"100%",background:sec.score/sec.max>=.9?"var(--success)":sec.score/sec.max>=.8?"var(--accent)":"var(--warning)",borderRadius:20}}/>
                  </div>
                  <span className="faint mono" style={{flex:"0 0 52px",fontSize:11.5,textAlign:"end"}}>{sec.time}</span>
                </div>
              ))}
            </div>
            <div className="faint" style={{fontSize:12,marginTop:8}}>Total time: 26 minutes (limit was 45 minutes)</div>
          </div>

          {/* AI summary */}
          <div style={{padding:"13px 14px",background:"var(--ai-soft)",border:"1px solid color-mix(in oklch,var(--ai) 30%,transparent)",borderRadius:"var(--r-md)"}}>
            <div className="flex" style={{alignItems:"center",gap:8,marginBottom:8}}>
              <Icon name="sparkles" size={14} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
              <span style={{fontWeight:600,fontSize:13,flex:1}}>AI summary</span>
              <a className="muted" style={{fontSize:12,fontWeight:600,cursor:"pointer",color:"var(--ai)"}} onClick={regenSummary}>{aiSummaryLoading?"Regenerating…":"Regenerate"}</a>
              <a className="muted" style={{fontSize:12,fontWeight:600,cursor:"pointer",marginInlineStart:10}}>View prompt</a>
            </div>
            {aiSummaryLoading
              ? <span className="muted ai-cursor" style={{fontSize:13}}>Analysing…</span>
              : <p style={{fontSize:13,lineHeight:1.65,color:"var(--text-2)"}}>{aiSummaryText}</p>}
          </div>
        </div>
      </div>

      {/* ASSESSMENT 2 — COMPACT */}
      <div className="card card-pad">
        <div className="flex" style={{alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:14}}>Cognitive Reasoning Assessment</div>
            <div className="faint" style={{fontSize:12,marginTop:2}}>Cognitive · Auto-graded · Sent June 5 · Completed June 5 (8 min)</div>
          </div>
          <div className="flex" style={{alignItems:"center",gap:10}}>
            <span className="mono" style={{fontSize:22,fontWeight:500,color:"var(--purple)"}}>78<span style={{fontSize:13,fontWeight:400,color:"var(--text-3)"}}> / 100</span></span>
            <span className="badge badge-accent" style={{height:21}}>Above average</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={()=>setExpanded2(e=>!e)}>
            {expanded2?"Collapse ↑":"Expand details ↓"}
          </button>
        </div>
        {expanded2 && (
          <div style={{marginTop:14,borderTop:"1px solid var(--border)",paddingTop:14,display:"flex",flexDirection:"column",gap:10}}>
            <div className="flex" style={{gap:12,flexWrap:"wrap"}}>
              {[["Logical reasoning","16/20","var(--accent)"],["Numerical","15/20","var(--accent)"],["Verbal","16/20","var(--accent)"],["Spatial","15/20","var(--warning)"]].map(([l,v,c],i)=>(
                <div key={i} style={{flex:"1 1 120px",padding:"10px 12px",background:"var(--surface-2)",borderRadius:"var(--r-sm)"}}>
                  <div className="faint" style={{fontSize:11.5,fontWeight:600,marginBottom:4}}>{l}</div>
                  <span className="mono" style={{fontWeight:700,color:c,fontSize:15}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ASSESSMENT 3 — PENDING */}
      <div className="card" style={{borderInlineStart:"3px solid var(--warning)"}}>
        <div className="card-head">
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:14}}>Communication & Culture Fit Assessment</div>
            <div className="faint" style={{fontSize:12,marginTop:2}}>Behavioral · Sent June 7 · Not yet started</div>
            <div className="flex" style={{alignItems:"center",gap:5,marginTop:4}}>
              <Icon name="clock" size={13} style={{color:"var(--warning)"}}/>
              <span style={{fontSize:12.5,color:"var(--warning)",fontWeight:500}}>Reminder due · 2 days since sent</span>
            </div>
          </div>
          <span className="badge badge-warning" style={{height:22}}>Pending</span>
          <button className="btn btn-ghost btn-sm" onClick={()=>toast&&toast("Reminder sent ✓","send")}>Send reminder now</button>
          <a className="muted" style={{fontSize:12.5,fontWeight:600,cursor:"pointer",color:"var(--danger)"}}>Cancel</a>
        </div>
      </div>

      {/* COMPARISON STRIP */}
      <div className="card card-pad">
        <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>How Ahmed compares</div>
        <div className="muted" style={{fontSize:12.5,marginBottom:16}}>Across all candidates who took these assessments for Senior Frontend Engineer (n=14)</div>
        <div className="grid" style={{gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[
            {label:"Frontend Skills",score:87,pct:8,n:14,col:"var(--accent)"},
            {label:"Cognitive Reasoning",score:78,pct:35,n:14,col:"var(--purple)"},
          ].map((ch,ci)=>(
            <div key={ci} style={{padding:"14px",background:"var(--surface-2)",borderRadius:"var(--r-md)"}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>{ch.label}</div>
              <div style={{position:"relative",height:40,background:"var(--surface-3)",borderRadius:8,overflow:"hidden",marginBottom:8}}>
                {/* Distribution bars mockup */}
                {[12,18,25,30,22,16,10,8,6,4].map((h,i)=>(
                  <div key={i} style={{position:"absolute",bottom:0,width:"9%",left:(i*10)+"%",height:(h/30*100)+"%",background:i>=8-1?"var(--surface-3)":i===Math.floor(14*(100-ch.pct)/100/14)?"color-mix(in oklch,"+ch.col+" 80%,transparent)":"color-mix(in oklch,"+ch.col+" 30%,var(--surface-3))",borderRadius:"3px 3px 0 0"}}/>
                ))}
                {/* Ahmed marker */}
                <div style={{position:"absolute",bottom:0,top:0,left:(100-ch.pct-2)+"%",width:2,background:ch.col,zIndex:2}}/>
              </div>
              <div className="flex" style={{justifyContent:"space-between",fontSize:12}}>
                <span className="faint">Low</span>
                <span style={{fontWeight:600,color:ch.col}}>Ahmed: top {ch.pct}% · {ch.score}/100</span>
                <span className="faint">High</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEND ASSESSMENT MODAL */}
      {sendModal && (
        <div className="scrim" onClick={()=>setSendModal(false)}>
          <div className="modal" style={{maxWidth:560}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <span style={{width:30,height:30,borderRadius:8,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="assessment" size={17}/></span>
              <h3 style={{fontSize:15}}>Send assessment to Ahmed</h3>
              <div className="spacer" style={{flex:1}}/>
              <button className="icon-btn btn-sm" onClick={()=>setSendModal(false)}><Icon name="x" size={17}/></button>
            </div>
            <div className="modal-body" style={{display:"flex",flexDirection:"column",gap:16}}>
              <div className="faint" style={{fontSize:13}}>For application: <strong style={{color:"var(--text)"}}>Senior Frontend Engineer</strong></div>
              <div className="field">
                <label>Assessment</label>
                <select className="select" value={selectedAssessment} onChange={e=>setSelectedAssessment(e.target.value)}>
                  {assessmentOptions.map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div style={{padding:"11px 14px",background:"var(--accent-soft)",borderRadius:"var(--r-md)",fontSize:13}}>
                <div style={{fontWeight:600,marginBottom:3}}>{selectedAssessment}</div>
                <div className="faint">45 min · Auto-graded · Technical</div>
              </div>
              <div className="field">
                <label>Deadline</label>
                <input className="input" type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{colorScheme:"light"}}/>
              </div>
              <div className="field">
                <label>Custom message (optional)</label>
                <textarea className="textarea" rows={3} value={sendMsg} onChange={e=>setSendMsg(e.target.value)} placeholder="Add a personal note to Ahmed about this assessment…"/>
              </div>
            </div>
            <div className="modal-foot">
              <div className="spacer" style={{flex:1}}/>
              <button className="btn btn-subtle" onClick={()=>setSendModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{setSendModal(false);toast&&toast("Assessment sent to Ahmed","send");}}>
                <Icon name="send" size={15}/>Send assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ── Transcript Panel (collapsible) ── */
function TranscriptPanel({ transcript, filteredTranscript, search, setSearch, setProg }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{borderTop:"1px solid var(--border)"}}>
      <div className="flex" style={{alignItems:"center",gap:12,padding:"10px 16px",cursor:"pointer",userSelect:"none",background:"var(--surface-2)"}}
        onClick={()=>setOpen(o=>!o)}>
        <Icon name={open?"chevDown":"chevRight"} size={15} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>
        <span style={{fontWeight:600,fontSize:13.5,flex:1}}>Transcript</span>
        <span className="badge badge-ai" style={{height:19,fontSize:11}}><Icon name="sparkles" size={11} fill/>Auto-transcribed</span>
        {!open && <span className="faint" style={{fontSize:12}}>{transcript.length} lines · click to expand</span>}
        {open && (
          <div className="searchbar" style={{height:32,maxWidth:180}} onClick={e=>e.stopPropagation()}>
            <Icon name="search" size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transcript…"/>
          </div>
        )}
      </div>
      {open && (
        <div style={{maxHeight:320,overflowY:"auto",padding:"10px 16px",display:"flex",flexDirection:"column",gap:8,background:"var(--surface)"}}>
          {filteredTranscript.map((ln,i)=>(
            <div key={i} className="flex" style={{gap:8,alignItems:"flex-start"}}>
              <span className="mono faint" style={{fontSize:11,flex:"0 0 36px",paddingTop:2,cursor:"pointer"}}
                onClick={()=>{const segs=ln.ts.split(":");setProg((+segs[0]*60+ +segs[1])/1104*100);}}>
                {ln.ts}
              </span>
              <span style={{flex:"0 0 14px",fontWeight:700,fontSize:12,paddingTop:1,color:ln.sp==="Q"?"var(--text-3)":"var(--accent)"}}>{ln.sp}</span>
              <p style={{flex:1,fontSize:13,lineHeight:1.6,margin:0}}>
                {ln.highlight
                  ? <React.Fragment>{ln.text} <mark style={{background:"var(--accent-soft)",color:"var(--accent-strong)",borderRadius:3,padding:"0 3px",fontWeight:600}}>{ln.highlight}</mark></React.Fragment>
                  : ln.text}
              </p>
            </div>
          ))}
          {search && filteredTranscript.length===0 && <div className="faint" style={{fontSize:13,textAlign:"center",padding:"12px 0"}}>No matches for "{search}"</div>}
        </div>
      )}
    </div>
  );
}

/* ── VIDEO ── */
function TabVideo({ app, toast, go }) {
  const [activeQ, setActiveQ] = React.useState(1);
  const [playing, setPlaying] = React.useState(false);
  const [prog, setProg] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [sendModal, setSendModal] = React.useState(false);
  const [template, setTemplate] = React.useState("Technical Screen");
  const [analysisLevel, setAnalysisLevel] = React.useState("content");
  const [deadline, setDeadline] = React.useState("2026-06-13");
  const timerRef = React.useRef();

  React.useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setProg(p => { if (p >= 100) { setPlaying(false); return 100; } return p + 0.18; });
      }, 50);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [playing]);

  const questions = [
    { n:1, t:"0:00",  label:"Tell us about yourself and your background." },
    { n:2, t:"4:12",  label:"Walk us through a complex React component you built." },
    { n:3, t:"9:45",  label:"How would you debug a memory leak in a React app?" },
    { n:4, t:"14:30", label:"Why this role at this company?" },
  ];

  const transcript = [
    { ts:"4:12", sp:"Q", text:"Walk us through a complex React component you built at your last company." },
    { ts:"4:18", sp:"A", text:"Sure. At Acme Fintech I built a transaction timeline component that rendered up to 10,000 rows. Initial approach was just mapping over an array — completely unusable." },
    { ts:"4:42", sp:"A", text:"The problem was the full list was re-rendering on every state change. So I introduced", highlight:"virtualization with react-window" },
    { ts:"5:10", sp:"A", text:"to render only the visible rows. Then I wrapped row components in React.memo to prevent re-renders when unrelated state changed." },
    { ts:"5:38", sp:"A", text:"The trade-off was increased complexity — you lose a lot of native scroll behavior with virtualized lists, so we had to rebuild some scroll-to-anchor features. But load time dropped from 4s to 180ms." },
    { ts:"9:45", sp:"Q", text:"How would you debug a memory leak in a React application?" },
    { ts:"9:52", sp:"A", text:"I'd start with Chrome DevTools Memory tab. Take a heap snapshot before and after an action that I suspect leaks — if the retained objects keep growing, that confirms it." },
    { ts:"10:18", sp:"A", text:"Most common culprit in React is", highlight:"forgetting to clean up useEffect subscriptions" },
    { ts:"10:35", sp:"A", text:"Like if you add an event listener or start a setInterval inside useEffect and forget the return cleanup function — that stays in memory even after the component unmounts." },
  ];

  const rubricRows = [
    { criterion:"React expertise",   questions:"Q2",     quality:"Strong",   evidence:'"virtualization, memoization, trade-offs"' },
    { criterion:"Debugging skills",  questions:"Q3",     quality:"Good",     evidence:'"DevTools, heap snapshots"' },
    { criterion:"Communication",     questions:"Q1,2,3", quality:"Strong",   evidence:'"Clear structure, depth"' },
    { criterion:"Cultural fit",      questions:"Q4",     quality:"Good",     evidence:'"Specific interest in fintech"' },
    { criterion:"Leadership",        questions:"—",      quality:"Not asked",evidence:"Not covered" },
  ];

  const signals = [
    { label:"Speech pace",      value:"148 wpm",  note:"Typical" },
    { label:"Filler words",     value:"6 total",  note:"Low" },
    { label:"Vocabulary",       value:"Advanced", note:"" },
    { label:"Avg answer",       value:"3:45 min", note:"In range" },
    { label:"Response latency", value:"<2 sec",   note:"Confident" },
  ];

  const qualityColor = q => q==="Strong"?"var(--success)":q==="Good"?"var(--accent)":q==="Not asked"?"var(--text-3)":"var(--warning)";

  const fmtProg = p => { const total=1104; const s=Math.floor(p/100*total); const m=Math.floor(s/60); return `${String(m).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; };

  const filteredTranscript = search ? transcript.filter(t => (t.text+(t.highlight||"")).toLowerCase().includes(search.toLowerCase())) : transcript;

  const templateQs = {
    "Technical Screen": ["Tell us about yourself","Walk through a complex component","Debug scenario","Why this role?","Technical challenge you solved"],
    "Behavioral": ["Describe a conflict with a teammate","Tell me about a failure","Greatest achievement","How do you handle feedback?"],
    "Custom": ["Add your own questions…"],
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,padding:16}}>

      {/* TOOLBAR */}
      <div className="card card-pad flex" style={{alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{flex:1}}>
          <span style={{fontWeight:600,fontSize:15}}>Video interviews</span>
          <span className="muted" style={{fontSize:13,marginInlineStart:10}}>1 submitted · 0 pending · for this application</span>
        </div>
        <button className="btn btn-primary" onClick={()=>setSendModal(true)}><Icon name="plus" size={16}/>Send video interview</button>
      </div>

      {/* COMPLIANCE BANNER */}
      <div style={{padding:"10px 14px",background:"var(--ai-soft)",border:"1px solid color-mix(in oklch,var(--ai) 25%,transparent)",borderRadius:"var(--r-md)",display:"flex",alignItems:"center",gap:10}}>
        <Icon name="shield" size={15} style={{color:"var(--ai)",flex:"0 0 auto"}}/>
        <span style={{fontSize:13,color:"var(--text-2)"}}>AI analyzes <strong>video content only</strong> — not facial expressions or tone. Candidate consented to AI review.</span>
        <a className="muted" style={{fontSize:12.5,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",marginInlineStart:"auto"}}>View compliance log</a>
      </div>

      {/* COMPLETED INTERVIEW CARD */}
      <div className="card" style={{borderInlineStart:"3px solid var(--ai)",overflow:"hidden"}}>
        <div className="card-head">
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:14}}>Senior Frontend Engineer — Technical Screen Video</div>
            <div className="faint" style={{fontSize:12,marginTop:2}}>Sent June 5 · Submitted June 6 · 4 questions · 18 min total</div>
          </div>
          <span className="badge badge-success" style={{height:22}}>Reviewed</span>
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={14}/>Download</button>
          <Kebab items={[{icon:"eye",label:"View transcript"},{icon:"send",label:"Share link"},{icon:"trash",label:"Delete",danger:true}]}/>
        </div>

        {/* Player full-width */}
        <div>
          {/* PLAYER */}
          <div style={{borderInlineEnd:"1px solid var(--border)"}}>
            <div style={{position:"relative",background:"#0a0d13",aspectRatio:"16/9",cursor:"pointer",overflow:"hidden"}} onClick={()=>setPlaying(p=>!p)}>
              {/* Avatar */}
              <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div className="avatar" style={{width:72,height:72,background:"oklch(0.6 0.14 255)",fontSize:24,margin:"0 auto 10px"}}>AH</div>
                  <div style={{color:"rgba(255,255,255,.7)",fontSize:13}}>Ahmed Hassan</div>
                </div>
              </div>
              {/* Q label */}
              <div style={{position:"absolute",top:12,insetInlineStart:14}}>
                <span style={{background:"rgba(0,0,0,.65)",backdropFilter:"blur(4px)",color:"#fff",fontSize:12,padding:"4px 10px",borderRadius:20,fontWeight:600}}>
                  Q{activeQ} / 4
                </span>
              </div>
              {/* Play overlay */}
              {!playing && <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,.9)",display:"grid",placeItems:"center",boxShadow:"0 8px 24px rgba(0,0,0,.4)"}}>
                  <Icon name="play" size={22} fill style={{color:"#0a0d13",marginInlineStart:3}}/>
                </div>
              </div>}
              {playing && <div style={{position:"absolute",bottom:52,insetInlineEnd:14}}>
                <span style={{background:"rgba(220,38,38,.9)",color:"#fff",fontSize:11,padding:"3px 8px",borderRadius:20,fontWeight:600}}>● PLAYING</span>
              </div>}
            </div>
            {/* Controls */}
            <div style={{background:"#111827",padding:"8px 14px"}}>
              <div style={{height:4,borderRadius:20,background:"rgba(255,255,255,.2)",cursor:"pointer",marginBottom:8}}
                onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg((e.clientX-r.left)/r.width*100);}}>
                <div style={{width:prog+"%",height:"100%",background:"var(--ai)",borderRadius:20}}/>
              </div>
              <div className="flex" style={{alignItems:"center",gap:12}}>
                <button onClick={()=>setPlaying(p=>!p)} style={{color:"#fff"}}><Icon name={playing?"pause":"play"} size={17} fill/></button>
                <span className="mono" style={{color:"rgba(255,255,255,.7)",fontSize:12}}>{fmtProg(prog)} / 18:24</span>
                <div className="spacer" style={{flex:1}}/>
                <select style={{background:"#1f2937",color:"#fff",border:"none",fontSize:12,borderRadius:5,padding:"2px 6px"}}>
                  <option>1×</option><option>1.25×</option><option>1.5×</option>
                </select>
                <button style={{color:"rgba(255,255,255,.7)"}}><Icon name="mic" size={16}/></button>
                <button style={{color:"rgba(255,255,255,.7)"}}><Icon name="eye" size={16}/></button>
              </div>
            </div>
            {/* Question chips */}
            <div className="flex" style={{gap:8,padding:"12px 14px",flexWrap:"wrap",borderTop:"1px solid var(--border)"}}>
              {questions.map(q=>(
                <button key={q.n} onClick={()=>{setActiveQ(q.n);setProg(q.n===1?0:q.n===2?22:q.n===3?52:77);}}
                  className={"btn btn-sm"+(activeQ===q.n?" btn-primary":" btn-subtle")} style={{fontSize:12,height:30}}>
                  Q{q.n} {q.t}
                </button>
              ))}
            </div>
            {/* Active Q label */}
            <div style={{padding:"0 14px 14px",fontSize:13,color:"var(--text-2)"}}>
              <strong style={{color:"var(--text)"}}>Q{activeQ}:</strong> {questions[activeQ-1].label}
            </div>
          </div>
        </div>

        {/* TRANSCRIPT — collapsible below player */}
        <TranscriptPanel transcript={transcript} filteredTranscript={filteredTranscript} search={search} setSearch={setSearch} setProg={setProg}/>
      </div>

      {/* AI ANALYSIS */}
      {/* Summary */}
      <div className="card" style={{borderInlineStart:"3px solid var(--ai)"}}>
        <div className="card-pad">
          <div className="flex" style={{alignItems:"center",gap:8,marginBottom:10}}>
            <Icon name="sparkles" size={15} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
            <span style={{fontWeight:600,fontSize:14,flex:1}}>AI summary</span>
            <span className="badge badge-success" style={{height:22}}>Strong — Advance recommended</span>
          </div>
          <p style={{fontSize:13.5,lineHeight:1.75,color:"var(--text-2)"}}>
            Ahmed gave clear, technically detailed answers across all 4 questions. His response on the React component (Q2) demonstrated real depth: identified the performance problem, chose appropriate techniques (virtualization, memoization), and could articulate trade-offs. On Q3 (debugging memory leak), correctly identified Chrome DevTools and explained heap snapshots, though less structured than Q2. Q4 showed clear interest in fintech.
          </p>
          <div style={{marginTop:12,padding:"10px 14px",background:"var(--success-soft)",borderRadius:"var(--r-sm)",fontSize:13.5,fontWeight:600,color:"var(--success)",display:"flex",alignItems:"center",gap:8}}>
            <Icon name="thumb" size={15}/>Recommendation: Strong technical fit. Advance to live interview.
          </div>
        </div>
      </div>

      {/* Rubric mapping */}
      <div className="card" style={{overflow:"hidden"}}>
        <div className="card-head"><h3 style={{fontSize:14}}>Rubric criteria addressed</h3></div>
        <div style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead><tr>
              <th>Criterion</th><th>Question(s)</th><th>Quality</th><th>Evidence</th>
            </tr></thead>
            <tbody>
              {rubricRows.map((r,i)=>(
                <tr key={i}>
                  <td style={{fontWeight:600,fontSize:13.5}}>{r.criterion}</td>
                  <td><span className="mono faint" style={{fontSize:13}}>{r.questions}</span></td>
                  <td><span className="badge" style={{background:`color-mix(in oklch,${qualityColor(r.quality)} 14%,var(--surface))`,color:qualityColor(r.quality),height:20,fontSize:11.5}}>{r.quality}</span></td>
                  <td><span style={{fontSize:13,color:"var(--text-2)",fontStyle:r.quality==="Not asked"?"italic":"normal"}}>{r.evidence}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Behavioral signals */}
      <div className="card card-pad">
        <div className="flex" style={{alignItems:"center",gap:8,marginBottom:4}}>
          <h3 style={{fontSize:14,flex:1}}>Communication signals</h3>
          <Icon name="shield" size={14} style={{color:"var(--ai)"}}/>
          <span className="faint" style={{fontSize:12}}>Content analysis only</span>
        </div>
        <p style={{fontSize:12,color:"var(--text-3)",fontStyle:"italic",marginBottom:14}}>Content analysis only. No facial or tonal inference.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
          {signals.map((sig,i)=>(
            <div key={i} style={{padding:"12px 14px",background:"var(--surface-2)",borderRadius:"var(--r-md)",textAlign:"center"}}>
              <div className="mono" style={{fontSize:17,fontWeight:700,color:"var(--accent)",marginBottom:4}}>{sig.value}</div>
              <div style={{fontSize:12,fontWeight:600,color:"var(--text-2)"}}>{sig.label}</div>
              {sig.note && <div style={{fontSize:11,color:"var(--text-3)",marginTop:3}}>{sig.note}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* SENTIMENT ANALYSIS */}
      <div className="card card-pad">
        <div className="flex" style={{alignItems:"center",gap:8,marginBottom:16}}>
          <Icon name="trending" size={16} style={{color:"var(--ai)"}}/>
          <h3 style={{fontSize:14,flex:1}}>Sentiment analysis</h3>
          <span className="faint" style={{fontSize:12,fontStyle:"italic"}}>Content signals only</span>
        </div>
        {/* Overall sentiment timeline */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          {[
            {q:"Q1",label:"About yourself",    overall:"Positive",confidence:88,col:"var(--success)"},
            {q:"Q2",label:"React component",   overall:"Positive",confidence:91,col:"var(--success)"},
            {q:"Q3",label:"Debug memory leak", overall:"Neutral", confidence:78,col:"var(--warning)"},
            {q:"Q4",label:"Why this role",     overall:"Positive",confidence:83,col:"var(--success)"},
          ].map((row,i)=>(
            <div key={i} style={{padding:"12px",border:`1px solid color-mix(in oklch,${row.col} 30%,var(--border))`,borderRadius:"var(--r-md)",background:`color-mix(in oklch,${row.col} 7%,var(--surface))`,textAlign:"center"}}>
              <div className="mono" style={{fontSize:11,fontWeight:700,color:"var(--text-3)",marginBottom:4}}>{row.q}</div>
              <div style={{fontWeight:700,fontSize:16,color:row.col,marginBottom:2}}>{row.overall}</div>
              <div className="faint" style={{fontSize:11.5,marginBottom:8}}>{row.label}</div>
              <div style={{height:5,borderRadius:20,background:"var(--surface-3)",overflow:"hidden"}}>
                <div style={{width:row.confidence+"%",height:"100%",background:row.col,borderRadius:20}}/>
              </div>
              <div className="mono faint" style={{fontSize:11,marginTop:4}}>{row.confidence}% conf.</div>
            </div>
          ))}
        </div>
        {/* Flow chart across questions */}
        <div style={{padding:"11px 14px",background:"var(--success-soft)",borderRadius:"var(--r-md)",display:"flex",alignItems:"center",gap:10}}>
          <Icon name="trending" size={15} style={{color:"var(--success)",flex:"0 0 auto"}}/>
          <span style={{fontSize:13,color:"var(--success)",fontWeight:500}}>Positive throughout interview. Neutral on Q3 (debugging under pressure) is expected — not a flag.</span>
        </div>
      </div>

      {/* EMOTION ANALYSIS */}
      <div className="card card-pad">
        <div className="flex" style={{alignItems:"center",gap:8,marginBottom:16}}>
          <Icon name="smile" size={16} style={{color:"var(--purple)"}}/>
          <h3 style={{fontSize:14,flex:1}}>Emotion analysis</h3>
          <span className="faint" style={{fontSize:12,fontStyle:"italic"}}>Language-based inference</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {q:"Q1 — About yourself",    emotions:[{e:"Enthusiasm",v:72,c:"var(--warning)"},{e:"Confidence",v:85,c:"var(--success)"},{e:"Clarity",v:80,c:"var(--success)"}]},
            {q:"Q2 — React component",   emotions:[{e:"Technical pride",v:90,c:"var(--success)"},{e:"Engagement",v:88,c:"var(--success)"},{e:"Clarity",v:85,c:"var(--success)"}]},
            {q:"Q3 — Debug memory leak", emotions:[{e:"Focus",v:74,c:"var(--accent)"},{e:"Uncertainty",v:28,c:"var(--danger)"},{e:"Recovery",v:70,c:"var(--accent)"}]},
            {q:"Q4 — Why this role",     emotions:[{e:"Genuine interest",v:82,c:"var(--success)"},{e:"Enthusiasm",v:78,c:"var(--warning)"},{e:"Authenticity",v:80,c:"var(--success)"}]},
          ].map((row,i)=>(
            <div key={i} style={{padding:"12px 14px",border:"1px solid var(--border)",borderRadius:"var(--r-md)"}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10,color:"var(--text-2)"}}>{row.q}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {row.emotions.map((em,j)=>(
                  <div key={j}>
                    <div className="flex" style={{justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                      <span style={{fontWeight:600,color:em.c}}>{em.e}</span>
                      <span className="mono" style={{fontWeight:700,color:em.c}}>{em.v}%</span>
                    </div>
                    <Bar value={em.v} color={em.c} h={6}/>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="faint" style={{fontSize:12,marginTop:12}}>Emotions inferred from language patterns in transcript. Not facial or tonal analysis.</div>
      </div>

      {/* KEYWORDS */}
      <div className="card card-pad">
        <div className="flex" style={{alignItems:"center",gap:8,marginBottom:14}}>
          <Icon name="zap" size={16} style={{color:"var(--accent)"}}/>
          <h3 style={{fontSize:14,flex:1}}>Key terms & concepts mentioned</h3>
          <span className="badge badge-accent" style={{height:20,fontSize:11}}>AI extracted</span>
        </div>
        {/* By category */}
        {[
          { cat:"Technical concepts", color:"var(--accent)", words:[
            {w:"virtualization",f:3},{w:"react-window",f:2},{w:"memoization",f:4},{w:"heap snapshot",f:2},{w:"useEffect cleanup",f:2},
            {w:"Immer",f:1},{w:"Redux Toolkit",f:2},{w:"Vite",f:2},{w:"createSelector",f:1},{w:"TypeScript generics",f:2},
          ]},
          { cat:"Soft skills", color:"var(--success)", words:[
            {w:"mentored",f:2},{w:"led team",f:2},{w:"trade-offs",f:3},{w:"communication",f:2},{w:"structure",f:1},
          ]},
          { cat:"Domain knowledge", color:"var(--warning)", words:[
            {w:"fintech",f:4},{w:"transaction timeline",f:2},{w:"performance",f:5},{w:"bundle size",f:1},{w:"Core Web Vitals",f:1},
          ]},
          { cat:"Role relevance", color:"var(--purple)", words:[
            {w:"React expertise",f:6},{w:"TypeScript",f:5},{w:"design system",f:3},{w:"Next.js",f:2},{w:"accessibility",f:2},
          ]},
        ].map((cat,ci)=>(
          <div key={ci} style={{marginBottom:ci<3?16:0}}>
            <div style={{fontSize:11.5,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",color:"var(--text-3)",marginBottom:8}}>{cat.cat}</div>
            <div className="flex" style={{flexWrap:"wrap",gap:7}}>
              {cat.words.map((w,wi)=>(
                <span key={wi} className="chip" style={{
                  background:`color-mix(in oklch,${cat.color} ${Math.min(8+w.f*5,25)}%,var(--surface))`,
                  color:cat.color, fontSize:12.5, fontWeight:600, height:27,
                  borderColor:`color-mix(in oklch,${cat.color} 35%,transparent)`,
                  border:"1px solid",
                }}>
                  {w.w}
                  <span className="mono" style={{marginInlineStart:5,fontSize:11,opacity:.7}}>×{w.f}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="faint" style={{fontSize:12,marginTop:14}}>Terms are extracted from the transcript. Font size reflects frequency. Click a term to highlight in transcript.</div>
      </div>

      {/* SEND MODAL */}
      {sendModal && (
        <div className="scrim" onClick={()=>setSendModal(false)}>
          <div className="modal" style={{maxWidth:640}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <span style={{width:30,height:30,borderRadius:8,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="video" size={17}/></span>
              <h3 style={{fontSize:15}}>Send video interview to Ahmed</h3>
              <div className="spacer" style={{flex:1}}/>
              <button className="icon-btn btn-sm" onClick={()=>setSendModal(false)}><Icon name="x" size={17}/></button>
            </div>
            <div className="modal-body" style={{display:"flex",flexDirection:"column",gap:16}}>
              <div className="faint" style={{fontSize:13}}>For: <strong style={{color:"var(--text)"}}>Senior Frontend Engineer</strong></div>
              <div className="field">
                <label>Template</label>
                <div className="seg" style={{alignSelf:"flex-start"}}>
                  {["Technical Screen","Behavioral","Custom"].map(t=>(
                    <button key={t} className={template===t?"on":""} onClick={()=>setTemplate(t)} style={{fontSize:13}}>{t}</button>
                  ))}
                </div>
              </div>
              {/* Questions preview */}
              <div className="field">
                <label>Questions ({templateQs[template].length})</label>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {templateQs[template].map((q,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"var(--surface-2)",borderRadius:"var(--r-sm)"}}>
                      <span className="mono faint" style={{flex:"0 0 20px",fontSize:12}}>{i+1}.</span>
                      <span style={{flex:1,fontSize:13}}>{q}</span>
                      <span className="badge badge-neutral" style={{height:19,fontSize:11}}>2 min</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="two-col" style={{gap:12}}>
                <div className="field"><label>Retakes allowed</label><select className="select"><option>0</option><option>1</option><option>2</option><option>Unlimited</option></select></div>
                <div className="field"><label>Deadline</label><input className="input" type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{colorScheme:"light"}}/></div>
              </div>
              <div className="field">
                <label>AI analysis level</label>
                {[["content","Content analysis only (recommended, EU-safe)"],["speech","Content + speech pace (US)"],["none","No AI analysis"]].map(([v,l])=>(
                  <div key={v} className={"rad-opt"+(analysisLevel===v?" on":"")} onClick={()=>setAnalysisLevel(v)} style={{marginBottom:4}}>
                    <span className="rad"/><span style={{fontSize:13,fontWeight:600}}>{l}</span>
                  </div>
                ))}
              </div>
              <div className="field"><label>Custom message (optional)</label><textarea className="textarea" rows={2} placeholder="Add a personal note to Ahmed…"/></div>
            </div>
            <div className="modal-foot">
              <div className="spacer" style={{flex:1}}/>
              <button className="btn btn-subtle" onClick={()=>setSendModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{setSendModal(false);toast&&toast("Video interview sent to Ahmed","send");}}>
                <Icon name="send" size={15}/>Send invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── EVALUATIONS ── */
function TabEvaluations({ app, toast, switchApp }) {
  const [expandedCard, setExpandedCard] = React.useState("khalid");
  const [pastOpen, setPastOpen] = React.useState(false);
  const [scheduleModal, setScheduleModal] = React.useState(false);
  const [addInterviewer, setAddInterviewer] = React.useState(false);

  const interviewers = [
    { id:"khalid", initials:"KR", color:"oklch(0.6 0.15 300)", name:"Khalid Al-Rahman", role:"Engineering Director", status:"submitted", submittedAt:"June 5 · 4:15 PM", recommendation:"Strong Yes", recColor:"var(--success)",
      criteria:[{label:"React expertise",stars:5,note:"Built complex React app at Acme. Excellent virtualization knowledge."},{label:"TypeScript",stars:4,note:"Strong types; explained generics and discriminated unions well."},{label:"Leadership",stars:4,note:"Led 4-person team; good mentoring examples."},{label:"Communication",stars:5,note:"Clear, structured answers throughout."},{label:"Cultural fit",stars:4,note:"Genuine fintech interest. Good energy."}],
      notes:"Ahmed is the strongest React candidate we've seen this cycle. Recommend moving to final round with a leadership-focused exercise." },
    { id:"sara", initials:"SM", color:"oklch(0.6 0.14 195)", name:"Sara Mansour", role:"Senior Engineer", status:"submitted", submittedAt:"June 5 · 5:02 PM", recommendation:"Yes", recColor:"var(--accent)",
      criteria:[{label:"React expertise",stars:5,note:"Very strong. RTL/i18n knowledge is a plus."},{label:"TypeScript",stars:4,note:"Solid."},{label:"Leadership",stars:3,note:"Team-lead scope, expected for this role."},{label:"Communication",stars:5,note:"Excellent listener."},{label:"Cultural fit",stars:4,note:"Would fit well."}],
      notes:"Strong technical hire. The backend gap is real but not a blocker. Vote yes." },
    { id:"omar", initials:"OS", color:"oklch(0.6 0.14 60)", name:"Omar Saleh", role:"Engineering Manager", status:"pending", lastReminded:"6 hours ago" },
  ];

  const Stars = ({n, onRate, editable}) => (
    <div className="flex" style={{gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <button key={i} onClick={editable?()=>onRate(i):null}
          style={{cursor:editable?"pointer":"default",background:"none",border:"none",padding:1,transition:"transform .1s"}}
          onMouseEnter={e=>editable&&(e.currentTarget.style.transform="scale(1.2)")}
          onMouseLeave={e=>e.currentTarget.style.transform=""}>
          <Icon name="star" size={15} fill={i<=n} style={{color:i<=n?"var(--warning)":"var(--border-strong)"}}/>
        </button>
      ))}
    </div>
  );

  /* Interactive scorecard with live score impact */
  function ScorecardPanel({iv, onClose}) {
    const weights = {
      "React expertise":0.30,"TypeScript":0.20,"Leadership":0.20,
      "Communication":0.15,"Cultural fit":0.15
    };
    const [scores, setScores] = React.useState(
      Object.fromEntries(iv.criteria.map(c=>[c.label,c.stars]))
    );
    const [comments, setComments] = React.useState(
      Object.fromEntries(iv.criteria.map(c=>[c.label,c.note]))
    );
    const [openComment, setOpenComment] = React.useState(null);
    const [recommendation, setRecommendation] = React.useState(iv.recommendation);
    const [changed, setChanged] = React.useState(false);

    const weightedScore = (sc) =>
      Object.entries(sc).reduce((sum,[k,v])=>(sum+(v/5)*(weights[k]||0.2)*100),0);
    const baseScore = weightedScore(Object.fromEntries(iv.criteria.map(c=>[c.label,c.stars])));
    const currentScore = weightedScore(scores);
    const delta = Math.round(currentScore - baseScore);

    const recOptions = ["Strong Yes","Yes","Maybe","No","Strong No"];
    const recColors = {"Strong Yes":"var(--success)","Yes":"var(--accent)","Maybe":"var(--warning)","No":"var(--danger)","Strong No":"var(--danger)"};

    const setScore = (label, n) => { setScores(s=>({...s,[label]:n})); setChanged(true); };
    const setComment = (label, v) => { setComments(c=>({...c,[label]:v})); setChanged(true); };

    return (
      <div style={{padding:"16px 20px",borderTop:"1px solid var(--border)",background:"var(--surface-2)"}}>
        {/* Header */}
        <div className="flex" style={{alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <span style={{fontWeight:600,fontSize:14,flex:1}}>{iv.name}'s scorecard</span>
          {changed && <span className="badge badge-warning" style={{height:20,fontSize:11}}>Unsaved changes</span>}
          <button className="btn btn-ghost btn-sm"><Icon name="file" size={14}/>View as PDF</button>
          <button className="btn btn-primary btn-sm" disabled={!changed} onClick={()=>setChanged(false)}>
            <Icon name="check" size={14}/>Save changes
          </button>
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>

        {/* Criteria rows */}
        <div style={{display:"flex",flexDirection:"column",gap:0,marginBottom:16}}>
          {iv.criteria.map((cr,i)=>(
            <div key={i} style={{borderBottom:i<iv.criteria.length-1?"1px solid var(--border)":"none",padding:"10px 0"}}>
              {/* Score row */}
              <div className="flex" style={{alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:6}}>
                <span style={{flex:"0 0 160px",fontWeight:600,fontSize:13.5}}>{cr.label}</span>
                <Stars n={scores[cr.label]} onRate={n=>setScore(cr.label,n)} editable/>
                <span className="mono" style={{fontSize:13,fontWeight:700,color:scores[cr.label]>=4?"var(--success)":"var(--warning)"}}>{scores[cr.label]}/5</span>
                {delta!==0 && scores[cr.label]!==cr.stars && (
                  <span style={{fontSize:11.5,fontWeight:600,color:scores[cr.label]>cr.stars?"var(--success)":"var(--danger)"}}>
                    {scores[cr.label]>cr.stars?"▲":"▼"} changed from {cr.stars}
                  </span>
                )}
                <button className="icon-btn btn-sm has-tip" data-tip="Add comment"
                  style={{marginInlineStart:"auto",color:openComment===cr.label?"var(--accent)":"var(--text-3)"}}
                  onClick={()=>setOpenComment(openComment===cr.label?null:cr.label)}>
                  <Icon name="message" size={14}/>
                </button>
              </div>
              {/* Comment */}
              {openComment===cr.label ? (
                <textarea className="textarea" rows={2} style={{minHeight:56,fontSize:13,marginTop:4}}
                  value={comments[cr.label]} onChange={e=>setComment(cr.label,e.target.value)}
                  placeholder="Add your evaluation notes for this criterion…"/>
              ) : comments[cr.label] ? (
                <div style={{fontSize:12.5,color:"var(--text-2)",lineHeight:1.55,paddingInlineStart:172,cursor:"text"}}
                  onClick={()=>setOpenComment(cr.label)}>{comments[cr.label]}</div>
              ) : (
                <div className="faint" style={{fontSize:12,paddingInlineStart:172,cursor:"text"}}
                  onClick={()=>setOpenComment(cr.label)}>+ Add comment</div>
              )}
            </div>
          ))}
        </div>

        {/* LIVE SCORE IMPACT */}
        <div style={{padding:"14px 16px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",marginBottom:12}}>
          <div className="flex" style={{alignItems:"center",gap:10,marginBottom:12}}>
            <Icon name="trending" size={15} style={{color:"var(--accent)"}}/>
            <span style={{fontWeight:600,fontSize:13.5,flex:1}}>Score impact preview</span>
            <span className="faint" style={{fontSize:12}}>Weighted contribution to panel score</span>
          </div>
          {/* Per-criterion weighted bars */}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
            {iv.criteria.map((cr,i)=>{
              const w = weights[cr.label]||0.2;
              const orig = (cr.stars/5)*w*100;
              const curr = (scores[cr.label]/5)*w*100;
              const diff = curr - orig;
              return (
                <div key={i} className="flex" style={{alignItems:"center",gap:10,fontSize:12.5}}>
                  <span style={{flex:"0 0 160px",color:"var(--text-2)"}}>{cr.label}</span>
                  <span className="faint" style={{flex:"0 0 32px",textAlign:"end"}}>{Math.round(w*100)}%</span>
                  <div style={{flex:1,position:"relative",height:7,borderRadius:20,background:"var(--surface-3)"}}>
                    <div style={{position:"absolute",insetInlineStart:0,top:0,bottom:0,width:(orig)+"px",minWidth:0,maxWidth:"100%",background:"var(--border-strong)",borderRadius:20}}/>
                    <div style={{position:"absolute",insetInlineStart:0,top:0,bottom:0,width:curr+"%",background:diff>0?"var(--success)":diff<0?"var(--danger)":"var(--accent)",borderRadius:20,transition:"width .3s ease"}}/>
                  </div>
                  <span className="mono" style={{flex:"0 0 36px",textAlign:"end",fontWeight:700,fontSize:12,color:diff>0?"var(--success)":diff<0?"var(--danger)":"var(--text-2)"}}>
                    {(diff>0?"+":"")+Math.round(diff*10)/10}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Total */}
          <div className="flex" style={{alignItems:"center",gap:14,padding:"11px 14px",background:delta>0?"var(--success-soft)":delta<0?"var(--danger-soft)":"var(--surface-2)",borderRadius:"var(--r-md)"}}>
            <div>
              <div className="faint" style={{fontSize:11.5,marginBottom:2}}>Panel contribution (before)</div>
              <span className="mono" style={{fontSize:20,fontWeight:700,color:"var(--text-3)"}}>{Math.round(baseScore)}</span>
            </div>
            {delta!==0 && (
              <React.Fragment>
                <Icon name="arrowRight" size={18} style={{color:"var(--text-3)"}}/>
                <div>
                  <div className="faint" style={{fontSize:11.5,marginBottom:2}}>After your changes</div>
                  <span className="mono" style={{fontSize:20,fontWeight:700,color:delta>0?"var(--success)":"var(--danger)"}}>{Math.round(currentScore)} <span style={{fontSize:13}}>{delta>0?"+":""}{delta}</span></span>
                </div>
              </React.Fragment>
            )}
            {delta===0 && <span className="muted" style={{fontSize:13}}>No changes yet — adjust the star ratings above</span>}
          </div>
        </div>

        {/* Recommendation */}
        <div style={{marginBottom:10}}>
          <div className="faint" style={{fontSize:11.5,marginBottom:8,fontWeight:600}}>Overall recommendation</div>
          <div className="flex" style={{gap:8,flexWrap:"wrap"}}>
            {recOptions.map(opt=>(
              <button key={opt} onClick={()=>{setRecommendation(opt);setChanged(true);}}
                className="btn btn-sm" style={{height:34,fontWeight:600,borderWidth:1.5,
                  background:recommendation===opt?`color-mix(in oklch,${recColors[opt]} 14%,var(--surface))`:"var(--surface)",
                  borderColor:recommendation===opt?recColors[opt]:"var(--border-strong)",
                  color:recommendation===opt?recColors[opt]:"var(--text-2)"}}>
                {recommendation===opt&&<Icon name="check" size={13}/>}{opt}
              </button>
            ))}
          </div>
        </div>

        <div className="faint" style={{fontSize:11.5,textAlign:"end"}}>Submitted {iv.submittedAt}</div>
      </div>
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,padding:16}}>

      {/* TOOLBAR */}
      <div className="card card-pad flex" style={{alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{flex:1}}><span style={{fontWeight:600,fontSize:15}}>Evaluations</span><span className="muted" style={{fontSize:13,marginInlineStart:10}}>1 round · 2 of 3 submitted</span></div>
        <button className="btn btn-ghost btn-sm" onClick={()=>setAddInterviewer(true)}><Icon name="plus" size={14}/>Add interviewer</button>
        <button className="btn btn-primary" onClick={()=>setScheduleModal(true)}><Icon name="plus" size={16}/>Schedule new round</button>
      </div>

      {/* ROUND 1 */}
      <div className="card" style={{overflow:"hidden"}}>
        <div className="card-head">
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>Round 1: Technical Interview</div><div className="faint" style={{fontSize:12,marginTop:2}}>June 5 · 2:00 PM GST · 60 min · Google Meet</div></div>
          <span className="badge badge-warning" style={{height:22}}>In progress · 1 pending</span>
          <Kebab items={[{icon:"edit",label:"Edit round"},{icon:"calendar",label:"Reschedule"},{icon:"trash",label:"Cancel",danger:true}]}/>
        </div>
        <div style={{padding:"14px 16px 0"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
            {interviewers.map(iv=>(
              <div key={iv.id} onClick={()=>iv.status==="submitted"&&setExpandedCard(expandedCard===iv.id?null:iv.id)}
                style={{border:`1.5px solid ${expandedCard===iv.id?"var(--accent)":iv.status==="pending"?"var(--warning)":"var(--border)"}`,borderRadius:"var(--r-md)",padding:13,cursor:iv.status==="submitted"?"pointer":"default",background:expandedCard===iv.id?"var(--accent-soft)":"var(--surface)",transition:"var(--t-fast)"}}>
                <div className="flex" style={{alignItems:"center",gap:9,marginBottom:9}}>
                  <div className="avatar" style={{width:36,height:36,background:iv.color,fontSize:13,flex:"0 0 auto"}}>{iv.initials}</div>
                  <div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:13.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{iv.name}</div><div className="faint" style={{fontSize:11.5}}>{iv.role}</div></div>
                </div>
                {iv.status==="submitted"?(
                  <React.Fragment>
                    <div className="flex" style={{alignItems:"center",gap:5,marginBottom:5}}><Icon name="check" size={13} style={{color:"var(--success)"}}/><span style={{fontSize:12,color:"var(--success)",fontWeight:600}}>Submitted · {iv.submittedAt}</span></div>
                    <span className="badge" style={{height:22,background:`color-mix(in oklch,${iv.recColor} 14%,var(--surface))`,color:iv.recColor,fontWeight:700}}>{iv.recommendation}</span>
                  </React.Fragment>
                ):(
                  <React.Fragment>
                    <div className="flex" style={{alignItems:"center",gap:5,marginBottom:8}}><Icon name="clock" size={13} style={{color:"var(--warning)"}}/><span style={{fontSize:12,color:"var(--warning)",fontWeight:600}}>Pending · {iv.lastReminded}</span></div>
                    <button className="btn btn-ghost btn-sm" style={{width:"100%",fontSize:12}} onClick={()=>toast&&toast("Reminder sent ✓","send")}>Nudge interviewer</button>
                  </React.Fragment>
                )}
              </div>
            ))}
          </div>
          <div className="flex" style={{alignItems:"flex-start",gap:9,padding:"10px 12px",background:"var(--info-soft)",borderRadius:"var(--r-sm)",marginBottom:14,fontSize:13,color:"var(--info)"}}>
            <Icon name="shield" size={14} style={{flex:"0 0 auto",marginTop:1}}/>
            All scorecards visible once Omar submits — hidden to prevent anchoring bias.
          </div>
        </div>

        {/* LOCKED AGGREGATED */}
        <div style={{margin:"0 16px 16px",border:"1px solid var(--border-strong)",borderRadius:"var(--r-lg)",overflow:"hidden"}}>
          <div style={{padding:"11px 16px",background:"var(--surface-3)",display:"flex",alignItems:"center",gap:10}}>
            <Icon name="lock" size={15} style={{color:"var(--text-3)"}}/><span style={{fontWeight:600,fontSize:13.5,flex:1}}>Aggregated evaluation — waiting for 1 more</span>
          </div>
          <div style={{padding:"14px 16px",opacity:.4,pointerEvents:"none",userSelect:"none"}}>
            {[["React expertise","95%"],["TypeScript","90%"],["Leadership","?"],["Communication","100%"]].map(([l,v],i)=>(
              <div key={i} className="flex" style={{alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid var(--border)",fontSize:13}}>
                <span style={{flex:"0 0 160px",fontWeight:500}}>{l}</span>
                <div style={{flex:1,height:6,borderRadius:20,background:"var(--surface-3)"}}><div style={{width:v==="?"?"50%":v,height:"100%",background:"var(--border-strong)",borderRadius:20}}/></div>
                <span className="mono faint" style={{flex:"0 0 36px"}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:10,padding:"8px 12px",background:"var(--warning-soft)",borderRadius:"var(--r-sm)",fontSize:12.5,color:"var(--warning)"}}>
              <Icon name="alert" size={13} style={{verticalAlign:"-2px",marginInlineEnd:5}}/>Leadership: Khalid 8, Sara 5 — needs discussion
            </div>
          </div>
        </div>

        {/* EXPANDED SCORECARD */}
        {expandedCard && (() => { const iv=interviewers.find(i=>i.id===expandedCard); return iv&&iv.status==="submitted"?<ScorecardPanel iv={iv} onClose={()=>setExpandedCard(null)}/>:null; })()}
      </div>

      {/* FUTURE ROUND */}
      <div style={{border:"2px dashed var(--border)",borderRadius:"var(--r-lg)",padding:"18px 20px",display:"flex",alignItems:"center",gap:14}}>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,marginBottom:2}}>Round 2: Final Interview</div><div className="faint" style={{fontSize:13}}>Not scheduled · Available once Technical Interview is complete</div></div>
        <button className="btn btn-ghost btn-sm" onClick={()=>setScheduleModal(true)}><Icon name="plus" size={14}/>Schedule final round</button>
      </div>

      {/* AI VS HUMAN */}
      <div className="card card-pad">
        <div style={{fontWeight:600,fontSize:14,marginBottom:14}}>AI vs human alignment</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div style={{padding:"14px",background:"var(--ai-soft)",borderRadius:"var(--r-md)",border:"1px solid color-mix(in oklch,var(--ai) 25%,transparent)"}}>
            <div className="flex" style={{alignItems:"center",gap:7,marginBottom:8}}><Icon name="sparkles" size={14} fill style={{color:"var(--ai)"}}/><span style={{fontWeight:600,fontSize:13}}>AI Match</span></div>
            <div className="mono" style={{fontSize:26,fontWeight:700,color:"var(--ai)"}}>87<span style={{fontSize:13,fontWeight:400,color:"var(--text-3)"}}>/100</span></div>
            <span className="badge badge-success" style={{marginTop:6}}>Strong</span>
            <div className="faint" style={{fontSize:12,marginTop:5}}>CV + Pre-screen + Assessment</div>
          </div>
          <div style={{padding:"14px",background:"var(--surface-2)",borderRadius:"var(--r-md)",border:"1px solid var(--border)"}}>
            <div className="flex" style={{alignItems:"center",gap:7,marginBottom:8}}><Icon name="users" size={14} style={{color:"var(--accent)"}}/><span style={{fontWeight:600,fontSize:13}}>Human panel (2 of 3)</span></div>
            {[["KR","oklch(0.6 0.15 300)","Khalid","Strong Yes","var(--success)"],["SM","oklch(0.6 0.14 195)","Sara","Yes","var(--accent)"],["OS","oklch(0.6 0.14 60)","Omar","Pending…","var(--text-3)"]].map(([ini,col,name,rec,rcol])=>(
              <div key={ini} className="flex" style={{alignItems:"center",gap:8,marginBottom:6}}>
                <div className="avatar" style={{width:22,height:22,background:col,fontSize:9,flex:"0 0 auto"}}>{ini}</div>
                <span style={{fontSize:12.5,flex:1}}>{name}:</span>
                <strong style={{color:rcol,fontSize:12.5}}>{rec}</strong>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"11px 14px",background:"var(--ai-soft)",border:"1px solid color-mix(in oklch,var(--ai) 25%,transparent)",borderRadius:"var(--r-md)",fontSize:13,lineHeight:1.65}}>
          <Icon name="sparkles" size={13} fill style={{color:"var(--ai)",verticalAlign:"-2px",marginInlineEnd:5}}/>
          ✦ The AI's CV-based assessment closely matches Khalid's evaluation. Sara's slightly lower score is driven by concerns about backend depth — consistent with the AI's flagged 'limited backend exposure'.
        </div>
      </div>

      {/* PAST EVALUATIONS */}
      <div className="card">
        <div className="card-head" style={{cursor:"pointer"}} onClick={()=>setPastOpen(o=>!o)}>
          <Icon name={pastOpen?"chevDown":"chevRight"} size={15} style={{color:"var(--text-3)"}}/>
          <h3 style={{fontSize:14,flex:1}}>Past evaluations from other applications</h3>
          <span className="badge badge-neutral" style={{height:20,fontSize:11}}>2 accessible</span>
        </div>
        {pastOpen&&(
          <div style={{padding:"4px 16px 14px"}}>
            <div className="faint" style={{fontSize:12.5,marginBottom:12}}>Visible if you have permission for those applications.</div>
            {[{title:"Backend Engineer",status:"Closed · Rejected June 1",round:"Technical Interview",rec:"No",recCol:"var(--danger)",appId:"app-be"},{title:"Frontend Engineer",status:"Closed · Rejected Jan 2025",round:"Final Interview",rec:"Mixed",recCol:"var(--warning)",appId:"app-fe24"}].map((pa,i)=>(
              <div key={i} className="flex" style={{alignItems:"center",gap:12,padding:"10px 12px",borderRadius:"var(--r-md)",border:"1px solid var(--border)",marginBottom:8,background:"var(--surface-2)"}}>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{pa.title}</div><div className="faint" style={{fontSize:12}}>{pa.status} · {pa.round}</div></div>
                <span className="badge" style={{background:`color-mix(in oklch,${pa.recCol} 13%,var(--surface))`,color:pa.recCol,height:22}}>{pa.rec}</span>
                <button className="btn btn-ghost btn-sm" onClick={()=>switchApp&&switchApp(pa.appId)}>View →</button>
              </div>
            ))}
            <div className="faint" style={{fontSize:12,marginTop:4}}>Showing 2 of 2 accessible. Switch application context for full detail.</div>
          </div>
        )}
      </div>

      {/* SCHEDULE MODAL */}
      {scheduleModal&&(
        <div className="scrim" onClick={()=>setScheduleModal(false)}>
          <div className="modal" style={{maxWidth:480}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><span style={{width:30,height:30,borderRadius:8,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="calendar" size={17}/></span><h3 style={{fontSize:15}}>Schedule interview round</h3><div className="spacer" style={{flex:1}}/><button className="icon-btn btn-sm" onClick={()=>setScheduleModal(false)}><Icon name="x" size={17}/></button></div>
            <div className="modal-body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="field"><label>Round name</label><input className="input" defaultValue="Round 2: Final Interview"/></div>
              <div className="two-col" style={{gap:12}}><div className="field"><label>Date</label><input className="input" type="date" style={{colorScheme:"light"}}/></div><div className="field"><label>Duration</label><select className="select"><option>30 min</option><option selected>60 min</option><option>90 min</option></select></div></div>
              <div className="field"><label>Format</label><select className="select"><option>Live via Google Meet</option><option>Live via Zoom</option><option>In-person</option></select></div>
              <div className="field"><label>Interviewers</label><div className="flex" style={{flexWrap:"wrap",gap:7}}><span className="chip chip-accent">Khalid Al-Rahman<button className="x"><Icon name="x" size={11}/></button></span><button className="chip" style={{borderStyle:"dashed"}}><Icon name="plus" size={12}/>Add</button></div></div>
            </div>
            <div className="modal-foot"><div className="spacer" style={{flex:1}}/><button className="btn btn-subtle" onClick={()=>setScheduleModal(false)}>Cancel</button><button className="btn btn-primary" onClick={()=>{setScheduleModal(false);toast&&toast("Round scheduled","check");}}>Schedule</button></div>
          </div>
        </div>
      )}

      {/* ADD INTERVIEWER MODAL */}
      {addInterviewer && <AddInterviewerModal onClose={()=>setAddInterviewer(false)} toast={toast}/>}
    </div>
  );
}

function AddInterviewerModal({ onClose, toast }) {
  const team = [
    { id:"noura", initials:"NA", color:"oklch(0.6 0.14 60)", name:"Noura Al-Otaibi", role:"Staff Engineer" },
    { id:"james", initials:"JM", color:"oklch(0.6 0.14 230)", name:"James Mitchell", role:"Engineering Manager" },
    { id:"fatima", initials:"FS", color:"oklch(0.6 0.14 10)", name:"Fatima Al-Shamsi", role:"Senior Engineer" },
    { id:"omar", initials:"OS", color:"oklch(0.6 0.14 145)", name:"Omar Saleh", role:"Tech Lead" },
  ];
  const [picked, setPicked] = React.useState([]);
  const [round, setRound] = React.useState("r1");
  const [scorecard, setScorecard] = React.useState("default");
  const [q, setQ] = React.useState("");
  const [notify, setNotify] = React.useState(true);
  const list = team.filter(m => !q || m.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id) => setPicked(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500, width: "100%" }} onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <span style={{width:30,height:30,borderRadius:8,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="userPlus" size={16}/></span>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:15.5}}>Add interviewer</div><div className="faint" style={{fontSize:12.5}}>They'll get a scorecard to complete for this candidate.</div></div>
          <button className="btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17}/></button>
        </div>
        <div className="modal-body" style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="field"><label>Round</label>
            <select className="select" value={round} onChange={e=>setRound(e.target.value)}><option value="r1">Round 1: Technical Interview</option><option value="r2">Round 2: Final Interview</option></select>
          </div>
          <div className="field"><label>Select team members</label>
            <div className="searchbar" style={{height:36,marginBottom:8}}><Icon name="search" size={14}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search your team…"/></div>
            <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:210,overflowY:"auto"}}>
              {list.map(m => { const on=picked.includes(m.id); return (
                <button key={m.id} className="flex" onClick={()=>toggle(m.id)} style={{alignItems:"center",gap:11,padding:"8px 10px",borderRadius:"var(--r-sm)",background:on?"var(--accent-soft)":"transparent",textAlign:"start"}}>
                  <span style={{width:18,height:18,borderRadius:5,border:"1.5px solid "+(on?"var(--accent)":"var(--border-strong)"),background:on?"var(--accent)":"transparent",display:"grid",placeItems:"center",flex:"0 0 auto"}}>{on&&<Icon name="check" size={12} style={{color:"#fff"}}/>}</span>
                  <span className="avatar" style={{width:32,height:32,background:m.color,fontSize:12,flex:"0 0 auto"}}>{m.initials}</span>
                  <span style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13}}>{m.name}</div><div className="faint" style={{fontSize:11.5}}>{m.role}</div></span>
                </button>
              ); })}
            </div>
          </div>
          <div className="field"><label>Scorecard template</label>
            <select className="select" value={scorecard} onChange={e=>setScorecard(e.target.value)}><option value="default">Default — role rubric (5 criteria)</option><option value="leadership">Leadership-focused</option><option value="blank">Blank scorecard</option></select>
          </div>
          <label className="flex" style={{alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setNotify(v=>!v)}>
            <span style={{width:30,height:17,borderRadius:20,background:notify?"var(--accent)":"var(--border-strong)",position:"relative",flex:"0 0 30px",transition:"background .2s"}}><span style={{position:"absolute",top:2,insetInlineStart:notify?15:2,width:13,height:13,borderRadius:"50%",background:"#fff",transition:"inset-inline-start .2s"}}/></span>
            <span style={{fontSize:13}}>Email them an invite to complete the scorecard</span>
          </label>
        </div>
        <div className="modal-foot"><div className="spacer" style={{flex:1}}/><button className="btn btn-subtle btn-sm" onClick={onClose}>Cancel</button><button className="btn btn-primary btn-sm" disabled={!picked.length} onClick={()=>{ onClose(); toast && toast(`Added ${picked.length} interviewer${picked.length>1?"s":""}`); }}><Icon name="userPlus" size={14}/>Add {picked.length||""} interviewer{picked.length>1?"s":""}</button></div>
      </div>
    </div>
  );
}
function TabEmails({ candidate, app, toast }) {
  const [selectedThread, setSelectedThread] = React.useState(0);
  const [showAll, setShowAll] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [replyBody, setReplyBody] = React.useState("");
  const [sendModal, setSendModal] = React.useState(false);
  const [composerOpen, setComposerOpen] = React.useState(true);

  const threads = [
    {
      id: 0, appId: "app-sfe",
      subject: "Interview invitation for Senior Frontend Engineer",
      lastFrom: "Ahmed Hassan", lastAt: "2 days ago",
      preview: "Thanks for the invitation! I can do Tuesday at…",
      tags: [{label:"Reply received",col:"var(--success)"},{label:"3 messages",col:"var(--text-3)"}],
      messages: [
        {
          dir: "out", automated: true,
          template: "Recruiter Screen Invitation", stage: "Recruiter Screen",
          from: "Connect AI Talent <careers@connect-ai.com>",
          to: "ahmed.hassan@email.com",
          sent: "June 5 · 10:32 AM GST",
          statuses: [{icon:"check",label:"Delivered ✓"},{icon:"eye",label:"Opened ✓ 11:15 AM"},{icon:"link",label:"Clicked link"}],
          body: `Hi Ahmed,

Thanks for your application for the Senior Frontend Engineer role on our Engineering team at Connect AI. We've reviewed your background and would love to invite you to a screening call.

Your interview is scheduled with Layla Al-Fayez on Tuesday, June 11 at 2:00 PM GST.`,
          cta: { label: "Join the call", href: "#" },
          cta2: { label: "Reschedule", href: "#" },
          closing: `Looking forward to speaking with you.

Best,
Layla Al-Fayez
Connect AI Talent Team`,
          footer: "Sent via Connect AI · Open rate: 100%"
        },
        {
          dir: "in",
          from: "Ahmed Hassan",
          to: "Connect AI Talent",
          sent: "June 5 · 11:47 AM",
          statuses: [{icon:"reply",label:"Reply ↩"}],
          body: `Hi Layla,

Thanks for the invitation! Tuesday at 2 PM works perfectly for me. I've added it to my calendar.

A quick question: will the call be focused on technical fit, or is there a culture/values element as well? Just want to prepare appropriately.

Looking forward to it.

Best,
Ahmed`,
        },
        {
          dir: "out", automated: false,
          from: "Layla Al-Fayez <layla@connect-ai.com>",
          to: "ahmed.hassan@email.com",
          sent: "June 5 · 12:03 PM",
          statuses: [{icon:"check",label:"Delivered ✓"},{icon:"eye",label:"Opened ✓"}],
          body: `Hi Ahmed,

Great question! The screening call is primarily about technical fit and the role itself. We'll cover values and culture more deeply in the final round.

Talk Tuesday!
Layla`,
        },
      ]
    },
    {
      id: 1, appId: "app-sfe",
      subject: "Application received — Senior Frontend Engineer",
      lastFrom: "Connect AI", lastAt: "4 days ago",
      preview: "Thank you for applying to Senior Frontend Engineer at…",
      tags: [{label:"Auto-sent",col:"var(--ai)"},{label:"1 message",col:"var(--text-3)"},{label:"Opened ✓",col:"var(--success)"}],
      messages: [
        {
          dir: "out", automated: true,
          template: "Application Received", stage: "Applied",
          from: "Connect AI Talent <careers@connect-ai.com>",
          to: "ahmed.hassan@email.com",
          sent: "June 4 · 9:12 AM GST",
          statuses: [{icon:"check",label:"Delivered ✓"},{icon:"eye",label:"Opened ✓"}],
          body: `Hi Ahmed,

Thank you for applying to the Senior Frontend Engineer role at Connect AI. We've received your application and our team will be in touch shortly.

You can track your application status at any time from your candidate portal.

Best regards,
Connect AI Talent Team`,
        }
      ]
    },
    {
      id: 2, appId: "app-sfe",
      subject: "Technical assessment invitation",
      lastFrom: "Connect AI", lastAt: "3 days ago",
      preview: "You've been invited to complete a Frontend Engineering…",
      tags: [{label:"Auto-sent",col:"var(--ai)"},{label:"1 message",col:"var(--text-3)"},{label:"Clicked link",col:"var(--accent)"}],
      messages: [
        {
          dir: "out", automated: true,
          template: "Assessment Invitation", stage: "Technical Assessment",
          from: "Connect AI Talent <careers@connect-ai.com>",
          to: "ahmed.hassan@email.com",
          sent: "June 5 · 3:00 PM GST",
          statuses: [{icon:"check",label:"Delivered ✓"},{icon:"eye",label:"Opened ✓"},{icon:"link",label:"Clicked link"}],
          body: `Hi Ahmed,

You've been invited to complete the Frontend Engineering Skills Assessment for the Senior Frontend Engineer role.

The assessment takes approximately 45 minutes and covers React, TypeScript, and performance fundamentals.`,
          cta: { label: "Start assessment", href: "#" },
          closing: `Good luck!

Connect AI Talent Team`,
        }
      ]
    },
    {
      id: 3, appId: "app-em",
      subject: "Application received — Engineering Manager",
      lastFrom: "Connect AI", lastAt: "1 day ago",
      preview: "Thank you for applying to Engineering Manager at…",
      tags: [{label:"Auto-sent",col:"var(--ai)"},{label:"1 message",col:"var(--text-3)"}],
      messages: [{
        dir:"out",automated:true,template:"Application Received",stage:"Applied",
        from:"Connect AI Talent <careers@connect-ai.com>",to:"ahmed.hassan@email.com",
        sent:"June 6 · 9:00 AM GST",statuses:[{icon:"check",label:"Delivered ✓"}],
        body:"Hi Ahmed,\n\nThank you for applying to the Engineering Manager role at Connect AI.\n\nBest,\nConnect AI Talent Team"
      }]
    },
    {
      id: 4, appId: "app-be",
      subject: "Rejection — Backend Engineer",
      lastFrom: "Connect AI", lastAt: "8 days ago",
      preview: "Thank you for your interest in the Backend Engineer role…",
      tags: [{label:"Auto-sent",col:"var(--ai)"},{label:"1 message",col:"var(--text-3)"}],
      messages: [{
        dir:"out",automated:true,template:"Rejection — Pre-Interview",stage:"Rejected",
        from:"Connect AI Talent <careers@connect-ai.com>",to:"ahmed.hassan@email.com",
        sent:"June 1 · 11:00 AM GST",statuses:[{icon:"check",label:"Delivered ✓"},{icon:"eye",label:"Opened ✓"}],
        body:"Hi Ahmed,\n\nThank you for your interest in the Backend Engineer role at Connect AI. After reviewing your application, we've decided not to move forward at this time.\n\nWe encourage you to apply for future roles that match your background.\n\nBest regards,\nConnect AI Talent Team"
      }]
    },
  ];

  const appThreads = showAll ? threads : threads.filter(t => t.appId === app.id);
  const filteredThreads = appThreads.filter(t => {
    if (filter === "outbound") return t.messages.every(m=>m.dir==="out");
    if (filter === "inbound") return t.messages.some(m=>m.dir==="in");
    if (filter === "automated") return t.messages.some(m=>m.automated);
    return true;
  });

  const thread = threads.find(t=>t.id===selectedThread) || threads[0];
  const appMap = {"app-sfe":"Senior Frontend Engineer","app-em":"Engineering Manager","app-be":"Backend Engineer (Closed)"};

  const groupedByApp = {};
  filteredThreads.forEach(t=>{
    const appKey = appMap[t.appId]||t.appId;
    if (!groupedByApp[appKey]) groupedByApp[appKey] = [];
    groupedByApp[appKey].push(t);
  });

  const StatusChip = ({icon,label}) => (
    <span className="flex" style={{alignItems:"center",gap:4,fontSize:11.5,fontWeight:600,color:label.includes("Delivered")?"var(--success)":label.includes("Opened")?"var(--accent)":label.includes("Clicked")?"var(--accent)":"var(--text-3)"}}>
      <Icon name={icon==="reply"?"reply":icon==="link"?"link":"check"} size={11}/>{label}
    </span>
  );

  const MessageBubble = ({msg, first}) => {
    const isIn = msg.dir === "in";
    return (
      <div style={{marginBottom:14}}>
        {/* Automated banner */}
        {msg.automated && (
          <div className="flex" style={{alignItems:"center",gap:7,padding:"7px 12px",background:"var(--ai-soft)",border:"1px solid color-mix(in oklch,var(--ai) 25%,transparent)",borderRadius:"var(--r-md)",marginBottom:8,fontSize:12.5}}>
            <Icon name="sparkles" size={13} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
            <span><strong>Auto-sent</strong> · Template: {msg.template} · Linked to stage: <strong>{msg.stage}</strong></span>
          </div>
        )}
        {/* Message card */}
        <div style={{background:isIn?"var(--surface-2)":"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",overflow:"hidden",marginInlineStart:isIn?0:0}}>
          {/* Header */}
          <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",background:isIn?"var(--surface-3)":"var(--surface)"}}>
            <div className="flex" style={{alignItems:"center",gap:10,flexWrap:"wrap"}}>
              {isIn && <div className="avatar" style={{width:28,height:28,background:"oklch(0.6 0.15 255)",fontSize:11,flex:"0 0 auto"}}>AH</div>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600}}>{isIn?"Ahmed Hassan →":msg.from}</div>
                <div className="faint" style={{fontSize:11.5}}>{isIn?"To: Connect AI Talent":("To: "+msg.to)} · {msg.sent}</div>
              </div>
              <div className="flex" style={{gap:10,flexWrap:"wrap"}}>
                {msg.statuses.map((st,i)=><StatusChip key={i} {...st}/>)}
              </div>
            </div>
          </div>
          {/* Body */}
          <div style={{padding:"14px 16px",fontSize:14,lineHeight:1.75,color:"var(--text)",whiteSpace:"pre-wrap"}}>
            {msg.body}
            {msg.cta && (
              <div style={{margin:"14px 0 6px",display:"flex",gap:10,flexWrap:"wrap"}}>
                <a href="#" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",background:"var(--accent)",color:"#fff",borderRadius:"var(--r-sm)",fontWeight:600,fontSize:13.5,textDecoration:"none"}}>📎 {msg.cta.label}</a>
                {msg.cta2 && <a href="#" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",border:"1px solid var(--border-strong)",borderRadius:"var(--r-sm)",fontWeight:600,fontSize:13.5,color:"var(--text-2)",textDecoration:"none"}}>{msg.cta2.label}</a>}
              </div>
            )}
            {msg.closing && <div style={{whiteSpace:"pre-wrap",color:"var(--text)"}}>{msg.closing}</div>}
          </div>
          {msg.footer && <div style={{padding:"7px 16px",borderTop:"1px solid var(--border)",fontSize:11.5,color:"var(--text-3)"}}>{msg.footer}</div>}
        </div>
      </div>
    );
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:0,height:"100%"}}>
      {/* TOOLBAR */}
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",flexShrink:0}}>
        <div style={{flex:1}}>
          <span style={{fontWeight:600,fontSize:15}}>Emails</span>
          <span className="muted" style={{fontSize:13,marginInlineStart:10}}>
            {threads.filter(t=>t.appId===app.id).length} threads · for this application
          </span>
        </div>
        <select className="select" style={{height:34,fontSize:13}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All emails</option>
          <option value="outbound">Outbound</option>
          <option value="inbound">Inbound</option>
          <option value="automated">Automated</option>
        </select>
        <label className="flex" style={{alignItems:"center",gap:7,cursor:"pointer",fontSize:13,fontWeight:500,color:"var(--text-2)"}}>
          <div onClick={()=>setShowAll(v=>!v)} style={{width:34,height:20,borderRadius:20,background:showAll?"var(--accent)":"var(--border-strong)",position:"relative",transition:"background .2s",cursor:"pointer",flex:"0 0 auto"}}>
            <div style={{position:"absolute",top:3,insetInlineStart:showAll?16:3,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"inset-inline-start .2s"}}/>
          </div>
          All applications
        </label>
        <button className="btn btn-primary" onClick={()=>setSendModal(true)}><Icon name="send" size={15}/>Send email</button>
      </div>

      {/* TWO-PANE */}
      <div style={{display:"grid",gridTemplateColumns:"40% 60%",flex:1,overflow:"hidden",minHeight:500}}>

        {/* LEFT — thread list */}
        <div style={{borderInlineEnd:"1px solid var(--border)",overflowY:"auto",background:"var(--surface)"}}>
          {showAll ? (
            Object.entries(groupedByApp).map(([appName, appThreads])=>(
              <React.Fragment key={appName}>
                <div style={{padding:"8px 14px 4px",fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"var(--text-3)",background:"var(--surface-2)",borderBottom:"1px solid var(--border)"}}>
                  {appName} · {appThreads.length}
                </div>
                {appThreads.map(t=><ThreadRow key={t.id} t={t} selected={selectedThread===t.id} onClick={()=>setSelectedThread(t.id)}/>)}
              </React.Fragment>
            ))
          ) : (
            filteredThreads.map(t=><ThreadRow key={t.id} t={t} selected={selectedThread===t.id} onClick={()=>setSelectedThread(t.id)}/>)
          )}
        </div>

        {/* RIGHT — thread detail */}
        <div style={{overflowY:"auto",display:"flex",flexDirection:"column"}}>
          {/* Thread header */}
          <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0}}>
            <div style={{fontWeight:600,fontSize:16,marginBottom:4}}>{thread.subject}</div>
            <div className="flex" style={{alignItems:"center",flexWrap:"wrap",gap:10}}>
              <span className="faint" style={{fontSize:12.5,flex:1}}>Between Ahmed Hassan and Layla Al-Fayez · {thread.messages.length} messages · For: {appMap[thread.appId]}</span>
              <a className="muted" style={{fontSize:12.5,fontWeight:600,cursor:"pointer"}}>View original</a>
              <Kebab items={[{icon:"archive",label:"Archive"},{icon:"trash",label:"Delete",danger:true}]}/>
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1,padding:"16px 18px",overflowY:"auto"}}>
            {thread.messages.map((msg,i)=><MessageBubble key={i} msg={msg} first={i===0}/>)}
          </div>

          {/* REPLY COMPOSER */}
          {composerOpen && (
            <div style={{borderTop:"2px solid var(--border)",background:"var(--surface)",flexShrink:0}}>
              <div style={{padding:"10px 16px 0",display:"flex",alignItems:"center",gap:10}}>
                <span className="faint" style={{fontSize:12.5,fontWeight:600}}>Reply to Ahmed Hassan</span>
                <div className="spacer" style={{flex:1}}/>
                <button className="chip" style={{fontSize:12,height:26}}><Icon name="sparkles" size={12} fill style={{color:"var(--ai)"}}/>Use template</button>
                <button className="icon-btn btn-sm" onClick={()=>setComposerOpen(false)}><Icon name="x" size={15}/></button>
              </div>
              <div style={{padding:"8px 16px 4px",fontSize:12.5,color:"var(--text-2)",borderBottom:"1px solid var(--border)"}}>
                <span className="faint">Re: </span>{thread.subject.slice(0,50)}…
              </div>
              <textarea className="textarea" rows={4} value={replyBody} onChange={e=>setReplyBody(e.target.value)}
                placeholder="Type your reply to Ahmed…"
                style={{border:"none",borderRadius:0,resize:"vertical",minHeight:90,fontSize:13.5,padding:"12px 16px",outline:"none",boxShadow:"none"}}/>
              <div className="flex" style={{alignItems:"center",gap:10,padding:"8px 16px 12px"}}>
                <select style={{fontSize:12,border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"4px 8px",background:"var(--surface)",color:"var(--text-2)",height:30}}>
                  <option>Send now</option><option>In 1 hour</option><option>Tomorrow 9 AM</option>
                </select>
                <div className="spacer" style={{flex:1}}/>
                <button className="btn btn-subtle btn-sm">Save draft</button>
                <button className="btn btn-primary btn-sm" disabled={!replyBody.trim()}
                  onClick={()=>{setReplyBody("");toast&&toast("Email sent to Ahmed","send");}}>
                  <Icon name="send" size={14}/>Send
                </button>
              </div>
            </div>
          )}
          {!composerOpen && (
            <div style={{padding:"10px 18px",borderTop:"1px solid var(--border)",background:"var(--surface-2)"}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>setComposerOpen(true)}>
                <Icon name="reply" size={14}/>Reply to Ahmed
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEND MODAL */}
      {sendModal && (
        <div className="scrim" onClick={()=>setSendModal(false)}>
          <div className="modal" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <span style={{width:30,height:30,borderRadius:8,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="send" size={17}/></span>
              <h3 style={{fontSize:15}}>Send email to Ahmed</h3>
              <div className="spacer" style={{flex:1}}/>
              <button className="icon-btn btn-sm" onClick={()=>setSendModal(false)}><Icon name="x" size={17}/></button>
            </div>
            <div className="modal-body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="faint" style={{fontSize:13}}>For: <strong style={{color:"var(--text)"}}>Senior Frontend Engineer application</strong></div>
              <div className="field"><label>Template (optional)</label>
                <select className="select"><option>— Write manually —</option><option>Interview Invitation</option><option>Assessment Invitation</option><option>Rejection — Pre-Interview</option><option>Custom…</option></select>
              </div>
              <div className="field"><label>Subject</label><input className="input" placeholder="Email subject…"/></div>
              <div className="field"><label>Body</label><textarea className="textarea" rows={5} placeholder="Write your email to Ahmed…"/></div>
              <div className="field"><label>Send timing</label>
                <select className="select"><option>Send now</option><option>In 1 hour</option><option>Tomorrow morning</option></select>
              </div>
            </div>
            <div className="modal-foot"><div className="spacer" style={{flex:1}}/><button className="btn btn-subtle" onClick={()=>setSendModal(false)}>Cancel</button><button className="btn btn-primary" onClick={()=>{setSendModal(false);toast&&toast("Email sent to Ahmed","send");}}><Icon name="send" size={15}/>Send</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function ThreadRow({t, selected, onClick}) {
  return (
    <div onClick={onClick} style={{padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)",borderInlineStart:`3px solid ${selected?"var(--accent)":"transparent"}`,background:selected?"var(--accent-soft)":"transparent",transition:"background var(--t-fast)"}}>
      <div className="flex" style={{alignItems:"flex-start",gap:8,marginBottom:4}}>
        <span style={{fontWeight:selected?700:600,fontSize:13.5,flex:1,lineHeight:1.3}}>{t.subject}</span>
      </div>
      <div className="faint" style={{fontSize:12,marginBottom:5}}>{t.lastFrom} · {t.lastAt}</div>
      <div className="faint" style={{fontSize:12,marginBottom:7,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.preview}</div>
      <div className="flex" style={{gap:5,flexWrap:"wrap"}}>
        {t.tags.map((tag,i)=><span key={i} style={{fontSize:11,fontWeight:600,color:tag.col,background:`color-mix(in oklch,${tag.col} 12%,var(--surface))`,padding:"2px 8px",borderRadius:20,border:`1px solid color-mix(in oklch,${tag.col} 25%,transparent)`}}>{tag.label}</span>)}
      </div>
    </div>
  );
}

/* ── NOTES ── */
function TabNotes({ candidate, app, toast }) {
  const [filter, setFilter] = React.useState("all");
  const [composerText, setComposerText] = React.useState("");
  const [composerScope, setComposerScope] = React.useState("app");
  const [composerVis, setComposerVis] = React.useState("team");
  const [composerPin, setComposerPin] = React.useState(false);
  const [composerTag, setComposerTag] = React.useState("");
  const [mentionOpen, setMentionOpen] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [editText, setEditText] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState(null);
  const textareaRef = React.useRef();

  const [notes, setNotes] = React.useState([
    {
      id:"n1", scope:"candidate", pinned:true, vis:"team",
      author:"Khalid Al-Rahman", initials:"KR", role:"Engineering Director", color:"oklch(0.6 0.15 300)",
      ts:"June 5 · pinned by Layla", pinnedBy:"Layla",
      tags:["Reference check","Risk"],
      body:"Important context: Ahmed worked with @Sara Mansour at TechCo in 2021. Sara confirmed strong technical skills but noted some friction with the team lead at the time — worth probing during cultural conversations in any final round.\n\nNot a red flag, but a known factor across applications.",
      reactions:[{emoji:"❤",count:2},{emoji:"💬",count:1}],
      replies:[{
        author:"Sara Mansour", initials:"SM", color:"oklch(0.6 0.14 195)",
        ts:"June 5 · 5:15 PM",
        body:"Confirmed. Ahmed is excellent technically. The friction was mainly around how to scope new work — he wanted more autonomy than the lead was giving. Would not call it a culture issue."
      }],
      showReplies:true,
    },
    {
      id:"n2", scope:"app", pinned:false, vis:"team",
      author:"Layla Al-Fayez", initials:"LF", role:"Talent Acquisition Lead", color:"oklch(0.6 0.14 255)",
      ts:"June 6 · 9:12 AM",
      tags:["Salary"],
      body:"Quick salary check for this role: Ahmed mentioned he's targeting SAR 28–32k/month for the Senior Frontend Engineer role. Our band is SAR 25–30k. Slight gap but workable if he's strong through the rounds.",
      reactions:[],
      replies:[],
      showReplies:false,
    },
    {
      id:"n3", scope:"candidate", pinned:false, vis:"hiring-team",
      author:"Omar Saleh", initials:"OS", role:"Engineering Manager", color:"oklch(0.6 0.14 60)",
      ts:"May 28",
      tags:[],
      body:"Met Ahmed at the Riyadh React meetup last month. Smart, asks good questions, knows his stuff. Worth fast-tracking when relevant roles open.",
      reactions:[],
      replies:[],
      showReplies:false,
    },
  ]);

  const team = ["Sara Mansour","Khalid Al-Rahman","Omar Saleh","Noura Al-Otaibi","James Mitchell"];

  const visIcons = {team:"lock", "hiring-team":"users", interviewers:"eye", all:"globe"};
  const visLabels = {team:"Team only","hiring-team":"Hiring team",interviewers:"Interviewers",all:"All viewers"};

  const pinned = notes.filter(n=>n.pinned);
  const regular = notes.filter(n=>!n.pinned);

  const filtered = (arr) => arr.filter(n=>{
    if(filter==="mine") return n.author==="Layla Al-Fayez";
    if(filter==="pinned") return n.pinned;
    if(filter==="candidate") return n.scope==="candidate";
    if(filter==="app") return n.scope==="app";
    if(tagFilter) return n.tags.includes(tagFilter);
    return true;
  });

  const addNote = () => {
    if(!composerText.trim()) return;
    const newNote = {
      id:"n"+Date.now(), scope:composerScope, pinned:composerPin, vis:composerVis,
      author:"Layla Al-Fayez", initials:"LF", role:"Talent Acquisition Lead", color:"oklch(0.6 0.14 255)",
      ts:"Just now", tags:composerTag?[composerTag]:[], body:composerText,
      reactions:[], replies:[], showReplies:false,
    };
    setNotes(n=>[newNote,...n]);
    setComposerText(""); setComposerPin(false); setComposerTag("");
    toast&&toast("Note added");
  };

  const togglePin = (id) => setNotes(ns=>ns.map(n=>n.id===id?{...n,pinned:!n.pinned}:n));
  const deleteNote = (id) => setNotes(ns=>ns.filter(n=>n.id!==id));
  const saveEdit = (id) => { setNotes(ns=>ns.map(n=>n.id===id?{...n,body:editText}:n)); setEditId(null); toast&&toast("Note updated"); };
  const toggleReplies = (id) => setNotes(ns=>ns.map(n=>n.id===id?{...n,showReplies:!n.showReplies}:n));

  const ScopeChip = ({scope}) => scope==="candidate"
    ? <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,background:"var(--warning-soft)",color:"var(--warning)",border:"1px solid color-mix(in oklch,var(--warning) 25%,transparent)"}}><Icon name="users" size={11}/>Candidate-wide</span>
    : <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,background:"var(--surface-3)",color:"var(--text-3)",border:"1px solid var(--border)"}}><Icon name="file" size={11}/>This application</span>;

  const VisChip = ({vis}) => (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,background:"var(--surface-3)",color:"var(--text-3)",border:"1px solid var(--border)"}}>
      <Icon name={visIcons[vis]||"lock"} size={11}/>{visLabels[vis]||"Team only"}
    </span>
  );

  const NoteCard = ({note}) => {
    const isEditing = editId===note.id;
    return (
      <div className="card" style={{overflow:"hidden",borderInlineStart:note.pinned?"3px solid var(--warning)":"3px solid transparent"}}>
        <div className="card-pad" style={{paddingBottom:note.replies?.length&&note.showReplies?8:undefined}}>
          {/* Header */}
          <div className="flex" style={{alignItems:"flex-start",gap:10,marginBottom:10,flexWrap:"wrap"}}>
            <div className="avatar" style={{width:34,height:34,background:note.color,fontSize:12,flex:"0 0 auto",marginTop:1}}>{note.initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="flex" style={{alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontWeight:600,fontSize:13.5}}>{note.author}{note.author==="Layla Al-Fayez"?" (you)":""}</span>
                <span className="faint" style={{fontSize:12}}>{note.role}</span>
                <span className="faint" style={{fontSize:12}}>· {note.ts}</span>
              </div>
              <div className="flex" style={{gap:6,marginTop:5,flexWrap:"wrap"}}>
                {note.pinned && <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,background:"var(--warning-soft)",color:"var(--warning)"}}>📌 Pinned</span>}
                <ScopeChip scope={note.scope}/>
                <VisChip vis={note.vis}/>
                {note.tags.map(t=><span key={t} style={{cursor:"pointer",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,background:tagFilter===t?"var(--accent-soft)":"var(--surface-3)",color:tagFilter===t?"var(--accent-strong)":"var(--text-3)",border:"1px solid var(--border)"}} onClick={()=>setTagFilter(tagFilter===t?null:t)}>{t}</span>)}
              </div>
            </div>
            <Kebab items={[
              {icon:"edit",label:"Edit",onClick:()=>{setEditId(note.id);setEditText(note.body);}},
              {icon:note.pinned?"pin-off":"pin",label:note.pinned?"Unpin":"Pin to top",onClick:()=>togglePin(note.id)},
              {icon:"file",label:"Change scope"},
              {icon:"trash",label:"Delete",danger:true,onClick:()=>deleteNote(note.id)},
            ]}/>
          </div>
          {/* Body */}
          {isEditing ? (
            <div style={{marginBottom:10}}>
              <textarea className="textarea" rows={4} value={editText} onChange={e=>setEditText(e.target.value)} style={{fontSize:13.5}}/>
              <div className="flex" style={{gap:8,justifyContent:"flex-end",marginTop:8}}>
                <button className="btn btn-subtle btn-sm" onClick={()=>setEditId(null)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={()=>saveEdit(note.id)}>Save</button>
              </div>
            </div>
          ) : (
            <div style={{fontSize:13.5,lineHeight:1.7,color:"var(--text)",whiteSpace:"pre-wrap",marginBottom:10}}>
              {note.body.replace(/@(w+ w+)/g,(m,name)=>m).split(/(@w+ w+)/g).map((part,i)=>
                part.startsWith("@")
                  ? <strong key={i} style={{color:"var(--accent)"}}>{part}</strong>
                  : <span key={i}>{part}</span>
              )}
            </div>
          )}
          {/* Reactions + reply */}
          <div className="flex" style={{alignItems:"center",gap:14}}>
            {note.reactions.map((r,i)=>(
              <button key={i} className="flex" style={{alignItems:"center",gap:4,fontSize:13,fontWeight:600,color:"var(--text-2)",padding:"3px 8px",borderRadius:20,border:"1px solid var(--border)",background:"var(--surface-2)"}}>
                {r.emoji} {r.count}
              </button>
            ))}
            {note.replies?.length>0 && (
              <button className="muted flex" style={{alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,cursor:"pointer"}} onClick={()=>toggleReplies(note.id)}>
                <Icon name="message" size={13}/>{note.showReplies?"Hide":"Show"} {note.replies.length} {note.replies.length===1?"reply":"replies"}
              </button>
            )}
            <button className="muted flex" style={{alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,cursor:"pointer"}}>
              <Icon name="reply" size={13}/>Reply
            </button>
          </div>
        </div>
        {/* Replies */}
        {note.showReplies && note.replies?.map((r,i)=>(
          <div key={i} style={{marginInlineStart:44,padding:"10px 16px 12px",borderTop:"1px solid var(--border)",background:"var(--surface-2)",display:"flex",gap:10}}>
            <div style={{width:2,background:"var(--border-strong)",borderRadius:2,flex:"0 0 2px",alignSelf:"stretch",marginInlineEnd:10}}/>
            <div className="avatar" style={{width:28,height:28,background:r.color,fontSize:10,flex:"0 0 auto"}}>{r.initials}</div>
            <div style={{flex:1}}>
              <div className="flex" style={{alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontWeight:600,fontSize:13}}>{r.author}</span>
                <span className="faint" style={{fontSize:11.5}}>· {r.ts}</span>
              </div>
              <div style={{fontSize:13.5,lineHeight:1.65,color:"var(--text)"}}>{r.body}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const allNotes = [...filtered(pinned), ...filtered(regular)];
  const allTags = [...new Set(notes.flatMap(n=>n.tags))];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,padding:16}}>

      {/* TOOLBAR */}
      <div className="card card-pad flex" style={{alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{flex:1}}>
          <span style={{fontWeight:600,fontSize:15}}>Notes</span>
          <span className="muted" style={{fontSize:13,marginInlineStart:10}}>
            {notes.length} notes · {notes.filter(n=>n.scope==="candidate").length} candidate-wide · {notes.filter(n=>n.pinned).length} pinned
          </span>
        </div>
        {allTags.length>0 && (
          <div className="flex" style={{gap:6}}>
            {allTags.map(t=>(
              <button key={t} onClick={()=>setTagFilter(tagFilter===t?null:t)}
                className={"btn btn-sm"+(tagFilter===t?" btn-primary":" btn-subtle")} style={{fontSize:12,height:28}}>
                {t}
              </button>
            ))}
          </div>
        )}
        <select className="select" style={{height:34,fontSize:13}} value={filter} onChange={e=>{setFilter(e.target.value);setTagFilter(null);}}>
          <option value="all">All notes</option>
          <option value="pinned">Pinned</option>
          <option value="mine">Mine</option>
          <option value="candidate">Candidate-wide only</option>
          <option value="app">This application only</option>
        </select>
        <button className="btn btn-primary" onClick={()=>textareaRef.current?.focus()}><Icon name="plus" size={16}/>Add note</button>
      </div>

      {/* COMPOSER */}
      <div style={{border:"2px dashed var(--border)",borderRadius:"var(--r-lg)",padding:"14px 16px",background:"var(--surface)"}}>
        <div className="flex" style={{gap:12,alignItems:"flex-start"}}>
          <div className="avatar" style={{width:34,height:34,background:"oklch(0.6 0.14 255)",fontSize:12,flex:"0 0 auto",marginTop:2}}>LF</div>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:10,position:"relative"}}>
            <textarea ref={textareaRef} className="textarea" rows={3} value={composerText}
              onChange={e=>{
                setComposerText(e.target.value);
                const last=e.target.value.slice(-1);
                if(last==="@") setMentionOpen(true);
                else if(mentionOpen && last===" ") setMentionOpen(false);
              }}
              placeholder="Add a note about Ahmed… Type @ to mention a teammate"/>
            {mentionOpen && (
              <div style={{position:"absolute",top:"100%",insetInlineStart:0,zIndex:40,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",boxShadow:"var(--shadow-lg)",width:240,overflow:"hidden"}}>
                {team.map(member=>(
                  <div key={member} style={{padding:"9px 14px",cursor:"pointer",fontSize:13,fontWeight:500}} className="flex" style={{gap:8,alignItems:"center"}}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--accent-soft)"}
                    onMouseLeave={e=>e.currentTarget.style.background=""}
                    onClick={()=>{setComposerText(t=>t+""+member+" ");setMentionOpen(false);}}>
                    <Icon name="users" size={13} style={{color:"var(--text-3)"}}/>{member}
                  </div>
                ))}
              </div>
            )}
            {/* Scope + settings */}
            <div className="flex" style={{gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <div className="seg" style={{alignSelf:"flex-start"}}>
                <button className={composerScope==="app"?"on":""} onClick={()=>setComposerScope("app")} style={{fontSize:12,display:"flex",gap:5,alignItems:"center"}}><Icon name="file" size={12}/>This application</button>
                <button className={composerScope==="candidate"?"on":""} onClick={()=>setComposerScope("candidate")} style={{fontSize:12,display:"flex",gap:5,alignItems:"center"}}><Icon name="users" size={12}/>Candidate-wide</button>
              </div>
              <select className="select" style={{height:28,fontSize:12,paddingInline:8}} value={composerVis} onChange={e=>setComposerVis(e.target.value)}>
                <option value="team">🔒 Team only</option>
                <option value="hiring-team">👀 Hiring team</option>
                <option value="interviewers">Interviewers</option>
                <option value="all">All viewers</option>
              </select>
              <label className="flex" style={{alignItems:"center",gap:6,cursor:"pointer",fontSize:12.5,fontWeight:500}}>
                <div onClick={()=>setComposerPin(p=>!p)} style={{width:28,height:16,borderRadius:20,background:composerPin?"var(--warning)":"var(--border-strong)",position:"relative",cursor:"pointer",transition:"background .2s"}}>
                  <div style={{position:"absolute",top:2,insetInlineStart:composerPin?14:2,width:12,height:12,borderRadius:"50%",background:"#fff",transition:"inset-inline-start .2s"}}/>
                </div>
                Pin to top
              </label>
              <input className="input" style={{height:28,fontSize:12,flex:1,minWidth:100}} value={composerTag} onChange={e=>setComposerTag(e.target.value)} placeholder="Add tag…"/>
            </div>
            <div style={{fontSize:12,color:"var(--text-3)"}}>
              {composerScope==="app"
                ? "📋 Application note — visible only when viewing the Senior Frontend Engineer application."
                : "👤 Candidate note — visible across all of Ahmed's applications."}
            </div>
          </div>
          <div className="flex" style={{flexDirection:"column",gap:7,flex:"0 0 auto"}}>
            <button className="btn btn-primary btn-sm" disabled={!composerText.trim()} onClick={addNote}>Add note</button>
            <button className="btn btn-subtle btn-sm" onClick={()=>setComposerText("")}>Cancel</button>
          </div>
        </div>
      </div>

      {/* NOTES */}
      {allNotes.length===0
        ? <div style={{textAlign:"center",padding:"40px 20px",color:"var(--text-3)",fontSize:13}}>No notes match this filter.</div>
        : allNotes.map(n=><NoteCard key={n.id} note={n}/>)}
    </div>
  );
}

/* ── ACTIVITY ── */
function TabActivity({ candidate }) {
  return (
    <div className="tab-content">
      <div className="card card-pad">
        {candidate.activity.map((a,i)=>(
          <div key={i} className="flex" style={{gap:12}}>
            <div className="flex" style={{flexDirection:"column",alignItems:"center",flex:"0 0 auto"}}>
              <span style={{width:28,height:28,borderRadius:7,background:`color-mix(in oklch,${a.color} 14%,var(--surface))`,color:a.color,display:"grid",placeItems:"center"}}><Icon name={a.icon} size={14}/></span>
              {i<candidate.activity.length-1&&<span style={{width:2,flex:1,background:"var(--border)",minHeight:16}}/>}
            </div>
            <div style={{paddingBottom:i<candidate.activity.length-1?14:0,paddingTop:4}}>
              <div style={{fontSize:13.5}}>{a.text}</div>
              <div className="faint" style={{fontSize:12}}>{a.when}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyTabState({ icon, text }) {
  return (
    <div className="card card-pad" style={{textAlign:"center",padding:"44px 20px"}}>
      <span style={{width:48,height:48,borderRadius:12,background:"var(--surface-3)",color:"var(--text-3)",display:"grid",placeItems:"center",margin:"0 auto 12px"}}><Icon name={icon} size={24}/></span>
      <div className="muted" style={{fontSize:14}}>{text}</div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Full Profile Page
   ────────────────────────────────────────── */
function CandidateProfilePage({ candidateId, from, go, toast }) {
  const candidate = window.AHMED; // in real app: lookup by candidateId
  const { activeAppId, activeApp, switchApp, ctxToast } = useCandidateProfile(candidate);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [lens, setLens] = React.useState("Full");

  // Reset tab when app changes
  React.useEffect(() => { setActiveTab("overview"); }, [activeAppId]);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>

      {/* Breadcrumb */}
      <div className="crumbs" style={{padding:"12px 20px 0"}}>
        <a onClick={() => go(from || "pipeline")} style={{cursor:"pointer"}}>Pipeline</a>
        <span className="sep">›</span>
        <a style={{cursor:"pointer"}}>{activeApp.jobTitle}</a>
        <span className="sep">›</span>
        <span>{candidate.name}</span>
      </div>

      {/* Sticky shell */}
      <div className="profile-shell-sticky">
        <AppSwitcherRow candidate={candidate} activeApp={activeApp} activeAppId={activeAppId} switchApp={switchApp}/>
        <CandidateIdentityRow candidate={candidate} activeApp={activeApp} goBack={() => go(from||"pipeline")} lens={lens} setLens={setLens}/>
        <MiniPipeline app={activeApp}/>
      </div>

      {/* Scrollable body */}
      <div style={{flex:1,overflowY:"auto"}}>
        {/* Tab bar */}
        <div style={{background:"var(--surface)",borderBottom:"1px solid var(--border)"}}>
          <ProfileTabBar activeTab={activeTab} setActiveTab={setActiveTab} app={activeApp}/>
        </div>

        {/* Three-column layout */}
        <div className="profile-layout">
          <LeftRail candidate={candidate} activeApp={activeApp} activeAppId={activeAppId} switchApp={switchApp}/>
          <div className="profile-main">
            <ProfileTabContent tab={activeTab} candidate={candidate} app={activeApp}
            setActiveTab={setActiveTab}
            openSwitcher={() => {}}
            switchApp={switchApp}
            toast={toast}
            go={go} />
          </div>
          <RightRail candidate={candidate} activeApp={activeApp} go={go}/>
        </div>
      </div>

      {/* Context switch toast */}
      {ctxToast && <div className="ctx-toast">{ctxToast}</div>}
    </div>
  );
}

/* ── SCREENING CALL ── */
function TabScreening({ go, toast }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 16 }}>
      <div className="card" style={{ borderInlineStart: "3px solid var(--ai)" }}>
        <div className="card-head">
          <Icon name="phone" size={15} style={{ color: "var(--ai)" }} /><h3>AI Screening Call</h3>
          <span className="spacer" style={{ flex: 1 }} />
          <span className="badge badge-success" style={{ height: 22 }}><span className="b-dot" />Completed</span>
        </div>
        <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="flex" style={{ gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <ScoreRing value={87} size={92} stroke={8} color="var(--ai)" sub="AI CONF" />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--success)" }} />
                <span style={{ fontWeight: 600, fontSize: 16 }}>Advance to technical interview</span>
              </div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>16 min 42 sec · Browser · English · Completed June 9, 2026 · 5 of 5 goals covered.</div>
            </div>
          </div>
          <div className="flex" style={{ gap: 16, flexWrap: "wrap" }}>
            <MiniMetric label="React expertise" value="9/10" icon="check" good />
            <MiniMetric label="Leadership" value="8/10" icon="check" good />
            <MiniMetric label="Fintech motivation" value="9/10" icon="check" good />
            <MiniMetric label="Salary" value="Unclear" icon="flag" />
          </div>
          <div className="warn-bar" style={{ padding: "10px 13px" }}>
            <span className="wb-ico"><Icon name="alert" size={15} /></span>
            <span className="wb-text" style={{ fontSize: 12.5 }}>Salary expectation was vague — flagged for your follow-up. AI evaluation is a draft until you confirm.</span>
          </div>
          <div className="flex" style={{ gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => go && go("screening-review")}><Icon name="eye" size={14} />Open full review</button>
            <button className="btn btn-ghost btn-sm" onClick={() => toast && toast("Opening transcript…")}><Icon name="doc" size={14} />Transcript</button>
            <button className="btn btn-ghost btn-sm" onClick={() => toast && toast("Playing recording…")}><Icon name="play" size={14} />Recording</button>
          </div>
        </div>
      </div>
    </div>
  );
}


export { CandidateProfilePage, ProfileTabBar, ProfileTabContent, TabOverview, TabCV, TabAssessment, TranscriptPanel, TabVideo, TabEvaluations, AddInterviewerModal, TabEmails, ThreadRow, TabNotes, TabActivity, EmptyTabState, TabScreening };
