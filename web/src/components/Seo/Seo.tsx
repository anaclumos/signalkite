import { useTranslation } from 'react-i18next'

import { Head } from '@redwoodjs/web'

import { allowedLocalesList } from 'src/i18n'

const Seo = () => {
  const { i18n } = useTranslation()

  return (
    <Head>
      <html lang={i18n.language} />
      {allowedLocalesList.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`https://heimdall.cho.sh/?locale=${locale}`}
        />
      ))}
    </Head>
  )
}

export default Seo
