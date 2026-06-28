'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { UserPlus, Search, Users, CheckCircle, Clock, Ban } from 'lucide-react'
import { users } from '@/lib/mock-data'

/* ── Role badge variant map ── */
const ROLE_BADGE: Record<string, string> = {
  admin: 'badge-accent',
  recruiter: 'badge-info',
  hm: 'badge-purple',
  interviewer: 'badge-ai',
  external: 'badge-neutral',
}

/* ── Status badge variant map ── */
const STATUS_BADGE: Record<string, string> = {
  active: 'badge-success',
  pending: 'badge-warning',
  suspended: 'badge-neutral',
}

/* ── Role label i18n keys ── */
const ROLE_KEY: Record<string, string> = {
  admin: 'role.admin',
  recruiter: 'role.recruiter',
  hm: 'role.hm',
  interviewer: 'role.interviewer',
  external: 'role.external',
}

/* ── Status label i18n keys ── */
const STATUS_KEY: Record<string, string> = {
  active: 'st.active',
  pending: 'st.pending',
  suspended: 'st.suspended',
}

/* ── Stats derived from real users data ── */
function deriveStats(allUsers: typeof users) {
  return {
    total: allUsers.length,
    active: allUsers.filter(u => u.status === 'active').length,
    pending: allUsers.filter(u => u.status === 'pending').length,
    suspended: allUsers.filter(u => u.status === 'suspended').length,
  }
}

export default function UsersPage() {
  const t = useTranslations()
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const isAr = locale === 'ar'

  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const stats = deriveStats(users)

  const filtered = users.filter(u => {
    const nameField = isAr ? u.nameAr : u.nameEn
    const matchesQuery =
      !query ||
      nameField?.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesQuery && matchesRole && matchesStatus
  })

  const statCards = [
    { label: t('u.total'), value: stats.total, icon: Users, color: 'var(--accent)' },
    { label: t('u.active'), value: stats.active, icon: CheckCircle, color: 'var(--success)' },
    { label: t('u.pending'), value: stats.pending, icon: Clock, color: 'var(--warning)' },
    { label: t('u.suspended'), value: stats.suspended, icon: Ban, color: 'var(--text-3)' },
  ]

  return (
    <div className="page">
      {/* ── Page header ── */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('u.title')}</h1>
          <div className="page-sub">{t('u.sub')}</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary">
          <UserPlus size={17} />{t('u.invite')}
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--gap)' }}>
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="card card-pad flex" style={{ alignItems: 'center', gap: 13 }}>
              <span
                style={{
                  width: 38, height: 38, borderRadius: 10, flex: '0 0 auto',
                  display: 'grid', placeItems: 'center',
                  background: `color-mix(in oklch, ${s.color} 13%, var(--surface))`,
                  color: s.color,
                }}
              >
                <Icon size={19} />
              </span>
              <div>
                <div className="mono tnum" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>{s.value}</div>
                <div className="faint" style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Filter bar ── */}
      <div className="flex" style={{ gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="searchbar" style={{ maxWidth: 300, height: 38 }}>
          <Search size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`${t('common.search')}…`}
          />
        </div>

        <select
          className="select"
          style={{ width: 'auto', minWidth: 150, height: 38 }}
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="all">{t('u.allRoles')}</option>
          <option value="admin">{t('role.admin')}</option>
          <option value="recruiter">{t('role.recruiter')}</option>
          <option value="hm">{t('role.hm')}</option>
          <option value="interviewer">{t('role.interviewer')}</option>
          <option value="external">{t('role.external')}</option>
        </select>

        <select
          className="select"
          style={{ width: 'auto', minWidth: 150, height: 38 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">{t('u.allStatuses')}</option>
          <option value="active">{t('st.active')}</option>
          <option value="pending">{t('st.pending')}</option>
          <option value="suspended">{t('st.suspended')}</option>
        </select>

        <div style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 13 }}>
          {filtered.length} {isAr ? 'مستخدم' : 'users'}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="card" style={{ overflow: 'visible' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>{t('u.col.user')}</th>
              <th>{t('u.col.role')}</th>
              <th>{t('u.col.jobs')}</th>
              <th>{t('u.col.status')}</th>
              <th>{t('u.col.lastActive')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const displayName = isAr ? u.nameAr : u.nameEn
              const lastActive = isAr ? u.lastActiveAr : u.lastActiveEn
              const roleBadge = ROLE_BADGE[u.role] ?? 'badge-neutral'
              const statusBadge = STATUS_BADGE[u.status] ?? 'badge-neutral'

              const avatarInitials = isAr
                ? u.initials
                : u.nameEn.split(' ').slice(0, 2).map((w: string) => w[0]).join('')

              return (
                <tr
                  key={u.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/${locale}/users/${u.id}`)}
                >
                  {/* User */}
                  <td>
                    <div className="flex" style={{ alignItems: 'center', gap: 11 }}>
                      <div
                        className="avatar"
                        style={{
                          width: 38, height: 38,
                          background: u.avatarColor ?? 'var(--accent)',
                          color: '#fff',
                          fontSize: 14,
                          flex: '0 0 auto',
                        }}
                      >
                        {avatarInitials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{displayName}</div>
                        <div className="faint" style={{ fontSize: 12 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td>
                    <span className={`badge ${roleBadge}`} style={{ height: 22, fontSize: 11.5 }}>
                      {t(ROLE_KEY[u.role] ?? 'role.external')}
                    </span>
                  </td>

                  {/* Jobs */}
                  <td>
                    <span
                      className="mono"
                      style={{
                        fontWeight: 600,
                        color: u.jobCount ? 'var(--accent)' : 'var(--text-3)',
                        fontSize: 13,
                      }}
                    >
                      {u.jobCount} {t('u.jobsUnit')}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`badge ${statusBadge}`} style={{ height: 22, fontSize: 11.5 }}>
                      {t(STATUS_KEY[u.status] ?? 'st.active')}
                    </span>
                  </td>

                  {/* Last active */}
                  <td>
                    <span className="faint" style={{ fontSize: 12.5 }}>{lastActive}</span>
                  </td>
                </tr>
              )
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13 }}>
                  No users match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
