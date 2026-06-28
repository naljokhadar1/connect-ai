/* Job Creation — embedded wizard (no standalone shell) */

function JobCreationWizard({ goApp }) {
  const [step, setStep] = React.useState(1);
  const [published, setPublished] = React.useState(false);
  const [showDiscard, setShowDiscard] = React.useState(false);
  const contentRef = React.useRef();

  const [formData, setFormData] = React.useState({
    title:"Senior Frontend Engineer", dept:"Engineering", openings:1, seniority:"Senior",
    empType:"Full-time", workModel:"Hybrid", location:"Riyadh, Saudi Arabia",
    workflow:"standard", commLang:"English", expMin:5, expMax:8,
    deadline:"2026-06-30", descMode:"ai", generated:false, sections:null,
    skills:null, criteria:null, weights:null, tiers:null,
    team:null, currency:"SAR", salMin:"20,000", salMax:"30,000", period:"per month",
    dist:{ publicApply:true, linkedin:true, referral:false, jobBoards:false, internal:false },
    files:[], source:"",
  });

  const goTo = (n) => {
    setStep(n);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  const stepValid = (n) => {
    if (n === 1) return formData.title && formData.dept && formData.seniority && formData.empType;
    if (n === 2) return formData.generated || formData.descMode === "import";
    return true;
  };

  const nextLabel = () => {
    if (step === 4) return "Continue to candidates →";
    if (step === 5) return formData.files.length ? `Upload ${formData.files.length} CVs and continue →` : "Continue to review →";
    if (step === 6) return "Publish job";
    return "Next";
  };

  const handleNext = () => {
    if (step === 6) { setPublished(true); return; }
    goTo(step + 1);
  };
  const handleBack = () => { if (step > 1) goTo(step - 1); };

  if (published) {
    return (
      <div className="content" style={{overflowY:"auto"}}>
        <SuccessScreen jobTitle={formData.title} hasCandidates={formData.files.length>0}
          onBack={() => goApp("jobs")} />
      </div>
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {/* Wizard top strip */}
      <WizTopStrip jobTitle={formData.title} step={step}
        onSaveExit={() => goApp("jobs")}
        onDiscard={() => setShowDiscard(true)}
        showDiscard={showDiscard} setShowDiscard={setShowDiscard} />

      {/* Step indicator */}
      {step < 6 && (
        <div style={{padding:"20px 28px 0",borderBottom:"1px solid var(--border)",background:"var(--surface)"}}>
          <StepIndicator current={step} onGoTo={goTo} />
        </div>
      )}

      {/* Scrollable step content */}
      <div style={{flex:1,overflowY:"auto",padding:"28px 28px 120px"}} ref={contentRef}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          {step === 1 && <Step1 data={formData} setData={setFormData} />}
          {step === 2 && <Step2 data={formData} setData={setFormData} />}
          {step === 3 && <Step3 data={formData} setData={setFormData} />}
          {step === 4 && <Step4 data={formData} setData={setFormData} />}
          {step === 5 && <Step5 data={formData} setData={setFormData} />}
          {step === 6 && <Step6 formData={formData} onEdit={goTo}
            onPublish={() => setPublished(true)} onDraft={() => setPublished(true)} />}
        </div>
      </div>

      {/* Sticky footer */}
      <WizFooter step={step} onBack={handleBack} onNext={handleNext}
        nextLabel={nextLabel()} nextDisabled={step === 1 && !stepValid(1)}
        onSkip={step === 5 ? () => goTo(6) : null}
        skipLabel="Skip — add candidates later" />

      {showDiscard && <DiscardModal onClose={() => setShowDiscard(false)}
        onConfirm={() => { goApp("jobs"); }} />}
    </div>
  );
}

window.JobCreationWizard = JobCreationWizard;
