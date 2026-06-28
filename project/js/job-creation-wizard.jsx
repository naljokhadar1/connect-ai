/* Job Creation — Shared primitives + wizard chrome */

/* ── Switch ── */
function Switch({ on, onChange }) {
  return (
    <label className="switch" style={{ cursor:"pointer" }}>
      <input type="checkbox" checked={on} onChange={e => onChange(e.target.checked)} />
      <div className="switch-track" onClick={() => onChange(!on)} />
      <div className="switch-thumb" />
    </label>
  );
}

/* ── Discard confirm modal ── */
function DiscardModal({ onClose, onConfirm }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth:440 }} onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <h3 style={{fontSize:16}}>Discard this job?</h3>
          <div className="spacer" style={{flex:1}}/>
          <button className="icon-btn btn-sm" onClick={onClose}><Icon name="x" size={18}/></button>
        </div>
        <div className="modal-body" style={{color:"var(--text-2)",fontSize:14}}>All information entered will be lost. This cannot be undone.</div>
        <div className="modal-foot">
          <div className="spacer" style={{flex:1}}/>
          <button className="btn btn-subtle" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Discard job</button>
        </div>
      </div>
    </div>
  );
}

/* ── Step indicator ── */
const STEPS = [
  {n:1,label:"Basics"},
  {n:2,label:"Description"},
  {n:3,label:"Evaluation"},
  {n:4,label:"Team & Launch"},
  {n:5,label:"Candidates"},
  {n:6,label:"Review"},
];

function StepIndicator({ current, onGoTo }) {
  return (
    <div className="wiz-steps">
      {STEPS.map((s, i) => {
        const state = s.n < current ? "done" : s.n === current ? "active" : "pending";
        return (
          <React.Fragment key={s.n}>
            <div className={"wiz-pill " + state}
              onClick={() => state === "done" ? onGoTo(s.n) : null}
              style={{ cursor: state === "done" ? "pointer" : "default" }}>
              <div className="wiz-num">
                {state === "done" ? <Icon name="check" size={13}/> : s.n}
              </div>
              <span className="wiz-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={"wiz-connector" + (s.n < current ? " done" : "")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Auto-save indicator ── */
function SaveIndicator({ status }) {
  return (
    <div className="save-ind" style={{ position:"absolute", right:28, top:"50%", transform:"translateY(-50%)", fontSize:12 }}
      style={{ fontSize:12, color:"var(--text-3)", display:"flex", alignItems:"center", gap:5 }}>
      {status === "saving"
        ? <><Icon name="refresh" size={13} style={{color:"var(--warning)"}}/><span style={{color:"var(--warning)"}}>Saving…</span></>
        : <><Icon name="check" size={13} style={{color:"var(--success)"}}/><span>Auto-saved · just now</span></>}
    </div>
  );
}

/* ── Wizard footer ── */
function WizFooter({ step, onBack, onNext, nextLabel, nextDisabled, onSkip, skipLabel, onSecondary, secondaryLabel }) {
  return (
    <div className="wiz-footer">
      <button className="btn btn-ghost" onClick={onBack} disabled={step === 1}>
        <Icon name="chevLeft" size={16}/> Back
      </button>
      <div style={{flex:1}}/>
      {onSkip && (
        <button className="btn btn-ghost" onClick={onSkip} style={{color:"var(--text-2)"}}>{skipLabel || "Skip"}</button>
      )}
      {onSecondary && (
        <button className="btn btn-ghost" onClick={onSecondary}>{secondaryLabel}</button>
      )}
      <button className="btn btn-primary" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Next"} <Icon name={step === 6 ? "check" : "chevRight"} size={16}/>
      </button>
    </div>
  );
}

/* ── Wizard top strip ── */
function WizTopStrip({ jobTitle, step, onSaveExit, onDiscard, showDiscard, setShowDiscard }) {
  return (
    <div className="wiz-topstrip" style={{position:"relative"}}>
      <div className="crumbs" style={{margin:0, fontSize:13}}>
        <a style={{cursor:"pointer"}} onClick={onSaveExit}>Jobs</a>
        <span className="sep">›</span><span>New job</span>
      </div>
      <div className="wiz-jobpreview">{jobTitle || <span className="faint">Untitled job</span>}</div>
      <div className="flex" style={{gap:12, alignItems:"center"}}>
        <SaveIndicator status="saved"/>
        <button className="btn btn-ghost btn-sm" onClick={onSaveExit}>Save & exit</button>
        <button className="btn btn-sm" style={{color:"var(--danger)",background:"none",border:"none"}} onClick={() => setShowDiscard(true)}>Discard</button>
      </div>
    </div>
  );
}

window.Switch = Switch;
window.DiscardModal = DiscardModal;
window.StepIndicator = StepIndicator;
window.WizFooter = WizFooter;
window.WizTopStrip = WizTopStrip;
window.STEPS = STEPS;
