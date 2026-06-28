export interface LocalizedString {
  en: string
  ar: string
}

export interface Department {
  id: string
  nameEn: string
  nameAr: string
}

export interface Job {
  id: string
  titleEn: string
  titleAr: string
  deptId: string
  locEn: string
  locAr: string
  typeEn: string
  typeAr: string
  grade: string
  openings: number
  status: 'open' | 'draft' | 'closing' | 'onhold'
  posted: number
  applicants: number
  mgrEn: string
  mgrAr: string
  salary: string
  topStage?: string
}

export interface CandidateLang {
  en: string
  ar: string
  lvl: string
}

export interface MatchFactors {
  skills: number
  experience: number
  education: number
  industry: number
  certs: number
  language: number
}

export interface Candidate {
  id: string
  nameEn: string
  nameAr: string
  initials: string
  avatarColor?: string
  titleEn: string
  titleAr: string
  jobId: string
  stage: string
  match: number
  exp: number
  applied: number
  locEn: string
  locAr: string
  email: string
  phone: string
  eduEn: string
  eduAr: string
  skills: string[]
  missingSkills: string[]
  certs: string[]
  factors: MatchFactors
  assess: number
  video: number
  percentile: number
  sourceEn: string
  sourceAr: string
  summaryEn: string
  summaryAr: string
  langs: CandidateLang[]
}

export interface WorkflowStage {
  id: string
  name: LocalizedString
  type: string
  count: number
  email: string | null
  optional: boolean
  terminal: string | null
  color: string
  desc: string | null
}

export interface Workflow {
  id: string
  preset: boolean
  isDefault: boolean
  jobs: number
  nameEn: string
  nameAr: string
  descEn: string
  descAr: string
  modifiedEn: string
  modifiedAr: string
  stages: WorkflowStage[]
}

export interface TemplateSeg {
  t: 'text' | 'var'
  v: string
}

export interface EmailTemplate {
  id: string
  starter: boolean
  cat: string
  lang: string
  status: 'active' | 'draft' | 'inactive'
  nameEn: string
  nameAr: string
  subject: string
  subjectSegs: TemplateSeg[]
  body: TemplateSeg[]
  wfCount: number
  wfList: string[]
}

export type Locale = 'en' | 'ar'

export interface User {
  id: string
  name?: string | null
  nameAr?: string | null
  email?: string | null
  image?: string | null
  initials?: string | null
  role: string
  status: string
  jobCount: number
  lastActive: Date
}
