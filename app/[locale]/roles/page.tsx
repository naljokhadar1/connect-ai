'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Shield, Plus, Users, ChevronRight, ChevronLeft } from 'lucide-react'

const ROLES = [
  { id: 'admin', system: true, members: 3, color: 'var(--accent)', descEn: 'Full platform access including settings and billing.', descAr: 'وصول كامل للمنصة بما في ذلك الإعدادات والفواتير.' },
  { id: 'recruiter', system: true, members: 8, color: 'var(--info)', descEn: 'Manage candidates, post jobs, schedule interviews.', descAr: 'إدارة المرشحين ونشر الوظائف وجدولة المقابلات.' },
  { id: 'hm', system: true, members: 12, color: 'var(--purple)', descEn: 'View pipeline, submit feedback, approve offers.', descAr: 'عرض المسار وإرسال التقييمات واعتماد العروض.' },
  { id: 'interviewer', system: true, members: 19, color: 'var(--ai)', descEn: 'Conduct interviews and submit scorecards.', descAr: 'إجراء المقابلات وإرسال بطاقات التقييم.' },
  { id: 'external', system: true, members: 5, color: 'var(--text-3)', descEn: 'Browse candidates assigned to them.', descAr: 'تصفح المرشحين المسندين إليهم.' },
]

const CATEGORIES = [
  { id: 'jobs', perms: ['View jobs', 'Create jobs', 'Edit jobs', 'Delete jobs', 'Publish jobs'] },
  { id: 'candidates', perms: ['View candidates', 'Add candidates', 'Edit candidates', 'Move pipeline stages', 'Export candidates'] },
  { id: 'interviews', perms: ['Conduct interviews', 'Schedule interviews', 'Submit scorecard', 'View recordings'] },
  { id: 'offers', perms: ['View offers', 'Create offers', 'Approve offers', 'Send offers'] },
]

/* Default permissions per role: true = on */
const ROLE_PERMS: Record<string, Record<string, boolean>> = {
  admin: {
    'View jobs': true, 'Create jobs': true, 'Edit jobs': true, 'Delete jobs': true, 'Publish jobs': true,
    'View candidates': true, 'Add candidates': true, 'Edit candidates': true, 'Move pipeline stages': true, 'Export candidates': true,
    'Conduct interviews': true, 'Schedule interviews': true, 'Submit scorecard': true, 'View recordings': true,
    'View offers': true, 'Create offers': true, 'Approve offers': true, 'Send offers': true,
  },
  recruiter: {
    'View jobs': true, 'Create jobs': true, 'Edit jobs': true, 'Delete jobs': false, 'Publish jobs': true,
    'View candidates': true, 'Add candidates': true, 'Edit candidates': true, 'Move pipeline stages': true, 'Export candidates': true,
    'Conduct interviews': false, 'Schedule interviews': true, 'Submit scorecard': false, 'View recordings': true,
    'View offers': true, 'Create offers': true, 'Approve offers': false, 'Send offers': true,
  },
  hm: {
    'View jobs': true, 'Create jobs': false, 'Edit jobs': false, 'Delete jobs': false, 'Publish jobs': false,
    'View candidates': true, 'Add candidates': false, 'Edit candidates': false, 'Move pipeline stages': false, 'Export candidates': false,
    'Conduct interviews': false, 'Schedule interviews': false, 'Submit scorecard': true, 'View recordings': true,
    'View offers': true, 'Create offers': false, 'Approve offers': true, 'Send offers': false,
  },
  interviewer: {
    'View jobs': true, 'Create jobs': false, 'Edit jobs': false, 'Delete jobs': false, 'Publish jobs': false,
    'View candidates': true, 'Add candidates': false, 'Edit candidates': false, 'Move pipeline stages': false, 'Export candidates': false,
    'Conduct interviews': true, 'Schedule interviews': false, 'Submit scorecard': true, 'View recordings': true,
    'View offers': false, 'Create offers': false, 'Approve offers': false, 'Send offers': false,
  },
  external: {
    'View jobs': false, 'Create jobs': false, 'Edit jobs': false, 'Delete jobs': false, 'Publish jobs': false,
    'View candidates': true, 'Add candidates': false, 'Edit candidates': false, 'Move pipeline stages': false, 'Export candidates': false,
    'Conduct interviews': true, 'Schedule interviews': false, 'Submit scorecard': true, 'View recordings': false,
    'View offers': false, 'Create offers': false, 'Approve offers': false, 'Send offers': false,
  },
}

function PermSwitch({ perm, roleId }: { perm: string; roleId: string }) {
  const [on, setOn] = useState(ROLE_PERMS[roleId]?.[perm] ?? false)
  return (
    <div
      className={`switch${on ? ' on' : ''}`}
      role="switch"
      aria-checked={on}
      onClick={() => setOn(v => !v)}
    />
  )
}

export default function RolesPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const isAr = locale === 'ar'
  const [selected, setSelected] = useState(ROLES[0])
  const Chev = isAr ? ChevronLeft : ChevronRight

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('r.title')}</h1>
          <div className="page-sub">{t('r.sub')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary">
          <Plus size={16} />{t('r.create')}
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '280px 1fr', alignItems: 'start' }}>
        {/* Role list */}
        <div className="card" style={{ padding: 8 }}>
          {ROLES.map(role => (
            <button
              key={role.id}
              className={'nav-item' + (selected.id === role.id ? ' active' : '')}
              style={{ width: '100%', padding: '12px 14px', justifyContent: 'flex-start' }}
              onClick={() => setSelected(role)}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: role.color, flex: '0 0 auto' }} />
              <div style={{ flex: 1, textAlign: 'start' }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t(`role.${role.id}`)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{role.members} {role.members === 1 ? t('r.member') : t('r.members')}</div>
              </div>
              {role.system && <span className="badge badge-neutral" style={{ fontSize: 10 }}>{t('r.system')}</span>}
            </button>
          ))}
        </div>

        {/* Role detail */}
        <div className="card card-pad">
          <div className="flex" style={{ alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `color-mix(in oklch, ${selected.color} 16%, var(--surface))`, color: selected.color, display: 'grid', placeItems: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--fs-xl)' }}>{t(`role.${selected.id}`)}</h2>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{isAr ? selected.descAr : selected.descEn}</div>
            </div>
            <div style={{ flex: 1 }} />
            <div className="flex" style={{ gap: 8 }}>
              <button className="btn btn-ghost btn-sm">
                <Users size={14} />{t('r.manageMembers')}
              </button>
            </div>
          </div>

          {selected.system && (
            <div className="warn-bar" style={{ marginBottom: 20 }}>
              {t('r.systemNote')}
            </div>
          )}

          <h3 style={{ marginBottom: 16 }}>{t('r.permissions')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id}>
                <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>
                  {t(`cat.${cat.id}`)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {cat.perms.map((perm, i) => (
                    <div key={i} className="perm-row flex" style={{ alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)' }}>
                      <span style={{ flex: 1, fontSize: 13 }}>{perm}</span>
                      <PermSwitch key={`${selected.id}-${cat.id}-${i}`} perm={perm} roleId={selected.id} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
