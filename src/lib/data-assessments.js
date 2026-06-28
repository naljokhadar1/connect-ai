/* Connect AI — Assessment Library data (Epic 12) */

// question type catalog, scoped by assessment type
export const QTYPES = {
  mcq:        { en: "Multiple choice",  ar: "اختيار من متعدد", icon: "list", scope: ["technical", "functional", "psychometric"] },
  multi:      { en: "Multi-select",     ar: "اختيار متعدد",    icon: "check", scope: ["technical", "functional", "psychometric"] },
  boolean:    { en: "True / False",     ar: "صح / خطأ",        icon: "toggle", scope: ["technical", "functional", "psychometric"] },
  short:      { en: "Short answer",     ar: "إجابة قصيرة",     icon: "type", scope: ["technical", "functional", "psychometric"] },
  long:       { en: "Long answer",      ar: "إجابة مطوّلة",    icon: "doc", scope: ["technical", "functional", "psychometric"] },
  file:       { en: "File upload",      ar: "رفع ملف",         icon: "upload", scope: ["technical", "functional", "psychometric"], note: { en: "Max 25 MB · PDF, DOCX, ZIP, images", ar: "بحد أقصى 25 ميجابايت · PDF، DOCX، ZIP، صور" } },
  likert:     { en: "Likert scale",     ar: "مقياس ليكرت",     icon: "sliders", scope: ["psychometric"] },
  code:       { en: "Code challenge",   ar: "تحدٍّ برمجي",     icon: "code", scope: ["technical"], authored: false, note: { en: "Routed via integrated provider", ar: "يُوجَّه عبر مزود متكامل" } },
};

export const TYPES = {
  technical:    { en: "Technical",    ar: "تقني",     color: "var(--accent)" },
  functional:   { en: "Functional",   ar: "وظيفي",    color: "var(--info)" },
  psychometric: { en: "Psychometric", ar: "سيكومتري", color: "var(--purple)" },
};

export const DOMAINS = {
  programming:  { en: "Programming",        ar: "البرمجة",            type: "technical" },
  data:         { en: "Data & Analytics",   ar: "البيانات والتحليل",  type: "technical" },
  devops:       { en: "DevOps & Cloud",     ar: "DevOps والسحابة",    type: "technical" },
  finance:      { en: "Finance",            ar: "المالية",            type: "functional" },
  marketing:    { en: "Marketing",          ar: "التسويق",            type: "functional" },
  sales:        { en: "Sales",              ar: "المبيعات",           type: "functional" },
  product:      { en: "Product",            ar: "المنتجات",           type: "functional" },
  personality:  { en: "Personality",        ar: "الشخصية",            type: "psychometric" },
  cognitive:    { en: "Cognitive Ability",  ar: "القدرات المعرفية",   type: "psychometric" },
  situational:  { en: "Situational Judgement", ar: "الحكم الظرفي",    type: "psychometric" },
};

export const DIFF = {
  easy:   { en: "Easy",   ar: "سهل",   color: "var(--success)" },
  medium: { en: "Medium", ar: "متوسط", color: "var(--warning)" },
  hard:   { en: "Hard",   ar: "صعب",   color: "var(--danger)" },
};

