import fs from 'fs'

import { updateHN } from './update.mjs'
import { collect } from './collect.mjs'
import { Story } from './type.mjs'
import { summarize } from './summarize.mjs'
import { LinguineList } from './linguine.mjs'
import { retryTranslation, translate } from './translate.mjs'
import { createHnContent, scheduleHnNewsletter } from './newsletter.mjs'
import { log, sanitize } from './util.mjs'
import { writeAllRss } from './rss.mjs'

const MAX_RETRIES = 3

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

  // stories = await Promise.all(
  //   stories.map(async (s) => {
  //     return summarize(s)
  //   })
  // )

  // this is to throttle the requests
  for (let i = 0; i < stories.length; i++) {
    stories[i] = await summarize(stories[i])
  }

  // Ensure that the title and summary are sanitized
  stories = stories.map((s) => {
    return {
      ...s,
      title: sanitize(s.title),
      originSummary: s.originSummary.map((s) => sanitize(s)),
      commentSummary: s.commentSummary.map((s) => sanitize(s)),
    }
  })

  // locale -> Stories map
  const localeStories: Record<string, Story[]> = {}
  stories = stories.filter((s) => s?.title?.length > 0)
  if (stories.length === 0) {
    log(`❌ Error\tAll Stories are Empty`, 'error')
    return
  }

  log(`🤟 Translating\t${LinguineList.join(', ')}`, 'info')

  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    log(`🤟 Translating\t${locale}`, 'info')
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
        return {
          ...s,
          title: (await retryTranslation(translate, { payload: [s.title], source: 'en', locale }, MAX_RETRIES))[0],
          originSummary: await retryTranslation(
            translate,
            { payload: s.originSummary, source: 'en', locale },
            MAX_RETRIES
          ),
          commentSummary: await retryTranslation(
            translate,
            { payload: s.commentSummary, source: 'en', locale },
            MAX_RETRIES
          ),
          originBody: '',
          commentBody: '',
        }
      })
    )
  }

  // Ensure that the title and summary are sanitized
  stories = stories.map((s) => {
    return {
      ...s,
      title: sanitize(s.title),
      originSummary: s.originSummary.map((s) => sanitize(s)),
      commentSummary: s.commentSummary.map((s) => sanitize(s)),
    }
  })

  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    fs.writeFileSync(`./records/${day}/${day}.${locale}.json`, JSON.stringify(localeStories[locale], null, 2) + '\n')
  }

  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    if (locale === 'en') {
      fs.mkdirSync(`./docs/${day.replaceAll('-', '/')}`, { recursive: true })
      fs.writeFileSync(
        `./docs/${day.replaceAll('-', '/')}.md`,
        createHnContent(locale, localeStories[locale], false, new Date(day.replace(/-/g, '/').replace(/T.+/, '')))
      )
    } else {
      fs.mkdirSync(`./i18n/${locale}/docusaurus-plugin-content-docs/current/${day.replaceAll('-', '/')}`, {
        recursive: true,
      })
      fs.writeFileSync(
        `./i18n/${locale}/docusaurus-plugin-content-docs/current/${day.replaceAll('-', '/')}.md`,
        createHnContent(locale, localeStories[locale], false, new Date(day.replace(/-/g, '/').replace(/T.+/, '')))
      )
    }
  }
  await scheduleHnNewsletter(localeStories)
  await writeAllRss()
}

main().then(() => process.exit(0))
