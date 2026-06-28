'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { List, LayoutGrid, BarChart2, Plus, Search, Filter, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { jobs, departments, stages } from '@/lib/mock-data'
import type { Job } from '@/types'

const ANALYTICS_DEPT_DATA = [
  { labelEn: 'Eng', labelAr: 'الهندسة', v: 215 },
  { labelEn: 'Product', labelAr: 'المنتجات', v: 127 },
  { labelEn: 'Data', labelAr: 'البيانات', v: 128 },
  { labelEn: 'Finance', labelAr: 'المالية', v: 98 },
  { labelEn: 'Mktg', labelAr: 'التسويق', v: 41 },
]

const ANALYTICS_TTH = [
  { labelEn: 'Engineering', labelAr: 'الهندسة', v: 34, max: 45 },
  { labelEn: 'Product', labelAr: 'المنتجات', v: 28, max: 45 },
  { labelEn: 'Data & AI', labelAr: 'البيانات والذكاء', v: 41, max: 45 },
  { labelEn: 'Finance', labelAr: 'المالية', v: 22, max: 45 },
  { labelEn: 'Marketing', labelAr: 'التسويق', v: 19, max: 45 },
]

type View = 'list' | 'board' | 'analytics'
type JobStatus = Job['status']

export default function JobsPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'

  const router = useRouter()
  const [view, setView] = useState<View>('list')
  const [query, setQuery] = useState('')

  const getDept = (deptId: string) => departments.find(d => d.id === deptId)
  const getStage = (stageId: string) => stages.find(s => s.id === stageId)

  const filtered = jobs.filter(j =>
    !query ||
    (isAr ? j.titleAr : j.titleEn).toLowerCase().includes(query.toLowerCase())
  )

  const statusBadgeClass: Record<JobStatus, string> = {
    open: 'badge badge-success',
    closing: 'badge badge-warning',
    draft: 'badge badge-neutral',
    onhold: 'badge badge-info',
  }

  const statusLabel = (s: JobStatus) => {
    const map: Record<JobStatus, string> = {
      open: t('jobs.status.open'),
      closing: t('jobs.status.closing'),
      draft: t('jobs.status.draft'),
      onhold: t('jobs.status.onhold'),
    }
    return map[s]
  }

  const StatusBadge = ({ status }: { status: JobStatus }) => (
    <span className={statusBadgeClass[status]}>
      <span className="b-dot" />
      {statusLabel(status)}
    </span>
  )

  const StageDot = ({ stageId }: { stageId: string }) => {
    const stage = getStage(stageId)
    if (!stage) return <span className="faint">—</span>
    return (
      <span className="badge" style={{ background: `color-mix(in oklch, ${stage.color} 14%, var(--surface))`, color: stage.color }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: stage.color, display: 'inline-block', marginInlineEnd: 5 }} />
        {t(`stage.${stageId}`)}
      </span>
    )
  }

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('jobs.title')}</h1>
          <div className="page-sub">{t('jobs.sub')}</div>
        </div>
        <div className="spacer" />
        <div className="seg">
          <button
            className={view === 'list' ? 'on' : ''}
            onClick={() => setView('list')}
          >
            <List size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 5 }} />
            {t('jobs.list')}
          </button>
          <button
            className={view === 'board' ? 'on' : ''}
            onClick={() => setView('board')}
          >
            <LayoutGrid size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 5 }} />
            {t('jobs.kanban')}
          </button>
          <button
            className={view === 'analytics' ? 'on' : ''}
            onClick={() => setView('analytics')}
          >
            <BarChart2 size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 5 }} />
            {t('jobs.analytics')}
          </button>
        </div>
        <Link href={`/${locale}/jobs/new`} className="btn btn-primary">
          <Plus size={17} />
          {t('jobs.create')}
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex" style={{ gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div className="searchbar" style={{ maxWidth: 320, height: 38 }}>
          <Search size={16} />
          <input
            value={query}
            onChange={(e: { target: HTMLInputElement }) => setQuery(e.target.value)}
            placeholder={t('common.search') + '…'}
          />
        </div>
        <button className="btn btn-ghost btn-sm">
          <Filter size={15} />
          {t('common.filter')}
        </button>
        <div className="spacer" style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 13 }}>
          {filtered.length} {isAr ? 'وظيفة' : 'jobs'}
        </span>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>{t('jobs.col.job')}</th>
                <th>{t('jobs.col.dept')}</th>
                <th>{t('jobs.col.candidates')}</th>
                <th>{t('jobs.col.stage')}</th>
                <th>{t('jobs.col.manager')}</th>
                <th>{t('jobs.col.status')}</th>
                <th>{t('jobs.col.posted')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => {
                const dept = getDept(job.deptId)
                return (
                  <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/${locale}/jobs/${job.id}`)}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {isAr ? job.titleAr : job.titleEn}
                      </div>
                      <div className="faint" style={{ fontSize: 12 }}>
                        {isAr ? job.locAr : job.locEn}
                        {' · '}
                        {isAr ? job.typeAr : job.typeEn}
                        {' · '}
                        {job.grade}
                        {' · '}
                        {job.openings} {t('jobs.openings')}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">
                        {dept ? (isAr ? dept.nameAr : dept.nameEn) : job.deptId}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ fontWeight: 600 }}>{job.applicants}</span>
                    </td>
                    <td>
                      {job.status === 'draft'
                        ? <span className="faint">—</span>
                        : job.topStage
                          ? <StageDot stageId={job.topStage} />
                          : <span className="faint">—</span>
                      }
                    </td>
                    <td>
                      <span style={{ fontSize: 13 }}>
                        {isAr ? job.mgrAr : job.mgrEn}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <span className="faint mono" style={{ fontSize: 12.5 }}>
                        {job.posted ? `${job.posted}${isAr ? 'ي' : 'd'}` : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Board view */}
      {view === 'board' && (
        <div className="flex" style={{ gap: 14, overflowX: 'auto', paddingBottom: 10 }}>
          {(['open', 'closing', 'onhold', 'draft'] as JobStatus[]).map(st => {
            const col = filtered.filter(j => j.status === st)
            return (
              <div key={st} style={{ flex: '0 0 280px', minWidth: 280 }}>
                <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 10, padding: '0 4px' }}>
                  <StatusBadge status={st} />
                  <span className="mono faint" style={{ fontSize: 12 }}>{col.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.map(job => {
                    const dept = getDept(job.deptId)
                    return (
                      <div key={job.id} className="card card-pad" style={{ cursor: 'pointer' }} onClick={() => router.push(`/${locale}/jobs/${job.id}`)}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          {isAr ? job.titleAr : job.titleEn}
                        </div>
                        <div className="faint" style={{ fontSize: 12, marginBottom: 10 }}>
                          {dept ? (isAr ? dept.nameAr : dept.nameEn) : job.deptId}
                          {' · '}
                          {isAr ? job.locAr : job.locEn}
                        </div>
                        <div className="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="mono" style={{ fontSize: 12.5, fontWeight: 600 }}>
                            <Users size={13} style={{ verticalAlign: '-2px' }} /> {job.applicants}
                          </span>
                          <span className="faint" style={{ fontSize: 12 }}>
                            {job.openings} {t('jobs.openings')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {col.length === 0 && (
                    <div className="faint" style={{ fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
                      {isAr ? 'لا وظائف' : 'No jobs'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Analytics view */}
      {view === 'analytics' && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="card">
            <div className="card-head">
              <h3>{isAr ? 'الطلبات حسب القسم' : 'Applications by Department'}</h3>
            </div>
            <div className="card-pad">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ANALYTICS_DEPT_DATA.map(d => ({ label: isAr ? d.labelAr : d.labelEn, v: d.v }))}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: 'var(--surface-2)' }}
                  />
                  <Bar dataKey="v" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>{isAr ? 'متوسط مدة التوظيف حسب القسم' : 'Avg. Time to Hire by Dept'}</h3>
            </div>
            <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ANALYTICS_TTH.map((d, i) => (
                <div key={i}>
                  <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ fontWeight: 500 }}>{isAr ? d.labelAr : d.labelEn}</span>
                    <span className="mono" style={{ fontWeight: 600 }}>
                      {d.v} {t('common.days')}
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-3)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(d.v / d.max) * 100}%`,
                      height: '100%',
                      background: d.v > 35 ? 'var(--warning)' : 'var(--accent)',
                      borderRadius: 4,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
