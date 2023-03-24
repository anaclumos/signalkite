import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <strong>hn.cho.sh</strong>,
  project: {
    link: 'https://github.com/anaclumos/hn.cho.sh',
  },
  docsRepositoryBase: 'https://github.com/anaclumos/hn.cho.sh',
  footer: {
    text: <span>
      MIT {new Date().getFullYear()} © <a href="https://cho.sh" target="_blank">Sunghyun Cho</a>.
    </span>,
  },
  i18n: [
    { locale: 'bg', text: "български (bg)" },
    { locale: 'cs', text: "Čeština (cs)" },
    { locale: 'da', text: "Dansk (da)" },
    { locale: 'de', text: "Deutsch (de)" },
    { locale: 'el', text: "Ελληνικά (el)" },
    { locale: 'en', text: "English (en)" },
    { locale: 'es', text: "Espanya (es)" },
    { locale: 'et', text: "Eesti (et)" },
    { locale: 'fi', text: "Suomi (fi)" },
    { locale: 'fr', text: "Français (fr)" },
    { locale: 'hu', text: "Magyar (hu)" },
    { locale: 'id', text: "Bahasa Indonesia (id)" },
    { locale: 'it', text: "Italiano (it)" },
    { locale: 'ja', text: "日本語 (ja)" },
    { locale: 'ko', text: "한국어 (ko)" },
    { locale: 'lt', text: "Lietuvių (lt)" },
    { locale: 'lv', text: "Latviešu (lv)" },
    { locale: 'nl', text: "Nederlands (nl)" },
    { locale: 'no', text: "Norge (no)" },
    { locale: 'pl', text: "Polski (pl)" },
    { locale: 'pt', text: "Português (pt)" },
    { locale: 'ro', text: "Română (ro)" },
    { locale: 'ru', text: "Русский (ru)" },
    { locale: 'sk', text: "Slovenčina (sk)" },
    { locale: 'sl', text: "Slovenščina (sl)" },
    { locale: 'sv', text: "Svenska (sv)" },
    { locale: 'tr', text: "Türkçe (tr)" },
    { locale: 'uk', text: "Українська (uk)" },
    { locale: 'zh', text: "中文 (zh)" },
  ]
}

export default config