// sample question content for builder/preview
export function sampleQ(type, domain) {
  if (domain === "programming") return [
    { t: "mcq", q: { en: "What is the time complexity of binary search on a sorted array?", ar: "ما هو التعقيد الزمني للبحث الثنائي في مصفوفة مرتبة؟" }, pts: 5,
      opts: [{ en: "O(n)", ar: "O(n)" }, { en: "O(log n)", ar: "O(log n)", correct: true }, { en: "O(n²)", ar: "O(n²)" }, { en: "O(1)", ar: "O(1)" }] },
    { t: "code", q: { en: "Implement a function that returns the first non-repeating character in a string.", ar: "اكتب دالة تُرجع أول حرف غير مكرر في نص." }, pts: 20, lang: "JavaScript" },
    { t: "multi", q: { en: "Which of the following are valid React hooks? (select all)", ar: "أيٌّ مما يلي خطافات React صالحة؟ (اختر الكل)" }, pts: 8,
      opts: [{ en: "useState", ar: "useState", correct: true }, { en: "useFetch", ar: "useFetch" }, { en: "useEffect", ar: "useEffect", correct: true }, { en: "useMemo", ar: "useMemo", correct: true }] },
    { t: "boolean", q: { en: "In JavaScript, `let` declarations are hoisted to the top of their block.", ar: "في JavaScript، تُرفع تصريحات `let` إلى أعلى الكتلة." }, pts: 3, answer: true },
    { t: "long", q: { en: "Explain the difference between optimistic and pessimistic UI updates, with an example.", ar: "اشرح الفرق بين التحديثات المتفائلة والمتشائمة للواجهة مع مثال." }, pts: 12 },
  ];
  if (domain === "finance") return [
    { t: "mcq", q: { en: "Which ratio measures a company's ability to cover short-term obligations?", ar: "أي نسبة تقيس قدرة الشركة على تغطية التزاماتها قصيرة الأجل؟" }, pts: 5,
      opts: [{ en: "Current ratio", ar: "نسبة التداول", correct: true }, { en: "Debt-to-equity", ar: "الدين إلى حقوق الملكية" }, { en: "ROE", ar: "العائد على حقوق الملكية" }, { en: "P/E ratio", ar: "نسبة السعر للأرباح" }] },
    { t: "short", q: { en: "Calculate the NPV of a project with an initial outlay of SAR 100,000 and...", ar: "احسب صافي القيمة الحالية لمشروع برأس مال أولي 100,000 ريال و..." }, pts: 10 },
    { t: "file", q: { en: "Upload a 3-statement financial model for the scenario described above.", ar: "ارفع نموذجاً مالياً من ثلاث قوائم للسيناريو الموصوف أعلاه." }, pts: 25 },
    { t: "long", q: { en: "A client wants to expand into a new GCC market. Outline your financial due-diligence approach.", ar: "يريد عميل التوسع في سوق خليجي جديد. حدد منهجك في العناية المالية الواجبة." }, pts: 15 },
  ];
  return [
    { t: "likert", q: { en: "I remain calm and effective when working under tight deadlines.", ar: "أبقى هادئاً وفعّالاً عند العمل ضمن مواعيد ضيقة." }, pts: 0, scale: 5 },
    { t: "likert", q: { en: "I prefer to plan tasks carefully rather than improvise.", ar: "أفضّل التخطيط الدقيق للمهام بدلاً من الارتجال." }, pts: 0, scale: 5 },
    { t: "situational", q: { en: "A teammate misses a critical handoff. What is your most likely first action?", ar: "يفوّت زميل تسليماً حرجاً. ما أرجح أول إجراء تتخذه؟" }, pts: 0,
      opts: [{ en: "Escalate to the manager immediately", ar: "التصعيد للمدير فوراً" }, { en: "Speak with the teammate privately first", ar: "التحدث مع الزميل على انفراد أولاً", correct: true }, { en: "Cover the work silently", ar: "تغطية العمل بصمت" }, { en: "Raise it in the team channel", ar: "طرحه في قناة الفريق" }] },
    { t: "mcq", q: { en: "Which pattern best completes the sequence: 2, 6, 12, 20, __ ?", ar: "أي رقم يكمل التسلسل: 2، 6، 12، 20، __ ؟" }, pts: 5,
      opts: [{ en: "28", ar: "28" }, { en: "30", ar: "30", correct: true }, { en: "32", ar: "32" }, { en: "26", ar: "26" }] },
  ];
}

const A = (o) => {
  const qs = o.questions || sampleQ(o.type, o.domain);
  const typeMix = {};
  qs.forEach(q => { typeMix[q.t] = (typeMix[q.t] || 0) + 1; });
  return Object.assign({
    questions: qs, qCount: qs.length, typeMix,
    versions: o.versions || [{ v: "v1", date: o.updated, status: "current", usage: o.usage || 0 }],
    version: (o.versions ? o.versions.find(v => v.status === "current").v : "v1"),
  }, o);
};

