'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import {
  Mail, Phone, MapPin, Sparkles, ChevronRight, ChevronUp, ChevronDown,
  Briefcase, Globe, Award, User, CheckCircle, XCircle, ArrowUp,
  BookOpen, Star, TrendingUp, AlertCircle
} from 'lucide-react'
import { candidates } from '@/lib/mock-data'

/* ── Score ring ── */
function ScoreRing({ score, size = 88 }: { score: number; size?: number }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const color = score >= 90 ? 'var(--success)' : score >= 75 ? 'var(--accent)' : score >= 60 ? 'var(--warning)' : 'var(--danger)'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="17" fontWeight="700" fill={color}>{score}</text>
    </svg>
  )
}

/* ── Factor bar ── */
function FactorBar({ label, value }: { label: string; value: number }) {
  const color = value >= 90 ? 'var(--success)' : value >= 75 ? 'var(--accent)' : value >= 60 ? 'var(--warning)' : 'var(--danger)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{label}</span>
        <span className="mono" style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 6, borderRadius: 20, background: 'var(--surface-3)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 20 }} />
      </div>
    </div>
  )
}

/* ── Stage badge ── */
const STAGE_COLORS: Record<string, string> = {
  applied: 'var(--text-3)',
  screening: 'var(--info)',
  assessment: 'var(--purple)',
  aiInterview: 'var(--ai)',
  hrInterview: 'var(--accent)',
  techInterview: 'var(--accent)',
  offer: 'var(--warning)',
  hired: 'var(--success)',
}

const STAGE_LABELS: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  assessment: 'Assessment',
  aiInterview: 'AI Interview',
  hrInterview: 'HR Interview',
  techInterview: 'Technical Interview',
  offer: 'Offer',
  hired: 'Hired',
}

const TABS = ['overview', 'cv', 'assessment', 'video', 'feedback', 'activity'] as const
type Tab = typeof TABS[number]

