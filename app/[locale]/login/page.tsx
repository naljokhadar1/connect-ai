'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const isAr = locale === 'ar'
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    // Simulate auth — in production this calls signIn('credentials', ...)
    await new Promise(r => setTimeout(r, 800))
    const email = fd.get('email') as string
    if (email && email.includes('@')) {
      router.push(`/${locale}/dashboard`)
    } else {
      setError(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            <Sparkles size={24} style={{ color: '#fff' }} fill="currentColor" />
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em' }}>Connect AI</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
            {isAr ? 'منصة التوظيف الذكية' : 'Intelligent Recruitment Platform'}
          </div>
        </div>

        <div className="card card-pad">
          <h2 style={{ marginBottom: 4, fontSize: 'var(--fs-xl)' }}>
            {isAr ? 'تسجيل الدخول' : 'Sign in'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>
            {isAr ? 'أدخل بيانات حسابك للمتابعة' : 'Enter your credentials to continue'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
              <input
                className="input"
                name="email"
                type="email"
                placeholder={isAr ? 'you@company.com' : 'you@company.com'}
                defaultValue="l.alfayez@connect.ai"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ margin: 0 }}>{isAr ? 'كلمة المرور' : 'Password'}</label>
                <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: 12 }}>
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue="demo1234"
                  autoComplete="current-password"
                  required
                  style={{ paddingInlineEnd: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute', insetInlineEnd: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4,
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 13, color: 'var(--danger)', background: 'color-mix(in oklch, var(--danger) 10%, var(--surface))', padding: '8px 12px', borderRadius: 'var(--r-sm)' }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 4, justifyContent: 'center' }}>
              {loading ? (isAr ? 'جارٍ الدخول…' : 'Signing in…') : (isAr ? 'دخول' : 'Sign in')}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-3)' }}>
          {isAr ? 'تجريبي — لا حاجة لكلمة مرور حقيقية' : 'Demo mode — any email with @ will work'}
        </div>

        {/* Locale switcher */}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push(`/${locale === 'ar' ? 'en' : 'ar'}/login`)}
            style={{ fontSize: 12 }}
          >
            {locale === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </div>
    </div>
  )
}