export const ASSESSMENTS = [
  A({ id: "as1", title: { en: "Frontend Engineering Skills", ar: "مهارات هندسة الواجهات" }, type: "technical", domain: "programming",
    duration: 45, difficulty: "hard", updated: { en: "2 days ago", ar: "قبل يومين" }, status: "published", source: "default",
    passMark: 70, usage: 142, avgScore: 74, instr: { en: "You have 45 minutes. Code challenges auto-run against hidden tests. You may not use external references.", ar: "لديك 45 دقيقة. تُنفَّذ التحديات البرمجية تلقائياً ضد اختبارات مخفية. لا يُسمح بالمراجع الخارجية." },
    versions: [{ v: "v1", date: { en: "Mar 2026", ar: "مارس 2026" }, status: "deprecated", usage: 88 }, { v: "v2", date: { en: "May 2026", ar: "مايو 2026" }, status: "deprecated", usage: 31 }, { v: "v3", date: { en: "2 days ago", ar: "قبل يومين" }, status: "current", usage: 23 }] }),
  A({ id: "as2", title: { en: "Data Structures & Algorithms", ar: "هياكل البيانات والخوارزميات" }, type: "technical", domain: "programming",
    duration: 60, difficulty: "hard", updated: { en: "1 week ago", ar: "قبل أسبوع" }, status: "published", source: "default", passMark: 65, usage: 96, avgScore: 68 }),
  A({ id: "as3", title: { en: "SQL & Data Analysis", ar: "SQL وتحليل البيانات" }, type: "technical", domain: "data",
    duration: 40, difficulty: "medium", updated: { en: "3 days ago", ar: "قبل 3 أيام" }, status: "published", source: "default", passMark: 70, usage: 64, avgScore: 71 }),
  A({ id: "as4", title: { en: "Cloud & DevOps Fundamentals", ar: "أساسيات السحابة وDevOps" }, type: "technical", domain: "devops",
    duration: 35, difficulty: "medium", updated: { en: "2 weeks ago", ar: "قبل أسبوعين" }, status: "published", source: "default", passMark: 65, usage: 41, avgScore: 66 }),
  A({ id: "as5", title: { en: "Financial Analysis & Modeling", ar: "التحليل والنمذجة المالية" }, type: "functional", domain: "finance",
    duration: 50, difficulty: "hard", updated: { en: "5 days ago", ar: "قبل 5 أيام" }, status: "published", source: "default", passMark: 70, usage: 78, avgScore: 69 }),
  A({ id: "as6", title: { en: "Growth Marketing Aptitude", ar: "كفاءة تسويق النمو" }, type: "functional", domain: "marketing",
    duration: 30, difficulty: "medium", updated: { en: "1 week ago", ar: "قبل أسبوع" }, status: "published", source: "custom", passMark: 60, usage: 33, avgScore: 72 }),
  A({ id: "as7", title: { en: "Product Sense & Prioritization", ar: "حس المنتج وتحديد الأولويات" }, type: "functional", domain: "product",
    duration: 45, difficulty: "medium", updated: { en: "4 days ago", ar: "قبل 4 أيام" }, status: "published", source: "custom", passMark: 65, usage: 52, avgScore: 70 }),
  A({ id: "as8", title: { en: "Workplace Personality Profile", ar: "ملف الشخصية المهنية" }, type: "psychometric", domain: "personality",
    duration: 20, difficulty: "easy", updated: { en: "3 weeks ago", ar: "قبل 3 أسابيع" }, status: "published", source: "default", passMark: null, usage: 210, avgScore: null }),
  A({ id: "as9", title: { en: "Cognitive Reasoning", ar: "الاستدلال المعرفي" }, type: "psychometric", domain: "cognitive",
    duration: 25, difficulty: "medium", updated: { en: "2 days ago", ar: "قبل يومين" }, status: "published", source: "default", passMark: 50, usage: 168, avgScore: 63 }),
  A({ id: "as10", title: { en: "Situational Judgement — Leadership", ar: "الحكم الظرفي — القيادة" }, type: "psychometric", domain: "situational",
    duration: 30, difficulty: "medium", updated: { en: "Yesterday", ar: "أمس" }, status: "draft", source: "ai", passMark: null, usage: 0, avgScore: null }),
  A({ id: "as11", title: { en: "Backend Engineering — Node.js", ar: "هندسة الخادم — Node.js" }, type: "technical", domain: "programming",
    duration: 50, difficulty: "hard", updated: { en: "Yesterday", ar: "أمس" }, status: "draft", source: "ai", passMark: 70, usage: 0, avgScore: null }),
  A({ id: "ax1", title: { en: "Coding Challenge — Algorithms", ar: "تحدٍّ برمجي — الخوارزميات" }, type: "technical", domain: "programming",
    duration: 75, difficulty: "hard", updated: { en: "3 days ago", ar: "قبل 3 أيام" }, status: "published", source: "default", passMark: 60, usage: 57, avgScore: 64, external: true, provider: "hackerrank" }),
  A({ id: "ax2", title: { en: "Verify — Numerical Reasoning", ar: "Verify — الاستدلال العددي" }, type: "psychometric", domain: "cognitive",
    duration: 18, difficulty: "medium", updated: { en: "1 week ago", ar: "قبل أسبوع" }, status: "published", source: "default", passMark: 50, usage: 124, avgScore: 61, external: true, provider: "shl" }),
];

