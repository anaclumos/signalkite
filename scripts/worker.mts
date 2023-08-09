import fs from 'fs'

import { updateHN } from './update.mjs'
import { collect } from './collect.mjs'
import { Story } from './type.mjs'
import { summarize } from './summarize.mjs'
import { LinguineList } from './linguine.mjs'
import { translate } from './translate.mjs'
import { createContent, scheduleNewsletter } from './newsletter.mjs'
import { log, sanitize } from './util.mjs'
import { writeAllRss } from './rss.mjs'

const main = async () => {
  let stories: Story[] = await updateHN()

  // const day = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const day = new Date().toISOString().split('T')[0]
  const path = `./records/${day}/${day}.en.json`

  if (!fs.existsSync(path)) {
    fs.mkdirSync(`./records/${day}`, { recursive: true })
  } else {
    stories = JSON.parse(fs.readFileSync(path, 'utf8'))
  }

  // this is to throttle the requests
  for (let i = 0; i < stories.length; i++) {
    if (!stories[i].originBody) {
      stories[i].originBody = await collect(stories[i].originLink)
    } else {
      log(`💘 Body Exists\t${stories[i].title}`, 'info')
      stories[i].originBody = sanitize(stories[i].originBody)
    }
    if (!stories[i].commentBody) {
      stories[i].commentBody = await collect(stories[i].commentLink)
    } else {
      log(`💘 Comm Exists\t${stories[i].commentLink}`, 'info')
      stories[i].commentBody = sanitize(stories[i].commentBody)
    }
  }

  stories = await Promise.all(
    stories.map(async (s) => {
      return summarize(s)
    })
  )

  // locale -> Stories map
  const localeStories: Record<string, Story[]> = {}

  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    if (locale === 'en') {
      localeStories[locale] = stories
      continue
    }
    if (fs.existsSync(`./records/${day}/${day}.${locale}.json`)) {
      log(`💘 Tran Exists\t${locale}`)
      localeStories[locale] = JSON.parse(fs.readFileSync(`./records/${day}/${day}.${locale}.json`, 'utf8'))
      continue
    }
    localeStories[locale] = await Promise.all(
      stories.map(async (s) => {
        const title = await translate([s.title], 'en', locale)
        return {
          ...s,
          title: title[0],
          originSummary: await translate(s.originSummary, 'en', locale),
          commentSummary: await translate(s.commentSummary, 'en', locale),
          originBody: '',
          commentBody: '',
        }
      })
    )
    log(`🤟 Translating\t${locale}`, 'info')
  }

  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    fs.writeFileSync(`./records/${day}/${day}.${locale}.json`, JSON.stringify(localeStories[locale], null, 2) + '\n')
  }

  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    if (locale === 'en') {
      fs.mkdirSync(`./docs/${day.replaceAll('-', '/')}`, { recursive: true })
      fs.writeFileSync(`./docs/${day.replaceAll('-', '/')}.md`, createContent(locale, localeStories[locale]))
    } else {
      fs.mkdirSync(`./i18n/${locale}/docusaurus-plugin-content-docs/current/${day.replaceAll('-', '/')}`, {
        recursive: true,
      })
      fs.writeFileSync(
        `./i18n/${locale}/docusaurus-plugin-content-docs/current/${day.replaceAll('-', '/')}.md`,
        createContent(locale, localeStories[locale])
      )
    }
  }
  await scheduleNewsletter(localeStories)
  await writeAllRss()
}

main().then(() => process.exit(0))
