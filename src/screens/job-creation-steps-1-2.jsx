import { useApp, Avatar, ScoreRing, MatchPill, Bar, Stat, Sparkline, Donut, VBars, AvatarStack, StageBadge } from '../lib/ui'
import { Icon } from '../lib/icons'

/* Job Creation — Steps 1 & 2 */

/* ── STEP 1: JOB BASICS ── */
function Step1({ data, setData }) {
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const D = window.JC;
  const [wfPanel, setWfPanel] = React.useState(false);

  return (
    <div>
      <h1 className="wiz-heading">Let's set up your job</h1>
      <p className="wiz-sub">Start with the essentials. You can change everything later.</p>

      {/* Role */}
      <div className="wiz-group">
        <div className="wiz-group-label">Role</div>
        <div className="field" style={{marginBottom:14}}>
          <label>Job title <span style={{color:"var(--danger)"}}>*</span></label>
          <input className="input input-lg" placeholder="e.g. Senior Frontend Engineer" value={data.title||""} onChange={e=>set("title",e.target.value)} />
        </div>
        <div className="two-col" style={{marginBottom:14}}>
          <div className="field">
            <label>Department <span style={{color:"var(--danger)"}}>*</span></label>
            <select className="select" value={data.dept||""} onChange={e=>set("dept",e.target.value)}>
              <option value="">Select department…</option>
              {D.departments.map(d=><option key={d}>{d}</option>)}
              <option value="__new">+ Add new department</option>
            </select>
          </div>
          <div className="field">
            <label>Number of openings</label>
            <input className="input mono" type="number" min="1" value={data.openings||1} onChange={e=>set("openings",e.target.value)} />
            <div className="hint">How many people are you hiring for this role?</div>
          </div>
        </div>
      </div>

      {/* Type & seniority */}
      <div className="wiz-group">
        <div className="wiz-group-label">Type & seniority</div>
        <div className="two-col" style={{marginBottom:14}}>
          <div className="field">
            <label>Seniority level <span style={{color:"var(--danger)"}}>*</span></label>
            <select className="select" value={data.seniority||""} onChange={e=>set("seniority",e.target.value)}>
              <option value="">Select…</option>
              {D.seniorities.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Employment type <span style={{color:"var(--danger)"}}>*</span></label>
            <select className="select" value={data.empType||""} onChange={e=>set("empType",e.target.value)}>
              <option value="">Select…</option>
              {D.empTypes.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="two-col">
          <div className="field">
            <label>Years of experience</label>
            <div className="flex" style={{gap:10,alignItems:"center"}}>
              <input className="input mono" type="number" placeholder="Min" style={{width:"50%"}} value={data.expMin||""} onChange={e=>set("expMin",e.target.value)} />
              <span className="faint" style={{fontSize:13}}>to</span>
              <input className="input mono" type="number" placeholder="Max" style={{width:"50%"}} value={data.expMax||""} onChange={e=>set("expMax",e.target.value)} />
            </div>
            <div className="hint">Optional — helps AI calibrate match scoring</div>
          </div>
          <div className="field">
            <label>Candidate communication language</label>
            <div className="seg" style={{marginTop:4}}>
              {["English","العربية","Both"].map(l=>(
                <button key={l} className={data.commLang===l?"on":""} onClick={()=>set("commLang",l)}>{l}</button>
              ))}
            </div>
            <div className="hint">Language for candidate emails</div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="wiz-group">
        <div className="wiz-group-label">Location</div>
        <div className="field" style={{marginBottom:14}}>
          <label>Work model</label>
          <div className="seg" style={{marginTop:4}}>
            {D.workModels.map(m=>(
              <button key={m} className={data.workModel===m?"on":""} onClick={()=>set("workModel",m)}>{m}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Location {data.workModel==="Remote"?"(optional)":""}</label>
          <input className="input" placeholder="e.g. Riyadh, Saudi Arabia" value={data.location||""} onChange={e=>set("location",e.target.value)} />
          {data.workModel==="Remote" && <div className="hint">Optional — leave blank for fully remote roles</div>}
        </div>
      </div>

      {/* Process */}
      <div className="wiz-group">
        <div className="wiz-group-label">Process</div>
        <div className="field" style={{marginBottom:14}}>
          <label>Hiring workflow <span style={{color:"var(--danger)"}}>*</span></label>
          <select className="select" value={data.workflow||"standard"} onChange={e=>set("workflow",e.target.value)}>
            {window.JC.workflows.map(w=>(
              <option key={w.id} value={w.id}>{w.name} ({w.stages} stages){w.org?" · Org default":""}</option>
            ))}
          </select>
          <a className="muted flex" style={{alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,marginTop:6,cursor:"pointer"}} onClick={()=>setWfPanel(true)}>
            <Icon name="eye" size={13}/>View workflow
          </a>
          {wfPanel && <WorkflowPreviewPanel workflowId={data.workflow||"standard"} onClose={()=>setWfPanel(false)} />}
        </div>
        <div className="field">
          <label>Application deadline (optional)</label>
          <input className="input" type="date" value={data.deadline||""} onChange={e=>set("deadline",e.target.value)} style={{colorScheme:"light"}} />
          <div className="hint">Leave blank for open-ended applications</div>
        </div>
      </div>
    </div>
  );
}

/* ── STEP 2: DESCRIPTION ── */
function Step2({ data, setData }) {
  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const [mode, setMode] = React.useState(data.descMode || "ai");
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(data.generated || false);
  const [sections, setSections] = React.useState(data.sections || window.JC.jdSections);
  const [jdText, setJdText] = React.useState(data.jdText || "");
  const [pasteText, setPasteText] = React.useState("");
  const [fmt, setFmt] = React.useState({bold:false,italic:false,underline:false,strike:false,heading:"",align:"left",ul:false,ol:false});

  const selectMode = (m) => { setMode(m); setData(d=>({...d,descMode:m})); };

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const text = `We're looking for a Senior Frontend Engineer to join our Engineering team in Riyadh. You'll lead the development of our customer-facing React application, working at the intersection of design, performance, and product quality.\n\nResponsibilities\n- Lead the architecture and implementation of complex React features across our main customer-facing product.\n- Define and maintain the frontend component library and design system tokens.\n- Review PRs, mentor junior engineers, and own frontend quality metrics.\n- Collaborate closely with Product and Design to translate requirements into pixel-perfect, performant interfaces.\n- Drive improvements to build tooling, CI/CD pipelines, and developer experience.\n\nRequirements\n- 5–8 years of professional frontend development experience.\n- Expert-level React and TypeScript skills — you write idiomatic, testable code.\n- Experience leading or mentoring frontend engineers.\n- Strong understanding of web performance, accessibility, and browser APIs.\n- Authorization to work in Saudi Arabia is required.\n\nNice-to-have\n- Experience with Next.js or a similar SSR/SSG framework.\n- Familiarity with Arabic RTL layout and bilingual product design.\n- Open-source contributions or a public portfolio.\n\nBenefits\n- Competitive salary (SAR 20,000–30,000/month) with annual performance review.\n- Hybrid work (3 days on-site in Riyadh).\n- Private medical insurance for you and dependents.\n- 30 days annual leave.`;
      setGenerating(false); setGenerated(true); setJdText(text);
      setData(d=>({...d,generated:true,jdText:text}));
    }, 1600);
  };

  const hasContent = generated || (mode==="import" && pasteText.length > 40);

  return (
    <div>
      <h1 className="wiz-heading">Write the job description</h1>
      <p className="wiz-sub">Generate an AI-drafted JD from your job details, or import one you've already written.</p>

      {/* Mode picker */}
      <div className="radio-cards">
        <div className={"radio-card" + (mode==="ai"?" selected-ai":"")} onClick={()=>selectMode("ai")}>
          <div className="radio-card-ico ai"><Icon name="sparkles" size={18} fill/></div>
          <div className="radio-card-check">{mode==="ai"&&<Icon name="check" size={12} style={{color:"#fff"}}/>}</div>
          <div style={{fontWeight:700,fontSize:14,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:"var(--ai)"}}>✦ Generate with AI</span> <span className="badge badge-ai" style={{height:18,fontSize:10}}>Recommended</span>
          </div>
          <div className="muted" style={{fontSize:13}}>AI drafts a full structured JD from your job title, department, seniority, and role details.</div>
        </div>
        <div className={"radio-card" + (mode==="import"?" selected":"")} onClick={()=>selectMode("import")}>
          <div className="radio-card-ico file"><Icon name="file" size={18}/></div>
          <div className="radio-card-check">{mode==="import"&&<Icon name="check" size={12} style={{color:"#fff"}}/>}</div>
          <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>Import existing JD</div>
          <div className="muted" style={{fontSize:13}}>Paste your existing JD and we'll structure it into editable sections.</div>
        </div>
      </div>

      {/* AI mode — direct generate */}
      {mode==="ai" && !generated && (
        <div style={{textAlign:"center",padding:"32px 0 16px"}}>
          <button className="btn" disabled={generating} onClick={generate}
            style={{background:"var(--ai)",borderColor:"var(--ai)",color:"#fff",height:48,padding:"0 28px",fontSize:15,fontWeight:700,boxShadow:"var(--shadow-sm)"}}>
            {generating
              ? <><Icon name="sparkles" size={17} fill style={{animation:"spin 1s linear infinite"}}/> ✦ AI is writing your JD…</>
              : <><Icon name="sparkles" size={17} fill/> ✦ Generate job description</>}
          </button>
          <div className="faint" style={{fontSize:12.5,marginTop:12}}>Based on: <strong style={{color:"var(--text-2)"}}>Senior Frontend Engineer</strong> · Engineering · Senior · Hybrid · Riyadh</div>
        </div>
      )}

      {/* Import mode */}
      {mode==="import" && !generated && (
        <div className="wiz-card" style={{padding:24}}>
          <div style={{fontWeight:600,fontSize:15,marginBottom:14}}>Paste your JD</div>
          <div className="upload-zone" style={{marginBottom:16}} onClick={()=>{}}>
            <Icon name="upload" size={32}/>
            <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>Drop a .docx or .pdf file here</div>
            <div className="faint" style={{fontSize:13}}>or click to browse</div>
          </div>
          <div className="faint" style={{textAlign:"center",marginBottom:14,fontSize:13}}>— or —</div>
          <textarea className="textarea" rows={8} placeholder="Paste your job description here…" value={pasteText} onChange={e=>setPasteText(e.target.value)} />
          <button className="btn btn-primary" style={{marginTop:14}} disabled={pasteText.length<40}
            onClick={()=>{setGenerated(true);setData(d=>({...d,generated:true,sections:window.JC.jdSections}));}}>
            <Icon name="sparkles" size={16} fill/>Process JD
          </button>
        </div>
      )}

      {/* Generated — single text editor */}
      {(generated || hasContent) && (
        <div style={{marginTop:20}}>
          <div className="ai-banner" style={{marginBottom:14}}>
            <Icon name="sparkles" size={15} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
            <span style={{flex:1,fontSize:13,fontWeight:500}}>
              {mode==="ai" ? "✦ AI-generated · Edit the description below." : "✦ Imported · Edit the description below."}
            </span>
            {mode==="ai" && <a className="muted" style={{fontSize:12.5,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}} onClick={generate}>Regenerate</a>}
          </div>
          <div className="wiz-card" style={{padding:0,overflow:"hidden"}}>
            {/* Rich toolbar */}
            <div className="rt-toolbar" style={{borderRadius:"var(--r-lg) var(--r-lg) 0 0",gap:1,flexWrap:"wrap"}}>
              {/* Text formatting */}
              <button className={"rt-btn"+(fmt.bold?" on":"")} title="Bold" onClick={()=>setFmt(f=>({...f,bold:!f.bold}))}><strong>B</strong></button>
              <button className={"rt-btn"+(fmt.italic?" on":"")} title="Italic" onClick={()=>setFmt(f=>({...f,italic:!f.italic}))} style={{fontStyle:"italic"}}>I</button>
              <button className={"rt-btn"+(fmt.underline?" on":"")} title="Underline" onClick={()=>setFmt(f=>({...f,underline:!f.underline}))} style={{textDecoration:"underline"}}>U</button>
              <button className={"rt-btn"+(fmt.strike?" on":"")} title="Strikethrough" onClick={()=>setFmt(f=>({...f,strike:!f.strike}))} style={{textDecoration:"line-through"}}>S</button>
              <div className="rt-sep"/>
              {/* Headings */}
              <select className="rt-btn-wide" value={fmt.heading} onChange={e=>setFmt(f=>({...f,heading:e.target.value}))} style={{width:"auto",border:"none",outline:"none",background:"transparent",height:32,cursor:"pointer",fontSize:12.5,fontWeight:600,color:"var(--text-2)"}}>
                <option value="">Normal</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
              <div className="rt-sep"/>
              {/* Alignment */}
              <button className={"rt-btn"+(fmt.align==="left"?" on":"")} title="Align left" onClick={()=>setFmt(f=>({...f,align:"left"}))}><Icon name="list" size={14}/></button>
              <button className={"rt-btn"+(fmt.align==="center"?" on":"")} title="Center" onClick={()=>setFmt(f=>({...f,align:"center"}))} style={{letterSpacing:1}}>≡</button>
              <button className={"rt-btn"+(fmt.align==="right"?" on":"")} title="Align right" onClick={()=>setFmt(f=>({...f,align:"right"}))}><Icon name="list" size={14} style={{transform:"scaleX(-1)"}}/></button>
              <div className="rt-sep"/>
              {/* Lists */}
              <button className={"rt-btn"+(fmt.ul?" on":"")} title="Bullet list" onClick={()=>setFmt(f=>({...f,ul:!f.ul,ol:false}))}><Icon name="list" size={15}/></button>
              <button className={"rt-btn"+(fmt.ol?" on":"")} title="Numbered list" onClick={()=>setFmt(f=>({...f,ol:!f.ol,ul:false}))}><Icon name="list" size={15}/></button>
              <div className="rt-sep"/>
              <span className="faint mono" style={{fontSize:12,padding:"0 8px",alignSelf:"center",marginInlineStart:"auto"}}>
                {jdText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              style={{width:"100%",minHeight:480,padding:"20px 24px",fontSize:14.5,lineHeight:1.85,fontFamily:"'IBM Plex Sans','IBM Plex Sans Arabic',system-ui",border:"none",outline:"none",background:"var(--surface)",resize:"vertical",color:"var(--text)",
                fontWeight:fmt.bold?700:400,
                fontStyle:fmt.italic?"italic":"normal",
                textDecoration:[fmt.underline?"underline":"",fmt.strike?"line-through":""].filter(Boolean).join(" ")||"none",
                textAlign:fmt.align||"start",
                fontSize:fmt.heading==="h1"?22:fmt.heading==="h2"?18:fmt.heading==="h3"?16:14.5,
              }}
              value={jdText}
              onChange={e=>{setJdText(e.target.value);setData(d=>({...d,jdText:e.target.value}));}}
              placeholder="Your job description will appear here…"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function JDSection({ sec, open, onToggle, onChange }) {
  return (
    <div className="jd-section">
      <div className="jd-section-head" onClick={onToggle}>
        <Icon name={open?"chevDown":"chevRight"} size={16} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>
        <span style={{fontWeight:600,fontSize:14,flex:1}}>{sec.label}</span>
        <span className="faint mono" style={{fontSize:12}}>{sec.words} words</span>
        <a className="muted" style={{fontSize:12.5,fontWeight:600,marginInlineStart:14,cursor:"pointer"}} onClick={e=>{e.stopPropagation();}}>Regenerate</a>
      </div>
      {open && (
        <div className="jd-section-body">
          <textarea defaultValue={sec.text} rows={5} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",background:"transparent",fontFamily:"inherit",fontSize:14,lineHeight:1.75,resize:"vertical",color:"var(--text)"}} />
        </div>
      )}
    </div>
  );
}


/* ── Workflow Preview Panel ── */
function WorkflowPreviewPanel({ workflowId, onClose }) {
  const D = window.JC;
  const wf = D.workflows.find(w => w.id === workflowId) || D.workflows[0];
  const stages = (D.workflowStages || {})[workflowId] || [];

  const typeColor = {
    applied:"var(--text-3)", screening:"var(--info)", assessment:"var(--purple)",
    interview:"var(--accent)", offer:"var(--warning)", hired:"var(--success)", other:"var(--text-2)"
  };
  const typeLabel = {
    applied:"Applied", screening:"Screening", assessment:"Assessment",
    interview:"Interview", offer:"Offer", hired:"Hired", other:"Other"
  };

  return (
    <React.Fragment>
      <div className="drawer-scrim open" style={{pointerEvents:"auto"}} onClick={onClose} />
      <aside className="drawer open" style={{maxWidth:440}}>
        <div className="drawer-head">
          <div style={{flex:1}}>
            <h3 style={{fontSize:17,fontWeight:600}}>{wf.name}</h3>
            <div className="muted" style={{fontSize:13,marginTop:2}}>{wf.stages} stages{wf.org?" · Org default":""}</div>
          </div>
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18}/></button>
        </div>

        <div className="drawer-body">
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {stages.map((s, i) => (
              <div key={i} style={{display:"flex",gap:14}}>
                {/* timeline */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:"0 0 auto"}}>
                  <span style={{width:30,height:30,borderRadius:8,display:"grid",placeItems:"center",background:`color-mix(in oklch, ${typeColor[s.t]} 14%, var(--surface))`,color:typeColor[s.t],border:`1.5px solid color-mix(in oklch, ${typeColor[s.t]} 35%, transparent)`}}>
                    <Icon name={s.t==="applied"?"users":s.t==="screening"?"eye":s.t==="assessment"?"assessment":s.t==="interview"?"message":s.t==="offer"?"offer":s.t==="hired"?"check":"more"} size={15}/>
                  </span>
                  {i < stages.length - 1 && <span style={{width:2,flex:1,background:"var(--border)",minHeight:18}}/>}
                </div>
                <div style={{paddingBottom: i < stages.length - 1 ? 16 : 0, paddingTop:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontWeight:600,fontSize:14}}>{s.n}</span>
                    <span className="badge badge-neutral" style={{height:18,fontSize:10.5,background:`color-mix(in oklch, ${typeColor[s.t]} 12%, var(--surface))`,color:typeColor[s.t]}}>{typeLabel[s.t]}</span>
                    {s.optional && <span className="badge badge-neutral" style={{height:18,fontSize:10,borderStyle:"dashed",borderWidth:1}}>Optional</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className="divider" style={{margin:"20px 0"}}/>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:"var(--ai-soft)",border:"1px solid color-mix(in oklch,var(--ai) 30%,transparent)",borderRadius:"var(--r-md)"}}>
            <Icon name="sparkles" size={14} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
            <div style={{fontSize:12.5,color:"var(--text-2)"}}>
              <strong style={{color:"var(--text)"}}>AI will use this workflow</strong> to guide candidates through the pipeline. Email automation can be set per stage in Workflows settings.
            </div>
          </div>
        </div>

        <div className="drawer-foot">
          <button className="btn btn-subtle" onClick={onClose}>Close</button>
          <div style={{flex:1}}/>
          <a className="muted" style={{fontSize:12.5,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}} onClick={()=>{ window.open("Connect AI.html#workflows","_blank"); }}>
            <Icon name="edit" size={13}/>Edit this workflow →
          </a>
        </div>
      </aside>
    </React.Fragment>
  );
}

export { Step1, Step2, JDSection, WorkflowPreviewPanel };
