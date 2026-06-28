'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

type Theme = 'light' | 'dark'
type Density = 'comfortable' | 'compact'

interface Props {
  children: React.ReactNode
  locale: 'en' | 'ar'
}

export default function AppShell({ children, locale }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [density, setDensity] = useState<Density>('comfortable')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) setTheme(stored)
    const storedDensity = localStorage.getItem('density') as Density | null
    if (storedDensity) setDensity(storedDensity)
    const storedCollapsed = localStorage.getItem('collapsed')
    if (storedCollapsed) setCollapsed(storedCollapsed === 'true')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density)
    localStorage.setItem('density', density)
  }, [density])

  useEffect(() => {
    localStorage.setItem('collapsed', String(collapsed))
  }, [collapsed])

  function switchLocale(next: 'en' | 'ar') {
    const segments = pathname.split('/')
    segments[1] = next
    const newPath = segments.join('/')
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    router.push(newPath)
  }

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="app">
      <Sidebar
        locale={locale}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        pathname={pathname}
      />
      <div className="main-col">
        <Topbar
          locale={locale}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSwitchLocale={switchLocale}
        />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  )
}
