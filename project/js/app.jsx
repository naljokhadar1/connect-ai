/* Connect AI — app router, context provider, tweaks wiring */

const ACCENTS = {
  "#4f46e5": 277, // indigo
  "#2f6feb": 256, // blue
  "#0ea5a4": 192, // teal
  "#0f9d58": 152, // emerald
  "#6d28d9": 300, // violet
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "en",
  "theme": "light",
  "density": "comfortable",
  "accent": "#4f46e5"
}/*EDITMODE-END*/;

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lang = tw.lang, theme = tw.theme, density = tw.density;

  const [route, setRoute] = React.useState(() => {
    const hash = window.location.hash.replace("#", "");
    const valid = ["dashboard","jobs","pipeline","candidate","assessments","assessments-results","assessment-results-review","screening","screening-live","screening-done","screening-agent","screening-wizard","screening-linked","screening-review","interviews","offers","templates","analytics","talentpool","aicenter","job-create"];
    return valid.includes(hash) ? hash : "dashboard";
  });
  const [params, setParams] = React.useState({});
  const [jobFilter, setJobFilter] = React.useState("all");
  const [openCreate, setOpenCreate] = React.useState(false);
  const [cands, setCands] = React.useState(() => window.DATA.candidates.map(c => ({ ...c })));
  const { toasts, push } = useToasts();
  const contentRef = React.useRef();

  // apply doc-level attrs
  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.setAttribute("data-density", density);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    html.setAttribute("lang", lang);
  }, [theme, density, lang]);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent-h", ACCENTS[tw.accent] ?? 277);
  }, [tw.accent]);

  const go = React.useCallback((r, p = {}) => {
    if (r === "jobs" && p.create) setOpenCreate(true);
    if (r === "pipeline" && p.job) setJobFilter(p.job);
    setParams(p);
    setRoute(r);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, []);

  const ctx = React.useMemo(() => ({
    lang, theme, density,
    t: (k) => window.t(k, lang),
    L: (o) => (o ? (o[lang] ?? o.en) : ""),
    setLang: (v) => setTweak("lang", v),
    setTheme: (v) => setTweak("theme", v),
    setDensity: (v) => setTweak("density", v),
  }), [lang, theme, density, setTweak]);

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <AppCtx.Provider value={ctx}>
      <div className="app">
        <Sidebar route={route === "candidate" ? (params.from || "pipeline") : (route === "userDetail" ? "users" : route)} go={go} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="main">
          <Topbar go={go} />
          <div className="content" ref={contentRef}>
            {route === "job-create" && <JobCreationWizard goApp={go} />}
            {route === "dashboard" && <Dashboard go={go} />}
            {route === "jobs" && <JobsScreen go={go} openCreate={openCreate} onConsumeCreate={() => setOpenCreate(false)} toast={push} />}
            {route === "pipeline" && <Pipeline go={go} cands={cands} setCands={setCands} jobFilter={jobFilter} setJobFilter={setJobFilter} toast={push} />}
            {route === "assessment-preview" && <AssessmentPreviewPage go={go} from={params.from} />}
            {route === "candidate-profile" && <CandidateProfilePage candidateId={params.id} from={params.from} go={go} toast={push} />}
            {route === "candidate" && <Candidate360 id={params.id} cands={cands} setCands={setCands} go={go} from={params.from} toast={push} />}
            {route === "assessments" && <AssessmentLibrary go={go} toast={push} />}
            {route === "assessments-results" && <Assessments id={params.id} cands={cands} go={go} />}
            {route === "assessment-results-review" && <AssessmentResultsReview a={window.ASSESS.ASSESSMENTS[0]} onBack={() => go(params.from || "pipeline")} toast={push} />}
            {route === "screening" && <ScreeningLibrary go={go} toast={push} />}
            {route === "screening-live" && <ScreeningLive go={go} toast={push} />}
            {route === "screening-done" && <ScreeningDone go={go} toast={push} />}
            {route === "screening-linked" && <ScreeningLinkedJobs go={go} toast={push} />}
            {route === "screening-wizard" && <ScreeningWizard go={go} toast={push} job={params.job} />}
            {route === "screening-agent" && <ScreeningAgent go={go} toast={push} job={params.job} fresh={params.fresh} />}
            {route === "screening-review" && <ScreeningReview go={go} toast={push} />}
            {route === "interviews" && <Interviews id={params.id} cands={cands} go={go} />}
            {route === "offers" && <Offers cands={cands} go={go} toast={push} />}
            {route === "users" && <UsersList go={go} />}
            {route === "userDetail" && <UserDetail id={params.id} go={go} toast={push} />}
            {route === "roles" && <Roles go={go} toast={push} />}
            {route === "workflows" && <Workflows go={go} toast={push} />}
            {route === "templates" && <EmailTemplates go={go} toast={push} />}
          </div>
        </div>
      </div>

      <ToastHost toasts={toasts} />

      <TweaksPanel title={window.t("tw.title", lang)}>
        <TweakSection label={window.t("tw.language", lang)} />
        <TweakRadio label={window.t("tw.language", lang)} value={lang}
          options={[{ value: "en", label: "English" }, { value: "ar", label: "العربية" }]}
          onChange={(v) => setTweak("lang", v)} />
        <TweakSection label={window.t("tw.theme", lang)} />
        <TweakRadio label={window.t("tw.theme", lang)} value={theme}
          options={[{ value: "light", label: window.t("tw.light", lang) }, { value: "dark", label: window.t("tw.dark", lang) }]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label={window.t("tw.density", lang)} value={density}
          options={[{ value: "comfortable", label: window.t("tw.comfortable", lang) }, { value: "compact", label: window.t("tw.compact", lang) }]}
          onChange={(v) => setTweak("density", v)} />
        <TweakSection label={window.t("tw.accent", lang)} />
        <TweakColor label={window.t("tw.accent", lang)} value={tw.accent}
          options={Object.keys(ACCENTS)} onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
