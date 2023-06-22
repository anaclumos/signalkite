import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { navigate, routes } from '@redwoodjs/router'

import { allowedLocalesList } from 'src/i18n'

export const useLocaleRedirect = ({ locale }) => {
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(locale)
    window.localStorage.setItem('locale', locale)
    navigate(routes.home({ locale: locale }))
  }, [locale, i18n])
  if (!locale || !allowedLocalesList.includes(locale)) {
    const navlang =
      window.localStorage.getItem('locale') ??
      window.location.pathname.split('/')[-1] ??
      navigator.language?.split('-')[0]
    const redirectLocale = allowedLocalesList.includes(navlang) ? navlang : 'en'
    locale = redirectLocale
  }
}
