/* Connect AI — Workflows data */
(function () {
  // canonical type → badge color
  const CT_COLOR = { applied: "neutral", screening: "info", interview: "accent", assessment: "purple", offer: "warning", hired: "success", rejected: "neutral", other: "neutral" };

  // helper for a stage
  const S = (name, ar, type, count, email, opts = {}) => ({
    id: Math.random().toString(36).slice(2, 8),
    name: { en: name, ar }, type, count, email: email || null,
    optional: !!opts.optional, terminal: opts.terminal || null, color: opts.color || "gray",
    desc: opts.desc || null,
  });

  // Detailed flagship workflow — Engineering Senior
  const engSenior = [
    S("Applied", "تقدّم", "applied", 12, null),
    S("CV Review", "مراجعة السيرة", "screening", 8, "Application Received"),
    S("Recruiter Screen", "فرز المسؤول", "screening", 5, "Screening Call Invitation"),
    S("Technical Assessment", "تقييم تقني", "assessment", 4, "Assessment Invitation", { optional: true, color: "purple" }),
    S("Technical Interview", "مقابلة تقنية", "interview", 3, "Interview Confirmation", { color: "blue" }),
    S("Final Interview", "المقابلة النهائية", "interview", 2, null, { color: "blue" }),
    S("Offer", "العرض", "offer", 1, "Offer Letter", { color: "amber" }),
  ];

  const mk = (en, ar, type, count, email, opts) => S(en, ar, type, count, email, opts);

  const WORKFLOWS = [
    // presets
    { id: "standard", preset: true, isDefault: true, jobs: 14,
      name: { en: "Standard Hire", ar: "توظيف قياسي" }, desc: { en: "Balanced 6-stage process for most roles", ar: "عملية متوازنة من 6 مراحل لمعظم الوظائف" },
      modified: { en: "—", ar: "—" },
      stages: [mk("Applied","تقدّم","applied",18,null), mk("CV Review","مراجعة السيرة","screening",11,"Application Received"), mk("Phone Screen","مكالمة هاتفية","screening",7,"Screening Call Invitation"), mk("Interview","مقابلة","interview",4,"Interview Confirmation",{color:"blue"}), mk("Final Interview","المقابلة النهائية","interview",2,null,{color:"blue"}), mk("Offer","العرض","offer",1,"Offer Letter",{color:"amber"})] },
    { id: "technical", preset: true, jobs: 9,
      name: { en: "Technical Hire", ar: "توظيف تقني" }, desc: { en: "Includes coding assessment and tech interview", ar: "يشمل تقييم برمجة ومقابلة تقنية" },
      modified: { en: "—", ar: "—" },
      stages: [mk("Applied","تقدّم","applied",24,null), mk("CV Review","مراجعة السيرة","screening",14,"Application Received"), mk("Recruiter Screen","فرز المسؤول","screening",9,"Screening Call Invitation"), mk("Coding Assessment","تقييم برمجي","assessment",6,"Assessment Invitation",{color:"purple"}), mk("Technical Interview","مقابلة تقنية","interview",4,"Interview Confirmation",{color:"blue"}), mk("System Design","تصميم الأنظمة","interview",3,null,{color:"blue"}), mk("Final Interview","المقابلة النهائية","interview",2,null,{color:"blue"}), mk("Offer","العرض","offer",1,"Offer Letter",{color:"amber"})] },
    { id: "highvolume", preset: true, jobs: 6,
      name: { en: "High-Volume / Operational", ar: "حجم كبير / تشغيلي" }, desc: { en: "Streamlined for retail, ops, and customer service", ar: "مبسّط للتجزئة والعمليات وخدمة العملاء" },
      modified: { en: "—", ar: "—" },
      stages: [mk("Applied","تقدّم","applied",142,null), mk("Screening","الفرز","screening",38,"Application Received"), mk("Interview","مقابلة","interview",12,"Interview Confirmation",{color:"blue"}), mk("Offer","العرض","offer",4,"Offer Letter",{color:"amber"})] },
    { id: "executive", preset: true, jobs: 2,
      name: { en: "Executive Hire", ar: "توظيف تنفيذي" }, desc: { en: "Multi-round panel with executive approvals", ar: "جولات لجان متعددة مع موافقات تنفيذية" },
      modified: { en: "—", ar: "—" },
      stages: [mk("Applied","تقدّم","applied",8,null), mk("CV Review","مراجعة السيرة","screening",6,null), mk("Recruiter Screen","فرز المسؤول","screening",5,"Screening Call Invitation"), mk("First Panel","اللجنة الأولى","interview",4,"Interview Confirmation",{color:"blue"}), mk("Second Panel","اللجنة الثانية","interview",3,null,{color:"blue"}), mk("Case Study","دراسة حالة","assessment",3,"Assessment Invitation",{color:"purple"}), mk("Executive Interview","مقابلة تنفيذية","interview",2,null,{color:"blue"}), mk("Board Approval","موافقة المجلس","other",1,null,{color:"gray"}), mk("Offer","العرض","offer",1,"Offer Letter",{color:"amber"})] },
    { id: "internal", preset: true, jobs: 3,
      name: { en: "Internal Transfer", ar: "نقل داخلي" }, desc: { en: "Internal mobility process with current manager approval", ar: "عملية تنقّل داخلي مع موافقة المدير الحالي" },
      modified: { en: "—", ar: "—" },
      stages: [mk("Applied","تقدّم","applied",5,null), mk("Manager Approval","موافقة المدير","other",4,null,{color:"gray"}), mk("Screening","الفرز","screening",3,"Screening Call Invitation"), mk("Interview","مقابلة","interview",2,"Interview Confirmation",{color:"blue"}), mk("Offer","العرض","offer",1,"Offer Letter",{color:"amber"})] },
    // custom
    { id: "eng-senior", preset: false, jobs: 4,
      name: { en: "Engineering — Senior", ar: "الهندسة — أول" }, desc: { en: "Full senior engineering loop with optional technical assessment", ar: "حلقة هندسية كاملة للأقدمين مع تقييم تقني اختياري" },
      modified: { en: "2 days ago", ar: "قبل يومين" }, stages: engSenior },
    { id: "eng-junior", preset: false, jobs: 3,
      name: { en: "Engineering — Junior", ar: "الهندسة — مبتدئ" }, desc: { en: "Entry-level engineering with coding test", ar: "هندسة لمستوى المبتدئين مع اختبار برمجي" },
      modified: { en: "1 week ago", ar: "قبل أسبوع" },
      stages: [mk("Applied","تقدّم","applied",31,null), mk("CV Review","مراجعة السيرة","screening",16,"Application Received"), mk("Recruiter Screen","فرز المسؤول","screening",9,"Screening Call Invitation"), mk("Coding Test","اختبار برمجي","assessment",6,"Assessment Invitation",{color:"purple"}), mk("Interview","مقابلة","interview",3,"Interview Confirmation",{color:"blue"}), mk("Offer","العرض","offer",1,"Offer Letter",{color:"amber"})] },
    { id: "sales-ae", preset: false, jobs: 2,
      name: { en: "Sales — Account Executive", ar: "المبيعات — مدير حسابات" }, desc: { en: "AE hiring with a live role-play exercise", ar: "توظيف مدير حسابات مع تمرين تمثيل أدوار" },
      modified: { en: "3 days ago", ar: "قبل 3 أيام" },
      stages: [mk("Applied","تقدّم","applied",22,null), mk("Recruiter Screen","فرز المسؤول","screening",10,"Screening Call Invitation"), mk("Role Play","تمثيل الأدوار","assessment",5,"Assessment Invitation",{color:"purple"}), mk("Hiring Manager Interview","مقابلة مدير التوظيف","interview",3,"Interview Confirmation",{color:"blue"}), mk("Offer","العرض","offer",1,"Offer Letter",{color:"amber"})] },
    { id: "internship", preset: false, jobs: 1,
      name: { en: "Internship Program 2026", ar: "برنامج التدريب 2026" }, desc: { en: "Lightweight process for the summer cohort", ar: "عملية خفيفة لدفعة الصيف" },
      modified: { en: "yesterday", ar: "أمس" },
      stages: [mk("Applied","تقدّم","applied",96,null), mk("Screening","الفرز","screening",24,"Application Received"), mk("Interview","مقابلة","interview",10,"Interview Confirmation",{color:"blue"}), mk("Offer","العرض","offer",6,"Offer Letter",{color:"amber"})] },
  ];

  window.CT_COLOR = CT_COLOR;
  window.WORKFLOWS = WORKFLOWS;
  window.mkStage = (en, ar, type, count, email, opts) => S(en, ar, type, count, email, opts);
})();
