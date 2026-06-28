/* Connect AI — Email Templates data */
(function () {
  const CATS = {
    application: { badge: "badge-info",    color: "var(--info)",    key: "et.catApplication" },
    screening:   { badge: "badge-ai",      color: "var(--ai)",      key: "et.catScreening"   },
    interview:   { badge: "badge-accent",  color: "var(--accent)",  key: "et.catInterview"   },
    assessment:  { badge: "badge-warning", color: "var(--warning)", key: "et.catAssessment"  },
    rejection:   { badge: "badge-neutral", color: "var(--text-3)",  key: "et.catRejection"   },
    offer:       { badge: "badge-success", color: "var(--success)", key: "et.catOffer"       },
    onboarding:  { badge: "badge-purple",  color: "var(--purple)",  key: "et.catOnboarding"  },
    internal:    { badge: "badge-info",    color: "var(--info)",    key: "et.catInternal"    },
  };

  // helper body segments for non-detail templates
  const simple = (intro, vars) => [{ t: "text", v: intro }].concat(
    vars.flatMap((v, i) => [{ t: "var", v }, { t: "text", v: i < vars.length - 1 ? ", " : "." }])
  );

  // Full Interview Invitation body
  const interviewBody = [
    {t:"text",v:"Hi "},{t:"var",v:"candidate.first_name"},{t:"text",v:",\n\nThanks for your application for the "},
    {t:"var",v:"job.title"},{t:"text",v:" role on our "},{t:"var",v:"job.department"},
    {t:"text",v:" team. We've reviewed your background and would love to invite you to an interview.\n\nYour interview is scheduled with "},
    {t:"var",v:"interviewer.name"},{t:"text",v:" on "},{t:"var",v:"interview.date"},
    {t:"text",v:" at "},{t:"var",v:"interview.time"},{t:"text",v:".\n\n📎 Please use this link to join: "},
    {t:"var",v:"interview.link"},{t:"text",v:"\n\nIf you need to reschedule, you can pick a new time here: "},
    {t:"var",v:"scheduling_link"},{t:"text",v:"\n\nLooking forward to speaking with you.\n\nBest,\n"},
    {t:"var",v:"recruiter.name"},{t:"text",v:"\n"},{t:"var",v:"company.name"},{t:"text",v:" Talent Team"},
  ];

  const TEMPLATES = [
    // Starter
    { id:"t-app",     starter:true, cat:"application", lang:"EN", status:"active",
      name:{en:"Application Received",ar:"تم استلام الطلب"},
      subject:"We received your application for {{job.title}}",
      subjectSegs:[{t:"text",v:"We received your application for "},{t:"var",v:"job.title"}],
      body:simple("Hi {{candidate.first_name}}, we received your application.", ["candidate.first_name","job.title"]),
      wfCount:4, wfList:["Standard Hire → Applied","Technical Hire → Applied","High-Volume → Applied","Engineering — Senior → Applied"],
    },
    { id:"t-screen",  starter:true, cat:"screening", lang:"EN", status:"active",
      name:{en:"Recruiter Screen Invitation",ar:"دعوة فرز المسؤول"},
      subject:"Quick call — {{job.title}} at {{company.name}}",
      subjectSegs:[{t:"text",v:"Quick call — "},{t:"var",v:"job.title"},{t:"text",v:" at "},{t:"var",v:"company.name"}],
      body:simple("Hi {{candidate.first_name}}, we'd love to schedule a quick recruiter call.", ["candidate.first_name","job.title","recruiter.name"]),
      wfCount:3, wfList:["Standard Hire → Phone Screen","Engineering — Senior → Recruiter Screen","Sales — AE → Recruiter Screen"],
    },
    { id:"t-invite",  starter:true, cat:"interview", lang:"EN", status:"active",
      name:{en:"Interview Invitation",ar:"دعوة مقابلة"},
      subject:"Interview invitation for {{job.title}} at {{company.name}}",
      subjectSegs:[{t:"text",v:"Interview invitation for "},{t:"var",v:"job.title"},{t:"text",v:" at "},{t:"var",v:"company.name"}],
      body:interviewBody,
      wfCount:5, wfList:["Standard Hire → Recruiter Screen","Engineering — Senior → Recruiter Screen","Engineering — Junior → Phone Screen","Sales — Account Executive → Discovery Call","Internship Program 2026 → Initial Chat"],
    },
    { id:"t-remind",  starter:true, cat:"interview", lang:"EN", status:"active",
      name:{en:"Interview Reminder",ar:"تذكير المقابلة"},
      subject:"Reminder: your interview tomorrow at {{interview.time}}",
      subjectSegs:[{t:"text",v:"Reminder: your interview tomorrow at "},{t:"var",v:"interview.time"}],
      body:simple("Just a friendly reminder about your interview tomorrow.", ["candidate.first_name","interview.date","interview.time","interview.link"]),
      wfCount:2, wfList:["Standard Hire → Interview","Technical Hire → Technical Interview"],
    },
    { id:"t-assess",  starter:true, cat:"assessment", lang:"EN", status:"active",
      name:{en:"Assessment Invitation",ar:"دعوة التقييم"},
      subject:"Complete your assessment for {{job.title}}",
      subjectSegs:[{t:"text",v:"Complete your assessment for "},{t:"var",v:"job.title"}],
      body:simple("Hi {{candidate.first_name}}, please complete your assessment within 48 hours.", ["candidate.first_name","job.title","scheduling_link"]),
      wfCount:3, wfList:["Technical Hire → Coding Assessment","Engineering — Senior → Technical Assessment","Engineering — Junior → Coding Test"],
    },
    { id:"t-rej-pre", starter:true, cat:"rejection", lang:"EN", status:"active",
      name:{en:"Rejection — Pre-Interview",ar:"رفض — قبل المقابلة"},
      subject:"Update on your application for {{job.title}}",
      subjectSegs:[{t:"text",v:"Update on your application for "},{t:"var",v:"job.title"}],
      body:simple("Hi {{candidate.first_name}}, thank you for applying. We've decided to move forward with other candidates.", ["candidate.first_name","job.title"]),
      wfCount:2, wfList:["Standard Hire → Rejected","High-Volume → Rejected"],
    },
    { id:"t-rej-post", starter:true, cat:"rejection", lang:"EN", status:"active",
      name:{en:"Rejection — Post-Interview",ar:"رفض — بعد المقابلة"},
      subject:"Following up on your interviews for {{job.title}}",
      subjectSegs:[{t:"text",v:"Following up on your interviews for "},{t:"var",v:"job.title"}],
      body:simple("Hi {{candidate.first_name}}, thank you for taking the time to interview with us.", ["candidate.first_name","job.title","recruiter.name"]),
      wfCount:3, wfList:["Technical Hire → Rejected","Engineering — Senior → Rejected","Executive Hire → Rejected"],
    },
    { id:"t-offer",   starter:true, cat:"offer", lang:"EN", status:"active",
      name:{en:"Offer Extension",ar:"تقديم العرض"},
      subject:"Your offer from {{company.name}} — {{job.title}}",
      subjectSegs:[{t:"text",v:"Your offer from "},{t:"var",v:"company.name"},{t:"text",v:" — "},{t:"var",v:"job.title"}],
      body:simple("Hi {{candidate.first_name}}, we're delighted to extend an offer for the {{job.title}} role.", ["candidate.first_name","job.title","company.name"]),
      wfCount:4, wfList:["Standard Hire → Offer","Technical Hire → Offer","Engineering — Senior → Offer","Executive Hire → Offer"],
    },
    { id:"t-welcome", starter:true, cat:"onboarding", lang:"EN", status:"active",
      name:{en:"Welcome / Hired",ar:"مرحباً / تم التوظيف"},
      subject:"Welcome to {{company.name}}, {{candidate.first_name}}! 🎉",
      subjectSegs:[{t:"text",v:"Welcome to "},{t:"var",v:"company.name"},{t:"text",v:", "},{t:"var",v:"candidate.first_name"},{t:"text",v:"! 🎉"}],
      body:simple("Hi {{candidate.first_name}}, we're thrilled to welcome you to the {{company.name}} team.", ["candidate.first_name","company.name","job.title"]),
      wfCount:4, wfList:["Standard Hire → Hired","Technical Hire → Hired","Engineering — Senior → Hired","Executive Hire → Hired"],
    },
    // Custom
    { id:"t-eng-tech", starter:false, cat:"interview", lang:"EN", status:"active",
      name:{en:"Senior Engineer Technical Brief",ar:"ملخص تقني — مهندس أول"},
      subject:"Technical details for your interview — {{job.title}}",
      subjectSegs:[{t:"text",v:"Technical details for your interview — "},{t:"var",v:"job.title"}],
      body:simple("Hi {{candidate.first_name}}, here's what to expect from your technical interview.", ["candidate.first_name","job.title","interview.date"]),
      wfCount:1, wfList:["Engineering — Senior → Technical Interview"], modified:{en:"3 days ago",ar:"قبل 3 أيام"},
    },
    { id:"t-ar-inv",  starter:false, cat:"interview", lang:"AR", status:"active",
      name:{en:"دعوة لمقابلة فنية",ar:"دعوة لمقابلة فنية"},
      subject:"دعوة لمقابلة تقنية — {{job.title}}",
      subjectSegs:[{t:"text",v:"دعوة لمقابلة تقنية — "},{t:"var",v:"job.title"}],
      body:[{t:"text",v:"مرحباً "},{t:"var",v:"candidate.first_name"},{t:"text",v:"،\n\nيسعدنا دعوتك لمقابلة تقنية للوظيفة "},{t:"var",v:"job.title"},{t:"text",v:"."}],
      wfCount:2, wfList:["Engineering — Senior → Technical Interview","Engineering — Junior → Coding Test"], modified:{en:"1 week ago",ar:"قبل أسبوع"},
    },
    { id:"t-exec-offer", starter:false, cat:"offer", lang:"EN", status:"active",
      name:{en:"Executive Offer (Confidential)",ar:"عرض تنفيذي (سري)"},
      subject:"Confidential offer letter — {{job.title}}",
      subjectSegs:[{t:"text",v:"Confidential offer letter — "},{t:"var",v:"job.title"}],
      body:simple("Hi {{candidate.first_name}}, please find your offer attached.", ["candidate.first_name","job.title","company.name"]),
      wfCount:1, wfList:["Executive Hire → Offer"], modified:{en:"2 weeks ago",ar:"قبل أسبوعين"},
    },
    { id:"t-internal", starter:false, cat:"internal", lang:"EN", status:"active",
      name:{en:"Internal Transfer Notice",ar:"إشعار النقل الداخلي"},
      subject:"Internal opportunity — {{job.title}} in {{job.department}}",
      subjectSegs:[{t:"text",v:"Internal opportunity — "},{t:"var",v:"job.title"},{t:"text",v:" in "},{t:"var",v:"job.department"}],
      body:simple("Hi {{candidate.first_name}}, we have an internal opening you may be interested in.", ["candidate.first_name","job.title","job.department"]),
      wfCount:1, wfList:["Internal Transfer → Applied"], modified:{en:"4 days ago",ar:"قبل 4 أيام"},
    },
    { id:"t-sales",   starter:false, cat:"interview", lang:"EN", status:"draft",
      name:{en:"Sales Final Round Confirmation",ar:"تأكيد الجولة النهائية — المبيعات"},
      subject:"Confirmed: Final round for {{job.title}}",
      subjectSegs:[{t:"text",v:"Confirmed: Final round for "},{t:"var",v:"job.title"}],
      body:simple("Hi {{candidate.first_name}}, your final round is confirmed.", ["candidate.first_name","job.title","interview.date"]),
      wfCount:0, wfList:[], modified:{en:"yesterday",ar:"أمس"},
    },
  ];

  // Preview candidates
  const PREVIEW_CANDS = [
    { id:"pc1", name:"Ahmed Hassan", email:"ahmed.hassan@email.com", avatar:"oklch(0.6 0.14 255)", initials:"AH",
      vars:{ "candidate.first_name":"Ahmed", "candidate.last_name":"Hassan", "candidate.full_name":"Ahmed Hassan",
             "candidate.email":"ahmed.hassan@email.com", "candidate.phone":"+966 50 112 3344",
             "job.title":"Senior Frontend Engineer", "job.department":"Engineering", "job.location":"Riyadh, KSA",
             "interview.date":"Tuesday, June 11", "interview.time":"2:00 PM GST",
             "interview.link":"https://meet.google.com/xyz-abc-def", "interviewer.name":"Khalid Al-Rahman",
             "company.name":"Connect AI", "recruiter.name":"Layla Al-Fayez", "recruiter.email":"layla@connect.sa",
             "scheduling_link":"https://calendly.com/connect-ai/ahmed" } },
    { id:"pc2", name:"Sara Mansour", email:"sara.mansour@email.com", avatar:"oklch(0.6 0.14 20)", initials:"SM",
      vars:{ "candidate.first_name":"Sara", "candidate.last_name":"Mansour", "candidate.full_name":"Sara Mansour",
             "candidate.email":"sara.mansour@email.com", "candidate.phone":"+966 55 220 7788",
             "job.title":"Senior Product Manager", "job.department":"Product", "job.location":"Riyadh, KSA",
             "interview.date":"Wednesday, June 12", "interview.time":"11:00 AM GST",
             "interview.link":"https://meet.google.com/abc-xyz-def", "interviewer.name":"Faisal Al-Otaibi",
             "company.name":"Connect AI", "recruiter.name":"Layla Al-Fayez", "recruiter.email":"layla@connect.sa",
             "scheduling_link":"https://calendly.com/connect-ai/sara" } },
    { id:"pc3", name:"Aisha Al-Zahrani", email:"a.zahrani@email.com", avatar:"oklch(0.6 0.14 295)", initials:"AZ",
      vars:{ "candidate.first_name":"Aisha", "candidate.last_name":"Al-Zahrani", "candidate.full_name":"Aisha Al-Zahrani",
             "candidate.email":"a.zahrani@email.com", "candidate.phone":"+966 54 909 1122",
             "job.title":"Data Scientist", "job.department":"Data & AI", "job.location":"Jeddah, KSA",
             "interview.date":"Thursday, June 13", "interview.time":"3:00 PM GST",
             "interview.link":"https://meet.google.com/def-abc-xyz", "interviewer.name":"Tariq Al-Harbi",
             "company.name":"Connect AI", "recruiter.name":"Layla Al-Fayez", "recruiter.email":"layla@connect.sa",
             "scheduling_link":"https://calendly.com/connect-ai/aisha" } },
  ];

  // System variables grouped
  const SYS_VARS = [
    { group:"Candidate", vars:[
      {id:"candidate.first_name",name:"First name",type:"Text",preview:"Ahmed"},
      {id:"candidate.last_name",name:"Last name",type:"Text",preview:"Hassan"},
      {id:"candidate.full_name",name:"Full name",type:"Text",preview:"Ahmed Hassan"},
      {id:"candidate.email",name:"Email",type:"Email",preview:"ahmed.hassan@email.com"},
      {id:"candidate.phone",name:"Phone",type:"Text",preview:"+966 50 112 3344"},
    ]},
    { group:"Job", vars:[
      {id:"job.title",name:"Job title",type:"Text",preview:"Senior Frontend Engineer"},
      {id:"job.department",name:"Department",type:"Text",preview:"Engineering"},
      {id:"job.location",name:"Location",type:"Text",preview:"Riyadh, KSA"},
    ]},
    { group:"Interview", vars:[
      {id:"interview.date",name:"Interview date",type:"Date",preview:"Tuesday, June 11"},
      {id:"interview.time",name:"Interview time",type:"Text",preview:"2:00 PM GST"},
      {id:"interview.link",name:"Interview link",type:"Link",preview:"https://meet.google.com/…"},
      {id:"interviewer.name",name:"Interviewer name",type:"Text",preview:"Khalid Al-Rahman"},
    ]},
    { group:"Company", vars:[
      {id:"company.name",name:"Company name",type:"Text",preview:"Connect AI"},
    ]},
    { group:"Recruiter", vars:[
      {id:"recruiter.name",name:"Recruiter name",type:"Text",preview:"Layla Al-Fayez"},
      {id:"recruiter.email",name:"Recruiter email",type:"Email",preview:"layla@connect.sa"},
    ]},
    { group:"Scheduling", vars:[
      {id:"scheduling_link",name:"Scheduling link",type:"Link",preview:"https://calendly.com/…"},
    ]},
  ];

  // Custom variables
  const CUSTOM_VARS = [
    {id:"candidate.preferred_language",name:"Preferred language",type:"Text",source:"Candidate field",fallback:"English",usedIn:3},
    {id:"job.team_lead_name",name:"Team lead name",type:"Text",source:"Job field",fallback:"your team lead",usedIn:2},
    {id:"job.visa_required",name:"Visa status required",type:"Yes/No",source:"Job field",fallback:"No",usedIn:1},
    {id:"onboarding.buddy_email",name:"Onboarding buddy",type:"Email",source:"Manual entry",fallback:"—",usedIn:1},
    {id:"links.benefits_pdf",name:"Benefits summary",type:"Link",source:"Static",fallback:"https://connect-ai.com/benefits",usedIn:4},
  ];

  window.ET_CATS = CATS;
  window.ET_TEMPLATES = TEMPLATES;
  window.ET_PREVIEW_CANDS = PREVIEW_CANDS;
  window.ET_SYS_VARS = SYS_VARS;
  window.ET_CUSTOM_VARS = CUSTOM_VARS;
})();
