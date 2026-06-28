'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Download, TrendingUp, TrendingDown, Sparkles, ChevronRight, ChevronLeft, Clock, Target, Zap } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { jobs, candidates } from '@/lib/mock-data'

const FUNNEL = [
  { key: 'stage.applied', value: 642, color: 'var(--text-3)' },
  { key: 'stage.screening', value: 318, color: 'var(--info)' },
  { key: 'stage.assessment', value: 196, color: 'var(--purple)' },
  { key: 'stage.aiInterview', value: 112, color: 'var(--ai)' },
  { key: 'stage.offer', value: 38, color: 'var(--warning)' },
  { key: 'stage.hired', value: 21, color: 'var(--success)' },
]

const TREND_DATA = [
  { m: 'Jan', apps: 38, hires: 4 }, { m: 'Feb', apps: 52, hires: 6 },
  { m: 'Mar', apps: 47, hires: 5 }, { m: 'Apr', apps: 63, hires: 7 },
  { m: 'May', apps: 58, hires: 6 }, { m: 'Jun', apps: 72, hires: 8 },
  { m: 'Jul', apps: 84, hires: 9 }, { m: 'Aug', apps: 79, hires: 8 },
  { m: 'Sep', apps: 96, hires: 11 }, { m: 'Oct', apps: 88, hires: 10 },
  { m: 'Nov', apps: 104, hires: 12 }, { m: 'Dec', apps: 112, hires: 14 },
]

const SOURCES = [
  { labelEn: 'LinkedIn', labelAr: 'لينكدإن', value: 38, color: 'var(--accent)' },
  { labelEn: 'Referrals', labelAr: 'الترشيحات', value: 26, color: 'var(--ai)' },
  { labelEn: 'Career Portal', labelAr: 'بوابة التوظيف', value: 18, color: 'var(--purple)' },
  { labelEn: 'Bayt / Indeed', labelAr: 'بيت / إنديد', value: 18, color: 'var(--text-3)' },
]

