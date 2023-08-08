import { Story } from 'type.mjs'
import { LOCAL_HEIMDALL, LOCAL_FEEDBACK } from './default.mjs'
import RSS from 'rss'

import { parse } from 'marked'
import fs from 'fs'
import { createContent } from './newsletter.mjs'


const writeStoryRss = async (stories: Story[], locale: string) => {
  const link = `https://hn.cho.sh${locale !== 'en' ? '/' + locale : ''}/${new Date()
    .toISOString()
    .split('T')[0]
    .replaceAll('-', '/')}`
  const rss = new RSS({
    title: LOCAL_HEIMDALL[locale],
    feed_url: `https://hn.cho.sh/rss/story/${locale}.xml`,
    site_url: 'https://hn.cho.sh',
    image_url: 'https://hn.cho.sh/img/android-chrome-512x512.png',
    language: locale,
    pubDate: new Date().toISOString(),
    ttl: '60',
  })

  for (const story of stories) {
    rss.item({
      title: story.title,
      description: parse(
        '- ' + story.originSummary.join('\n- ').replaceAll(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")
      ),
      url: link,
      date: new Date().toISOString(),
    })
  }

  const path = `./static/rss/story/${locale}.xml`
  if (!fs.existsSync(path)) {
    fs.mkdirSync(`./static/rss`, { recursive: true })
  }
  fs.writeFileSync(path, rss.xml({ indent: true }))
}


export const writeNewsletterRss = async (stories: Story[], locale: string) => {
  const rss = new RSS({
    title: LOCAL_HEIMDALL[locale],
    feed_url: `https://hn.cho.sh/rss/newsletter/${locale}.xml`,
    site_url: 'https://hn.cho.sh',
    image_url: 'https://hn.cho.sh/img/android-chrome-512x512.png',
    copyright: '2023 Sunghyun Cho',
    language: locale,
    pubDate: new Date().toISOString(),
    ttl: '60',
  })

  const link = `https://hn.cho.sh${locale !== 'en' ? '/' + locale : ''}/${new Date()
    .toISOString()
    .split('T')[0]
    .replaceAll('-', '/')}`

  rss.item({
    title: new Date().toISOString().split('T')[0].replaceAll('-', '/'),
    url: link,
    description: parse(
      createContent(locale, stories, true).replaceAll(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")
    ),
    date: new Date(),
  })

  const path = `./static/rss/newsletter/${locale}.xml`
  if (!fs.existsSync(path)) {
    fs.mkdirSync(`./static/rss/newsletter`, { recursive: true })
  }

  fs.writeFileSync(path, rss.xml({ indent: true }))
}


export const writeAllRss = async (localeStories: Record<string, Story[]>) => {
  for (const locale in localeStories) {
    await writeStoryRss(localeStories[locale], locale)
  }
  for (const locale in localeStories) {
    await writeNewsletterRss(localeStories[locale], locale)
  }
}
