'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BarChart2, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react'
import { candidates, jobs } from '@/lib/mock-data'

export default function AssessmentsPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'

  const assessed = candidates.filter(c => c.assess > 0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('nav.assessments')}</h1>
          <div className="page-sub">{t('as.sub')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <span className="badge badge-ai"><Sparkles size={11} fill="currentColor" /> {t('common.poweredAi')}</span>
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--gap)' }}>
        {[
          { icon: BarChart2, label: isAr ? 'إجمالي التقييمات' : 'Total Assessments', value: assessed.length, color: 'var(--accent)' },
          { icon: CheckCircle2, label: t('as.pass'), value: assessed.filter(c => c.assess >= 85).length, color: 'var(--success)' },
          { icon: AlertCircle, label: t('as.review'), value: assessed.filter(c => c.assess >= 70 && c.assess < 85).length, color: 'var(--warning)' },
          { icon: Clock, label: isAr ? 'بانتظار التقييم' : 'Pending Assessment', value: 14, color: 'var(--info)' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="card card-pad">
              <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={16} style={{ color: s.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{s.label}</span>
              </div>
              <span className="mono tnum" style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          )
        })}
      </div>

      {/* Assessment results table */}
      <div className="card">
        <div className="card-head">
          <h3>{t('as.ranking')}</h3>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>{isAr ? 'المرشح' : 'Candidate'}</th>
              <th>{isAr ? 'الوظيفة' : 'Job'}</th>
              <th>{t('as.overall')}</th>
              <th>{t('as.recommendation')}</th>
              <th>{t('as.percentile')}</th>
            </tr>
          </thead>
          <tbody>
            {assessed.sort((a, b) => b.assess - a.assess).map(c => {
              const job = jobs.find(j => j.id === c.jobId)
              const rec = c.assess >= 85 ? 'pass' : 'review'
              return (
                <tr key={c.id}>
                  <td>
                    <Link href={`/${locale}/candidates/${c.id}`} className="flex" style={{ alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
                      <div className="avatar" style={{ width: 34, height: 34, background: c.avatarColor, fontSize: 13 }}>{c.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{isAr ? c.nameAr : c.nameEn}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{isAr ? c.titleAr : c.titleEn}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{job ? (isAr ? job.titleAr : job.titleEn) : '—'}</td>
                  <td>
                    <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: c.assess + '%', height: '100%', background: c.assess >= 85 ? 'var(--success)' : 'var(--warning)', borderRadius: 3 }} />
                      </div>
                      <span className="mono" style={{ fontWeight: 600 }}>{c.assess}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${rec === 'pass' ? 'badge-success' : 'badge-warning'}`}>
                      {rec === 'pass' ? t('as.pass') : t('as.review')}
                    </span>
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: 12 }}>{c.percentile}th</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
