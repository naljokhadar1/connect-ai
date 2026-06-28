'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import {
  Plus, Mail, CheckCircle2, Workflow, Globe, SlidersHorizontal,
  Search, MoreHorizontal, Pencil, Copy, Send, Archive,
} from 'lucide-react'

const TEMPLATES = [
  { id: 't-app',     starter: true,  cat: 'application', lang: 'EN', status: 'active', nameEn: 'Application Received',          nameAr: 'تم استلام الطلب',           wfCount: 4 },
  { id: 't-screen',  starter: true,  cat: 'screening',   lang: 'EN', status: 'active', nameEn: 'Recruiter Screen Invitation',    nameAr: 'دعوة فرز المسؤول',          wfCount: 3 },
  { id: 't-invite',  starter: true,  cat: 'interview',   lang: 'EN', status: 'active', nameEn: 'Interview Invitation',           nameAr: 'دعوة مقابلة',               wfCount: 5 },
  { id: 't-remind',  starter: true,  cat: 'interview',   lang: 'EN', status: 'active', nameEn: 'Interview Reminder',             nameAr: 'تذكير المقابلة',            wfCount: 2 },
  { id: 't-assess',  starter: true,  cat: 'assessment',  lang: 'EN', status: 'active', nameEn: 'Assessment Invitation',          nameAr: 'دعوة التقييم',              wfCount: 3 },
  { id: 't-rej-pre', starter: true,  cat: 'rejection',   lang: 'EN', status: 'active', nameEn: 'Rejection — Pre-Interview',      nameAr: 'رفض — قبل المقابلة',       wfCount: 2 },
  { id: 't-rej-post',starter: true,  cat: 'rejection',   lang: 'EN', status: 'active', nameEn: 'Rejection — Post-Interview',     nameAr: 'رفض — بعد المقابلة',       wfCount: 3 },
  { id: 't-offer',   starter: true,  cat: 'offer',       lang: 'EN', status: 'active', nameEn: 'Offer Letter',                   nameAr: 'خطاب العرض',                wfCount: 4 },
  { id: 't-welcome', starter: false, cat: 'onboarding',  lang: 'EN', status: 'active', nameEn: 'Welcome Aboard',                 nameAr: 'أهلاً بك في الفريق',        wfCount: 0 },
  { id: 't-ar-invite',starter: false,cat: 'interview',   lang: 'AR', status: 'active', nameEn: 'Interview Invitation (AR)',      nameAr: 'دعوة مقابلة (عربي)',        wfCount: 2 },
  { id: 't-intern',  starter: false, cat: 'application', lang: 'EN', status: 'draft',  nameEn: 'Internship Application Received',nameAr: 'استلام طلب التدريب',        wfCount: 0 },
]

type Template = typeof TEMPLATES[number]

const CAT_CONFIG: Record<string, { badge: string; labelKey: string }> = {
  application: { badge: 'badge-info',    labelKey: 'et.catApplication' },
  screening:   { badge: 'badge-ai',      labelKey: 'et.catScreening'   },
  interview:   { badge: 'badge-accent',  labelKey: 'et.catInterview'   },
  assessment:  { badge: 'badge-warning', labelKey: 'et.catAssessment'  },
  rejection:   { badge: 'badge-neutral', labelKey: 'et.catRejection'   },
  offer:       { badge: 'badge-success', labelKey: 'et.catOffer'       },
  onboarding:  { badge: 'badge-purple',  labelKey: 'et.catOnboarding'  },
  internal:    { badge: 'badge-neutral', labelKey: 'et.catInternal'    },
}

type KebabItem = { icon: JSX.Element; label: string; danger?: boolean; onClick?: () => void }

