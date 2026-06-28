import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Departments
  const depts = await Promise.all([
    prisma.department.upsert({ where: { id: 'eng' }, update: {}, create: { id: 'eng', nameEn: 'Engineering', nameAr: 'الهندسة' } }),
    prisma.department.upsert({ where: { id: 'prod' }, update: {}, create: { id: 'prod', nameEn: 'Product', nameAr: 'المنتجات' } }),
    prisma.department.upsert({ where: { id: 'data' }, update: {}, create: { id: 'data', nameEn: 'Data & AI', nameAr: 'البيانات والذكاء' } }),
    prisma.department.upsert({ where: { id: 'fin' }, update: {}, create: { id: 'fin', nameEn: 'Finance', nameAr: 'المالية' } }),
    prisma.department.upsert({ where: { id: 'mkt' }, update: {}, create: { id: 'mkt', nameEn: 'Marketing', nameAr: 'التسويق' } }),
    prisma.department.upsert({ where: { id: 'ops' }, update: {}, create: { id: 'ops', nameEn: 'Operations', nameAr: 'العمليات' } }),
    prisma.department.upsert({ where: { id: 'hr' }, update: {}, create: { id: 'hr', nameEn: 'People', nameAr: 'الموارد البشرية' } }),
  ])
  console.log(`  ${depts.length} departments`)

  // Users (NextAuth stores credentials in Account table; users only hold profile data)
  const userRecords = await Promise.all([
    prisma.user.upsert({ where: { email: 'l.alfayez@connect.ai' }, update: {}, create: { id: 'u1', email: 'l.alfayez@connect.ai', name: 'Layla Al-Fayez', initials: 'ل', role: 'admin', status: 'active' } }),
    prisma.user.upsert({ where: { email: 'r.alotaibi@connect.ai' }, update: {}, create: { id: 'u2', email: 'r.alotaibi@connect.ai', name: 'Rawan Al-Otaibi', initials: 'ر', role: 'recruiter', status: 'active' } }),
    prisma.user.upsert({ where: { email: 'f.alotaibi@connect.ai' }, update: {}, create: { id: 'u3', email: 'f.alotaibi@connect.ai', name: 'Faisal Al-Otaibi', initials: 'ف', role: 'hm', status: 'active' } }),
    prisma.user.upsert({ where: { email: 'n.alqahtani@connect.ai' }, update: {}, create: { id: 'u4', email: 'n.alqahtani@connect.ai', name: 'Noura Al-Qahtani', initials: 'ن', role: 'hm', status: 'active' } }),
    prisma.user.upsert({ where: { email: 't.alharbi@connect.ai' }, update: {}, create: { id: 'u5', email: 't.alharbi@connect.ai', name: 'Tariq Al-Harbi', initials: 'ط', role: 'interviewer', status: 'active' } }),
    prisma.user.upsert({ where: { email: 's.ahmad@connect.ai' }, update: {}, create: { id: 'u6', email: 's.ahmad@connect.ai', name: 'Sara Ahmad', initials: 'س', role: 'external', status: 'pending' } }),
    prisma.user.upsert({ where: { email: 'm.alshehri@connect.ai' }, update: {}, create: { id: 'u7', email: 'm.alshehri@connect.ai', name: 'Maha Al-Shehri', initials: 'م', role: 'recruiter', status: 'suspended' } }),
  ])
  console.log(`  ${userRecords.length} users (password: demo1234)`)

  // Jobs
  const jobs = await Promise.all([
    prisma.job.upsert({ where: { id: 'j1' }, update: {}, create: { id: 'j1', titleEn: 'Senior Product Manager', titleAr: 'مدير منتجات أول', departmentId: 'prod', locationEn: 'Riyadh', locationAr: 'الرياض', typeEn: 'Full-time', typeAr: 'دوام كامل', grade: 'M3', openings: 2, status: 'open', postedDaysAgo: 12, applicants: 86, managerId: 'u3', salaryRange: '28,000 – 36,000' } }),
    prisma.job.upsert({ where: { id: 'j2' }, update: {}, create: { id: 'j2', titleEn: 'Senior Frontend Engineer', titleAr: 'مهندس واجهات أول', departmentId: 'eng', locationEn: 'Riyadh', locationAr: 'الرياض', typeEn: 'Full-time', typeAr: 'دوام كامل', grade: 'E4', openings: 3, status: 'open', postedDaysAgo: 8, applicants: 142, managerId: 'u4', salaryRange: '24,000 – 32,000' } }),
    prisma.job.upsert({ where: { id: 'j3' }, update: {}, create: { id: 'j3', titleEn: 'Data Scientist', titleAr: 'عالم بيانات', departmentId: 'data', locationEn: 'Jeddah', locationAr: 'جدة', typeEn: 'Full-time', typeAr: 'دوام كامل', grade: 'E4', openings: 1, status: 'open', postedDaysAgo: 5, applicants: 64, managerId: 'u5', salaryRange: '26,000 – 34,000' } }),
    prisma.job.upsert({ where: { id: 'j4' }, update: {}, create: { id: 'j4', titleEn: 'Financial Analyst', titleAr: 'محلل مالي', departmentId: 'fin', locationEn: 'Riyadh', locationAr: 'الرياض', typeEn: 'Full-time', typeAr: 'دوام كامل', grade: 'E2', openings: 2, status: 'closing', postedDaysAgo: 21, applicants: 98, managerId: 'u3', salaryRange: '16,000 – 22,000' } }),
    prisma.job.upsert({ where: { id: 'j5' }, update: {}, create: { id: 'j5', titleEn: 'Growth Marketing Lead', titleAr: 'قائد تسويق النمو', departmentId: 'mkt', locationEn: 'Dubai', locationAr: 'دبي', typeEn: 'Full-time', typeAr: 'دوام كامل', grade: 'M2', openings: 1, status: 'open', postedDaysAgo: 3, applicants: 41, managerId: 'u3', salaryRange: '22,000 – 30,000' } }),
    prisma.job.upsert({ where: { id: 'j6' }, update: {}, create: { id: 'j6', titleEn: 'DevOps Engineer', titleAr: 'مهندس DevOps', departmentId: 'eng', locationEn: 'Remote – KSA', locationAr: 'عن بُعد – السعودية', typeEn: 'Full-time', typeAr: 'دوام كامل', grade: 'E3', openings: 2, status: 'open', postedDaysAgo: 15, applicants: 73, managerId: 'u4', salaryRange: '20,000 – 28,000' } }),
    prisma.job.upsert({ where: { id: 'j7' }, update: {}, create: { id: 'j7', titleEn: 'UX Researcher', titleAr: 'باحث تجربة المستخدم', departmentId: 'prod', locationEn: 'Riyadh', locationAr: 'الرياض', typeEn: 'Contract', typeAr: 'عقد', grade: 'E3', openings: 1, status: 'draft', postedDaysAgo: 0, applicants: 0, managerId: 'u3', salaryRange: '18,000 – 24,000' } }),
    prisma.job.upsert({ where: { id: 'j8' }, update: {}, create: { id: 'j8', titleEn: 'HR Business Partner', titleAr: 'شريك أعمال الموارد البشرية', departmentId: 'hr', locationEn: 'Dammam', locationAr: 'الدمام', typeEn: 'Full-time', typeAr: 'دوام كامل', grade: 'M2', openings: 1, status: 'onhold', postedDaysAgo: 30, applicants: 55, managerId: 'u7', salaryRange: '19,000 – 26,000' } }),
  ])
  console.log(`  ${jobs.length} jobs`)

  // Candidates
  const candidates = await Promise.all([
    prisma.candidate.upsert({ where: { id: 'c1' }, update: {}, create: { id: 'c1', nameEn: 'Abdulrahman Al-Saud', nameAr: 'عبدالرحمن آل سعود', initials: 'ع', titleEn: 'Product Manager · STC Pay', titleAr: 'مدير منتجات · STC Pay', email: 'a.alsaud@example.com', phone: '+966 50 123 4567', locationEn: 'Riyadh, KSA', locationAr: 'الرياض، السعودية', educationEn: 'MBA, KFUPM', educationAr: 'ماجستير إدارة أعمال، جامعة الملك فهد', skills: ['Product Strategy', 'Fintech', 'Agile', 'Roadmapping', 'SQL', 'Stakeholder Mgmt', 'A/B Testing'], missingSkills: ['Mobile growth', 'ML products'], sourceEn: 'LinkedIn', sourceAr: 'لينكدإن', summaryEn: 'Strong PM candidate with 8 years at STC Pay.', summaryAr: 'مرشح مدير منتجات قوي بـ 8 سنوات في STC Pay.', jobId: 'j1', stage: 'aiInterview', matchScore: 94, experience: 8, appliedDaysAgo: 6, assessmentScore: 88, videoScore: 91, percentile: 96, factors: { skills: 96, experience: 92, education: 90, industry: 98, certs: 88, language: 95 }, languages: [{ en: 'Arabic', ar: 'العربية', lvl: 'Native' }, { en: 'English', ar: 'الإنجليزية', lvl: 'Fluent' }] } }),
    prisma.candidate.upsert({ where: { id: 'c2' }, update: {}, create: { id: 'c2', nameEn: 'Fatima Al-Shamsi', nameAr: 'فاطمة الشامسي', initials: 'ف', titleEn: 'Senior Product Manager · Careem', titleAr: 'مديرة منتجات أولى · كريم', email: 'f.alshamsi@example.com', phone: '+971 55 987 6543', locationEn: 'Dubai, UAE', locationAr: 'دبي، الإمارات', educationEn: 'BS CS, AUS', educationAr: 'بكالوريوس علوم حاسب، جامعة الشارقة', skills: ['Product', 'Growth', 'Analytics', 'User Research', 'SQL'], missingSkills: ['Financial products'], sourceEn: 'Referral', sourceAr: 'إحالة', summaryEn: 'Exceptional PM from Careem with deep growth expertise.', summaryAr: 'مديرة منتجات استثنائية من كريم بخبرة نمو عميقة.', jobId: 'j1', stage: 'offer', matchScore: 91, experience: 7, appliedDaysAgo: 14, assessmentScore: 92, videoScore: 89, percentile: 94, factors: { skills: 90, experience: 88, education: 92, industry: 94, certs: 82, language: 96 }, languages: [{ en: 'Arabic', ar: 'العربية', lvl: 'Native' }, { en: 'English', ar: 'الإنجليزية', lvl: 'Fluent' }, { en: 'French', ar: 'الفرنسية', lvl: 'Intermediate' }] } }),
  ])
  console.log(`  ${candidates.length} candidates (sample — add the rest from mock-data.ts)`)

  // Default workflow
  await prisma.workflow.upsert({
    where: { id: 'wf1' }, update: {},
    create: {
      id: 'wf1', nameEn: 'Standard Hire', nameAr: 'التوظيف القياسي',
      descEn: 'Default pipeline for most roles', descAr: 'المسار الافتراضي لمعظم الأدوار',
      isDefault: true, jobCount: 24,
      stages: [
        { id: 's1', name: { en: 'Applied', ar: 'تقدّم' }, type: 'applied', count: 18, email: null, optional: false, terminal: null, color: 'var(--text-3)', desc: null },
        { id: 's2', name: { en: 'CV Review', ar: 'مراجعة السيرة' }, type: 'screening', count: 11, email: 'Application Received', optional: false, terminal: null, color: 'var(--info)', desc: null },
        { id: 's3', name: { en: 'Phone Screen', ar: 'مكالمة هاتفية' }, type: 'screening', count: 7, email: 'Screening Call Invitation', optional: false, terminal: null, color: 'var(--info)', desc: null },
        { id: 's4', name: { en: 'Interview', ar: 'مقابلة' }, type: 'interview', count: 4, email: 'Interview Confirmation', optional: false, terminal: null, color: 'var(--accent)', desc: null },
        { id: 's5', name: { en: 'Offer', ar: 'العرض' }, type: 'offer', count: 1, email: 'Offer Letter', optional: false, terminal: null, color: 'var(--warning)', desc: null },
        { id: 's6', name: { en: 'Hired', ar: 'تم التوظيف' }, type: 'hired', count: 0, email: null, optional: false, terminal: 'success', color: 'var(--success)', desc: null },
      ],
    },
  })
  console.log('  1 default workflow')

  // Email templates
  await prisma.emailTemplate.upsert({
    where: { id: 't1' }, update: {},
    create: {
      id: 't1', nameEn: 'Interview Invitation', nameAr: 'دعوة مقابلة',
      category: 'interview', status: 'active', language: 'both',
      subject: 'Interview invitation for {{job.title}} at {{company.name}}',
      body: `Hi {{candidate.first_name}},\n\nThanks for your application for the {{job.title}} role. We'd love to invite you to an interview.\n\nYour interview is scheduled with {{interviewer.name}} on {{interview.date}} at {{interview.time}}.\n\nBest,\n{{recruiter.name}}`,
    },
  })
  console.log('  1 email template')

  console.log('\nSeed complete.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
