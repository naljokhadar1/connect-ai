'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { departments, employmentTypes, grades, locations } from '@/lib/mock-data'

const STEPS = ['cj.step1', 'cj.step2', 'cj.step3', 'cj.step4'] as const

export default function NewJobPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const isAr = locale === 'ar'
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)

  const Chev = isAr ? ChevronLeft : ChevronRight
  const ChevBack = isAr ? ChevronRight : ChevronLeft

  function simulateGenerate() {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2000)
  }

  return (
    <div className="page" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="page-head">
        <button className="btn btn-ghost" onClick={() => router.back()}>
          <ChevBack size={16} />{t('common.back')}
        </button>
        <div style={{ flex: 1 }} />
        <h1 className="page-title" style={{ margin: 0 }}>{t('cj.title')}</h1>
      </div>

      {/* Step indicator */}
      <div className="flex" style={{ gap: 0, marginBottom: 32, background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: 4 }}>
        {STEPS.map((sk, i) => (
          <button
            key={i}
            className={i === step ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setStep(i)}
          >
            <span style={{ opacity: 0.5, marginInlineEnd: 6 }}>{i + 1}</span>{t(sk)}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="field">
            <label>{t('cj.jobTitle')}</label>
            <input className="input" placeholder={isAr ? 'مسمى وظيفي...' : 'e.g. Senior Product Manager'} />
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>{t('cj.dept')}</label>
              <select className="select">
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t('cj.location')}</label>
              <select className="select">
                {locations.map((l, i) => (
                  <option key={i} value={l.en}>{isAr ? l.ar : l.en}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t('cj.type')}</label>
              <select className="select">
                {employmentTypes.map((et, i) => (
                  <option key={i} value={et.en}>{isAr ? et.ar : et.en}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t('cj.grade')}</label>
              <select className="select">
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{t('cj.salary')}</label>
              <input className="input" placeholder="e.g. 28,000 – 36,000" />
            </div>
            <div className="field">
              <label>{t('cj.openings')}</label>
              <input className="input" type="number" defaultValue={1} min={1} />
            </div>
          </div>
          <div className="field">
            <label>{t('cj.manager')}</label>
            <input className="input" placeholder={isAr ? 'اسم مدير التوظيف' : 'Hiring manager name'} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--ai-soft)', border: '1px solid color-mix(in oklch, var(--ai) 30%, transparent)' }}>
            <div className="flex" style={{ gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <Sparkles size={15} style={{ color: 'var(--ai)' }} fill="currentColor" />
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ai)' }}>{t('common.poweredAi')}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>{t('cj.aiDescHint')}</p>
            <button className="btn btn-sm" style={{ marginTop: 10, color: 'var(--ai)', background: 'color-mix(in oklch, var(--ai) 12%, transparent)' }} onClick={simulateGenerate}>
              <Sparkles size={13} />
              {generating ? t('common.generating') : t('common.aiGenerate')}
            </button>
          </div>
          <div className="field">
            <label>{t('cj.descLabel')}</label>
            <textarea className="textarea" rows={6} placeholder={isAr ? 'وصف الوظيفة...' : 'Job description...'} />
          </div>
          <div className="field">
            <label>{t('cj.respLabel')}</label>
            <textarea className="textarea" rows={5} placeholder={isAr ? 'المسؤوليات الرئيسية...' : 'Key responsibilities...'} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="field">
            <label>{t('cj.skillsLabel')}</label>
            <input className="input" placeholder={isAr ? 'أضف مهارة واضغط Enter' : 'Add a skill and press Enter'} />
            <div className="flex" style={{ flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {['Product Strategy', 'Roadmapping', 'SQL', 'Stakeholder Management'].map(s => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
          <div className="field">
            <label>{t('cj.interviewQ')}</label>
            <textarea className="textarea" rows={4} placeholder={isAr ? 'أسئلة المقابلة...' : 'Interview questions...'} />
          </div>
          <div className="field">
            <label>{t('cj.assessmentQ')}</label>
            <textarea className="textarea" rows={4} placeholder={isAr ? 'أسئلة التقييم...' : 'Assessment questions...'} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card card-pad">
          <h3 style={{ marginBottom: 16 }}>{t('cj.step4')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--text-2)' }}>
            <div className="flex" style={{ gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, minWidth: 140 }}>{t('cj.jobTitle')}</span>
              <span>Senior Product Manager</span>
            </div>
            <div className="flex" style={{ gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, minWidth: 140 }}>{t('cj.dept')}</span>
              <span>{isAr ? 'المنتجات' : 'Product'}</span>
            </div>
            <div className="flex" style={{ gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, minWidth: 140 }}>{t('cj.location')}</span>
              <span>{isAr ? 'الرياض' : 'Riyadh'}</span>
            </div>
            <div className="flex" style={{ gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, minWidth: 140 }}>{t('cj.grade')}</span>
              <span>M3</span>
            </div>
            <div className="flex" style={{ gap: 16, padding: '12px 0' }}>
              <span style={{ fontWeight: 600, minWidth: 140 }}>{t('cj.openings')}</span>
              <span>2</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex" style={{ justifyContent: 'space-between', marginTop: 24 }}>
        <button className="btn btn-ghost" onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}>
          <ChevBack size={16} />{t('common.back')}
        </button>
        {step < 3 ? (
          <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>
            {t('common.next')}<Chev size={16} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => router.push(`/${locale}/jobs`)}>
            <Sparkles size={16} fill="currentColor" />{t('cj.publish')}
          </button>
        )}
      </div>
    </div>
  )
}