// ===== Epic 12.5 — Third-party providers =====
export const PROVIDERS = [
  { id: "hackerrank", name: "HackerRank",  kind: "coding",       status: "connected",    tests: 12, auth: "api", cobrand: true,  synced: { en: "2 min ago", ar: "قبل دقيقتين" } },
  { id: "codesignal", name: "CodeSignal",  kind: "coding",       status: "disconnected", tests: 0,  auth: "oauth", cobrand: true },
  { id: "codility",   name: "Codility",    kind: "coding",       status: "disconnected", tests: 0,  auth: "api", cobrand: false },
  { id: "coderbyte",  name: "Coderbyte",   kind: "coding",       status: "disconnected", tests: 0,  auth: "api", cobrand: false },
  { id: "testgorilla",name: "TestGorilla", kind: "mixed",        status: "error",        tests: 0,  auth: "api", cobrand: true, error: { en: "API key rejected (401). Re-enter your key.", ar: "رُفض مفتاح API (401). أعد إدخال المفتاح." } },
  { id: "shl",        name: "SHL",         kind: "psychometric", status: "syncing",      tests: 6,  auth: "oauth", cobrand: true },
  { id: "pymetrics",  name: "Pymetrics",   kind: "psychometric", status: "disconnected", tests: 0,  auth: "oauth", cobrand: true },
  { id: "hogan",      name: "Hogan",       kind: "psychometric", status: "disconnected", tests: 0,  auth: "api", cobrand: false },
];
export const PROVIDER_BY = Object.fromEntries(PROVIDERS.map(p => [p.id, p]));

// candidates for the send/assign flow (lighter than full pipeline records)
// Note: depends on window.DATA being loaded first for runtime use
export function buildSendPool(candidates) {
  return (candidates || []).map(c => ({
    id: c.id, name: c.name, initials: c.initials, avatar: c.avatar, title: c.title,
    email: c.email, stage: c.stage,
    asState: c.id === "c2" ? "submitted" : c.id === "c6" ? "in_progress" : c.id === "c7" ? "expired" : c.id === "c5" ? "invited" : "none",
  }));
}

export const STATUS = {
  none:        { en: "Not sent",    ar: "لم يُرسل",   color: "var(--text-3)",  soft: "var(--surface-3)" },
  invited:     { en: "Invited",     ar: "مدعو",       color: "var(--info)",    soft: "var(--info-soft)" },
  in_progress: { en: "In progress", ar: "قيد التنفيذ", color: "var(--warning)", soft: "var(--warning-soft)" },
  submitted:   { en: "Submitted",   ar: "تم التسليم", color: "var(--purple)",  soft: "var(--purple-soft)" },
  scored:      { en: "Scored",      ar: "تم التقييم", color: "var(--success)", soft: "var(--success-soft)" },
  expired:     { en: "Expired",     ar: "منتهٍ",      color: "var(--danger)",  soft: "var(--danger-soft)" },
};