function KebabMenu({ items }: { items: KebabItem[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        className="icon-btn"
        style={{ width: 28, height: 28 }}
        onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="dropdown" style={{ position: 'absolute', insetInlineEnd: 0, top: 32, zIndex: 40, minWidth: 172 }}>
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

function TemplateCard({ tpl, isAr, t }: { tpl: Template; isAr: boolean; t: ReturnType<typeof useTranslations> }) {
  const cat = CAT_CONFIG[tpl.cat]
  const name = isAr ? tpl.nameAr : tpl.nameEn

  const menuItems: KebabItem[] = [
    { icon: <Pencil size={14} />,  label: isAr ? 'تعديل' : 'Edit' },
    { icon: <Copy size={14} />,    label: isAr ? 'تكرار' : 'Duplicate' },
    { icon: <Send size={14} />,    label: isAr ? 'إرسال تجريبي' : 'Send test' },
    { icon: <Archive size={14} />, label: isAr ? 'أرشفة' : 'Archive', danger: true },
  ]

  return (
    <div className="card tpl-card" style={{ cursor: 'pointer' }}>
      {/* Card top row */}
      <div className="flex" style={{ alignItems: 'center', gap: 8, padding: '13px 14px 0' }}>
        {cat && (
          <span className={'badge ' + cat.badge} style={{ height: 20 }}>
            {t(cat.labelKey as Parameters<typeof t>[0])}
          </span>
        )}
        {tpl.status === 'draft' && (
          <span className="badge badge-neutral" style={{ height: 19 }}>{t('et.statusDraft')}</span>
        )}
        <div style={{ flex: 1 }} />
        {tpl.starter && (
          <span className="badge badge-neutral" style={{ height: 18, fontSize: 10 }}>{t('et.starter')}</span>
        )}
        <KebabMenu items={menuItems} />
      </div>

      {/* Card body */}
      <div style={{ padding: '10px 14px 12px' }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{name}</div>
      </div>

      {/* Card footer */}
      <div className="flex" style={{
        alignItems: 'center', gap: 10,
        padding: '8px 14px', borderTop: '1px solid var(--border)', flexWrap: 'wrap',
      }}>
        <span className="lang-pill">{tpl.lang}</span>
        <span className="faint flex" style={{ alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
          <Workflow size={12} />
          {t('et.usedIn')} {tpl.wfCount} {t('et.wfUnit')}
        </span>
        {tpl.starter && (
          <button
            className="btn btn-subtle btn-sm"
            style={{ marginInlineStart: 'auto', fontSize: 11.5, height: 26, padding: '0 9px' }}
            onClick={e => e.stopPropagation()}
          >
            <Plus size={12} />{t('wf.useTemplate')}
          </button>
        )}
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'

  const [query, setQuery]   = useState('')
  const [catF, setCatF]     = useState('all')
  const [langF, setLangF]   = useState('all')
  const [statusF, setStatusF] = useState('all')

  const filter = (tpl: Template) =>
    (!query || tpl.nameEn.toLowerCase().includes(query.toLowerCase()) || tpl.nameAr.includes(query)) &&
    (catF === 'all'    || tpl.cat    === catF) &&
    (langF === 'all'   || tpl.lang   === langF) &&
    (statusF === 'all' || tpl.status === statusF)

  const starters = TEMPLATES.filter(tpl => tpl.starter  && filter(tpl))
  const customs  = TEMPLATES.filter(tpl => !tpl.starter && filter(tpl))

  const totalCount    = TEMPLATES.length
  const activeCount   = TEMPLATES.filter(tpl => tpl.status === 'active').length
  const linkedCount   = TEMPLATES.filter(tpl => tpl.wfCount > 0).length
  const langCount     = new Set(TEMPLATES.map(tpl => tpl.lang)).size

  const stats = [
    { icon: <Mail size={18} />,         iconColor: 'var(--accent)',  iconBg: 'color-mix(in oklch, var(--accent) 13%, var(--surface))',  value: totalCount,  label: t('et.total')     },
    { icon: <CheckCircle2 size={18} />, iconColor: 'var(--success)', iconBg: 'color-mix(in oklch, var(--success) 13%, var(--surface))', value: activeCount, label: t('et.active')    },
    { icon: <Workflow size={18} />,     iconColor: 'var(--ai)',      iconBg: 'color-mix(in oklch, var(--ai) 13%, var(--surface))',      value: linkedCount, label: t('et.linked')    },
    { icon: <Globe size={18} />,        iconColor: 'var(--warning)', iconBg: 'color-mix(in oklch, var(--warning) 13%, var(--surface))', value: langCount,   label: t('et.languages') },
  ]

  const catOptions = Object.keys(CAT_CONFIG)

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('et.title')}</h1>
          <div className="page-sub">{t('et.sub')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost">
          <SlidersHorizontal size={16} />{t('et.manageVars')}
        </button>
        <button className="btn btn-primary">
          <Plus size={17} />{t('et.new')}
        </button>
      </div>

      {/* Stat row */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-pad flex" style={{ alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 9, flex: '0 0 auto',
              display: 'grid', placeItems: 'center',
              background: s.iconBg, color: s.iconColor,
            }}>
              {s.icon}
            </span>
            <div>
              <div className="mono tnum" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>{s.value}</div>
              <div className="faint" style={{ fontSize: 11.5, fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex" style={{ gap: 10, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="searchbar" style={{ maxWidth: 280, height: 38 }}>
          <Search size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isAr ? 'بحث…' : 'Search…'}
          />
        </div>
        <select
          className="select"
          style={{ width: 'auto', minWidth: 150, height: 38 }}
          value={catF}
          onChange={e => setCatF(e.target.value)}
        >
          <option value="all">{t('et.allCats')}</option>
          {catOptions.map(k => (
            <option key={k} value={k}>{t(CAT_CONFIG[k].labelKey as Parameters<typeof t>[0])}</option>
          ))}
        </select>
        <select
          className="select"
          style={{ width: 'auto', minWidth: 130, height: 38 }}
          value={langF}
          onChange={e => setLangF(e.target.value)}
        >
          <option value="all">{t('et.allLangs')}</option>
          <option value="EN">EN</option>
          <option value="AR">AR</option>
        </select>
        <select
          className="select"
          style={{ width: 'auto', minWidth: 130, height: 38 }}
          value={statusF}
          onChange={e => setStatusF(e.target.value)}
        >
          <option value="all">{t('et.allStatuses')}</option>
          <option value="active">{t('et.statusActive')}</option>
          <option value="draft">{t('et.statusDraft')}</option>
        </select>
      </div>

      {/* Starter templates section */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600 }}>{t('et.starters')}</h2>
        <div className="faint" style={{ fontSize: 13, marginTop: 2 }}>{t('et.startersSub')}</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 34 }}>
        {starters.map(tpl => (
          <TemplateCard key={tpl.id} tpl={tpl} isAr={isAr} t={t} />
        ))}
        {starters.length === 0 && (
          <div className="faint" style={{ fontSize: 13, gridColumn: '1/-1', padding: '20px 0' }}>
            {isAr ? 'لا قوالب تطابق التصفية' : 'No starter templates match the current filters'}
          </div>
        )}
      </div>

      {/* Your templates section */}
      <div className="flex" style={{ alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>{t('et.yours')}</h2>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {customs.map(tpl => (
          <TemplateCard key={tpl.id} tpl={tpl} isAr={isAr} t={t} />
        ))}
        <button className="role-card-new">
          <span style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--surface-3)', display: 'grid', placeItems: 'center',
          }}>
            <Plus size={20} />
          </span>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{t('et.new')}</span>
        </button>
      </div>
    </div>
  )
}
