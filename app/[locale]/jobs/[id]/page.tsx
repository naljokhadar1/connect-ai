'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, Briefcase, MapPin, Users, GitBranch,
  Clock, Edit, Share2, Pause, Plus,
} from 'lucide-react'
import { jobs, candidates, departments } from '@/lib/mock-data'

export default function JobDetailPage() {
  const t = useTranslations()
  const { locale, id } = useParams<{ locale: string; id: string }>()
  const router = useRouter()
  const isAr = locale === 'ar'
  const ChevBack = isAr ? ChevronRight : ChevronLeft

  const job = jobs.find(j => j.id === id) || jobs[0]
  const dept = departments.find(d => d.id === job.deptId)
  const jobCandidates = candidates.filter(c => c.jobId === job.id)

  const statusBadge: Record<string, string> = {
    open: 'badge-success', closing: 'badge-warning', draft: 'badge-neutral', onhold: 'badge-info',
  }

  return (
    <div className="page">
      <div className="page-head">
        <button className="btn btn-ghost" onClick={() => router.back()}>
          <ChevBack size={16} />{t('common.back')}
        </button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost btn-sm"><Share2 size={14} />{isAr ? 'مشاركة' : 'Share'}</button>
        <button className="btn btn-ghost btn-sm"><Pause size={14} />{isAr ? 'إيقاف' : 'Pause'}</button>
        <button className="btn btn-primary btn-sm"><Edit size={14} />{isAr ? 'تعديل' : 'Edit Job'}</button>
      </div>

      {/* Job header */}
      <div className="card card-pad" style={{ marginBottom: 'var(--gap)' }}>
        <div className="flex" style={{ alignItems: 'flex-start', gap: 16 }}>
          <span style={{
            width: 48, height: 48, borderRadius: 12, flex: '0 0 auto',
            display: 'grid', placeItems: 'center',
            background: 'var(--accent-soft)', color: 'var(--accent)',
          }}>
            <Briefcase size={22} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="flex" style={{ alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700 }}>{isAr ? job.titleAr : job.titleEn}</h1>
              <span className={`badge ${statusBadge[job.status] ?? 'badge-neutral'}`}>
                <span className="b-dot" />
                {job.status === 'open' ? (isAr ? 'مفتوحة' : 'Open')
                  : job.status === 'closing' ? (isAr ? 'تقترب من الإغلاق' : 'Closing soon')
                  : job.status === 'draft' ? (isAr ? 'مسودة' : 'Draft')
                  : (isAr ? 'معلّقة' : 'On hold')}
              </span>
            </div>
            <div className="flex" style={{ gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-2)' }}>
              <span className="flex" style={{ alignItems: 'center', gap: 5 }}>
                <Briefcase size={13} />{dept ? (isAr ? dept.nameAr : dept.nameEn) : job.deptId}
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: 5 }}>
                <MapPin size={13} />{isAr ? job.locAr : job.locEn}
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: 5 }}>
                <Users size={13} />{job.openings} {isAr ? 'شاغر' : 'openings'}
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: 5 }}>
                <Clock size={13} />{isAr ? `${job.posted ?? 0}ي` : `${job.posted ?? 0}d ago`}
              </span>
            </div>
          </div>
          <div style={{ textAlign: isAr ? 'left' : 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 2 }}>{isAr ? 'الراتب' : 'Salary range'}</div>
            <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>SAR {job.salary}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{job.grade} · {isAr ? job.typeAr : job.typeEn}</div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 300px', alignItems: 'start' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          {/* Candidates */}
          <div className="card">
            <div className="card-head">
              <h3>{isAr ? 'المرشحون' : 'Candidates'}</h3>
              <div style={{ flex: 1 }} />
              <span className="mono faint" style={{ fontSize: 13 }}>{jobCandidates.length}</span>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>{isAr ? 'الاسم' : 'Name'}</th>
                  <th>{isAr ? 'المرحلة' : 'Stage'}</th>
                  <th>{isAr ? 'التوافق' : 'Match'}</th>
                  <th>{isAr ? 'مقدّم منذ' : 'Applied'}</th>
                </tr>
              </thead>
              <tbody>
                {jobCandidates.map(c => (
                  <tr
                    key={c.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/${locale}/candidates/${c.id}`)}
                  >
                    <td>
                      <div className="flex" style={{ alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 34, height: 34, background: c.avatarColor, fontSize: 13 }}>
                          {isAr ? c.initials : c.nameEn.split(' ').slice(0,2).map((w: string) => w[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{isAr ? c.nameAr : c.nameEn}</div>
                          <div className="faint" style={{ fontSize: 11.5 }}>{isAr ? c.titleAr : c.titleEn}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: 11.5 }}>
                        {c.stage}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ fontWeight: 700, color: c.match >= 85 ? 'var(--success)' : 'var(--warning)' }}>
                        {c.match}%
                      </span>
                    </td>
                    <td className="faint mono" style={{ fontSize: 12 }}>
                      {c.applied}{isAr ? 'ي' : 'd'}
                    </td>
                  </tr>
                ))}
                {jobCandidates.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-3)', fontSize: 13 }}>
                      {isAr ? 'لا مرشحين بعد' : 'No candidates yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          {/* Quick stats */}
          <div className="card card-pad">
            <h3 style={{ marginBottom: 14, fontSize: 14 }}>{isAr ? 'إحصائيات' : 'Overview'}</h3>
            {[
              { label: isAr ? 'إجمالي المتقدمين' : 'Total applicants', value: job.applicants },
              { label: isAr ? 'في المسار' : 'In pipeline', value: jobCandidates.length },
              { label: isAr ? 'مدير التوظيف' : 'Hiring manager', value: isAr ? job.mgrAr : job.mgrEn, mono: false },
            ].map((row, i) => (
              <div key={i} className="flex" style={{ alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                <span className="faint" style={{ flex: 1 }}>{row.label}</span>
                <span className={row.mono === false ? '' : 'mono'} style={{ fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Pipeline summary */}
          <div className="card card-pad">
            <div className="flex" style={{ alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, flex: 1 }}>{isAr ? 'ملخص المسار' : 'Pipeline'}</h3>
              <Link href={`/${locale}/pipeline`} style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                {isAr ? 'عرض الكل' : 'View all'}
              </Link>
            </div>
            {[
              { stage: isAr ? 'تقدّم' : 'Applied', count: 2 },
              { stage: isAr ? 'فرز' : 'Screening', count: 3 },
              { stage: isAr ? 'تقييم' : 'Assessment', count: 2 },
              { stage: isAr ? 'مقابلة' : 'Interview', count: 1 },
            ].map((row, i) => (
              <div key={i} className="flex" style={{ alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 12.5 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--surface-3)', overflow: 'hidden' }}>
                  <div style={{ width: `${(row.count / 8) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
                </div>
                <span style={{ minWidth: 60, color: 'var(--text-2)', fontWeight: 500 }}>{row.stage}</span>
                <span className="mono" style={{ fontWeight: 700, minWidth: 16, textAlign: 'right' }}>{row.count}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-subtle" style={{ justifyContent: 'center' }}>
              <Plus size={15} />{isAr ? 'إضافة مرشح' : 'Add candidate'}
            </button>
            <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>
              <GitBranch size={15} />{isAr ? 'تعيين سير عمل' : 'Assign workflow'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
