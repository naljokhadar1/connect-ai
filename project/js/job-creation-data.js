/* Job Creation — data, sample content */
(function () {
  window.JC = {};

  JC.departments = ["Engineering","Product","Design","Marketing","Sales","Operations","People","Finance","Customer Success"];
  JC.seniorities = ["Intern","Entry","Junior","Mid","Senior","Lead","Manager","Director","VP","C-level"];
  JC.empTypes = ["Full-time","Part-time","Contract","Temporary","Internship"];
  JC.workModels = ["On-site","Hybrid","Remote"];
  JC.currencies = ["SAR","USD","AED","GBP","EUR"];
  JC.periods = ["per month","per year"];
  JC.sourceLabels = ["Direct upload","Past applicants","Referrals","External sourcing","Spreadsheet import","Other"];

  JC.workflows = [
    { id:"standard",   name:"Standard Hire",        stages:6,  org:true },
    { id:"technical",  name:"Technical Hire",        stages:8,  org:false },
    { id:"eng-senior", name:"Engineering — Senior",  stages:7,  org:false },
    { id:"high-vol",   name:"High-Volume / Ops",     stages:4,  org:false },
    { id:"executive",  name:"Executive Hire",        stages:9,  org:false },
    { id:"internal",   name:"Internal Transfer",     stages:5,  org:false },
  ];

  JC.teamMembers = [
    { id:"t1", name:"Layla Al-Fayez",   role:"Talent Acquisition Lead", initials:"ل", avatar:"oklch(0.6 0.15 300)", jobRole:"Recruiter",      access:"Full access" },
    { id:"t2", name:"Khalid Al-Rahman", role:"Engineering Director",    initials:"خ", avatar:"oklch(0.6 0.14 60)",  jobRole:"Hiring Manager", access:"Full access" },
    { id:"t3", name:"Sara Mansour",     role:"Senior Engineer",         initials:"س", avatar:"oklch(0.6 0.14 20)",  jobRole:"Interviewer",    access:"Interview only" },
    { id:"t4", name:"Omar Saleh",       role:"Engineering Manager",     initials:"ع", avatar:"oklch(0.6 0.14 150)", jobRole:"Interviewer",    access:"Interview only" },
  ];

  JC.initSkills = [
    { id:"s1", name:"React",                      cat:"Technical",    prof:"Advanced",     cls:"must" },
    { id:"s2", name:"TypeScript",                 cat:"Technical",    prof:"Advanced",     cls:"must" },
    { id:"s3", name:"Next.js",                    cat:"Technical",    prof:"Intermediate", cls:"nice" },
    { id:"s4", name:"CSS / Tailwind",             cat:"Technical",    prof:"Advanced",     cls:"must" },
    { id:"s5", name:"RESTful APIs",               cat:"Technical",    prof:"Intermediate", cls:"must" },
    { id:"s6", name:"Communication (English)",    cat:"Soft",         prof:"Advanced",     cls:"must" },
    { id:"s7", name:"Communication (Arabic)",     cat:"Soft",         prof:"Intermediate", cls:"nice" },
    { id:"s8", name:"5+ yrs frontend exp",        cat:"Domain",       prof:"Advanced",     cls:"must" },
    { id:"s9", name:"Authorization to work KSA",  cat:"Domain",       prof:"n/a",          cls:"deal" },
  ];

  JC.initCriteria = [
    { id:"c1", title:"Experience in regulated industries (fintech, healthcare)", weight:15 },
    { id:"c2", title:"Leadership of cross-functional projects",                  weight:10 },
    { id:"c3", title:"Open-source contributions",                                weight:5 },
  ];

  JC.initWeights = [
    { key:"must",    label:"Skills — must-haves",      pct:45 },
    { key:"nice",    label:"Skills — nice-to-haves",   pct:15 },
    { key:"exp",     label:"Experience level",         pct:15 },
    { key:"custom",  label:"Custom criteria (sum)",    pct:20 },
    { key:"edu",     label:"Education",                pct:5  },
  ];

  JC.weightColors = ["var(--accent)","var(--ai)","var(--purple)","var(--warning)","var(--success)"];

  JC.sampleFiles = [
    { name:"Ahmed_Hassan_CV.pdf",           size:"245 KB" },
    { name:"Sara_Mansour_CV.pdf",           size:"198 KB" },
    { name:"Khalid_Al-Rahman_Resume.docx",  size:"312 KB" },
    { name:"Fatima_Al-Shamsi_CV.pdf",       size:"287 KB" },
    { name:"Noura_Al-Otaibi.pdf",           size:"156 KB" },
  ];

  JC.jdSections = [
    { key:"summary",         label:"Summary",         words:92,
      text:"We're looking for a Senior Frontend Engineer to join our Engineering team in Riyadh. You'll lead the development of our customer-facing React application, working at the intersection of design, performance, and product quality. This role sits within a cross-functional team of 8 engineers and 2 designers and reports to the Engineering Director." },
    { key:"responsibilities", label:"Responsibilities", words:118,
      text:"- Lead the architecture and implementation of complex React features across our main customer-facing product.\n- Define and maintain the frontend component library and design system tokens.\n- Review PRs, mentor junior engineers, and own frontend quality metrics.\n- Collaborate closely with Product and Design to translate requirements into pixel-perfect, performant interfaces.\n- Drive improvements to build tooling, CI/CD pipelines, and developer experience." },
    { key:"requirements",    label:"Requirements",    words:96,
      text:"- 5–8 years of professional frontend development experience.\n- Expert-level React and TypeScript skills — you write idiomatic, testable code.\n- Experience leading or mentoring frontend engineers.\n- Strong understanding of web performance, accessibility, and browser APIs.\n- Authorization to work in Saudi Arabia is required." },
    { key:"nicetohave",      label:"Nice-to-have",    words:64,
      text:"- Experience with Next.js or a similar SSR/SSG framework.\n- Familiarity with Arabic RTL layout and bilingual product design.\n- Open-source contributions or a public portfolio.\n- Prior experience in fintech or regulated industries." },
    { key:"benefits",        label:"Benefits",        words:58,
      text:"- Competitive salary (SAR 20,000–30,000/month) with annual performance review.\n- Hybrid work (3 days on-site in Riyadh).\n- Private medical insurance for you and dependents.\n- 30 days annual leave.\n- ESOP participation for senior hires." },
  ];

  JC.screeningInstructions = "Prioritize candidates with deep React/TypeScript experience and demonstrated leadership in cross-functional projects. Be cautious of candidates without authorization to work in KSA, even if technically strong. Bilingual candidates (English + Arabic) are a significant plus given the local team context. Flag candidates with experience in fintech or other regulated industries.";

  JC.linkedInPages = ["Connect AI (Main)", "Connect AI Arabia"];

  JC.workflowStages = {
    standard:   [{n:"Applied",t:"applied"},{n:"CV Review",t:"screening"},{n:"Recruiter Screen",t:"screening"},{n:"Interview",t:"interview"},{n:"Offer",t:"offer"},{n:"Hired",t:"hired"}],
    technical:  [{n:"Applied",t:"applied"},{n:"CV Review",t:"screening"},{n:"Recruiter Screen",t:"screening"},{n:"Technical Assessment",t:"assessment"},{n:"Technical Interview",t:"interview"},{n:"Final Interview",t:"interview"},{n:"Offer",t:"offer"},{n:"Hired",t:"hired"}],
    "eng-senior":[{n:"Applied",t:"applied"},{n:"CV Review",t:"screening"},{n:"Recruiter Screen",t:"screening"},{n:"Technical Assessment",t:"assessment",optional:true},{n:"Technical Interview",t:"interview"},{n:"Final Interview",t:"interview"},{n:"Offer",t:"offer"},{n:"Hired",t:"hired"}],
    "high-vol":  [{n:"Applied",t:"applied"},{n:"Screening",t:"screening"},{n:"Interview",t:"interview"},{n:"Hired",t:"hired"}],
    executive:  [{n:"Applied",t:"applied"},{n:"CV Review",t:"screening"},{n:"Recruiter Screen",t:"screening"},{n:"Assessment",t:"assessment"},{n:"Panel Interview 1",t:"interview"},{n:"Panel Interview 2",t:"interview"},{n:"Executive Interview",t:"interview"},{n:"Reference Check",t:"other"},{n:"Offer",t:"offer"},{n:"Hired",t:"hired"}],
    internal:   [{n:"Expression of Interest",t:"applied"},{n:"Manager Approval",t:"other"},{n:"HR Interview",t:"interview"},{n:"Offer",t:"offer"},{n:"Hired",t:"hired"}],
  };
})();
