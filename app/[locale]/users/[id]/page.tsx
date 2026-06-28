'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { users } from '@/lib/mock-data'

const PERMISSION_CATEGORIES = [
  { id: 'jobs', perms: ['View jobs', 'Create jobs', 'Edit jobs', 'Publish jobs'] },
  { id: 'candidates', perms: ['View candidates', 'Add candidates', 'Edit candidates', 'Move pipeline stages'] },
  { id: 'interviews', perms: ['Conduct interviews', 'Schedule interviews', 'Submit scorecard', 'View recordings'] },
  { id: 'offers', perms: ['View offers', 'Create offers', 'Approve offers'] },
]

export default function UserDetailPage() {
  const t = useTranslations()
  const { locale, id } = useParams<{ locale: string; id: string }>()
  const router = useRouter()
  const isAr = locale === 'ar'
  const ChevBack = isAr ? ChevronRight : ChevronLeft

  const user = users.find(u => u.id === id) || users[0]

  return (
    <div className="page">
      <div className="page-head">
        <button className="btn btn-ghost" onClick={() => router.back()}>
          <ChevBack size={16} />{t('common.back')}
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '300px 1fr', alignItems: 'start', gap: 'var(--gap)' }}>
        {/* Left: user card */}
        <div className="card card-pad" style={{ textAlign: 'center' }}>
          <div className="avatar" style={{ width: 72, height: 72, background: user.avatarColor, fontSize: 28, margin: '0 auto 16px' }}>
            {user.initials}
          </div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{isAr ? user.nameAr : user.nameEn}</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>{user.email}</div>
          <div className="flex" style={{ justifyContent: 'center', gap: 6, marginBottom: 20 }}>
            <span className={`badge ${user.status === 'active' ? 'badge-success' : user.status === 'pending' ? 'badge-warning' : 'badge-neutral'}`}>
              {t(`st.${user.status}`)}
            </span>
            <span className="badge badge-accent">{t(`role.${user.role}`)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary">{t('ud.editUser')}</button>
            <button className="btn btn-ghost" style={{ color: 'var(--danger)' }}>{t('ud.suspend')}</button>
          </div>
        </div>

        {/* Right: permissions & activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          {/* Warning */}
          <div className="warn-bar flex" style={{ alignItems: 'flex-start', gap: 10 }}>
            <AlertTriangle size={16} style={{ flex: '0 0 auto', marginTop: 2 }} />
            <span style={{ fontSize: 13 }}>{t('ud.warning')}</span>
          </div>

          {/* Permissions */}
          <div className="card card-pad">
            <h3 style={{ marginBottom: 16 }}>{t('ud.rolePerm')}</h3>
            <div className="flex" style={{ alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 13 }}>{t('ud.currentRole')}</span>
              <span className="badge badge-accent">{t(`role.${user.role}`)}</span>
              <span style={{ flex: 1 }} />
              <button className="btn btn-ghost btn-sm">{t('ud.manageRoles')}</button>
            </div>
            <h4 style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>{t('ud.permsByCat')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PERMISSION_CATEGORIES.map(cat => (
                <div key={cat.id}>
                  <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
                    {t(`cat.${cat.id}`)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {cat.perms.map((perm, i) => (
                      <div key={i} className="flex" style={{ alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', fontSize: 13 }}>
                        <span style={{ flex: 1 }}>{perm}</span>
                        <div className="switch">
                          <input type="checkbox" defaultChecked={i < 2} id={`perm-${cat.id}-${i}`} />
                          <label htmlFor={`perm-${cat.id}-${i}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="card card-pad">
            <h3 style={{ marginBottom: 14 }}>{t('ud.recentActivity')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { en: 'Moved Abdulrahman Al-Saud to AI Interview', ar: 'نقل عبدالرحمن آل سعود إلى مقابلة الذكاء', time: '2h ago' },
                { en: 'Sent offer to Fatima Al-Shamsi', ar: 'أرسل عرضاً لفاطمة الشامسي', time: '1d ago' },
                { en: 'Added note on Senior PM pipeline', ar: 'أضاف ملاحظة على مسار مدير المنتجات أول', time: '2d ago' },
              ].map((act, i) => (
                <div key={i} className="flex" style={{ gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flex: '0 0 auto', marginTop: 6 }} />
                  <span style={{ flex: 1 }}>{isAr ? act.ar : act.en}</span>
                  <span className="mono faint" style={{ fontSize: 11 }}>{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
