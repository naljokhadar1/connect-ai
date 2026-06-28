'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard, Briefcase, GitBranch, Users, BarChart2,
  Phone, Video, Gift, Shield, Workflow, Mail,
  PanelLeftClose, PanelLeftOpen, Sparkles,
} from 'lucide-react'

const NAV = [
  {
    section: 'nav.main',
    items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
    ],
  },
  {
    section: 'nav.hiring',
    items: [
      { id: 'jobs', icon: Briefcase, label: 'nav.jobs', badge: '8' },
      { id: 'pipeline', icon: GitBranch, label: 'nav.pipeline', badge: '64' },
      { id: 'assessments', icon: BarChart2, label: 'nav.assessments' },
      { id: 'interviews', icon: Video, label: 'nav.interviews' },
      { id: 'screening', icon: Phone, label: 'nav.screening' },
      { id: 'offers', icon: Gift, label: 'nav.offers', badge: '5', soon: true },
    ],
  },
  {
    section: 'nav.admin',
    items: [
      { id: 'users', icon: Users, label: 'nav.users', badge: '47' },
      { id: 'roles', icon: Shield, label: 'nav.roles' },
      { id: 'workflows', icon: Workflow, label: 'nav.workflows' },
      { id: 'templates', icon: Mail, label: 'nav.templates' },
    ],
  },
]

interface Props {
  locale: 'en' | 'ar'
  collapsed: boolean
  setCollapsed: (fn: (c: boolean) => boolean) => void
  pathname: string
}

export default function Sidebar({ locale, collapsed, setCollapsed, pathname }: Props) {
  const t = useTranslations()

  function isActive(id: string) {
    return pathname.includes(`/${id}`)
  }

  return (
    <aside className={'sidebar' + (collapsed ? ' collapsed' : '')}>
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={19} fill="currentColor" />
        </div>
        <div className="brand-name">Connect <b>AI</b></div>
      </div>

      <nav className="nav">
        {NAV.map((grp) => (
          <div key={grp.section}>
            <div className="nav-section-label">{t(grp.section)}</div>
            {grp.items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  href={`/${locale}/${item.id}`}
                  className={'nav-item' + (isActive(item.id) ? ' active' : '')}
                  title={t(item.label)}
                >
                  <span className="nav-ico"><Icon size={19} /></span>
                  <span className="nav-label">{t(item.label)}</span>
                  {item.soon && (
                    <span className="nav-badge" style={{ background: 'var(--ai-soft)', color: 'var(--ai)', textTransform: 'uppercase', fontSize: 9.5, letterSpacing: '.04em' }}>
                      {locale === 'ar' ? 'قريباً' : 'Soon'}
                    </span>
                  )}
                  {item.badge && !item.soon && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="side-foot">
        <button
          className="nav-item"
          style={{ marginBottom: 4 }}
          onClick={() => setCollapsed(c => !c)}
          title="Toggle"
        >
          <span className="nav-ico">
            {collapsed
              ? <PanelLeftOpen size={19} />
              : <PanelLeftClose size={19} />
            }
          </span>
          <span className="nav-label">{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>

        <div className="side-user">
          <div className="avatar" style={{ width: 36, height: 36, background: 'oklch(0.6 0.15 300)', fontSize: 14 }}>
            {locale === 'ar' ? 'ل' : 'L'}
          </div>
          <div className="side-foot-text">
            <div className="nm">{locale === 'ar' ? 'ليلى الفايز' : 'Layla Al-Fayez'}</div>
            <div className="rl">{t('user.role')}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
