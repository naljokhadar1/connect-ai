'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Plus, Save, Mail, GripVertical } from 'lucide-react'

const SAMPLE_STAGES = [
  { id: 's1', nameEn: 'Applied', nameAr: 'تقدّم', type: 'applied', color: 'var(--text-3)', count: 18, email: null, optional: false },
  { id: 's2', nameEn: 'CV Review', nameAr: 'مراجعة السيرة', type: 'screening', color: 'var(--info)', count: 11, email: 'Application Received', optional: false },
  { id: 's3', nameEn: 'Phone Screen', nameAr: 'مكالمة هاتفية', type: 'screening', color: 'var(--info)', count: 7, email: 'Screening Call Invitation', optional: false },
  { id: 's4', nameEn: 'Interview', nameAr: 'مقابلة', type: 'interview', color: 'var(--accent)', count: 4, email: 'Interview Confirmation', optional: false },
  { id: 's5', nameEn: 'Final Interview', nameAr: 'المقابلة النهائية', type: 'interview', color: 'var(--accent)', count: 2, email: null, optional: false },
  { id: 's6', nameEn: 'Offer', nameAr: 'العرض', type: 'offer', color: 'var(--warning)', count: 1, email: 'Offer Letter', optional: false },
  { id: 's7', nameEn: 'Hired', nameAr: 'تم التوظيف', type: 'hired', color: 'var(--success)', count: 0, email: null, optional: false, terminal: 'success' },
  { id: 's8', nameEn: 'Rejected', nameAr: 'مرفوض', type: 'rejected', color: 'var(--text-3)', count: 0, email: null, optional: false, terminal: 'exit' },
]

export default function WorkflowEditorPage() {
  const t = useTranslations()
  const { locale, id } = useParams<{ locale: string; id: string }>()
  const router = useRouter()
  const isAr = locale === 'ar'
  const ChevBack = isAr ? ChevronRight : ChevronLeft

  return (
    <div className="page">
      <div className="page-head">
        <button className="btn btn-ghost" onClick={() => router.back()}>
          <ChevBack size={16} />{t('common.back')}
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{t('wf.savedNow')}</span>
        <button className="btn btn-primary">
          <Save size={16} />{t('wf.save')}
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
        {/* Canvas */}
        <div className="card" style={{ minHeight: 500 }}>
          <div className="card-head">
            <h3>{t('wf.title')}</h3>
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary btn-sm">
              <Plus size={14} />{t('wf.addStage')}
            </button>
          </div>

          {/* Legend */}
          <div className="flex" style={{ gap: 16, padding: '8px 20px', borderBottom: '1px solid var(--border)', fontSize: 11.5, color: 'var(--text-2)' }}>
            <span className="flex" style={{ gap: 5, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, border: '2px solid var(--accent)' }} />{t('wf.legendRequired')}
            </span>
            <span className="flex" style={{ gap: 5, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, border: '2px dashed var(--text-3)' }} />{t('wf.legendOptional')}
            </span>
            <span className="flex" style={{ gap: 5, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--success)' }} />{t('wf.legendSuccess')}
            </span>
            <span className="flex" style={{ gap: 5, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--text-3)' }} />{t('wf.legendExit')}
            </span>
          </div>

          {/* Stages */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SAMPLE_STAGES.map((stage, i) => (
              <div key={stage.id}>
                <div
                  className="flex"
                  style={{
                    alignItems: 'center', gap: 12, padding: '12px 16px',
                    background: 'var(--surface-2)', borderRadius: 'var(--r-md)',
                    border: stage.terminal ? `1px solid ${stage.terminal === 'success' ? 'var(--success)' : 'var(--border)'}` : `1px solid ${stage.color}22`,
                    cursor: 'grab',
                  }}
                >
                  <GripVertical size={16} style={{ color: 'var(--text-3)' }} />
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: stage.color, flex: '0 0 auto' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{isAr ? stage.nameAr : stage.nameEn}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{stage.type} · {stage.count} {t('wf.candidatesUnit')}</div>
                  </div>
                  {stage.email && (
                    <span className="flex" style={{ gap: 4, fontSize: 12, color: 'var(--text-2)', alignItems: 'center' }}>
                      <Mail size={12} />{stage.email}
                    </span>
                  )}
                  {!stage.email && !stage.terminal && (
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{t('wf.noEmail')}</span>
                  )}
                </div>
                {i < SAMPLE_STAGES.length - 1 && (
                  <div style={{ height: 8, width: 2, background: 'var(--border)', margin: '0 auto' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div className="card card-pad">
          <h3 style={{ marginBottom: 16 }}>{isAr ? 'إعدادات المرحلة' : 'Stage Settings'}</h3>
          <div className="ptabs" style={{ marginBottom: 16 }}>
            <button className="active">{t('wf.tabBasics')}</button>
            <button>{t('wf.tabEmail')}</button>
            <button>{t('wf.tabRules')}</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label>{t('wf.stageName')}</label>
              <input className="input" defaultValue={isAr ? 'المقابلة' : 'Interview'} />
              <span className="hint">{t('wf.nameHelper')}</span>
            </div>
            <div className="field">
              <label>{t('wf.canonicalType')}</label>
              <select className="select">
                {['applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'other'].map(ct => (
                  <option key={ct} value={ct}>{t(`ct.${ct}`)}</option>
                ))}
              </select>
              <span className="hint">{t('wf.canonicalHelper')}</span>
            </div>
            <div className="field">
              <label>{t('wf.colorAccent')}</label>
              <div className="flex" style={{ gap: 8, flexWrap: 'wrap' }}>
                {['var(--text-3)', 'var(--info)', 'var(--accent)', 'var(--purple)', 'var(--ai)', 'var(--warning)', 'var(--success)'].map((c, i) => (
                  <button key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: i === 2 ? '2px solid var(--text)' : 'none' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
