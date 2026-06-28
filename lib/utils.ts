import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, locale = 'en') {
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function daysAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return '1d'
  return `${days}d`
}
