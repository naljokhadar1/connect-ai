'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Gift, Sparkles, Clock, CheckCircle2, Send, FileText, AlertCircle } from 'lucide-react'
import { candidates, jobs } from '@/lib/mock-data'

const OFFERS = [
  { candidateId: 'c10', jobId: 'j4', status: 'pending', baseSalary: '18,000', housing: '4,000', transport: '1,200', startDateEn: '1 Aug 2026', startDateAr: '1 أغسطس 2026', approvalStepEn: 'Awaiting HR Director', approvalStepAr: 'بانتظار مدير الموارد البشرية' },
  { candidateId: 'c1', jobId: 'j1', status: 'draft', baseSalary: '32,000', housing: '8,000', transport: '2,000', startDateEn: '15 Aug 2026', startDateAr: '15 أغسطس 2026', approvalStepEn: null, approvalStepAr: null },
]

const STATUS_MAP: Record<string, { badge: string; labelEn: string; labelAr: string }> = {
  draft: { badge: 'badge-neutral', labelEn: 'Draft', labelAr: 'مسودة' },
  pending: { badge: 'badge-warning', labelEn: 'Pending Approval', labelAr: 'بانتظار الاعتماد' },
  sent: { badge: 'badge-info', labelEn: 'Sent', labelAr: 'مُرسل' },
  accepted: { badge: 'badge-success', labelEn: 'Accepted', labelAr: 'مقبول' },
  rejected: { badge: 'badge-danger', labelEn: 'Declined', labelAr: 'مرفوض' },
}

export default function OffersPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('of.title')}</h1>
          <div className="page-sub">{t('of.sub')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary">
          <Gift size={16} />{t('of.generate')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--gap)' }}>
        {[
          { icon: FileText, label: isAr ? 'إجمالي العروض' : 'Total Offers', value: 5, color: 'var(--accent)' },
          { icon: Clock, label: t('of.status.pending'), value: 2, color: 'var(--warning)' },
          { icon: Send, label: t('of.status.sent'), value: 1, color: 'var(--info)' },
          { icon: CheckCircle2, label: t('of.status.accepted'), value: 2, color: 'var(--success)' },
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

      {/* Offers list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OFFERS.map((offer, i) => {
          const candidate = candidates.find(c => c.id === offer.candidateId)
          const job = jobs.find(j => j.id === offer.jobId)
          if (!candidate || !job) return null
          const statusInfo = STATUS_MAP[offer.status] || STATUS_MAP.draft

          return (
            <div key={i} className="card card-pad">
              <div className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                <div className="avatar" style={{ width: 48, height: 48, background: candidate.avatarColor, fontSize: 18, flex: '0 0 auto' }}>
                  {candidate.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex" style={{ alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{isAr ? candidate.nameAr : candidate.nameEn}</span>
                    <span className={`badge ${statusInfo.badge}`}>{isAr ? statusInfo.labelAr : statusInfo.labelEn}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>{isAr ? job.titleAr : job.titleEn}</div>

                  <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { label: t('of.baseSalary'), value: `SAR ${offer.baseSalary}` },
                      { label: t('of.housing'), value: `SAR ${offer.housing}` },
                      { label: t('of.transport'), value: `SAR ${offer.transport}` },
                    ].map((field, j) => (
                      <div key={j} style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 3 }}>{field.label}</div>
                        <div className="mono" style={{ fontWeight: 600 }}>{field.value}</div>
                      </div>
                    ))}
                  </div>

                  {offer.approvalStepEn && (
                    <div className="flex" style={{ alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12.5, color: 'var(--warning)' }}>
                      <AlertCircle size={14} />
                      {isAr ? offer.approvalStepAr : offer.approvalStepEn}
                    </div>
                  )}
                </div>

                <div className="flex" style={{ gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
                  {offer.status === 'draft' && (
                    <button className="btn btn-primary btn-sm">
                      <Send size={13} />{t('of.send')}
                    </button>
                  )}
                  <Link href={`/${locale}/candidates/${candidate.id}`} className="btn btn-ghost btn-sm">
                    {isAr ? 'فتح الملف' : 'Open Profile'}
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
