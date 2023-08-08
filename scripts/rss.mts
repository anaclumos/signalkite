import { Story } from 'type.mjs'
import { LOCAL_HEIMDALL, LOCAL_FEEDBACK, LOCAL_REACTIONS } from './default.mjs'
import crypto from 'crypto'

import fs from 'fs'

const escapeAsXml = (str: string) => {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const writeRss = async (stories: Story[], locale: string) => {
  const link = `https://hn.cho.sh${locale !== 'en' ? '/' + locale : ''}/${new Date()
    .toISOString()
    .split('T')[0]
    .replaceAll('-', '/')}`
  const xml = `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="http://hn.cho.sh/rss/${locale}.xml" rel="self" type="application/rss+xml" />
    <title>${LOCAL_HEIMDALL[locale]}</title>
    <link>${link}</link>
    <description>${LOCAL_FEEDBACK[locale]}</description>
    <language>${locale}</language>
    ${stories

      .map(
        (story) => `
    <item>
        <guid isPermaLink="false">${crypto.randomUUID()}</guid>
        <title>${story.title}</title>
        <link>${story.originLink}</link>
        <description>${escapeAsXml(story.originSummary.join(' '))}</description>
        <pubDate>${new Date(story.time * 1000).toUTCString()}</pubDate>
    </item>
    `
      )
      .join('')}
    </channel>
  </rss>
`
  const path = `./static/rss/${locale}.xml`
  if (!fs.existsSync(path)) {
    fs.mkdirSync(`./static/rss`, { recursive: true })
  }
  fs.writeFileSync(path, xml)
}

export const writeAllRss = async (localeStories: Record<string, Story[]>) => {
  for (const locale in localeStories) {
    await writeRss(localeStories[locale], locale)
  }
}
