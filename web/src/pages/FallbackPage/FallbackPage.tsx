import { useTranslation } from 'react-i18next'

import { useLocaleRedirect } from 'src/hooks/useLocaleRedirect'

const FallbackPage = () => {
  const { i18n } = useTranslation()
  useLocaleRedirect({ locale: i18n.language ?? 'en' })
  return <></>
}

export default FallbackPage
