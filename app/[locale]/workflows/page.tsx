'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import {
  Plus, Workflow, Briefcase, CheckCircle2, Eye,
  GitBranch, MoreHorizontal, Pencil, Copy, Star, Archive,
} from 'lucide-react'

const WORKFLOWS = [
  { id: 'standard',   preset: true,  isDefault: true,  jobs: 14, nameEn: 'Standard Hire',               nameAr: 'توظيف قياسي',              descEn: 'Balanced 6-stage process for most roles',                          descAr: 'عملية متوازنة من 6 مراحل لمعظم الوظائف',                         modifiedEn: '—',        modifiedAr: '—',        stageCount: 6 },
  { id: 'technical',  preset: true,  isDefault: false, jobs: 9,  nameEn: 'Technical Hire',               nameAr: 'توظيف تقني',               descEn: 'Includes coding assessment and tech interview',                     descAr: 'يشمل تقييم برمجة ومقابلة تقنية',                                  modifiedEn: '—',        modifiedAr: '—',        stageCount: 8 },
  { id: 'highvolume', preset: true,  isDefault: false, jobs: 6,  nameEn: 'High-Volume / Operational',    nameAr: 'حجم كبير / تشغيلي',        descEn: 'Streamlined for retail, ops, and customer service',                descAr: 'مبسّط للتجزئة والعمليات وخدمة العملاء',                           modifiedEn: '—',        modifiedAr: '—',        stageCount: 4 },
  { id: 'executive',  preset: true,  isDefault: false, jobs: 2,  nameEn: 'Executive Hire',               nameAr: 'توظيف تنفيذي',             descEn: 'Multi-round panel with executive approvals',                       descAr: 'جولات لجان متعددة مع موافقات تنفيذية',                            modifiedEn: '—',        modifiedAr: '—',        stageCount: 9 },
  { id: 'internal',   preset: true,  isDefault: false, jobs: 3,  nameEn: 'Internal Transfer',            nameAr: 'نقل داخلي',                descEn: 'Internal mobility process with current manager approval',           descAr: 'عملية تنقّل داخلي مع موافقة المدير الحالي',                       modifiedEn: '—',        modifiedAr: '—',        stageCount: 5 },
  { id: 'eng-senior', preset: false, isDefault: false, jobs: 4,  nameEn: 'Engineering — Senior',         nameAr: 'الهندسة — أول',            descEn: 'Full senior engineering loop with optional technical assessment',   descAr: 'حلقة هندسية كاملة للأقدمين مع تقييم تقني اختياري',               modifiedEn: '2 days ago', modifiedAr: 'قبل يومين', stageCount: 7 },
  { id: 'eng-junior', preset: false, isDefault: false, jobs: 3,  nameEn: 'Engineering — Junior',         nameAr: 'الهندسة — مبتدئ',          descEn: 'Entry-level engineering with coding test',                         descAr: 'هندسة لمستوى المبتدئين مع اختبار برمجي',                          modifiedEn: '1 week ago', modifiedAr: 'قبل أسبوع', stageCount: 6 },
  { id: 'sales-ae',   preset: false, isDefault: false, jobs: 2,  nameEn: 'Sales — Account Executive',    nameAr: 'المبيعات — مدير حسابات',   descEn: 'AE hiring with a live role-play exercise',                         descAr: 'توظيف مدير حسابات مع تمرين تمثيل أدوار',                          modifiedEn: '3 days ago', modifiedAr: 'قبل 3 أيام', stageCount: 5 },
  { id: 'internship', preset: false, isDefault: false, jobs: 1,  nameEn: 'Internship Program 2026',      nameAr: 'برنامج التدريب 2026',      descEn: 'Lightweight process for the summer cohort',                        descAr: 'عملية خفيفة لدفعة الصيف',                                         modifiedEn: 'yesterday',  modifiedAr: 'أمس',      stageCount: 4 },
]

