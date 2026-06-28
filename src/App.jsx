/* Connect AI — app router, context provider, tweaks wiring */

import { AppCtx, useToasts, ToastHost } from './lib/ui'
import { Sidebar, Topbar } from './lib/shell'
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor } from './lib/tweaks-panel'

import { Dashboard } from './screens/dashboard'
import { JobsScreen } from './screens/jobs'
import { Pipeline } from './screens/pipeline'
import { Candidate360 } from './screens/candidate'
import { Interviews } from './screens/video'
import { Offers } from './screens/offer'
import { Assessments } from './screens/assessment'
import { AssessmentLibrary } from './screens/assessment-library'
import { AssessmentResultsReview } from './screens/assessment-results'
import { AssessmentPreviewPage } from './screens/assessment-preview'
import { ScreeningLibrary, ScreeningDone } from './screens/screening-library'
import { ScreeningLive } from './screens/screening-live'
import { ScreeningLinkedJobs } from './screens/screening-linkage'
import { ScreeningWizard } from './screens/screening-wizard'
import { ScreeningAgent } from './screens/screening-agent'
import { ScreeningReview } from './screens/screening-review'
import { UsersList, UserDetail } from './screens/users'
import { Roles } from './screens/roles'
import { Workflows } from './screens/workflows'
import { EmailTemplates } from './screens/templates'
import { CandidateProfilePage } from './screens/candidate-profile-tabs'
import { JobCreationWizard } from './screens/job-creation-wizard'

const ACCENTS = {
  "#4f46e5": 277,
  "#2f6feb": 256,
  "#0ea5a4": 192,
  "#0f9d58": 152,
  "#6d28d9": 300,
};

const TWEAK_DEFAULTS = {
  "lang": "en",
  "theme": "light",
  "density": "comfortable",
  "accent": "#4f46e5"
};

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
  const [cands, setCands] = React.useState(() => window.DATA ? window.DATA.candidates.map(c => ({ ...c })) : []);
  const { toasts, push } = useToasts();
  const contentRef = React.useRef();

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
    window.location.hash = r;
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, []);

  const ctx = React.useMemo(() => ({
    lang, theme, density,
    t: (k) => window.t ? window.t(k, lang) : k,
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
            {route === "assessment-results-review" && <AssessmentResultsReview a={window.ASSESS ? window.ASSESS.ASSESSMENTS[0] : null} onBack={() => go(params.from || "pipeline")} toast={push} />}
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

      <TweaksPanel title={window.t ? window.t("tw.title", lang) : "Tweaks"}>
        <TweakSection label={window.t ? window.t("tw.language", lang) : "Language"} />
        <TweakRadio label={window.t ? window.t("tw.language", lang) : "Language"} value={lang}
          options={[{ value: "en", label: "English" }, { value: "ar", label: "العربية" }]}
          onChange={(v) => setTweak("lang", v)} />
        <TweakSection label={window.t ? window.t("tw.theme", lang) : "Theme"} />
        <TweakRadio label={window.t ? window.t("tw.theme", lang) : "Theme"} value={theme}
          options={[{ value: "light", label: window.t ? window.t("tw.light", lang) : "Light" }, { value: "dark", label: window.t ? window.t("tw.dark", lang) : "Dark" }]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label={window.t ? window.t("tw.density", lang) : "Density"} value={density}
          options={[{ value: "comfortable", label: window.t ? window.t("tw.comfortable", lang) : "Comfortable" }, { value: "compact", label: window.t ? window.t("tw.compact", lang) : "Compact" }]}
          onChange={(v) => setTweak("density", v)} />
        <TweakSection label={window.t ? window.t("tw.accent", lang) : "Accent"} />
        <TweakColor label={window.t ? window.t("tw.accent", lang) : "Accent"} value={tw.accent}
          options={Object.keys(ACCENTS)} onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </AppCtx.Provider>
  );
}

export { App };