// ===== Epic 12.4 — Grading & Results: build a rich result for a submission =====
export function buildResult(a, cand) {
  cand = cand || { name: { en: "Ahmed Hassan", ar: "أحمد حسن" }, initials: "AH", avatar: "oklch(0.6 0.14 255)", title: { en: "Senior Frontend Engineer · Acme Fintech", ar: "مهندس واجهات أول · Acme Fintech" }, email: "ahmed.hassan@email.com" };
  const objTypes = ["mcq", "multi", "boolean", "likert"];
  let raw = 0, max = 0;
  const responses = a.questions.map((q, i) => {
    const isObj = objTypes.includes(q.t);
    let r = { i, t: q.t, q: q.q, pts: q.pts, time: 60 + ((i * 37) % 180), objective: isObj };
    if (q.opts && (q.t === "mcq")) {
      const correctIdx = q.opts.findIndex(o => o.correct);
      const pick = i % 4 === 1 ? (correctIdx + 1) % q.opts.length : correctIdx; // occasionally wrong
      r.answer = pick; r.correctIdx = correctIdx; r.correct = pick === correctIdx;
      r.opts = q.opts; max += q.pts; raw += r.correct ? q.pts : 0;
    } else if (q.t === "multi") {
      const correct = q.opts.map((o, k) => o.correct ? k : -1).filter(k => k >= 0);
      const pick = correct.slice(0, Math.max(1, correct.length - (i % 2))); // partial
      r.answer = pick; r.correctSet = correct; r.opts = q.opts;
      const hit = pick.filter(p => correct.includes(p)).length;
      r.correct = hit === correct.length && pick.length === correct.length;
      max += q.pts; raw += Math.round((hit / correct.length) * q.pts) - (pick.length > correct.length ? 1 : 0);
    } else if (q.t === "boolean") {
      r.answer = i % 3 === 0 ? !q.answer : q.answer; r.correctVal = q.answer; r.correct = r.answer === q.answer;
      max += q.pts; raw += r.correct ? q.pts : 0;
    } else if (q.t === "likert") {
      r.answer = 3 + (i % 3); r.scale = 5;
    } else {
      // subjective
      r.subjective = true;
      r.answer = q.t === "code"
        ? "function firstNonRepeating(str){\n  const counts = {};\n  for (const c of str) counts[c] = (counts[c]||0)+1;\n  for (const c of str) if (counts[c] === 1) return c;\n  return null;\n}"
        : "At Acme Fintech I led the migration of our transaction timeline to a virtualized list using react-window, which cut render time on 10k-row datasets by ~70%. I memoized row components and moved derived state into selectors to avoid re-renders. The main trade-off was added complexity in scroll restoration, which I solved with a cached offset map.";
      max += q.pts;
    }
    return r;
  });

  const rubric = [
    { crit: { en: "Technical accuracy", ar: "الدقة التقنية" }, weight: 40, ai: 8.7, conf: "high", evidence: { en: ""virtualized list using react-window… cut render time… by ~70%"", ar: "«قائمة افتراضية باستخدام react-window… خفّضت زمن العرض… بنحو 70٪»" } },
    { crit: { en: "Problem-solving approach", ar: "منهج حل المشكلات" }, weight: 30, ai: 8.0, conf: "high", evidence: { en: ""moved derived state into selectors to avoid re-renders"", ar: "«نقل الحالة المشتقة إلى المُحدِّدات لتفادي إعادة العرض»" } },
    { crit: { en: "Communication & clarity", ar: "التواصل والوضوح" }, weight: 20, ai: 7.5, conf: "medium", evidence: { en: "Clear structure; trade-off explained but brief.", ar: "بنية واضحة؛ المقايضة موضّحة لكنها مختصرة." } },
    { crit: { en: "Edge-case handling", ar: "معالجة الحالات الحدّية" }, weight: 10, ai: 5.5, conf: "low", evidence: { en: "Scroll restoration mentioned; no test coverage described.", ar: "ذُكر استرجاع التمرير؛ دون وصف تغطية الاختبارات." } },
  ];

  const pct = Math.round((raw / max) * 100) || 0;
  return {
    cand, status: "submitted", timeTaken: 26, limit: a.duration,
    responses, raw, max, pct,
    objective: { raw, max, pct },
    sections: [
      { name: { en: "React fundamentals", ar: "أساسيات React" }, score: 19, max: 20 },
      { name: { en: "TypeScript", ar: "TypeScript" }, score: 18, max: 20 },
      { name: { en: "State management", ar: "إدارة الحالة" }, score: 16, max: 20 },
      { name: { en: "Performance", ar: "الأداء" }, score: 17, max: 20 },
    ],
    rubric,
    aiSummary: { en: "Ahmed shows strong React and performance depth, with concrete, quantified examples of optimization work. Problem-solving is methodical. Communication is clear though occasionally brief on trade-offs. Edge-case and testing rigor is the weakest area and warrants a follow-up in the technical interview.", ar: "يُظهر أحمد عمقاً قوياً في React والأداء، مع أمثلة ملموسة ومُقاسة لأعمال التحسين. منهج حل المشكلات منظّم. التواصل واضح وإن كان مختصراً أحياناً في المقايضات. الصرامة في الحالات الحدّية والاختبارات هي أضعف جانب وتستحق متابعة في المقابلة التقنية." },
    aiTier: "strong",
    composite: { before: 84, after: 87 },
    cohort: { n: 14, rank: 3, percentile: 80, dist: [1, 1, 2, 3, 4, 2, 1], me: 4, strong: { en: "React fundamentals", ar: "أساسيات React" }, weak: { en: "State management", ar: "إدارة الحالة" } },
    trust: {
      honorAccepted: true,
      honorAt: { en: "June 6, 2026 · 2:01 PM GST", ar: "6 يونيو 2026 · 2:01 م" },
      honorText: { en: "I confirm that I will complete this assessment on my own, without external help or AI tools, and that the work I submit is entirely my own.", ar: "أقرّ بأنني سأكمل هذا التقييم بنفسي دون مساعدة خارجية أو أدوات ذكاء اصطناعي، وأن العمل الذي أقدّمه هو من إنتاجي بالكامل." },
      tabSwitches: 3,
      tabDetail: [
        { at: "4:12", dur: "8s", note: { en: "Tab lost focus", ar: "فقدت التبويبة التركيز" } },
        { at: "11:47", dur: "22s", note: { en: "Switched to another tab", ar: "تبديل إلى تبويبة أخرى" } },
        { at: "19:03", dur: "5s", note: { en: "Tab lost focus", ar: "فقدت التبويبة التركيز" } },
      ],
      copyEvents: 1, pasteEvents: 2,
      pasteDetail: [
        { at: "9:21", len: 64, match: true, note: { en: "Pasted text matched recent copy from the question", ar: "نص ملصوق مطابق لنسخ حديث من السؤال" } },
        { at: "14:08", len: 612, match: false, flagged: true, note: { en: "Large paste (612 chars) not present in source materials", ar: "لصق كبير (612 حرفاً) غير موجود في مواد المصدر" } },
      ],
      timeVsMedian: -8,      // % vs cohort median (negative = faster)
      medianMin: 28,
      devices: 1, deviceConsistent: true,
      flags: [
        { id: "paste", sev: "amber", label: { en: "Large paste detected", ar: "رصد لصق كبير" }, why: { en: "A 612-character block was pasted into a code answer. For coding questions some pasting from docs is normal, but this exceeds the 500-character threshold and wasn't in the provided materials.", ar: "لُصقت كتلة من 612 حرفاً في إجابة برمجية. بعض اللصق من التوثيق طبيعي، لكنه يتجاوز حد 500 حرف ولم يكن ضمن المواد المقدّمة." } },
      ],
    },
  };
}

export const ASSESS = { QTYPES, TYPES, DOMAINS, DIFF, ASSESSMENTS, STATUS, sampleQ, buildResult, PROVIDERS, PROVIDER_BY };

// Runtime: build SEND_POOL from window.DATA if available
const SEND_POOL = (typeof window !== "undefined" && window.DATA ? window.DATA.candidates : []).map(c => ({
  id: c.id, name: c.name, initials: c.initials, avatar: c.avatar, title: c.title,
  email: c.email, stage: c.stage,
  asState: c.id === "c2" ? "submitted" : c.id === "c6" ? "in_progress" : c.id === "c7" ? "expired" : c.id === "c5" ? "invited" : "none",
}));
ASSESS.SEND_POOL = SEND_POOL;

window.ASSESS = ASSESS;
