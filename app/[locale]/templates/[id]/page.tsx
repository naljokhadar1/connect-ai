'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Save, Sparkles, Send, Eye } from 'lucide-react'

const SAMPLE_TEMPLATE = {
  nameEn: 'Interview Invitation',
  nameAr: 'دعوة مقابلة',
  cat: 'interview',
  subject: 'Interview invitation for {{job.title}} at {{company.name}}',
  body: `Hi {{candidate.first_name}},

Thanks for your application for the {{job.title}} role on our {{job.department}} team. We've reviewed your background and would love to invite you to an interview.

Your interview is scheduled with {{interviewer.name}} on {{interview.date}} at {{interview.time}}.

📎 Please use this link to join: {{interview.link}}

If you need to reschedule, you can pick a new time here: {{scheduling_link}}

Looking forward to speaking with you.

Best,
{{recruiter.name}}
{{company.name}} Talent Team`,
}

export default function TemplateEditorPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
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
        <div className="flex" style={{ gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{t('ed.allSaved')}</span>
          <button className="btn btn-ghost btn-sm"><Eye size={14} />{t('et.preview')}</button>
          <button className="btn btn-ghost btn-sm"><Send size={14} />{t('et.sendTest')}</button>
          <button className="btn btn-primary btn-sm"><Save size={14} />{t('common.save')}</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
        {/* Editor */}
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="field">
            <label>{isAr ? 'اسم القالب' : 'Template name'}</label>
            <input className="input" defaultValue={isAr ? SAMPLE_TEMPLATE.nameAr : SAMPLE_TEMPLATE.nameEn} />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>{t('ed.from')}</label>
              <input className="input" defaultValue="Layla Al-Fayez <hiring@connect.ai>" />
            </div>
            <div className="field">
              <label>{t('ed.replyTo')}</label>
              <input className="input" defaultValue="noreply@connect.ai" />
              <span className="hint">{t('ed.replyHelper')}</span>
            </div>
          </div>

          <div className="field">
            <label>{t('ed.subject')}</label>
            <div className="flex" style={{ gap: 8 }}>
              <input className="input" style={{ flex: 1 }} defaultValue={SAMPLE_TEMPLATE.subject} />
              <button className="btn btn-ghost btn-sm">{t('ed.insertVar')}</button>
            </div>
          </div>

          {/* AI suggestions */}
          <div style={{ padding: 12, borderRadius: 'var(--r-md)', background: 'var(--ai-soft)', border: '1px solid color-mix(in oklch, var(--ai) 25%, transparent)' }}>
            <div className="flex" style={{ gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <Sparkles size={14} style={{ color: 'var(--ai)' }} fill="currentColor" />
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ai)' }}>{t('ed.aiSuggest')}</span>
            </div>
            <div className="flex" style={{ gap: 6, flexWrap: 'wrap' }}>
              {[t('ed.improvetone'), t('ed.suggestSubj')].map((act, i) => (
                <button key={i} className="btn btn-sm" style={{ color: 'var(--ai)', background: 'color-mix(in oklch, var(--ai) 10%, transparent)' }}>
                  {act}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>{t('ed.body')}</label>
            <button className="btn btn-ghost btn-sm" style={{ marginBottom: 6 }}>{t('ed.insertVar')}</button>
            <textarea className="textarea" rows={14} defaultValue={SAMPLE_TEMPLATE.body} />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{t('ed.attachments')}</div>
            <div style={{ padding: 12, borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', fontSize: 13, color: 'var(--text-2)' }}>
              {t('ed.noAttach')}
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}>{t('ed.addAttach')}</button>
          </div>
        </div>

        {/* Right panel: variables & linkages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          {/* Variables status */}
          <div className="card card-pad">
            <h4 style={{ marginBottom: 12 }}>{t('ed.insertVar')}</h4>
            <div className="flex" style={{ alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--r-sm)', background: 'color-mix(in oklch, var(--success) 10%, var(--surface-2))', marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--success)' }}>{t('ed.allResolved')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['candidate.first_name', 'job.title', 'job.department', 'interviewer.name', 'interview.date', 'interview.time', 'interview.link', 'scheduling_link', 'recruiter.name', 'company.name'].map(v => (
                <div key={v} className="flex" style={{ alignItems: 'center', gap: 8, padding: '4px 8px', fontSize: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', flex: '0 0 auto' }} />
                  <code style={{ fontSize: 11, color: 'var(--ai)', background: 'var(--ai-soft)', padding: '1px 5px', borderRadius: 3 }}>{'{{' + v + '}}'}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow linkages */}
          <div className="card card-pad">
            <h4 style={{ marginBottom: 12 }}>{t('ed.usedInWf')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {['Standard Hire → Phone Screen', 'Engineering — Senior → Recruiter Screen'].map((link, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', fontSize: 12.5 }}>
                  <div style={{ fontWeight: 600 }}>{link}</div>
                  <div className="flex" style={{ gap: 6, marginTop: 4 }}>
                    <span className="badge badge-success" style={{ fontSize: 10 }}>{t('ed.autoSendPill')}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm">{t('ed.linkWf')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
