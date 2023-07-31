// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')
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

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Heimdall',
  tagline: 'Hacker News in All Languages',
  favicon: 'img/favicon.ico',
  url: 'https://hn.cho.sh',
  baseUrl: '/',
  organizationName: 'anaclumos', // Usually your GitHub org/user name.
  projectName: 'heimdall', // Usually your repo name.
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
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/anaclumos/heimdall/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'hn.cho.sh',
        logo: {
          alt: 'hn.cho.sh Logo',
          src: 'img/android-chrome-512x512.png',
        },
        items: [
          {
            label: 'Archive',
            to: getMostRecentNewsLink(),
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
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