export default function CandidateProfilePage() {
  const t = useTranslations()
  const { locale, id } = useParams<{ locale: string; id: string }>()
  const isAr = locale === 'ar'

  const candidate = candidates.find(c => c.id === id) ?? candidates[0]

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [advanceModal, setAdvanceModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)

  const name = isAr ? candidate.nameAr : candidate.nameEn
  const title = isAr ? candidate.titleEn : candidate.titleEn // only En available
  const loc = isAr ? candidate.locAr : candidate.locEn
  const summary = isAr ? candidate.summaryAr : candidate.summaryEn
  const stageColor = STAGE_COLORS[candidate.stage] ?? 'var(--text-3)'
  const stageLabel = STAGE_LABELS[candidate.stage] ?? candidate.stage

  const scoreColor = candidate.match >= 90 ? 'var(--success)' : candidate.match >= 75 ? 'var(--accent)' : candidate.match >= 60 ? 'var(--warning)' : 'var(--danger)'
  const scoreTier = candidate.match >= 90 ? 'Strong' : candidate.match >= 75 ? 'Good' : candidate.match >= 60 ? 'Possible' : 'Weak'

  const factors = candidate.factors
  const factorEntries = [
    { key: 'mf.skills', value: factors.skills },
    { key: 'mf.experience', value: factors.experience },
    { key: 'mf.education', value: factors.education },
    { key: 'mf.industry', value: factors.industry },
    { key: 'mf.certs', value: factors.certs },
    { key: 'mf.language', value: factors.language },
  ]

  // Use `langs` from mock-data (Candidate type has `langs` in mock but `languages` in type — use whichever is present)
  const langs: Array<{ en: string; ar: string; lvl: string }> = (candidate as any).langs ?? []

  return (
    <div className="page" style={{ padding: 0 }}>
      {/* ── Header ── */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '14px 20px' }}>
        <div className="flex" style={{ alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div
            className="avatar"
            style={{
              width: 52, height: 52, fontSize: 20, flex: '0 0 auto',
              background: candidate.avatarColor ?? 'var(--accent)',
              color: '#fff',
            }}
          >
            {candidate.initials}
          </div>

          {/* Name + info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex" style={{ alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{name}</span>
              <span
                className="badge"
                style={{
                  background: `color-mix(in oklch, ${stageColor} 15%, var(--surface))`,
                  color: stageColor,
                  height: 22,
                  fontSize: 11,
                }}
              >
                {stageLabel}
              </span>
            </div>
            <div className="faint" style={{ fontSize: 13, marginTop: 3 }}>{title}</div>
          </div>

          {/* Score ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <ScoreRing score={candidate.match} />
            <span
              className="badge"
              style={{
                background: `color-mix(in oklch, ${scoreColor} 14%, var(--surface))`,
                color: scoreColor,
                height: 18,
                fontSize: 10,
              }}
            >
              {scoreTier}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex" style={{ gap: 8, alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={() => setAdvanceModal(true)}>
              <ArrowUp size={15} />{t('c360.advance')}
            </button>
            <button
              className="btn btn-subtle"
              style={{ color: 'var(--danger)' }}
              onClick={() => setRejectModal(true)}
            >
              <XCircle size={15} />{t('c360.reject')}
            </button>
          </div>
        </div>

        {/* Contact row */}
        <div className="flex" style={{ gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
          <span className="flex" style={{ alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)' }}>
            <Mail size={13} style={{ color: 'var(--text-3)' }} />
            <a href={`mailto:${candidate.email}`} style={{ color: 'var(--accent)' }}>{candidate.email}</a>
          </span>
          <span className="flex" style={{ alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)' }}>
            <Phone size={13} style={{ color: 'var(--text-3)' }} />{candidate.phone}
          </span>
          <span className="flex" style={{ alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)' }}>
            <MapPin size={13} style={{ color: 'var(--text-3)' }} />{loc}
          </span>
          <span className="flex" style={{ alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)' }}>
            <Briefcase size={13} style={{ color: 'var(--text-3)' }} />{candidate.exp} yrs exp
          </span>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="ptabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'on' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {t(`c360.${tab}`)}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '20px', maxWidth: 1100 }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
            {/* Left: main content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* AI Summary */}
              <div className="card" style={{ borderInlineStart: '3px solid var(--ai)' }}>
                <div className="card-pad">
                  <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Sparkles size={15} fill="currentColor" style={{ color: 'var(--ai)' }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{t('c360.summary')}</span>
                    <span className="badge badge-ai" style={{ height: 18, fontSize: 10, marginInlineStart: 4 }}>
                      AI
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--text-2)', margin: 0 }}>{summary}</p>
                  <div className="flex" style={{ gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setAdvanceModal(true)}>
                      <ArrowUp size={14} />{t('c360.advance')}
                    </button>
                    <button className="btn btn-subtle btn-sm" style={{ color: 'var(--danger)' }} onClick={() => setRejectModal(true)}>
                      <XCircle size={14} />{t('c360.reject')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Match Breakdown */}
              <div className="card card-pad">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{t('c360.matchBreak')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {factorEntries.map(f => (
                    <FactorBar key={f.key} label={t(f.key)} value={f.value} />
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="card card-pad">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>{t('c360.skills')}</div>
                <div className="flex" style={{ flexWrap: 'wrap', gap: 7 }}>
                  {candidate.skills.map((sk, i) => (
                    <span key={i} className="chip chip-accent">{sk}</span>
                  ))}
                </div>
                {candidate.missingSkills.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div className="flex" style={{ alignItems: 'center', gap: 6, marginBottom: 9 }}>
                      <AlertCircle size={13} style={{ color: 'var(--warning)' }} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--warning)' }}>{t('c360.gaps')}</span>
                    </div>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: 7 }}>
                      {candidate.missingSkills.map((sk, i) => (
                        <span key={i} className="chip" style={{ borderColor: 'color-mix(in oklch, var(--warning) 40%, var(--border))', color: 'var(--warning)' }}>{sk}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Experience & Education */}
              <div className="card card-pad">
                <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Briefcase size={15} style={{ color: 'var(--text-3)' }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{t('c360.experience')}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>
                  {title}
                </div>
                <div className="faint" style={{ fontSize: 12 }}>{candidate.exp} years total experience</div>

                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <BookOpen size={15} style={{ color: 'var(--text-3)' }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{t('c360.education')}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
                    {isAr ? candidate.eduAr : candidate.eduEn}
                  </div>
                </div>
              </div>

              {/* Languages */}
              {langs.length > 0 && (
                <div className="card card-pad">
                  <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Globe size={15} style={{ color: 'var(--text-3)' }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{t('c360.languages')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {langs.map((lang, i) => (
                      <div key={i} className="flex" style={{ alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{isAr ? lang.ar : lang.en}</span>
                        <span className="badge badge-neutral" style={{ height: 18, fontSize: 10 }}>{lang.lvl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {candidate.certs.length > 0 && (
                <div className="card card-pad">
                  <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Award size={15} style={{ color: 'var(--text-3)' }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{t('c360.certs')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {candidate.certs.map((cert, i) => (
                      <div key={i} className="flex" style={{ alignItems: 'center', gap: 8 }}>
                        <CheckCircle size={13} style={{ color: 'var(--success)', flex: '0 0 auto' }} />
                        <span style={{ fontSize: 13 }}>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* AI Match score card */}
              <div className="card card-pad">
                <div className="faint" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 12 }}>
                  <Sparkles size={11} fill="currentColor" style={{ color: 'var(--ai)', verticalAlign: '-1px', marginInlineEnd: 5 }} />
                  {t('common.aiMatch')}
                </div>
                <div className="flex" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <ScoreRing score={candidate.match} size={100} />
                </div>
                <div className="flex" style={{ justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    className="badge"
                    style={{
                      background: `color-mix(in oklch, ${scoreColor} 14%, var(--surface))`,
                      color: scoreColor,
                      height: 22,
                    }}
                  >
                    {scoreTier} {t('common.match')}
                  </span>
                </div>
                <div className="faint" style={{ fontSize: 11.5, textAlign: 'center', marginTop: 8 }}>
                  {candidate.percentile}th percentile
                </div>

                {/* Assessment + Video scores */}
                {(candidate.assess > 0 || candidate.video > 0) && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {candidate.assess > 0 && (
                      <div className="flex" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
                        <span className="faint">Assessment</span>
                        <span className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{candidate.assess}</span>
                      </div>
                    )}
                    {candidate.video > 0 && (
                      <div className="flex" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
                        <span className="faint">Video Interview</span>
                        <span className="mono" style={{ fontWeight: 700, color: 'var(--ai)' }}>{candidate.video}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick info */}
              <div className="card card-pad">
                <div className="faint" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 12 }}>
                  {t('c360.contact')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="flex" style={{ alignItems: 'center', gap: 9, fontSize: 13 }}>
                    <Mail size={14} style={{ color: 'var(--text-3)', flex: '0 0 auto' }} />
                    <a href={`mailto:${candidate.email}`} style={{ color: 'var(--accent)', wordBreak: 'break-all' }}>{candidate.email}</a>
                  </div>
                  <div className="flex" style={{ alignItems: 'center', gap: 9, fontSize: 13 }}>
                    <Phone size={14} style={{ color: 'var(--text-3)', flex: '0 0 auto' }} />{candidate.phone}
                  </div>
                  <div className="flex" style={{ alignItems: 'center', gap: 9, fontSize: 13 }}>
                    <MapPin size={14} style={{ color: 'var(--text-3)', flex: '0 0 auto' }} />{loc}
                  </div>
                  <div className="flex" style={{ alignItems: 'center', gap: 9, fontSize: 13 }}>
                    <Globe size={14} style={{ color: 'var(--text-3)', flex: '0 0 auto' }} />
                    {langs.map(l => isAr ? l.ar : l.en).join(', ') || '—'}
                  </div>
                  <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-3)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Source</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>{isAr ? candidate.sourceAr : candidate.sourceEn}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Applied</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>{candidate.applied} {t('common.days')} ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280, flexDirection: 'column', gap: 10 }}>
            <Sparkles size={28} style={{ color: 'var(--ai)', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-2)' }}>
              {t(`c360.${activeTab}`)}
            </div>
            <div className="faint" style={{ fontSize: 13 }}>Content for this tab is in progress</div>
          </div>
        )}
      </div>

      {/* ── Advance Modal ── */}
      {advanceModal && (
        <div className="scrim" onClick={() => setAdvanceModal(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3 style={{ fontSize: 15 }}>{t('c360.advance')}</h3>
              <div style={{ flex: 1 }} />
              <button className="icon-btn btn-sm" onClick={() => setAdvanceModal(false)}>
                <XCircle size={17} />
              </button>
            </div>
            <div className="modal-body" style={{ color: 'var(--text-2)', fontSize: 13.5 }}>
              Advance <strong>{name}</strong> to the next stage? An automated email invitation will be sent.
            </div>
            <div className="modal-foot">
              <div style={{ flex: 1 }} />
              <button className="btn btn-subtle" onClick={() => setAdvanceModal(false)}>{t('common.cancel')}</button>
              <button className="btn btn-primary" onClick={() => setAdvanceModal(false)}>
                <CheckCircle size={15} />Confirm advance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectModal && (
        <div className="scrim" onClick={() => setRejectModal(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3 style={{ fontSize: 15 }}>{t('c360.reject')}</h3>
              <div style={{ flex: 1 }} />
              <button className="icon-btn btn-sm" onClick={() => setRejectModal(false)}>
                <XCircle size={17} />
              </button>
            </div>
            <div className="modal-body">
              <textarea
                className="textarea"
                placeholder="Optional: Rejection reason for your records…"
                rows={3}
                style={{ width: '100%' }}
              />
            </div>
            <div className="modal-foot">
              <div style={{ flex: 1 }} />
              <button className="btn btn-subtle" onClick={() => setRejectModal(false)}>{t('common.cancel')}</button>
              <button className="btn" style={{ background: 'var(--danger)', borderColor: 'var(--danger)', color: '#fff' }} onClick={() => setRejectModal(false)}>
                Reject candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
