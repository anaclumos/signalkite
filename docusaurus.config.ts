// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const fs = require('fs')
const path = require('path')

const getMostRecentNewsLink = () => {
  const today = new Date()
  today.setDate(today.getDate() + 2)
  let file = ''
  while ((file = today.toISOString().split('T')[0])) {
    const filePath = path.join(__dirname, 'docs', `${file.replaceAll('-', '/')}.md`)
    if (fs.existsSync(filePath)) {
      return `/${file.replaceAll('-', '/')}`
    }
    today.setDate(today.getDate() - 1)
  }
}

const reverseProcessor = (items) => {
  // Reverse child items of categories
  const result = items.map((item) => {
    if (item.type === 'category') {
      return { ...item, items: reverseProcessor(item.items) }
    }
    return item
  })
  result.reverse()
  return result
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Heimdall',
  tagline: 'Hacker News in All Languages',
  titleDelimiter: '•',
  favicon: 'img/favicon.ico',
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#5596ec',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'og:image',
        content: 'https://hn.cho.sh/img/og.png',
      },
    },
  ],
  url: 'https://hn.cho.sh',
  baseUrl: '/',
  organizationName: 'anaclumos',
  projectName: 'heimdall',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: true,
  i18n: {
    defaultLocale: 'en',
    locales: [
      'ar',
      'bn',
      'cs',
      'da',
      'de',
      'el',
      'en',
      'es',
      'fi',
      'fr',
      'he',
      'hi',
      'hu',
      'id',
      'it',
      'ja',
      'ko',
      'nl',
      'nb',
      'pl',
      'pt',
      'ro',
      'ru',
      'sk',
      'sv',
      'ta',
      'th',
      'tr',
      'zh-Hans',
      'zh-Hant',
    ],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: '/',
          async sidebarItemsGenerator({
            isCategoryIndex: defaultCategoryIndexMatcher,
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator({
              isCategoryIndex() {
                return false
              },
              ...args,
            })
            return reverseProcessor(sidebarItems)
          },
          editUrl: ({ locale, docPath }) => {
            const isEnglish = locale === 'en'
            const baseDir = isEnglish ? '' : `i18n/${locale}/docusaurus-plugin-content-docs/`
            return `https://github.com/anaclumos/heimdall/blob/main/${baseDir}/current/${docPath}`
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      image: 'img/og.png',
      algolia: {
        appId: '1NHQP43IBE',
        apiKey: '6c908ff8d0b4e4f607ac4f79339e72a4',
        indexName: 'hn-cho',
        contextualSearch: true,
        searchParameters: {},
        searchPagePath: 'search',
        debug: false,
      },
      navbar: {
        title: 'Heimdall',
        logo: {
          alt: 'Heimdall Logo',
          src: 'img/android-chrome-512x512.png',
        },
        items: [
          {
            label: 'Subscribe',
            to: '/subscribe',
          },
          {
            label: 'Archive',
            to: getMostRecentNewsLink(),
          },
          {
            label: 'Free Starbucks ☕',
            href: 'https://go.cho.sh/hn-cho-sh-bring-a-friend',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },

          {
            href: 'https://github.com/anaclumos/heimdall',
            position: 'right',
            className: 'navbar-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 2,
      },
    },
  scripts: [
    {
      src: 'https://sa.cho.sh/latest.js',
      async: true,
      defer: true,
      'data-collect-dnt': 'true',
    },
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: getMostRecentNewsLink(),
            from: ['/today/'],
          },
        ],
      },
    ],
  ],
}

module.exports = config
