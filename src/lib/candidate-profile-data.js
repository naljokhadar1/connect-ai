/* Connect AI — Candidate Profile: multi-application data model */

/* ── Ahmed Hassan: single candidate, 3 applications ── */
export const AHMED = {
  id: "cand-001",
  name: "Ahmed Hassan",
  initials: "AH",
  avatarColor: "#EEEDFE",
  avatarText: "#6B5BFF",
  location: "Riyadh, KSA",
  experience: 6,
  languages: ["English"],
  linkedin: "linkedin.com/in/ahmed-hassan",
  email: "ahmed.hassan@email.com",
  phone: "+966 50 112 3344",
  tags: ["Bilingual", "Fintech", "Remote-OK"],
  /* candidate-wide notes */
  notes: [
    { author: "Layla Al-Fayez", when: "2 days ago", text: "Strong communicator, very clear on his React architecture decisions. Consider fast-tracking to tech interview." },
    { author: "Khalid Al-Rahman", when: "1 day ago", text: "Reviewed portfolio — impressive fintech projects at Tamara." },
  ],

  /* ── Applications ── */
  applications: [
    {
      id: "app-sfe",
      jobTitle: "Senior Frontend Engineer",
      dept: "Engineering",
      stage: "Recruiter Screen",
      stageIdx: 2,
      status: "active",
      appliedDaysAgo: 4,
      match: 87,
      tier: "Strong",
      tierColor: "var(--success)",
      workflow: ["Applied","CV Review","Recruiter Screen","Technical Interview","Final Interview","Offer","Hired"],
      daysInStage: 3,
      nextAction: "Move to Technical Interview",
      signals: [
        { label: "CV match",        score: 9.0, done: true },
        { label: "Pre-screen",      score: 8.5, done: true },
        { label: "Assessment",      score: 8.7, done: true },
        { label: "Video interview", score: null, done: false },
        { label: "Human evaluation",score: null, done: false },
      ],
      strengths: ["Deep React expertise (6 yrs)", "Led team of 4 engineers", "Fintech background"],
      concerns:  ["No Arabic communication", "Limited backend exposure"],
      tabCounts: { evaluations: 1, emails: 5, notes: 2 },
      overview: {
        summary: "Ahmed is a strong match for the Senior Frontend Engineer role. His 6 years of React/TypeScript experience at Tamara closely mirrors our stack. He scored 8.7 on the technical assessment and communicated clearly in the pre-screen. Main gap is Arabic communication — not blocking for this role.",
        cvHighlights: [
          "Senior Frontend Engineer · Tamara · 2022–present",
          "Frontend Engineer · Lean · 2020–2022",
          "BSc Software Engineering · KSU · 2016",
        ],
        skills: ["React","TypeScript","Next.js","CSS/Tailwind","RTL/i18n","Testing"],
      },
    },
    {
      id: "app-em",
      jobTitle: "Engineering Manager",
      dept: "Engineering",
      stage: "Applied",
      stageIdx: 0,
      status: "active",
      appliedDaysAgo: 1,
      match: 78,
      tier: "Good",
      tierColor: "var(--accent)",
      workflow: ["Applied","Recruiter Screen","HM Interview","Panel Interview","Offer","Hired"],
      daysInStage: 1,
      nextAction: "Move to Recruiter Screen",
      signals: [
        { label: "CV match",        score: 7.8, done: true },
        { label: "Pre-screen",      score: null, done: false },
        { label: "Assessment",      score: null, done: false },
        { label: "Video interview", score: null, done: false },
        { label: "Human evaluation",score: null, done: false },
      ],
      strengths: ["Team leadership experience", "Strong technical foundation", "Product sense"],
      concerns:  ["No direct EM experience", "Small team scope (4 reports)", "Arabic communication gap"],
      tabCounts: { evaluations: 0, emails: 2, notes: 0 },
      overview: {
        summary: "Ahmed has applied to the Engineering Manager role as a stretch. His tech background is excellent but management experience is limited to tech lead scope (4 reports). Worth screening to assess leadership ambition and growth mindset.",
        cvHighlights: [
          "Senior Frontend Engineer · Tamara · 2022–present (Tech Lead)",
          "Frontend Engineer · Lean · 2020–2022",
        ],
        skills: ["Team leadership","React","Architecture","Mentoring","Agile"],
      },
    },
    {
      id: "app-be",
      jobTitle: "Backend Engineer",
      dept: "Engineering",
      stage: "Rejected",
      stageIdx: -1,
      status: "closed",
      appliedDaysAgo: 45,
      match: 52,
      tier: "Weak",
      tierColor: "var(--text-3)",
      closedLabel: "Rejected May 2026",
      workflow: ["Applied","CV Review","Rejected"],
      daysInStage: null,
      nextAction: null,
      signals: [
        { label: "CV match",        score: 5.2, done: true },
        { label: "Pre-screen",      score: null, done: false },
        { label: "Assessment",      score: null, done: false },
        { label: "Video interview", score: null, done: false },
        { label: "Human evaluation",score: null, done: false },
      ],
      strengths: ["Strong foundational CS knowledge"],
      concerns:  ["No backend language experience", "Stack mismatch (Go/Rust)"],
      tabCounts: { evaluations: 0, emails: 1, notes: 0 },
      overview: {
        summary: "Ahmed applied to the Backend Engineer role but was rejected at CV Review due to a stack mismatch — the role required Go/Rust experience which he does not have.",
        cvHighlights: ["Frontend-only background — rejected at CV Review stage."],
        skills: ["React","TypeScript"],
      },
    },
  ],

  /* similar candidates (right rail) */
  similar: [
    { name: "Yousef Al-Rashid", title: "Frontend Eng · Tamara",  match: 92, initials: "ي", color: "oklch(0.62 0.15 245)" },
    { name: "Maryam Al-Balushi",title: "Frontend Eng · Mrsool", match: 86, initials: "م", color: "oklch(0.62 0.15 190)" },
    { name: "Khalid Al-Anazi",  title: "Software Eng · Lean",   match: 79, initials: "خ", color: "oklch(0.62 0.15 60)"  },
  ],

  /* activity feed (candidate-wide) */
  activity: [
    { icon: "arrowUp",  text: "Advanced to Recruiter Screen (SFE)",             when: "2h ago",   color: "var(--accent)" },
    { icon: "assessment",text: "Completed technical assessment (SFE) — 87%",   when: "Yesterday",color: "var(--purple)" },
    { icon: "send",     text: "Recruiter sent pre-screen email",                 when: "2 days ago",color: "var(--ai)" },
    { icon: "users",    text: "Applied to Engineering Manager role",             when: "1 day ago", color: "var(--accent)" },
    { icon: "sparkles", text: "AI matched to SFE (87%) and EM (78%)",           when: "4 days ago",color: "var(--success)" },
    { icon: "file",     text: "Applied via LinkedIn",                            when: "4 days ago",color: "var(--text-3)" },
  ],

  /* emails (all applications combined but filterable) */
  emails: [
    { subj: "Application received — Senior Frontend Engineer", when: "4 days ago", dir: "out", appId: "app-sfe" },
    { subj: "Pre-screen call scheduled — Tuesday 3pm",          when: "2 days ago", dir: "out", appId: "app-sfe" },
    { subj: "Re: Pre-screen call scheduled",                    when: "2 days ago", dir: "in",  appId: "app-sfe" },
    { subj: "Technical assessment invitation",                  when: "1 day ago",  dir: "out", appId: "app-sfe" },
    { subj: "Application received — Engineering Manager",       when: "1 day ago",  dir: "out", appId: "app-em" },
    { subj: "Re: Application received",                        when: "1 day ago",  dir: "in",  appId: "app-em" },
  ],
};

export const CANDIDATE_PROFILE_DATA = { ahmed: AHMED };

window.AHMED = AHMED;
window.CANDIDATE_PROFILE_DATA = CANDIDATE_PROFILE_DATA;
