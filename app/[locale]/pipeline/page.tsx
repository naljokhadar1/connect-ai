'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Clock, ChevronRight, Briefcase, AlertTriangle, Plus } from 'lucide-react'
import { candidates, jobs, stages } from '@/lib/mock-data'
import type { Candidate } from '@/types'

const PIPE_STAGES = ['applied', 'screening', 'assessment', 'aiInterview', 'hrInterview', 'offer', 'hired'] as const
type PipeStage = typeof PIPE_STAGES[number]

function matchColor(match: number) {
  if (match >= 85) return 'var(--success)'
  if (match >= 70) return 'var(--accent)'
  if (match >= 50) return 'var(--warning)'
  return 'var(--danger)'
}

function MatchPill({ value }: { value: number }) {
  const color = matchColor(value)
  return (
    <span className="mono" style={{
      fontSize: 12,
      fontWeight: 700,
      color,
      background: `color-mix(in oklch, ${color} 13%, var(--surface))`,
      borderRadius: 6,
      padding: '2px 7px',
      whiteSpace: 'nowrap',
    }}>
      {value}%
    </span>
  )
}

function CandidateCard({
  candidate,
  locale,
  isAr,
  stageColor,
}: {
  candidate: Candidate
  locale: string
  isAr: boolean
  stageColor: string
}) {
  const stuck = candidate.applied > 5
  const veryStuck = candidate.applied > 10

  return (
    <Link
      href={`/${locale}/candidates/${candidate.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        className="card card-pad"
        style={{
          padding: 13,
          cursor: 'pointer',
          transition: 'box-shadow 0.15s',
        }}
      >
        <div className="flex" style={{ gap: 10, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div
            className="avatar"
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: candidate.avatarColor ?? 'var(--accent)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              flex: '0 0 auto',
            }}
          >
            {candidate.initials}
          </div>

          {/* Name + title */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isAr ? candidate.nameAr : candidate.nameEn}
            </div>
            <div className="faint" style={{ fontSize: 11.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isAr ? candidate.titleAr : candidate.titleEn}
            </div>
          </div>

          {/* Match */}
          <MatchPill value={candidate.match} />
        </div>

        {/* Footer row */}
        <div className="flex" style={{ alignItems: 'center', gap: 8, marginTop: 10 }}>
          {/* Stage dot */}
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: stageColor,
            flex: '0 0 auto',
          }} />

          {/* Applied days */}
          <span
            className="faint"
            style={{
              fontSize: 11,
              marginInlineStart: 'auto',
              color: veryStuck ? 'var(--danger)' : stuck ? 'var(--warning)' : 'var(--text-3)',
              fontWeight: stuck ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {stuck && <AlertTriangle size={10} />}
            <Clock size={11} style={{ verticalAlign: '-2px' }} />
            {' '}{candidate.applied}{isAr ? 'ي' : 'd'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function PipelinePage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'

  const [jobFilter, setJobFilter] = useState<string>('all')
  const [query, setQuery] = useState('')

  const getStageColor = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId)
    return stage?.color ?? 'var(--text-3)'
  }

  const jobsWithCandidates = jobs.filter(j => candidates.some(c => c.jobId === j.id))

  const visible = candidates.filter(c => {
    const matchesJob = jobFilter === 'all' || c.jobId === jobFilter
    const matchesQuery = !query ||
      (isAr ? c.nameAr : c.nameEn).toLowerCase().includes(query.toLowerCase()) ||
      (isAr ? c.titleAr : c.titleEn).toLowerCase().includes(query.toLowerCase())
    return matchesJob && matchesQuery
  })

  const byStage = (stage: string) =>
    visible.filter(c => c.stage === stage).sort((a, b) => b.match - a.match)

  const selectedJob = jobFilter !== 'all' ? jobs.find(j => j.id === jobFilter) : null

  return (
    <div className="page" style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page header */}
      <div className="page-head" style={{ marginBottom: 12 }}>
        <div>
          <h1 className="page-title">{t('pipe.title')}</h1>
          <div className="page-sub">{t('pipe.sub')}</div>
        </div>
        <div className="spacer" />

        {/* Search */}
        <div className="searchbar" style={{ height: 38, width: 240 }}>
          <Search size={15} />
          <input
            value={query}
            onChange={(e: { target: HTMLInputElement }) => setQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن مرشحين…' : 'Search candidates…'}
          />
        </div>

        {/* Job filter */}
        <select
          className="select"
          style={{ width: 'auto', minWidth: 170, height: 38 }}
          value={jobFilter}
          onChange={(e: { target: HTMLSelectElement }) => setJobFilter(e.target.value)}
        >
          <option value="all">{isAr ? 'جميع الوظائف' : 'All jobs'}</option>
          {jobsWithCandidates.map(j => (
            <option key={j.id} value={j.id}>
              {isAr ? j.titleAr : j.titleEn}
            </option>
          ))}
        </select>
      </div>

      {/* Context strip */}
      {jobFilter === 'all' ? (
        <div className="flex" style={{ alignItems: 'center', gap: 9, padding: '8px 12px', background: 'var(--ai-soft)', borderRadius: 'var(--r-sm)', marginBottom: 12 }}>
          <AlertTriangle size={14} style={{ color: 'var(--ai)', flex: '0 0 auto' }} />
          <span style={{ fontSize: 12.5, flex: 1, color: 'var(--text-2)' }}>
            {isAr
              ? 'عرض المرشحين عبر كل الوظائف. درجات التطابق خاصة بكل وظيفة — المقارنة بينها قد تكون مضلّلة.'
              : 'Showing candidates across all active jobs. AI match scores are job-specific — comparing across jobs may mislead.'
            }
          </span>
        </div>
      ) : selectedJob && (
        <div className="flex" style={{ alignItems: 'center', gap: 9, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', marginBottom: 12, border: '1px solid var(--border)' }}>
          <Briefcase size={14} style={{ color: 'var(--accent)', flex: '0 0 auto' }} />
          <span style={{ fontSize: 12.5, flex: 1 }}>
            <b>{isAr ? selectedJob.titleAr : selectedJob.titleEn}</b>
            {' · '}
            {visible.length} {isAr ? 'في المسار' : 'in pipeline'}
          </span>
          <Link
            href={`/${locale}/jobs`}
            style={{ fontSize: 12, color: 'var(--accent)' }}
          >
            {isAr ? 'تفاصيل الوظيفة' : 'View job details'} ↗
          </Link>
        </div>
      )}

      {/* Kanban board */}
      <div
        className="flex"
        style={{
          gap: 12,
          overflowX: 'auto',
          flex: 1,
          paddingBottom: 16,
          alignItems: 'flex-start',
        }}
      >
        {PIPE_STAGES.map(stage => {
          const items = byStage(stage)
          const stageColor = getStageColor(stage)
          const isHired = stage === 'hired'
          const readyCount = items.filter(c => c.match >= 85).length
          const stuckCount = items.filter(c => c.applied > 5).length

          return (
            <div
              key={stage}
              style={{
                flex: '0 0 272px',
                minWidth: 272,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Column header */}
              <div className="flex" style={{ alignItems: 'center', gap: 8, padding: '0 6px 8px' }}>
                <span
                  className="badge"
                  style={{
                    background: `color-mix(in oklch, ${stageColor} 14%, var(--surface))`,
                    color: stageColor,
                  }}
                >
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: stageColor,
                    display: 'inline-block',
                    marginInlineEnd: 5,
                  }} />
                  {t(`stage.${stage}`)}
                </span>
                <span className="mono faint" style={{ fontSize: 12, fontWeight: 600 }}>
                  {items.length}
                </span>
                <div className="spacer" style={{ flex: 1 }} />
                <button
                  className="icon-btn btn-sm"
                  style={{ width: 26, height: 26 }}
                  title={isAr ? 'إضافة مرشح' : 'Add candidate'}
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Ready / stuck summary */}
              {(readyCount > 0 || stuckCount > 0) && (
                <div className="flex" style={{ gap: 10, padding: '0 6px 8px', fontSize: 11, fontWeight: 600 }}>
                  {readyCount > 0 && (
                    <span style={{ color: 'var(--accent-strong)' }}>
                      ● {readyCount} {isAr ? 'جاهز' : 'ready'}
                    </span>
                  )}
                  {stuckCount > 0 && (
                    <span style={{ color: 'var(--warning)' }}>
                      ⚠ {stuckCount} {isAr ? 'متعثّر' : 'stuck'}
                    </span>
                  )}
                </div>
              )}

              {/* Cards column */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                  padding: '4px 4px 8px',
                  borderRadius: 'var(--r-md)',
                  background: isHired ? 'var(--success-soft)' : 'transparent',
                  minHeight: 80,
                }}
              >
                {items.map((candidate, idx) => (
                  <div
                    key={candidate.id}
                    className="fade-up"
                    style={{ animationDelay: `${idx * 25}ms` }}
                  >
                    <CandidateCard
                      candidate={candidate}
                      locale={locale}
                      isAr={isAr}
                      stageColor={stageColor}
                    />
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="faint" style={{ fontSize: 12, textAlign: 'center', padding: '18px 0' }}>
                    {isAr ? 'لا مرشحين بعد' : 'No candidates yet'}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Rejected column (collapsed) */}
        <div style={{ flex: '0 0 90px', minWidth: 90 }}>
          <div className="flex" style={{ alignItems: 'center', gap: 6, padding: '0 6px 8px', color: 'var(--text-3)' }}>
            <span className="badge badge-danger" style={{ height: 20 }}>
              <span className="b-dot" />
              {isAr ? 'مرفوض' : 'Rejected'}
            </span>
            <ChevronRight size={14} />
          </div>
          <div className="card" style={{ padding: 12, textAlign: 'center', color: 'var(--text-3)', fontSize: 11.5 }}>
            {isAr ? '12 مرفوض هذا الشهر' : '12 rejected this month'}
          </div>
        </div>
      </div>
    </div>
  )
}
