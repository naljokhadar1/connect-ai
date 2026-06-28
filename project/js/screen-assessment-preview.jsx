/* Connect AI — Assessment Preview: question-by-question review page */

function AssessmentPreviewPage({ go, from }) {
  const meta = window.ASSESSMENT_META;
  const questions = window.ASSESSMENT_QUESTIONS;

  const [selQ, setSelQ] = React.useState(0);
  const [sectionFilter, setSectionFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [notes, setNotes] = React.useState({});
  const [noteEdit, setNoteEdit] = React.useState(false);

  const q = questions[selQ];

  const sections = ["all", ...meta.sections];

  const filtered = questions.filter(q => {
    const secOk = sectionFilter === "all" || q.section === sectionFilter;
    const statOk = statusFilter === "all"
      || (statusFilter === "correct" && q.scored === q.maxScore)
      || (statusFilter === "wrong"   && q.scored < q.maxScore);
    return secOk && statOk;
  });

  const totalCorrect = questions.filter(q => q.scored === q.maxScore).length;
  const totalWrong   = questions.filter(q => q.scored < q.maxScore).length;
  const totalScore   = questions.reduce((s,q)=>s+q.scored,0);
  const maxScore     = questions.reduce((s,q)=>s+q.maxScore,0);

  const secScores = meta.sections.map(sec => {
    const qs = questions.filter(q=>q.section===sec);
    const earned = qs.reduce((s,q)=>s+q.scored,0);
    const max = qs.reduce((s,q)=>s+q.maxScore,0);
    return { sec, earned, max, pct: Math.round(earned/max*100) };
  });

  const typeBadge = t => {
    const m={mcq:["badge-info","MCQ"],code:["badge-purple","Code"],written:["badge-warning","Written"]};
    return <span className={"badge " + m[t][0]} style={{height:20,fontSize:11}}>{m[t][1]}</span>;
  };

  const diffBadge = d => {
    const m={easy:["badge-success","Easy"],medium:["badge-warning","Medium"],hard:["badge-danger","Hard"]};
    return <span className={"badge " + m[d][0]} style={{height:19,fontSize:10.5}}>{m[d][1]}</span>;
  };

  const ScoreDot = ({q}) => {
    const col = q.scored===q.maxScore?"var(--success)":q.scored>0?"var(--warning)":"var(--danger)";
    return <span style={{width:8,height:8,borderRadius:"50%",background:col,flex:"0 0 auto"}}/>;
  };

  const fmtTime = s => { const m=Math.floor(s/60); return m>0?`${m}m ${s%60}s`:`${s}s`; };

  const nav = (dir) => {
    const fidx = filtered.findIndex(fq=>fq.id===q.id);
    const nidx = fidx + dir;
    if(nidx>=0 && nidx<filtered.length) {
      setSelQ(questions.findIndex(qq=>qq.id===filtered[nidx].id));
    }
  };

  const fidx = filtered.findIndex(fq=>fq.id===q.id);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>

      {/* TOP HEADER */}
      <div style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"0 24px",flexShrink:0}}>
        {/* Breadcrumb */}
        <div className="crumbs" style={{paddingTop:12,marginBottom:8}}>
          <a style={{cursor:"pointer"}} onClick={()=>go(from||"candidate-profile",{})}>Ahmed Hassan</a>
          <span className="sep">›</span>
          <a style={{cursor:"pointer"}} onClick={()=>go(from||"candidate-profile",{})}>Assessment</a>
          <span className="sep">›</span>
          <span>{meta.name}</span>
        </div>

        {/* Header strip */}
        <div className="flex" style={{alignItems:"center",gap:16,paddingBottom:16,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:200}}>
            <h1 style={{fontSize:20,fontWeight:600,letterSpacing:"-.02em",marginBottom:3}}>{meta.name}</h1>
            <div className="flex" style={{alignItems:"center",gap:10,flexWrap:"wrap",fontSize:13,color:"var(--text-2)"}}>
              <span className="flex" style={{alignItems:"center",gap:5}}><Icon name="users" size={14}/>{meta.candidate}</span>
              <span className="flex" style={{alignItems:"center",gap:5}}><Icon name="jobs" size={14}/>{meta.jobTitle}</span>
              <span className="flex" style={{alignItems:"center",gap:5}}><Icon name="calendar" size={14}/>Completed {meta.completedDate}</span>
              <span className="flex" style={{alignItems:"center",gap:5}}><Icon name="clock" size={14}/>{meta.timeTaken} / {meta.timeLimit}</span>
            </div>
          </div>

          {/* Score summary strip */}
          <div className="flex" style={{gap:24,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div className="mono" style={{fontSize:28,fontWeight:700,color:"var(--accent)",lineHeight:1}}>{totalScore}<span style={{fontSize:14,fontWeight:400,color:"var(--text-3)"}}> /{maxScore}</span></div>
              <div className="faint" style={{fontSize:11.5}}>Total score</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div className="mono" style={{fontSize:22,fontWeight:700,color:"var(--success)",lineHeight:1}}>{totalCorrect}</div>
              <div className="faint" style={{fontSize:11.5}}>Correct</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div className="mono" style={{fontSize:22,fontWeight:700,color:"var(--danger)",lineHeight:1}}>{totalWrong}</div>
              <div className="faint" style={{fontSize:11.5}}>Wrong</div>
            </div>
            <span className="badge badge-success" style={{height:26,fontSize:13,padding:"0 12px"}}>Top {meta.topPct}%</span>
          </div>

          <div className="flex" style={{gap:8}}>
            <button className="btn btn-ghost btn-sm"><Icon name="download" size={15}/>Export</button>
            <button className="btn btn-ghost btn-sm"><Icon name="send" size={15}/>Share</button>
          </div>
        </div>

        {/* Section score bar */}
        <div className="flex" style={{gap:0,borderTop:"1px solid var(--border)",overflowX:"auto"}}>
          {secScores.map((s,i)=>(
            <div key={i} className="flex" style={{flexDirection:"column",alignItems:"center",gap:4,padding:"10px 20px",borderInlineEnd:"1px solid var(--border)",cursor:"pointer",minWidth:130,transition:"background var(--t-fast)"}}
              onClick={()=>setSectionFilter(sectionFilter===s.sec?"all":s.sec)}
              onMouseEnter={e=>e.currentTarget.style.background="var(--surface-2)"} onMouseLeave={e=>e.currentTarget.style.background=""}>
              <span className="mono" style={{fontSize:16,fontWeight:700,color:s.pct>=90?"var(--success)":s.pct>=80?"var(--accent)":"var(--warning)"}}>{s.earned}/{s.max}</span>
              <span style={{fontSize:11.5,fontWeight:500,color:"var(--text-2)",whiteSpace:"nowrap"}}>{s.sec}</span>
              <div style={{width:"100%",height:4,borderRadius:20,background:"var(--surface-3)",overflow:"hidden"}}>
                <div style={{width:s.pct+"%",height:"100%",background:s.pct>=90?"var(--success)":s.pct>=80?"var(--accent)":"var(--warning)",borderRadius:20}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BODY: 3-column */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* LEFT — Question list */}
        <div style={{width:264,flexShrink:0,borderInlineEnd:"1px solid var(--border)",display:"flex",flexDirection:"column",background:"var(--surface)",overflow:"hidden"}}>
          {/* Filters */}
          <div style={{padding:"10px 12px",borderBottom:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:8}}>
            <div className="flex" style={{gap:6}}>
              {["all","correct","wrong"].map(f=>(
                <button key={f} className={"btn btn-sm"+(statusFilter===f?" btn-primary":" btn-subtle")} style={{flex:1,fontSize:12}}
                  onClick={()=>setStatusFilter(f)}>
                  {f==="all"?"All":f==="correct"?"✓ "+totalCorrect:"✗ "+totalWrong}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{flex:1,overflowY:"auto"}}>
            {meta.sections.map(sec => {
              const secQs = filtered.filter(fq=>fq.section===sec);
              if(!secQs.length) return null;
              return (
                <React.Fragment key={sec}>
                  <div style={{padding:"8px 14px 4px",fontSize:10.5,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"var(--text-3)",borderBottom:"1px solid var(--border)"}}>
                    {sec}
                  </div>
                  {secQs.map(fq=>{
                    const isActive = fq.id === q.id;
                    const correct = fq.scored === fq.maxScore;
                    return (
                      <div key={fq.id} onClick={()=>setSelQ(questions.findIndex(qq=>qq.id===fq.id))}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",background:isActive?"var(--accent-soft)":"transparent",borderInlineStart:isActive?"3px solid var(--accent)":"3px solid transparent",transition:"background var(--t-fast)"}}>
                        <span className="mono faint" style={{fontSize:11,flex:"0 0 22px"}}>Q{fq.n}</span>
                        <span style={{flex:1,fontSize:13,fontWeight:isActive?600:400,color:isActive?"var(--accent-strong)":"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{fq.topic}</span>
                        <div className="flex" style={{gap:5,alignItems:"center",flex:"0 0 auto"}}>
                          <span className="mono" style={{fontSize:12,fontWeight:600,color:correct?"var(--success)":"var(--danger)"}}>{fq.scored}/{fq.maxScore}</span>
                          <ScoreDot q={fq}/>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* CENTER — Question detail */}
        <div style={{flex:1,overflowY:"auto",padding:"24px 28px",minWidth:0}}>
          {/* Q header */}
          <div className="flex" style={{alignItems:"center",gap:10,marginBottom:20,flexWrap:"wrap"}}>
            <span className="mono" style={{fontSize:13,fontWeight:700,color:"var(--text-3)"}}>Q{q.n} / {meta.totalQ}</span>
            {typeBadge(q.type)}
            {diffBadge(q.difficulty)}
            <span className="badge badge-neutral" style={{height:19,fontSize:11}}>{q.section}</span>
            <span className="badge badge-neutral" style={{height:19,fontSize:11}}>{q.topic}</span>
            <div className="spacer" style={{flex:1}}/>
            <span className="faint flex" style={{alignItems:"center",gap:5,fontSize:12.5}}><Icon name="clock" size={14}/>{fmtTime(q.timeS)}</span>
            <span className="flex" style={{alignItems:"center",gap:5,fontSize:13,fontWeight:700,color:q.scored===q.maxScore?"var(--success)":"var(--danger)"}}>
              {q.scored}/{q.maxScore} pts
            </span>
          </div>

          {/* Question text */}
          <div style={{marginBottom:22}}>
            <div style={{fontSize:15,fontWeight:500,lineHeight:1.65,marginBottom:4}}>{q.q}</div>
          </div>

          {/* MCQ */}
          {q.type === "mcq" && (
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:24}}>
              {q.options.map(opt=>{
                const isCandidate = q.candidateAnswer === opt.id;
                const isCorrect   = opt.correct;
                let bg="var(--surface)", border="var(--border)", icon=null, textCol="var(--text)";
                if(isCorrect && isCandidate) { bg="var(--success-soft)"; border="var(--success)"; icon=<Icon name="check" size={16} style={{color:"var(--success)"}}/>; }
                else if(isCorrect && !isCandidate) { bg="var(--success-soft)"; border="var(--success)"; textCol="var(--success)"; }
                else if(isCandidate && !isCorrect) { bg="var(--danger-soft)"; border="var(--danger)"; icon=<Icon name="x" size={16} style={{color:"var(--danger)"}}/>; textCol="var(--danger)"; }
                return (
                  <div key={opt.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:"var(--r-md)",border:`1.5px solid ${border}`,background:bg}}>
                    <span className="mono" style={{flex:"0 0 20px",fontWeight:700,fontSize:13,color:"var(--text-3)"}}>({opt.id})</span>
                    <span style={{flex:1,fontSize:14,color:textCol}}>{opt.text}</span>
                    {icon}
                    {isCandidate && <span className="badge" style={{height:20,fontSize:10.5,background:`color-mix(in oklch,${border} 15%,transparent)`,color:border}}>Candidate</span>}
                    {isCorrect && !isCandidate && <span className="badge badge-success" style={{height:20,fontSize:10.5}}>Correct</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* CODE */}
          {q.type === "code" && (
            <div style={{marginBottom:24}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:8,color:"var(--text-2)"}}>Candidate's answer:</div>
              <div style={{background:"#0f1726",borderRadius:"var(--r-lg)",padding:"18px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:13,lineHeight:1.7,color:"#e2e8f0",overflow:"auto",position:"relative"}}>
                <div style={{position:"absolute",top:10,insetInlineEnd:14,display:"flex",gap:6}}>
                  <span className="badge badge-success" style={{background:"rgba(22,163,74,.2)",color:"#4ade80",border:"1px solid rgba(74,222,128,.3)",height:20,fontSize:11}}>Full marks</span>
                </div>
                <pre style={{margin:0,whiteSpace:"pre-wrap"}}>{q.codeAnswer}</pre>
              </div>
            </div>
          )}

          {/* WRITTEN */}
          {q.type === "written" && (
            <div style={{marginBottom:24}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:8,color:"var(--text-2)"}}>Candidate's answer:</div>
              <div style={{padding:"16px 18px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",fontSize:14,lineHeight:1.75,color:"var(--text)"}}>
                {q.writtenAnswer}
              </div>
              <div style={{marginTop:10,display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:600,color:"var(--success)"}}>Score: {q.scored}/{q.maxScore}</span>
                <span className="badge badge-success">Excellent</span>
              </div>
            </div>
          )}

          {/* AI Note */}
          <div style={{padding:"13px 16px",background:"var(--ai-soft)",border:"1px solid color-mix(in oklch,var(--ai) 30%,transparent)",borderRadius:"var(--r-md)",marginBottom:22}}>
            <div className="flex" style={{alignItems:"center",gap:8,marginBottom:6}}>
              <Icon name="sparkles" size={14} fill style={{color:"var(--ai)",flex:"0 0 auto"}}/>
              <span style={{fontWeight:600,fontSize:13,color:"var(--ai)"}}>AI analysis</span>
            </div>
            <p style={{fontSize:13.5,lineHeight:1.65,color:"var(--text-2)",margin:0}}>{q.aiNote}</p>
          </div>

          {/* Nav */}
          <div className="flex" style={{alignItems:"center",gap:12}}>
            <button className="btn btn-ghost" disabled={fidx===0} onClick={()=>nav(-1)}><Icon name="chevLeft" size={16}/>Previous</button>
            <span className="faint mono" style={{flex:1,textAlign:"center",fontSize:12}}>Q{q.n} of {filtered.length} {sectionFilter!=="all"?`(${sectionFilter})`:"shown"}</span>
            <button className="btn btn-ghost" disabled={fidx===filtered.length-1} onClick={()=>nav(1)}>Next<Icon name="chevRight" size={16}/></button>
          </div>
        </div>

        {/* RIGHT — Scoring detail + recruiter notes */}
        <div style={{width:280,flexShrink:0,borderInlineStart:"1px solid var(--border)",overflowY:"auto",background:"var(--surface)",padding:"20px 16px",display:"flex",flexDirection:"column",gap:14}}>
          {/* Score card */}
          <div className="card card-pad">
            <div style={{fontWeight:600,fontSize:13.5,marginBottom:12}}>Question score</div>
            <div style={{textAlign:"center",marginBottom:12}}>
              <ScoreRing value={Math.round(q.scored/q.maxScore*100)} size={72} stroke={6}
                color={q.scored===q.maxScore?"var(--success)":q.scored>0?"var(--warning)":"var(--danger)"}/>
            </div>
            <div className="flex" style={{flexDirection:"column",gap:7,fontSize:13}}>
              <div className="flex" style={{justifyContent:"space-between"}}><span className="muted">Points</span><span className="mono" style={{fontWeight:700}}>{q.scored}/{q.maxScore}</span></div>
              <div className="flex" style={{justifyContent:"space-between"}}><span className="muted">Time taken</span><span className="mono">{fmtTime(q.timeS)}</span></div>
              <div className="flex" style={{justifyContent:"space-between"}}><span className="muted">Difficulty</span>{diffBadge(q.difficulty)}</div>
              <div className="flex" style={{justifyContent:"space-between"}}><span className="muted">Type</span>{typeBadge(q.type)}</div>
            </div>
          </div>

          {/* Section progress */}
          <div className="card card-pad">
            <div style={{fontWeight:600,fontSize:13.5,marginBottom:12}}>Section: {q.section}</div>
            {(() => { const s=secScores.find(s=>s.sec===q.section); return s ? (
              <React.Fragment>
                <div className="flex" style={{alignItems:"baseline",gap:5,marginBottom:8}}>
                  <span className="mono" style={{fontSize:22,fontWeight:700,color:s.pct>=90?"var(--success)":s.pct>=80?"var(--accent)":"var(--warning)"}}>{s.earned}</span>
                  <span className="faint" style={{fontSize:14}}>/ {s.max} pts</span>
                  <span className="muted" style={{fontSize:12,marginInlineStart:"auto"}}>{s.pct}%</span>
                </div>
                <Bar value={s.pct} color={s.pct>=90?"var(--success)":s.pct>=80?"var(--accent)":"var(--warning)"} h={6}/>
              </React.Fragment>
            ) : null; })()}
          </div>

          {/* Recruiter notes */}
          <div className="card" style={{overflow:"hidden"}}>
            <div className="card-head" style={{paddingBlock:12}}>
              <Icon name="message" size={14} style={{color:"var(--text-3)"}}/>
              <span style={{fontWeight:600,fontSize:13.5}}>Recruiter note</span>
              <div className="spacer" style={{flex:1}}/>
              <button className="icon-btn btn-sm" onClick={()=>setNoteEdit(e=>!e)}><Icon name="edit" size={14}/></button>
            </div>
            <div style={{padding:"8px 14px 12px"}}>
              {noteEdit ? (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <textarea className="textarea" rows={4} style={{minHeight:80,fontSize:13}} value={notes[q.id]||""}
                    onChange={e=>setNotes(n=>({...n,[q.id]:e.target.value}))} placeholder="Add a note about this question…"/>
                  <div className="flex" style={{gap:8,justifyContent:"flex-end"}}>
                    <button className="btn btn-subtle btn-sm" onClick={()=>setNoteEdit(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={()=>setNoteEdit(false)}>Save</button>
                  </div>
                </div>
              ) : notes[q.id] ? (
                <p style={{fontSize:13,lineHeight:1.6,color:"var(--text-2)"}}>{notes[q.id]}</p>
              ) : (
                <p className="faint" style={{fontSize:13}}>No note yet. Click edit to add one.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AssessmentPreviewPage = AssessmentPreviewPage;
