'use client'

import { useTranslations } from 'next-intl'
import { Search, Moon, Sun, Bell, Sparkles } from 'lucide-react'

interface Props {
  locale: 'en' | 'ar'
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onSwitchLocale: (locale: 'en' | 'ar') => void
}

export default function Topbar({ locale, theme, onToggleTheme, onSwitchLocale }: Props) {
  const t = useTranslations()

  return (
    <header className="topbar">
      <div className="searchbar">
        <Search size={17} />
        <input placeholder={t('search.placeholder')} />
        <span className="ai-pill">
          <Sparkles size={11} fill="currentColor" /> {t('search.ai')}
        </span>
      </div>
      <div style={{ flex: 1 }} />

      <div className="seg" role="group" aria-label="language">
        <button
          className={locale === 'en' ? 'on' : ''}
          onClick={() => onSwitchLocale('en')}
        >
          EN
        </button>
        <button
          className={locale === 'ar' ? 'on' : ''}
          onClick={() => onSwitchLocale('ar')}
          style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
        >
          ع
        </button>
      </div>

      <button
        className="icon-btn has-tip"
        data-tip={theme === 'light' ? t('tw.dark') : t('tw.light')}
        onClick={onToggleTheme}
      >
        {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
      </button>

      <button className="icon-btn">
        <Bell size={19} />
        <span className="dot" />
      </button>
    </header>
  )
}
