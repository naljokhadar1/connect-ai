/* Job Creation — Steps 5 & 6 + Success screen */

/* ── STEP 5: PRE-LOAD CANDIDATES ── */
function Step5({ data, setData }) {
  const D = window.JC;
  const [files, setFiles] = React.useState(data.files || []);
  const [source, setSource] = React.useState(data.source || "");
  const [drag, setDrag] = React.useState(false);
  const [adding, setAdding] = React.useState(false);

  const loadSample = () => {
    setAdding(true);
    setTimeout(() => { setFiles(D.sampleFiles); setAdding(false); setData(d=>({...d,files:D.sampleFiles})); }, 600);
  };

  const removeFile = (i) => { const n=files.filter((_,j)=>j!==i); setFiles(n); setData(d=>({...d,files:n})); };

  return (
    <div>
      <div className="flex" style={{alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h1 className="wiz-heading">Got candidates already? <span className="faint" style={{fontSize:16,fontWeight:400}}>(Optional)</span></h1>
          <p className="wiz-sub" style={{marginBottom:0}}>Upload CVs of people you want to add to this job. Skip this if you're starting fresh.</p>
        </div>
      </div>

      <div className={"upload-zone" + (drag?" dragover":"")} style={{maxWidth:"70%",margin:"0 auto 24px"}}
        onDragOver={e=>{e.preventDefault();setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);loadSample();}}
        onClick={loadSample}>
        <Icon name="upload" size={40} style={{marginBottom:16,display:"block",margin:"0 auto 16px",color:"var(--text-3)"}}/>
        <div style={{fontWeight:600,fontSize:15,marginBottom:6}}>Drop CV files here or click to browse</div>
        <div className="faint" style={{fontSize:13}}>Supports PDF, DOCX, DOC · Up to 500 files · We'll parse in the background</div>
      </div>

      {adding && (
        <div className="flex" style={{justifyContent:"center",gap:10,padding:"14px 0",color:"var(--ai)"}}>
          <Icon name="sparkles" size={16} fill/><span className="ai-cursor" style={{fontSize:13,fontWeight:500}}>Adding files…</span>
        </div>
      )}

      {files.length > 0 && (
        <div style={{maxWidth:"70%",margin:"0 auto"}}>
          {files.map((f,i)=>(
            <div key={i} className="file-row">
              <Icon name="file" size={17} style={{color:"var(--danger)",flex:"0 0 auto"}}/>
              <span style={{flex:1,fontSize:13.5,fontWeight:500}}>{f.name}</span>
              <span className="faint mono" style={{fontSize:12}}>{f.size}</span>
              <span className="badge badge-success" style={{height:20}}>Ready to parse</span>
              <button className="icon-btn btn-sm" style={{color:"var(--text-3)"}} onClick={()=>removeFile(i)}><Icon name="x" size={14}/></button>
            </div>
          ))}
          <div className="field" style={{marginTop:20}}>
            <label>Source label <span className="faint">(optional)</span></label>
            <select className="select" value={source} onChange={e=>{setSource(e.target.value);setData(d=>({...d,source:e.target.value}));}}>
              <option value="">Where did these candidates come from?</option>
              {D.sourceLabels.map(s=><option key={s}>{s}</option>)}
            </select>
            <div className="hint">Helps you filter and report on candidate sources later.</div>
          </div>
          <div className="flex" style={{alignItems:"flex-start",gap:10,padding:"12px 14px",background:"var(--info-soft)",border:"1px solid color-mix(in oklch,var(--info) 30%,transparent)",borderRadius:"var(--r-md)",marginTop:16,fontSize:13}}>
            <Icon name="bulb" size={15} style={{color:"var(--info)",flex:"0 0 auto",marginTop:1}}/>
            <span>Parsing happens in the background after you continue. You can proceed to the review step right away — we'll show parsing progress on the job page once it's live.</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── STEP 6: REVIEW & PUBLISH ── */
function Step6({ formData, onEdit, onPublish, onDraft }) {
  const D = window.JC;
  const [publishMode, setPublishMode] = React.useState("publish");
  const [open, setOpen] = React.useState({1:true});

  const toggle = (n) => setOpen(o=>({...o,[n]:!o[n]}));

  const wf = D.workflows.find(w=>w.id===(formData.workflow||"standard")) || D.workflows[0];
  const mustHave = (formData.skills||D.initSkills).filter(s=>s.cls==="must").length;
  const niceHave = (formData.skills||D.initSkills).filter(s=>s.cls==="nice").length;
  const dealBreaker = (formData.skills||D.initSkills).filter(s=>s.cls==="deal").length;

  return (
    <div>
      <h1 className="wiz-heading">Ready to launch your job</h1>
      <p className="wiz-sub">Review everything below. Click any section to make changes.</p>

      {/* Card 1: Basics */}
      <div className="review-card">
        <div className="review-head" onClick={()=>toggle(1)}>
          <div style={{width:28,height:28,borderRadius:7,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="jobs" size={15}/></div>
          <span style={{fontWeight:600,fontSize:15,flex:1}}>1. Basics</span>
          <Icon name={open[1]?"chevDown":"chevRight"} size={16} style={{color:"var(--text-3)"}}/>
          <button className="btn btn-ghost btn-sm" style={{marginInlineStart:12}} onClick={e=>{e.stopPropagation();onEdit(1);}}>Edit</button>
        </div>
        {open[1]&&(
          <div className="review-body">
            <div className="kv-grid">
              <span className="kv-label">Job title</span><span className="kv-val">{formData.title||"Senior Frontend Engineer"}</span>
              <span className="kv-label">Department</span><span className="kv-val">{formData.dept||"Engineering"}</span>
              <span className="kv-label">Openings</span><span className="kv-val">{formData.openings||1}</span>
              <span className="kv-label">Seniority</span><span className="kv-val">{formData.seniority||"Senior"}</span>
              <span className="kv-label">Employment type</span><span className="kv-val">{formData.empType||"Full-time"}</span>
              <span className="kv-label">Experience</span><span className="kv-val">{formData.expMin||5}–{formData.expMax||8} years</span>
              <span className="kv-label">Comm. language</span><span className="kv-val">{formData.commLang||"English"}</span>
              <span className="kv-label">Work model</span><span className="kv-val">{formData.workModel||"Hybrid"}{formData.location?` · ${formData.location}`:" · Riyadh, Saudi Arabia"}</span>
              <span className="kv-label">Workflow</span><span className="kv-val">{wf.name} ({wf.stages} stages)</span>
              <span className="kv-label">Deadline</span><span className="kv-val">{formData.deadline||"June 30, 2026"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card 2: Description */}
      <div className="review-card">
        <div className="review-head" onClick={()=>toggle(2)}>
          <div style={{width:28,height:28,borderRadius:7,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="file" size={15}/></div>
          <span style={{fontWeight:600,fontSize:15,flex:1}}>2. Description</span>
          <Icon name={open[2]?"chevDown":"chevRight"} size={16} style={{color:"var(--text-3)"}}/>
          <button className="btn btn-ghost btn-sm" style={{marginInlineStart:12}} onClick={e=>{e.stopPropagation();onEdit(2);}}>Edit</button>
        </div>
        {open[2]&&(
          <div className="review-body" style={{paddingTop:16}}>
            <div className="flex" style={{gap:8,marginBottom:12}}>
              <span className="badge badge-ai">5 sections</span>
              <span className="badge badge-neutral">487 words</span>
              <span className="badge badge-success">AI generated</span>
            </div>
            <div style={{fontSize:14,color:"var(--text-2)",lineHeight:1.7,fontStyle:"italic"}}>
              "We're looking for a Senior Frontend Engineer to join our Engineering team in Riyadh. You'll lead the development of our customer-facing React application…"
            </div>
          </div>
        )}
      </div>

      {/* Card 3: Evaluation */}
      <div className="review-card">
        <div className="review-head" onClick={()=>toggle(3)}>
          <div style={{width:28,height:28,borderRadius:7,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="assessment" size={15}/></div>
          <span style={{fontWeight:600,fontSize:15,flex:1}}>3. Evaluation</span>
          <Icon name={open[3]?"chevDown":"chevRight"} size={16} style={{color:"var(--text-3)"}}/>
          <button className="btn btn-ghost btn-sm" style={{marginInlineStart:12}} onClick={e=>{e.stopPropagation();onEdit(3);}}>Edit</button>
        </div>
        {open[3]&&(
          <div className="review-body">
            <div className="kv-grid">
              <span className="kv-label">Required skills</span>
              <span className="kv-val flex" style={{gap:6,flexWrap:"wrap"}}>
                <span className="badge badge-accent">{mustHave} must-have</span>
                <span className="badge badge-neutral">{niceHave} nice-to-have</span>
                <span className="badge badge-danger">{dealBreaker} dealbreaker</span>
              </span>
              <span className="kv-label">Custom criteria</span><span className="kv-val">3 criteria</span>
              <span className="kv-label">Tier thresholds</span><span className="kv-val">Strong 81+ · Good 61–80 · Possible 41–60 · Weak &lt;40</span>
            </div>
            <div className="weight-bar" style={{marginTop:14,marginBottom:0}}>
              {D.initWeights.map((w,i)=>(<div key={w.key} className="weight-seg" style={{width:w.pct+"%",background:D.weightColors[i]}} />))}
            </div>
          </div>
        )}
      </div>

      {/* Card 4: Team & Launch */}
      <div className="review-card">
        <div className="review-head" onClick={()=>toggle(4)}>
          <div style={{width:28,height:28,borderRadius:7,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="users" size={15}/></div>
          <span style={{fontWeight:600,fontSize:15,flex:1}}>4. Team & Launch</span>
          <Icon name={open[4]?"chevDown":"chevRight"} size={16} style={{color:"var(--text-3)"}}/>
          <button className="btn btn-ghost btn-sm" style={{marginInlineStart:12}} onClick={e=>{e.stopPropagation();onEdit(4);}}>Edit</button>
        </div>
        {open[4]&&(
          <div className="review-body">
            <div className="kv-grid">
              <span className="kv-label">Hiring team</span>
              <span className="kv-val flex" style={{alignItems:"center",gap:10}}>
                <span>4 members</span>
                <AvatarStack items={D.teamMembers} max={4} size={26}/>
              </span>
              <span className="kv-label">Salary</span>
              <span className="kv-val flex" style={{alignItems:"center",gap:6}}>
                SAR {formData.salMin||"20,000"}–{formData.salMax||"30,000"} / {formData.period||"month"}
                <Icon name="lock" size={13} style={{color:"var(--text-3)"}}/>
              </span>
              <span className="kv-label">Distribution</span><span className="kv-val">Public apply page · LinkedIn (Connect AI)</span>
            </div>
          </div>
        )}
      </div>

      {/* Card 5: Candidates (conditional) */}
      {formData.files && formData.files.length > 0 && (
        <div className="review-card">
          <div className="review-head" onClick={()=>toggle(5)}>
            <div style={{width:28,height:28,borderRadius:7,background:"var(--accent-soft)",color:"var(--accent-strong)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon name="users" size={15}/></div>
            <span style={{fontWeight:600,fontSize:15,flex:1}}>5. Pre-loaded candidates</span>
            <Icon name={open[5]?"chevDown":"chevRight"} size={16} style={{color:"var(--text-3)"}}/>
            <button className="btn btn-ghost btn-sm" style={{marginInlineStart:12}} onClick={e=>{e.stopPropagation();onEdit(5);}}>Edit</button>
          </div>
          {open[5]&&(
            <div className="review-body">
              <div className="kv-grid">
                <span className="kv-label">CVs queued</span><span className="kv-val">{formData.files.length} CVs queued for parsing</span>
                <span className="kv-label">Source</span><span className="kv-val">{formData.source||"Direct upload"}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Publish panel */}
      <div className="wiz-card" style={{marginTop:24,padding:22}}>
        <div className="flex" style={{alignItems:"center",gap:24,flexWrap:"wrap"}}>
          <div>
            <div style={{fontWeight:600,fontSize:15,marginBottom:12}}>Launch settings</div>
            {[["publish","Publish job immediately"],["draft","Save as draft (publish later)"]].map(([v,l])=>(
              <div key={v} className={"rad-opt"+(publishMode===v?" on":"")} onClick={()=>setPublishMode(v)}>
                <span className="rad"/><span style={{fontSize:13.5,fontWeight:600}}>{l}</span>
              </div>
            ))}
          </div>
          <div className="spacer" style={{flex:1}}/>
          <div className="flex" style={{gap:10}}>
            <button className="btn btn-ghost" onClick={onDraft}>Save as draft</button>
            <button className="btn btn-primary" onClick={onPublish} style={{minWidth:140}}>
              <Icon name="send" size={16}/>{publishMode==="publish"?"Publish job":"Save as draft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SUCCESS SCREEN ── */
function SuccessScreen({ jobTitle, hasCandidates, onBack }) {
  const [copied, setCopied] = React.useState(false);
  const slug = (jobTitle||"Senior Frontend Engineer").toLowerCase().replace(/\s+/g,"-");
  const url = "connect-ai.com/jobs/" + slug;

  const copy = () => { setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return (
    <div className="success-wrap">
      <div style={{textAlign:"center",marginBottom:32}}>
        <div className="success-ico"><Icon name="check" size={36} style={{color:"var(--success)"}}/></div>
        <h1 style={{fontSize:28,fontWeight:700,letterSpacing:"-.025em",marginBottom:8}}>Your job is live</h1>
        <p style={{fontSize:16,color:"var(--text-2)",maxWidth:460,margin:"0 auto"}}>{jobTitle||"Senior Frontend Engineer"} is now published and accepting applications.</p>
      </div>

      {/* URL card */}
      <div className="wiz-card" style={{width:"100%",maxWidth:620,padding:22,marginBottom:24}}>
        <div style={{fontWeight:600,fontSize:14,marginBottom:10}}>Public apply page</div>
        <div className="flex" style={{alignItems:"center",gap:12,padding:"12px 14px",background:"var(--surface-2)",borderRadius:"var(--r-md)",border:"1px solid var(--border)"}}>
          <Icon name="link" size={16} style={{color:"var(--text-3)",flex:"0 0 auto"}}/>
          <span className="mono" style={{flex:1,fontSize:14,color:"var(--accent)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</span>
          <button className="btn btn-primary btn-sm" onClick={copy}>
            {copied ? <><Icon name="check" size={14}/>Copied!</> : <><Icon name="file" size={14}/>Copy link</>}
          </button>
        </div>
        <a className="muted flex" style={{alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,marginTop:10,cursor:"pointer"}}>
          <Icon name="eye" size={13}/>Preview page →
        </a>
      </div>

      {/* Quick actions */}
      <div className="quick-grid" style={{maxWidth:620,width:"100%"}}>
        <button className="quick-btn quick-btn-primary">
          <Icon name="upload" size={20} style={{marginBottom:8}}/>
          <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>+ Add candidates</div>
          <div style={{fontSize:12.5,opacity:.85}}>Upload CVs to start screening immediately</div>
        </button>
        <button className="quick-btn">
          <Icon name="link" size={20} style={{marginBottom:8,color:"var(--accent)"}}/>
          <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>Share to LinkedIn</div>
          <div style={{fontSize:12.5,color:"var(--text-2)"}}>Post to your company page</div>
        </button>
        <button className="quick-btn">
          <Icon name="eye" size={20} style={{marginBottom:8,color:"var(--accent)"}}/>
          <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>View job page</div>
          <div style={{fontSize:12.5,color:"var(--text-2)"}}>See the job inside Connect AI</div>
        </button>
        <button className="quick-btn">
          <Icon name="pipeline" size={20} style={{marginBottom:8,color:"var(--accent)"}}/>
          <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>View pipeline</div>
          <div style={{fontSize:12.5,color:"var(--text-2)"}}>See candidates as they apply</div>
        </button>
      </div>

      {hasCandidates && (
        <div className="flex" style={{alignItems:"flex-start",gap:10,padding:"12px 16px",background:"var(--info-soft)",border:"1px solid color-mix(in oklch,var(--info) 30%,transparent)",borderRadius:"var(--r-md)",maxWidth:620,width:"100%",marginTop:16,fontSize:13}}>
          <Icon name="bulb" size={15} style={{color:"var(--info)",flex:"0 0 auto",marginTop:1}}/>
          <span>Parsing 5 CVs in the background. They'll appear in your pipeline within a few minutes. <a style={{fontWeight:600,cursor:"pointer",color:"var(--info)"}}>View progress</a></span>
        </div>
      )}

      <div className="flex" style={{gap:16,marginTop:28}}>
        <button className="btn btn-ghost" onClick={()=>window.location.reload()}>Create another job</button>
        <button className="btn btn-ghost" onClick={onBack}>Back to jobs</button>
      </div>
    </div>
  );
}

window.Step5 = Step5;
window.Step6 = Step6;
window.SuccessScreen = SuccessScreen;
