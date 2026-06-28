import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'
import { Switch } from './job-creation-app'

/* Job Creation — Steps 3 & 4 */

/* ── STEP 3: EVALUATION ── */
function Step3({ data, setData }) {
  const D = window.JC;
  const [skills, setSkills] = React.useState(data.skills || D.initSkills.map(s=>({...s})));
  const [criteria, setCriteria] = React.useState(data.criteria || D.initCriteria.map(c=>({...c})));
  const [weights, setWeights] = React.useState(data.weights || D.initWeights.map(w=>({...w})));
  const [tiers, setTiers] = React.useState(data.tiers || {weak:40,possible:60,good:80,strong:81});
  const [instructions, setInstructions] = React.useState(data.instructions || D.screeningInstructions);
  const [aiScreen, setAiScreen] = React.useState(false);
  const [screenSrc, setScreenSrc] = React.useState("library");
  const [screenAgent, setScreenAgent] = React.useState("Connect AI Senior FE Screen");
  const [screenCustomize, setScreenCustomize] = React.useState(true);
  const [linkModal, setLinkModal] = React.useState(false);

  const sync = (s,cr,w,t,ins) => setData(d=>({...d,skills:s,criteria:cr,weights:w,tiers:t,instructions:ins}));

  const setSkillCls = (id,cls) => { const n=skills.map(s=>s.id===id?{...s,cls}:s); setSkills(n); sync(n,criteria,weights,tiers,instructions); };
  const setSkillProf = (id,prof) => { const n=skills.map(s=>s.id===id?{...s,prof}:s); setSkills(n); sync(n,criteria,weights,tiers,instructions); };
  const removeSkill = (id) => { const n=skills.filter(s=>s.id!==id); setSkills(n); sync(n,criteria,weights,tiers,instructions); };
  const addSkill = () => { const n=[...skills,{id:"s"+(Date.now()),name:"New skill",cat:"Technical",prof:"Intermediate",cls:"nice"}]; setSkills(n); sync(n,criteria,weights,tiers,instructions); };

  const setCritWeight = (id,w) => { const n=criteria.map(c=>c.id===id?{...c,weight:+w}:c); setCriteria(n); sync(skills,n,weights,tiers,instructions); };
  const removeCrit = (id) => { const n=criteria.filter(c=>c.id!==id); setCriteria(n); sync(skills,n,weights,tiers,instructions); };

  const rebalance = (key,val) => {
    const others = weights.filter(w=>w.key!==key);
    const total = others.reduce((s,w)=>s+w.pct,0);
    const ratio = (100-val)/total;
    const n = weights.map(w=>w.key===key?{...w,pct:val}:{...w,pct:Math.round(w.pct*ratio)});
    // fix rounding
    const sum = n.reduce((s,w)=>s+w.pct,0);
    if(sum!==100) n[n.length-1].pct+=(100-sum);
    setWeights(n); sync(skills,criteria,n,tiers,instructions);
  };

  const catColors = {Technical:"badge-info",Soft:"badge-accent",Domain:"badge-purple",Certification:"badge-warning"};
  const profOptions = ["Beginner","Intermediate","Advanced","Expert","n/a"];

  return (
    <div>
      <h1 className="wiz-heading">Define what "good" looks like</h1>
      <p className="wiz-sub">We've extracted skills and criteria from your JD. Adjust weights and add anything specific.</p>

      <div className="ai-banner">
        <Icon name="sparkles" size={15} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
        <span style={{fontSize:13,fontWeight:500}}>✦ AI extracted these from your JD. Edit, remove, or add as needed.</span>
      </div>

      {/* Skills */}
      <div className="wiz-card" style={{padding:24,marginBottom:16}}>
        <div className="flex" style={{alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:16,flex:1}}>Required skills</div>
          <button className="btn btn-subtle btn-sm" onClick={addSkill}><Icon name="plus" size={14}/>Add skill</button>
        </div>
        <div className="skills-list">
          {skills.map(s=>(
            <div key={s.id} className="skill-row">
              <input className="skill-name input" value={s.name} placeholder="Skill name"
                onChange={e=>{const n=skills.map(x=>x.id===s.id?{...x,name:e.target.value}:x);setSkills(n);sync(n,criteria,weights,tiers,instructions);}}
                style={{border:"1px solid transparent",borderRadius:"var(--r-sm)",height:32,padding:"0 8px",fontSize:13.5,fontWeight:600,background:"transparent"}}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor="transparent"}
              />
              <select className="select" value={s.cat} onChange={e=>{const n=skills.map(x=>x.id===s.id?{...x,cat:e.target.value}:x);setSkills(n);sync(n,criteria,weights,tiers,instructions);}} style={{height:30,fontSize:12,width:"auto",minWidth:110}}>
                {["Technical","Soft","Domain","Certification"].map(c=><option key={c}>{c}</option>)}
              </select>
              <select className="select skill-prof" value={s.prof} onChange={e=>setSkillProf(s.id,e.target.value)} style={{height:30,fontSize:12.5}}>
                {profOptions.map(p=><option key={p}>{p}</option>)}
              </select>
              <div className="class-seg">
                <button className={s.cls==="must"?"must":""} onClick={()=>setSkillCls(s.id,"must")}>Must-have</button>
                <button className={s.cls==="nice"?"nice":""} onClick={()=>setSkillCls(s.id,"nice")}>Nice-to-have</button>
                <button className={s.cls==="deal"?"deal":""} onClick={()=>setSkillCls(s.id,"deal")}>Dealbreaker</button>
              </div>
              <button className="skill-remove icon-btn btn-sm" style={{color:"var(--danger)"}} onClick={()=>removeSkill(s.id)}><Icon name="trash" size={14}/></button>
            </div>
          ))}
        </div>
        <button className="btn btn-subtle btn-sm" style={{marginTop:12}} onClick={addSkill}><Icon name="plus" size={14}/>Add custom skill</button>
      </div>

      {/* Custom criteria */}
      <div className="wiz-card" style={{padding:24,marginBottom:16}}>
        {/* Inline header + total */}
        {(()=>{
          const critTotal=criteria.reduce((s,c)=>s+c.weight,0);
          const over=critTotal>100, done=critTotal===100;
          return (
            <div className="flex" style={{alignItems:"center",gap:12,marginBottom:14,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:16}}>Custom criteria weights</div>
                <div className="muted" style={{fontSize:13,marginTop:2}}>Beyond skills — specific things you want to evaluate</div>
              </div>
              <div className="flex" style={{alignItems:"center",gap:10}}>
                <div style={{width:120,height:7,borderRadius:20,background:"var(--surface-3)",overflow:"hidden"}}>
                  <div style={{height:"100%",width:Math.min(critTotal,100)+"%",background:over?"var(--danger)":done?"var(--success)":"var(--accent)",borderRadius:20,transition:"width .4s ease"}}/>
                </div>
                <span className="mono" style={{fontSize:15,fontWeight:700,minWidth:44,color:over?"var(--danger)":done?"var(--success)":"var(--accent)"}}>{critTotal}%</span>
                {over&&<span className="badge badge-danger" style={{height:21}}><Icon name="alert" size={11}/>Over</span>}
                {done&&<span className="badge badge-success" style={{height:21}}><Icon name="check" size={11}/>100%</span>}
                {!over&&!done&&critTotal>0&&<span className="badge badge-warning" style={{height:21}}>{100-critTotal}% left</span>}
              </div>
            </div>
          );
        })()}
        <div className="ai-banner" style={{marginBottom:16,padding:"9px 12px"}}>
          <Icon name="sparkles" size={13} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
          <span style={{fontSize:12.5}}>✦ AI suggested 3 criteria based on your JD</span>
        </div>
        {criteria.map(c=>(
          <div key={c.id} className="crit-card">
            <div className="crit-head">
              <input className="input" value={c.title} onChange={e=>setCriteria(cr=>cr.map(x=>x.id===c.id?{...x,title:e.target.value}:x))} style={{flex:1,height:36}} />
              <button className="icon-btn btn-sm" style={{color:"var(--danger)"}} onClick={()=>removeCrit(c.id)}><Icon name="trash" size={14}/></button>
            </div>
            <div className="flex" style={{alignItems:"center",gap:10}}>
              <span className="faint" style={{fontSize:12.5,fontWeight:600}}>Weight:</span>
              <input type="range" min={0} max={30} value={c.weight} onChange={e=>setCritWeight(c.id,e.target.value)}
                className="wt-slider" style={{"--pct":(c.weight/30*100)+"%"}} />
              <span className="mono" style={{fontSize:13,fontWeight:700,color:"var(--accent)",minWidth:36}}>{c.weight}%</span>
            </div>
          </div>
        ))}
        <button className="btn btn-subtle btn-sm" onClick={()=>setCriteria([...criteria,{id:"c"+(Date.now()),title:"New criterion",weight:5}])}>
          <Icon name="plus" size={14}/>Add custom criterion
        </button>
      </div>

      {/* Weights */}
      <div className="wiz-card" style={{padding:24,marginBottom:16}}>
        <div className="flex" style={{alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:16,flex:1}}>Criteria weights</div>
          <a className="muted" style={{fontSize:12.5,fontWeight:600,cursor:"pointer"}} onClick={()=>setWeights(D.initWeights.map(w=>({...w})))}>Reset to AI defaults</a>
        </div>
        {/* Stacked bar */}
        <div className="weight-bar" style={{marginBottom:20}}>
          {weights.map((w,i)=>(<div key={w.key} className="weight-seg" style={{width:w.pct+"%",background:D.weightColors[i]}} />))}
        </div>
        {weights.map((w,i)=>(
          <div key={w.key} className="wt-row">
            <span className="wt-label"><span style={{display:"inline-block",width:10,height:10,borderRadius:3,background:D.weightColors[i],marginInlineEnd:8,verticalAlign:-1}}/>{w.label}</span>
            <input type="range" min={0} max={80} value={w.pct} onChange={e=>rebalance(w.key,+e.target.value)}
              className="wt-slider" style={{"--pct":(w.pct/80*100)+"%"}} />
            <span className="wt-pct">{w.pct}%</span>
          </div>
        ))}
        <div style={{paddingTop:10,borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",fontSize:13.5,fontWeight:700}}>
          <span>Total</span><span className="mono" style={{color:weights.reduce((s,w)=>s+w.pct,0)===100?"var(--success)":"var(--danger)"}}>
            {weights.reduce((s,w)=>s+w.pct,0)}%
          </span>
        </div>
        <div className="hint" style={{marginTop:6}}>Adjust sliders to weight what matters most. Sliders auto-balance to 100%.</div>
      </div>

      {/* Tier thresholds */}
      <div className="wiz-card" style={{padding:24,marginBottom:16}}>
        <div className="flex" style={{alignItems:"center",marginBottom:4}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:16}}>Match tiers</div>
            <div className="muted" style={{fontSize:13,marginTop:2}}>How candidates are categorized based on their score</div>
          </div>
          <span className="badge badge-ai" style={{height:21}}><Icon name="sparkles" size={11} fill/>AI suggested</span>
        </div>

        {/* Visual bar */}
        <div className="tier-bar" style={{marginTop:16,marginBottom:12}}>
          <div className="tier-weak" style={{flex:`0 0 ${tiers.weak}%`}}/>
          <div className="tier-possible" style={{flex:`0 0 ${tiers.possible-tiers.weak}%`}}/>
          <div className="tier-good" style={{flex:`0 0 ${tiers.good-tiers.possible}%`}}/>
          <div className="tier-strong" style={{flex:1}}/>
        </div>

        {/* Editable threshold inputs */}
        <div className="grid" style={{gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
          {[
            {label:"Weak",color:"oklch(0.68 0.09 20)",bg:"oklch(0.96 0.03 20)",key:"weak",desc:"0 –",editable:false},
            {label:"Possible",color:"oklch(0.7 0.1 75)",bg:"oklch(0.96 0.04 75)",key:"possible",desc:"up to"},
            {label:"Good",color:"oklch(0.65 0.12 255)",bg:"oklch(0.95 0.04 255)",key:"good",desc:"up to"},
            {label:"Strong",color:"oklch(0.62 0.13 152)",bg:"oklch(0.95 0.05 152)",key:"strong",desc:"81 – 100",editable:false},
          ].map((t,i)=>(
            <div key={t.key} style={{background:t.bg,borderRadius:"var(--r-md)",padding:"12px 14px",border:`1px solid color-mix(in oklch,${t.color} 35%,transparent)`}}>
              <div style={{fontWeight:600,fontSize:13,color:t.color,marginBottom:8}}>{t.label}</div>
              {t.key==="weak" && (
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span className="muted" style={{fontSize:12}}>0 –</span>
                  <input className="input mono" type="number" min={0} max={tiers.possible-1} value={tiers.weak}
                    onChange={e=>{const v=Math.min(+e.target.value,tiers.possible-1);setTiers({...tiers,weak:v});sync(skills,criteria,weights,{...tiers,weak:v},instructions);}}
                    style={{width:60,height:32,fontSize:13,textAlign:"center"}}/>
                </div>
              )}
              {t.key==="possible" && (
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span className="muted" style={{fontSize:12}}>{tiers.weak+1} –</span>
                  <input className="input mono" type="number" min={tiers.weak+1} max={tiers.good-1} value={tiers.possible}
                    onChange={e=>{const v=Math.min(Math.max(+e.target.value,tiers.weak+1),tiers.good-1);setTiers({...tiers,possible:v});sync(skills,criteria,weights,{...tiers,possible:v},instructions);}}
                    style={{width:60,height:32,fontSize:13,textAlign:"center"}}/>
                </div>
              )}
              {t.key==="good" && (
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span className="muted" style={{fontSize:12}}>{tiers.possible+1} –</span>
                  <input className="input mono" type="number" min={tiers.possible+1} max={99} value={tiers.good}
                    onChange={e=>{const v=Math.min(Math.max(+e.target.value,tiers.possible+1),99);setTiers({...tiers,good:v});sync(skills,criteria,weights,{...tiers,good:v},instructions);}}
                    style={{width:60,height:32,fontSize:13,textAlign:"center"}}/>
                </div>
              )}
              {t.key==="strong" && (
                <div className="mono" style={{fontSize:18,fontWeight:700,color:t.color}}>{tiers.good+1}–100</div>
              )}
            </div>
          ))}
        </div>

        <div className="hint">Candidates scoring above <strong>{tiers.good+1}</strong> are auto-flagged for priority review. Edit any threshold above.</div>
      </div>

      {/* Screening instructions */}
      <div className="wiz-card" style={{padding:24}}>
        <div style={{fontWeight:600,fontSize:16,marginBottom:4}}>Custom screening instructions</div>
        <div className="muted" style={{fontSize:13,marginBottom:14}}>Extra guidance for the AI when reviewing candidates</div>
        <div className="ai-banner" style={{marginBottom:14,padding:"9px 12px"}}>
          <Icon name="sparkles" size={13} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
          <span style={{fontSize:12.5}}>✦ AI drafted these based on your JD and criteria</span>
        </div>
        <textarea className="textarea" rows={6} value={instructions} onChange={e=>{setInstructions(e.target.value);setData(d=>({...d,instructions:e.target.value}));}} />
        <a className="muted flex" style={{alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,marginTop:8,cursor:"pointer"}} onClick={()=>setInstructions(D.screeningInstructions)}>
          <Icon name="refresh" size={13}/>Regenerate
        </a>
      </div>

      {/* AI Screening Call */}
      <div className="wiz-card" style={{ padding: 0, marginTop: 16, borderInlineStart: "3px solid var(--ai)", overflow: "hidden" }}>
        <div className="flex" style={{ alignItems: "flex-start", gap: 12, padding: 24, paddingBottom: aiScreen ? 14 : 24 }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--ai-soft)", color: "var(--ai)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="phone" size={17} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>AI Screening Call</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>Optionally enable AI-conducted screening before candidates reach your team. Saves recruiters 3–5 hours per role.</div>
          </div>
          <Switch on={aiScreen} onChange={setAiScreen} />
        </div>
        {aiScreen && (
          <div style={{ padding: "0 24px 24px" }}>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                ["generate", "sparkles", "Generate one for this job", "AI drafts an agent from your JD, rubric, and team context. Recommended for new teams.", true],
                ["library", "doc", "Pick from your library", "Choose an existing agent you've already built or used.", false],
                ["starter", "grid", "Start from a starter", "Pick a Connect AI starter template and customize.", false],
              ].map(([v, ic, t, d, ai]) => (
                <div key={v} onClick={() => setScreenSrc(v)} className="card" style={{ padding: 14, cursor: "pointer", border: "1.5px solid " + (screenSrc === v ? "var(--accent)" : "var(--border)"), background: screenSrc === v ? "var(--accent-soft)" : "transparent", boxShadow: "none" }}>
                  <div className="flex" style={{ alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid " + (screenSrc === v ? "var(--accent)" : "var(--border-strong)"), background: screenSrc === v ? "var(--accent)" : "transparent", display: "grid", placeItems: "center", flex: "0 0 auto" }}>{screenSrc === v && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}</span>
                    <Icon name={ic} size={14} fill={ic === "sparkles"} style={{ color: ai ? "var(--ai)" : "var(--text-2)" }} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div>
                  <div className="faint" style={{ fontSize: 11.5, lineHeight: 1.5, marginTop: 3 }}>{d}</div>
                </div>
              ))}
            </div>
            {screenSrc === "library" && (
              <div className="field" style={{ marginTop: 14 }}><label>Choose an agent</label>
                <select className="select" value={screenAgent} onChange={e => setScreenAgent(e.target.value)}>
                  <option>Connect AI Senior FE Screen — Recommended (matches role family)</option>
                  <option>Engineering Leadership Screen</option>
                  <option>Generic Knockout Screen</option>
                </select>
              </div>
            )}
            <div className="hint" style={{ marginTop: 12 }}>You can also configure this later from the Workflow editor.</div>
            <label className="flex" style={{ alignItems: "center", gap: 10, marginTop: 12, cursor: "pointer" }} onClick={() => setScreenCustomize(c => !c)}>
              <Switch on={screenCustomize} onChange={setScreenCustomize} />
              <span style={{ fontSize: 13 }}><b>Customize for this job</b><div className="faint" style={{ fontSize: 11.5, marginTop: 2 }}>Add job-specific knockout questions or knowledge base entries. Recommended for most jobs.</div></span>
            </label>
            {screenCustomize && (
              <button className="btn btn-ai btn-sm" style={{ marginTop: 12 }} onClick={() => setLinkModal(true)}><Icon name="sparkles" size={14} fill />Set job-specific overrides</button>
            )}
          </div>
        )}
      </div>

      {linkModal && <AgentLinkageModal entry="wizard" agentName={screenAgent} onClose={() => setLinkModal(false)} onConfirm={() => setLinkModal(false)} toast={() => {}} />}
    </div>
  );
}

/* ── STEP 4: TEAM & LAUNCH ── */
function Step4({ data, setData }) {
  const D = window.JC;
  const [team, setTeam] = React.useState(data.team || D.teamMembers.map(t=>({...t})));
  const [addingMember, setAddingMember] = React.useState(false);
  const [currency, setCurrency] = React.useState(data.currency || "SAR");
  const [salMin, setSalMin] = React.useState(data.salMin || "20,000");
  const [salMax, setSalMax] = React.useState(data.salMax || "30,000");
  const [period, setPeriod] = React.useState(data.period || "per month");
  const [dist, setDist] = React.useState(data.dist || { publicApply:true, linkedin:true, referral:false, jobBoards:false, internal:false });
  const [linkedin, setLinkedin] = React.useState(D.linkedInPages[0]);
  const [refBonus, setRefBonus] = React.useState("");

  const sync = (tm,c,mn,mx,pd,dt) => setData(d=>({...d,team:tm,currency:c,salMin:mn,salMax:mx,period:pd,dist:dt}));

  const setRole = (id,r) => { const n=team.map(t=>t.id===id?{...t,jobRole:r}:t); setTeam(n); sync(n,currency,salMin,salMax,period,dist); };
  const removeTeam = (id) => { const n=team.filter(t=>t.id!==id); setTeam(n); sync(n,currency,salMin,salMax,period,dist); };
  const toggleDist = (k) => { const n={...dist,[k]:!dist[k]}; setDist(n); sync(team,currency,salMin,salMax,period,n); };

  const roleOpts = ["Recruiter","Hiring Manager","Interviewer","Approver","Observer"];

  return (
    <div>
      <h1 className="wiz-heading">Who's hiring and where to find candidates</h1>
      <p className="wiz-sub">Set up your hiring team, compensation, and distribution.</p>

      {/* Hiring team */}
      <div className="wiz-card" style={{padding:24,marginBottom:16}}>
        <div className="flex" style={{alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:16,flex:1}}>Hiring team</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>setAddingMember(true)}><Icon name="plus" size={14}/>Add team member</button>
        </div>
        {team.map(m=>(
          <div key={m.id} className="team-row">
            <div className="avatar" style={{width:38,height:38,background:m.avatar,fontSize:14,flex:"0 0 auto"}}>{m.initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:13.5}}>{m.name}</div>
              <div className="faint" style={{fontSize:12}}>{m.role}</div>
            </div>
            <select className="select" value={m.jobRole} onChange={e=>setRole(m.id,e.target.value)} style={{width:"auto",minWidth:150,height:34,fontSize:13}}>
              {roleOpts.map(r=><option key={r}>{r}</option>)}
            </select>
            <span className="badge badge-neutral" style={{height:22,fontSize:11.5,minWidth:110}}>{m.access}</span>
            <button className="icon-btn btn-sm" style={{color:"var(--danger)"}} onClick={()=>removeTeam(m.id)}><Icon name="x" size={15}/></button>
          </div>
        ))}
      </div>

      {addingMember && <AddMemberModal onClose={()=>setAddingMember(false)} onAdd={m=>{const n=[...team,m];setTeam(n);sync(n,currency,salMin,salMax,period,dist);setAddingMember(false);}} />}

      {/* Compensation */}
      <div className="wiz-card" style={{padding:24,marginBottom:16}}>
        <div className="flex" style={{alignItems:"center",marginBottom:4}}>
          <div className="flex" style={{alignItems:"center",gap:8}}>
            <div style={{fontWeight:600,fontSize:16}}>Salary range</div>
            <button className="icon-btn btn-sm has-tip" data-tip="Salary is private — never shown publicly or to candidates." style={{color:"var(--text-3)"}}><Icon name="lock" size={15}/></button>
          </div>
        </div>
        <div className="muted" style={{fontSize:13,marginBottom:16}}>Stored privately. Used by AI to calibrate offers and not shown publicly.</div>
        <div className="flex" style={{gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <select className="select" value={currency} onChange={e=>setCurrency(e.target.value)} style={{width:"auto",minWidth:90,height:40}}>
            {D.currencies.map(c=><option key={c}>{c}</option>)}
          </select>
          <div className="field" style={{flex:1}}>
            <input className="input mono" placeholder="Min" value={salMin} onChange={e=>setSalMin(e.target.value)} style={{height:40}} />
          </div>
          <span className="faint">to</span>
          <div className="field" style={{flex:1}}>
            <input className="input mono" placeholder="Max" value={salMax} onChange={e=>setSalMax(e.target.value)} style={{height:40}} />
          </div>
          <select className="select" value={period} onChange={e=>setPeriod(e.target.value)} style={{width:"auto",minWidth:130,height:40}}>
            {D.periods.map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Distribution */}
      <div className="wiz-card" style={{padding:24}}>
        <div style={{fontWeight:600,fontSize:16,marginBottom:16}}>Where to publish</div>

        <DistCard icon="globe" title="Public apply page" desc="Candidates can apply via your branded apply page." on={true} locked>
          <a className="muted flex" style={{alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,cursor:"pointer"}}>
            <Icon name="link" size={13}/>connect-ai.com/jobs/senior-frontend-engineer
          </a>
        </DistCard>

        <DistCard icon="link" title="Share to LinkedIn" desc="Auto-share a post when the job is published." on={dist.linkedin} onChange={()=>toggleDist("linkedin")}>
          {dist.linkedin&&(
            <div className="flex" style={{gap:10,alignItems:"center"}}>
              <Icon name="globe" size={14} style={{color:"var(--text-3)"}}/>
              <select className="select" value={linkedin} onChange={e=>setLinkedin(e.target.value)} style={{height:34,fontSize:13,width:"auto",minWidth:200}}>
                {D.linkedInPages.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
          )}
        </DistCard>

        <DistCard icon="users" title="Internal referral program" desc="Notify employees about this open role via email." on={dist.referral} onChange={()=>toggleDist("referral")}>
          {dist.referral&&(
            <div className="two-col">
              <div className="field"><label>Referral bonus</label><div className="flex" style={{gap:8}}><input className="input mono" placeholder="e.g. 3,000" value={refBonus} onChange={e=>setRefBonus(e.target.value)}/><span className="faint" style={{alignSelf:"center",fontSize:13}}>SAR</span></div></div>
              <div className="field"><label>Notify departments</label><select className="select" multiple style={{height:80}}>{D.departments.map(d=><option key={d}>{d}</option>)}</select></div>
            </div>
          )}
        </DistCard>

        <DistCard icon="database" title="Job boards (3rd party)" desc="Cross-post to Indeed, Bayt, Wuzzuf." on={dist.jobBoards} onChange={()=>toggleDist("jobBoards")} soon />

        <DistCard icon="building" title="Internal mobility page" desc="Visible to existing employees considering a move." on={dist.internal} onChange={()=>toggleDist("internal")} />
      </div>
    </div>
  );
}

function DistCard({ icon, title, desc, on, onChange, locked, soon, children }) {
  return (
    <div className="dist-card">
      <div className="dist-head" style={{cursor:locked?"default":"pointer"}} onClick={locked?null:onChange}>
        <Icon name={icon} size={18} style={{color:"var(--text-2)",flex:"0 0 auto"}}/>
        <div style={{flex:1}}>
          <div className="flex" style={{alignItems:"center",gap:8}}>
            <span style={{fontWeight:600,fontSize:13.5}}>{title}</span>
            {locked&&<span className="badge badge-success" style={{height:19}}>Always on</span>}
            {soon&&<span className="badge badge-neutral" style={{height:19}}>Coming soon</span>}
          </div>
          <div className="faint" style={{fontSize:12.5,marginTop:1}}>{desc}</div>
        </div>
        {!locked&&!soon&&<Switch on={on} onChange={onChange}/>}
      </div>
      {on&&children&&<div className="dist-body">{children}</div>}
    </div>
  );
}


/* ── Add team member modal ── */
const SUGGESTED_PEOPLE = [
  { name:"Ahmed Hassan",      role:"Recruiter",         initials:"AH", avatar:"oklch(0.6 0.14 255)" },
  { name:"Hanan Al-Dossari",  role:"HR Business Partner",initials:"ح", avatar:"oklch(0.6 0.14 20)" },
  { name:"Tariq Al-Harbi",    role:"Engineering Manager",initials:"ط", avatar:"oklch(0.6 0.14 150)" },
  { name:"Maha Al-Shehri",    role:"People Operations",  initials:"م", avatar:"oklch(0.6 0.14 295)" },
  { name:"Salem Al-Ghamdi",   role:"Hiring Manager",     initials:"س", avatar:"oklch(0.6 0.14 60)" },
  { name:"Noura Al-Qahtani",  role:"Engineering Lead",   initials:"ن", avatar:"oklch(0.6 0.14 330)" },
  { name:"Faisal Al-Otaibi",  role:"Product Director",   initials:"ف", avatar:"oklch(0.6 0.14 245)" },
];

function AddMemberModal({ onClose, onAdd }) {
  const D = window.JC;
  const [q, setQ] = React.useState("");
  const [selPerson, setSelPerson] = React.useState(null);
  const [jobRole, setJobRole] = React.useState("Interviewer");
  const [customName, setCustomName] = React.useState("");
  const [useCustom, setUseCustom] = React.useState(false);
  const roleOpts = ["Recruiter","Hiring Manager","Interviewer","Approver","Observer"];
  const accMap = {"Recruiter":"Full access","Hiring Manager":"Full access","Interviewer":"Interview only","Approver":"Browse + interview","Observer":"Read only"};

  const filtered = SUGGESTED_PEOPLE.filter(p =>
    !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.role.toLowerCase().includes(q.toLowerCase())
  );

  const handleAdd = () => {
    const name = useCustom ? customName : (selPerson ? selPerson.name : customName);
    if (!name.trim()) return;
    const base = selPerson || { initials: name.trim()[0].toUpperCase(), avatar:"oklch(0.6 0.1 200)" };
    onAdd({ id:"m"+Date.now(), name, role: selPerson?.role || "Team member", initials: base.initials, avatar: base.avatar, jobRole, access: accMap[jobRole] || "Read only" });
  };

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{maxWidth:500}} onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <span style={{width:30,height:30,borderRadius:8,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="users" size={17}/></span>
          <h3 style={{fontSize:16,fontWeight:600}}>Add team member</h3>
          <div className="spacer" style={{flex:1}}/>
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18}/></button>
        </div>

        <div className="modal-body" style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Search */}
          <div className="field">
            <label>Search by name or role</label>
            <div className="searchbar" style={{height:40}}>
              <Icon name="search" size={16}/>
              <input autoFocus value={q} onChange={e=>{setQ(e.target.value);setUseCustom(false);setSelPerson(null);}} placeholder="e.g. Khalid or Engineering Manager"/>
            </div>
          </div>

          {/* Suggestions */}
          <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:220,overflowY:"auto"}}>
            {filtered.length === 0 && q && (
              <div className="faint" style={{fontSize:13,textAlign:"center",padding:"12px 0"}}>
                No match — <a style={{color:"var(--accent)",fontWeight:600,cursor:"pointer"}} onClick={()=>setUseCustom(true)}>add "{q}" as a new member</a>
              </div>
            )}
            {filtered.map((p,i)=>(
              <div key={i} className="flex" style={{alignItems:"center",gap:12,padding:"9px 12px",borderRadius:"var(--r-md)",cursor:"pointer",border:"1.5px solid "+(selPerson===p?"var(--accent)":"var(--border)"),background:selPerson===p?"var(--accent-soft)":"var(--surface)",transition:"var(--t-fast)"}}
                onClick={()=>{setSelPerson(p);setUseCustom(false);}}>
                <div className="avatar" style={{width:36,height:36,background:p.avatar,fontSize:13,flex:"0 0 auto"}}>{p.initials}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13.5}}>{p.name}</div>
                  <div className="faint" style={{fontSize:12}}>{p.role}</div>
                </div>
                {selPerson===p && <Icon name="check" size={16} style={{color:"var(--accent)"}}/>}
              </div>
            ))}
          </div>

          {/* Custom entry */}
          {(useCustom || (!selPerson && q.length > 0 && filtered.length > 0)) && (
            <div className="field">
              <label>Or enter a name manually</label>
              <input className="input" value={useCustom?customName:q} onChange={e=>setCustomName(e.target.value)} placeholder="Full name"/>
            </div>
          )}

          {/* Role picker */}
          {(selPerson || useCustom || customName) && (
            <div className="field">
              <label>Role on this job <span style={{color:"var(--danger)"}}>*</span></label>
              <select className="select" value={jobRole} onChange={e=>setJobRole(e.target.value)}>
                {roleOpts.map(r=><option key={r}>{r}</option>)}
              </select>
              <div className="hint">Access level: <strong>{accMap[jobRole]}</strong></div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          <div className="spacer" style={{flex:1}}/>
          <button className="btn btn-subtle" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!selPerson && !customName.trim() && !q.trim()} onClick={handleAdd}>
            <Icon name="plus" size={16}/>Add member
          </button>
        </div>
      </div>
    </div>
  );
}

export { Step3, Step4, DistCard, AddMemberModal, SUGGESTED_PEOPLE };
