const SITE_URL = 'https://hn.cho.sh'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  sitemapSize: 128,
  alternateRefs: [
    {
      hreflang: 'bg',
      href: `${SITE_URL}/bg`,
    },
    {
      hreflang: 'cs',
      href: `${SITE_URL}/cs`,
    },
    {
      hreflang: 'da',
      href: `${SITE_URL}/da`,
    },
    {
      hreflang: 'de',
      href: `${SITE_URL}/de`,
    },
    {
      hreflang: 'el',
      href: `${SITE_URL}/el`,
    },
    {
      hreflang: 'en',
      href: `${SITE_URL}/`,
    },
    {
      hreflang: 'es',
      href: `${SITE_URL}/es`,
    },
    {
      hreflang: 'et',
      href: `${SITE_URL}/et`,
    },
    {
      hreflang: 'fi',
      href: `${SITE_URL}/fi`,
    },
    {
      hreflang: 'fr',
      href: `${SITE_URL}/fr`,
    },
    {
      hreflang: 'hu',
      href: `${SITE_URL}/hu`,
    },
    {
      hreflang: 'id',
      href: `${SITE_URL}/id`,
    },
    {
      hreflang: 'it',
      href: `${SITE_URL}/it`,
    },
    {
      hreflang: 'ja',
      href: `${SITE_URL}/ja`,
    },
    {
      hreflang: 'ko',
      href: `${SITE_URL}/ko`,
    },
    {
      hreflang: 'lt',
      href: `${SITE_URL}/lt`,
    },
    {
      hreflang: 'lv',
      href: `${SITE_URL}/lv`,
    },
    {
      hreflang: 'nb',
      href: `${SITE_URL}/nb`,
    },
    {
      hreflang: 'nl',
      href: `${SITE_URL}/nl`,
    },
    {
      hreflang: 'pl',
      href: `${SITE_URL}/pl`,
    },
    {
      hreflang: 'pt',
      href: `${SITE_URL}/pt`,
    },
    {
      hreflang: 'ro',
      href: `${SITE_URL}/ro`,
    },
    {
      hreflang: 'ru',
      href: `${SITE_URL}/ru`,
    },
    {
      hreflang: 'sk',
      href: `${SITE_URL}/sk`,
    },
    {
      hreflang: 'sl',
      href: `${SITE_URL}/sl`,
    },
    {
      hreflang: 'sv',
      href: `${SITE_URL}/sv`,
    },
    {
      hreflang: 'tr',
      href: `${SITE_URL}/tr`,
    },
    {
      hreflang: 'uk',
      href: `${SITE_URL}/uk`,
    },
    {
      hreflang: 'zh',
      href: `${SITE_URL}/zh`,
    },
  ],
  transform: async (config, path) => {
    const dotLocaleExtractor = (path) => {
      if (path[path.length - 3] !== '.') {
        return path
      }
      const locale = path.slice(path.length - 2)
      const directory = path.replaceAll(`/${locale}`, '').replaceAll(`.${locale}`, '').replaceAll(SITE_URL, '')
      return `${SITE_URL}/${locale}${directory}`
    }
    path = dotLocaleExtractor(path).replace('/en/', '/')

    const extractLocaleIndependentPath = (path) => {
      const matches = config.alternateRefs.map((alt) => `${config.siteUrl}${path}`.replace(alt.href, ''))
      return matches.sort((a, b) => a.length - b.length)[0]
    }

    let localeIndependentPath = extractLocaleIndependentPath(path)
    const alternateRefs = config.alternateRefs.map((alt) => {
      alt.href = alt.href.replace('/en/', '/')
      return {
        ...alt,
        href: `${alt.href}${localeIndependentPath.replace(SITE_URL, '')}`.replaceAll('/en/', '/'),
        hrefIsAbsolute: true,
      }
    })

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs,
    }
  },
}
