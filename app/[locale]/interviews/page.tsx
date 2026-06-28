'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Video, Sparkles, Play, Clock } from 'lucide-react'
import { candidates, jobs } from '@/lib/mock-data'

export default function InterviewsPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'

  const videoInterviews = candidates.filter(c => c.video > 0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('nav.interviews')}</h1>
          <div className="page-sub">{t('vi.sub')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <span className="badge badge-ai"><Sparkles size={11} fill="currentColor" /> {t('common.poweredAi')}</span>
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--gap)' }}>
        {[
          { icon: Video, label: isAr ? 'مقابلات مكتملة' : 'Completed Interviews', value: videoInterviews.length, color: 'var(--accent)' },
          { icon: Sparkles, label: isAr ? 'متوسط النتيجة' : 'Avg AI Score', value: Math.round(videoInterviews.reduce((sum, c) => sum + c.video, 0) / videoInterviews.length), color: 'var(--ai)' },
          { icon: Clock, label: isAr ? 'بانتظار المراجعة' : 'Pending Review', value: 6, color: 'var(--warning)' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="card card-pad">
              <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={16} style={{ color: s.color }} fill={s.icon === Sparkles ? 'currentColor' : 'none'} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{s.label}</span>
              </div>
              <span className="mono tnum" style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          )
        })}
      </div>

      {/* Interview cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {videoInterviews.map(c => {
          const job = jobs.find(j => j.id === c.jobId)
          return (
            <div key={c.id} className="card">
              <div className="card-pad" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div className="avatar" style={{ width: 48, height: 48, background: c.avatarColor, fontSize: 18, flex: '0 0 auto' }}>
                  {c.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{isAr ? c.nameAr : c.nameEn}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>{job ? (isAr ? job.titleAr : job.titleEn) : '—'}</div>

                  <div className="flex" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    <span className="badge badge-ai"><Sparkles size={10} fill="currentColor" /> {t('vi.aiScore')}: {c.video}</span>
                    <span className="badge badge-neutral">{c.percentile}th {t('as.percentile')}</span>
                  </div>

                  {/* Competency mini-bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { label: t('vi.communication'), val: Math.round(c.video * 0.98) },
                      { label: t('vi.confidence'), val: Math.round(c.video * 0.94) },
                      { label: t('vi.relevance'), val: Math.round(c.video * 1.02) },
                    ].map((comp, i) => (
                      <div key={i} className="flex" style={{ alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <span style={{ minWidth: 110, color: 'var(--text-2)', fontWeight: 500 }}>{comp.label}</span>
                        <div style={{ flex: 1, height: 5, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: Math.min(comp.val, 100) + '%', height: '100%', background: 'var(--ai)', borderRadius: 3 }} />
                        </div>
                        <span className="mono" style={{ fontWeight: 600, fontSize: 11, minWidth: 24 }}>{comp.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                <Link href={`/${locale}/candidates/${c.id}`} className="btn btn-sm btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Play size={13} />{isAr ? 'مشاهدة المقابلة' : 'Watch Interview'}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