type Workflow = typeof WORKFLOWS[number]

type KebabItem = { icon: JSX.Element; label: string; danger?: boolean; onClick?: () => void }

function KebabMenu({ items }: { items: KebabItem[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        className="icon-btn"
        style={{ width: 30, height: 30 }}
        onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="dropdown" style={{ position: 'absolute', insetInlineEnd: 0, top: 34, zIndex: 40, minWidth: 172 }}>
          {items.map((item, i) => (
            <button
              key={i}
              className={'dropdown-item' + (item.danger ? ' danger' : '')}
              style={{ color: item.danger ? 'var(--danger)' : undefined }}
              onClick={e => { e.stopPropagation(); setOpen(false); item.onClick?.() }}
            >
              <span style={{ color: item.danger ? 'var(--danger)' : 'var(--text-2)' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PresetCard({ w, isAr, t }: { w: Workflow; isAr: boolean; t: ReturnType<typeof useTranslations> }) {
  const name = isAr ? w.nameAr : w.nameEn
  const desc = isAr ? w.descAr : w.descEn

  return (
    <div className="card card-pad role-card" style={{ position: 'relative', cursor: 'default' }}>
      <span
        className="badge badge-neutral"
        style={{ position: 'absolute', top: 14, insetInlineEnd: 14, height: 19, fontSize: 10.5 }}
      >
        {t('wf.preset')}
      </span>

      <div className="flex" style={{ alignItems: 'center', gap: 9, paddingInlineEnd: 56 }}>
        <span style={{
          width: 34, height: 34, borderRadius: 9, flex: '0 0 auto',
          display: 'grid', placeItems: 'center',
          background: 'var(--accent-soft)', color: 'var(--accent-strong)',
        }}>
          <Workflow size={17} />
        </span>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{name}</h3>
      </div>

      <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, minHeight: 38 }}>{desc}</div>

      <div className="flex" style={{ alignItems: 'center', gap: 14, fontSize: 12.5 }}>
        <span className="faint flex" style={{ alignItems: 'center', gap: 5 }}>
          <GitBranch size={14} />{w.stageCount} {t('wf.stagesUnit')}
        </span>
        <span className="faint flex" style={{ alignItems: 'center', gap: 5 }}>
          <Briefcase size={14} />{t('wf.usedBy')} {w.jobs} {t('wf.jobsUnit')}
        </span>
        {w.isDefault && (
          <span className="badge badge-accent" style={{ height: 20 }}>{t('wf.defaultBadge')}</span>
        )}
      </div>

      <hr className="divider" />

      <div className="flex" style={{ gap: 8 }}>
        <button className="btn btn-subtle btn-sm">
          <Plus size={14} />{t('wf.useTemplate')}
        </button>
        <button className="btn btn-ghost btn-sm">
          <Eye size={14} />{t('wf.preview')}
        </button>
      </div>
    </div>
  )
}

function CustomCard({ w, isAr, t }: { w: Workflow; isAr: boolean; t: ReturnType<typeof useTranslations> }) {
  const name = isAr ? w.nameAr : w.nameEn
  const desc = isAr ? w.descAr : w.descEn
  const modified = isAr ? w.modifiedAr : w.modifiedEn

  const menuItems: KebabItem[] = [
    { icon: <Pencil size={14} />,  label: t('wf.edit') },
    { icon: <Copy size={14} />,    label: t('wf.duplicate') },
    { icon: <Star size={14} />,    label: t('wf.setDefault') },
    { icon: <Archive size={14} />, label: t('wf.archive'), danger: true },
  ]

  return (
    <div className="card card-pad role-card" style={{ cursor: 'default' }}>
      <div className="flex" style={{ alignItems: 'flex-start', gap: 9 }}>
        <span style={{
          width: 34, height: 34, borderRadius: 9, flex: '0 0 auto',
          display: 'grid', placeItems: 'center',
          background: 'var(--surface-3)', color: 'var(--text-2)',
        }}>
          <Workflow size={17} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>{name}</h3>
          <div className="muted" style={{
            fontSize: 12.5, lineHeight: 1.45, marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {desc}
          </div>
        </div>
        <KebabMenu items={menuItems} />
      </div>

      <hr className="divider" />

      <div className="flex" style={{ alignItems: 'center', gap: 14, fontSize: 12 }}>
        <span className="faint flex" style={{ alignItems: 'center', gap: 5 }}>
          <GitBranch size={13} />{w.stageCount} {t('wf.stagesUnit')}
        </span>
        <span className="faint flex" style={{ alignItems: 'center', gap: 5 }}>
          <Briefcase size={13} />{w.jobs} {w.jobs === 1 ? t('wf.jobsUnit') : t('wf.jobsUnit')}
        </span>
        <div style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 11.5 }}>
          {t('wf.modified')} {modified}
        </span>
      </div>
    </div>
  )
}

export default function WorkflowsPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'

  const presets = WORKFLOWS.filter(w => w.preset)
  const custom  = WORKFLOWS.filter(w => !w.preset)

  const totalCount  = WORKFLOWS.length
  const activeJobs  = WORKFLOWS.reduce((sum, w) => sum + w.jobs, 0)
  const defaultWf   = WORKFLOWS.find(w => w.isDefault)
  const defaultName = defaultWf ? (isAr ? defaultWf.nameAr : defaultWf.nameEn) : '—'

  const stats = [
    {
      icon: <Workflow size={19} />,
      iconBg: 'color-mix(in oklch, var(--accent) 13%, var(--surface))',
      iconColor: 'var(--accent)',
      value: totalCount,
      label: t('wf.total'),
      mono: true,
    },
    {
      icon: <Briefcase size={19} />,
      iconBg: 'color-mix(in oklch, var(--info) 13%, var(--surface))',
      iconColor: 'var(--info)',
      value: activeJobs,
      label: t('wf.activeJobs'),
      mono: true,
    },
    {
      icon: <CheckCircle2 size={19} />,
      iconBg: 'color-mix(in oklch, var(--success) 13%, var(--surface))',
      iconColor: 'var(--success)',
      value: defaultName,
      label: t('wf.defaultWf'),
      mono: false,
    },
  ]

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('wf.title')}</h1>
          <div className="page-sub">{t('wf.sub')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary">
          <Plus size={17} />{t('wf.new')}
        </button>
      </div>

      {/* Stat row */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 26 }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-pad flex" style={{ alignItems: 'center', gap: 13 }}>
            <span style={{
              width: 38, height: 38, borderRadius: 10, flex: '0 0 auto',
              display: 'grid', placeItems: 'center',
              background: s.iconBg, color: s.iconColor,
            }}>
              {s.icon}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                className={s.mono ? 'mono tnum' : ''}
                style={{ fontSize: s.mono ? 24 : 16, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap' }}
              >
                {s.value}
              </div>
              <div className="faint" style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Presets section */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600 }}>{t('wf.presets')}</h2>
        <div className="faint" style={{ fontSize: 13, marginTop: 2 }}>{t('wf.presetsSub')}</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 34 }}>
        {presets.map(w => (
          <PresetCard key={w.id} w={w} isAr={isAr} t={t} />
        ))}
      </div>

      {/* Your workflows section */}
      <div className="flex" style={{ alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>{t('wf.yourWorkflows')}</h2>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {custom.map(w => (
          <CustomCard key={w.id} w={w} isAr={isAr} t={t} />
        ))}
        <button className="role-card-new">
          <span style={{
            width: 42, height: 42, borderRadius: 11,
            background: 'var(--surface-3)', display: 'grid', placeItems: 'center',
          }}>
            <Plus size={20} />
          </span>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{t('wf.new')}</span>
        </button>
      </div>
    </div>
  )
}
