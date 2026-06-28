'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Phone, Sparkles, Clock, CheckCircle2, MicOff } from 'lucide-react'
import { candidates, jobs } from '@/lib/mock-data'

export default function ScreeningPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'

  const screeningCandidates = candidates.filter(c => c.stage === 'screening')

  const screeningData = [
    { candidate: candidates[2], jobId: 'j1', status: 'scheduled', schedEn: 'Today · 3:00 PM', schedAr: 'اليوم · 3:00 م', durationEn: '30 min', durationAr: '30 دقيقة' },
    { candidate: candidates[6], jobId: 'j2', status: 'scheduled', schedEn: 'Tomorrow · 10:00 AM', schedAr: 'غداً · 10:00 ص', durationEn: '30 min', durationAr: '30 دقيقة' },
    { candidate: candidates[10], jobId: 'j5', status: 'completed', schedEn: 'Yesterday', schedAr: 'أمس', durationEn: '28 min', durationAr: '28 دقيقة' },
  ]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('nav.screening')}</h1>
          <div className="page-sub">{isAr ? 'مكالمات الفرز بالذكاء الاصطناعي' : 'AI-powered screening calls'}</div>
        </div>
        <div style={{ flex: 1 }} />
        <span className="badge badge-ai"><Sparkles size={11} fill="currentColor" /> {t('common.poweredAi')}</span>
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--gap)' }}>
        {[
          { icon: Phone, label: isAr ? 'مكالمات اليوم' : 'Today\'s Calls', value: 4, color: 'var(--accent)' },
          { icon: CheckCircle2, label: isAr ? 'مكتملة' : 'Completed', value: 12, color: 'var(--success)' },
          { icon: Clock, label: isAr ? 'مجدولة' : 'Scheduled', value: 8, color: 'var(--info)' },
          { icon: MicOff, label: isAr ? 'لم يُجب' : 'No Answer', value: 3, color: 'var(--warning)' },
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

      {/* Screening calls list */}
      <div className="card">
        <div className="card-head">
          <h3>{isAr ? 'مكالمات الفرز' : 'Screening Calls'}</h3>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>{isAr ? 'المرشح' : 'Candidate'}</th>
              <th>{isAr ? 'الوظيفة' : 'Job'}</th>
              <th>{isAr ? 'الجدول' : 'Schedule'}</th>
              <th>{isAr ? 'المدة' : 'Duration'}</th>
              <th>{isAr ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {screeningData.map((row, i) => {
              const job = jobs.find(j => j.id === row.jobId)
              return (
                <tr key={i}>
                  <td>
                    <Link href={`/${locale}/candidates/${row.candidate.id}`} className="flex" style={{ alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
                      <div className="avatar" style={{ width: 34, height: 34, background: row.candidate.avatarColor, fontSize: 13 }}>{row.candidate.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{isAr ? row.candidate.nameAr : row.candidate.nameEn}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{isAr ? row.candidate.titleAr : row.candidate.titleEn}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ fontSize: 13 }}>{job ? (isAr ? job.titleAr : job.titleEn) : '—'}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{isAr ? row.schedAr : row.schedEn}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{isAr ? row.durationAr : row.durationEn}</td>
                  <td>
                    <span className={`badge ${row.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                      {row.status === 'completed' ? (isAr ? 'مكتملة' : 'Completed') : (isAr ? 'مجدولة' : 'Scheduled')}
                    </span>
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