export default function DashboardPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'
  const Chev = isAr ? ChevronLeft : ChevronRight
  const fmax = FUNNEL[0].value

  const recs = [
    { icon: Target, color: 'var(--accent)', titleEn: '3 strong matches idle in screening', titleAr: '3 مرشحين أقوياء متوقفون في الفرز', descEn: 'Senior Frontend Engineer candidates scoring 86%+ haven\'t advanced in 4 days.', descAr: 'مرشحو مهندس واجهات أول بنسبة 86%+ لم يتقدموا منذ 4 أيام.', ctaEn: 'Review now', ctaAr: 'مراجعة الآن', href: `/${locale}/pipeline` },
    { icon: Zap, color: 'var(--ai)', titleEn: 'Re-engage 12 silver-medalists', titleAr: 'إعادة التواصل مع 12 مرشحاً بديلاً', descEn: 'Past finalists match 2 new open roles in Data & AI.', descAr: 'مرشحون نهائيون سابقون يطابقون وظيفتين جديدتين في البيانات والذكاء.', ctaEn: 'View talent pool', ctaAr: 'عرض المواهب', href: `/${locale}/pipeline` },
    { icon: Clock, color: 'var(--warning)', titleEn: 'Financial Analyst offer expiring', titleAr: 'عرض المحلل المالي ينتهي قريباً', descEn: 'Fatima Al-Shamsi\'s offer needs approval within 2 days.', descAr: 'عرض فاطمة الشامسي يحتاج اعتماداً خلال يومين.', ctaEn: 'Open offers', ctaAr: 'فتح العروض', href: `/${locale}/offers` },
  ]

  const upcomingInterviews = [
    { candidate: candidates[4], roleEn: 'Sr. Frontend Engineer', roleAr: 'مهندس واجهات أول', whenEn: 'Today · 2:30 PM', whenAr: 'اليوم · 2:30 م', typeEn: 'Technical', typeAr: 'تقنية' },
    { candidate: candidates[7], roleEn: 'Data Scientist', roleAr: 'عالم بيانات', whenEn: 'Today · 4:00 PM', whenAr: 'اليوم · 4:00 م', typeEn: 'AI Interview review', typeAr: 'مراجعة مقابلة الذكاء' },
    { candidate: candidates[0], roleEn: 'Senior Product Manager', roleAr: 'مدير منتجات أول', whenEn: 'Tomorrow · 11:00 AM', whenAr: 'غداً · 11:00 ص', typeEn: 'Hiring Manager', typeAr: 'مدير التوظيف' },
  ]

  const attention = [
    { job: jobs[3], reasonEn: 'Offer pending 3 days', reasonAr: 'العرض معلّق منذ 3 أيام', sev: 'warning' },
    { job: jobs[5], reasonEn: '0 candidates in screening', reasonAr: 'لا مرشحين في الفرز', sev: 'danger' },
    { job: jobs[1], reasonEn: '142 unreviewed applicants', reasonAr: '142 متقدماً دون مراجعة', sev: 'info' },
  ]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('dash.greeting')}</h1>
          <div className="page-sub">{t('dash.sub')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div className="seg">
          <button className="on">{t('common.thisQuarter')}</button>
          <button>YTD</button>
        </div>
        <button className="btn btn-ghost">
          <Download size={16} />{t('common.export')}
        </button>
      </div>

      {/* KPI row */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--gap)' }}>
        {[
          { label: t('dash.openJobs'), value: '34', delta: 9, color: 'var(--accent)', sparkData: [20,24,22,28,30,29,34] },
          { label: t('dash.applications'), value: '1,284', delta: 18, color: 'var(--info)', sparkData: [800,920,870,1010,1120,1180,1284] },
          { label: t('dash.inPipeline'), value: '327', delta: 5, color: 'var(--purple)', sparkData: [260,280,300,290,310,320,327] },
          { label: t('dash.aiAccuracy'), value: '94.2%', delta: 3, color: 'var(--ai)', sparkData: [88,89,90,91,92,93,94] },
        ].map((kpi, i) => (
          <div key={i} className="card card-pad" style={{ cursor: 'default' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>{kpi.label}</div>
            <div className="flex" style={{ alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
              <span className="mono tnum" style={{ fontSize: 26, fontWeight: 700, color: kpi.color }}>{kpi.value}</span>
              <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp size={12} />+{kpi.delta}%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={kpi.sparkData.map((v, j) => ({ v, j }))}>
                <Line type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* main grid */}
      <div className="grid" style={{ gridTemplateColumns: '1.55fr 1fr', alignItems: 'start' }}>
        {/* LEFT column */}
        <div className="grid">
          {/* Funnel */}
          <div className="card">
            <div className="card-head">
              <h3>{t('dash.funnel')}</h3>
              <div style={{ flex: 1 }} />
              <span className="badge badge-ai"><Sparkles size={11} fill="currentColor" /> {t('common.poweredAi')}</span>
            </div>
            <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {FUNNEL.map((f, i) => {
                const pct = (f.value / fmax) * 100
                const conv = i ? Math.round((f.value / FUNNEL[i - 1].value) * 100) : 100
                return (
                  <div key={i}>
                    <div className="flex" style={{ alignItems: 'center', gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 104, whiteSpace: 'nowrap' }}>{t(f.key)}</span>
                      <span className="mono tnum" style={{ fontSize: 13, fontWeight: 700 }}>{f.value}</span>
                      {i > 0 && <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{conv}% {isAr ? 'تحويل' : 'conv.'}</span>}
                    </div>
                    <div style={{ height: 26, borderRadius: 7, background: 'var(--surface-3)', overflow: 'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', background: `linear-gradient(90deg, ${f.color}, color-mix(in oklch, ${f.color} 70%, var(--surface)))`, borderRadius: 7 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance trend */}
          <div className="card">
            <div className="card-head">
              <h3>{t('dash.perfTrend')}</h3>
              <div style={{ flex: 1 }} />
              <span className="flex" style={{ gap: 14, fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>
                <span className="flex" style={{ alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--accent)' }} />{t('dash.applications')}
                </span>
                <span className="flex" style={{ alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--success)' }} />{t('stage.hired')}
                </span>
              </span>
            </div>
            <div className="card-pad">
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={TREND_DATA}>
                  <Line type="monotone" dataKey="apps" stroke="var(--accent)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="hires" stroke="var(--success)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* bottom KPIs */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            {[
              { label: t('dash.timeToHire'), value: '28', unit: t('common.days'), delta: -12 },
              { label: t('dash.costPerHire'), value: '9.4k', unit: 'SAR', delta: -6 },
              { label: t('dash.dropoff'), value: '11', unit: '%', delta: -4 },
            ].map((s, i) => (
              <div key={i} className="card card-pad">
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10 }}>{s.label}</div>
                <div className="flex" style={{ alignItems: 'baseline', gap: 4 }}>
                  <span className="mono tnum" style={{ fontSize: 24, fontWeight: 600 }}>{s.value}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>{s.unit}</span>
                  <span className="mono" style={{ marginInlineStart: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingDown size={12} />{Math.abs(s.delta)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT column */}
        <div className="grid">
          {/* AI recommendations */}
          <div className="card" style={{ background: 'linear-gradient(180deg, var(--ai-soft), var(--surface) 55%)' }}>
            <div className="card-head" style={{ borderColor: 'transparent' }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--ai)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <Sparkles size={17} fill="currentColor" />
              </span>
              <h3>{t('dash.aiRecs')}</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recs.map((r, i) => {
                const Icon = r.icon
                return (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 14 }}>
                    <div className="flex" style={{ gap: 11 }}>
                      <span style={{ width: 30, height: 30, flex: '0 0 auto', borderRadius: 8, display: 'grid', placeItems: 'center', background: `color-mix(in oklch, ${r.color} 14%, var(--surface))`, color: r.color }}>
                        <Icon size={16} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{isAr ? r.titleAr : r.titleEn}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{isAr ? r.descAr : r.descEn}</div>
                        {r.href ? (
                          <Link href={r.href} className="btn btn-sm" style={{ marginTop: 9, padding: '0 10px', color: r.color, background: `color-mix(in oklch, ${r.color} 11%, transparent)` }}>
                            {isAr ? r.ctaAr : r.ctaEn}<Chev size={14} />
                          </Link>
                        ) : (
                          <button className="btn btn-sm" style={{ marginTop: 9, padding: '0 10px', color: r.color, background: `color-mix(in oklch, ${r.color} 11%, transparent)` }}>
                            {isAr ? r.ctaAr : r.ctaEn}<Chev size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming interviews */}
          <div className="card">
            <div className="card-head">
              <h3>{t('dash.upcoming')}</h3>
              <div style={{ flex: 1 }} />
              <Link href={`/${locale}/interviews`} className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{t('common.viewAll')}</Link>
            </div>
            <div style={{ padding: '6px 8px' }}>
              {upcomingInterviews.map((iv, i) => (
                <Link key={i} href={`/${locale}/candidates/${iv.candidate.id}`} className="flex" style={{ alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 'var(--r-sm)', textDecoration: 'none', color: 'inherit' }}>
                  <div className="avatar" style={{ width: 38, height: 38, background: iv.candidate.avatarColor, fontSize: 15, flex: '0 0 auto' }}>
                    {iv.candidate.initials}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{isAr ? iv.candidate.nameAr : iv.candidate.nameEn}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{isAr ? iv.roleAr : iv.roleEn} · {isAr ? iv.typeAr : iv.typeEn}</div>
                  </div>
                  <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                    <div className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)' }}>{isAr ? iv.whenAr : iv.whenEn}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Source of hire */}
          <div className="card card-pad">
            <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: 16 }}>{t('dash.sourceOfHire')}</h3>
            <div className="flex" style={{ gap: 18, alignItems: 'center' }}>
              <div style={{ width: 118, height: 118, flex: '0 0 auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={SOURCES} dataKey="value" innerRadius={35} outerRadius={55} strokeWidth={0}>
                      {SOURCES.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {SOURCES.map((s, i) => (
                  <div key={i} className="flex" style={{ alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color }} />
                    <span style={{ flex: 1, fontWeight: 500 }}>{isAr ? s.labelAr : s.labelEn}</span>
                    <span className="mono" style={{ fontWeight: 600 }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <hr className="divider" style={{ margin: '16px 0' }} />
            <div className="flex" style={{ alignItems: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, flex: '0 0 auto' }}>
                <svg viewBox="0 0 52 52" width="52" height="52">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="var(--surface-3)" strokeWidth="5" />
                  <circle cx="26" cy="26" r="22" fill="none" stroke="var(--success)" strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 22 * 0.72} ${2 * Math.PI * 22}`}
                    strokeDashoffset={2 * Math.PI * 22 * 0.25}
                    strokeLinecap="round" transform="rotate(-90 26 26)" />
                  <text x="26" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">72%</text>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t('dash.saudization')}</div>
                <div className="faint" style={{ fontSize: 12 }}>{isAr ? 'الهدف 70% · نمتثل' : 'Target 70% · compliant'}</div>
              </div>
              <div style={{ flex: 1 }} />
              <span className="badge badge-success">{isAr ? 'ممتثل' : 'On track'}</span>
            </div>
          </div>

          {/* Jobs needing attention */}
          <div className="card">
            <div className="card-head"><h3>{t('dash.attention')}</h3></div>
            <div style={{ padding: '6px 8px' }}>
              {attention.map((a, i) => (
                <Link key={i} href={`/${locale}/pipeline`} className="flex" style={{ alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 'var(--r-sm)', textDecoration: 'none', color: 'inherit' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${a.sev})`, flex: '0 0 auto' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{isAr ? a.job.titleAr : a.job.titleEn}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{isAr ? a.reasonAr : a.reasonEn}</div>
                  </div>
                  <Chev size={16} style={{ color: 'var(--text-3)' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
