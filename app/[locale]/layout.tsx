import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { locales } from '@/lib/i18n'
import AppShell from '@/components/shell/AppShell'

export const dynamic = 'force-dynamic'

interface Props {
  children: React.ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as 'en' | 'ar')) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} data-theme="light">
      <head />
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppShell locale={locale as 'en' | 'ar'}>
            {children}
          </AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
