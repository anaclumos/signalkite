const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  i18n: {
    locales: ['bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh'],
    defaultLocale: 'en'
  }
})
